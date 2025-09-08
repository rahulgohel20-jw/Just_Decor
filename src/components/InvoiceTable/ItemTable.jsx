import { Table, Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const ItemTable = ({ rows, onInputChange, onAddRow, onDeleteRow }) => {
  const columns = [
    {
      title: "Item Details",
      dataIndex: "item",
      render: (text, record, index) => (
        <Input
          placeholder="Product Name"
          value={record.item}
          onChange={(e) => onInputChange(index, "item", e.target.value)}
          className="border-none shadow-none"
        />
      ),
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.qty}
          onChange={(e) => onInputChange(index, "qty", e.target.value)}
          className="text-center border-none shadow-none"
        />
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.rate}
          onChange={(e) => onInputChange(index, "rate", e.target.value)}
          className="text-center border-none shadow-none"
        />
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.discount}
          onChange={(e) => onInputChange(index, "discount", e.target.value)}
          className="text-center border-none shadow-none"
        />
      ),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.tax}
          onChange={(e) => onInputChange(index, "tax", e.target.value)}
          className="text-center border-none shadow-none"
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (_, record) => {
        const amount =
          Number(record.qty) * Number(record.rate) -
          Number(record.discount) +
          Number(record.tax);
        return amount.toFixed(1);
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined className="text-red-500" />}
          onClick={() => onDeleteRow(record.key)}
        />
      ),
    },
  ];

  return (
    <>
      {/* <div className="card min-w-full mb-9">
          <div className="flex flex-col flex-1">
            <div className="rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg">
              <div className="flex flex-wrap justify-between items-center gap-5 p-4">
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-lg font-semibold leading-none text-gray-900">
                    Description
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      className="btn btn-sm btn-primary"
                      title="Generate Item"
                    >
                      <i className="ki-filled ki-plus"></i> Generate Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center bg-gray-100 font-bold border-y border-gray-200 py-3 px-2">
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[80px]">
                    No.
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[90px]">
                    Image
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[520px]">
                    Name & Description
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[130px]">
                    Size / Sq.ft.
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[130px]">
                    Qty
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[130px]">
                    Rate
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 w-[180px]">
                    Total Price
                  </div>
                  <div className="text-sm font-semibold text-gray-900 px-2 text-center flex-auto">
                    Action
                  </div>
                </div>
                <div className="flex items-center border-b border-gray-200 py-3 px-2">
                  <div className="text-sm font-medium text-gray-700 px-2 w-[80px]">
                    1
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[90px]">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={toAbsoluteUrl("/images/account_img.jpg")}
                      alt="profile"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[520px]">
                    <div className="font-medium text-gray-900 mb-1">
                      Item Name if long Split on three
                    </div>
                    <div className="font-normal text-gray-700">
                      Description if long Split on three lines if name still too
                      long
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input
                      className="input"
                      placeholder="Size / Sq.ft."
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Qty" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Rate" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[180px]">
                    <input
                      className="input"
                      placeholder="Total price"
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-auto text-center flex-auto">
                    <Tooltip title="Delete item">
                      <button className="btn btn-sm btn-icon btn-clear btn-danger">
                        <KeenIcon icon="trash" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center border-b border-gray-200 py-3 px-2">
                  <div className="text-sm font-medium text-gray-700 px-2 w-[80px]">
                    2
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[90px]">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={toAbsoluteUrl("/images/account_img.jpg")}
                      alt="profile"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[520px]">
                    <div className="font-medium text-gray-900 mb-1">
                      Item Name if long Split on three
                    </div>
                    <div className="font-normal text-gray-700">
                      Description if long Split on three lines if name still too
                      long
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input
                      className="input"
                      placeholder="Size / Sq.ft."
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Qty" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Rate" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[180px]">
                    <input
                      className="input"
                      placeholder="Total price"
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-auto text-center flex-auto">
                    <Tooltip title="Delete item">
                      <button className="btn btn-sm btn-icon btn-clear btn-danger">
                        <KeenIcon icon="trash" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center border-b border-gray-200 py-3 px-2">
                  <div className="text-sm font-medium text-gray-700 px-2 w-[80px]">
                    3
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[90px]">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={toAbsoluteUrl("/images/account_img.jpg")}
                      alt="profile"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[520px]">
                    <div className="font-medium text-gray-900 mb-1">
                      Item Name if long Split on three
                    </div>
                    <div className="font-normal text-gray-700">
                      Description if long Split on three lines if name still too
                      long
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input
                      className="input"
                      placeholder="Size / Sq.ft."
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Qty" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Rate" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[180px]">
                    <input
                      className="input"
                      placeholder="Total price"
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-auto text-center flex-auto">
                    <Tooltip title="Delete item">
                      <button className="btn btn-sm btn-icon btn-clear btn-danger">
                        <KeenIcon icon="trash" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex items-center border-b border-gray-200 py-3 px-2">
                  <div className="text-sm font-medium text-gray-700 px-2 w-[80px]">
                    4
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[90px]">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={toAbsoluteUrl("/images/account_img.jpg")}
                      alt="profile"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[520px]">
                    <div className="font-medium text-gray-900 mb-1">
                      Item Name if long Split on three
                    </div>
                    <div className="font-normal text-gray-700">
                      Description if long Split on three lines if name still too
                      long
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input
                      className="input"
                      placeholder="Size / Sq.ft."
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Qty" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[130px]">
                    <input className="input" placeholder="Rate" type="text" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-[180px]">
                    <input
                      className="input"
                      placeholder="Total price"
                      type="text"
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 px-2 w-auto text-center flex-auto">
                    <Tooltip title="Delete item">
                      <button className="btn btn-sm btn-icon btn-clear btn-danger">
                        <KeenIcon icon="trash" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className="relative py-4">
                  <div className="absolute left-0 right-0 -bottom-4 text-center">
                    <button
                      className="btn btn-sm btn-success rounded-full"
                      title="Add Item"
                    >
                      <i className="ki-filled ki-plus"></i> Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

      <div className="min-w-full mb-7">
        <h4 class="text-base font-semibold leading-none text-gray-900 mb-2">
          Item Table
        </h4>
        <Table
          dataSource={rows}
          columns={columns}
          pagination={false}
          bordered
          className="[&_.ant-table-thead>tr>th]:bg-white [&_.ant-table-cell]:text-center"
        />
        <div className="flex items-start mt-3">
          <button
            className="btn btn-sm btn-primary"
            onClick={onAddRow}
            title="Add New Row"
          >
            <i class="ki-filled ki-plus"></i> Add New Row
          </button>
        </div>
      </div>
    </>
  );
};

export default ItemTable;
