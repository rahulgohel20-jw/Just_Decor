import { useState, useEffect } from "react";
import { message } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import ItemRawmaterial from "../item-raw-material/ItemRawMaterial";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import AddMenuCategory from "@/partials/modals/add-menu-category/AddMenuCategory";
import AddMenuSubCategory from "@/partials/modals/add-menu-sub-category/AddMenuSubCategory";
import AddKitchenAreaModal from "@/partials/modals/add-kitchen-area/AddKitchenArea";
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
  deleteRawmatrialcatidInmenuitem,
} from "@/services/apiServices";
import Swal from "sweetalert2";

// Yup validation schema - only for required fields
const validationSchema = Yup.object().shape({
  nameEnglish: Yup.string()
    .required("Name (English) is required")
    .min(2, "Name must be at least 2 characters")
    .trim(),
  priority: Yup.number()
    .required("Priority is required")
    .typeError("Priority must be a number")
    .positive("Priority must be a positive number"),
  menuItemCategory: Yup.string().required("Menu Item Category is required"),
  menuSubItemCategory: Yup.string().required(
    "Menu Item Sub Category is required"
  ),
  kitchenArea: Yup.string().required("Kitchen Area is required"),
  price: Yup.number()
    .required("Price is required")
    .typeError("Price must be a number")
    .positive("Price must be a positive number"),
});

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

  const formik = useFormik({
    initialValues: initialFormState,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      handleSubmit();
    },
  });

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
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isKitchenAreaModalOpen, setIsKitchenAreaModalOpen] = useState(false);
  const [allocationConfig, setAllocationConfig] = useState({
    locationType: "",
    quantityPer100Person: "",
    unitId: "",
    pricePerUnit: "",
    contactCategoryId: "",
    contactNameId: "",
    allocationType: "",
    counterNo: "",
    pricePerLabour: "",
    helperCount: "",
    pricePerHelper: "",
  });
  const [completedTabs, setCompletedTabs] = useState(["tab_1"]);
  const UserId = JSON.parse(localStorage.getItem("userId"));

  useEffect(() => {
    if (!isModalOpen) {
      formik.resetForm();
      setAllocationConfig({
        locationType: "",
        quantityPer100Person: "",
        unitId: "",
        pricePerUnit: "",
        contactCategoryId: "",
        contactNameId: "",
        allocationType: "",
        counterNo: "",
        pricePerLabour: "",
        helperCount: "",
        pricePerHelper: "",
      });
      setTableData(defaultData);
      setCompletedTabs(["tab_1"]);
    }
  }, [isModalOpen]);

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
    if (isModalOpen) {
      if (!UserId) {
        console.error("User ID not found");
        return;
      }

      Promise.all([
        GetMenuCategoryByUserIdmenuitem(UserId),
        GetAllSubCategorymenuitem(UserId),
        GetAllKitchenAreaById(UserId),
      ])
        .then(([catRes, subRes, kitchenRes]) => {
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

  useEffect(() => {
    RawMaterialName(UserId, (name = "Outside Supplier (Food)"))
      .then((res) => {
        const categories = res?.data?.data?.["Contact Category Details"].map(
          (cat) => ({ id: cat.id, name: cat.nameEnglish || "-" })
        );
        setContactCategories(categories);
      })
      .catch((err) =>
        console.error("Error loading RawMaterialName data:", err)
      );
    GetUnitData(UserId)
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
    ContactNameItem(UserId, (name = "CHEF LABOUR"))
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

      formik.setValues({
        nameEnglish: selectedMenuItem.name || "",
        nameGujarati: selectedMenuItem.nameGujarati || "",
        nameHindi: selectedMenuItem.nameHindi || "",
        menuSlogan: selectedMenuItem.slogan || "",
        price: selectedMenuItem.price || "",
        priority: selectedMenuItem.priority || "",
        menuItemCategory: matchedCategory?.id || "",
        menuSubItemCategory: matchedSubCategory?.id || "",
        kitchenArea: matchedKitchenArea?.id || "",
        sequence: 1,
        file: "",
      });

      if (selectedMenuItem.rawdata && selectedMenuItem.rawdata.length > 0) {
        const formattedTableData = selectedMenuItem.rawdata.map((item) => ({
          id: item.id,
          weight: item.weight || 0,
          unit: item.unit?.symbolEnglish || "",
          name: item.rawMaterial?.nameEnglish || "",
          rawMaterialId: item.rawMaterial?.id || "",
          rate: item.rate || 0,
          quantity: item.weight || 0,
          supplierId: item.rawMaterial?.id || "",
        }));
        setTableData(formattedTableData);
      }

      if (
        selectedMenuItem.menuAllocation &&
        selectedMenuItem.menuAllocation.length > 0
      ) {
        const allocation = selectedMenuItem.menuAllocation[0];

        setAllocationConfig({
          locationType:
            allocation.godownLocation === "godown" ? "godown" : "venue",
          quantityPer100Person: allocation.quantityPer100Person || "",
          unitId: allocation.unit?.id || "",
          pricePerUnit: allocation.basePrice || "",
          contactCategoryId: allocation.contact?.id || "",
          contactNameId: allocation.party?.id || "",
          allocationType: allocation.allocation_type || "Counter Wise",
          counterNo: allocation.counterNo || "",
          pricePerLabour: allocation.pricePerLabour || "",
          helperCount: "",
          pricePerHelper: allocation.pricePerHelper || "",
        });

        if (allocation.selectOutsideAgency) {
          setSelectedAgency("outside");
        } else if (allocation.selectChefLabourAgency) {
          setSelectedAgency("chef");
        } else {
          setSelectedAgency(null);
        }
      }
    }
  }, [selectedMenuItem, categories, subCategories, kitchenAreas, isModalOpen]);

  const handleChange = (e) => {
    formik.handleChange(e);
  };

  const uploadImage = (uploadRequest) => {
    if (!formik.values.file) {
      refreshData();
      setIsModalOpen(false);
      return;
    }

    const request = new FormData();
    request.append("moduleId", uploadRequest.ModuleId);
    request.append("moduleName", uploadRequest.ModuleName);
    request.append("fileType", uploadRequest.FileType);
    request.append("file", formik.values.file);

    uploadFile(request)
      .then(() => {
        message.success("Image uploaded successfully!");
        refreshData();
        setIsModalOpen(false);
      })
      .catch((error) => console.error("Error uploading image:", error));
  };

  const handleSubmit = () => {
    if (!UserId) {
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

    const existingRawMaterialIds =
      selectedMenuItem?.rawdata?.map((item) => item.id) || [];

    const menuItemRawMaterials = tableData.map((row, index) => ({
      id: existingRawMaterialIds[index] || 0,
      rate: safeNumber(row.rate),
      rawMaterialId: row.rawMaterialId,
      unitId: row.unitId,
      weight: safeNumber(row.weight),
    }));

    const isAllocationEmpty =
      !selectedAgency &&
      !allocationConfig.locationType &&
      !allocationConfig.quantityPer100Person &&
      !allocationConfig.unitId &&
      !allocationConfig.pricePerUnit &&
      !allocationConfig.contactCategoryId &&
      !allocationConfig.contactNameId &&
      !allocationConfig.allocationType &&
      !allocationConfig.counterNo &&
      !allocationConfig.pricePerLabour &&
      !allocationConfig.helperCount &&
      !allocationConfig.pricePerHelper;
    const existingAllocationId = selectedMenuItem?.menuAllocation?.[0]?.id || 0;
    const menuItemAllocationConfigRequest = isAllocationEmpty
      ? [] // <<<<<< send empty array
      : [
          {
            allocation_type: allocationConfig.allocationType || "",
            basePrice: safeNumber(formik.values.price),
            contactCategoryId: safeNumber(allocationConfig.contactCategoryId),
            counterNo: allocationConfig.counterNo,
            godownLocation: allocationConfig.locationType,
            id: existingAllocationId,
            notes: "",
            partyId: safeNumber(allocationConfig.contactNameId),
            pricePerHelper: allocationConfig.pricePerHelper,
            pricePerLabour: allocationConfig.pricePerLabour,
            quantityPer100Person: safeNumber(
              allocationConfig.quantityPer100Person
            ),
            selectChefLabourAgency: selectedAgency === "chef" ? true : false,
            selectOutsideAgency: selectedAgency === "outside" ? true : false,
            unitId: safeNumber(allocationConfig.unitId),
          },
        ];

    const payload = {
      nameEnglish: formik.values.nameEnglish,
      nameGujarati: formik.values.nameGujarati,
      nameHindi: formik.values.nameHindi,
      slogan: formik.values.menuSlogan,
      price: safeNumber(formik.values.price),
      sequence: safeNumber(formik.values.priority),
      userId: UserId,
      menuCategoryId: safeNumber(formik.values.menuItemCategory),
      menuSubCategoryId: safeNumber(formik.values.menuSubItemCategory),
      kitchenAreaId: safeNumber(formik.values.kitchenArea),
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

          if (formik.values.file) {
            uploadImage({ ...uploadRequest, ModuleId: selectedMenuItem.id });
          } else {
            refreshData();
            setIsModalOpen(false);
            Swal.fire({
              icon: "success",
              title: "Saved!",
              text: `Menu item updated successfully!`,
            });
          }
        })
        .catch((err) => console.error("Error updating menu item:", err));
    } else {
      AddMenuItems(payload)
        .then((res) => {
          const newId = res?.data?.moduleId;
          if (formik.values.file && newId) {
            uploadImage({ ...uploadRequest, ModuleId: newId });
          } else {
            refreshData();
            setIsModalOpen(false);
            Swal.fire({
              icon: "success",
              title: "Saved!",
              text: `Menu item added successfully!`,
            });
          }
        })
        .catch((err) => console.error("Error saving menu item:", err));
    }
  };

  const handleEdit = (rowData) => {
    setEditingRow(rowData);
    setIsItemModalOpen(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = await deleteRawmatrialcatidInmenuitem(id);
        if (result.data.success === true) {
          setTableData((prev) => prev.filter((row) => row.id !== id));
          Swal.fire("Deleted!", "Raw Material has been deleted.", "success");
        } else {
          Swal.fire("Error!", "Failed to delete Raw Material.", "error");
        }
      }
    });
  };

  const fetchDropdownData = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.id) return;

    Promise.all([
      GetMenuCategoryByUserIdmenuitem(userData.id),
      GetAllSubCategorymenuitem(userData.id),
      GetAllKitchenAreaById(userData.id),
    ])
      .then(([catRes, subRes, kitchenRes]) => {
        setCategories(catRes?.data?.data?.["Menu Category Details"] || []);
        setSubCategories(
          subRes?.data?.data?.["Menu Sub Category Details"] || []
        );
        setKitchenAreas(kitchenRes?.data?.data?.["KitchenAreas Details"] || []);
      })
      .catch((err) => console.error("Error loading dropdown data:", err));
  };
  const handleContactCategoryChange = (categoryName) => {
    if (!categoryName) {
      setContactNames([]);
      return;
    }

    ContactNameItem(UserId, categoryName)
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

  useEffect(() => {
    if (selectedMenuItem && isModalOpen && allocationConfig.contactCategoryId) {
      const selectedCategory = contactCategories.find(
        (cat) => cat.id === parseInt(allocationConfig.contactCategoryId)
      );

      if (selectedCategory) {
        handleContactCategoryChange(selectedCategory.name);
      }
    }
  }, [
    selectedMenuItem,
    isModalOpen,
    allocationConfig.contactCategoryId,
    contactCategories,
  ]);

  useEffect(() => {
    if (
      selectedMenuItem?.menuAllocation?.[0]?.contact?.id &&
      contactNames.length > 0
    ) {
      const selectedContactId = selectedMenuItem.menuAllocation[0].contact.id;

      const contactExists = contactNames.some(
        (contact) => contact.id === selectedContactId
      );

      if (
        contactExists &&
        allocationConfig.contactNameId !== selectedContactId
      ) {
        setAllocationConfig((prev) => ({
          ...prev,
          contactNameId: selectedContactId,
        }));
      }
    }
  }, [contactNames, selectedMenuItem, allocationConfig.contactNameId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "tab_1":
        return (
          <div className="flex flex-col gap-y-3">
            <InputField
              label="Name (English)"
              name="nameEnglish"
              value={formik.values.nameEnglish}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nameEnglish && formik.errors.nameEnglish}
            />
            <InputField
              label="Name (Gujarati)"
              name="nameGujarati"
              value={formik.values.nameGujarati}
              onChange={handleChange}
              onBlur={formik.handleBlur}
            />
            <InputField
              label="Name (Hindi)"
              name="nameHindi"
              value={formik.values.nameHindi}
              onChange={handleChange}
              onBlur={formik.handleBlur}
            />
            <TextareaField
              label="Slogan"
              name="menuSlogan"
              value={formik.values.menuSlogan}
              onChange={handleChange}
              onBlur={formik.handleBlur}
            />
            <div className="grid grid-cols-2 gap-x-4">
              <InputField
                label="Price"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && formik.errors.price}
              />
              <InputField
                label="Priority"
                name="priority"
                type="number"
                value={formik.values.priority}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.priority && formik.errors.priority}
              />
            </div>
            <div className="grid grid-cols-3 gap-x-4">
              {/* Menu Item Category */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-gray-600">
                    Menu Item Category
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <button
                    type="button"
                    className="w-6 h-6 flex items-center justify-center bg-primary text-white rounded-full shadow hover:scale-105 transition"
                    onClick={() => setIsCategoryModalOpen(true)}
                  >
                    +
                  </button>
                </div>
                <select
                  name="menuItemCategory"
                  value={formik.values.menuItemCategory}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  className={`border rounded-lg p-2 w-full ${
                    formik.touched.menuItemCategory &&
                    formik.errors.menuItemCategory
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">-- Select Category --</option>
                  {categories
                    .filter((c) => c.isActive)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nameEnglish}
                      </option>
                    ))}
                </select>
                {formik.touched.menuItemCategory &&
                  formik.errors.menuItemCategory && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.menuItemCategory}
                    </p>
                  )}
              </div>

              {/* Menu Item Sub Category */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-gray-600">
                    Menu Item Sub Category
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <button
                    type="button"
                    className="w-6 h-6 flex items-center justify-center bg-primary text-white rounded-full shadow hover:scale-105 transition"
                    onClick={() => setIsSubCategoryModalOpen(true)}
                  >
                    +
                  </button>
                </div>
                <select
                  name="menuSubItemCategory"
                  value={formik.values.menuSubItemCategory}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  className={`border rounded-lg p-2 w-full ${
                    formik.touched.menuSubItemCategory &&
                    formik.errors.menuSubItemCategory
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">-- Select Sub Category --</option>
                  {subCategories
                    .filter((s) => s.isActive)
                    .map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.nameEnglish}
                      </option>
                    ))}
                </select>
                {formik.touched.menuSubItemCategory &&
                  formik.errors.menuSubItemCategory && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.menuSubItemCategory}
                    </p>
                  )}
              </div>

              {/* Kitchen Area */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-gray-600">
                    Kitchen Area
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <button
                    type="button"
                    className="w-6 h-6 flex items-center justify-center bg-primary text-white rounded-full shadow hover:scale-105 transition"
                    onClick={() => setIsKitchenAreaModalOpen(true)}
                  >
                    +
                  </button>
                </div>
                <select
                  name="kitchenArea"
                  value={formik.values.kitchenArea}
                  onChange={handleChange}
                  onBlur={formik.handleBlur}
                  className={`border rounded-lg p-2 w-full ${
                    formik.touched.kitchenArea && formik.errors.kitchenArea
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">-- Select Kitchen Area --</option>
                  {kitchenAreas
                    .filter((a) => a.isActive)
                    .map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.nameEnglish}
                      </option>
                    ))}
                </select>
                {formik.touched.kitchenArea && formik.errors.kitchenArea && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.kitchenArea}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="form-label">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  formik.setFieldValue("file", e.target.files[0])
                }
                className="input"
              />
            </div>
          </div>
        );

      case "tab_2":
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
          <div className="flex justify-between gap-3">
            <button
              className="btn btn-light"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <div className="flex gap-3">
              {activeTab === "tab_1" && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    formik.validateForm().then((errors) => {
                      const requiredFields = [
                        "nameEnglish",
                        "priority",
                        "menuItemCategory",
                        "menuSubItemCategory",
                        "kitchenArea",
                        "price",
                      ];
                      const hasErrors = requiredFields.some(
                        (field) => errors[field]
                      );

                      if (hasErrors) {
                        formik.setTouched({
                          nameEnglish: true,
                          priority: true,
                          menuItemCategory: true,
                          menuSubItemCategory: true,
                          kitchenArea: true,
                          price: true,
                        });
                        return;
                      }

                      setCompletedTabs((prev) => [
                        ...new Set([...prev, "tab_2"]),
                      ]);
                      setActiveTab("tab_2");
                    });
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
      <AddMenuCategory
        isModalOpen={isCategoryModalOpen}
        setIsModalOpen={setIsCategoryModalOpen}
        refreshData={fetchDropdownData}
      />
      <AddMenuSubCategory
        isModalOpen={isSubCategoryModalOpen}
        setIsModalOpen={setIsSubCategoryModalOpen}
        refreshData={fetchDropdownData}
      />

      {/* Kitchen Area Modal - FIX: Use isKitchenAreaModalOpen */}
      {/* Kitchen Area Modal */}
      <AddKitchenAreaModal
        isModalOpen={isKitchenAreaModalOpen}
        setIsModalOpen={setIsKitchenAreaModalOpen}
        refreshData={fetchDropdownData}
      />
    </>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
}) => (
  <div className="flex flex-col">
    <label className="form-label">
      {label}
      {error && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`input ${error ? "border-red-500 border" : ""}`}
    />
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </div>
);

const TextareaField = ({ label, name, value, onChange, onBlur }) => (
  <div className="flex flex-col">
    <label className="form-label">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="input p-3"
    />
  </div>
);

const DropdownField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options,
  optionLabel,
  error,
}) => (
  <div className="flex flex-col">
    <label className="form-label">
      {label}
      {error && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`input ${error ? "border-red-500 border" : ""}`}
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt[optionLabel]}
        </option>
      ))}
    </select>
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
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
