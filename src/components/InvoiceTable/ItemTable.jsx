import { Table, Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const ItemTable = ({ rows, onInputChange, onAddRow, onDeleteRow }) => {
  const columns = [
    {
      title: "Function ",
      dataIndex: "name",
      render: (text, record, index) => (
        <Input
          placeholder="Name"
          value={record.name}
          onChange={(e) => onInputChange(index, "name", e.target.value)}
          className="border-none shadow-none"
        />
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.date}
          onChange={(e) => onInputChange(index, "date", e.target.value)}
          className="text-center border-none shadow-none"
        />
      ),
    },
    {
      title: "Person",
      dataIndex: "person",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.person}
          onChange={(e) => onInputChange(index, "person", e.target.value)}
          className="text-center border-none shadow-none"
        />
      ),
    },
    {
      title: "Extra",
      dataIndex: "extra",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.extra}
          onChange={(e) => onInputChange(index, "extra", e.target.value)}
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
      <div className="min-w-full mb-7">
        <h4 class="text-base font-semibold leading-none text-gray-900 mb-2">
          Function Table
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
