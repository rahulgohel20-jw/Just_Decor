import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { toAbsoluteUrl } from "@/utils/Assets";
import { KeenIcon } from "@/components";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Tooltip, DatePicker, Popconfirm } from "antd";
import { useParams } from "react-router-dom";
import { successMsgPopup } from "../../../underConstruction";
import { useNavigate } from "react-router-dom";
import {
  GetQuotation,
  UpdateQuotation,
  DeleteQuotation,
  GetQuotationReport,
} from "@/services/apiServices";
import useStyles from "./style";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Swal from "sweetalert2";
import { FormattedMessage, useIntl } from "react-intl";
dayjs.extend(customParseFormat);
import { Modal } from "antd";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
const QuotationPage = () => {
  const classes = useStyles();
  const [quotationId, setQuotationId] = useState(null);
  const { eventId } = useParams();
  const [billingName, setBillingName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const todayDate = new Date().toLocaleDateString("en-GB");
  const [isEdited, setIsEdited] = useState(false);
  const [isQuotationDateEditing, setIsQuotationDateEditing] = useState(false);
  const [quotationDate, setQuotationDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [originalFunctions, setOriginalFunctions] = useState([]);
  const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(false);
  const pdfPlugin = defaultLayoutPlugin();
  const navigate = useNavigate();

  const intl = useIntl();

  const responsiveStyles = `
  /* Mobile Optimizations */
  @media (max-width: 768px) {
    /* Event Details Card */
    .event-header-actions {
      flex-direction: column;
      width: 100%;
    }
    
    .event-header-actions > div {
      width: 100%;
    }
    
    /* Function Table */
    .function-table-header {
      display: none !important;
    }
    
    .function-row {
      flex-direction: column !important;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem !important;
      margin-bottom: 1rem;
      background: white;
    }
    
    .function-cell {
      width: 100% !important;
      padding: 0.5rem 0 !important;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .function-cell:last-child {
      border-bottom: none;
    }
    
    .mobile-field-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      margin-bottom: 0.25rem;
      text-transform: uppercase;
    }
    
    /* Summary Section */
    .summary-row {
      padding: 0.75rem 1rem !important;
    }
    
    .summary-label,
    .summary-value {
      font-size: 0.875rem !important;
    }
    
    /* Tax Details */
    .tax-row {
      flex-direction: column;
      align-items: flex-start !important;
      gap: 0.5rem;
    }
    
    .tax-input-group {
      width: 100% !important;
    }
    
    /* Payment Details */
    .payment-card {
      padding: 0.75rem !important;
    }
    
    /* Buttons */
    .btn-group-mobile {
      flex-direction: column;
      width: 100%;
    }
    
    .btn-group-mobile button {
      width: 100%;
    }
  }
  
  @media (min-width: 769px) {
    .mobile-field-label {
      display: none;
    }
    
    .function-row {
      display: flex !important;
      flex-direction: row !important;
    }
  }
`;

  const [quotationData, setQuotationData] = useState({
    eventName: "",
    partyName: "",
    venueName: "",
    estimateDate: "",
    mobileNumber: "",
    functions: [
      {
        id: 1,
        name: "",
        date: null,
        persons: "",
        // extra: 0,
        rate: "",
        totalPrice: "",
      },
    ],
    taxDetails: [
      { label: "CGST", percentage: "", amount: "0" },
      { label: "SGST", percentage: "", amount: "0" },
      { label: "IGST", percentage: "", amount: "0" },
      { label: "Discount", percentage: "", amount: "0" },
      { label: "Round Off", percentage: "", amount: "0" },
    ],
    grandTotal: "0",
    advancePayments: [
      {
        id: 0,
        amount: "0",
        date: dayjs(),
        description: "",
      },
    ],
    totalPaid: "0",
    remainingPayment: "0",
    notes: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchTerm.trim()) {
        setQuotationData((prev) => ({
          ...prev,
          functions: originalFunctions,
        }));
        return;
      }

      const normalize = (v = "") =>
        v.toString().toLowerCase().replace(/\s+/g, "");

      const filtered = originalFunctions.filter((fn) => {
        return (
          normalize(fn.name).includes(normalize(searchTerm)) ||
          (fn.date &&
            normalize(fn.date.format("DD/MM/YYYY hh:mm A")).includes(
              normalize(searchTerm),
            ))
        );
      });

      setQuotationData((prev) => ({
        ...prev,
        functions: filtered,
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, originalFunctions]);

  useEffect(() => {
    if (quotationData?.QuotationDate) {
      setQuotationDate(dayjs(quotationData.QuotationDate).format("YYYY-MM-DD"));
    }
  }, [quotationData?.QuotationDate]);

  useEffect(() => {
    FetchGetQuotation();
  }, []);

  const formatAmount = (value) => {
    const num = Number(value) || 0;
    return num % 1 === 0 ? num.toString() : num.toFixed(2);
  };

  const FetchGetQuotation = () => {
    GetQuotation(eventId)
      .then((res) => {
        const apiData = res?.data?.data?.["Event Functions Quotation Details"];

        if (apiData && apiData.length > 0) {
          const quotationInfo = apiData[0];

          const hasFunctionQuotationItems =
            quotationInfo.functionQuotationItems &&
            quotationInfo.functionQuotationItems.length > 0;

          const mappedData = {
            quotationId: quotationInfo.id,
            QuotationDate:
              quotationInfo.quotationdate ||
              quotationInfo.createdAt ||
              todayDate,
            eventName: quotationInfo.event?.eventType?.nameEnglish || "Event",
            partyName: quotationInfo.event?.party?.nameEnglish || "",
            billingname: quotationInfo.billingname || "",
            gstnumber: quotationInfo.gstnumber || "",
            duedate: quotationInfo.duedate || "",
            venueName: quotationInfo.event?.venue.nameEnglish || "",
            mobileNumber: quotationInfo.event?.mobileno || "-",
            estimateDate: quotationInfo.event?.eventStartDateTime
              ? new Date(
                  quotationInfo.event.eventStartDateTime,
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "",
            functions: hasFunctionQuotationItems
              ? quotationInfo.functionQuotationItems.map((item, index) => ({
                  id: item.id || 0,
                  name: item.functionName || "",
                  date:
                    item.functionDate &&
                    dayjs(item.functionDate, "DD/MM/YYYY hh:mm A").isValid()
                      ? dayjs(item.functionDate, "DD/MM/YYYY hh:mm A")
                      : null,
                  persons: item.pax?.toString() || "",
                  extra: 0,
                  rate: item.ratePerPlate?.toString() || "",
                  totalPrice: formatAmount(item.amount),
                  isFromQuotationItems: item.isEventFunction,
                }))
              : quotationInfo.event?.eventFunctions?.length > 0
                ? quotationInfo.event.eventFunctions.map(
                    (eventFunc, index) => ({
                      id: 0,
                      name: eventFunc.function?.nameEnglish || "",
                      date: eventFunc.functionStartDateTime
                        ? dayjs(
                            eventFunc.functionStartDateTime,
                            "DD/MM/YYYY hh:mm A",
                          )
                        : null,
                      persons: eventFunc.pax?.toString() || "",
                      extra: 0,
                      rate: eventFunc.rate?.toString() || "",
                      totalPrice:
                        eventFunc.pax && eventFunc.rate
                          ? eventFunc.pax * eventFunc.rate
                          : "0",
                      isFromQuotationItems: true,
                    }),
                  )
                : [
                    {
                      id: 1,
                      name: "",
                      date: null,
                      persons: "",
                      extra: "",
                      rate: "",
                      totalPrice: "0",
                      isFromQuotationItems: false,
                    },
                  ],

            taxDetails: [
              {
                label: "CGST",
                percentage: quotationInfo.cgst || "0",
                amount: quotationInfo.cgstAmnt || 0,
              },
              {
                label: "SGST",
                percentage: quotationInfo.sgst || "0",
                amount: quotationInfo.sgstAmnt || 0,
              },
              {
                label: "IGST",
                percentage: quotationInfo.igst || "0",
                amount: quotationInfo.igstAmnt || 0,
              },
              {
                label: "Discount",
                percentage: "0",
                amount: quotationInfo.discount || 0,
              },
              {
                label: "Round Off",
                percentage: "0",
                amount: quotationInfo.roundOff || 0,
              },
            ],

            grandTotal: quotationInfo.grandTotal || 0,
            totalPaid: quotationInfo.advancePayment || 0,
            remainingPayment: quotationInfo.remainingAmount || 0,

            advancePayments:
              quotationInfo.eventFunctionQuotationPayments &&
              Array.isArray(quotationInfo.eventFunctionQuotationPayments)
                ? quotationInfo.eventFunctionQuotationPayments.map((p) => ({
                    id: p.id || 0,
                    amount: p.advancePayment || 0,
                    date:
                      p.advancePaymentDate &&
                      dayjs(
                        p.advancePaymentDate,
                        "DD/MM/YYYY hh:mm A",
                      ).isValid()
                        ? dayjs(p.advancePaymentDate, "DD/MM/YYYY hh:mm A")
                        : null,
                    description: p.advancePaymentNotes || "",
                  }))
                : [
                    {
                      id: p.id || 0,
                      amount: quotationInfo.advancePayment || 0,
                      date:
                        quotationInfo.advancePaymentDate &&
                        dayjs(
                          quotationInfo.advancePaymentDate,
                          "DD/MM/YYYY hh:mm A",
                        ).isValid()
                          ? dayjs(
                              quotationInfo.advancePaymentDate,
                              "DD/MM/YYYY hh:mm A",
                            )
                          : null,
                      description: quotationInfo.advancePaymentNotes || "",
                    },
                  ],

            notes: quotationInfo.notes || "",
          };

          setQuotationId(mappedData.quotationId);
          setQuotationData(mappedData);
          setOriginalFunctions(mappedData.functions);
        }
      })
      .catch((error) => {
        console.log("Error fetching quotation:", error);
      });
  };

  const calculateTotals = () => {
    const subtotal = quotationData.functions.reduce((sum, func) => {
      const total = parseFloat(func.totalPrice) || 0;
      return sum + total;
    }, 0);

    const discountAmount = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "Discount")
        ?.amount || 0,
    );

    // Amount after discount - this is the taxable amount
    const amountAfterDiscount = subtotal - discountAmount;

    const cgstDetail = quotationData.taxDetails.find(
      (tax) => tax.label === "CGST",
    );
    const sgstDetail = quotationData.taxDetails.find(
      (tax) => tax.label === "SGST",
    );
    const igstDetail = quotationData.taxDetails.find(
      (tax) => tax.label === "IGST",
    );

    const cgstPercentage = parseFloat(cgstDetail?.percentage || 0);
    const sgstPercentage = parseFloat(sgstDetail?.percentage || 0);
    const igstPercentage = parseFloat(igstDetail?.percentage || 0);

    // Calculate tax amounts on the discounted amount
    const cgstAmount = (amountAfterDiscount * cgstPercentage) / 100;
    const sgstAmount = (amountAfterDiscount * sgstPercentage) / 100;
    const igstAmount = (amountAfterDiscount * igstPercentage) / 100;

    const roundOffAmount = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "Round Off")
        ?.amount || 0,
    );

    const totalTaxAmount = cgstAmount + sgstAmount + igstAmount;

    // Grand Total: Subtotal - Discount + Taxes + Round Off
    const grandTotal = amountAfterDiscount + totalTaxAmount + roundOffAmount;

    const totalPaid = (quotationData.advancePayments || []).reduce((sum, p) => {
      const val = parseFloat(p.amount) || 0;
      return sum + val;
    }, 0);

    const remaining = Math.max(0, grandTotal - totalPaid);

    return {
      subtotal: formatAmount(subtotal),
      discountAmount: formatAmount(discountAmount),
      amountAfterDiscount: formatAmount(amountAfterDiscount),
      cgstAmount: formatAmount(cgstAmount),
      sgstAmount: formatAmount(sgstAmount),
      igstAmount: formatAmount(igstAmount),
      totalTaxAmount: formatAmount(totalTaxAmount),
      roundOffAmount: formatAmount(roundOffAmount),
      grandTotal: formatAmount(grandTotal),
      totalPaid: formatAmount(totalPaid),
      remainingPayment: formatAmount(remaining),
    };
  };

  const totals = calculateTotals();

  const handleAddFunction = () => {
    setQuotationData((prev) => ({
      ...prev,
      functions: [
        ...prev.functions,
        {
          id: 0,
          name: "",
          date: null,
          persons: "",
          rate: "",
          totalPrice: "0",
          isFromQuotationItems: false,
          isNewFunction: true,
          isLocked: false, // NEW
        },
      ],
    }));
  };

  const handleDeleteFunction = (itemId, index) => {
    if (index === 0) return;

    if (itemId && itemId !== 0) {
      DeleteQuotation(itemId)
        .then((response) => {
          FetchGetQuotation();
          response.data?.msg && successMsgPopup(response.data.msg);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setQuotationData((prev) => ({
        ...prev,
        functions: prev.functions.filter((_, idx) => idx !== index),
      }));
    }
  };

  const handleFunctionChange = (index, field, value) => {
    setIsEdited(true);
    const newFunctions = [...quotationData.functions];
    newFunctions[index][field] = value;

    if (field === "persons" || field === "rate") {
      const persons = parseFloat(newFunctions[index].persons) || 0;
      // const extra = parseFloat(newFunctions[index].extra) || 0;
      const rate = parseFloat(newFunctions[index].rate) || 0;

      const total = persons * rate;
      newFunctions[index].totalPrice =
        total % 1 === 0 ? total.toString() : total.toFixed(2);
    }

    if (field === "totalPrice") {
      const total = parseFloat(value) || 0;
      newFunctions[index].totalPrice =
        total % 1 === 0 ? total.toString() : total.toFixed(2);
    }

    setQuotationData((prev) => ({
      ...prev,
      functions: newFunctions,
    }));
  };

  const handleNotesChange = (e) => {
    const value = e.target.value;
    setQuotationData((prev) => ({ ...prev, notes: value }));
    setIsEdited(true);
  };

  const buildPayload = () => {
    let Id = localStorage.getItem("userId");

    const subtotal = quotationData.functions.reduce((sum, fn) => {
      const total = parseFloat(fn.totalPrice) || 0;
      return sum + total;
    }, 0);

    const discount = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "Discount")
        ?.amount || 0,
    );

    // Amount after discount - this is the taxable amount
    const amountAfterDiscount = subtotal - discount;

    const roundOff = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "Round Off")
        ?.amount || 0,
    );
    const cgstDetail = quotationData.taxDetails.find(
      (tax) => tax.label === "CGST",
    );
    const sgstDetail = quotationData.taxDetails.find(
      (tax) => tax.label === "SGST",
    );
    const igstDetail = quotationData.taxDetails.find(
      (tax) => tax.label === "IGST",
    );

    const cgstPercentage = parseFloat(cgstDetail?.percentage || 0);
    const sgstPercentage = parseFloat(sgstDetail?.percentage || 0);
    const igstPercentage = parseFloat(igstDetail?.percentage || 0);

    // Calculate taxes on the discounted amount
    const cgstAmnt = (amountAfterDiscount * cgstPercentage) / 100;
    const sgstAmnt = (amountAfterDiscount * sgstPercentage) / 100;
    const igstAmnt = (amountAfterDiscount * igstPercentage) / 100;

    const totalAmount =
      amountAfterDiscount + cgstAmnt + sgstAmnt + igstAmnt + roundOff;

    const grandTotal =
      amountAfterDiscount + cgstAmnt + sgstAmnt + igstAmnt + roundOff;
    const payments = (quotationData.advancePayments || []).map((p) => ({
      id: p.id || 0,
      advancePayment: parseFloat(p.amount) || 0,
      advancePaymentDate: p.date ? p.date.format("DD/MM/YYYY hh:mm A") : null,
      advancePaymentNotes: p.description || "",
    }));
    const totalPaid = (quotationData.advancePayments || []).reduce((sum, p) => {
      const val = parseFloat(p.amount) || 0;
      return sum + val;
    }, 0);

    const sumAdvance = payments.reduce(
      (s, p) => s + (p.advancePayment || 0),
      0,
    );
    const remainingAmount = Math.max(0, totalAmount - sumAdvance);

    // Format quotation date for payload

    let formattedQuotationDate;

    if (
      quotationDate &&
      quotationDate !== "Invalid Date" &&
      quotationDate.trim() !== ""
    ) {
      // User edited the date - it's in YYYY-MM-DD format from HTML input
      const parsed = dayjs(quotationDate, "YYYY-MM-DD");
      if (parsed.isValid()) {
        formattedQuotationDate = parsed.format("DD/MM/YYYY");
        console.log(
          "Using edited quotationDate (YYYY-MM-DD → DD/MM/YYYY):",
          formattedQuotationDate,
        );
      } else {
        // Invalid edited date, use QuotationDate
        formattedQuotationDate =
          quotationData.QuotationDate || dayjs().format("DD/MM/YYYY");
        console.log(
          "Edited date invalid, using QuotationDate or today:",
          formattedQuotationDate,
        );
      }
    } else if (quotationData.QuotationDate) {
      // Date from API - already in DD/MM/YYYY format
      const parsed = dayjs(quotationData.QuotationDate, "DD/MM/YYYY");
      if (parsed.isValid()) {
        formattedQuotationDate = parsed.format("DD/MM/YYYY");
        console.log(
          "Using QuotationDate (already DD/MM/YYYY):",
          formattedQuotationDate,
        );
      } else {
        // Fallback: try to parse as ISO
        const parsedISO = dayjs(quotationData.QuotationDate);
        formattedQuotationDate = parsedISO.isValid()
          ? parsedISO.format("DD/MM/YYYY")
          : dayjs().format("DD/MM/YYYY");
        console.log("Parsed as ISO or using today:", formattedQuotationDate);
      }
    } else {
      // Default to today
      formattedQuotationDate = dayjs().format("DD/MM/YYYY");
      console.log("Using today's date:", formattedQuotationDate);
    }

    console.log("Final formattedQuotationDate:", formattedQuotationDate);
    console.log("=== END QUOTATION DATE DEBUG ===\n");

    const payload = {
      eventFunctionQuotationPayments: payments,
      discount: discount,
      eventId: parseInt(eventId),
      functionQuotationItems: quotationData.functions.map((fn) => ({
        amount: parseFloat(fn.totalPrice) || 0,
        extraPax: 0,
        functionDate: fn.date ? fn.date.format("DD/MM/YYYY hh:mm A") : null,
        functionName: fn.name,
        id: fn.id && fn.id !== 0 ? fn.id : 0,
        pax: parseInt(fn.persons) || 0,
        ratePerPlate: parseFloat(fn.rate) || 0,
        isEventFunction: fn.isFromQuotationItems === true,
      })),
      subTotal: parseFloat(subtotal),
      grandTotal: grandTotal,
      cgst: `${cgstPercentage}`,
      cgstAmnt: cgstAmnt,
      sgst: `${sgstPercentage}`,
      sgstAmnt: sgstAmnt,
      igst: `${igstPercentage}`,
      igstAmnt: igstAmnt,
      notes: quotationData.notes,
      remainingAmount: remainingAmount,
      roundOff: roundOff,
      totalAmount: totalPaid,
      userId: parseInt(Id),
      billingname: billingName || quotationData.billingname || "",
      duedate: dueDate
        ? dueDate.format("DD/MM/YYYY")
        : quotationData.duedate || "",
      gstnumber: gstNumber || quotationData.gstnumber || "",
      quotationdate: formattedQuotationDate,
    };

    return payload;
  };

  const handleSaveNotes = () => {
    const payload = buildPayload();
    if (!quotationId) {
      console.error("No quotationId available to save notes");
      Swal.fire({
        title: "Error",
        text: "No quotation ID found. Please refresh and try again.",
        icon: "error",
        background: "#fff5f5",
        color: "#7a0000",
        confirmButtonText: "Okay",
        confirmButtonColor: "#d33",
        customClass: {
          popup: "rounded-2xl shadow-xl",
          title: "text-2xl font-bold",
          confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
        },
      });
      return;
    }

    // Validate that all advance payment dates are set
    const hasEmptyDate = quotationData.advancePayments.some(
      (payment) => !payment.date,
    );
    if (hasEmptyDate) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select a date and time for all advance payments.",
        icon: "warning",
        background: "#fffbf0",
        color: "#8B4513",
        confirmButtonText: "Okay",
        confirmButtonColor: "#FFA500",
        customClass: {
          popup: "rounded-2xl shadow-xl",
          title: "text-2xl font-bold",
          confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
        },
      });
      return;
    }

    UpdateQuotation(quotationId, payload)
      .then((response) => {
        if (response?.data?.success === true) {
          const successMsg =
            response?.data?.msg &&
            typeof response.data.msg === "string" &&
            response.data.msg.trim() !== ""
              ? response.data.msg
              : "Quotation saved successfully!";

          Swal.fire({
            title: "Success",
            text: successMsg,
            icon: "success",
            background: "#f5faff",
            color: "#003f73",
            confirmButtonText: "Okay",
            confirmButtonColor: "#005BA8",
            showClass: {
              popup: `
             animate__animated
             animate__fadeInDown
             animate__faster
           `,
            },
            hideClass: {
              popup: `
             animate__animated
             animate__fadeOutUp
             animate__faster
           `,
            },
            customClass: {
              popup: "rounded-2xl shadow-xl",
              title: "text-2xl font-bold",
              confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
            },
          });

          setIsEdited(false);
          FetchGetQuotation(); // Refresh data after successful save
        } else {
          // Success is false or not present - treat as error
          const errorMsg = getErrorMessage(
            { response: { data: response?.data } },
            "Failed to save quotation. Please try again.",
          );

          Swal.fire({
            title: "Save Failed",
            text: errorMsg,
            icon: "error",
            background: "#fff5f5",
            color: "#7a0000",
            confirmButtonText: "Okay",
            confirmButtonColor: "#d33",
            customClass: {
              popup: "rounded-2xl shadow-xl",
              title: "text-2xl font-bold",
              confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
            },
          });
        }
      })
      .catch((error) => {
        console.error("=== ERROR DETAILS ===");
        console.error("Full error object:", error);
        console.error("Error response:", error?.response);
        console.error("Error response data:", error?.response?.data);
        console.error("Error response status:", error?.response?.status);
        console.error("=== END ERROR DETAILS ===");

        const beMsg = getErrorMessage(
          error,
          "Something went wrong while saving quotation",
        );

        Swal.fire({
          title: "Save Failed",
          text: beMsg,
          icon: "error",
          background: "#fff5f5",
          color: "#7a0000",
          confirmButtonText: "Okay",
          confirmButtonColor: "#d33",
          customClass: {
            popup: "rounded-2xl shadow-xl",
            title: "text-2xl font-bold",
            confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
          },
        });
      });
  };

  const saveNotes = () => {
    const payload = buildPayload();

    if (!quotationId) {
      return Promise.reject("No quotationId");
    }

    return UpdateQuotation(quotationId, payload).then((response) => {
      if (
        response?.data?.msg?.toLowerCase().includes("successfully") ||
        response?.data?.success === true
      )
        setIsEdited(false);
      return response;
    });
  };

  const handleSaveAndOpenPdf = async () => {
    try {
      setLoadingPdf(true);

      await saveNotes();

      handleGenrateReport();
    } catch (error) {
      console.error("Save then open PDF failed", error);
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleAddAdvancePayment = () => {
    setQuotationData((prev) => ({
      ...prev,
      advancePayments: [
        ...prev.advancePayments,
        { id: 0, amount: "0", date: dayjs(), description: "" },
      ],
    }));
  };

  const handleRemoveAdvancePayment = (idx) => {
    setQuotationData((prev) => {
      if ((prev.advancePayments?.length || 1) <= 1) return prev;
      const copy = [...prev.advancePayments];
      copy.splice(idx, 1);
      return { ...prev, advancePayments: copy };
    });
  };

  const handleAdvancePaymentChange = (idx, field, value) => {
    setIsEdited(true);
    setQuotationData((prev) => {
      const list = [...prev.advancePayments];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, advancePayments: list };
    });
  };

  const handleTaxChange = (index, field, value) => {
    setIsEdited(true);
    const newTaxDetails = [...quotationData.taxDetails];
    const subtotal = quotationData.functions.reduce((sum, func) => {
      const total = parseFloat(func.totalPrice) || 0;
      return sum + total;
    }, 0);

    // Get discount amount to calculate taxable amount
    const discountAmount = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "Discount")
        ?.amount || 0,
    );
    const taxableAmount = subtotal - discountAmount;

    if (
      field === "percentage" &&
      (newTaxDetails[index].label === "CGST" ||
        newTaxDetails[index].label === "SGST" ||
        newTaxDetails[index].label === "IGST")
    ) {
      newTaxDetails[index].percentage = value;
      const percentage = parseFloat(value) || 0;
      // Calculate tax on taxable amount (after discount)
      const calculatedAmount = (taxableAmount * percentage) / 100;
      newTaxDetails[index].amount = calculatedAmount;
    } else if (field === "amount") {
      newTaxDetails[index].amount = value;

      if (
        taxableAmount > 0 &&
        (newTaxDetails[index].label === "CGST" ||
          newTaxDetails[index].label === "SGST" ||
          newTaxDetails[index].label === "IGST")
      ) {
        const enteredAmount = parseFloat(value) || 0;
        // Calculate percentage based on taxable amount
        const percentage = (enteredAmount / taxableAmount) * 100;
        newTaxDetails[index].percentage = percentage.toFixed(2);
      } else if (
        newTaxDetails[index].label === "CGST" ||
        newTaxDetails[index].label === "SGST" ||
        newTaxDetails[index].label === "IGST"
      ) {
        newTaxDetails[index].percentage = "0";
      }
    } else {
      newTaxDetails[index][field] = value;
    }

    setQuotationData((prev) => ({
      ...prev,
      taxDetails: newTaxDetails,
    }));
  };

  const handleGenrateReport = () => {
    setLoadingPdf(true);

    const userId = localStorage.getItem("userId");

    GetQuotationReport(eventId, userId, 0)
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

  const handleWhatsAppShare = (pdfUrl) => {
    const name = quotationData.partyName || "there";

    let mobile = quotationData.mobileNumber || "";

    const message = `Hi ${name},
  Hope you're doing well!
  
  Please find the quotation PDF below:
  ${pdfUrl}
  
  Thanks!`;

    const url = `https://api.whatsapp.com/send?phone=${mobile}&text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyToInvoice = () => {
    if (!quotationId) {
      Swal.fire({
        title: "Error",
        text: "Quotation not loaded yet. Please wait.",
        icon: "error",
        confirmButtonColor: "#005BA8",
      });
      return;
    }

    navigate(`/add-invoice/${eventId}`, {
      state: {
        eventId,
        fromQuotation: true,
        quotationId: quotationId, // Pass quotation ID for reference only
        quotationData: {
          functions: quotationData.functions,
          taxDetails: quotationData.taxDetails,
          advancePayments: quotationData.advancePayments,
          notes: quotationData.notes,
          billingname: billingName || quotationData.billingname,
          billingaddress: quotationData.billingaddress || "",
          shipname: quotationData.shipname || "",
          shipaddress: quotationData.shipaddress || "",
          gstnumber: gstNumber || quotationData.gstnumber,
          duedate: dueDate
            ? dueDate.format("DD/MM/YYYY")
            : quotationData.duedate || "",
          grandTotal: totals.grandTotal,
          subtotal: totals.subtotal,
          cgst:
            quotationData.taxDetails.find((t) => t.label === "CGST")
              ?.percentage || "0",
          sgst:
            quotationData.taxDetails.find((t) => t.label === "SGST")
              ?.percentage || "0",
          igst:
            quotationData.taxDetails.find((t) => t.label === "IGST")
              ?.percentage || "0",
          cgstAmnt: totals.cgstAmount,
          sgstAmnt: totals.sgstAmount,
          igstAmnt: totals.igstAmount,
          discount: totals.discountAmount,
          roundOff: totals.roundOffAmount,
        },
      },
    });
  };
  return (
    <Fragment>
      <style>
        {`
          .user-access-bg {
            background-image: url('${toAbsoluteUrl("/images/bg_01.png")}');
          }
          .dark .user-access-bg {
            background-image: url('${toAbsoluteUrl("/images/bg_01_dark.png")}');
          }
          
          /* Custom responsive table styles */
          .responsive-table-container {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .responsive-table {
            min-width: 100%;
            width: max-content;
          }
          
          /* Responsive breakpoints */
          @media (max-width: 1200px) {
            .responsive-table {
              min-width: 1000px;
            }
          }
          
          @media (max-width: 768px) {
            .responsive-table {
              min-width: 800px;
            }
          }
        `}
      </style>

      <div className="w-full overflow-x-hidden">
        <Container>
          <div className="gap-2 mb-3">
            <Breadcrumbs
              items={[
                {
                  title: intl.formatMessage({
                    id: "COMMON.QUOTATION",
                    defaultMessage: "Quotation ",
                  }),
                },
              ]}
            />
          </div>

          {/* Event Details */}
          <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 gap-4">
              {/* Left side - Event Details */}
              <div className="flex flex-col gap-3 w-full lg:w-auto">
                <p className="text-base lg:text-lg font-semibold text-gray-900">
                  <FormattedMessage
                    id="COMMON.EVENT_NAME"
                    defaultMessage="Event Name: "
                  />
                  {quotationData.eventName}
                </p>

                {/* Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  {/* Party Name */}
                  <div className="flex items-center gap-2">
                    <i className="ki-filled ki-user text-success text-lg"></i>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-600">
                        <FormattedMessage
                          id="COMMON.PARTY_NAME"
                          defaultMessage="Party Name:"
                        />
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {quotationData.partyName}
                      </span>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-center gap-2">
                    <i className="ki-filled ki-geolocation-home text-success text-lg"></i>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-600">
                        <FormattedMessage
                          id="COMMON.VENUE_NAME"
                          defaultMessage="Venue Name:"
                        />
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {quotationData.venueName}
                      </span>
                    </div>
                  </div>

                  {/* Event Date */}
                  <div className="flex items-center gap-2">
                    <i className="ki-filled ki-calendar-tick text-success text-lg"></i>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-600">
                        <FormattedMessage
                          id="COMMON.EVENT_DATE"
                          defaultMessage="Event Date:"
                        />
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {quotationData.estimateDate}
                      </span>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="flex items-center gap-2">
                    <i className="ki-filled ki-phone text-success text-lg"></i>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-600">
                        <FormattedMessage
                          id="COMMON.MOBILE_NUMBER"
                          defaultMessage="Mobile Number:"
                        />
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {quotationData.mobileNumber}
                      </span>
                    </div>
                  </div>

                  {/* Quotation Date */}
                  <div className="flex items-center gap-2">
                    <i className="ki-filled ki-calendar-tick text-success text-lg"></i>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-gray-600">
                        <FormattedMessage
                          id="COMMON.QUOTATION_DATE"
                          defaultMessage="Quotation Date:"
                        />
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="text-primary hover:text-primary-dark"
                          onClick={() => setIsQuotationDateEditing(true)}
                        >
                          <i className="ki-filled ki-pencil text-sm"></i>
                        </button>
                        {!isQuotationDateEditing ? (
                          <>
                            <span className="text-sm font-medium text-gray-900">
                              {quotationData.QuotationDate}
                            </span>
                            <button
                              type="button"
                              className="text-primary hover:text-primary-dark"
                              onClick={() => setIsQuotationDateEditing(true)}
                            >
                              <i className="ki-filled ki-pencil text-sm"></i>
                            </button>
                          </>
                        ) : (
                          <>
                            <input
                              type="date"
                              value={quotationDate}
                              onChange={(e) => {
                                setQuotationDate(e.target.value);
                                setIsEdited(true);
                              }}
                              className="input text-sm py-1 px-2"
                              autoFocus
                            />
                            <button
                              type="button"
                              className="text-success"
                              onClick={() => setIsQuotationDateEditing(false)}
                            >
                              <i className="ki-filled ki-check text-sm"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Billing Details - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                  {/* Billing Name */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      <FormattedMessage
                        id="COMMON.BILLING_NAME"
                        defaultMessage="Billing Name:"
                      />
                    </label>
                    <input
                      className="input text-sm"
                      type="text"
                      value={billingName || quotationData.billingname}
                      onChange={(e) => {
                        setBillingName(e.target.value);
                        setIsEdited(true);
                      }}
                    />
                  </div>

                  {/* GST Number */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      <FormattedMessage
                        id="COMMON.GST_NUMBER"
                        defaultMessage="GST Number:"
                      />
                    </label>
                    <input
                      className="input text-sm"
                      type="text"
                      value={gstNumber || quotationData.gstnumber}
                      onChange={(e) => {
                        setGstNumber(e.target.value);
                        setIsEdited(true);
                      }}
                    />
                  </div>

                  {/* Due Date */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      <FormattedMessage
                        id="COMMON.DUE_DATE"
                        defaultMessage="Due Date:"
                      />
                    </label>
                    <DatePicker
                      format="DD/MM/YYYY"
                      className="input w-full"
                      value={
                        dueDate ||
                        (quotationData.duedate
                          ? dayjs(quotationData.duedate, "DD/MM/YYYY")
                          : null)
                      }
                      onChange={(date) => {
                        setDueDate(date);
                        setIsEdited(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Right side - Print Button */}
              <div className="w-full lg:w-auto lg:self-start flex flex-col lg:flex-row gap-2">
                <button
                  className="btn btn-primary w-full lg:w-auto"
                  onClick={handleCopyToInvoice}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  <FormattedMessage
                    id="COMMON.COPY_TO_INVOICE"
                    defaultMessage="Copy to Invoice"
                  />
                </button>

                {/* Print */}
                <button
                  className="btn btn-primary w-full lg:w-auto"
                  onClick={handleSaveAndOpenPdf}
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
                        <rect x="6" y="14" width="12" height="8" rx="1" />
                      </svg>
                      <FormattedMessage
                        id="COMMON.PRINT"
                        defaultMessage="Print"
                      />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Functions */}
          <div className="card min-w-full mb-9">
            <div className="flex flex-col flex-1">
              {/* Header */}
              <div className="rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 p-4">
                  {/* Search */}
                  <div className="relative w-full sm:w-auto">
                    <i className="ki-filled ki-magnifier absolute left-3 top-1/2 -translate-y-1/2 text-primary"></i>
                    <input
                      className="input pl-10 w-full sm:w-[300px]"
                      placeholder={intl.formatMessage({
                        id: "COMMON.SEARCH_FUNCTION",
                        defaultMessage: "Search function...",
                      })}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Add Button */}
                  <button
                    className="btn btn-primary w-full sm:w-auto"
                    onClick={handleAddFunction}
                  >
                    <i className="ki-filled ki-plus"></i>
                    <FormattedMessage
                      id="COMMON.ADD_FUNCTION"
                      defaultMessage="Add Function"
                    />
                  </button>
                </div>
              </div>

              {/* Table Header - Desktop Only */}
              <div className="hidden md:flex items-center justify-between bg-gray-100 font-bold border-y border-gray-200 py-3 px-4">
                <div className="text-sm font-semibold text-gray-900 w-12">
                  <FormattedMessage id="COMMON.NO" defaultMessage="No." />
                </div>
                <div className="text-sm font-semibold text-gray-900 flex-1 px-2">
                  <FormattedMessage
                    id="COMMON.FUNCTION"
                    defaultMessage="Function"
                  />
                </div>
                <div className="text-sm font-semibold text-gray-900 flex-1 px-2">
                  <FormattedMessage id="COMMON.DATE" defaultMessage="Date" />
                </div>
                <div className="text-sm font-semibold text-gray-900 w-24 px-2">
                  <FormattedMessage
                    id="COMMON.PERSON"
                    defaultMessage="Person"
                  />
                </div>
                <div className="text-sm font-semibold text-gray-900 w-24 px-2">
                  <FormattedMessage id="COMMON.RATE" defaultMessage="Rate" />
                </div>
                <div className="text-sm font-semibold text-gray-900 w-28 px-2">
                  <FormattedMessage
                    id="COMMON.TOTAL_PRICE"
                    defaultMessage="Total Price"
                  />
                </div>
                <div className="text-sm font-semibold text-gray-900 w-16 text-center">
                  <FormattedMessage
                    id="COMMON.ACTIONS"
                    defaultMessage="Action"
                  />
                </div>
              </div>

              {/* Function Rows - Responsive */}
              <div className="divide-y divide-gray-200">
                {quotationData.functions.map((fn, index) => (
                  <div
                    key={fn.id}
                    className="flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-3 md:gap-0 hover:bg-gray-50 transition-colors"
                  >
                    {/* Number */}
                    <div className="hidden md:block w-12 text-sm font-medium text-gray-700">
                      {index + 1}
                    </div>
                    <div className="md:hidden text-xs font-bold text-gray-500 mb-2">
                      Function #{index + 1}
                    </div>

                    {/* Function Name */}
                    <div className="flex-1 md:px-2">
                      <label className="mobile-field-label md:hidden">
                        <FormattedMessage
                          id="COMMON.FUNCTION"
                          defaultMessage="Function"
                        />
                      </label>
                      <input
                        className="input w-full text-sm"
                        value={fn.name}
                        onChange={(e) =>
                          handleFunctionChange(index, "name", e.target.value)
                        }
                        placeholder={intl.formatMessage({
                          id: "COMMON.FUNCTION",
                          defaultMessage: "Function",
                        })}
                        readOnly={fn.isFromQuotationItems}
                      />
                    </div>

                    {/* Date */}
                    <div className="flex-1 md:px-2">
                      <label className="mobile-field-label md:hidden">
                        <FormattedMessage
                          id="COMMON.DATE"
                          defaultMessage="Date"
                        />
                      </label>
                      <DatePicker
                        showTime={{ use12Hours: true, format: "hh:mm A" }}
                        format="DD/MM/YYYY hh:mm A"
                        value={fn.date}
                        onChange={(date) =>
                          handleFunctionChange(index, "date", date)
                        }
                        placeholder={intl.formatMessage({
                          id: "COMMON.SELECT_DATE_TIME",
                          defaultMessage: "Select date & time",
                        })}
                        disabled={fn.isFromQuotationItems}
                        className="input w-full"
                      />
                    </div>

                    {/* Persons */}
                    <div className="w-full md:w-24 md:px-2">
                      <label className="mobile-field-label md:hidden">
                        <FormattedMessage
                          id="COMMON.PERSON"
                          defaultMessage="Person"
                        />
                      </label>
                      <input
                        className="input w-full text-sm"
                        value={fn.persons}
                        onChange={(e) =>
                          handleFunctionChange(index, "persons", e.target.value)
                        }
                        placeholder={intl.formatMessage({
                          id: "COMMON.PAX",
                          defaultMessage: "Pax",
                        })}
                        type="number"
                        min="0"
                        readOnly={fn.isFromQuotationItems}
                      />
                    </div>

                    {/* Rate */}
                    <div className="w-full md:w-24 md:px-2">
                      <label className="mobile-field-label md:hidden">
                        <FormattedMessage
                          id="COMMON.RATE"
                          defaultMessage="Rate"
                        />
                      </label>
                      <input
                        className="input w-full text-sm"
                        value={fn.rate}
                        onChange={(e) =>
                          handleFunctionChange(index, "rate", e.target.value)
                        }
                        placeholder={intl.formatMessage({
                          id: "COMMON.RATE",
                          defaultMessage: "Rate",
                        })}
                        type="number"
                        min="0"
                      />
                    </div>

                    {/* Total Price */}
                    <div className="w-full md:w-28 md:px-2">
                      <label className="mobile-field-label md:hidden">
                        <FormattedMessage
                          id="COMMON.TOTAL_PRICE"
                          defaultMessage="Total Price"
                        />
                      </label>
                      <input
                        className="input w-full text-sm font-semibold"
                        value={fn.totalPrice}
                        onChange={(e) =>
                          handleFunctionChange(
                            index,
                            "totalPrice",
                            e.target.value,
                          )
                        }
                        placeholder={intl.formatMessage({
                          id: "COMMON.TOTAL_PRICE",
                          defaultMessage: "Total Price",
                        })}
                        type="number"
                        min="0"
                        readOnly={fn.isFromQuotationItems}
                      />
                    </div>

                    {/* Actions */}
                    <div className="w-full md:w-16 flex justify-end md:justify-center">
                      <Tooltip
                        title={
                          fn.isFromQuotationItems
                            ? "Cannot delete function from quotation items"
                            : "Delete item"
                        }
                      >
                        <Popconfirm
                          title="Are you sure to delete this item?"
                          onConfirm={() => handleDeleteFunction(fn.id, index)}
                          okText="Yes"
                          cancelText="No"
                          disabled={fn.isFromQuotationItems}
                        >
                          <button
                            disabled={fn.isFromQuotationItems}
                            className={`btn btn-sm btn-icon btn-danger ${
                              fn.isFromQuotationItems
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <KeenIcon icon="trash" />
                          </button>
                        </Popconfirm>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Function Button */}
              <div className="p-4 flex justify-center">
                <button
                  className="btn btn-success rounded-full"
                  onClick={handleAddFunction}
                >
                  <i className="ki-filled ki-plus"></i>
                  <FormattedMessage
                    id="COMMON.ADD_FUNCTION"
                    defaultMessage="Add Function"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Estimate Summary */}
          <div className="card min-w-full mb-7">
            <div className="flex flex-col flex-1">
              <div className="rtl:[background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg">
                <h3 className="text-lg font-semibold leading-none text-gray-900 p-4">
                  <FormattedMessage
                    id="COMMON.ESTIMATE_SUMMARY"
                    defaultMessage="Estimate Summary"
                  />
                </h3>
              </div>

              <div className="flex flex-col w-full">
                {/* Subtotal Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end border-t border-gray-200 py-3 gap-2 px-4">
                  <div className="text-lg sm:text-xl font-bold text-primary">
                    <FormattedMessage
                      id="COMMON.SUBTOTAL"
                      defaultMessage="Subtotal"
                    />
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-gray-900 sm:w-[220px] text-right">
                    &#8377; {totals.subtotal}
                  </div>
                </div>

                {/* Discount Row */}
                <div className="flex items-center justify-end border-t border-gray-200 py-3 gap-2 ">
                  <div className="text-lg font-semibold text-red-600 px-2">
                    <FormattedMessage
                      id="COMMON.DISCOUNT"
                      defaultMessage="Discount"
                    />
                  </div>
                  <div className="w-[220px] flex items-center justify-end px-2">
                    <div className="flex items-center input text-base text-gray-900 w-[200px]">
                      <span className="text-gray-500 ml-1">&#8377;</span>
                      <input
                        className="h-full text-gray-900 w-[140px] ml-1"
                        value={
                          quotationData.taxDetails.find(
                            (tax) => tax.label === "Discount",
                          )?.amount || ""
                        }
                        type="number"
                        min="0"
                        placeholder="0"
                        onChange={(e) => {
                          const discountIdx =
                            quotationData.taxDetails.findIndex(
                              (tax) => tax.label === "Discount",
                            );
                          handleTaxChange(
                            discountIdx,
                            "amount",
                            e.target.value,
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Taxable Amount Row */}
                <div className="flex items-center justify-end border-t border-b-2 border-gray-300 py-3 gap-2 bg-blue-50">
                  <div className="text-lg font-bold text-blue-700 px-2">
                    <FormattedMessage
                      id="COMMON.TAXABLE_AMOUNT"
                      defaultMessage="Taxable Amount"
                    />
                  </div>
                  <div className="w-[220px] text-base font-bold text-blue-700 px-2">
                    &#8377; {totals.amountAfterDiscount}
                  </div>
                </div>

                <div className="flex flex-col border-y border-gray-200 border-dashed bg-gray-50 font-bold p-4">
                  {quotationData.taxDetails
                    .filter((tax) => tax.label !== "Discount")
                    .map((tax) => {
                      // Find the original index in the full taxDetails array
                      const originalIdx = quotationData.taxDetails.findIndex(
                        (t) => t.label === tax.label,
                      );
                      return (
                        <div
                          key={tax.label}
                          className="flex items-center justify-end gap-6 py-1"
                        >
                          <div className="text-base flex place-content-start font-normal text-gray-700">
                            {tax.label}
                          </div>
                          <div className="flex items-center input text-base text-gray-900 w-[200px]">
                            {tax.label === "CGST" ||
                            tax.label === "SGST" ||
                            tax.label === "IGST" ? (
                              <>
                                <input
                                  className="h-full text-gray-900 w-[60px]"
                                  value={tax.percentage}
                                  type="number"
                                  min="0"
                                  placeholder="0"
                                  onChange={(e) =>
                                    handleTaxChange(
                                      originalIdx,
                                      "percentage",
                                      e.target.value,
                                    )
                                  }
                                />
                                <span className="text-gray-500">%</span>
                                <span className="ml-3">
                                  &#8377;{" "}
                                  {tax.label === "CGST"
                                    ? totals.cgstAmount
                                    : tax.label === "SGST"
                                      ? totals.sgstAmount
                                      : tax.label === "IGST"
                                        ? totals.igstAmount
                                        : tax.amount}
                                </span>
                              </>
                            ) : (
                              <>
                                {tax.label === "Round Off" ? (
                                  <input
                                    className="h-full text-gray-900 w-[80px]"
                                    value={tax.amount}
                                    type="number"
                                    onChange={(e) =>
                                      handleTaxChange(
                                        originalIdx,
                                        "amount",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="0"
                                  />
                                ) : (
                                  <input
                                    className="h-full text-gray-900 w-[80px]"
                                    value={tax.amount}
                                    type="number"
                                    min="0"
                                    onChange={(e) =>
                                      handleTaxChange(
                                        originalIdx,
                                        "amount",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="0"
                                  />
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="flex items-center justify-end py-5  gap-2">
                  <div className="text-xl font-bold text-primary px-2 ">
                    <FormattedMessage
                      id="COMMON.GRAND_TOTAL"
                      defaultMessage="Grand Total"
                    />
                  </div>
                  <div className="w-[220px] text-lg font-bold text-primary px-2">
                    &#8377; {totals.grandTotal}
                  </div>
                </div>

                {/* Single Advance Payment Section */}
                <div className="flex flex-col border-y border-gray-200 border-dashed bg-gray-50 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-3">
                    <div className="text-base font-semibold text-gray-900">
                      <FormattedMessage
                        id="COMMON.PAYMENT_DETAILS"
                        defaultMessage="Payment Details"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary w-full sm:w-auto"
                      onClick={handleAddAdvancePayment}
                    >
                      <i className="ki-filled ki-plus"></i>
                      <FormattedMessage
                        id="COMMON.ADD_ADVANCE_PAYMENT"
                        defaultMessage="Add Advance Payment"
                      />
                    </button>
                  </div>

                  {(quotationData.advancePayments || []).map((pay, i) => (
                    <div
                      key={i}
                      className={`flex gap-5 py-3 ${i > 0 ? "border-t border-gray-200 mt-3 pt-5" : ""}`}
                    >
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-success mt-1">
                        <i className="ki-filled ki-check text-white"></i>
                      </div>

                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center  gap-4">
                          <div className="text-base font-normal text-gray-700">
                            <FormattedMessage
                              id="COMMON.ADVANCE_PAYMENT"
                              defaultMessage="Advance Payment"
                            />{" "}
                            {quotationData.advancePayments.length > 1
                              ? `#${i + 1}`
                              : ""}
                          </div>

                          <div className="flex items-center input text-base text-gray-900 w-full sm:w-[140px]">
                            <span className="text-base font-semibold text-gray-900">
                              &#8377;
                            </span>
                            <input
                              className="h-full text-gray-900 w-full"
                              value={pay.amount}
                              type="text"
                              step="0.01"
                              min="0"
                              onChange={(e) =>
                                handleAdvancePaymentChange(
                                  i,
                                  "amount",
                                  e.target.value,
                                )
                              }
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div
                          className="bg-white py-3 px-5 rounded-lg border border-gray-200 cursor-pointer"
                          onClick={() =>
                            document.getElementById(`advance-payment-date-${i}`)
                          }
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <i className="ki-filled ki-calendar text-gray-500"></i>
                              <div className="flex flex-col w-full">
                                <label className="text-xs font-medium text-gray-700 mb-1">
                                  {intl.formatMessage({
                                    id: "COMMON.PAYMENT_DATE_TIME",
                                    defaultMessage: "Payment date & time",
                                  })}
                                  <span className="text-red-500 ml-1">*</span>
                                </label>
                                <DatePicker
                                  id={`advance-payment-date-${i}`}
                                  className={`input w-full sm:w-[200px] ${!pay.date ? "border-red-500" : ""}`}
                                  showTime={{
                                    use12Hours: true,
                                    format: "hh:mm A",
                                  }}
                                  format="DD/MM/YYYY hh:mm A"
                                  value={pay.date}
                                  onChange={(date) =>
                                    handleAdvancePaymentChange(i, "date", date)
                                  }
                                  placeholder={intl.formatMessage({
                                    id: "COMMON.PAYMENT_DATE_TIME",
                                    defaultMessage: "Payment date & time",
                                  })}
                                  status={!pay.date ? "error" : ""}
                                />
                                {!pay.date && (
                                  <span className="text-xs text-red-500 mt-1">
                                    {intl.formatMessage({
                                      id: "COMMON.DATE_REQUIRED",
                                      defaultMessage: "Date is required",
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                              <i className="ki-filled ki-notepad text-gray-500"></i>
                              <input
                                className="flex-1 mt-2 input text-xs font-normal text-gray-700 bg-transparent w-full"
                                value={pay.description}
                                onChange={(e) =>
                                  handleAdvancePaymentChange(
                                    i,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder={intl.formatMessage({
                                  id: "COMMON.PAYMENT_DESCRIPTION",
                                  defaultMessage: "Payment description",
                                })}
                                type="text"
                              />
                            </div>
                          </div>
                        </div>

                        {i > 0 && (
                          <div className="flex justify-end">
                            <Popconfirm
                              title="Remove this payment?"
                              onConfirm={() => handleRemoveAdvancePayment(i)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <button
                                className="btn btn-sm btn-danger"
                                title="Remove"
                              >
                                <i className="ki-filled ki-trash"></i>{" "}
                                <FormattedMessage
                                  id="COMMON.REMOVE"
                                  defaultMessage="Remove"
                                />
                              </button>
                            </Popconfirm>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between py-5 px-2">
                  <div className="text-lg font-bold text-success px-2">
                    <FormattedMessage
                      id="COMMON.TOTAL_PAID"
                      defaultMessage="Total Paid"
                    />
                  </div>
                  <div className="text-base font-bold text-success px-2">
                    &#8377; {totals.totalPaid}
                  </div>
                </div>

                <div className="flex items-center justify-between border-y border-orange-100 border-dashed bg-orange-50 py-7 px-2">
                  <div className="text-xl font-bold text-orange-700 px-2">
                    <i className="ki-filled ki-notification-on"></i>{" "}
                    <FormattedMessage
                      id="COMMON.REMAINING_PAYMENT"
                      defaultMessage="Remaining Payment"
                    />
                  </div>
                  <div className="text-lg font-bold text-orange-700 px-2">
                    &#8377; {totals.remainingPayment}
                  </div>
                </div>

                <div className="flex flex-col gap-4 py-5 px-4">
                  <textarea
                    rows={5}
                    className="input w-full p-3"
                    placeholder={intl.formatMessage({
                      id: "COMMON.ADD_NOTES",
                      defaultMessage: "Add notes",
                    })}
                    value={quotationData.notes}
                    onChange={handleNotesChange}
                  />
                  <div className="flex justify-end">
                    <button
                      className="btn btn-success w-full sm:w-auto"
                      onClick={handleSaveNotes}
                      disabled={!isEdited}
                    >
                      <i className="ki-filled ki-save-2"></i>
                      <FormattedMessage
                        id="COMMON.SAVE"
                        defaultMessage="Save"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Modal
        title={
          <FormattedMessage
            id="COMMON.QUOTATION_REPORT"
            defaultMessage="Quotation Report"
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
        width="95%" // Changed from 60% to 95% for mobile
        style={{ top: 20, maxWidth: "1200px" }} // Added maxWidth for desktop
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
          {" "}
          {/* Reduced from 80vh for mobile */}
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

export default QuotationPage;
