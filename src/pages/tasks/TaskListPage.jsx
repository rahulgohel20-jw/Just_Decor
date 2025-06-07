import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import TabComponent from "@/components/tab/TabComponent";
import { AllTasks } from "@/container/tasks";

const TaskListPage = () => {
  const tabs = [
    {
      value: "all",
      label: "All Tasks",
      children: <AllTasks />,
    },
    {
      value: "my",
      label: "My Tasks",
      children: <AllTasks />,
    },
    {
      value: "assigned_by_me",
      label: "Assigned by Me",
      children: <AllTasks />,
    },
  ];

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Tasks" }]} />
        </div>
        <TabComponent tabs={tabs} />
      </Container>
    </Fragment>
  );
};
export { TaskListPage };
