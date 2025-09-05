import { SelectDropdown } from "@/components/form-components/SelectDropdown";
const EventStatusDropdown = ({ value, onChange, ...rest }) => {
  const handleChange = (event) => {
    onChange({
      target: {
        name: "status",
        value: event.target.value,
      },
    });
  };

  return (
    <SelectDropdown
      value={value}
      onChange={handleChange}
      defaultValue={"0"}
      staticOptions={[
        { label: "Inquriy", value: "0" },
        { label: "Confirm", value: "1" },
        { label: "Cancel", value: "2" },
      ]}
      placeholder={"Please select"}
      {...rest}
    />
  );
};

export default EventStatusDropdown;
