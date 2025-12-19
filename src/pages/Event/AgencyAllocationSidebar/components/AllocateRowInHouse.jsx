import { useState, useEffect } from "react";
import BaseSelect from "../ui/BaseSelect";
import BaseInput from "../ui/BaseInput";
import Swal from "sweetalert2";
import { OutsideContactName } from "@/services/apiServices";

export default function AllocateRowInHouse({ onAllocate }) {
  const userid = localStorage.getItem("userId");
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [pax, setPax] = useState("");
  const [loading, setLoading] = useState(true);

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

      Swal.fire({
        title: "Error",
        text: "Failed to load vendors",
        icon: "error",
      });
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

    const vendor = vendors.find((v) => String(v.id) === String(selectedVendor));

    if (!vendor) {
      Swal.fire({
        title: "Error",
        text: "Selected vendor not found",
        icon: "error",
      });
      return;
    }

    const success = onAllocate({
      partyId: vendor.id,
      partyName: vendor.nameEnglish || "",
      number: vendor.mobileno || "",
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
    <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b">
      <BaseSelect
        value={selectedVendor}
        onChange={(e) => setSelectedVendor(e.target.value)}
        disabled={loading}
      >
        <option value="">
          {loading ? "Loading vendors..." : "Select Vendor"}
        </option>
        {vendors.map((vendor) => (
          <option key={vendor.id} value={vendor.id}>
            {vendor.nameEnglish || ""}
          </option>
        ))}
      </BaseSelect>

      <BaseInput
        placeholder="Enter pax"
        value={pax}
        onChange={(e) => setPax(e.target.value)}
        type="number"
        min="0"
      />

      <button className="btn-primary" onClick={handleAllocate}>
        Allocate
      </button>
    </div>
  );
}
