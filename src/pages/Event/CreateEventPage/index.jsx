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
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
import {
  eventValidationSchema,
  stepValidationSchemas,
} from "./eventValidationSchema";
import {
  CreateEventMaster,
  GetEventMasterById,
  UpdateEventMaster,
} from "@/services/apiServices";
import Swal from "sweetalert2";

const STEP_KEYS = ["basic_info", "client_info", "functions", "other"];

const CreateEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const mode = eventId ? "edit" : "create";

  const initialFormData = useMemo(
    () => ({
      inquiryDate: dayjs().format("DD/MM/YYYY"),
      eventStartDateTime: "",
      eventEndDateTime: "",
      venue: "",
      eventTypeId: "",
      managerId: "",
      partyId: "",
      customer_name: "",
      address: "",
      mobileno: "",
      eventFunction: [],
      mealTypeId: "",
      meal_notes: "",
      service: "",
      theme: "",
      remark: "",
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormData);
  const [current, setCurrent] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  let STATUS_NAME_TO_ID = {
    Inquiry: "0",
    Inquriy: "0",
    Confirm: "1",
    Cancel: "2",
  };

  useEffect(() => {
    if (mode === "edit" && eventId) {
      setLoading(true);
      GetEventMasterById(eventId)
        .then((res) => {
          const event = res.data.data["Event Details"][0];
          console.log(event, "event hello");
          const statusId =
            event?.status?.id != null
              ? String(event.status.id)
              : (STATUS_NAME_TO_ID[event?.status] ?? "0");
          setFormData((prev) => ({
            ...prev,
            inquiryDate: event.inquiryDate
              ? dayjs(event.inquiryDate, "DD/MM/YYYY").format("DD/MM/YYYY")
              : prev.inquiryDate,
            eventStartDateTime: event.eventStartDateTime.replace(
              /am|pm/i,
              (match) => match.toUpperCase()
            ),
            eventEndDateTime: event.eventEndDateTime.replace(
              /am|pm/i,
              (match) => match.toUpperCase()
            ),
            status: statusId,
            venue: event.venue || "",
            eventTypeId: event.eventType?.id || "",
            managerId: event.manager?.id || "",
            partyId: event.party?.id || "",
            customer_name: event.party?.nameEnglish || "",
            address: event.address || event.party?.addressEnglish || "",
            mobileno: event.mobileno || event.party?.mobileno || "",

            eventFunction: (event.eventFunctions || []).map((f) => ({
              eventFuncId: f.eventId,
              functionId: f.function?.id ?? f.functionId ?? null,
              functionName: f.function?.nameEnglish ?? "",
              functionStartDateTime: f.functionStartDateTime.replace(
                /am|pm/i,
                (match) => match.toUpperCase()
              ),
              functionEndDateTime: f.functionEndDateTime.replace(
                /am|pm/i,
                (match) => match.toUpperCase()
              ),
              pax: f.pax || "",
              rate: f.rate || "",
              function_venue: f.function_venue || "",
              notesEnglish: f.notesEnglish || "",
              notesGujarati: f.notesGujarati || "",
              notesHindi: f.notesHindi || "",
              id: f.id,
            })),

            mealTypeId: event.mealType?.id || "",
            meal_notes: event.meal_notes || "",
            service: event.service || "",
            theme: event.theme || "",
            remark: event.remark || "",
          }));
          console.log(event, "data");
        })
        .catch((err) => console.error("Error fetching event:", err))
        .finally(() => setLoading(false));
    }
  }, [mode, eventId]);

  const validateWithYup = useCallback(async (data, schema) => {
    try {
      await schema.validate(data, { abortEarly: false });
      return {};
    } catch (err) {
      console.log("Yup validation error:", err); // Debug log

      const validationErrors = {};

      // Check if err.inner exists and is an array
      if (err.inner && Array.isArray(err.inner)) {
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
      } else if (err.path && err.message) {
        // Handle single error case
        validationErrors[err.path] = err.message;
      } else {
        // Fallback for unexpected error structure
        console.error("Unexpected Yup error structure:", err);
        validationErrors.general = "Validation failed";
      }

      return validationErrors;
    }
  }, []);

  const validateStep = useCallback(
    async (step) => {
      const stepKey = STEP_KEYS[step];
      console.log("Validating step:", stepKey, "with data:", formData); // Debug log

      if (!stepKey) {
        console.log("Invalid step key:", stepKey);
        return true;
      }

      const stepSchema = stepValidationSchemas[stepKey];
      if (!stepSchema) {
        console.log("No schema found for step:", stepKey);
        return true;
      }

      try {
        const validationErrors = await validateWithYup(formData, stepSchema);
        console.log(
          "Validation errors for step",
          stepKey,
          ":",
          validationErrors
        ); // Debug log

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
      } catch (error) {
        console.error("Error during step validation:", error);
        return false;
      }
    },
    [formData, validateWithYup]
  );

  const validateAllSteps = useCallback(async () => {
    try {
      const validationErrors = await validateWithYup(
        formData,
        eventValidationSchema
      );
      console.log("All steps validation errors:", validationErrors); // Debug log

      setErrors(validationErrors);
      return Object.keys(validationErrors).length === 0;
    } catch (error) {
      console.error("Error during all steps validation:", error);
      return false;
    }
  }, [formData, validateWithYup]);

  const handleNext = useCallback(async () => {
    const isValid = await validateStep(current);
    if (!isValid) {
      console.log("Validation failed. Errors:", errors);
      return;
    }
    setCurrent((prev) => prev + 1);
  }, [current, validateStep, errors]);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => prev - 1);
    setErrors({});
  }, []);

  const handleFinish = useCallback(async () => {
    const isValid = await validateAllSteps();
    if (!isValid) {
      console.log("Final validation failed. Errors:", errors);
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    const payload = {
      ...formData,
      status: Number(formData.status),
      eventFunction: (formData.eventFunction || []).map((f) => ({
        ...f,
        functionId: f.functionId != null ? Number(f.functionId) : null,
      })),
      userId,
    };

    try {
      let response;

      if (mode === "edit" && eventId) {
        response = await UpdateEventMaster(eventId, payload);
      } else {
        response = await CreateEventMaster(payload);
      }
      if (
        response?.data?.msg?.toLowerCase().includes("Successfully") ||
        response?.status === 200
      ) {
        Swal.fire({
  title: "Event Created Successfully!",
  text: "Your event has been added to the calendar.",
  icon: "success",
  background: "#f5faff",
  color: "#003f73",
  confirmButtonText: "Okay",
  confirmButtonColor: "#005BA8",
  showClass: {
    popup: `
      animate__animated
      animate__fadeInDown
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutUp
      animate__faster
    `
  },
  customClass: {
    popup: "rounded-2xl shadow-xl",
    title: "text-2xl font-bold",
    confirmButton: "px-6 py-2 text-white font-semibold rounded-lg"
  }
});

        navigate("/calendar");
      } else {
        response.data?.msg && errorMsgPopup(response.data.msg);
        console.error("Backend returned an error:", response);
      }
    } catch (err) {
      response.data?.msg && errorMsgPopup(response.data.msg);
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} event:`,
        err
      );
    }
  }, [formData, mode, eventId, navigate, validateAllSteps, errors]);

  const handleInputChange = useCallback(
    ({ target: { value, name } }) => {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

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
        icon: <i className="ki-filled ki-calendar"></i>,
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
