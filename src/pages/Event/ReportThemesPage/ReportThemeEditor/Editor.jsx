import { useState } from "react";
import PreviewPane from "./PreviewPane";
import ControlPanel from "./ControlsPanel";
import EditorHeader from "./EditorHeader";

export default function ReportEditor() {
  const [design, setDesign] = useState({
    heading: "Heading",
    subHeading: "Sub Heading",
    body: "Body",
    watermark: "Watermark",
    logo: "",
    image: "",
    typography: {
      headingFont: "Montserrat",
      subHeadingFont: "Montserrat",
      bodyFont: "Montserrat",
      headingWeight: "bold",
      subHeadingWeight: "normal",
      bodyWeight: "normal",
      headingSize: 36,
      subHeadingSize: 24,
      bodySize: 16,
      textAlign: "center",
    },
    colors: {
      heading: "#000000",
      subHeading: "#555555",
      body: "#333333",
      background: "#f8f4f2",
    },
    imageSettings: {
      radius: 6,
      size: 100,
    },
  });

  const handleSave = () => {
    console.log("💾 Saving Design:", design);
    alert("Design saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 🧭 Centered Container */}
      <div className="flex-1 flex justify-center items-start p-2">
        <div className="w-full max-w-[1400px] bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
          {/* Header */}
          <EditorHeader onSave={handleSave} />

          {/* Main workspace */}
          <div className="flex flex-1 overflow-hidden gap-3">

  <div className="flex-[0.6] flex justify-center bg-gray-50 overflow-y-auto py-10 rounded-xl">
    <PreviewPane design={design} />
  </div>


  <div className="flex-[0.4] border-l  bg-white overflow-y-auto  px-6">
    <ControlPanel design={design} setDesign={setDesign} />
  </div>
</div>

        </div>
      </div>
    </div>
  );
}
