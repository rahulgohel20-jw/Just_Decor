import { Steps, theme } from "antd";
import useStyles from "./style";
import { FormattedMessage } from "react-intl";
import { useLanguage } from "@/i18n";
const StepsComponent = ({ steps, current, onNext, onPrev, onFinish }) => {
  const classes = useStyles();

  const { direction } = useLanguage();

  const contentStyle = {
    // padding: 24,
    // color: token.colorTextTertiary,
    // borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
    // marginTop: 16,
  };
  return (
    <div className={`${classes.customSteps} customStepsCommon`}>
      <Steps current={current} items={steps} type="navigation" />
      <div className="ant-content" style={contentStyle}>
        <div className="ant-body" style={contentStyle}>
          {steps[current].content}
        </div>
        <div className="ant-foot mt-4 flex justify-end gap-2">
          {current > 0 && (
            <button
              className="btn btn-light justify-center w-28"
              onClick={onPrev}
              title="Prev"
            >
              <i className="ki-filled ki-arrow-left font-14"></i>{" "}
              <FormattedMessage
                id="COMMON.PREVIOUS"
                defaultMessage="Previous"
              />
            </button>
          )}
          {current < steps.length - 1 && (
            <button
              className="btn btn-primary justify-center w-28"
              onClick={onNext}
              title="Next"
            >
              <FormattedMessage id="COMMON.NEXT" defaultMessage="Next" />{" "}
              <i className="ki-filled ki-arrow-right font-14"></i>
            </button>
          )}
          {current === steps.length - 1 && (
            <button
              type="button"
              className="btn btn-success justify-center w-28"
              onClick={onFinish}
              title="Finish"
            >
              <FormattedMessage id="COMMON.FINISH" defaultMessage="Finish" />{" "}
              <i className="ki-filled ki-save-2 font-14"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default StepsComponent;
