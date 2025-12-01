import { Fragment, useMemo, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { FormattedMessage } from "react-intl";
import { columns, defaultData } from "./constant";
import { TableComponent } from "@/components/table/TableComponent";
import {
  Tabs,
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

const { Dragger } = Upload;
const { TextArea } = Input;

const categoryOptions = [
  {
    value: "starter",
    label: "Starter",
    subCategories: [
      { value: "veg-starter", label: "Veg Starter" },
      { value: "nonveg-starter", label: "Non-Veg Starter" },
    ],
  },
  {
    value: "main-course",
    label: "Main Course",
    subCategories: [
      { value: "indian", label: "Indian" },
      { value: "chinese", label: "Chinese" },
    ],
  },
];
const allocationTabsConfig = {
  chef: [
    {
      type: "input",
      label: "Quantity Per 100 Person",
      name: "qty",
      placeholder: "Helper",
    },
    { type: "select", label: "Select Unit", name: "unit" },
    { type: "input", label: "Price (Price Per 1 Unit)", name: "price" },
    {
      type: "select",
      label: "Select Contact Category",
      name: "contactCategory",
    },
    { type: "select", label: "Select Contact Name", name: "contactName" },
    { type: "input", label: "Remarks", name: "outside_remarks" },
  ],
  outside: [
    { type: "select", label: "Select wise", name: "counter wise" },
    { type: "input", label: "Counter No", name: "counterno" },
    { type: "input", label: "  Price (Price Per 1 Labour)", name: "price" },
    { type: "input", label: "Helper", name: "helper" },
    {
      type: "input",
      label: "Price (Price Per 1 Helper)",
      name: "price_helper",
    },
    { type: "select", label: "Select Contact Name", name: "contactName" },
  ],
  inside: [
    { type: "select", label: "Select Chef Name", name: "chef_name" },
    { type: "input", label: "Remarks", name: "remarks" },
    { type: "input", label: "Number", name: "chef_number" },
  ],
};

const MenuItemMaster = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("details");
  const [fileList, setFileList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tableData, setTableData] = useState(defaultData);

  const subCategoryOptions = useMemo(() => {
    const found = categoryOptions.find((c) => c.value === selectedCategory);
    return found?.subCategories || [];
  }, [selectedCategory]);

  const handleUploadChange = ({ fileList: newList }) => {
    setFileList(newList);
  };

  const handleRemoveFile = (file) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleRetry = () => {
    message.info("Retry upload logic can be added here.");
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      imageFiles: fileList.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
    };

    console.log("MENU ITEM PAYLOAD =>", payload);
    message.success("Form submitted! Check console for payload.");
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
  };

  const tabItems = [
    {
      key: "details",
      label: "Menu Item Details",
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-4"
        >
          {/* Names */}
          <div className="grid gap-4 md:grid-cols-3">
            <Form.Item
              label={
                <span className="text-[#6A7C94] text-base font-medium">
                  Name (English)<span className="text-red-500">*</span>
                </span>
              }
              name="nameEnglish"
            >
              <Input className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]" />
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
              <Select
                placeholder="Select Menu Item Category"
                options={categoryOptions.map((c) => ({
                  value: c.value,
                  label: c.label,
                }))}
                onChange={(val) => {
                  setSelectedCategory(val);
                  form.setFieldsValue({ subCategory: undefined });
                }}
                className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-[#6A7C94] text-base font-medium">
                  Menu Item Sub Category
                </span>
              }
              name="subCategory"
            >
              <Select
                placeholder="Select Menu Item Sub Category"
                options={subCategoryOptions}
                className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
              />
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
              className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
            />
          </Form.Item>

          {/* Image Upload */}
          <Form.Item
            label={
              <span className="text-[#6A7C94] text-base font-medium">
                Image
              </span>
            }
            name="image"
          >
            <Dragger
              multiple={false}
              beforeUpload={() => false} // stop auto-upload, keep local in state
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
                Only support .jpg, .png, .svg and .zip files. Max 10 MB files
                are allowed.
              </p>
            </Dragger>
          </Form.Item>
          {/* Custom uploaded file list (to mimic your screenshot) */}
          {fileList.length > 0 && (
            <div className="space-y-2 mb-4">
              {fileList.map((file) => (
                <div
                  key={file.uid}
                  className="flex items-center justify-between rounded-md border px-3 py-2 bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs">
                      {file.name.split(".").pop()?.toUpperCase() || "FILE"}
                    </div>
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

          <div className=" w-full">
            <h1 className="text-black text-xl font-medium mb-4">
              Raw Material List :
            </h1>

            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-end flex-wrap">
                <div className="flex flex-col w-[300px]">
                  <label className="text-[#6A7C94] text-base font-medium mb-2">
                    Select Raw Material
                  </label>
                  <Select
                    placeholder="Select Raw Material "
                    className=" bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
                  />
                </div>

                <div className="flex flex-col w-[300px]">
                  <label className="text-[#6A7C94] text-base font-medium mb-2">
                    Weight
                  </label>
                  <Input
                    placeholder="Enter weight"
                    type="text"
                    className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9] "
                  />
                </div>

                <div className="flex flex-col w-[300px]">
                  <label className="text-[#6A7C94] text-base font-medium mb-2">
                    Unit
                  </label>
                  <Select
                    placeholder="Select Unit"
                    className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] focus:border-[#d9d9d9]"
                  />
                </div>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="bg-primary h-10 px-6 rounded-md hover:bg-primary mt-7"
              >
                Add Recipe
              </Button>
            </div>

            {/* Search */}
            <div className={`flex flex-wrap items-center gap-2 mt-4 mb-4`}>
              <div className="filItems relative">
                <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                <input
                  className="input pl-8 w-[300px]"
                  placeholder="Search Rawmaterial"
                  type="text"
                  value=""
                  onChange=""
                />
              </div>
            </div>

            <div>
              <TableComponent
                columns={columns}
                data={tableData}
                paginationSize={10}
              />
            </div>

            {/* Footer Total */}
            <div className="flex justify-between mt-4 text-lg font-medium text-[#6A7C94]">
              <p>
                Dish Costing :<span className="text-primary ml-2">1000.00</span>
              </p>
              <p>
                Total Rate :<span className="text-primary ml-2">10000.00</span>
              </p>
            </div>
          </div>
          {/* Footer buttons */}
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
              {/* NEXT BUTTON (go to next tab) */}
              <Button
                type="primary"
                onClick={() => setActiveTab("allocation")}
                className="bg-primary h-10 px-6 rounded-md hover:bg-primary"
              >
                Next
              </Button>

              {/* SAVE BUTTON (submit form) */}
              <Button
                type="primary"
                htmlType="submit"
                className="bg-primary h-10 px-6 rounded-md hover:bg-primary w-[120px]"
              >
                Save
              </Button>
            </div>
          </div>
        </Form>
      ),
    },
    {
      key: "allocation",
      label: "Allocation Configuration",
      children: (
        <div className="mt-6">
          <Form layout="vertical">
            {/* Venue */}
            <Form.Item
              label={
                <span className="text-[#6A7C94] text-base font-medium">
                  At Venue
                </span>
              }
              name="venue"
            >
              <Select
                placeholder="Select Venue"
                className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9]"
              />
            </Form.Item>

            {/* Inner Tabs */}
            <Tabs defaultActiveKey="chef" className="allocation-inner-tabs">
              <Tabs.TabPane tab="Select Chef Labour Agency" key="chef">
                <RenderAllocationFields fields={allocationTabsConfig.chef} />
              </Tabs.TabPane>

              <Tabs.TabPane tab="Select Outside Agency" key="outside">
                <RenderAllocationFields fields={allocationTabsConfig.outside} />
              </Tabs.TabPane>

              <Tabs.TabPane tab="Select Inside Cook" key="inside">
                <RenderAllocationFields fields={allocationTabsConfig.inside} />
              </Tabs.TabPane>
            </Tabs>

            {/* Footer buttons for Allocation Tab */}
            <div className="flex justify-between gap-4 pt-4 mb-6">
              {/* PREV BUTTON */}
              <Button
                type="default"
                onClick={() => setActiveTab("details")}
                className="bg-white h-10 px-6 rounded-md hover:bg-primary"
              >
                Previous
              </Button>

              {/* SAVE BUTTON */}
              <Button
                type="primary"
                htmlType="submit"
                className="bg-primary h-10 px-6 rounded-md hover:bg-primary w-[120px]"
              >
                Save
              </Button>
            </div>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <Container>
        <div>
          {/* Breadcrumb */}
          <div className="pb-2">
            <Breadcrumbs
              items={[
                {
                  title: (
                    <FormattedMessage
                      id="USER.MASTER.UNIT_MASTER"
                      defaultMessage="Add Menu Item"
                    />
                  ),
                },
              ]}
            />
          </div>

          {/* Main card */}
          <div>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              className="[&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-tab-btn]:text-sm custom-tabs"
            />
          </div>
        </div>
      </Container>
    </Fragment>
  );
};
const RenderAllocationFields = ({ fields }) => (
  <>
    {fields.map((f) => (
      <Form.Item
        key={f.name}
        label={
          <span className="text-[#6A7C94] text-base font-medium">
            {f.label}
          </span>
        }
        name={f.name}
      >
        {f.type === "input" ? (
          <Input
            placeholder={f.placeholder}
            className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9]"
          />
        ) : (
          <Select
            placeholder={f.placeholder || f.label}
            className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9]"
          />
        )}
      </Form.Item>
    ))}
  </>
);

export default MenuItemMaster;
