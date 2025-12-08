import { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  message,
} from "antd";
import {
  InboxOutlined,
  ReloadOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { defaultData } from "../constant";
import useMenuApi from "../hooks/useMenuApi";
import useRecipe from "../hooks/useRecipe";
import RawMaterialTable from "./RawMaterialTable";
import { buildPayload } from "../utils/buildMenuPayload";
import {
  AddMenuItems,
  Translateapi,
  uploadFile,
  UpdateMenuItem,
  deleteRawmatrialcatidInmenuitem,
} from "@/services/apiServices";
import AddMenuCategory from "@/partials/modals/add-menu-category/AddMenuCategory";
import AddMenuSubCategory from "@/partials/modals/add-menu-sub-category/AddMenuSubCategory";
import AddRawMaterial from "@/partials/modals/add-raw-material/AddRawMaterial";
import { useNavigate } from "react-router-dom";
import CopyRecipe from "../../../../partials/modals/CopyRecipe/CopyRecipe";
import Swal from "sweetalert2";
const { Dragger } = Upload;
const { TextArea } = Input;

const MenuDetailsForm = ({
  form,
  onNext,
  setMenuDetails,
  isEdit,
  editData,
}) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const { getRawMaterial, getCategories, getSubCategories } =
    useMenuApi(userId);

  const [fileList, setFileList] = useState([]);
  const [menuCategory, setMenuCategory] = useState([]);
  const [menuSubCategory, setMenuSubCategory] = useState([]);
  const [rawmaterialList, setRawmaterialList] = useState([]);
  const [isSaveOnly, setIsSaveOnly] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [isRawMaterialModalOpen, setIsRawMaterialModalOpen] = useState(false);
  const [isCopyRecipe, setIsCopyRecipe] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const {
    tableData,
    setTableData,
    filteredTableData,
    searchTerm,
    setSearchTerm,
    selectedRaw,
    setSelectedRaw,
    weight,
    setWeight,
    unit,
    setUnit,
    unitOptions,
    setUnitOptions,
    totalRate,
    dishCosting,
    handleAddRecipe,
    handleDeleteRow,
    handleEditRow,
  } = useRecipe(rawmaterialList, defaultData);

  useEffect(() => {
    setIsSaveOnly(false);
  }, [onNext]);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [rawRes, catRes] = await Promise.all([
          getRawMaterial(),
          getCategories(),
        ]);

        const rawData =
          rawRes?.data?.data?.["Raw Material Details"]?.map((item) => ({
            rawMaterialId: item.id,
            category: item.rawMaterialCat.nameEnglish,
            name: item.nameEnglish,
            unitId: item.unit?.id,
            unit: item.unit?.nameEnglish,
            supplierRate: item.supplierRate,
          })) || [];
        setRawmaterialList(rawData);

        const catData =
          catRes?.data?.data?.["Menu Category Details"]?.map((item) => ({
            menuid: item.id,
            menuName: item.nameEnglish,
          })) || [];
        setMenuCategory(catData);
      } catch (error) {
        console.error(error);
        message.error("Failed to load initial data");
      }
    };

    loadInitial();
  }, [getRawMaterial, getCategories]);

  useEffect(() => {
    if (!editData?.menuCategory?.id) return;

    const loadSubCategories = async () => {
      try {
        const res = await getSubCategories(editData.menuCategory.id);
        const data =
          res?.data?.data?.["Menu Sub Category Details"]?.map((item) => ({
            subid: item.id,
            subname: item.nameEnglish,
          })) || [];
        setMenuSubCategory(data);
      } catch (error) {
        console.error(error);
        message.error("Failed to load sub categories");
      }
    };

    loadSubCategories();
  }, [editData?.menuCategory?.id, getSubCategories]);

  useEffect(() => {
    console.log(editData);

    if (!editData) return;

    form.setFieldsValue({
      nameEnglish: editData.nameEnglish,
      nameGujarati: editData.nameGujarati,
      nameHindi: editData.nameHindi,
      slogan: editData.slogan,
      price: editData.price,
      priority: editData.sequence,
      category: Number(editData.menuCategory?.id),
      subCategory: editData.menuSubCategory?.id,
      remarks: editData.remarks,
    });

    if (editData.imagePath) {
      const fileName = editData.imagePath.split("/").pop();
      const fileExtension = fileName.split(".").pop();

      setFileList([
        {
          uid: "-1",
          name: fileName,
          status: "done",
          url: editData.imagePath,
          thumbUrl: editData.imagePath,
        },
      ]);
    }

    if (editData.menuItemRawMaterials?.length > 0) {
      const mapped = editData.menuItemRawMaterials.map((rm, idx) => ({
        sr_no: idx + 1,
        menuRmId: rm?.id,
        category: rm.rawMaterial?.rawMaterialCat?.nameEnglish,
        rawMaterialId: rm?.rawMaterial?.id,
        name: rm?.rawMaterial?.nameEnglish,
        weight: rm?.weight,
        unitId: rm?.unit?.id,
        unit: rm?.unit?.nameEnglish,
        supplierRate: rm.rawMaterial.supplierRate,
        rate: rm.rate,
      }));
      console.log("Mapped raw materials:", mapped);
      setTableData(mapped);
    }
  }, [editData, form, setTableData]);

  const refreshData = async () => {
    try {
      const [rawRes, catRes] = await Promise.all([
        getRawMaterial(),
        getCategories(),
      ]);

      const rawData =
        rawRes?.data?.data?.["Raw Material Details"]?.map((item) => ({
          rawMaterialId: item.id,
          name: item.nameEnglish,
          unitId: item.unit?.id,
          unit: item.unit?.nameEnglish,
          supplierRate: item.supplierRate,
        })) || [];
      setRawmaterialList(rawData);

      const catData =
        catRes?.data?.data?.["Menu Category Details"]?.map((item) => ({
          menuid: item.id,
          menuName: item.nameEnglish,
        })) || [];
      setMenuCategory(catData);

      const selectedCategory = form.getFieldValue("category");
      if (selectedCategory) {
        handleCategoryChange(selectedCategory);
      }

      message.success("Data updated");
    } catch (error) {
      console.error(error);
      message.error("Failed to refresh data");
    }
  };

  const handleTranslate = async (value) => {
    if (!value || value.trim() === "") return;

    try {
      const res = await Translateapi(value);

      const data = res?.data;

      form.setFieldsValue({
        nameGujarati: data?.gujarati || "",
        nameHindi: data?.hindi || "",
      });
    } catch (error) {
      console.error(error);
      message.error("Translation failed");
    }
  };

  const handleCategoryChange = async (value) => {
    form.setFieldsValue({ subCategory: undefined });
    try {
      const res = await getSubCategories(value);
      const data =
        res?.data?.data?.["Menu Sub Category Details"]?.map((item) => ({
          subid: item.id,
          subname: item.nameEnglish,
        })) || [];
      setMenuSubCategory(data);
    } catch (error) {
      console.error(error);
      message.error("Failed to load sub categories");
    }
  };

  const handleUploadChange = ({ fileList: newList }) => {
    setFileList(newList);
  };

  const handleRemoveFile = (file) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleRetry = () => {
    message.info("Retry upload logic can be added here.");
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      message.warning("Please select items to delete");
      return;
    }

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `You are about to delete ${selectedRows.length} item(s)`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      const itemsWithId = selectedRows.filter((row) => row.menuRmId);

      if (itemsWithId.length > 0) {
        const menuRmIds = itemsWithId.map((row) => row.menuRmId);
        const payload = {
          id: menuRmIds,
        };
        console.log(payload);

        await deleteRawmatrialcatidInmenuitem(payload);
      }

      // Remove all selected items from table
      const selectedSrNos = selectedRows.map((row) => row.sr_no);
      setTableData((prev) =>
        prev.filter((item) => !selectedSrNos.includes(item.sr_no))
      );

      setSelectedRows([]);
      message.success(`Successfully deleted ${selectedRows.length} item(s)`);
    } catch (error) {
      console.error(error);
      message.error("Failed to delete items");
    }
  };

  const onFinish = async (values) => {
    const file = fileList?.[0]?.originFileObj;

    const imageChanged =
      isEdit && file && editData?.imagePath !== fileList?.[0]?.url;
    const shouldUploadImage = (!isEdit && file) || imageChanged;

    const details = {
      ...values,
      recipes: tableData,
      totalRate,
      dishCosting,
      file,
      shouldUploadImage,
    };
    setMenuDetails(details);

    if (!isSaveOnly) {
      onNext();
      return;
    }

    try {
      const payload = buildPayload(details, {});
      let res;

      if (isEdit) {
        const id = editData.id;
        res = await UpdateMenuItem(id, payload);
      } else {
        res = await AddMenuItems(payload);
      }

      const data = res?.data;
      const success = data?.success === true;

      if (success && shouldUploadImage && file) {
        const formData = new FormData();
        formData.append("moduleId", data.moduleId);
        formData.append("moduleName", data.moduleName);
        formData.append("fileType", data.fileType);
        formData.append("file", file);
        await uploadFile(formData);
      }

      Swal.fire({
        title: success ? "Success!" : "Failed",
        text: data?.msg,
        icon: success ? "success" : "error",
      });

      if (success) navigate("/master/menu-item");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handleCopyRecipe = (copiedItems) => {
    if (!copiedItems || copiedItems.length === 0) return;

    const newRows = copiedItems.map((rm, idx) => ({
      sr_no: tableData.length + idx + 1,
      menuRmId: 0,
      rawMaterialId: rm.rawmatrialId,
      name: rm.name,
      category: rm.category,
      weight: rm.weight,
      unitId: rm.unitId,
      unit: rm.unit,
      supplierRate: rm.supplierRate,
      rate: rm.weight * rm.supplierRate,
    }));

    setTableData((prev) => [...prev, ...newRows]);
    message.success(`${newRows.length} item(s) copied`);
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
        {/* Names */}
        <div className="grid gap-4 md:grid-cols-3">
          <Form.Item
            label={
              <span className="text-[#6A7C94] text-base font-medium">
                Name (English) <span className="text-red-500">*</span>
              </span>
            }
            name="nameEnglish"
          >
            <Input
              className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
              onBlur={(e) => handleTranslate(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[#6A7C94] text-base font-medium">
                Name (Gujarati)
              </span>
            }
            name="nameGujarati"
          >
            <Input className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]" />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[#6A7C94] text-base font-medium">
                Name (Hindi)
              </span>
            }
            name="nameHindi"
          >
            <Input className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]" />
          </Form.Item>
        </div>

        {/* Slogan */}
        <div className="grid gap-4 md:grid-cols-3">
          <Form.Item
            label={
              <span className="text-[#6A7C94] text-base font-medium">
                Slogan
              </span>
            }
            name="slogan"
            className="md:col-span-3"
          >
            <Input className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]" />
          </Form.Item>
        </div>

        {/* Price & Priority */}
        <div className="grid gap-4 md:grid-cols-2">
          <Form.Item
            label={
              <span className="text-[#6A7C94] text-base font-medium">
                Price
              </span>
            }
            name="price"
          >
            <InputNumber
              min={0}
              className="w-full bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
              controls={false}
              placeholder="Enter price"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[#6A7C94] text-base font-medium">
                Priority
              </span>
            }
            name="priority"
          >
            <InputNumber
              min={0}
              className="w-full bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
              controls={false}
              placeholder="Enter priority"
            />
          </Form.Item>
        </div>

        {/* Categories */}
        <div className="grid gap-4 md:grid-cols-2">
          <Form.Item
            label={
              <span className="text-[#6A7C94] text-base font-medium">
                Menu Item Category <span className="text-red-500">*</span>
              </span>
            }
            name="category"
          >
            <div className="flex ">
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Select Menu Item Category"
                value={form.getFieldValue("category")}
                options={menuCategory.map((c) => ({
                  value: Number(c.menuid),
                  label: c.menuName,
                }))}
                onChange={(v) => {
                  form.setFieldsValue({ category: Number(v) });
                  handleCategoryChange(Number(v));
                }}
                className="bg-[#F8FAFC] h-10 border-r-0 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
              />

              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-r-xl shadow hover:scale-105 transition"
                onClick={() => {
                  setIsCategoryModalOpen(true);
                }}
              >
                <i className="ki-filled ki-plus"></i>
              </button>
            </div>
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[#6A7C94] text-base font-medium">
                Menu Item Sub Category
              </span>
            }
            name="subCategory"
          >
            <div className="flex ">
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Select Menu Item Sub Category"
                value={form.getFieldValue("subCategory")}
                options={menuSubCategory.map((item) => ({
                  value: Number(item.subid),
                  label: item.subname,
                }))}
                onChange={(v) =>
                  form.setFieldsValue({ subCategory: Number(v) })
                }
                className="bg-[#F8FAFC] h-10 border-r-0 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
              />

              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-r-xl shadow hover:scale-105 transition"
                onClick={() => {
                  setIsSubCategoryModalOpen(true);
                }}
              >
                <i className="ki-filled ki-plus"></i>
              </button>
            </div>
          </Form.Item>
        </div>

        {/* Remarks */}
        <Form.Item
          label={
            <span className="text-[#6A7C94] text-base font-medium">
              Remarks
            </span>
          }
          name="remarks"
        >
          <TextArea
            rows={3}
            className="bg-[#F8FAFC] hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
          />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item
          label={
            <span className="text-[#6A7C94] text-base font-medium">Image</span>
          }
          name="image"
        >
          <Dragger
            multiple={false}
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleUploadChange}
            accept=".jpg,.jpeg,.png,.svg,.zip"
            className="!border-dashed !border-gray-300 bg-[#F8FAFC] hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="text-gray-600">
              Drag your files or{" "}
              <span className="text-primary cursor-pointer">browse</span>
            </p>
            <p className="text-xs text-gray-400">
              Only support .jpg, .png, .svg and .zip files. Max 10 MB files are
              allowed.
            </p>
          </Dragger>
        </Form.Item>

        {/* Custom file list */}
        {fileList.length > 0 && (
          <div className="space-y-2 mb-4">
            {fileList.map((file) => (
              <div
                key={file.uid}
                className="flex items-center justify-between rounded-md border px-3 py-2 bg-white"
              >
                <div className="flex items-center gap-3">
                  {file.url || file.thumbUrl ? (
                    <img
                      src={file.url || file.thumbUrl}
                      alt={file.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs">
                      {file.name.split(".").pop()?.toUpperCase() || "FILE"}
                    </div>
                  )}
                  <div className="flex flex-col text-xs sm:text-sm">
                    <span className="font-medium text-gray-800">
                      {file.name}
                    </span>
                    <span className="text-green-600">
                      Uploaded Successfully
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="hover:text-blue-600"
                  >
                    <ReloadOutlined />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file)}
                    className="hover:text-red-600"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* URL */}
        <Form.Item
          label={
            <span className="text-[#6A7C94] text-base font-medium">
              Enter URL
            </span>
          }
          name="imageUrl"
        >
          <Input
            placeholder="Insert URL"
            className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
          />
        </Form.Item>

        {/* Raw Material List */}
        <div className="w-full">
          <h1 className="text-black text-xl font-medium mb-4">
            Raw Material List :
          </h1>

          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-end flex-wrap">
              <div className="flex flex-col w-[300px]">
                <label className="text-[#6A7C94] text-base font-medium mb-2">
                  Select Raw Material
                </label>
                <div className="flex">
                  <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder="Select Raw Material"
                    className="bg-[#F8FAFC] h-10 w-full"
                    value={selectedRaw}
                    options={rawmaterialList.map((item) => ({
                      label: item.name,
                      value: item.rawMaterialId,
                    }))}
                    onChange={(value) => {
                      setSelectedRaw(value);
                      const found = rawmaterialList.find(
                        (r) => r.rawMaterialId === value
                      );
                      if (found) {
                        setUnitOptions([
                          { label: found.unit, value: found.unitId },
                        ]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-r-xl shadow hover:scale-105 transition"
                    onClick={() => {
                      setIsRawMaterialModalOpen(true);
                    }}
                  >
                    <i className="ki-filled ki-plus"></i>
                  </button>
                </div>
              </div>

              <div className="flex flex-col w-[300px]">
                <label className="text-[#6A7C94] text-base font-medium mb-2">
                  Weight
                </label>
                <Input
                  placeholder="Enter weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-[#F8FAFC] h-10"
                />
              </div>

              <div className="flex flex-col w-[300px]">
                <label className="text-[#6A7C94] text-base font-medium mb-2">
                  Unit
                </label>
                <Select
                  placeholder="Select Unit"
                  className="bg-[#F8FAFC] h-10"
                  value={unit}
                  onChange={(value) => setUnit(value)}
                  options={unitOptions}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="primary"
                onClick={() => {
                  setIsCopyRecipe(true);
                }}
                className="bg-primary h-10 px-6 rounded-md hover:bg-primary mt-7"
              >
                Copy Recipe
              </Button>

              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddRecipe}
                className="bg-primary h-10 px-6 rounded-md hover:bg-primary mt-7"
              >
                Add Recipe
              </Button>
            </div>
          </div>

          {/* Search & Delete */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 mb-4">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8 w-[300px]"
                placeholder="Search Rawmaterial"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {selectedRows.length > 0 && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
                className="h-10 px-6 rounded-md"
              >
                Delete Selected ({selectedRows.length})
              </Button>
            )}
          </div>

          {/* Table */}
          <RawMaterialTable
            data={filteredTableData}
            onEditRow={handleEditRow}
            onDeleteRow={handleDeleteRow}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />

          {/* Footer Total */}
          <div className="flex justify-between mt-4 text-lg font-medium text-[#6A7C94]">
            <p>
              Dish Costing :
              <span className="text-primary ml-2">
                {dishCosting.toFixed(2)}
              </span>
            </p>
            <p>
              Total Rate :
              <span className="text-primary ml-2">{totalRate.toFixed(2)}</span>
            </p>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-between gap-4 pt-4">
          <Button
            type="default"
            onClick={handleCancel}
            className="bg-white h-10 px-6 rounded-md hover:bg-primary"
          >
            Cancel
          </Button>

          <div className="flex gap-4">
            <Button
              type="primary"
              onClick={() => {
                setIsSaveOnly(false);
                form.submit();
              }}
              className="bg-primary h-10 px-6 rounded-md hover:bg-primary"
            >
              Next
            </Button>

            <Button
              type="primary"
              className="bg-primary h-10 px-6 rounded-md hover:bg-primary w-[120px]"
              onClick={() => {
                setIsSaveOnly(true);
                form.submit();
              }}
            >
              {isEdit ? "Update" : "Save"}
            </Button>
          </div>
        </div>
      </Form>

      <AddMenuCategory
        isModalOpen={isCategoryModalOpen}
        setIsModalOpen={setIsCategoryModalOpen}
        refreshData={refreshData}
      />
      <AddMenuSubCategory
        isModalOpen={isSubCategoryModalOpen}
        setIsModalOpen={setIsSubCategoryModalOpen}
        refreshData={refreshData}
      />
      <AddRawMaterial
        isOpen={isRawMaterialModalOpen}
        onClose={setIsRawMaterialModalOpen}
        refreshData={refreshData}
      />
      <CopyRecipe
        isOpen={isCopyRecipe}
        onClose={setIsCopyRecipe}
        onCopy={(data) => handleCopyRecipe(data)}
      />
    </>
  );
};

export default MenuDetailsForm;
