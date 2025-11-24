import * as yup from "yup";
import dayjs from "dayjs";

// Helper function to extract only date part from datetime string
const extractDateOnly = (dateTimeString) => {
  if (!dateTimeString) return null;
  return dateTimeString.split(" ")[0];
};

const functionItemSchema = yup.object().shape({
  functionId: yup.string().required("Function Type is required"),
  pax: yup.string().required("Pax is required"),
});

// Custom test for duplicate functions (same function on same date)
const noDuplicateFunctionsTest = {
  name: "no-duplicate-functions",
  message: "",
  test: function (eventFunctions) {
    if (!eventFunctions || eventFunctions.length === 0) return true;

    const seen = new Map();

    for (let i = 0; i < eventFunctions.length; i++) {
      const func = eventFunctions[i];

      // Skip if functionId or date is not set
      if (!func.functionId || !func.functionStartDateTime) continue;

      const dateOnly = extractDateOnly(func.functionStartDateTime);
      const key = `${func.functionId}-${dateOnly}`;

      // Only error if SAME functionId AND SAME date
      if (seen.has(key)) {
        return this.createError({
          path: this.path,
          message: "",
        });
      }

      seen.set(key, i);
    }

    return true;
  },
};

export const eventValidationSchema = yup.object().shape({
  inquiryDate: yup.string().required("Inquiry Date is required"),
  status: yup.string().required("Status is required"),
  eventStartDateTime: yup.string().required("Event Start Date is required"),
  eventEndDateTime: yup
    .string()
    .required("Event End Date is required")
    .test(
      "is-after-start",
      "End date must be after start date",
      function (value) {
        const { eventStartDateTime } = this.parent;
        if (!eventStartDateTime || !value) return true;

        const startDate = dayjs(eventStartDateTime, "DD/MM/YYYY hh:mm A");
        const endDate = dayjs(value, "DD/MM/YYYY hh:mm A");

        return endDate.isAfter(startDate);
      }
    ),
  venueId: yup.string().required("Venue is required"),
  eventTypeId: yup.string().required("Event Type is required"),
  managerId: yup.string().required("Manager Name is required"),

  customer_name: yup.string().required("Customer Name is required"),
  address: yup.string().required("Customer Address is required"),
  mobileno: yup
    .string()
    .required("Customer Mobile is required")
    .matches(/^\d{10}$/, "Mobile number must be 10 digits"),

  // Added duplicate check here
  eventFunction: yup
    .array()
    .of(functionItemSchema)
    .min(1, "At least one function is required")
    .required("Functions is required")
    .test(noDuplicateFunctionsTest),

  mealTypeId: yup.string().required("Meal Type is required"),
});

// FIXED: Step-specific validation schemas
export const stepValidationSchemas = {
  basic_info: yup.object().shape({
    status: yup.string().required("Status is required"),
    inquiryDate: yup.string().required("Inquiry Date is required"),
    eventStartDateTime: yup.string().required("Event Start Date is required"),
    eventEndDateTime: yup
      .string()
      .required("Event End Date is required")
      .test(
        "is-after-start",
        "End date must be after start date",
        function (value) {
          const { eventStartDateTime } = this.parent;
          if (!eventStartDateTime || !value) return true;

          const startDate = dayjs(eventStartDateTime, "DD/MM/YYYY hh:mm A");
          const endDate = dayjs(value, "DD/MM/YYYY hh:mm A");

          return endDate.isAfter(startDate);
        }
      ),
    venueId: yup
      .number()
      .typeError("Venue is required")
      .required("Venue is required")
      .nullable(),
    eventTypeId: yup.string().required("Event Type is required"),
    managerId: yup.string().required("Manager Name is required"),
  }),

  client_info: yup.object().shape({
    customer_name: yup.string().required("Customer Name is required"),
    address: yup.string().required("Customer Address is required"),
    mobileno: yup
      .string()
      .required("Customer Mobile is required")
      .matches(/^\d{10}$/, "Mobile number must be 10 digits"),
  }),

  // UPDATED: Added duplicate function check for functions step
  functions: yup.object().shape({
    eventFunction: yup
      .array()
      .of(functionItemSchema)
      .min(1, "At least one function is required")
      .required("Functions is required")
      .test(noDuplicateFunctionsTest),
  }),
};

// Export the function item schema for individual validation
export { functionItemSchema };