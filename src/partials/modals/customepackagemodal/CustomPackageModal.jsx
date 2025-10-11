import React, { useState, useEffect } from 'react';
import { X, Sun, Loader2 } from 'lucide-react';
import { GetCustomPackageapi } from '@/services/apiServices'; // Update the path to your API file

export default function CustomPackageModal({ isOpen, onClose, userId }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchPackages();
    }
  }, [isOpen, userId]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await GetCustomPackageapi(userId);
      
      // Extract the array from the nested response structure
      const packageList = response.data?.data?.['Package Details'] || [];
      
      // Map API response to your package structure
      const mappedPackages = packageList.map((pkg, index) => ({
        id: pkg.id,
        name: pkg.nameEnglish,
        nameGujarati: pkg.nameGujarati,
        nameHindi: pkg.nameHindi,
        price: pkg.price,
        color: getColorByIndex(index), // Rotate colors
        categories: extractCategoriesFromPackage(pkg)
      }));
      
      setPackages(mappedPackages);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load packages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get color by index
  const getColorByIndex = (index) => {
    const colors = ['red', 'green', 'blue'];
    return colors[index % colors.length];
  };

  // Extract categories with items from customPackageDetails
  const extractCategoriesFromPackage = (pkg) => {
    const categories = [];
    
    if (pkg.customPackageDetails && Array.isArray(pkg.customPackageDetails)) {
      pkg.customPackageDetails.forEach(menu => {
        const categoryItems = [];
        
        if (menu.customPackageMenuItemDetails && Array.isArray(menu.customPackageMenuItemDetails)) {
          menu.customPackageMenuItemDetails.forEach(item => {
            categoryItems.push({
              name: item.itemName,
              price: item.itemPrice,
              instruction: item.itemInstruction
            });
          });
        }
        
        if (categoryItems.length > 0) {
          categories.push({
            menuName: menu.menuName,
            items: categoryItems,
            anyItem: menu.anyItem
          });
        }
      });
    }
    
    return categories;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">Custom Package</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading packages...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchPackages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No packages available</p>
            </div>
          ) : (
     <div
  className="flex gap-6 overflow-x-auto pb-4 px-2"
  style={{
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(156,163,175,0.4) transparent',
  }}
>
  {packages.map((pkg) => (
    <div
      key={pkg.id}
      className="min-w-[340px] max-w-[340px] bg-gradient-to-br from-white to-gray-50 rounded-t-[10rem] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex-shrink-0 border border-gray-100 relative overflow-hidden group"
      style={{
        scrollSnapAlign: 'center',
        scrollbarWidth: 'none',
      }}
    >
      {/* Header */}
<div
  className="relative bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center pb-8 pt-6 rounded-t-2xl overflow-hidden"
>
  {/* <svg
    className="absolute bottom-0 left-0 w-full"
    viewBox="0 0 500 50"
    preserveAspectRatio="none"
  >
    <path
      d="M0,30 C150,70 350,0 500,30 L500,00 L0,0 Z"
      fill="white"
      opacity="0.9"
    ></path>
  </svg> */}
  <div className="relative z-10">
    <div className="w-14 h-14 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center shadow-sm">
      <Sun className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-lg font-semibold tracking-wide">{pkg.name}</h3>
    <p className="text-xs opacity-80 mt-0.5">Custom Package</p>
  </div>
</div>




      {/* Categories */}
      <div className="p-5 space-y-4">
  {pkg.categories && pkg.categories.length > 0 ? (
    pkg.categories.map((category, catIndex) => {
      const bgColors = [
        "from-blue-50 via-sky-50 to-blue-100",
        "from-indigo-50 via-blue-50 to-sky-100",
        "from-sky-50 via-cyan-50 to-blue-100",
      ];
      const bg = bgColors[catIndex % bgColors.length];
      return (
        <div
          key={catIndex}
          className={`rounded-xl p-3 transition-all duration-300 border border-blue-100 bg-gradient-to-br ${bg} hover:shadow-md`}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-blue-700 font-medium text-sm">
              {category.menuName}
            </h4>
            {category.anyItem > 0 && (
              <span className="text-xs text-blue-700 font-normal bg-white/60 px-2 py-0.5 rounded-full shadow-sm border border-blue-100">
                Any {category.anyItem}
              </span>
            )}
          </div>
          <ul className="space-y-1.5 pl-2">
            {category.items.map((item, itemIndex) => (
              <li key={itemIndex} className="text-xs text-gray-600 flex items-start">
                • {item.name}
              </li>
            ))}
          </ul>
        </div>
      );
    })
  ) : (
    <p className="text-gray-400 text-sm text-center">No items available</p>
  )}
</div>



      {/* Subtle hover glow */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-gray-200 transition-all duration-300 pointer-events-none" />
    </div>
  ))}
</div>



          )}
        </div>
      </div>
    </div>
  );
}