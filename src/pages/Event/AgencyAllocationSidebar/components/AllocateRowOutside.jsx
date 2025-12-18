import { useEffect, useState } from "react";
import BaseSelect from "../ui/BaseSelect";
import BaseInput from "../ui/BaseInput";
import { OutsideContactName } from "@/services/apiServices";

export default function AllocateRowOutside({ eventFunction, onAllocate }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [pax, setPax] = useState("");
  const userid = localStorage.getItem("userId");

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      setLoading(true);
      const partyMasters = await OutsideContactName(7, userid);
      const data = partyMasters.data.data["Party Details"] || [];
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocate = () => {
    if (!selectedVendor || !pax) {
      alert("Please select a vendor and enter pax");
      return;
    }

    onAllocate({
      contactId: selectedVendor,
      pax: pax,
    });

    // Reset form
    setSelectedVendor("");
    setPax("");
  };

  return (
    <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b">
      <BaseSelect
        value={selectedVendor}
        onChange={(e) => setSelectedVendor(e.target.value)}
        disabled={loading}
      >
        <option value="">{loading ? "Loading..." : "Select Vendor"}</option>
        {vendors.map((vendor) => (
          <option key={vendor.id} value={vendor.id}>
            {vendor.nameEnglish}
          </option>
        ))}
      </BaseSelect>

      <BaseInput
        type="number"
        placeholder="Enter pax"
        value={pax}
        onChange={(e) => setPax(e.target.value)}
      />

      <button className="btn-primary" onClick={handleAllocate}>
        Allocate
      </button>
    </div>
  );
}
