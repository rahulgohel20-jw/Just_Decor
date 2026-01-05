import { useState, useEffect } from "react";
import { Select } from "antd";
import { GETallGodown } from "@/services/apiServices";

const PlaceSelect = ({ value, onChange }) => {
  const [options, setOptions] = useState([
    { value: "venue", label: "At venue" },
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
        const res = await GETallGodown(userId); // or however your API expects it

        if (res?.data?.data?.length) {
          const godownOptions = res.data.data.map((g) => ({
            value: g.id.toString(),
            label: g.nameEnglish,
          }));

          setOptions([{ value: "venue", label: "At venue" }, ...godownOptions]);
        }
      } catch (err) {
        console.error("Error fetching godowns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGodowns();
  }, []);

  return (
    <Select
      size="small"
      value={value}
      onChange={onChange}
      className="w-full"
      options={options}
      loading={loading}
      placeholder="Select place"
    />
  );
};

export default PlaceSelect;
