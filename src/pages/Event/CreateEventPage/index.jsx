import { Fragment, useState, useCallback, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import StepsComponent from "@/components/StepsComponents";
import EventBasicInfoStep from "@/container/EventStepsContainer/EventBasicInfoStep";
import OtherInfoStep from "@/container/EventStepsContainer/OtherInfoStep";
import ClientDetailsStep from "@/container/EventStepsContainer/ClientDetailsStep";
import Functionsdeatils from "@/container/EventStepsContainer/FunctionDetails";
import { requiredFields } from "./constant";
import {
  CreateEventMaster,
  GetEventMasterById,
  UpdateEventMaster,
} from "@/services/apiServices";

const STEP_KEYS = ["basic_info", "client_info", "functions", "other"];

const FIELD_DISPLAY_NAMES = {
  inquiryDate: "Inquiry Date",
  eventStartDateTime: "Event Start Date",
  eventEndDateTime: "Event End Date",
  venue: "Venue",
  eventTypeId: "Event Type",
  managerId: "Manager Name",
  customer_name: "Customer Name",
  address: "Customer Address",
  mobileno: "Customer Mobile",
  function_array: "Functions",
  mealTypeId: "Meal Type",
  meal_notes: "Meal Notes",
  service: "Service",
  theme: "Theme",
  remark: "Service Notes",
};

const MOBILE_REGEX = /^\d{10}$/;

const CreateEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const mode = eventId ? "edit" : "create";
  const initialFormData = useMemo(
    () => ({
      ...requiredFields.basic_info,
      ...requiredFields.client_info,
      ...requiredFields.functions,
      ...requiredFields.other,
      eventStartDateTime: "",
      eventEndDateTime: "",
      inquiryDate: dayjs().format("DD/MM/YYYY"),
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormData);
  const [current, setCurrent] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && eventId) {
      setLoading(true);
      GetEventMasterById(eventId)
        .then((res) => {
          const event = res.data.data["Event Details"][0];
          console.log(event, "event");

          setFormData((prev) => ({
            ...prev,
            inquiryDate: event.inquiryDate
              ? dayjs(event.inquiryDate, "DD/MM/YYYY").format("DD/MM/YYYY")
              : prev.inquiryDate,
            eventStartDateTime: event.eventStartDateTime || "",
            eventEndDateTime: event.eventEndDateTime || "",
            venue: event.venue || "",
            eventTypeId: event.eventType?.id || "",
            managerId: event.manager?.id || "",
            partyId: event.party?.id || "",
            customer_name: event.party?.nameEnglish || "",
            address: event.address || event.party?.addressEnglish || "",
            mobileno: event.mobileno || event.party?.mobileno || "",
            function_array: event.eventFunctions || [],
            mealTypeId: event.mealType?.id || "",
            meal_notes: event.meal_notes || "",
            service: event.service || "",
            theme: event.theme || "",
            remark: event.remark || "",
          }));
        })
        .catch((err) => console.error("Error fetching event:", err))
        .finally(() => setLoading(false));
    }
  }, [mode, eventId]);

  const getDisplayName = useCallback((field) => {
    return FIELD_DISPLAY_NAMES[field] || field.replace(/_/g, " ");
  }, []);

  const isFieldEmpty = useCallback((value, requiredValue) => {
    if (requiredValue === "") {
      return (
        !value ||
        (typeof value === "string" && value.trim() === "") ||
        value === ""
      );
    }
    if (Array.isArray(requiredValue)) {
      return !value || value.length === 0;
    }
    return false;
  }, []);

  const validateFields = useCallback(
    (stepKey = null) => {
      const tempErrors = {};
      const stepsToValidate = stepKey ? [stepKey] : STEP_KEYS;

      stepsToValidate.forEach((key) => {
        if (!requiredFields[key]) return;

        const required = requiredFields[key];
        Object.entries(required).forEach(([field, requiredValue]) => {
          const value = formData[field];
          const displayName = getDisplayName(field);

          if (isFieldEmpty(value, requiredValue)) {
            tempErrors[field] = `${displayName} is required`;
          }

          if (field === "mobileno" && value && !MOBILE_REGEX.test(value)) {
            tempErrors[field] = "Mobile number must be 10 digits";
          }
        });
      });

      return tempErrors;
    },
    [formData, getDisplayName, isFieldEmpty]
  );

  const validateStep = useCallback(
    (step) => {
      const stepKey = STEP_KEYS[step];
      if (!stepKey || !requiredFields[stepKey]) return true;

      const tempErrors = validateFields(stepKey);
      setErrors(tempErrors);
      return Object.keys(tempErrors).length === 0;
    },
    [validateFields]
  );

  const validateAllSteps = useCallback(() => {
    const allErrors = validateFields();
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [validateFields]);

  const handleNext = useCallback(() => {
    if (!validateStep(current)) {
      console.log("Validation failed. Errors:", errors);
      return;
    }
    setCurrent((prev) => prev + 1);
  }, [current, validateStep, errors]);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => prev - 1);
    setErrors({});
  }, []);

  const handleFinish = useCallback(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    const payload = {
      ...formData,
      userId,
    };

    if (mode === "edit" && eventId) {
      UpdateEventMaster(eventId, payload)
        .then(() => navigate("/calendar"))
        .catch((err) => console.error("Error updating event:", err));
    } else {
      CreateEventMaster(payload)
        .then(() => navigate("/calendar"))
        .catch((err) => console.error("Error creating event:", err));
    }
  }, [formData, mode, eventId, navigate]);

  const onInputChange = useCallback(
    (e, key) => {
      const { value } = e.target;
      setFormData((prev) => ({ ...prev, [key]: value }));

      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    },
    [errors]
  );

  const handleInputChange = useCallback(
    ({ target: { value, name } }) => {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const steps = useMemo(
    () => [
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
        icon: <i className="ki-filled ki-security-user" />,
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
        icon: <i className="ki-filled ki-security-user" />,
      },
      {
        title: "Functions",
        content: (
          <Functionsdeatils
            formData={formData}
            setFormData={setFormData}
            onInputChange={handleInputChange}
            errors={errors}
            eventStartDateTime={formData.eventStartDateTime}
            eventEndDateTime={formData.eventEndDateTime}
          />
        ),
        icon: <i className="ki-filled ki-setting-4" />,
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
        icon: <i className="ki-filled ki-information-4" />,
      },
    ],
    [formData, errors, onInputChange, handleInputChange]
  );

  const breadcrumbItems = useMemo(
    () => [{ title: mode === "edit" ? "Edit Event" : "Create Event" }],
    [mode]
  );

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <StepsComponent
          direction="vertical"
          current={current}
          steps={steps}
          onNext={handleNext}
          onPrev={handlePrev}
          onFinish={handleFinish}
        />
      </Container>
    </Fragment>
  );
};

export default CreateEventPage;
