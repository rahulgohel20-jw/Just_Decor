import { useState } from "react";
import { CheckSquare, Square } from "lucide-react";
import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";

const checklistItems = [
  "Create role and permission. Go to the settings > Click on Role and Permission > Add Role",
  "Add CRM members",
  "Add Pipelines and stages. Go to settings > Customize > Click on Pipelines",
  "Try predefined pipeline templates",
  "Connect your own WhatsApp number to send notification & reminder from your company's number",
  "Define product units and product category",
  "Define lead source type",
  "Customize your own lead form by adding custom field",
  "Create Tags for leads",
  "Invite users",
  "Assign leads",
  "Create follow-up tasks",
  "Track activity logs",
  "Use filters in lead table",
  "Add support tickets",
  "Connect email service",
  "Setup company profile",
  "Enable notifications",
  "Access mobile app",
  "Explore analytics dashboard",
];

export const ProgressChecklistPage = () => {
  const [completedItems, setCompletedItems] = useState([]);

  const toggleComplete = (index) => {
    setCompletedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const progressPercent = Math.round(
    (completedItems.length / checklistItems.length) * 100
  );

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Progress Checklist" }]} />
        </div>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Your Progress: {completedItems.length} / {checklistItems.length}
          </h2>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {progressPercent}%
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white border rounded-lg shadow-sm">
          {checklistItems.map((item, index) => {
            const isDone = completedItems.includes(index);
            return (
              <div
                key={index}
                className={`flex items-start justify-between px-4 py-3 border-b hover:bg-gray-50 cursor-pointer transition`}
                onClick={() => toggleComplete(index)}
              >
                <div className="flex items-start gap-3">
                  {isDone ? (
                    <CheckSquare className="text-red-600 mt-1" size={20} />
                  ) : (
                    <Square className="text-gray-400 mt-1" size={20} />
                  )}
                  <span
                    className={`text-sm ${
                      isDone ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {index + 1}. {item}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Fragment>
  );
};

export default ProgressChecklistPage;
