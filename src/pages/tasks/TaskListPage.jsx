import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import TabComponent from "@/components/tab/TabComponent";
import { AllTasks } from "@/container/tasks";

const TaskListPage = () => {

  const itemList = [
    {
      profile_image: "300-2.png",
      user_name: "John Doe",
      id: "1",
      title: "All TASK",
      description: "Description for task 1",
      category: "Category 1",
      priority: "High",
      created_at: "2 months ago",
      status: "Pending",
      repeated: "Daily",
    },
  ];
  const tabs = [
    {
      value: "all",
      label: (
        <>
          <i className="ki-filled ki-abstract-16"></i>
          All Tasks
        </>
      ),
      children: <AllTasks itemList={itemList}/>,
    },
    {
      value: "my",
      label: (
        <>
          <i className="ki-filled ki-check-squared"></i>
          My Tasks
        </>
      ),
      children: <AllTasks itemList={[{...itemList, title: 'MY TASKS',id: "1"}]}/>,
    },
    {
      value: "assigned_by_me",
      label: (
        <>
          <i className="ki-filled ki-user-tick"></i>
          Assigned by Me
        </>
      ),
      children: <AllTasks itemList={[{...itemList,title: 'ASSIGNED MY TASKS',id: "1"}]}/>,
    },
  ];

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Manage Tasks" }]} />
        </div>
        <TabComponent tabs={tabs} />
      </Container>
    </Fragment>
  );
};
export { TaskListPage };
