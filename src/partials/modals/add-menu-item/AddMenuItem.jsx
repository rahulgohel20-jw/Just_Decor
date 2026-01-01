import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Form, Input, Select, Upload } from "antd";
import { useState, useEffect } from "react";
import { InboxOutlined } from "@ant-design/icons";
import {
  GetAllCategoryformenu,
  Getmenusubcategory,
  AddMenuItems,
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

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);

  const userId = localStorage.getItem("userId");

  const fetchCategories = async () => {
    try {
      const res = await GetAllCategoryformenu(userId);

      const options =
        res?.data?.data?.["Menu Category Details"]?.map((item) => ({
          label: item.nameEnglish,
          value: item.id,
        })) || [];

      setCategoryOptions(options);
    } catch (error) {
      console.log("Category API Error:", error);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    try {
      setLoadingSubCategories(true);
      const res = await Getmenusubcategory(categoryId, userId);

      const options =
        res?.data?.data?.["Menu Sub Category Details"]?.map((item) => ({
          label: item.nameEnglish,
          value: item.id,
        })) || [];

      setSubCategoryOptions(options);
    } catch (error) {
      console.log("Sub Category API Error:", error);
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
      const file = values?.image?.file || null;

      const formData = new FormData();

      formData.append("userId", Number(userId));
      formData.append("menuCategoryId", values.menuCategory);
      formData.append("menuSubCategoryId", values.menuSubCategory || "");
      formData.append("nameEnglish", values.nameEnglish || "");
      formData.append("nameGujarati", values.nameGujarati || "");
      formData.append("nameHindi", values.nameHindi || "");
      formData.append("slogan", values.slogan || "");
      formData.append("price", values.price || 0);
      formData.append("sequence", Number(values.priority) || 0);

      if (file) {
        formData.append("file", file);
      }

      const res = await AddMenuItems(formData);

      Swal.fire({
        title: res?.data?.success ? "Success!" : "Failed",
        text: res?.data?.msg,
        icon: res?.data?.success ? "success" : "error",
      });

      if (res?.data?.success) {
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
        {/* ===================== NAMES ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Form.Item name="nameEnglish" label="Name (English) *">
            <Input placeholder="Enter Name (English) " />
          </Form.Item>

          <Form.Item name="nameGujarati" label="Name (Gujarati)">
            <Input placeholder="Enter Name (Gujarati)" />
          </Form.Item>

          <Form.Item name="nameHindi" label="Name (Hindi)">
            <Input placeholder="Enter Name (Hindi)" />
          </Form.Item>
        </div>

        <Form.Item name="slogan" label="Slogan">
          <Input placeholder="Enter Slogan" />
        </Form.Item>

        {/* ===================== PRICE / PRIORITY ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="price" label="Price">
            <Input type="number" placeholder="Enter Price" />
          </Form.Item>

          <Form.Item name="priority" label="Priority">
            <Input type="number" placeholder="Enter Priority" />
          </Form.Item>
        </div>

        {/* ===================== CATEGORY ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item label="Menu Category *">
            <div className="flex gap-2">
              <Form.Item name="menuCategory" noStyle>
                <Select
                  placeholder="Select Category"
                  options={categoryOptions}
                  onChange={handleCategoryChange}
                  className="w-full"
                />
              </Form.Item>
              <button
                className="bg-blue-900 px-2 py-1 rounded-lg text-white"
                onClick={() => setIsCategoryModalOpen(true)}
              >
                +
              </button>
            </div>
          </Form.Item>

          <Form.Item label="Menu Sub Category">
            <div className="flex gap-2">
              <Form.Item name="menuSubCategory" noStyle>
                <Select
                  placeholder="Select Sub Category"
                  options={subCategoryOptions}
                  loading={loadingSubCategories}
                  disabled={!form.getFieldValue("menuCategory")}
                  className="w-full"
                />
              </Form.Item>
              <button
                className="bg-blue-900 px-2 py-1 rounded-lg text-white"
                onClick={() => setIsSubCategoryModalOpen(true)}
              >
                +
              </button>
            </div>
          </Form.Item>
        </div>

        <Form.Item name="remarks" label="Remarks">
          <Input placeholder="Enter Remarks" />
        </Form.Item>

        {/* ===================== IMAGE ===================== */}
        <Form.Item name="image" label="Image">
          <Dragger beforeUpload={() => false} maxCount={1}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p>Drag or Upload Image</p>
          </Dragger>
        </Form.Item>

        <Form.Item name="url" label="URL">
          <Input placeholder="Enter URL" />
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
