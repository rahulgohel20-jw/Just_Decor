import { toAbsoluteUrl } from "@/utils/Assets";
import { KeenIcon } from "@/components";
import AddTask from "@/partials/modals/add-task/AddTask";
import { useState } from "react";

const AllTasks = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const itemList = [
    {
      profile_image: "300-2.png",
      user_name: "John Doe",
      id: "1",
      title: "Task 1",
      description: "Description for task 1",
      category: "Category 1",
      priority: "High",
      created_at: "2 months ago",
      status: "Pending",
      repeated: "Daily",
    },
  ];

  const renderItem = (item) => {
    return (
      <div key={item.id}>
        <style>
          {`
            .user-access-bg {
              background-image: url('${toAbsoluteUrl("/images/bg_01.png")}');
            }
            .dark .user-access-bg {
              background-image: url('${toAbsoluteUrl("/images/bg_01_dark.png")}');
            }
          `}
        </style>
        <div className="flex flex-col gap-3 lg:gap-4">
          <div className="card min-w-full">
            <div className="flex flex-col flex-1">
              <div className="flex flex-wrap justify-between items-center gap-7 px-4 pt-4 rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:650px] user-access-bg">
                <div className="flex flex-wrap items-center gap-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <span>(T-{item.id})</span>
                    <div className="grid grid-col">
                      <p
                        className="text-md font-medium text-gray-900"
                        title={item.title}
                      >
                        Title: {item.title}
                      </p>
                    </div>
                    <small
                      className="text-md font-medium"
                      title={item.user_name}
                    >
                      Assign to: {item.user_name}
                    </small>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="badge badge-outline badge-secondary rounded-full badge-lg"
                    title="Status"
                  >
                    {item.status}
                  </div>
                </div>
              </div>
              <span className="text-sm px-4 pb-4" title={item.description}>
                {item.description}
              </span>
              <div className="flex flex-wrap justify-between items-center border-t border-gray-200 rounded-b-xl gap-2 px-4 py-3">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-md">
                    <i className="ki-filled ki-time me-2"></i>
                    {item.created_at}
                  </p>
                  <p className="text-md">
                    <i className="ki-filled ki-time me-2"></i>
                    {item.category}
                  </p>
                  <p className="text-md">
                    <i className="ki-filled ki-time me-2"></i>
                    {item.priority}
                  </p>
                  <p className="text-md">
                    <i className="ki-filled ki-time me-2"></i>
                    {item.repeated}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <KeenIcon
                      icon="pencil"
                      className="text-success hover:text-gray-700 cursor-pointer"
                      title="Edit Task"
                    />
                    <KeenIcon
                      icon="trash"
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      title="Delete Task"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="all-tasks">
      <div className="flex justify-end">
        <button
          className="btn btn-primary mb-4"
          onClick={() => setIsTaskModalOpen(true)}
        >
          <i className="ki-filled ki-plus"></i>
          Add Task
        </button>
      </div>
      <div>{itemList.map((item) => renderItem(item))}</div>

      <AddTask
        isModalOpen={isTaskModalOpen}
        setIsModalOpen={setIsTaskModalOpen}
      />
    </div>
  );
};

export { AllTasks };
