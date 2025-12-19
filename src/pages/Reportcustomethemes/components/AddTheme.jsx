import { CustomModal } from "@/components/custom-modal/CustomModal";
import { useState, useEffect } from "react";
import { AddCustomTheme, GettemplatebyuserId } from "@/services/apiServices";
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

  // Fetch template options when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchTemplateOptions();
    }
  }, [isModalOpen]);

  const fetchTemplateOptions = async () => {
    setIsLoadingTemplates(true);
    try {
      const response = await GettemplatebyuserId();
      console.log("template", response);

      if (response?.data?.success && response?.data?.data) {
        // Extract template names from the API response
        // Adjust the mapping based on your actual API response structure
        const options = response.data.data.map((template) => ({
          id: template.id,
          name: template.nameEnglish || template.templateName || template.title,
        }));
        setTemplateOptions(options);
      } else {
        // Fallback to default options if API fails
        setTemplateOptions([
          { id: 1, name: "Birthday" },
          { id: 2, name: "Wedding" },
          { id: 3, name: "Festival" },
          { id: 4, name: "Corporate" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      // Fallback to default options on error
      setTemplateOptions([
        { id: 1, name: "Birthday" },
        { id: 2, name: "Wedding" },
        { id: 3, name: "Festival" },
        { id: 4, name: "Corporate" },
      ]);

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

  const validate = () => {
    let err = {};
    if (!templateName) err.templateName = "Please select template name";
    if (!nameplateName) err.nameplateName = "Please enter nameplate name";
    if (templates.length === 0) err.templates = "Add at least 1 template";
    if (!nameplate) err.nameplate = "Add one nameplate image";
    if (!dummyPdf) err.dummyPdf = "Add dummy PDF";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleDummyPdf = (file) => {
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      Swal.fire({
        title: "Invalid File",
        text: "Please upload a PDF file",
        icon: "error",
      });
      return;
    }

    // Validate file size (10MB limit)
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

  const handleSave = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");

      // Create FormData
      const formData = new FormData();

      // Find the selected template ID
      const selectedTemplate = templateOptions.find(
        (opt) => opt.name === templateName
      );

      // Add basic fields in the exact format backend expects
      formData.append("contentFontColor", contentColor);
      formData.append("headingFontColor", headingColor);
      formData.append("isNamePlate", nameplate ? "true" : "false");
      formData.append("name", nameplateName);
      formData.append("templateModuleId", selectedTemplate?.id || 1);
      formData.append("userId", userId);

      // Add dummy PDF
      if (dummyPdf) {
        formData.append("dummyPdf", dummyPdf);
      }

      // Add nameplate image
      if (nameplate) {
        formData.append("namePlateBg", nameplate.file);
      }

      // ✅ Send template images as menuReportPages (multiple files)
      templates.forEach((template) => {
        formData.append("menuReportPages", template.file);
      });

      // Debug: Log FormData contents
      console.log("=== FormData Contents ===");
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

      // Call API
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

        // Reset form
        resetForm();
        setIsModalOpen(false);

        // Refresh data if callback provided
        if (refreshData) refreshData();
      } else {
        throw new Error(response?.data?.msg || "Failed to add template");
      }
    } catch (error) {
      console.error("=== Error Details ===");
      console.error("Error:", error);

      // Enhanced error logging
      if (error.response) {
        // Server responded with error
        console.error("Response Data:", error.response.data);
        console.error("Response Status:", error.response.status);
        console.error("Response Headers:", error.response.headers);
      } else if (error.request) {
        // Request was made but no response
        console.error("No Response Received");
        console.error("Request:", error.request);
      } else {
        // Error in request setup
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

  const resetForm = () => {
    setTemplateName("");
    setNameplateName("");
    setTemplates([]);
    setNameplate(null);
    setHeadingColor("rgba(31,41,55,1)");
    setContentColor("rgba(75,85,99,1)");
    setDummyPdf(null);
    setErrors({});
  };

  const handleAddTemplate = (files) => {
    if (!files || files.length === 0) return;

    const fileArr = Array.from(files);

    // Check total count
    if (templates.length + fileArr.length > 4) {
      Swal.fire({
        title: "Too Many Files",
        text: "Maximum 4 templates allowed",
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
            {isLoading ? "Saving..." : "Save"}
          </button>,
        ]}
      >
        <div className="grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          {/* LEFT SIDE - PREVIEW */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Preview</h3>

            {/* Templates Grid */}
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
              {[...Array(4 - templates.length)].map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center text-gray-400"
                >
                  Empty Slot
                </div>
              ))}
            </div>

            {/* Nameplate */}
            <div>
              <h4 className="font-medium mb-2">Nameplate Preview</h4>
              {nameplate ? (
                <div className="relative border rounded-lg overflow-hidden">
                  <img
                    src={nameplate.url}
                    alt="Nameplate"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={removeNameplate}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center text-gray-400">
                  No Nameplate
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="space-y-4">
            {/* TEMPLATE NAME */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Template Name
              </label>
              <select
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoadingTemplates}
              >
                <option value="">
                  {isLoadingTemplates ? "Loading..." : "Select Template"}
                </option>
                {templateOptions.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
              {errors.templateName && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.templateName}
                </div>
              )}
            </div>

            {/* NAMEPLATE NAME */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Nameplate Name
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

            {/* TEMPLATE UPLOAD */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Template Images (Max 4)
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
                  Click to upload templates
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

            {/* NAMEPLATE UPLOAD */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Nameplate Image
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
                className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
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

            {/* DUMMY PDF */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Dummy PDF
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
                <div className="text-gray-400 text-sm mt-1">PDF (Max 10MB)</div>
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
                    value={headingColor.match(/#[0-9A-Fa-f]{6}/) || "#1f2937"}
                    onChange={(e) => setHeadingColor(hexToRgba(e.target.value))}
                    className="w-12 h-10 border rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{headingColor}</span>
                </div>

                {/* Content Color */}
                <div className="flex items-center gap-3">
                  <label className="text-sm w-32">Content Text</label>
                  <input
                    type="color"
                    value={contentColor.match(/#[0-9A-Fa-f]{6}/) || "#4b5563"}
                    onChange={(e) => setContentColor(hexToRgba(e.target.value))}
                    className="w-12 h-10 border rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{contentColor}</span>
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
