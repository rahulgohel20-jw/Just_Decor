import { Fragment, useState } from "react";
import dayjs from "dayjs";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import StepsComponent from "@/components/StepsComponents";
import EventBasicInfoStep from "@/container/EventStepsContainer/EventBasicInfoStep";
import OtherInfoStep from "@/container/EventStepsContainer/OtherInfoStep";
import ClientDetailsStep from "@/container/EventStepsContainer/ClientDetailsStep";
import Functionsdeatils from "@/container/EventStepsContainer/FunctionDetails";
import { requiredFields } from "./constant";
import { useLocation } from "react-router";

const CreateEventPage = () => {
  const stepKeys = ["basic_info", "client_info", "functions", "other"];

  const location = useLocation();
  const { event_date } = location.state || {};

  const [formData, setFormData] = useState({
    ...requiredFields.basic_info,
    ...requiredFields.client_info,
    ...requiredFields.functions,
    ...requiredFields.other,
    event_date: event_date || "",
    Inquiry_date: dayjs().format("YYYY-MM-DD"),
  });
  const [current, setCurrent] = useState(0);
  const [errors, setErrors] = useState({});

  const fieldDisplayNames = {
    Inquiry_date: "Inquiry Date",
    event_date: "Event Date",
    venue: "Venue",
    event_type: "Event Type",
    manger_name: "Manager Name",
    customername: "Customer Name",
    customeraddress: "Customer Address",
    customermobile: "Customer Mobile",
    function_array: "Functions",
    meal_type: "Meal Type",
    meal_notes: "Meal Notes",
    service: "Service",
    theme: "Theme",
    servicenotes: "Service Notes",
  };

  const validateStep = (step) => {
    let tempErrors = {};
    const stepKey = stepKeys[step];

    if (!stepKey || !requiredFields[stepKey]) return true;

    const required = requiredFields[stepKey];
    Object.keys(required).forEach((field) => {
      const value = formData[field];
      const displayName = fieldDisplayNames[field] || field.replace(/_/g, " ");
      if (
        required[field] === "" &&
        (!value ||
          (typeof value === "string" && value.trim() === "") ||
          value === "")
      ) {
        tempErrors[field] = `${displayName} is required`;
      } else if (
        Array.isArray(required[field]) &&
        (!value || value.length === 0)
      ) {
        tempErrors[field] = `${displayName} is required`;
      }

      if (field === "customermobile" && value && !/^\d{10}$/.test(value)) {
        tempErrors[field] = "Mobile number must be 10 digits";
      }
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateAllSteps = () => {
    let allErrors = {};

    stepKeys.forEach((stepKey, index) => {
      if (!requiredFields[stepKey]) return;

      const required = requiredFields[stepKey];

      Object.keys(required).forEach((field) => {
        const value = formData[field];
        const displayName =
          fieldDisplayNames[field] || field.replace(/_/g, " ");
        if (
          required[field] === "" &&
          (!value ||
            (typeof value === "string" && value.trim() === "") ||
            value === "")
        ) {
          allErrors[field] = `${displayName} is required`;
        } else if (
          Array.isArray(required[field]) &&
          (!value || value.length === 0)
        ) {
          allErrors[field] = `${displayName} is required`;
        }

        if (field === "customermobile" && value && !/^\d{10}$/.test(value)) {
          allErrors[field] = "Mobile number must be 10 digits";
        }
      });
    });

    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(current)) {
      console.log("Validation failed. Errors:", errors);
      return;
    }
    setCurrent(current + 1);
  };

  const handlePrev = () => {
    setCurrent((prev) => prev - 1);
    setErrors({});
  };
  const handleFinish = () => {
    if (!validateStep(current)) {
      return;
    }

    if (!validateAllSteps()) {
      const errorFields = Object.keys(errors);
      if (errorFields.length > 0) {
        const firstErrorField = errorFields[0];

        stepKeys.forEach((stepKey, index) => {
          if (
            requiredFields[stepKey] &&
            requiredFields[stepKey].hasOwnProperty(firstErrorField)
          ) {
            setCurrent(index);
            return;
          }
        });
      }
      return;
    }

    console.log("=== FORM SUBMISSION SUCCESSFUL ===");
    console.log("Complete Form Data:", formData);
    setFormData({
      ...requiredFields.basic_info,
      ...requiredFields.client_info,
      ...requiredFields.functions,
      ...requiredFields.other,
      event_date: "",
      Inquiry_date: dayjs().format("YYYY-MM-DD"),
    });
    setCurrent(0);
    setErrors({});
  };

  const onInputChange = (e, key) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [key]: value,
    });

    if (errors[key]) {
      setErrors({
        ...errors,
        [key]: undefined,
      });
    }
  };

  const handleInputChange = ({ target: { value, name } }) => {
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const steps = () => [
    {
      title: "Event Information",
      content: (
        <EventBasicInfoStep
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
          errors={errors}
        />
      ),
      icon: <i className="ki-filled ki-security-user"></i>,
    },
    {
      title: "Client Details",
      content: (
        <ClientDetailsStep
          formData={formData}
          setFormData={setFormData}
          onInputChange={onInputChange}
          handleInputChange={handleInputChange}
          errors={errors}
        />
      ),
      icon: <i className="ki-filled ki-security-user"></i>,
    },
    {
      title: "Functions",
      content: (
        <Functionsdeatils
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
          errors={errors}
        />
      ),
      icon: <i className="ki-filled ki-setting-4"></i>,
    },
    {
      title: "Other Details",
      content: (
        <OtherInfoStep
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
          errors={errors}
        />
      ),
      icon: <i className="ki-filled ki-information-4"></i>,
    },
  ];

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Create Event" }]} />
        </div>
        <StepsComponent
          direction="vertical"
          current={current}
          steps={steps()}
          onNext={handleNext}
          onPrev={handlePrev}
          onFinish={handleFinish}
        />
      </Container>
    </Fragment>
  );
};

export default CreateEventPage;
