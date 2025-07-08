import { DatePicker } from "antd";
import MealTypeDropdown from "@/components/dropdowns/MealTypeDropdown";
import { Textarea } from "@/components/ui/textarea";

const MealAndNoteStep = ({ formData, handleInputChange }) => {
  return (
    <div>
      <div className="flex flex-col gap-y-2 gap-x-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-y-2 gap-x-4">
          <div className="flex flex-col">
            <label className="form-label">Meal Type</label>
            <MealTypeDropdown
              value={formData.meal_type}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>

          <div className="flex flex-col">
            <label className="form-label">Meal Notes</label>
            <Textarea
              className="textarea h-full"
              placeholder="Description"
              rows={3}
              value={formData.meal_notes}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealAndNoteStep;
