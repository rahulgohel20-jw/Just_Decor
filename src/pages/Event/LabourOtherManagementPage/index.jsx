import { Fragment, useState, useEffect, useMemo, useCallback } from "react";
import { Container } from "@/components/container";
import { Select } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { useExtraExpense } from "./hooks/useExtraExpense";
import AddContactName from "@/pages/master/MenuItemMaster/components/AddContactName";
import AddLabourshift from "@/partials/modals/add-labour-shift/AddLabourshift";
import PlaceSelect from "../../../components/PlaceSelect/PlaceSelect";
import { FormattedMessage } from "react-intl";

import {
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  Eye,
  FileText,
} from "lucide-react";
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
const SHIFTS = [];

// Utility functions
const parseDate = (date, fallbackDate) => {
  const parsed = dayjs(
    date,
    ["DD/MM/YYYY hh:mm A", "YYYY-MM-DD HH:mm:ss"],
    true,
  );
  return parsed.isValid()
    ? parsed.format("DD/MM/YYYY hh:mm A")
    : fallbackDate
      ? dayjs(fallbackDate).format("DD/MM/YYYY hh:mm A")
      : "";
};

const createEmptyLabourRow = (labourType = "") => ({
  id: `local-${Date.now()}`,
  isSaved: false,
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

const LabourOtherManagementPage = ({ mode }) => {
  let { eventId } = useParams();
  const navigate = useNavigate();

  const storedUser = useMemo(
    () => JSON.parse(localStorage.getItem("userData") || "{}"),
    [],
  );
  const [activeFunctionName, setActiveFunctionName] = useState("");
  const [isAddLabourModalOpen, setIsAddLabourModalOpen] = useState(false);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [activeRowId, setActiveRowId] = useState(null);

  const [contactTypeId, setContactTypeId] = useState(2);
  const [concatId, setConcatId] = useState(2);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [activeTab, setActiveTab] = useState(null); // Changed to null initially
  const [activeCategory, setActiveCategory] = useState("Labour");
  const [selectedFunctionPax, setSelectedFunctionPax] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [shiftOptions, setShiftOptions] = useState([]);
  const [selectedcontactType, setSelectedcontactType] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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
  const [isSaving, setIsSaving] = useState(false);
  const [rowCategoryMap, setRowCategoryMap] = useState({});

  const [expandedRows, setExpandedRows] = useState({});
  const [shiftRows, setShiftRows] = useState({});

  const userId = localStorage.getItem("userId");

  const toggleRowExpansion = (rowId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const addShiftToRow = (parentRowId) => {
    const newShiftId = `shift-${Date.now()}`;

    const defaultDateTime = eventData?.eventStartDateTime
      ? dayjs(eventData.eventStartDateTime, "DD/MM/YYYY hh:mm A").format(
          "DD/MM/YYYY hh:mm A",
        )
      : dayjs().format("DD/MM/YYYY hh:mm A");

    setShiftRows((prev) => ({
      ...prev,
      [parentRowId]: [
        ...(prev[parentRowId] || []),
        {
          id: newShiftId,
          shift: "",
          dateTime: defaultDateTime,
          price: "",
          quantity: "",
          total: "",
          place: "At Venue",
        },
      ],
    }));

    // Auto-expand when adding shift
    setExpandedRows((prev) => ({
      ...prev,
      [parentRowId]: true,
    }));
  };

  const deleteShiftRow = (parentRowId, shiftId) => {
    setShiftRows((prev) => ({
      ...prev,
      [parentRowId]: (prev[parentRowId] || []).filter((s) => s.id !== shiftId),
    }));
  };

  const handleShiftRowChange = (parentRowId, shiftId, field, value) => {
    setHasUnsavedChanges(true);

    setShiftRows((prev) => ({
      ...prev,
      [parentRowId]: (prev[parentRowId] || []).map((shift) => {
        if (shift.id !== shiftId) return shift;

        const updated = { ...shift, [field]: value };

        if (field === "price" || field === "quantity") {
          const price = parseFloat(updated.price || 0);
          const qty = parseFloat(updated.quantity || 0);
          updated.total = price * qty;
        }

        return updated;
      }),
    }));
  };

  const FetchLabourShift = useCallback(async () => {
    try {
      const res = await GetAllLabourShift(userId || 0);

      const apiShifts = res?.data?.data?.["Function Details"] || [];

      const mapped =
        Array.isArray(apiShifts) && apiShifts.length
          ? apiShifts.map((s) => ({
              id: s.id,
              name: s.nameEnglish,
              time: s.shiftTime,
            }))
          : SHIFTS.map((s) => ({ name: s, time: null }));

      setShiftOptions(mapped);
    } catch (err) {
      console.error("Error fetching shifts:", err);
      setShiftOptions(SHIFTS);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      FetchLabourShift();
    }
  }, [userId, FetchLabourShift]);

  const handleOpenAddLabourShift = () => {
    setSelectedcontactType(null); // or existing shift if editing
    setIsContactModalOpen(true);
  };

  const handleVendorAdded = async () => {
    if (!activeRowId) return;

    const categoryId = rowCategoryMap[activeRowId];
    if (!categoryId) return;

    // Refetch vendors for that category
    const res = await GetPartyMasterByCatId(categoryId, userId);
    const updatedContacts = res?.data?.data?.["Party Details"] || [];

    // Update master contacts
    setAllContacts((prev) => ({
      ...prev,
      [categoryId]: updatedContacts,
    }));

    // 🔥 Update dropdown ONLY for active row
    setFilteredContacts((prev) => {
      const updated = { ...prev };
      Object.entries(rowCategoryMap).forEach(([rowId, catId]) => {
        if (catId === categoryId) {
          updated[rowId] = updatedContacts;
        }
      });
      return updated;
    });
  };

  const activeFunction = useMemo(
    () => eventData?.eventFunctions?.find((fn) => fn.id === activeTab),
    [eventData, activeTab],
  );

  const filteredLabourData = useMemo(
    () =>
      labourData.filter((row) => {
        if (!row.labourType || !searchTerm.trim()) return true;
        return row.labourType.toLowerCase().includes(searchTerm.toLowerCase());
      }),
    [labourData, searchTerm],
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
    fetchContactCategories();
  }, [userId]);

  const fetchContactCategories = async () => {
    if (!userId) return;

    try {
      const res = await GetAllContactCategory(userId);

      const allCategories = res?.data?.data?.["Contact Category Details"] || [];

      const labour = allCategories.filter((cat) => {
        const typeName = cat?.contactType?.nameEnglish?.trim()?.toLowerCase();

        return typeName === LABOUR_TYPE;
      });

      setLabourCategories(labour);
    } catch (error) {
      console.error("❌ Error fetching contact categories:", error);
    }
  };

  useEffect(() => {
    const fetchContacts = async () => {
      if (!userId || !labourCategories.length) return;

      try {
        const contactsMap = {};
        await Promise.all(
          labourCategories.map(async (cat) => {
            const res = await GetPartyMasterByCatId(cat.id, userId);
            contactsMap[cat.id] = res?.data?.data?.["Party Details"] || [];
          }),
        );
        setAllContacts(contactsMap);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      }
    };

    fetchContacts();
  }, [labourCategories, userId]);
  // Add this useEffect after setting labourCategories
  useEffect(() => {}, [labourCategories]);
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
              event.eventFunctions[0].function?.nameEnglish,
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
      if (!eventData || !activeTab) return;

      const functionObj = eventData.eventFunctions.find(
        (fn) => fn.id === activeTab,
      );

      if (!functionObj) return;

      try {
        const res = await GetEventLaborDetails(functionObj.id, eventData.id);
        const laborData = res?.data?.data?.eventLabor || [];

        const categoryMap = {};
        const contactMap = {};
        const formattedRows = [];
        const newShiftRows = {};

        // ✅ Process each labor entry with nested shifts
        laborData.forEach((item) => {
          const rowId = `server-${item.id}`;

          // Store category and contact mappings
          categoryMap[rowId] = item.labortypeid;
          contactMap[rowId] = allContacts[item.labortypeid] || [];

          // Create parent row (one per labor type + contact combination)
          formattedRows.push({
            id: rowId,
            isSaved: true,
            labourType:
              item.labortypename ||
              labourCategories.find((c) => c.id === item.labortypeid)
                ?.nameEnglish ||
              "",
            contact:
              item.contactname ||
              Object.values(allContacts)
                .flat()
                .find((c) => c.id === item.contactid)?.nameEnglish ||
              "",
            contactId: item.contactid,
            notesEnglish: item.labourShift?.[0]?.notesEnglish || "",
            notesGujarati: item.labourShift?.[0]?.notesGujarati || "",
            notesHindi: item.labourShift?.[0]?.notesHindi || "",
          });

          // ✅ Create shift rows from nested labourShift array
          if (item.labourShift && Array.isArray(item.labourShift)) {
            newShiftRows[rowId] = item.labourShift.map((shift, index) => ({
              id: `shift-${item.id}-${index}`,
              shift: shift.laborshift || "",
              dateTime: parseDate(
                shift.labordatetime,
                eventData?.eventStartDateTime,
              ),
              price: shift.price || "",
              quantity: shift.qty || "",
              total: shift.totalprice || "",
              place: shift.place || "At Venue",
            }));
          }
        });

        // ✅ Update all states
        setLabourData(formattedRows);
        setRowCategoryMap(categoryMap);
        setFilteredContacts(contactMap);
        setShiftRows(newShiftRows); // ✅ Set the shift rows!

        // ✅ Auto-expand rows that have shifts
        // const expandedState = {};
        // Object.keys(newShiftRows).forEach((rowId) => {
        //   if (newShiftRows[rowId]?.length > 0) {
        //     expandedState[rowId] = true;
        //   }
        // });
        // setExpandedRows(expandedState);
      } catch (err) {
        console.error("Error fetching labour details:", err);
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
  }, [eventData, activeTab, labourCategories, allContacts]);

  useEffect(() => {
    setFilteredContacts((prev) => {
      const updated = { ...prev };

      Object.entries(rowCategoryMap).forEach(([rowId, categoryId]) => {
        updated[rowId] = allContacts[categoryId] || [];
      });

      return updated;
    });
  }, [allContacts, rowCategoryMap]);

  const handleRowChange = useCallback((id, field, value) => {
    setHasUnsavedChanges(true);

    setLabourData((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        const updated = { ...row, [field]: value };

        if (field === "price" || field === "quantity") {
          const price = parseFloat(updated.price || 0);
          const qty = parseFloat(updated.quantity || 0);
          updated.total = price * qty;
        }

        return updated;
      }),
    );
  }, []);

  const checkDuplicateVendor = useCallback(
    (rowId, categoryId, contactId) => {
      if (!categoryId || !contactId) return false;

      const duplicate = labourData.some((row) => {
        if (row.id === rowId) return false;

        const rowCategoryId = rowCategoryMap[row.id];
        return rowCategoryId === categoryId && row.contactId === contactId;
      });

      return duplicate;
    },
    [labourData, rowCategoryMap],
  );

  const handleContactChange = useCallback(
    (rowId, contactName) => {
      setHasUnsavedChanges(true);

      const row = labourData.find((r) => r.id === rowId);
      const contactList = filteredContacts[rowId] || [];
      const selectedContact = contactList.find(
        (c) => c.nameEnglish === contactName,
      );

      // ✅ Check for duplicate before updating
      const categoryId = rowCategoryMap[rowId];
      if (selectedContact && categoryId) {
        const isDuplicate = checkDuplicateVendor(
          rowId,
          categoryId,
          selectedContact.id,
        );

        if (isDuplicate) {
          Swal.fire({
            icon: "warning",
            title: "Duplicate Entry",
            text: "This vendor is already added for this category!",
            confirmButtonColor: "#005BA8",
          });

          // ✅ CLEAR THE CONTACT FIELD
          setLabourData((prev) =>
            prev.map((r) =>
              r.id === rowId ? { ...r, contact: "", contactId: null } : r,
            ),
          );
          return;
        }
      }

      setLabourData((prev) =>
        prev.map((r) =>
          r.id === rowId
            ? {
                ...r,
                contact: contactName,
                contactId: selectedContact?.id || null,
              }
            : r,
        ),
      );
    },
    [labourData, filteredContacts, rowCategoryMap, checkDuplicateVendor],
  );

  const addLabourRow = useCallback(() => {
    setHasUnsavedChanges(true);
    setLabourData((prev) => [...prev, createEmptyLabourRow()]);
  }, []);

  const deleteRow = useCallback((id) => {
    setHasUnsavedChanges(true);
    setLabourData((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const handleLabourTypeChange = useCallback(
    (rowId, value) => {
      setHasUnsavedChanges(true);

      const selectedCategory = labourCategories.find(
        (c) => c.nameEnglish === value,
      );

      // ✅ Check if changing category creates a duplicate with existing contact
      const currentRow = labourData.find((r) => r.id === rowId);
      if (currentRow?.contactId && selectedCategory?.id) {
        const isDuplicate = checkDuplicateVendor(
          rowId,
          selectedCategory.id,
          currentRow.contactId,
        );

        if (isDuplicate) {
          Swal.fire({
            icon: "warning",
            title: "Duplicate Entry",
            text: "This category + vendor combination already exists! The vendor will be cleared.",
            confirmButtonColor: "#005BA8",
          });

          // Clear the contact when category creates duplicate
          setRowCategoryMap((prev) => ({
            ...prev,
            [rowId]: selectedCategory?.id,
          }));

          setLabourData((prev) =>
            prev.map((r) =>
              r.id === rowId
                ? { ...r, labourType: value, contact: "", contactId: null }
                : r,
            ),
          );

          setFilteredContacts((prev) => ({
            ...prev,
            [rowId]: allContacts[selectedCategory?.id] || [],
          }));

          return;
        }
      }

      setRowCategoryMap((prev) => ({
        ...prev,
        [rowId]: selectedCategory?.id,
      }));

      setLabourData((prev) =>
        prev.map((r) =>
          r.id === rowId
            ? { ...r, labourType: value, contact: "", contactId: null }
            : r,
        ),
      );

      setFilteredContacts((prev) => ({
        ...prev,
        [rowId]: allContacts[selectedCategory?.id] || [],
      }));
    },
    [labourCategories, allContacts, labourData, checkDuplicateVendor],
  );

  const handleSave = useCallback(async () => {
    if (!eventData || !activeFunction) {
      Swal.fire({
        icon: "warning",
        title: "Please select a function before saving!",
      });
      return;
    }

    const seenCombinations = new Set();
    const duplicates = [];

    labourData.forEach((row) => {
      if (!row.contactId || !row.labourType) return;

      const categoryId = rowCategoryMap[row.id];
      const key = `${categoryId}-${row.contactId}`;

      if (seenCombinations.has(key)) {
        duplicates.push(`${row.labourType} - ${row.contact}`);
      } else {
        seenCombinations.add(key);
      }
    });

    if (duplicates.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Duplicate Entries Found",
        html: `The following combinations are duplicated:<br><br>${duplicates.map((d) => `• ${d}`).join("<br>")}`,
        confirmButtonColor: "#005BA8",
      });
      return;
    }

    // Group shifts by contactId and labortypeid
    const groupedLabor = {};

    labourData.forEach((row) => {
      const selectedCategory = labourCategories.find(
        (c) => c.nameEnglish === row.labourType,
      );

      if (!selectedCategory || !row.contactId) return;

      const shifts = shiftRows[row.id] || [];
      if (shifts.length === 0) return;

      // Create unique key for grouping
      const key = `${row.contactId}-${selectedCategory.id}`;

      if (!groupedLabor[key]) {
        groupedLabor[key] = {
          contactid: row.contactId,
          labortypeid: selectedCategory.id,
          labourShift: [],
        };
      }

      shifts.forEach((shift) => {
        let formattedDateTime = "";

        if (shift.dateTime) {
          const parsed = dayjs(shift.dateTime, "DD/MM/YYYY hh:mm A", true);

          if (parsed.isValid()) {
            formattedDateTime = parsed.format("DD/MM/YYYY hh:mm A");
          } else {
            const isoDate = dayjs(shift.dateTime);
            if (isoDate.isValid()) {
              formattedDateTime = isoDate.format("DD/MM/YYYY hh:mm A");
            }
          }
        }

        groupedLabor[key].labourShift.push({
          labordatetime: formattedDateTime || "",
          laborshift: shift.shift || "",
          place: shift.place || "At Venue",
          price: parseFloat(shift.price || 0),
          qty: parseFloat(shift.quantity || 0),
          totalprice: parseFloat(shift.total || 0),
          notesEnglish: row.notesEnglish || "",
          notesGujarati: row.notesGujarati || "",
          notesHindi: row.notesHindi || "",
        });
      });
    });

    const payload = {
      eventFunctionId: activeFunction.id,
      eventId: eventData.id,
      eventLaborDetails: Object.values(groupedLabor),
    };

    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    try {
      setIsSaving(true);

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

        if (activeFunction && eventData) {
          const laborRes = await GetEventLaborDetails(
            activeFunction.id,
            eventData.id,
          );
          const laborData = laborRes?.data?.data?.eventLabor || [];

          const categoryMap = {};
          const contactMap = {};
          const formattedRows = [];
          const newShiftRows = {};

          laborData.forEach((item) => {
            const rowId = `server-${item.id}`;

            categoryMap[rowId] = item.labortypeid;
            contactMap[rowId] = allContacts[item.labortypeid] || [];

            formattedRows.push({
              id: rowId,
              isSaved: true,
              labourType:
                item.labortypename ||
                labourCategories.find((c) => c.id === item.labortypeid)
                  ?.nameEnglish ||
                "",
              contact:
                item.contactname ||
                Object.values(allContacts)
                  .flat()
                  .find((c) => c.id === item.contactid)?.nameEnglish ||
                "",
              contactId: item.contactid,
              notesEnglish: item.labourShift?.[0]?.notesEnglish || "",
              notesGujarati: item.labourShift?.[0]?.notesGujarati || "",
              notesHindi: item.labourShift?.[0]?.notesHindi || "",
            });

            if (item.labourShift && Array.isArray(item.labourShift)) {
              newShiftRows[rowId] = item.labourShift.map((shift, index) => ({
                id: `shift-${item.id}-${index}`,
                shift: shift.laborshift || "",
                dateTime: parseDate(
                  shift.labordatetime,
                  eventData?.eventStartDateTime,
                ),
                price: shift.price || "",
                quantity: shift.qty || "",
                total: shift.totalprice || "",
                place: shift.place || "At Venue",
              }));
            }
          });

          setLabourData(formattedRows);
          setRowCategoryMap(categoryMap);
          setFilteredContacts(contactMap);
          setShiftRows(newShiftRows);
          // Auto-expand rows with shifts
          // const expandedState = {};
          // Object.keys(newShiftRows).forEach((rowId) => {
          //   if (newShiftRows[rowId]?.length > 0) {
          //     expandedState[rowId] = true;
          //   }
          // });
          // setExpandedRows(expandedState);
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
      setIsSaving(false);
    }
  }, [
    eventData,
    activeFunction,
    labourData,
    labourCategories,
    allContacts,
    shiftRows,
  ]);

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
              : row,
          ),
        );
      }
      setIsNotesOpen(false);
      setCurrentNoteRowId(null);
    },
    [currentNoteRowId],
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
      id: newCategory.id,
      nameEnglish: newCategory.nameEnglish,
      contactType: { nameEnglish: LABOUR_TYPE },
    };

    setLabourCategories((prev) => [...prev, category]);

    let contacts = [];
    try {
      const res = await GetPartyMasterByCatId(category.id, userId);
      contacts = res?.data?.data?.["Party Details"] || [];
    } catch (e) {
      console.error(e);
    }

    setAllContacts((prev) => ({
      ...prev,
      [category.id]: contacts,
    }));

    if (activeRowId) {
      const currentRow = labourData.find((r) => r.id === activeRowId);
      if (currentRow && !currentRow.labourType) {
        setRowCategoryMap((prev) => ({
          ...prev,
          [activeRowId]: category.id,
        }));

        setLabourData((prev) =>
          prev.map((r) =>
            r.id === activeRowId
              ? { ...r, labourType: category.nameEnglish }
              : r,
          ),
        );

        setFilteredContacts((prev) => ({
          ...prev,
          [activeRowId]: contacts,
        }));
      }
    }
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
                <FormattedMessage
                  id="AGENCY_DISTRIBUTION.TITLE"
                  defaultMessage="5. Agency Distribution"
                />
              </h2>

              {/* ONLY FOR THIS SCREEN */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/menu-preparation/${eventId}`)}
                  className="btn btn-light text-white bg-primary font-semibold hover:!bg-primary hover:!text-white hover:!border-primary"
                >
                  <i
                    className="ki-filled ki-menu"
                    style={{ color: "white" }}
                  ></i>{" "}
                  <FormattedMessage
                    id="MENU_PLANNING.BUTTON"
                    defaultMessage="2. Menu Planning"
                  />
                </button>

                <button
                  onClick={() => navigate(`/menu-allocation/${eventId}`)}
                  className="btn btn-light text-white bg-primary font-semibold hover:!bg-primary hover:!text-white hover:!border-primary"
                >
                  <i
                    className="ki-filled ki-menu"
                    style={{ color: "white" }}
                  ></i>{" "}
                  <FormattedMessage
                    id="MENU_EXECUTION.BUTTON"
                    defaultMessage="3. Menu Execution"
                  />
                </button>

                <button
                  className="btn btn-light text-white bg-primary font-semibold hover:!bg-primary hover:!text-white hover:!border-primary"
                  onClick={() =>
                    navigate(`/raw-material-allocation/${eventId}`)
                  }
                >
                  <i
                    className="ki-filled ki-gift"
                    style={{ color: "white" }}
                  ></i>{" "}
                  <FormattedMessage
                    id="RAW_MATERIAL_DISTRIBUTION.BUTTON"
                    defaultMessage="4. Raw Material Distribution"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Event Info Card */}
        <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            {/* ROW 1 */}
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
                  {eventData?.eventType?.nameEnglish || "-"}
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

            {/* FORCE NEW ROW */}
            <div className="w-full h-0"></div>

            {/* ROW 2 LEFT — Event Venue */}
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

            {/* ROW 2 RIGHT — Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-gray-200">
              {/* Report Button */}
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
                <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
              </button>
            </div>
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
                  <FormattedMessage
                    id="COMMON.PERSON"
                    defaultMessage="Person"
                  />
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
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.REPORT"
                    defaultMessage="Report"
                  />
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
            isSaving={isSaving}
            filteredContacts={filteredContacts}
            shiftOptions={shiftOptions}
            eventData={eventData}
            shiftRows={shiftRows}
            expandedRows={expandedRows}
            setExpandedRows={setExpandedRows}
            onShiftRowChange={handleShiftRowChange}
            onAddShiftToRow={addShiftToRow}
            onDeleteShiftRow={deleteShiftRow}
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
            setActiveRowId={setActiveRowId}
            onSave={handleSave}
            onOpenAddLabourModal={() => setIsAddLabourModalOpen(true)}
            onOpenAddVendor={() => {
              if (!activeRowId && labourData.length) {
                setActiveRowId(labourData[labourData.length - 1].id);
              }
              setIsMemberModalOpen(true);
            }}
            onOpenAddLabourShift={handleOpenAddLabourShift}
          />
        )}

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
          setEventFunctionId={activeFunction?.id}
          mode={mode}
        />
        {isAddLabourModalOpen && (
          <AddContactCategory
            isOpen={isAddLabourModalOpen}
            onClose={() => {
              setIsAddLabourModalOpen(false);
            }}
            refreshData={fetchContactCategories}
            contactCategory={null}
            labourOnly={true}
            onSave={(newCategory) => {
              handleAddLabourType(newCategory);
              setIsAddLabourModalOpen(false);
            }}
          />
        )}

        <AddContactName
          isModalOpen={isMemberModalOpen}
          setIsModalOpen={setIsMemberModalOpen}
          concatId={concatId}
          contactTypeId={contactTypeId}
          refreshData={handleVendorAdded}
        />
        <AddLabourshift
          isOpen={isContactModalOpen}
          onClose={() => {
            setIsContactModalOpen(false);
          }}
          shiftData={selectedcontactType}
          refreshData={FetchLabourShift}
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
  shiftRows,
  expandedRows,
  setExpandedRows,
  onShiftRowChange,
  onAddShiftToRow,
  onDeleteShiftRow,
  onRowChange,
  onLabourTypeChange,
  onContactChange,
  onDelete,
  onAddRow,
  onViewDetails,
  onAddNotes,
  setActiveRowId,
  onSave,
  isSaving,
  hasUnsavedChanges,
  onOpenAddLabourModal,
  onOpenAddVendor,
  onOpenAddLabourShift,
}) => {
  const toggleRowExpansion = (rowId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  // Calculate totals for parent row
  const calculateRowTotals = (rowId) => {
    const shifts = shiftRows[rowId] || [];
    const totalQty = shifts.reduce(
      (sum, s) => sum + (parseFloat(s.quantity) || 0),
      0,
    );
    const totalCost = shifts.reduce(
      (sum, s) => sum + (parseFloat(s.total) || 0),
      0,
    );
    return { totalQty, totalCost };
  };
  // const [expandedRows, setExpandedRows] = useState({});
  // const [shiftRows, setShiftRows] = useState({});

  // const toggleRowExpansion = (rowId) => {
  //   setExpandedRows((prev) => ({
  //     ...prev,
  //     [rowId]: !prev[rowId],
  //   }));
  // };

  // const addShiftToRow = (parentRowId) => {
  //   const newShiftId = `shift-${Date.now()}`;
  //   setShiftRows((prev) => ({
  //     ...prev,
  //     [parentRowId]: [
  //       ...(prev[parentRowId] || []),
  //       {
  //         id: newShiftId,
  //         shift: "",
  //         dateTime: "",
  //         price: "",
  //         quantity: "",
  //         total: "",
  //         place: "At Venue",
  //       },
  //     ],
  //   }));

  //   // Auto-expand when adding shift
  //   setExpandedRows((prev) => ({
  //     ...prev,
  //     [parentRowId]: true,
  //   }));
  // };

  // const deleteShiftRow = (parentRowId, shiftId) => {
  //   setShiftRows((prev) => ({
  //     ...prev,
  //     [parentRowId]: (prev[parentRowId] || []).filter((s) => s.id !== shiftId),
  //   }));
  // };

  // const handleShiftRowChange = (parentRowId, shiftId, field, value) => {
  //   setShiftRows((prev) => ({
  //     ...prev,
  //     [parentRowId]: (prev[parentRowId] || []).map((shift) => {
  //       if (shift.id !== shiftId) return shift;

  //       const updated = { ...shift, [field]: value };

  //       if (field === "price" || field === "quantity") {
  //         const price = parseFloat(updated.price || 0);
  //         const qty = parseFloat(updated.quantity || 0);
  //         updated.total = price * qty;
  //       }

  //       return updated;
  //     }),
  //   }));
  // };

  // Calculate totals for parent row
  // const calculateRowTotals = (rowId) => {
  //   const shifts = shiftRows[rowId] || [];
  //   const totalQty = shifts.reduce(
  //     (sum, s) => sum + (parseFloat(s.quantity) || 0),
  //     0,
  //   );
  //   const totalCost = shifts.reduce(
  //     (sum, s) => sum + (parseFloat(s.total) || 0),
  //     0,
  //   );
  //   return { totalQty, totalCost };
  // };

  return (
    <div className="space-y-4">
      <div className="card shadow-sm rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
        <div className="p-4">
          <div className="grid grid-cols-12 gap-3 items-center">
            <div className="col-span-1 text-center font-semibold text-gray-700">
              #
            </div>

            <div className="col-span-3 font-semibold text-gray-700 flex items-center gap-2">
              Category
              <button
                onClick={onOpenAddLabourModal}
                className="flex-shrink-0"
                title="Add Category"
              >
                <Plus className="w-5 h-5 text-white bg-primary rounded-full p-0.5" />
              </button>
            </div>

            <div className="col-span-3 font-semibold text-gray-700 flex items-center gap-2">
              Vendors
              <button
                onClick={onOpenAddVendor}
                className="flex-shrink-0"
                title="Add Vendor"
              >
                <Plus className="w-5 h-5 text-white bg-primary rounded-full p-0.5" />
              </button>
            </div>

            <div className="col-span-1 text-center font-semibold text-gray-700">
              Total Qty
            </div>
            <div className="col-span-2 text-center font-semibold text-gray-700">
              Estimated Cost
            </div>
            <div className="col-span-2 text-center font-semibold text-gray-700">
              Actions
            </div>
          </div>
        </div>
      </div>
      {data.map((row, index) => {
        const isExpanded = expandedRows[row.id];
        const shifts = shiftRows[row.id] || [];
        const { totalQty, totalCost } = calculateRowTotals(row.id);

        return (
          <div
            key={row.id}
            className="card shadow-sm rounded-lg overflow-hidden border border-gray-200"
          >
            {/* Parent Row */}
            <div className="bg-white p-4">
              <div className="grid grid-cols-12 gap-3 items-center">
                {/* # */}
                <div className="col-span-1 text-center font-medium">
                  {index + 1}.
                </div>

                {/* Category */}
                <div className="col-span-3">
                  <Select
                    className="custom-select-sm w-full"
                    showSearch
                    onFocus={() => setActiveRowId(row.id)}
                    placeholder="Select Category"
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
                </div>

                {/* Vendors */}
                <div className="col-span-3">
                  <Select
                    className="custom-select-sm w-full"
                    onFocus={() => setActiveRowId(row.id)}
                    showSearch
                    placeholder="Select Vendor"
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
                </div>

                {/* Total Qty */}
                <div className="col-span-1 text-center">
                  <input
                    type="text"
                    className="input input-sm w-full text-center bg-gray-50"
                    value={totalQty || "0"}
                    readOnly
                  />
                </div>

                {/* Estimated Cost */}
                <div className="col-span-2">
                  <input
                    type="text"
                    className="input text-green-700 input-sm w-full text-center bg-gray-50"
                    value={totalCost ? `₹ ${totalCost.toLocaleString()}` : "0"}
                    readOnly
                  />
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <button
                    className="p-2 hover:bg-red-100 rounded-full transition"
                    onClick={() => onDelete(row.id)}
                    title="Delete Category"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                  <button
                    onClick={() => toggleRowExpansion(row.id)}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Expanded Shift Rows */}{" "}
            {isExpanded && (
              <div className="bg-gray-50 border-t border-gray-200">
                {/* Header */}
                <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-gray-100 border-b border-gray-200">
                  <div className="col-span-1"></div>
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                      Labour Shift
                    </span>
                    <button
                      onClick={onOpenAddLabourShift}
                      className="flex-shrink-0"
                    >
                      <Plus className="w-5 h-5 text-white bg-blue-600 rounded-full p-0.5" />
                    </button>
                  </div>
                  <div className="col-span-2 text-sm font-semibold text-gray-700">
                    Date & Time
                  </div>
                  <div className="col-span-1 text-sm text-center font-semibold text-gray-700">
                    Price
                  </div>
                  <div className="col-span-1 text-sm text-center font-semibold text-gray-700">
                    Qty.
                  </div>
                  <div className="col-span-2 text-sm text-center font-semibold text-gray-700">
                    Total
                  </div>
                  <div className="col-span-2 text-sm text-center font-semibold text-gray-700">
                    Actions
                  </div>
                </div>

                {/* Shift Rows */}
                {shifts.map((shift, shiftIndex) => (
                  <ShiftRow
                    key={shift.id}
                    shift={shift}
                    shiftIndex={shiftIndex}
                    parentRowId={row.id}
                    shiftOptions={shiftOptions}
                    eventData={eventData}
                    onShiftChange={onShiftRowChange} // ✅ Use prop
                    onDelete={onDeleteShiftRow} // ✅ Use prop
                    onViewDetails={onViewDetails}
                    onAddNotes={onAddNotes}
                    row={row}
                  />
                ))}
                {/* Add Shift Button */}
                <div className="px-4 py-4 bg-white">
                  <button
                    onClick={() => onAddShiftToRow(row.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md  transition text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Shift
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add Another Labor Category Button */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onAddRow}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md  transition"
        >
          <Plus className="w-4 h-4" />
          Add Another Labor Category
        </button>

        <button
          onClick={onSave}
          disabled={!hasUnsavedChanges || isSaving}
          className={`px-6 py-2 rounded-md transition ${
            hasUnsavedChanges && !isSaving
              ? "bg-primary text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
};

const ShiftRow = ({
  shift,
  shiftIndex,
  parentRowId,
  shiftOptions,
  eventData,
  onShiftChange,
  onDelete,
  onViewDetails,
  onAddNotes,
  row,
}) => {
  const parseDateToObject = (dateString) => {
    if (!dateString) return null;
    const parsed = dayjs(dateString, "DD/MM/YYYY hh:mm A", true);
    return parsed.isValid() ? parsed.toDate() : null;
  };

  const getDateValue = () => {
    if (shift.dateTime) return parseDateToObject(shift.dateTime);
    if (eventData?.eventStartDateTime)
      return parseDateToObject(eventData.eventStartDateTime);
    return null;
  };

  return (
    <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-white border-b border-gray-200 items-center hover:bg-gray-50 transition">
      {/* Empty space for # column */}
      <div className="col-span-1"></div>

      {/* Labour Shift - aligns with Category */}
      <div className="col-span-3">
        <select
          className="select select-sm w-full bg-white border-gray-300"
          value={shift.shift}
          onChange={(e) => {
            const selectedShiftName = e.target.value;
            const selectedShift = shiftOptions.find(
              (s) => s.name === selectedShiftName,
            );

            let finalDateTime = "";
            if (eventData?.eventStartDateTime && selectedShift?.time) {
              const [hour, minute] = selectedShift.time.split(":");
              finalDateTime = dayjs(
                eventData.eventStartDateTime,
                "DD/MM/YYYY hh:mm A",
              )
                .hour(Number(hour))
                .minute(Number(minute))
                .second(0)
                .format("DD/MM/YYYY hh:mm A");
            }

            onShiftChange(parentRowId, shift.id, "shift", selectedShiftName);
            onShiftChange(parentRowId, shift.id, "dateTime", finalDateTime);
          }}
        >
          <option value="">Select Shift</option>
          {shiftOptions.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date & Time - aligns with Vendors */}
      <div className="col-span-2">
        <DatePicker
          selected={getDateValue()}
          onChange={(date) => {
            const formattedDate = date
              ? dayjs(date).format("DD/MM/YYYY hh:mm A")
              : "";
            onShiftChange(parentRowId, shift.id, "dateTime", formattedDate);
          }}
          showTimeSelect
          timeFormat="hh:mm aa"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy hh:mm aa"
          className="input input-sm w-full"
          placeholderText="Select date & time"
        />
      </div>

      {/* Price */}
      <div className="col-span-1">
        <input
          type="number"
          className="input input-sm w-full text-center"
          placeholder="0"
          value={shift.price}
          onChange={(e) =>
            onShiftChange(parentRowId, shift.id, "price", e.target.value)
          }
        />
      </div>

      {/* Qty - This will be hidden, combined with Price column */}
      <div className="col-span-1">
        <input
          type="number"
          className="input input-sm w-full text-center"
          placeholder="0"
          value={shift.quantity}
          onChange={(e) =>
            onShiftChange(parentRowId, shift.id, "quantity", e.target.value)
          }
        />
      </div>

      {/* Total - aligns with Estimated Cost (col-span-2) */}
      <div className="col-span-2">
        <input
          type="text"
          className="input input-sm w-full text-center bg-gray-50"
          value={shift.total ? `₹${shift.total.toLocaleString()}` : "₹0"}
          readOnly
        />
      </div>

      {/* Actions - aligns with parent Actions (col-span-2) */}
      <div className="col-span-2 flex items-center justify-center gap-1">
        {/* <button
          className="p-2 hover:bg-gray-200 rounded-full transition"
          onClick={() => onViewDetails({ ...row, ...shift })}
          title="View Details"
        >
          <Eye className="w-4 h-4 text-green-600" />
        </button> */}
        <button
          className="p-2 hover:bg-gray-200 rounded-full transition"
          onClick={() => onAddNotes(row)}
          title="Add Notes"
        >
          <FileText className="w-4 h-4 text-blue-600" />
        </button>
        <button
          className="p-2 hover:bg-gray-200 rounded-full transition"
          title="WhatsApp"
        >
          <svg
            className="w-4 h-4 text-green-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </button>
        <button
          className="p-2 hover:bg-red-100 rounded-full transition"
          onClick={() => onDelete(parentRowId, shift.id)}
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  );
};

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
  setActiveRowId,
  onViewDetails,
  onAddNotes,
}) => {
  // Helper function to parse date string to Date object
  const parseDateToObject = (dateString) => {
    if (!dateString) return null;

    const parsed = dayjs(dateString, "DD/MM/YYYY hh:mm A", true);
    if (parsed.isValid()) {
      return parsed.toDate();
    }

    return null;
  };

  // Get the date value
  const getDateValue = () => {
    if (row.dateTime) {
      return parseDateToObject(row.dateTime);
    }
    if (eventData?.eventStartDateTime) {
      return parseDateToObject(eventData.eventStartDateTime);
    }
    return null;
  };

  return (
    <tr className="border-t">
      <td className="text-center !px-[3px]">{index + 1}.</td>
      <td className="!px-[3px]">
        <Select
          className="custom-select-sm"
          showSearch
          onFocus={() => setActiveRowId(row.id)}
          placeholder="Select Labour Type"
          value={row.labourType || undefined}
          onChange={(value) => onLabourTypeChange(row.id, value)}
          style={{ width: "100%" }}
        >
          {labourCategories.map((item) => {
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
          onFocus={() => setActiveRowId(row.id)}
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
          onChange={(e) => {
            const selectedShiftName = e.target.value;
            const selectedShift = shiftOptions.find(
              (s) => s.name === selectedShiftName,
            );

            let finalDateTime = "";

            if (eventData?.eventStartDateTime && selectedShift?.time) {
              const [hour, minute] = selectedShift.time.split(":");

              finalDateTime = dayjs(
                eventData.eventStartDateTime,
                "DD/MM/YYYY hh:mm A",
              )
                .hour(Number(hour))
                .minute(Number(minute))
                .second(0)
                .format("DD/MM/YYYY hh:mm A");
            }

            onRowChange(row.id, "shift", selectedShiftName);
            onRowChange(row.id, "dateTime", finalDateTime);
          }}
        >
          <option value="">Select Shift</option>
          {shiftOptions.map((shift) => (
            <option key={shift.id} value={shift.name}>
              {shift.name}
            </option>
          ))}
        </select>
      </td>
      <td className="!px-[3px]">
        <DatePicker
          selected={getDateValue()}
          onChange={(date) => {
            const formattedDate = date
              ? dayjs(date).format("DD/MM/YYYY hh:mm A")
              : "";
            onRowChange(row.id, "dateTime", formattedDate);
          }}
          showTimeSelect
          timeFormat="hh:mm aa"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy hh:mm aa"
          className="input input-sm w-full"
          placeholderText="Select date & time"
          popperPlacement="bottom-start"
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
        <PlaceSelect
          value={row.place}
          onChange={(val) => onRowChange(row.id, "place", val)}
        />
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
};

export default LabourOtherManagementPage;
