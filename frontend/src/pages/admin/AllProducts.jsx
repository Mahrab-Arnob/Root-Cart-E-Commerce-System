import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Eye, Edit2, Trash2, X, Save, Loader2, Menu, XCircle, Package } from "lucide-react";
import toast from "react-hot-toast";

const AllProducts = () => {
  const { productsData, currency, axios, fetchProducts } = useContext(AppContext);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    offerPrice: "",
    weight: "",
    category: "",
    stock: ""
  });

  // View Product Details
  const viewProduct = (product) => {
    setViewingProduct(product);
    setMobileMenuOpen(null);
  };

  // Start Editing Product
  const startEditProduct = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name || "",
      price: product.price || "",
      offerPrice: product.offerPrice || "",
      weight: product.weight || "",
      category: product.category?._id || "",
      stock: product.stock || ""
    });
    setMobileMenuOpen(null);
  };

  // Update Product
  const updateProduct = async (id) => {
    if (!editForm.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(`/api/product/update/${id}`, editForm);
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
        setEditingProduct(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {
    try {
      const { data } = await axios.delete(`/api/product/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
        setDeletingProduct(null);
        setMobileMenuOpen(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting product");
    }
  };

  // Confirm Delete
  const confirmDelete = (product) => {
    setDeletingProduct(product);
    setMobileMenuOpen(null);
  };

  // Handle form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Close all modals
  const closeModals = () => {
    setViewingProduct(null);
    setEditingProduct(null);
    setDeletingProduct(null);
    setMobileMenuOpen(null);
    setEditForm({
      name: "",
      price: "",
      offerPrice: "",
      weight: "",
      category: "",
      stock: ""
    });
  };

  // Toggle mobile menu for a specific product
  const toggleMobileMenu = (id) => {
    setMobileMenuOpen(mobileMenuOpen === id ? null : id);
  };

  // Filter out invalid products
  const validProducts = productsData.filter(item => item && item._id);

  // Format number with commas
  const formatNumber = (num) => {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `${currency}${formatNumber(amount)}`;
  };

  return (
    <div className="py-6 md:py-12 relative">
      {/* Header */}
      <div className="px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">All Products</h1>
        <p className="text-gray-600 text-sm md:text-base mt-2 text-center md:text-left">
          Manage your product inventory
        </p>
      </div>

      {/* Mobile Stats */}
      <div className="md:hidden px-4 mt-4 mb-6">
        <div className="bg-primary/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary font-bold text-lg">{validProducts.length}</p>
              <p className="text-xs text-gray-600">Total Products</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700">Swipe left for actions</p>
              <p className="text-xs text-gray-500">or tap menu icon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Container - Mobile Cards / Desktop Table */}
      <div className="mt-4 md:mt-6 px-4 md:px-0">
        {/* Desktop Table Header - Hidden on Mobile */}
        <div className="hidden md:grid md:grid-cols-7 font-semibold text-gray-700 max-w-5xl mx-auto p-3 border-b border-gray-300">
          <div>Product</div>
          <div>Name</div>
          <div>Category</div>
          <div>Price</div>
          <div>Offer</div>
          <div>Weight</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Products List */}
        <div className="space-y-4 md:space-y-0 md:border md:border-gray-400 md:max-w-5xl md:mx-auto md:p-3">
          {validProducts.length === 0 ? (
            <div className="text-center py-12 md:py-8">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-2">Add your first product to get started</p>
            </div>
          ) : (
            <div>
              {validProducts.map((item) => {
                const isEditing = editingProduct === item._id;
                const isMenuOpen = mobileMenuOpen === item._id;
                
                return (
                  <div 
                    key={item._id}
                    className={`
                      ${isMenuOpen ? 'bg-gray-50' : 'bg-white'}
                      ${isEditing ? 'bg-yellow-50' : ''}
                      border border-gray-200 md:border-0 md:border-b last:border-b-0
                      rounded-lg md:rounded-none
                      mb-4 md:mb-0
                      overflow-hidden
                      transition-all duration-200
                    `}
                  >
                    {/* Mobile Card View */}
                    <div className="md:hidden">
                      <div className="p-4">
                        {/* Product Header with Image and Menu */}
                        <div className="flex items-start gap-3 mb-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 flex-shrink-0">
                            <img
                              src={`http://localhost:4000/uploads/${item.images?.[0] || 'default.jpg'}`}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg border"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/80";
                              }}
                            />
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg truncate">{item.name || "N/A"}</h3>
                                <p className="text-gray-600 text-sm">
                                  {item.category?.name || "No Category"}
                                </p>
                              </div>
                              <button
                                onClick={() => toggleMobileMenu(item._id)}
                                className="p-2 text-gray-500 ml-2"
                              >
                                {isMenuOpen ? <XCircle size={20} /> : <Menu size={20} />}
                              </button>
                            </div>
                            
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-2 mt-3">
                              <div className="bg-gray-50 p-2 rounded">
                                <p className="text-xs text-gray-500">Price</p>
                                <p className="font-bold text-sm">{formatCurrency(item.price || 0)}</p>
                              </div>
                              <div className="bg-gray-50 p-2 rounded">
                                <p className="text-xs text-gray-500">Offer</p>
                                <p className="font-bold text-sm text-green-600">
                                  {formatCurrency(item.offerPrice || 0)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Actions Menu */}
                        {isMenuOpen && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                onClick={() => viewProduct(item)}
                                className="flex flex-col items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-lg"
                              >
                                <Eye size={20} />
                                <span className="text-xs mt-1">View</span>
                              </button>
                              <button
                                onClick={() => startEditProduct(item)}
                                className="flex flex-col items-center justify-center p-3 bg-yellow-50 text-yellow-600 rounded-lg"
                              >
                                <Edit2 size={20} />
                                <span className="text-xs mt-1">Edit</span>
                              </button>
                              <button
                                onClick={() => confirmDelete(item)}
                                className="flex flex-col items-center justify-center p-3 bg-red-50 text-red-600 rounded-lg"
                              >
                                <Trash2 size={20} />
                                <span className="text-xs mt-1">Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Desktop Table Row */}
                    <div className="hidden md:grid md:grid-cols-7 items-center min-h-[80px] py-3 px-4 hover:bg-gray-50">
                      {/* Product Image */}
                      <div>
                        <img
                          src={`http://localhost:4000/uploads/${item.images?.[0] || 'default.jpg'}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                      
                      {/* Product Name */}
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="border border-gray-300 px-2 py-1 rounded text-sm"
                          placeholder="Product Name"
                        />
                      ) : (
                        <p className="truncate" title={item.name}>{item.name || "N/A"}</p>
                      )}
                      
                      {/* Category */}
                      {isEditing ? (
                        <input
                          type="text"
                          name="category"
                          value={editForm.category}
                          onChange={handleEditChange}
                          className="border border-gray-300 px-2 py-1 rounded text-sm"
                          placeholder="Category ID"
                        />
                      ) : (
                        <p className="truncate">{item.category?.name || "No Category"}</p>
                      )}
                      
                      {/* Price */}
                      {isEditing ? (
                        <input
                          type="number"
                          name="price"
                          value={editForm.price}
                          onChange={handleEditChange}
                          className="border border-gray-300 px-2 py-1 rounded text-sm"
                          placeholder="Price"
                        />
                      ) : (
                        <p>{formatCurrency(item.price || 0)}</p>
                      )}
                      
                      {/* Offer Price */}
                      {isEditing ? (
                        <input
                          type="number"
                          name="offerPrice"
                          value={editForm.offerPrice}
                          onChange={handleEditChange}
                          className="border border-gray-300 px-2 py-1 rounded text-sm"
                          placeholder="Offer Price"
                        />
                      ) : (
                        <p className={item.offerPrice ? 'text-green-600' : ''}>
                          {formatCurrency(item.offerPrice || 0)}
                        </p>
                      )}
                      
                      {/* Weight */}
                      {isEditing ? (
                        <input
                          type="text"
                          name="weight"
                          value={editForm.weight}
                          onChange={handleEditChange}
                          className="border border-gray-300 px-2 py-1 rounded text-sm"
                          placeholder="Weight"
                        />
                      ) : (
                        <p>{item.weight || "N/A"}</p>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center justify-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => updateProduct(item._id)}
                              disabled={loading}
                              className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
                              title="Save Changes"
                            >
                              {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <Save size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => setEditingProduct(null)}
                              className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            {/* View Button */}
                            <button
                              onClick={() => viewProduct(item)}
                              className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            
                            {/* Edit Button */}
                            <button
                              onClick={() => startEditProduct(item)}
                              className="p-2 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200 transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 size={18} />
                            </button>
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => confirmDelete(item)}
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* View Product Modal - Mobile Optimized */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center z-50 p-0 md:p-4 overflow-y-auto">
          <div className="bg-white w-full min-h-screen md:min-h-0 md:max-w-2xl md:rounded-lg md:max-h-[90vh] md:overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-4 md:p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Product Details</h2>
              <button
                onClick={() => setViewingProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:gap-6">
                {/* Images Section */}
                <div className="w-full md:w-1/2">
                  <div className="mb-4">
                    <img
                      src={`http://localhost:4000/uploads/${viewingProduct.images?.[0] || 'default.jpg'}`}
                      alt={viewingProduct.name}
                      className="w-full h-64 md:h-72 object-cover rounded-lg"
                    />
                  </div>
                  {viewingProduct.images?.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {viewingProduct.images.slice(1).map((img, idx) => (
                        <img
                          key={idx}
                          src={`http://localhost:4000/uploads/${img}`}
                          alt={`${viewingProduct.name} ${idx + 2}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Details Section */}
                <div className="w-full md:w-1/2 mt-6 md:mt-0">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold">{viewingProduct.name}</h3>
                    <p className="text-gray-600 mt-1">{viewingProduct.category?.name || "No Category"}</p>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-lg font-bold">{formatCurrency(viewingProduct.price || 0)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Offer Price</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(viewingProduct.offerPrice || 0)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="text-lg font-bold">{viewingProduct.weight || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">Stock</p>
                      <p className="text-lg font-bold">{viewingProduct.stock || "N/A"}</p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  {viewingProduct.description && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2 text-gray-800">Description</h4>
                      <p className="text-gray-600 leading-relaxed">{viewingProduct.description}</p>
                    </div>
                  )}
                  
                  {/* Product ID */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">Product ID</p>
                    <p className="text-sm font-mono break-all bg-gray-50 p-2 rounded mt-1">
                      {viewingProduct._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    startEditProduct(viewingProduct);
                    setViewingProduct(null);
                  }}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} />
                  Edit Product
                </button>
                <button
                  onClick={() => setViewingProduct(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Mobile Optimized */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center z-50 p-4 md:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-lg">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <Trash2 size={24} />
                Confirm Delete
              </h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={`http://localhost:4000/uploads/${deletingProduct.images?.[0] || 'default.jpg'}`}
                    alt={deletingProduct.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{deletingProduct.name}</h3>
                  <p className="text-gray-600 text-sm truncate">
                    {deletingProduct.category?.name || "No Category"}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm font-bold">{formatCurrency(deletingProduct.price || 0)}</span>
                    {deletingProduct.offerPrice && (
                      <span className="text-sm text-green-600 font-bold">
                        {formatCurrency(deletingProduct.offerPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="text-red-600 mr-3 text-lg">⚠️</div>
                  <div>
                    <p className="text-red-700 font-medium mb-1">Warning: Permanent Action</p>
                    <p className="text-red-600 text-sm">
                      This product will be permanently deleted. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 text-center">
                Are you sure you want to delete this product?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setDeletingProduct(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteProduct(deletingProduct._id)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      {validProducts.length > 0 && (
        <div className="md:hidden fixed bottom-6 right-6 z-40">
          <div className="bg-primary text-white rounded-full p-4 shadow-lg flex flex-col items-center justify-center">
            <Package size={20} />
            <p className="text-xs mt-1">{validProducts.length}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;