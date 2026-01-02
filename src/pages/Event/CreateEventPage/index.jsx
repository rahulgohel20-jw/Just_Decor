import { Fragment, useState, useCallback, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Container } from "@/components/container";
import StepsComponent from "@/components/StepsComponents";
import EventBasicInfoStep from "@/container/EventStepsContainer/EventBasicInfoStep";
import OtherInfoStep from "@/container/EventStepsContainer/OtherInfoStep";
import ClientDetailsStep from "@/container/EventStepsContainer/ClientDetailsStep";
import FunctionsDetails from "@/container/EventStepsContainer/FunctionDetails";
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
import { FormattedMessage } from "react-intl";

const STEP_KEYS = ["basic_info", "client_info", "functions", "other"];

const CreateEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mode = location.pathname.includes("/copy")
    ? "copy"
    : eventId
      ? "edit"
      : "create";

  // Get selected date from calendar navigation state
  const selectedDateFromCalendar = location.state?.event_date;
  const initialFormData = useMemo(() => {
    const today = dayjs();
    const defaultStartTime = today.hour(8).minute(0).second(0); // 8:00 AM
    const defaultEndTime = today.hour(12).minute(0).second(0); // 12:00 PM

    return {
      inquiryDate: dayjs().format("DD/MM/YYYY"),
      eventStartDateTime: defaultStartTime.format("DD/MM/YYYY hh:mm A"),
      eventEndDateTime: defaultEndTime.format("DD/MM/YYYY hh:mm A"),
      venueId: "",
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
    };
  }, []);

  const [formData, setFormData] = useState(initialFormData);
  const [current, setCurrent] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  let STATUS_NAME_TO_ID = {
    Inquiry: "0",
    Confirm: "1",
    Cancel: "2",
  };

  useEffect(() => {
    if (mode === "create") {
      // Check if dates are coming from calendar navigation
      if (selectedDateFromCalendar) {
        console.log(
          "Auto-filling dates from calendar:",
          selectedDateFromCalendar
        );

        const selectedDate = dayjs(selectedDateFromCalendar);
        const startDateTime = selectedDate.hour(8).minute(0); // 8:00 AM
        const endDateTime = selectedDate.hour(12).minute(0); // 12:00 PM

        setFormData((prev) => ({
          ...prev,
          eventStartDateTime: startDateTime.format("DD/MM/YYYY hh:mm A"),
          eventEndDateTime: endDateTime.format("DD/MM/YYYY hh:mm A"),
        }));
      }
      // If no date from calendar, set default dates with today's date
      else if (!formData.eventStartDateTime && !formData.eventEndDateTime) {
        console.log("Setting default dates for manual event creation");

        const today = dayjs();
        const startDateTime = today.hour(8).minute(0).second(0); // 8:00 AM today
        const endDateTime = today.hour(12).minute(0).second(0); // 12:00 PM today

        setFormData((prev) => ({
          ...prev,
          eventStartDateTime: startDateTime.format("DD/MM/YYYY hh:mm A"),
          eventEndDateTime: endDateTime.format("DD/MM/YYYY hh:mm A"),
        }));
      }
    }
  }, [mode, selectedDateFromCalendar]);
  useEffect(() => {
    if ((mode === "edit" || mode === "copy") && eventId) {
      setLoading(true);
      GetEventMasterById(eventId)
        .then((res) => {
          const event = res.data.data["Event Details"][0];
          console.log(event, "data");

          const statusId =
            event?.status != null
              ? String(event.status)
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
            venueId: event.venue.id || "",
            eventTypeId: event.eventType?.id || "",
            managerId: event.managerId || "",

            partyId: event.party?.id || "",
            customer_name: event.party?.nameEnglish || "",
            address: event.address || event.party?.addressEnglish || "",
            mobileno: event.mobileno || event.party?.mobileno || "",
            isHighPriority: event.isHighPriority,
            eventFunction: (event.eventFunctions || []).map((f) => ({
              eventFuncId: mode === "copy" ? 0 : f.id,
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
            groomName: event.groomName || "",
            groomInstaLink: event.groomInstaLink || "",
            groomBirthDate: event.groomBirthDate || "",
            groom_community: event.groom_community || "",
            groomMobileno: event.groomMobileno || "",

            // 🔹 ✅ BRIDE DATA
            brideName: event.brideName || "",
            brideInstaLink: event.brideInstaLink || "",
            brideBirthDate: event.brideBirthDate || "",
            bride_community: event.bride_community || "",
            brideMobileno: event.brideMobileno || "",
          }));
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
      console.log("Yup validation error:", err);
      const validationErrors = {};

      if (err.inner && Array.isArray(err.inner)) {
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
      } else if (err.path && err.message) {
        validationErrors[err.path] = err.message;
      } else {
        console.error("Unexpected Yup error structure:", err);
        validationErrors.general = "Validation failed";
      }

      return validationErrors;
    }
  }, []);

  const validateStep = useCallback(
    async (step) => {
      const stepKey = STEP_KEYS[step];
      console.log("Validating step:", stepKey, "with data:", formData);

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
        );

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
      console.log("All steps validation errors:", validationErrors);

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

    const userId = localStorage.getItem("userId");

    const payload = {
      ...formData,
      venueId:
        formData.venueId === "" || formData.venueId === null
          ? null
          : Number(formData.venueId),
      status: Number(formData.status),
      eventFunction: (formData.eventFunction || []).map((f, index) => ({
        eventFuncId: f.eventFuncId || 0,
        functionId: f.functionId != null ? Number(f.functionId) : null,
        functionStartDateTime: f.functionStartDateTime || "",
        functionEndDateTime: f.functionEndDateTime || "",
        pax: f.pax ? Number(f.pax) : 0,
        rate: f.rate ? Number(f.rate) : 0,
        function_venue: f.function_venue || "",
        notesEnglish: f.notesEnglish || "",
        notesGujarati: f.notesGujarati || "",
        notesHindi: f.notesHindi || "",
        sortorder: index + 1, // Add sort order based on position
      })),
      userId,
    };

    // Helper function to get status-based message
    const getStatusMessage = (status, isUpdate = false) => {
      const statusId = String(status);
      const action = isUpdate ? "updated" : "created";
      const actionCaps = isUpdate ? "Updated" : "Created";

      switch (statusId) {
        case "0": // Inquiry
          return {
            title: `Event Inquiry ${actionCaps} Successfully!`,
            text: `Your event inquiry has been ${action} and saved to the calendar.`,
          };
        case "1": // Confirm
          return {
            title: `Event Confirmed Successfully!`,
            text: `Your event has been confirmed and ${action} in the calendar.`,
          };
        case "2": // Cancel
          return {
            title: `Event Cancelled Successfully!`,
            text: `Your event has been cancelled and ${action} in the calendar.`,
          };
        default:
          return {
            title: `Event ${actionCaps} Successfully!`,
            text: `Your event has been ${action} in the calendar.`,
          };
      }
    };

    try {
      let response;

      if (mode === "edit" && eventId) {
        response = await UpdateEventMaster(eventId, payload);
        console.log("Update Response:", response);

        if (
          response?.data?.msg?.toLowerCase().includes("success") ||
          response?.data?.data?.success === true ||
          response?.data?.success === true
        ) {
          const statusMessage = getStatusMessage(formData.status, true);

          Swal.fire({
            title: statusMessage.title,
            text: statusMessage.text,
            icon: "success",
            background: "#f5faff",
            color: "#003f73",
            confirmButtonText: "Okay",
            confirmButtonColor: "#005BA8",
            showClass: {
              popup: "animate__animated animate__fadeInDown animate__faster",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp animate__faster",
            },
            customClass: {
              popup: "rounded-2xl shadow-xl",
              title: "text-2xl font-bold",
              confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
            },
          });
          navigate("/calendar");
        } else {
          Swal.fire({
            title: "Event Update Failed!",
            text:
              response?.data?.msg ||
              "Failed to update event. Please try again.",
            icon: "error",
            background: "#f5faff",
            color: "#003f73",
            confirmButtonText: "Okay",
            confirmButtonColor: "#005BA8",
            showClass: {
              popup: "animate__animated animate__fadeInDown animate__faster",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp animate__faster",
            },
            customClass: {
              popup: "rounded-2xl shadow-xl",
              title: "text-2xl font-bold",
              confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
            },
          });
          console.error("Backend returned an error:", response);
        }
      } else {
        response = await CreateEventMaster(payload);
        console.log("Create Response:", response);

        if (response?.data?.success === true) {
          const statusMessage = getStatusMessage(formData.status, false);

          Swal.fire({
            title: statusMessage.title,
            text: statusMessage.text,
            icon: "success",
            background: "#f5faff",
            color: "#003f73",
            confirmButtonText: "Okay",
            confirmButtonColor: "#005BA8",
            showClass: {
              popup: "animate__animated animate__fadeInDown animate__faster",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp animate__faster",
            },
            customClass: {
              popup: "rounded-2xl shadow-xl",
              title: "text-2xl font-bold",
              confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
            },
          });
          navigate("/calendar");
        } else {
          Swal.fire({
            title: "Event Creation Failed!",
            text:
              response?.data?.msg ||
              "Failed to create event. Please try again.",
            icon: "error",
            background: "#f5faff",
            color: "#003f73",
            confirmButtonText: "Okay",
            confirmButtonColor: "#005BA8",
            showClass: {
              popup: "animate__animated animate__fadeInDown animate__faster",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp animate__faster",
            },
            customClass: {
              popup: "rounded-2xl shadow-xl",
              title: "text-2xl font-bold",
              confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
            },
          });
          console.error("Backend returned an error:", response);
        }
      }
    } catch (err) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} event:`,
        err
      );

      Swal.fire({
        title: `Event ${mode === "edit" ? "Update" : "Creation"} Failed!`,
        text:
          err?.response?.data?.msg ||
          err?.message ||
          "An unexpected error occurred. Please try again.",
        icon: "error",
        background: "#f5faff",
        color: "#003f73",
        confirmButtonText: "Okay",
        confirmButtonColor: "#005BA8",
        showClass: {
          popup: "animate__animated animate__fadeInDown animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp animate__faster",
        },
        customClass: {
          popup: "rounded-2xl shadow-xl",
          title: "text-2xl font-bold",
          confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
        },
      });
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
        title: (
          <FormattedMessage
            id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_EVENT_INFO_STEP_TITLE"
            defaultMessage="Event Information"
          />
        ),
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
        title: (
          <FormattedMessage
            id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_CLIENT_DETAILS_STEP_TITLE"
            defaultMessage="Client Details"
          />
        ),
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
        title: (
          <FormattedMessage
            id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_FUNCTIONS_STEP_TITLE"
            defaultMessage="Functions"
          />
        ),
        content: (
          <FunctionsDetails
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
        title: (
          <FormattedMessage
            id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_OTHER_DETAILS_STEP_TITLE"
            defaultMessage="Other Details"
          />
        ),
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

  return (
    <Fragment>
      <Container>
        {/* Page Title */}
        <div className="pb-2 mb-3">
          <h1 className="text-xl font-semibold text-gray-900">
            {mode === "edit" ? (
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_EDIT_EVENT_BUTTON"
                defaultMessage="Edit Event"
              />
            ) : (
              <FormattedMessage
                id="USER.DASHBOARD.DASHBOARD_CALENDAR_EVENT_VIEW_DETAILS_CREATE_EVENT_BUTTON"
                defaultMessage="Create Event"
              />
            )}
          </h1>
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
