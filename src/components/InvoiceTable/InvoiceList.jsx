import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GeteventInvoicedata } from "@/services/apiServices";
import { FormattedMessage } from "react-intl";

export default function InvoiceList({ onSelectInvoice }) {
  const [invoices, setInvoices] = useState([]);
  const { PartyId } = useParams();

  const fetchInvoices = async () => {
    try {
      const response = await GeteventInvoicedata(PartyId);
      console.log("invoicelist", response);
      const invoiceList =
        response?.data?.data?.["Event Details"]?.map((event) => ({
          eventId: event?.id || "-",
          EventNo: event?.eventNo || "-",
          date: event?.eventStartDateTime || "-",
          name: event?.party?.nameEnglish || "-",
          Event: event?.eventType?.nameEnglish || "-",
          Venue: event?.venue?.nameEnglish || "-",
        })) || [];

      setInvoices(invoiceList);
      console.log("Invoice list", invoiceList);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    }
  };

  useEffect(() => {
    if (PartyId) {
      fetchInvoices();
    }
  }, [PartyId]);

  const handleEventClick = (eventId) => {
    if (onSelectInvoice) {
      onSelectInvoice(eventId);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 w-full max-w-xs h-auto">
      {/* Header */}
      <div className="filItems w-1/2 mb-6">
        <select defaultValue="All Invoice" className="select pe-7.5">
          <option value="0">
            <FormattedMessage
              id="SALES.ALL_INVOICE"
              defaultMessage="All Invoices"
            />
          </option>
          <option value="1">
            <FormattedMessage
              id="SALES.LAST_3_MONTHS"
              defaultMessage="Last 3 Months"
            />
          </option>
          <option value="2">
            <FormattedMessage
              id="SALES.LAST_6_MONTHS"
              defaultMessage="Last 6 Months"
            />
          </option>
          <option value="3">
            <FormattedMessage
              id="SALES.CUSTOM_DATE"
              defaultMessage="Custom Date"
            />
          </option>
        </select>
      </div>

      {/* Invoice Items */}
      <div className="grid gap-4">
        {invoices.map((inv) => (
          <div
            key={inv.eventId}
            onClick={() => handleEventClick(inv.eventId)}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer p-5"
          >
            <div className="flex justify-between items-center mb-2 gap-4">
              <span className="text-xs font-semibold bg-[#005BA8]/10 text-[#005BA8] px-3 py-1 rounded-full uppercase tracking-wide">
                {inv.Event}
              </span>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="font-semibold text-gray-900 text-base">
                  {inv.name}
                </p>
                <span className="text-sm text-gray-500">{inv.date}</span>
                <p className="text-xs text-gray-500 mt-1">
                  {inv.EventNo} • {inv.Venue}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
