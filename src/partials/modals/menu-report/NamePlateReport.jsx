import { useState ,useEffect } from "react";
import { CheckSquare, Square, FileText } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import RichTextEditor from "./RichTextEditor";
import Swal from "sweetalert2";
import {
  AddNamePlate,
  GenerateNamePlateReport,
  GetNamePlatedata,
} from "@/services/apiServices";


export default function NamePlateReport({
  onClose,
  eventId,
  eventFunctionId,
  selectedTemplateId,
}) {
  const pdfPlugin = defaultLayoutPlugin();

  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const [menuFontSize, setMenuFontSize] = useState(10);
  const [itemFontSize, setItemFontSize] = useState(15);
  const [activeTab, setActiveTab] = useState("menu");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
const userId = Number(localStorage.getItem("userId")) || null;
  const [currentlang, setCurrentLang] = useState(0);

const langMap = {
  english: 0,
  hindi: 1,
  gujarati: 2,
};

useEffect(() => {
  if (!eventId || userId == null) {
    console.warn("Cannot fetch NamePlate: missing eventId or userId", {
      eventId,
      eventFunctionId,
      currentlang,
    });
    return;
  }

  // Default to -1 if undefined
  const efId = eventFunctionId ;
  console.log("eventfunction", efId);
  
  fetchItemData(efId);
}, [eventId, eventFunctionId, currentlang,userId]);


const fetchItemData = async (efId) => {
  try {
    console.log("Fetching Name Plate Data...", {
      eventFunctionId,
      eventId,
      userId,   
      currentlang,
    });

    const res = await GetNamePlatedata(
      efId,
      eventId,
      userId,
      currentlang
    );

    console.log("Raw API Response:", res);

    const data = res?.data?.data?.data || [];
    console.log("Formatted API Data (before mapping):", data);

    setItems(
      data
        .sort((a, b) => a.sequence - b.sequence)
        .map((item) => ({
          id: item.id,
          name: item.itemNameEnglish,
          itemNameEnglish: item.itemNameEnglish,
          itemNameHindi: item.itemNameHindi,
          itemNameGujarati: item.itemNameGujarati,
          checked: item.isChecked === 1,
        }))
    );
  } catch (err) {
    console.error("Failed to fetch items:", err);
  }
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
       })
     );
   };
  const [items, setItems] = useState([
    { id: 1, name: "STRAWBERRY BLACK GREAPS", checked: true },
    { id: 2, name: "MINERAL WATER BOTTLE 200ML", checked: true },
    { id: 3, name: "LEMON MINT SODA", checked: false },
  ]);
  
  const [headerNotes, setHeaderNotes] = useState({
    english: "",
    hindi: "",
    gujarati: "",
  });
  
  const [footerNotes, setFooterNotes] = useState({
    english: "",
    hindi: "",
    gujarati: "",
  });

  const toggleItem = (id) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
  };

  const NotesEditor = ({ notes, setNotes, title }) => (
    <div className="space-y-6">
      {["english", "hindi", "gujarati"].map((lang) => (
        <div key={lang}>
          <p className="text-xs font-semibold text-gray-500 mb-2">
            {title} ({lang.charAt(0).toUpperCase() + lang.slice(1)})
          </p>
          <RichTextEditor
            value={notes[lang]}
            onChange={(val) => setNotes((prev) => ({ ...prev, [lang]: val }))}
          />
        </div>
      ))}
    </div>
  );

  const handleSave = async ({ printAfterSave = false } = {}) => {
    Swal.fire({
      title: "Saving...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const payload = {
        categoryFontSize: menuFontSize,
        itemFontSize: itemFontSize,
        eventFunctionId: Number(eventFunctionId),
        eventId: Number(eventId),
        userId: Number(userId),

        namePlateRequests: items.map((item, index) => ({
          id: item.id || -1,
          menuItemId: item.id,
          isChecked: item.checked ? 1 : 0,
          itemCount: 1,
          itemNameEnglish: item.name,
          itemNameHindi: item.name,
          itemNameGujarati: item.name,
          sequence: index + 1,
        })),

        headerNotesEnglish: headerNotes.english,
        headerNotesHindi: headerNotes.hindi,
        headerNotesGujarati: headerNotes.gujarati,

        footerNotesEnglish: footerNotes.english,
        footerNotesHindi: footerNotes.hindi,
        footerNotesGujarati: footerNotes.gujarati,
      };

      console.log("payload",payload);
      
      const res = await AddNamePlate(payload);
      console.log("post",res);
      

      if (!res?.data?.success) {
        throw new Error(res?.data?.msg || "Save failed");
      }

      Swal.close();

      if (printAfterSave) {
        await handlePrint();
      } else {
        Swal.fire("Saved Successfully", res?.data?.msg, "success");
        onClose();
      }
    } catch (err) {
      Swal.fire("Save Failed", err.message, "error");
    }
  };

  const handlePrint = async () => {
    try {
      const formData = new FormData();
      formData.append("adminTemplateModuleId", selectedTemplateId);
      formData.append("eventFunctionId", eventFunctionId);
      formData.append("eventId", eventId);
      formData.append("isCompanyDetails", 0);
      formData.append("lang", langMap[selectedLanguage]);
      formData.append("userId", userId);

      const res = await GenerateNamePlateReport(formData);

      const url = res?.data?.report_path;
      if (!url) throw new Error("PDF not generated");

      setPdfUrl(url);
      setShowPdfViewer(true);
    } catch (err) {
      Swal.fire("Print Failed", err.message, "error");
    }
  };

  return (
    <div className="bg-white rounded-xl border shadow-md mx-auto max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Table Menu Report</h2>
          <p className="text-sm text-gray-500">
            Customize your menu layout and notes
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Language Selector */}
      <div className="border-b p-4">
        <label className="block text-sm font-semibold mb-2 text-gray-700">
          Select Language
        </label>
        <div className="flex border rounded-lg overflow-hidden">
          {["english", "hindi", "gujarati"].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`flex-1 py-2 text-sm font-semibold transition ${
                selectedLanguage === lang
                  ? "btn btn-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mx-6 mt-4">
        {[
          { key: "menu", label: "Menu Item List" },
          { key: "header", label: "Header Notes" },
          { key: "footer", label: "Footer Notes" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 text-sm font-semibold py-2 rounded-xl transition-colors ${
              activeTab === tab.key
                ? "btn btn-primary text-white"
                : "text-gray-500 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* MENU TAB */}
        {activeTab === "menu" && (
          <>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label className="text-xs font-semibold text-gray-500">
                  MENU CATEGORY FONT SIZE
                </label>
                <input
                  type="number"
                  min={8}
                  max={20}
                  value={menuFontSize}
                  onChange={(e) => setMenuFontSize(Number(e.target.value))}
                  className="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">
                  MENU ITEM FONT SIZE
                </label>
                <input
                  type="number"
                  min={8}
                  max={20}
                  value={itemFontSize}
                  onChange={(e) => setItemFontSize(Number(e.target.value))}
                  className="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500">
                ACTIVE MENU ITEMS
              </span>
              <span className="text-xs text-blue-600 font-semibold">
                {items.filter((i) => i.checked).length} Items Selected
              </span>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="menu-items">
                {(provided) => (
                  <div
                    className="space-y-3"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                              item.checked
                                ? "bg-white"
                                : "bg-gray-100 opacity-70"
                            } ${
                              snapshot.isDragging ? "shadow-lg bg-blue-50" : ""
                            }`}
                          >
                            <span
                              {...provided.dragHandleProps}
                              className="cursor-move text-gray-400 text-lg"
                            >
                              ⋮⋮
                            </span>

                            <button onClick={() => toggleItem(item.id)}>
                              {item.checked ? (
                                <CheckSquare className="text-blue-600" />
                              ) : (
                                <Square className="text-gray-400" />
                              )}
                            </button>

                            <div>
                              <p className="text-xs text-gray-400 font-semibold">
                                NAME
                              </p>
                              <p
                                className={`font-semibold ${
                                  item.checked
                                    ? "text-gray-800"
                                    : "text-gray-400"
                                }`}
                                style={{ fontSize: `${itemFontSize}px` }}
                              >
                                {item.name}
                              </p>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </>
        )}

        {/* HEADER NOTES TAB */}
        {activeTab === "header" && (
          <NotesEditor
            notes={headerNotes}
            setNotes={setHeaderNotes}
            title="Table Menu Report Header Notes"
          />
        )}

        {/* FOOTER NOTES TAB */}
        {activeTab === "footer" && (
          <NotesEditor
            notes={footerNotes}
            setNotes={setFooterNotes}
            title="Table Menu Report Footer Notes"
          />
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-wrap justify-end gap-3 px-6 py-4 border-t bg-gray-50">
        <button
          onClick={() => handleSave()}
          className="px-4 py-2 rounded-lg border text-gray-600 font-semibold hover:bg-gray-100"
        >
          Save
        </button>
        <button className="btn btn-primary" onClick={handlePrint}>
          Print
        </button>
        {["PDF 1", "Word 1", "PDF 2", "Word 2"].map((label, i) => (
          <button
            key={i}
            className="btn btn-primary hover:bg-blue-700 flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg"
          >
            <FileText size={16} /> Design {label}
          </button>
        ))}
      </div>
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
  );
}
