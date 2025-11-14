import { useEffect, useState } from "react";
import { Spin } from "antd";
import { toAbsoluteUrl } from "@/utils";
import {
  GetAllPlans,
  AddUserPlan,
  CreatePaymentOrder,
  FetchAllUser,
} from "@/services/apiServices";
import PaymentSuccess from "../successmodal/paymentsuccess";
import Swal from "sweetalert2";

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

  // user states
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [underVerification, setUnderVerification] = useState(false);

  const [activeCycle, setActiveCycle] = useState("Monthly");
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    transactionId: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  const stored =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userData") || "null")
      : null;
  const token = stored?.token;

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
    setLoading(true);
    GetAllPlans()
      .then((res) => {
        const result = res.data?.data?.["Plan Details"] || [];
        setPlans(result);
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
        setPlans([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const orderedPlans = (() => {
    const popular = plans.filter((p) => p.isPopular);
    const others = plans.filter((p) => !p.isPopular);
    if (popular.length === 0) return plans;
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
        {(underVerification || (user && !user.isApprove)) && (
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
          Plans & Pricing
        </h2>
        <p className="text-[#6F6C8F] mt-3 max-w-xl mx-auto text-base leading-relaxed">
          Whether your time-saving automation needs are large or small, we're
          here to help you scale.
        </p>

        <div className="flex justify-center mt-8">
          <div className="flex bg-[#F4F4FF] rounded-full p-1">
            {["Monthly", "Quarterly", "Annually"].map((cycle) => (
              <button
                key={cycle}
                onClick={() => setActiveCycle(cycle)}
                className={`px-6 py-2 text-sm rounded-full font-medium transition-all ${
                  activeCycle === cycle
                    ? "bg-[#005BA8] text-white"
                    : "text-[#6F6C8F] hover:bg-blue-50"
                }`}
              >
                {cycle}
              </button>
            ))}
          </div>
        </div>
      </div>

      {console.log(
        "paymentData.amount",
        paymentData.amount,
        "user?.isApprove",
        user?.isApprove
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-stretch justify-center">
          {orderedPlans
            .filter((plan) => plan.id !== 5)
            .map((plan) => {
              const isPopular = plan.isPopular;
              const disabledBecauseSamePlan = user?.plan?.id === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-3xl border border-[#E6E6F0] shadow-sm hover:shadow-lg transition-all bg-white p-8 md:p-10 ${
                    isPopular
                      ? "border-[#005BA8] bg-[#F9FAFF] scale-[1.03] shadow-[0_12px_40px_rgba(0,91,168,0.15)] z-10"
                      : "z-0"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-3 right-3 bg-[#005BA8] text-white text-xs px-3 py-1 rounded-full">
                      Most popular
                    </div>
                  )}

                  <div className="flex mb-6">
                    <img
                      src={toAbsoluteUrl(
                        `/media/price/${plan.name.toLowerCase()}.png`
                      )}
                      alt={plan.name}
                      className={`${isPopular ? "h-12 w-12" : "h-10 w-10"} object-contain`}
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-[#170F49] mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-[#6F6C8F] mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="text-[#170F49] mb-6">
                    <p className="text-3xl font-bold">
                      ₹{plan.price.toLocaleString()}
                      <span className="text-sm font-normal text-[#A0A3BD] ml-1">
                        /{plan.billingCycle.toLowerCase()}
                      </span>
                    </p>
                  </div>

                  <ul className="text-[#6F6C8F] text-sm space-y-3 mb-8 max-w-[250px]">
                    {plan.features?.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#4A3AFF] text-[#4A3AFF] text-xs">
                          ✓
                        </span>
                        <span>{f.featureText}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePayment(plan)}
                    disabled={!userId || disabledBecauseSamePlan}
                    className={`w-full px-8 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                      isPopular
                        ? "bg-[#005BA8] text-white hover:bg-[#004a8a]"
                        : "border border-[#D9DBE9] text-[#170F49] hover:bg-blue-50"
                    } ${!userId || disabledBecauseSamePlan ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {disabledBecauseSamePlan ? "Current Plan" : "Choose plan"}
                  </button>
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
