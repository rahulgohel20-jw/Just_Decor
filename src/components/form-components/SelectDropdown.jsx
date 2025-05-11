import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  CircularProgress,
  Chip,
  Box,
} from "@mui/material";
import { KeenIcon } from "@/components";

const SelectDropdown = ({
  label,
  value,
  onChange,
  apiUrl = null,
  options: staticOptions = [],
  multiple = false,
  optionLabelKey = "label",
  optionValueKey = "value",
  placeholder = "Select...",
}) => {
  const [options, setOptions] = useState(staticOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleRemove = (valueToRemove) => {
    const newValue = value.filter((val) => val !== valueToRemove);
    onChange({ target: { value: newValue } });
  };

  const renderSelectedValues = (selected) => {
    if (isLoading) return "Loading...";
    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      return placeholder;
    }

    if (multiple) {
      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {selected.map((val) => {
            const match = options.find((opt) => opt[optionValueKey] === val);
            return (
              match && (
                <Chip
                  key={val}
                  label={match[optionLabelKey]}
                  onDelete={() => handleRemove(val)}
                  deleteIcon={<KeenIcon icon="close" />}
                  size="small"
                  className="bg-gray-800 text-white rounded-lg px-2 py-1"
                />
              )
            );
          })}
        </Box>
      );
    } else {
      const match = options.find((opt) => opt[optionValueKey] === selected);
      return match ? match[optionLabelKey] : placeholder;
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple={multiple}
        value={value}
        onChange={onChange}
        label={label}
        renderValue={renderSelectedValues}
        className="select text-white border border-gray-700 rounded-lg p-2 pr-10" // Tailwind styling
        MenuProps={{
          PaperProps: {
            className: "bg-gray-800", // Custom background for the menu
          },
        }}
        IconComponent={() => (
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        )}
      >
        {isLoading ? (
          <MenuItem disabled>
            <CircularProgress size={20} />
          </MenuItem>
        ) : error ? (
          <MenuItem disabled>{error.message}</MenuItem>
        ) : (
          options.map((opt) => (
            <MenuItem key={opt[optionValueKey]} value={opt[optionValueKey]}>
              {multiple && (
                <Checkbox checked={value.includes(opt[optionValueKey])} />
              )}
              <ListItemText primary={opt[optionLabelKey]} />
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export { SelectDropdown };
