import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GetAllRawMaterialAllocationCategory } from "@/services/apiServices";
import GrossaryItems from "./grossary_items/GrossaryItems";
import TabComponent from "@/components/tab/TabComponent";

const RawMaterialAllocation = () => {
  const location = useLocation();
  const { eventId, eventTypeId } = location.state || {};
  console.log("Received eventId:", eventId); // Debug log
  console.log("Received eventTypeId:", eventTypeId); // Debug log
  
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventTypeId) {
      fetchCategories();
    }
  }, [eventTypeId]);

  const fetchCategories = () => {
    GetAllRawMaterialAllocationCategory(eventId)
      .then((res) => {
        console.log("API Response:", res); // Debug log
        
        // Extract categories from the correct path
        const categories = res?.data?.data?.["Raw Material Category Details"] || [];
        
        console.log("Categories:", categories); // Debug log
        
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
          // Pass categoryId to each component
          children: <GrossaryItems 
            categoryId={category.id} 
            eventId={eventId} 
            eventTypeId={eventTypeId} 
          />,
        }));
        
        setTabs(dynamicTabs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setTabs([]);
        setLoading(false);
      });
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

  return (
    <div>
      <TabComponent tabs={tabs} />
    </div>
  );
};

export default RawMaterialAllocation;