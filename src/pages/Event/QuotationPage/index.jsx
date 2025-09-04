import React, { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { toAbsoluteUrl } from "@/utils/Assets";
import { KeenIcon } from "@/components";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import useStyles from "./style";
import { PlusCircle } from "lucide-react";
import { Tooltip } from "antd";

const QuotationPage = () => {
  const classes = useStyles();
  const [form, setForm] = useState({
    customer_name: "AKSHAY BHAI PBN",
    mobile_number: "8000217871",
    event_type: "get to gather",
    event_date: "30/07/2025",
    venue: "LA GANESHA FARM, CANAL ROAD",
    amount_status: 2,
    tax: "",
    discount: 0,
    round_off: 0,
    grand_total: 0,
    advance: 0,
    remaining_amount: 0,
    note: "",
  });
  const [quotation, setQuotation] = useState([
    {
      name: "DINNER",
      date: "2025-07-30 18:00",
      person: 400,
      extra: 0,
      rate: 0,
      amount: 0,
    },
  ]);
  const handleInput = (index, field, value) => {
    let total_quotation = 0;
    setQuotation((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          let newItem = { ...item, [field]: value };
          let item_total =
            (Number(newItem.person) + Number(newItem.extra)) *
            Number(newItem.rate);
          total_quotation = Number(total_quotation) + Number(item_total);
          return { ...newItem, total: item_total };
        }
        total_quotation = Number(total_quotation) + Number(item.total);
        return item;
      })
    );

    setForm({ ...form, total: total_quotation });
  };
  const handleInputData = ({ target: { name, value } }) => {
    setForm({ ...form, [name]: value });
  };
  const removequotation = (index) => {
    let newQuotation = quotation.filter((item, i) => i !== index);
    setQuotation(newQuotation);
  };
  const addQuotation = () => {
    setQuotation([
      ...quotation,
      {
        name: "",
        date: "",
        person: 0,
        extra: 0,
        rate: 0,
        amount: 0,
      },
    ]);
  };
  // Calculate totals
  const total = (Number(form.person) + Number(form.extra)) * Number(form.rate);
  const grandTotal =
    total -
    Number(form.discount) +
    Number(form.roundOff) +
    Number(form.tax || 0);
  const remaining = grandTotal - Number(form.advance);
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
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Quotation" }]} />
        </div>
        {/* event details */}
        <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            <div className="flex flex-col gap-2.5">
              <p className="text-lg font-semibold text-gray-900">
                <Tooltip title="Event name">Event Name Here</Tooltip>
              </p>
              <div className="flex items-center gap-7">
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-user text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Party name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      Kiran Bhandari
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-geolocation-home text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Venue name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      Bhacantha Resort
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Estimate Date:</span>
                    <span className="text-sm font-medium text-gray-900">
                      04 August 2025
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Tooltip title="Event Status">
                <div
                  className="badge badge-outline badge-success rounded-full badge-lg"
                  title="Approval"
                >
                  Approval
                </div>
              </Tooltip>
              <div className="flex items-center gap-1">
                <button className="btn btn-sm btn-primary" title="Edit">
                  <i className="ki-filled ki-notepad-edit"></i> Edit
                </button>
                <button className="btn btn-sm btn-primary" title="Print">
                  <i className="ki-filled ki-printer"></i> Print
                </button>
                <button className="btn btn-sm btn-primary" title="Share">
                  <i className="ki-filled ki-exit-right-corner"></i> Share
                </button>
                <button className="btn btn-sm btn-primary" title="Chat">
                  <i className="ki-filled ki-messages"></i> Chat
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search function"
                type="text"
              />
            </div>
            <div className="filItems">
              <select className="select pe-7.5">
                <option value="0">Select Function</option>
                <option value="0">Chandlo Matli</option>
                <option value="1">Sagpan / Sagai</option>
                <option value="2">Mehendi</option>
                <option value="3">Sangeet Sandhya</option>
                <option value="4">Mandap Muhurat</option>
                <option value="5">Pithi (Haldi)</option>
                <option value="6">Mameru</option>
                <option value="7">Grah Shanti</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-light" title="Clone">
              <i className="ki-filled ki-additem"></i> Clone
            </button>
            <button className="btn btn-light" title="Layout">
              <i className="ki-filled ki-element-10"></i> Layout
            </button>
            <button className="btn btn-light" title="Presentation">
              <i className="ki-filled ki-menu"></i> Presentation
            </button>
            <button className="btn btn-primary" title="Add Function">
              <i className="ki-filled ki-plus"></i> Add Function
            </button>
          </div>
        </div>
        {/* Description */}
        <div className="card min-w-full mb-9">
          <div className="flex flex-col flex-1">
            <div className="rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg">
              <div className="flex flex-wrap justify-between items-center gap-5 p-4">
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-lg font-semibold leading-none text-gray-900">
                    Description
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      className="btn btn-sm btn-primary"
                      title="Generate Item"
                    >
                      <i className="ki-filled ki-plus"></i> Generate Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center bg-gray-100 font-bold border-y border-gray-200 py-3 px-2">
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[80px]">
                    No.
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[90px]">
                    Image
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[520px]">
                    Name & Description
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[130px]">
                    Size / Sq.ft.
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[130px]">
                    Qty
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[130px]">
                    Rate
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[180px]">
                    Total Price
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 text-center flex-auto">
                    Action
                  </div>
                </div>
                <div className="flex items-center border-b border-gray-200 py-3 px-2">
                  <div className="text-sm font-medium text-gray-700 px-2 w-[80px]">
                    1
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[90px]">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={toAbsoluteUrl("/images/account_img.jpg")}
                      alt="profile"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[520px]">
                    <div className="font-medium text-gray-900 mb-1">
                      Item Name if long Split on three
                    </div>
                    <div className="font-normal text-gray-700">
                      Description if long Split on three lines if name still too
                      long
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input
                      className="input"
                      placeholder="Size / Sq.ft."
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Qty" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Rate" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[180px]">
                    <input
                      className="input"
                      placeholder="Total price"
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-auto text-center flex-auto">
                    <Tooltip title="Delete item">
                      <button className="btn btn-sm btn-icon btn-clear btn-danger">
                        <KeenIcon icon="trash" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center border-b border-gray-200 py-3 px-2">
                  <div className="text-sm font-medium text-gray-700 px-2 w-[80px]">
                    2
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[90px]">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={toAbsoluteUrl("/images/account_img.jpg")}
                      alt="profile"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[520px]">
                    <div className="font-medium text-gray-900 mb-1">
                      Item Name if long Split on three
                    </div>
                    <div className="font-normal text-gray-700">
                      Description if long Split on three lines if name still too
                      long
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input
                      className="input"
                      placeholder="Size / Sq.ft."
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Qty" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Rate" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[180px]">
                    <input
                      className="input"
                      placeholder="Total price"
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-auto text-center flex-auto">
                    <Tooltip title="Delete item">
                      <button className="btn btn-sm btn-icon btn-clear btn-danger">
                        <KeenIcon icon="trash" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center border-b border-gray-200 py-3 px-2">
                  <div className="text-sm font-medium text-gray-700 px-2 w-[80px]">
                    3
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[90px]">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={toAbsoluteUrl("/images/account_img.jpg")}
                      alt="profile"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[520px]">
                    <div className="font-medium text-gray-900 mb-1">
                      Item Name if long Split on three
                    </div>
                    <div className="font-normal text-gray-700">
                      Description if long Split on three lines if name still too
                      long
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input
                      className="input"
                      placeholder="Size / Sq.ft."
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Qty" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Rate" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[180px]">
                    <input
                      className="input"
                      placeholder="Total price"
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-auto text-center flex-auto">
                    <Tooltip title="Delete item">
                      <button className="btn btn-sm btn-icon btn-clear btn-danger">
                        <KeenIcon icon="trash" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center border-b border-gray-200 py-3 px-2">
                  <div className="text-sm font-medium text-gray-700 px-2 w-[80px]">
                    4
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[90px]">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={toAbsoluteUrl("/images/account_img.jpg")}
                      alt="profile"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[520px]">
                    <div className="font-medium text-gray-900 mb-1">
                      Item Name if long Split on three
                    </div>
                    <div className="font-normal text-gray-700">
                      Description if long Split on three lines if name still too
                      long
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input
                      className="input"
                      placeholder="Size / Sq.ft."
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Qty" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Rate" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[180px]">
                    <input
                      className="input"
                      placeholder="Total price"
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-auto text-center flex-auto">
                    <Tooltip title="Delete item">
                      <button className="btn btn-sm btn-icon btn-clear btn-danger">
                        <KeenIcon icon="trash" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className="relative py-4">
                  <div className="absolute left-0 right-0 -bottom-4 text-center">
                    <button
                      className="btn btn-sm btn-success rounded-full"
                      title="Add Item"
                    >
                      <i className="ki-filled ki-plus"></i> Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Description */}
        <div className="card min-w-full mb-7">
          <div className="flex flex-col flex-1">
            <div className="rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg">
              <div className="flex flex-wrap justify-between items-center gap-5 p-4">
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-lg font-semibold leading-none text-gray-900">
                    Estimate Summary
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <button className="btn btn-success" title="Save">
                      <i className="ki-filled ki-save-2"></i> Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between border-t border-gray-200 py-3 px-2">
                  <div className="text-base font-normal text-gray-700 px-2">
                    Haldi Carnival Total
                  </div>
                  <div className="text-base font-semibold text-gray-900 px-2">
                    &#8377; 15,000.00
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 py-3 px-2">
                  <div className="text-base font-normal text-gray-700 px-2">
                    Mayra Groom Side
                  </div>
                  <div className="text-base font-semibold text-gray-900 px-2">
                    &#8377; 25,000.00
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 py-3 px-2">
                  <div className="text-base font-normal text-gray-700 px-2">
                    Wedding Reception Total
                  </div>
                  <div className="text-base font-semibold text-gray-900 px-2">
                    &#8377; 60,000.00
                  </div>
                </div>
                <div className="flex flex-col border-y border-gray-200 border-dashed bg-gray-50 font-bold p-4">
                  <div className="flex items-center justify-between pb-2">
                    <div className="text-base font-medium text-gray-900">
                      Subtotal
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      &#8377; 1,00,000.00
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <div className="text-base font-normal text-gray-700">
                      Discount
                      <span className="ms-1 text-sm text-gray-500">(10%)</span>
                    </div>
                    <div className="input text-base text-gray-900 w-[140px]">
                      <span className="text-base font-semibold text-gray-900">
                        &#8377;
                      </span>
                      <input
                        className="h-full text-gray-900 w-full"
                        value="10,000.00"
                        type="text"
                        placeholder="SGST"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <div className="text-base font-normal text-gray-700">
                      CGST
                      <span className="ms-1 text-sm text-gray-500">(9%)</span>
                    </div>
                    <div className="input text-base text-gray-900 w-[140px]">
                      <span className="text-base font-semibold text-gray-900">
                        &#8377;
                      </span>
                      <input
                        className="h-full text-gray-900 w-full"
                        value="8,100.00"
                        type="text"
                        placeholder="SGST"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <div className="text-base font-normal text-gray-700">
                      SGST
                      <span className="ms-1 text-sm text-gray-500">(9%)</span>
                    </div>
                    <div className="input text-base text-gray-900 w-[140px]">
                      <span className="text-base font-semibold text-gray-900">
                        &#8377;
                      </span>
                      <input
                        className="h-full text-gray-900 w-full"
                        value="8,100.00"
                        type="text"
                        placeholder="SGST"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-5 px-2">
                  <div className="text-xl font-bold text-primary px-2">
                    Grand Total
                  </div>
                  <div className="text-lg font-bold text-primary px-2">
                    &#8377; 1,06,200.00
                  </div>
                </div>
                <div className="flex flex-col border-y border-gray-200 border-dashed bg-gray-50 p-4">
                  <div className="text-base font-semibold text-gray-900 pb-2">
                    Payment Details
                  </div>
                  <div className="flex gap-5 py-1">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-success mt-1">
                      <i className="ki-filled ki-check text-white"></i>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center justify-between">
                        <div className="text-base font-normal text-gray-700">
                          Advance Payment 1
                        </div>
                        <div className="text-base font-semibold text-gray-900">
                          &#8377; 20,000.00
                        </div>
                      </div>
                      <span className="bg-white py-3 px-5 rounded-lg text-xs font-normal text-gray-700 border border-gray-200">
                        Paid Via UPI ON 23th June, 2025. Confirmed
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-5 py-1">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-success mt-1">
                      <i className="ki-filled ki-check text-white"></i>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center justify-between">
                        <div className="text-base font-normal text-gray-700">
                          Advance Payment 2
                        </div>
                        <div className="text-base font-semibold text-gray-900">
                          &#8377; 30,000.00
                        </div>
                      </div>
                      <span className="bg-white py-3 px-5 rounded-lg text-xs font-normal text-gray-700 border border-gray-200">
                        Paid Via UPI ON 23th June, 2025. Confirmed
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-5 px-2">
                  <div className="text-lg font-bold text-success px-2">
                    Total Paid
                  </div>
                  <div className="text-base font-bold text-success px-2">
                    &#8377; 50,000.00
                  </div>
                </div>
                <div className="flex items-center justify-between border-y border-orange-100 border-dashed bg-orange-50 py-7 px-2">
                  <div className="text-xl font-bold text-orange-700 px-2">
                    <i className="ki-filled ki-notification-on"></i> Remaining
                    Payment
                  </div>
                  <div className="text-lg font-bold text-orange-700 px-2">
                    &#8377; 56,200.00
                  </div>
                </div>
                <div className="flex items-center justify-between font-bold py-5 px-4">
                  <div className="max-w-[500px] w-full">
                    <input
                      className="input"
                      placeholder="Add notes"
                      type="text"
                    />
                  </div>
                  <button className="btn btn-success" title="Save">
                    <i className="ki-filled ki-save-2"></i> Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
          <div className="px-5 py-3 font-semibold text-gray-700 bg-gradient-to-b from-blue-100 to-blue-200 border-b border-gray-200"></div>
          <div className="px-4 py-2 bg-gray-100 border-b border-gray-300 font-semibold text-gray-700">
            Order Details
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <span className="font-medium text-gray-600">Customer Name:</span>{" "}
              <span className="text-gray-900">{form.customerName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Mobile Number:</span>{" "}
              <span className="text-gray-900">{form.mobileNumber}</span>
              <span className="text-gray-900">{form.customer_name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Mobile Number:</span>{" "}
              <span className="text-gray-900">{form.mobile_number}</span>

            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <span className="font-medium text-gray-600">
                  Customer Name:
                </span>{" "}
                <span className="text-gray-900">{form.customer_name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">
                  Mobile Number:
                </span>{" "}
                <span className="text-gray-900">{form.mobile_number}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Event Type:</span>{" "}
                <span className="text-gray-900">{form.event_type}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Event Date:</span>{" "}
                <span className="text-gray-900">{form.event_date}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-600">Venue:</span>{" "}
                <span className="text-gray-900">{form.venue}</span>
              </div>
            </div>
            <div className="flex gap-6 px-4 py-2 bg-blue-50 border-b border-gray-200">
              <div className="text-left flex items-center gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="amountType"
                    defaultChecked={form.amount_status === 1}
                  />
                  Rough Amount
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="amountType"
                    value={2}
                    defaultChecked={form.amount_status === 2}
                  />
                  Quotation Amount
                </label>
              </div>
              <div className="flex items-end">
                <Tooltip title="Add">
                  <button className="mb-1" onClick={addQuotation}>
                    <PlusCircle className="text-primary" />
                  </button>
                </Tooltip>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Function</th>
                    <th className="border px-3 py-2 text-left">Date</th>
                    <th className="border px-3 py-2 text-left">Person</th>
                    <th className="border px-3 py-2 text-left">Extra</th>
                    <th className="border px-3 py-2 text-left">
                      Rate (Per Plate)
                    </th>
                    <th className="border px-3 py-2 text-left">Amount</th>
                    <th className="border px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {quotation.map((item, index) => {
                    return (
                      <tr>
                        <td className="border px-2 py-1">
                          <input
                            type="text"
                            name="name"
                            value={item.name}
                            onChange={(e) =>
                              handleInput(index, "name", e.target.value)
                            }
                            className="w-full border px-2 py-1 rounded input"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="datetime-local"
                            name="date"
                            value={item.date}
                            onChange={(e) =>
                              handleInput(index, "date", e.target.value)
                            }
                            className="w-full border px-2 py-1 rounded input"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="number"
                            name="person"
                            value={item.person}
                            onChange={(e) =>
                              handleInput(index, "person", e.target.value)
                            }
                            className="w-full border px-2 py-1 rounded input"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="number"
                            name="extra"
                            value={item.extra}
                            onChange={(e) =>
                              handleInput(index, "extra", e.target.value)
                            }
                            className="w-full border px-2 py-1 rounded input"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="number"
                            name="rate"
                            value={item.rate}
                            onChange={(e) =>
                              handleInput(index, "rate", e.target.value)
                            }
                            className="w-full border px-2 py-1 rounded input"
                          />
                        </td>
                        <td className="border px-2 py-1">
                          <input
                            type="number"
                            name="total"
                            value={item.total}
                            readOnly={true}
                            className="w-full border px-2 py-1 rounded input"
                          />
                        </td>
                        <td className="border px-2 py-1 text-center">
                          {index > 0 && (
                            <button
                              className="btn btn-sm btn-icon btn-clear"
                              title="Remove"
                              onClick={() => removequotation(index)}
                            >
                              <i className="ki-filled ki-trash text-danger"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td className="border px-2 py-1 text-end" colSpan={5}>
                      <span>
                        <b>Total</b>
                      </span>
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        name="total"
                        value={form.total}
                        className="w-full border px-2 py-1 rounded input"
                      />
                    </td>
                    <td className="border px-2 py-1 text-center"> </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1 text-end" colSpan={5}>
                      <span>
                        <b>Tax</b>
                      </span>
                    </td>
                    <td className="border px-2 py-1">
                      <select
                        value={form.tax}
                        name={"tax"}
                        onChange={handleInputData}
                        className="w-100 border px-2 py-1 rounded select"
                      >
                        <option value="">Select</option>
                        <option value="2.5">GST @ 2.5%</option>
                        <option value="3">GST @ 3%</option>
                        <option value="18">GST @ 18%</option>
                      </select>
                    </td>
                    <td className="border px-2 py-1 text-center"> </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1 text-end" colSpan={5}>
                      <span>
                        <b>Discount</b>
                      </span>
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        name="discount"
                        value={form.discount}
                        onChange={handleInputData}
                        className="w-full border px-2 py-1 rounded input"
                      />
                    </td>
                    <td className="border px-2 py-1 text-center"> </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1 text-end" colSpan={5}>
                      <span>
                        <b>Round Off</b>
                      </span>
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        name="round_off"
                        value={form.round_off}
                        onChange={handleInputData}
                        className="w-full border px-2 py-1 rounded input"
                      />
                    </td>
                    <td className="border px-2 py-1 text-center"> </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1 text-end" colSpan={5}>
                      <span>
                        <b>Grand Total</b>
                      </span>
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        name="grand_total"
                        value={form.grand_total}
                        readOnly={true}
                        className="w-full border px-2 py-1 rounded input"
                      />
                    </td>
                    <td className="border px-2 py-1 text-center"> </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1 text-end" colSpan={5}>
                      <span>
                        <b>Advance Payment</b>
                      </span>
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        name="advance"
                        value={form.advance}
                        onChange={handleInputData}
                        className="w-full border px-2 py-1 rounded input"
                      />
                    </td>
                    <td className="border px-2 py-1 text-center"> </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1 text-end" colSpan={5}>
                      <span>
                        <b>Remaining Amount</b>
                      </span>
                    </td>
                    <td className="border px-2 py-1">
                      <input
                        type="number"
                        name="remaining_amount"
                        value={form.remaining_amount}
                        readOnly={true}
                        className="w-full border px-2 py-1 rounded input"
                      />
                    </td>
                    <td className="border px-2 py-1 text-center"> </td>
                  </tr>
                  <tr>
                    <td className="border px-2 py-1" colSpan={7}>
                      <span>
                        <b>Note:</b>
                      </span>
                      <textarea
                        value={form.note}
                        name={"note"}
                        onChange={handleInputData}
                        className="w-full border px-3 py-2 rounded input"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex justify-center gap-3 p-4 border-t border-gray-200">
              <button className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700">
                Save
              </button>
              <button className="bg-red-500 text-white px-5 py-2 rounded shadow hover:bg-red-600">
                Cancel
              </button>
            </div>
            <div className="flex justify-between">
              <span>Advance Payment</span>
              <input
                type="number"
                value={form.advance}
                onChange={(e) => setForm({ ...form, advance: e.target.value })}
                className="w-32 border px-2 py-1 rounded input"
              />
            </div>
            <div className="flex justify-between">
              <span>Remaining Amount</span>
              <input
                readOnly
                value={remaining}
                className="w-32 border px-2 py-1 rounded input"
              />
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <label className="block text-sm mb-1">Note:</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full border px-3 py-2 rounded input"
            />
          </div>
          <div className="flex justify-center gap-3 p-4 border-t border-gray-200">
            <button className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700">
              Save
            </button>
            <button className="bg-red-500 text-white px-5 py-2 rounded shadow hover:bg-red-600">
              Cancel
            </button>
          </div>
        </div> */}
      </Container>
    </Fragment>
  );
};

export default QuotationPage;
