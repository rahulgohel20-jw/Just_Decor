import { useState } from "react";
import { Button, Dropdown, Menu, Upload } from "antd";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import {
  EditOutlined,
  ShareAltOutlined,
  SendOutlined,
  PrinterOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import QuotationList from "../../../../components/QuotationTable/QuotationList";
import QuotationDetail from "../../../../components/QuotationTable/QuotationDetail";
export default function QuotationViewPage() {
  const [selectedEventId, setSelectedEventId] = useState(null);

  return (
    <>
      <div className="gap-2 mb-3 pl-8">
        <Breadcrumbs items={[{ title: "Quotation" }]} />
      </div>
      <div className="p-4 flex">
        <QuotationList onEventSelect={setSelectedEventId} />

        <div className="p-4 flex flex-col gap-4 items-center w-full">
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="text-lg font-bold text-primary">QT – 0001</span>
          </div>

          <div className="flex items-center  w-full gap-8  ps-4">
            <Button
              icon={<EditOutlined className="text-success" />}
              className="rounded-lg border font-bold  text-success w-[130px]"
            >
              Clone Invoice
            </Button>

            <Button
              icon={<ShareAltOutlined className="text-[#00447A]" />}
              className="rounded-lg border font-bold  text-[#00447A] w-[110px]"
            >
              Share
            </Button>

            <Button
              icon={<SendOutlined className="text-[#8B5300]" />}
              className="rounded-lg border font-bold  text-[#8B5300] w-[110px]"
            >
              Send
            </Button>

            <Button
              icon={<PrinterOutlined className="text-[#5D006D]" />}
              className="rounded-lg border font-bold  text-[#5D006D] w-[110px]"
            >
              Print
            </Button>

            <Button
              icon={<DollarCircleOutlined className="text-[#00534B]" />}
              className="rounded-lg border font-bold  text-[#00534B]  w-[170px]"
            >
              Record Payment
            </Button>
          </div>

          <div className="border border-dashed mb-4 border-[#0000001A] w-full mt-4"></div>

          <div>
            <QuotationDetail Eventid={selectedEventId} />
          </div>
        </div>
      </div>
    </>
  );
}
