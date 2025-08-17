import { DatePicker } from "antd";
import { Crown, Sparkles } from "lucide-react";
import useStyles from "./style";

const OtherInfoStep = ({ formData, handleInputChange }) => {
  const classes = useStyles();

  return (
    <>
      <div class="flex flex-col gap-3 lg:gap-4">
        <div class="card min-w-full">
          <div class="flex flex-col flex-1">
            <div class="flex flex-wrap items-center gap-2 p-4">
              <Crown className="text-primary" />
              <p class="text-base font-medium text-gray-900">
                Groom Information
              </p>
            </div>
            <div class="flex flex-wrap justify-between items-center border-t border-gray-200 rounded-b-xl gap-3 p-4 grid grid-cols-1 md:grid-cols-3">
              <div className="flex flex-col">
                <label className="form-label"> Instagram Link</label>
                <div className="input">
                  <i className="ki-filled ki-instagram"></i>
                  <input
                    className="h-full"
                    type="text"
                    name="groom_name"
                    placeholder="Instagram Link"
                    value={formData.groom_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="form-label"> Birth Date</label>
                <DatePicker
                  className="input"
                  placeholder="Groom Birth Date"
                  date={formData.groom_birth_date}
                  setDate={(date) =>
                    handleInputChange(
                      { target: { value: date, name: "groom_birth_date" } },
                      index
                    )
                  }
                />
              </div>
              <div className="flex flex-col">
                <label className="form-label"> Community</label>
                <div className="input">
                  <i className="ki-filled ki-autobrightness"></i>
                  <input
                    className="h-full"
                    type="text"
                    name="groom_community"
                    placeholder="Groom Community"
                    value={formData.groom_community}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card min-w-full">
          <div class="flex flex-col flex-1">
            <div class="flex flex-wrap items-center gap-2 p-4">
              <Sparkles className="text-primary" />
              <p class="text-base font-medium text-gray-900">
                Bride Information
              </p>
            </div>
            <div class="flex flex-wrap justify-between items-center border-t border-gray-200 rounded-b-xl gap-3 p-4 grid grid-cols-1 md:grid-cols-3">
              <div className="flex flex-col">
                <label className="form-label"> Instagram Link</label>
                <div className="input">
                  <i className="ki-filled ki-instagram"></i>
                  <input
                    className="h-full"
                    type="text"
                    name="bride_name"
                    placeholder="Instagram Link"
                    value={formData.bride_name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="form-label"> Birth Date</label>
                <DatePicker
                  className="input"
                  placeholder="Bride Birth Date"
                  date={formData.bride_birth_date}
                  setDate={(date) =>
                    handleInputChange(
                      { target: { value: date, name: "bride_birth_date" } },
                      index
                    )
                  }
                />
              </div>
              <div className="flex flex-col">
                <label className="form-label"> Community</label>
                <div className="input">
                  <i className="ki-filled ki-autobrightness"></i>
                  <input
                    className="h-full"
                    type="text"
                    name="bride_community"
                    placeholder="Bride Community"
                    value={formData.bride_community}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherInfoStep;
