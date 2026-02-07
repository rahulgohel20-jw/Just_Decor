import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import {
  GettemplatebyuserId,
  GetAllThemeType,
  AddReportConfiguration,
  GetReportConfigurationById,
} from "@/services/apiServices";

const defaultOptions = {
  categoryImage: false,
  CompanyDetails: false,
  categoryInstruction: false,
  categorySlogan: false,
  CompanyLogo: false,
  ItemImage: false,
  itemInstruction: false,
  itemSlogan: false,
  PartyDetails: false,
  WithQuantity: false,
  isDropDown: false,
  isWithPrice: false,
  size1: "A4",
  size2: "",
  isAgency: false,
  isItem: false,
  isItemColumn: false,
  isItemPage: false,
  isCombo: false,
};

const optionLabels = {
  categoryImage: "Category Image",
  categorySlogan: "Category Slogan",
  CompanyDetails: "Company Details",
  categoryInstruction: "Category Instruction",
  CompanyLogo: "Company Logo",
  ItemImage: "Item Image",
  itemInstruction: "Item Instruction",
  itemSlogan: "Item Slogan",
  PartyDetails: "Party Details",
  WithQuantity: "With Quantity",
  size1: "Size1(A4)",
  size2: "Size2(A6)",
  isDropDown: "Is DropDown",
  isWithPrice: "Is With Price ",
  isAgency: "Is Agency",
  isItem: "Is Item",
  isItemColumn: "Is Item Column",
  isItemPage: "Is Item Page",
  isCombo: "Is Combo",
};

const AddReportConfig = ({
  isModalOpen,
  setIsModalOpen,
  editId = null,
  onSave,
}) => {
  const [templateId, setTemplateId] = useState("");
  const [templateModuleId, setTemplateModuleId] = useState("");
  const [templateOptions, setTemplateOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [options, setOptions] = useState(defaultOptions);
  const [labourType, setLabourType] = useState("");

  useEffect(() => {
    if (!isModalOpen) {
      setTemplateId("");
      setTemplateModuleId("");
      setTemplateOptions([]);
      setModuleOptions([]);
      setOptions(defaultOptions);
      setLabourType("");
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;

    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const res = await GettemplatebyuserId();
        if (res?.data?.success) {
          setTemplateOptions(
            res.data.data.map((t) => ({
              id: t.id,
              name: t.nameEnglish || t.templateName || t.title,
            })),
          );
        }
      } catch {
        Swal.fire("Warning", "Unable to load templates", "warning");
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, [isModalOpen]);

  useEffect(() => {
    if (!templateId) return;

    const fetchModules = async () => {
      setIsLoadingModules(true);
      try {
        const res = await GetAllThemeType(templateId);
        if (res?.data?.success) {
          setModuleOptions(
            res.data.data.map((m) => ({
              id: m.id,
              name: m.nameEnglish || m.name || m.moduleName,
            })),
          );
        } else {
          setModuleOptions([]);
        }
      } catch {
        Swal.fire("Error", "Unable to load modules", "error");
        setModuleOptions([]);
      } finally {
        setIsLoadingModules(false);
      }
    };
    fetchModules();
  }, [templateId]);

  useEffect(() => {
    if (!editId || !isModalOpen) return;

    const fetchData = async () => {
      try {
        const res = await GetReportConfigurationById(editId);

        if (res?.data?.success) {
          const data = res.data.data;

          // ✅ CORRECT — this fixes select issue
          setLabourType(data?.type || "");

          setTemplateId(data.templateModuleId);
          setTemplateModuleId(data.templateMappingId || "");

          // ✅ ONLY toggle fields here
          setOptions({
            categoryImage: !!data.isCategoryImage,
            CompanyDetails: !!data.isCompanyDetails,
            categorySlogan: !!data.isCategorySlogan,
            CompanyLogo: !!data.isCompanyLogo,
            categoryInstruction: !!data.isCategoryInstruction,
            ItemImage: !!data.isItemImage,
            itemInstruction: !!data.isItemInstruction,
            itemSlogan: !!data.isItemSlogan,
            PartyDetails: !!data.isPartyDetails,
            WithQuantity: !!data.isWithQty,
            size1: data.size1 || "",
            size2: data.size2 || "",
            isDropDown: !!data.isDropDown,
            isWithPrice: !!data.isWithPrice,
            isAgency: !!data.isAgency,
            isItem: !!data.isItem,
            isItemColumn: !!data.isItemColumn,
            isItemPage: !!data.isItemPage,
            isCombo: !!data.isCombo,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [editId, isModalOpen]);

  const optionKeys = Object.keys(options);
  const isCheckAll = optionKeys.every((key) => options[key]);
  const toggleAll = (checked) => {
    const updated = {};
    optionKeys.forEach((key) => (updated[key] = checked));
    setOptions(updated);
  };
  const toggleOne = (key) => {
    setOptions((prev) => {
      // If toggling size1 or size2, turn off the other
      if (key === "size1") {
        const newSize1Value = prev.size1 === "A4" ? "" : "A4";
        return {
          ...prev,
          size1: newSize1Value,
        };
      }
      if (key === "size2") {
        const newSize2Value = prev.size2 === "A6" ? "" : "A6";
        return {
          ...prev,
          size2: newSize2Value,
        };
      }
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );

  const booleanToNumber = (val) => (val ? 1 : 0);

  const handleSave = async () => {
    if (!templateId) {
      Swal.fire("Required", "Please select Template Name", "warning");
      return;
    }

    setIsSaving(true); // 🔹 start loading

    const payload = {
      id: editId || -1,
      type: labourType,
      templateModuleId: Number(templateId),
      templateMappingId: templateModuleId ? Number(templateModuleId) : 0,

      isCategoryImage: booleanToNumber(options.categoryImage),
      isCategoryInstruction: booleanToNumber(options.categoryInstruction),
      isCategorySlogan: booleanToNumber(options.categorySlogan),
      isCompanyDetails: booleanToNumber(options.CompanyDetails),
      isCompanyLogo: booleanToNumber(options.CompanyLogo),
      isItemImage: booleanToNumber(options.ItemImage),
      isItemInstruction: booleanToNumber(options.itemInstruction),
      isItemSlogan: booleanToNumber(options.itemSlogan),
      isPartyDetails: booleanToNumber(options.PartyDetails),
      isWithQty: booleanToNumber(options.WithQuantity),
      isDropDown: booleanToNumber(options.isDropDown),
      isWithPrice: booleanToNumber(options.isWithPrice),
      isAgency: booleanToNumber(options.isAgency),
      isItem: booleanToNumber(options.isItem),
      isItemColumn: booleanToNumber(options.isItemColumn),
      isItemPage: booleanToNumber(options.isItemPage),
      size1: options.size1,
      size2: options.size2,
      isCombo: booleanToNumber(options.isCombo),
    };

    try {
      const res = await AddReportConfiguration(payload);

      // 🔹 check both possible response structures
      const success = res?.data?.success || res?.success;
      const messageText = res?.data?.message || res?.message || "";

      if (success) {
        Swal.fire(
          "Success",
          editId ? "Updated successfully" : "Saved successfully",
          "success",
        );

        if (onSave && typeof onSave === "function") onSave(); // refresh table
        setIsModalOpen(false);
      } else {
        Swal.fire("Failed", messageText || "Save failed", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setIsSaving(false); // 🔹 stop loading
    }
  };

  return (
    <CustomModal
      open={isModalOpen}
      title={editId ? "Edit Report Configuration" : "Add Report Configuration"}
      onClose={() => setIsModalOpen(false)}
      width={900}
      footer={
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-[#005BA8] text-white rounded hover:bg-[#004a8f] disabled:opacity-60"
          >
            {isSaving ? "Saving..." : editId ? "Update" : "Save"}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Template Name <span className="text-red-500">*</span>
          </label>
          <select
            value={templateId}
            onChange={(e) => {
              setTemplateId(e.target.value);
              setTemplateModuleId("");
            }}
            className="w-full border rounded px-3 py-2"
            disabled={isLoadingTemplates}
          >
            <option value="">
              {isLoadingTemplates ? "Loading..." : "Select Template"}
            </option>
            {templateOptions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Template Module
          </label>
          <select
            value={templateModuleId}
            onChange={(e) => setTemplateModuleId(e.target.value)}
            className="w-full border rounded px-3 py-2"
            disabled={!templateId || isLoadingModules}
          >
            <option value="">
              {!templateId
                ? "Select Template First"
                : isLoadingModules
                  ? "Loading..."
                  : "Select Module"}
            </option>
            {moduleOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Vendor Type</label>
          <select
            value={labourType}
            onChange={(e) => setLabourType(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Labour Type</option>
            <option value="outside">Outside</option>
            <option value="inside">Inside</option>
            <option value="chef">Chef</option>
            <option value="labor">Labour</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between border-b pb-3 mb-3">
        <span className="font-semibold">Check All</span>
        <Toggle checked={isCheckAll} onChange={() => toggleAll(!isCheckAll)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {optionKeys.map((key) => (
          <div
            key={key}
            className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="text-sm font-medium text-gray-700">
              {optionLabels[key]}
            </span>
            <Toggle
              checked={
                options[key] === "A4" ||
                options[key] === "A6" ||
                options[key] === true
              }
              onChange={() => toggleOne(key)}
            />
          </div>
        ))}
      </div>
    </CustomModal>
  );
};

export default AddReportConfig;
