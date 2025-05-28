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
      {/* <style>
        {`
          .user-access-bg {
            background-image: url('${toAbsoluteUrl("/images/bg_01.png")}');
          }
          .dark .user-access-bg {
            background-image: url('${toAbsoluteUrl("/images/bg_01_dark.png")}');
          }
        `}
      </style> */}
    <div className="pipeline-tab">
      <div className="grid grid-cols-3 gap-4">


        <div className="card rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:650px] user-access-bg">
          <div className="card-header">
           <h3 className="card-title">
            Calendar Accounts
            <span class="text-secondary-foreground font-medium text-sm">
             1/5
            </span>
           </h3>
           <button className="btn kt-btn-outline">
            <i class="ki-filled ki-calendar-remove">
            </i>
            Add New
           </button>
          </div>
          <div className="card-content">
           <div class="grid gap-2.5">
            <div class="flex items-center justify-between flex-wrap border border-border rounded-xl gap-2 px-3.5 py-2.5">
             <div class="flex items-center flex-wrap gap-3.5">
              <div class="flex flex-col">
               <a class="text-sm font-medium text-mono hover:text-primary mb-px" href="#">
                Google
               </a>
               <a class="text-sm text-secondary-foreground hover:text-primary" href="#">
                jasontt@studio.co
               </a>
              </div>
             </div>
             <div className="btn kt-btn-icon kt-btn-ghost">
              <i class="ki-filled ki-trash">
              </i>
             </div>
            </div>
            <div class="flex items-center justify-between flex-wrap border border-border rounded-xl gap-2 px-3.5 py-2.5">
             <div class="flex items-center flex-wrap gap-3.5">
              <div class="flex flex-col">
               <a class="text-sm font-medium text-mono hover:text-primary mb-px" href="#">
                Monday
               </a>
               <a class="text-sm text-secondary-foreground hover:text-primary" href="#">
                jasontatum@keenthemes.com
               </a>
              </div>
             </div>
             <div className="btn kt-btn-icon kt-btn-ghost">
              <i class="ki-filled ki-trash">
              </i>
             </div>
            </div>
           </div>
          </div>
         </div>


         

        <div className="card p-3">
          <div className="flex justify-between items-center gap-2">
            <h4 className="text-base text-base leading-none font-semibold text-gray-800">Pipeline</h4>
            <button className="btn btn-sm btn-primary"><i className="ki-filled ki-plus"></i> Pipeline</button>
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
