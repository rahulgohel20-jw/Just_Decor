import { toAbsoluteUrl } from "@/utils";
import { Copy, CopyPlus, Eye, Logs, Pen, Plus, Trash } from "lucide-react";
import CardList from "@/components/card-list/CardList";
const PipelineTab = () => {
  const pipeLine = [
    {
      id: 1,
      name: "Pipeline 1",
    },
    {
      id: 2,
      name: "Pipeline 2",
    },
    {
      id: 3,
      name: "Pipeline 3",
    },
    {
      id: 4,
      name: "Pipeline 4",
    },
  ];

  const pipelineTemplate = [
    {
      id: 1,
      name: "Pipeline Template 1",
    },
    {
      id: 2,
      name: "Pipeline Template 2",
    },
    {
      id: 3,
      name: "Pipeline Template 3",
    },
  ];

  const lostReason = [
    {
      id: 1,
      name: "Lost Reason 1",
    },
    {
      id: 2,
      name: "Lost Reason 2",
    },
    {
      id: 3,
      name: "Lost Reason 3",
    },
    {
      id: 4,
      name: "Lost Reason 4",
    },
  ];
  return (
    <>
      <div className="pipeline-tab">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          <div className="card px-4 pt-4 rtl:[background-position:top_center] [background-position:top_center] bg-no-repeat bg-[length:650px] bg-[url('/images/bg_01.png')] dark:bg-[url('/images/bg_01_dark.png')]">
            <div className="flex flex-col items-center pt-3 pb-7.5 px-1.5">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">
                Pipeline for Personal Satisfaction
              </h3>
              <span className="text-gray-600 text-sm text-center mb-4.5 text-center">
                Track goals, progress, and achievements for growth.
              </span>
              <button className="btn btn-sm btn-success" title="Add Pipeline">
                <i className="ki-filled ki-plus"></i>Pipeline
              </button>
            </div>
            <div className="card-content bg-white dark:bg-dark border-t py-2 px-1.5 h-full">
              {pipeLine.map((item, index) => {
                return (
                  <CardList
                    key={index}
                    leftContent={item.name}
                    rightContent={
                      <>
                        <button type="button" title="Copy"><i className="ki-filled ki-copy"></i></button>
                        <button type="button" title="Edit"><i class="ki-filled ki-notepad-edit"></i></button>
                        <button type="button" title="Delete"><i class="ki-filled ki-trash"></i></button>
                      </>
                    }
                  />
                );
              })}
            </div>
          </div>
          <div className="card px-4 pt-4 rtl:[background-position:top_center] [background-position:top_center] bg-no-repeat bg-[length:650px] bg-[url('/images/bg_01.png')] dark:bg-[url('/images/bg_01_dark.png')]">
            <div className="flex flex-col items-center pt-3 pb-7.5 px-1.5">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">
                Pipeline Template for Personal Satisfaction
              </h3>
              <span className="text-gray-600 text-sm text-center mb-4.5 text-center">
                Clear steps to achieve goals and fulfillment.
              </span>
              <button className="btn btn-sm btn-success" title="Add Template">
                <i className="ki-filled ki-plus"></i>Template
              </button>
            </div>
            <div className="card-content bg-white dark:bg-dark border-t py-2 px-1.5 h-full">
              <div className="flex flex-col py-5">
                <div className="flex justify-center">
                  <img
                    src={toAbsoluteUrl("/media/illustrations/3.svg")}
                    className="dark:hidden max-h-[100px]"
                    alt="image"
                  />
                  <img
                    src={toAbsoluteUrl("/media/illustrations/3-dark.svg")}
                    className="light:hidden max-h-[100px]"
                    alt="image"
                  />
                </div>
                <p class="text-sm text-gray-400 font-light text-center py-3">
                  Template is not available
                </p>
              </div>
              {pipelineTemplate.map((item, index) => {
                  return (
                    <CardList
                      key={index}
                      leftContent={item.name}
                      rightContent={
                        <>
                          <Eye size={18} className="text-success" />
                          <Copy size={18} className="text-success" />
                        </>
                      }
                    />
                  );
                })}
            </div>
          </div>
          <div className="card px-4 pt-4 rtl:[background-position:top_center] [background-position:top_center] bg-no-repeat bg-[length:650px] bg-[url('/images/bg_01.png')] dark:bg-[url('/images/bg_01_dark.png')]">
            <div className="flex flex-col items-center pt-3 pb-7.5 px-1.5">
              <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">
                Lost Reason for Personal Satisfaction
              </h3>
              <span className="text-gray-600 text-sm text-center mb-4.5 text-center">
                Tracks reasons for lost opportunities to improve outcomes.
              </span>
              <button className="btn btn-sm btn-success" title="Add Reason">
                <i className="ki-filled ki-plus"></i>Reason
              </button>
            </div>
            <div className="card-content bg-white dark:bg-dark border-t py-2 px-1.5 h-full">
                {lostReason.map((item, index) => {
                  return (
                    <CardList
                      key={index}
                      leftContent={item.name}
                      rightContent={
                        <>
                          <button type="button" title="Edit"><i class="ki-filled ki-notepad-edit"></i></button>
                          <button type="button" title="Delete"><i class="ki-filled ki-trash"></i></button>
                        </>
                      }
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { PipelineTab };
