import {
  Copy,
  CopyPlus,
  Eye,
  ListOrdered,
  Logs,
  Pen,
  Plus,
  Trash,
} from "lucide-react";
import CardList from "@/components/card-list/CardList";

const LeadTab = () => {
  const pipeLine = [
    {
      id: 1,
      name: "Field 1",
      data_type: "text",
      is_required: true,
      pipeline_name: "Pipeline 1",
    },
    {
      id: 2,
      name: "Field 2",
      data_type: "number",
      is_required: false,
      pipeline_name: "Pipeline 2",
    },
    {
      id: 3,
      name: "Field 3",
      data_type: "date",
      is_required: true,
      pipeline_name: "Pipeline 3",
    },
  ];

  const sources = [
    {
      id: 1,
      name: "Source 1",
    },
    {
      id: 2,
      name: "Source 2",
    },
    {
      id: 3,
      name: "Source 3",
    },
  ];

  const tags = [
    {
      id: 1,
      name: "Tags 1",
    },
    {
      id: 2,
      name: "Tags 2",
    },
    {
      id: 3,
      name: "Tags 3",
    },
  ];
  return (
    <div className="pipeline-tab">
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-3">
          <div className="flex justify-between items-center">
            <h4>Lead Custom Fields</h4>
            <div>
              <button className="btn btn-sm btn-primary">
                <ListOrdered /> Reorder
              </button>
              <button className="btn btn-sm btn-primary ms-2">
                <Plus /> Field
              </button>
            </div>
          </div>
          <hr className="text-gray-500 text-sm mt-2" />
          <div className="mt-3">
            <div className="grid grid-cols-1 gap-2 lg:gap-3">
              {pipeLine.map((item, index) => {
                let leftContent = (
                  <div className="flex flex-col">
                    {item.name}
                    <small>
                      <b className="text-primary">Data Type: </b>
                      <span>{item.data_type}</span>
                    </small>
                    <small>
                      <b className="text-primary">Pipeline: </b>
                      <span>{item.pipeline_name}</span>
                    </small>
                    <small>
                      <b className="text-primary">Required: </b>
                      <span>{item.is_required ? "Yes" : "No"}</span>
                    </small>
                  </div>
                );
                return (
                  <CardList
                    key={index}
                    leftContent={leftContent}
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
        <div>
          <div className="card p-3">
            <div className="flex justify-between items-center">
              <h4>Source</h4>
              <button className="btn btn-primary btn-sm">
                <Plus /> Source
              </button>
            </div>
            <hr className="text-gray-500 text-sm mt-2" />
            <div className="mt-3">
              <div className="grid grid-cols-1 gap-2 lg:gap-3">
                {sources.map((item, index) => {
                  return (
                    <CardList
                      key={index}
                      leftContent={item.name}
                      rightContent={
                        <>
                          <Trash size={18} className="text-danger" />
                        </>
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="card p-3 mt-3">
            <div className="flex justify-between items-center">
              <h4>Tags</h4>
              <button className="btn btn-primary btn-sm">
                <Plus /> Tags
              </button>
            </div>
            <hr className="text-gray-500 text-sm mt-2" />
            <div className="mt-3">
              <div className="grid grid-cols-1 gap-2 lg:gap-3">
                {tags.map((item, index) => {
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
    </div>
  );
};

export { LeadTab };
