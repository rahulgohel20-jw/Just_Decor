import { Input, Select, Button, Form,  message, Spin} from "antd";
import { toAbsoluteUrl } from "@/utils";
import { useState, useEffect, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import ReactCountryFlag from "react-country-flag";
const { TextArea } = Input;
const { Option } = Select;
import { fetchCountries, fetchStatesByCountry, fetchCitiesByState } from "@/services/apiServices";


export default function ProfileForm({ value, onChange, ...rest }) {
  const [selectedCompanies, setSelectedCompanies] = useState(value || []);
  const [form] = Form.useForm();

  // Country
  const [countryOptions, setCountryOptions] = useState([]);
  const [countryLoading, setCountryLoading] = useState(false);

  // State
  const [stateOptions, setStateOptions] = useState([]);
  const [stateLoading, setStateLoading] = useState(false);

  // City
  const [cityOptions, setCityOptions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);

// ---------------- COUNTRY ----------------
const loadCountries = useCallback(async (search = "") => {
  setCountryLoading(true);
  try {
    const res = await fetchCountries(search);
       console.log("Country API response:", res);

const countries = res?.data?.data?.["Country Details"] || [];
        console.log("Parsed countries:", countries);

    setCountryOptions(
      countries.map((c) => ({
        id: c.id,
        value: c.id,
        code: c.code,
        name: c.name,
      }))
    );
  } catch (err) {
    message.error("Failed to load countries");
  } finally {
    setCountryLoading(false);
  }
}, []);

// ---------------- STATE ----------------
const loadStates = useCallback(async (countryId, search = "") => {
  if (!countryId) return;
  setStateLoading(true);
  try {
    const res = await fetchStatesByCountry(countryId, search);
    const states = res?.data?.data?.["state Details"] || [];
    setStateOptions(
      states.map((s) => ({
        id: s.id,
        value: s.id,
        name: s.name,
      }))
    );
  } catch (err) {
    message.error("Failed to load states");
  } finally {
    setStateLoading(false);
  }
}, []);

// ---------------- CITY ----------------
const loadCities = useCallback(async (stateId, search = "") => {
  if (!stateId) return;
  setCityLoading(true);
  try {
    const res = await fetchCitiesByState(stateId, search);
     const cities = res?.data?.data?.["City Details"] || [];
    setCityOptions(
      cities.map((c) => ({
        id: c.id,
        value: c.id,
        name: c.name,
      }))
    );
  } catch {
    message.error("Failed to load cities");
  } finally {
    setCityLoading(false);
  }
}, []);

// ---------------- DEBOUNCED SEARCH ----------------
const debouncedCountrySearch = useMemo(
  () => debounce((val) => loadCountries(val), 500),
  [loadCountries]
);

const debouncedStateSearch = useMemo(
  () => debounce((val) => loadStates(form.getFieldValue("country"), val), 500),
  [loadStates, form]
);

const debouncedCitySearch = useMemo(
  () => debounce((val) => loadCities(form.getFieldValue("state"), val), 500),
  [loadCities, form]
);

  // ---------------- HANDLERS ----------------
  const handleCountrySelect = (countryId) => {
    form.setFieldsValue({ state: undefined, city: undefined });
    setStateOptions([]);
    setCityOptions([]);
    loadStates(countryId);
  };

  const handleStateSelect = (stateId) => {
    form.setFieldsValue({ city: undefined });
    setCityOptions([]);
    loadCities(stateId);
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  const onFinish = (values) => {
    console.log("Form submitted:", values);
    message.success("Profile saved successfully!");
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 pb-0 flex flex-row items-center gap-4">
        <img
          className="w-16 h-16 rounded-full border-4 border-white object-cover"
          src={toAbsoluteUrl("/images/user_img.jpg")}
          alt="profile"
        />
        <div className="flex flex-col">
          <span className="text-black font-normal">Swapnil Ghodeswar</span>
          <span className="text-sm text-grey">shreeswapnil@gmail.com</span>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Email ID"
              name="email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true }]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>
          </div>

          {/* Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[{ required: true }]}
            >
              <Input placeholder="Company Name" />
            </Form.Item>
            <Form.Item
              label="Company Email"
              name="companyEmail"
              rules={[{ required: true, type: "email" }]}
            >
              <Input placeholder="Company Email" />
            </Form.Item>
          </div>

          {/* Address & Office */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Company Address"
              name="companyAddress"
              rules={[{ required: true }]}
            >
              <Input placeholder="Company Address" />
            </Form.Item>
            <Form.Item
              label="Office Number"
              name="officeNumber"
              rules={[{ required: true }]}
            >
              <Input placeholder="Office Number" />
            </Form.Item>
          </div>

          {/* Country - State - City */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Country */}
            <Form.Item label="Country" name="country" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Select Country"
                allowClear
                loading={countryLoading}
                onSearch={debouncedCountrySearch}
                onFocus={() => loadCountries()}
                filterOption={false}
                notFoundContent={countryLoading ? <Spin size="small" /> : "No country"}
                onSelect={handleCountrySelect}
              >
                {countryOptions.map((c) => (
                  <Option key={c.id} value={c.value}>
                    <div className="flex items-center gap-2">
                      <ReactCountryFlag countryCode={c.code} svg style={{ width: 20, height: 15 }} />
                      <span>{c.name}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* State */}
            <Form.Item label="State" name="state" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Select State"
                allowClear
                disabled={!form.getFieldValue("country")}
                loading={stateLoading}
                onSearch={debouncedStateSearch}
                filterOption={false}
                notFoundContent={stateLoading ? <Spin size="small" /> : "No state"}
                onSelect={handleStateSelect}
              >
                {stateOptions.map((s) => (
                  <Option key={s.id} value={s.value}>
                    {s.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* City */}
            <Form.Item label="City" name="city" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Select City"
                allowClear
                disabled={!form.getFieldValue("state")}
                loading={cityLoading}
                onSearch={debouncedCitySearch}
                filterOption={false}
                notFoundContent={cityLoading ? <Spin size="small" /> : "No city"}
              >
                {cityOptions.map((c) => (
                  <Option key={c.id} value={c.value}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Extra */}
          <Form.Item label="Permitted ID" name="permittedId" rules={[{ required: true }]}>
            <Input placeholder="Permitted ID" />
          </Form.Item>

          <Form.Item label="Bio" name="bio">
            <TextArea rows={4} placeholder="Write your bio..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
