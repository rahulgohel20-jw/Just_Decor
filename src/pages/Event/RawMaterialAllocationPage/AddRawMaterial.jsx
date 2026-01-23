import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import PlaceSelect from "../../../components/PlaceSelect/PlaceSelect";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import { FormattedMessage, useIntl } from "react-intl";

const AddRawMaterial = ({
  isOpen,
  onClose,
  onSave,
  agencies,
  unit,
  eventFunctions = [],
}) => {
  const intl = useIntl();

  const [formData, setFormData] = useState({
    material: "",
    qty: 0,
    finalQty: 0,
    total: 0,
    basePricePerUnit: 0,
    unit: "KILO",
    unitId: 1,
    agency: "",
    supplierId: 0,
    place: "",
    placeId: 0,
    date: null,
    eventFunctionId: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        material: "",
        qty: 0,
        finalQty: 0,
        total: 0,
        basePricePerUnit: 0,
        unit: "KILO",
        unitId: 1,
        agency: "",
        supplierId: 0,
        place: "",
        placeId: 0,
        date: null,
        eventFunctionId: 0,
      });
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    const total = formData.finalQty * formData.basePricePerUnit;
    setFormData((prev) => ({ ...prev, total }));
  }, [formData.finalQty, formData.basePricePerUnit]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleAgencyChange = (value) => {
    const selectedAgency = agencies.find(
      (a) => a.nameEnglish === value || a.name === value,
    );
    setFormData((prev) => ({
      ...prev,
      agency: value,
      supplierId: selectedAgency?.id || 0,
    }));
    setErrors((prev) => ({ ...prev, agency: "" }));
  };

  const handleUnitChange = (value) => {
    const selectedUnit = unit.find((u) => u.id === Number(value));
    setFormData((prev) => ({
      ...prev,
      unitId: Number(value),
      unit: selectedUnit?.nameEnglish || "KILO",
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.material.trim())
      newErrors.material = "Material name is required";
    if (formData.qty <= 0) newErrors.qty = "Quantity must be greater than 0";
    if (formData.finalQty <= 0)
      newErrors.finalQty = "Final quantity must be greater than 0";
    if (!formData.agency) newErrors.agency = "Agency is required";
    if (!formData.place) newErrors.place = "Place is required";
    if (formData.eventFunctionId === 0)
      newErrors.eventFunctionId = "Please select a function";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const selectedFunction = eventFunctions.find(
      (f) => f.eventFunctionId === formData.eventFunctionId,
    );

    const newRowData = {
      id: Date.now(),
      rawMaterialId: 0, // ✅ 0 for new items
      material: formData.material,
      qty: parseFloat(formData.qty) || 0,
      finalQty: parseFloat(formData.finalQty) || 0,
      total: parseFloat(formData.total) || 0,
      basePricePerUnit: parseFloat(formData.basePricePerUnit) || 0,
      unit: formData.unit,
      unitId: formData.unitId,
      agency: formData.agency,
      supplierId: formData.supplierId,
      place: formData.place,
      placeId: formData.placeId,
      date: formData.date,
      eventFunctionId: formData.eventFunctionId, // ✅ Store for later use
      isNewRow: true,
      eventRawMaterialFunctions: [], // ✅ Empty array - don't populate this for new items
    };

    onSave(newRowData);
    onClose();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Add New Raw Material</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
    >
      <div className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Function <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full border ${errors.eventFunctionId ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
            value={formData.eventFunctionId}
            onChange={(e) =>
              handleChange("eventFunctionId", Number(e.target.value))
            }
          >
            <option value={0}>Select Function</option>
            {eventFunctions.map((func) => (
              <option key={func.eventFunctionId} value={func.eventFunctionId}>
                {func.functionName}
              </option>
            ))}
          </select>
          {errors.eventFunctionId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.eventFunctionId}
            </p>
          )}
        </div>

        {/* Material Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full border ${errors.material ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
            value={formData.material}
            onChange={(e) => handleChange("material", e.target.value)}
            placeholder="Enter material name"
          />
          {errors.material && (
            <p className="text-red-500 text-xs mt-1">{errors.material}</p>
          )}
        </div>

        {/* Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className={`w-full border ${errors.qty ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
              value={formData.qty}
              onChange={(e) => handleChange("qty", e.target.value)}
              placeholder="0"
            />
            {errors.qty && (
              <p className="text-red-500 text-xs mt-1">{errors.qty}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Final Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              className={`w-full border ${errors.finalQty ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
              value={formData.finalQty}
              onChange={(e) => handleChange("finalQty", e.target.value)}
              placeholder="0"
            />
            {errors.finalQty && (
              <p className="text-red-500 text-xs mt-1">{errors.finalQty}</p>
            )}
          </div>
        </div>

        {/* Unit & Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.unitId}
              onChange={(e) => handleUnitChange(e.target.value)}
            >
              {unit.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nameEnglish}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Per Unit
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.basePricePerUnit}
              onChange={(e) => handleChange("basePricePerUnit", e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        {/* Agency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Agency <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full border ${errors.agency ? "border-red-500" : "border-gray-300"} rounded px-3 py-2`}
            value={formData.agency}
            onChange={(e) => handleAgencyChange(e.target.value)}
          >
            <option value="">Select Agency</option>
            {agencies.map((agency) => (
              <option key={agency.id} value={agency.nameEnglish || agency.name}>
                {agency.nameEnglish || agency.name}
              </option>
            ))}
          </select>
          {errors.agency && (
            <p className="text-red-500 text-xs mt-1">{errors.agency}</p>
          )}
        </div>

        {/* Place */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Place <span className="text-red-500">*</span>
          </label>
          <PlaceSelect
            value={formData.place}
            onChange={(value, placeId) => {
              setFormData((prev) => ({
                ...prev,
                place: value,
                placeId: placeId || 0,
              }));
              setErrors((prev) => ({ ...prev, place: "" }));
            }}
          />
          {errors.place && (
            <p className="text-red-500 text-xs mt-1">{errors.place}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date & Time
          </label>
          <DatePicker
            selected={formData.date ? dayjs(formData.date).toDate() : null}
            onChange={(date) => handleChange("date", date ? dayjs(date) : null)}
            showTimeSelect
            timeFormat="hh:mm aa"
            dateFormat="MM/dd/yyyy hh:mm aa"
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholderText="Select date and time"
          />
        </div>

        {/* Total */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
            value={formData.total.toFixed(2)}
            readOnly
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Add Material
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddRawMaterial;
