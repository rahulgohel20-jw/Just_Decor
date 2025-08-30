import { Select } from "antd";

const ManagerDropdown = ({ value, onChange, options, ...rest }) => {
  const handleChange = (val) => {
    onChange({ target: { name: "managerId", value: val } });
  };

  return (
    <Select
      value={value || undefined}
      onChange={handleChange}
      placeholder="Please select"
      options={options}
      {...rest}
      className="w-full border-none shadow-none focus:outline-none"
      style={{
        border: "none",
        boxShadow: "none",
      }}
    />
  );
};

export default ManagerDropdown;
