import { Table, Input, Button, DatePicker } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Extend dayjs to parse custom formats
dayjs.extend(customParseFormat);

const ItemTable = ({ rows, onInputChange, onAddRow, onDeleteRow }) => {
  // Helper function to parse different date formats
  const parseDateValue = (dateValue) => {
    if (!dateValue) return null;
    
    console.log("Parsing date value:", dateValue, "Type:", typeof dateValue);
    
    // Try parsing ISO format (e.g., "2025-10-15T12:10:34.996Z")
    let parsed = dayjs(dateValue);
    if (parsed.isValid()) {
      console.log("✅ Parsed as ISO:", parsed.format("DD-MM-YYYY hh:mm A"));
      return parsed;
    }
    
    // Try parsing DD-MM-YYYY HH:mm format
    parsed = dayjs(dateValue, "DD-MM-YYYY HH:mm", true);
    if (parsed.isValid()) {
      console.log("✅ Parsed as DD-MM-YYYY HH:mm:", parsed.format("DD-MM-YYYY hh:mm A"));
      return parsed;
    }
    
    // Try parsing DD-MM-YYYY format
    parsed = dayjs(dateValue, "DD-MM-YYYY", true);
    if (parsed.isValid()) {
      console.log("✅ Parsed as DD-MM-YYYY:", parsed.format("DD-MM-YYYY hh:mm A"));
      return parsed;
    }
    
    // Try parsing YYYY-MM-DD HH:mm:ss format
    parsed = dayjs(dateValue, "YYYY-MM-DD HH:mm:ss", true);
    if (parsed.isValid()) {
      console.log("✅ Parsed as YYYY-MM-DD HH:mm:ss:", parsed.format("DD-MM-YYYY hh:mm A"));
      return parsed;
    }
    
    // Try parsing YYYY-MM-DD format
    parsed = dayjs(dateValue, "YYYY-MM-DD", true);
    if (parsed.isValid()) {
      console.log("✅ Parsed as YYYY-MM-DD:", parsed.format("DD-MM-YYYY hh:mm A"));
      return parsed;
    }
    
    console.log("❌ Could not parse date:", dateValue);
    return null;
  };

  const columns = [
    {
      title: "Function",
      dataIndex: "name",
      render: (text, record, index) => (
        <Input
          placeholder="Name"
          value={record.name}
          disabled={!record.isCustom} // ❌ Disable for API rows
          onChange={(e) => onInputChange(index, "name", e.target.value)}
          className="border-none shadow-none"
        />
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record, index) => {
        const dateValue = parseDateValue(record.date);
        
        return (
          <DatePicker
            showTime={{
              use12Hours: true,
              format: "hh:mm A"
            }}
            format="DD-MM-YYYY hh:mm A"
            disabled={!record.isCustom} // ❌ Disable for API rows
            value={dateValue}
            onChange={(date) =>
              onInputChange(index, "date", date ? date.toISOString() : "")
            }
            className="w-full"
          />
        );
      },
    },
    {
      title: "Person",
      dataIndex: "person",
      render: (text, record, index) => (
        <Input
          type="number"
          value={record.person}
          disabled // ❌ Always disabled
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
          disabled={false} // ✅ Editable for all rows
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
          disabled={false} // ✅ Editable for all rows
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
          (Number(record.person) + Number(record.extra)) * Number(record.rate);
        return amount.toFixed(1);
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.isCustom ? ( // ✅ Only show delete for custom rows
          <Button
            type="text"
            icon={<DeleteOutlined className="text-red-500" />}
            onClick={() => onDeleteRow(record.key)}
          />
        ) : null,
    },
  ];

  return (
    <div className="min-w-full mb-7">
      <h4 className="text-base font-semibold leading-none text-gray-900 mb-2">
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
          <i className="ki-filled ki-plus"></i> Add New Row
        </button>
      </div>
    </div>
  );
};

export default ItemTable;