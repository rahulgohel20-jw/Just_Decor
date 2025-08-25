import { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { toAbsoluteUrl } from "@/utils";
import { GetAllPlans } from "@/services/apiServices"; // <-- adjust path if needed

const Priceplan = ({ isModalOpen, setIsModalOpen }) => {
const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (isModalOpen) {
    setLoading(true);
    GetAllPlans()
      .then((res) => {
        // Axios: res.data is your whole JSON object
        // The array is inside res.data.data["Plan Details"]
        const result = res.data?.data?.["Plan Details"] || [];
        console.log("Fetched plans:", result); // 👈 debug
        setPlans(result);
      })
      .catch((err) => {
        console.error("Error fetching plans:", err);
        setPlans([]); // fallback
      })
      .finally(() => setLoading(false));
  }
}, [isModalOpen]);


  return (
    <CustomModal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title=""
      width={1050}
    >
      <div
        onClick={() => setIsModalOpen(false)}
        className=" flex justify-end text-3xl text-gray-600 cursor-pointer"
      >
        &times;
      </div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">
          Plans & Pricing
        </h2>
        <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
          Whether your time-saving automation needs are large or small, we’re
          here to help you scale.
        </p>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-2 mt-6">
          <button className="px-4 py-2 text-sm rounded-full bg-[#005BA8] text-white shadow-white">
            Monthly
          </button>
          <button className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50">
            Quarterly
          </button>
          <button className="px-4 py-2 text-sm rounded-full bg-gray-100 text-gray-600 hover:bg-blue-50">
            Annually
          </button>
        </div>
      </div>


 {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center ">
        {plans.map((plan) => (
        <Card key={plan.id} className={`h-fit min-h-[400px] rounded-2xl hover:shadow-lg transition hover:shadow-[4px_4px_42px_0px_#5243C24B]  ${
                plan.isPopular ? "border-2 border-[#005BA8] min-h-[500px] " : ""
              }`}>
              {plan.isPopular && (
                <div className="absolute top-2 right-2 bg-[#005BA8] text-white text-xs px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
  
          <div className="flex flex-col flex-1">
            <div className="text-4xl mb-2">
              <img
                src={toAbsoluteUrl(
                      `/media/price/${plan.name.toLowerCase()}.png`
                    )}
                alt={plan.name}
                className="h-[53px] w-[42px]"
              />
            </div>
            <h3 className="text-lg font-semibold text-[#170F49]">{plan.name}</h3>
            <p className="text-gray-500 text-[#6F6C8F] text-sm">
              {plan.description}
            </p>
            <p className="text-2xl font-bold text-[#170F49]">
             ₹{plan.price.toLocaleString()}
              <span className="text-sm font-normal text-[#A0A3BD]">/{plan.billingCycle.toLowerCase()}</span>
            </p>

            <ul className="space-y-3 text-sm text-[#6F6C8F] flex-1">
              {plan.features?.map((f) => (
              <li className="flex items-center gap-2">
                
                <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#4A3AFF] text-[#4A3AFF] text-xs">
                  ✓
                </span>
                {f.featureText}
              </li>
                                ))}

              
            </ul>

             <button
      className={`mt-6 px-6 py-2 rounded-lg font-semibold shadow-[inset_0px_4px_6px_0px_#FFFFFF66,inset_0px_-2px_2px_0px_#1B235512,0px_3px_6px_0px_#07006E08] ${
        plan.isPopular
          ? "bg-[#005BA8] text-white"
          : "border border-[#D9DBE9] text-black"
      }`}
    >
      Choose plan
    </button>
          </div>
        </Card>
        ))}

        

        
      </div>
      )}
    </CustomModal>
  );
};

export default Priceplan;