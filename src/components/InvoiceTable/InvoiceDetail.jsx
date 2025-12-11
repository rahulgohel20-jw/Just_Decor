import { useState, useEffect } from "react";
import { Button, Table } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { GetInvoice } from "@/services/apiServices";
import { FormattedMessage } from "react-intl";

const InvoiceDetail = ({ Eventid }) => {
  const navigate = useNavigate();
  const { EventId } = useParams();
  const [invoiceInfo, setInvoiceInfo] = useState({});
  const [gstInfo, setGstInfo] = useState({});
  const [functionData, setFunctionData] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const columns = [
    {
      title: (
        <FormattedMessage
          id="SALES.INVOICE_FUNCTION"
          defaultMessage="Function"
        />
      ),
      dataIndex: "function",
      key: "function",
    },
    {
      title: (
        <FormattedMessage
          id="SALES.INVOICE_DATE_TIME"
          defaultMessage="Date & Time"
        />
      ),
      dataIndex: "date",
      key: "date",
    },
    {
      title: (
        <FormattedMessage id="SALES.INVOICE_PERSON" defaultMessage="Person" />
      ),
      dataIndex: "person",
      key: "person",
    },
    {
      title: (
        <FormattedMessage id="SALES.INVOICE_EXTRA" defaultMessage="Extra" />
      ),
      dataIndex: "extra",
      key: "extra",
    },
    {
      title: <FormattedMessage id="SALES.INVOICE_RATE" defaultMessage="Rate" />,
      dataIndex: "rate",
      key: "rate",
    },
    {
      title: (
        <FormattedMessage id="SALES.INVOICE_AMOUNT" defaultMessage="Amount" />
      ),
      dataIndex: "amount",
      key: "amount",
    },
  ];

  const fetchInvoiceData = async (id) => {
    if (!id) return;
    try {
      const response = await GetInvoice(id);
      const invoiceArray = response?.data?.data?.["Event Invoice Details"];

      console.log("Full Response:", response?.data);

      if (
        !invoiceArray ||
        !Array.isArray(invoiceArray) ||
        invoiceArray.length === 0
      ) {
        console.error("No invoice data found");
        return;
      }

      // Get the first invoice from the array
      const invoice = invoiceArray[0];
      const event = invoice?.event || {};
      const party = event?.party || {};

      console.log("Invoice:", invoice);
      console.log("Event:", event);

      // Set subtotal and total
      setSubTotal(invoice?.subTotal || 0);
      setTotalAmount(invoice?.grandTotal || 0);

      // Set invoice information
      setInvoiceInfo({
        invoiceCode: invoice?.invoiceCode || "-",
        billingName: invoice?.billingname || party?.nameEnglish || "-",
        quotationNumber: invoice?.quotationCode || "-",
        invoiceDate: invoice?.createdAt || "-",
        dueDate: invoice?.duedate || "-",
        eventDate: event?.eventStartDateTime
          ? new Date(event.eventStartDateTime).toLocaleDateString("en-GB")
          : "-",
        gstNumber: invoice?.gstnumber || party?.gst || "NA",
        address: invoice?.billingaddress || party?.addressEnglish || "-",
        notes: invoice?.notes || "",
        discount: invoice?.discount || 0,
        terms: invoice?.terms || "Due on Receipt",
      });

      // Set GST information
      setGstInfo({
        cgst: invoice?.cgst || 0,
        cgstAmnt: invoice?.cgstAmnt || 0,
        sgst: invoice?.sgst || 0,
        sgstAmnt: invoice?.sgstAmnt || 0,
        igst: invoice?.igst || 0,
        igstAmnt: invoice?.igstAmnt || 0,
      });

      // Map function items - UPDATED to use invoiceFunctionItems
      const functions =
        invoice?.invoiceFunctionItems?.map((fn, index) => ({
          key: index + 1,
          function: fn?.functionName || "-",
          date: fn?.functionDate || "-",
          person: fn?.pax || "0",
          extra: fn?.extraPax || "0",
          rate: fn?.ratePerPlate?.toFixed(2) || "0.00",
          amount: fn?.amount?.toFixed(2) || "0.00",
        })) || [];

      setFunctionData(functions);

      console.log("Function Data:", functions);
    } catch (err) {
      console.error("Error fetching invoice data:", err);
    }
  };

  useEffect(() => {
    if (EventId) fetchInvoiceData(EventId);
  }, [EventId]);

  useEffect(() => {
    if (Eventid) fetchInvoiceData(Eventid);
  }, [Eventid]);

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full mx-auto border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start p-6 border-b border-gray-100">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#005BA8]">
            <FormattedMessage id="INVOICE.TITLE" defaultMessage="Invoice" />
          </h2>
          <p className="text-gray-500 text-sm break-words">
            {invoiceInfo.address}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
          <Button
            icon={<SettingOutlined />}
            className="font-semibold border-[#005BA8] text-[#005BA8] hover:bg-[#005BA8] hover:text-white transition-all whitespace-nowrap"
            onClick={() => navigate(`/invoice/${Eventid || EventId}`)}
          >
            <FormattedMessage
              id="COMMON.CUSTOMIZE"
              defaultMessage="Customize"
            />
          </Button>
        </div>
      </div>

      {/* Invoice Info */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm border-b border-gray-100">
        <div className="md:border-r border-gray-200 md:pr-6">
          <p className="flex justify-between mb-1 gap-4">
            <span className="text-gray-500">
              <FormattedMessage
                id="INVOICE.BILLING_NAME"
                defaultMessage="Billing Name"
              />
            </span>
            <span className="font-medium text-right">
              {invoiceInfo.billingName}
            </span>
          </p>
          <p className="flex justify-between mb-1 gap-4">
            <span className="text-gray-500">
              <FormattedMessage
                id="INVOICE.INVOICE_NUMBER"
                defaultMessage="Invoice Number"
              />
            </span>
            <span className="font-medium text-right">
              {invoiceInfo.invoiceCode}
            </span>
          </p>
          <p className="flex justify-between mb-1 gap-4">
            <span className="text-gray-500">
              <FormattedMessage
                id="INVOICE.INVOICE_DATE"
                defaultMessage="Invoice Date"
              />
            </span>
            <span className="font-medium text-right">
              {invoiceInfo.invoiceDate}
            </span>
          </p>
          <p className="flex justify-between mb-1 gap-4">
            <span className="text-gray-500">
              <FormattedMessage
                id="INVOICE.EVENT_DATE"
                defaultMessage="Event Date"
              />
            </span>
            <span className="font-medium text-right">
              {invoiceInfo.eventDate}
            </span>
          </p>
        </div>

        <div>
          <p className="flex justify-between mb-1 gap-4">
            <span className="text-gray-500">
              <FormattedMessage
                id="INVOICE.GST_NUMBER"
                defaultMessage="GST Number"
              />
            </span>
            <span className="font-medium text-right break-all">
              {invoiceInfo.gstNumber}
            </span>
          </p>
          <p className="flex justify-between mb-1 gap-4">
            <span className="text-gray-500">
              <FormattedMessage
                id="INVOICE.DUE_DATE"
                defaultMessage="Due Date"
              />
            </span>
            <span className="font-medium text-right">
              {invoiceInfo.dueDate}
            </span>
          </p>
        </div>
      </div>

      {/* Function Table */}
      <div className="mt-6 overflow-x-auto">
        <h4 className="p-4 font-semibold text-[#005BA8] bg-[#EAF4FB] border-b border-gray-200">
          <FormattedMessage
            id="FUNCTION.DETAILS"
            defaultMessage="Function Details"
          />
        </h4>
        <Table
          columns={columns}
          dataSource={functionData}
          pagination={false}
          className="!border-0 [&_.ant-table-thead>tr>th]:bg-[#F8FAFC] [&_.ant-table-thead>tr>th]:text-[#005BA8]"
        />
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left */}
        <div className="p-6 text-sm text-gray-700">
          <p>
            <strong>
              <FormattedMessage
                id="INVOICE.TOTAL_IN_WORDS"
                defaultMessage="Total in Words:"
              />
            </strong>{" "}
            <br />
            <FormattedMessage
              id="INVOICE.TOTAL_IN_WORDS_VALUE"
              defaultMessage="Indian Rupee Amount in Words Here"
            />
          </p>
          <p className="mt-4">
            <strong>
              <FormattedMessage id="INVOICE.NOTES" defaultMessage="Notes:" />
            </strong>{" "}
            <br />
            <span className="break-words">{invoiceInfo.notes}</span>
          </p>
          <p className="mt-4 text-xs text-gray-500 leading-relaxed">
            <strong>
              <FormattedMessage
                id="INVOICE.TERMS_CONDITIONS"
                defaultMessage="Terms & Conditions:"
              />
            </strong>{" "}
            <br />
            <FormattedMessage
              id="INVOICE.TERMS_CONDITIONS_VALUE"
              defaultMessage="Your company's Terms and Conditions will appear here."
            />
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col justify-between p-6 lg:border-l border-t lg:border-t-0 border-gray-100 text-sm">
          <div>
            <div className="flex justify-between mb-1 gap-4">
              <span className="text-gray-500">
                <FormattedMessage
                  id="INVOICE.SUB_TOTAL"
                  defaultMessage="Sub Total"
                />
              </span>
              <span>₹ {subTotal}</span>
            </div>
            <div className="flex justify-between mb-1 gap-4">
              <span className="text-gray-500">
                <FormattedMessage id="INVOICE.CGST" defaultMessage="CGST" />
              </span>
              <span>₹ {gstInfo.cgstAmnt}</span>
            </div>
            <div className="flex justify-between mb-1 gap-4">
              <span className="text-gray-500">
                <FormattedMessage id="INVOICE.SGST" defaultMessage="SGST" />
              </span>
              <span>₹ {gstInfo.sgstAmnt}</span>
            </div>
            <div className="flex justify-between mb-1 gap-4">
              <span className="text-gray-500">
                <FormattedMessage id="INVOICE.IGST" defaultMessage="IGST" />
              </span>
              <span>₹ {gstInfo.igstAmnt}</span>
            </div>
            <div className="flex justify-between mb-1 gap-4">
              <span className="text-gray-500">
                <FormattedMessage
                  id="INVOICE.DISCOUNT"
                  defaultMessage="Discount"
                />
              </span>
              <span>₹ {invoiceInfo.discount}</span>
            </div>
            <div className="flex justify-between font-bold text-[#005BA8] text-base gap-4">
              <span>
                <FormattedMessage id="INVOICE.TOTAL" defaultMessage="Total" />
              </span>
              <span>₹ {totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
