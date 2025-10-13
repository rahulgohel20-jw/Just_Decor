import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GetAllRawMaterialAllocationCategory } from "@/services/apiServices";
import GrossaryItems from "./grossary_items/GrossaryItems";
import TabComponent from "@/components/tab/TabComponent";

const RawMaterialAllocation = () => {
  const location = useLocation();
  const { eventId, eventTypeId } = location.state || {};
  
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (eventTypeId) {
      fetchCategories();
    }
  }, [eventTypeId]);

  const fetchCategories = () => {
    GetAllRawMaterialAllocationCategory(eventId)
      .then((res) => {
        const categories = res?.data?.data?.["Raw Material Category Details"] || [];
        
        if (!Array.isArray(categories) || categories.length === 0) {
          console.warn("No categories found");
          setTabs([]);
          setLoading(false);
          return;
        }
        
        // Map API response to tabs format
        const dynamicTabs = categories.map((category) => ({
          value: category.id?.toString(),
          label: category.nameEnglish || category.name || "Unnamed Category",
          categoryId: category.id, // Store categoryId for later use
        }));
        
        setTabs(dynamicTabs);
        setActiveTab(dynamicTabs[0]?.value); // Set first tab as active
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setTabs([]);
        setLoading(false);
      });
  };

  // Handle tab change
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading categories...</p>
      </div>
    );
  }

  if (!eventTypeId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500">Event Type ID not found</p>
      </div>
    );
  }

  // Find the active category
  const activeCategory = tabs.find(tab => tab.value === activeTab);

  return (
    <div>
      <TabComponent 
        tabs={tabs.map(tab => ({
          ...tab,
          // Render GrossaryItems only for active tab
          children: tab.value === activeTab ? (
            <GrossaryItems 
              key={`${tab.categoryId}-${activeTab}`} // Force re-render on tab change
              categoryId={tab.categoryId} 
              eventId={eventId} 
              eventTypeId={eventTypeId} 
            />
          ) : null
        }))} 
        onTabChange={handleTabChange}
        defaultValue={activeTab}
      />
    </div>
  );
};

export default RawMaterialAllocation;