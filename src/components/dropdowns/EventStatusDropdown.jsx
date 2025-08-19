import { useState } from "react";
import { SelectDropdown } from "@/components/form-components/SelectDropdown";
const EventStatusDropdown = ({ value, onChange, ...rest }) => {
  const [selectedCompanies, setSelectedCompanies] = useState(value || []);
  const handleChange = (event) => {
    setSelectedCompanies(event.target.value);
    onChange(event);
  };

  return (
    <SelectDropdown
      value={selectedCompanies}
      onChange={handleChange}
      staticOptions={[
        { label: "Pending", value: "pending" },
        { label: "Confirm", value: "confirm" },
        { label: "Inquriy", value: "inquriy" },
      ]}
      placeholder={"Please select"}
      {...rest}
    />
  );
};

export default EventStatusDropdown;
