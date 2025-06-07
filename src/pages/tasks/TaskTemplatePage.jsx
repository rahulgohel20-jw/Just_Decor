import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";

const TaskTemplatePage = () => {
  const itemList = [
    {
      id: "1",
      template: "Task Template 1",
      template_description: "Description for task template 1",
    },
    {
      id: "2",
      template: "Task Template 2",
      template_description: "Description for task template 2",
    },
    {
      id: "3",
      template: "Task Template 3",
      template_description: "Description for task template 3",
    },
    {
      id: "4",
      template: "Task Template 4",
      template_description: "Description for task template 4",
    },
  ];

  const renderItem = (item) => {
    return (
      <div
        className="p-3 card bg-white dark:bg-dark border rounded-lg shadow-sm m-2 bg-user-access"
        key={item.id}
      >
        <h4>{item.title}</h4>
        <small>{item.template_description}</small>
      </div>
    );
  };
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Tasks Template" }]} />
        </div>
        <div className="flex justify-end">
          <button className="btn btn-sm btn-primary">
            Create New Template
          </button>
        </div>
        <div className="grid lg:grid-cols-2">
          {itemList && itemList.map((item, index) => renderItem(item))}
        </div>
      </Container>
    </Fragment>
  );
};
export { TaskTemplatePage };
