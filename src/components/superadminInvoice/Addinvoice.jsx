import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { DatePicker, Input, Tooltip, Button, Table, Empty } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import InvoiceFooter from "@/components/InvoiceTable/InvoiceFooter";

const { TextArea } = Input;

const Addinvoice = () => {
  const [data, setData] = useState([]);

  const columns = [
    {
      title: "Plan",
      dataIndex: "function",
      key: "function",
    },
    {
      title: "Plan Start date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Plan End date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.key)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleAdd = () => {
    const newRow = {
      key: Date.now(),
      function: "Elite",
      startDate: "12/10/2025",
      endDate: "15/10/2025",
      amount: "₹50,000",
    };
    setData((prev) => [...prev, newRow]);
  };

  const handleDelete = (key) => {
    setData((prev) => prev.filter((item) => item.key !== key));
  };

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Invoice" }]} />
        </div>

        <div className="flex flex-col bg-gray-100 rounded mb-7">
          <div className="flex flex-col bg-white rounded">
            {/* Header Section */}
            <div className="card min-w-full bg-no-repeat bg-[length:500px] user-access-bg mb-5">
              <div className="flex flex-wrap items-center justify-between p-4 gap-3">
                <div className="flex flex-col gap-2.5">
                  <p className="text-lg font-semibold text-gray-900">
                    Party Name:
                  </p>
                  <div className="flex items-center gap-7">
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-user text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Plan name:</span>
                        <span className="text-sm font-medium text-gray-900">
                          Example Party
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-calendar-tick text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Plan Start Date:</span>
                        <span className="text-sm font-medium text-gray-900">
                          12/10/2025
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-calendar-tick text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Plan End Date:</span>
                        <span className="text-sm font-medium text-gray-900">
                          15/10/2025
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ki-filled ki-calendar-tick text-success"></i>
                      <div className="flex flex-col">
                        <span className="text-xs">Due Date:</span>
                        <DatePicker
                          format="DD/MM/YYYY"
                          className="input w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-end gap-2">
                  <Button type="primary" size="small">
                    <i className="ki-filled ki-printer"></i> Print
                  </Button>
                  <Button type="primary" size="small">
                    <i className="ki-filled ki-exit-right-corner"></i> Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Billing Section */}
            <div className="flex flex-col border rounded-xl mb-5">
              <div className="grid md:grid-cols-2 rounded">
                {/* Billing Address */}
                <div className="border-r p-4 rounded">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Billing Address
                    <Tooltip title="Edit">
                      <EditOutlined className="text-primary ms-2 cursor-pointer" />
                    </Tooltip>
                  </h4>
                  <p className="text-sm text-gray-700">
                    123 Example Street, City
                    <br />
                    Example Billing Name
                  </p>
                </div>

                {/* Shipping Address */}
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Shipping Address
                    <Tooltip title="Edit">
                      <EditOutlined className="text-primary ms-2 cursor-pointer" />
                    </Tooltip>
                  </h4>
                  <p className="text-sm text-gray-700">
                    456 Sample Avenue, Town
                    <br />
                    Example Shipping Name
                  </p>
                </div>
              </div>

              {/* GST Section */}
              <div className="grid md:grid-cols-2 border-t">
                <div className="border-r p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      Billing Name:
                    </span>
                    <span className="text-gray-700">ABC Events Pvt Ltd</span>
                    <Tooltip title="Edit">
                      <EditOutlined className="text-primary cursor-pointer" />
                    </Tooltip>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      GST Number:
                    </span>
                    <span className="text-gray-700">27ABCDE1234F1Z5</span>
                    <Tooltip title="Edit">
                      <EditOutlined className="text-primary cursor-pointer" />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Plan Information Table */}
            <div className="p-4 mb-1 border rounded-xl">
              <h4 className="text-base font-semibold text-gray-900 mb-3">
                Plan Information
              </h4>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                locale={{
                  emptyText: (
                    <div className="py-6">
                      <Empty description="No data" />
                    </div>
                  ),
                }}
                bordered
              />
              <div className="mt-4">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  className="bg-[#005AA7] hover:bg-[#004a8b]"
                >
                  Add New Row
                </Button>
              </div>
            </div>

            {/* Footer Section */}
            <InvoiceFooter />
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Addinvoice;
