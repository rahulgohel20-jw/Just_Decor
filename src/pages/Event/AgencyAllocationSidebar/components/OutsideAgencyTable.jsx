import BaseInput from "../ui/BaseInput";
import BaseSelect from "../ui/BaseSelect";

export default function OutsideAgencyTable() {
  return (
    <div className="mt-3 px-6 pb-6 overflow-x-auto">
      <div className="border rounded-xl bg-white overflow-hidden">
        <table className="w-full border-collapse text-sm">
          {/* COLUMN WIDTH CONTROL */}
          <colgroup>
            <col className="w-[44px]" /> {/* checkbox */}
            <col className="w-[60px]" /> {/* no */}
            <col className="w-[160px]" /> {/* no */}
            <col className="w-[100px]" /> {/* no */}
            <col className="w-[220px]" /> {/* contact */}
            <col className="w-[160px]" /> {/* type */}
            <col className="w-[140px]" /> {/* qty counter */}
            <col className="w-[140px]" /> {/* price counter */}
            <col className="w-[120px]" /> {/* total */}
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
                Item name
              </th>
              <th rowSpan={2} className="p-3 text-left">
                Pax
              </th>
              <th rowSpan={2} className="p-3 text-left">
                Contact Name
              </th>
              <th colSpan={1} className="p-3 text-center ">
                Unit
              </th>
              <th colSpan={1} className="p-3 text-center ">
                Quantity
              </th>
              <th rowSpan={2} className="p-3 text-left">
                Price
              </th>
              <th rowSpan={2} className="p-3 text-left border-l">
                Total Price
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
              <td className="p-3">Dosa</td>
              <td className="p-2">
                <BaseInput placeholder="0" />
              </td>
              <td className="p-2">
                <BaseSelect>
                  <option>Select Name</option>
                </BaseSelect>
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
