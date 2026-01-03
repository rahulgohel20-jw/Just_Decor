import { CustomModal } from "@/components/custom-modal/CustomModal";
import { useEffect, useState } from "react";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import useStyle from "./style";
import AddSupplier from "../add-supplier/AddSupplier";
import AddVendor from "../../../partials/modals/add-vendor/AddVendor";
import Select from "react-select";

import AddRawMaterialCategory from "@/partials/modals/raw-material-category/AddRawMaterial";

import {
  GetRawMaterialcategory,
  GetUnitData,
  DeleteSuplier,
  Addrawmaterial,
  EditRawMaterial,
  Translateapi,
} from "@/services/apiServices";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

const validationSchema = Yup.object().shape({
  nameEnglish: Yup.string().required(" Name is required"),
  rawCategoryId: Yup.string().required("Raw Material Category is required"),
  unitid: Yup.string().required("Unit is required"),
  supplierRate: Yup.number()
    .typeError("Supplier Rate must be a number")
    .positive("Supplier Rate must be positive")
    .nullable(),
  priority: Yup.number()
    .typeError("Priority must be a number")
    .integer("Priority must be an integer")
    .nullable(),
  weight: Yup.number()
    .typeError("Weight must be a number")
    .positive("Weight must be positive")
    .nullable(),
});

const AddRawMaterial = ({ isOpen, onClose, refreshData, rawmaterial }) => {
  const classes = useStyle();
  const [searchQuery, setSearchQuery] = useState("");
  const [tableData, setTableData] = useState(defaultData);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [rawCategory, setRawCategory] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [isRawCategoryModalOpen, setIsRawCategoryModalOpen] = useState(false);
  const [isVendorOpen, setIsVendorOpen] = useState(false);
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [selectedRawMaterialCategory, setSelectedRawMaterialCategory] =
    useState(null);
  const intl = useIntl();
  let id = localStorage.getItem("userId");

  const formik = useFormik({
    initialValues: {
      nameEnglish: "",
      nameGujarati: "",
      nameHindi: "",
      rawCategoryId: "",
      unitid: "",
      supplierRate: "",
      priority: "",
      generalFixAccess: false,
      weight: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      // Create FormData instead of JSON
      const formData = new FormData();

      // Append basic fields
      formData.append("isGeneralFix", values.generalFixAccess);
      formData.append("nameEnglish", values.nameEnglish.trim());
      formData.append("nameGujarati", values.nameGujarati.trim() || "");
      formData.append("nameHindi", values.nameHindi.trim() || "");
      formData.append("rawMaterialCatId", parseInt(values.rawCategoryId));
      formData.append("sequence", parseInt(values.priority) || 0);
      formData.append("supplierRate", parseFloat(values.supplierRate) || 0);
      formData.append("unitId", parseInt(values.unitid));
      formData.append("userId", parseInt(id));
      formData.append("weightPer100Pax", parseFloat(values.weight) || 0);

      // Append image file if exists
      if (imageFile) {
        formData.append("file", imageFile);
      }

      // Append supplier data separately
      tableData.forEach((supplier, index) => {
        formData.append(
          `rawMaterialSupplierRequestDtos[${index}].id`,
          supplier.backendId || 0
        );
        formData.append(
          `rawMaterialSupplierRequestDtos[${index}].idDefault`,
          supplier.isDefault || false
        );
        formData.append(
          `rawMaterialSupplierRequestDtos[${index}].partyId`,
          parseInt(supplier.supplierId)
        );
      });

      try {
        let response;
        if (rawmaterial) {
          response = await EditRawMaterial(
            rawmaterial.raw_material_id,
            formData
          );
        } else {
          response = await Addrawmaterial(formData);
        }

        if (response && (response.success || response.data.success === true)) {
          Swal.fire({
            title: "Success!",
            text: `Raw material ${rawmaterial ? "updated" : "saved"} successfully.`,
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            onClose(false);
            if (refreshData) refreshData();
          });
        } else {
          throw new Error(response?.data?.msg || "API call failed");
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text:
            error.message ||
            `Failed to ${rawmaterial ? "update" : "save"} raw material.`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          title: "Invalid File",
          text: "Please select an image file",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "File Too Large",
          text: "Image size should be less than 5MB",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  useEffect(() => {
    if (formik.values.nameEnglish) {
      if (debounceTimer) clearTimeout(debounceTimer);

      const timer = setTimeout(() => {
        Translateapi(formik.values.nameEnglish)
          .then((res) => {
            formik.setFieldValue("nameGujarati", res.data.gujarati || "");
            formik.setFieldValue("nameHindi", res.data.hindi || "");
          })
          .catch((err) => console.error("Translation error:", err));
      }, 500);

      setDebounceTimer(timer);
    }
  }, [formik.values.nameEnglish]);

  useEffect(() => {
    if (!isOpen) {
      // modal closed → reset everything
      formik.resetForm();
      setTableData([]);
      setEditingSupplier(null);
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (isOpen) {
      FetchRawMaterialCategory();
      FetchUnit();

      if (rawmaterial) {
        formik.setValues({
          nameEnglish: rawmaterial.raw_material_name || "",
          nameGujarati: rawmaterial.nameGujarati || "",
          nameHindi: rawmaterial.nameHindi || "",
          rawCategoryId: rawmaterial.raw_material_cat_id || "",
          unitid: rawmaterial.unitId || "",
          supplierRate: rawmaterial.rate || "",
          priority: rawmaterial.priority || "",
          generalFixAccess: rawmaterial.isGeneralFix || false,
          weight: rawmaterial.weightPer100Pax || "",
        });

        // Set existing image if available
        // Check multiple possible image field names
        const imageUrl =
          rawmaterial.file || rawmaterial.imageUrl || rawmaterial.image;
        if (imageUrl) {
          // If it's a full URL, use it directly
          // If it's a relative path, construct the full URL
          const fullImageUrl = imageUrl.startsWith("http")
            ? imageUrl
            : `${import.meta.env.VITE_API_BASE_URL || ""}${imageUrl}`;

          setImagePreview(fullImageUrl);
          // Don't set imageFile when editing - only set preview
          setImageFile(null);
        }

        if (rawmaterial.suppliers?.length > 0) {
          const supplierTableData = rawmaterial.suppliers.map(
            (supplier, index) => ({
              sr_no: index + 1,
              supplierId: supplier.party.id,
              supplier_name: supplier.party.nameEnglish || `-`,
              backendId: supplier.id || 0,
              deleteId: supplier.id,
              isDefault: supplier.isDefault || false,
            })
          );
          setTableData(supplierTableData);
        }
      } else {
        formik.resetForm();
        setTableData([]);
        setImageFile(null);
        setImagePreview(null);
      }
    }
  }, [isOpen, rawmaterial]);

  const FetchRawMaterialCategory = () => {
    GetRawMaterialcategory(id).then((response) => {
      const data = response?.data?.data["Raw Material Category Details"];
      setRawCategory(
        data.map((item) => ({ label: item.nameEnglish, value: item.id }))
      );
    });
  };

  const FetchUnit = () => {
    GetUnitData(id).then((response) => {
      const data = response?.data?.data["Unit Details"];
      setUnitList(
        data.map((item) => ({
          id: item.id,
          nameEnglish: item.nameEnglish,
          symbolEnglish: item.symbolEnglish,
        }))
      );
    });
  };

  const handleRemoveSupplier = (item) => {
    if (item.backendId === 0) {
      setTableData((prevData) =>
        prevData.filter((dataItem) => dataItem.supplierId !== item.supplierId)
      );
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this supplier?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const response = await DeleteSuplier(item.backendId);

        if (response?.success || response?.data?.success === true) {
          setTableData((prevData) =>
            prevData.filter((dataItem) => dataItem.backendId !== item.backendId)
          );

          Swal.fire({
            title: "Removed!",
            text: "Supplier has been removed successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          throw new Error(response?.message || "API call failed");
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.message || "Failed to delete supplier.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    });
  };

  const handleSetDefaultSupplier = (supplierId) => {
    setTableData((prevData) =>
      prevData.map((item) => ({
        ...item,
        isDefault: item.supplierId === supplierId,
      }))
    );
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setIsSupplierModalOpen(true);
  };

  const handleUpdateSupplier = (updatedSupplierData) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.supplierId === editingSupplier?.supplierId
          ? {
              ...item,
              supplierId: updatedSupplierData.id,
              supplier_name: updatedSupplierData.name,
            }
          : item
      )
    );

    Swal.fire({
      title: "Success!",
      text: "Supplier updated successfully.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleAddSupplier = (supplierData) => {
    const existingSupplier = tableData.find(
      (item) => item.supplierId === supplierData.id
    );

    if (existingSupplier) {
      Swal.fire({
        title: "Supplier Already Added",
        text: "This supplier is already added to the list.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const newId =
      tableData.length > 0
        ? Math.max(...tableData.map((item) => item.id)) + 1
        : 1;

    const newSupplierEntry = {
      sr_no: newId,
      supplierId: supplierData.id,
      supplier_name: supplierData.name,
      backendId: 0,
      isDefault: true,
    };

    setTableData((prevData) => [...prevData, newSupplierEntry]);

    Swal.fire({
      title: "Success!",
      text: "Supplier added successfully.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleSupplierAction = (supplierData) => {
    if (editingSupplier) {
      handleUpdateSupplier(supplierData);
    } else {
      handleAddSupplier(supplierData);
    }
  };

  const filteredTableData = tableData.filter((supplier) =>
    supplier.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openSupplier = () => {
    setIsVendorOpen(false);
    setTimeout(() => setIsSupplierOpen(true), 150);
  };

  const openVendor = () => {
    setIsSupplierOpen(false);
    setTimeout(() => setIsVendorOpen(true), 150);
  };

  return (
    isOpen && (
      <CustomModal
        open={isOpen}
        width={1000}
        onClose={() => onClose(false)}
        title={
          rawmaterial ? (
            <FormattedMessage
              id="USER.RAWMATERIAL.EDIT_TITLE"
              defaultMessage="Edit Raw Material"
            />
          ) : (
            <FormattedMessage
              id="USER.RAWMATERIAL.NEW_TITLE"
              defaultMessage="New Raw Material"
            />
          )
        }
        footer={[
          <div className="flex justify-between " key="footer-buttons">
            <button className="btn btn-light" onClick={() => onClose(false)}>
              <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
            </button>
            <button className="btn btn-primary" onClick={formik.handleSubmit}>
              {rawmaterial ? (
                <FormattedMessage id="COMMON.UPDATE" defaultMessage="Update" />
              ) : (
                <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
              )}
            </button>
          </div>,
        ]}
      >
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-y-4 overflow-auto scrollable-y"
        >
          {/* Image Upload Section */}

          <div className="grid grid-cols-3 gap-x-4">
            {/* English Name */}
            <div className="flex flex-col">
              <label className="form-label">
                <FormattedMessage
                  id="COMMON.NAME_ENGLISH"
                  defaultMessage="Name (English)"
                />
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nameEnglish"
                value={formik.values.nameEnglish}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter English Name"
                className="input"
              />
              {formik.touched.nameEnglish && formik.errors.nameEnglish && (
                <span className="text-red-500 text-sm">
                  {formik.errors.nameEnglish}
                </span>
              )}
            </div>

            {/* Gujarati Name */}
            <div className="flex flex-col">
              <label className="form-label">
                <FormattedMessage
                  id="COMMON.NAME_GUJARATI"
                  defaultMessage="Name (ગુજરાતી)"
                />
              </label>
              <input
                type="text"
                name="nameGujarati"
                value={formik.values.nameGujarati}
                onChange={formik.handleChange}
                placeholder="Enter Gujarati Name"
                className="input"
              />
            </div>

            {/* Hindi Name */}
            <div className="flex flex-col">
              <label className="form-label">
                <FormattedMessage
                  id="COMMON.NAME_HINDI"
                  defaultMessage="Name (हिंदी)"
                />
              </label>
              <input
                type="text"
                name="nameHindi"
                value={formik.values.nameHindi}
                onChange={formik.handleChange}
                placeholder="Enter Hindi Name"
                className="input"
              />
            </div>
          </div>

          {/* Raw Category */}
          <div className="flex flex-col">
            <label className="form-label">
              <FormattedMessage
                id="USER.RAWMATERIAL.CATEGORY"
                defaultMessage="Raw Material Category"
              />
              <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Select
                  options={rawCategory}
                  value={
                    rawCategory.find(
                      (c) => c.value === formik.values.rawCategoryId
                    ) || null
                  }
                  onChange={(selected) =>
                    formik.setFieldValue("rawCategoryId", selected?.value || "")
                  }
                  placeholder={intl.formatMessage({
                    id: "USER.RAWMATERIAL.SELECT_CATEGORY",
                    defaultMessage: "Select Raw Material Category",
                  })}
                  isClearable
                  styles={{
                    control: (base) => ({ ...base, minHeight: "38px" }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>

              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full shadow hover:scale-105 transition"
                onClick={() => {
                  setSelectedRawMaterialCategory(null);
                  setIsRawCategoryModalOpen(true);
                }}
              >
                <i className="ki-filled ki-plus"></i>
              </button>
            </div>

            {formik.touched.rawCategoryId && formik.errors.rawCategoryId && (
              <span className="text-red-500 text-sm">
                {formik.errors.rawCategoryId}
              </span>
            )}
          </div>

          {/* Unit */}
          <div className="flex flex-col">
            <label className="form-label flex items-center gap-2">
              <FormattedMessage id="COMMON.UNIT" defaultMessage="Unit" />
              <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Select
                  options={unitList.map((u) => ({
                    value: u.id,
                    label: `${u.nameEnglish} (${u.symbolEnglish})`,
                  }))}
                  value={
                    unitList
                      .map((u) => ({
                        value: u.id,
                        label: `${u.nameEnglish} (${u.symbolEnglish})`,
                      }))
                      .find((u) => u.value === formik.values.unitid) || null
                  }
                  onChange={(selected) =>
                    formik.setFieldValue("unitid", selected?.value || "")
                  }
                  placeholder={intl.formatMessage({
                    id: "COMMON.SELECT_UNIT",
                    defaultMessage: "Select Unit",
                  })}
                  isClearable
                  styles={{
                    control: (base) => ({ ...base, minHeight: "38px" }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div>
            </div>

            {formik.touched.unitid && formik.errors.unitid && (
              <span className="text-red-500 text-sm">
                {formik.errors.unitid}
              </span>
            )}
          </div>

          {/* Supplier Rate & Priority */}
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label">
                <FormattedMessage
                  id="COMMON.SUPPLIER_RATE"
                  defaultMessage="Rate"
                />
              </label>
              <input
                type="tel"
                name="supplierRate"
                value={formik.values.supplierRate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Supplier Rate"
                className="input"
              />
              {formik.touched.supplierRate && formik.errors.supplierRate && (
                <span className="text-red-500 text-sm">
                  {formik.errors.supplierRate}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="form-label">
                <FormattedMessage
                  id="COMMON.PRIORITY"
                  defaultMessage="Priority"
                />
              </label>
              <input
                type="tel"
                name="priority"
                value={formik.values.priority}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Priority"
                className="input"
              />
              {formik.touched.priority && formik.errors.priority && (
                <span className="text-red-500 text-sm">
                  {formik.errors.priority}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="form-label">
              <FormattedMessage
                id="USER.RAWMATERIAL.IMAGE"
                defaultMessage="Raw Material Image"
              />
            </label>
            <div className="flex items-center gap-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                  >
                    <i className="ki-filled ki-cross text-xs"></i>
                  </button>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="image-upload"
                  className="btn btn-light cursor-pointer"
                >
                  <i className="ki-filled ki-file-up"></i>
                  <FormattedMessage
                    id="COMMON.UPLOAD_IMAGE"
                    defaultMessage="Upload Image"
                  />
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <span className="text-xs text-gray-500">
                  Max size: 5MB | Formats: JPG, PNG, GIF
                </span>
              </div>
            </div>
          </div>
          {/* General Fix */}
          <div className="flex items-center gap-2 mt-2">
            <label className="form-label">
              <FormattedMessage
                id="USER.RAWMATERIAL.GENERAL_FIX"
                defaultMessage="General Fix Raw Material"
              />
            </label>
            <label className="switch switch-lg">
              <input
                type="checkbox"
                name="generalFixAccess"
                checked={formik.values.generalFixAccess}
                onChange={formik.handleChange}
              />
            </label>
          </div>

          {/* Weight */}
          {formik.values.generalFixAccess && (
            <div className="flex flex-col gap-y-4 mt-4">
              <div className="grid grid-cols-2 gap-x-4">
                <div className="flex flex-col">
                  <label className="form-label">
                    <FormattedMessage
                      id="USER.RAWMATERIAL.WEIGHT"
                      defaultMessage="Weight Per 100 Person"
                    />
                  </label>
                  <input
                    type="tel"
                    name="weight"
                    value={formik.values.weight}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Weight"
                    className="input"
                  />
                  {formik.touched.weight && formik.errors.weight && (
                    <span className="text-red-500 text-sm">
                      {formik.errors.weight}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Supplier Table Section */}
          <div>
            <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
              <div
                className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}
              >
                <div className="filItems relative">
                  <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                  <input
                    className="input pl-8"
                    placeholder={intl.formatMessage({
                      id: "USER.SUPPLIER.SEARCH_SUPPLIER",
                      defaultMessage: "Search Supplier...",
                    })}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    openSupplier();
                    setEditingSupplier(null);
                  }}
                  title="Add Supplier"
                >
                  <i className="ki-filled ki-plus"></i>{" "}
                  <FormattedMessage
                    id="USER.SUPPLIER.ADD_SUPPLIER"
                    defaultMessage="Add Supplier"
                  />
                </button>
              </div>
            </div>

            <TableComponent
              columns={columns(
                handleEditSupplier,
                handleRemoveSupplier,
                handleSetDefaultSupplier
              )}
              data={filteredTableData}
              paginationSize={5}
            />
          </div>
        </form>

        {/* Supplier Modal */}
        <AddSupplier
          isOpen={isSupplierOpen}
          onClose={() => {
            setIsSupplierOpen(false);
            setEditingSupplier(null);
          }}
          onAddSupplier={handleSupplierAction}
          supplierData={editingSupplier}
          onOpenVendor={() => openVendor()}
        />

        <AddVendor
          isOpen={isVendorOpen}
          onClose={() => {
            setIsVendorOpen(false);
            openSupplier();
          }}
        />

        <AddRawMaterialCategory
          isOpen={isRawCategoryModalOpen}
          onClose={() => setIsRawCategoryModalOpen(false)}
          refreshData={FetchRawMaterialCategory}
          rawMaterialCategory={selectedRawMaterialCategory}
        />
      </CustomModal>
    )
  );
};

export default AddRawMaterial;
