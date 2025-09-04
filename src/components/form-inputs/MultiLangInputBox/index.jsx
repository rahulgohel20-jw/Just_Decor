import InputToTextLang from "../InputToTextLang";
const MultiLangInputBox = ({ formData, setFormData, name, label, error }) => {
  return (
    <>
      <InputToTextLang
        type="text"
        label={`${label} (English)`}
        name={`${name}English`}
        placeholder={label}
        value={formData[`${name}English`] || ""}
        className="border border-gray-300 rounded-lg p-2 w-full"
        onChange={(e) =>
          setFormData({ ...formData, [`${name}English`]: e.target.value })
        }
        required
        lang={"en"}
        error={error}
      />
      <InputToTextLang
        type="text"
        label={`${label} (Gujarati)`}
        name={`${name}Gujarati`}
        placeholder={label}
        value={formData[`${name}Gujarati`] || ""}
        className="border border-gray-300 rounded-lg p-2 w-full"
        onChange={(e) =>
          setFormData({ ...formData, [`${name}Gujarati`]: e.target.value })
        }
        lang={"gu"}
      />
      <InputToTextLang
        type="text"
        label={`${label} (Hindi)`}
        name={`${name}Hindi`}
        placeholder={label}
        value={formData[`${name}Hindi`] || ""}
        className="border border-gray-300 rounded-lg p-2 w-full"
        onChange={(e) =>
          setFormData({ ...formData, [`${name}Hindi`]: e.target.value })
        }
        lang={"hi"}
      />
    </>
  );
};

export default MultiLangInputBox;
