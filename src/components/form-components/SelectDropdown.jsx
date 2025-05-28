import { useState, useEffect } from "react";
import { Select, Tooltip } from "antd";
import { InputLabel } from "@mui/material";

const SelectDropdown = ({
  apiUrl = null,
  staticOptions = [],
  label,
  ...rest
}) => {
  const [options, setOptions] = useState(staticOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (value) => {
    console.log(value);

    rest.onChange &&
      rest.onChange({ target: { name: rest.name, value: value } });
  };

  useEffect(() => {
    if (apiUrl) {
      setIsLoading(true);
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch options");
          return response.json();
        })
        .then((data) => {
          setOptions(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [apiUrl]);

  useEffect(() => {
    if (staticOptions.length > 0) {
      setOptions(staticOptions);
    }
  }, [staticOptions]);

  return (
    <div>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        {...rest}
        style={{ width: "100%" }}
        onChange={handleChange}
        options={options}
      />
    </div>
  );
};

export { SelectDropdown };
