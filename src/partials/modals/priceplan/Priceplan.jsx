import { useEffect, useState } from "react";
import { Spin } from "antd";
import { Check } from "lucide-react";

// Import your actual API services
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
import ThemeModal from "./ThemeModal";

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

// PaymentSuccess component will be imported from your actual component

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
  const [customTheme, setCustomTheme] = useState(true);
  const [couponCode, setCouponCode] = useState("");

  const stored =
    typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
  const token = stored;
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    if (!token) return;
    const decoded = parseJwt(token);
    console.log(decoded);

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
  }, [language]);

  useEffect(() => {
    if (!token) return;
    const decoded = parseJwt(token);
    console.log(decoded);

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
      const res = await GetAllPlans();
      const result = res?.data?.data?.["Plan Details"] || [];

      // Translate all plan data
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

  useEffect(() => {
    if (!translatedPlans.length) return;

    // Prefer popular plan, fallback to first plan
    const defaultPlan =
      translatedPlans.find((p) => p.isPopular) || translatedPlans[0];

    setSelectedPlan(defaultPlan);
  }, [translatedPlans]);

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

      const razorpayKey = "rzp_live_RnS3PAVZPas6yI";

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

  // All features list for left sidebar
  const displayedFeatures = selectedPlan?.features || [];

  const planPrice = translatedPlans.find((p) => p.isPopular)?.price || 24000;
  const customThemePrice = 6000;

  const finalTotal = planPrice + (customTheme ? customThemePrice : 0);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Right Plan
          </h1>
          <p className="text-gray-600">
            Select from the best plans, ensuring a perfect match for your
            catering business
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Features */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Features Included
              </h3>
              <ul className="space-y-3">
                {displayedFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">
                      {feature.featureText}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Content - Plans & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <Spin size="large" />
              </div>
            ) : (
              <>
                {/* Plans Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {orderedPlans
                    .filter((plan) => plan.id !== 5)
                    .map((plan) => {
                      const isPopular = plan.isPopular;
                      const disabledBecauseSamePlan =
                        user?.plan?.id === plan.id;

                      return (
                        <div key={plan.id} className="relative">
                          {/* Best choice badge */}
                          {isPopular && (
                            <div className="w-auto absolute -top-3 left-3/4 -translate-x-1/7 z-10">
                              <div className="bg-white text-gray-900 text-xs px-3 py-2 rounded-full font-medium shadow-md border border-gray-400">
                                Best choice
                              </div>
                            </div>
                          )}

                          <div
                            className={`relative rounded-2xl p-8 cursor-pointer ${
                              isPopular
                                ? "bg-[#005BA8] text-white"
                                : "bg-white text-gray-900 border border-gray-200"
                            } ${selectedPlan?.id === plan.id ? "ring-4 ring-blue-400" : ""}`}
                            onClick={() => handlePlanSelect(plan)}
                          >
                            <h3 className="text-base font-semibold mb-4">
                              {plan.billingCycle} Plan
                            </h3>

                            {/* Original Price (strikethrough) */}

                            <div
                              className={`text-3xl font-bold mb-1 ${isPopular ? "text-white" : "text-gray-900"} line-through`}
                            >
                              {(plan.billingCycle === "Quarterly"
                                ? 35000
                                : 45000
                              ).toLocaleString("en-IN")}
                            </div>

                            {/* Discounted Price */}
                            <div className="text-6xl font-bold mb-2">
                              ₹{plan.price.toLocaleString("en-IN")}/-
                            </div>

                            {/* AMC and Period */}
                            <div className="flex items-center justify-between mb-6">
                              <span
                                className={`text-lg font-semibold ${isPopular ? "text-white" : "text-gray-700"}`}
                              >
                                ₹ 9000/- AMC
                              </span>
                              <div
                                className={`text-right ${isPopular ? "text-white/90" : "text-gray-600"}`}
                              >
                                <div className="text-xs font-medium">
                                  {isPopular ? "Annually" : "Per 3 month"}
                                </div>
                                <div className="text-xs">
                                  {isPopular
                                    ? "For Next Year On-ward"
                                    : "For Next Year On-ward"}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handlePayment(plan)}
                              disabled={!userId || disabledBecauseSamePlan}
                              className={`w-full py-3 rounded-full font-semibold transition-all text-sm ${
                                isPopular
                                  ? "bg-white text-gray-900 hover:bg-gray-50"
                                  : "border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                              } ${!userId || disabledBecauseSamePlan ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {disabledBecauseSamePlan
                                ? "Current Plan"
                                : `Choose ${isPopular ? "Annual" : "3-Month"} Plan`}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Custom Themes */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Custom Themes
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Personalize the software with brand-matched, premium
                        interface themes
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-gray-900">
                        + ₹6000
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customTheme}
                          onChange={(e) => setCustomTheme(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setThemeModalOpen(true)}
                      className="mt-4 border border-[#005BA8] rounded-lg px-5 py-3 text-[#005BA8] text-sm font-medium hover:bg-[#005BA8] hover:text-white"
                    >
                      View Available Themes
                    </button>
                  </div>
                </div>

                {/* Coupon */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Have a Coupon?
                  </h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-6 py-2 bg-[#005BA8] text-white rounded font-medium hover:bg-[#005BA8]">
                      Apply
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-[#005BA8]">
                    <span className="text-lg">
                      {" "}
                      <img
                        src={toAbsoluteUrl("/media/brand-logos/coupon.png")}
                        className="dark:hidden max-h-[20px]"
                        alt=""
                      />
                    </span>
                    <span>Grab it Fast – 50% OFF for first 50!</span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Plan Price</span>
                      <span className="font-semibold">
                        ₹{planPrice.toLocaleString()}
                      </span>
                    </div>
                    {customTheme && (
                      <div className="flex justify-between text-gray-700">
                        <span>
                          Custom Theme Price (Exclusive Your Custom Report)
                        </span>
                        <span className="font-semibold">
                          ₹{customThemePrice.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                      <span>Final Total</span>
                      <span>₹{finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const selectedPlan = translatedPlans.find(
                        (p) => p.isPopular
                      );
                      if (selectedPlan) handlePayment(selectedPlan);
                    }}
                    className="w-full mt-6 py-3 bg-[#005BA8] text-white rounded-lg font-semibold hover:bg-[#005BA8] transition-colors"
                  >
                    Pay Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <ThemeModal
          open={themeModalOpen}
          onClose={() => setThemeModalOpen(false)}
          onAddTheme={() => {
            setCustomTheme(true); // ✅ +6000 ON
            setThemeModalOpen(false);
          }}
          onSkipTheme={() => {
            setCustomTheme(false); // ❌ +6000 OFF
            setThemeModalOpen(false);
          }}
        />

        <PaymentSuccess
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          amount={paymentData.amount}
          transactionId={paymentData.transactionId}
          approve={user?.isApprove}
        />
      </div>
    </div>
  );
};

export default Priceplan;
