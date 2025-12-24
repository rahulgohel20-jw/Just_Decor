import { useEffect, useState } from "react";
import BaseSelect from "../ui/BaseSelect";
import BaseInput from "../ui/BaseInput";
import Swal from "sweetalert2";
import { OutsideContactName } from "@/services/apiServices";

export default function AllocateRowOutside({ onAllocate }) {
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
      const partyMasters = await OutsideContactName(6, userid);
      const data = partyMasters.data.data["Party Details"] || [];
      setVendors(data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAllocate = () => {
    if (!selectedVendor) {
      Swal.fire({
        title: "Missing Vendor",
        text: "Please select a vendor",
        icon: "warning",
      });
      return;
    }

    if (!pax || pax <= 0) {
      Swal.fire({
        title: "Invalid Pax",
        text: "Please enter a valid pax value",
        icon: "warning",
      });
      return;
    }

    const selectedVendorData = vendors.find(
      (v) => String(v.id) === String(selectedVendor)
    );

    const success = onAllocate({
      partyId: selectedVendor,
      partyName: selectedVendorData?.nameEnglish || "",
      pax,
    });

    if (success) {
      Swal.fire({
        title: "Allocated",
        text: "Vendor allocated successfully",
        icon: "success",
        timer: 1500,
        buttons: false,
      });

      setSelectedVendor("");
      setPax("");
    }
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
