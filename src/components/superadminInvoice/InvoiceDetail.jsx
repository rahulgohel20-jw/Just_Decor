import { useState, useEffect } from "react";
import { Button, Table } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router-dom";

import { GetAdminInvoiceById } from "@/services/apiServices";

const InvoiceDetail = ({ invoiceId, invoice, mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoiceInfo, setInvoiceInfo] = useState({});
  const [gstInfo, setGstInfo] = useState({});
  const [functionData, setFunctionData] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: (
        <FormattedMessage
          id="SALES.INVOICE_FUNCTION"
          defaultMessage="Plan Name"
        />
      ),
      dataIndex: "function",
      key: "function",
    },
    {
      title: (
        <FormattedMessage
          id="SALES.INVOICE_DATE_TIME"
          defaultMessage="Start Date"
        />
      ),
      dataIndex: "date",
      key: "date",
    },
    {
      title: (
        <FormattedMessage id="SALES.INVOICE_PERSON" defaultMessage="End Date" />
      ),
      dataIndex: "person",
      key: "person",
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

    setLoading(true);
    try {
      const response = await GetAdminInvoiceById(id);
      console.log("Invoice Data Response:", response);
      const invoice = response?.data?.data[0];
      if (!invoice) return;

      setInvoiceInfo({
        billingName: invoice.billingName || "",
        partyName: invoice.partyName || "",
        address: invoice.billingAddress || "",
        invoiceCode: invoice.invoiceCode || `INV-${invoice.id}`,
        invoiceDate: invoice.planStartDate || "",
        eventDate: invoice.planEndDate || "",
        gstNumber: invoice.gstNumber || "",
        dueDate: invoice.dueDate || "",
        notes: invoice.notes || "",
        discount: invoice.discount || 0,
      });

      setGstInfo({
        cgstAmnt: invoice.cgstAmount || 0,
        sgstAmnt: invoice.sgstAmount || 0,
        igstAmnt: invoice.igstAmount || 0,
      });

      setFunctionData(
        (invoice.planInformation || []).map((item, index) => ({
          key: index,
          function: item.planName,
          date: item.planStartDate,
          person: item.planEndDate,
          amount: item.amount,
        }))
      );

      setSubTotal(invoice.subTotal || 0);
      setTotalAmount(invoice.grandTotal || 0);
    } catch (err) {
      console.error("Error fetching invoice data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "preview" && invoice) {
      console.log("Selected Invoice:", invoice); // Inspect fields here
      setInvoiceInfo({
        billingName: invoice.billingName || invoice.partyName || "",
        address: invoice.address || invoice.billingAddress || "",
        invoiceCode: invoice.invoiceCode || `INV-${invoice.id || 0}`,
        invoiceDate: invoice.invoiceDate || invoice.planStartDate || "",
        eventDate: invoice.eventDate || invoice.planEndDate || "",
        gstNumber: invoice.gstNumber || "",
        dueDate: invoice.dueDate || "",
        notes: invoice.notes || "",
        discount: invoice.discount || 0,
      });
      return;
    }

    if (invoiceId) {
      fetchInvoiceData(invoiceId);
    }
  }, [invoiceId, invoice, mode]);

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

        {mode !== "preview" && (
          <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
            <Button
              icon={<SettingOutlined />}
              className="font-semibold border-[#005BA8] text-[#005BA8] hover:bg-[#005BA8] hover:text-white transition-all whitespace-nowrap"
              onClick={() => navigate(`/invoice/${invoiceId}`)}
            >
              <FormattedMessage
                id="COMMON.CUSTOMIZE"
                defaultMessage="Customize"
              />
            </Button>
          </div>
        )}
      </div>

      {/* Invoice Info */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm border-b border-gray-100">
        <div className="md:border-r border-gray-200 md:pr-6">
          <p className="flex justify-between mb-1 gap-4">
            <span className="text-gray-500">
              <FormattedMessage
                id="INVOICE.PARTY_NAME"
                defaultMessage="Party Name"
              />
            </span>
            <span className="font-medium text-right">
              {invoiceInfo.partyName}
            </span>
          </p>
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
                id="INVOICE.BILLING_ADDRESS"
                defaultMessage="Billing Address"
              />
            </span>
            <span className="font-medium text-right">
              {invoiceInfo.address}
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
          <p className="flex justify-between mb-1 gap-4">
            <span className="text-gray-500">
              <FormattedMessage
                id="INVOICE.SHIPPING_ADDRESS"
                defaultMessage="Shipping Address"
              />
            </span>
            <span className="font-medium text-right">
              {invoiceInfo.address}
            </span>
          </p>
        </div>
      </div>

      {/* Function Table */}
      <div className="mt-6 overflow-x-auto">
        <h4 className="p-4 font-semibold text-[#005BA8] bg-[#EAF4FB] border-b border-gray-200">
          <FormattedMessage
            id="FUNCTION.DETAILS"
            defaultMessage="Plan Information"
          />
        </h4>
        <Table
          columns={columns}
          dataSource={functionData}
          pagination={false}
          loading={loading}
          className="!border-0 [&_.ant-table-thead>tr>th]:bg-[#F8FAFC] [&_.ant-table-thead>tr>th]:text-[#005BA8]"
        />
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-6 text-sm text-gray-700">
          <p>
            <strong>
              <FormattedMessage
                id="INVOICE.TOTAL_IN_WORDS"
                defaultMessage="Total in Words:"
              />
            </strong>
            <br />
            <FormattedMessage
              id="INVOICE.TOTAL_IN_WORDS_VALUE"
              defaultMessage="Indian Rupee Amount in Words Here"
            />
          </p>
          <p className="mt-4">
            <strong>
              <FormattedMessage id="INVOICE.NOTES" defaultMessage="Notes:" />
            </strong>
            <br />
            <span className="break-words">{invoiceInfo.notes}</span>
          </p>
        </div>

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
