import { useState, useEffect } from "react";
import { Select, Tooltip } from "antd";
import { InputLabel } from "@mui/material";
import useStyles from "./SelectDropdownStyle";

const SelectDropdown = ({
  apiUrl = null,
  staticOptions = [],
  label,
  placeholder = "Select an option",
  ...rest
}) => {
  const classes = useStyles();
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
    <div className={`${classes.formGrp} formGrpCommon`}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        {...rest}
        className={`${classes.select}`}
        onChange={handleChange}
        options={options}
        // placeholder={placeholder}
        placeholder={"Please select"}
      />
    </div>
  );
};

export { SelectDropdown };
