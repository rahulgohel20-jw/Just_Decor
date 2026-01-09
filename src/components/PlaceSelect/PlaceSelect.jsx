import { useState, useEffect } from "react";
import { Select } from "antd";
import { GETallGodown } from "@/services/apiServices";

const PlaceSelect = ({ value, onChange, className }) => {
  const [options, setOptions] = useState([
    { value: "venue", label: "At venue", id: "venue" },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGodowns = async () => {
      try {
        setLoading(true);

        // Get userId from localStorage
        const userId = localStorage.getItem("userId");

        // Validate userId
        if (!userId || userId === "undefined" || userId === "null") {
          console.warn("No valid userId found, skipping godown fetch");
          setLoading(false);
          return;
        }

        // Pass userId to the API call
        const res = await GETallGodown(userId);

        if (res?.data?.data?.length) {
          const godownOptions = res.data.data.map((g) => ({
            value: g.nameEnglish, // ✅ Changed to nameEnglish for display
            label: g.nameEnglish,
            id: g.id, // ✅ Keep the ID in a separate property
          }));

          setOptions([
            { value: "At venue", label: "At venue", id: "venue" },
            ...godownOptions,
          ]);
        }
      } catch (err) {
        console.error("Error fetching godowns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGodowns();
  }, []);

  // ✅ Custom onChange to pass both name and ID
  const handleChange = (selectedValue, option) => {
    // Pass both the name (value) and ID to the parent
    onChange(selectedValue, option.id);
  };

  return (
    <Select
      size="medium"
      value={value}
      onChange={handleChange}
      className="w-full h-10"
      options={options}
      loading={loading}
      placeholder="Select place"
    />
  );
};

export default PlaceSelect;
