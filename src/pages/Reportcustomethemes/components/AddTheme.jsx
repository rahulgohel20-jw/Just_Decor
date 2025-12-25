import { CustomModal } from "@/components/custom-modal/CustomModal";
import { useState, useEffect } from "react";
import {
  AddCustomTheme,
  GettemplatebyuserId,
  GetAllThemeType,
} from "@/services/apiServices";
import Swal from "sweetalert2";

const AddTheme = ({ isModalOpen, setIsModalOpen, refreshData }) => {
  const [templateName, setTemplateName] = useState("");
  const [nameplateName, setNameplateName] = useState("");
  const [templates, setTemplates] = useState([]);
  const [nameplate, setNameplate] = useState(null);
  const [headingColor, setHeadingColor] = useState("rgba(31,41,55,1)");
  const [contentColor, setContentColor] = useState("rgba(75,85,99,1)");
  const [errors, setErrors] = useState({});
  const [dummyPdf, setDummyPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [templateModule, setTemplateModule] = useState("");
  const [moduleOptions, setModuleOptions] = useState([]);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [activeTab, setActiveTab] = useState("template"); // 'template' or 'nameplate'

  useEffect(() => {
    if (isModalOpen) {
      fetchTemplateOptions();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!templateName) {
      setModuleOptions([]);
      setTemplateModule("");
      return;
    }

    const fetchModulesByTemplate = async () => {
      try {
        setIsLoadingModules(true);

        const res = await GetAllThemeType(templateName);

        if (res?.data?.success) {
          const modules = res.data.data || [];

          const moduleOptions = modules.map((module) => ({
            id: module.id,
            name: module.nameEnglish || module.name || module.moduleName,
          }));

          setModuleOptions(moduleOptions);
          setTemplateModule("");
        } else {
          setModuleOptions([]);
        }
      } catch (error) {
        console.error("Error loading modules:", error);
        setModuleOptions([]);

        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Unable to load modules for selected template",
        });
      } finally {
        setIsLoadingModules(false);
      }
    };

    fetchModulesByTemplate();
  }, [templateName]);

  const fetchTemplateOptions = async () => {
    setIsLoadingTemplates(true);
    try {
      const response = await GettemplatebyuserId();
      console.log("template", response);

      if (response?.data?.success && response?.data?.data) {
        const options = response.data.data.map((template) => ({
          id: template.id,
          name: template.nameEnglish || template.templateName || template.title,
        }));
        setTemplateOptions(options);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);

      Swal.fire({
        title: "Warning",
        text: "Could not load templates. Using default options.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  // Validation for Template Tab
  const validateTemplateTab = () => {
    let err = {};

    if (templates.length === 0) err.templates = "Add at least 1 template";
    if (!dummyPdf) err.dummyPdf = "Add dummy PDF";
    if (!templateName) err.templateName = "Please select template name";
    if (!templateModule) err.templateModule = "Please select template module";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Validation for Nameplate Tab
  const validateNameplateTab = () => {
    let err = {};

    if (!nameplateName) err.nameplateName = "Please enter nameplate name";
    if (!nameplate) err.nameplate = "Add one nameplate image";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleDummyPdf = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      Swal.fire({
        title: "Invalid File",
        text: "Please upload a PDF file",
        icon: "error",
      });
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      Swal.fire({
        title: "File Too Large",
        text: "PDF file must be less than 10MB",
        icon: "error",
      });
      return;
    }

    setDummyPdf(file);
  };

  const removeDummyPdf = () => {
    setDummyPdf(null);
  };

  // Save handler for Template Tab
  const handleSaveTemplate = async () => {
    if (!validateTemplateTab()) return;

    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");

      const selectedTemplate = templateOptions.find(
        (template) => String(template.id) === String(templateName)
      );

      const selectedTemplateName = selectedTemplate?.name || "";

      console.log("name", selectedTemplateName);

      const formData = new FormData();

      formData.append("contentFontColor", contentColor);
      formData.append("headingFontColor", headingColor);
      formData.append("isNamePlate", "false"); // Template tab doesn't include nameplate
      formData.append("name", selectedTemplateName);
      formData.append("templateMappingId", templateModule);
      formData.append("templateModuleId", templateName);
      formData.append("userId", userId);

      if (dummyPdf) {
        formData.append("dummyPdf", dummyPdf);
      }

      templates.forEach((template) => {
        formData.append("menuReportPages", template.file);
      });

      console.log("=== FormData Contents (Template) ===");
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(
            pair[0],
            `[File: ${pair[1].name}, Size: ${pair[1].size} bytes]`
          );
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      const response = await AddCustomTheme(formData);
      console.log("API Response:", response);

      if (response?.data?.success) {
        Swal.fire({
          title: "Success!",
          text: response.data.msg || "Template added successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        resetForm();
        setIsModalOpen(false);

        if (refreshData) refreshData();
      } else {
        throw new Error(response?.data?.msg || "Failed to add template");
      }
    } catch (error) {
      console.error("=== Error Details ===");
      console.error("Error:", error);

      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
        console.error("Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No Response Received");
        console.error("Request:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }

      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.msg ||
          error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.message ||
          error.message ||
          "Something went wrong. Please try again.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save handler for Nameplate Tab
  const handleSaveNameplate = async () => {
    if (!validateNameplateTab()) return;

    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");

      const formData = new FormData();

      formData.append("isNamePlate", "true"); // Nameplate tab includes nameplate
      formData.append("name", nameplateName);
      formData.append("userId", userId);

      formData.append("contentFontColor", null);
      formData.append("headingFontColor", null);

      formData.append("dummyPdf", null);

      formData.append("menuReportPages", null);

      if (nameplate) {
        formData.append("namePlateBg", nameplate.file);
      }

      console.log("=== FormData Contents (Nameplate) ===");
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(
            pair[0],
            `[File: ${pair[1].name}, Size: ${pair[1].size} bytes]`
          );
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      const response = await AddCustomTheme(formData);
      console.log("API Response:", response);

      if (response?.data?.success) {
        Swal.fire({
          title: "Success!",
          text: response.data.msg || "Nameplate added successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        resetForm();
        setIsModalOpen(false);

        if (refreshData) refreshData();
      } else {
        throw new Error(response?.data?.msg || "Failed to add nameplate");
      }
    } catch (error) {
      console.error("=== Error Details ===");
      console.error("Error:", error);

      if (error.response) {
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
        console.error("Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No Response Received");
        console.error("Request:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }

      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.msg ||
          error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.message ||
          error.message ||
          "Something went wrong. Please try again.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Main save handler that routes to appropriate function
  const handleSave = () => {
    if (activeTab === "template") {
      handleSaveTemplate();
    } else {
      handleSaveNameplate();
    }
  };

  const resetForm = () => {
    setTemplateName("");
    setNameplateName("");
    setTemplates([]);
    setNameplate(null);
    setHeadingColor("rgba(31,41,55,1)");
    setContentColor("rgba(75,85,99,1)");
    setDummyPdf(null);
    setErrors({});
    setTemplateModule("");
    setModuleOptions([]);
    setActiveTab("template");
  };

  const handleAddTemplate = (files) => {
    if (!files || files.length === 0) return;

    const fileArr = Array.from(files);

    // Check total count - MAX 6
    if (templates.length + fileArr.length > 6) {
      Swal.fire({
        title: "Too Many Files",
        text: "Maximum 6 templates allowed",
        icon: "warning",
      });
      return;
    }

    // Validate file types and sizes
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    for (let file of fileArr) {
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: "Invalid File Type",
          text: `${file.name} is not a valid image file. Please upload JPG, PNG, or WEBP images.`,
          icon: "error",
        });
        return;
      }

      if (file.size > maxSize) {
        Swal.fire({
          title: "File Too Large",
          text: `${file.name} exceeds 5MB limit`,
          icon: "error",
        });
        return;
      }
    }

    const newTemplates = fileArr.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setTemplates([...templates, ...newTemplates]);
  };

  const removeTemplate = (index) => {
    const updated = [...templates];
    // Revoke object URL to free memory
    URL.revokeObjectURL(updated[index].url);
    updated.splice(index, 1);
    setTemplates(updated);
  };

  const handleAddNameplate = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        title: "Invalid File Type",
        text: "Please upload a valid image file (JPG, PNG, WEBP)",
        icon: "error",
      });
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      Swal.fire({
        title: "File Too Large",
        text: "Nameplate image must be less than 5MB",
        icon: "error",
      });
      return;
    }

    setNameplate({
      file,
      url: URL.createObjectURL(file),
    });
  };

  const removeNameplate = () => {
    if (nameplate) {
      URL.revokeObjectURL(nameplate.url);
    }
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
        onClose={() => {
          resetForm();
          setIsModalOpen(false);
        }}
        title="Add Template"
        width={900}
        footer={[
          <button
            key="cancel"
            onClick={() => {
              resetForm();
              setIsModalOpen(false);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>,
          <button
            key="save"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : activeTab === "template"
                ? "Save Theme"
                : "Save Nameplate"}
          </button>,
        ]}
      >
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("template")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "template"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Theme
          </button>
          <button
            onClick={() => setActiveTab("nameplate")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "nameplate"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Nameplate
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          {activeTab === "template" ? (
            // TEMPLATE TAB
            <div className="grid grid-cols-2 gap-6">
              {/* LEFT SIDE - PREVIEW */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Preview</h3>

                {/* Templates Grid - Max 6 */}
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((t, i) => (
                    <div
                      key={i}
                      className="relative border rounded-lg overflow-hidden"
                    >
                      <img
                        src={t.url}
                        alt={`Template ${i + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        onClick={() => removeTemplate(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  {/* Empty Slots */}
                  {[...Array(6 - templates.length)].map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center text-gray-400"
                    >
                      Empty Slot
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE - FORM */}
              <div className="space-y-4">
                {/* TEMPLATE NAME - First Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={templateName}
                    onChange={(e) => {
                      setTemplateName(e.target.value);
                      setTemplateModule(""); // Reset module when template changes
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={isLoadingTemplates}
                  >
                    <option value="">
                      {isLoadingTemplates
                        ? "Loading templates..."
                        : "Select Template Name"}
                    </option>

                    {templateOptions.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>

                  {errors.templateName && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.templateName}
                    </div>
                  )}
                </div>

                {/* TEMPLATE MODULE - Dependent Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Template Module <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={templateModule}
                    onChange={(e) => setTemplateModule(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={!templateName || isLoadingModules}
                  >
                    <option value="">
                      {!templateName
                        ? "Select Template First"
                        : isLoadingModules
                          ? "Loading modules..."
                          : "Select Template Module"}
                    </option>

                    {moduleOptions.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.name}
                      </option>
                    ))}
                  </select>

                  {errors.templateModule && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.templateModule}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nameplate Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nameplateName}
                    onChange={(e) => setNameplateName(e.target.value)}
                    placeholder="Enter nameplate name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.nameplateName && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.nameplateName}
                    </div>
                  )}
                </div>

                {/* TEMPLATE UPLOAD - Max 6 */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Template Images (Max 6){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="templateUpload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={(e) => handleAddTemplate(e.target.files)}
                    className="hidden"
                  />
                  <div
                    onClick={() =>
                      document.getElementById("templateUpload").click()
                    }
                    className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="text-gray-600 font-medium">
                      Click to upload templates ({templates.length}/6)
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      JPG, PNG, WEBP (Max 5MB each)
                    </div>
                  </div>
                  {errors.templates && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.templates}
                    </div>
                  )}
                </div>

                {/* DUMMY PDF */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Dummy PDF <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="dummypdfUpload"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleDummyPdf(e.target.files[0])}
                    className="hidden"
                  />
                  <div
                    onClick={() =>
                      document.getElementById("dummypdfUpload").click()
                    }
                    className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="text-gray-600 font-medium">
                      Click to upload PDF
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      PDF (Max 10MB)
                    </div>
                  </div>
                  {dummyPdf && (
                    <div className="mt-2 flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">📄 {dummyPdf.name}</span>
                      <button
                        onClick={removeDummyPdf}
                        className="text-red-500 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {errors.dummyPdf && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.dummyPdf}
                    </div>
                  )}
                </div>

                {/* COLOR SCHEME */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Color Scheme
                  </label>
                  <div className="space-y-3">
                    {/* Heading Color */}
                    <div className="flex items-center gap-3">
                      <label className="text-sm w-32">Heading Text</label>
                      <input
                        type="color"
                        value={
                          headingColor.match(/#[0-9A-Fa-f]{6}/) || "#1f2937"
                        }
                        onChange={(e) =>
                          setHeadingColor(hexToRgba(e.target.value))
                        }
                        className="w-12 h-10 border rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">
                        {headingColor}
                      </span>
                    </div>

                    {/* Content Color */}
                    <div className="flex items-center gap-3">
                      <label className="text-sm w-32">Content Text</label>
                      <input
                        type="color"
                        value={
                          contentColor.match(/#[0-9A-Fa-f]{6}/) || "#4b5563"
                        }
                        onChange={(e) =>
                          setContentColor(hexToRgba(e.target.value))
                        }
                        className="w-12 h-10 border rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">
                        {contentColor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // NAMEPLATE TAB
            <div className="grid grid-cols-2 gap-6">
              {/* LEFT SIDE - NAMEPLATE PREVIEW */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Nameplate Preview</h3>
                {nameplate ? (
                  <div className="relative border rounded-lg overflow-hidden">
                    <img
                      src={nameplate.url}
                      alt="Nameplate"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={removeNameplate}
                      className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1.5 text-sm rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="mt-2 text-sm">No Nameplate Image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE - NAMEPLATE FORM */}
              <div className="space-y-4">
                {/* NAMEPLATE NAME */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nameplate Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nameplateName}
                    onChange={(e) => setNameplateName(e.target.value)}
                    placeholder="Enter nameplate name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.nameplateName && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.nameplateName}
                    </div>
                  )}
                </div>

                {/* NAMEPLATE UPLOAD */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nameplate Image <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nameplateUpload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleAddNameplate(e.target.files[0])}
                    className="hidden"
                  />
                  <div
                    onClick={() =>
                      document.getElementById("nameplateUpload").click()
                    }
                    className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition"
                  >
                    <div className="text-gray-600 font-medium">
                      Click to upload nameplate
                    </div>
                    <div className="text-gray-400 text-sm mt-1">
                      JPG, PNG, WEBP (Max 5MB)
                    </div>
                  </div>
                  {errors.nameplate && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.nameplate}
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <div className="flex">
                    <svg
                      className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-sm text-blue-700">
                      <p className="font-medium">Independent Save</p>
                      <p className="mt-1">
                        You can save nameplate details separately. Theme tab and
                        Nameplate tab are independent of each other.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CustomModal>
    )
  );
};

export default AddTheme;
