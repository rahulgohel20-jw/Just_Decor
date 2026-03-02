import { useState, useEffect } from "react";
import { CheckSquare, Square } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Printer } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import RichTextEditor from "./RichTextEditor";
import Swal from "sweetalert2";
import {
  AddNamePlate,
  Translateapi,
  GenerateNamePlateReport,
  GetNamePlateByNamePlateType,
  getTableExeculisive,
  Tableexeculisivepost,
} from "@/services/apiServices";

export default function NamePlateReport({
  onClose,
  eventId,
  eventFunctionId,
  selectedTemplateId,
  isTableMenuExclusive,
}) {
  console.log(isTableMenuExclusive);

  const pdfPlugin = defaultLayoutPlugin();

  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const [menuFontSize, setMenuFontSize] = useState();
  const [itemFontSize, setItemFontSize] = useState();
  const [activeTab, setActiveTab] = useState("menu");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [currentlang, setCurrentLang] = useState(0);
  const storedUserId = localStorage.getItem("userId");
  const [tableMenuItems, setTableMenuItems] = useState([]);

  const userId =
    storedUserId && Number(storedUserId) > 0 ? Number(storedUserId) : null;

  const langMap = {
    english: 0,
    hindi: 1,
    gujarati: 2,
  };

  useEffect(() => {
    const efId = eventFunctionId;
    console.log("eventfunction", efId);

    fetchItemData(efId);
  }, [eventId, eventFunctionId, currentlang, userId]);

  const fetchItemData = async (efId) => {
    if (!userId) return;

    try {
      let res;

      if (isTableMenuExclusive) {
        res = await getTableExeculisive(
          efId ?? -1,
          eventId,
          currentlang,
          userId,
        );
      } else {
        res = await GetNamePlateByNamePlateType(
          efId ?? -1,
          eventId,
          0,
          0,
          1,
          currentlang,
          userId,
        );
      }

      const apiData = res?.data?.data;
      const list = apiData?.data || [];

      // ✅ SET FONT SIZES FROM API
      setMenuFontSize(apiData?.category_font_size ?? 10);
      setItemFontSize(apiData?.item_font_size ?? 15);

      setItems(
        list
          .sort((a, b) => a.sequence - b.sequence)
          .map((item, index) => ({
            id: item.id,
            menuid: item.menuItemId,

            itemNameEnglish: item.itemNameEnglish || "",
            itemNameHindi: item.itemNameHindi || "",
            itemNameGujarati: item.itemNameGujarati || "",

            isTableMenuChecked: item.isTableMenuChecked === 1,
            is_checked: item.is_checked === 1,
            isStandyChecked: item.isStandyChecked === 1,

            sequence: item.sequence ?? index + 1,
          })),
      );
    } catch (err) {
      console.error("Failed to fetch name plate data:", err);
    }
  };

  const handleNameChange = async (menuItemId, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.menuid === menuItemId ? { ...item, itemNameEnglish: value } : item,
      ),
    );

    if (currentlang === 0) {
      try {
        const res = await Translateapi(value);
        const hindi = res?.data?.hindi || value;
        const gujarati = res?.data?.gujarati || value;

        setItems((prev) =>
          prev.map((item) =>
            item.menuid === menuItemId
              ? { ...item, itemNameHindi: hindi, itemNameGujarati: gujarati }
              : item,
          ),
        );
      } catch (err) {
        console.error("Transliteration failed", err);
      }
    }
  };

  const [items, setItems] = useState([]);

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
  const getItemNameByLang = (item) => {
    if (currentlang === 1) return item.itemNameHindi || item.itemNameEnglish;
    if (currentlang === 2) return item.itemNameGujarati || item.itemNameEnglish;
    return item.itemNameEnglish;
  };

  const toggleItem = (menuid) => {
    setItems((prev) =>
      prev.map((item) =>
        item.menuid === menuid
          ? isTableMenuExclusive
            ? { ...item, is_checked: !item.is_checked }
            : { ...item, isTableMenuChecked: !item.isTableMenuChecked }
          : item,
      ),
    );
  };

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

        isCounterItem: 0,
        isStandyItem: 0,
        isTableMenuItem: 1,

        namePlateRequests: items.map((item, index) => ({
          id: item.id || -1,
          menuItemId: item.menuid,

          isTableMenuChecked: item.isTableMenuChecked ? 1 : 0,
          isStandyChecked: 0,

          itemCount: 1,

          itemNameEnglish: item.itemNameEnglish,
          itemNameHindi: item.itemNameHindi,
          itemNameGujarati: item.itemNameGujarati,

          sequence: index + 1,
        })),
      };

      const TablePayload = {
        categoryFontSize: menuFontSize,
        itemFontSize: itemFontSize,
        eventFunctionId: Number(eventFunctionId),
        eventId: Number(eventId),
        userId: Number(userId),
        items: items.map((item, index) => ({
          id: item.id || -1,
          menuItemId: item.menuid,
          is_checked: item.is_checked ? 1 : 0,
          itemCount: 1,
          itemNameEnglish: item.itemNameEnglish,
          itemNameHindi: item.itemNameHindi,
          itemNameGujarati: item.itemNameGujarati,

          sequence: index + 1,
        })),
      };
      let res;

      if (isTableMenuExclusive) {
        res = await Tableexeculisivepost(TablePayload);
      } else {
        res = await AddNamePlate(payload);
      }

      if (!res?.data?.success) {
        throw new Error(res?.data?.msg || "Save failed");
      }
      await fetchItemData();
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
      formData.append("twoLanugage", 0);
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
    <div className=" rounded-xl border shadow-md mx-auto max-w-5xl">
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
              onClick={() => {
                setSelectedLanguage(lang);
                setCurrentLang(langMap[lang]);
              }}
              className={`flex-1 py-2 text-sm font-semibold transition ${
                selectedLanguage === lang
                  ? "btn btn-primary text-white"
                  : "bg-white "
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
                <span className="text-xs text-blue-600 font-semibold">
                  {
                    items.filter((i) =>
                      isTableMenuExclusive
                        ? i.is_checked
                        : i.isTableMenuChecked,
                    ).length
                  }{" "}
                  Items Selected
                </span>{" "}
                Selected
              </span>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="menu-items">
                {(provided) => (
                  <div
                    className="space-y-3 max-h-[150px] overflow-y-auto pr-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {items.map((item, index) => (
                      <Draggable
                        key={item.menuid ?? `temp-${index}`}
                        draggableId={(
                          item.menuid ?? `temp-${index}`
                        ).toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                              (
                                isTableMenuExclusive
                                  ? item.is_checked
                                  : item.isTableMenuChecked
                              )
                                ? "bg-white"
                                : "bg-gray-100 opacity-70"
                            } ${snapshot.isDragging ? "shadow-lg bg-blue-50" : ""}`}
                          >
                            {/* Drag handle */}
                            <span
                              {...provided.dragHandleProps}
                              className="cursor-move text-gray-400 text-lg"
                            >
                              ⋮⋮
                            </span>

                            <button onClick={() => toggleItem(item.menuid)}>
                              {(
                                isTableMenuExclusive
                                  ? item.is_checked
                                  : item.isTableMenuChecked
                              ) ? (
                                <CheckSquare className="text-blue-600" />
                              ) : (
                                <Square className="text-gray-400" />
                              )}
                            </button>

                            {/* Item Name */}
                            {/* Item Name - Now Editable */}
                            <div className="flex-1">
                              <p className="text-xs text-gray-400 font-semibold mb-1">
                                NAME
                              </p>
                              <input
                                type="text"
                                value={getItemNameByLang(item)}
                                onChange={(e) =>
                                  handleNameChange(item.menuid, e.target.value)
                                }
                                disabled={
                                  !(isTableMenuExclusive
                                    ? item.is_checked
                                    : item.isTableMenuChecked)
                                }
                                className={`w-full font-semibold border rounded px-2 py-1 ${
                                  (
                                    isTableMenuExclusive
                                      ? item.is_checked
                                      : item.isTableMenuChecked
                                  )
                                    ? "text-gray-800 bg-white"
                                    : "text-gray-400 bg-gray-50"
                                }`}
                              />
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
        {/* <button
          onClick={() => handleSave()}
          className="px-4 py-2 rounded-lg border text-gray-600 font-semibold hover:bg-gray-100"
        >
          Save
        </button> */}
        {/* <button className="btn btn-primary" onClick={handlePrint}>
          Print
        </button> */}
        <button
          className="btn btn-primary flex items-center gap-2"
          onClick={() => handleSave({ printAfterSave: true })}
        >
          <Printer size={16} /> Save & Print
        </button>{" "}
      </div>
      {showPdfViewer && pdfUrl && (
        <CustomModal
          open={showPdfViewer}
          onClose={() => setShowPdfViewer(false)}
          title="Table Menu Report"
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
