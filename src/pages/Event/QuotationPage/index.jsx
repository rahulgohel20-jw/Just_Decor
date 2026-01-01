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
} from "@/services/apiServices";
import useStyles from "./style";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Swal from "sweetalert2";
import { FormattedMessage, useIntl } from "react-intl";

dayjs.extend(customParseFormat);

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
        extra: "",
        rate: "",
        totalPrice: "",
      },
    ],
    taxDetails: [
      { label: "CGST", percentage: "", amount: "0.00" },
      { label: "SGST", percentage: "", amount: "0.00" },
      { label: "IGST", percentage: "", amount: "0.00" },
      { label: "Discount", percentage: "", amount: "0.00" },
      { label: "Round Off", percentage: "", amount: "0.00" },
    ],
    grandTotal: "0.00",
    advancePayments: [
      {
        amount: "0.00",
        date: dayjs(),
        description: "",
      },
    ],
    totalPaid: "0.00",
    remainingPayment: "0.00",
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
              normalize(searchTerm)
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

  const FetchGetQuotation = () => {
    GetQuotation(eventId)
      .then((res) => {
        const apiData = res?.data?.data?.["Event Functions Quotation Details"];
        console.log(apiData);

        if (apiData && apiData.length > 0) {
          const quotationInfo = apiData[0];

          const hasFunctionQuotationItems =
            quotationInfo.functionQuotationItems &&
            quotationInfo.functionQuotationItems.length > 0;

          const mappedData = {
            quotationId: quotationInfo.id,
            QuotationDate: quotationInfo.createdAt || todayDate,
            eventName: quotationInfo.event?.eventType?.nameEnglish || "Event",
            partyName: quotationInfo.event?.party?.nameEnglish || "",
            billingname: quotationInfo.billingname || "",
            gstnumber: quotationInfo.gstnumber || "",
            duedate: quotationInfo.duedate || "",
            venueName: quotationInfo.event?.venue.nameEnglish || "",
            mobileNumber: quotationInfo.event?.mobileno || "-",
            estimateDate: quotationInfo.event?.eventStartDateTime
              ? new Date(
                  quotationInfo.event.eventStartDateTime
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
                  extra: item.extraPax?.toString() || "0",
                  rate: item.ratePerPlate?.toString() || "",
                  totalPrice: item.amount?.toFixed(2) || "0.00",
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
                            "DD/MM/YYYY hh:mm A"
                          )
                        : null,
                      persons: eventFunc.pax?.toString() || "",
                      extra: eventFunc.extra || "0",
                      rate: eventFunc.rate?.toString() || "",
                      totalPrice:
                        eventFunc.pax && eventFunc.rate
                          ? (eventFunc.pax * eventFunc.rate).toFixed(2)
                          : "0.00",
                      isFromQuotationItems: true,
                    })
                  )
                : [
                    {
                      id: 1,
                      name: "",
                      date: null,
                      persons: "",
                      extra: "",
                      rate: "",
                      totalPrice: "0.00",
                      isFromQuotationItems: false,
                    },
                  ],

            taxDetails: [
              {
                label: "CGST",
                percentage: quotationInfo.cgst || "0",
                amount: (quotationInfo.cgstAmnt || 0).toFixed(2),
              },
              {
                label: "SGST",
                percentage: quotationInfo.sgst || "0",
                amount: (quotationInfo.sgstAmnt || 0).toFixed(2),
              },
              {
                label: "IGST",
                percentage: quotationInfo.igst || "0",
                amount: (quotationInfo.igstAmnt || 0).toFixed(2),
              },
              {
                label: "Discount",
                percentage: "0",
                amount: (quotationInfo.discount || 0).toFixed(2),
              },
              {
                label: "Round Off",
                percentage: "0",
                amount: (quotationInfo.roundOff || 0).toFixed(2),
              },
            ],

            grandTotal: (quotationInfo.grandTotal || 0).toFixed(2),
            totalPaid: (quotationInfo.advancePayment || 0).toFixed(2),
            remainingPayment: (quotationInfo.remainingAmount || 0).toFixed(2),

            advancePayments:
              quotationInfo.advancePayments &&
              Array.isArray(quotationInfo.advancePayments)
                ? quotationInfo.advancePayments.map((p) => ({
                    amount: (p.amount || 0).toFixed(2),
                    date:
                      p.date && dayjs(p.date, "DD/MM/YYYY hh:mm A").isValid()
                        ? dayjs(p.date, "DD/MM/YYYY hh:mm A")
                        : null,
                    description: p.description || "",
                  }))
                : [
                    {
                      amount: (quotationInfo.advancePayment || 0).toFixed(2),
                      date:
                        quotationInfo.advancePaymentDate &&
                        dayjs(
                          quotationInfo.advancePaymentDate,
                          "DD/MM/YYYY hh:mm A"
                        ).isValid()
                          ? dayjs(
                              quotationInfo.advancePaymentDate,
                              "DD/MM/YYYY hh:mm A"
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
        ?.amount || 0
    );
    const roundOffAmount = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "Round Off")
        ?.amount || 0
    );
    const cgstAmount = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "CGST")?.amount || 0
    );
    const sgstAmount = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "SGST")?.amount || 0
    );
    const igstAmount = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "IGST")?.amount || 0
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
      subtotal: subtotal.toFixed(2),
      cgstAmount: cgstAmount.toFixed(2),
      sgstAmount: sgstAmount.toFixed(2),
      igstAmount: igstAmount.toFixed(2),
      totalTaxAmount: totalTaxAmount.toFixed(2),
      roundOffAmount: roundOffAmount.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      remainingPayment: remaining.toFixed(2),
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
          totalPrice: "0.00",
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

    if (field === "persons" || field === "rate" || field === "extra") {
      const persons = parseFloat(newFunctions[index].persons) || 0;
      const extra = parseFloat(newFunctions[index].extra) || 0;
      const rate = parseFloat(newFunctions[index].rate) || 0;

      newFunctions[index].totalPrice = ((persons + extra) * rate).toFixed(2);
    }

    if (field === "totalPrice") {
      newFunctions[index].totalPrice = parseFloat(value || 0).toFixed(2);
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
        ?.amount || 0
    );
    const roundOff = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "Round Off")
        ?.amount || 0
    );
    const cgstDetail = quotationData.taxDetails.find(
      (tax) => tax.label === "CGST"
    );
    const sgstDetail = quotationData.taxDetails.find(
      (tax) => tax.label === "SGST"
    );
    const igstDetail = quotationData.taxDetails.find(
      (tax) => tax.label === "IGST"
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
      amount: parseFloat(p.amount) || 0,
      date: p.date ? p.date.format("DD/MM/YYYY hh:mm A") : null,
      description: p.description || "",
    }));
    const totalPaid = (quotationData.advancePayments || []).reduce((sum, p) => {
      const val = parseFloat(p.amount) || 0;
      return sum + val;
    }, 0);

    const sumAdvance = payments.reduce((s, p) => s + (p.amount || 0), 0);
    const remainingAmount = Math.max(0, totalAmount - sumAdvance);
    return {
      advancePayment: sumAdvance,
      advancePaymentNotes: payments[0]?.description || "",
      advancePaymentDate: payments[0]?.date || null,
      advancePayments: payments,
      discount: discount,
      eventId: parseInt(eventId),
      functionQuotationItems: quotationData.functions.map((fn) => ({
        amount: parseFloat(fn.totalPrice) || 0,
        extraPax: fn.extra,
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
      userId: Id,
      billingname: billingName,
      duedate: dueDate ? dueDate.format("DD/MM/YYYY") : "",
      gstnumber: gstNumber,
    };
  };

  const handleSaveNotes = () => {
    const payload = buildPayload();
    if (!quotationId) {
      console.error("No quotationId available to save notes");
      return;
    }
    UpdateQuotation(quotationId, payload)
      .then((response) => {
        if (
          response?.data?.msg?.toLowerCase().includes("Successfully") ||
          response?.data?.success === true
        ) {
          Swal.fire({
            title: response?.data?.msg,
            text: "",
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
        }
        setIsEdited(false);
      })
      .catch((error) => {
        console.error("Error saving quotation:", error);
      });
  };

  const handleAddAdvancePayment = () => {
    setQuotationData((prev) => ({
      ...prev,
      advancePayments: [
        ...prev.advancePayments,
        { amount: "0.00", date: null, description: "" },
      ],
    }));
  };

  const handleRemoveAdvancePayment = (idx) => {
    // keep at least one
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
      const calculatedAmount = ((subtotal * percentage) / 100).toFixed(2);
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
        const percentage = ((enteredAmount / subtotal) * 100).toFixed(2);
        newTaxDetails[index].percentage = percentage;
      } else if (
        newTaxDetails[index].label === "CGST" ||
        newTaxDetails[index].label === "SGST" ||
        newTaxDetails[index].label === "IGST"
      ) {
        newTaxDetails[index].percentage = "0.00";
      }
    } else {
      newTaxDetails[index][field] = value;
    }

    setQuotationData((prev) => ({
      ...prev,
      taxDetails: newTaxDetails,
    }));
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
                    defaultMessage: "Quotation",
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
                        onChange={(e) => setBillingName(e.target.value)}
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
                        onChange={(e) => setGstNumber(e.target.value)}
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
                        onChange={(date) => setDueDate(date)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-end gap-2 mt-[-30px]">
                <button className="btn btn-sm btn-primary" title="Print">
                  <i className="ki-filled ki-printer"></i>{" "}
                  <FormattedMessage id="COMMON.PRINT" defaultMessage="Print" />
                </button>
                <button className="btn btn-sm btn-primary" title="Share">
                  <i className="ki-filled ki-exit-right-corner"></i>{" "}
                  <FormattedMessage id="COMMON.SHARE" defaultMessage="Share" />
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
                        id="COMMON.EXTRA"
                        defaultMessage="Extra"
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
                              e.target.value
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

                      <div className="text-sm font-medium text-gray-700 px-2 w-32 flex-shrink-0">
                        {fn.isNewFunction ? (
                          // Show just a dash or "N/A" for new functions
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
                                e.target.value
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
                      </div>
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
                              e.target.value
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
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              onChange={(e) =>
                                handleTaxChange(
                                  idx,
                                  "percentage",
                                  e.target.value
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
                                step="0.01"
                                onChange={(e) =>
                                  handleTaxChange(idx, "amount", e.target.value)
                                }
                                placeholder="0.00"
                              />
                            ) : (
                              <input
                                className="h-full text-gray-900 w-[80px]"
                                value={tax.amount}
                                type="number"
                                step="0.01"
                                min="0"
                                onChange={(e) =>
                                  handleTaxChange(idx, "amount", e.target.value)
                                }
                                placeholder="0.00"
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
                                  e.target.value
                                )
                              }
                              placeholder="0.00"
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
                              <DatePicker
                                id={`advance-payment-date-${i}`}
                                className="input w-full sm:w-[200px]"
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
                              />
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
                                    e.target.value
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
    </Fragment>
  );
};

export default QuotationPage;
