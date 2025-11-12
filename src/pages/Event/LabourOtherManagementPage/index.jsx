import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { DatePicker, Select } from "antd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Swal from "sweetalert2";
import LabourDetailSidebar from "./LabourSidebar/LabourDetailSidebar";
import AddNotes from "@/partials/modals/add-notes/AddNotes.jsx";
import AddExtraExpense from "@/partials/modals/add-extra-expense/AddExtraExpense";
import MenuReport from "@/partials/modals/menu-report/MenuReport";
import ExtraExpenseTable from "./ExtraExpenseTable";
import { useExtraExpense } from "./hooks/useExtraExpense";
import {
  GetEventMasterById,
  GetAllContactCategory,
  GetPartyMasterByCatId,
  AddUpdateLabor,
  GetEventLaborDetails,
  GetAllLabourShift,
} from "@/services/apiServices";

dayjs.extend(customParseFormat);

const LABOUR_TYPE = "labour";
const CATEGORIES = ["Labour", "Extra Expense"];
const SHIFTS = ["Morning Shift", "Evening Shift", "Full Day"];
const PLACES = ["At Venue", "At Godown"];

// Utility functions
const parseDate = (date, fallbackDate) => {
  const parsed = dayjs(
    date,
    ["DD/MM/YYYY hh:mm A", "YYYY-MM-DD HH:mm:ss"],
    true
  );
  return parsed.isValid()
    ? parsed.format("DD/MM/YYYY hh:mm A")
    : fallbackDate
      ? dayjs(fallbackDate).format("DD/MM/YYYY hh:mm A")
      : "";
};

const createEmptyLabourRow = () => ({
  id: Date.now(),
  labourType: "",
  contactId: null,
  contact: "",
  shift: "",
  dateTime: "",
  price: "",
  quantity: "",
  total: "",
  place: "",
});

const LabourOtherManagementPage = () => {
  const { eventId } = useParams();
  const storedUser = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    []
  );

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Dinner");
  const [activeCategory, setActiveCategory] = useState("Labour");
  const [selectedFunctionPax, setSelectedFunctionPax] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftOptions, setShiftOptions] = useState([]);

  const [labourData, setLabourData] = useState([]);
  const [labourCategories, setLabourCategories] = useState([]);
  const [allContacts, setAllContacts] = useState({});
  const [filteredContacts, setFilteredContacts] = useState({});

  const [isLabourSidebarOpen, setIsLabourSidebarOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isMenuReport, setIsMenuReport] = useState(false);
  const [menuReportEventId, setMenuReportEventId] = useState(null);
  const [notes, setNotes] = useState("");

  const userId = storedUser?.id || eventData?.user?.id || 0;

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await GetAllLabourShift(userId || 0);
        const apiShifts = res?.data?.data?.["Function Details"] || [];
        const mapped =
          Array.isArray(apiShifts) && apiShifts.length
            ? apiShifts
                .map((s) => (typeof s === "string" ? s : s.nameEnglish || ""))
                .filter(Boolean)
            : SHIFTS;

        setShiftOptions(mapped);
      } catch (err) {
        console.error("Error fetching shifts:", err);
        setShiftOptions(SHIFTS);
      }
    };

    if (userId) fetchShifts();
  }, [userId]);

  const activeFunction = useMemo(
    () =>
      eventData?.eventFunctions?.find(
        (fn) => fn.function?.nameEnglish === activeTab
      ),
    [eventData, activeTab]
  );

  const filteredLabourData = useMemo(
    () =>
      labourData.filter((row) => {
        if (!row.labourType || !searchTerm.trim()) return true;
        return row.labourType.toLowerCase().includes(searchTerm.toLowerCase());
      }),
    [labourData, searchTerm]
  );

  const {
    extraExpenseData,
    selectedExpense,
    isModalOpen: isExtraExpenseModalOpen,
    deleteExpense,
    editExpense,
    addExpense,
    closeModal,
  } = useExtraExpense(activeFunction?.id, eventData?.id);

  useEffect(() => {
    const fetchContactCategories = async () => {
      if (!userId) return;

      try {
        const res = await GetAllContactCategory(userId);
        const allCategories =
          res?.data?.data?.["Contact Category Details"] || [];
        const labour = allCategories.filter(
          (cat) =>
            cat?.contactType?.nameEnglish?.trim()?.toLowerCase() === LABOUR_TYPE
        );
        setLabourCategories(labour);
      } catch (error) {
        console.error("Error fetching contact categories:", error);
      }
    };

    fetchContactCategories();
  }, [userId]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!userId || !labourCategories.length) return;

      try {
        const contactsMap = {};
        await Promise.all(
          labourCategories.map(async (cat) => {
            const res = await GetPartyMasterByCatId(cat.id, userId);
            contactsMap[cat.id] = res?.data?.data?.["Party Details"] || [];
          })
        );
        setAllContacts(contactsMap);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };

    fetchContacts();
  }, [labourCategories, userId]);

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        const res = await GetEventMasterById(eventId);

        if (res?.data?.data?.["Event Details"]?.length > 0) {
          const event = res.data.data["Event Details"][0];
          setEventData(event);

          if (event?.eventFunctions?.length > 0) {
            setActiveTab(event.eventFunctions[0].function?.nameEnglish);
            setSelectedFunctionPax(event.eventFunctions[0].pax || 0);
          }
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    const fetchLaborDetails = async () => {
      if (!activeFunction || !eventData) return;

      try {
        const res = await GetEventLaborDetails(activeFunction.id, eventData.id);
        const laborData = res?.data?.data?.eventLabor || [];

        const formattedRows = laborData.map((item, index) => ({
          id: index + 1,
          labourType:
            labourCategories
              .find((c) => c.id === item.labortypeid)
              ?.nameEnglish?.trim() || "",
          contact:
            Object.values(allContacts)
              .flat()
              .find((c) => c.id === item.contactid)
              ?.nameEnglish?.trim() || "",
          contactId: item.contactid, // Store the original contact ID
          shift: item.laborshift || "",
          dateTime: parseDate(
            item.labordatetime,
            eventData?.eventStartDateTime
          ),
          price: item.price || "",
          quantity: item.qty || "",
          total: item.totalprice || "",
          place: item.place || "",
        }));

        setLabourData(formattedRows);
      } catch (error) {
        console.error("Error fetching labour details:", error);
      }
    };

    if (
      eventData &&
      activeTab &&
      labourCategories.length &&
      Object.keys(allContacts).length
    ) {
      fetchLaborDetails();
    }
  }, [eventData, activeTab, labourCategories, allContacts, activeFunction]);

  const handleRowChange = useCallback((id, field, value) => {
    setLabourData((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        const updated = { ...row, [field]: value };

        if (field === "price" || field === "quantity") {
          const price = parseFloat(updated.price || 0);
          const qty = parseFloat(updated.quantity || 0);
          updated.total = (price * qty).toFixed(2);
        }

        return updated;
      })
    );
  }, []);

  const handleLabourTypeChange = useCallback(
    (rowId, value) => {
      const selectedCategory = labourCategories.find(
        (c) => c.nameEnglish === value
      );

      setLabourData((prev) =>
        prev.map((r) =>
          r.id === rowId ? { ...r, labourType: value, contact: "" } : r
        )
      );

      setFilteredContacts((prev) => ({
        ...prev,
        [rowId]: allContacts[selectedCategory?.id] || [],
      }));
    },
    [labourCategories, allContacts]
  );

  const addLabourRow = useCallback(() => {
    setLabourData((prev) => [...prev, createEmptyLabourRow()]);
  }, []);

  const deleteRow = useCallback((id) => {
    setLabourData((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const handleSave = useCallback(async () => {
    if (!eventData || !activeFunction) {
      Swal.fire({
        icon: "warning",
        title: "Please select a function before saving!",
      });
      return;
    }

    const payload = {
      eventFunctionId: activeFunction.id,
      eventId: eventData.id,
      eventLaborDetails: labourData.map((row) => {
        const selectedCategory = labourCategories.find(
          (c) => c.nameEnglish === row.labourType
        );

        // Use stored contactId if it exists (fetched data), otherwise find from contact name
        let contactId = row.contactId; // Use the stored ID first

        if (!contactId) {
          // If no stored ID, find it from the contact name (for new rows)
          const contact = (filteredContacts[row.id] || []).find(
            (c) => c.nameEnglish === row.contact
          );
          contactId = contact?.id;
        }

        return {
          contactid: contactId,
          labordatetime: dayjs(
            row.dateTime,
            ["DD/MM/YYYY hh:mm A", "YYYY-MM-DD", "MMM D, YYYY"],
            true
          ).isValid()
            ? dayjs(row.dateTime, [
                "DD/MM/YYYY hh:mm A",
                "YYYY-MM-DD",
                "MMM D, YYYY",
              ]).format("DD/MM/YYYY hh:mm A")
            : "",
          laborshift: row.shift || "",
          labortypeid: selectedCategory?.id || 0,
          place: row.place || "At Venue",
          price: parseFloat(row.price || 0),
          qty: parseFloat(row.quantity || 0),
          totalprice: parseFloat(row.total || 0),
        };
      }),
    };

    try {
      Swal.fire({
        title: "Saving...",
        text: "Please wait while we save labour details.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await AddUpdateLabor(payload);

      if (res?.data?.status || res?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res?.data?.message || res?.data?.msg || "Saved successfully",
          timer: 2000,
          showConfirmButton: false,
        });

        // Refetch labour details
        if (activeFunction && eventData) {
          const laborRes = await GetEventLaborDetails(
            activeFunction.id,
            eventData.id
          );
          const laborData = laborRes?.data?.data?.eventLabor || [];

          const formattedRows = laborData.map((item, index) => ({
            id: index + 1,
            labourType:
              labourCategories
                .find((c) => c.id === item.labortypeid)
                ?.nameEnglish?.trim() || "",
            contact:
              Object.values(allContacts)
                .flat()
                .find((c) => c.id === item.contactid)
                ?.nameEnglish?.trim() || "",
            contactId: item.contactid, // Store the original contact ID
            shift: item.laborshift || "",
            dateTime: parseDate(
              item.labordatetime,
              eventData?.eventStartDateTime
            ),
            price: item.price || "",
            quantity: item.qty || "",
            total: item.totalprice || "",
            place: item.place || "",
          }));

          setLabourData(formattedRows);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: res?.data?.message || res?.data?.msg || "Failed to save",
        });
      }
    } catch (error) {
      console.error("Error saving labour details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong",
      });
    }
  }, [
    eventData,
    activeFunction,
    labourData,
    labourCategories,
    filteredContacts,
    allContacts,
  ]);

  const handleSaveNotes = useCallback((newNotes) => {
    setNotes(newNotes);
    setIsNotesOpen(false);
  }, []);

  const openMenuReport = useCallback(() => {
    setMenuReportEventId(eventId);
    setIsMenuReport(true);
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: "Labour/Other Management",
              },
            ]}
          />
        </div>

        {/* Event Info Card */}
        <div className="card min-w-full bg-no-repeat user-access-bg mb-5">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-7">
                <EventInfoItem
                  icon="ki-calendar-tick"
                  label="Party Name"
                  value={eventData?.party?.nameEnglish}
                />
                <EventInfoItem
                  icon="ki-user"
                  label="Event Name"
                  value={eventData?.eventType?.nameEnglish}
                />
                <EventInfoItem
                  icon="ki-geolocation-home"
                  label="Function Name"
                  value={eventData?.eventType?.nameEnglish}
                />
                <EventInfoItem
                  icon="ki-calendar-tick"
                  label="Event Venue"
                  value={eventData?.venue}
                />
                <EventInfoItem
                  icon="ki-calendar-tick"
                  label="Event Date Time"
                  value={eventData?.eventStartDateTime}
                />
              </div>
            </div>

            <button
              className="bg-[#005BA8] text-white text-sm px-3 py-2 rounded-md transition"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>

        {/* Function Tabs */}
        <div className="w-full max-w-xxl bg-white shadow-md rounded-xl border border-gray-200 mb-4 p-2">
          <div className="inline-flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
            {eventData?.eventFunctions?.map((fn, index) => (
              <button
                key={fn.id}
                onClick={() => {
                  setActiveTab(fn.function?.nameEnglish);
                  setSelectedFunctionPax(fn.pax || 0);
                }}
                className={`px-8 py-3 text-sm font-medium transition-all duration-200 
                  ${activeTab === fn.function?.nameEnglish ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}
                  ${index !== 0 ? "border-l border-gray-300" : ""}
                `}
              >
                {fn.function?.nameEnglish}
              </button>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="card mb-5">
          <div className="card-body p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <i className="ki-filled ki-users text-primary"></i>
                <span className="text-2sm font-medium text-gray-700">
                  Person
                </span>
                <span className="text-sm font-semibold bg-gray-300 rounded-md px-3 py-1">
                  {selectedFunctionPax || "-"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={openMenuReport}
                  className="btn btn-light btn-sm h-10"
                >
                  <i className="ki-filled ki-document"></i>
                  Report
                </button>
                <button className="btn btn-light btn-sm h-10">
                  <i className="ki-filled ki-document"></i>
                  Checklist
                </button>
                <input
                  type="text"
                  placeholder="Search labour type..."
                  className="input  h-10"
                  style={{ width: "300px" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="card mb-5">
          <div className="card-body p-3">
            <div className="flex gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`btn btn-md ${activeCategory === category ? "btn-primary" : "btn-light"}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Labour Table */}
        {activeCategory === "Labour" && (
          <LabourTable
            data={filteredLabourData}
            labourCategories={labourCategories}
            filteredContacts={filteredContacts}
            shiftOptions={shiftOptions}
            eventData={eventData}
            onRowChange={handleRowChange}
            onLabourTypeChange={handleLabourTypeChange}
            onDelete={deleteRow}
            onAddRow={addLabourRow}
            onViewDetails={() => setIsLabourSidebarOpen(true)}
            onAddNotes={() => setIsNotesOpen(true)}
          />
        )}

        {/* Extra Expense Table - Using separated component */}
        {activeCategory === "Extra Expense" && (
          <ExtraExpenseTable
            data={extraExpenseData}
            onEdit={editExpense}
            onDelete={deleteExpense}
            onAddExpense={addExpense}
          />
        )}

        {/* Modals */}
        <AddNotes
          isOpen={isNotesOpen}
          onClose={() => setIsNotesOpen(false)}
          initialNotes={notes}
          onSave={handleSaveNotes}
        />

        <LabourDetailSidebar
          isOpen={isLabourSidebarOpen}
          onClose={() => setIsLabourSidebarOpen(false)}
        />

        {isExtraExpenseModalOpen && (
          <AddExtraExpense
            isOpen={isExtraExpenseModalOpen}
            onClose={closeModal}
            eventData={eventData}
            selectedMeal={selectedExpense}
          />
        )}

        <MenuReport
          isModalOpen={isMenuReport}
          setIsModalOpen={setIsMenuReport}
          eventId={menuReportEventId}
        />
      </Container>
    </Fragment>
  );
};

// Sub-components (Labour table components remain in main file)
const EventInfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <i className={`ki-filled ${icon} text-success`}></i>
    <div className="flex flex-col">
      <span className="text-xs">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || "-"}</span>
    </div>
  </div>
);

const LabourTable = ({
  data,
  labourCategories,
  filteredContacts,
  eventData,
  shiftOptions,
  onRowChange,
  onLabourTypeChange,
  onDelete,
  onAddRow,
  onViewDetails,
  onAddNotes,
}) => (
  <div className="card">
    <div className="card-body p-0">
      <div className="overflow-x-hidden">
        <table className="table table-auto w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-center  w-[50px]">#</th>
              <th className=" w-[3%]">Labour Type</th>
              <th className=" w-[3%]">Contact</th>
              <th className=" w-[20%]">Labour Shift</th>
              <th className=" w-[25%]">Date Time</th>
              <th className=" w-[15%]">Price</th>
              <th className=" w-[15%]">Qty</th>
              <th className=" w-[10%]">Total Price</th>
              <th className=" w-[25%]">Place</th>
              <th className="text-center  w-[5%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <LabourRow
                key={row.id}
                row={row}
                index={index}
                labourCategories={labourCategories}
                filteredContacts={filteredContacts}
                eventData={eventData}
                onRowChange={onRowChange}
                shiftOptions={shiftOptions}
                onLabourTypeChange={onLabourTypeChange}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
                onAddNotes={onAddNotes}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t">
        <button onClick={onAddRow} className="btn btn-primary btn-sm">
          <i className="ki-filled ki-plus"></i>
          Add Another Labour Type
        </button>
      </div>
    </div>
  </div>
);

const LabourRow = ({
  row,
  index,
  labourCategories,
  filteredContacts,
  eventData,
  shiftOptions = [],
  onRowChange,
  onLabourTypeChange,
  onDelete,
  onViewDetails,
  onAddNotes,
}) => (
  <tr className="border-t">
    <td className="text-center !px-[3px]">{index + 1}.</td>
    <td className="!px-[3px]">
      <Select
        className="custom-select-sm"
        showSearch
        placeholder="Select Labour Type"
        value={row.labourType || undefined}
        onChange={(value) => onLabourTypeChange(row.id, value)}
        style={{ width: "100%" }}
      >
        {labourCategories.map((item) => (
          <Select.Option key={item.id} value={item.nameEnglish}>
            {item.nameEnglish}
          </Select.Option>
        ))}
      </Select>
    </td>
    <td className="!px-[3px]">
      <Select
        className="custom-select-sm"
        showSearch
        placeholder="Select Contact"
        value={row.contact || undefined}
        onChange={(value) => onRowChange(row.id, "contact", value)}
        style={{ width: "100%" }}
      >
        {(filteredContacts[row.id] || []).map((c) => (
          <Select.Option key={c.id} value={c.nameEnglish}>
            {c.nameEnglish}
          </Select.Option>
        ))}
      </Select>
    </td>
    <td className="!px-[3px]">
      <select
        className="select select-sm w-full"
        value={row.shift}
        onChange={(e) => onRowChange(row.id, "shift", e.target.value)}
      >
        <option value="">Select Shift</option>
        {shiftOptions.map((shift) => (
          <option key={shift} value={shift}>
            {shift}
          </option>
        ))}
      </select>
    </td>
    <td className="!px-[3px]">
      <DatePicker
        className="input input-sm w-full"
        format="DD/MM/YYYY hh:mm A"
        showTime={{ use12Hours: true, format: "hh:mm A" }}
        value={
          row.dateTime
            ? dayjs(row.dateTime, "DD/MM/YYYY hh:mm A")
            : eventData?.eventStartDateTime
              ? dayjs(eventData.eventStartDateTime, "DD/MM/YYYY hh:mm A")
              : null
        }
        onChange={(date) =>
          onRowChange(
            row.id,
            "dateTime",
            date ? date.format("DD/MM/YYYY hh:mm A") : ""
          )
        }
      />
    </td>
    <td className="!px-[3px]">
      <input
        type="number"
        className="input input-sm w-full"
        placeholder="Price"
        value={row.price}
        onChange={(e) => onRowChange(row.id, "price", e.target.value)}
      />
    </td>
    <td className="!px-[3px]">
      <input
        type="number"
        className="input input-sm w-full"
        placeholder="Qty"
        value={row.quantity}
        onChange={(e) => onRowChange(row.id, "quantity", e.target.value)}
      />
    </td>
    <td className="!px-[3px]">
      <input
        type="number"
        className="input input-sm w-full bg-gray-100"
        value={row.total}
        readOnly
      />
    </td>
    <td className="!px-[3px]">
      <select
        className="select select-sm w-full"
        value={row.place}
        onChange={(e) => onRowChange(row.id, "place", e.target.value)}
      >
        <option value="">Select Place</option>
        {PLACES.map((place) => (
          <option key={place} value={place}>
            {place}
          </option>
        ))}
      </select>
    </td>
    <td className="!px-[3px]">
      <div className="flex items-center justify-center ">
        <button
          className="btn btn-sm btn-icon btn-clear"
          onClick={onViewDetails}
        >
          <i className="ki-filled ki-eye text-success"></i>
        </button>
        <button className="btn btn-sm btn-icon btn-clear" onClick={onAddNotes}>
          <i className="ki-filled ki-notepad text-primary"></i>
        </button>
        <button className="btn btn-sm btn-icon btn-clear">
          <i className="ki-filled ki-whatsapp text-green-600"></i>
        </button>
        <button
          className="btn btn-sm btn-icon btn-clear"
          onClick={() => onDelete(row.id)}
        >
          <i className="ki-filled ki-trash text-danger"></i>
        </button>
      </div>
    </td>
  </tr>
);

export default LabourOtherManagementPage;
