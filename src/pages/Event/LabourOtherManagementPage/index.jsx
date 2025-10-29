import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import useStyles from "./style";
import { DatePicker } from "antd";
import { useParams } from "react-router-dom"; // ✅ for eventId
import LabourDetailSidebar from "./LabourSidebar/LabourDetailSidebar";
import { Select } from "antd"; // ✅ Ant Design Select
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import Swal from "sweetalert2";
import { GetEventMasterById, GetAllContactCategory , GetPartyMasterByCatTypeId ,AddUpdateLabor,GetEventLaborDetails  } from "@/services/apiServices"; // ✅ import API

const LabourOtherManagementPage = () => {
  const classes = useStyles();
  const [selectedFunctionPax, setSelectedFunctionPax] = useState(0);
const [allContacts, setAllContacts] = useState([]);
const [filteredContacts, setFilteredContacts] = useState({});

  const { eventId } = useParams(); // ✅ eventId from route
  const [activeTab, setActiveTab] = useState("Dinner");
  const [activeCategory, setActiveCategory] = useState("Labour");
  const [personCount, setPersonCount] = useState(450);
  const [eventData, setEventData] = useState(null); // ✅ store API data
  const [loading, setLoading] = useState(false);

const [labourDataByFunction, setLabourDataByFunction] = useState([]);


  const [labourCategories, setLabourCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const LabourDetailView = () => setIsModalOpen(true);

const storedUser = JSON.parse(localStorage.getItem("user"));
const userId = storedUser?.id || eventData?.user?.id || 0;


useEffect(() => {
  const fetchContactCategories = async () => {
    try {
      if (!userId) return;
      const res = await GetAllContactCategory(userId);
      console.log("📦 Raw API Response:", res.data);

      const allCategories = res?.data?.data?.["Contact Category Details"] || [];
      const labourCategories = allCategories.filter(
        (cat) =>
          cat?.contactType?.nameEnglish?.trim()?.toLowerCase() === "labour"
      );

      console.log("✅ Filtered Only 'Labour' Categories:", labourCategories);
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
      console.log("✅ All Labour Contacts Mapped:", allContactsMap);
    } catch (err) {
      console.error("❌ Error fetching contacts:", err);
    }
  };

  fetchContacts();
}, [labourCategories, userId]);


useEffect(() => {
  const fetchLaborDetails = async () => {
    if (!eventData || !activeTab) {
      console.log("⚠️ Skipping fetchLaborDetails — eventData or activeTab missing");
      return;
    }

    console.log("🚀 Fetching Labour Details for Tab:", activeTab);

    const activeFunction = eventData.eventFunctions?.find(
      (fn) => fn.function?.nameEnglish === activeTab
    );

    if (!activeFunction) {
      console.log("⚠️ No matching function found for:", activeTab);
      return;
    }

    console.log("🧩 Active Function Found:", activeFunction);

    try {
      console.log(
        `📡 Calling API: GetEventLaborDetails(eventFunctionId=${activeFunction.id}, eventId=${eventData.id})`
      );
      const res = await GetEventLaborDetails(activeFunction.id, eventData.id);

      console.log("📥 API Raw Response:", res?.data);

      const laborData = res?.data?.data?.eventLabor || [];
      console.log(`📋 Parsed Labour Records (${laborData.length}):`, laborData);

      // 🧱 Show full contact mapping before formatting
      console.log("📦 All Party Master (Contacts):", allContacts);
      Object.entries(allContacts).forEach(([labourTypeId, contacts]) => {
        console.log(
          `🧩 Labour Type ${labourTypeId} has ${contacts.length} contact(s):`,
          contacts.map((c) => `${c.id} - ${c.nameEnglish}`)
        );
      });

      // 🎯 Verify if contacts in event data exist in All Party Master
      laborData.forEach((lab) => {
        const matchingContact = allContacts[lab.labortypeid]?.find(
          (c) => c.id === lab.contactid
        );
        console.log(
          `🎯 Labour Row → labourType=${lab.labortypeid}, contactid=${lab.contactid}`,
          matchingContact
            ? `✅ Found: ${matchingContact.nameEnglish}`
            : "❌ Not found in All Party Master"
        );
      });

      const formattedRows = laborData.map((item, index) => ({
        id: index + 1,
        labourType:
          labourCategories.find((c) => c.id === item.labortypeid)
            ?.nameEnglish?.trim() || item.labortypename?.trim() || "",
        contact:
          Object.values(allContacts)
            .flat()
            .find((c) => c.id === item.contactid)?.nameEnglish?.trim() ||
          item.contactname?.trim() ||
          "",
        shift: item.laborshift || "",
        dateTime: item.labordatetime || "",
        price: item.price || "",
        quantity: item.qty || "",
        total: item.totalprice || "",
        place: item.place || "",
      }));

      console.log("🧱 Formatted Labour Rows:", formattedRows);

      if (formattedRows.length === 0) {
        console.log("⚠️ No labour data found — initializing empty row.");
      }

      setLabourDataByFunction(
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
    console.log("🟢 All dependencies ready — calling fetchLaborDetails()");
    fetchLaborDetails();
  } else {
    console.log("⏳ Waiting for dependencies (eventData, categories, or contacts)");
  }
}, [eventData, activeTab, labourCategories, allContacts]);


  const addLabourRow = () => {
    const newRow = {
      id: labourDataByFunction.length + 1,
      labourType: "",
      contact: "",
      shift: "",
      dateTime: dayjs().format("DD/MM/YYYY hh:mm A"),

      price: "",
      qty: "",
      totalPrice: "",
      place: "",
    };
    setLabourDataByFunction([...labourDataByFunction, newRow]);
  };

  const deleteRow = (id) => {
    setLabourDataByFunction(labourDataByFunction.filter((row) => row.id !== id));
  };

  // ✅ Fetch event details when eventId is available
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

const handleRowChange = (id, field, value) => {
  setLabourDataByFunction((prevRows) =>
    prevRows.map((r) => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };

        // Auto calculate total when price or quantity changes
        if (field === "price" || field === "quantity") {
          const price = parseFloat(updated.price || 0);
          const qty = parseFloat(updated.quantity || 0);
          updated.total = (price * qty).toFixed(2);
        }

        return updated;
      }
      return r;
    })
  );
};

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
    eventLaborDetails: labourDataByFunction.map((row) => {
      const selectedCategory = labourCategories.find(
        (c) => c.nameEnglish === row.labourType
      );

      const contact = (filteredContacts[row.id] || []).find(
        (c) => c.nameEnglish === row.contact
      );

      return {
        contactid: contact?.id || 0,
        labordatetime: dayjs(row.dateTime, ["DD/MM/YYYY hh:mm A", "YYYY-MM-DD", "MMM D, YYYY"])
          .format("DD/MM/YYYY hh:mm A"),
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

    // 🧠 Now only display backend message — no frontend message at all
    const backendMessage = res?.data?.message || res?.data?.msg;

    if (res?.data?.status === true || res?.data?.success === true) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: backendMessage || "✔️", // fallback only if backend has no message
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: backendMessage || "❌", // fallback if backend message missing
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



  return (
    <Fragment>
      <Container>
        {/* Breadcrumb */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Labour/Other Management" }]} />
        </div>

        {/* ✅ Dynamic Event Header Section */}
        <div className="card min-w-full bg-no-repeat bg-[length:500px] user-access-bg mb-5">
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
                  <i className="ki-filled ki-map-pin text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Event Venue:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {eventData?.venue || "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <i className="ki-filled ki-clock text-success"></i>
                  <div className="flex flex-col">
                    <span className="text-xs">Event Date & Time:</span>
                    <span className="text-sm font-medium text-gray-900">
                                   {eventData?.eventStartDateTime || ""}

                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-row items-end gap-2">
              {/* <button className="btn btn-sm btn-danger" title="Delete">
                Delete
              </button> */}
              <button className="btn btn-sm btn-primary" onClick={handleSave}  title="Save">
                Save
              </button>
            </div>
          </div>
        </div>

<div className="flex">
  {eventData?.eventFunctions?.map((fn) => (
    <button
      key={fn.id}
      onClick={() => {
        setActiveTab(fn.function?.nameEnglish);
        setSelectedFunctionPax(fn.pax || 0);
      }}
      className={`px-8 py-3 text-sm font-medium transition-colors ${
        activeTab === fn.function?.nameEnglish
          ? "bg-primary text-white"
          : "bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {fn.function?.nameEnglish}
    </button>
  )) || (
    <span className="text-gray-500 px-4 py-2">No functions available</span>
  )}
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
                {/* <input
                  type="text"
                  placeholder="Enter Percentage"
                  className="input input-sm"
                  style={{ width: '180px' }}
                />
                <button className="btn btn-primary btn-sm">
                  Update Count
                </button> */}
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
                    placeholder="Search items..."
                    className="input input-sm "
                    style={{ width: '300px' }}
                  />
                  
                </div>
              </div>
            </div>
          </div>
        </div>

       
        <div className="card mb-5">
          <div className="card-body p-3">
            <div className="flex gap-2">
              {['Labour', ].map((category) => (
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

       
        <div className="card">
          <div className="card-body p-0">
            <div className="overflow-x-auto">
              <table className="table table-auto w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-center px-3 py-3" style={{ width: '50px' }}>#</th>
                    <th className="px-3 py-3" style={{ minWidth: '140px' }}>Labour Type</th>
                    <th className="px-3 py-3" style={{ minWidth: '140px' }}>Contact</th>
                    <th className="px-3 py-3" style={{ minWidth: '140px' }}>Labour Sift</th>
                    <th className="px-3 py-3" style={{ minWidth: '140px' }}>Date & Time</th>
                    <th className="px-3 py-3" style={{ minWidth: '130px' }}>Price</th>
                    <th className="px-3 py-3" style={{ minWidth: '100px' }}>Qty</th>
                    <th className="px-3 py-3" style={{ minWidth: '130px' }}>Total Price</th>
                    <th className="px-3 py-3" style={{ minWidth: '130px' }}>Place</th>
                    <th className="text-center px-3 py-3" style={{ width: '130px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {labourDataByFunction.map((row, index) => (
                    <tr key={row.id} className="border-t">
                      <td className="text-center px-3 py-2">{index + 1}.</td>
                     <td className="px-3 py-2">
                      {console.log("🧱 labourCategories for Select:", labourCategories)}
<Select
  showSearch
  placeholder="Select Labour Type"
  value={row.labourType || undefined}
  onChange={(value) => {
    const selectedCategory = labourCategories.find((c) => c.nameEnglish === value);

    // Reset contact on labourType change
    setLabourDataByFunction((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, labourType: value, contact: "" } : r
      )
    );

    // Filter contacts by category id
    const matchingContacts = allContacts[selectedCategory?.id] || [];
    console.log("🎯 Matching contacts for", value, ":", matchingContacts);

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
  showSearch
  placeholder="Select Contact"
  value={row.contact || undefined}
  onChange={(value) =>
    setLabourDataByFunction((prev) =>
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
    row.dateTime && dayjs(row.dateTime, "DD/MM/YYYY hh:mm A", true).isValid()
      ? dayjs(row.dateTime, "DD/MM/YYYY hh:mm A")
      : null
  }
  onChange={(date, dateString) => handleRowChange(row.id, "dateTime", dateString)}
/>



  </div>
</td>

                  <td className="px-3 py-2">
  {/* Price Input */}
  <input
    type="number"
    className="input input-sm w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
    placeholder="Price"
    value={row.price || ""}
    onChange={(e) => handleRowChange(row.id, "price", e.target.value)}
  />
</td>

<td className="px-3 py-2">
  {/* Quantity Input */}
  <input
    type="number"
    className="input input-sm w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
    placeholder="Qty"
    value={row.quantity || ""}
    onChange={(e) => handleRowChange(row.id, "quantity", e.target.value)}
  />
</td>

<td className="px-3 py-2">
  {/* Total (auto-calculated) */}
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
                          s
                          <option>At Venue</option>
                          <option>At Godown</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center justify-center gap-1">
                          <button className="btn btn-sm btn-icon btn-clear " onClick={LabourDetailView}>
    <i className="ki-filled ki-eye text-success "></i>
  </button>
  
  <button className="btn btn-sm btn-icon btn-clear ">
    <i className="ki-filled ki-notepad text-primary "></i>
  </button>
  <button className="btn btn-sm btn-icon btn-clear ">
    <i className="ki-filled ki-whatsapp text-green-600 "></i>
  </button>
  <button 
    onClick={() => deleteRow(row.id)}
    className="btn btn-sm btn-icon btn-clear "
  >
    <i className="ki-filled ki-trash text-danger "></i>
  </button>
</div>
<td className="px-3 py-2">
  {console.log("🧱 labourCategories for Select:", labourCategories)}
  {console.log("📦 All Party Master (Contacts):", allContacts)}
  {console.log("🎯 Filtered Contacts Map:", filteredContacts)}



  
</td>

<td className="px-3 py-2">
  {console.log(
    `🟨 Contact options for row ${row.id}:`,
    filteredContacts[row.id]
  )}
 
</td>


                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Button */}
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
        <LabourDetailSidebar
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          
        />
      </Container>
    </Fragment>
  );
};

export default LabourOtherManagementPage;