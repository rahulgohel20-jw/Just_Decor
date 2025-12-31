import { Fragment, useEffect, useState, useCallback, useMemo } from "react";
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
import AddMenuItem from "@/partials/modals/add-menu-item/AddMenuItem";
import AddMenuCategory from "@/partials/modals/add-menu-category/AddMenuCategory";
import { useParams, useNavigate } from "react-router-dom";
import SelectMenureport from "../../../partials/modals/menu-report/SelectMenureport";
import CustomPackageModal from "@/partials/modals/customepackagemodal/CustomPackageModal";
import MenuNotes from "@/partials/modals/menu-notes/MenuNotes";
import CategoryNotes from "@/partials/modals/category-note/CategoryNotes";
import EditPaxModal from "./components/EditPaxModal";
const EventPlanningPage = () => {
  let { eventId } = useParams();
  const navigate = useNavigate();
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

  const [selectedByFunction, setSelectedByFunction] = useState({});
  const [packageCategoriesByFunction, setPackageCategoriesByFunction] =
    useState({});
  const [packageItemsByFunction, setPackageItemsByFunction] = useState({});
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [itemSearchTerm, setItemSearchTerm] = useState("");
  const [showRates, setShowRates] = useState(false);
  const [packageInfoByFunction, setPackageInfoByFunction] = useState({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCategoryNoteModal, setShowCategoryNoteModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [currentItemForNotes, setCurrentItemForNotes] = useState(null);
  const [currentCategoryForNotes, setCurrentCategoryForNotes] = useState(null);
  const [itemNotes, setItemNotes] = useState("");
  const [categoryNotes, setCategoryNotes] = useState("");
  const userId = localStorage.getItem("userId");
  const [editPax, setEditPax] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const hasSelectedItems = useMemo(() => {
    const bucket = selectedByFunction[selectedFunction];
    if (!bucket || !bucket.categories) return false;

    const totalItems = Object.values(bucket.categories).reduce(
      (sum, items) => sum + items.length,
      0
    );
    return totalItems > 0;
  }, [selectedByFunction, selectedFunction]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const response = await GetEventMasterById(eventId);
      const eventDetails = response?.data?.data?.["Event Details"]?.[0] || null;

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
  useEffect(() => {
    fetchEventData();
  }, [eventId]);
  useEffect(() => {
    if (!eventData || !selectedFunction) return;

    const func = eventData.eventFunctions.find(
      (f) => f.id === selectedFunction
    );
    if (func) {
      setPersonCount(func.pax || "");
      setDefaultRate(func.rate || "");
    }
  }, [selectedFunction, eventData]);

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
        const catNameHindi = cat.menuCategoryNameHindi || catName;
        const catNameGujarati = cat.menuCategoryNameGujarati || catName;

        const mappedItems = cat.selectedMenuPreparationItems.map((it) => {
          const flat = flatItems.find(
            (f) => Number(f.menuItemId) === Number(it.menuItemId)
          );

          return {
            id: Number(it.menuItemId),
            nameEnglish: it.menuItemName || "",
            nameHindi: it.menuItemNameHindi || it.menuItemName || "",
            nameGujarati: it.menuItemNameGujarati || it.menuItemName || "",
            imagePath: flat?.imagePath || "",
            rate: Number(it.itemPrice),
            menuCategoryName: catName,
            menuCategoryNameHindi: catNameHindi,
            menuCategoryNameGujarati: catNameGujarati,
            catId: Number(cat.menuCategoryId || 0),
            itemSlogan: it.itemSlogan || "",
            itemNotes: it.itemNotes || "",

            // Package metadata
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

      // Restore package state
      const isPkg = data?.menuPreparation?.isPackage || false;

      if (isPkg) {
        const pkgId = data?.menuPreparation?.packageId || 0;
        const pkgName = data?.menuPreparation?.packageName || "";
        const pkgPrice = data?.menuPreparation?.packagePrice || 0;

        setPackageInfoByFunction((prev) => ({
          ...prev,
          [selectedFunction]: {
            packageId: pkgId,
            packageName: pkgName,
            packagePrice: pkgPrice,
          },
        }));

        setPackageAppliedForFunction((prev) => ({
          ...prev,
          [selectedFunction]: true,
        }));

        setPackageCategoriesByFunction((prev) => ({
          ...prev,
          [selectedFunction]: order,
        }));

        const pkgItems = flatItems.map((f) => ({
          id: Number(f.menuItemId),
          nameEnglish: f.menuItemName || "",
          nameHindi: f.menuItemNameHindi || f.menuItemName || "",
          nameGujarati: f.menuItemNameGujarati || f.menuItemName || "",
          imagePath: f.imagePath || "",
          rate: Number(f.itemPrice),
          menuCategoryName: f.menuCategoryName || "",
          menuCategoryNameHindi:
            f.menuCategoryNameHindi || f.menuCategoryName || "",
          menuCategoryNameGujarati:
            f.menuCategoryNameGujarati || f.menuCategoryName || "",
          catId: Number(f.menuCategoryId || 0),
          isPackageItem: true,
          packageId: pkgId,
          packageName: pkgName,
        }));

        setPackageItemsByFunction((prev) => ({
          ...prev,
          [selectedFunction]: pkgItems,
        }));
      }

      if (order.length > 0) setHasExistingData(true);
    } catch (err) {
      console.log("Menu Prep fetch failed", err);
    }
  }, [selectedFunction]);

  useEffect(() => {
    loadSavedMenuPrep();
  }, [selectedFunction, loadSavedMenuPrep]);

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

  const onToggleSelectItem = useCallback(
    (menuItem, overrideCategoryName) => {
      setIsDirty(true);
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

        const appliedRate = Number(menuItem.itemPrice ?? menuItem.rate ?? 0);

        // ⭐ Store all language fields for items
        list.push({
          id: itemId,
          nameEnglish: menuItem.nameEnglish || menuItem.menuItemName || "",
          nameHindi:
            menuItem.nameHindi ||
            menuItem.menuItemNameHindi ||
            menuItem.nameEnglish ||
            menuItem.menuItemName ||
            "",
          nameGujarati:
            menuItem.nameGujarati ||
            menuItem.menuItemNameGujarati ||
            menuItem.nameEnglish ||
            menuItem.menuItemName ||
            "",
          imagePath: menuItem.imagePath || "",
          rate: appliedRate,
          menuCategoryName: categoryName,
          // ⭐ Store category translations too
          menuCategoryNameHindi:
            menuItem.menuCategory?.nameHindi ||
            menuItem.menuCategoryNameHindi ||
            categoryName,
          menuCategoryNameGujarati:
            menuItem.menuCategory?.nameGujarati ||
            menuItem.menuCategoryNameGujarati ||
            categoryName,
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

  const onRemoveSelectedItem = useCallback(
    (functionId, categoryName, itemId) => {
      setIsDirty(true);
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

  const onDragEndSelected = useCallback((functionId, newState) => {
    setIsDirty(true);
    setSelectedByFunction((prev) => ({
      ...prev,
      [functionId]: newState,
    }));
  }, []);

  const onRateChange = useCallback(
    (functionId, categoryName, itemId, newRate) => {
      setIsDirty(true);

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

      const categories = {};
      const order = [];
      const packageItemsFlat = [];

      (pkg.customPackageDetails || []).forEach((menu) => {
        const catName = menu.menuName || `Menu ${menu.menuId || ""}`;
        const catNameHindi = menu.menuNameHindi || catName;
        const catNameGujarati = menu.menuNameGujarati || catName;
        const catId = Number(menu.menuId || 0);

        const items = (menu.customPackageMenuItemDetails || []).map((it) => {
          const mapped = {
            id: Number(it.menuItemId || it.id || 0),
            nameEnglish: it.itemName || "",
            nameHindi: it.itemNameHindi || it.itemName || "",
            nameGujarati: it.itemNameGujarati || it.itemName || "",
            imagePath: "",
            rate: Number(it.itemPrice || 0),
            menuCategoryName: catName,
            menuCategoryNameHindi: catNameHindi,
            menuCategoryNameGujarati: catNameGujarati,
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

      setPackageCategoriesByFunction((prev) => ({
        ...prev,
        [selectedFunction]: order,
      }));

      setPackageItemsByFunction((prev) => ({
        ...prev,
        [selectedFunction]: packageItemsFlat,
      }));

      setPackageInfoByFunction((prev) => ({
        ...prev,
        [selectedFunction]: {
          packageId: pkg.id,
          packageName: pkg.nameEnglish,
          packagePrice: pkg.price || pkg.packagePrice || 0,
        },
      }));

      setSelectedByFunction((prev) => ({
        ...prev,
        [selectedFunction]: {
          categoriesOrder: order,
          categories,
        },
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
      setIsDirty(true);
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

  const buildRequestPayload = () => {
    const bucket = selectedByFunction[selectedFunction];
    if (!bucket) return null;

    const categoriesPayload = bucket.categoriesOrder.map(
      (catName, catIndex) => {
        const items = bucket.categories[catName] || [];

        const firstItem = items[0] || {};
        const catNameHindi = firstItem.menuCategoryNameHindi || catName;
        const catNameGujarati = firstItem.menuCategoryNameGujarati || catName;

        return {
          menuCategoryId: items[0]?.catId || 0,
          menuCategoryName: catName,
          menuCategoryNameHindi: catNameHindi,
          menuCategoryNameGujarati: catNameGujarati,
          menuNotes: bucket.categoryNotes?.[catName] || "",
          menuSlogan: bucket.categorySlogans?.[catName] || "",
          menuSortOrder: catIndex,
          startTime: "",
          selectedMenuPreparationItems: items.map((item, itemIndex) => ({
            id: 0,
            itemNotes: item.itemNotes || "",
            itemSlogan: item.itemSlogan || "",
            itemSortOrder: itemIndex,
            itemPrice: Number(item.rate),
            menuItemId: Number(item.id),
            menuItemName: item.nameEnglish || "",
            menuItemNameHindi: item.nameHindi || item.nameEnglish || "",
            menuItemNameGujarati: item.nameGujarati || item.nameEnglish || "",
          })),
        };
      }
    );

    const isPackageApplied =
      packageAppliedForFunction[selectedFunction] || false;
    const selectedPkgItems = packageItemsByFunction[selectedFunction] || [];
    const pkgInfoFromState =
      typeof packageInfoByFunction !== "undefined" &&
      packageInfoByFunction[selectedFunction]
        ? packageInfoByFunction[selectedFunction]
        : null;

    const inferredPkgFromItems =
      selectedPkgItems.length > 0
        ? {
            packageId: selectedPkgItems[0].packageId || 0,
            packageName: selectedPkgItems[0].packageName || "",
            packagePrice:
              selectedPkgItems[0].packagePrice ??
              selectedPkgItems[0].package_price ??
              selectedPkgItems[0].rate ??
              0,
          }
        : null;

    const finalPkg = pkgInfoFromState ||
      inferredPkgFromItems || {
        packageId: 0,
        packageName: "",
        packagePrice: 0,
      };

    return {
      id: selectedByFunction._menuPrepId || 0,
      eventFunctionId: selectedFunction,
      pax: Number(personCount),
      defaultPrice: Number(defaultRate),
      price: Number(defaultRate),
      sortorder: 0,

      isPackage: isPackageApplied,
      packageId: isPackageApplied ? Number(finalPkg.packageId || 0) : 0,
      packageName: isPackageApplied ? finalPkg.packageName || "" : "",
      packagePrice: isPackageApplied ? Number(finalPkg.packagePrice || 0) : 0,

      selectedMenuPreparation: categoriesPayload,
    };
  };
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
      setIsDirty(false);
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

  const onInstructionsChange = useCallback(
    (functionId, categoryName, itemId, newInstructions) => {
      setIsDirty(true);

      setSelectedByFunction((prev) => {
        const bucket = prev[functionId];
        if (!bucket) return prev;

        const categories = { ...bucket.categories };
        const items = categories[categoryName] || [];

        const updatedItems = items.map((item) =>
          Number(item.id) === Number(itemId)
            ? { ...item, itemNotes: newInstructions }
            : item
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

  const handleCategoryChange = (categoryName, categoryId) => {
    setSelectedCategory(categoryName);
    setSelectedCategoryId(categoryId);
  };

  const openItemNotesModal = (itemId) => {
    // Find the item in categories to get its itemSlogan
    const bucket = selectedByFunction[selectedFunction];
    let foundSlogan = "";

    if (bucket && bucket.categories) {
      Object.values(bucket.categories).forEach((items) => {
        const item = items.find((it) => Number(it.id) === Number(itemId));
        if (item) {
          foundSlogan = item.itemSlogan || "";
        }
      });
    }

    setCurrentItemForNotes(itemId);
    setItemNotes(foundSlogan);
    setShowNoteModal(true);
  };
  const openCategoryNotesModal = (categoryName, notes = "") => {
    setCurrentCategoryForNotes(categoryName);
    setCategoryNotes(notes);
    setShowCategoryNoteModal(true);
  };

  const handleNoteSave = (updatedSlogan) => {
    if (!selectedFunction || !currentItemForNotes) return;
    setIsDirty(true);

    setSelectedByFunction((prev) => {
      const bucket = prev[selectedFunction];
      if (!bucket) return prev;

      const updatedCategories = {};

      Object.keys(bucket.categories).forEach((cat) => {
        updatedCategories[cat] = bucket.categories[cat].map((item) =>
          Number(item.id) === Number(currentItemForNotes)
            ? { ...item, itemSlogan: updatedSlogan }
            : item
        );
      });

      return {
        ...prev,
        [selectedFunction]: {
          ...bucket,
          categories: updatedCategories,
        },
      };
    });

    setShowNoteModal(false);
    setCurrentItemForNotes(null);
  };

  const handleCategoryNoteSave = ({ notes, slogan }) => {
    if (!selectedFunction || !currentCategoryForNotes) return;
    setIsDirty(true);

    setSelectedByFunction((prev) => {
      const bucket = prev[selectedFunction] || {};

      return {
        ...prev,
        [selectedFunction]: {
          ...bucket,
          categoryNotes: {
            ...(bucket.categoryNotes || {}),
            [currentCategoryForNotes]: notes,
          },
          categorySlogans: {
            ...(bucket.categorySlogans || {}),
            [currentCategoryForNotes]: slogan,
          },
        },
      };
    });

    setShowCategoryNoteModal(false);
    setCurrentCategoryForNotes(null);
  };

  const initializeData = useCallback(async () => {
    await loadSavedMenuPrep();
  }, [loadSavedMenuPrep]);

  const currentPackageCategories =
    packageCategoriesByFunction[selectedFunction] || [];
  const currentPackageItems = packageItemsByFunction[selectedFunction] || [];

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

  const selectedPkgInfo = packageInfoByFunction[selectedFunction] || null;

  return (
    <Fragment>
      <div className="flex flex-col min-h-screen w-full">
        <div className="flex-1 overflow-auto px-4 py-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-6">
              <h2 className="text-xl text-black font-semibold">
                2. Menu Planning
              </h2>

              {/* ONLY FOR THIS SCREEN */}
              <div className="flex gap-2">
                <button
                  className="btn btn-light text-white bg-primary font-semibold hover:!bg-primary hover:!text-white hover:!border-primary"
                  onClick={() => setEditPax(true)}
                >
                  <i
                    className="ki-filled ki-user "
                    style={{ color: "white" }}
                  ></i>{" "}
                  Edit Person
                </button>
                <button
                  onClick={() => navigate(`/menu-allocation/${eventId}`)}
                  className="btn btn-light text-white bg-primary font-semibold hover:!bg-primary hover:!text-white hover:!border-primary"
                >
                  <i
                    className="ki-filled ki-menu "
                    style={{ color: "white" }}
                  ></i>{" "}
                  3. Menu Execution
                </button>

                <button
                  className="btn btn-light text-white bg-primary font-semibold hover:!bg-primary hover:!text-white hover:!border-primary"
                  onClick={() =>
                    navigate("/raw-material-allocation", {
                      state: {
                        eventId: eventId,
                        eventTypeId: eventData?.eventType?.id,
                      },
                    })
                  }
                >
                  <i
                    className="ki-filled ki-gift"
                    style={{ color: "white" }}
                  ></i>{" "}
                  4. Raw Material Distribution
                </button>

                <button
                  className="btn btn-light text-white bg-primary font-semibold hover:!bg-primary hover:!text-white hover:!border-primary "
                  onClick={() =>
                    navigate(`/labour-and-other-management/${eventId}`)
                  }
                >
                  <i
                    className="ki-filled ki-gift hover:!text-gray-400"
                    style={{ color: "white" }}
                  ></i>{" "}
                  5. Agency Distribution
                </button>
              </div>
            </div>
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
                      readOnly
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
                        {eventData?.venue.nameEnglish || ""}
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
                        {eventData?.eventStartDateTime?.split(" ")[0]}
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
                        {eventData?.eventEndDateTime?.split(" ")[0]}
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
                      Rate:
                    </span>
                    <input
                      type="text"
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-1">
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

            <div className="flex flex-wrap items-center  gap-2 p-2 border rounded bg-gray-200">
              <div className="flex gap-2">
                {/* CUSTOM BUTTON */}
                <button
                  className={`btn text-sm px-3 py-1 ${
                    packageAppliedForFunction[selectedFunction]
                      ? "bg-white text-primary border border-primary"
                      : "bg-primary text-white"
                  }`}
                  onClick={() => {
                    setPackageAppliedForFunction((prev) => ({
                      ...prev,
                      [selectedFunction]: false,
                    }));
                    setIsDirty(true); // ✅ enable Save
                  }}
                >
                  A La Carte
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
                  Menu Package
                </button>
                <button
                  className="btn bg-success text-white text-sm px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    setMenuReportEventId(eventId);
                    setIsSelectMenuReport(true);
                  }}
                  disabled={!hasSelectedItems || isDirty} // Add disabled condition
                >
                  Report
                </button>
              </div>

              {packageAppliedForFunction[selectedFunction] &&
                selectedPkgInfo && (
                  <div className="flex w-full  bg-blue-50 border border-blue-300 rounded-lg p-2 justify-between">
                    <p className="text-sm font-semibold text-primary">
                      Name: {selectedPkgInfo.packageName}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      Price: ₹{selectedPkgInfo.packagePrice}
                    </p>
                  </div>
                )}
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
                    onAdd={() => setIsCategoryModalOpen(true)}
                    addTooltip="Add menu category"
                  />
                </div>

                <div
                  className="p-3 overflow-auto no-scrollbar"
                  style={{ maxHeight: "calc(100vh - 200px)" }}
                >
                  <CategoryList
                    refreshKey={refreshList}
                    selectedCategoryId={selectedCategoryId}
                    onCategoryChange={handleCategoryChange}
                    searchTerm={categorySearchTerm}
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
                          onAdd={() => setIsItemModalOpen(true)}
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
                    refreshKey={refreshList}
                    category={selectedCategory}
                    categoryId={selectedCategoryId}
                    pageSize={100}
                    searchTerm={itemSearchTerm}
                    selectedIdsSet={getSelectedIdsForFunction(selectedFunction)}
                    onToggleSelect={onToggleSelectItem}
                    selectedFunctionId={selectedFunction}
                    packageItems={currentPackageItems}
                    selectedItemsData={selectedByFunction[selectedFunction]}
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
                onOpenItemNotes={openItemNotesModal}
                onOpenCategoryNotes={openCategoryNotesModal}
                onInstructionsChange={onInstructionsChange}
              />
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="bg-white">
          <div className="flex items-center justify-end px-2 py-3">
            {/* <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="btn bg-white border border-gray-300 text-gray-700 ml-2 px-6 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button> */}

            <button
              type="button"
              onClick={handleSaveOrUpdate}
              disabled={isSaving || !isDirty}
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
        setEventFunctionId={selectedFunction}
        setIsSelectMenuReport={setIsSelectMenuReport}
        onConfirm={() => {
          setIsMenuReport(true);
        }}
        disabled={!hasSelectedItems || isDirty}
      />

      <AddMenuItem
        isModalOpen={isItemModalOpen}
        setIsModalOpen={setIsItemModalOpen}
        refreshData={() => setRefreshList((prev) => !prev)}
      />
      <AddMenuCategory
        isModalOpen={isCategoryModalOpen}
        setIsModalOpen={setIsCategoryModalOpen}
        refreshData={() => setRefreshList((prev) => !prev)}
      />
      <MenuNotes
        isOpen={showNoteModal}
        onClose={() => {
          setShowNoteModal(false);
          setCurrentItemForNotes(null);
        }}
        itemId={currentItemForNotes}
        notes={itemNotes}
        onSave={handleNoteSave}
      />
      <CategoryNotes
        isOpen={showCategoryNoteModal}
        onClose={() => {
          setShowCategoryNoteModal(false);
          setCurrentCategoryForNotes(null);
        }}
        categoryId={currentCategoryForNotes}
        notes={categoryNotes}
        onSave={handleCategoryNoteSave}
      />

      <EditPaxModal
        isOpen={editPax}
        onClose={() => setEditPax(false)}
        eventData={eventData}
        onRefreshEvent={fetchEventData}
      />
    </Fragment>
  );
};

export default EventPlanningPage;
