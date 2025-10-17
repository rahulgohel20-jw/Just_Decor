import { Fragment, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import SidebarChefModal from "../../../components/sidebarchefmodal/SidebarChefModal";
import { Input, Checkbox, Select, Card, Badge, Tooltip, Spin } from "antd";
import SidebarModal from "../../../components/SidebarModal/SidebarModal";
import CategorySidebarModal from "../CategorySidebar/CategorySidebarModal";
import WhatsappSidebarMenu from "../whatsappsidebar/WhatsappSidebarMenu";
import {
  GetEventMasterById,
  GetMenuAllocation,
  SelectedItemNameMenuAllocation,
} from "@/services/apiServices";
import { useParams } from "react-router-dom";

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
        <p className="text-gray-500 text-sm">No functions available</p>
      )}
    </div>
  );
};

const OrderSummary = ({ groups, onItemClick, loading }) => {
  return (
    <div className="flex flex-col gap-2">
      <button className="btn btn-sm btn-primary p-6 flex justify-center text-lg">
        Show Counter
      </button>
      <Card
        className="w-full border border-gray-200 shadow-sm"
        bodyStyle={{ padding: 0 }}
        title={
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              ✱
            </span>
            <span className="text-gray-800">Order Summary</span>
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Spin />
          </div>
        ) : groups.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No items available
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
            <div className="card flex flex-row justify-between p-4 bg-[#FAFAFA]">
              <div className="flex flex-row gap-1">
                <span className="font-medium text-gray-900">
                  Dish Costing :
                </span>
                <span>1200</span>
              </div>
              <div className="flex flex-row gap-1">
                <span className="font-medium text-gray-900">Total :</span>
                <span>₹25000</span>
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
    <div className="col-span-2"> Name</div>
    <div className="col-span-2 text-center">Chef Labour</div>
    <div className="col-span-1 text-center">Outside</div>
    <div className="col-span-2 text-center">Inside</div>
    <div className="col-span-1 text-center">Person</div>
    <div className="col-span-2 text-center">Place</div>
    <div className="col-span-2">Instructions</div>
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

    if (type === "outside" && checked && row.openSidebar) {
      row.openSidebar();
    }
    if (type === "chef" && checked && row.openChefSidebar) {
      row.openChefSidebar();
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

      const res = await SelectedItemNameMenuAllocation(
        eventFunctionId,
        isFromNewTable,
        menuItemId
      );

      if (res?.data?.success) {
        setSelectedRow(res.data.data);
      } else {
        console.warn("No data returned from SelectedItemNameMenuAllocation");
      }
    } catch (error) {
      console.error("Error fetching SelectedItemNameMenuAllocation:", error);
    } finally {
      setMenuLoading(false);
    }
  };

  const fetchMenuAllocation = async (eventFunctionId) => {
    try {
      setMenuLoading(true);
      const menudata = await GetMenuAllocation(eventId, eventFunctionId);
      console.log(menudata);

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
          })) || [];

        setRows(transformedRows);

        const summaryGroups =
          menuDetails.selectedItemDetails?.map((category) => ({
            categoryId: category.menuCategoryId,
            categoryName: category.menuCategoryName,
            items: category.selectedMenuPreparationItems || [],
          })) || [];

        setOrderSummaryGroups(summaryGroups);
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
    setRows((r) => r.map((x) => (x.key === updated.key ? updated : x)));
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

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      </Container>
    );
  }

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Menu Allocation" }]} />
        </div>

        {/* Event Details */}
        <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            <div className="flex items-center gap-3">
              <i className="ki-filled ki-calendar-tick text-success"></i>
              <div className="flex flex-col">
                <span className="text-xs">Event ID:</span>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.eventNo || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="ki-filled ki-user text-success"></i>
              <div className="flex flex-col">
                <span className="text-xs">Party Name:</span>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.party?.nameEnglish || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="ki-filled ki-geolocation-home text-success"></i>
              <div className="flex flex-col">
                <span className="text-xs">Event Name:</span>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.eventType?.nameEnglish || "N/A"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="ki-filled ki-calendar-tick text-success"></i>
              <div className="flex flex-col">
                <span className="text-xs">Event Venue:</span>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.venue || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="ki-filled ki-calendar-tick text-success"></i>
              <div className="flex flex-col">
                <span className="text-xs">Event Date & Time:</span>
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

              <button className="btn btn-sm btn-primary" title="Save">
                Save
              </button>
              <button
                className="btn btn-sm btn-primary"
                title="Sync Raw Material"
              >
                Sync Raw Material
              </button>
              <button className="btn btn-sm btn-primary" title="Sync Agency">
                Sync Agency
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
                  <span className="text-sm text-gray-600">Date & Time</span>
                  <Input
                    className="p-1 w-[200px] text-black"
                    type="text"
                    readOnly
                    value={activeFunction?.functionStartDateTime || "-"}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600">Person</span>
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
                  placeholder="Enter Person"
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
                    Adjust Person
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
                      placeholder="Search item"
                      type="text"
                    />
                  </div>
                </div>
                <div className="flex w-full items-center justify-start gap-5 md:justify-end">
                  <button className="btn btn-sm btn-primary p-4" title="Report">
                    Report
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
                        No menu items available
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
        />

        <SidebarChefModal
          open={isChefModal}
          onClose={() => setIsChefModal(false)}
          eventId={selectedRow?.eventId}
          eventFunctionId={selectedRow?.eventFunctionId}
          row={selectedRow}
          functionName={activeFunction?.function?.nameEnglish}
          functionDateTime={activeFunction?.functionStartDateTime}
        />

        <CategorySidebarModal
          open={isCategoryModal}
          onClose={() => setIsCategoryModal(false)}
          selectedRowData={selectedRow}
        />
        <WhatsappSidebarMenu
          open={iswhatsAppSidebar}
          onClose={() => setIsWhatsAppSidebar(false)}
        />
      </Container>
    </Fragment>
  );
};

export default EventMenuAllocationPage;
