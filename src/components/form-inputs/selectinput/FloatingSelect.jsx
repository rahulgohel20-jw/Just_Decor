import React from "react";
import clsx from "clsx";

const FloatingSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  icon,
  error,
}) => {
  return (
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={clsx(
          "peer w-full border border-gray-300 rounded-md bg-transparent appearance-none p-3 pt-5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ",
          { "border-red-500": error }
        )}
      >
        <option value="" disabled hidden></option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Floating label */}
      <label
        htmlFor={name}
        className="absolute text-gray-500 text-sm duration-200 transform -translate-y-3 scale-75 top-1 left-3 z-10 origin-[0] bg-white px-1 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-3"
      >
        {label}
      </label>

      {/* Optional icon */}
      {icon && (
        <i
          className={clsx(
            "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-blue-100",
            icon
          )}
        />
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default FloatingSelect;
