import BaseSelect from "../ui/BaseSelect";
import BaseInput from "../ui/BaseInput";

export default function AllocateRowOutside() {
  return (
    <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b">
      <BaseSelect>
        <option>Select Vendor</option>
      </BaseSelect>

      <button className="btn-primary">Allocate</button>
      <BaseInput placeholder="Enter pax" />

      <button className="btn-primary">Allocate</button>
    </div>
  );
}
