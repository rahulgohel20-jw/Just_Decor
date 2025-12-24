import { useState, useEffect } from "react";
import BaseSelect from "../ui/BaseSelect";
import BaseInput from "../ui/BaseInput";
import Swal from "sweetalert2";
import { OutsideContactName } from "@/services/apiServices";

export default function AllocateRowChef({ onAllocate }) {
  const userid = localStorage.getItem("userId");
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [pax, setPax] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      setLoading(true);
      const partyMasters = await OutsideContactName(5, userid);
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
        title: "Missing Agency",
        text: "Please select an agency",
        icon: "warning",
      });
      return;
    }

    if (!serviceType) {
      Swal.fire({
        title: "Missing Service Type",
        text: "Please select a service type",
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
        text: "Selected agency not found",
        icon: "error",
      });
      return;
    }

    const success = onAllocate({
      partyId: vendor.id,
      partyName: vendor.nameEnglish || "",
      number: vendor.mobileno || "",
      pax,
      serviceType,
    });

    if (success) {
      Swal.fire({
        title: "Allocated",
        text: "Agency allocated successfully",
        icon: "success",
        timer: 1500,
        buttons: false,
      });

      setSelectedVendor("");
      setPax("");
      setServiceType("");
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
          {loading ? "Loading vendors..." : "Select Agency"}
        </option>
        {vendors.map((vendor) => (
          <option key={vendor.id} value={vendor.id}>
            {vendor.nameEnglish || ""}
          </option>
        ))}
      </BaseSelect>

      <BaseSelect
        value={serviceType}
        onChange={(e) => setServiceType(e.target.value)}
      >
        <option value="">Select Type</option>
        <option value="counter_wise">Counter Wise</option>
        <option value="plate_wise">Plate Wise</option>
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
