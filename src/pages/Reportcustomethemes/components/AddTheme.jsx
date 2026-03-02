import { CustomModal } from "@/components/custom-modal/CustomModal";
import { useState, useEffect } from "react";
import {
  AddCustomTheme,
  GettemplatebyuserId,
  GetAllThemeType,
} from "@/services/apiServices";
import Swal from "sweetalert2";
import { UpdateCustomTheme } from "../../../services/apiServices";

const AddTheme = ({
  isModalOpen,
  setIsModalOpen,
  refreshData,
  isEditMode = false,
  editingTheme = null,
}) => {
  const [nameplateName, setNameplateName] = useState("");
  const [templates, setTemplates] = useState([]);
  const [nameplates, setNameplates] = useState([]);
  const [headingColor, setHeadingColor] = useState("rgba(31,41,55,1)");
  const [contentColor, setContentColor] = useState("rgba(75,85,99,1)");
  const [errors, setErrors] = useState({});
  const [dummyPdf, setDummyPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [activeTab, setActiveTab] = useState("template");
  const [removedExistingImages, setRemovedExistingImages] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [description, setDescription] = useState("");
  const [themeTemplateName, setThemeTemplateName] = useState("");
  const [themeTemplateModule, setThemeTemplateModule] = useState("");
  const [themeModuleOptions, setThemeModuleOptions] = useState([]);
  const [isLoadingThemeModules, setIsLoadingThemeModules] = useState(false);
  const [price, setPrice] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [nameplateTemplateName, setNameplateTemplateName] = useState("");
  const [nameplateTemplateModule, setNameplateTemplateModule] = useState("");
  const [nameplateModuleOptions, setNameplateModuleOptions] = useState([]);
  const [isLoadingNameplateModules, setIsLoadingNameplateModules] =
    useState(false);

  useEffect(() => {
    if (isModalOpen) {
      fetchTemplateOptions();
    }
  }, [isModalOpen]);

  // Replace the second useEffect (module fetching) with TWO separate useEffects:

  // Theme Module Fetching
  useEffect(() => {
    if (!themeTemplateName) {
      setThemeModuleOptions([]);
      if (!isEditMode) {
        setThemeTemplateModule("");
      }
      return;
    }

    const fetchModulesByTemplate = async () => {
      try {
        setIsLoadingThemeModules(true);
        const res = await GetAllThemeType(themeTemplateName);

        if (res?.data?.success) {
          const modules = res.data.data || [];
          const moduleOptions = modules.map((module) => ({
            id: module.id,
            name: module.nameEnglish || module.name || module.moduleName,
          }));

          setThemeModuleOptions(moduleOptions);

          if (!isEditMode) {
            setThemeTemplateModule("");
          } else {
            const currentModuleExists = moduleOptions.some(
              (opt) => opt.id.toString() === themeTemplateModule.toString(),
            );
            if (!currentModuleExists && moduleOptions.length > 0) {
              setThemeTemplateModule("");
            }
          }
        } else {
          setThemeModuleOptions([]);
        }
      } catch (error) {
        console.error("Error loading theme modules:", error);
        setThemeModuleOptions([]);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Unable to load modules for selected template",
        });
      } finally {
        setIsLoadingThemeModules(false);
      }
    };

    fetchModulesByTemplate();
  }, [themeTemplateName]);

  // Nameplate Module Fetching
  useEffect(() => {
    if (!nameplateTemplateName) {
      setNameplateModuleOptions([]);
      if (!isEditMode) {
        setNameplateTemplateModule("");
      }
      return;
    }

    const fetchModulesByTemplate = async () => {
      try {
        setIsLoadingNameplateModules(true);
        const res = await GetAllThemeType(nameplateTemplateName);

        if (res?.data?.success) {
          const modules = res.data.data || [];
          const moduleOptions = modules.map((module) => ({
            id: module.id,
            name: module.nameEnglish || module.name || module.moduleName,
          }));

          setNameplateModuleOptions(moduleOptions);

          if (!isEditMode) {
            setNameplateTemplateModule("");
          } else {
            const currentModuleExists = moduleOptions.some(
              (opt) => opt.id.toString() === nameplateTemplateModule.toString(),
            );
            if (!currentModuleExists && moduleOptions.length > 0) {
              setNameplateTemplateModule("");
            }
          }
        } else {
          setNameplateModuleOptions([]);
        }
      } catch (error) {
        console.error("Error loading nameplate modules:", error);
        setNameplateModuleOptions([]);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Unable to load modules for selected template",
        });
      } finally {
        setIsLoadingNameplateModules(false);
      }
    };

    fetchModulesByTemplate();
  }, [nameplateTemplateName]);

  // Update the edit mode useEffect (third useEffect):

  useEffect(() => {
    if (isEditMode && editingTheme) {
      setPrice(editingTheme.price || "");
      setIsDefault(editingTheme.isDefault || false);
      setDescription(editingTheme.description || "");
      if (editingTheme.isNamePlate) {
        setActiveTab("nameplate");
        setNameplateName(editingTheme.name || "");

        setNameplateTemplateName(
          editingTheme.templateModuleMaster?.id?.toString() || "",
        );

        if (editingTheme.namePlateBg || editingTheme.namePlateCoverBg) {
          const existingImages = [];

          if (
            editingTheme.namePlateBg &&
            !editingTheme.namePlateBg.includes("null")
          ) {
            existingImages.push({
              file: null,
              url: editingTheme.namePlateBg,
              isExisting: true,
            });
          }

          if (
            editingTheme.namePlateCoverBg &&
            !editingTheme.namePlateCoverBg.includes("null")
          ) {
            existingImages.push({
              file: null,
              url: editingTheme.namePlateCoverBg,
              isExisting: true,
            });
          }

          setNameplates(existingImages);
        }
      } else {
        setActiveTab("template");
        setNameplateName(editingTheme.name || "");
        setHeadingColor(editingTheme.headingFontColor || "rgba(31,41,55,1)");
        setContentColor(editingTheme.contentFontColor || "rgba(75,85,99,1)");

        setThemeTemplateName(
          editingTheme.templateModuleMaster?.id?.toString() || "",
        );

        // Set existing templates
        const existingTemplates = [];
        if (editingTheme.frontPage) {
          existingTemplates.push({
            file: null,
            url: editingTheme.frontPage,
            isExisting: true,
          });
        }
        if (
          editingTheme.secondFrontPage &&
          !editingTheme.secondFrontPage.includes("null")
        ) {
          existingTemplates.push({
            file: null,
            url: editingTheme.secondFrontPage,
            isExisting: true,
          });
        }
        if (
          editingTheme.watermark &&
          !editingTheme.watermark.includes("null")
        ) {
          existingTemplates.push({
            file: null,
            url: editingTheme.watermark,
            isExisting: true,
          });
        }
        if (
          editingTheme.lastMainPage &&
          !editingTheme.lastMainPage.includes("null")
        ) {
          existingTemplates.push({
            file: null,
            url: editingTheme.lastMainPage,
            isExisting: true,
          });
        }
        setTemplates(existingTemplates);

        if (editingTheme.dummyPdf) {
          setDummyPdf({
            name: "Existing PDF",
            isExisting: true,
            url: editingTheme.dummyPdf,
          });
        }
      }
    }
  }, [isEditMode, editingTheme]);

  // Update the fourth useEffect (setting templateModule when moduleOptions loads):

  // For Theme
  useEffect(() => {
    if (
      isEditMode &&
      editingTheme &&
      !editingTheme.isNamePlate &&
      themeModuleOptions.length > 0
    ) {
      const templateMappingId = editingTheme.templateMapping?.id?.toString();
      if (templateMappingId) {
        const moduleExists = themeModuleOptions.some(
          (opt) => opt.id.toString() === templateMappingId,
        );
        if (moduleExists) {
          setThemeTemplateModule(templateMappingId);
        }
      }
    }
  }, [themeModuleOptions, isEditMode, editingTheme]);

  // For Nameplate
  useEffect(() => {
    if (
      isEditMode &&
      editingTheme &&
      editingTheme.isNamePlate &&
      nameplateModuleOptions.length > 0
    ) {
      const templateMappingId = editingTheme.templateMapping?.id?.toString();
      if (templateMappingId) {
        const moduleExists = nameplateModuleOptions.some(
          (opt) => opt.id.toString() === templateMappingId,
        );
        if (moduleExists) {
          setNameplateTemplateModule(templateMappingId);
        }
      }
    }
  }, [nameplateModuleOptions, isEditMode, editingTheme]);

  const rgbaToHex = (rgba) => {
    if (!rgba || rgba === "") return "#1f2937"; // Default gray

    if (rgba.startsWith("#")) return rgba;

    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);

    if (!match) return "#1f2937"; // Fallback if format is invalid

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    // Convert each component to hex
    const toHex = (n) => {
      const hex = n.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  <div>
    <label className="block text-sm font-medium mb-2">Color Scheme</label>
    <div className="space-y-3">
      {/* Heading Color */}
      <div className="flex items-center gap-3">
        <label className="text-sm w-32">Heading Text</label>

        {/* 🔥 FIXED: Convert RGBA to Hex for display, Hex to RGBA on change */}
        <input
          type="color"
          value={rgbaToHex(headingColor)}
          onChange={(e) => setHeadingColor(hexToRgba(e.target.value))}
          className="w-12 h-10 border rounded cursor-pointer"
        />

        {/* Show the actual RGBA value */}
        <span className="text-xs text-gray-600 font-mono">{headingColor}</span>

        {/* Visual preview circle */}
        <div
          className="w-6 h-6 rounded-full border-2 border-gray-300"
          style={{ backgroundColor: headingColor }}
          title="Color Preview"
        />
      </div>

      {/* Content Color - Same pattern */}
      <div className="flex items-center gap-3">
        <label className="text-sm w-32">Content Text</label>

        <input
          type="color"
          value={rgbaToHex(contentColor)}
          onChange={(e) => setContentColor(hexToRgba(e.target.value))}
          className="w-12 h-10 border rounded cursor-pointer"
        />

        <span className="text-xs text-gray-600 font-mono">{contentColor}</span>

        <div
          className="w-6 h-6 rounded-full border-2 border-gray-300"
          style={{ backgroundColor: contentColor }}
          title="Color Preview"
        />
      </div>
    </div>
  </div>;

  const hexToRgba = (hex) => {
    let r = 0,
      g = 0,
      b = 0;

    hex = hex.replace("#", "");

    if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    }

    return `rgba(${r},${g},${b},1)`;
  };

  const fetchTemplateOptions = async () => {
    setIsLoadingTemplates(true);
    try {
      const response = await GettemplatebyuserId();

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
    if (!themeTemplateName) err.templateName = "Please select template name";
    if (!themeTemplateModule)
      err.templateModule = "Please select template module";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Validation for Nameplate Tab
  const validateNameplateTab = () => {
    let err = {};

    if (!nameplateTemplateName)
      err.templateName = "Please select template name";
    if (!nameplateTemplateModule)
      err.templateModule = "Please select template module";
    if (!nameplateName) err.nameplateName = "Please enter nameplate name";
    if (nameplates.length === 0)
      err.nameplate = "Add at least one nameplate image";
    if (nameplates.length > 2) err.nameplate = "Maximum 2 images allowed";
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

    const maxSize = 15 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire({
        title: "File Too Large",
        text: "PDF file must be less than 15MB",
        icon: "error",
      });
      return;
    }

    setDummyPdf({
      file: file,
      name: file.name,
      isExisting: false,
    });
  };

  const removeDummyPdf = () => {
    setDummyPdf(null);
    setFileInputKey(Date.now());
  };

  const handleSaveTemplate = async () => {
    if (!validateTemplateTab()) return;

    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");

      const formData = new FormData();

      formData.append("contentFontColor", contentColor);
      formData.append("headingFontColor", headingColor);
      formData.append("isNamePlate", "false");
      formData.append("name", nameplateName);
      formData.append("templateMappingId", themeTemplateModule);
      formData.append("templateModuleId", themeTemplateName);
      formData.append("userId", userId);
      formData.append("price", price);
      formData.append("isDefault", isDefault);
      formData.append("description", description);
      if (isEditMode && editingTheme) {
        formData.append("id", editingTheme.id);
      }

      if (dummyPdf) {
        if (!dummyPdf.isExisting && dummyPdf.file) {
          // New PDF uploaded - append the actual file
          formData.append("dummyPdf", dummyPdf.file);
        }
        // If isExisting is true, don't append anything (backend already has it)
        // Unless your API requires you to explicitly send something
      } else {
        // No PDF selected at all
        formData.append("dummyPdf", null);
      }

      const newImages = templates.filter((t) => !t.isExisting && t.file);

      if (newImages.length > 0) {
        newImages.forEach((template) => {
          formData.append("menuReportPages", template.file);
        });
      }

      if (isEditMode && removedExistingImages.length > 0) {
        formData.append("removedPages", JSON.stringify(removedExistingImages));
      }

      const response = isEditMode
        ? await UpdateCustomTheme(formData)
        : await AddCustomTheme(formData);

      if (response?.data?.success) {
        Swal.fire({
          title: "Success!",
          text:
            response.data.msg ||
            `Template ${isEditMode ? "updated" : "added"} successfully`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        resetForm();
        setIsModalOpen(false);

        if (refreshData) refreshData();
      } else {
        throw new Error(
          response?.data?.msg ||
            `Failed to ${isEditMode ? "update" : "add"} template`,
        );
      }
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.msg || error.message || "Something went wrong",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNameplate = async () => {
    if (!validateNameplateTab()) return;

    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");

      const formData = new FormData();
      formData.append("templateMappingId", nameplateTemplateModule);
      formData.append("templateModuleId", nameplateTemplateName);
      formData.append("isNamePlate", "true");
      formData.append("name", nameplateName);
      formData.append("userId", userId);
      formData.append("description", description);

      console.log("datatat", formData);

      if (isEditMode && editingTheme) {
        formData.append("id", editingTheme.id);
      }

      const newNameplates = nameplates.filter((n) => !n.isExisting && n.file);
      if (newNameplates.length > 0) {
        newNameplates.forEach((n) => formData.append("namePlateBg", n.file));
      } else {
        formData.append("namePlateBg", null);
      }
      const response = isEditMode
        ? await UpdateCustomTheme(formData) // ✅ New API call
        : await AddCustomTheme(formData);

      if (response?.data?.success) {
        Swal.fire({
          title: "Success!",
          text:
            response.data.msg ||
            `Nameplate ${isEditMode ? "updated" : "added"} successfully`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        resetForm();
        setIsModalOpen(false);

        if (refreshData) refreshData();
      } else {
        throw new Error(
          response?.data?.msg ||
            `Failed to ${isEditMode ? "update" : "add"} nameplate`,
        );
      }
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.msg || error.message || "Something went wrong",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (activeTab === "template") {
      handleSaveTemplate();
    } else {
      handleSaveNameplate();
    }
  };

  const resetForm = () => {
    setThemeTemplateName("");
    setThemeTemplateModule("");
    setThemeModuleOptions([]);

    setNameplateTemplateName("");
    setNameplateTemplateModule("");
    setNameplateModuleOptions([]);

    setNameplateName("");
    setTemplates([]);
    setNameplates([]);
    setHeadingColor("rgba(31,41,55,1)");
    setContentColor("rgba(75,85,99,1)");
    setDummyPdf(null);
    setErrors({});
    setActiveTab("template");
    setRemovedExistingImages([]);
    setFileInputKey(Date.now());
    setPrice(); // Add this
    setIsDefault(false); // Add this
    setDescription("");
  };

  const handleAddTemplate = (files) => {
    if (!files || files.length === 0) return;

    const fileArr = Array.from(files);

    if (templates.length + fileArr.length > 6) {
      Swal.fire({
        title: "Too Many Files",
        text: "Maximum 6 templates allowed",
        icon: "warning",
      });
      setFileInputKey(Date.now());
      return;
    }

    const maxSize = 15 * 1024 * 1024; // 15MB
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    for (let file of fileArr) {
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: "Invalid File Type",
          text: `${file.name} is not a valid image file. Please upload JPG, PNG, or WEBP images.`,
          icon: "error",
        });
        setFileInputKey(Date.now());
        return;
      }

      if (file.size > maxSize) {
        Swal.fire({
          title: "File Too Large",
          text: `${file.name} exceeds 15MB limit`,
          icon: "error",
        });
        setFileInputKey(Date.now());
        return;
      }
    }

    const newTemplates = fileArr.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isExisting: false,
    }));

    setTemplates((prev) => [...prev, ...newTemplates]);

    setFileInputKey(Date.now());
  };

  const removeTemplate = (index) => {
    const updated = [...templates];
    const removed = updated[index];

    if (removed.isExisting) {
      setRemovedExistingImages((prev) => [...prev, removed.url]);
    } else if (removed.url && !removed.isExisting) {
      URL.revokeObjectURL(removed.url);
    }

    updated.splice(index, 1);
    setTemplates(updated);

    setFileInputKey(Date.now());
  };

  const handleAddNameplate = (files) => {
    if (!files || files.length === 0) return;

    const fileArr = Array.from(files);
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 15 * 1024 * 1024;

    // 🚨 LIMIT CHECK (MAX 2)
    if (nameplates.length + fileArr.length > 2) {
      Swal.fire({
        title: "Maximum Limit Reached",
        text: "You can upload maximum 2 nameplate images only.",
        icon: "warning",
      });
      setFileInputKey(Date.now());
      return;
    }

    for (let file of fileArr) {
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: "Invalid File Type",
          text: `${file.name} is not valid`,
          icon: "error",
        });
        setFileInputKey(Date.now());
        return;
      }

      if (file.size > maxSize) {
        Swal.fire({
          title: "File Too Large",
          text: `${file.name} exceeds 15MB`,
          icon: "error",
        });
        setFileInputKey(Date.now());
        return;
      }
    }

    const newItems = fileArr.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      isExisting: false,
    }));

    setNameplates((prev) => [...prev, ...newItems]);
    setFileInputKey(Date.now());
  };

  const removeNameplate = (index) => {
    setNameplates((prev) => {
      const updated = [...prev];
      if (!updated[index].isExisting) URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={() => {
          resetForm();
          setIsModalOpen(false);
        }}
        title={isEditMode ? "Edit Template" : "Add Template"}
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
              ? `${isEditMode ? "Updating" : "Saving"}...`
              : isEditMode
                ? activeTab === "template"
                  ? "Update Theme"
                  : "Update Nameplate"
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
                    value={themeTemplateName}
                    onChange={(e) => {
                      setThemeTemplateName(e.target.value);
                      setThemeTemplateModule("");
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
                    value={themeTemplateModule}
                    onChange={(e) => setThemeTemplateModule(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={!themeTemplateName || isLoadingThemeModules}
                  >
                    <option value="">
                      {!themeTemplateName
                        ? "Select Template First"
                        : isLoadingThemeModules
                          ? "Loading modules..."
                          : "Select Template Module"}
                    </option>

                    {themeModuleOptions.map((module) => (
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
                    Name <span className="text-red-500">*</span>
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
                {/* ADD DESCRIPTION FIELD HERE */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description (optional)"
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* TEMPLATE UPLOAD - Max 6 */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Template Images (Max 6){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    key={fileInputKey} // ✅ Add this key prop
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
                    key={fileInputKey}
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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {/* IS DEFAULT TOGGLE */}
                <div>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm font-medium">Set as Default</span>
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`block w-12 h-6 rounded-full transition-colors ${
                          isDefault ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                            isDefault ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  </label>
                </div>

                {/* COLOR SCHEME */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Color Scheme
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm w-32">Heading Text</label>

                      <input
                        type="color"
                        value={rgbaToHex(headingColor)}
                        onChange={(e) =>
                          setHeadingColor(hexToRgba(e.target.value))
                        }
                        className="w-12 h-10 border rounded cursor-pointer"
                      />

                      <span className="text-xs text-gray-600 font-mono">
                        {headingColor}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-sm w-32">Content Text</label>

                      <input
                        type="color"
                        value={rgbaToHex(contentColor)}
                        onChange={(e) =>
                          setContentColor(hexToRgba(e.target.value))
                        }
                        className="w-12 h-10 border rounded cursor-pointer"
                      />

                      <span className="text-xs text-gray-600 font-mono">
                        {contentColor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Nameplate Preview</h3>
                <div className="grid grid-cols-2 gap-2">
                  {nameplates.map((n, i) => (
                    <div
                      key={i}
                      className="relative border rounded-lg overflow-hidden"
                    >
                      <img
                        src={n.url}
                        alt={`Nameplate ${i + 1}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        onClick={() => removeNameplate(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {nameplates.length === 0 && (
                    <div className="col-span-2 border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <p className="mt-2 text-sm">No Nameplate Images</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE - NAMEPLATE FORM */}
              <div className="space-y-4">
                {/* TEMPLATE NAME - First Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={nameplateTemplateName}
                    onChange={(e) => {
                      setNameplateTemplateName(e.target.value);
                      setNameplateTemplateModule("");
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

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description (optional)"
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* TEMPLATE MODULE - Dependent Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Template Module <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={nameplateTemplateModule}
                    onChange={(e) => setNameplateTemplateModule(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={
                      !nameplateTemplateName || isLoadingNameplateModules
                    }
                  >
                    <option value="">
                      {!nameplateTemplateName
                        ? "Select Template First"
                        : isLoadingNameplateModules
                          ? "Loading modules..."
                          : "Select Template Module"}
                    </option>

                    {nameplateModuleOptions.map((module) => (
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
                    key={fileInputKey}
                    id="nameplateUpload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={(e) => handleAddNameplate(e.target.files)}
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
                      JPG, PNG, WEBP (Max 15MB each, Maximum 2 images)
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
