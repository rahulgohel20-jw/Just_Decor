import { Select } from "antd";

const RawMaterialDropdown = ({ value, onChange, options = [] }) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      allowClear
      showSearch
      placeholder="Please select type"
      filterOption={(input, option) =>
        option?.label?.toLowerCase().includes(input.toLowerCase())
      }
      style={{
        width: "100%",
        height: 40, // same as text input
        padding: "0 8px",
        borderRadius: 8,
        border: "1px solid #d1d5db",
        fontSize: 14,
        display: "flex",
        alignItems: "center",
      }}
      dropdownStyle={{
        borderRadius: 8,
      }}
    />
  );
};

export default RawMaterialDropdown;
