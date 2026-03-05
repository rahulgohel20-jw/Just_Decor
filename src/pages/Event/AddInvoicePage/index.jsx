import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { DatePicker, Input, Switch, Button, Spin } from "antd";
import ItemTable from "@/components/InvoiceTable/ItemTable";
import InvoiceFooter from "@/components/InvoiceTable/InvoiceFooter";
import {
  AddInvoice,
  UpdateInvoice,
  GetQuotationReport,
  GetInvoiceByEventId,
  GetQuotation,
} from "@/services/apiServices";
import dayjs from "dayjs";
import { Modal } from "antd";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Swal from "sweetalert2";

import { Tooltip, message } from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useLocation } from "react-router";
import { FormattedMessage, useIntl } from "react-intl";

dayjs.extend(customParseFormat);

const { TextArea } = Input;

const AddInvoicePage = () => {
  const location = useLocation();
  const intl = useIntl();

  // ✅ Destructure fromQuotation and quotationData from navigation state
  const {
    eventId,
    eventTypeId,
    fromQuotation,
    quotationData: passedQuotationData,
  } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [isEdited, setIsEdited] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState("");
  // PDF Modal states
  const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(false);
  const pdfPlugin = defaultLayoutPlugin();

  // New state for invoice footer data
  const [footerData, setFooterData] = useState({
    notes: "Thanks for your Business...",
    gst: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    discount: 0,
    roundOff: 0,
    subTotal: 0,
    totalAmount: 0,
    cgstAmnt: 0,
    sgstAmnt: 0,
    igstAmnt: 0,
    grandTotal: 0,
  });

  const responsiveStyles = `
  @media (max-width: 768px) {
    .event-info-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
    .event-info-item { flex-direction: column; align-items: flex-start !important; gap: 0.25rem; }
    .billing-grid { grid-template-columns: 1fr !important; }
    .billing-section { border-right: none !important; border-bottom: 1px solid #e5e7eb; }
    .mobile-field-label { display: block; font-size: 0.75rem; font-weight: 600; color: #6b7280; margin-bottom: 0.25rem; text-transform: uppercase; }
    .edit-actions { flex-direction: row; gap: 0.5rem; }
    .action-buttons { flex-direction: column; width: 100%; }
    .action-buttons button { width: 100%; justify-content: center; }
    .ant-modal { max-width: 95vw !important; margin: 0 auto; }
  }
  @media (min-width: 769px) {
    .mobile-field-label { display: none; }
  }
`;

  const [rows, setRows] = useState([
    {
      key: 1,
      name: "",
      date: "",
      person: "",
      extra: "",
      rate: "",
      amount: "",
    },
  ]);

  // Edit states for different sections
  const [editStates, setEditStates] = useState({
    billingAddress: false,
    shippingAddress: false,
    billingName: false,
    gstNumber: false,
  });

  // Temporary edit values
  const [tempValues, setTempValues] = useState({
    billingaddress: "",
    billingname: "",
    shipaddress: "",
    shipname: "",
    gstnumber: "",
  });

  const handleGenerateInvoiceReport = async () => {
    setLoadingPdf(true);
    const userId = localStorage.getItem("userId");

    await GetQuotationReport(eventId, userId, 1)
      .then((response) => {
        if (response.data) {
          const pdfPath = response.data?.report_path;
          setPdfUrl(pdfPath);
          setIsPdfModalVisible(true);
        }
      })
      .catch((error) => {
        console.error("Error generating invoice report:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to generate invoice PDF report",
          icon: "error",
          confirmButtonColor: "#005BA8",
        });
      })
      .finally(() => {
        setLoadingPdf(false);
      });
  };

  const handleSaveAndPrint = async () => {
    try {
      setLoadingPdf(true);

      const UserId = localStorage.getItem("userId");

      const formatDateForAPI = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = String(hours % 12 || 12).padStart(2, "0");
        return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
      };

      const convertDisplayDateToAPI = (displayDate) => {
        if (!displayDate) return null;
        try {
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(displayDate))
            return `${displayDate} 12:00 AM`;
          if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2} (AM|PM)$/.test(displayDate))
            return displayDate;
          const monthMap = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12",
          };
          const parts = displayDate.split(" ");
          if (parts.length === 3) {
            const day = parts[0].padStart(2, "0");
            const month = monthMap[parts[1]];
            const year = parts[2];
            if (month) return `${day}/${month}/${year} 12:00 AM`;
          }
          const date = new Date(displayDate);
          if (!isNaN(date.getTime())) {
            const d = String(date.getDate()).padStart(2, "0");
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const y = date.getFullYear();
            return `${d}/${m}/${y} 12:00 AM`;
          }
          return null;
        } catch (error) {
          console.error("Error converting date:", displayDate, error);
          return null;
        }
      };

      const totalAdvancePayment =
        invoiceData?.eventInvoiceFunctionPayments?.reduce(
          (sum, payment) => sum + (Number(payment.advancePayment) || 0),
          0,
        ) || 0;

      const remainingAmount = footerData.grandTotal - totalAdvancePayment;

      const payload = {
        billingaddress: tempValues.billingaddress || "",
        billingname: tempValues.billingname || "",
        cgst: String(footerData.cgst),
        cgstAmnt: footerData.cgstAmnt,
        discount: footerData.discount,
        duedate: dueDate ? dueDate.format("DD/MM/YYYY") : "",
        eventId: eventId,
        eventInvoiceFunctionPayments:
          invoiceData?.eventInvoiceFunctionPayments?.map((payment) => ({
            advancePayment: Number(payment.advancePayment) || 0,
            advancePaymentDate:
              payment.advancePaymentDate || formatDateForAPI(new Date()),
            advancePaymentNotes: payment.advancePaymentNotes || "",
            id: payment.id || 0,
          })) || [
            {
              advancePayment: 0,
              advancePaymentDate: formatDateForAPI(new Date()),
              advancePaymentNotes: "",
              id: 0,
            },
          ],
        grandTotal: footerData.grandTotal,
        gstnumber: tempValues.gstnumber || "",
        igst: String(footerData.igst),
        igstAmnt: footerData.igstAmnt,
        invoiceFunctionItems: rows.map((r) => ({
          amount: Number(r.amount) || 0,
          extraPax: Number(r.extra) || 0,
          functionDate: convertDisplayDateToAPI(r.date),
          functionName: r.name || "",
          id: r.id || 0,
          isEventFunction: !r.isCustom,
          pax: Number(r.person) || 0,
          ratePerPlate: Number(r.rate) || 0,
        })),
        notes: footerData.notes,
        remainingAmount: remainingAmount,
        roundOff: footerData.roundOff,
        sgst: String(footerData.sgst),
        sgstAmnt: footerData.sgstAmnt,
        shipaddress: tempValues.shipaddress || "",
        shipname: tempValues.shipname || "",
        subTotal: footerData.subTotal,
        totalAmount: footerData.totalAmount,
        userId: UserId,
      };

      const response = await UpdateInvoice(invoiceData?.id, payload);

      if (response?.data?.success === true) {
        setIsEdited(false);
        setRows((prevRows) =>
          prevRows.map((row) => ({ ...row, isNewRow: false, isCustom: true })),
        );
        await handleGenerateInvoiceReport();
      } else {
        throw new Error(response?.data?.msg || "Failed to save invoice");
      }
    } catch (error) {
      console.error("Save and print failed", error);
      Swal.fire({
        title: "Error",
        text: error?.message || "Unable to save and print invoice.",
        icon: "error",
        confirmButtonColor: "#d9534f",
      });
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleWhatsAppShare = (pdfUrl) => {
    const name = invoiceData?.event?.party?.nameEnglish || "there";
    const mobile = invoiceData?.event?.party?.mobileno || "";
    const msg = `Hi ${name},\nHope you're doing well!\n\nPlease find the invoice PDF below:\n${pdfUrl}\n\nThanks!`;
    const url = `https://api.whatsapp.com/send?phone=${mobile}&text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (invoiceData?.createdAt) {
      setInvoiceDate(invoiceData.createdAt.split("T")[0]);
    }
  }, [invoiceData]);

  useEffect(() => {
    if (invoiceData) {
      setTempValues({
        billingaddress: invoiceData.billingaddress || "",
        billingname: invoiceData.billingname || "",
        shipaddress: invoiceData.shipaddress || "",
        shipname: invoiceData.shipname || "",
        gstnumber: invoiceData.gstnumber || "",
      });
    }
  }, [invoiceData]);
  // ✅ MAIN EFFECT: decide which API to call
  useEffect(() => {
    if (!eventId) return;

    if (fromQuotation) {
      fetchFromQuotation();
    } else {
      fetchInvoiceData();
    }
  }, [eventId]);

  // ✅ MAIN EFFECT: decide which path to take based on fromQuotation flag
  const fetchFromQuotation = async () => {
    try {
      setLoading(true);
      const res = await GetQuotation(eventId, 1);
      console.log("datassss", res);
      // copyToInvoice = 1
      const apiData = res?.data?.data?.["Event Functions Quotation Details"];

      if (!apiData || apiData.length === 0) {
        message.warning("No quotation data found");
        return;
      }

      const qInfo = apiData[0];

      const formatAmount = (value) => {
        const num = Number(value) || 0;
        return num % 1 === 0 ? num.toString() : num.toFixed(2);
      };

      // Map functionQuotationItems → invoice rows
      const hasFunctionItems =
        qInfo.functionQuotationItems && qInfo.functionQuotationItems.length > 0;

      const mappedRows = hasFunctionItems
        ? qInfo.functionQuotationItems.map((item, index) => {
            // Convert "DD/MM/YYYY hh:mm A" string → display string
            let dateStr = "";
            if (item.functionDate) {
              const parsed = dayjs(item.functionDate, "DD/MM/YYYY hh:mm A");
              dateStr = parsed.isValid()
                ? parsed.format("DD MMM YYYY") // matches formatDateForDisplay output
                : item.functionDate;
            }
            return {
              key: `${index + 1}-${Math.random()}`,
              name: item.functionName || "",
              date: dateStr,
              person: item.pax ?? 0,
              extra: item.extraPax ?? 0,
              rate: item.ratePerPlate ?? 0,
              amount: item.amount ?? 0,
              isCustom: false,
              isEventFunction: item.isEventFunction === true,
              id: 0, // new invoice rows — no existing invoice item id
              isNewRow: false,
            };
          })
        : qInfo.event?.eventFunctions?.length > 0
          ? qInfo.event.eventFunctions.map((fn, index) => ({
              key: `${index + 1}-${Math.random()}`,
              name: fn.function?.nameEnglish || "",
              date: fn.functionStartDateTime
                ? dayjs(fn.functionStartDateTime).format("DD MMM YYYY")
                : "",
              person: fn.pax ?? 0,
              extra: 0,
              rate: fn.rate ?? 0,
              amount: (fn.pax ?? 0) * (fn.rate ?? 0),
              isCustom: false,
              isEventFunction: true,
              id: 0,
              isNewRow: false,
            }))
          : [
              {
                key: 1,
                name: "",
                date: "",
                person: "",
                extra: "",
                rate: "",
                amount: "",
                isCustom: true,
                isEventFunction: false,
                id: 0,
                isNewRow: true,
              },
            ];

      setRows(mappedRows);

      // Footer / tax
      setFooterData({
        notes: qInfo.notes || "Thanks for your Business...",
        gst: 0,
        cgst: parseFloat(qInfo.cgst) || 0,
        sgst: parseFloat(qInfo.sgst) || 0,
        igst: parseFloat(qInfo.igst) || 0,
        discount: parseFloat(qInfo.discount) || 0,
        roundOff: parseFloat(qInfo.roundOff) || 0,
        subTotal: parseFloat(qInfo.subTotal) || 0,
        totalAmount: parseFloat(qInfo.grandTotal) || 0,
        cgstAmnt: parseFloat(qInfo.cgstAmnt) || 0,
        sgstAmnt: parseFloat(qInfo.sgstAmnt) || 0,
        igstAmnt: parseFloat(qInfo.igstAmnt) || 0,
        grandTotal: parseFloat(qInfo.grandTotal) || 0,
      });

      // Billing fields
      setTempValues({
        billingaddress: qInfo.billingaddress || "",
        billingname: qInfo.billingname || "",
        shipaddress: qInfo.shipaddress || "",
        shipname: qInfo.shipname || "",
        gstnumber: qInfo.gstnumber || "",
      });

      // Due date
      if (qInfo.duedate) {
        const parsed = dayjs(qInfo.duedate, "DD/MM/YYYY");
        if (parsed.isValid()) setDueDate(parsed);
      }

      // Invoice date = today (new invoice)
      setInvoiceDate(dayjs().format("YYYY-MM-DD"));

      // Build synthetic invoiceData so the JSX renders party/venue/event info
      setInvoiceData({
        id: qInfo.invoiceId || null, // null = new invoice
        billingname: qInfo.billingname || "",
        billingaddress: qInfo.billingaddress || "",
        shipname: qInfo.shipname || "",
        shipaddress: qInfo.shipaddress || "",
        gstnumber: qInfo.gstnumber || "",
        notes: qInfo.notes || "",
        duedate: qInfo.duedate || "",
        createdAt: new Date().toISOString(),
        eventInvoiceFunctionPayments: [],
        event: qInfo.event || {
          inquiryDate: "",
          mobileno: qInfo.event?.mobileno || "",
          eventType: { nameEnglish: qInfo.event?.eventType?.nameEnglish || "" },
          party: {
            nameEnglish: qInfo.event?.party?.nameEnglish || "",
            mobileno: qInfo.event?.party?.mobileno || "",
          },
          venue: { nameEnglish: qInfo.event?.venue?.nameEnglish || "" },
        },
      });
    } catch (error) {
      console.error("Error fetching quotation for invoice:", error);
      message.error("Failed to load quotation data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Maps raw quotation API response (copyToInvoice=1) into invoice state.
  // passedQuotationData = the full quotation object from location.state.quotationData
  // which was passed from QuotationPage's handleCopyToInvoice.
  const loadFromQuotationApiResponse = (qData) => {
    setLoading(true);
    try {
      // --- ROWS: map functionQuotationItems → invoice rows ---
      const items = qData.functions || []; // already mapped in QuotationPage
      const mappedRows = items.map((fn, index) => {
        // fn.date may be a plain string "27/02/2026 08:00 AM" (already serialized)
        // or a serialized dayjs plain object { $d: Date, ... }
        let dateStr = "";
        if (fn.date) {
          if (typeof fn.date === "string") {
            dateStr = fn.date;
          } else {
            try {
              const rewrapped = dayjs(fn.date?.$d ?? fn.date);
              dateStr = rewrapped.isValid()
                ? rewrapped.format("DD/MM/YYYY hh:mm A")
                : "";
            } catch {
              dateStr = "";
            }
          }
        }
        return {
          key: `${index + 1}-${Math.random()}`,
          name: fn.name || "",
          date: dateStr,
          person: fn.persons ?? fn.pax ?? 0,
          extra: fn.extra ?? fn.extraPax ?? 0,
          rate: fn.rate ?? fn.ratePerPlate ?? 0,
          amount: fn.totalPrice ?? fn.amount ?? 0,
          isCustom: false,
          isEventFunction: fn.isFromQuotationItems === true,
          id: 0,
          isNewRow: false,
        };
      });

      setRows(
        mappedRows.length > 0
          ? mappedRows
          : [
              {
                key: 1,
                name: "",
                date: "",
                person: "",
                extra: "",
                rate: "",
                amount: "",
                isCustom: true,
                isEventFunction: false,
                id: 0,
                isNewRow: true,
              },
            ],
      );

      // --- FOOTER: tax/totals from quotation ---
      const cgstTax = (qData.taxDetails || []).find((t) => t.label === "CGST");
      const sgstTax = (qData.taxDetails || []).find((t) => t.label === "SGST");
      const igstTax = (qData.taxDetails || []).find((t) => t.label === "IGST");
      const discountTx = (qData.taxDetails || []).find(
        (t) => t.label === "Discount",
      );
      const roundOffTx = (qData.taxDetails || []).find(
        (t) => t.label === "Round Off",
      );

      setFooterData({
        notes: qData.notes || "Thanks for your Business...",
        gst: 0,
        cgst: parseFloat(cgstTax?.percentage || qData.cgst || 0),
        sgst: parseFloat(sgstTax?.percentage || qData.sgst || 0),
        igst: parseFloat(igstTax?.percentage || qData.igst || 0),
        discount: parseFloat(discountTx?.amount || qData.discount || 0),
        roundOff: parseFloat(roundOffTx?.amount || qData.roundOff || 0),
        subTotal: parseFloat(qData.subtotal || 0),
        totalAmount: parseFloat(qData.grandTotal || 0),
        cgstAmnt: parseFloat(qData.cgstAmnt || cgstTax?.amount || 0),
        sgstAmnt: parseFloat(qData.sgstAmnt || sgstTax?.amount || 0),
        igstAmnt: parseFloat(qData.igstAmnt || igstTax?.amount || 0),
        grandTotal: parseFloat(qData.grandTotal || 0),
      });

      // --- BILLING fields ---
      setTempValues({
        billingaddress: qData.billingaddress || "",
        billingname: qData.billingname || "",
        shipaddress: qData.shipaddress || "",
        shipname: qData.shipname || "",
        gstnumber: qData.gstnumber || "",
      });

      // --- DUE DATE ---
      if (qData.duedate) {
        const parsed = dayjs(qData.duedate, "DD/MM/YYYY");
        if (parsed.isValid()) setDueDate(parsed);
      }

      // --- INVOICE DATE: today (new invoice) ---
      setInvoiceDate(dayjs().format("YYYY-MM-DD"));

      // --- INVOICE DATA: build a synthetic invoiceData object ---
      // QuotationPage maps event fields to flat keys (partyName, venueName, etc.)
      // AND also passes the raw `event` object if available.
      // Build the nested shape that AddInvoicePage's JSX expects.
      setInvoiceData({
        id: qData.invoiceId || null,
        billingname: qData.billingname || "",
        billingaddress: qData.billingaddress || "",
        shipname: qData.shipname || "",
        shipaddress: qData.shipaddress || "",
        gstnumber: qData.gstnumber || "",
        notes: qData.notes || "",
        duedate: qData.duedate || "",
        createdAt: new Date().toISOString(),
        eventInvoiceFunctionPayments: [],
        // Build event object from either the raw event (if passed) or the flat fields
        event: qData.event || {
          inquiryDate: qData.estimateDate || "",
          mobileno: qData.mobileNumber || "",
          eventType: { nameEnglish: qData.eventName || "" },
          party: {
            nameEnglish: qData.partyName || "",
            mobileno: qData.mobileNumber || "",
          },
          venue: { nameEnglish: qData.venueName || "" },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceData = async () => {
    try {
      setLoading(true);
      const response = await GetInvoiceByEventId(eventId);

      if (response.status === 200 && response.data.data) {
        const invoiceDetailsArray =
          response?.data?.data?.["Event Invoice Details"];

        if (invoiceDetailsArray && invoiceDetailsArray.length > 0) {
          const invoiceDetails = invoiceDetailsArray[0];
          setInvoiceData(invoiceDetails);

          if (invoiceDetails.duedate) {
            setDueDate(dayjs(invoiceDetails.duedate, "DD/MM/YYYY"));
          }

          let mappedRows = [];

          const formatDateForDisplay = (dateString) => {
            if (!dateString) return "";
            try {
              let datePart = dateString.includes(" ")
                ? dateString.split(" ")[0]
                : dateString;
              const [day, month, year] = datePart.split("/");
              const date = new Date(year, month - 1, day);
              return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
            } catch (error) {
              console.error("Error formatting date:", dateString, error);
              return dateString;
            }
          };

          if (invoiceDetails?.invoiceFunctionItems?.length > 0) {
            mappedRows = invoiceDetails.invoiceFunctionItems.map(
              (item, index) => {
                const isManuallyAdded =
                  item.isEventFunction === false ||
                  (item.id > 0 && !item.isEventFunction);
                return {
                  key: `${index + 1}-${Math.random()}`,
                  name: item.functionName || item.name || "",
                  date: formatDateForDisplay(item.functionDate || item.date),
                  person: item.pax || item.person || 0,
                  extra: item.extraPax || item.extra || 0,
                  rate: item.ratePerPlate || item.rate || 0,
                  amount:
                    item.amount ||
                    (Number(item.person || item.pax || 0) +
                      Number(item.extra || item.extraPax || 0)) *
                      Number(item.rate || item.ratePerPlate || 0),
                  isCustom: isManuallyAdded,
                  isEventFunction: item.isEventFunction === true,
                  id: item.id || 0,
                  isNewRow: false,
                };
              },
            );
          } else if (invoiceDetails?.event?.eventFunctions?.length > 0) {
            mappedRows = invoiceDetails.event.eventFunctions.map(
              (func, index) => ({
                key: `${index + 1}-${Math.random()}`,
                name: func.function?.nameEnglish || "N/A",
                date: formatDateForDisplay(func.functionStartDateTime),
                person: func.pax || 0,
                extra: 0,
                rate: func.rate || 0,
                amount: (Number(func.pax || 0) + 0) * Number(func.rate || 0),
                isCustom: false,
                isEventFunction: true,
                id: 0,
              }),
            );
          }

          setRows(mappedRows.length > 0 ? mappedRows : rows);

          setTempValues({
            billingaddress: invoiceDetails.billingaddress || "",
            billingname: invoiceDetails.billingname || "",
            shipaddress: invoiceDetails.shipaddress || "",
            shipname: invoiceDetails.shipname || "",
            gstnumber: invoiceDetails.gstnumber || "",
          });

          setFooterData({
            notes: invoiceDetails.notes || "Thanks for your Business...",
            gst: 0,
            cgst: parseFloat(invoiceDetails.cgst) || 0,
            sgst: parseFloat(invoiceDetails.sgst) || 0,
            igst: parseFloat(invoiceDetails.igst) || 0,
            discount: parseFloat(invoiceDetails.discount) || 0,
            roundOff: parseFloat(invoiceDetails.roundOff) || 0,
            subTotal: parseFloat(invoiceDetails.subTotal) || 0,
            totalAmount: parseFloat(invoiceDetails.totalAmount) || 0,
            cgstAmnt: parseFloat(invoiceDetails.cgstAmnt) || 0,
            sgstAmnt: parseFloat(invoiceDetails.sgstAmnt) || 0,
            igstAmnt: parseFloat(invoiceDetails.igstAmnt) || 0,
            grandTotal: parseFloat(invoiceDetails.grandTotal) || 0,
          });
        } else {
          message.warning("No invoice data found");
        }
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      message.error("Failed to load invoice data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    setIsEdited(true);
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (field === "person" || field === "extra" || field === "rate") {
      const person = parseFloat(updatedRows[index].person) || 0;
      const extra = parseFloat(updatedRows[index].extra) || 0;
      const rate = parseFloat(updatedRows[index].rate) || 0;
      updatedRows[index].amount = (person + extra) * rate;
    }

    setRows(updatedRows);
  };

  const handleDeleteRow = (key) => {
    setIsEdited(true);
    setRows(rows.filter((row) => row.key !== key));
  };

  const handleAddRow = () => {
    setIsEdited(true);
    setRows([
      ...rows,
      {
        key: `${rows.length + 1}-${Math.random()}`,
        name: "",
        date: "",
        person: "",
        extra: 0,
        rate: 0,
        amount: 0,
        isCustom: true,
        isEventFunction: false,
        id: 0,
        isNewRow: true,
      },
    ]);
  };

  const handleFooterDataChange = (newFooterData) => {
    setIsEdited(true);
    setFooterData(newFooterData);
  };

  const toggleEdit = (field) => {
    setEditStates((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleTempValueChange = (field, value) => {
    setIsEdited(true);
    setTempValues((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = (field) => {
    setInvoiceData((prev) => ({ ...prev, ...tempValues }));
    toggleEdit(field);
    message.success("Changes saved successfully");
  };

  const cancelChanges = (field) => {
    setTempValues({
      billingaddress: invoiceData?.billingaddress || "",
      billingname: invoiceData?.billingname || "",
      shipaddress: invoiceData?.shipaddress || "",
      shipname: invoiceData?.shipname || "",
      gstnumber: invoiceData?.gstnumber || "",
    });
    toggleEdit(field);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dateString;
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      </Container>
    );
  }

  const handleSaveInvoice = async () => {
    const UserId = localStorage.getItem("userId");

    try {
      const formatDateForAPI = (date) => {
        if (!date) return null;
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = String(hours % 12 || 12).padStart(2, "0");
        return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
      };

      const convertDisplayDateToAPI = (displayDate) => {
        if (!displayDate) return null;
        try {
          if (/^\d{2}\/\d{2}\/\d{4}$/.test(displayDate))
            return `${displayDate} 12:00 AM`;
          if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2} (AM|PM)$/.test(displayDate))
            return displayDate;
          const monthMap = {
            Jan: "01",
            Feb: "02",
            Mar: "03",
            Apr: "04",
            May: "05",
            Jun: "06",
            Jul: "07",
            Aug: "08",
            Sep: "09",
            Oct: "10",
            Nov: "11",
            Dec: "12",
          };
          const parts = displayDate.split(" ");
          if (parts.length === 3) {
            const day = parts[0].padStart(2, "0");
            const month = monthMap[parts[1]];
            const year = parts[2];
            if (month) return `${day}/${month}/${year} 12:00 AM`;
          }
          const date = new Date(displayDate);
          if (!isNaN(date.getTime())) {
            const d = String(date.getDate()).padStart(2, "0");
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const y = date.getFullYear();
            return `${d}/${m}/${y} 12:00 AM`;
          }
          return null;
        } catch (error) {
          console.error("Error converting date:", displayDate, error);
          return null;
        }
      };

      const totalAdvancePayment =
        invoiceData?.eventInvoiceFunctionPayments?.reduce(
          (sum, payment) => sum + (Number(payment.advancePayment) || 0),
          0,
        ) || 0;

      const remainingAmount = footerData.grandTotal - totalAdvancePayment;

      const payload = {
        billingaddress: tempValues.billingaddress || "",
        billingname: tempValues.billingname || "",
        cgst: String(footerData.cgst),
        cgstAmnt: footerData.cgstAmnt,
        discount: footerData.discount,
        duedate: dueDate ? dueDate.format("DD/MM/YYYY") : "",
        eventId: eventId,
        eventInvoiceFunctionPayments:
          invoiceData?.eventInvoiceFunctionPayments?.map((payment) => ({
            advancePayment: Number(payment.advancePayment) || 0,
            advancePaymentDate:
              payment.advancePaymentDate || formatDateForAPI(new Date()),
            advancePaymentNotes: payment.advancePaymentNotes || "",
            id: payment.id || 0,
          })) || [
            {
              advancePayment: 0,
              advancePaymentDate: formatDateForAPI(new Date()),
              advancePaymentNotes: "",
              id: 0,
            },
          ],
        grandTotal: footerData.grandTotal,
        gstnumber: tempValues.gstnumber || "",
        igst: String(footerData.igst),
        igstAmnt: footerData.igstAmnt,
        invoiceFunctionItems: rows.map((r) => ({
          amount: Number(r.amount) || 0,
          extraPax: Number(r.extra) || 0,
          functionDate: convertDisplayDateToAPI(r.date),
          functionName: r.name || "",
          id: r.id || 0,
          isEventFunction: !r.isCustom,
          pax: Number(r.person) || 0,
          ratePerPlate: Number(r.rate) || 0,
        })),
        notes: footerData.notes,
        remainingAmount: remainingAmount,
        roundOff: footerData.roundOff,
        sgst: String(footerData.sgst),
        sgstAmnt: footerData.sgstAmnt,
        shipaddress: tempValues.shipaddress || "",
        shipname: tempValues.shipname || "",
        subTotal: footerData.subTotal,
        totalAmount: footerData.totalAmount,
        userId: UserId,
      };

      const response = await UpdateInvoice(invoiceData?.id, payload);

      if (response?.data?.success === true) {
        setIsEdited(false);
        Swal.fire({
          title: response?.data?.msg || "Invoice saved successfully!",
          text: "",
          icon: "success",
          background: "#f5faff",
          color: "#003f73",
          confirmButtonText: "Okay",
          confirmButtonColor: "#005BA8",
          customClass: {
            popup: "rounded-2xl shadow-xl",
            title: "text-2xl font-bold",
            confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
          },
        }).then(() => {
          setRows((prevRows) =>
            prevRows.map((row) => ({
              ...row,
              isNewRow: false,
              isCustom: true,
            })),
          );
          fetchInvoiceData();
        });
      } else {
        Swal.fire({
          title: "Failed to save invoice",
          text: response?.data?.msg || "Please try again later.",
          icon: "error",
          background: "#fff5f5",
          color: "#8b0000",
          confirmButtonText: "Retry",
          confirmButtonColor: "#d9534f",
          customClass: {
            popup: "rounded-2xl shadow-xl",
            title: "text-2xl font-bold",
            confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
          },
        });
      }
    } catch (error) {
      console.error("❌ Error saving invoice:", error);
      Swal.fire({
        title: "Something went wrong",
        text: error?.message || "Unable to save invoice. Please try again.",
        icon: "error",
        background: "#fff5f5",
        color: "#8b0000",
        confirmButtonText: "Okay",
        confirmButtonColor: "#d9534f",
        customClass: {
          popup: "rounded-2xl shadow-xl",
          title: "text-2xl font-bold",
          confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
        },
      });
    }
  };

  return (
    <Fragment>
      <style>{responsiveStyles}</style>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="INVOICE.TAX_INVOICE"
                    defaultMessage="Tax Invoice"
                  />
                ),
              },
            ]}
          />
        </div>

        <div className="flex flex-col bg-gray-100 rounded mb-7">
          <div className="flex flex-col bg-white rounded ">
            <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
              <div className="flex flex-col p-4 gap-4">
                {/* Event Name - Full Width */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-base lg:text-lg font-semibold text-gray-900">
                    <FormattedMessage
                      id="INVOICE.EVENT_NAME"
                      defaultMessage="Event Name"
                    />
                    : {invoiceData?.event?.eventType?.nameEnglish || "Sangeet"}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 sm:self-start">
                    <button
                      className="btn btn-primary w-full sm:w-auto"
                      onClick={handleSaveAndPrint}
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
                          <i className="ki-filled ki-printer"></i>
                          <FormattedMessage
                            id="COMMON.PRINT"
                            defaultMessage="Print"
                          />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Event Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  <div className="flex items-start gap-3">
                    <i className="ki-filled ki-user text-success text-lg flex-shrink-0 mt-1"></i>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-600">
                        <FormattedMessage
                          id="INVOICE.PARTY_NAME"
                          defaultMessage="Party name"
                        />
                        :
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {invoiceData?.event?.party?.nameEnglish || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <i className="ki-filled ki-geolocation-home text-success text-lg flex-shrink-0 mt-1"></i>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-600">
                        <FormattedMessage
                          id="INVOICE.VENUE_NAME"
                          defaultMessage="Venue name"
                        />
                        :
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {invoiceData?.event?.venue?.nameEnglish || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <i className="ki-filled ki-calendar-tick text-success text-lg flex-shrink-0 mt-1"></i>
                    <div className="flex flex-col min-w-0 w-full">
                      <span className="text-xs text-gray-600">
                        <FormattedMessage
                          id="INVOICE.INVOICE_DATE"
                          defaultMessage="Invoice Date"
                        />
                        :
                      </span>
                      <div className="flex items-center gap-2 w-full">
                        {!isEditing ? (
                          <>
                            <span className="text-sm font-medium text-gray-900">
                              {formatDate(invoiceDate)}
                            </span>
                            <button
                              type="button"
                              className="text-primary hover:text-primary-dark"
                              onClick={() => setIsEditing(true)}
                            >
                              <i className="ki-filled ki-pencil text-sm"></i>
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 w-full">
                            <input
                              type="date"
                              value={invoiceDate}
                              onChange={(e) => {
                                setInvoiceDate(e.target.value);
                                setIsEdited(true);
                              }}
                              className="input text-sm py-1 px-2 flex-1"
                              autoFocus
                            />
                            <button
                              type="button"
                              className="text-success hover:text-success-dark"
                              onClick={() => setIsEditing(false)}
                            >
                              <i className="ki-filled ki-check text-sm"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <i className="ki-filled ki-calendar-tick text-success text-lg flex-shrink-0 mt-1"></i>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-600">
                        <FormattedMessage
                          id="INVOICE.EVENT_DATE"
                          defaultMessage="Event Date"
                        />
                        :
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(invoiceData?.event?.inquiryDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <i className="ki-filled ki-calendar-tick text-success text-lg flex-shrink-0 mt-1"></i>
                    <div className="flex flex-col min-w-0 w-full">
                      <span className="text-xs text-gray-600">
                        <FormattedMessage
                          id="INVOICE.DUE_DATE"
                          defaultMessage="Due Date"
                        />
                        :
                      </span>
                      <DatePicker
                        format="DD/MM/YYYY"
                        className="input w-full text-sm"
                        value={dueDate}
                        placeholder="Select due date"
                        onChange={(date) => {
                          setDueDate(date);
                          setIsEdited(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing */}
            <div className="flex flex-col border rounded-xl mb-5">
              <div className="grid md:grid-cols-2 rounded">
                {/* Billing Address */}
                <div className="border-r p-4 rounded">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    <FormattedMessage
                      id="INVOICE.CATERING_DETAILS"
                      defaultMessage="Catering Details"
                    />
                    :
                    {editStates.billingAddress ? (
                      <>
                        <Tooltip title={<FormattedMessage id="COMMON.SAVE" />}>
                          <CheckOutlined
                            className="text-green-600 ms-2 cursor-pointer"
                            onClick={() => saveChanges("billingAddress")}
                          />
                        </Tooltip>
                        <Tooltip
                          title={<FormattedMessage id="COMMON.CANCEL" />}
                        >
                          <CloseOutlined
                            className="text-red-600 ms-2 cursor-pointer"
                            onClick={() => cancelChanges("billingAddress")}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip title={<FormattedMessage id="COMMON.EDIT" />}>
                        <EditOutlined
                          className="text-primary ms-2 cursor-pointer"
                          onClick={() => toggleEdit("billingAddress")}
                        />
                      </Tooltip>
                    )}
                  </h4>
                  {editStates.billingAddress ? (
                    <div className="space-y-2">
                      <TextArea
                        value={tempValues.billingaddress}
                        onChange={(e) =>
                          handleTempValueChange(
                            "billingaddress",
                            e.target.value,
                          )
                        }
                        placeholder={intl.formatMessage({
                          id: "PLACEHOLDER.ENTER_BILLING_ADDRESS",
                          defaultMessage: "Enter billing address",
                        })}
                        rows={3}
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">
                      {invoiceData?.billingaddress || (
                        <FormattedMessage id="COMMON.NA" />
                      )}
                      <br />
                    </p>
                  )}
                </div>

                {/* Shipping Address */}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    <FormattedMessage
                      id="INVOICE.BILLING_TO"
                      defaultMessage="Billing To"
                    />
                    :
                    {editStates.shippingAddress ? (
                      <>
                        <Tooltip title={<FormattedMessage id="COMMON.SAVE" />}>
                          <CheckOutlined
                            className="text-green-600 ms-2 cursor-pointer"
                            onClick={() => saveChanges("shippingAddress")}
                          />
                        </Tooltip>
                        <Tooltip
                          title={<FormattedMessage id="COMMON.CANCEL" />}
                        >
                          <CloseOutlined
                            className="text-red-600 ms-2 cursor-pointer"
                            onClick={() => cancelChanges("shippingAddress")}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip title={<FormattedMessage id="COMMON.EDIT" />}>
                        <EditOutlined
                          className="text-primary ms-2 cursor-pointer"
                          onClick={() => toggleEdit("shippingAddress")}
                        />
                      </Tooltip>
                    )}
                  </h4>
                  <div className="flex items-start">
                    {editStates.shippingAddress ? (
                      <div className="space-y-2 w-full">
                        <TextArea
                          value={tempValues.shipaddress}
                          onChange={(e) =>
                            handleTempValueChange("shipaddress", e.target.value)
                          }
                          placeholder={intl.formatMessage({
                            id: "PLACEHOLDER.ENTER_SHIPPING_ADDRESS",
                            defaultMessage: "Enter shipping address",
                          })}
                          rows={3}
                        />
                        <Input
                          value={tempValues.shipname}
                          onChange={(e) =>
                            handleTempValueChange("shipname", e.target.value)
                          }
                          placeholder={intl.formatMessage({
                            id: "PLACEHOLDER.ENTER_SHIPPING_NAME",
                            defaultMessage: "Enter shipping name",
                          })}
                        />
                      </div>
                    ) : invoiceData?.shipaddress ? (
                      <p className="text-sm text-gray-700">
                        {invoiceData.shipaddress}
                        <br />
                        {invoiceData.shipname || ""}
                      </p>
                    ) : (
                      <div>
                        <span className="text-sm text-primary">+</span>
                        <span className="text-sm text-primary cursor-pointer ms-1 hover:underline">
                          <FormattedMessage
                            id="INVOICE.ADD_NEW_ADDRESS"
                            defaultMessage="Add a New Address"
                          />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* GST Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 border-t">
                <div className="p-4 border-b md:border-b-0 md:border-r">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        <FormattedMessage
                          id="INVOICE.BILLING_NAME"
                          defaultMessage="Billing Name"
                        />
                      </span>
                      {!editStates.billingName && (
                        <Tooltip title={<FormattedMessage id="COMMON.EDIT" />}>
                          <button
                            className="text-primary hover:text-primary-dark p-1"
                            onClick={() => toggleEdit("billingName")}
                          >
                            <EditOutlined />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                    {editStates.billingName ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={tempValues.billingname}
                          onChange={(e) =>
                            handleTempValueChange("billingname", e.target.value)
                          }
                          placeholder={intl.formatMessage({
                            id: "PLACEHOLDER.ENTER_BILLING_NAME",
                            defaultMessage: "Enter billing name",
                          })}
                          className="flex-1"
                        />
                        <Tooltip title={<FormattedMessage id="COMMON.SAVE" />}>
                          <button
                            className="text-green-600 hover:text-green-700 p-1"
                            onClick={() => saveChanges("billingName")}
                          >
                            <CheckOutlined />
                          </button>
                        </Tooltip>
                        <Tooltip
                          title={<FormattedMessage id="COMMON.CANCEL" />}
                        >
                          <button
                            className="text-red-600 hover:text-red-700 p-1"
                            onClick={() => cancelChanges("billingName")}
                          >
                            <CloseOutlined />
                          </button>
                        </Tooltip>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-700">
                        {tempValues.billingname || (
                          <FormattedMessage id="COMMON.NA" />
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        <FormattedMessage
                          id="INVOICE.GST_NUMBER"
                          defaultMessage="GST Number"
                        />
                      </span>
                      {!editStates.gstNumber && (
                        <Tooltip title={<FormattedMessage id="COMMON.EDIT" />}>
                          <button
                            className="text-primary hover:text-primary-dark p-1"
                            onClick={() => toggleEdit("gstNumber")}
                          >
                            <EditOutlined />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                    {editStates.gstNumber ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={tempValues.gstnumber}
                          onChange={(e) =>
                            handleTempValueChange("gstnumber", e.target.value)
                          }
                          placeholder={intl.formatMessage({
                            id: "PLACEHOLDER.ENTER_GST_NUMBER",
                            defaultMessage: "Enter GST number",
                          })}
                          className="flex-1"
                        />
                        <Tooltip title={<FormattedMessage id="COMMON.SAVE" />}>
                          <button
                            className="text-green-600 hover:text-green-700 p-1"
                            onClick={() => saveChanges("gstNumber")}
                          >
                            <CheckOutlined />
                          </button>
                        </Tooltip>
                        <Tooltip
                          title={<FormattedMessage id="COMMON.CANCEL" />}
                        >
                          <button
                            className="text-red-600 hover:text-red-700 p-1"
                            onClick={() => cancelChanges("gstNumber")}
                          >
                            <CloseOutlined />
                          </button>
                        </Tooltip>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-700">
                        {tempValues.gstnumber || (
                          <FormattedMessage id="COMMON.NA" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <ItemTable
              rows={rows}
              onInputChange={handleInputChange}
              onAddRow={handleAddRow}
              onDeleteRow={handleDeleteRow}
            />

            <InvoiceFooter
              invoiceData={invoiceData}
              rows={rows}
              footerData={footerData}
              onFooterDataChange={handleFooterDataChange}
              onSave={handleSaveInvoice}
              isEdited={isEdited}
            />
          </div>
        </div>
      </Container>

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
        width="95%"
        style={{ top: 20, maxWidth: "1200px" }}
        footer={[
          <div
            key="footer"
            className="flex flex-col sm:flex-row justify-end gap-2"
          >
            <button
              onClick={() => handleWhatsAppShare(pdfUrl)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="hidden sm:inline">Share on WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>
            <button
              className="btn btn-light w-full sm:w-auto"
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
      >
        <div style={{ height: "70vh" }}>
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
    </Fragment>
  );
};

export default AddInvoicePage;
