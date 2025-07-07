import React, { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import StepsComponent from "@/components/StepsComponents";
import {
  Info as InfoIcon,
  Settings as FunctionsIcon,
  Utensils as MealIcon,
} from "lucide-react";

const CreateEventPage = () => {
  const steps = [
    {
      title: "Basic Information",
      content: "Basic Information-content",
      icon: <InfoIcon />,
    },
    {
      title: "Functions",
      content: "Functions-content",
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
        <StepsComponent steps={steps} />
      </Container>
    </Fragment>
  );
};
export default CreateEventPage;
