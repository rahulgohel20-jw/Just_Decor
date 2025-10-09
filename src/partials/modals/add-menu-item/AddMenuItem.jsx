import { useState, useEffect } from "react";
import { message } from "antd";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import ItemRawmaterial from "../item-raw-material/ItemRawMaterial";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import {
  AddMenuItems,
  GetMenuCategoryByUserIdmenuitem,
  GetAllSubCategorymenuitem,
  GetAllKitchenAreaById,
  UpdateMenuItem,
  Translateapi,
  uploadFile,
  RawMaterialName,
  GetUnitData,
  ContactNameItem,
} from "@/services/apiServices";
import Swal from "sweetalert2";
const AddMenuItem = ({
  isModalOpen,
  setIsModalOpen,
  refreshData,
  selectedMenuItem,
}) => {
  const initialFormState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    menuSlogan: "",
    price: "",
    sequence: 1,
    file: "",
    priority: "",
    menuItemCategory: "",
    menuSubItemCategory: "",
    kitchenArea: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [kitchenAreas, setKitchenAreas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tab_1");
  const [tableData, setTableData] = useState(defaultData);
  const [editingRow, setEditingRow] = useState(null);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [contactCategories, setContactCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [contactNames, setContactNames] = useState([]);
  const [chefContactNames, setChefContactNames] = useState([]);
  const [allocationConfig, setAllocationConfig] = useState({
    locationType: "venue",
    quantityPer100Person: "",
    unitId: "",
    pricePerUnit: "",
    contactCategoryId: "",
    contactNameId: "",
    allocationType: "Counter Wise",
    counterNo: "",
    pricePerLabour: "",
    helperCount: "",
    pricePerHelper: "",
  });
  const [completedTabs, setCompletedTabs] = useState(["tab_1"]);

  useEffect(() => {
    if (!isModalOpen) setFormData(initialFormState);
  }, [isModalOpen]);

  useEffect(() => {
    if (formData.nameEnglish) {
      if (debounceTimer) clearTimeout(debounceTimer);
      const timer = setTimeout(() => {
        Translateapi(formData.nameEnglish)
          .then((res) => {
            setFormData((prev) => ({
              ...prev,
              nameGujarati: res.data.gujarati || "",
              nameHindi: res.data.hindi || "",
            }));
          })
          .catch((err) => console.error("Translation error:", err));
      }, 500);
      setDebounceTimer(timer);
    }
  }, [formData.nameEnglish]);

  useEffect(() => {
    if (isModalOpen) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) {
        console.error("User ID not found");
        return;
      }

      Promise.all([
        GetMenuCategoryByUserIdmenuitem(userData.id),
        GetAllSubCategorymenuitem(userData.id),
        GetAllKitchenAreaById(userData.id),
      ])
        .then(([catRes, subRes, kitchenRes, RawMaterialName]) => {
          setCategories(catRes?.data?.data?.["Menu Category Details"] || []);
          setSubCategories(
            subRes?.data?.data?.["Menu Sub Category Details"] || []
          );
          setKitchenAreas(
            kitchenRes?.data?.data?.["KitchenAreas Details"] || []
          );
        })
        .catch((err) => console.error("Error loading dropdown data:", err));
    }
  }, [isModalOpen]);

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    RawMaterialName(userData.id, (name = "Outside Supplier (Food)"))
      .then((res) => {
        console.log(res);

        const categories = res?.data?.data?.["Contact Category Details"].map(
          (cat) => ({ id: cat.id, name: cat.nameEnglish || "-" })
        );

        setContactCategories(categories);
      })
      .catch((err) =>
        console.error("Error loading RawMaterialName data:", err)
      );
    GetUnitData(userData.id)
      .then((res) => {
        const units = res.data.data["Unit Details"].map((unit) => ({
          id: unit.id,
          name: unit.nameEnglish || "-",
        }));
        setUnits(units);
      })
      .catch((err) => {
        console.error("Error fetching unit data:", err);
      });
    ContactNameItem(userData.id, (name = "CHEF LABOUR"))
      .then((res) => {
        const names =
          res?.data?.data?.["Party Details"]?.map((item) => ({
            id: item.id,
            name: item.nameEnglish || "-",
          })) || [];
        setChefContactNames(names);
      })
      .catch((err) => {
        console.error("Error fetching contact names:", err);
        setChefContactNames([]);
      });
  }, []);

  useEffect(() => {
    if (selectedMenuItem && isModalOpen) {
      const matchedCategory = categories.find(
        (cat) => cat.nameEnglish === selectedMenuItem.category
      );
      const matchedSubCategory = subCategories.find(
        (sub) => sub.nameEnglish === selectedMenuItem.subCategory
      );
      const matchedKitchenArea = kitchenAreas.find(
        (area) => area.nameEnglish === selectedMenuItem.kitchenArea
      );

      setFormData({
        ...initialFormState,
        nameEnglish: selectedMenuItem.name || "",
        nameGujarati: selectedMenuItem.nameGujarati || "",
        nameHindi: selectedMenuItem.nameHindi || "",
        menuSlogan: selectedMenuItem.slogan || "",
        price: selectedMenuItem.price || "",
        priority: selectedMenuItem.priority || "",
        menuItemCategory: matchedCategory?.id || "",
        menuSubItemCategory: matchedSubCategory?.id || "",
        kitchenArea: matchedKitchenArea?.id || "",
      });
    }
  }, [selectedMenuItem, categories, subCategories, kitchenAreas, isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = (uploadRequest) => {
    if (!formData.file) {
      refreshData();
      setIsModalOpen(false);
      return;
    }

    const request = new FormData();
    request.append("moduleId", uploadRequest.ModuleId);
    request.append("moduleName", uploadRequest.ModuleName);
    request.append("fileType", uploadRequest.FileType);
    request.append("file", formData.file);

    uploadFile(request)
      .then(() => {
        message.success("Image uploaded successfully!");
        refreshData();
        setIsModalOpen(false);
      })
      .catch((error) => console.error("Error uploading image:", error));
  };

  const handleSubmit = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.id) {
      message.error("User not found");
      return;
    }

    const safeNumber = (value) => {
      if (!value || value === "undefined") return null;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    const totalRate = tableData.reduce(
      (sum, row) => sum + (parseFloat(row.rate) || 0),
      0
    );
    const dishCosting = totalRate / 10;

    const menuItemRawMaterials = tableData.map((row) => ({
      id: 0,
      rate: safeNumber(row.rate),
      rawMaterialId: row.rawMaterialId,
      unitId: row.unitId,
      weight: safeNumber(row.weight),
    }));

    const menuItemAllocationConfigRequest = [
      {
        allocation_type: allocationConfig.allocationType || "",
        basePrice: safeNumber(formData.price),
        contactCategoryId: safeNumber(allocationConfig.contactCategoryId),
        counterNo: allocationConfig.counterNo,
        godownLocation: allocationConfig.locationType,
        id: 0,
        notes: "",
        partyId: safeNumber(allocationConfig.contactNameId),
        pricePerHelper: allocationConfig.pricePerHelper,
        pricePerLabour: allocationConfig.pricePerLabour,
        quantityPer100Person: safeNumber(allocationConfig.quantityPer100Person),
        selectChefLabourAgency: selectedAgency === "chef" ? true : false,
        selectOutsideAgency: selectedAgency === "outside" ? true : false,
        unitId: safeNumber(allocationConfig.unitId),
      },
    ];

    const payload = {
      nameEnglish: formData.nameEnglish,
      nameGujarati: formData.nameGujarati,
      nameHindi: formData.nameHindi,
      slogan: formData.menuSlogan,
      price: safeNumber(formData.price),
      sequence: safeNumber(formData.priority),
      userId: userData.id,
      menuCategoryId: safeNumber(formData.menuItemCategory),
      menuSubCategoryId: safeNumber(formData.menuSubItemCategory),
      kitchenAreaId: safeNumber(formData.kitchenArea),
      menuItemRawMaterials,
      dishCosting: dishCosting,
      totalRate: totalRate,
      menuItemAllocationConfigRequest,
    };

    const uploadRequest = {
      ModuleName: "MenuItem",
      FileType: "Image",
    };

    if (selectedMenuItem) {
      UpdateMenuItem(selectedMenuItem.id, payload)
        .then(() => {
          message.success("Menu item updated successfully!");
          if (formData.file) {
            uploadImage({ ...uploadRequest, ModuleId: selectedMenuItem.id });
          } else {
            refreshData();
            setIsModalOpen(false);
          }
        })
        .catch((err) => console.error("Error updating menu item:", err));
    } else {
      AddMenuItems(payload)
        .then((res) => {
          message.success("Menu item added successfully!");
          const newId = res?.data?.moduleId;
          if (formData.file && newId) {
            uploadImage({ ...uploadRequest, ModuleId: newId });
          } else {
            refreshData();
            setIsModalOpen(false);
          }
        })
        .catch((err) => console.error("Error saving menu item:", err));
    }
  };
  const handleEdit = (rowData) => {
    setEditingRow(rowData);

    setIsItemModalOpen(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setTableData((prev) => prev.filter((row) => row.id !== id));
        Swal.fire("Deleted!", "Raw Material has been deleted.", "success");
      }
    });
  };
  const handleContactCategoryChange = (categoryName) => {
    setFormData((prev) => ({
      ...prev,
      contactCategory: categoryName,
      contactName: "",
    }));

    if (!categoryName) {
      setContactNames([]);
      return;
    }

    ContactNameItem(userData.id, categoryName)
      .then((res) => {
        const names =
          res?.data?.data?.["Party Details"]?.map((item) => ({
            id: item.id,
            name: item.nameEnglish || "-",
          })) || [];
        setContactNames(names);
      })
      .catch((err) => {
        console.error("Error fetching contact names:", err);
        setContactNames([]);
      });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "tab_1":
        return (
          <div className="flex flex-col gap-y-3">
            <InputField
              label="Name (English)"
              name="nameEnglish"
              value={formData.nameEnglish}
              onChange={handleChange}
            />
            <InputField
              label="Name (Gujarati)"
              name="nameGujarati"
              value={formData.nameGujarati}
              onChange={handleChange}
            />
            <InputField
              label="Name (Hindi)"
              name="nameHindi"
              value={formData.nameHindi}
              onChange={handleChange}
            />
            <TextareaField
              label="Slogan"
              name="menuSlogan"
              value={formData.menuSlogan}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-x-4">
              <InputField
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
              />
              <InputField
                label="Priority"
                name="priority"
                type="number"
                value={formData.priority}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-3 gap-x-4">
              <DropdownField
                label="Menu Item Category"
                name="menuItemCategory"
                value={formData.menuItemCategory}
                onChange={handleChange}
                options={categories.filter((c) => c.isActive)}
                optionLabel="nameEnglish"
              />
              <DropdownField
                label="Menu Item Sub Category"
                name="menuSubItemCategory"
                value={formData.menuSubItemCategory}
                onChange={handleChange}
                options={subCategories.filter((s) => s.isActive)}
                optionLabel="nameEnglish"
              />
              <DropdownField
                label="Kitchen Area"
                name="kitchenArea"
                value={formData.kitchenArea}
                onChange={handleChange}
                options={kitchenAreas.filter((a) => a.isActive)}
                optionLabel="nameEnglish"
              />
            </div>
            <div>
              <label className="form-label">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, file: e.target.files[0] })
                }
                className="input"
              />
            </div>
          </div>
        );

      case "tab_2":
        // Calculate totals
        const totalRate = tableData.reduce(
          (sum, row) => sum + (parseFloat(row.rate) || 0),
          0
        );
        const dishCosting = totalRate / 10;

        return (
          <div>
            <div className="flex justify-between mb-3">
              <input
                className="input w-fit"
                placeholder="Search item"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => setIsItemModalOpen(true)}
                >
                  <i className="ki-filled ki-copy me-1"></i>Copy Recipe
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsItemModalOpen(true)}
                >
                  <i className="ki-filled ki-plus"></i> Add Recipe
                </button>
              </div>
            </div>

            <TableComponent
              columns={columns(handleEdit, handleDelete)}
              data={tableData}
              pagination={{ pageSize: 5 }}
              rowKey={(r) => r.id}
            />

            <div className="mt-4 flex justify-between mb-3">
              <div className="flex gap-6">
                <span className="font-bold text-base">
                  Total Rate:{" "}
                  <span className="text-primary">{totalRate.toFixed(2)}</span>
                </span>
                <span className="font-bold text-base">
                  Dish Costing:{" "}
                  <span className="text-primary">{dishCosting.toFixed(2)}</span>
                </span>
              </div>
            </div>
          </div>
        );

      case "tab_3":
        return (
          <div className="flex flex-col gap-y-3">
            <select
              className="select"
              value={allocationConfig.locationType}
              onChange={(e) =>
                setAllocationConfig({
                  ...allocationConfig,
                  locationType: e.target.value,
                })
              }
            >
              <option value="venue">At Venue</option>
              <option value="godown">Godown</option>
            </select>

            <label className="flex items-center gap-x-2">
              <input
                type="checkbox"
                className="toggle"
                checked={selectedAgency === "outside"}
                onChange={() =>
                  setSelectedAgency(
                    selectedAgency === "outside" ? null : "outside"
                  )
                }
              />
              Select Outside Agency
            </label>

            <label className="flex items-center gap-x-2">
              <input
                type="checkbox"
                className="toggle"
                checked={selectedAgency === "chef"}
                onChange={() =>
                  setSelectedAgency(selectedAgency === "chef" ? null : "chef")
                }
              />
              Select Chef Labour Agency
            </label>

            {selectedAgency === "outside" && (
              <div className="flex flex-col gap-y-2 border p-3 rounded-lg">
                <input
                  type="text"
                  placeholder="Quantity Per 100 Person"
                  className="input"
                  value={allocationConfig.quantityPer100Person}
                  onChange={(e) =>
                    setAllocationConfig({
                      ...allocationConfig,
                      quantityPer100Person: e.target.value,
                    })
                  }
                />
                <select
                  className="select"
                  value={allocationConfig.unitId}
                  onChange={(e) =>
                    setAllocationConfig({
                      ...allocationConfig,
                      unitId: e.target.value,
                    })
                  }
                >
                  <option value="">Select Unit</option>
                  {units.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Price (Price Per 1 Unit)"
                  className="input"
                  value={allocationConfig.pricePerUnit}
                  onChange={(e) =>
                    setAllocationConfig({
                      ...allocationConfig,
                      pricePerUnit: e.target.value,
                    })
                  }
                />
                <select
                  className="select"
                  value={allocationConfig.contactCategoryId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setAllocationConfig({
                      ...allocationConfig,
                      contactCategoryId: selectedId,
                      contactNameId: "",
                    });

                    // Get the name to pass for API call (for contact names)
                    const selectedCategory = contactCategories.find(
                      (cat) => cat.id === parseInt(selectedId)
                    );
                    if (selectedCategory)
                      handleContactCategoryChange(selectedCategory.name);
                  }}
                >
                  <option value="">Select Contact Category</option>
                  {contactCategories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <select
                  className="select"
                  value={allocationConfig.contactNameId}
                  onChange={(e) =>
                    setAllocationConfig({
                      ...allocationConfig,
                      contactNameId: e.target.value,
                    })
                  }
                >
                  <option value="">Select Contact Name</option>
                  {contactNames.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedAgency === "chef" && (
              <div className="flex flex-col gap-y-2 border p-3 rounded-lg">
                <select
                  className="select"
                  value={allocationConfig.allocationType}
                  onChange={(e) =>
                    setAllocationConfig({
                      ...allocationConfig,
                      allocationType: e.target.value,
                    })
                  }
                >
                  <option value="Counter Wise">Counter Wise</option>
                  <option value="Day Wise">Plate Wise</option>
                </select>
                <input
                  type="text"
                  placeholder="Counter No"
                  className="input"
                  value={allocationConfig.counterNo}
                  onChange={(e) =>
                    setAllocationConfig({
                      ...allocationConfig,
                      counterNo: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Price (Price Per 1 Labour)"
                  className="input"
                  value={allocationConfig.pricePerLabour}
                  onChange={(e) =>
                    setAllocationConfig({
                      ...allocationConfig,
                      pricePerLabour: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Helper"
                  className="input"
                  value={allocationConfig.helperCount}
                  onChange={(e) =>
                    setAllocationConfig({
                      ...allocationConfig,
                      helperCount: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  placeholder="Price (Price Per 1 Helper)"
                  className="input"
                  value={allocationConfig.pricePerHelper}
                  onChange={(e) =>
                    setAllocationConfig({
                      ...allocationConfig,
                      pricePerHelper: e.target.value,
                    })
                  }
                />
                <select
                  className="select"
                  value={allocationConfig.contactNameId}
                  onChange={(e) =>
                    setAllocationConfig({
                      ...allocationConfig,
                      contactNameId: e.target.value,
                    })
                  }
                >
                  <option value="">Select Contact Name</option>
                  {chefContactNames.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMenuItem ? "Edit Menu Item" : "New Menu Item"}
        width={1000}
        footer={
          <div className="flex justify-end gap-3">
            <button
              className="btn btn-light"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>

            {activeTab === "tab_1" && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!formData.nameEnglish.trim()) {
                    Swal.fire(
                      "Error",
                      "Please enter Name (English) before proceeding.",
                      "warning"
                    );
                    return;
                  }
                  setCompletedTabs((prev) => [...new Set([...prev, "tab_2"])]);
                  setActiveTab("tab_2");
                }}
              >
                Next
              </button>
            )}

            {activeTab === "tab_2" && (
              <>
                <button
                  className="btn btn-light"
                  onClick={() => setActiveTab("tab_1")}
                >
                  Prev
                </button>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (tableData.length === 0) {
                      Swal.fire(
                        "Error",
                        "Please add at least one raw material before proceeding.",
                        "warning"
                      );
                      return;
                    }
                    setCompletedTabs((prev) => [
                      ...new Set([...prev, "tab_3"]),
                    ]);
                    setActiveTab("tab_3");
                  }}
                >
                  Next
                </button>
              </>
            )}

            {activeTab === "tab_3" && (
              <>
                <button
                  className="btn btn-light"
                  onClick={() => setActiveTab("tab_2")}
                >
                  Prev
                </button>

                <button className="btn btn-primary" onClick={handleSubmit}>
                  {selectedMenuItem ? "Update" : "Save"}
                </button>
              </>
            )}
          </div>
        }
      >
        <div className="btn-tabs btn-tabs-lg flex justify-between mb-3">
          <TabButton
            active={activeTab === "tab_1"}
            onClick={() => {
              if (completedTabs.includes("tab_1")) setActiveTab("tab_1");
            }}
            label="Menu Item Details"
          />
          <TabButton
            active={activeTab === "tab_2"}
            onClick={() => {
              if (completedTabs.includes("tab_2")) setActiveTab("tab_2");
            }}
            label="Raw Material List"
          />
          <TabButton
            active={activeTab === "tab_3"}
            onClick={() => {
              if (completedTabs.includes("tab_3")) setActiveTab("tab_3");
            }}
            label="Allocation Configuration"
          />
        </div>

        {renderTabContent()}
      </CustomModal>

      <ItemRawmaterial
        isModalOpen={isItemModalOpen}
        setIsModalOpen={setIsItemModalOpen}
        selectedEvent={editingRow}
        refreshData={(updatedRow) => {
          if (editingRow) {
            setTableData((prev) =>
              prev.map((row) => (row.id === editingRow.id ? updatedRow : row))
            );
          } else {
            setTableData((prev) => [...prev, updatedRow]);
          }
          setEditingRow(null);
        }}
      />
    </>
  );
};

const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div className="flex flex-col">
    <label className="form-label">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="input"
    />
  </div>
);

const TextareaField = ({ label, name, value, onChange }) => (
  <div className="flex flex-col">
    <label className="form-label">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      className="input p-3"
    />
  </div>
);

const DropdownField = ({
  label,
  name,
  value,
  onChange,
  options,
  optionLabel,
}) => (
  <div className="flex flex-col">
    <label className="form-label">{label}</label>
    <select name={name} value={value} onChange={onChange} className="input">
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt[optionLabel]}
        </option>
      ))}
    </select>
  </div>
);

const TabButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`btn btn-clear w-full flex justify-center ${active ? "active" : ""}`}
  >
    <i className="ki-filled ki-bookmark"></i> {label}
  </button>
);

export default AddMenuItem;
