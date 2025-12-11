import { Form, Input, Select } from "antd";

const RenderAllocationFields = ({ fields, onAddClick, form }) => {
  return (
    <>
      {fields.map((f) => (
        <Form.Item
          key={f.name}
          label={
            <span className="text-[#6A7C94] text-base font-medium mt-3">
              {f.label}
            </span>
          }
          name={f.name}
        >
          {f.type === "input" ? (
            <Input
              placeholder={f.placeholder || f.label}
              className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9]"
            />
          ) : (
            <div className="flex">
              <Select
                showSearch
                optionFilterProp="label"
                value={form.getFieldValue(f.name)} // <—— ADD THIS
                placeholder={f.placeholder || f.label}
                className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] w-full"
                options={f.options || []}
                onChange={(value) => {
                  form.setFieldsValue({ [f.name]: value });
                  if (f.onChange) f.onChange(value);
                }}
              />

              {f.showAddButton && (
                <button
                  type="button"
                  className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-r-xl shadow hover:scale-105 transition"
                  onClick={() => onAddClick(f.name)}
                >
                  <i className="ki-filled ki-plus"></i>
                </button>
              )}
            </div>
          )}
        </Form.Item>
      ))}
    </>
  );
};

export default RenderAllocationFields;
