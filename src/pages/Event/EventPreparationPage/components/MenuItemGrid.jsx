const MenuItemGrid = ({ items, searchTerm, onToggleSelection, loading }) => {
const filteredItems = (items || []).filter((child) =>
  (child?.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
);


  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">Loading menu items...</div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="p-2 text-gray-400 text-xs text-center">
        No items found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {filteredItems.map(({ parentId, id, name, image, isSelected }) => (
        <div
          key={id}
          className={`flex flex-col items-start border rounded-lg cursor-pointer transition-all relative ${
            isSelected
              ? "border-success bg-green-300/10 text-success"
              : "hover:bg-blue-500/10 hover:border-blue-500/15"
          }`}
          onClick={() => onToggleSelection(id)}
        >
          <div className="w-full h-20 rounded overflow-hidden flex items-center justify-center">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full h-12 font-medium px-2 pt-2 pb-1 text-center text-xs flex items-center justify-center">
            {name}
          </div>
          {isSelected && (
            <span className="bg-success w-5 h-5 rounded-full shadow-lg shadow-green-500/50 absolute top-1 right-1 flex items-center justify-center">
              <i className="ki-filled ki-check text-sm text-light"></i>
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuItemGrid;
