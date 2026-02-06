import { Fragment,useState  } from "react";
import { Container } from "@/components/container";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Download,
  Printer,
  Trash2,
} from "lucide-react";
import RecivePayment from "./components/RecivePayment";
import PayablePayment from "./components/PayablePayment";
const RecivedPayments = () => {
  const [activeTab, setActiveTab] = useState("received");

  return (
    <Fragment>
      <Container>

        {/* Page Wrapper */}
        <div className="min-h-screen  ">
          <div className="flex items-center justify-between mb-7">

            <div>
              <h1 className="text-3xl font-bold text-[#111827]">
                Payments

              </h1>

              <p className="text-[13px] text-[#6b7280] mt-[2px]">
                Manage and track your incoming and outgoing funds.
              </p>
            </div>

          </div>

          <div className="flex gap-8 border-b border-[#e5e7eb] mb-7">

            {/* Received Tab */}
            <button
              onClick={() => setActiveTab("received")}
              className={`text-lg font-medium pb-3 border-b-2 transition
                ${
                  activeTab === "received"
                    ? "text-primary border-primary"
                    : "text-[#6b7280] border-transparent"
                }
              `}
            >
              Received
            </button>

            {/* Payable Tab */}
            <button
              onClick={() => setActiveTab("payable")}
              className={`text-lg font-medium pb-3 border-b-2 transition
                ${
                  activeTab === "payable"
                    ? "text-primary border-primary"
                    : "text-[#6b7280] border-transparent"
                }
              `}
            >
              Payable
            </button>

          </div>

          {activeTab === "received" && <RecivePayment />}
          {activeTab === "payable" && <PayablePayment />}

        </div>

      </Container>
    </Fragment>
  );
};

export default RecivedPayments;
