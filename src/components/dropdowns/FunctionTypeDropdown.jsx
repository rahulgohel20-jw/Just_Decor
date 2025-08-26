import { useState, useEffect } from "react";
import { Select } from "antd"; // using antd directly (if your SelectDropdown doesn’t have search)
import { GetAllFunctionsByUserId } from "@/services/apiServices";

const FunctionTypeDropdown = ({ value, onChange, ...rest }) => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(value || "");

  useEffect(() => {
    GetAllFunctionsByUserId()
      .then((res) => {
        const data = res?.data?.data?.["Function Details"] || [];

        const mappedOptions = data.map((item) => ({
          label: item.nameEnglish,
          value: item.id,
        }));

        setOptions(mappedOptions);
      })
      .catch((err) => {
        console.error("Error fetching functions:", err);
      });
  }, []);

 const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onChange(event);
  };

  return (
    <Select
      showSearch
      allowClear
      value={selectedValue}
      onChange={handleChange}
      options={options}
      placeholder="Please select function"
      filterOption={(input, option) =>
        option.label.toLowerCase().includes(input.toLowerCase())
      }
      style={{ width: "100%" }}
      {...rest}
    />
  );
};

export default FunctionTypeDropdown;
