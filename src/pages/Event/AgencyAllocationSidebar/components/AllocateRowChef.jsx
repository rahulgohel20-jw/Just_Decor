import { useState } from "react";
import BaseSelect from "../ui/BaseSelect";
import BaseInput from "../ui/BaseInput";

export default function AllocateRowChef({ onAllocate }) {
  const [type, setType] = useState("");

  const handleAllocate = () => {
    if (!type) return;
    onAllocate(type);
  };

  return (
    <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b">
      <BaseSelect>
        <option>Select Agency</option>
      </BaseSelect>

      <button className="btn-primary">Allocate</button>

      <BaseSelect value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Select Type</option>
        <option value="counter">Counter Wise</option>
        <option value="plate">Plate Wise</option>
      </BaseSelect>

      <button className="btn-primary" onClick={handleAllocate} disabled={!type}>
        Allocate
      </button>

      <BaseInput placeholder="Enter pax" />

      <button className="btn-primary">Allocate</button>
    </div>
  );
}
