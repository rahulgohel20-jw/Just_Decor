import { Card } from "antd";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { toAbsoluteUrl } from "@/utils";

const Priceplan = ({ isModalOpen, setIsModalOpen }) => {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <Card className="h-fit rounded-2xl shadow-md hover:shadow-lg transition shadow-[4px_4px_42px_0px_#5243C24B]">
          <div className="flex flex-col ">
            <div className="text-4xl mb-2">
              <img
                src={toAbsoluteUrl("/media/price/lite.png")}
                alt=""
                className="h-[53px] w-[42px]"
              />
            </div>
            <h3 className="text-lg font-semibold text-[#170F49]">Lite</h3>
            <p className="text-gray-500 text-[#6F6C8F] text-sm">
              For solo designers launching standout portfolios.
            </p>
            <p className="text-2xl font-bold text-[#170F49]">
              $4,200
              <span className="text-sm font-normal text-[#A0A3BD]">/month</span>
            </p>

            <ul className="space-y-3 text-sm text-[#6F6C8F]">
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#4A3AFF] text-[#4A3AFF] text-xs">
                  ✓
                </span>
                Fully responsive Webflow template
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#4A3AFF] text-[#4A3AFF] text-xs">
                  ✓
                </span>
                Modular & scalable components
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#4A3AFF] text-[#4A3AFF] text-xs">
                  ✓
                </span>
                Easy-to-edit CMS setup
              </li>
            </ul>

            <button className="mt-6 px-6 py-2 rounded-lg border border-[#D9DBE9]  text-balck font-semibold shadow-[inset_0px_4px_6px_0px_#FFFFFF66,inset_0px_-2px_2px_0px_#1B235512,0px_3px_6px_0px_#07006E08]">
              Choose plan
            </button>
          </div>
        </Card>

        <Card className="rounded-2xl shadow-lg border-2 border-[#005BA8] relative shadow-[4px_4px_42px_0px_#5243C24B]">
          <div className="absolute top-2 right-2 bg-[#005BA8] text-white text-xs px-3 py-1 rounded-full">
            Most popular
          </div>
          <div className="flex flex-col">
            <div className="text-4xl mb-2">
              <img
                src={toAbsoluteUrl("/media/price/elite.png")}
                alt=""
                className="h-[42px] w-[40px]"
              />
            </div>
            <h3 className="text-lg font-semibold text-[#170F49]">E-Lite</h3>
            <p className="text-[#170F49] text-sm text-[#6F6C8F]">
              Ideal for growing agencies or collaborative design teams who need
              scalable templates.
            </p>
            <p className="text-2xl font-bold  text-[#170F49]">
              $10,000
              <span className="text-sm font-normal text-[#A0A3BD]">/month</span>
            </p>

            <ul className="space-y-3 text-sm text-[#6F6C8F]">
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#4A3AFF] text-[#4A3AFF] text-xs">
                  ✓
                </span>
                Fully responsive Webflow template
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#4A3AFF] text-[#4A3AFF] text-xs">
                  ✓
                </span>
                CMS + Figma file included
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#4A3AFF] text-[#4A3AFF] text-xs">
                  ✓
                </span>
                SEO-ready structure
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#4A3AFF] text-[#4A3AFF] text-xs">
                  ✓
                </span>
                Email support included
              </li>
            </ul>

            <button className="mt-6 px-6 py-2 rounded-lg bg-[#005BA8] text-white ">
              Choose plan
            </button>
          </div>
        </Card>

        <Card className=" h-fit rounded-2xl shadow-md hover:shadow-lg transition shadow-[4px_4px_42px_0px_#5243C24B]">
          <div className="flex flex-col ">
            <div className="text-4xl mb-2">
              <img
                src={toAbsoluteUrl("/media/price/Premium.png")}
                alt=""
                className="h-[42px] w-[40px]"
              />
            </div>
            <h3 className="text-lg font-semibold text-[#170F49]">Premium</h3>
            <p className="text-gray-500 text-sm ">
              Custom solutions for large teams & organizations.
            </p>
            <p className="text-2xl font-bold text-[#170F49]">
              $4,200
              <span className="text-sm font-normal text-[#A0A3BD]">/month</span>
            </p>

            <ul className="space-y-3 text-sm text-[#6F6C8F]">
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#4A3AFF] text-[#4A3AFF] text-xs">
                  ✓
                </span>
                All included in Agency
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#4A3AFF] text-[#4A3AFF] text-xs">
                  ✓
                </span>
                Custom integrations & support
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full border border-[#4A3AFF] text-[#4A3AFF] text-xs">
                  ✓
                </span>
                Dedicated account manager
              </li>
            </ul>

            <button className="mt-6 px-6 py-2 rounded-lg border border-[#D9DBE9]  text-balck font-semibold shadow-[inset_0px_4px_6px_0px_#FFFFFF66,inset_0px_-2px_2px_0px_#1B235512,0px_3px_6px_0px_#07006E08]">
              Choose plan
            </button>
          </div>
        </Card>
      </div>
    </CustomModal>
  );
};

export default Priceplan;
