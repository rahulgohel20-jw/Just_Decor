import { Fragment, useEffect, useState, useCallback } from "react";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { toAbsoluteUrl } from "@/utils";
import MenuItemGrid from "./components/MenuItemGrid";
import SelectedItems from "./components/SelectedItems";
import FunctionCard from "./components/FunctionCard";
import CategoryList from "./components/CategoryList";
import SearchInput from "./components/SearchInput";
import { Mic, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { Tooltip } from "antd";
import {
  GetEventMasterById,
  Getmenuprep,
  AddMenuprep,
  GetCustomPackageapibyID,
} from "@/services/apiServices";
import { useParams, useNavigate } from "react-router-dom";
import SelectMenureport from "../../../partials/modals/menu-report/SelectMenureport";
import MenuReport from "@/partials/modals/menu-report/MenuReport";
import CustomPackageModal from "@/partials/modals/customepackagemodal/CustomPackageModal";

const EventPlanningPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // basic UI / data state
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [personCount, setPersonCount] = useState("");
  const [defaultRate, setDefaultRate] = useState("");
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isSelectMenuReport, setIsSelectMenuReport] = useState(false);
  const [isMenuReport, setIsMenuReport] = useState(false);
  const [menuReportEventId, setMenuReportEventId] = useState(null);
  const [showCustomPackageModal, setShowCustomPackageModal] = useState(false);
  const [packageAppliedForFunction, setPackageAppliedForFunction] = useState(
    {}
  );

  // selections saved per function
  const [selectedByFunction, setSelectedByFunction] = useState({});
  // package categories and package items saved per function
  const [packageCategoriesByFunction, setPackageCategoriesByFunction] =
    useState({});
  const [packageItemsByFunction, setPackageItemsByFunction] = useState({});

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const [showRates, setShowRates] = useState(false);

  const userDataRaw = localStorage.getItem("userData");
  const userId = userDataRaw ? JSON.parse(userDataRaw).id : null;

  /* ---------------------
     Load initial event + select first function
     --------------------- */
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await GetEventMasterById(eventId);
        const eventDetails =
          response?.data?.data?.["Event Details"]?.[0] || null;

        setEventData(eventDetails);

        if (eventDetails?.eventFunctions?.[0]) {
          setPersonCount(eventDetails.eventFunctions[0].pax);
          setDefaultRate(eventDetails.eventFunctions[0].rate ?? "");
          setSelectedFunction(eventDetails.eventFunctions[0].id);
        }
      } catch (err) {
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  /* ---------------------
     Load saved menu prep for selected function (from API)
     --------------------- */
  const loadSavedMenuPrep = useCallback(async () => {
    if (!selectedFunction) return;
    const userIdLocal = localStorage.getItem("userId");
    const itemName = "";
    try {
      const resp = await Getmenuprep(
        selectedFunction,
        itemName,
        0,
        1,
        200,
        userIdLocal
      );
      const data = resp?.data?.data;
      if (!data) return;

      const selectedCats = data.selectedMenuPreparationItems || [];
      const flatItems = data.menuPreparationItems || [];

      const categories = {};
      const order = [];

      selectedCats.forEach((cat) => {
        const catName = cat.menuCategoryName || "Uncategorized";

        const mappedItems = cat.selectedMenuPreparationItems.map((it) => {
          const flat = flatItems.find(
            (f) => Number(f.menuItemId) === Number(it.menuItemId)
          );

          return {
            id: Number(it.menuItemId),
            nameEnglish: it.menuItemName,
            imagePath: flat?.imagePath || "",
            rate: Number(it.itemPrice),
            menuCategoryName: catName,
            catId: Number(cat.menuCategoryId || 0),
            // saved items from API won't contain package metadata
            isPackageItem: data?.menuPreparation?.isPackage || false,
            packageId: data?.menuPreparation?.packageId || 0,
            packageName: data?.menuPreparation?.packageName || "",
            packagePrice: data?.menuPreparation?.packagePrice || 0,
          };
        });

        if (mappedItems.length > 0) {
          categories[catName] = mappedItems;
          order.push(catName);
        }
      });

      const menuPrepId = data?.menuPreparation?.id || 0;

      setSelectedByFunction((prev) => ({
        ...prev,
        [selectedFunction]: {
          categoriesOrder: order,
          categories,
        },
        _menuPrepId: menuPrepId,
      }));

      // do not assume packageCategories here; leave packageCategoriesByFunction unchanged
      if (order.length > 0) setHasExistingData(true);
    } catch (err) {
      console.log("Menu Prep fetch failed", err);
    }
  }, [selectedFunction]);

  useEffect(() => {
    loadSavedMenuPrep();
  }, [selectedFunction, loadSavedMenuPrep]);

  /* ---------------------
     If default rate changed, apply to selected function items
     --------------------- */
  useEffect(() => {
    if (!selectedFunction) return;
    if (defaultRate === "" || defaultRate === null) return;

    setSelectedByFunction((prev) => {
      const bucket = prev[selectedFunction];
      if (!bucket) return prev;

      const updatedCat = {};
      Object.keys(bucket.categories).forEach((c) => {
        updatedCat[c] = bucket.categories[c].map((it) => ({
          ...it,
          rate: Number(defaultRate),
        }));
      });

      return {
        ...prev,
        [selectedFunction]: {
          ...bucket,
          categories: updatedCat,
        },
      };
    });
  }, [defaultRate, selectedFunction]);

  /* ---------------------
     Helpers: get selected ids for highlighting in the grid
     --------------------- */
  const getSelectedIdsForFunction = useCallback(
    (functionId) => {
      const bucket = selectedByFunction[functionId];
      if (!bucket) return new Set();

      const ids = Object.values(bucket.categories)
        .flat()
        .map((i) => Number(i.id));

      return new Set([...ids, ...ids.map(String)]);
    },
    [selectedByFunction]
  );

  /* ---------------------
     Toggle select / add item to selectedByFunction for current function
     --------------------- */
  const onToggleSelectItem = useCallback(
    (menuItem, overrideCategoryName) => {
      const functionId = selectedFunction;
      if (!functionId) return;

      const categoryName =
        overrideCategoryName ||
        menuItem.menuCategory?.nameEnglish ||
        menuItem.menuCategory?.name ||
        menuItem.menuCategoryName ||
        "Uncategorized";

      const itemId = Number(menuItem.id ?? menuItem.menuItemId);

      setSelectedByFunction((prev) => {
        const bucket = prev[functionId] || {
          categoriesOrder: [],
          categories: {},
        };

        const categories = { ...bucket.categories };

        const list = categories[categoryName]
          ? [...categories[categoryName]]
          : [];

        const already = list.findIndex((i) => Number(i.id) === itemId);

        if (already > -1) {
          list.splice(already, 1);

          if (list.length === 0) delete categories[categoryName];
          else categories[categoryName] = list;

          return {
            ...prev,
            [functionId]: {
              categoriesOrder: bucket.categoriesOrder.filter(
                (c) => categories[c]
              ),
              categories,
            },
          };
        }

        const appliedRate =
          defaultRate !== ""
            ? Number(defaultRate)
            : Number(menuItem.itemPrice ?? 0);

        list.push({
          id: itemId,
          nameEnglish: menuItem.nameEnglish || menuItem.menuItemName,
          imagePath: menuItem.imagePath || "",
          rate: appliedRate,
          menuCategoryName: categoryName,
          catId: Number(
            menuItem.menuCategory?.id || menuItem.menuCategoryId || 0
          ),
        });

        categories[categoryName] = list;

        const newOrder = bucket.categoriesOrder.includes(categoryName)
          ? bucket.categoriesOrder
          : [...bucket.categoriesOrder, categoryName];

        return {
          ...prev,
          [functionId]: {
            categoriesOrder: newOrder,
            categories,
          },
        };
      });
    },
    [selectedFunction, defaultRate]
  );

  /* ---------------------
     Remove selected item
     --------------------- */
  const onRemoveSelectedItem = useCallback(
    (functionId, categoryName, itemId) => {
      setSelectedByFunction((prev) => {
        const bucket = prev[functionId];
        if (!bucket) return prev;

        const categories = { ...bucket.categories };
        const updated = (categories[categoryName] || []).filter(
          (i) => Number(i.id) !== Number(itemId)
        );

        if (updated.length === 0) delete categories[categoryName];
        else categories[categoryName] = updated;

        return {
          ...prev,
          [functionId]: {
            categoriesOrder: bucket.categoriesOrder.filter(
              (c) => categories[c]
            ),
            categories,
          },
        };
      });
    },
    []
  );

  /* ---------------------
     Drag end (reorder)
     --------------------- */
  const onDragEndSelected = useCallback((functionId, newState) => {
    setSelectedByFunction((prev) => ({
      ...prev,
      [functionId]: newState,
    }));
  }, []);

  /* ---------------------
     Rate change handler (from SelectedItems)
     --------------------- */
  const onRateChange = useCallback(
    (functionId, categoryName, itemId, newRate) => {
      setSelectedByFunction((prev) => {
        const bucket = prev[functionId];
        if (!bucket) return prev;

        const categories = { ...bucket.categories };
        const items = categories[categoryName] || [];

        const updatedItems = items.map((item) =>
          Number(item.id) === Number(itemId) ? { ...item, rate: newRate } : item
        );

        return {
          ...prev,
          [functionId]: {
            ...bucket,
            categories: {
              ...categories,
              [categoryName]: updatedItems,
            },
          },
        };
      });
    },
    []
  );

  /* ---------------------
     Apply package to currently selected function
     - stores categories & items per function
     --------------------- */
  const handlePackageSelect = async (packageId) => {
    if (!selectedFunction) {
      Swal.fire({
        icon: "warning",
        title: "Select function first",
        text: "Please select a function (e.g., Breakfast) before applying a package.",
      });
      return;
    }

    try {
      setLoading(true);
      const resp = await GetCustomPackageapibyID(packageId);
      const pkg = resp?.data?.data?.["Package Details"]?.[0];

      if (!pkg) {
        Swal.fire({
          icon: "error",
          title: "Package not found",
        });
        setLoading(false);
        return;
      }

      // Map package menus to the selectedByFunction structure
      const categories = {};
      const order = [];
      const packageItemsFlat = []; // flat list for grid usage (optional)

      (pkg.customPackageDetails || []).forEach((menu) => {
        const catName = menu.menuName || `Menu ${menu.menuId || ""}`;
        const catId = Number(menu.menuId || 0);

        const items = (menu.customPackageMenuItemDetails || []).map((it) => {
          const mapped = {
            id: Number(it.menuItemId || it.id || 0),
            nameEnglish: it.itemName || "",
            imagePath: "", // API doesn't include images in package payload
            rate: Number(it.itemPrice || 0),
            menuCategoryName: catName,
            catId,
            isPackageItem: true,
            packageId: pkg.id,
            packageName: pkg.nameEnglish,
          };
          packageItemsFlat.push(mapped);
          return mapped;
        });

        if (items.length > 0) {
          categories[catName] = items;
          order.push(catName);
        }
      });
      setPackageAppliedForFunction((prev) => ({
        ...prev,
        [selectedFunction]: true,
      }));

      // Save package categories and items per function
      setPackageCategoriesByFunction((prev) => ({
        ...prev,
        [selectedFunction]: order,
      }));

      setPackageItemsByFunction((prev) => ({
        ...prev,
        [selectedFunction]: packageItemsFlat,
      }));

      // Apply to selectedByFunction for this function (replace selection)
      setSelectedByFunction((prev) => ({
        ...prev,
        [selectedFunction]: {
          categoriesOrder: order,
          categories,
        },
        // keep existing _menuPrepId if any
        _menuPrepId: prev?._menuPrepId || 0,
      }));

      if (order.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No items in package",
        });
        setShowCustomPackageModal(false);
        setLoading(false);
        return;
      }

      setHasExistingData(true);
      setShowCustomPackageModal(false);

      Swal.fire({
        icon: "success",
        title: "Package applied",
        text: `${pkg.nameEnglish || "Package"} applied to selected function.`,
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Apply package failed", err);
      Swal.fire({
        icon: "error",
        title: "Failed to apply package",
        text: "Something went wrong while loading package.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------
     Build payload to save to API
     --------------------- */
  const buildRequestPayload = () => {
    const bucket = selectedByFunction[selectedFunction];
    if (!bucket) return null;

    const categoriesPayload = bucket.categoriesOrder.map(
      (catName, catIndex) => {
        const items = bucket.categories[catName] || [];

        return {
          menuCategoryId: items[0]?.catId || 0,
          menuCategoryName: catName,
          menuNotes: "",
          menuSlogan: "",
          menuSortOrder: catIndex,
          startTime: "",
          selectedMenuPreparationItems: items.map((item, itemIndex) => ({
            id: 0,
            itemNotes: "",
            itemSlogan: "",
            itemSortOrder: itemIndex,
            itemPrice: Number(item.rate),
            menuItemId: Number(item.id),
            menuItemName: item.nameEnglish,
          })),
        };
      }
    );

    // ⭐ package info for selected function
    const isPackageApplied =
      packageAppliedForFunction[selectedFunction] || false;
    const selectedPkgItems = packageItemsByFunction[selectedFunction] || [];
    const selectedPkgObj =
      selectedPkgItems.length > 0 ? selectedPkgItems[0] : null;

    return {
      id: selectedByFunction._menuPrepId || 0,
      eventFunctionId: selectedFunction,
      pax: Number(personCount),
      defaultPrice: Number(defaultRate),
      price: Number(defaultRate),
      sortorder: 0,

      // ⭐ FINAL PAYLOAD UPDATE
      isPackage: isPackageApplied,
      packageId: isPackageApplied ? selectedPkgObj?.packageId || 0 : 0,
      packageName: isPackageApplied ? selectedPkgObj?.packageName || "" : "",
      packagePrice: isPackageApplied ? selectedPkgObj?.rate || 0 : 0,

      selectedMenuPreparation: categoriesPayload,
    };
  };

  /* ---------------------
     Save/Update handler
     --------------------- */
  const handleSaveOrUpdate = async () => {
    try {
      setIsSaving(true);

      const payload = buildRequestPayload();
      if (!payload) {
        alert("Nothing to save");
        setIsSaving(false);
        return;
      }

      const resp = await AddMenuprep(payload);
      const newId = resp?.data?.data?.id || payload.id;

      setSelectedByFunction((prev) => ({
        ...prev,
        _menuPrepId: newId,
      }));

      setHasExistingData(true);
      await loadSavedMenuPrep();
      Swal.fire({
        icon: "success",
        title:
          payload.id === 0
            ? "Menu saved successfully!"
            : "Menu updated successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.log("Save failed", err);
      Swal.fire({
        icon: "error",
        title: "Failed to save menu!",
        text: "Something went wrong",
      });
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------------
     Category change handler
     --------------------- */
  const handleCategoryChange = (categoryName, categoryId) => {
    setSelectedCategory(categoryName);
    setSelectedCategoryId(categoryId);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  /* ---------------------
     Derived props for children (current function)
     --------------------- */
  const currentPackageCategories =
    packageCategoriesByFunction[selectedFunction] || [];
  const currentPackageItems = packageItemsByFunction[selectedFunction] || [];

  /* ---------------------
     Loading / error UI
     --------------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded p-4 max-w-md">
          <p className="text-red-800 font-semibold mb-2">Error loading event</p>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  /* ---------------------
     Render
     --------------------- */
  return (
    <Fragment>
      <div className="flex flex-col min-h-screen w-full">
        <div className="flex-1 overflow-auto px-4 py-2">
          <div className="gap-2 pb-2 mb-3">
            <Breadcrumbs items={[{ title: "Menu Planning" }]} />
          </div>

          <div className="border rounded mb-4 w-full">
            <div className="card w-full">
              <div className="w-full border-b p-3 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      src={toAbsoluteUrl("/media/menu/eventno.png")}
                      alt="event no"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      Event No:
                    </span>
                    <span className="font-semibold text-sm text-primary">
                      {eventData?.eventNo}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      src={toAbsoluteUrl("/media/menu/person.png")}
                      alt="person"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      Person:
                    </span>
                    <input
                      type="number"
                      min={1}
                      className="input input-sm w-20"
                      value={personCount}
                      onChange={(e) => setPersonCount(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      src={toAbsoluteUrl("/media/menu/eventname.png")}
                      alt="event name"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      Event Name:
                    </span>
                    <span className="font-semibold text-sm text-primary">
                      {eventData?.eventType?.nameEnglish}
                    </span>
                  </div>
                </div>

                <hr className="border-t-2 border-gray-300 my-3" />

                <div>
                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      src={toAbsoluteUrl("/media/menu/partyname.png")}
                      alt="party"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      Customer:
                    </span>
                    <span className="font-semibold text-sm text-primary">
                      {eventData?.party?.nameEnglish}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <img
                        className="w-5 h-5"
                        src={toAbsoluteUrl("/media/menu/venue.png")}
                        alt="venue"
                      />
                      <span className="text-sm font-semibold text-gray-900">
                        Venue:
                      </span>
                      <span className="font-semibold text-sm text-primary">
                        {eventData?.venue.nameEnglish}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-t-2 border-gray-300 my-3" />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      src={toAbsoluteUrl("/media/menu/eventdate.png")}
                      alt="date"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        Event Start Date :
                      </span>
                      <span className="font-semibold text-sm text-primary">
                        {eventData?.eventStartDateTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      src={toAbsoluteUrl("/media/menu/eventdate.png")}
                      alt="date"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        Event End Date :
                      </span>
                      <span className="font-semibold text-sm text-primary">
                        {eventData?.eventEndDateTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <img
                      className="w-5 h-5"
                      src={toAbsoluteUrl("/media/menu/rate.png")}
                      alt="rate"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      Default Rate:
                    </span>
                    <input
                      type="number"
                      min={0}
                      className="input input-sm w-28"
                      value={defaultRate}
                      onChange={(e) => setDefaultRate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* functions + package controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-4">
            <div className="lg:col-span-2">
              <div className="flex gap-3 border rounded overflow-x-auto no-scrollbar py-2 px-2 text-gray-500 bg-gray-200">
                {eventData?.eventFunctions?.map((func) => (
                  <div
                    key={func.id}
                    onClick={() => setSelectedFunction(func.id)}
                    className="cursor-pointer"
                  >
                    <FunctionCard
                      functionData={func}
                      isSelected={selectedFunction === func.id}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 p-2 border rounded bg-gray-200">
              <div className="flex gap-2">
                {/* CUSTOM BUTTON */}
                <button
                  className={`btn text-sm px-3 py-1 ${
                    packageAppliedForFunction[selectedFunction]
                      ? "bg-white text-primary border border-primary"
                      : "bg-primary text-white"
                  }`}
                  onClick={() => {
                    // user switches back to FULL CUSTOM mode
                    setPackageAppliedForFunction((prev) => ({
                      ...prev,
                      [selectedFunction]: false,
                    }));
                  }}
                >
                  Custom
                </button>

                {/* CUSTOM PACKAGE BUTTON */}
                <button
                  className={`btn text-sm px-3 py-1 ${
                    packageAppliedForFunction[selectedFunction]
                      ? "bg-primary text-white"
                      : "bg-white text-primary border border-primary"
                  }`}
                  onClick={() => setShowCustomPackageModal(true)}
                >
                  Custom package
                </button>
              </div>

              <button
                className="btn bg-success text-white text-sm px-3 py-1"
                onClick={() => {
                  setMenuReportEventId(eventId);
                  setIsSelectMenuReport(true);
                }}
              >
                Report
              </button>
            </div>
          </div>

          {/* main columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-2 border rounded overflow-y-auto no-scrollbar flex">
              <div className="min-h-[600px] w-[30%] border-r">
                <div className="border-b p-3">
                  <SearchInput
                    placeholder="Search categories"
                    value={categorySearchTerm}
                    onChange={(v) => setCategorySearchTerm(v)}
                    onAdd={() => {}}
                    addTooltip="Add menu category"
                  />
                </div>

                <div
                  className="p-3 overflow-auto no-scrollbar"
                  style={{ maxHeight: "calc(100vh - 200px)" }}
                >
                  <CategoryList
                    selectedCategoryId={selectedCategoryId}
                    onCategoryChange={handleCategoryChange}
                    searchTerm={categorySearchTerm}
                    // PASS only current function package categories
                    packageCategories={currentPackageCategories}
                    savedCategoriesOrder={
                      selectedByFunction[selectedFunction]?.categoriesOrder ||
                      []
                    }
                  />
                </div>
              </div>

              <div className="w-[70%]">
                <div className="border-b p-3 bg-light flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <div className="flex-1">
                        <SearchInput
                          placeholder="Search items"
                          value={itemSearchTerm}
                          onChange={(v) => setItemSearchTerm(v)}
                          onAdd={() => {}}
                          addTooltip="Add menu item"
                        />
                      </div>

                      <Tooltip title="Start speech to text">
                        <button
                          type="button"
                          className="btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8"
                        >
                          <Mic size={18} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                <div
                  className="p-3 overflow-auto no-scrollbar"
                  style={{ maxHeight: "calc(100vh - 200px)" }}
                >
                  <MenuItemGrid
                    category={selectedCategory}
                    categoryId={selectedCategoryId}
                    pageSize={100}
                    searchTerm={itemSearchTerm}
                    selectedIdsSet={getSelectedIdsForFunction(selectedFunction)}
                    onToggleSelect={onToggleSelectItem}
                    selectedFunctionId={selectedFunction}
                    // PASS package items for current function so grid can show PKG badge / ordering
                    packageItems={currentPackageItems}
                  />
                </div>
              </div>
            </div>

            {/* Selected items panel */}
            <div
              className="border rounded flex flex-col bg-gray-100 overflow-auto no-scrollbar"
              style={{ maxHeight: "calc(100vh - 80px)" }}
            >
              <div className="flex items-center justify-between border-b p-3 h-[69px]">
                <p className="font-semibold text-gray-700">Selected Items</p>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  aria-label="Toggle rate visibility"
                  onClick={() => setShowRates(!showRates)}
                >
                  {showRates ? (
                    <Eye className="text-primary" size={20} />
                  ) : (
                    <EyeOff className="text-primary" size={20} />
                  )}
                </button>
              </div>

              <SelectedItems
                functionId={selectedFunction}
                data={
                  selectedByFunction[selectedFunction] || {
                    categoriesOrder: [],
                    categories: {},
                  }
                }
                onRemove={(f, c, i) =>
                  onRemoveSelectedItem(f || selectedFunction, c, i)
                }
                onDragEndNewState={(state) =>
                  onDragEndSelected(selectedFunction, state)
                }
                showRates={showRates}
                onRateChange={onRateChange}
              />
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="bg-white">
          <div className="flex items-center justify-between px-2 py-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="btn bg-white border border-gray-300 text-gray-700 ml-2 px-6 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveOrUpdate}
              disabled={isSaving}
              className="btn bg-success text-white px-8 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>{hasExistingData ? "Update Menu" : "Save Menu"}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <SelectMenureport
        isSelectMenureport={isSelectMenuReport}
        setIsSelectMenuReport={setIsSelectMenuReport}
        onConfirm={() => {
          setIsSelectMenuReport(false);
          setIsMenuReport(true);
        }}
      />

      <MenuReport
        isModalOpen={isMenuReport}
        setIsModalOpen={setIsMenuReport}
        eventId={menuReportEventId}
      />

      <CustomPackageModal
        isOpen={showCustomPackageModal}
        onClose={() => setShowCustomPackageModal(false)}
        userId={userId}
        onSelectPackage={(payload) => {
          if (payload && typeof payload === "object" && payload.packageInfo) {
            handlePackageSelect(payload.packageInfo.id);
          } else {
            handlePackageSelect(payload);
          }
        }}
      />
      <SelectMenureport
        isSelectMenureport={isSelectMenuReport}
        setIsSelectMenuReport={setIsSelectMenuReport}
        onConfirm={() => {
          setIsSelectMenuReport(false);
          setIsMenuReport(true);
        }}
      />
      <MenuReport
        isModalOpen={isMenuReport}
        setIsModalOpen={setIsMenuReport}
        eventId={menuReportEventId}
      />
    </Fragment>
  );
};

export default EventPlanningPage;
