import React, { useState, useEffect } from 'react';
import { X, Loader2, Package, Check } from 'lucide-react';
import { GetCustomPackageapi } from '@/services/apiServices';

export default function CustomPackageModal({ isOpen, onClose, userId, onPackageSelect }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPackageId, setSelectedPackageId] = useState(null);

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
      
      const packageList = response.data?.data?.['Package Details'] || [];
      
      const mappedPackages = packageList.map((pkg, index) => ({
        id: pkg.id,
        name: pkg.nameEnglish,
        nameGujarati: pkg.nameGujarati,
        nameHindi: pkg.nameHindi,
        price: pkg.price,
        color: getColorByIndex(index),
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

  const getColorByIndex = (index) => {
    const colors = [
      { bg: 'bg-green-50', icon: 'bg-green-100', iconColor: 'text-green-600', text: 'text-green-600', border: 'border-green-200' },
      { bg: 'bg-purple-50', icon: 'bg-purple-100', iconColor: 'text-purple-600', text: 'text-purple-600', border: 'border-purple-200' },
      { bg: 'bg-cyan-50', icon: 'bg-cyan-100', iconColor: 'text-cyan-600', text: 'text-cyan-600', border: 'border-cyan-200' },
    ];
    return colors[index % colors.length];
  };

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

  const handleSelectPackage = (pkg) => {
    setSelectedPackageId(pkg.id);
    
    setTimeout(() => {
      const packageItems = pkg.categories.flatMap((cat, catIndex) =>
        cat.items.map((item, itemIndex) => ({
          id: `pkg-${pkg.id}-cat-${catIndex}-item-${itemIndex}-${Date.now()}`,
          name: item.name,
          price: item.price,
          instruction: item.instruction,
          itemNotes: item.instruction || "",
          categoryName: cat.menuName,
          menuName: cat.menuName,
          image: '',
          parentId: null,
        }))
      );
      
      console.log("📦 CATEGORIES:", pkg.categories);
      console.log("📦 PACKAGE ITEMS TO SEND:", packageItems);
      console.log("📦 TOTAL ITEMS:", packageItems.length);
      
      if (onPackageSelect) {
        onPackageSelect(packageItems);
      }
      onClose();
      setSelectedPackageId(null);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header - Gradient Only */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Custom Packages</h2>
              <p className="text-blue-100 text-sm">Choose the perfect package for your needs</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content - Simple Background */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)] bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
              <span className="text-gray-600 font-medium">Loading packages...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-600 mb-6 font-medium">{error}</p>
              <button
                onClick={fetchPackages}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Try Again
              </button>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No packages available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`${pkg.color.bg} rounded-2xl p-6 transition-all duration-300 border ${pkg.color.border} hover:shadow-lg`}
                >
                  {/* Package Header */}
                  <div className="mb-6">
                    <div className={`w-12 h-12 ${pkg.color.icon} rounded-xl flex items-center justify-center mb-4`}>
                      <Package className={`w-6 h-6 ${pkg.color.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-500">₹</span>
                      <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                      <span className="text-sm text-gray-500">/pkg</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-6">
                    Everything in {pkg.name}, and:
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    {pkg.categories && pkg.categories.length > 0 ? (
                      pkg.categories.flatMap((category) =>
                        category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start gap-3">
                            <div className={`w-5 h-5 ${pkg.color.icon} rounded flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <Check className={`w-3.5 h-3.5 ${pkg.color.iconColor}`} />
                            </div>
                            <span className="text-sm text-gray-700">{item.name}</span>
                          </div>
                        ))
                      )
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-4">No items available</p>
                    )}
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={() => handleSelectPackage(pkg)}
                    disabled={selectedPackageId === pkg.id}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                      selectedPackageId === pkg.id
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                    }`}
                  >
                    {selectedPackageId === pkg.id ? 'Selected' : 'Get Started'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}