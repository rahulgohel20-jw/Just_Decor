import { useState } from "react";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";

import InvoiceList from "@/components/InvoiceTable/InvoiceList";
import InvoiceDetail from "@/components/InvoiceTable/InvoiceDetail";
import { FormattedMessage } from "react-intl";

export default function InvoiceViewPage() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <>
      <div className="gap-2 mb-3 pl-8">
        <h2 className="text-2xl font-medium text-black">Invoice</h2>
      </div>
      <div className="p-4 flex">
        <InvoiceList onSelectInvoice={setSelectedInvoice} />

        <div className="p-4 flex flex-col gap-4 items-center w-full">
          <div>
            <InvoiceDetail invoice={selectedInvoice} />
          </div>
        </div>
      </div>
    </>
  );
}
