// src/components/profile/ProfileForm.jsx
import { Input, Select, Button, Form, message, Spin } from "antd";
import { useState, useEffect, useCallback } from "react";
import ReactCountryFlag from "react-country-flag";
import { isEqual } from "lodash";
import {
  fetchCountries,
  fetchStatesByCountry,
  fetchCitiesByState,
  getUserById,
  updateusermaster,
} from "@/services/apiServices";

const { TextArea } = Input;
const { Option } = Select;

const LOCAL_STORAGE_KEY = "userProfileForm";

const getUserIdFromLocalStorage = () => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return userData?.id || null;
  } catch {
    return null;
  }
};

const getPlanAndRoleFromLocalStorage = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem("userData"));
    return {
      planId: parsed?.plan?.id || 0,
      roleId: parsed?.userBasicDetails?.role?.id || 0,
    };
  } catch {
    return { planId: 0, roleId: 0 };
  }
};

const ProfileForm = () => {
  const [form] = Form.useForm();
  const userMasterId = getUserIdFromLocalStorage();

  const [initialValues, setInitialValues] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState({
    country: false,
    state: false,
    city: false,
  });

  const loadCountries = useCallback(async () => {
    setLoading((p) => ({ ...p, country: true }));
    try {
      const res = await fetchCountries();
      const list = res?.data?.data?.["Country Details"] || [];
      setCountries(list.map(({ id, name, code }) => ({ id, name, code })));
    } catch {
      message.error("Failed to load countries");
    } finally {
      setLoading((p) => ({ ...p, country: false }));
    }
  }, []);

  const loadStates = useCallback(async (countryId) => {
    if (!countryId) return;
    setLoading((p) => ({ ...p, state: true }));
    try {
      const res = await fetchStatesByCountry(countryId);
      const list = res?.data?.data?.["state Details"] || [];
      setStates(list.map(({ id, name }) => ({ id, name })));
    } catch {
      message.error("Failed to load states");
    } finally {
      setLoading((p) => ({ ...p, state: false }));
    }
  }, []);

  const loadCities = useCallback(async (stateId) => {
    if (!stateId) return;
    setLoading((p) => ({ ...p, city: true }));
    try {
      const res = await fetchCitiesByState(stateId);
      const list = res?.data?.data?.["City Details"] || [];
      setCities(list.map(({ id, name }) => ({ id, name })));
    } catch {
      message.error("Failed to load cities");
    } finally {
      setLoading((p) => ({ ...p, city: false }));
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setInitialValues(parsed);
        form.setFieldsValue(parsed);
      }
      try {
        const res = await getUserById(userMasterId);
        const user = res?.data?.data?.["User Details"]?.[0];
        if (user) {
          const values = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.contactNo,
            companyName: user.userBasicDetails?.companyName,
            companyEmail: user.userBasicDetails?.companyEmail,
            companyAddress: user.userBasicDetails?.address,
            officePhone: user.userBasicDetails?.officeNo,
            country: {
              value: user.userBasicDetails?.country?.id,
              label: user.userBasicDetails?.country?.name,
              code: user.userBasicDetails?.country?.code,
            },
            state: {
              value: user.userBasicDetails?.state?.id,
              label: user.userBasicDetails?.state?.name,
            },
            city: {
              value: user.userBasicDetails?.city?.id,
              label: user.userBasicDetails?.city?.name,
            },
            bio: user.userBasicDetails?.bio,
          };
          setInitialValues(values);
          form.setFieldsValue(values);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(values));
          if (values.country?.value) await loadStates(values.country.value);
          if (values.state?.value) await loadCities(values.state.value);
        }
      } catch {
        message.error("Failed to fetch user details");
      }
    };
    load();
  }, [userMasterId, form, loadStates, loadCities]);

  const handleValuesChange = (_, allValues) => {
    if (!initialValues) return;
    setIsChanged(!isEqual(initialValues, allValues));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allValues));
  };

  const onFinish = async (values) => {
    const { planId, roleId } = getPlanAndRoleFromLocalStorage();
    if (!planId || !roleId) return message.error("Missing Plan or Role ID.");
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      contactNo: values.phone,
      companyName: values.companyName,
      companyEmail: values.companyEmail,
      address: values.companyAddress,
      officeNo: values.officePhone,
      countryId: values.country?.value || 101,
      countryCode: values.country?.code?.startsWith("+")
        ? values.country.code
        : `+${values.country?.code || "91"}`,
      stateId: values.state?.value || 0,
      cityId: values.city?.value || 0,
      planId,
      roleId,
      remarks: values.bio || "",
      isAttendanceLeaveAccess: true,
      isTaskAccess: true,
      clientId: 0,
      reportingManagerId: 0,
    };
    try {
      await updateusermaster(userMasterId, payload);
      message.success("Profile updated successfully");
      setInitialValues(values);
      setIsChanged(false);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(values));
    } catch (err) {
      const response = err?.response?.data;
      if (response?.msg) message.error(response.msg);
      else if (response?.errors)
        Object.values(response.errors)
          .flat()
          .forEach((m) => message.error(m));
      else message.error("Update failed.");
    }
  };

  const renderLocationSelect = (
    label,
    name,
    data,
    loadingKey,
    onFocus,
    onSelect,
    disabled = false
  ) => (
    <Form.Item label={label} name={name} className="mb-4">
      <Select
        showSearch
        labelInValue
        placeholder={`Select ${label}`}
        loading={loading[loadingKey]}
        disabled={disabled}
        filterOption={false}
        onFocus={onFocus}
        onSelect={onSelect}
        size="large"
        className="rounded-xl custom-select"
        dropdownStyle={{ borderRadius: 12 }}
        notFoundContent={
          loading[loadingKey] ? <Spin size="small" /> : `No ${label}`
        }
      >
        {data.map((item) => (
          <Option
            key={item.id}
            value={item.id}
            label={item.name}
            code={item.code}
          >
            {name === "country" ? (
              <div className="flex items-center gap-2">
                <ReactCountryFlag
                  countryCode={item.code}
                  svg
                  style={{ width: 20, height: 15 }}
                />
                {item.name}
              </div>
            ) : (
              item.name
            )}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      onValuesChange={handleValuesChange}
      className="profile-form"
    >
      {/* two-column fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label="Full Name"
          name="firstName"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            placeholder="Enter your full name.."
            className="rounded-xl h-11 bg-[#F5F8FB] border border-[#E6ECF1]"
          />
        </Form.Item>
        <Form.Item
          label="Email ID"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input
            size="large"
            placeholder="Enter your full name.."
            className="rounded-xl h-11 bg-[#F5F8FB] border border-[#E6ECF1]"
          />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            placeholder="Enter your full name.."
            className="rounded-xl h-11 bg-[#F5F8FB] border border-[#E6ECF1]"
          />
        </Form.Item>
        <Form.Item
          label="Company Name"
          name="companyName"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            placeholder="Enter your full name.."
            className="rounded-xl h-11 bg-[#F5F8FB] border border-[#E6ECF1]"
          />
        </Form.Item>

        <Form.Item
          label="Company Email ID"
          name="companyEmail"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            placeholder="Enter your full name.."
            className="rounded-xl h-11 bg-[#F5F8FB] border border-[#E6ECF1]"
          />
        </Form.Item>
        <Form.Item
          label="Office Number"
          name="officePhone"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            placeholder="Enter your full name.."
            className="rounded-xl h-11 bg-[#F5F8FB] border border-[#E6ECF1]"
          />
        </Form.Item>
      </div>

      {/* location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderLocationSelect(
          "Country (Optional)",
          "country",
          countries,
          "country",
          loadCountries,
          (val, opt) =>
            form.setFieldsValue({
              country: { value: opt.value, label: opt.label, code: opt.code },
            }) || loadStates(opt.value)
        )}
        {renderLocationSelect(
          "State (Optional)",
          "state",
          states,
          "state",
          () => loadStates(form.getFieldValue("country")?.value),
          (val) => loadCities(val),
          !form.getFieldValue("country")
        )}
        {renderLocationSelect(
          "City (Optional)",
          "city",
          cities,
          "city",
          () => loadCities(form.getFieldValue("state")?.value),
          () => {},
          !form.getFieldValue("state")
        )}
      </div>

      <Form.Item label="Bio (optional)" name="bio">
        <TextArea
          rows={4}
          className="rounded-xl bg-[#F5F8FB] border border-[#E6ECF1]"
          placeholder=" "
        />
      </Form.Item>

      <div className="flex justify-end">
        <Button
          type="primary"
          htmlType="submit"
          disabled={!isChanged}
          className="rounded-md h-10 px-8"
        >
          Save
        </Button>
      </div>
    </Form>
  );
};

export default ProfileForm;
