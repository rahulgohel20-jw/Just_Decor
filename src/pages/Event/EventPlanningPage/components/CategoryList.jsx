import { useState, useEffect } from "react";
import { GetAllCategoryformenu } from "@/services/apiServices";

const CategoryList = ({
  selectedCategory = "All",
  onCategoryChange = () => {},
}) => {
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);
  const id = localStorage.getItem("userId");
  const userId = id;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await GetAllCategoryformenu(userId);
        if (response?.data) {
          const categoryNames = (
            response.data.data["Menu Category Details"] || []
          ).map((cat) => cat.nameEnglish || cat.name);
          setCategories(["All", ...categoryNames]);
          if (
            selectedCategory &&
            selectedCategory !== "All" &&
            !categoryNames.includes(selectedCategory)
          ) {
            onCategoryChange("All");
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(["All"]); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full p-3 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full p-3">
      <div className="flex flex-col gap-2">
        {categories.map((cat) => (
          <div
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`cursor-pointer px-3 py-2 ${selectedCategory === cat ? "bg-blue-100 text-blue-600 font-semibold" : "text-gray-700"}`}
          >
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
