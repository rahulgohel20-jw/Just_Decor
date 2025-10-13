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
      name: "",
      date: "",
      person: 0.0,
      extra: 0.0,
      rate: 0.0,
      amount: 0,
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
        name: "",
        date: "",
        person: 0.0,
        extra: 0.0,
        rate: 0.0,
        amount: 0,
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

        <div className="flex flex-col bg-gray-100 rounded mb-7">
          <div className="flex flex-col bg-white rounded ">
            <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
              <div className="flex flex-wrap items-center justify-between p-4 gap-3">
                <div className="flex flex-col gap-2.5">
                  <p className="text-lg font-semibold text-gray-900">
                    Event Name: Wedding
                  </p>
                  <div className="flex items-center gap-7">
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-user text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Party name:</span>
                        <span className="text-sm font-medium text-gray-900">
                          Vivek
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-geolocation-home text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Venue name:</span>
                        <span className="text-sm font-medium text-gray-900">
                          Ahmedabad
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-calendar-tick text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Invoices Date:</span>
                        <span className="text-sm font-medium text-gray-900">
                          10/10/2025
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-calendar-tick text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Invoice Number:</span>
                        <span className="text-sm font-medium text-gray-900">
                          INV20001052
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-calendar-tick text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Event Date:</span>
                        <span className="text-sm font-medium text-gray-900">
                          12/12/2025
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-end gap-2">
                  <button className="btn btn-sm btn-primary" title="Print">
                    <i className="ki-filled ki-printer"></i> Print
                  </button>
                  <button className="btn btn-sm btn-primary" title="Share">
                    <i className="ki-filled ki-exit-right-corner"></i> Share
                  </button>
                </div>
              </div>
            </div>
            {/* Billing */}
            <div className="flex flex-col border rounded-xl mb-5">
              <div className="grid md:grid-cols-2 rounded">
                <div className="border-r p-4 rounded">
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
      </Container>
    </Fragment>
  );
};

export default AddInvoicePage;
