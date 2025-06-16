import { ListOrdered, Pen, Plus, Trash } from "lucide-react";
import CardList from "@/components/card-list/CardList";

const ProductTab = () => {
  const product = [
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

  return (
    <div className="pipeline-tab">
      <div className="grid lg:grid-cols-1 md:grid-cols-1grid-cols-1 gap-4">
        <div className="card px-4 pt-4 rtl:[background-position:top_center] [background-position:top_center] bg-no-repeat bg-[length:650px] bg-[url('/images/bg_01.png')] dark:bg-[url('/images/bg_01_dark.png')]">
          <div className="flex flex-col items-center pt-3 pb-7.5 px-1.5">
            <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">
              Product Custom Fields
            </h3>
            <span className="text-gray-600 text-sm text-center mb-4.5 text-center">
              Track goals, progress, and achievements for growth.
            </span>
            <button
              className="btn btn-sm btn-success"
              title="Add Product Field"
            >
              <i className="ki-filled ki-plus"></i>Product Field
            </button>
          </div>
          <div className="card-content bg-white dark:bg-dark border-t py-2 px-1.5 h-full">
            {product && product.length > 0 ? (
              product.map((item, index) => {
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
                        <button type="button" title="Edit">
                          <i className="ki-filled ki-notepad-edit"></i>
                        </button>
                        <button type="button" title="Delete">
                          <i className="ki-filled ki-trash"></i>
                        </button>
                      </>
                    }
                  />
                );
              })
            ) : (
              <EmptyData />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProductTab };
