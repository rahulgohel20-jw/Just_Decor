import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";

const AddProduct = ({ isModalOpen, setIsModalOpen }) => {
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const [activeTab, setActiveTab] = useState("tab_1");
  // const [productImage, setProductImage] = useState(null);
  // const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "tab_1":
        return (
          <div id="tab_1" className="tab-content active">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Product Name"
                />
              </div>
              <div>
                <label className="form-label">HSN Code</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="HSN Code"
                />
              </div>
              <div>
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Category"
                />
              </div>
              <div>
                <label className="form-label">Units</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Enter Units"
                />
              </div>
              <div>
                <label className="form-label">Price</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Price"
                />
              </div>
              <div>
                <label className="form-label">Max-Discount</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Max-Discount"
                />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  className="input form-control-solid w-full"
                  placeholder="Description"
                />
              </div>

              {/* Image Upload Field */}
               {/* <div>
                <label className="form-label">Custom Field</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="cursor-pointer w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-dashed border-gray-400 hover:bg-gray-200">
                    📷
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-12 h-12 rounded object-cover border"
                    />
                  )}
                </div> */}
              
            </div>
          </div>
        );

      case "tab_2":
        return (
          <div id="tab_2" className="tab-content">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Country"
                />
              </div>
              <div>
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="form-label">Pincode</label>
                <input
                  type="tel"
                  className="input form-control-solid w-full"
                  placeholder="Pincode"
                />
              </div>
              <div>
                <label className="form-label">Billing Address</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Billing Address"
                />
              </div>
              <div>
                <label className="form-label">Shipping Address</label>
                <input
                  type="text"
                  className="input form-control-solid w-full"
                  placeholder="Shipping Address"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add Product"
        footer={[
          <button
            key="cancel"
            className="btn btn-sm btn-secondary"
            onClick={handleModalClose}
            title="Cancel"
          >
            Cancel
          </button>,
          <button
            key="save"
            className="btn btn-sm btn-primary"
            title="Save Contact"
          >
            Save Product
          </button>,
        ]}
      >
        <div
          className="btn-tabs tabs-lg flex justify-between mb-5 w-full"
          data-tabs="true"
        >
          <a
            className={`btn btn-clear w-full flex justify-center ${activeTab === "tab_1" ? "active" : ""}`}
            onClick={() => setActiveTab("tab_1")}
          >
            Product Details
          </a>
          <a
            className={`btn btn-clear w-full flex justify-center ${activeTab === "tab_2" ? "active" : ""}`}
            onClick={() => setActiveTab("tab_2")}
          >
            Address Details
          </a>
        </div>
        {renderTabContent()}
      </CustomModal>
    )
  );
};

export default AddProduct;
