import { useState, useEffect } from "react";
import { Button, Dropdown, Form, Menu, Upload } from "antd";
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
import { FormattedMessage } from "react-intl";
import { GetQuotation } from "@/services/apiServices";
import { useParams } from "react-router-dom";

export default function QuotationViewPage() {
  const { eventId } = useParams();

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [quotationId, setQuotationId] = useState(null);

  useEffect(() => {
    if (eventId) {
      FetchQuotation(eventId);
    }
  }, [eventId]);

  useEffect(() => {
    if (selectedEventId) {
      FetchQuotation(selectedEventId);
    }
  }, [selectedEventId]);

  const FetchQuotation = async (eventId) => {
    try {
      const response = await GetQuotation(eventId);
      console.log("Quotation response:", response);
      setQuotationId(response);
    } catch (error) {
      console.error("Error fetching quotation:", error);
    }
  };

  return (
    <>
      <div className="gap-2 mb-3 pl-8">
        <Breadcrumbs
          items={[
            {
              title: (
                <FormattedMessage
                  id="QUOTATION.TITLE"
                  defaultMessage="Quotation"
                />
              ),
            },
          ]}
        />
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
              <FormattedMessage
                id="SALES.CLONE_INVOICE"
                defaultMessage="Clone Invoice"
              />
            </Button>

            <Button
              icon={<ShareAltOutlined className="text-[#00447A]" />}
              className="rounded-lg border font-bold  text-[#00447A] w-[110px]"
            >
              <FormattedMessage id="COMMON.SHARE" defaultMessage="Share" />
            </Button>

            <Button
              icon={<SendOutlined className="text-[#8B5300]" />}
              className="rounded-lg border font-bold  text-[#8B5300] w-[110px]"
            >
              <FormattedMessage id="COMMON.SEND" defaultMessage="Send" />
            </Button>

            <Button
              icon={<PrinterOutlined className="text-[#5D006D]" />}
              className="rounded-lg border font-bold  text-[#5D006D] w-[110px]"
            >
              <FormattedMessage id="COMMON.PRINT" defaultMessage="Print" />
            </Button>

            <Button
              icon={<DollarCircleOutlined className="text-[#00534B]" />}
              className="rounded-lg border font-bold  text-[#00534B]  w-[170px]"
            >
              <FormattedMessage
                id="SALES.RECORD_PAYMENT"
                defaultMessage="Record Payment"
              />
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
