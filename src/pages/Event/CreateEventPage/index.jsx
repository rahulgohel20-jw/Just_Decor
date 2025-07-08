import React, { Fragment, useState } from "react";
import {
  Info as InfoIcon,
  Settings as FunctionsIcon,
  Utensils as MealIcon,
} from "lucide-react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import StepsComponent from "@/components/StepsComponents";
import EventBasicInfoStep from "@/container/EventStepsContainer/EventBasicInfoStep";
import FunctionsStep from "@/container/EventStepsContainer/FunctionsStep";
import { requiredFields } from "./constant";

const CreateEventPage = () => {
  const [formData, setFormData] = useState(requiredFields.basic_info);
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    const nextStep = current + 1;
    switch (nextStep) {
      case 1:
        setFormData({ ...formData, ...requiredFields.functions });
        break;
      case 2:
        setFormData({ ...formData, ...requiredFields.meal });
        break;
      default:
        break;
    }
    setCurrent(nextStep);
  };
  const handlePrev = () => {
    setCurrent(current - 1);
  };
  const handleFinish = () => {
    // Handle form submission logic here
    console.log("Form submitted with data:", formData);
    // Reset form or redirect as needed
    setFormData(requiredFields.basic_info);
    setCurrent(0);
  };

  const handleInputChange = ({ target: { value, name } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const steps = () => [
    {
      title: "Basic Information",
      content: (
        <EventBasicInfoStep
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
        />
      ),
      icon: <InfoIcon />,
    },
    {
      title: "Functions",
      content: (
        <FunctionsStep
          formData={formData}
          setFormData={setFormData}
          onInputChange={handleInputChange}
        />
      ),
      icon: <FunctionsIcon />,
    },
    {
      title: "Meal Type & Notes",
      content: "Meal Type & Notes-content",
      icon: <MealIcon />,
    },
  ];
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Events" }]} />
        </div>
        <StepsComponent
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
