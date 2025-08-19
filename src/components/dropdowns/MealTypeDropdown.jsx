import { useState } from "react";
import { SelectDropdown } from "@/components/form-components/SelectDropdown";

const MealTypeDropdown = ({ value, onChange, className, ...rest }) => {
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
        { label: "User A", value: "UserA" },
        { label: "User B", value: "UserB" },
        { label: "User C", value: "UserC" },
        { label: "User D", value: "UserD" },
        { label: "User E", value: "UserE" },
        { label: "User F", value: "UserF" },
        { label: "User G", value: "UserG" },
        { label: "User H", value: "UserH" },
        { label: "User I", value: "UserI" },
        { label: "User J", value: "UserJ" },
        { label: "User K", value: "UserK" },
        { label: "User L", value: "UserL" },
        { label: "User M", value: "UserM" },
        { label: "User N", value: "UserN" },
        { label: "User O", value: "UserO" },
      ]}
      placeholder={"Please select"}
      {...rest}
    />
  );
};

export default MealTypeDropdown;
