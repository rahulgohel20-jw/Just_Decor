import { useState } from "react";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import InvoiceList from "@/components/InvoiceTable/InvoiceList";
import InvoiceDetail from "@/components/InvoiceTable/InvoiceDetail";
import { FormattedMessage } from "react-intl";

export default function InvoiceViewPage() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <>
      {/* Header */}
      <div className="gap-2 mb-3 pl-4 sm:pl-8">
        <h2 className="text-xl sm:text-2xl font-medium text-black">
          <FormattedMessage id="INVOICE.TITLE" defaultMessage="Invoice" />
        </h2>
      </div>

      {/* Main Content */}
      <div className="px-2 sm:px-4 pb-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Invoice List - Full width on mobile, fixed width on desktop */}
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <InvoiceList onSelectInvoice={setSelectedInvoice} />
          </div>

          {/* Invoice Detail - Full width, appears below list on mobile */}
          <div className="w-full lg:flex-1 lg:min-w-0">
            <InvoiceDetail invoice={selectedInvoice} />
          </div>
        </div>
      </div>
    </>
  );
}
