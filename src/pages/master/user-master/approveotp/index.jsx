import { useEffect, useRef, useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { updateStatusApprove } from "@/services/apiServices";
import { message } from "antd";

const OTP_LENGTH = 6;

const ApproveOtp = ({ isModalOpen, setIsModalOpen, userId, refreshData }) => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(37);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!isModalOpen || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) {
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimer(37);
    }
  }, [isModalOpen]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // ⌫ Backspace support
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== OTP_LENGTH) {
      message.warning("Please enter complete OTP");
      return;
    }

    try {
      const res = await updateStatusApprove(enteredOtp, userId);

      if (res?.data?.success) {
        message.success("User approved successfully");
        setIsModalOpen(false);
        setOtp(Array(OTP_LENGTH).fill(""));
        refreshData();
      } else {
        message.error(res?.data?.msg || "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to verify OTP");
    }
  };

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(37);
    inputsRef.current[0]?.focus();
    // 🔗 Resend OTP API here
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="OTP For Approval"
        width={420}
        footer={null}
      >
        <div className="flex flex-col items-center px-4 sm:px-6 py-6 text-center">
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900">
            OTP Verification For Approve
          </h2>

          {/* Description */}
          <p className="mt-2 text-sm text-gray-500 max-w-xs">
            Please enter the one time password to verify your account.
          </p>

          {/* Mobile Number */}
          <p className="mt-3 text-sm text-gray-700">
            A code has been sent to{" "}
            <span className="font-semibold">8866889580</span>
          </p>

          {/* OTP Inputs */}
          <div className="mt-6 flex gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="
                  w-10 h-12 sm:w-12 sm:h-14
                  rounded-lg border border-gray-300
                  text-center text-lg font-semibold
                  focus:outline-none focus:border-primary
                "
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            className="
              mt-6 w-full max-w-sm
              rounded-lg bg-primary py-3
              text-sm font-semibold text-white
              hover:bg-Primary transition
            "
          >
            Verify &amp; Proceed
          </button>
        </div>
      </CustomModal>
    )
  );
};

export default ApproveOtp;
