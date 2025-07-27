import React, { Fragment } from "react";
import { Container } from "@/components/container";
import CalendarComponent from "@/components/CalendarComponent";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
const CalendarPage = () => {
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Events" }]} />
        </div>
        <CalendarComponent
          data={[
            {
              title: "MR KAUSHIK BRAHMBHATT",
              date: "2025-07-07",
              status: "Completed",
            },
          ]}
        />
      </Container>
    </Fragment>
  );
};
export default CalendarPage;
