import { useState } from "react";
import { Button } from "antd";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import {
  EditOutlined,
  ShareAltOutlined,
  SendOutlined,
  PrinterOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import InvoiceList from "@/components/InvoiceTable/InvoiceList";
import InvoiceDetail from "@/components/InvoiceTable/InvoiceDetail";
import { FormattedMessage } from "react-intl";

export default function InvoiceViewPage() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <>
      <div className="gap-2 mb-3 pl-8">
        <Breadcrumbs items={[{ title: <FormattedMessage id="INVOICE.TITLE" defaultMessage="Invoice" /> }]} />
      </div>
      <div className="p-4 flex">
        <InvoiceList onSelectInvoice={setSelectedInvoice} />

        <div className="p-4 flex flex-col gap-4 items-center w-full">
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="text-lg font-bold text-primary">
              {selectedInvoice?.invoiceCode || "INV – 0001"}
            </span>
          </div>

          <div className="flex items-center w-full gap-8 ps-4">
            <Button
              icon={<EditOutlined className="text-success" />}
              className="rounded-lg border font-bold text-success w-[130px]"
            >
              <FormattedMessage id="SALES.CLONE_INVOICE" defaultMessage="Clone Invoice" />
            </Button>

            <Button
              icon={<ShareAltOutlined className="text-[#00447A]" />}
              className="rounded-lg border font-bold text-[#00447A] w-[110px]"
            >
              <FormattedMessage id="COMMON.SHARE" defaultMessage="Share" />
            </Button>

            <Button
              icon={<SendOutlined className="text-[#8B5300]" />}
              className="rounded-lg border font-bold text-[#8B5300] w-[110px]"
            >
              <FormattedMessage id="COMMON.SEND" defaultMessage="Send" />
            </Button>

            <Button
              icon={<PrinterOutlined className="text-[#5D006D]" />}
              className="rounded-lg border font-bold text-[#5D006D] w-[110px]"
            >
              <FormattedMessage id="COMMON.PRINT" defaultMessage="Print" />
            </Button>

            <Button
              icon={<DollarCircleOutlined className="text-[#00534B]" />}
              className="rounded-lg border font-bold text-[#00534B] w-[170px]"
            >
              <FormattedMessage id="SALES.RECORD_PAYMENT" defaultMessage="Record Payment" />
            </Button>
          </div>

          <div className="border border-dashed mb-4 border-[#0000001A] w-full mt-4"></div>

          <div>
            <InvoiceDetail invoice={selectedInvoice} />
          </div>
        </div>
      </div>
    </>
  );
}