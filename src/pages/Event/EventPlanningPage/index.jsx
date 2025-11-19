import { Fragment, useEffect, useState, useCallback } from "react";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { toAbsoluteUrl } from "@/utils";
import MenuItemGrid from "./components/MenuItemGrid";
import SelectedItems from "./components/SelectedItems";
import FunctionCard from "./components/FunctionCard";
import CategoryList from "./components/CategoryList";
import SearchInput from "./components/SearchInput";
import { Mic, Eye } from "lucide-react";
import Swal from "sweetalert2";
import { Tooltip } from "antd";
import {
  GetEventMasterById,
  Getmenuprep,
  AddMenuprep,
} from "@/services/apiServices";
import { useParams, useNavigate } from "react-router-dom";
import SelectMenureport from "../../../partials/modals/menu-report/SelectMenureport";
import MenuReport from "@/partials/modals/menu-report/MenuReport";
import CustomPackageModal from "@/partials/modals/customepackagemodal/CustomPackageModal";

const EventPlanningPage = () => {
  const { eventId } = useParams();
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
  const [selectedByFunction, setSelectedByFunction] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const userDataRaw = localStorage.getItem("userData");
  const userId = userDataRaw ? JSON.parse(userDataRaw).id : null;
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await GetEventMasterById(eventId);
        const eventDetails =
          response?.data?.data?.["Event Details"]?.[0] || null;
        console.log(eventDetails, "data");

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

  const loadSavedMenuPrep = useCallback(async () => {
    if (!selectedFunction) return;

    const userId = localStorage.getItem("userId");

    try {
      const resp = await Getmenuprep(selectedFunction, 0, 1, 200, userId);
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

      if (order.length > 0) setHasExistingData(true);
    } catch (err) {
      console.log("Menu Prep fetch failed", err);
    }
  }, [selectedFunction]);

  useEffect(() => {
    loadSavedMenuPrep();
  }, [selectedFunction]);

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
    setSelectedByFunction((prev) => ({
      ...prev,
      [functionId]: newState,
    }));
  }, []);

  const buildRequestPayload = () => {
    const bucket = selectedByFunction[selectedFunction];
    if (!bucket) return null;

    const categoriesPayload = bucket.categoriesOrder.map(
      (catName, catIndex) => {
        const items = bucket.categories[catName] || [];

        return {
          menuCategoryId: items[0]?.catId || 0, // 🟢 dynamic
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

    return {
      id: selectedByFunction._menuPrepId || 0,
      eventFunctionId: selectedFunction,
      pax: Number(personCount),
      defaultPrice: Number(defaultRate),
      price: Number(defaultRate),
      sortorder: 0,

      isPackage: false,
      packageId: 0,
      packageName: "",
      packagePrice: 0,

      selectedMenuPreparationItems: categoriesPayload,
    };
  };

  const handleSaveOrUpdate = async () => {
    try {
      setIsSaving(true);

      const payload = buildRequestPayload();
      if (!payload) {
        alert("Nothing to save");
        return;
      }

      console.log("Saving Menu Prep Payload:", payload);

      const userId = localStorage.getItem("userId");

      const resp = await AddMenuprep(payload);

      const newId = resp?.data?.data?.id || payload.id;

      // update stored id so next save becomes update
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

  const handleCancel = () => {
    navigate(-1);
  };

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

  return (
    <Fragment>
      <div className="flex flex-col min-h-screen w-full">
        <div className="flex-1 overflow-auto px-4 py-2 ">
          <div className="gap-2 pb-2 mb-3">
            <Breadcrumbs items={[{ title: "Menu Planning" }]} />
          </div>

          {/* Event header card */}
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
                        {eventData?.venue?.nameEnglish || ""}
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

          {/* Function cards and actions */}
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
                <button className="btn bg-primary text-white text-sm px-3 py-1">
                  Custom
                </button>
                <button
                  className="btn bg-white text-primary text-sm px-3 py-1"
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

          {/* Main grid: categories + items + selected items */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-2 border rounded overflow-y-auto no-scrollbar flex">
              <div className="min-h-[600px] w-[30%] border-r ">
                <div className="border-b p-3">
                  <SearchInput
                    placeholder="Search categories"
                    value={searchTerm}
                    onChange={(v) => setSearchTerm(v)}
                    onAdd={() => {}}
                    addTooltip="Add menu category"
                  />
                </div>
                <div
                  className="p-3 overflow-auto no-scrollbar"
                  style={{ maxHeight: "calc(100vh - 200px)" }}
                >
                  <CategoryList
                    selectedCategory={selectedCategory}
                    onCategoryChange={(cat) => setSelectedCategory(cat)}
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
                          value={searchTerm}
                          onChange={(v) => setSearchTerm(v)}
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
                    pageSize={100}
                    searchTerm={searchTerm}
                    selectedIdsSet={getSelectedIdsForFunction(selectedFunction)}
                    onToggleSelect={onToggleSelectItem}
                    selectedFunctionId={selectedFunction}
                  />
                </div>
              </div>
            </div>

            <div className="border rounded flex flex-col bg-gray-100">
              <div className="flex items-center justify-between border-b p-3 h-[69px]">
                <p className="font-semibold text-gray-700">Selected Items</p>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-gray-100"
                  aria-label="Toggle visibility"
                >
                  <Eye className="text-primary" />
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
              />
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="  bg-white ">
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
              className="btn bg-success text-white px-8 py-2 rounded-lg  disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>{hasExistingData ? "Update Menu" : "Save Menu"}</span>
                </>
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
      />
    </Fragment>
  );
};

export default EventPlanningPage;
