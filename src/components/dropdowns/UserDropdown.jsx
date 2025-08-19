import { Select } from "antd";

const UserDropdown = ({ value, onChange, ...rest }) => {
  const handleChange = (val) => {
    // send in same format as your other inputs
    onChange({ target: { name: "event_type", value: val } });
  };

  return (
    <Select
      value={value || undefined}
      className="w-full border-none shadow-none focus:outline-none"
      onChange={handleChange}
      placeholder="Please select"
      style={{ width: "100%" }}
      options={[
        { label: "Baby Shower", value: "baby_shower" },
        { label: "Lunch", value: "lunch" },
        { label: "Dinner", value: "dinner" },
      ]}
      {...rest}
    />
  );
};

export default UserDropdown;
