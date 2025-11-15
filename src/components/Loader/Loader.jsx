// src/components/common/Loader.jsx

export default function Loader({ size = 40, color = "#4A90E2" }) {
  return (
    <div className="flex justify-center items-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        className="animate-spin"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke={color}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
        />
      </svg>
    </div>
  );
}
