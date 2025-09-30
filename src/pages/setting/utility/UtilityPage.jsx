import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Input, Select, Switch, Button, Upload, Tooltip } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";

const { Option } = Select;

const UtilityPage = () => {
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Utility" }]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-black text-base font-semibold mb-5">
              Localization
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Decimal Limit for Currency
                </label>
                <Input placeholder="2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Date Format
                </label>
                <Select placeholder="dd/mm/yyyy" className="w-full">
                  <Option value="dd/mm/yyyy">dd/mm/yyyy</Option>
                  <Option value="mm/dd/yyyy">mm/dd/yyyy</Option>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Time Format
                </label>
                <Select placeholder="12 Hour" className="w-full">
                  <Option value="12">12 Hour</Option>
                  <Option value="24">24 Hour</Option>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Time Zone
                </label>
                <Select placeholder="UTC+05:30" className="w-full">
                  <Option value="utc">UTC+05:30</Option>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-black text-base font-semibold mb-5">
              Reporting
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Counter Name Plate Report Size
                </label>
                <Select placeholder="A4" className="w-full">
                  <Option value="A4">A4</Option>
                  <Option value="A3">A3</Option>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Page Size Options in Page Index
                </label>
                <Select placeholder="10" className="w-full">
                  <Option value="10">10</Option>
                  <Option value="20">20</Option>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Two Language Report - Default Language
                </label>
                <Select placeholder="English (en)" className="w-full">
                  <Option value="en">English (en)</Option>
                  <Option value="hi">Hindi (hi)</Option>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Two Language Report - Preferred Language
                </label>
                <Select placeholder="Hindi (hi)" className="w-full">
                  <Option value="hi">Hindi (hi)</Option>
                  <Option value="en">English (en)</Option>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-black text-base font-semibold mb-5">
              General Configuration
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Auto-complete Textbox",
                  tooltip:
                    "Enable this option to use autocomplete in the 'Menu Preparation Search - Menu Item' textbox. When an item is selected, it will automatically be added to the tree.",
                },
                {
                  label: "Is Mobile Number Unique?",
                  tooltip: "It is used in the contact record",
                },
                {
                  label: "Display max person Function",
                  tooltip:
                    "It will show the details of crockery and general fix raw material data",
                },
                {
                  label: "Adjust Quantity",
                  tooltip: "It will display adjusted quantity",
                },
                {
                  label: "Display Auto Time Raw Material",
                  tooltip:
                    "It will set the raw material time according to the labour shift that you set in your function type.",
                },
                {
                  label: "Is Menu Item Unique?",
                  tooltip:
                    "It is used in menu item record. (If it is off then same menu item name with different category can be saved)",
                },
                {
                  label: "Display Party Plot Name",
                  tooltip:
                    "Enabling this option will display the party plot name in the Dashboard > Calendar. This helps users easily identify the location of events directly from the calendar view.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-700 break-words">
                      {item.label}
                    </span>
                    <Tooltip title={item.tooltip}>
                      <i className="ki-filled ki-information-2 cursor-pointer"></i>
                    </Tooltip>
                  </div>
                  <Switch defaultChecked={i < 2} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[32%_66%] gap-6 mt-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-black text-base font-semibold mb-5">
              Advanced Setting
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Display Priority Wise Records",
                  tooltip:
                    "Enabling this option will display the party plot name in the Dashboard > Calendar. This helps users easily identify the location of events directly from the calendar view.",
                },
                {
                  label: "Is End Date Required in Event Booking?",
                  tooltip: "It will display end date in event booking.",
                },
                {
                  label: "Bill Date Same As Function Date",
                  tooltip:
                    "If enabled, this option will use the date of the first function as the bill date for the invoice and proforma invoice, in case no bill date is specified.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-700 break-words">
                      {item.label}
                    </span>
                    <Tooltip title={item.tooltip}>
                      <i className="ki-filled ki-information-2 cursor-pointer"></i>
                    </Tooltip>
                  </div>
                  <Switch defaultChecked={i < 2} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-black text-base font-semibold mb-5">
              Customization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Font Colour
                </label>
                <Input value="#FE4444" readOnly className="cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Background Colour
                </label>
                <Input value="#F3F4F6" readOnly className="cursor-pointer" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-2">
                  Background Image
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src="https://i.ibb.co/vYxQbYM/sample.jpg"
                    alt="preview"
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                  <Upload maxCount={1} accept="image/*">
                    <Button icon={<UploadOutlined />}>
                      Upload a JPG, PNG, or GIF. Max size of 800K.
                    </Button>
                  </Upload>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="primary"
            className="bg-primary"
            icon={<SaveOutlined />}
            size="large"
          >
            Save
          </Button>
        </div>
      </Container>
    </Fragment>
  );
};

export { UtilityPage };
