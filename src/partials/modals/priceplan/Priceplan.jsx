import { useEffect, useState } from "react";
import { Spin } from "antd";
import { toAbsoluteUrl } from "@/utils";
import {
  GetAllPlans,
  AddUserPlan,
  CreatePaymentOrder,
  FetchAllUser,
  GetPlansByBillingCycle,
} from "@/services/apiServices";
import { FormattedMessage } from "react-intl";

import { useAutoTranslation } from "../../../utils/useAutoTranslation";
import PaymentSuccess from "../successmodal/paymentsuccess";
import Swal from "sweetalert2";
import { useLanguage } from "@/i18n";

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid token while parsing JWT:", e);
    return null;
  }
};

const Priceplan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [translatedPlans, setTranslatedPlans] = useState([]);
  const { language } = useLanguage();
  const { translate } = useAutoTranslation(language);

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [underVerification, setUnderVerification] = useState(false);
  const [labels, setLabels] = useState({
    quarterly: "Quarterly",
    annually: "Annually",
  });

  const [activeCycle, setActiveCycle] = useState("Quarterly");
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    transactionId: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  const stored =
    typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
  const token = stored;

  useEffect(() => {
    const loadLabels = async () => {
      setLabels({
        quarterly: await translate("Quarterly"),
        annually: await translate("Annually"),
      });
    };
    loadLabels();
  }, []);

  useEffect(() => {
    const loadLabels = async () => {
      setLabels({
        quarterly: await translate("Quarterly"),
        annually: await translate("Annually"),
      });
    };
    loadLabels();
  }, [language]); // <-- ADD LANGUAGE HERE

  useEffect(() => {
    if (!token) return;
    const decoded = parseJwt(token);
    const idFromToken = decoded?.userId ?? decoded?.userId ?? decoded?.userId;
    if (idFromToken) {
      setUserId(idFromToken);
    } else if (stored?.id) {
      setUserId(stored.id);
    }
  }, [token]);

  useEffect(() => {
    if (!userId) return;
    const fetchUserDetails = async () => {
      try {
        const res = await FetchAllUser(userId);
        const fetched = res?.data?.data?.["User Details"]?.[0] ?? null;
        if (fetched) {
          setUser(fetched);
        } else {
          console.warn("FetchAllUser returned no data:", res);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    if (!activeCycle) return;
    setTranslatedPlans([]);
    fetchPlans();
  }, [activeCycle, language]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await GetPlansByBillingCycle(activeCycle);
      const result = res?.data?.data?.["Plan Details"] || [];

      const langPlans = await Promise.all(
        result.map(async (p) => ({
          ...p,

          originalName: p.name, // keep English
          name: await translate(p.name),

          originalDescription: p.description,
          description: await translate(p.description),

          originalBillingCycle: p.billingCycle,
          billingCycle: await translate(p.billingCycle),

          features: await Promise.all(
            p.features?.map(async (f) => ({
              ...f,
              originalFeatureText: f.featureText,
              featureText: await translate(f.featureText),
            }))
          ),
        }))
      );

      setTranslatedPlans(langPlans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setTranslatedPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const orderedPlans = (() => {
    if (!translatedPlans.length) return [];

    const popular = translatedPlans.filter((p) => p.isPopular);
    const others = translatedPlans.filter((p) => !p.isPopular);

    if (popular.length === 0) return translatedPlans;

    if (others.length === 2) {
      return [others[0], popular[0], others[1]];
    }

    return [...others, ...popular];
  })();

  const handlePayment = async (plan) => {
    console.log("Selected Plan:", plan);
    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "User not loaded",
        text: "Please wait while we fetch your details.",
      });
      return;
    }

    try {
      const orderPayload = {
        planId: plan.id,
        userId: userId,
        amount: plan.price,
        currency: "INR",
      };

      const res = await CreatePaymentOrder(orderPayload);
      const backendOrder = res.data?.data;
      const orderId =
        typeof backendOrder === "string"
          ? backendOrder
          : backendOrder?.orderId || backendOrder?.paymentorderid;

      if (!orderId) {
        Swal.fire({
          icon: "error",
          title: "Order Creation Failed",
          text: "Could not create Razorpay order. Please try again.",
        });
        return;
      }

      const razorpayKey = "rzp_live_RfdMpWMxxgESGK";

      const options = {
        key: razorpayKey,
        amount: plan.price * 100,
        currency: "INR",
        name: "Automate Business",
        description: `${plan.name} Plan Purchase`,
        order_id: orderId,
        handler: async function (response) {
          const paymentPayload = {
            planId: plan.id,
            userId: userId,
            paymentData: {
              payid: response.razorpay_payment_id,
              paymentdone: true,
              paymentorderid: response.razorpay_order_id,
              paysignature: response.razorpay_signature,
            },
          };

          try {
            await AddUserPlan(paymentPayload);

            setPaymentData({
              amount: plan.price,
              transactionId: response.razorpay_payment_id,
            });
            setUnderVerification(true);
            setModalOpen(true);

            FetchAllUser(userId)
              .then((refresh) => {
                const refreshedUser =
                  refresh?.data?.data ?? refresh?.data ?? null;
                if (refreshedUser) setUser(refreshedUser);
              })
              .catch((err) =>
                console.warn("Could not refresh user after payment:", err)
              );
          } catch (err) {
            Swal.fire({
              icon: "error",
              title: "Activation Failed",
              text:
                err.response?.data?.message ||
                "Payment completed but failed to activate plan.",
            });
          }
        },
        prefill: {
          name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
          email: user?.email ?? stored?.email ?? "test@example.com",
          contact: user?.contactNo ?? user?.contactNo ?? "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text:
            response.error?.description ||
            "Something went wrong. Please try again.",
        });
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: "Something went wrong while initiating payment. Please try again.",
      });
    }
  };

  const userHasPlan = !!user?.plan;

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-10">
        {underVerification && user && !user.isApprove && (
          <div className="relative bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-6 rounded-b-xl overflow-hidden">
            <div className="flex items-start gap-3 relative ">
              <p className="sm:text-base">
                Your profile is under verification. Please wait until admin
                approves it. Meanwhile, feel free to explore our other plans and
                log out if you wish.
              </p>
            </div>
          </div>
        )}

        <h2 className="text-3xl mt-4 md:text-4xl font-semibold text-[#170F49]">
          <FormattedMessage
            id="USER.MASTER.RAW_MATERIAL_TYPE"
            defaultMessage="   Plans & Pricing"
          />
        </h2>
        <p className="text-[#6F6C8F] mt-3 max-w-xl mx-auto text-base leading-relaxed">
          Whether your time-saving automation needs are large or small, we're
          here to help you scale.
        </p>

        <div className="flex justify-center mt-8">
          <div className="flex bg-[#F4F4FF] rounded-full p-1">
            {[
              { key: "Quarterly", label: labels.quarterly },
              { key: "Annually", label: labels.annually },
            ].map((cycle) => (
              <button
                key={cycle.key}
                onClick={() => setActiveCycle(cycle.key)}
                className={`px-6 py-2 text-sm rounded-full font-medium transition-all ${
                  activeCycle === cycle.key
                    ? "bg-[#005BA8] text-white"
                    : "text-[#6F6C8F] hover:bg-blue-50"
                }`}
              >
                {cycle.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div
          key={language}
          className={`grid gap-8 md:gap-6 items-stretch ${
            orderedPlans.filter((plan) => plan.id !== 5).length === 1
              ? "grid-cols-1 max-w-lg mx-auto"
              : orderedPlans.filter((plan) => plan.id !== 5).length === 2
                ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                : "grid-cols-1 md:grid-cols-3"
          }`}
        >
          {orderedPlans
            .filter((plan) => plan.id !== 5)
            .map((plan) => {
              const isPopular = plan.isPopular;
              const disabledBecauseSamePlan = user?.plan?.id === plan.id;
              const isSinglePlan =
                orderedPlans.filter((p) => p.id !== 5).length === 1;
              const isHighlighted = isPopular || isSinglePlan;

              return (
                <div key={`${plan.id}-${language}`} className="relative group">
                  {/* Glow effect behind card */}
                  {isHighlighted && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#005BA8] to-[#4A3AFF] rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                  )}

                  <div
                    className={`relative flex flex-col h-full rounded-3xl border-2 transition-all duration-300 bg-white p-8 md:p-10 ${
                      isHighlighted
                        ? "border-[#005BA8] shadow-[0_20px_60px_rgba(0,91,168,0.15)] group-hover:shadow-[0_25px_70px_rgba(0,91,168,0.2)]"
                        : "border-[#E6E6F0] shadow-sm hover:shadow-xl hover:border-[#005BA8]/30"
                    }`}
                  >
                    {/* Badge - Only show for isPopular plans */}
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="bg-gradient-to-r from-[#005BA8] to-[#4A3AFF] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Plan Icon */}
                    <div
                      className={`flex justify-center mb-6 ${isHighlighted ? "mt-2" : ""}`}
                    >
                      <div
                        className={`rounded-2xl p-4 ${
                          isHighlighted
                            ? "bg-gradient-to-br from-[#005BA8]/10 to-[#4A3AFF]/10"
                            : "bg-[#F4F4FF]"
                        }`}
                      >
                        <img
                          src={toAbsoluteUrl(
                            `/media/price/${plan.originalName.toLowerCase()}.png`
                          )}
                          alt={plan.name}
                          className={`${isHighlighted ? "h-14 w-14" : "h-12 w-12"} object-contain`}
                        />
                      </div>
                    </div>

                    {/* Plan Name & Description */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-[#170F49] mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-[#6F6C8F] leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center">
                        <span className="text-lg font-medium text-[#6F6C8F]">
                          ₹
                        </span>
                        <span className="text-5xl font-bold text-[#170F49] mx-1">
                          {plan.price.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-sm text-[#A0A3BD]">
                        /{plan.billingCycle}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-[#E6E6F0] to-transparent mb-8" />

                    {/* Features */}
                    <ul className="text-[#6F6C8F] text-sm space-y-4 mb-8 flex-grow">
                      {plan.features?.map((f, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span
                            className={`flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 mt-0.5 ${
                              isHighlighted
                                ? "bg-gradient-to-r from-[#005BA8] to-[#4A3AFF] text-white"
                                : "border-2 border-[#4A3AFF] text-[#4A3AFF]"
                            }`}
                          >
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                          <span className="text-[#4A4A68]">
                            {f.featureText}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => handlePayment(plan)}
                      disabled={!userId || disabledBecauseSamePlan}
                      className={`w-full py-3.5 rounded-xl font-semibold text-base transition-all duration-300 ${
                        isHighlighted
                          ? "bg-gradient-to-r from-[#005BA8] to-[#4A3AFF] text-white shadow-lg shadow-[#005BA8]/25 hover:shadow-xl hover:shadow-[#005BA8]/30 hover:scale-[1.02]"
                          : "border-2 border-[#D9DBE9] text-[#170F49] hover:border-[#005BA8] hover:bg-[#F9FAFF]"
                      } ${!userId || disabledBecauseSamePlan ? "opacity-60 cursor-not-allowed hover:scale-100" : ""}`}
                    >
                      {disabledBecauseSamePlan ? "Current Plan" : "Choose Plan"}
                    </button>

                    {/* Trust text */}
                    {isHighlighted && (
                      <p className="text-center text-xs text-[#A0A3BD] mt-4 flex items-center justify-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Secure payment • Cancel anytime
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          <PaymentSuccess
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            amount={paymentData.amount}
            transactionId={paymentData.transactionId}
            approve={user?.isApprove}
          />
        </div>
      )}
    </div>
  );
};

export default Priceplan;
