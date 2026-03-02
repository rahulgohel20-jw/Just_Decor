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
      {/* Hide Steps on mobile/tablet, show on desktop */}
      <div className="hidden lg:block">
        <Steps current={current} items={steps} type="navigation" />
      </div>

      {/* Mobile/Tablet Step Indicator */}
      <div className="lg:hidden mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            <FormattedMessage
              id="COMMON.STEP_INDICATOR"
              defaultMessage="Step {current} of {total}"
              values={{ current: current + 1, total: steps.length }}
            />
          </span>
          <span className="text-sm font-semibold text-primary">
            {steps[current]?.title}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((current + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="ant-content" style={contentStyle}>
        <div className="ant-body" style={contentStyle}>
          {steps[current].content}
        </div>
        <div className="ant-foot mt-4 flex justify-end gap-2 px-3 sm:px-0">
          {current > 0 && (
            <button
              className="btn btn-light justify-center w-24 sm:w-28 text-sm sm:text-base"
              onClick={onPrev}
              title="Prev"
            >
              <i className="ki-filled ki-arrow-left text-xs sm:text-sm"></i>{" "}
              <span className="hidden sm:inline">
                <FormattedMessage
                  id="COMMON.PREVIOUS"
                  defaultMessage="Previous"
                />
              </span>
              <span className="sm:hidden">
                <FormattedMessage id="COMMON.PREV" defaultMessage="Prev" />
              </span>
            </button>
          )}
          {current < steps.length - 1 && (
            <button
              className="btn btn-primary justify-center w-24 sm:w-28 text-sm sm:text-base"
              onClick={onNext}
              title="Next"
            >
              <span className="hidden sm:inline">
                <FormattedMessage id="COMMON.NEXT" defaultMessage="Next" />
              </span>
              <span className="sm:hidden">
                <FormattedMessage id="COMMON.NEXT" defaultMessage="Next" />
              </span>{" "}
              <i className="ki-filled ki-arrow-right text-xs sm:text-sm"></i>
            </button>
          )}
          {current === steps.length - 1 && (
            <button
              type="button"
              className="btn btn-success justify-center w-24 sm:w-28 text-sm sm:text-base"
              onClick={onFinish}
              title="Finish"
            >
              <FormattedMessage id="COMMON.FINISH" defaultMessage="Finish" />{" "}
              <i className="ki-filled ki-save-2 text-xs sm:text-sm"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepsComponent;
