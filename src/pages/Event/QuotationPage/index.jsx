import React, { Fragment, useState  } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import useStyles from "./style";
import { PlusCircle } from "lucide-react";
import { Tooltip } from "antd";
import Oderdetail from "@/components/quotation/Oderdetail";
import ActionsSection from "../../../components/quotation/ActionSection";
import FunctionSection from "../../../components/quotation/FunctionSection/FunctionSection";
import Estimatesection from "../../../components/quotation/estimate/Estimatesection";

const QuotationPage = () => {
  const classes = useStyles();

   const details = {
    customerName: "AKSHAY BHAI PBN",
    mobileNumber: "8000217871",
    eventType: "get to gather",
    eventDate: "30/07/2025",
    venue: "LA GANESHA FARM, CANAL ROAD",
  };

    const [form, setForm] = useState({
    functionName: "DINNER",
    date: "2025-07-30T18:00",
    person: 400,
    extra: 0,
    rate: 0,
    amount: 0,
    tax: "",
    discount: 0,
    roundOff: 0,
    advance: 0,
    note: "",
  });

  // Calculate totals
  const total = (Number(form.person) + Number(form.extra)) * Number(form.rate);
  const grandTotal =
    total - Number(form.discount) + Number(form.roundOff) + Number(form.tax || 0);
  const remaining = grandTotal - Number(form.advance);

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Quotation" }]} />
        </div>
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
            {/* Header */}
                <div className="quotation-container">
                       <Oderdetail />
              {/* Header */}
              {/* action */}
              <ActionsSection />
              <div className="px-4 py-2 bg-gray-100 border-b border-gray-300 font-semibold text-gray-700">
                Quotation
              </div>

<FunctionSection/>
              {/* Radio buttons */}
              {/* <div className="flex gap-6 px-4 py-2 bg-blue-50 border-b border-gray-200">
                <div className="text-left flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="amountType"/>
                    Rough Amount
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="amountType" defaultChecked />
                    Quotation Amount
                  </label>
                </div>
                <div className="text-end">
                <Tooltip title="Add">
                  <button  className="mb-1">
                    <PlusCircle className="text-primary" />
                  </button>
                </Tooltip>
                </div>
              </div> */}

              {/* Table */}
              {/* <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-3 py-2 text-left">Function</th>
                      <th className="border px-3 py-2 text-left">Date</th>
                      <th className="border px-3 py-2 text-left">Person</th>
                      <th className="border px-3 py-2 text-left">Extra</th>
                      <th className="border px-3 py-2 text-left">Rate (Per Plate)</th>
                      <th className="border px-3 py-2 text-left">Amount</th>
                      <th className="border px-3 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1">
                        <input
                          type="text"
                          value={form.functionName}
                          onChange={(e) => setForm({ ...form, functionName: e.target.value })}
                          className="w-full border px-2 py-1 rounded input"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="datetime-local"
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="w-full border px-2 py-1 rounded input"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          value={form.person}
                          onChange={(e) => setForm({ ...form, person: e.target.value })}
                          className="w-full border px-2 py-1 rounded input"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          value={form.extra}
                          onChange={(e) => setForm({ ...form, extra: e.target.value })}
                          className="w-full border px-2 py-1 rounded input"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          value={form.rate}
                          onChange={(e) => setForm({ ...form, rate: e.target.value })}
                          className="w-full border px-2 py-1 rounded input"
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          value={total}
                          className="w-full border px-2 py-1 rounded input"
                        />
                      </td>
                      <td className="border px-2 py-1 text-center"> </td>
                    </tr>
                  </tbody>
                </table>
              </div> */}

              {/* Totals */}
              {/* <div className="p-4 grid grid-cols-2 gap-3 text-sm bg-gray-50">
                <div className="flex justify-between">
                  <span>Total</span>
                  <input readOnly value={total} className="w-32 border px-2 py-1 rounded input" />
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <select
                    value={form.tax}
                    onChange={(e) => setForm({ ...form, tax: e.target.value })}
                    className="w-32 border px-2 py-1 rounded select"
                  >
                    <option value="">Select</option>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="18">18%</option>
                  </select>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <input
                    type="number"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-32 border px-2 py-1 rounded input"
                  />
                </div>
                <div className="flex justify-between">
                  <span>Round Off</span>
                  <input
                    type="number"
                    value={form.roundOff}
                    onChange={(e) => setForm({ ...form, roundOff: e.target.value })}
                    className="w-32 border px-2 py-1 rounded input"
                  />
                </div>
                <div className="flex justify-between">
                  <span>Grand Total</span>
                  <input readOnly value={grandTotal} className="w-32 border px-2 py-1 rounded input" />
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
                  <input readOnly value={remaining} className="w-32 border px-2 py-1 rounded input" />
                </div>
              </div> */}




<Estimatesection/>
              {/* Notes */}
           <div className="p-4 border-t border-gray-200 flex items-start justify-between gap-4">
  {/* Left: Note */}
  <div className="w-1/2">
    
    <textarea
      value={form.note}
      placeholder="Note:"
      onChange={(e) => setForm({ ...form, note: e.target.value })}
      className="w-full border px-3 py-2 rounded input"
      rows="3"
    />
  </div>

  {/* Right: Save Button */}
  <div className="flex items-end">
    <button className="bg-green-600 text-white px-5 py-2 rounded shadow hover:bg-blue-700 me-3">
      <i className="ki-filled ki-copy-success"></i> Save
    </button>
  </div>
</div>


              {/* Buttons */}
             
            </div>
        </div>
      </Container>
    </Fragment>
  );
};
export default QuotationPage;
