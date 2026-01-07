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
          <div>
            <QuotationDetail Eventid={selectedEventId} />
          </div>
        </div>
      </div>
    </>
  );
}
