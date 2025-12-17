import BaseInput from "../ui/BaseInput";
import BaseSelect from "../ui/BaseSelect";

export default function ChefLabourPlateTable() {
  return (
    <div className="mt-3 px-6 pb-6 overflow-x-auto">
      <div className="border rounded-xl bg-white overflow-hidden">
        <table className="w-full border-collapse text-sm">
          {/* COLUMN WIDTH CONTROL */}
          <colgroup>
            <col className="w-[44px]" />
            <col className="w-[60px]" />
            <col className="w-[160px]" />
            <col className="w-[100px]" />
            <col className="w-[220px]" />
            <col className="w-[170px]" />
            <col className="w-[120px]" />
            <col className="w-[140px]" />
            <col className="w-[120px]" />
          </colgroup>

          {/* HEADER */}
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-600 text-xs font-semibold">
              <th rowSpan={2} className="p-3 text-center">
                <input type="checkbox" />
              </th>
              <th rowSpan={2} className="p-3 text-left">
                No.
              </th>
              <th rowSpan={2} className="p-3 text-left">
                Item Name
              </th>
              <th rowSpan={2} className="p-3 text-left">
                Pax
              </th>
              <th rowSpan={2} className="p-3 text-left">
                Contact Name
              </th>
              <th rowSpan={2} className="p-3 text-left">
                Type
              </th>
              <th colSpan={2} className="p-3 text-center border-l">
                Quantity
              </th>
              <th colSpan={1} className="p-3 text-center border-l">
                Price
              </th>
              <th rowSpan={2} className="p-3 text-left border-l">
                Total
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            <tr className="border-b hover:bg-gray-50 align-middle">
              <td className="p-3 text-center">
                <input type="checkbox" />
              </td>
              <td className="p-3">1</td>
              <td className="p-3">Paneer tikka </td>

              <td className="p-2">
                <BaseInput placeholder="Pax" />
              </td>
              <td className="p-2">
                <BaseSelect>
                  <option>Select Name</option>
                </BaseSelect>
              </td>

              <td className="p-2">
                <BaseSelect>
                  <option>Select Type</option>
                  <option value="Counter Wise">Counter Wise</option>
                  <option value="Plate Wise">Plate Wise</option>
                </BaseSelect>
              </td>

              <td className="p-2">
                <BaseInput placeholder="0" />
              </td>

              <td className="p-2">
                <BaseSelect>
                  <option>Select Unit</option>
                </BaseSelect>
              </td>

              <td className="p-2">
                <BaseInput placeholder="0" />
              </td>
              <td className="p-2">
                <BaseInput disabled placeholder="0" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
