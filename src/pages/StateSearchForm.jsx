import { useState } from "react";
import { AutoComplete, Input, Spin } from "antd";
import axios from "axios";

export default function CountryStateCitySearch() {
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const [loadingCountry, setLoadingCountry] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  // 🔎 Country Search API
  const handleCountrySearch = async (value) => {
    if (!value) {
      setCountryOptions([]);
      return;
    }
    setLoadingCountry(true);
    try {
      const res = await axios.get(
        `http://103.1.101.244:9091/v1/api/countrymaster/getall?countryName=${value}`
      );
      const countries = res.data?.data?.["Country Details"] || [];
      setCountryOptions(
        countries.map((c) => ({
          value: c.name,
          label: `${c.name} (+${c.code})`,
          id: c.id,
        }))
      );
    } catch (err) {
      console.error("Error fetching countries:", err);
    } finally {
      setLoadingCountry(false);
    }
  };

  // ✅ When country selected
  const handleCountrySelect = (value, option) => {
    setSelectedCountry(option);
    setStateOptions([]);
    setCityOptions([]);
    setSelectedState(null);
  };

  // 🔎 State Search API
  const handleStateSearch = async (value) => {
    if (!selectedCountry?.id) return;
    setLoadingState(true);
    try {
      const res = await axios.get(
        `http://103.1.101.244:9091/v1/api/statemaster/getbycountryid?countryId=${selectedCountry.id}&stateName=${value || ""}`
      );
      const states = res.data?.data?.["state Details"] || [];
      setStateOptions(
        states.map((s) => ({
          value: s.name,
          label: s.name,
          id: s.id,
        }))
      );
    } catch (err) {
      console.error("Error fetching states:", err);
    } finally {
      setLoadingState(false);
    }
  };

  // ✅ When state selected
  const handleStateSelect = (value, option) => {
    setSelectedState(option);
    setCityOptions([]);
  };

  // 🔎 City Search API
  const handleCitySearch = async (value) => {
    if (!selectedState?.id) return;
    setLoadingCity(true);
    try {
      const res = await axios.get(
        `http://103.1.101.244:9091/v1/api/citymaster/getbystateid?stateId=${selectedState.id}&cityName=${value || ""}`
      );
      const cities = res.data?.data?.["City Details"] || [];
      setCityOptions(
        cities.map((city) => ({
          value: city.name,
          label: city.name,
          id: city.id,
        }))
      );
    } catch (err) {
      console.error("Error fetching cities:", err);
    } finally {
      setLoadingCity(false);
    }
  };

  // ✅ When city selected
  const handleCitySelect = (value, option) => {
    console.log("Selected City:", option);
    // You can fetch full city details by ID if needed:
    // axios.get(`http://103.1.101.244:9091/v1/api/citymaster/getbyid?id=${option.id}`)
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px" }}>
      <h3>🌍 Country → State → City</h3>

      {/* Country */}
      <AutoComplete
        style={{ width: "100%", marginBottom: "15px" }}
        options={countryOptions}
        onSearch={handleCountrySearch}
        onSelect={handleCountrySelect}
        notFoundContent={loadingCountry ? <Spin size="small" /> : "No country"}
      >
        <Input.Search size="large" placeholder="Search country..." enterButton />
      </AutoComplete>

      {/* State */}
      <AutoComplete
        style={{ width: "100%", marginBottom: "15px" }}
        options={stateOptions}
        onSearch={handleStateSearch}
        onSelect={handleStateSelect}
        disabled={!selectedCountry}
        notFoundContent={loadingState ? <Spin size="small" /> : "No state"}
      >
        <Input.Search
          size="large"
          placeholder={
            selectedCountry ? "Search state..." : "Select country first"
          }
          enterButton
        />
      </AutoComplete>

      {/* City */}
      <AutoComplete
        style={{ width: "100%" }}
        options={cityOptions}
        onSearch={handleCitySearch}
        onSelect={handleCitySelect}
        disabled={!selectedState}
        notFoundContent={loadingCity ? <Spin size="small" /> : "No city"}
      >
        <Input.Search
          size="large"
          placeholder={selectedState ? "Search city..." : "Select state first"}
          enterButton
        />
      </AutoComplete>
    </div>
  );
}
