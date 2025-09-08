import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { DatePicker, Input, Switch, Button } from "antd";
import ItemTable from "@/components/InvoiceTable/ItemTable";
import InvoiceFooter from "@/components/InvoiceTable/InvoiceFooter";
import { Tooltip } from "antd";
import {
  SearchOutlined,
  EditOutlined,
  DownloadOutlined,
  EyeOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Download } from "lucide-react";

const AddInvoicePage = () => {
  const [rows, setRows] = useState([
    {
      key: 1,
      item: "",
      qty: 0.0,
      rate: 0.0,
      discount: 0.0,
      tax: 0.0,
      amount: 0.0,
    },
  ]);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleDeleteRow = (key) => {
    setRows(rows.filter((row) => row.key !== key));
  };

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        key: Date.now(),
        item: "",
        qty: 0.0,
        rate: 0.0,
        discount: 0.0,
        tax: 0.0,
        amount: 0.0,
      },
    ]);
  };
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Invoice" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search customer"
                type="text"
              />
            </div>
            <div className="filItems">
              <DatePicker placeholder="Select Date" size="large" />
            </div>
            <div className="filItems">
              <DatePicker placeholder="Select Due Date" size="large" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button class="btn btn-primary" title="Save & Send">
              <i class="ki-outline ki-paper-plane"></i>
              Save & Send
            </button>
            <button class="btn btn-success" title="Save as Draft">
              <i class="ki-outline ki-printer"></i> Save as Draft
            </button>
          </div>
        </div>
        <div className="flex flex-col bg-gray-100 rounded p-10 mb-7">
          <div className="flex flex-col bg-white rounded p-5">
            {/* Invoice */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h4 class="text-lg font-semibold text-gray-900">
                <span class="text-gray-900 uppercase">Invoice:</span>
                <span class="text-primary ms-1">JC2021001</span>
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                <button className="btn btn-sm btn-primary" title="Preview">
                  <i className="ki-outline ki-eye"></i> Preview
                </button>
                <button className="btn btn-sm btn-primary" title="Download">
                  <Download style={{ width: "18", height: "18" }} /> Download
                </button>
              </div>
            </div>
            {/* Billing */}
            <div className="flex flex-col border rounded mb-5">
              <div className="grid md:grid-cols-2">
                <div className="border-r p-4">
                  <h4 class="text-sm font-semibold text-gray-900 mb-3">
                    Billing Address
                    <Tooltip title="Edit">
                      <EditOutlined className="text-primary ms-2 cursor-pointer" />
                    </Tooltip>
                  </h4>
                  <p className="text-sm text-gray-700">
                    45, Ashoknagar So. Ved Road,
                    <br />
                    Katargam, Surat 395004,
                    <br />
                    Gujarat, India
                  </p>
                </div>
                <div className="p-4">
                  <h4 class="text-sm font-semibold text-gray-900 mb-3">
                    Shipping Address
                    <Tooltip title="Edit">
                      <EditOutlined className="text-primary ms-2 cursor-pointer" />
                    </Tooltip>
                  </h4>
                  <div className="flex items-start">
                    <Tooltip title="Add Address">
                      <span className="text-sm text-primary">+</span>
                      <span className="text-sm text-primary cursor-pointer ms-1 hover:underline">
                        Add a New Address
                      </span>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 border-t">
                <div className="border-r p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      GST Treatment
                    </span>
                    <span className="text-gray-700">
                      Registered Business - Regular
                    </span>
                    <Tooltip title="Edit">
                      <EditOutlined className="text-primary cursor-pointer" />
                    </Tooltip>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      GST Number
                    </span>
                    <span className="text-gray-700">27ABJFA7206Q1ZY</span>
                    <Tooltip title="Edit">
                      <EditOutlined className="text-primary cursor-pointer" />
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border-t p-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Late Fees</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            {/* ItemTable */}
            <ItemTable
              rows={rows}
              onInputChange={handleInputChange}
              onAddRow={handleAddRow}
              onDeleteRow={handleDeleteRow}
            />
            {/* InvoiceFooter */}
            <InvoiceFooter />
          </div>
        </div>
        {/* <div className="bg-white"> */}
        {/* <div className="flex items-center justify-between flex-wrap rounded-lg py-2 mb-4 "> */}
        {/* <div className="flex items-center justify-between flex-wrap gap-6 px-4 py-2 relative rounded-lg [border:1px_solid_transparent] [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(90deg,#004986,#004986)_border-box] shadow-[10px_4px_4px_0px_#00000040]">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Date:</span>
                <DatePicker
                  placeholder="Select Date"
                  size="small"
                  className="border-none "
                />
              </div>
              <div className="font-semibold text-lg">
                Invoice # <span className="font-normal">2021001</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Due Date:</span>
                <DatePicker
                  placeholder="Select Date"
                  size="small"
                  className="border-none"
                />
              </div>
            </div> */}
        {/* <div className="flex items-center gap-2">
              <Button
                type="text"
                icon={<SaveOutlined />}
                className="bg-[#003366] text-white font-semibold rounded-lg 
               hover:!bg-[#E6F3FA] hover:!text-[#003366] hover:!border-[#003366] 
               shadow-md flex items-center gap-2"
              >
                Save
              </Button>
              <Button
                type="text"
                icon={<EyeOutlined />}
                className="bg-[#005B99] text-white font-semibold rounded-lg 
               hover:!bg-[#E6F3FA] hover:!text-[#005B99] hover:!border-[#005B99] 
               shadow-md flex items-center gap-2"
              >
                Preview
              </Button>
              <Button
                type="text"
                icon={<DownloadOutlined />}
                className="bg-[#007ACC] text-white font-semibold rounded-lg 
               hover:!bg-[#E6F3FA] hover:!text-[#007ACC] hover:!border-[#007ACC] 
               shadow-md flex items-center gap-2"
              >
                Download
              </Button>
            </div> */}
        {/* </div> */}
        {/* <div className="mb-6 flex flex-row items-center gap-4">
            <label className="font-semibold text-[#464E5F]">
              Customer Name
              <span className="mandatory ms-0.5 text-base text-red-500 font-medium">
                *
              </span>
            </label>
            <Input
              placeholder="Search Name (ex. Swapnil Ghodaswar)"
              suffix={<SearchOutlined className="text[#494949] text-2xl" />}
              className="p-2  relative rounded-lg [border:1px_solid_transparent] [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(90deg,#004986,#004986)_border-box] mt-1 w-2/5"
            />
          </div> */}
        {/* </div> */}
      </Container>
    </Fragment>
  );
};

export default AddInvoicePage;
