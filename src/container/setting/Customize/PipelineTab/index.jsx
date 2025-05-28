import { toAbsoluteUrl } from '@/utils';
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
  ];
  return (
    <>
      <div className="pipeline-tab">
        <div className="grid grid-cols-3 gap-4">
          <div className="card px-4 pt-4 rtl:[background-position:top_center] [background-position:top_center] bg-no-repeat bg-[length:650px] bg-[url('/images/bg_01.png')] dark:bg-[url('/images/bg_01_dark.png')]">
            <div className="flex flex-col items-center pt-3 pb-7.5 px-1.5">              
              <h3 className="text-mono text-lg font-semibold text-gray-800 leading-6 mb-1">Pipeline for Personal Satisfaction</h3>
              <span className="text-gray-600 text-sm text-center mb-4.5">Track goals, progress, and achievements for growth.</span>
              <button className="btn btn-sm btn-success" title="Pipeline"><i class="ki-filled ki-plus"></i>Pipeline</button>
            </div>
            <div className="card-content bg-white dark:bg-dark border-t pt-5 pb-7 px-1.5 h-full">
              <div className="flex justify-center">
                <img src={toAbsoluteUrl('/media/illustrations/3.svg')} className="dark:hidden max-h-[100px]" alt="image" />
                <img src={toAbsoluteUrl('/media/illustrations/3-dark.svg')} className="light:hidden max-h-[100px]" alt="image" />
              </div>
              <p class="text-sm text-gray-400 font-light text-center py-3">Pipeline is not available</p>             
            </div>
          </div>
          <div className="card px-4 pt-4 rtl:[background-position:top_center] [background-position:top_center] bg-no-repeat bg-[length:650px] bg-[url('/images/bg_01.png')] dark:bg-[url('/images/bg_01_dark.png')]">
            <div className="flex flex-col items-center pt-3 pb-7.5 px-1.5">              
              <h3 className="text-mono text-lg font-semibold text-gray-800 leading-6 mb-1">Pipeline Template for Personal Satisfaction</h3>
              <span className="text-gray-600 text-sm text-center mb-4.5">Clear steps to achieve goals and fulfillment.</span>
              <button className="btn btn-sm btn-success" title="Template"><i class="ki-filled ki-plus"></i>Template</button>
            </div>
            <div className="card-content bg-white dark:bg-dark border-t pt-5 pb-7 px-1.5 h-full">
              <div className="flex justify-center">
                <img src={toAbsoluteUrl('/media/illustrations/3.svg')} className="dark:hidden max-h-[100px]" alt="image" />
                <img src={toAbsoluteUrl('/media/illustrations/3-dark.svg')} className="light:hidden max-h-[100px]" alt="image" />
              </div>
              <p class="text-sm text-gray-400 font-light text-center py-3">Pipeline is not available</p>             
            </div>
          </div>
          <div className="card px-4 pt-4 rtl:[background-position:top_center] [background-position:top_center] bg-no-repeat bg-[length:650px] bg-[url('/images/bg_01.png')] dark:bg-[url('/images/bg_01_dark.png')]">
            <div className="flex flex-col items-center pt-3 pb-7.5 px-1.5">              
              <h3 className="text-mono text-lg font-semibold text-gray-800 leading-6 mb-1">Lost Reason for Personal Satisfaction</h3>
              <span className="text-gray-600 text-sm text-center mb-4.5">Tracks reasons for lost opportunities to improve outcomes.</span>
              <button className="btn btn-sm btn-success" title="Reason"><i class="ki-filled ki-plus"></i>Reason</button>
            </div>
            <div className="card-content bg-white dark:bg-dark border-t pt-5 pb-7 px-1.5 h-full">
              <div className="flex justify-center">
                <img src={toAbsoluteUrl('/media/illustrations/3.svg')} className="dark:hidden max-h-[100px]" alt="image" />
                <img src={toAbsoluteUrl('/media/illustrations/3-dark.svg')} className="light:hidden max-h-[100px]" alt="image" />
              </div>
              <p class="text-sm text-gray-400 font-light text-center py-3">Pipeline is not available</p>             
            </div>
          </div>
        </div>

        <hr className="my-10" />


        <div className="grid grid-cols-3 gap-4">
          <div className="card p-3">
            <div className="flex justify-between items-center gap-2">
              <h4 className="text-base text-base leading-none font-semibold text-gray-800">
                Pipeline
              </h4>
              <button className="btn btn-sm btn-primary">
                <i className="ki-filled ki-plus"></i> Pipeline
              </button>
            </div>
            <hr className="text-gray-500 text-sm mt-3" />
            <div className="mt-3">
              <div className="grid grid-cols-1 gap-2 lg:gap-3">
                {pipeLine.map((item, index) => {
                  return (
                    <CardList
                      key={index}
                      leftContent={item.name}
                      rightContent={
                        <>
                          <CopyPlus size={18} className="text-success" />
                          <Logs size={18} className="text-success" />
                          <Pen size={18} className="text-success" />
                          <Trash size={18} className="text-danger" />
                        </>
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="card p-3">
            <div className="flex justify-between items-center">
              <h4>Pipeline Template</h4>
            </div>
            <hr className="text-gray-500 text-sm mt-2" />
            <div className="mt-3">
              <div className="grid grid-cols-1 gap-2 lg:gap-3">
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
          </div>
          <div className="card p-3">
            <div className="flex justify-between items-center">
              <h4>Lost Reason</h4>
              <button className="btn btn-primary  btn-sm">
                <Plus /> Reason
              </button>
            </div>
            <hr className="text-gray-500 text-sm mt-2" />
            <div className="mt-3">
              <div className="grid grid-cols-1 gap-2 lg:gap-3">
                {lostReason.map((item, index) => {
                  return (
                    <CardList
                      key={index}
                      leftContent={item.name}
                      rightContent={
                        <>
                          <Pen size={18} className="text-success" />
                          <Trash size={18} className="text-danger" />
                        </>
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { PipelineTab };
