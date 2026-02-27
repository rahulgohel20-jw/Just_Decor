import React, { useState, useEffect } from "react";
import { X, Calendar, Users, MapPin, Copy, Search } from "lucide-react";
import { GetAllEventFunction } from "@/services/apiServices";
import Swal from "sweetalert2";

const CopyMenuPlanning = ({
  isOpen,
  onClose,
  onCopyFunction,
  currentEventId,
  currentFunctionId,
}) => {
  const userId = localStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchEventFunctions();
    }
  }, [isOpen]);

  const fetchEventFunctions = async () => {
    try {
      setLoading(true);
      const response = await GetAllEventFunction(userId);
      const eventFunctions = response?.data?.data?.EventFunctions || [];

      if (eventFunctions.length > 0) {
        const mappedFunctions = eventFunctions
          .filter((func) => func.id !== currentFunctionId)
          .map((func) => ({
            id: func.id,
            eventId: func.eventId,
            eventNo: func.eventNo,
            eventName: func.eventName || "Event",
            eventNameHindi: func.eventNameHindi || "",
            eventNameGujarati: func.eventNameGujarati || "",
            functionType: func.functionName || "Function",
            functionTypeHindi: func.functionNameHindi || "",
            functionTypeGujarati: func.functionNameGujarati || "",
            date: func.functionStartDateTime?.split(" ")[0] || "",
            time: func.functionStartDateTime?.split(" ")[1] || "",
            startDateTime: func.functionStartDateTime.split(" ")[0] || "",
            endDateTime: func.functionEndDateTime.split(" ")[0] || "",
            eventStartDateTime: func.eventStartDateTime || "",
            eventEndDateTime: func.eventEndDateTime || "",
            menuItems: 0,
            customer: func.partyName || "",
            customerHindi: func.partyNameHindi || "",
            customerGujarati: func.partyNameGujarati || "",
            partyId: func.partyId || 0,
          }));

        setFunctions(mappedFunctions);
      }
    } catch (err) {
      console.error("Error fetching functions:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to load functions",
        text: "Could not fetch event functions.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredFunctions = functions.filter(
    (func) =>
      func.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.functionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.eventNameHindi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      func.eventNameGujarati
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      func.functionTypeHindi
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      func.functionTypeGujarati
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleCopyFunction = (func) => {
    setSelectedFunction(func);
    onCopyFunction(func);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className=" text-black py-3 px-6 flex justify-between items-center border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold">Copy Menu from Function</h2>
            <p className="text-gray-600 mt-1">
              Select a function to copy its menu preparation
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-black hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 ">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by function type, venue, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primay focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Functions List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredFunctions.length > 0 ? (
            <div className="space-y-4">
              {filteredFunctions.map((func) => (
                <div
                  key={func.id}
                  className={`border rounded-xl p-2 hover:shadow-lg transition-all cursor-pointer ${
                    selectedFunction?.id === func.id
                      ? "border-primary bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => setSelectedFunction(func)}
                >
                  <div className="flex flex-col  justify-between items-start mb-3">
                    <div className="w-full flex justify-between items-start ">
                      <h3 className="text-xl font-bold text-gray-800">
                        Function Name : {func.functionType}
                      </h3>
                    </div>
                    <div className=" w-full flex justify-between">
                      <div className=" flex flex-col gap-1">
                        <div className="flex   items-center gap-2">
                          <p className="inline-block mt-2 px-3 py-1 bg-blue-50 border border-primary text-primary rounded-full text-xs font-medium">
                            Event No : {func.eventNo}
                          </p>
                          <p className="inline-block mt-2 px-3 py-1 bg-blue-50 border border-primary text-primary rounded-full text-xs font-medium">
                            Event Name : {func.eventName}
                          </p>
                          <span className="inline-block mt-2 px-3 py-1 bg-blue-50 border border-primary text-primary rounded-full text-xs font-medium">
                            Party Name : {func.customer}
                          </span>
                          <p className="inline-block mt-2  px-3 py-1 bg-blue-50 border border-primary text-primary rounded-full text-xs font-medium">
                            From {func.startDateTime} To {func.endDateTime}
                          </p>
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyFunction(func);
                          }}
                          className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary transition-colors flex items-center gap-2"
                        >
                          <Copy size={12} />
                          Copy Menu
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={18} className="text-primary" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-semibold">{formatDate(func.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={18} className="text-primary" />
                      <div>
                        <p className="text-xs text-gray-500">Event</p>
                        <p className="text-sm font-semibold">{func.eventName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={18} className="text-primary" />
                      <div>
                        <p className="text-xs text-gray-500">Customer</p>
                        <p className="text-sm font-semibold">{func.customer}</p>
                      </div>
                    </div>
                  </div> */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                {functions.length === 0
                  ? "No other functions available in this event"
                  : "No functions found matching your search"}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t p-6 bg-gray-50 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {filteredFunctions.length} function
            {filteredFunctions.length !== 1 ? "s" : ""} available
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyMenuPlanning;
