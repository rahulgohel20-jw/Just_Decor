import { useState, useEffect } from "react";
import {
  AddRawMaterialCat,
  EditRawMaterialCat,
  GetRawType,
} from "@/services/apiServices";
import RawMaterialDropdown from "@/components/dropdowns/MealTypeDropdown";
import { Checkbox } from "antd";
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
import Swal from "sweetalert2";
const AddRawMaterial = ({
  isOpen,
  onClose,
  rawMaterialCategory,
  refreshData,
}) => {
  if (!isOpen) return null;

  const initialFormState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    sequence: null,
    rawMaterialCatTypeId: "",
    isDirect: false,
  };
  const [formData, setFormData] = useState(initialFormState);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    if (rawMaterialCategory) {
      console.log(rawMaterialCategory, "data");

      setFormData({
        nameEnglish: rawMaterialCategory.name || "",
        nameGujarati: rawMaterialCategory.nameGujarati || "",
        nameHindi: rawMaterialCategory.nameHindi || "",
        sequence: rawMaterialCategory.priority,
        rawMaterialCatTypeId: rawMaterialCategory.rawCatid || "",
        rawMaterialCatTypename: rawMaterialCategory.rawtype || "",
        isDirect: rawMaterialCategory.isDirect || false,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [rawMaterialCategory]);
  useEffect(() => {
    FetchRawType();
  }, []);
  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;
  const FetchRawType = () => {
    GetRawType(Id)
      .then((res) => {
        const rawData =
          res?.data?.data?.["Raw Material Category Type Details"] || [];
        console.log(rawData);

        setOptions(
          rawData.map((item) => ({
            label: item.nameEnglish,
            value: item.id,
          }))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sequence" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.id) {
      alert("User data not found");
      return;
    }

    if (rawMaterialCategory) {
      const payload = { ...formData, userId: userData.id };

      EditRawMaterialCat(rawMaterialCategory.rawCatid, payload)
        .then((response) => {
          if (
            response?.data?.msg?.toLowerCase().includes("Successfully") ||
            response?.status === 200
          ) {
            Swal.fire({
              title: response?.data?.msg,
              text: "",
              icon: "success",
              background: "#f5faff",
              color: "#003f73",
              confirmButtonText: "Okay",
              confirmButtonColor: "#005BA8",
              showClass: {
                popup: `
                          animate__animated
                          animate__fadeInDown
                          animate__faster
                        `,
              },
              hideClass: {
                popup: `
                          animate__animated
                          animate__fadeOutUp
                          animate__faster
                        `,
              },
              customClass: {
                popup: "rounded-2xl shadow-xl",
                title: "text-2xl font-bold",
                confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
              },
            });
          } else {
            response.data?.msg && errorMsgPopup(response.data.msg);
            console.error("Backend returned an error:", response);
          }
          refreshData();
          onClose();
        })
        .catch((error) => {
          console.error("Error editing meal:", error);
        });
    } else {
      const payload = { ...formData, userId: userData.id };
      AddRawMaterialCat(payload)
        .then((response) => {
          if (
            response?.data?.msg?.toLowerCase().includes("Successfully") ||
            response?.status === 200
          ) {
            Swal.fire({
              title: response?.data?.msg,
              text: "",
              icon: "success",
              background: "#f5faff",
              color: "#003f73",
              confirmButtonText: "Okay",
              confirmButtonColor: "#005BA8",
              showClass: {
                popup: `
                          animate__animated
                          animate__fadeInDown
                          animate__faster
                        `,
              },
              hideClass: {
                popup: `
                          animate__animated
                          animate__fadeOutUp
                          animate__faster
                        `,
              },
              customClass: {
                popup: "rounded-2xl shadow-xl",
                title: "text-2xl font-bold",
                confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
              },
            });
          } else {
            response.data?.msg && errorMsgPopup(response.data.msg);
            console.error("Backend returned an error:", response);
          }
          refreshData();
          onClose();
        })
        .catch((error) => {
          console.error("Error adding meal:", error);
        });
    }
  };
  const handleRawMaterialCat = (value) => {
    setFormData({ ...formData, rawMaterialCatTypeId: value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {" "}
            {rawMaterialCategory
              ? "Edit Raw Material Category"
              : "New Raw Material Category"}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="text-2xl text-gray-600"
          >
            &times;
          </button>
        </div>
        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* Name fields */}
          <InputWithIcon
            label="Name (English)"
            name="nameEnglish"
            value={formData.nameEnglish}
            onChange={handleChange}
            required
          />
          <InputWithIcon
            label="Name (ગુજરાતી)"
            name="nameGujarati"
            value={formData.nameGujarati}
            onChange={handleChange}
            required
          />
          <InputWithIcon
            label="Name (हिंदी)"
            name="nameHindi"
            value={formData.nameHindi}
            onChange={handleChange}
            required
          />

          <label className="block text-gray-600 font-medium ">Type</label>
          <RawMaterialDropdown
            value={formData.rawMaterialCatTypeId || ""}
            name="rawMaterialCatTypeId"
            onChange={handleRawMaterialCat}
            createBtn={true}
            options={options}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />

          <InputWithIcon
            label="sequence"
            name="sequence"
            value={formData.sequence}
            onChange={handleChange}
            required
          />

          <Checkbox
            name="isDirect"
            checked={formData.isDirect}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isDirect: e.target.checked }))
            }
          >
            Direct Order
          </Checkbox>
        </div>
        <div className="flex w-full justify-end mt-6 gap-3">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
            onClick={handleSubmit}
          >
            {rawMaterialCategory ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const InputWithIcon = ({ label, name, value, onChange, required }) => (
  <div className="relative">
    <label className="block text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-lg p-2 w-full"
      placeholder={label}
      required={required}
    />
    {/* Mic icon */}
    <span className="absolute right-2 top-9 text-blue-500 cursor-pointer">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 14a4 4 0 004-4V5a4 4 0 10-8 0v5a4 4 0 004 4zm1 2.93a7 7 0 01-5.2-2.11A1 1 0 104.8 16.8 9 9 0 0010 19a9 9 0 005.2-2.2 1 1 0 00-1.4-1.4A7 7 0 0111 16.93z" />
      </svg>
    </span>
  </div>
);

export default AddRawMaterial;
