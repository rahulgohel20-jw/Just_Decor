import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { toAbsoluteUrl } from "@/utils/Assets";
import { KeenIcon } from "@/components";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Tooltip, DatePicker, Popconfirm } from "antd";
import { useParams } from "react-router-dom";
import { successMsgPopup } from "../../../underConstruction";
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

  const intl = useIntl();

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
    return num % 1 === 0 ? num.toString() : num;
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
              todayDate, // Use quotationdate if available, fallback to createdAt or today
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
    const roundOffAmount = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "Round Off")
        ?.amount || 0,
    );
    const cgstAmount = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "CGST")?.amount || 0,
    );
    const sgstAmount = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "SGST")?.amount || 0,
    );
    const igstAmount = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "IGST")?.amount || 0,
    );

    const totalTaxAmount = cgstAmount + sgstAmount + igstAmount;
    const grandTotal =
      subtotal - discountAmount + totalTaxAmount + roundOffAmount;

    const totalPaid = (quotationData.advancePayments || []).reduce((sum, p) => {
      const val = parseFloat(p.amount) || 0;
      return sum + val;
    }, 0);

    const remaining = Math.max(0, grandTotal - totalPaid);

    return {
      subtotal: formatAmount(subtotal),
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
        total % 1 === 0 ? total.toString() : total;
    }

    if (field === "totalPrice") {
      const total = parseFloat(value) || 0;
      newFunctions[index].totalPrice =
        total % 1 === 0 ? total.toString() : total;
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

    const cgstAmnt = parseFloat(cgstDetail?.amount || 0);
    const sgstAmnt = parseFloat(sgstDetail?.amount || 0);
    const igstAmnt = parseFloat(igstDetail?.amount || 0);

    const totalAmount =
      subtotal - discount + cgstAmnt + sgstAmnt + igstAmnt + roundOff;

    const grandTotal =
      subtotal - discount + cgstAmnt + sgstAmnt + igstAmnt + roundOff;
    const payments = (quotationData.advancePayments || []).map((p) => ({
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
    console.log("=== QUOTATION DATE DEBUG ===");
    console.log("quotationDate (from state):", quotationDate);
    console.log("quotationData.QuotationDate:", quotationData.QuotationDate);

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

    console.log("=== BUILD PAYLOAD ===");
    console.log("Full Payload:", payload);
    console.log("quotationdate:", payload.quotationdate);
    console.log("duedate:", payload.duedate);
    console.log("billingname:", payload.billingname);
    console.log("gstnumber:", payload.gstnumber);
    console.log("=== END BUILD PAYLOAD ===\n");

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
        { amount: "0", date: dayjs(), description: "" },
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

    if (
      field === "percentage" &&
      (newTaxDetails[index].label === "CGST" ||
        newTaxDetails[index].label === "SGST" ||
        newTaxDetails[index].label === "IGST")
    ) {
      newTaxDetails[index].percentage = value;
      const percentage = parseFloat(value) || 0;
      const calculatedAmount = (subtotal * percentage) / 100;
      newTaxDetails[index].amount = calculatedAmount;
    } else if (field === "amount") {
      newTaxDetails[index].amount = value;

      if (
        subtotal > 0 &&
        (newTaxDetails[index].label === "CGST" ||
          newTaxDetails[index].label === "SGST" ||
          newTaxDetails[index].label === "IGST")
      ) {
        const enteredAmount = parseFloat(value) || 0;
        const percentage = (enteredAmount / subtotal) * 100;
        newTaxDetails[index].percentage = percentage;
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
            <div className="flex items-center justify-between p-4 gap-3">
              <div className="flex flex-col gap-2.5">
                <p className="text-lg font-semibold text-gray-900">
                  <FormattedMessage
                    id="COMMON.EVENT_NAME"
                    defaultMessage="Event Name: "
                  />
                  {quotationData.eventName}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  <div className="flex items-center gap-3">
                    <i className="ki-filled ki-user text-success"></i>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        <FormattedMessage
                          id="COMMON.PARTY_NAME"
                          defaultMessage="Party Name:"
                        />
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {quotationData.partyName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="ki-filled ki-geolocation-home text-success"></i>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        <FormattedMessage
                          id="COMMON.VENUE_NAME"
                          defaultMessage="Venue Name:"
                        />
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {quotationData.venueName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="ki-filled ki-calendar-tick text-success"></i>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        <FormattedMessage
                          id="COMMON.EVENT_DATE"
                          defaultMessage="Event Date:"
                        />
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {quotationData.estimateDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="ki-filled ki-phone text-success"></i>
                    <div className="flex flex-col">
                      <span className="text-sm">
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
                  <div className="flex items-center gap-3">
                    <i className="ki-filled ki-calendar-tick text-success"></i>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        <FormattedMessage
                          id="COMMON.QUOTATION_DATE"
                          defaultMessage="Quotation Date:"
                        />
                      </span>

                      <div className="flex items-center gap-2">
                        {!isQuotationDateEditing ? (
                          <>
                            <span className="text-sm font-medium text-gray-900">
                              {quotationData.QuotationDate}
                            </span>

                            <button
                              type="button"
                              className="text-primary hover:text-primary-dark"
                              onClick={() => setIsQuotationDateEditing(true)}
                              title="Edit Quotation Date"
                            >
                              <i className="ki-filled ki-pencil"></i>
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
                              className="border rounded px-2 py-1 text-sm"
                              autoFocus
                            />

                            <button
                              type="button"
                              className="text-success hover:text-success-dark"
                              onClick={() => setIsQuotationDateEditing(false)}
                              title="Done"
                            >
                              <i className="ki-filled ki-check"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-[80px]">
                  <div className="flex items-center gap-3">
                    <i className="ki-filled ki-user text-success"></i>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        <FormattedMessage
                          id="COMMON.BILLING_NAME"
                          defaultMessage="Billing Name:"
                        />
                      </span>
                      <input
                        className="input text-sm font-medium text-gray-900 w-[260px]"
                        type="text"
                        value={billingName || quotationData.billingname}
                        onChange={(e) => {
                          setBillingName(e.target.value);
                          setIsEdited(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="ki-filled ki-calendar-tick text-success"></i>
                    <div className="flex flex-col">
                      <span className="text-xs">
                        <FormattedMessage
                          id="COMMON.GST_NUMBER"
                          defaultMessage="GST Number:"
                        />
                      </span>
                      <input
                        className="input text-sm font-medium text-gray-900 w-[270px]"
                        type="text"
                        value={gstNumber || quotationData.gstnumber}
                        onChange={(e) => {
                          setGstNumber(e.target.value);
                          setIsEdited(true);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <i className="ki-filled ki-calendar-tick text-success"></i>
                    <div className="flex flex-col">
                      <span className="text-xs">
                        <FormattedMessage
                          id="COMMON.DUE_DATE"
                          defaultMessage="Due Date:"
                        />
                      </span>
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
              </div>

              <div className="flex flex-row items-end gap-2 mt-[-30px]">
                <button
                  className="btn btn-sm btn-primary"
                  title="Save & Open PDF"
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
                        id="COMMON.SHARE"
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
              <div className="rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg">
                <div className="flex flex-wrap justify-between items-center gap-5 p-4 relative">
                  <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-6"></i>
                  <input
                    className="input pl-8 w-[300px]"
                    placeholder={intl.formatMessage({
                      id: "COMMON.SEARCH_FUNCTION",
                      defaultMessage: "Search function...",
                    })}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  <button
                    className="btn btn-sm btn-primary"
                    title={
                      <FormattedMessage
                        id="COMMON.ADD_FUNCTION"
                        defaultMessage="Add Function"
                      />
                    }
                    onClick={handleAddFunction}
                  >
                    <i className="ki-filled ki-plus"></i>{" "}
                    <FormattedMessage
                      id="COMMON.ADD_FUNCTION"
                      defaultMessage="Add Function"
                    />
                  </button>
                </div>
              </div>

              <div className="responsive-table-container">
                <div className="responsive-table">
                  <div className="flex items-center justify-between bg-gray-100 font-bold border-y border-gray-200 py-3 px-2">
                    <div className="text-sm font-semibold text-gray-900 px-2 w-16 flex-shrink-0">
                      <FormattedMessage id="COMMON.NO" defaultMessage="No." />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 px-2 w-48 flex-shrink-0">
                      <FormattedMessage
                        id="COMMON.FUNCTION"
                        defaultMessage="Function"
                      />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 px-2 w-48 flex-shrink-0">
                      <FormattedMessage
                        id="COMMON.DATE"
                        defaultMessage="Date"
                      />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 px-2 w-32 flex-shrink-0">
                      <FormattedMessage
                        id="COMMON.PERSON"
                        defaultMessage="Person"
                      />
                    </div>

                    <div className="text-sm font-semibold text-gray-900 px-2 w-32 flex-shrink-0">
                      <FormattedMessage
                        id="COMMON.RATE"
                        defaultMessage="Rate"
                      />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 px-2 w-32 flex-shrink-0">
                      <FormattedMessage
                        id="COMMON.TOTAL_PRICE"
                        defaultMessage="Total Price"
                      />
                    </div>
                    <div className="text-sm font-semibold text-gray-900 px-2 w-24 flex-shrink-0 text-center">
                      <FormattedMessage
                        id="COMMON.ACTIONS"
                        defaultMessage="Action"
                      />
                    </div>
                  </div>

                  {quotationData.functions.map((fn, index) => (
                    <div
                      key={fn.id}
                      className="flex items-center justify-between border-b border-gray-200 py-3 px-2"
                    >
                      <div className="text-sm font-medium text-gray-700 px-2 w-16 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="text-sm font-medium text-gray-700 px-2 w-48 flex-shrink-0">
                        <input
                          className="input w-full"
                          value={fn.name}
                          onChange={(e) =>
                            handleFunctionChange(index, "name", e.target.value)
                          }
                          placeholder={intl.formatMessage({
                            id: "COMMON.FUNCTION",
                            defaultMessage: "Function",
                          })}
                          type="text"
                          readOnly={fn.isFromQuotationItems}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-700 px-2 w-48 flex-shrink-0">
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
                          className={`input w-full ${classes.customDatePicker}`}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-700 px-2 w-32 flex-shrink-0">
                        <input
                          className="input w-full"
                          value={fn.persons}
                          onChange={(e) =>
                            handleFunctionChange(
                              index,
                              "persons",
                              e.target.value,
                            )
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

                      {/* /* <div className="text-sm font-medium text-gray-700 px-2 w-32 flex-shrink-0">
                        {fn.isNewFunction ? (
                          Show just a dash or "N/A" for new functions
                          <div className="input w-full bg-gray-100 flex items-center justify-center cursor-not-allowed">
                            -
                          </div>
                        ) : (
                          <input
                            className={`input w-full ${fn.isNewFunction ? "bg-gray-100 cursor-not-allowed" : ""}`}
                            value={fn.extra}
                            onChange={(e) =>
                              handleFunctionChange(
                                index,
                                "extra",
                                e.target.value,
                              )
                            }
                            placeholder={intl.formatMessage({
                              id: "COMMON.EXTRA",
                              defaultMessage: "Extra",
                            })}
                            type="number"
                            disabled={fn.isNewFunction}
                            readOnly={fn.isNewFunction}
                          />
                        )}
                      </div> */}
                      <div className="text-sm font-medium text-gray-700 px-2 w-32 flex-shrink-0">
                        <input
                          className="input w-full"
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
                          step="0"
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-700 px-2 w-32 flex-shrink-0">
                        <input
                          className="input w-full"
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
                          step="0"
                          readOnly={fn.isFromQuotationItems}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-700 px-2 w-24 flex-shrink-0 text-center">
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
                              className={`btn btn-sm btn-icon btn-clear btn-danger ${
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

                  <div className="relative py-4 mb-9">
                    <div className="absolute left-0 right-0 -bottom-4 text-center">
                      <button
                        className="btn btn-sm btn-success rounded-full"
                        title="Add Item"
                        onClick={handleAddFunction}
                      >
                        <i className="ki-filled ki-plus"></i>{" "}
                        <FormattedMessage
                          id="COMMON.ADD_FUNCTION"
                          defaultMessage="Add Function"
                        />
                      </button>
                    </div>
                  </div>
                </div>
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
                <div className="flex items-center justify-end border-t border-gray-200 py-3 gap-2">
                  <div className="text-xl font-bold text-primary px-2">
                    <FormattedMessage
                      id="COMMON.TOTAL"
                      defaultMessage="Total"
                    />
                  </div>
                  <div className="w-[220px] text-base font-semibold text-gray-900 px-2">
                    &#8377; {totals.subtotal}
                  </div>
                </div>

                <div className="flex flex-col border-y border-gray-200 border-dashed bg-gray-50 font-bold p-4">
                  {quotationData.taxDetails.map((tax, idx) => (
                    <div
                      key={idx}
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
                              className="h-full text-gray-900 w-[0px]"
                              value={tax.percentage}
                              type="number"
                              min="0"
                              placeholder="0"
                              onChange={(e) =>
                                handleTaxChange(
                                  idx,
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
                                  handleTaxChange(idx, "amount", e.target.value)
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
                                  handleTaxChange(idx, "amount", e.target.value)
                                }
                                placeholder="0"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
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
                  <div className="flex items-center justify-between pb-2">
                    <div className="text-base font-semibold text-gray-900">
                      <FormattedMessage
                        id="COMMON.PAYMENT_DETAILS"
                        defaultMessage="Payment Details"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleAddAdvancePayment}
                      title="Add Payment"
                    >
                      <i className="ki-filled ki-plus"></i>{" "}
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

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 px-4">
                  <textarea
                    rows={5}
                    className="input w-full sm:w-[500px] p-3"
                    placeholder={intl.formatMessage({
                      id: "COMMON.ADD_NOTES",
                      defaultMessage: "Add notes",
                    })}
                    value={quotationData.notes}
                    onChange={handleNotesChange}
                    type="text"
                  />
                  <button
                    className="btn btn-success w-full sm:w-auto"
                    title="Save"
                    onClick={handleSaveNotes}
                    disabled={!isEdited}
                  >
                    <i className="ki-filled ki-save-2"></i>{" "}
                    <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
                  </button>
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
          // Cleanup blob URL
          if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
            setPdfUrl("");
          }
        }}
        width="60%"
        footer={[
          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleWhatsAppShare(pdfUrl)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Share on WhatsApp
            </button>
            <button
              key="close"
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
            ,
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
    </Fragment>
  );
};

export default QuotationPage;
