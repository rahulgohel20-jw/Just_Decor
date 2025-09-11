import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { toAbsoluteUrl } from "@/utils/Assets";
import { KeenIcon } from "@/components";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Tooltip, DatePicker, Popconfirm } from "antd";
import { useParams } from "react-router-dom";
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
import {
  GetQuotation,
  UpdateQuotation,
  DeleteQuotation,
} from "@/services/apiServices";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Swal from "sweetalert2";
dayjs.extend(customParseFormat);
const QuotationPage = () => {
  const [quotationId, setQuotationId] = useState(null);
  const { eventId } = useParams();

  const [quotationData, setQuotationData] = useState({
    eventName: "",
    partyName: "",
    venueName: "",
    estimateDate: "",
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
      { label: "Discount", percentage: "", amount: "0.00" },
      { label: "GST", percentage: "", amount: "0.00" },
    ],
    grandTotal: "0.00",
    advancePayment: {
      amount: "0.00",
      date: dayjs(),
      description: "Advance payment received. Confirmed",
    },
    totalPaid: "0.00",
    remainingPayment: "0.00",
    notes: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    FetchGetQuotation();
  }, []);

  const FetchGetQuotation = () => {
    setLoading(true);
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
            eventName: quotationInfo.event?.eventType?.nameEnglish || "Event",
            partyName: quotationInfo.event?.party?.nameEnglish || "",
            venueName: quotationInfo.event?.venue || "",
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
                }))
              : quotationInfo.event?.eventFunctions?.length > 0
                ? quotationInfo.event.eventFunctions.map(
                    (eventFunc, index) => ({
                      id: 0,
                      name: eventFunc.function?.nameEnglish || "",
                      date: eventFunc.functionStartDateTime
                        ? dayjs(eventFunc.functionStartDateTime)
                        : null,
                      persons: eventFunc.pax?.toString() || "",
                      extra: eventFunc.extra || "0",
                      rate: eventFunc.rate?.toString() || "",
                      totalPrice:
                        eventFunc.pax && eventFunc.rate
                          ? (eventFunc.pax * eventFunc.rate).toFixed(2)
                          : "0.00",
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
                    },
                  ],

            taxDetails: [
              {
                label: "Discount",
                percentage: "0",
                amount: (quotationInfo.discount || 0).toFixed(2),
              },
              {
                label: "GST",
                percentage: quotationInfo.gst || "0",
                amount: (quotationInfo.gstAmnt || 0).toFixed(2),
              },
            ],

            grandTotal: (quotationInfo.grandTotal || 0).toFixed(2),
            totalPaid: (quotationInfo.advancePayment || 0).toFixed(2),
            remainingPayment: (quotationInfo.remainingAmount || 0).toFixed(2),

            advancePayment: {
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

              description:
                quotationInfo.advancePaymentDescription ||
                "Advance payment received. Confirmed",
            },

            notes: quotationInfo.notes || "",
          };
          setQuotationId(mappedData.quotationId);
          setQuotationData(mappedData);
        }
      })
      .catch((error) => {
        console.log("Error fetching quotation:", error);
      })
      .finally(() => {
        setLoading(false);
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

    const gstPercentage = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "GST")?.percentage ||
        0
    );

    const gstAmount = (subtotal * gstPercentage) / 100 || 0;

    const grandTotal = subtotal - discountAmount + gstAmount;
    const totalPaid = parseFloat(quotationData.advancePayment.amount) || 0;
    const remaining = Math.max(0, grandTotal - totalPaid);

    return {
      subtotal: subtotal.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
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
          extra: "",
          rate: "",
          totalPrice: "0.00",
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
  };
  const buildPayload = () => {
    const subtotal = quotationData.functions.reduce((sum, fn) => {
      const total = parseFloat(fn.totalPrice) || 0;
      return sum + total;
    }, 0);

    const discount = parseFloat(
      quotationData.taxDetails.find((tax) => tax.label === "Discount")
        ?.amount || 0
    );

    const gstDetail = quotationData.taxDetails.find(
      (tax) => tax.label === "GST"
    );

    const gstPercentage = parseFloat(gstDetail?.percentage || 0);
    const gstAmnt = ((subtotal * gstPercentage) / 100).toFixed(2);

    const totalAmount = subtotal - discount + parseFloat(gstAmnt);
    const remainingAmount =
      totalAmount - parseFloat(quotationData.advancePayment.amount);

    return {
      advancePayment: parseFloat(quotationData.advancePayment.amount) || 0,
      advancePaymentDate: quotationData.advancePayment.date
        ? quotationData.advancePayment.date.format("DD/MM/YYYY hh:mm A")
        : null,

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
      })),
      grandTotal: parseFloat(totalAmount),
      gst: `${gstPercentage}`,
      gstAmnt: parseFloat(gstAmnt),
      notes: quotationData.notes,
      remainingAmount: remainingAmount,
      roundOff: 0,
      totalAmount: totalAmount,
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
          response?.status === 200
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
      })
      .catch((error) => {
        console.error("Error saving quotation:", error);
      });
  };

  const handleAdvancePaymentChange = (field, value) => {
    setQuotationData((prev) => ({
      ...prev,
      advancePayment: {
        ...prev.advancePayment,
        [field]: value,
      },
    }));
  };

  const handleTaxChange = (index, field, value) => {
    const newTaxDetails = [...quotationData.taxDetails];
    const subtotal = quotationData.functions.reduce((sum, func) => {
      const total = parseFloat(func.totalPrice) || 0;
      return sum + total;
    }, 0);

    if (field === "percentage" && newTaxDetails[index].label === "GST") {
      newTaxDetails[index].percentage = value;
      const percentage = parseFloat(value) || 0;
      const calculatedAmount = ((subtotal * percentage) / 100).toFixed(2);
      newTaxDetails[index].amount = calculatedAmount;
    } else if (field === "amount") {
      newTaxDetails[index].amount = value;

      if (subtotal > 0) {
        const enteredAmount = parseFloat(value) || 0;
        const percentage = ((enteredAmount / subtotal) * 100).toFixed(2);
        newTaxDetails[index].percentage = percentage;
      } else {
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

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-96">
          <div className="text-lg">Loading quotation...</div>
        </div>
      </Container>
    );
  }

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
        `}
      </style>

      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Quotation" }]} />
        </div>

        {/* Event Details */}
        <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            <div className="flex flex-col gap-2.5">
              <p className="text-lg font-semibold text-gray-900">
                Event Name: {quotationData.eventName}
              </p>
              <div className="flex items-center gap-7">
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-user text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Party name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {quotationData.partyName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-geolocation-home text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Venue name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {quotationData.venueName}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Estimate Date:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {quotationData.estimateDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-end gap-2">
              <button className="btn btn-sm btn-primary" title="Print">
                <i className="ki-filled ki-printer"></i> Print
              </button>
              <button className="btn btn-sm btn-primary" title="Share">
                <i className="ki-filled ki-exit-right-corner"></i> Share
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
                  placeholder="Search function"
                  type="text"
                />
                <button
                  className="btn btn-sm btn-primary"
                  title="Add Function"
                  onClick={handleAddFunction}
                >
                  <i className="ki-filled ki-plus"></i> Add Function
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center bg-gray-100 font-bold border-y border-gray-200 py-3 px-2">
                <div className="text-sm font-semibold text-gray-900 px-2 w-[80px]">
                  No.
                </div>
                <div className="text-sm font-semibold text-gray-900 px-2 w-[220px]">
                  Function
                </div>
                <div className="text-sm font-semibold text-gray-900 px-2 w-[220px]">
                  Date
                </div>
                <div className="text-sm font-semibold text-gray-900 px-2 w-[170px]">
                  Person
                </div>
                <div className="text-sm font-semibold text-gray-900 px-2 w-[170px]">
                  Extra
                </div>
                <div className="text-sm font-semibold text-gray-900 px-2 w-[170px]">
                  Rate
                </div>
                <div className="text-sm font-semibold text-gray-900 px-2 w-[170px]">
                  Total Price
                </div>
                <div className="text-sm font-semibold text-gray-900 px-2 text-center flex-auto">
                  Action
                </div>
              </div>

              {quotationData.functions.map((fn, index) => (
                <div
                  key={fn.id}
                  className="flex items-center border-b border-gray-200 py-3 px-2"
                >
                  <div className="text-sm font-medium text-gray-700 px-2 w-[80px]">
                    {index + 1}
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[220px]">
                    <input
                      className="input"
                      value={fn.name}
                      onChange={(e) =>
                        handleFunctionChange(index, "name", e.target.value)
                      }
                      placeholder="Function"
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[220px]">
                    <DatePicker
                      showTime={{ use12Hours: true, format: "hh:mm A" }}
                      format="DD/MM/YYYY hh:mm A"
                      value={fn.date}
                      onChange={(date) =>
                        handleFunctionChange(index, "date", date)
                      }
                      placeholder="Select date & time"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[170px]">
                    <input
                      className="input"
                      value={fn.persons}
                      onChange={(e) =>
                        handleFunctionChange(index, "persons", e.target.value)
                      }
                      placeholder="Pax"
                      type="number"
                      min="0"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[170px]">
                    <input
                      className="input"
                      value={fn.extra}
                      onChange={(e) =>
                        handleFunctionChange(index, "extra", e.target.value)
                      }
                      placeholder="Extra"
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[170px]">
                    <input
                      className="input"
                      value={fn.rate}
                      onChange={(e) =>
                        handleFunctionChange(index, "rate", e.target.value)
                      }
                      placeholder="Rate"
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[170px]">
                    <input
                      className="input"
                      value={fn.totalPrice}
                      onChange={(e) =>
                        handleFunctionChange(
                          index,
                          "totalPrice",
                          e.target.value
                        )
                      }
                      placeholder="Total Price"
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-auto text-center flex-auto">
                    <Tooltip
                      title={
                        index === 0
                          ? "Cannot delete first function"
                          : "Delete item"
                      }
                    >
                      <Popconfirm
                        title="Are you sure to delete this item?"
                        onConfirm={() => handleDeleteFunction(fn.id, index)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button
                          disabled={index === 0}
                          className={`btn btn-sm btn-icon btn-clear btn-danger ${
                            index === 0 ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <KeenIcon icon="trash" />
                        </button>
                      </Popconfirm>
                    </Tooltip>
                  </div>
                </div>
              ))}

              <div className="relative py-4">
                <div className="absolute left-0 right-0 -bottom-4 text-center">
                  <button
                    className="btn btn-sm btn-success rounded-full"
                    title="Add Item"
                    onClick={handleAddFunction}
                  >
                    <i className="ki-filled ki-plus"></i> Add Function
                  </button>
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
                Estimate Summary
              </h3>
            </div>

            <div className="flex flex-col w-full">
              {/* Subtotal Row */}
              <div className="flex items-center justify-between border-t border-gray-200 py-3 px-2">
                <div className="text-base font-normal text-gray-700 px-2">
                  Subtotal
                </div>
                <div className="text-base font-semibold text-gray-900 px-2">
                  &#8377; {totals.subtotal}
                </div>
              </div>

              <div className="flex flex-col border-y border-gray-200 border-dashed bg-gray-50 font-bold p-4">
                {quotationData.taxDetails.map((tax, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1"
                  >
                    <div className="text-base font-normal text-gray-700">
                      {tax.label}
                    </div>
                    <div className="flex items-center input text-base text-gray-900 w-[200px]">
                      {tax.label === "GST" ? (
                        <>
                          <input
                            className="h-full text-gray-900 w-[10px]"
                            value={tax.percentage}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            onChange={(e) =>
                              handleTaxChange(idx, "percentage", e.target.value)
                            }
                          />
                          <span className="text-gray-500">%</span>
                          <span className="ml-3">
                            &#8377; {totals.gstAmount}
                          </span>
                        </>
                      ) : (
                        <input
                          className="h-full text-gray-900 w-[50px]"
                          value={tax.amount}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          onChange={(e) =>
                            handleTaxChange(idx, "amount", e.target.value)
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between py-5 px-2">
                <div className="text-xl font-bold text-primary px-2">
                  Grand Total
                </div>
                <div className="text-lg font-bold text-primary px-2">
                  &#8377; {totals.grandTotal}
                </div>
              </div>

              {/* Single Advance Payment Section */}
              <div className="flex flex-col border-y border-gray-200 border-dashed bg-gray-50 p-4">
                <div className="text-base font-semibold text-gray-900 pb-2">
                  Payment Details
                </div>

                <div className="flex gap-5 py-3">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-success mt-1">
                    <i className="ki-filled ki-check text-white"></i>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-normal text-gray-700">
                        Advance Payment
                      </div>
                      <div className="input text-base text-gray-900 w-[140px]">
                        <span className="text-base font-semibold text-gray-900">
                          &#8377;
                        </span>
                        <input
                          className="h-full text-gray-900 w-full"
                          value={quotationData.advancePayment.amount}
                          type="number"
                          step="0.01"
                          min="0"
                          onChange={(e) => {
                            handleAdvancePaymentChange(
                              "amount",
                              e.target.value
                            );
                          }}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div
                      className="bg-white py-3 px-5 rounded-lg border border-gray-200 cursor-pointer"
                      onClick={() =>
                        document.getElementById("advance-payment-date").focus()
                      }
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 w-[250px]">
                          <i className="ki-filled ki-calendar text-gray-500"></i>
                          <DatePicker
                            showTime={{ use12Hours: true, format: "hh:mm A" }}
                            format="DD/MM/YYYY hh:mm A"
                            value={quotationData.advancePayment.date}
                            onChange={(date) =>
                              handleAdvancePaymentChange("date", date)
                            }
                            placeholder="Payment date & time"
                            style={{ width: "200px" }}
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <i className="ki-filled ki-notepad text-gray-500"></i>
                          <input
                            className="flex-1 text-xs font-normal text-gray-700 bg-transparent border-none outline-none"
                            value={quotationData.advancePayment.description}
                            onChange={(e) =>
                              handleAdvancePaymentChange(
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Payment description"
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-5 px-2">
                <div className="text-lg font-bold text-success px-2">
                  Total Paid
                </div>
                <div className="text-base font-bold text-success px-2">
                  &#8377; {totals.totalPaid}
                </div>
              </div>

              <div className="flex items-center justify-between border-y border-orange-100 border-dashed bg-orange-50 py-7 px-2">
                <div className="text-xl font-bold text-orange-700 px-2">
                  <i className="ki-filled ki-notification-on"></i> Remaining
                  Payment
                </div>
                <div className="text-lg font-bold text-orange-700 px-2">
                  &#8377; {totals.remainingPayment}
                </div>
              </div>

              <div className="flex items-center justify-between font-bold py-5 px-4">
                <input
                  className="input w-[500px]"
                  placeholder="Add notes"
                  value={quotationData.notes}
                  onChange={handleNotesChange}
                  type="text"
                />
                <button
                  className="btn btn-success"
                  title="Save"
                  onClick={handleSaveNotes}
                >
                  <i className="ki-filled ki-save-2"></i> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default QuotationPage;
