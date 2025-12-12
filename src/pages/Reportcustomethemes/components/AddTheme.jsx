import { CustomModal } from "@/components/custom-modal/CustomModal";
import { useState } from "react";

const AddTheme = ({ isModalOpen, setIsModalOpen }) => {
  const [templateName, setTemplateName] = useState("");
  const [nameplateName, setNameplateName] = useState("");
  const [templates, setTemplates] = useState([]);
  const [nameplate, setNameplate] = useState(null);
  const [headingColor, setHeadingColor] = useState("rgba(31,41,55,1)");
  const [contentColor, setContentColor] = useState("rgba(75,85,99,1)");
  const [errors, setErrors] = useState({});
  const [dummyPdf, setDummyPdf] = useState(null);

  const templateNameOptions = ["Birthday", "Wedding", "Festival", "Corporate"];

  const validate = () => {
    let err = {};

    if (!templateName) err.templateName = "Please select template name";
    if (!nameplateName) err.nameplateName = "Please enter nameplate name";
    if (templates.length === 0) err.templates = "Add at least 1 template";
    if (!nameplate) err.nameplate = "Add one nameplate image";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleDummyPdf = (file) => {
    if (!file) return;
    setDummyPdf(file);
  };
  const removeDummyPdf = () => {
    setDummyPdf(null);
  };

  const handleSave = () => {
    if (!validate()) return;

    const data = {
      templateName,
      nameplateName,
      templates,
      nameplate,
      headingColor,
      contentColor,
    };

    console.log("Saving:", data);
    setIsModalOpen(false);
  };

  const handleAddTemplate = (files) => {
    const fileArr = Array.from(files);

    if (templates.length + fileArr.length > 4) {
      alert("Max 4 templates allowed");
      return;
    }

    const newTemplates = fileArr.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setTemplates([...templates, ...newTemplates]);
  };

  const removeTemplate = (index) => {
    const updated = [...templates];
    updated.splice(index, 1);
    setTemplates(updated);
  };

  const handleAddNameplate = (file) => {
    if (!file) return;

    setNameplate({
      file,
      url: URL.createObjectURL(file),
    });
  };

  const removeNameplate = () => {
    setNameplate(null);
  };

  const hexToRgba = (hex) => {
    let r = 0,
      g = 0,
      b = 0;

    if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }

    return `rgba(${r},${g},${b},1)`;
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add  Template"
        width={900}
        footer={[
          <button
            key="add"
            className="btn btn-success"
            title="Save"
            onClick={handleSave}
          >
            Save
          </button>,
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-9 gap-6">
          {/* LEFT SIDE - PREVIEW */}
          <div className="md:col-span-4">
            <div className="grid grid-cols-2 gap-4">
              {templates.map((t, i) => (
                <div key={i} className="relative">
                  <img
                    src={t.url}
                    className="h-40 md:h-[240px] w-full object-cover rounded-xl border"
                  />

                  <button
                    onClick={() => removeTemplate(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* Empty Slots */}
              {[...Array(4 - templates.length)].map((_, i) => (
                <div
                  key={"empty" + i}
                  className="h-40 md:h-[240px] border rounded-xl bg-gray-100 
                  flex items-center justify-center text-gray-400"
                >
                  Empty Slot
                </div>
              ))}

              {/* Nameplate */}
              <div className="col-span-2 mt-3 relative">
                {nameplate ? (
                  <>
                    <img
                      src={nameplate.url}
                      className="h-32 w-full object-cover rounded-xl border"
                    />

                    <button
                      onClick={removeNameplate}
                      className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <div className="h-32 border rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                    No Nameplate
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="md:col-span-5 bg-white border rounded-xl p-4 shadow-sm space-y-4">
            {/* TEMPLATE NAME */}
            <div>
              <label className="text-sm font-medium">Template Name</label>
              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-100 text-sm"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              >
                <option value="">Select Template</option>
                {templateNameOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              {errors.templateName && (
                <p className="text-red-500 text-xs">{errors.templateName}</p>
              )}
            </div>

            {/* NAMEPLATE NAME */}
            <div>
              <label className="text-sm font-medium">Nameplate Name</label>
              <input
                type="text"
                className="mt-1 w-full border rounded-lg px-3 py-2 bg-gray-100 text-sm"
                value={nameplateName}
                onChange={(e) => setNameplateName(e.target.value)}
              />

              {errors.nameplateName && (
                <p className="text-red-500 text-xs">{errors.nameplateName}</p>
              )}
            </div>

            {/* TEMPLATE UPLOAD */}
            <div>
              <label className="text-sm font-medium">Template Images</label>
              <input
                type="file"
                multiple
                className="hidden"
                id="templateUpload"
                onChange={(e) => handleAddTemplate(e.target.files)}
              />
              <div
                onClick={() =>
                  document.getElementById("templateUpload").click()
                }
                className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
              >
                Upload Templates
              </div>

              {errors.templates && (
                <p className="text-red-500 text-xs">{errors.templates}</p>
              )}
            </div>

            {/* NAMEPLATE UPLOAD */}
            <div>
              <label className="text-sm font-medium">Nameplate Image</label>
              <input
                type="file"
                className="hidden"
                id="nameplateUpload"
                onChange={(e) => handleAddNameplate(e.target.files[0])}
              />
              <div
                onClick={() =>
                  document.getElementById("nameplateUpload").click()
                }
                className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
              >
                Upload Nameplate
              </div>

              {errors.nameplate && (
                <p className="text-red-500 text-xs">{errors.nameplate}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Dummy PDF</label>
              <input
                type="file"
                className="hidden"
                id="dummypdfUpload"
                accept="application/pdf"
                onChange={(e) => handleDummyPdf(e.target.files[0])}
              />

              <div
                onClick={() =>
                  document.getElementById("dummypdfUpload").click()
                }
                className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
              >
                Upload Dummy PDF
              </div>
              {dummyPdf && (
                <div className="flex items-center justify-between mt-2 bg-gray-100 px-3 py-2 rounded">
                  <p className="text-xs text-gray-700 flex items-center gap-1">
                    {dummyPdf.name}
                  </p>

                  <button
                    onClick={removeDummyPdf}
                    className="text-red-500 text-xs font-medium hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* COLOR SCHEME */}
            <div>
              <p className="font-medium text-sm mb-3">Color Scheme</p>

              <div className="grid grid-cols-2 gap-6">
                {/* Heading Color */}
                <div>
                  <p className="text-sm mb-1">Heading Text</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-10 h-10"
                      onChange={(e) =>
                        setHeadingColor(hexToRgba(e.target.value))
                      }
                    />
                    <span className="text-sm">{headingColor}</span>
                  </div>
                </div>

                {/* Content Color */}
                <div>
                  <p className="text-sm mb-1">Content Text</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-10 h-10"
                      onChange={(e) =>
                        setContentColor(hexToRgba(e.target.value))
                      }
                    />
                    <span className="text-sm">{contentColor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
    )
  );
};

export default AddTheme;
