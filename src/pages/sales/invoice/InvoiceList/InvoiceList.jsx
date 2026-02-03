import { useState } from "react";
import InvoiceList from "@/components/InvoiceTable/InvoiceList";
import InvoiceDetail from "@/components/InvoiceTable/InvoiceDetail";
import PaymentReceived from "@/components/InvoiceTable/PaymentReceived";
import { FormattedMessage } from "react-intl";
import { Button,Modal } from "antd";
import {
  EditOutlined,
  ShareAltOutlined,
  SendOutlined,
  PrinterOutlined,
  DollarCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {  GetQuotationReport } from "@/services/apiServices";
import RecordPayment from "../../../../components/recordpayment/RecordPayment";
import { useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
export default function InvoiceViewPage() {
  const { EventId } = useParams();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(false);
  const pdfPlugin = defaultLayoutPlugin();

  const handleGenerateReport = () => {
    setLoadingPdf(true);

    const userId = localStorage.getItem("userId");
    const activeEventId = selectedInvoice || EventId;

    GetQuotationReport(activeEventId, userId, 1)
      .then((response) => {
        if (response.data) {
          const pdfPath = response.data?.report_path;
          setPdfUrl(pdfPath);
          setIsPdfModalVisible(true);
        }
      })
      .catch((error) => {
        console.error("Error generating report:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to generate PDF report",
          icon: "error",
          confirmButtonColor: "#005BA8",
        });
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  };



  return (
    <>
   
  

      {/* Main Content */}
      <div className="px-2 sm:px-4 pb-4">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Invoice List */}
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <InvoiceList onSelectInvoice={setSelectedInvoice} />
          </div>

          {/* Invoice Detail */}
          <div className="w-full lg:flex-1 lg:min-w-0 space-y-4">

            <div className="flex items-center justify-between gap-2 w-full">
              <h2 className="text-2xl font-bold text-primary">INV – 0001</h2>
            </div>

            {/* Action Buttons */}
            <div className="flex  items-center gap-3 sm:gap-4 w-full">

              <Button
                icon={<EditOutlined className="text-primary"/>}
                className="rounded-lg border font-bold text-primary w-full"
              >
                <FormattedMessage
                  id="SALES.CLONE_INVOICE"
                  defaultMessage="Edit"
                />
              </Button>

              <Button
                icon={<ShareAltOutlined className="text-primary" />}
                className="rounded-lg border font-bold text-primary w-full"
              >
                <FormattedMessage id="COMMON.SHARE" defaultMessage="Share" />
              </Button>

              <Button
                icon={<SendOutlined className="text-primary" />}
                className="rounded-lg border font-bold text-primary w-full"
              >
                <FormattedMessage id="COMMON.SEND" defaultMessage="Send" />
              </Button>

              <Button
                icon={<PrinterOutlined className="text-primary" />}
                className="rounded-lg border font-bold text-primary w-full"
                onClick={handleGenerateReport}
                disabled={loadingPdf}
              >
                 {loadingPdf ? (
                <>
                  <i className="ki-filled ki-loading animate-spin"></i>
                  <FormattedMessage
                    id="COMMON.LOADING"
                    defaultMessage="Loading..."
                  />
                </>
              ) : (
                <>
                  <FormattedMessage id="COMMON.PRINT" defaultMessage="Print" />
                </>
              )}
              </Button>

              <Button
                icon={<DollarCircleOutlined className="text-primary" />}
                className="rounded-lg border font-bold text-primary w-full"
                onClick={() => setIsPaymentOpen(true)}
              >

                <FormattedMessage
                  id="SALES.RECORD_PAYMENT"
                  defaultMessage="Record Payment"
                />
              </Button>

              {/* 3 Dots Button */}
              <Button
                icon={<MoreOutlined />}
               className="rounded-lg border font-bold text-primary w-[100px]"
              >
           More
            </Button>


            </div>

            {/* Payment Section */}
            <PaymentReceived />

            {/* Invoice Details */}
            <InvoiceDetail invoice={selectedInvoice} />

          </div>
        </div>
      </div>
      <Modal
        title={
          <FormattedMessage
            id="INVOICE.INVOICE_REPORT"
            defaultMessage="Invoice Report"
          />
        }
        k
        open={isPdfModalVisible}
        onCancel={() => {
          setIsPdfModalVisible(false);
          if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
            setPdfUrl("");
          }
        }}
        width="60%"
        footer={[
          <div key="footer" className="flex justify-end gap-2">
            {/* <button
              onClick={() => handleWhatsAppShare(pdfUrl)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Share on WhatsApp
            </button> */}
            <button
              className="btn btn-sm btn-light"
              onClick={() => {
                setIsPdfModalVisible(false);
                if (pdfUrl) {
                  URL.revokeObjectURL(pdfUrl);
                  setPdfUrl("");
                }
              }}
            >
              <FormattedMessage id="COMMON.CLOSE" defaultMessage="Close" />
            </button>
          </div>,
        ]}
        style={{ top: 20 }}
      >
        <div style={{ height: "80vh" }}>
          {pdfUrl && (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={pdfUrl}
                plugins={[pdfPlugin]}
                defaultScale={1.0}
              />
            </Worker>
          )}
        </div>
      </Modal>
      <RecordPayment
        isModalOpen={isPaymentOpen}
        setIsModalOpen={setIsPaymentOpen}
      />

    </>
  );
}
