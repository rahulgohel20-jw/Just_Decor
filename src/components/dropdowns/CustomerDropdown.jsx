import { Select } from "antd";

const CustomerDropdown = ({ value, onChange, options = [], ...rest }) => {
  const handleChange = (val) => {
    // send in same format as your other inputs
    onChange({ target: { name: "customer_name", value: val } });
  };

  return (
    <Select
      showSearch
      allowClear
      value={value || undefined}
      className="w-full border-none shadow-none focus:outline-none"
      onChange={handleChange}
      placeholder="Please select"
      style={{ width: "100%" }}
      options={options}
      {...rest}
    />
  );
};

export default CustomerDropdown;
