import { useState } from "react";
import { SelectDropdown } from "@/components/form-components/SelectDropdown";

const SourceDropdown = () => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const handleChange = (event) => {
    setSelectedCompanies(event.target.value);
  };

  return (
    <SelectDropdown
      value={selectedCompanies}
      onChange={handleChange}
      options={[
        { label: "Company A", value: "companyA" },
        { label: "Company B", value: "companyB" },
        { label: "Company C", value: "companyC" },
      ]}
      multiple={true}
    />
  );
};

export default SourceDropdown;
