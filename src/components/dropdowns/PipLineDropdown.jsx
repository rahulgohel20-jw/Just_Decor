import { useState } from "react";
import { SelectDropdown } from "@/components/form-components/SelectDropdown";

const PipLineDropdown = () => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const handleChange = ({ target: { value } }) => {
    setSelectedCompanies(value);
  };

  return (
    <SelectDropdown
      value={selectedCompanies}
      onChange={handleChange}
      staticOptions={[
        { label: "Company A", value: "companyA" },
        { label: "Company B", value: "companyB" },
        { label: "Company C", value: "companyC" },
      ]}
      mode="multiple"
    />
  );
};

export default PipLineDropdown;
