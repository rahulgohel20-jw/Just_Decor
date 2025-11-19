import { useState, useEffect } from "react";
import { GetAllCategoryformenu } from "@/services/apiServices";

const CategoryList = ({
  selectedCategory = "All",
  onCategoryChange = () => {},
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const id = localStorage.getItem("userId");
  const userId = id;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await GetAllCategoryformenu(userId);
        if (response?.data) {
          const categoryData =
            response.data.data["Menu Category Details"] || [];
          const categoryList = [
            { id: 0, name: "All" },
            ...categoryData.map((cat) => ({
              id: cat.id,
              name: cat.nameEnglish || cat.name,
            })),
          ];
          setCategories(categoryList);

          if (
            selectedCategory &&
            selectedCategory !== "All" &&
            !categoryData.find(
              (c) => (c.nameEnglish || c.name) === selectedCategory
            )
          ) {
            onCategoryChange("All", 0);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([{ id: 0, name: "All" }]); // fallback
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
            key={cat.id}
            onClick={() => onCategoryChange(cat.name, cat.id)}
            className={`cursor-pointer px-3 py-2 rounded transition-colors ${
              selectedCategory === cat.name
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
