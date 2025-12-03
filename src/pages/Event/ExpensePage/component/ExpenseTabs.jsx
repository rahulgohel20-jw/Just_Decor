// ExpenseTabs.jsx
export default function ExpenseTabs({ activeTab, setActiveTab }) {
  const tabs = ["supplier", "customer", "manager"];

  return (
    <div className="flex gap-6 mb-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === tab
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
}
