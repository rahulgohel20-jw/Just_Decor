import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import useStyles from "./style";
import AddGeneralfix from "../../../partials/modals/add-general-agencies-place/AddGeneralfix";
import { DatePicker } from "antd";
import { useParams } from "react-router-dom";
import LabourDetailSidebar from "./LabourSidebar/LabourDetailSidebar";
import { Select } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
import Swal from "sweetalert2";
import AddNotes from "@/partials/modals/add-notes/AddNotes.jsx";
import { GetEventMasterById, GetAllContactCategory, GetPartyMasterByCatTypeId, AddUpdateLabor, GetEventLaborDetails } from "@/services/apiServices";

const LabourOtherManagementPage = () => {
  const classes = useStyles();
  const [selectedFunctionPax, setSelectedFunctionPax] = useState(0);
  const [allContacts, setAllContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState({});
  const unitOptions = ["pcs", "kg", "litre", "meter", "box"];
  const [agencies, setAgencies] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState("Dinner");
  const [data, setData] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Labour");
  const [personCount, setPersonCount] = useState(450);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(false);
const [labourData, setLabourData] = useState([]);
const [generalRawMaterialData, setGeneralRawMaterialData] = useState([]);  const [labourCategories, setLabourCategories] = useState([]);
  

  const [isLabourSidebarOpen, setIsLabourSidebarOpen] = useState(false); 
  const [isGrossaryModalOpen, setIsGrossaryModalOpen] = useState(false); 
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id || eventData?.user?.id || 0;

  const handleSaveNotes = (newNotes) => {
    console.log("📝 Saved Notes:", newNotes);
    setNotes(newNotes);
    setIsNotesOpen(false);
  };

  const handleLabourDetailView = () => {
    setIsLabourSidebarOpen(true);
  };

  const handleGrossaryModalOpen = () => {
    setIsGrossaryModalOpen(true);
  };

  useEffect(() => {
    const fetchContactCategories = async () => {
      try {
        if (!userId) return;
        const res = await GetAllContactCategory(userId);

        const allCategories = res?.data?.data?.["Contact Category Details"] || [];
        const labourCategories = allCategories.filter(
          (cat) =>
            cat?.contactType?.nameEnglish?.trim()?.toLowerCase() === "labour"
        );

        setLabourCategories(labourCategories);
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
        const allContactsMap = {};
        for (const cat of labourCategories) {
          const res = await GetPartyMasterByCatTypeId(cat.id, userId);
          const partyList = res?.data?.data?.["Party Details"] || [];
          allContactsMap[cat.id] = partyList;
        }
        setAllContacts(allContactsMap);
      } catch (err) {
        console.error("❌ Error fetching contacts:", err);
      }
    };

    fetchContacts();
  }, [labourCategories, userId]);

  useEffect(() => {
    const fetchLaborDetails = async () => {
      if (!eventData || !activeTab) {
        return;
      }


      const activeFunction = eventData.eventFunctions?.find(
        (fn) => fn.function?.nameEnglish === activeTab
      );

      if (!activeFunction) {
        return;
      }

      try {
        
        const res = await GetEventLaborDetails(activeFunction.id, eventData.id);


        const laborData = res?.data?.data?.eventLabor || [];

        console.log("📦 All Party Master (Contacts):", allContacts);
        Object.entries(allContacts).forEach(([labourTypeId, contacts]) => {
         
        });

        laborData.forEach((lab) => {
          const matchingContact = allContacts[lab.labortypeid]?.find(
            (c) => c.id === lab.contactid
          );
          console.log(
            matchingContact
              ? `✅ Found: ${matchingContact.nameEnglish}`
              : "❌ Not found in All Party Master"
          );
        });

       const formattedRows = laborData.map((item, index) => {
  // Parse and validate date
  const parsedDate = dayjs(item.labordatetime, ["DD/MM/YYYY hh:mm A", "YYYY-MM-DD HH:mm:ss"], true);
  const isValidDate = parsedDate.isValid();

  return {
    id: index + 1,
    labourType:
      labourCategories.find((c) => c.id === item.labortypeid)?.nameEnglish?.trim() ||
      item.labortypename?.trim() ||
      "",
    contact:
      Object.values(allContacts)
        .flat()
        .find((c) => c.id === item.contactid)?.nameEnglish?.trim() ||
      item.contactname?.trim() ||
      "",
    shift: item.laborshift || "",
    // ✅ If date invalid, use event’s start time or empty string
    dateTime: isValidDate
      ? parsedDate.format("DD/MM/YYYY hh:mm A")
      : eventData?.eventStartDateTime
      ? dayjs(eventData.eventStartDateTime).format("DD/MM/YYYY hh:mm A")
      : "",
    price: item.price || "",
    quantity: item.qty || "",
    total: item.totalprice || "",
    place: item.place || "",
  };
});


        

        setLabourData(
          formattedRows.length
            ? formattedRows
            : [
                {
                  id: 1,
                  labourType: "",
                  contact: "",
                  shift: "",
                  dateTime: dayjs().format("DD/MM/YYYY hh:mm A"),
                  price: "",
                  quantity: "",
                  total: "",
                  place: "",
                },
              ]
        );
      } catch (error) {
        console.error("❌ Error fetching labour details:", error);
      }
    };

    if (
      eventData &&
      activeTab &&
      labourCategories.length > 0 &&
      Object.keys(allContacts).length > 0
    ) {
      fetchLaborDetails();
    }
  }, [eventData, activeTab, labourCategories, allContacts]);

  const addLabourRow = () => {
  const newRow = {
    id: Date.now(), 
    labourType: "",
    contact: "",
    shift: "",
    dateTime: "",
    price: "",
    qty: "",
    totalPrice: "",
    place: "",
  };
  
  if (activeCategory === 'Labour') {
    setLabourData((prev) => [...prev, newRow]);
  } else if (activeCategory === 'General / Fix Raw Material') {
    setGeneralRawMaterialData((prev) => [...prev, newRow]);
  }
};

const deleteRow = (id) => {
  if (activeCategory === 'Labour') {
    setLabourData((prev) => prev.filter((row) => row.id !== id));
  } else if (activeCategory === 'General / Fix Raw Material') {
    setGeneralRawMaterialData((prev) => prev.filter((row) => row.id !== id));
  }
};

const handleRowChange = (id, field, value) => {
  const updateFunction = (prevRows) =>
    prevRows.map((r) => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };

        if (field === "price" || field === "quantity") {
          const price = parseFloat(updated.price || 0);
          const qty = parseFloat(updated.quantity || 0);
          updated.total = (price * qty).toFixed(2);
        }

        return updated;
      }
      return r;
    });

  if (activeCategory === 'Labour') {
    setLabourData(updateFunction);
  } else if (activeCategory === 'General / Fix Raw Material') {
    setGeneralRawMaterialData(updateFunction);
  }
};

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const res = await GetEventMasterById(eventId);
        console.log("🔍 API Response:", res.data.data);
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

    if (eventId) fetchEventData();
  }, [eventId]);

useEffect(() => {
  if (generalRawMaterialData.length === 0) {
    setGeneralRawMaterialData([
      {
        id: 1,
        labourType: "",
        contact: "",
        shift: "",
        dateTime: "",
        price: "",
        quantity: "",
        total: "",
        place: "",
      },
    ]);
  }
}, []);

  const handleSave = async () => {
    if (!eventData) {
      Swal.fire({
        icon: "warning",
        title: "Event data not loaded yet!",
      });
      return;
    }

    const activeFunction = eventData.eventFunctions?.find(
      (fn) => fn.function?.nameEnglish === activeTab
    );

    if (!activeFunction) {
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

        const contact = (filteredContacts[row.id] || []).find(
          (c) => c.nameEnglish === row.contact
        );

        return {
          contactid: contact?.id || 0,
        labordatetime: dayjs(row.dateTime, ["DD/MM/YYYY hh:mm A", "YYYY-MM-DD", "MMM D, YYYY"], true).isValid()
  ? dayjs(row.dateTime, ["DD/MM/YYYY hh:mm A", "YYYY-MM-DD", "MMM D, YYYY"]).format("DD/MM/YYYY hh:mm A")
  : "",

          laborshift: row.shift || "Morning",
          labortypeid: selectedCategory?.id || 0,
          place: row.place || "At Venue",
          price: parseFloat(row.price || 0),
          qty: parseFloat(row.quantity || 0),
          totalprice: parseFloat(row.total || 0),
        };
      }),
    };

    console.log("🚀 Labor POST Payload:", payload);

    try {
      Swal.fire({
        title: "Saving...",
        text: "Please wait while we save labour details.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await AddUpdateLabor(payload);
      console.log("✅ Labor Save Response:", res.data);

      const backendMessage = res?.data?.message || res?.data?.msg;

      if (res?.data?.status === true || res?.data?.success === true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: backendMessage || "✔️",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: backendMessage || "❌",
        });
      }
    } catch (error) {
      console.error("❌ Error saving labour details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Something went wrong while saving labour details.",
      });
    }
  };

  const renderModalData = () => {
    const agencyOptions = agencies.map((agency) => ({
      value: agency.nameEnglish || agency.name,
      label: agency.nameEnglish || agency.name,
    }));

    const placeOptions = [
      { value: "At Venue", label: "At venue" },
      { value: "Godown", label: "GoDown" },
    ];

    
  };

  const handleAllocateAgency = (agency) => {
    const updated = data.map((item) => ({
      ...item,
      agency: agency,
    }));
    setData(updated);
  };

  const handleAllocatePlace = (place) => {
    const updated = data.map((item) => ({
      ...item,
      place: place,
    }));
    setData(updated);
  };

  const handleAllocateDate = (date) => {
    if (!date) return;
    const formatted = dayjs(date).format("MM/DD/YYYY hh:mm A");
    const updated = data.map((item) => ({
      ...item,
      date: formatted,
    }));
    setData(updated);
  };

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Labour/Other Management" }]} />
        </div>

        <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-7">
                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-calendar-tick text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Party Name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {eventData?.party?.nameEnglish || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-user text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Event Name:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {eventData?.eventType?.nameEnglish || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-geolocation-home text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Function Name:</span>
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
              </div>
            </div>

            <div className="flex flex-row items-end gap-2">
              <button className="btn btn-sm btn-primary" onClick={handleSave} title="Save">
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xxl bg-white shadow-md rounded-xl border border-gray-200 mb-4">
          <div className="inline-flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
            {eventData?.eventFunctions?.map((fn, index) => (
              <button
                key={fn.id}
                onClick={() => {
                  setActiveTab(fn.function?.nameEnglish);
                  setSelectedFunctionPax(fn.pax || 0);
                }}
                className={`px-8 py-3 text-sm font-medium transition-all duration-200 
                  ${
                    activeTab === fn.function?.nameEnglish
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  ${index !== 0 ? "border-l border-gray-300" : ""}
                `}
              >
                {fn.function?.nameEnglish}
              </button>
            )) || (
              <span className="text-gray-500 px-4 py-2">No functions available</span>
            )}
          </div>
        </div>

        <div className="card mb-5">
          <div className="card-body p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span><i className="ki-filled ki-users text-primary"></i></span>
                <span className="text-2sm font-medium text-gray-700">Person</span>
                <span className="text-sm font-semibold bg-gray-300 rounded-md px-3 py-1">
                  {selectedFunctionPax || "-"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button className="btn btn-light btn-sm">
                  <i className="ki-filled ki-document"></i> Report
                </button>
                <button className="btn btn-light btn-sm">
                  <i className="ki-filled ki-document"></i>
                  Checklist
                </button>
                <div className="relative ms-5">
                  <input
                    type="text"
                    placeholder="Search labour type..."
                    className="input input-sm"
                    style={{ width: "300px" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-5">
          <div className="card-body p-3">
            <div className="flex gap-2">
              {['Labour', 'General / Fix Raw Material'].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`btn btn-md ${
                    activeCategory === category
                      ? 'btn-primary'
                      : 'btn-light'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeCategory === 'Labour' && (
          <div className="card">
            <div className="card-body p-0">
              <div className="overflow-x-hidden">
                <table className="table table-auto w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-center px-3 py-3 w-[10%]">#</th>
                      <th className="px-3 py-3 w-[10%]">Labour Type</th>
                      <th className="px-3 py-3 w-[5%]">Contact</th>
                      <th className="px-3 py-3 w-[10%]">Labour Shift</th>
                      <th className="px-3 py-3 w-[19%]">Date & Time</th>
                      <th className="px-3 py-3 w-[10%]">Price</th>
                      <th className="px-3 py-3 w-[10%]">Qty</th>
                      <th className="px-3 py-3 w-[10%]">Total Price</th>
                      <th className="px-3 py-3 w-[14%]">Place</th>
                      <th className="text-center px-3 py-3 w-[10%]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labourData
                      .filter((row) => {
                        if (!row.labourType) return true;
                        if (!searchTerm.trim()) return true;
                        return row.labourType.toLowerCase().includes(searchTerm.toLowerCase());
                      })
                      .map((row, index) => (
                        <tr key={row.id} className="border-t">
                          <td className="text-center px-3 py-2">{index + 1}.</td>
                          <td className="px-3 py-2">
                            <Select
                              className="custom-select-sm"
                              showSearch
                              placeholder="Select Labour Type"
                              value={row.labourType || undefined}
                              onChange={(value) => {
                                const selectedCategory = labourCategories.find(
                                  (c) => c.nameEnglish === value
                                );
                                setLabourData((prev) =>
                                  prev.map((r) =>
                                    r.id === row.id ? { ...r, labourType: value, contact: "" } : r
                                  )
                                );
                                const matchingContacts = allContacts[selectedCategory?.id] || [];
                                setFilteredContacts((prev) => ({
                                  ...prev,
                                  [row.id]: matchingContacts,
                                }));
                              }}
                              style={{ width: "100%" }}
                            >
                              {labourCategories.map((item) => (
                                <Select.Option key={item.id} value={item.nameEnglish}>
                                  {item.nameEnglish}
                                </Select.Option>
                              ))}
                            </Select>
                          </td>

                          <td className="px-3 py-2">
                            <Select
                              className="custom-select-sm"
                              showSearch
                              placeholder="Select Contact"
                              value={row.contact || undefined}
                              onChange={(value) =>
                                setLabourData((prev) =>
                                  prev.map((r) =>
                                    r.id === row.id ? { ...r, contact: value } : r
                                  )
                                )
                              }
                              style={{ width: "100%" }}
                            >
                              {(filteredContacts[row.id] || []).map((c) => (
                                <Select.Option key={c.id} value={c.nameEnglish}>
                                  {c.nameEnglish}
                                </Select.Option>
                              ))}
                            </Select>
                          </td>
                          <td className="px-3 py-2">
                            <select className="select select-sm w-full">
                              <option>Morning Shift</option>
                              <option>Evening Shift</option>
                              <option>Full Day</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
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
                                  handleRowChange(
                                    row.id,
                                    "dateTime",
                                    date ? date.format("DD/MM/YYYY hh:mm A") : ""
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              className="input input-sm w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Price"
                              value={row.price || ""}
                              onChange={(e) => handleRowChange(row.id, "price", e.target.value)}
                            />
                          </td>

                          <td className="px-3 py-2">
                            <input
                              type="number"
                              className="input input-sm w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Qty"
                              value={row.quantity || ""}
                              onChange={(e) => handleRowChange(row.id, "quantity", e.target.value)}
                            />
                          </td>

                          <td className="px-3 py-2">
                            <input
                              type="number"
                              className="input input-sm w-full border border-gray-300 rounded-md px-2 py-1 bg-gray-100"
                              placeholder="Total"
                              value={row.total || ""}
                              readOnly
                            />
                          </td>

                          <td className="px-3 py-2">
                            <select className="select select-sm w-full">
                              <option>At Venue</option>
                              <option>At Godown</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center justify-center gap-1">
                              {/* ✅ Opens Labour Detail Sidebar */}
                              <button 
                                className="btn btn-sm btn-icon btn-clear" 
                                onClick={handleLabourDetailView}
                                title="View Details"
                              >
                                <i className="ki-filled ki-eye text-success"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-icon btn-clear"
                                title="Add Notes"
                                onClick={() => setIsNotesOpen(true)}
                              >
                                <i className="ki-filled ki-notepad text-primary"></i>
                              </button>

                              <button className="btn btn-sm btn-icon btn-clear">
                                <i className="ki-filled ki-whatsapp text-green-600"></i>
                              </button>
                              <button
                                onClick={() => deleteRow(row.id)}
                                className="btn btn-sm btn-icon btn-clear"
                              >
                                <i className="ki-filled ki-trash text-danger"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t">
                <button
                  onClick={addLabourRow}
                  className="btn btn-primary btn-sm"
                >
                  <i className="ki-filled ki-plus"></i>
                  Add Another Labour Type
                </button>
              </div>
            </div>
          </div>
        )}

       {activeCategory === "General / Fix Raw Material" && (
  <div className="card">
    <div className="card-body p-0">
      <div className="overflow-x-auto">
        <button
          className="bg-primary text-white text-sm px-4 py-2 rounded-lg mb-3 ml-4 mt-4"
          onClick={handleGrossaryModalOpen}
        >
          + Agency, Place & Date Allocation
        </button>
        <table className="table table-auto w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-center px-3 py-3" style={{ width: '50px' }}>#</th>
              <th className="px-3 py-3" style={{ minWidth: '140px' }}>Name</th>
              <th className="px-3 py-3" style={{ minWidth: '140px' }}>Qnty</th>
              <th className="px-3 py-3" style={{ minWidth: '140px' }}>Agency</th>
              <th className="px-3 py-3" style={{ minWidth: '140px' }}>Date & Time</th>
              <th className="px-3 py-3" style={{ minWidth: '100px' }}>Place</th>
              <th className="px-3 py-3" style={{ minWidth: '130px' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {generalRawMaterialData
              .filter((row) => {
                if (!row.labourType) return true;
                if (!searchTerm.trim()) return true;
                return row.labourType.toLowerCase().includes(searchTerm.toLowerCase());
              })
              .map((row, index) => (
                <tr key={row.id} className="border-t">
                  <td className="text-center px-3 py-2">{index + 1}.</td>
                  <td className="px-3 py-2">
                   <td className="px-3 py-2">
  <div className="px-3 py-2 bg-gray-50 rounded border border-gray-200">
    {row.labourType || "kisan bhai"}
  </div>
</td>
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="input input-sm w-24 border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Price"
                        value={row.price || ""}
                        onChange={(e) => handleRowChange(row.id, "price", e.target.value)}
                      />

                      <Select
                        showSearch
                        placeholder="Select Contact"
                        value={row.contact || undefined}
                        onChange={(value) =>
                          setGeneralRawMaterialData((prev) =>
                            prev.map((r) =>
                              r.id === row.id ? { ...r, contact: value } : r
                            )
                          )
                        }
                        style={{ width: "100%" }}
                      >
                        {(filteredContacts[row.id] || []).map((c) => (
                          <Select.Option key={c.id} value={c.nameEnglish}>
                            {c.nameEnglish}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </td>

                  <td className="px-3 py-2">
                    <select className="select select-sm w-full">
                      <option>Morning Shift</option>
                      <option>Evening Shift</option>
                      <option>Full Day</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
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
                          handleRowChange(
                            row.id,
                            "dateTime",
                            date ? date.format("DD/MM/YYYY hh:mm A") : ""
                          )
                        }
                      />
                    </div>
                  </td>
                   <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Select
                        showSearch
                        placeholder="Select Place"
                        value={row.place || undefined}
                        onChange={(value) =>
                          handleRowChange(row.id, "place", value)
                        }
                        style={{ width: "100%" }}
                      >
                        <Select.Option value="At Venue">At Venue</Select.Option>
                        <Select.Option value="Kitchen">Kitchen</Select.Option>
                        <Select.Option value="Store">Store</Select.Option>
                      </Select>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      className="input input-sm w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Price"
                      value={row.price || ""}
                      onChange={(e) => handleRowChange(row.id, "price", e.target.value)}
                    />
                  </td>

                 
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
       
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

        <AddGeneralfix
          isModalOpen={isGrossaryModalOpen}
          setIsModalOpen={setIsGrossaryModalOpen}
          agencies={agencies}
          loading={loading}
          modalData={renderModalData}
          onAllocateAgency={handleAllocateAgency}
          onAllocatePlace={handleAllocatePlace}
          onAllocateDate={handleAllocateDate}
        />
      </Container>
    </Fragment>
  );
};

export default LabourOtherManagementPage;
