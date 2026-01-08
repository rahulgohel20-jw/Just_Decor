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
import { FormattedMessage, useIntl } from "react-intl";
import { useUser } from "../../context/UserContext";

const { TextArea } = Input;
const { Option } = Select;

const getUserIdFromLocalStorage = () => {
  try {
    const userId = localStorage.getItem("userId");
    return userId || null;
  } catch {
    return null;
  }
};

const ProfileForm = ({ isEditing, onSaveSuccess }) => {
  const intl = useIntl();
  const { refreshUser } = useUser();

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
  const [refreshKey, setRefreshKey] = useState(0);

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

  // Fetch user data function (extracted for reusability)
  const fetchUserData = useCallback(async () => {
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
          address: user.userBasicDetails?.address,
          role: user.userBasicDetails?.role?.id,
          plan: user?.plan?.id || null,
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

        if (values.country?.value) await loadStates(values.country.value);
        if (values.state?.value) await loadCities(values.state.value);

        return values;
      }
    } catch {
      message.error("Failed to fetch user details");
    }
  }, [userMasterId, form, loadStates, loadCities]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData, refreshKey]);

  const handleValuesChange = (_, allValues) => {
    if (!initialValues) return;
    setIsChanged(!isEqual(initialValues, allValues));
  };

  const onFinish = async (values) => {
    const planId = initialValues.plan;
    const roleId = initialValues.role;

    if (!planId && !roleId) return message.error("Missing Plan or Role ID.");

    // Validate required location fields
    if (!values.country?.value) {
      return message.error("Please select a country");
    }

    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: "",
      confirmPassword: "",
      contactNo: values.phone,
      companyName: values.companyName,
      companyEmail: values.companyEmail,
      address: values.address,
      officeNo: values.officePhone,
      countryId: values.country.value,
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

      setIsChanged(false);

      await refreshUser();

      // Optional: refresh form UI
      // await fetchUserData();

      if (onSaveSuccess) {
        onSaveSuccess();
      }
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
    required = false
  ) => (
    <Form.Item
      label={label}
      name={name}
      className="mb-8"
      rules={
        required ? [{ required: true, message: `Please select ${label}` }] : []
      }
    >
      <Select
        showSearch
        labelInValue
        placeholder={`Select ${label}`}
        loading={loading[loadingKey]}
        disabled={!isEditing}
        open={isEditing ? undefined : false}
        filterOption={false}
        onFocus={onFocus}
        onSelect={onSelect}
        size="large"
        className="rounded-xl custom-select bg-[#F2F7FB]"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form.Item
          label={
            <FormattedMessage
              id="COMMON.FIRST_NAME"
              defaultMessage="First Name"
            />
          }
          name="firstName"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            readOnly={!isEditing}
            placeholder={intl.formatMessage({
              id: "COMMON.ENTER_FIRST_NAME",
              defaultMessage: "Enter your first name..",
            })}
            className="rounded-xl h-11 bg-[#F2F7FB] border border-[#E6ECF1]"
          />
        </Form.Item>
        <Form.Item
          label={
            <FormattedMessage
              id="COMMON.LAST_NAME"
              defaultMessage="Last Name"
            />
          }
          name="lastName"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            readOnly={!isEditing}
            placeholder={intl.formatMessage({
              id: "COMMON.ENTER_LAST_NAME",
              defaultMessage: "Enter your last name..",
            })}
            className="rounded-xl h-11 bg-[#F2F7FB] border border-[#E6ECF1]"
          />
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="COMMON.EMAIL" defaultMessage="Email" />}
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input
            size="large"
            readOnly={!isEditing}
            placeholder={intl.formatMessage({
              id: "COMMON.ENTER_EMAIL",
              defaultMessage: "Enter your email..",
            })}
            className="rounded-xl h-11 bg-[#F2F7FB] border border-[#E6ECF1]"
          />
        </Form.Item>

        <Form.Item
          label={
            <FormattedMessage
              id="COMMON.PHONE_NUMBER"
              defaultMessage="Phone Number"
            />
          }
          name="phone"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            readOnly={!isEditing}
            placeholder={intl.formatMessage({
              id: "COMMON.ENTER_PHONE_NUMBER",
              defaultMessage: "Enter your phone number..",
            })}
            className="rounded-xl h-11 bg-[#F2F7FB] border border-[#E6ECF1]"
          />
        </Form.Item>
        <Form.Item
          label={
            <FormattedMessage
              id="COMMON.COMPANY_NAME"
              defaultMessage="Company Name"
            />
          }
          name="companyName"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            readOnly={!isEditing}
            placeholder={intl.formatMessage({
              id: "COMMON.ENTER_COMPANY_NAME",
              defaultMessage: "Enter your company name..",
            })}
            className="rounded-xl h-11 bg-[#F2F7FB] border border-[#E6ECF1]"
          />
        </Form.Item>

        <Form.Item
          label={
            <FormattedMessage
              id="COMMON.COMPANY_EMAIL"
              defaultMessage="Company Email ID"
            />
          }
          name="companyEmail"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            readOnly={!isEditing}
            placeholder={intl.formatMessage({
              id: "COMMON.ENTER_COMPANY_EMAIL",
              defaultMessage: "Enter your company email..",
            })}
            className="rounded-xl h-11 bg-[#F2F7FB] border border-[#E6ECF1]"
          />
        </Form.Item>
        <Form.Item
          label={
            <FormattedMessage
              id="COMMON.OFFICE_PHONE"
              defaultMessage="Office Number"
            />
          }
          name="officePhone"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            placeholder={intl.formatMessage({
              id: "COMMON.ENTER_OFFICE_PHONE",
              defaultMessage: "Enter your office number..",
            })}
            readOnly={!isEditing}
            className="rounded-xl h-11 bg-[#F2F7FB] border border-[#E6ECF1]"
          />
        </Form.Item>
        <Form.Item
          label={
            <FormattedMessage id="COMMON.ADDRESS" defaultMessage="Address" />
          }
          name="address"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            placeholder={intl.formatMessage({
              id: "COMMON.ENTER_ADDRESS",
              defaultMessage: "Enter your address",
            })}
            readOnly={!isEditing}
            className="rounded-xl h-11 bg-[#F2F7FB] border border-[#E6ECF1]"
          />
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderLocationSelect(
          <FormattedMessage id="COMMON.COUNTRY" defaultMessage="Country" />,
          "country",
          countries,
          "country",
          loadCountries,
          (val, opt) => {
            form.setFieldsValue({
              country: { value: opt.value, label: opt.label, code: opt.code },
              state: null,
              city: null,
            });
            loadStates(opt.value);
          }
        )}
        {renderLocationSelect(
          <FormattedMessage id="COMMON.STATE" defaultMessage="State" />,
          "state",
          states,
          "state",
          () => loadStates(form.getFieldValue("country")?.value),
          (val) => {
            form.setFieldsValue({ city: null });
            loadCities(val);
          }
        )}
        {renderLocationSelect(
          <FormattedMessage id="COMMON.CITY" defaultMessage="City" />,
          "city",
          cities,
          "city",
          () => loadCities(form.getFieldValue("state")?.value),
          () => {}
        )}
      </div>

      <Form.Item
        label={
          <FormattedMessage id="COMMON.BIO" defaultMessage="Bio (optional)" />
        }
        name="bio"
        className="mb-9"
      >
        <TextArea
          rows={4}
          readOnly={!isEditing}
          className="rounded-xl bg-[#F2F7FB] border border-[#E6ECF1]"
          placeholder={intl.formatMessage({
            id: "COMMON.ENTER_BIO",
            defaultMessage: "Enter your bio...",
          })}
        />
      </Form.Item>

      <button
        type="submit"
        style={{ display: "none" }}
        id="profile-form-submit"
      />
    </Form>
  );
};

export default ProfileForm;
