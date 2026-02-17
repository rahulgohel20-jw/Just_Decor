import { useState } from "react";
import InvoiceList from "@/components/InvoiceTable/InvoiceList";
import InvoiceDetail from "@/components/InvoiceTable/InvoiceDetail";
import PaymentReceived from "@/components/InvoiceTable/PaymentReceived";
import { FormattedMessage } from "react-intl";
import { Button, Modal } from "antd";
import {
  EditOutlined,
  ShareAltOutlined,
  SendOutlined,
  PrinterOutlined,
  DollarCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { GetQuotationReport } from "@/services/apiServices";
import RecordPayment from "../../../../components/recordpayment/RecordPayment";
import { useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Swal from "sweetalert2";

export default function InvoiceViewPage() {
  const { EventId } = useParams();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [editPaymentData, setEditPaymentData] = useState(null); 
  const [refreshKey, setRefreshKey] = useState(0); 
  const [apiDueAmount, setApiDueAmount] = useState(0);
  const [invoiceRefreshKey, setInvoiceRefreshKey] = useState(0);

  
  const pdfPlugin = defaultLayoutPlugin();

  const handleInvoiceDataLoad = (data) => {
    setInvoiceData(data);
  };

  const refreshPayments = () => {
    setRefreshKey(prev => prev + 1);
  };

  const refreshInvoice = () => {
  setInvoiceRefreshKey(prev => prev + 1);
};


  const handleEditPayment = (payment) => {
    setEditPaymentData(payment);
    setIsPaymentOpen(true);
  };

  const handleNewPayment = () => {
    setEditPaymentData(null);
    setIsPaymentOpen(true);
  };

  const handleClosePayment = (shouldClose) => {
    setIsPaymentOpen(shouldClose);
    if (!shouldClose) {
      setEditPaymentData(null);
    }
  };

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

  const activeEventId = selectedInvoice ?? EventId;

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
              <h2 className="text-2xl font-bold text-primary">
                {invoiceData?.invoiceCode || "INV – 0001"}
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 sm:gap-4 w-full">

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
                onClick={handleNewPayment}
                disabled={!invoiceData}
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

           <PaymentReceived
  salesInvoiceData={invoiceData?.salesInvoiceData}
  onEditPayment={handleEditPayment}
  refreshKey={invoiceRefreshKey}
  onDueAmountLoad={(amount) => setApiDueAmount(amount)}
  onRefresh={refreshInvoice}
/>


            <InvoiceDetail 
  Eventid={activeEventId}
  refreshKey={invoiceRefreshKey}
  onInvoiceDataLoad={handleInvoiceDataLoad}
/>



          </div>
        </div>
      </div>

      {/* PDF Modal */}
      <Modal
        title={
          <FormattedMessage
            id="INVOICE.INVOICE_REPORT"
            defaultMessage="Invoice Report"
          />
        }
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
  setIsModalOpen={handleClosePayment}
  eventId={activeEventId}
  refreshData={() => {
    refreshInvoice();      
    setIsPaymentOpen(false);
  }}
  invoiceData={{
    ...invoiceData,
    due_amount: editPaymentData ? editPaymentData.due_amount : apiDueAmount,  // USE apiDueAmount
  }}
  editPayment={editPaymentData}
/>

    </>
  );
}