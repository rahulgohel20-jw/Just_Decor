import { SelectDropdown } from "@/components/form-components/SelectDropdown";

const STATUS_OPTIONS = [
  { label: "Inquiry", value: "0" },
  { label: "Confirm", value: "1" },
  { label: "Cancel", value: "2" },
];

const EventStatusDropdown = ({ value, onChange, ...rest }) => {
  // If SelectDropdown calls onChange with (event) like a native select:
  const handleChange = (eOrVal) => {
    // support both shapes: native event or direct value
    const val = eOrVal?.target ? eOrVal.target.value : eOrVal;
    onChange({
      target: {
        name: "status",
        value: String(val),
      },
    });
  };

  return (
    <SelectDropdown
      value={value} // "0" | "1" | "2"
      onChange={handleChange}
      staticOptions={STATUS_OPTIONS}
      placeholder="Please select"
      {...rest}
    />
  );
};

export default EventStatusDropdown;
