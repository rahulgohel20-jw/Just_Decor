import { useState } from "react";
import AddGrossary from "@/partials/modals/event/add-grossary/AddGrossary";
import { ChevronDownIcon, ChevronUp } from "lucide-react";
import { table_data, modal_columns, agencies } from "./constant";

const GrossaryItems = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState(table_data);

   const [expandedRows, setExpandedRows] = useState({});

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };



const handleModalOpen = () => {
  setIsModalOpen(true);
};

const expanChildData = (child_data) => {

  return (
    <>
      <div className="grid grid-cols-[150px_200px_200px_80px_120px_120px_160px_100px] items-center bg-gray-200 font-bold border-b border-gray-300 py-2 mb-3">
          <div>Function Type</div>
          <div>Menu Item Name</div>
          <div>Agency</div>
          <div>Qty</div>
          <div>Unit</div>
          <div>Place</div>
          <div>Date & Time</div>
          <div>Price</div>
        </div>

      {child_data.map((item, index) => (
        <div key={index} className="grid grid-cols-[150px_200px_200px_80px_120px_120px_160px_100px] border-b">
          <div className="mr-2 mb-2">{item.function_type}</div>
          <div className="mr-2 mb-2">{item.item_name}</div>
          <div className="mr-2 mb-2">
            <select className="select" value={item.agency} onChange={(e) => handleChange(index, "agency", e.target.value)}>
              <option value="">Select Agency</option>
              {agencies.map((agency, i) => (
                <option key={i} value={agency}>{agency}</option>
              ))}
            </select>
          </div>
          <div className="mr-2 mb-2"><input type="number" className="input" value={item.qty} onChange={(e) => handleChange(index, "qty", e.target.value)} /></div>
          <div className="mr-2 mb-2">
            <select className="select" value={item.unit} onChange={(e) => handleChange(index, "unit", e.target.value)}>
              <option value="Kilogram">Kilogram</option>
              <option value="Gram">Gram</option>
            </select>
          </div>
          <div className="mr-2 mb-2">
            <select className="select" value={item.place} onChange={(e) => handleChange(index, "place", e.target.value)}>
              <option value="At Venue">At Venue</option>
              <option value="Delivery">Delivery</option>
            </select>
          </div>
          <div className="mr-2 mb-2"><input type="datetime-local" className="input" value={item.date_time} onChange={(e) => handleChange(index, "date_time", e.target.value)} /></div>
          <div className="mr-2 mb-2"><input type="number" className="input" value={item.price} onChange={(e) => handleChange(index, "price", e.target.value)} /></div>
        </div>
      ))}
    </>
  )
}

return (
    <>
    <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
      <div className="flex flex-wrap items-end gap-2">
        <button
          className="btn btn-primary"
          onClick={handleModalOpen}
          title="Agency, Place & Date Allocation"
        >
          <i className="ki-filled ki-plus"></i> Agency, Place & Date Allocation 
        </button>
      </div>
    </div>
    <div className={'flex flex-col gap-1 w-full'}>
      {/* Header */}
      <div className={'flex items-center bg-gray-200 font-bold border-b border-gray-300 py-2'}>
        <div className="px-2 w-13"></div>
        <div className="px-2 w-10">#</div>
        <div className="px-2 w-40">Raw Material</div>
        <div className="px-2 w-28">Qty</div>
        <div className="px-2 w-28">Final Qty</div>
        <div className="px-2 w-28">Unit</div>
        <div className="px-2 w-40">Agency</div>
        <div className="px-2 w-40">Place</div>
        <div className="px-2 w-35">Total Price</div>
      </div>

        {/* Data Rows */}
        {table_data.map((row, index) => (
          <>
          <div className={'flex items-center border-b border-gray-300 py-2'} key={row.sr_no}>
            <div
              className="px-2 w-13 cursor-pointer flex justify-center"
              onClick={() => toggleExpand(row.sr_no)}
            >
              {expandedRows[row.sr_no] ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div className="px-2 w-10">{index + 1}</div>
            <div className="px-2 w-40">{row.row_material}</div>
            <div className="px-2 w-28">{row.qty}</div>
            <div className="px-2 w-28">
              <input type="number" className="input" value={row.final_qty} />
            </div>
            <div className="px-2 w-40">
              <select className="select pe-7.5" defaultValue={row.unit}>
                <option>Kilogram</option>
                <option>Gram</option>
              </select>
            </div>
            <div className="px-2 w-40">
              {row.agency}
            </div>
            <div className="px-2 w-40">
                {row.place}
            </div>
            <div className="px-2 w-35">
              <input type="number" className="input" value={row.total_price} />
            </div>
          </div>
             {/* Expanded Details */}
              {expandedRows[row.sr_no] && (
                <div className="bg-gray-50 text-sm px-4 py-2 mt-4 border-t border-gray-200">
                  { row.child_data && expanChildData(row.child_data)}
                </div>
              )}
              </>
        ))}
    </div>
        {/* Total Price and save button*/}
      <div className="flex items-center justify-center gap-5 bg-gray-200 border-b border-gray-300 py-2">
        <div className="font-bold">Total Price: 133353.50</div>
        <button
          className="btn btn-primary save-btn"
          title="Save"
        >
          Save
        </button>
      </div>
      <AddGrossary
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        columns={modal_columns}
        tableData={tableData}
      />
    </>
  );
};

export default GrossaryItems;
