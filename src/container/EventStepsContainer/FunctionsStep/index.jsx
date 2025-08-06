import { DatePicker, Tooltip } from "antd";
import FunctionTypeDropdown from "@/components/dropdowns/FunctionTypeDropdown";
import { Textarea } from "@/components/ui/textarea";
import dayjs from "dayjs";
import { toAbsoluteUrl } from "@/utils";
import AddFunctionModal from "@/partials/modals/add-event-function/AddFunction";

import useStyles from "./style";
import { useState } from "react";

const FunctionsStep = ({ formData, setFormData }) => {
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventModalData, setEventModalData] = useState({
      customer_id: "",
      person: "",
      start_date: null,
      end_date: null,
      rate: "",
      raw_material_time: null,
      address: "",
      notes: "",
    })
  const functionDataStore = () =>{
    setFormData({
      ...formData,
      function_data: formData?.function_data ? [...formData.function_data, eventModalData] : [eventModalData],
    });

    setEventModalData({
      customer_id: "",
      person: "",
      start_date: null,
      end_date: null,
      rate: "",
      raw_material_time: null,
      address: "",
      notes: "",
    })
  }
  const handleAddFunction = () => {
    const newFunction = {
      customer_id: "",
      person: "",
      start_date: null,
      end_date: null,
      rate: "",
      raw_material_time: null,
      address: "",
      notes: "",
    };
    setFormData({
      ...formData,
      function_array: [...(formData.function_array || []), newFunction],
    });
  };

  const handleRemoveFunction = (index) => {
    // setFormData({
    //   ...formData,
    //   function_array: formData.function_array.filter((_, i) => i !== index),
    // });
    setFormData({
      ...formData,
      function_data: formData.function_data.filter((_, i) => i !== index),
    });
  };

  const handleEditFunction = (item,index) => {
      setEventModalData(item)
      setIsModalOpen(true)
  };
  const handleInputChange = ({ target: { value, name } }, index) => {
    setFormData({
      ...formData,
      function_array: formData.function_array.map((f, i) =>
        i === index ? { ...f, [name]: value } : f
      ),
    });
  };
 
  return (
    <>
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
      <div className="flex flex-col gap-3">
        {/* <div className="flex items-center grow gap-4">
          <div className="card w-full py-7 px-5 rtl:[background-position:-240px_center] [background-position:240px_center] bg-no-repeat bg-[length:500px] user-access-bg">
            <div className="flex items-center flex-wrap sm:flex-nowrap justify-between grow gap-2">
              <div className="flex items-center gap-5">
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    Function Name Here
                  </h4>
                  <p className="form-info text-gray-700 font-normal">
                    Date: 05 February 2025 to 06 February 2025
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="form-info text-gray-700 font-normal">Start</p>
                  <h4 className="text-sm font-medium text-gray-900">
                    06 February 2025
                  </h4>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="form-info text-gray-700 font-normal">
                    End Date
                  </p>
                  <h4 className="text-sm font-medium text-gray-900">
                    06 February 2025
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tooltip title="Edit Function">
              <button
                type="button"
                title="Edit Function"
                className="btn btn-sm btn-primary p-0 w-8 h-8 rounded-full flex items-center justify-center"
              >
                <i className="ki-filled ki-notepad-edit"></i>
              </button>
            </Tooltip>
            <Tooltip title="Remove Function">
              <button
                type="button"
                title="Remove Function"
                className="btn btn-sm btn-danger p-0 w-8 h-8 rounded-full flex items-center justify-center"
              >
                <i className="ki-filled ki-trash"></i>
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center grow gap-4">
          <div className="card w-full py-7 px-5 rtl:[background-position:-240px_center] [background-position:240px_center] bg-no-repeat bg-[length:500px] user-access-bg">
            <div className="flex items-center flex-wrap sm:flex-nowrap justify-between grow gap-2">
              <div className="flex items-center gap-5">
                <div className="flex flex-col gap-1">
                  <p className="form-info text-gray-700 font-normal">
                    Function Name
                  </p>
                  <h4 className="text-sm font-medium text-gray-900">
                    Function Name Here
                  </h4>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="form-info text-gray-700 font-normal">
                    Start Date
                  </p>
                  <h4 className="text-sm font-medium text-gray-900">
                    05 February 2025
                  </h4>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="form-info text-gray-700 font-normal">
                    End Date
                  </p>
                  <h4 className="text-sm font-medium text-gray-900">
                    06 February 2025
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tooltip title="Edit Function">
              <button
                type="button"
                title="Edit Function"
                className="btn btn-sm btn-primary p-0 w-8 h-8 rounded-full flex items-center justify-center"
              >
                <i className="ki-filled ki-notepad-edit"></i>
              </button>
            </Tooltip>
            <Tooltip title="Remove Function">
              <button
                type="button"
                title="Remove Function"
                className="btn btn-sm btn-danger p-0 w-8 h-8 rounded-full flex items-center justify-center"
              >
                <i className="ki-filled ki-trash"></i>
              </button>
            </Tooltip>
          </div>
        </div> */}

        {formData?.function_data ? 
          formData.function_data.map((item,index)=> {
            return <div className="flex items-center grow gap-4">
            <div className="card w-full py-7 px-5 rtl:[background-position:-240px_center] [background-position:240px_center] bg-no-repeat bg-[length:500px] user-access-bg">
              <div className="flex items-center flex-wrap sm:flex-nowrap justify-between grow gap-2">
                <div className="flex items-center gap-5">
                  <div className="flex flex-col gap-1">
                    <p className="form-info text-gray-700 font-normal">
                      Function Name
                    </p>
                    <h4 className="text-sm font-medium text-gray-900">
                     {item.customer_id ? item.customer_id.join(',') : ''}
                    </h4>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="form-info text-gray-700 font-normal">
                      Start Date
                    </p>
                    <h4 className="text-sm font-medium text-gray-900">
                      {item.start_date? dayjs(item.start_date).format("DD MMM YYYY"):''}
                    </h4>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="form-info text-gray-700 font-normal">
                      End Date
                    </p>
                    <h4 className="text-sm font-medium text-gray-900">
                      {item.end_date? dayjs(item.end_date).format("DD MMM YYYY"):''}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Tooltip title="Edit Function">
                <button
                  type="button"
                  title="Edit Function"
                  className="btn btn-sm btn-primary p-0 w-8 h-8 rounded-full flex items-center justify-center"
                  onClick={() => handleEditFunction(item,index)}
                >
                  <i className="ki-filled ki-notepad-edit"></i>
                </button>
              </Tooltip>
              <Tooltip title="Remove Function">
                <button
                  type="button"
                  title="Remove Function"
                  className="btn btn-sm btn-danger p-0 w-8 h-8 rounded-full flex items-center justify-center"
                  onClick={() => handleRemoveFunction(index)}
                >
                  <i className="ki-filled ki-trash"></i>
                </button>
              </Tooltip>
            </div>
          </div>
          }
        ): <div className="text-center text-gray-500">
              No functions added yet.
            </div>}
      </div>
      <br />
      {/* <hr />
      <br /> */}
      {/* <div className="flex flex-col gap-y-2 gap-x-4 card min-w-full py-7 px-5 user-access-b">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-4">
          <div className="flex flex-col">
            <label className="form-label">Function Name</label>
            <FunctionTypeDropdown className="w-full" />
          </div>
          <div className="flex flex-col">
            <label className="form-label">Start Date</label>
            <DatePicker className="input" />
          </div>
          <div className="flex flex-col">
            <label className="form-label">End Date</label>
            <DatePicker className="input" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
          <div className="flex flex-col">
            <label className="form-label">Notes</label>
            <Textarea
              className="textarea h-full"
              placeholder="Notes"
              rows={3}
            />
          </div>
          <div className="flex flex-col">
            <label className="form-label">Location</label>
            <Textarea
              className="textarea h-full"
              placeholder="Location"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button className="btn btn-danger" type="button">
            Remove
          </button>
        </div>
      </div> */}

      <div>
        {/* {formData &&
          formData.function_array &&
          formData.function_array.length > 0 &&
          formData.function_array.map((func, index) => (
            <div
              className={`card p-4 bg-white shadow-sm rounded-lg mb-4 ${classes.customStyle}`}
              key={index}
            >
              <div className="flex flex-col gap-y-2 gap-x-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-4">
                  <div className="flex flex-col">
                    <label className="form-label">Function Name</label>
                    <FunctionTypeDropdown
                      value={func.customer_id}
                      onChange={(e) => handleInputChange(e, index)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="form-label">Start Date</label>
                    <DatePicker
                      className="input"
                      date={func.start_date}
                      setDate={(date) =>
                        handleInputChange(
                          { target: { value: date, name: "start_date" } },
                          index
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="form-label">End Date</label>
                    <DatePicker
                      className="input"
                      date={func.end_date}
                      setDate={(date) =>
                        handleInputChange(
                          { target: { value: date, name: "end_date" } },
                          index
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex flex-col">
                    <label className="form-label">Notes</label>
                    <Textarea
                      className="textarea h-full"
                      placeholder="Notes"
                      rows={3}
                      value={func.notes}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="form-label">Location</label>
                    <Textarea
                      className="textarea h-full"
                      placeholder="Location"
                      rows={3}
                      value={func.address}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => handleRemoveFunction(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))} */}
        {/* {formData &&
          formData.function_array &&
          formData.function_array.length === 0 && (
            <div className="text-center text-gray-500">
              No functions added yet.
            </div>
          )} */}
        <div className="mt-4 text-center">
          <button
            className="btn btn-success"
            // onClick={handleAddFunction}
            onClick={()=> setIsModalOpen(true)}
            title="Add Function"
          >
            <i className="ki-filled ki-plus"></i> Function
          </button>
        </div>
      </div>

      {isModalOpen && (
          <AddFunctionModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            eventData={eventModalData}
            setEventModalData={setEventModalData}
            functionDataStore={functionDataStore}
          />
      )}
    </>
  );
};

export default FunctionsStep;
