import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Form, Input, Select, Upload } from "antd";
import { useState, useEffect } from "react";
import { InboxOutlined } from "@ant-design/icons";
import {
  GetAllCategoryformenu,
  Getmenusubcategory,
  AddMenuItems,
  uploadFile,
} from "@/services/apiServices";
import Swal from "sweetalert2";
import AddMenuCategory from "@/partials/modals/add-menu-category/AddMenuCategory";
import AddMenuSubCategory from "@/partials/modals/add-menu-sub-category/AddMenuSubCategory";
const { Dragger } = Upload;

const AddMenuItem = ({ isModalOpen, setIsModalOpen, refreshData }) => {
  const [form] = Form.useForm();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const userId = localStorage.getItem("userId");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const fetchCategories = async () => {
    try {
      const res = await GetAllCategoryformenu(userId);
      console.log(res?.data?.data["Menu Category Details"]);

      if (res) {
        const options = res?.data?.data["Menu Category Details"].map(
          (item) => ({
            label: item.nameEnglish,
            value: item.id,
          })
        );

        setCategoryOptions(options);
      }
      console.log("out");
    } catch (err) {
      console.log("Category API Error:", err);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      setLoadingSubCategories(true);
      const res = await Getmenusubcategory(categoryId, userId);
      console.log(res);

      if (res) {
        const options = res?.data?.data?.["Menu Sub Category Details"]?.map(
          (item) => ({
            label: item.nameEnglish,
            value: item.id,
          })
        );
        setSubCategoryOptions(options);
      } else {
        setSubCategoryOptions([]);
      }
    } catch (err) {
      console.log("Sub Category API Error:", err);
      setSubCategoryOptions([]);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    form.setFieldValue("menuSubCategory", undefined);
    setSubCategoryOptions([]);

    if (categoryId) {
      fetchSubCategories(categoryId);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchCategories();
      form.resetFields();
      setSubCategoryOptions([]);
    }
  }, [isModalOpen]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);

      const file = values?.image?.file || null;

      const payload = {
        userId: Number(userId),
        menuCategoryId: values.menuCategory,
        menuSubCategoryId: values.menuSubCategory || "",
        nameEnglish: values.nameEnglish || "",
        nameGujarati: values.nameGujarati || "",
        nameHindi: values.nameHindi || "",
        slogan: values.slogan || "",
        price: values.price || 0,
        sequence: Number(values.priority) || 0,
        remarks: values.remarks || "",
        url: values.url || "",
        menuItemRawMaterials: [],
        menuItemAllocationConfigRequest: null,
        dishCosting: 0,
        totalRate: 0,
      };

      const res = await AddMenuItems(payload);
      const data = res?.data;
      const success = data?.success;

      if (success && file) {
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

      if (success) {
        refreshData();
        setIsModalOpen(false);
        form.resetFields();
      }
    } catch (error) {
      console.log("Save Menu Item Error:", error);
    }
  };

  return (
    <CustomModal
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={
        <span className="text-black text-base font-medium">Add Menu Item</span>
      }
      width={1000}
      className="add-menu-modal"
      footer={
        <div className="flex justify-end gap-2 py-2">
          <button
            className="btn btn-secondary"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      }
    >
      <Form layout="vertical" form={form} className="space-y-5">
        {/* 3 Names */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item
            label={
              <span className="text-[#6A7C94] text-base font-medium">
                Name (English) <span className="text-red-500">*</span>
              </span>
            }
            name="nameEnglish"
            rules={[{ required: true, message: "Please enter Name (English)" }]}
          >
            <Input
              className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
              placeholder="Enter Name (English)"
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
            <Input
              className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
              placeholder="Enter Name (Gujarati)"
            />
          </Form.Item>
          <Form.Item
            label={
              <span className="text-[#6A7C94] text-base font-medium">
                Name (Hindi)
              </span>
            }
            name="nameHindi"
          >
            <Input
              className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
              placeholder="Enter Name (Hindi)"
            />
          </Form.Item>
        </div>

        {/* Slogan */}
        <Form.Item
          label={
            <span className="text-[#6A7C94] text-base font-medium">Slogan</span>
          }
          name="slogan"
        >
          <Input
            className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
            placeholder="Enter Slogan"
          />
        </Form.Item>

        {/* Price & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-[#6A7C94] text-base font-medium">
                Price
              </span>
            }
            name="price"
          >
            <Input
              className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
              placeholder="Enter Price"
              type="text"
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
            <Input
              className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
              placeholder="Enter Priority"
              type="number"
            />
          </Form.Item>
        </div>

        {/* Category & Sub Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={
              <span className="text-[#6A7C94] text-base font-medium">
                Menu Item Category <span className="text-red-500">*</span>
              </span>
            }
            required
          >
            <div className="flex gap-3 w-full">
              <Form.Item
                name="menuCategory"
                rules={[
                  { required: true, message: "Please select Menu Category" },
                ]}
                noStyle
              >
                <Select
                  placeholder="Select Menu Category"
                  allowClear
                  options={categoryOptions}
                  onChange={handleCategoryChange}
                  className="bg-[#F8FAFC] h-10 w-full"
                />
              </Form.Item>

              <button
                type="button"
                className="p-1 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full shadow"
                onClick={() => setIsCategoryModalOpen(true)}
              >
                <i className="ki-filled ki-plus"></i>
              </button>
            </div>
          </Form.Item>

          <Form.Item label="Menu Item Sub Category">
            <div className="flex gap-3">
              <Form.Item name="menuSubCategory" noStyle>
                <Select
                  placeholder="Select Menu Sub Category"
                  options={subCategoryOptions}
                  loading={loadingSubCategories}
                  disabled={!form.getFieldValue("menuCategory")}
                  className="bg-[#F8FAFC] h-10 w-full"
                />
              </Form.Item>

              <button
                type="button"
                className="p-1 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full shadow"
                onClick={() => setIsSubCategoryModalOpen(true)}
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
          <Input
            className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
            placeholder="Enter Remarks"
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
            maxCount={1}
            accept=".jpg,.jpeg,.png,.svg,.zip"
            beforeUpload={() => false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="font-medium">Drag your file(s) or browse</p>
            <p className="text-gray-400 text-sm">Max 10 MB files are allowed</p>
          </Dragger>
          <p className="text-xs mt-1 text-gray-500">
            Only support .jpg, .png and .svg and zip files
          </p>
        </Form.Item>

        {/* URL */}
        <Form.Item
          label={
            <span className="text-[#6A7C94] text-base font-medium">
              Enter URL
            </span>
          }
          name="url"
        >
          <Input
            className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
            placeholder="Insert URL"
          />
        </Form.Item>
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
    </CustomModal>
  );
};

export default AddMenuItem;
