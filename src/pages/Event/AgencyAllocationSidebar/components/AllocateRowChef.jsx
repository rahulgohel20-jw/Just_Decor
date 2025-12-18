import { useState } from "react";
import BaseSelect from "../ui/BaseSelect";
import BaseInput from "../ui/BaseInput";

export default function AllocateRowChef({ onAllocate }) {
  const [type, setType] = useState("");

  return (
    <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b">
      <BaseSelect>
        <option>Select Agency</option>
      </BaseSelect>

      <BaseSelect value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Select Type</option>
        <option value="counter">Counter Wise</option>
        <option value="plate">Plate Wise</option>
      </BaseSelect>

      <BaseInput placeholder="Enter pax" />

      <button className="btn-primary">Allocate</button>
    </div>
  );
}
