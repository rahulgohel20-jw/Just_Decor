import { Input, Select, Button, Form, message, Spin } from "antd";
import { toAbsoluteUrl } from "@/utils";
import { useState, useEffect, useCallback } from "react";
import { isEqual } from "lodash";
import ReactCountryFlag from "react-country-flag";
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
  const [userData, setUserData] = useState(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState({
    country: false,
    state: false,
    city: false,
  });

  const loadCountries = useCallback(async () => {
    setLoading(prev => ({ ...prev, country: true }));
    try {
      const res = await fetchCountries();
      const list = res?.data?.data?.["Country Details"] || [];
      setCountries(list.map(({ id, name, code }) => ({ id, name, code })));
    } catch {
      message.error("Failed to load countries");
    } finally {
      setLoading(prev => ({ ...prev, country: false }));
    }
  }, []);

  const loadStates = useCallback(async (countryId) => {
    if (!countryId) return;
    setLoading(prev => ({ ...prev, state: true }));
    try {
      const res = await fetchStatesByCountry(countryId);
      const list = res?.data?.data?.["state Details"] || [];
      setStates(list.map(({ id, name }) => ({ id, name })));
    } catch {
      message.error("Failed to load states");
    } finally {
      setLoading(prev => ({ ...prev, state: false }));
    }
  }, []);

  const loadCities = useCallback(async (stateId) => {
    if (!stateId) return;
    setLoading(prev => ({ ...prev, city: true }));
    try {
      const res = await fetchCitiesByState(stateId);
      const list = res?.data?.data?.["City Details"] || [];
      setCities(list.map(({ id, name }) => ({ id, name })));
    } catch {
      message.error("Failed to load cities");
    } finally {
      setLoading(prev => ({ ...prev, city: false }));
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
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
          setUserData(user);

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

          // pre-load states & cities
          if (values.country?.value) await loadStates(values.country.value);
          if (values.state?.value) await loadCities(values.state.value);
        }
      } catch {
        message.error("Failed to fetch user details");
      }
    };

    loadInitialData();
  }, [userMasterId, form, loadStates, loadCities]);

  const handleValuesChange = (_, allValues) => {
    if (!initialValues) return;
    setIsChanged(!isEqual(initialValues, allValues));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allValues));
  };

  const onFinish = async (values) => {
    const { planId, roleId } = getPlanAndRoleFromLocalStorage();

    if (!planId || !roleId) {
      message.error("Missing Plan or Role ID.");
      return;
    }

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
      countryCode: values.country?.code?.startsWith("+") ? values.country.code : `+${values.country?.code || "91"}`,

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
      if (response?.msg) {
        message.error(response.msg);
      } else if (response?.errors) {
        Object.values(response.errors).flat().forEach(msg => message.error(msg));
      } else {
        message.error("Update failed.");
      }
    }
  };

  const renderLocationSelect = (label, name, data, loadingKey, onFocus, onSelect, disabled = false) => (
    <Form.Item label={label} name={name}>
      <Select
        showSearch
        labelInValue
        placeholder={`Select ${label}`}
        loading={loading[loadingKey]}
        disabled={disabled}
        filterOption={false}
        onFocus={onFocus}
        onSelect={onSelect}
        notFoundContent={loading[loadingKey] ? <Spin size="small" /> : `No ${label}`}
      >
        {data.map((item) => (
          <Option key={item.id} value={item.id} label={item.name} code={item.code}>
            {name === "country" ? (
              <div className="flex items-center gap-2">
                <ReactCountryFlag countryCode={item.code} svg style={{ width: 20, height: 15 }} />
                {item.name}
              </div>
            ) : item.name}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 pb-0 flex items-center gap-4">
        <img
          className="w-16 h-16 rounded-full border-4 border-white object-cover"
          src={toAbsoluteUrl("/images/user_img.jpg")}
          alt="profile"
        />
        <div>
          <span className="text-black">{userData?.firstName} {userData?.lastName}</span>
          <br />
          <span className="text-sm text-grey">{userData?.email}</span>
        </div>
      </div>

      <div className="p-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
          onValuesChange={handleValuesChange}
        >
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
              <Input placeholder="Last Name" />
            </Form.Item>
            <Form.Item label="Email ID" name="email" rules={[{ required: true, type: "email" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </div>

          {/* Company Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Company Name" name="companyName">
              <Input />
            </Form.Item>
            <Form.Item label="Company Email" name="companyEmail">
              <Input />
            </Form.Item>
            <Form.Item label="Company Address" name="companyAddress">
              <Input />
            </Form.Item>
            <Form.Item label="Office Number" name="officePhone">
              <Input />
            </Form.Item>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderLocationSelect("Country", "country", countries, "country", loadCountries, (val, opt) =>
              form.setFieldsValue({ country: { value: opt.value, label: opt.label, code: opt.code } }) || loadStates(opt.value)
            )}
            {renderLocationSelect("State", "state", states, "state", () =>
              loadStates(form.getFieldValue("country")?.value), val => loadCities(val)
            , !form.getFieldValue("country"))}
            {renderLocationSelect("City", "city", cities, "city", () =>
              loadCities(form.getFieldValue("state")?.value), () => {}, !form.getFieldValue("state"))}
          </div>

          <Form.Item label="Bio" name="bio">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={!isChanged}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ProfileForm;








// // ProfileForm.jsx
// import { Input, Select, Button, Form, message, Spin } from "antd";
// import { toAbsoluteUrl } from "@/utils";
// import { useState, useEffect, useCallback, useMemo } from "react";
// import { debounce } from "lodash";
// import ReactCountryFlag from "react-country-flag";

// const { TextArea } = Input;
// const { Option } = Select;

// import {
//   fetchCountries,
//   fetchStatesByCountry,
//   fetchCitiesByState,
//   getUserById,
// } from "@/services/apiServices";

// export default function ProfileForm({ userMasterId }) {
//   const [form] = Form.useForm();
//   const [userData, setUserData] = useState(null);

//   // Dropdowns
//   const [countryOptions, setCountryOptions] = useState([]);
//   const [stateOptions, setStateOptions] = useState([]);
//   const [cityOptions, setCityOptions] = useState([]);

//   // Loaders
//   const [countryLoading, setCountryLoading] = useState(false);
//   const [stateLoading, setStateLoading] = useState(false);
//   const [cityLoading, setCityLoading] = useState(false);

//   // ---------------- COUNTRY ----------------
//   const loadCountries = useCallback(async (search = "") => {
//     setCountryLoading(true);
//     try {
//       const res = await fetchCountries(search);
//       const countries = res?.data?.data?.["Country Details"] || [];
//       setCountryOptions(
//         countries.map((c) => ({
//           id: c.id,
//           value: c.id,
//           code: c.code,
//           name: c.name,
//         }))
//       );
//     } catch {
//       message.error("Failed to load countries");
//     } finally {
//       setCountryLoading(false);
//     }
//   }, []);

//   // ---------------- STATE ----------------
//   const loadStates = useCallback(async (countryId, search = "") => {
//     if (!countryId) return;
//     setStateLoading(true);
//     try {
//       const res = await fetchStatesByCountry(countryId, search);
//       const states = res?.data?.data?.["state Details"] || [];
//       setStateOptions(
//         states.map((s) => ({
//           id: s.id,
//           value: s.id,
//           name: s.name,
//         }))
//       );
//     } catch {
//       message.error("Failed to load states");
//     } finally {
//       setStateLoading(false);
//     }
//   }, []);

//   // ---------------- CITY ----------------
//   const loadCities = useCallback(async (stateId, search = "") => {
//     if (!stateId) return;
//     setCityLoading(true);
//     try {
//       const res = await fetchCitiesByState(stateId, search);
//       const cities = res?.data?.data?.["City Details"] || [];
//       setCityOptions(
//         cities.map((c) => ({
//           id: c.id,
//           value: c.id,
//           name: c.name,
//         }))
//       );
//     } catch {
//       message.error("Failed to load cities");
//     } finally {
//       setCityLoading(false);
//     }
//   }, []);

//   // ---------------- PREFILL USER ----------------
//   useEffect(() => {
//     const fetchAndPrefill = async () => {
//       if (!userMasterId) return;
//       try {
//         const res = await getUserById(userMasterId);
//         const user = res.data?.data?.["User Details"]?.[0];
//         if (user) {
//           setUserData(user);

//           // Load cascades
//           await loadCountries();
//           if (user.userBasicDetails?.country?.id) {
//             await loadStates(user.userBasicDetails.country.id);
//           }
//           if (user.userBasicDetails?.state?.id) {
//             await loadCities(user.userBasicDetails.state.id);
//           }

//           // Prefill both personal & company
//           form.setFieldsValue({
//             // Personal
//             firstName: user.firstName,
//             lastName: user.lastName,
//             email: user.email,
//             phone: user.contactNo,

//             // Company
//             companyName: user.userBasicDetails?.companyName,
//             companyEmail: user.userBasicDetails?.companyEmail,
//             companyAddress: user.userBasicDetails?.address,
//             officeNumber: user.userBasicDetails?.officeNo,

//             // Location
//             country: user.userBasicDetails?.country?.id,
//             state: user.userBasicDetails?.state?.id,
//             city: user.userBasicDetails?.city?.id,

//             // Extras
//             permittedId: user.userBasicDetails?.permittedId,
//             bio: user.userBasicDetails?.bio,
//           });
//         }
//       } catch (err) {
//         console.error(err);
//         message.error("Failed to fetch user");
//       }
//     };

//     fetchAndPrefill();
//   }, [userMasterId, form, loadCountries, loadStates, loadCities]);

//   // ---------------- DEBOUNCED SEARCH ----------------
//   const debouncedCountrySearch = useMemo(
//     () => debounce((val) => loadCountries(val), 500),
//     [loadCountries]
//   );

//   const debouncedStateSearch = useMemo(
//     () => debounce((val) => loadStates(form.getFieldValue("country"), val), 500),
//     [loadStates, form]
//   );

//   const debouncedCitySearch = useMemo(
//     () => debounce((val) => loadCities(form.getFieldValue("state"), val), 500),
//     [loadCities, form]
//   );

//   // ---------------- HANDLERS ----------------
//   const handleCountrySelect = (countryId) => {
//     form.setFieldsValue({ state: undefined, city: undefined });
//     setStateOptions([]);
//     setCityOptions([]);
//     loadStates(countryId);
//   };

//   const handleStateSelect = (stateId) => {
//     form.setFieldsValue({ city: undefined });
//     setCityOptions([]);
//     loadCities(stateId);
//   };

//   // ---------------- SUBMIT ----------------
//   const onFinish = (values) => {
//     console.log("Form submitted:", values);
//     message.success("Profile saved successfully!");
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md">
//       {/* Header */}
//       <div className="p-6 pb-0 flex flex-row items-center gap-4">
//         <img
//           className="w-16 h-16 rounded-full border-4 border-white object-cover"
//           src={toAbsoluteUrl("/images/user_img.jpg")}
//           alt="profile"
//         />
//         <div className="flex flex-col">
//           <span className="text-black font-normal">
//             {userData?.firstName} {userData?.lastName}
//           </span>
//           <span className="text-sm text-grey">{userData?.email}</span>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="p-6">
//         <Form form={form} layout="vertical" onFinish={onFinish} requiredMark="optional">
//           {/* Names */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
//               <Input placeholder="First Name" />
//             </Form.Item>
//             <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
//               <Input placeholder="Last Name" />
//             </Form.Item>
//           </div>

//           {/* Email & Phone */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Form.Item label="Email ID" name="email" rules={[{ required: true, type: "email" }]}>
//               <Input placeholder="Email" />
//             </Form.Item>
//             <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}>
//               <Input placeholder="Phone Number" />
//             </Form.Item>
//           </div>

//           {/* Company */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Form.Item label="Company Name" name="companyName" rules={[{ required: true }]}>
//               <Input placeholder="Company Name" />
//             </Form.Item>
//             <Form.Item label="Company Email" name="companyEmail" rules={[{ required: true, type: "email" }]}>
//               <Input placeholder="Company Email" />
//             </Form.Item>
//           </div>

//           {/* Address */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Form.Item label="Company Address" name="companyAddress" rules={[{ required: true }]}>
//               <Input placeholder="Company Address" />
//             </Form.Item>
//             <Form.Item label="Office Number" name="officeNumber" rules={[{ required: true }]}>
//               <Input placeholder="Office Number" />
//             </Form.Item>
//           </div>

//           {/* Country - State - City */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Form.Item label="Country" name="country" rules={[{ required: true }]}>
//               <Select
//                 showSearch
//                 placeholder="Select Country"
//                 allowClear
//                 loading={countryLoading}
//                 onSearch={debouncedCountrySearch}
//                 onFocus={() => loadCountries()}
//                 filterOption={false}
//                 notFoundContent={countryLoading ? <Spin size="small" /> : "No country"}
//                 onSelect={handleCountrySelect}
//               >
//                 {countryOptions.map((c) => (
//                   <Option key={c.id} value={c.value}>
//                     <div className="flex items-center gap-2">
//                       <ReactCountryFlag countryCode={c.code} svg style={{ width: 20, height: 15 }} />
//                       <span>{c.name}</span>
//                     </div>
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item label="State" name="state" rules={[{ required: true }]}>
//               <Select
//                 showSearch
//                 placeholder="Select State"
//                 allowClear
//                 disabled={!form.getFieldValue("country")}
//                 loading={stateLoading}
//                 onSearch={debouncedStateSearch}
//                 filterOption={false}
//                 notFoundContent={stateLoading ? <Spin size="small" /> : "No state"}
//                 onSelect={handleStateSelect}
//               >
//                 {stateOptions.map((s) => (
//                   <Option key={s.id} value={s.value}>
//                     {s.name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item label="City" name="city" rules={[{ required: true }]}>
//               <Select
//                 showSearch
//                 placeholder="Select City"
//                 allowClear
//                 disabled={!form.getFieldValue("state")}
//                 loading={cityLoading}
//                 onSearch={debouncedCitySearch}
//                 filterOption={false}
//                 notFoundContent={cityLoading ? <Spin size="small" /> : "No city"}
//               >
//                 {cityOptions.map((c) => (
//                   <Option key={c.id} value={c.value}>
//                     {c.name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </div>

//           <Form.Item label="Permitted ID" name="permittedId">
//             <Input placeholder="Permitted ID" />
//           </Form.Item>

//           <Form.Item label="Bio" name="bio">
//             <TextArea rows={4} placeholder="Write your bio..." />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit">Save</Button>
//           </Form.Item>
//         </Form>
//       </div>
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import { Form, Input } from "antd";
// import axios from "axios";

// const ProfileForm = () => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const res = await axios.get(
//           "http://103.1.101.244:9091/v1/api/user/getbyid?id=1"
//         );

//         if (res.data?.success) {
//           const user = res.data.data["User Details"][0];

//           // personal details
//           const firstName = user.firstName;
//           const lastName = user.lastName;
//           const email = user.email;
//           const phone = user.contactNo;

//           // company details
//           const companyName = user.userBasicDetails?.companyName;
//           const companyEmail = user.userBasicDetails?.companyEmail;
//           const companyAddress = user.userBasicDetails?.address;
//           const officePhone = user.userBasicDetails?.officeNo;

//           const country = user.userBasicDetails?.country?.name;
//           const state = user.userBasicDetails?.state?.name;
//           const city = user.userBasicDetails?.city?.name;

//           // set form values
//           form.setFieldsValue({
//             firstName,
//             lastName,
//             email,
//             phone,
//             companyName,
//             companyEmail,
//             companyAddress,
//             officePhone,
//             country,
//             state,
//             city,
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [form]);

//   return (
//     <Form form={form} layout="vertical">
//       {/* Personal Details */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <Form.Item label="First Name" name="firstName">
//           <Input placeholder="First Name" />
//         </Form.Item>
//         <Form.Item label="Last Name" name="lastName">
//           <Input placeholder="Last Name" />
//         </Form.Item>
//         <Form.Item label="Email" name="email">
//           <Input placeholder="Email" />
//         </Form.Item>
//         <Form.Item label="Phone" name="phone">
//           <Input placeholder="Phone" />
//         </Form.Item>
//       </div>

//       {/* Company Details */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//         <Form.Item label="Company Name" name="companyName">
//           <Input placeholder="Company Name" />
//         </Form.Item>
//         <Form.Item label="Company Email" name="companyEmail">
//           <Input placeholder="Company Email" />
//         </Form.Item>
//         <Form.Item label="Company Address" name="companyAddress">
//           <Input placeholder="Company Address" />
//         </Form.Item>
//         <Form.Item label="Office Phone" name="officePhone">
//           <Input placeholder="Office Phone" />
//         </Form.Item>
//         <Form.Item label="Country" name="country">
//           <Input placeholder="Country" />
//         </Form.Item>
//         <Form.Item label="State" name="state">
//           <Input placeholder="State" />
//         </Form.Item>
//         <Form.Item label="City" name="city">
//           <Input placeholder="City" />
//         </Form.Item>
//       </div>
//     </Form>
//   );
// };

// export default ProfileForm;
