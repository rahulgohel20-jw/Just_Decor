import { useEffect, useState } from "react";
import { Spin } from "antd";
import { toAbsoluteUrl } from "@/utils";
import { GetAllPlans } from "@/services/apiServices";

const Priceplan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCycle, setActiveCycle] = useState("Monthly");

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

  return (
    <div className="container mx-auto px-4 ">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#170F49]">
          Plans & Pricing
        </h2>
        <p className="text-[#6F6C8F] mt-3 max-w-xl mx-auto text-base leading-relaxed">
          Whether your time-saving automation needs are large or small, we're
          here to help you scale.
        </p>

        {/* Toggle Buttons */}
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

      {/* Cards */}
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

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col   rounded-3xl border border-[#E6E6F0] shadow-sm hover:shadow-lg transition-all bg-white p-8 md:p-10 ${
                    isPopular
                      ? "border-[#005BA8] bg-[#F9FAFF] scale-[1.03] shadow-[0_12px_40px_rgba(0,91,168,0.15)] z-10"
                      : "z-0"
                  }`}
                >
                  {/* Badge */}
                  {isPopular && (
                    <div className="absolute top-3 right-3 bg-[#005BA8] text-white text-xs px-3 py-1 rounded-full">
                      Most popular
                    </div>
                  )}

                  {/* Icon */}
                  <div className="flex  mb-6">
                    <img
                      src={toAbsoluteUrl(
                        `/media/price/${plan.name.toLowerCase()}.png`
                      )}
                      alt={plan.name}
                      className={`${
                        isPopular ? "h-12 w-12" : "h-10 w-10"
                      } object-contain`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-[#170F49] mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-[#6F6C8F] mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="text-[#170F49] mb-6">
                    <p className="text-3xl font-bold">
                      ₹{plan.price.toLocaleString()}
                      <span className="text-sm font-normal text-[#A0A3BD] ml-1">
                        /{plan.billingCycle.toLowerCase()}
                      </span>
                    </p>
                  </div>

                  {/* Features */}
                  <ul className=" text-[#6F6C8F] text-sm space-y-3 mb-8 max-w-[250px]">
                    {plan.features?.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#4A3AFF] text-[#4A3AFF] text-xs">
                          ✓
                        </span>
                        <span>{f.featureText}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <div>
                    <button
                      className={`w-full  px-8 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                        isPopular
                          ? "bg-[#005BA8] text-white hover:bg-[#004a8a]"
                          : "border border-[#D9DBE9] text-[#170F49] hover:bg-blue-50"
                      }`}
                    >
                      Choose plan
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Priceplan;
