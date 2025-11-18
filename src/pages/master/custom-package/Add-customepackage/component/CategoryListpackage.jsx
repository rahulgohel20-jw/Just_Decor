import React, { useState, useEffect } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { GetAllCategoryformenu } from "@/services/apiServices";

function CategoryListpackage({
  selectedCategory,
  onSelectCategory,
  setCategories,
}) {
  const [numberOfItems, setNumberOfItems] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localCategories, setLocalCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const id = localStorage.getItem("userId");
      setLoading(true);
      setError(null);
      const response = await GetAllCategoryformenu(id);
      const fetchedCategories =
        response.data.data["Menu Category Details"] || [];

      const allCategories = [
        { id: "all", nameEnglish: "All" },
        ...fetchedCategories,
      ];

      setLocalCategories(allCategories);
      setCategories(allCategories);

      setLoading(false);
    } catch (err) {
      setError("Failed to load categories");
      setLoading(false);
      console.error("Error fetching categories:", err);
    }
  };

  return (
    <div className="w-72 bg-white border border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search categories"
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white rounded-full p-1">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-gray-600">Loading categories...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-600 mb-2">{error}</p>
            <button
              onClick={fetchCategories}
              className="text-blue-600 hover:underline text-sm"
            >
              Try again
            </button>
          </div>
        ) : localCategories.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No categories found
          </div>
        ) : (
          localCategories.map((cat) => (
            <div key={cat.id}>
              <button
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-blue-50 text-primary font-medium"
                    : "text-gray-700"
                }`}
              >
                {cat.nameEnglish}
              </button>

              {selectedCategory === cat.id && (
                <div className="px-4 pb-3 bg-blue-50">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number Of Items
                  </label>
                  <input
                    type="number"
                    value={numberOfItems}
                    onChange={(e) => setNumberOfItems(e.target.value)}
                    placeholder="Enter number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryListpackage;
