import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { DatePicker, Select } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Swal from "sweetalert2";
import LabourDetailSidebar from "./LabourSidebar/LabourDetailSidebar";
import AddNotes from "@/partials/modals/add-notes/AddNotes.jsx";
import AddExtraExpense from "@/partials/modals/add-extra-expense/AddExtraExpense";
import MenuReport from "@/partials/modals/menu-report/MenuReport";
import SelectMenureport from "../../../partials/modals/menu-report/SelectMenureport";
import AddContactCategory from "../../../partials/modals/add-contact-category/AddContactCategory";
import AddVendor from "../../../partials/modals/add-vendor/AddVendor";
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
const CATEGORIES = ["Labour"];
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

const createEmptyLabourRow = (labourType = "") => ({
  id: Date.now(),
  labourType,
  contactId: null,
  contact: "",
  shift: "",
  dateTime: "",
  price: "",
  quantity: "",
  total: "",
  place: "",
  notesEnglish: "",
  notesGujarati: "",
  notesHindi: "",
});

const LabourOtherManagementPage = () => {
  let { eventId } = useParams();
  const navigate = useNavigate();

  const storedUser = useMemo(
    () => JSON.parse(localStorage.getItem("userData") || "{}"),
    []
  );
  const [activeFunctionName, setActiveFunctionName] = useState("");
  const [isAddLabourModalOpen, setIsAddLabourModalOpen] = useState(false);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeTab, setActiveTab] = useState(null); // Changed to null initially
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
  const [isSelectMenureport, setIsSelectMenuReport] = useState(false);

  const [menuReportEventId, setMenuReportEventId] = useState(null);
  const [currentNoteRowId, setCurrentNoteRowId] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Add this line after other useState declarations

  const userId = localStorage.getItem("userId");
  console.log("userid", userId);

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
    () => eventData?.eventFunctions?.find((fn) => fn.id === activeTab),
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
    refetchExpenses,
  } = useExtraExpense(activeFunction?.id, eventData?.id);

  // Force refetch when activeFunction changes
  useEffect(() => {
    if (
      activeFunction?.id &&
      eventData?.id &&
      typeof refetchExpenses === "function"
    ) {
      refetchExpenses();
    }
  }, [activeFunction?.id, eventData?.id]);

  useEffect(() => {
    const fetchContactCategories = async () => {
      if (!userId) return;

      console.log("🔍 Fetch triggered with userId:", userId);

      try {
        const res = await GetAllContactCategory(userId);

        console.log("📦 Full API Response:", res);

        const allCategories =
          res?.data?.data?.["Contact Category Details"] || [];

        console.log("📄 Extracted Categories:", allCategories);

        const labour = allCategories.filter((cat) => {
          const typeName = cat?.contactType?.nameEnglish?.trim()?.toLowerCase();
          console.log(
            `➡ Checking Category: ${cat?.nameEnglish} | Contact Type: ${typeName}`
          );
          return typeName === LABOUR_TYPE;
        });

        console.log("✅ Filtered Labour Categories:", labour);

        setLabourCategories(labour);
      } catch (error) {
        console.error("❌ Error fetching contact categories:", error);
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
  // Add this useEffect after setting labourCategories
  useEffect(() => {
    console.log("🎯 Labour Type Dropdown Options:", labourCategories);
    console.log(
      "🎯 Labour Type Names:",
      labourCategories.map((cat) => cat.nameEnglish)
    );
  }, [labourCategories]);
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
            // Set activeTab to the first function's ID, not name
            setActiveTab(event.eventFunctions[0].id);
            setActiveFunctionName(
              event.eventFunctions[0].function?.nameEnglish
            );
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
          contactId: item.contactid,
          shift: item.laborshift || "",
          dateTime: parseDate(
            item.labordatetime,
            eventData?.eventStartDateTime
          ),
          price: item.price || "",
          quantity: item.qty || "",
          total: item.totalprice || "",
          place: item.place || "",
          notesEnglish: item.notesEnglish || "",
          notesGujarati: item.notesGujarati || "",
          notesHindi: item.notesHindi || "",
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
    setHasUnsavedChanges(true);

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
      setHasUnsavedChanges(true);

      const selectedCategory = labourCategories.find(
        (c) => c.nameEnglish === value
      );

      setLabourData((prev) =>
        prev.map((r) =>
          r.id === rowId
            ? { ...r, labourType: value, contact: "", contactId: null }
            : r
        )
      );

      setFilteredContacts((prev) => ({
        ...prev,
        [rowId]: allContacts[selectedCategory?.id] || [],
      }));
    },
    [labourCategories, allContacts]
  );

  const handleContactChange = useCallback(
    (rowId, contactName) => {
      setHasUnsavedChanges(true);

      const row = labourData.find((r) => r.id === rowId);
      const contactList = filteredContacts[rowId] || [];
      const selectedContact = contactList.find(
        (c) => c.nameEnglish === contactName
      );

      setLabourData((prev) =>
        prev.map((r) =>
          r.id === rowId
            ? {
                ...r,
                contact: contactName,
                contactId: selectedContact?.id || null,
              }
            : r
        )
      );
    },
    [labourData, filteredContacts]
  );

  const addLabourRow = useCallback(() => {
    setHasUnsavedChanges(true);
    setLabourData((prev) => [...prev, createEmptyLabourRow()]);
  }, []);

  const deleteRow = useCallback((id) => {
    setHasUnsavedChanges(true);
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

        return {
          contactid: row.contactId || 0,
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
          notesEnglish: row.notesEnglish || "",
          notesGujarati: row.notesGujarati || "",
          notesHindi: row.notesHindi || "",
        };
      }),
    };

    console.log("Save Payload:", JSON.stringify(payload, null, 2));

    try {
      setIsSaving(true); // 🔥 Start loader

      const res = await AddUpdateLabor(payload);

      if (res?.data?.status === true || res?.data?.success === true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res?.data?.message || res?.data?.msg || "Saved successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        setHasUnsavedChanges(false);

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
            contactId: item.contactid,
            shift: item.laborshift || "",
            dateTime: parseDate(
              item.labordatetime,
              eventData?.eventStartDateTime
            ),
            price: item.price || "",
            quantity: item.qty || "",
            total: item.totalprice || "",
            place: item.place || "",
            notesEnglish: item.notesEnglish || "",
            notesGujarati: item.notesGujarati || "",
            notesHindi: item.notesHindi || "",
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
    } finally {
      setIsSaving(false); // 🔥 Stop loader
    }
  }, [eventData, activeFunction, labourData, labourCategories, allContacts]);

  const handleSaveNotes = useCallback(
    (notesData) => {
      if (currentNoteRowId !== null) {
        setHasUnsavedChanges(true);

        setLabourData((prev) =>
          prev.map((row) =>
            row.id === currentNoteRowId
              ? {
                  ...row,
                  notesEnglish: notesData.notesEnglish || "",
                  notesGujarati: notesData.notesGujarati || "",
                  notesHindi: notesData.notesHindi || "",
                }
              : row
          )
        );
      }
      setIsNotesOpen(false);
      setCurrentNoteRowId(null);
    },
    [currentNoteRowId]
  );

  const openMenuReport = useCallback(() => {
    setMenuReportEventId(eventId);
    setIsMenuReport(true);
  }, [eventId]);

  const openSelectMenureport = useCallback(() => {
    setMenuReportEventId(eventId);
    setIsSelectMenuReport(true);
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const handleAddLabourType = async (newCategory) => {
    const category = {
      id: newCategory.id || Date.now(), // ID returned by API
      nameEnglish: newCategory.nameEnglish,
      contactType: { nameEnglish: LABOUR_TYPE },
    };

    setLabourCategories((prev) => [...prev, category]);

    // Fetch contacts for this new category
    try {
      const res = await GetPartyMasterByCatId(category.id, userId);
      const contacts = res?.data?.data?.["Party Details"] || [];
      setAllContacts((prev) => ({ ...prev, [category.id]: contacts }));
    } catch (err) {
      console.error("Failed to fetch contacts for new category", err);
      setAllContacts((prev) => ({ ...prev, [category.id]: [] }));
    }

    // Add new row with this category pre-selected
    setLabourData((prev) => [
      ...prev,
      createEmptyLabourRow(category.nameEnglish),
    ]);
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <div className="flex justify-between items-center mb-4">
            {/* LEFT: Page Title + 3 Custom Buttons */}
            <div className="flex items-center gap-6">
              <h2 className="text-xl text-black font-semibold">
                5. Agency Distribution
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
              </div>
            </div>
          </div>
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
                  value={eventData?.venue?.nameEnglish}
                />
                <EventInfoItem
                  icon="ki-calendar-tick"
                  label="Event Date Time"
                  value={eventData?.eventStartDateTime}
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              className={`text-sm px-3 py-2 rounded-md transition
    ${
      hasUnsavedChanges && !isSaving
        ? "bg-[#005BA8] text-white"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
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
                  setActiveTab(fn.id);
                  setActiveFunctionName(fn.function?.nameEnglish);
                  setSelectedFunctionPax(fn.pax || 0);
                }}
                className={`px-8 py-3 text-sm font-medium transition-all duration-200 
                  ${activeTab === fn.id ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}
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
                  onClick={openSelectMenureport}
                  className="btn btn-success btn-sm h-10"
                >
                  <i className="ki-filled ki-document"></i>
                  Report
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
            hasUnsavedChanges={hasUnsavedChanges}
            isSaving={isSaving} // 🔥 Add this
            filteredContacts={filteredContacts}
            shiftOptions={shiftOptions}
            eventData={eventData}
            onRowChange={handleRowChange}
            onLabourTypeChange={handleLabourTypeChange}
            onContactChange={handleContactChange}
            onDelete={deleteRow}
            onAddRow={addLabourRow}
            onViewDetails={(row) => {
              setSelectedRow(row);
              setIsLabourSidebarOpen(true);
            }}
            onAddNotes={(row) => {
              setCurrentNoteRowId(row.id);
              setIsNotesOpen(true);
            }}
            setSelectedRow={setSelectedRow}
            onSave={handleSave}
            onOpenAddLabourModal={() => setIsAddLabourModalOpen(true)}
            onOpenAddVendor={() => setIsAddVendorOpen(true)}
          />
        )}

        {/* Extra Expense Table */}

        {/* Modals */}
        <AddNotes
          isOpen={isNotesOpen}
          onClose={() => {
            setIsNotesOpen(false);
            setCurrentNoteRowId(null);
          }}
          initialNotes={
            currentNoteRowId !== null
              ? {
                  notesEnglish:
                    labourData.find((row) => row.id === currentNoteRowId)
                      ?.notesEnglish || "",
                  notesGujarati:
                    labourData.find((row) => row.id === currentNoteRowId)
                      ?.notesGujarati || "",
                  notesHindi:
                    labourData.find((row) => row.id === currentNoteRowId)
                      ?.notesHindi || "",
                }
              : { notesEnglish: "", notesGujarati: "", notesHindi: "" }
          }
          onSave={handleSaveNotes}
        />

        <LabourDetailSidebar
          isOpen={isLabourSidebarOpen}
          onClose={() => setIsLabourSidebarOpen(false)}
          eventFunctionId={activeFunction?.id}
          eventId={eventData?.id}
          contactId={selectedRow?.contactId || null}
        />

        {isExtraExpenseModalOpen && (
          <AddExtraExpense
            isOpen={isExtraExpenseModalOpen}
            onClose={closeModal}
            eventData={{
              ...eventData,
              eventFunctionId: activeFunction?.id,
              eventId: eventData?.id,
            }}
            selectedMeal={selectedExpense}
            refreshData={refetchExpenses}
          />
        )}

        <SelectMenureport
          isSelectMenureport={isSelectMenureport}
          setIsSelectMenuReport={setIsSelectMenuReport}
          onConfirm={() => {
            setIsSelectMenuReport(false);
            setIsMenuReport(true);
          }}
        />
        {/* Add Labour Type Modal */}
        {isAddLabourModalOpen && (
          <AddContactCategory
            isOpen={isAddLabourModalOpen}
            onClose={() => setIsAddLabourModalOpen(false)}
            refreshData={() => {}}
            contactCategory={null} // Adding new
            labourOnly={true}
            onSave={(newCategory) => {
              handleAddLabourType(newCategory);
              setIsAddLabourModalOpen(false);
            }}
          />
        )}

        <AddVendor
          isModalOpen={isAddVendorOpen}
          isModalClose={setIsAddVendorOpen}
          filterType="labour"
          setIsModalOpen={setIsAddVendorOpen}
          refreshData={() => {}}
        />

        <MenuReport
          isModalOpen={isMenuReport}
          setIsModalOpen={setIsMenuReport}
          eventId={menuReportEventId}
        />
      </Container>
      {isSaving && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className=" rounded-lg p-8  flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-white">Saving...</p>
              <p className="text-sm text-gray-500">Please wait</p>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

// Sub-components
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
  onContactChange,
  onDelete,
  onAddRow,
  onViewDetails,
  onAddNotes,
  onSave,
  isSaving,
  hasUnsavedChanges,
  onOpenAddLabourModal,
  onOpenAddVendor,
}) => (
  <div className="card shadow-sm rounded-lg overflow-hidden">
    <div className="card-body p-0">
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-center px-3 py-2 w-12">#</th>
              <th className="px-3 py-2">
                <div className="flex items-center justify-between">
                  Categories
                  <button
                    type="button"
                    className="ml-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full px-2 py-1 text-sm"
                    title="Add Labour Type"
                    onClick={onOpenAddLabourModal}
                  >
                    +
                  </button>
                </div>
              </th>
              <th className="px-3 py-2 w-24">
                <div className="flex items-center justify-between">
                  Vendors
                  <button
                    type="button"
                    className="ml-2 text-white bg-blue-500 hover:bg-blue-600 rounded-full px-2 py-1 text-sm"
                    title="Add Vendor"
                    onClick={onOpenAddVendor}
                  >
                    +
                  </button>
                </div>
              </th>
              <th className="px-3 py-2 w-36">Labour Shift</th>
              <th className="px-3 py-2 w-40">Date & Time</th>
              <th className="px-3 py-2 w-24">Price</th>
              <th className="px-3 py-2 w-24">Qty</th>
              <th className="px-3 py-2 w-28">Total Price</th>
              <th className="px-3 py-2 w-32">Place</th>
              <th className="px-3 py-2 text-center w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <LabourRow
                key={row.id}
                row={row}
                index={index}
                labourCategories={labourCategories}
                filteredContacts={filteredContacts}
                eventData={eventData}
                shiftOptions={shiftOptions}
                onRowChange={onRowChange}
                onLabourTypeChange={onLabourTypeChange}
                onContactChange={onContactChange}
                onDelete={onDelete}
                onViewDetails={onViewDetails}
                onAddNotes={onAddNotes}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t flex flex-col md:flex-row justify-between items-center gap-3">
        <button
          onClick={onAddRow}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <i className="ki-filled ki-plus text-white"></i>
          Add Another Labour Type
        </button>

        <button
          onClick={onSave}
          disabled={!hasUnsavedChanges || isSaving}
          className={`px-4 py-2 rounded-md transition
    ${
      hasUnsavedChanges && !isSaving
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
        >
          Save
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
  onContactChange,
  onDelete,
  onViewDetails,
  onAddNotes,
}) => (
  <tr className="border-t">
    <td className="text-center !px-[3px]">{index + 1}.</td>
    <td className="!px-[3px]">
      {console.log("🔽 Dropdown Labour Categories:", labourCategories)}
      <Select
        className="custom-select-sm"
        showSearch
        placeholder="Select Labour Type"
        value={row.labourType || undefined}
        onChange={(value) => onLabourTypeChange(row.id, value)}
        style={{ width: "100%" }}
      >
        {labourCategories.map((item) => {
          console.log(
            "📌 Option:",
            item.nameEnglish,
            "| Contact Type:",
            item?.contactType?.nameEnglish
          );
          return (
            <Select.Option key={item.id} value={item.nameEnglish}>
              {item.nameEnglish}
            </Select.Option>
          );
        })}
      </Select>
    </td>
    <td className="!px-[3px]">
      <Select
        className="custom-select-sm"
        showSearch
        placeholder="Select Contact"
        value={row.contact || undefined}
        onChange={(value) => onContactChange(row.id, value)}
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
      <div className="flex items-center justify-center">
        <button
          className="btn btn-sm btn-icon btn-clear"
          onClick={() => onViewDetails(row)}
        >
          <i className="ki-filled ki-eye text-success"></i>
        </button>
        <button
          className="btn btn-sm btn-icon btn-clear"
          onClick={() => onAddNotes(row)}
        >
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
