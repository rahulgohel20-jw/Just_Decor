import { Select } from "antd";

const RawMaterialDropdown = ({
  value,
  onChange,
  className,
  options,
  ...rest
}) => {
  return (
    <Select
      showSearch
      allowClear
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Please select type"
      filterOption={(input, option) =>
        option?.label?.toLowerCase().includes(input.toLowerCase())
      }
      style={{ width: "100%" }}
      className={className}
      {...rest}
    />
  );
};

export default RawMaterialDropdown;
