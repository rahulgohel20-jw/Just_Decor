import { useState } from "react";

const PhoneNumber = () => {
  const countries = [
    {
      name: "United States",
      code: "US",
      dialCode: "+1",
      flag: "https://flagcdn.com/w40/us.png",
    },
    {
      name: "India",
      code: "IN",
      dialCode: "+91",
      flag: "https://flagcdn.com/w40/in.png",
    },
    {
      name: "United Kingdom",
      code: "GB",
      dialCode: "+44",
      flag: "https://flagcdn.com/w40/gb.png",
    },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [phone, setPhone] = useState("");

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
  };
  return (
    <div className="relative max-w-md w-full">
      <label className="form-label">Phone Number</label>
      <div className="flex border border-gray-300 rounded-md overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition">
        {/* Country Selector Button */}
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center px-3 bg-gray-50 hover:bg-gray-100 border-r border-gray-300 text-sm"
        >
          <img
            src={selectedCountry.flag}
            alt="flag"
            className="w-5 h-5 mr-1 rounded"
          />
          {selectedCountry.dialCode}
          <svg
            className="w-4 h-4 ml-1 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
            />
          </svg>
        </button>
        {/* Phone Number Input */}
        <input
          type="tel"
          className="flex-1 px-3 py-2 input text-sm rounded-none border-none"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute z-20 bg-white border border-gray-200 rounded-md shadow-lg mt-2 w-48 max-h-60 overflow-y-auto">
          {countries.map((country, idx) => (
            <div
              key={idx}
              className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSelect(country)}
            >
              <img
                src={country.flag}
                className="w-5 h-5 mr-2 rounded"
                alt={country.name}
              />
              <span className="flex-1">{country.name}</span>
              <span className="text-gray-500">{country.dialCode}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhoneNumber;
