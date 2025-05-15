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
    <div className="pipeline-tab">
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-3">
          <div className="flex justify-between items-center">
            <h4>Pipeline</h4>
            <button className="btn btn-primary">
              <Plus /> Pipeline
            </button>
          </div>
          <hr className="text-gray-500 text-sm mt-2" />
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
            <button className="btn btn-primary">
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
  );
};

export default PipelineTab;
