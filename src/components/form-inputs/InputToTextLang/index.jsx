import SpeechToText from "@/components/form-inputs/SpeechToText";
const InputToTextLang = ({ label, name, value, onChange, required, lang,className }) => (
  <div className="select__grp">
      <label className="block text-gray-600 mb-1">{label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <SpeechToText
        type="text"
        name={name}
        placeholder={label}
        value={value}
        className={className}
        onChange={onChange}
        required={required}
        lang={lang}
      />
    </div>
);

export default InputToTextLang;
