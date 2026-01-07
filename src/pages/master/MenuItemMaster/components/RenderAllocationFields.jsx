import { Form, Input, Select } from "antd";
import { useEffect, useState } from "react";

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
            <SelectWithRefresh field={f} form={form} onAddClick={onAddClick} />
          )}
        </Form.Item>
      ))}
    </>
  );
};

// Separate component to handle Select refresh
const SelectWithRefresh = ({ field, form, onAddClick }) => {
  const [selectKey, setSelectKey] = useState(0);
  const formValue = Form.useWatch(field.name, form);

  useEffect(() => {
    // Force re-render when options are loaded and we have a value
    if (field.options && field.options.length > 0 && formValue) {
      setSelectKey((prev) => prev + 1);
    }
  }, [field.options?.length, formValue]);

  return (
    <div className="flex">
      <Select
        key={selectKey}
        showSearch
        optionFilterProp="label"
        value={formValue}
        placeholder={field.placeholder || field.label}
        className="bg-[#F8FAFC] h-10 hover:border-[#d9d9d9] w-full"
        options={field.options || []}
        onChange={(value) => {
          form.setFieldsValue({ [field.name]: value });
          if (field.onChange) field.onChange(value);
        }}
      />

      {field.showAddButton && (
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-r-xl shadow hover:scale-105 transition"
          onClick={() => onAddClick(field.name)}
        >
          <i className="ki-filled ki-plus"></i>
        </button>
      )}
    </div>
  );
};

export default RenderAllocationFields;
