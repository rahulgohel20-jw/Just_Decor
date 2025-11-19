import { Fragment, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import SidebarChefModal from "../../../components/sidebarchefmodal/SidebarChefModal";
import Swal from "sweetalert2";
import {
  Input,
  Checkbox,
  Select,
  Card,
  Badge,
  Tooltip,
  Spin,
  Form,
} from "antd";
import SidebarModal from "../../../components/SidebarModal/SidebarModal";
import CategorySidebarModal from "../CategorySidebar/CategorySidebarModal";
import WhatsappSidebarMenu from "../whatsappsidebar/WhatsappSidebarMenu";
import MenuReport from "@/partials/modals/menu-report/MenuReport";
import SelectMenureport from "../../../partials/modals/menu-report/SelectMenureport";

import {
  GetEventMasterById,
  GetMenuAllocation,
  SelectedItemNameMenuAllocation,
  MenuAllocationSave,
} from "@/services/apiServices";
import { useParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";

const TopTabs = ({ value, onChange, functions }) => {
  return (
    <div className="flex gap-3 overflow-x-auto">
      {functions.length > 0 ? (
        functions.map((item) => (
          <button
            key={item.id || item.function?.id}
            onClick={() => onChange(item)}
            className={
              "min-w-[96px] rounded-md px-5 py-2 text-sm font-medium transition whitespace-nowrap " +
              (value?.id === item.id
                ? "bg-primary text-white shadow"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50")
            }
          >
            {item.function?.nameEnglish || "Unnamed"}
          </button>
        ))
      ) : (
        <p className="text-gray-500 text-sm">
          <FormattedMessage
            id="COMMON.NO_FUNCTIONS"
            defaultMessage="No functions available"
          />
        </p>
      )}
    </div>
  );
};

const OrderSummary = ({ groups, onItemClick, loading, pax }) => {
  const grandTotal = Math.round(
    groups.reduce((total, group) => {
      const groupTotal = group.items.reduce((sum, item) => {
        return sum + (item.totalPrice || 0);
      }, 0);
      return total + groupTotal;
    }, 0)
  );

  const dishCosting = pax > 0 ? Math.round(grandTotal / pax) : 0;

  return (
    <div className="flex flex-col gap-2">
      <button className="btn btn-sm btn-primary p-6 flex justify-center text-lg">
        <FormattedMessage
          id="EVENT_MENU_ALLOCATION.SHOW_COUNTER"
          defaultMessage="Show Counter"
        />
      </button>
      <Card
        className="w-full border border-gray-200 shadow-sm"
        bodyStyle={{ padding: 0 }}
        title={
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              ✱
            </span>
            <span className="text-gray-800">
              <FormattedMessage
                id="EVENT_MENU_ALLOCATION.ORDER_SUMMARY"
                defaultMessage="Order Summary"
              />
            </span>
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Spin />
          </div>
        ) : groups.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <FormattedMessage
              id="EVENT_MENU_ALLOCATION.NO_ITEMS"
              defaultMessage="No items available"
            />
          </div>
        ) : (
          <>
            <div className="divide-y">
              {groups.map((g, gi) => (
                <div key={gi} className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge color="#22c55e" />
                    <span className="font-medium text-gray-900">
                      {g.categoryName}
                    </span>
                  </div>
                  <div className="mt-2 grid grid-cols-12 gap-y-2 text-sm text-gray-700 cursor-pointer">
                    {g.items.map((it, ii) => (
                      <Fragment key={ii}>
                        <div
                          className="col-span-9 pl-6 hover:text-primary"
                          onClick={() => onItemClick(it, g)}
                        >
                          {it.menuItemName} ({it.typeName})
                        </div>
                        <div className="col-span-3 text-right tabular-nums">
                          ₹{it.totalPrice?.toFixed(2) || "0.00"}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ UPDATED Footer with Real Calculations */}
            <div className="card flex flex-row justify-between p-4 bg-[#FAFAFA]">
              <div className="flex flex-row gap-1">
                <span className="font-medium text-gray-900">
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.DISH_COSTING"
                    defaultMessage="Dish Costing :"
                  />
                </span>
                <span className="font-semibold text-gray-900">
                  ₹{dishCosting.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-row gap-1">
                <span className="font-medium text-gray-900">
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.TOTAL"
                    defaultMessage="Total :"
                  />
                </span>
                <span className="font-semibold text-primary">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

const TableHeader = () => (
  <div className="grid grid-cols-12 items-center gap-5 border-b border-gray-200 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
    <div className="col-span-2">
      {" "}
      <FormattedMessage id="COMMON.NAME" defaultMessage="Name" />
    </div>
    <div className="col-span-2 text-center">
      {" "}
      <FormattedMessage id="COMMON.CHEF_LABOUR" defaultMessage="Chef Labour" />
    </div>
    <div className="col-span-1 text-center">
      {" "}
      <FormattedMessage id="COMMON.OUTSIDE" defaultMessage="Outside" />
    </div>
    <div className="col-span-2 text-center">
      {" "}
      <FormattedMessage id="COMMON.INSIDE" defaultMessage="Inside" />
    </div>
    <div className="col-span-1 text-center">
      {" "}
      <FormattedMessage id="COMMON.PERSON" defaultMessage="Person" />
    </div>
    <div className="col-span-2 text-center">
      {" "}
      <FormattedMessage id="COMMON.PLACE" defaultMessage="Place" />
    </div>
    <div className="col-span-2">
      <FormattedMessage
        id="COMMON.INSTRUCTIONS"
        defaultMessage="Instructions"
      />
    </div>
  </div>
);

const TableRow = ({ row, onChange }) => {
  const handleCheckboxChange = (type, checked) => {
    const updated = {
      ...row,
      chefLabour: type === "chef" ? checked : false,
      outside: type === "outside" ? checked : false,
      inside: type === "inside" ? checked : false,
    };

    onChange(updated);

    if (checked) {
      if (type === "outside" && row.openSidebar) {
        row.openSidebar();
      }
      if (type === "chef" && row.openChefSidebar) {
        row.openChefSidebar();
      }
    }
  };

  return (
    <div className="grid grid-cols-12 items-center gap-6 border-b border-gray-100 px-4 py-4 text-sm">
      <div className="col-span-2 font-medium text-gray-800">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">{row.categoryName}</span>
          <span>{row.itemName}</span>
        </div>
      </div>

      <div className="col-span-2 flex justify-center items-center gap-2">
        <Checkbox
          checked={row.chefLabour}
          onChange={(e) => handleCheckboxChange("chef", e.target.checked)}
        />
        {row.chefLabour && (
          <button
            type="button"
            onClick={() => row.openChefSidebar && row.openChefSidebar()}
            className="text-blue-500 hover:text-blue-700"
            title="Edit Chef Labour Details"
          >
            <i className="ki-filled ki-notepad-edit text-primary"></i>
          </button>
        )}
      </div>

      <div className="col-span-1 flex justify-center items-center gap-2">
        <Checkbox
          checked={row.outside}
          onChange={(e) => handleCheckboxChange("outside", e.target.checked)}
        />
        {row.outside && (
          <button
            type="button"
            onClick={() => row.openSidebar && row.openSidebar()}
            className="text-blue-500 hover:text-blue-700"
            title="Edit Outside Details"
          >
            <i className="ki-filled ki-notepad-edit text-primary"></i>
          </button>
        )}
      </div>

      <div className="col-span-2 flex justify-center">
        <Checkbox
          checked={row.inside}
          onChange={(e) => handleCheckboxChange("inside", e.target.checked)}
        />
      </div>

      <div className="col-span-1 flex justify-center">
        <Input
          min={0}
          value={row.personCount}
          onChange={(val) =>
            onChange({ ...row, personCount: Number(val || 0) })
          }
          className="w-30 p-1"
        />
      </div>

      <div className="col-span-2">
        <Select
          size="small"
          value={row.place}
          onChange={(val) => onChange({ ...row, place: val })}
          className="w-full"
          options={[
            { value: "venue", label: "At venue" },
            { value: "godown", label: "GoDown" },
          ]}
        />
      </div>

      <div className="col-span-2">
        <Input
          size="small"
          placeholder=""
          value={row.instructions}
          onChange={(e) => onChange({ ...row, instructions: e.target.value })}
          className="p-1"
        />
      </div>
    </div>
  );
};

const EventMenuAllocationPage = () => {
  const { eventId } = useParams();
  const [activeFunction, setActiveFunction] = useState(null);
  const [rows, setRows] = useState([]);
  const [orderSummaryGroups, setOrderSummaryGroups] = useState([]);
  const [percentage, setPercentage] = useState("");
  const [open, setOpen] = useState(false);
  const [isChefModal, setIsChefModal] = useState(false);
  const [isCategoryModal, setIsCategoryModal] = useState(false);
  const [iswhatsAppSidebar, setIsWhatsAppSidebar] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [allocationData, setAllocationData] = useState({});
  const [menuReportEventId, setMenuReportEventId] = useState(null);
  const [isMenuReport, setIsMenuReport] = useState(false);
  const [isSelectMenureport, setIsSelectMenuReport] = useState(false);

  const intl = useIntl();

  useEffect(() => {
    const FetchEventDetails = async () => {
      try {
        setLoading(true);
        const res = await GetEventMasterById(eventId);

        if (res?.data?.data && res.data.data["Event Details"]?.length > 0) {
          const event = res.data.data["Event Details"][0];
          setEventData(event);
          if (event.eventFunctions && event.eventFunctions.length > 0) {
            const firstFunction = event.eventFunctions[0];
            setActiveFunction(firstFunction);
            fetchMenuAllocation(firstFunction.id);
          }
        } else {
          console.warn("No event data found.");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      FetchEventDetails();
    }
  }, [eventId]);

  const handleOrderSummaryItemClick = async (item, group) => {
    try {
      setIsCategoryModal(true);
      setMenuLoading(true);
      const eventFunctionId = activeFunction?.id;
      const isFromNewTable = item.isFromNewTable || false;
      const menuItemId = item.menuItemId || item.id;

      console.log("🔍 Fetching raw materials for menuItemId:", menuItemId);

      const res = await SelectedItemNameMenuAllocation(
        eventFunctionId,
        isFromNewTable,
        menuItemId
      );

      console.log("🔍 API Response:", res?.data);

      if (res?.data?.success) {
        const apiData = res.data.data;
        console.log("🔍 Selected Row Data:", apiData);

        // ✅ FIX: The API returns "MenuItem RawMaterial Details" (with spaces), not "menuItemRawMaterials"
        const rawMaterials =
          apiData["MenuItem RawMaterial Details"] ||
          apiData.menuItemRawMaterials ||
          [];

        console.log("🔍 Raw Materials from API:", rawMaterials);

        setSelectedRow({
          ...apiData,
          menuItemRawMaterials: rawMaterials, // Normalize the key
        });

        if (rawMaterials && rawMaterials.length > 0) {
          // Store in allocationData
          const allocationKey = `${menuItemId}-category`;
          console.log("🔍 Storing in allocationData with key:", allocationKey);

          setAllocationData((prev) => {
            const updated = {
              ...prev,
              [allocationKey]: {
                menuItemId: menuItemId,
                rawMaterials: rawMaterials,
              },
            };
            console.log("🔍 Updated allocationData:", updated);
            return updated;
          });

          // Update rows
          setRows((prevRows) => {
            const updatedRows = prevRows.map((r) => {
              if (r.menuItemId === menuItemId) {
                console.log("🔍 Updating row with menuItemId:", menuItemId);
                console.log("🔍 Adding raw materials:", rawMaterials);
                return {
                  ...r,
                  menuItemRawMaterials: rawMaterials,
                };
              }
              return r;
            });
            console.log("🔍 Updated rows:", updatedRows);
            return updatedRows;
          });
        } else {
          console.warn("⚠️ No raw materials found in API response");
        }
      } else {
        console.warn("⚠️ API call unsuccessful or no data returned");
      }
    } catch (error) {
      console.error("❌ Error fetching SelectedItemNameMenuAllocation:", error);
    } finally {
      setMenuLoading(false);
    }
  };

  const fetchMenuAllocation = async (eventFunctionId) => {
    try {
      setMenuLoading(true);
      const menudata = await GetMenuAllocation(eventId, eventFunctionId);

      if (
        menudata?.data?.success &&
        menudata.data.data["Menu Allocation Details"]?.length > 0
      ) {
        const menuDetails = menudata.data.data["Menu Allocation Details"][0];

        const transformedRows =
          menuDetails.menuAllocation?.map((item) => ({
            key: `${item.menuItemId}-${item.menuCategoryId}`,
            id: item.id,
            categoryName: item.menuCategoryName || "",
            itemName: item.menuItemName || "",
            chefLabour: item.chefLabour || false,
            inside: item.inside || false,
            outside: item.outside || false,
            personCount: item.personCount || 0,
            place: item.place || "venue",
            instructions: item.instructions || "",
            eventId: item.eventId,
            eventFunctionId: item.eventFunctionId,
            menuCategoryId: item.menuCategoryId,
            menuItemId: item.menuItemId,
            eventFunctionMenuAllocations:
              item.eventFunctionMenuAllocations || [],
            menuItemRawMaterials: [],
          })) || [];

        setRows(transformedRows);

        const summaryGroups =
          menuDetails.selectedItemDetails?.map((category) => ({
            categoryId: category.menuCategoryId,
            categoryName: category.menuCategoryName,
            items:
              category.selectedMenuPreparationItems?.map((summaryItem) => ({
                ...summaryItem,
                originalTotalPrice: summaryItem.totalPrice,
                totalPrice: summaryItem.totalPrice,
              })) || [],
          })) || [];

        setOrderSummaryGroups(summaryGroups);

        // ✅ Create a map of menuItemId to isFromNewTable from summary items
        const allSummaryItems = summaryGroups.flatMap((group) => group.items);
        const itemFlagMap = new Map();
        allSummaryItems.forEach((item) => {
          itemFlagMap.set(item.menuItemId, item.isFromNewTable || false);
        });

        // ✅ Fetch raw materials with correct isFromNewTable flag for each item
        const updatedRowsPromises = transformedRows.map(async (row) => {
          try {
            // Get the correct isFromNewTable flag for this specific menu item
            const isFromNewTable = itemFlagMap.get(row.menuItemId) || false;

            console.log(
              `🔍 Fetching raw materials for menuItemId: ${row.menuItemId}, isFromNewTable: ${isFromNewTable}`
            );

            const res = await SelectedItemNameMenuAllocation(
              eventFunctionId,
              isFromNewTable,
              row.menuItemId
            );

            if (res?.data?.success) {
              const apiData = res.data.data;

              // Extract raw materials with correct key
              const rawMaterials =
                apiData["MenuItem RawMaterial Details"] ||
                apiData.menuItemRawMaterials ||
                [];

              console.log(
                `✅ Fetched ${rawMaterials.length} raw materials for menuItemId: ${row.menuItemId}`
              );

              return {
                ...row,
                menuItemRawMaterials: rawMaterials,
              };
            }
          } catch (error) {
            console.error(
              `❌ Error fetching raw materials for item ${row.menuItemId}:`,
              error
            );
          }
          return row;
        });

        // Wait for all raw material fetches to complete
        const updatedRows = await Promise.all(updatedRowsPromises);
        console.log("🔍 All raw materials fetched, updating rows...");

        setRows(updatedRows);

        setTimeout(() => {
          summaryGroups.forEach((group) => {
            group.items.forEach((item) => {
              updateOrderSummaryPrices(item.menuItemId, updatedRows);
            });
          });
        }, 0);
      } else {
        setRows([]);
        setOrderSummaryGroups([]);
      }
    } catch (error) {
      console.error("Error fetching menu allocation:", error);
      setRows([]);
      setOrderSummaryGroups([]);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleFunctionChange = (functionItem) => {
    setActiveFunction(functionItem);
    fetchMenuAllocation(functionItem.id);
  };
  const updateRow = (updated) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((x) =>
        x.key === updated.key ? updated : x
      );

      updateOrderSummaryPrices(updated.menuItemId, updatedRows);

      return updatedRows;
    });
  };

  const handleAdjustPerson = () => {
    const adjustment = Number(percentage);
    if (isNaN(adjustment) || adjustment === 0) return;

    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        personCount: Math.max(0, (row.personCount || 0) + adjustment),
      }))
    );

    setPercentage("");
  };

  const filtered = useMemo(
    () =>
      rows.map((r) => ({
        ...r,
        openSidebar: () => {
          setIsChefModal(false);
          setSelectedRow({
            ...r,
            eventId,
            eventFunctionId: activeFunction?.id || null,
          });
          setOpen(true);
        },
        openChefSidebar: () => {
          setOpen(false);
          setIsChefModal(true);
          setSelectedRow({
            ...r,
            eventId,
            eventFunctionId: activeFunction?.id || null,
          });
        },
      })),
    [rows, eventId, activeFunction]
  );

  const updateOrderSummaryPrices = (menuItemId, currentRows = rows) => {
    setOrderSummaryGroups((prevGroups) =>
      prevGroups.map((group) => ({
        ...group,
        items: group.items.map((item) => {
          if (item.menuItemId === menuItemId) {
            const matchingRow = currentRows.find(
              (row) => row.menuItemId === menuItemId
            );

            if (matchingRow) {
              if (matchingRow.inside) {
                return {
                  ...item,
                  totalPrice: 0,
                };
              }

              const basePrice = item.originalTotalPrice || 0;
              let additionalCost = 0;

              if (matchingRow.outside) {
                const outsideTotal =
                  matchingRow.eventFunctionMenuAllocations
                    ?.filter((a) => a.isOutside)
                    .reduce(
                      (sum, allocation) => sum + (allocation.totalPrice || 0),
                      0
                    ) || 0;
                additionalCost += outsideTotal;
              }

              if (matchingRow.chefLabour) {
                const chefLabourTotal =
                  matchingRow.eventFunctionMenuAllocations
                    ?.filter((a) => a.isChefLabour)
                    .reduce(
                      (sum, allocation) => sum + (allocation.totalPrice || 0),
                      0
                    ) || 0;
                additionalCost += chefLabourTotal;
              }

              const finalPrice = basePrice + additionalCost;

              return {
                ...item,
                totalPrice: finalPrice,
              };
            }
          }
          return item;
        }),
      }))
    );
  };

  const handleOutsideSave = (saveData) => {
    setAllocationData((prev) => ({
      ...prev,
      [`${saveData.menuItemId}-${saveData.menuCategoryId}-outside`]: saveData,
    }));

    setRows((prevRows) => {
      const updatedRows = prevRows.map((r) => {
        if (
          r.menuItemId === saveData.menuItemId &&
          r.menuCategoryId === saveData.menuCategoryId
        ) {
          return {
            ...r,
            eventFunctionMenuAllocations: [
              ...(r.eventFunctionMenuAllocations || []).filter(
                (a) => !a.isOutside
              ),
              ...saveData.allocations.map((alloc) => ({
                ...alloc,
                isOutside: true,
              })),
            ],
          };
        }
        return r;
      });

      updateOrderSummaryPrices(saveData.menuItemId, updatedRows);

      return updatedRows;
    });

    setOpen(false);
  };

  const handleChefLabourSave = (saveData) => {
    setAllocationData((prev) => ({
      ...prev,
      [`${saveData.menuItemId}-${saveData.menuCategoryId}-chef`]: saveData,
    }));

    setRows((prevRows) => {
      const updatedRows = prevRows.map((r) => {
        if (
          r.menuItemId === saveData.menuItemId &&
          r.menuCategoryId === saveData.menuCategoryId
        ) {
          return {
            ...r,
            eventFunctionMenuAllocations: [
              ...(r.eventFunctionMenuAllocations || []).filter(
                (a) => !a.isChefLabour
              ),
              ...saveData.allocations.map((alloc) => ({
                ...alloc,
                isChefLabour: true,
              })),
            ],
          };
        }
        return r;
      });

      updateOrderSummaryPrices(saveData.menuItemId, updatedRows);

      return updatedRows;
    });

    setIsChefModal(false);
  };

  const handleCategorySave = (saveData) => {
    setAllocationData((prev) => ({
      ...prev,
      [`${saveData.menuItemId}-category`]: saveData,
    }));

    // Also update the rows to store raw materials
    setRows((prevRows) =>
      prevRows.map((r) => {
        if (r.menuItemId === saveData.menuItemId) {
          return {
            ...r,
            menuItemRawMaterials: saveData.rawMaterials || [],
          };
        }
        return r;
      })
    );
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      </Container>
    );
  }
  const handleMainSave = async () => {
    try {
      let userData = JSON.parse(localStorage.getItem("userData"));
      let Id = userData.id;

      const payload = rows.map((r) => {
        const outsideAllocations =
          r.eventFunctionMenuAllocations
            ?.filter((a) => a.isOutside)
            .map((alloc) => ({
              counterPrice: alloc.counterPrice || 0,
              counterQuantity: alloc.counterQuantity || 0,
              helperPrice: alloc.helperPrice || 0,
              helperQuantity: alloc.helperQuantity || 0,
              id: alloc.id || 0,
              isOutside: true,
              partyId: alloc.partyId || 0,
              price: alloc.price || 0,
              quantity: alloc.quantity || 0,
              serviceType: alloc.serviceType || "",
              totalPrice: alloc.totalPrice || 0,
              unitId: alloc.unitId || 0,
            })) || [];

        const chefLabourAllocations =
          r.eventFunctionMenuAllocations
            ?.filter((a) => a.isChefLabour)
            .map((alloc) => ({
              counterPrice: alloc.counterPrice || 0,
              counterQuantity: alloc.counterQuantity || 0,
              helperPrice: alloc.helperPrice || 0,
              helperQuantity: alloc.helperQuantity || 0,
              id: alloc.id || 0,
              isOutside: false,
              partyId: alloc.partyId || 0,
              price: alloc.price || 0,
              quantity: alloc.quantity || 0,
              serviceType: alloc.serviceType || "",
              totalPrice: alloc.totalPrice || 0,
              unitId: alloc.unitId || 0,
            })) || [];

        const menuAllocationOrders = [
          ...outsideAllocations,
          ...chefLabourAllocations,
        ];

        // Get raw materials from both sources
        const rawMaterialsFromAllocation =
          allocationData[`${r.menuItemId}-category`]?.rawMaterials || [];
        const rawMaterialsFromRow = r.menuItemRawMaterials || [];

        // Use allocation data if available, otherwise use row data
        const rawMaterialsSource =
          rawMaterialsFromAllocation.length > 0
            ? rawMaterialsFromAllocation
            : rawMaterialsFromRow;

        console.log(
          "🔍🔍🔍 Raw materials source before mapping:",
          rawMaterialsSource
        );

        // ✅ Map to API format
        const menuItemRawMaterials = rawMaterialsSource.map((rm) => {
          console.log("🔍 Mapping individual raw material:", rm);

          const mapped = {
            dateTime: rm.dateTime || "",
            eventFunctionId: rm.eventFunctionId || activeFunction?.id || 0,
            eventId: rm.eventId || Number(eventId) || 0,
            id: rm.id !== undefined ? rm.id : 0,
            menuItemId: rm.menuItemId || r.menuItemId || 0,
            partyId: rm.partyId !== undefined ? rm.partyId : 0,
            place: rm.place || "",
            rate: rm.rate || 0,
            rawMaterialId: rm.rawMaterialId || 0,
            rawmaterial_rate: rm.rawmaterial_rate || 0,
            rawmaterial_weight: rm.rawmaterial_weight || 0,
            unitId: rm.unitId || 0,
            weight: rm.weight || 0,
          };

          console.log("🔍 Mapped result:", mapped);
          return mapped;
        });

        console.log("🔍🔍🔍 Final menuItemRawMaterials:", menuItemRawMaterials);

        return {
          chefLabour: r.chefLabour || false,
          eventFunctionId: activeFunction?.id || 0,
          eventId: Number(eventId) || 0,
          id: r.id || 0,
          inside: r.inside || false,
          instructions: r.instructions || "",
          menuAllocationOrders,
          menuCategoryId: r.menuCategoryId || 0,
          menuItemId: r.menuItemId || 0,
          menuItemRawMaterials,
          outside: r.outside || false,
          personCount: r.personCount || 0,
          place: r.place || "venue",
          userId: Id,
        };
      });

      console.log("Final payload:", JSON.stringify(payload, null, 2));

      const res = await MenuAllocationSave(payload);
      if (res?.data?.success) {
        Swal.fire({
          title: "Saved Successfully!",
          text: "Menu Allocation details have been saved.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });

        // ✅ Optional: Refresh data after save
        await fetchMenuAllocation(activeFunction?.id);
      }
    } catch (error) {
      console.error("Error saving menu allocation:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to save menu allocation details.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
  };
  const openMenuReport = (eventId) => {
    setMenuReportEventId(eventId);
    setIsMenuReport(true);
  };
  function openSelectMenureport() {
    setMenuReportEventId(eventId);
    setIsSelectMenuReport(true);
  }

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.MENU_ALLOCATION"
                    defaultMessage="Menu Allocation"
                  />
                ),
              },
            ]}
          />
        </div>

        {/* Event Details */}
        <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            <div className="flex items-center gap-3">
              <i className="ki-filled ki-calendar-tick text-success"></i>
              <div className="flex flex-col">
                <span className="text-xs">
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.EVENT_ID"
                    defaultMessage="Event ID:"
                  />
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.eventNo || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="ki-filled ki-user text-success"></i>
              <div className="flex flex-col">
                <span className="text-xs">
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.PARTY_NAME"
                    defaultMessage="Party Name:"
                  />
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.party?.nameEnglish || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="ki-filled ki-geolocation-home text-success"></i>
              <div className="flex flex-col">
                <span className="text-xs">
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.EVENT_NAME"
                    defaultMessage="Event Name:"
                  />
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.eventType?.nameEnglish || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="ki-filled ki-calendar-tick text-success"></i>
              <div className="flex flex-col">
                <span className="text-xs">
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.EVENT_VENUE"
                    defaultMessage="Event Venue:"
                  />
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.venue?.nameEnglish || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="ki-filled ki-calendar-tick text-success"></i>
              <div className="flex flex-col">
                <span className="text-xs">
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.EVENT_DATE_TIME"
                    defaultMessage="Event Date & Time:"
                  />
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.eventStartDateTime || ""}
                </span>
              </div>
            </div>

            <div className="flex flex-row items-end gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#20c964] text-white shadow hover:brightness-95"
                title="Share on WhatsApp"
                onClick={() => setIsWhatsAppSidebar(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current"
                >
                  <path d="M20.52 3.48A11.92 11.92 0 0 0 12.04 0C5.44.03.16 5.32.16 11.93c0 2.1.55 4.14 1.6 5.95L0 24l6.29-1.73a11.9 11.9 0 0 0 5.75 1.48h.01c6.59 0 11.86-5.28 11.89-11.88a11.87 11.87 0 0 0-3.42-8.39ZM12.05 21.2h-.01a9.27 9.27 0 0 1-4.73-1.29l-.34-.2-3.73 1.03 1-3.64-.22-.37A9.25 9.25 0 0 1 2.78 11.9c0-5.11 4.16-9.28 9.29-9.3 2.48 0 4.81.97 6.56 2.72a9.26 9.26 0 0 1 2.72 6.56c-.02 5.12-4.18 9.3-9.3 9.31Zm5.32-6.93c-.29-.15-1.7-.84-1.96-.94-.26-.09-.45-.15-.65.15-.2.29-.74.94-.91 1.13-.17.19-.34.21-.63.08-.29-.14-1.2-.44-2.29-1.41-.85-.76-1.43-1.7-1.6-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.09-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.24-.58-.48-.5-.65-.5l-.56-.01c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.14.19 2 3.06 4.85 4.29.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.11.55-.08 1.7-.7 1.94-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34Z" />
                </svg>
              </button>

              <button
                className="btn btn-sm btn-primary"
                title="Save"
                onClick={handleMainSave}
              >
                <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
              </button>
              <button
                className="btn btn-sm btn-primary"
                title="Sync Raw Material"
              >
                <FormattedMessage
                  id="EVENT_MENU_ALLOCATION.SYNC_RAW_MATERIAL"
                  defaultMessage="Sync Raw Material"
                />
              </button>
              <button className="btn btn-sm btn-primary" title="Sync Agency">
                <FormattedMessage
                  id="EVENT_MENU_ALLOCATION.SYNC_AGENCY"
                  defaultMessage="Sync Agency"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <div className="w-[70%] flex flex-col gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-[#FAFAFA] p-3 rounded-lg overflow-x-auto">
              <TopTabs
                value={activeFunction}
                onChange={handleFunctionChange}
                functions={eventData?.eventFunctions || []}
              />
            </div>

            <div className="flex flex-row gap-4">
              <div className="flex flex-row gap-4 items-end">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">
                    <FormattedMessage
                      id="EVENT_MENU_ALLOCATION.DATE_TIME"
                      defaultMessage="Date & Time"
                    />
                  </span>
                  <Input
                    className="p-1 w-[200px] text-black"
                    type="text"
                    readOnly
                    value={activeFunction?.functionStartDateTime || "-"}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600">
                    <FormattedMessage
                      id="COMMON.PERSON"
                      defaultMessage="Person"
                    />
                  </span>
                  <Input
                    className="p-1 w-[70px] text-black text-center"
                    type="text"
                    readOnly
                    value={activeFunction?.pax || 0}
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4 items-end">
                <Input
                  placeholder={intl.formatMessage({
                    id: "EVENT_MENU_ALLOCATION.ENTER_PERSON",
                    defaultMessage: "Enter Person",
                  })}
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="p-1 pl-2 w-28"
                />
                <Tooltip title="It will increase or decrease the number of persons by the entered number.">
                  <button
                    className="btn btn-sm btn-primary"
                    title="Adjust Person"
                    onClick={handleAdjustPerson}
                  >
                    <FormattedMessage
                      id="EVENT_MENU_ALLOCATION.ADJUST_PERSON"
                      defaultMessage="Adjust Person"
                    />
                  </button>
                </Tooltip>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex">
                <div className="flex w-fit items-center gap-3">
                  <div className="filItems relative">
                    <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                    <input
                      className="input pl-8"
                      placeholder={intl.formatMessage({
                        id: "EVENT_MENU_ALLOCATION.SEARCH_ITEM",
                        defaultMessage: "Search item",
                      })}
                      type="text"
                    />
                  </div>
                </div>
                <div className="flex w-full items-center justify-start gap-5 md:justify-end">
                  <button
                    onClick={openSelectMenureport}
                    className="bg-[#05B723] text-white text-sm px-3 py-2 rounded-md transition"
                    title="Report"
                  >
                    <FormattedMessage
                      id="EVENT_MENU_ALLOCATION.REPORT"
                      defaultMessage="Report"
                    />
                  </button>
                </div>
              </div>

              <div className="col-span-8 lg:col-span-8 xl:col-span-9">
                {menuLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Spin size="large" />
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <TableHeader />
                    {filtered.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <FormattedMessage
                          id="EVENT_MENU_ALLOCATION.NO_ITEMS_AVAILABLE"
                          defaultMessage="No menu items available."
                        />
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filtered.map((row) => (
                          <TableRow
                            key={row.key}
                            row={row}
                            onChange={updateRow}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-[30%] col-span-12 lg:col-span-4 xl:col-span-3 ">
            <OrderSummary
              groups={orderSummaryGroups}
              loading={menuLoading}
              onItemClick={handleOrderSummaryItemClick}
              pax={activeFunction?.pax || 0}
            />
          </div>
        </div>

        <SidebarModal
          open={open}
          onClose={() => setOpen(false)}
          eventId={selectedRow?.eventId}
          eventFunctionId={selectedRow?.eventFunctionId}
          row={selectedRow}
          functionName={activeFunction?.function?.nameEnglish}
          functionDateTime={activeFunction?.functionStartDateTime}
          onSave={handleOutsideSave}
        />

        <SidebarChefModal
          open={isChefModal}
          onClose={() => setIsChefModal(false)}
          eventId={selectedRow?.eventId}
          eventFunctionId={selectedRow?.eventFunctionId}
          row={selectedRow}
          functionName={activeFunction?.function?.nameEnglish}
          functionDateTime={activeFunction?.functionStartDateTime}
          onSave={handleChefLabourSave}
        />

        <CategorySidebarModal
          open={isCategoryModal}
          onClose={() => setIsCategoryModal(false)}
          selectedRowData={selectedRow}
          eventFunctionId={activeFunction?.id}
          eventId={eventId}
        />
        <WhatsappSidebarMenu
          open={iswhatsAppSidebar}
          onClose={() => setIsWhatsAppSidebar(false)}
        />
        <MenuReport
          isModalOpen={isMenuReport}
          setIsModalOpen={setIsMenuReport}
          eventId={menuReportEventId}
        />
        <SelectMenureport
          isSelectMenureport={isSelectMenureport}
          setIsSelectMenuReport={setIsSelectMenuReport}
          onConfirm={() => {
            setIsSelectMenuReport(false);
            setIsMenuReport(true);
          }}
        />
      </Container>
    </Fragment>
  );
};

export default EventMenuAllocationPage;
