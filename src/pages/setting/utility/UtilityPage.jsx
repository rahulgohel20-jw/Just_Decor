import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Input, Select, Switch, Button, Upload, Tooltip } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";

const { Option } = Select;

const UtilityPage = () => {
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: <FormattedMessage id="SETTING.UTILITY" defaultMessage="Utility" /> }]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-black text-base font-semibold mb-5">
              <FormattedMessage id="SETTING.LOCALIZATION" defaultMessage="Localization" />
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  <FormattedMessage id="SETTING.DECIMAL_LIMIT" defaultMessage="Decimal Limit for Currency" />
                </label>
                <Input placeholder="2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  <FormattedMessage id="SETTING.DATE_FORMAT" defaultMessage="Date Format" />
                </label>
                <Select placeholder="dd/mm/yyyy" className="w-full">
                  <Option value="dd/mm/yyyy">dd/mm/yyyy</Option>
                  <Option value="mm/dd/yyyy">mm/dd/yyyy</Option>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  <FormattedMessage id="SETTING.TIME_FORMAT" defaultMessage="Time Format" />
                </label>
                <Select placeholder="12 Hour" className="w-full">
                  <Option value="12"><FormattedMessage id="SETTING.TIME_FORMAT_12" defaultMessage="12 Hour" /></Option>
                  <Option value="24"><FormattedMessage id="SETTING.TIME_FORMAT_24" defaultMessage="24 Hour" /></Option>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  <FormattedMessage id="SETTING.TIME_ZONE" defaultMessage="Time Zone" />
                </label>
                <Select placeholder="UTC+05:30" className="w-full">
                  <Option value="utc">UTC+05:30</Option>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-black text-base font-semibold mb-5">
              <FormattedMessage id="SETTING.REPORT" defaultMessage="Reporting" />
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  <FormattedMessage id="SETTING.COUNTER_NAME_PLATE_REPORT_SIZE" defaultMessage="Counter Name Plate Report Size" />
                </label>
                <Select placeholder="A4" className="w-full">
                  <Option value="A4"><FormattedMessage id="SETTING.COUNTER_NAME_PLATE_REPORT_SIZE_A4" defaultMessage="A4" /></Option>
                  <Option value="A3"><FormattedMessage id="SETTING.COUNTER_NAME_PLATE_REPORT_SIZE_A3" defaultMessage="A3" /></Option>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  <FormattedMessage id="SETTING.PAGE_SIZE_OPTIONS" defaultMessage="Page Size Options in Page Index" />
                </label>
                <Select placeholder="10" className="w-full">
                  <Option value="10"><FormattedMessage id="SETTING.PAGE_SIZE_OPTIONS_10" defaultMessage="10" /></Option>
                  <Option value="20"><FormattedMessage id="SETTING.PAGE_SIZE_OPTIONS_20" defaultMessage="20" /></Option>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  <FormattedMessage id="SETTING.TWO_LANGUAGE_REPORT_DEFAULT_LANGUAGE" defaultMessage="Two Language Report - Default Language" />
                </label>
                <Select placeholder="English (en)" className="w-full">
                  <Option value="en"><FormattedMessage id="SETTING.TWO_LANGUAGE_REPORT_DEFAULT_LANGUAGE_EN" defaultMessage="English (en)" /></Option>
                  <Option value="hi"><FormattedMessage id="SETTING.TWO_LANGUAGE_REPORT_DEFAULT_LANGUAGE_HI" defaultMessage="Hindi (hi)" /></Option>
                </Select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  <FormattedMessage id="SETTING.TWO_LANGUAGE_REPORT_PREFERRED_LANGUAGE" defaultMessage="Two Language Report - Preferred Language" />
                </label>
                <Select placeholder="Hindi (hi)" className="w-full">
                  <Option value="hi"><FormattedMessage id="SETTING.TWO_LANGUAGE_REPORT_PREFERRED_LANGUAGE_HI" defaultMessage="Hindi (hi)" /></Option>
                  <Option value="en"><FormattedMessage id="SETTING.TWO_LANGUAGE_REPORT_PREFERRED_LANGUAGE_EN" defaultMessage="English (en)" /></Option>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-black text-base font-semibold mb-5">
              <FormattedMessage id="SETTING.GENERAL_CONFIGURATION" defaultMessage="General Configuration" />
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: <FormattedMessage id="SETTING.AUTO_COMPLETE_TEXTBOX" defaultMessage="Auto-complete Textbox" />,
                  tooltip: <FormattedMessage id="SETTING.AUTO_COMPLETE_TEXTBOX_TOOLTIP" defaultMessage="Enable this option to use autocomplete in the 'Menu Preparation Search - Menu Item' textbox. When an item is selected, it will automatically be added to the tree." />,
                },
                {
                  label: <FormattedMessage id="SETTING.IS_MOBILE_NUMBER_UNIQUE" defaultMessage="Is Mobile Number Unique?" />,
                  tooltip: <FormattedMessage id="SETTING.IS_MOBILE_NUMBER_UNIQUE_TOOLTIP" defaultMessage="It is used in the contact record" />,
                },
                {
                  label: <FormattedMessage id="SETTING.DISPLAY_MAX_PERSON_FUNCTION" defaultMessage="Display max person Function" />,
                  tooltip: <FormattedMessage id="SETTING.DISPLAY_MAX_PERSON_FUNCTION_TOOLTIP" defaultMessage="It will show the details of crockery and general fix raw material data" />,
                },
                {
                  label: <FormattedMessage id="SETTING.ADJUST_QUANTITY" defaultMessage="Adjust Quantity" />,
                  tooltip: <FormattedMessage id="SETTING.ADJUST_QUANTITY_TOOLTIP" defaultMessage="It will display adjusted quantity" />,
                },
                {
                  label: <FormattedMessage id="SETTING.DISPLAY_AUTO_TIME_RAW_MATERIAL" defaultMessage="Display Auto Time Raw Material" />,
                  tooltip: <FormattedMessage id="SETTING.DISPLAY_AUTO_TIME_RAW_MATERIAL_TOOLTIP" defaultMessage="It will set the raw material time according to the labour shift that you set in your function type." />,
                },
                {
                  label: <FormattedMessage id="SETTING.IS_MENU_ITEM_UNIQUE" defaultMessage="Is Menu Item Unique?" />,
                  tooltip: <FormattedMessage id="SETTING.IS_MENU_ITEM_UNIQUE_TOOLTIP" defaultMessage="It is used in menu item record. (If it is off then same menu item name with different category can be saved)" />,
                },
                {
                  label: <FormattedMessage id="SETTING.DISPLAY_PARTY_PLOT_NAME" defaultMessage="Display Party Plot Name" />,
                  tooltip: <FormattedMessage id="SETTING.DISPLAY_PARTY_PLOT_NAME_TOOLTIP" defaultMessage="Enabling this option will display the party plot name in the Dashboard > Calendar. This helps users easily identify the location of events directly from the calendar view." />,
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
              <FormattedMessage id="SETTING.ADVANCE_SETTING" defaultMessage="Advance Setting" />
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: <FormattedMessage id="SETTING.DISPLAY_PRIORITY_WISE_RECORDS" defaultMessage="Display Priority Wise Records" />,
                  tooltip: <FormattedMessage id="SETTING.DISPLAY_PRIORITY_WISE_RECORDS_TOOLTIP" defaultMessage="Enabling this option will display the party plot name in the Dashboard > Calendar. This helps users easily identify the location of events directly from the calendar view." />,
                },
                {
                  label: <FormattedMessage id="SETTING.IS_END_DATE_REQUIRED_IN_EVENT_BOOKING" defaultMessage="Is End Date Required in Event Booking?" />,
                  tooltip: <FormattedMessage id="SETTING.IS_END_DATE_REQUIRED_IN_EVENT_BOOKING_TOOLTIP" defaultMessage="It will display end date in event booking." />,
                },
                {
                  label: <FormattedMessage id="SETTING.BILL_DATE_SAME_AS_FUNCTION_DATE" defaultMessage="Bill Date Same As Function Date" />,
                  tooltip: <FormattedMessage id="SETTING.BILL_DATE_SAME_AS_FUNCTION_DATE_TOOLTIP" defaultMessage="If enabled, this option will use the date of the first function as the bill date for the invoice and proforma invoice, in case no bill date is specified." />,
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
              <FormattedMessage id="SETTING.CUSTOMIZATION" defaultMessage="Customization" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  <FormattedMessage id="SETTING.FONT_COLOUR" defaultMessage="Font Colour" />
                </label>
                <Input value="#FE4444" readOnly className="cursor-pointer" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  <FormattedMessage id="SETTING.BACKGROUND_COLOUR" defaultMessage="Background Colour" />
                </label>
                <Input value="#F3F4F6" readOnly className="cursor-pointer" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-2">
                  <FormattedMessage id="SETTING.BACKGROUND_IMAGE" defaultMessage="Background Image" />
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src="https://i.ibb.co/vYxQbYM/sample.jpg"
                    alt="preview"
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                  <Upload maxCount={1} accept="image/*">
                    <Button icon={<UploadOutlined />}>
                      <FormattedMessage id="SETTING.UPLOAD_BACKGROUND_IMAGE" defaultMessage="Upload a JPG, PNG, or GIF. Max size of 800K." />
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
            <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
          </Button>
        </div>
      </Container>
    </Fragment>
  );
};

export { UtilityPage };
