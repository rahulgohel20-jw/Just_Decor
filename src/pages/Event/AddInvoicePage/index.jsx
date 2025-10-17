import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { DatePicker, Input, Switch, Button, Spin } from "antd";
import ItemTable from "@/components/InvoiceTable/ItemTable";
import InvoiceFooter from "@/components/InvoiceTable/InvoiceFooter";
import { AddInvoice } from "@/services/apiServices"; // adjust path if needed


import { Tooltip, message } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DownloadOutlined,
  EyeOutlined,
  SaveOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Download } from "lucide-react";
import { useLocation } from "react-router";
import { GetInvoiceByEventId } from "@/services/apiServices";

const { TextArea } = Input;

const AddInvoicePage = () => {
  const location = useLocation();
  const { eventId, eventTypeId } = location.state || {};
  console.log("Event ID:", eventId);
  console.log("Event Type ID:", eventTypeId);
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  
  const [rows, setRows] = useState([
    {
      key: 1,
      name: "",
      date: "",
      person: "",
      extra: "",
      rate: "",
      amount: "",
    },
  ]);


  

  // Edit states for different sections
  const [editStates, setEditStates] = useState({
    billingAddress: false,
    shippingAddress: false,
    billingName: false,
    gstNumber: false,
  });

  // Temporary edit values
  const [tempValues, setTempValues] = useState({
    billingaddress: "",
    billingname: "",
    shipaddress: "",
    shipname: "",
    gstnumber: "",
  });

  // Fetch invoice data when component mounts
  useEffect(() => {
    if (eventId) {
      fetchInvoiceData();
    }
  }, [eventId]);

  const fetchInvoiceData = async () => {
    try {
      setLoading(true);
      const response = await GetInvoiceByEventId(eventId);

      console.log("API Response:", response);
      
      if (response.status === 200 && response.data.data) {
        const invoiceDetailsArray = response?.data?.data?.["Event Invoice Details"];
        
        if (invoiceDetailsArray && invoiceDetailsArray.length > 0) {
          const invoiceDetails = invoiceDetailsArray[0];
          console.log("Fetched Invoice Data:", invoiceDetails);
          setInvoiceData(invoiceDetails);
          
          // Initialize temp values
          setTempValues({
            billingaddress: invoiceDetails.billingaddress || "",
            billingname: invoiceDetails.billingname || "",
            shipaddress: invoiceDetails.shipaddress || "",
            shipname: invoiceDetails.shipname || "",
            gstnumber: invoiceDetails.gstnumber || "",
          });
          
          let mappedRows = [];
          console.log("Invoice Details for Rows:", invoiceDetails);
          if (invoiceDetails?.invoiceFunctionItems?.length > 0) {
  mappedRows = invoiceDetails.invoiceFunctionItems.map((item, index) => ({
    key: `${index + 1}-${Math.random()}`,
    name: item.name || "",
    date: item.date || "",
    person: item.person || 0,
    extra: item.extra || 0,
    rate: item.rate || 0,
    amount: (Number(item.person) + Number(item.extra)) * Number(item.rate || 0),
    isCustom: false, // 🚫 From API → not custom
  }));
} else if (invoiceDetails?.event?.eventFunctions?.length > 0) {
  mappedRows = invoiceDetails.event.eventFunctions.map((func, index) => ({
    key: `${index + 1}-${Math.random()}`,
    name: func.function?.nameEnglish || "N/A",
    date: func.functionStartDateTime || "",
    person: func.pax || 0,
    extra: 0,
    rate: func.rate || 0,
    amount: (Number(func.pax || 0) + 0) * Number(func.rate || 0),
    isCustom: false, // 🚫 From API
  }));
}

          setRows(mappedRows.length > 0 ? mappedRows : rows);
          
          message.success("Invoice data loaded successfully");
        } else {
          message.warning("No invoice data found");
        }
      }
    } catch (error) {
      console.error("Error fetching invoice data:", error);
      message.error("Failed to load invoice data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleDeleteRow = (key) => {
    setRows(rows.filter((row) => row.key !== key));
  };

  const handleAddRow = () => {
  const lastRow = rows[rows.length - 1];
  setRows([
    ...rows,
    {
      key: `${rows.length + 1}-${Math.random()}`,
      name: "",
      date: "",
      person: lastRow ? lastRow.person : 0, // ✅ copy person from previous row
      extra: 0,
      rate: 0,
      amount: 0,
      isCustom: true,
    },
  ]);
};



  // Toggle edit mode
  const toggleEdit = (field) => {
    setEditStates((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle temp value changes
  const handleTempValueChange = (field, value) => {
    setTempValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save changes
  const saveChanges = (field) => {
    setInvoiceData((prev) => ({
      ...prev,
      ...tempValues,
    }));
    toggleEdit(field);
    message.success("Changes saved successfully");
  };

  // Cancel changes
  const cancelChanges = (field) => {
    setTempValues({
      billingaddress: invoiceData?.billingaddress || "",
      billingname: invoiceData?.billingname || "",
      shipaddress: invoiceData?.shipaddress || "",
      shipname: invoiceData?.shipname || "",
      gstnumber: invoiceData?.gstnumber || "",
    });
    toggleEdit(field);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dateString;
  };

  if (loading) {
    return (
      <Container>
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      </Container>
    );
  }





//Add Invoice Handler
  const handleSaveInvoice = async () => {

    // Get the string from localStorage
const userDataString = localStorage.getItem("userData");

// Parse it into an object
const userData = JSON.parse(userDataString);

// Get the id
const UserId = userData.id;

console.log(UserId); // should log 1
    console.log("💾 Saving Invoice...");
  try {
    // Helper function to format date as DD-MM-YYYY
    const formatDateForAPI = (date) => {
      if (!date) date = new Date();
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${day}-${month}-${year}`;
    };

    // 🧾 Prepare payload
    const payload = {
      billingaddress: tempValues.billingaddress || "",
      billingname: tempValues.billingname || "",
      cgst: "",
      cgstAmnt: 0,
      discount: 0,
      duedate: formatDateForAPI(invoiceData?.duedate),
      eventId: eventId,
      eventInvoiceFunctionPayments: [
        {
          advancePayment: 0,
          advancePaymentDate: formatDateForAPI(new Date()),
          advancePaymentNotes: "",
          id: 0,
        },
      ],
      grandTotal: 0,
      gstnumber: tempValues.gstnumber || "",
      igst: "",
      igstAmnt: 0,
      invoiceFunctionItems: rows.map((r) => ({
        amount: Number(r.amount) || 0,
        extraPax: Number(r.extra) || 0,
        functionDate: r.date || "",
        functionName: r.name || "",
        id: 0,
        isEventFunction: !r.isCustom,
        pax: Number(r.person) || 0,
        ratePerPlate: Number(r.rate) || 0,
      })),
      notes: "Thanks for your Business...",
      remainingAmount: 0,
      roundOff: 0,
      sgst: "",
      sgstAmnt: 0,
      shipaddress: tempValues.shipaddress || "",
      shipname: tempValues.shipname || "",
      subTotal: rows.reduce((sum, r) => sum + Number(r.amount || 0), 0),
      totalAmount: rows.reduce((sum, r) => sum + Number(r.amount || 0), 0),
      userId: UserId,
    };
   
    
    console.log("🧾 Invoice Payload =>", payload);

    // 🚀 Call API
    const response = await AddInvoice(payload);
    console.log("API Response:", response);

    if (response?.data?.success) {
      message.success("Invoice saved successfully!");
  console.log("✅ Invoice saved:", response.data);
    } else {
      message.error("Failed to save invoice");
    }
  } catch (error) {
    console.error("❌ Error saving invoice:", error);
    message.error("Something went wrong while saving invoice");
  }
};


  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Invoice" }]} />
        </div>

        <div className="flex flex-col bg-gray-100 rounded mb-7">
          <div className="flex flex-col bg-white rounded ">
            <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
              <div className="flex flex-wrap items-center justify-between p-4 gap-3">
                <div className="flex flex-col gap-2.5">
                  <p className="text-lg font-semibold text-gray-900">
                    Event Name: {invoiceData?.event?.eventType?.nameEnglish || "Sangeet"}
                  </p>
                  <div className="flex items-center gap-7">
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-user text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Party name:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {invoiceData?.event?.party?.nameEnglish || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-geolocation-home text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Venue name:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {invoiceData?.event?.venue || "N/A"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-calendar-tick text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Invoice Date:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(invoiceData?.createdAt)}
                        </span>
                      </div>
                    </div>
                    {/* <div className="flex items-center gap-3">
                      <i className="ki-filled ki-calendar-tick text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Invoice Number:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {invoiceData?.invoiceCode || "N/A"}
                        </span>
                      </div>
                    </div> */}
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-calendar-tick text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Event Date:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(invoiceData?.event?.inquiryDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-end gap-2">
                  <button className="btn btn-sm btn-primary" title="Print">
                    <i className="ki-filled ki-printer"></i> Print
                  </button>
                  <button className="btn btn-sm btn-primary" title="Share">
                    <i className="ki-filled ki-exit-right-corner"></i> Share
                  </button>
                </div>
              </div>
            </div>
            
            {/* Billing */}
            <div className="flex flex-col border rounded-xl mb-5">
              <div className="grid md:grid-cols-2 rounded">
                {/* Billing Address */}
                <div className="border-r p-4 rounded">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Billing Address
                    {editStates.billingAddress ? (
                      <>
                        <Tooltip title="Save">
                          <CheckOutlined
                            className="text-green-600 ms-2 cursor-pointer"
                            onClick={() => saveChanges("billingAddress")}
                          />
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <CloseOutlined
                            className="text-red-600 ms-2 cursor-pointer"
                            onClick={() => cancelChanges("billingAddress")}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip title="Edit">
                        <EditOutlined
                          className="text-primary ms-2 cursor-pointer"
                          onClick={() => toggleEdit("billingAddress")}
                        />
                      </Tooltip>
                    )}
                  </h4>
                  {editStates.billingAddress ? (
                    <div className="space-y-2">
                      <TextArea
                        value={tempValues.billingaddress}
                        onChange={(e) =>
                          handleTempValueChange("billingaddress", e.target.value)
                        }
                        placeholder="Enter billing address"
                        rows={3}
                      />
                      {/* <Input
                        value={tempValues.billingname}
                        onChange={(e) =>
                          handleTempValueChange("billingname", e.target.value)
                        }
                        placeholder="Enter billing name"
                      /> */}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">
                      {invoiceData?.billingaddress || "N/A"}
                      <br />
                      {invoiceData?.billingname || ""}
                    </p>
                  )}
                </div>

                {/* Shipping Address */}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Shipping Address
                    {editStates.shippingAddress ? (
                      <>
                        <Tooltip title="Save">
                          <CheckOutlined
                            className="text-green-600 ms-2 cursor-pointer"
                            onClick={() => saveChanges("shippingAddress")}
                          />
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <CloseOutlined
                            className="text-red-600 ms-2 cursor-pointer"
                            onClick={() => cancelChanges("shippingAddress")}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip title="Edit">
                        <EditOutlined
                          className="text-primary ms-2 cursor-pointer"
                          onClick={() => toggleEdit("shippingAddress")}
                        />
                      </Tooltip>
                    )}
                  </h4>
                  <div className="flex items-start">
                    {editStates.shippingAddress ? (
                      <div className="space-y-2 w-full">
                        <TextArea
                          value={tempValues.shipaddress}
                          onChange={(e) =>
                            handleTempValueChange("shipaddress", e.target.value)
                          }
                          placeholder="Enter shipping address"
                          rows={3}
                        />
                        <Input
                          value={tempValues.shipname}
                          onChange={(e) =>
                            handleTempValueChange("shipname", e.target.value)
                          }
                          placeholder="Enter shipping name"
                        />
                      </div>
                    ) : invoiceData?.shipaddress ? (
                      <p className="text-sm text-gray-700">
                        {invoiceData.shipaddress}
                        <br />
                        {invoiceData.shipname || ""}
                      </p>
                    ) : (
                      <div>
                        <span className="text-sm text-primary">+</span>
                        <span className="text-sm text-primary cursor-pointer ms-1 hover:underline">
                          Add a New Address
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* GST Section */}
              <div className="grid md:grid-cols-2 border-t">
                <div className="border-r p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      Billing Name
                    </span>
                    {editStates.billingName ? (
                      <>
                        <Input
                          value={tempValues.billingname}
                          onChange={(e) =>
                            handleTempValueChange("billingname", e.target.value)
                          }
                          placeholder="Enter billing name"
                          className="flex-1"
                        />
                        <Tooltip title="Save">
                          <CheckOutlined
                            className="text-green-600 cursor-pointer"
                            onClick={() => saveChanges("billingName")}
                          />
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <CloseOutlined
                            className="text-red-600 cursor-pointer"
                            onClick={() => cancelChanges("billingName")}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-700">
                          {invoiceData?.billingname || "N/A"}
                        </span>
                        <Tooltip title="Edit">
                          <EditOutlined
                            className="text-primary cursor-pointer"
                            onClick={() => toggleEdit("billingName")}
                          />
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      GST Number
                    </span>
                    {editStates.gstNumber ? (
                      <>
                        <Input
                          value={tempValues.gstnumber}
                          onChange={(e) =>
                            handleTempValueChange("gstnumber", e.target.value)
                          }
                          placeholder="Enter GST number"
                          className="flex-1"
                        />
                        <Tooltip title="Save">
                          <CheckOutlined
                            className="text-green-600 cursor-pointer"
                            onClick={() => saveChanges("gstNumber")}
                          />
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <CloseOutlined
                            className="text-red-600 cursor-pointer"
                            onClick={() => cancelChanges("gstNumber")}
                          />
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <span className="text-gray-700">
                          {invoiceData?.gstnumber || "N/A"}
                        </span>
                        <Tooltip title="Edit">
                          <EditOutlined
                            className="text-primary cursor-pointer"
                            onClick={() => toggleEdit("gstNumber")}
                          />
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* ItemTable */}
            <ItemTable
              rows={rows}
              onInputChange={handleInputChange}
              onAddRow={handleAddRow}
              onDeleteRow={handleDeleteRow}
            />
            
            {/* InvoiceFooter */}
            <InvoiceFooter 
              invoiceData={invoiceData}
              rows={rows}
              onSave={handleSaveInvoice}
            />
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default AddInvoicePage;