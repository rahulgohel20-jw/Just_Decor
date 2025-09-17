import { CustomModal } from "@/components/custom-modal/CustomModal";
import { useEffect, useState } from "react";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import useStyle from "./style";
import AddSupplier from "../add-supplier/AddSupplier";
import {
  GetRawMaterialcategory,
  GetUnitData,
  DeleteSuplier,
  Addrawmaterial,
  EditRawMaterial,
} from "@/services/apiServices";
import Swal from "sweetalert2";

const AddRawMaterial = ({ isOpen, onClose, refreshData, rawmaterial }) => {
  const [formData, setFormData] = useState({
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    rawCategoryId: "",
    unitid: "",
    supplierRate: "",
    priority: "",
    generalFixAccess: false,
    weight: "",
  });

  const classes = useStyle();
  const [searchQuery, setSearchQuery] = useState("");
  const [tableData, setTableData] = useState(defaultData);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [rawCategory, setRawCategory] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nameEnglish: "",
        nameGujarati: "",
        nameHindi: "",
        rawCategoryId: "",
        unitid: "",
        supplierRate: "",
        priority: "",
        generalFixAccess: false,
        weight: "",
      });
      setTableData([]);
      setEditingSupplier(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      FetchRawMaterialCategory();
      FetchUnit();

      if (rawmaterial) {
        setFormData({
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

        if (rawmaterial.suppliers && rawmaterial.suppliers.length > 0) {
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
      }
    }
  }, [isOpen, rawmaterial]);

  let userdata = JSON.parse(localStorage.getItem("userData"));
  let id = userdata.id;

  const FetchRawMaterialCategory = () => {
    GetRawMaterialcategory(id).then((response) => {
      const data = response?.data?.data["Raw Material Category Details"];
      const RawCategory = data.map((item) => ({
        label: item.nameEnglish,
        value: item.id,
      }));
      setRawCategory(RawCategory);
    });
  };

  const FetchUnit = () => {
    GetUnitData(id).then((response) => {
      const data = response?.data?.data["Unit Details"];
      const unitlist = data.map((item) => ({
        label: item.nameEnglish,
        value: item.id,
      }));
      setUnitList(unitlist);
    });
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setIsSupplierModalOpen(true);
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

    const newSupplierEntry = {
      id: Date.now(),
      supplierId: supplierData.id,
      supplier_name: supplierData.name,
      backendId: 0,
      isDefault: false,
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

  const handleSetDefaultSupplier = (supplierId) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.supplierId === supplierId
          ? { ...item, isDefault: !item.isDefault }
          : item
      )
    );

    Swal.fire({
      title: "Success!",
      text: "Supplier status updated successfully.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleRemoveSupplier = (deleteId) => {
    console.log("Delete ID:", deleteId);

    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this supplier?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Call DeleteSuplier API
          const response = await DeleteSuplier(deleteId);

          if (response && (response.success || response.status === 200)) {
            // Remove from table if API successful
            setTableData((prevData) =>
              prevData.filter((item) => item.deleteId !== deleteId)
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
          console.error("Delete Supplier API Error:", error);
          Swal.fire({
            title: "Error!",
            text: error.message || "Failed to delete supplier.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const handleSupplierAction = (supplierData) => {
    if (editingSupplier) {
      handleUpdateSupplier(supplierData);
    } else {
      handleAddSupplier(supplierData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      generalFixAccess: !prev.generalFixAccess,
    }));
  };

  const handleSave = async () => {
    if (!formData.nameEnglish.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter English name.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!formData.rawCategoryId) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select Raw Material Category.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!formData.unitid) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select Unit.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (tableData.length === 0) {
      Swal.fire({
        title: "Validation Error",
        text: "Please add at least one supplier.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Prepare rawMaterialSupplierRequestDtos
    const rawMaterialSupplierRequestDtos = tableData.map((supplier) => ({
      id: supplier.backendId || 0, // 0 for new records, actual ID for existing records
      idDefault: supplier.isDefault || false,
      partyId: parseInt(supplier.supplierId),
    }));

    // Prepare data for API call
    const requestData = {
      isGeneralFix: formData.generalFixAccess,
      nameEnglish: formData.nameEnglish.trim(),
      nameGujarati: formData.nameGujarati.trim() || "",
      nameHindi: formData.nameHindi.trim() || "",
      rawMaterialCatId: parseInt(formData.rawCategoryId),
      rawMaterialSupplierRequestDtos: rawMaterialSupplierRequestDtos,
      sequence: parseInt(formData.priority) || 0,
      supplierRate: parseFloat(formData.supplierRate) || 0,
      unitId: parseInt(formData.unitid),
      userId: parseInt(id),
      weightPer100Pax: parseFloat(formData.weight) || 0,
    };

    console.log("Request data:", requestData);

    try {
      let response;
      console.log(rawmaterial);

      // Check if it's edit mode (rawmaterial prop exists and has an ID)
      if (rawmaterial) {
        // Edit API call
        response = await EditRawMaterial(
          rawmaterial.raw_material_id,
          requestData
        );
      } else {
        // Add API call
        response = await Addrawmaterial(requestData);
      }

      if (response && (response.success || response.status === 200)) {
        Swal.fire({
          title: "Success!",
          text: `Raw material ${rawmaterial ? "updated" : "saved"} successfully.`,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          onClose(false);
          if (refreshData) {
            refreshData();
          }
        });
      } else {
        throw new Error(response?.message || "API call failed");
      }
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire({
        title: "Error!",
        text:
          error.message ||
          `Failed to ${rawmaterial ? "update" : "save"} raw material.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const filteredTableData = tableData.filter((supplier) =>
    supplier.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    isOpen && (
      <CustomModal
        open={isOpen}
        onClose={() => onClose(false)}
        title={rawmaterial ? "Edit Raw Material" : "New Raw Material"}
        footer={[
          <div className="flex justify-between " key="footer-buttons">
            <button className="btn btn-light" onClick={() => onClose(false)}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleSave}>
              {rawmaterial ? "Update" : "Save"}
            </button>
          </div>,
        ]}
      >
        <div className="flex flex-col gap-y-4 max-h-[450px] overflow-auto scrollable-y">
          <div className="grid grid-cols-3 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label">Name (English)</label>
              <input
                type="text"
                name="nameEnglish"
                value={formData.nameEnglish}
                onChange={handleChange}
                placeholder="Enter English Name"
                className="input"
              />
            </div>
            <div className="flex flex-col">
              <label className="form-label">Name (ગુજરાતી)</label>
              <input
                type="text"
                name="nameGujarati"
                value={formData.nameGujarati}
                onChange={handleChange}
                placeholder="Enter Gujarati Name"
                className="input"
              />
            </div>
            <div className="flex flex-col">
              <label className="form-label">Name (हिंदी)</label>
              <input
                type="text"
                name="nameHindi"
                value={formData.nameHindi}
                onChange={handleChange}
                placeholder="Enter Hindi Name"
                className="input"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="form-label">Raw Material Category</label>
            <select
              className="select"
              name="rawCategoryId"
              value={formData.rawCategoryId}
              onChange={handleChange}
            >
              <option value="">Select Raw Material Category</option>
              {rawCategory.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="form-label">Unit</label>
            <select
              className="select"
              name="unitid"
              value={formData.unitid}
              onChange={handleChange}
            >
              <option value="">Select Unit</option>
              {unitList.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label">Supplier Rate</label>
              <input
                type="tel"
                name="supplierRate"
                value={formData.supplierRate}
                onChange={handleChange}
                placeholder="Enter Supplier Rate"
                className="input"
              />
            </div>
            <div className="flex flex-col">
              <label className="form-label">Priority</label>
              <input
                type="tel"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                placeholder="Enter Priority"
                className="input"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <label className="form-label">General Fix Raw Material</label>
            <label className="switch switch-lg">
              <input
                type="checkbox"
                checked={formData.generalFixAccess}
                onChange={handleCheckboxChange}
              />
            </label>
          </div>

          {formData.generalFixAccess && (
            <div className="flex flex-col gap-y-4 mt-4">
              <div className="grid grid-cols-2 gap-x-4">
                <div className="flex flex-col">
                  <label className="form-label">Weight Per 100 Person</label>
                  <input
                    type="tel"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Enter Weight"
                    className="input"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
              <div
                className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}
              >
                <div className="filItems relative">
                  <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                  <input
                    className="input pl-8"
                    placeholder="Search Supplier"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setIsSupplierModalOpen(true);
                    setEditingSupplier(null);
                  }}
                  title="Add Supplier"
                >
                  <i className="ki-filled ki-plus"></i> Add Supplier
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

          <div>
            <AddSupplier
              isOpen={isSupplierModalOpen}
              onClose={() => {
                setIsSupplierModalOpen(false);
                setEditingSupplier(null);
              }}
              onAddSupplier={handleSupplierAction}
              supplierData={editingSupplier}
            />
          </div>
        </div>
      </CustomModal>
    )
  );
};

export default AddRawMaterial;
