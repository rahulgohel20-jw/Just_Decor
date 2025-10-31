const CategoryList = ({
  categories,
  selectedId,
  onSelect,
  searchTerm,
  mode = "custom",
}) => {
  const filteredCategories = categories.filter(({ name }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 max-h-[520px] overflow-auto scrollable-y">
      {mode === "package" && (
        <div className="p-2 bg-blue-50 border-b border-blue-200 text-xs text-blue-700 font-medium">
          Package Mode: Categories show package items
        </div>
      )}
      {filteredCategories.length === 0 ? (
        <div className="p-2 text-gray-400 text-xs text-center">
          No categories found
        </div>
      ) : (
        filteredCategories.map(({ name, id }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`w-full text-left py-3 px-4 border-b last:border-b-0 transition-colors font-semibold text-sm ${
              selectedId === id
                ? "bg-blue-50 text-primary"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {name}
          </button>
        ))
      )}
    </div>
  );
};
export default CategoryList;
