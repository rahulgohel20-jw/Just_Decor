import { useState, Fragment, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { menuCategories, menuCategoryChildren } from "./constant";
import { Eye, EyeOff, LogIn, Mic, PanelLeftOpen } from "lucide-react";
import TabComponent from "@/components/tab/TabComponent";
import useStyles from "./style";
import { Tooltip } from "antd";
import { GetAllCategory } from "@/services/apiServices";
const EventPreparationPage = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    FetchCategoryData();
  }, [searchQuery]);
  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;
  const FetchCategoryData = () => {
    GetAllCategory({ userid: Id, menuCategoryName: searchQuery })
      .then((res) => {
        const categories = res.data.data["Menu Category Details"].map(
          (item, index) => ({
            ...item,
            name: item.nameEnglish,
            sr_no: index + 1,
          })
        );
        setCategories(categories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  // Add "All" option to categories
  const allCategory = { id: null, name: "All" };
  const categoriesWithAll = [allCategory, ...categories];

  const filteredCategories = categoriesWithAll.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );
  // State for selected children (multi-select)
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [childSearch, setChildSearch] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [rate, setRate] = useState(0);
  // Filter children by selected category and child search
  const filteredChildren = menuCategoryChildren.filter(
    (child) =>
      (!selectedCategory || child.parentId === selectedCategory) &&
      child.name.toLowerCase().includes(childSearch.toLowerCase())
  );
  // Toggle child selection
  const toggleChildSelection = (id) => {
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };
  // Helper: Group selected items by category
  const selectedItems = selectedChildren
    .map((id) => menuCategoryChildren.find((c) => c.id === id))
    .filter(Boolean);
  const selectedItemsByCategory = selectedItems.reduce((acc, item) => {
    const category = categories.find((cat) => cat.id === item.parentId);
    const categoryName = category ? category.name : "Other";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(item);
    return acc;
  }, {});

  // State for notes and per-item price
  const [itemNotes, setItemNotes] = useState({});
  const [itemRates, setItemRates] = useState({});
  // Handler for note change
  const handleNoteChange = (id, note) => {
    setItemNotes((prev) => ({ ...prev, [id]: note }));
  };
  // Handler for per-item rate change
  const handleItemRateChange = (id, value) => {
    setItemRates((prev) => ({ ...prev, [id]: value }));
  };
  // Calculate total price (per item or fallback to global rate)
  const totalPrice = selectedItems.reduce(
    (sum, item) =>
      sum + (Number(itemRates[item.id]) || Number(rate) || 0) * 300,
    0
  );
  const orderDetails = {
    id: "1762",
    customer: "MR KAUSHAL BHAI KUKADIYA",
    eventType: "Wedding",
    eventDate: "06/02/2002",
    venue: "APEX PARTY PLOT",
  };

  const menuPreparationsTabs = [
    {
      label: (
        <>
          <i className="ki-filled ki-element-6"></i>
          Mandap
        </>
      ),
      value: "mandap",
      children: "",
    },
    {
      label: (
        <>
          <i className="ki-filled ki-disguise"></i>
          Lunch
        </>
      ),
      value: "lunch",
      children: "",
    },
    {
      label: (
        <>
          <i className="ki-filled ki-disk"></i>
          Dinner
        </>
      ),
      value: "dinner",
      children: "",
    },
  ];
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Menu Preparations" }]} />
        </div>
        <div className="border rounded mb-4">
          <div className="grid grid-cols-6 lg:grid-cols-12">
            {/* left */}
            <div className="col-span-9">
              <div className="border-b p-3 shrink-0 bg-muted/25">
                <div className="flex items-center justify-between">
                  <Tooltip
                    placement="right"
                    color="white"
                    overlayInnerStyle={{
                      padding: "12px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      minWidth: "220px",
                    }}
                    title={
                      <div className="text-gray-800 text-sm space-y-1">
                        <p className="font-semibold text-base mb-2">
                          Order Details
                        </p>
                        <p>
                          <span className="text-gray-700">ID:</span>
                          <span className="font-medium text-gray-900 ms-1">
                            {orderDetails.id}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-700">Customer:</span>
                          <span className="font-medium text-gray-900 ms-1">
                            {orderDetails.customer}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-700">Event Type:</span>
                          <span className="font-medium text-gray-900 ms-1">
                            {orderDetails.eventType}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-700">Event Date:</span>
                          <span className="font-medium text-gray-900 ms-1">
                            {orderDetails.eventDate}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-700">Venue:</span>
                          <span className="font-medium text-gray-900 ms-1">
                            {orderDetails.venue}
                          </span>
                        </p>
                      </div>
                    }
                  >
                    <span className="cursor-pointer text-sm font-semibold">
                      <span className="text-gray-900 uppercase">Order ID:</span>
                      <span className="text-primary ms-1">
                        {orderDetails.id}
                      </span>
                    </span>
                  </Tooltip>
                  <Tooltip title="Collapse">
                    <button
                      type="button"
                      title="Collapse"
                      className="sga__btn flex items-center justify-center rounded-full p-0"
                    >
                      <PanelLeftOpen
                        className="text-primary stroke-2"
                        style={{ width: "24px" }}
                      />
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div
                className={`pt-3 px-3 border-b shrink-0 ${classes.customStyle}`}
              >
                <TabComponent tabs={menuPreparationsTabs} />
                {/* {["mandap", "lunch", "dinner"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`col-span-2 px-12 py-3 font-semibold border-t-3 rounded-t-lg text-sm transition-all ${
                      activeTab === tab
                        ? "bg-white text-primary border-t-3 border-primary"
                        : "text-gray-500 hover:text-blue-600"
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))} */}
              </div>
              <div
                className={`grid grid-cols-1 lg:grid-cols-9 ${classes.customStyle}`}
              >
                <div className="col-span-3">
                  <div className="h-full lg:border-e lg:border-e-border">
                    <div className="border-b p-3 rounded-t-lg">
                      <div className="relative">
                        <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                        <input
                          type="text"
                          className="input pl-8"
                          placeholder="Search categories"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex-1 max-h-[520px] overflow-auto scrollable-y">
                      <div className="h-full">
                        {filteredCategories.length === 0 ? (
                          <div className="p-2 text-gray-400 text-xs text-center">
                            No categories found
                          </div>
                        ) : (
                          filteredCategories.map(({ name, id }) => (
                            <button
                              key={id}
                              onClick={() => setSelectedCategory(id)}
                              className={`w-full text-left py-3 px-4 border-b last:border-b-0 transition-colors font-semibold text-sm ${
                                selectedCategory === id
                                  ? "bg-blue-50 text-primary"
                                  : "hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              {name}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="h-full">
                    <div className="border-b p-3 bg-light flex items-center gap-3">
                      <div className="select__grp flex flex-col w-full">
                        <div className="sg__inner flex items-center gap-1 relative">
                          <div className="relative w-full">
                            <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                            <input
                              type="text"
                              className="input pl-8"
                              placeholder="Search items"
                              value={childSearch}
                              onChange={(e) => setChildSearch(e.target.value)}
                            />
                          </div>
                          <Tooltip title="Start speech to text">
                            <button
                              type="button"
                              onClick={() => handleAddClick("Manager")}
                              title="Add"
                              className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8"
                            >
                              <i className="ki-filled ki-plus"></i>
                            </button>
                          </Tooltip>
                          <Tooltip title="Add menu item">
                            <button
                              type="button"
                              onClick={() => handleAddClick("Manager")}
                              title="Add"
                              className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8"
                            >
                              <Mic size={18} />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-3 max-h-[520px] overflow-auto scrollable-y">
                      {filteredChildren.length === 0 ? (
                        <div className="p-2 text-gray-400 text-xs text-center">
                          No items found
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {filteredChildren.map(
                            ({ parentId, id, name, image }) => (
                              <div
                                key={id}
                                className={`flex flex-col items-start border rounded-lg cursor-pointer aspect-square transition-all relative transition ${
                                  selectedChildren.includes(id)
                                    ? "border-success bg-green-300/10 text-success"
                                    : "hover:bg-blue-500/10 hover:border-blue-500/15"
                                }`}
                                onClick={() => toggleChildSelection(id)}
                              >
                                <div className="w-full h-16 rounded overflow-hidden flex items-center justify-center">
                                  <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="w-full h-12 font-medium px-2 pt-2 pb-1 text-center text-xs flex items-center justify-center">
                                  {name}
                                </div>
                                {selectedChildren.includes(id) && (
                                  <span className="bg-success w-5 h-5 rounded-full shadow-lg shadow-green-500/50 absolute top-1 right-1 flex items-center justify-center">
                                    <i className="ki-filled ki-check text-sm text-light"></i>
                                    {/* &#10003; */}
                                  </span>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* right */}
            <div className="col-span-3">
              <div className="h-full lg:border-s lg:border-s-border shrink-0 bg-muted/25">
                <div className="border-b p-3 bg-muted/15 rounded-t-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-md font-medium text-gray-900">
                      Selected Items
                    </span>
                    <Tooltip title="Show price">
                      <button
                        className="text-primary hover:underline"
                        onClick={() => setShowDetails((prev) => !prev)}
                      >
                        {showDetails ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </Tooltip>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700 w-24">
                        Person:
                      </span>
                      <strong className="w-[15px] text-center text-sm font-medium text-gray-900">
                        <i className="ki-filled ki-user text-sm text-primary"></i>
                        {/* 300 */}
                      </strong>
                      <input
                        type="number"
                        min={1}
                        className="input input-sm w-20"
                      />
                    </p>
                    <p className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700 w-24">
                        Date &amp; Time:
                      </span>
                      <strong className="w-[15px] text-center text-sm font-medium text-gray-900">
                        <i className="ki-filled ki-calendar-tick text-sm text-primary"></i>
                        {/* 27/07/2025 11:00 AM */}
                      </strong>
                      <input type="text" className="input input-sm w-36" />
                    </p>
                    <p className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700 w-24">
                        Default Rate:
                      </span>
                      <strong className="w-[15px] text-center text-sm font-medium text-gray-900">
                        <span className="text-sm text-primary">&#8377;</span>
                      </strong>
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="input input-sm w-20"
                      />
                    </p>
                  </div>
                </div>
                <div className="flex-1 p-3 max-h-[516px] h-full overflow-auto scrollable-y bg-white">
                  {selectedChildren.length === 0 ? (
                    <div className="text-xs text-gray-400 p-2 text-center">
                      No items selected
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(selectedItemsByCategory).map(
                        ([categoryName, items]) => (
                          <div key={categoryName} className="mb-2">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-semibold text-xs text-gray-900">
                                {categoryName}
                              </span>
                              <Tooltip title="Expand">
                                <button className="p-0 w-6 h-6" title="Expand">
                                  <i className="ki-filled ki-down text-md"></i>
                                </button>
                              </Tooltip>
                            </div>
                            <ul className="bg-white rounded border shadow-sm">
                              {items.map((item) => (
                                <li
                                  key={item.id}
                                  className="flex flex-col border-b last:border-0 p-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className="w-8 h-8 rounded overflow-hidden"
                                        style={{ flex: "0 0 2rem" }}
                                      >
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </span>
                                      <span className="text-xs font-medium">
                                        {item.name}
                                      </span>
                                    </div>
                                    <Tooltip title="Remove">
                                      <button
                                        className="ml-2 text-gray-400 hover:text-red-500"
                                        title="Remove"
                                        onClick={() =>
                                          setSelectedChildren((prev) =>
                                            prev.filter(
                                              (cid) => cid !== item.id
                                            )
                                          )
                                        }
                                      >
                                        <i className="ki-filled ki-trash"></i>
                                      </button>
                                    </Tooltip>
                                  </div>
                                  {showDetails && (
                                    <div className="flex items-center justify-between mt-1 gap-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">
                                          Rate:
                                        </span>
                                        <input
                                          type="number"
                                          value={itemRates[item.id] || rate}
                                          onChange={(e) =>
                                            handleItemRateChange(
                                              item.id,
                                              e.target.value
                                            )
                                          }
                                          min={0}
                                          className="input input-sm w-20"
                                        />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">
                                          Price:
                                        </span>
                                        <span className="font-semibold text-xs">
                                          ₹{" "}
                                          {(Number(itemRates[item.id]) ||
                                            Number(rate) ||
                                            0) * 300}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  <textarea
                                    placeholder="Add note..."
                                    value={itemNotes[item.id] || ""}
                                    onChange={(e) =>
                                      handleNoteChange(item.id, e.target.value)
                                    }
                                    className="textarea textarea-sm w-full mt-1 resize-none"
                                    rows={1}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
                <div className="p-3 border-t flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs text-gray-700">
                      Total Items:
                    </span>
                    <span className="font-bold text-xs text-gray-900">
                      {selectedChildren.length}
                    </span>
                  </div>
                  {showDetails && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-xs text-gray-700">
                        Total:
                      </span>
                      <span className="font-bold text-xs text-gray-900">
                        &#8377; {totalPrice}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between gap-2">
          <button class="btn btn-light" title="Cancel">
            Cancel
          </button>
          <button class="btn btn-success" title="Save Menu">
            <i class="ki-filled ki-save-2"></i> Save Menu
          </button>
        </div>
      </Container>
    </Fragment>
  );
};
export default EventPreparationPage;
