import { Button, Table } from "antd";
import { useState, useEffect } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { GetQuotation } from "@/services/apiServices";
import { useNavigate } from "react-router-dom";

const QuotationDetail = ({ Eventid }) => {
  const navigate = useNavigate();
  const { EventId } = useParams();
  const [eventData, setEventData] = useState([]);
  const [invoiceInfo, setInvoiceInfo] = useState({});
  const [gstInfo, setGstInfo] = useState({});
  const [functionData, setFunctionData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [subTotal, setSubTotal] = useState(0);

  const columns = [
    { title: "Function", dataIndex: "function", key: "function" },
    { title: "Date & Time", dataIndex: "date", key: "date" },
    { title: "Person", dataIndex: "person", key: "person" },
    { title: "Extra", dataIndex: "extra", key: "extra" },
    { title: "Rate", dataIndex: "rate", key: "rate" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ];

  const fetchEventData = async (id) => {
    if (!id) return;
    try {
      const response = await GetQuotation(id);
      const data = response?.data?.data;
      const quotationDetails = data?.["Event Functions Quotation Details"]?.[0];
      console.log(quotationDetails);

      if (quotationDetails) {
        setSubTotal(quotationDetails?.subTotal || 0);
        setTotalAmount(quotationDetails?.grandTotal || 0);

        setInvoiceInfo({
          quotationNumber: quotationDetails?.quotationCode || "-",
          customerName: quotationDetails?.event?.party?.nameEnglish || "-",
          Address: quotationDetails?.event?.party?.addressEnglish || "-",
          notes: quotationDetails?.notes || "",
          discount: quotationDetails?.discount || 0,
          quotationDate: quotationDetails?.createdAt
            ? new Date(quotationDetails.createdAt).toLocaleDateString("en-GB")
            : "-",
          terms: quotationDetails?.terms || "Due on Receipt",
          eventDate: quotationDetails?.event?.eventStartDateTime
            ? new Date(
                quotationDetails.event.eventStartDateTime
              ).toLocaleDateString("en-GB")
            : "-",
        });

        setGstInfo({
          gstNumber: quotationDetails?.event?.party?.gstNo || "NA",
          gstTreatment: quotationDetails?.event?.party?.gstType || "NA",
          cgst: quotationDetails?.cgst || 0,
          cgstAmnt: quotationDetails?.cgstAmnt || 0,
          sgst: quotationDetails?.sgst || 0,
          sgstAmnt: quotationDetails?.sgstAmnt || 0,
          igst: quotationDetails?.igst || 0,
          igstAmnt: quotationDetails?.igstAmnt || 0,
        });

        const functions =
          quotationDetails?.functionQuotationItems?.map((fn, index) => ({
            key: index + 1,
            function: fn?.functionName || "-",
            date: fn?.functionDate || "0",
            rate: fn?.ratePerPlate || "0",
            person: fn?.pax || "0",
            extra: fn?.extraPax || "0",
            amount: fn?.amount || "0",
          })) || [];

        setFunctionData(functions);
      }

      setEventData(data);
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  useEffect(() => {
    if (EventId) {
      fetchEventData(EventId);
    }
  }, [EventId]);

  useEffect(() => {
    if (Eventid) {
      fetchEventData(Eventid);
    }
  }, [Eventid]);

  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-5xl mx-auto border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start p-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-[#005BA8]">Quotation</h2>
          <p className="text-gray-500 text-sm">{invoiceInfo.Address}</p>
          <p className="text-gray-500 text-sm">{invoiceInfo.customerName}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Button
            icon={<SettingOutlined />}
            className="font-semibold border-[#005BA8] text-[#005BA8] hover:bg-[#005BA8] hover:text-white transition-all"
            onClick={() => navigate(`/quotation/${Eventid || EventId}`)}
          >
            Customize
          </Button>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="p-6 grid grid-cols-2 gap-8 text-sm border-b border-gray-100">
        <div className="border-r border-gray-200 pr-6">
          <p className="flex justify-between mb-1">
            <span className="text-gray-500">Quotation Number</span>
            <span className="font-medium">{invoiceInfo.quotationNumber}</span>
          </p>
          <p className="flex justify-between mb-1">
            <span className="text-gray-500">Quotation Date</span>
            <span className="font-medium">{invoiceInfo.quotationDate}</span>
          </p>
          <p className="flex justify-between mb-1">
            <span className="text-gray-500">Due Date</span>
            <span className="font-medium">{invoiceInfo.terms}</span>
          </p>
          <p className="flex justify-between mb-1">
            <span className="text-gray-500">Event Date</span>
            <span className="font-medium">{invoiceInfo.eventDate}</span>
          </p>
        </div>

        <div>
          <p className="flex justify-between mb-1">
            <span className="text-gray-500">GST Number</span>
            <span className="font-medium">{gstInfo.gstNumber}</span>
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mt-6">
        <h4 className="p-4 font-semibold text-[#005BA8] bg-[#EAF4FB] border-b border-gray-200">
          Function Details
        </h4>
        <Table
          columns={columns}
          dataSource={functionData}
          pagination={false}
          className="!border-0 [&_.ant-table-thead>tr>th]:bg-[#F8FAFC] [&_.ant-table-thead>tr>th]:text-[#005BA8]"
        />
      </div>

      {/* Footer / Totals */}
      <div className="grid grid-cols-2">
        {/* Left Side */}
        <div className="p-6 text-sm text-gray-700">
          <p>
            <strong>Total in Words:</strong> <br />
            Indian Rupee Twenty-Three Thousand Six Hundred Only
          </p>
          <p className="mt-4">
            <strong>Notes:</strong> <br />
            {invoiceInfo.notes}
          </p>
          <p className="mt-4 text-xs text-gray-500 leading-relaxed">
            <strong>Terms & Conditions:</strong> <br />
            Your company’s Terms and Conditions will appear here.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-between p-6 border-l border-gray-100 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Sub Total</span>
              <span>₹ {subTotal}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">CGST {gstInfo.cgst} %</span>
              <span>₹{gstInfo.cgstAmnt}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">SGST {gstInfo.sgst} %</span>
              <span>₹{gstInfo.sgstAmnt}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500"> IGST {gstInfo.igst} %</span>
              <span>₹{gstInfo.igstAmnt}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500"> Discount </span>
              <span>₹{invoiceInfo.discount}</span>
            </div>
            <div className="flex justify-between font-bold text-[#005BA8] text-base">
              <span>Total</span>
              <span>₹ {totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetail;
