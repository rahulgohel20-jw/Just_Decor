import { Fragment, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/container";
import SidebarChefModal from "../../../components/sidebarchefmodal/SidebarChefModal";
import Swal from "sweetalert2";
import { Input, Checkbox, Select, Card, Badge, Tooltip, Spin } from "antd";
import SidebarModal from "../../../components/SidebarModal/SidebarModal";
import CategorySidebarModal from "../CategorySidebar/CategorySidebarModal";
import SidebarInsideModal from "../../../components/SidebarInsidemodal/SidebarInsideModal ";
import WhatsappSidebarMenu from "../whatsappsidebar/WhatsappSidebarMenu";
import MenuReport from "@/partials/modals/menu-report/MenuReport";
import SelectMenureport from "../../../partials/modals/menu-report/SelectMenureport";
import SummaryItemModalchefoutside from "@/components/sidebarchefoutsidemodal/SummaryItemModalchefoutside";
import SummaryItemModalOutsideAgency from "@/components/sidebarOutSideAgency/SummaryItemModalOutSideAgency";
import SummaryItemModalInHousecook from "@/components/sidebarmodalinhousecook/SummaryItemModalInHousecook";
import {
  GetEventMasterById,
  GetMenuAllocation,
  SelectedItemNameMenuAllocation,
  MenuAllocationSave,
  SyncRawmaterialMenuallocation,
  MenuAllocationTypeSummary,
} from "@/services/apiServices";
import { useParams, useNavigate } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import AgencyAllocationSidebar from "../AgencyAllocationSidebar/AgenyAllocationSidebar";
const TopTabs = ({ value, onChange, functions }) => {
  console.log(functions);

  return (
    <div className="flex gap-3 overflow-x-auto">
      {functions.map((item) => {
        const dateTime = item?.functionStartDateTime || "";
        const parts = dateTime.split(" ");

        const date = parts[0]; // 26/12/2025
        const time = parts.length >= 3 ? `${parts[1]} ${parts[2]}` : "";

        return (
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
            <p className="font-semibold">
              {item.function?.nameEnglish || "Unnamed"}
            </p>

            <p
              className={
                value?.id === item.id
                  ? "bg-primary text-white shadow"
                  : "bg-white text-gray-700  hover:bg-gray-50"
              }
            >
              {date}
            </p>
            <p
              className={
                value?.id === item.id
                  ? "bg-primary text-white shadow"
                  : "bg-white text-gray-700  hover:bg-gray-50"
              }
            >
              {time}
            </p>
          </button>
        );
      })}
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
                      <Fragment key={`${g.categoryId}-${it.menuItemId}`}>
                        <div
                          className="col-span-9 pl-6 hover:text-primary"
                          onClick={() => onItemClick(it, g)}
                        >
                          {it.menuItemName}
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
  <div className="grid grid-cols-12 items-center gap-3 border-b border-gray-200 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">
    <div className="col-span-2">
      <FormattedMessage id="COMMON.NAME" defaultMessage="Name" />
    </div>
    <div className="col-span-1  text-center">
      <FormattedMessage id="COMMON.CHEF_LABOUR" defaultMessage="Chef Labour" />
    </div>
    <div className="col-span-2 text-center">
      <FormattedMessage id="COMMON.OUTSIDE" defaultMessage="Outsource" />
    </div>
    <div className="col-span-2 text-center">
      <FormattedMessage id="COMMON.INSIDE" defaultMessage="Inside kitchen" />
    </div>
    <div className="col-span-1 text-center">
      <FormattedMessage id="COMMON.PERSON" defaultMessage="Person" />
    </div>
    <div className="col-span-2 text-center">
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
  };

  return (
    <div className="grid grid-cols-12 items-center gap-3 border-b border-gray-100 px-4 py-4 text-sm">
      <div className="col-span-2 font-medium text-gray-800">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">{row.categoryName}</span>
          <span>{row.itemName}</span>
        </div>
      </div>

      <div className="col-span-1 flex justify-center items-center gap-2">
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

      <div className="col-span-2 flex justify-center items-center gap-2">
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

      <div className="col-span-2 flex justify-center items-center gap-2">
        <Checkbox
          checked={row.inside}
          onChange={(e) => handleCheckboxChange("inside", e.target.checked)}
        />
        {row.inside && (
          <button
            type="button"
            onClick={() => row.openInsideSidebar && row.openInsideSidebar()}
            className="text-blue-500 hover:text-blue-700"
            title="Edit Inside Details"
          >
            <i className="ki-filled ki-notepad-edit text-primary"></i>
          </button>
        )}
      </div>

      <div className="col-span-1 flex justify-center">
        <Input
          min={0}
          type="text"
          value={row.personCount}
          onChange={(e) =>
            onChange({ ...row, personCount: Number(e.target.value) || 0 })
          }
          className="w-16 p-1 text-center"
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
          placeholder="Add..."
          value={row.instructions}
          onChange={(e) => onChange({ ...row, instructions: e.target.value })}
          className="w-full p-1"
        />
      </div>
    </div>
  );
};

const EventMenuAllocationPage = () => {
  let { eventId } = useParams();
  const navigate = useNavigate();
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOutsideAgencyModalOpen, setIsOutsideAgencyModalOpen] =
    useState(false);
  const [isInHouseCookModalOpen, setIsInHouseCookModalOpen] = useState(false);
  const [isInsideModal, setIsInsideModal] = useState(false);
  const intl = useIntl();
  const [searchTerm, setSearchTerm] = useState("");
  const [chefsummary, setchefsummary] = useState([]);
  const [outsidesummary, setoutsidesummary] = useState([]);
  const [insidesummary, setinsidesummary] = useState([]);
  const [isAgencyAllocationModal, setIsAgencyAllocationModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialRows, setInitialRows] = useState([]);

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
      const eventFunctionId = activeFunction?.id || 1;
      const menuItemId = item.menuItemId || item.id;

      const matchingRow = rows.find((r) => r.menuItemId === menuItemId);

      if (matchingRow?.outside) {
        console.log(
          "Category sidebar blocked because Outside is selected",
          menuItemId
        );
        return;
      }

      setSelectedRow({
        "MenuItem RawMaterial Details": [],
        menuItemName: item.menuItemName || "-",
        menuItemId: menuItemId,
      });

      setIsCategoryModal(true);
      setMenuLoading(true);

      const res = await SelectedItemNameMenuAllocation(
        eventFunctionId,
        menuItemId
      );

      if (res?.data?.success) {
        const apiData = res.data.data;

        const rawMaterials =
          apiData["MenuItem RawMaterial Details"] ||
          apiData.menuItemRawMaterials ||
          [];

        setSelectedRow({
          ...apiData,
          "MenuItem RawMaterial Details": rawMaterials,
          menuItemName: item.menuItemName || apiData.menuItemName || "-",
          menuItemId: menuItemId,
        });
      }
    } catch (error) {
      console.error("Error opening category sidebar:", error);
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
              item.eventFunctionMenuAllocations?.map((alloc) => {
                const isChefLabour =
                  item.chefLabour && !item.outside && !item.inside;
                const isOutside = item.outside;
                const isInside = item.inside;

                let allocationTotal = 0;

                // 🔥 CHEF LABOUR TOTAL
                if (isChefLabour) {
                  allocationTotal =
                    (Number(alloc.counterPrice) || 0) *
                      (Number(alloc.counterQuantity) || 0) +
                    (Number(alloc.helperPrice) || 0) *
                      (Number(alloc.helperQuantity) || 0);
                } else {
                  // 🔹 OUTSIDE / NORMAL
                  allocationTotal =
                    (Number(alloc.price) || 0) * (Number(alloc.quantity) || 0);
                }

                return {
                  id: alloc.id || null,
                  partyId: alloc.partyId,
                  partyName: alloc.partyName,
                  menuAllocationId: item.id,
                  price: Number(alloc.price) || 0,
                  quantity: Number(alloc.quantity) || 0,
                  unitId: alloc.unitId ?? null,
                  unitName: alloc.unitName ?? null,
                  serviceType: alloc.serviceType || "",
                  counterQuantity: alloc.counterQuantity || 0,
                  helperQuantity: alloc.helperQuantity || 0,
                  counterPrice: alloc.counterPrice || 0,
                  helperPrice: alloc.helperPrice || 0,

                  // ✅ FIXED
                  totalPrice: allocationTotal,

                  isOutside,
                  isChefLabour,
                  isInside,

                  number: alloc.number ?? null,
                  remarks: alloc.remarks ?? null,
                  pax: alloc.pax ?? null,
                };
              }) || [],

            menuItemRawMaterials: [],
          })) || [];

        setRows(transformedRows);

        const summaryGroups =
          menuDetails.selectedItemDetails?.map((category) => ({
            categoryId: category.menuCategoryId,
            categoryName: category.menuCategoryName,
            items:
              category.selectedMenuPreparationItems?.map((summaryItem) => {
                const matchingRow = transformedRows.find(
                  (r) => r.menuItemId === summaryItem.menuItemId
                );

                const basePrice = Number(summaryItem.totalPrice) || 0;

                let finalPrice = basePrice;

                if (matchingRow) {
                  // INSIDE → base price only
                  if (matchingRow.inside) {
                    finalPrice = basePrice;
                  }

                  // OUTSIDE → only additional cost
                  else if (matchingRow.outside) {
                    finalPrice =
                      matchingRow.eventFunctionMenuAllocations
                        ?.filter((a) => a.isOutside)
                        .reduce((sum, a) => sum + (a.totalPrice || 0), 0) || 0;
                  }

                  // CHEF LABOUR → base + chef cost
                  else if (matchingRow.chefLabour) {
                    const chefCost =
                      matchingRow.eventFunctionMenuAllocations
                        ?.filter((a) => a.isChefLabour)
                        .reduce((sum, a) => sum + (a.totalPrice || 0), 0) || 0;

                    finalPrice = basePrice + chefCost;
                  }
                }
                console.log(
                  "FETCH CALC PRICE",
                  summaryItem.menuItemId,
                  finalPrice
                );

                return {
                  ...summaryItem,
                  originalTotalPrice: basePrice,
                  totalPrice: finalPrice,
                };
              }) || [],
          })) || [];

        setOrderSummaryGroups(summaryGroups);

        // Fetch raw materials...
        const updatedRowsPromises = transformedRows.map(async (row) => {
          try {
            const res = await SelectedItemNameMenuAllocation(
              eventFunctionId,
              row.menuItemId
            );

            if (res?.data?.success) {
              const apiData = res.data.data;
              const rawMaterials =
                apiData["MenuItem RawMaterial Details"] ||
                apiData.menuItemRawMaterials ||
                [];

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

        const updatedRows = await Promise.all(updatedRowsPromises);
        setRows(updatedRows);
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
  useEffect(() => {
    if (rows.length > 0 && initialRows.length === 0) {
      setInitialRows(JSON.parse(JSON.stringify(rows)));
      setHasUnsavedChanges(false);
    }
  }, [rows]);

  const checkForChanges = (currentRows, originalRows) => {
    if (currentRows.length !== originalRows.length) return true;

    return currentRows.some((row, index) => {
      const original = originalRows[index];
      if (!original) return true;

      // Check basic fields
      if (
        row.chefLabour !== original.chefLabour ||
        row.outside !== original.outside ||
        row.inside !== original.inside ||
        row.personCount !== original.personCount ||
        row.place !== original.place ||
        row.instructions !== original.instructions
      ) {
        return true;
      }

      // Check allocations
      const currentAllocations = row.eventFunctionMenuAllocations || [];
      const originalAllocations = original.eventFunctionMenuAllocations || [];

      if (currentAllocations.length !== originalAllocations.length) return true;

      return currentAllocations.some((alloc, i) => {
        const origAlloc = originalAllocations[i];
        if (!origAlloc) return true;

        return (
          alloc.partyId !== origAlloc.partyId ||
          alloc.price !== origAlloc.price ||
          alloc.quantity !== origAlloc.quantity ||
          alloc.counterQuantity !== origAlloc.counterQuantity ||
          alloc.helperQuantity !== origAlloc.helperQuantity ||
          alloc.counterPrice !== origAlloc.counterPrice ||
          alloc.helperPrice !== origAlloc.helperPrice
        );
      });
    });
  };

  // Update the updateRow function to detect changes
  const updateRow = (updated) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((x) =>
        x.key === updated.key ? updated : x
      );

      updateOrderSummaryPrices(updated.menuItemId, updatedRows);

      // Check if there are changes
      setHasUnsavedChanges(checkForChanges(updatedRows, initialRows));

      return updatedRows;
    });
  };
  const handleFunctionChange = (functionItem) => {
    setActiveFunction(functionItem);
    fetchMenuAllocation(functionItem.id);
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

  const filtered = useMemo(() => {
    const filteredRows = rows.filter((r) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        r.itemName.toLowerCase().includes(term) ||
        r.categoryName?.toLowerCase().includes(term)
      );
    });

    return filteredRows.map((r) => ({
      ...r,
      openSidebar: () => {
        setIsChefModal(false);
        setOpen(false);
        setIsInsideModal(false);
        setSelectedRow({ ...r, eventId, eventFunctionId: activeFunction?.id });
        setTimeout(() => setOpen(true), 0);
      },
      openChefSidebar: () => {
        setOpen(false);
        setIsChefModal(false);
        setIsInsideModal(false);
        setSelectedRow({ ...r, eventId, eventFunctionId: activeFunction?.id });
        setTimeout(() => setIsChefModal(true), 0);
      },
      openInsideSidebar: () => {
        setOpen(false);
        setIsChefModal(false);
        setIsInsideModal(false);
        setSelectedRow({ ...r, eventId, eventFunctionId: activeFunction?.id });
        setTimeout(() => setIsInsideModal(true), 0);
      },
    }));
  }, [rows, eventId, activeFunction, searchTerm]);

  const handleInsideSave = (saveData) => {
    setAllocationData((prev) => ({
      ...prev,
      [`${saveData.menuItemId}-${saveData.menuCategoryId}-inside`]: saveData,
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
                (a) => a.isChefLabour === true
              ),
              ...(r.eventFunctionMenuAllocations || []).filter(
                (a) => a.isOutside === true
              ),
              ...saveData.allocations.map((alloc) => ({
                ...alloc,
                isInside: true,
                isChefLabour: false,
                isOutside: false,
              })),
            ],
          };
        }
        return r;
      });

      updateOrderSummaryPrices(saveData.menuItemId, updatedRows);
      setHasUnsavedChanges(checkForChanges(updatedRows, initialRows));

      return updatedRows;
    });

    setIsInsideModal(false);
  };
  const updateOrderSummaryPrices = (menuItemId, currentRows = rows) => {
    setOrderSummaryGroups((prevGroups) =>
      prevGroups.map((group) => ({
        ...group,
        items: group.items.map((item) => {
          if (item.menuItemId !== menuItemId) return item;

          const matchingRow = currentRows.find(
            (row) => row.menuItemId === menuItemId
          );

          if (!matchingRow) return item;

          const basePrice = item.originalTotalPrice || 0;

          // INSIDE
          if (matchingRow.inside) {
            console.log("UPDATE → INSIDE", { menuItemId, basePrice });
            return { ...item, totalPrice: basePrice };
          }

          // OUTSIDE
          if (matchingRow.outside) {
            const additionalCost =
              matchingRow.eventFunctionMenuAllocations
                ?.filter((a) => a.isOutside)
                .reduce(
                  (sum, allocation) => sum + (allocation.totalPrice || 0),
                  0
                ) || 0;

            console.log("UPDATE → OUTSIDE", { menuItemId, additionalCost });

            return { ...item, totalPrice: additionalCost };
          }

          // CHEF
          if (matchingRow.chefLabour) {
            const chefLabourCost =
              matchingRow.eventFunctionMenuAllocations
                ?.filter((a) => a.isChefLabour)
                .reduce(
                  (sum, allocation) => sum + (allocation.totalPrice || 0),
                  0
                ) || 0;

            const finalPrice = basePrice + chefLabourCost;

            console.log("UPDATE → CHEF", {
              menuItemId,
              basePrice,
              chefLabourCost,
              finalPrice,
            });

            return { ...item, totalPrice: finalPrice };
          }

          console.log("UPDATE → DEFAULT", { menuItemId, basePrice });
          return { ...item, totalPrice: basePrice };
        }),
      }))
    );
  };

  // Update all save handler functions to set hasUnsavedChanges to true
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
                (a) => a.isChefLabour === true
              ),
              ...(r.eventFunctionMenuAllocations || []).filter(
                (a) => a.isInside === true
              ),
              ...saveData.allocations.map((alloc) => ({
                ...alloc,
                isOutside: true,
                isChefLabour: false,
                isInside: false,
              })),
            ],
          };
        }
        return r;
      });

      updateOrderSummaryPrices(saveData.menuItemId, updatedRows);
      setHasUnsavedChanges(checkForChanges(updatedRows, initialRows));

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
                (a) => a.isOutside === true
              ),
              ...(r.eventFunctionMenuAllocations || []).filter(
                (a) => a.isInside === true
              ),
              ...saveData.allocations.map((alloc) => ({
                ...alloc,
                isChefLabour: true,
                isOutside: false,
                isInside: false,
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
    setAllocationData((prev) => {
      const updated = {
        ...prev,
        [`${saveData.menuItemId}-category`]: {
          ...saveData,
          response: {
            isFromNewTable: saveData.isFromNewTable || false,
          },
        },
      };
      return updated;
    });

    setRows((prevRows) => {
      const updatedRows = prevRows.map((r) => {
        if (r.menuItemId === saveData.menuItemId) {
          return {
            ...r,
            menuItemRawMaterials: saveData.rawMaterials || [],
            isFromNewTable: saveData.isFromNewTable || false,
          };
        }
        return r;
      });

      setHasUnsavedChanges(checkForChanges(updatedRows, initialRows));
      return updatedRows;
    });

    setIsCategoryModal(false);
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
      let Id = localStorage.getItem("userId");

      const validEventId = Number(eventId);
      const validEventFunctionId = activeFunction?.id;

      if (!validEventId || !validEventFunctionId) {
        Swal.fire({
          title: "Error!",
          text: "Missing event or function information. Please refresh and try again.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        return;
      }

      // 🔵 SHOW LOADER BEFORE SAVE
      Swal.fire({
        title: "Saving...",
        text: "Please wait while menu allocation is being saved",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const payload = rows.map((r) => {
        const menuAllocationOrders = [];

        if (r.outside) {
          const outsideAllocations =
            r.eventFunctionMenuAllocations
              ?.filter((a) => a.isOutside)
              .map((alloc) => ({
                counterPrice: alloc.counterPrice ?? 0,
                counterQuantity: alloc.counterQuantity ?? 0,
                helperPrice: alloc.helperPrice ?? 0,
                helperQuantity: alloc.helperQuantity ?? 0,
                id: 0,
                isOutside: true,
                partyId: alloc.partyId ?? 0,
                price: alloc.price ?? 0,
                quantity: alloc.quantity ?? 0,
                serviceType: alloc.serviceType || "",
                totalPrice: alloc.totalPrice ?? 0,
                unitId: alloc.unitId ?? 0,
              })) || [];
          menuAllocationOrders.push(...outsideAllocations);
        }

        if (r.chefLabour) {
          const chefLabourAllocations =
            r.eventFunctionMenuAllocations
              ?.filter((a) => a.isChefLabour)
              .map((alloc) => ({
                counterPrice: alloc.counterPrice ?? 0,
                counterQuantity: alloc.counterQuantity ?? 0,
                helperPrice: alloc.helperPrice ?? 0,
                helperQuantity: alloc.helperQuantity ?? 0,
                id: 0,
                isOutside: false,
                partyId: alloc.partyId ?? 0,
                price: alloc.price ?? 0,
                quantity: alloc.quantity ?? 0,
                serviceType: alloc.serviceType || "",
                totalPrice: alloc.totalPrice ?? 0,
                unitId: alloc.unitId ?? 0,
              })) || [];
          menuAllocationOrders.push(...chefLabourAllocations);
        }

        if (r.inside) {
          const insideAllocations =
            r.eventFunctionMenuAllocations
              ?.filter((a) => a.isInside)
              .map((alloc) => ({
                counterPrice: alloc.counterPrice || 0,
                counterQuantity: alloc.counterQuantity || 0,
                helperPrice: alloc.helperPrice || 0,
                helperQuantity: alloc.helperQuantity || 0,
                id: 0,
                isOutside: false,
                number: alloc.number || "",
                remarks: alloc.remarks || "",
                partyId: alloc.partyId || 0,
                price: alloc.price || 0,
                quantity: alloc.quantity || 0,
                serviceType: alloc.serviceType || "",
                totalPrice: alloc.totalPrice || 0,
                unitId: alloc.unitId || 0,
              })) || [];
          menuAllocationOrders.push(...insideAllocations);
        }

        const rawMaterialsSource =
          allocationData[`${r.menuItemId}-category`]?.rawMaterials?.length > 0
            ? allocationData[`${r.menuItemId}-category`].rawMaterials
            : r.menuItemRawMaterials || [];

        const menuItemRawMaterials = rawMaterialsSource.map((rm) => ({
          dateTime: rm.dateTime || "",
          eventFunctionId: validEventFunctionId,
          eventId: validEventId,
          id: rm.id ?? 0,
          menuItemId: rm.menuItemId || r.menuItemId || 0,
          partyId: rm.partyId || rm.party_id || rm.party?.id || 0,
          place: rm.place || "",
          rate: rm.rate || 0,
          rawMaterialId: rm.rawMaterialId || 0,
          rawmaterial_rate: rm.rawmaterial_rate || 0,
          rawmaterial_weight: rm.rawmaterial_weight || 0,
          unitId: rm.unitId || rm.unit_id || rm.unit?.id || 0,
          weight: rm.weight || 0,
        }));

        return {
          chefLabour: r.chefLabour || false,
          eventFunctionId: validEventFunctionId,
          eventId: validEventId,
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
          userId: Number(Id) || 0,
        };
      });

      const res = await MenuAllocationSave(payload);

      // 🔵 CLOSE LOADER
      Swal.close();

      if (res?.data?.success === true) {
        Swal.fire({
          title: "Saved Successfully!",
          text: "Menu Allocation details have been saved.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });

        await fetchMenuAllocation(validEventFunctionId);
        setHasUnsavedChanges(false);
        setInitialRows(JSON.parse(JSON.stringify(rows)));
      } else {
        Swal.fire({
          title: "Save Failed!",
          text:
            res?.data?.msg ||
            res?.data?.message ||
            "Failed to save menu allocation details.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      Swal.close(); // 🔴 Ensure loader is closed on error
      console.error("❌ Error saving menu allocation:", error);

      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to save menu allocation details.",
        icon: "error",
        confirmButtonColor: "#d33",
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

  const openSummaryItemModalchefoutside = async () => {
    const res = await MenuAllocationTypeSummary(
      activeFunction?.id,
      eventId,
      "Chef"
    );
    console.log(res);
    setchefsummary(res.data.data["Menu Allocation Details"] || []);
    setIsModalOpen(true);
  };

  const openSummaryItemModalOustsideAgency = async () => {
    const res = await MenuAllocationTypeSummary(
      activeFunction?.id,
      eventId,
      "Outside"
    );
    console.log(res);
    setoutsidesummary(res.data.data["Menu Allocation Details"] || []);
    setIsOutsideAgencyModalOpen(true);
  };

  const openSummaryItemModalInHouseCook = async () => {
    const res = await MenuAllocationTypeSummary(
      activeFunction?.id,
      eventId,
      "Inside"
    );
    console.log(res);
    setinsidesummary(res?.data?.data["Menu Allocation Details"] || []);
    setIsInHouseCookModalOpen(true);
  };

  const handleSyncRawMaterial = async () => {
    try {
      const eventFunctionId = activeFunction?.id;

      if (!eventFunctionId) {
        Swal.fire({
          icon: "error",
          title: "Missing data",
          text: "Event or function information missing",
        });
        return;
      }

      // 🟡 CONFIRMATION MODAL
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to sync raw materials for this function?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Sync",
        cancelButtonText: "Cancel",
      });

      if (!confirm.isConfirmed) return;

      // 🔵 LOADER
      Swal.fire({
        title: "Syncing Raw Materials...",
        text: "Please wait",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await SyncRawmaterialMenuallocation(eventFunctionId);

      Swal.close(); // close loader

      if (res?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Synced Successfully",
          text: "Raw materials synced successfully",
          confirmButtonColor: "#3085d6",
        });

        // ✅ Refresh menu allocation
        fetchMenuAllocation(eventFunctionId);
      } else {
        throw new Error(res?.data?.message || "Sync failed");
      }
    } catch (error) {
      Swal.close(); // ensure loader closes on error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to sync raw materials",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <Fragment>
      <Container>
        <div className="flex justify-between items-center mb-4">
          {/* LEFT: Page Title + 3 Custom Buttons */}
          <div className="flex items-center gap-6">
            <h2 className="text-xl text-black font-semibold">
              3. Menu Execution
            </h2>

            {/* ONLY FOR THIS SCREEN */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/menu-preparation/${eventId}`)}
                className="btn btn-light text-white bg-primary font-semibold hover:!bg-primary hover:!text-white hover:!border-primary"
              >
                <i
                  className="ki-filled ki-menu "
                  style={{ color: "white" }}
                ></i>{" "}
                2. Menu Planning
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
                <i className="ki-filled ki-gift" style={{ color: "white" }}></i>{" "}
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
        {/* Event Details */}
        <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            <div className="flex items-center gap-3">
              <i className="ki-filled ki-calendar-tick text-success text-lg"></i>
              <div className="flex flex-col">
                <span className="text-sm">
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
              <i className="ki-filled ki-user text-success text-lg"></i>
              <div className="flex flex-col">
                <span className="text-sm">
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
              <i className="ki-filled ki-geolocation-home text-success text-lg"></i>
              <div className="flex flex-col">
                <span className="text-sm">
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
              <i className="ki-filled ki-calendar-tick text-success text-lg"></i>
              <div className="flex flex-col">
                <span className="text-sm">
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
              <i className="ki-filled ki-calendar-tick text-success text-lg"></i>
              <div className="flex flex-col">
                <span className="text-sm">
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
                className="btn btn-sm btn-primary"
                title="Save"
                onClick={handleMainSave}
                disabled={!hasUnsavedChanges}
              >
                <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
              </button>
              <button
                className="btn btn-sm btn-primary"
                title="Sync Raw Material"
                onClick={handleSyncRawMaterial}
              >
                <FormattedMessage
                  id="EVENT_MENU_ALLOCATION.SYNC_RAW_MATERIAL"
                  defaultMessage="Sync Raw Material"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {/* Left side - Table Section */}
          <div className="w-[70%] flex flex-col">
            {/* Top Tabs */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-[#FAFAFA] p-3 rounded-lg overflow-x-auto mb-3">
              <TopTabs
                value={activeFunction}
                onChange={handleFunctionChange}
                functions={eventData?.eventFunctions || []}
              />
            </div>

            {/* Sticky Header Section */}
            <div
              className="sticky z-10 bg-white pb-2 rounded-lg shadow-sm mb-3"
              style={{ top: "70px" }}
            >
              <div className="flex flex-row gap-4 p-4 border-b border-gray-200">
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

              {/* Second Sticky Row - Search and Buttons */}
              <div className="flex gap-2 p-4">
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full items-center justify-start gap-2 md:justify-end">
                  <button
                    onClick={() => setIsAgencyAllocationModal(true)}
                    className="btn btn-primary text-white text-sm px-3 py-2 rounded-md transition"
                    title="Agency Allocation"
                  >
                    <FormattedMessage
                      id="EVENT_MENU_ALLOCATION.REPORT"
                      defaultMessage="Agency Allocation"
                    />
                  </button>
                  <button
                    onClick={openSummaryItemModalchefoutside}
                    className="btn btn-primary text-white text-sm px-3 py-2 rounded-md transition"
                    title="Chef Labour"
                  >
                    <FormattedMessage
                      id="EVENT_MENU_ALLOCATION.REPORT"
                      defaultMessage="Chef Labour"
                    />
                  </button>
                  <button
                    onClick={openSummaryItemModalOustsideAgency}
                    className="btn btn-primary text-white text-sm px-3 py-2 rounded-md transition"
                    title="Outsource Agency"
                  >
                    <FormattedMessage
                      id="EVENT_MENU_ALLOCATION.REPORT"
                      defaultMessage="Outsource Agency"
                    />
                  </button>
                  <button
                    onClick={openSummaryItemModalInHouseCook}
                    className="btn btn-primary text-white text-sm px-3 py-2 rounded-md transition"
                    title="Inside Kitchen"
                  >
                    <FormattedMessage
                      id="EVENT_MENU_ALLOCATION.REPORT"
                      defaultMessage="Inside Kitchen"
                    />
                  </button>
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
            </div>

            {/* Table Section - No individual scroll */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <TableHeader />
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No menu items available
                </div>
              ) : (
                filtered.map((row, index) => (
                  <TableRow
                    key={`${row.menuItemId}-${row.menuCategoryId}-${index}`}
                    row={row}
                    onChange={updateRow}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right side - Order Summary (Sticky) */}
          <div className="w-[30%]">
            <div className="sticky bg-white z-10" style={{ top: "70px" }}>
              <div className="max-h-[calc(100vh-100px)] overflow-y-auto">
                <OrderSummary
                  groups={orderSummaryGroups}
                  loading={menuLoading}
                  onItemClick={handleOrderSummaryItemClick}
                  pax={activeFunction?.pax || 0}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="  ">
          <div className="flex justify-end p-4">
            <button
              className="btn btn-primary px-6 py-2"
              title="Save"
              onClick={handleMainSave}
              disabled={!hasUnsavedChanges}
            >
              <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
            </button>
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
          personCount={selectedRow?.personCount}
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
        <SidebarInsideModal
          open={isInsideModal}
          onClose={() => setIsInsideModal(false)}
          eventId={selectedRow?.eventId}
          eventFunctionId={selectedRow?.eventFunctionId}
          row={selectedRow}
          functionName={activeFunction?.function?.nameEnglish}
          functionDateTime={activeFunction?.functionStartDateTime}
          onSave={handleInsideSave}
          personCount={selectedRow?.personCount}
        />
        <CategorySidebarModal
          open={isCategoryModal}
          onClose={() => setIsCategoryModal(false)}
          selectedRowData={selectedRow}
          eventFunctionId={activeFunction?.id}
          eventId={eventId}
          onSave={handleCategorySave}
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
        <SummaryItemModalchefoutside
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          chefsummary={chefsummary}
        />
        <SummaryItemModalOutsideAgency
          open={isOutsideAgencyModalOpen}
          onClose={() => setIsOutsideAgencyModalOpen(false)}
          outsidesummary={outsidesummary}
        />
        <SummaryItemModalInHousecook
          open={isInHouseCookModalOpen}
          onClose={() => setIsInHouseCookModalOpen(false)}
          insidesummary={insidesummary}
        />
        <AgencyAllocationSidebar
          open={isAgencyAllocationModal}
          onClose={() => {
            setIsAgencyAllocationModal(false);

            if (activeFunction?.id) {
              fetchMenuAllocation(activeFunction.id);
            }
          }}
          eventId={eventId}
          eventFunctionId={activeFunction?.id}
        />
      </Container>
    </Fragment>
  );
};

export default EventMenuAllocationPage;
