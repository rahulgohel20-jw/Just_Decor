import React, { useState } from "react";
import { Button, message, Steps, theme } from "antd";

import {
  LoadingOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
const StepsComponent = ({ steps, current, onNext, onPrev, onFinish }) => {
  const { token } = theme.useToken();

  const contentStyle = {
    padding: 24,
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  return (
    <>
      <Steps current={current} items={steps} type="navigation" />
      <div style={contentStyle}>{steps[current].content}</div>
      <div className="mt-4 flex justify-end">
        {current > 0 && (
          <button className="btn btn-secondary mr-1" onClick={onPrev}>
            Previous
          </button>
        )}
        {current < steps.length - 1 && (
          <button className="btn btn-primary  ml-1" onClick={onNext}>
            Next
          </button>
        )}
        {current === steps.length - 1 && (
          <button className="btn btn-success ml-1" onClick={onFinish}>
            Done
          </button>
        )}
      </div>
    </>
  );
};
export default StepsComponent;
