import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { GripVertical, Printer, Save } from "lucide-react";
import {
  GetNamePlatedata,
  GenerateNamePlateReport,
  AddNamePlate,
} from "@/services/apiServices";
import Swal from "sweetalert2";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
const initialCounters = [];

const MainStandyMenuReport = ({
  isModalOpen,
  setIsModalOpen,
  eventId,
  eventFunctionId,
  selectedTemplateId,
}) => {
  const pdfPlugin = defaultLayoutPlugin({
    toolbarPlugin: {
      zoomPlugin: {
        enableShortcuts: true,
      },
    },
    // Set initial zoom to 100%
    renderPage: (props) => (
      <>
        {props.canvasLayer.children}
        {props.textLayer.children}
        {props.annotationLayer.children}
      </>
    ),
  });

  const [currentlang, setCurrentLang] = useState(0);
  const [counters, setCounters] = useState(initialCounters);
  let userId = localStorage.getItem("userId");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  useEffect(() => {
    if (eventId && eventFunctionId && userId) {
      console.warn("Cannot fetch NamePlate: missing eventId or userId", {
        eventId,
        eventFunctionId,
        currentlang,
      });

      fetchItemdata();
    }
  }, [eventId, eventFunctionId, currentlang]);

  const fetchItemdata = async () => {
    try {
      const data = await GetNamePlatedata(
        eventFunctionId,
        eventId,
        currentlang,
        userId,
      );

      const res = data?.data?.data?.data || [];
      console.log("resposen", res);

      const formattedCounters = res
        .sort((a, b) => a.sequence - b.sequence)
        .map((item) => ({
          id: item.id,
          menuItemId: item.menuItemId,
          sequence: item.sequence,
          isChecked: item.isChecked,
          copies: item.itemCount ?? 0,

          // store all languages
          itemNameEnglish: item.itemNameEnglish || "",
          itemNameHindi: item.itemNameHindi || item.itemNameEnglish,
          itemNameGujarati: item.itemNameGujarati || item.itemNameEnglish,
        }));

      setCounters(formattedCounters);
    } catch (error) {
      console.error("Error fetching name plate data:", error);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(counters);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setCounters(items);
  };

  const handleNameChange = (id, value) => {
    setCounters((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (currentlang === 0)
          return { ...item, name: value, itemNameEnglish: value };
        if (currentlang === 1)
          return { ...item, name: value, itemNameHindi: value };
        if (currentlang === 2)
          return { ...item, name: value, itemNameGujarati: value };

        return item;
      }),
    );
  };

  const handleCopiesChange = (id, value) => {
    const cleanedValue = value === "" ? "" : Math.max(0, parseInt(value, 10));

    setCounters((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, copies: cleanedValue } : item,
      ),
    );
  };

  const handleSave = async ({ printAfterSave = false } = {}) => {
    Swal.fire({
      title: "Saving...",
      text: "Please wait while we save name plate data",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const payload = {
        categoryFontSize: 0,
        itemFontSize: 0,
        eventFunctionId: Number(eventFunctionId),
        eventId: Number(eventId),
        userId: Number(userId),

        namePlateRequests: counters.map((item, index) => ({
          id: item.id || -1,
          menuItemId: item.menuItemId,
          isChecked: item.isChecked,
          itemCount: item.copies,
          itemNameEnglish: item.itemNameEnglish,
          itemNameHindi: item.itemNameHindi,
          itemNameGujarati: item.itemNameGujarati,
          sequence: index + 1,
        })),
      };

      const res = await AddNamePlate(payload);

      if (!res?.data?.success) {
        throw new Error(res?.data?.msg || "Save failed");
      }

      Swal.close();

      if (printAfterSave) {
        await callPrintApi();
      } else {
        Swal.fire("Saved Successfully", res?.data?.msg, "success");
        setIsModalOpen(false);
      }
    } catch (error) {
      Swal.fire("Save Failed", error.message, "error");
    }
  };

  const callPrintApi = async () => {
    try {
      const formData = new FormData();
      formData.append("adminTemplateModuleId", selectedTemplateId);
      formData.append("eventFunctionId", eventFunctionId);
      formData.append("eventId", eventId);
      formData.append("isCompanyDetails", 0);
      formData.append("lang", currentlang);
      formData.append("twoLanugage", 0);

      formData.append("userId", userId);

      const res = await GenerateNamePlateReport(formData);
      const url = res.data?.report_path;

      if (!url) {
        throw new Error("PDF URL not received");
      }

      setPdfUrl(url);
      setShowPdfViewer(true); // Show the viewer
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Print Failed",
        text: error?.message || "Unable to generate report",
      });
    }
  };

  return (
    <CustomModal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title="Main Standy"
      width={1000}
      footer=<div className="flex justify-between items-center px-6 py-4 border-t bg-white">
        <button
          className="btn btn-light flex items-center gap-2"
          onClick={() => handleSave()}
        >
          <Save size={16} /> Save
        </button>

        <div className="flex gap-3">
          <button className="btn btn-primary" onClick={callPrintApi}>
            Print
          </button>
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => handleSave({ printAfterSave: true })}
          >
            <Printer size={16} /> Save & Print
          </button>
          <button className="btn btn-primary">Two Language PDF</button>
        </div>
      </div>
    >
      <div className="max-h-[420px] overflow-y-auto pr-2">
        {/* Language Selector */}
        <div className="p-0 pt-0 mb-4">
          <p className="text-lg font-medium mb-2">Select Language</p>

          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setCurrentLang(0)}
              className={`flex-1 py-2 text-sm font-medium transition ${
                currentlang === 0
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              English
            </button>

            <button
              onClick={() => setCurrentLang(1)}
              className={`flex-1 py-2 text-sm font-medium border-l transition ${
                currentlang === 1
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Hindi
            </button>

            <button
              onClick={() => setCurrentLang(2)}
              className={`flex-1 py-2 text-sm font-medium border-l transition ${
                currentlang === 2
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Gujarati
            </button>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="counters">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {counters.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={String(item.id)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center justify-between gap-3 p-3 mb-3 rounded-xl border
                        ${
                          item.copies === 0
                            ? "bg-gray-50 text-gray-400"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        {/* Drag */}
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="text-gray-400" />
                        </div>

                        {/* Name */}
                        <input
                          value={
                            (currentlang === 0
                              ? item.itemNameEnglish
                              : currentlang === 1
                                ? item.itemNameHindi || item.itemNameEnglish
                                : item.itemNameGujarati || item.itemNameEnglish
                            )?.toUpperCase() || ""
                          }
                          onChange={(e) =>
                            handleNameChange(item.id, e.target.value)
                          }
                          disabled={item.copies === 0}
                          className="flex-1 bg-transparent font-semibold outline-none uppercase"
                        />

                        {/* Copies */}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {showPdfViewer && pdfUrl && (
          <CustomModal
            open={showPdfViewer}
            onClose={() => setShowPdfViewer(false)}
            title="Name Plate Report Preview"
            width={1000}
          >
            <div style={{ height: "80vh" }}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={pdfUrl}
                  plugins={[pdfPlugin]}
                  defaultScale={1.0}
                />
              </Worker>
            </div>
          </CustomModal>
        )}
      </div>

      {/* Footer */}
    </CustomModal>
  );
};

export default MainStandyMenuReport;
