import React, { Fragment, useState } from "react";
import { Container } from "@/components/container";
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
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Quotation" }]} />
        </div>
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-5 py-3 font-semibold text-gray-700 bg-gradient-to-b from-blue-100 to-blue-200 border-b border-gray-200"></div>

          <div className="px-4 py-2 bg-gray-100 border-b border-gray-300 font-semibold text-gray-700">
            Order Details
          </div>
          {/* Body */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div>
              <span className="font-medium text-gray-600">Customer Name:</span>{" "}
              <span className="text-gray-900">{details.customerName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Mobile Number:</span>{" "}
              <span className="text-gray-900">{details.mobileNumber}</span>
            </div>
            {/* Body */}
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

            {/* Radio buttons */}
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

            {/* Table */}
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
            {/* Buttons */}
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

          {/* Notes */}
          <div className="p-4 border-t border-gray-200">
            <label className="block text-sm mb-1">Note:</label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full border px-3 py-2 rounded input"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-3 p-4 border-t border-gray-200">
            <button className="bg-blue-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700">
              Save
            </button>
            <button className="bg-red-500 text-white px-5 py-2 rounded shadow hover:bg-red-600">
              Cancel
            </button>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
export default QuotationPage;
