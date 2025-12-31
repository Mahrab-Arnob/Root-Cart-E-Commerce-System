import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Eye, Edit2, Trash2, X, Save, Loader2, Image, Menu, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const AllCategories = () => {
  const { categoriesData, axios, fetchCategories } = useContext(AppContext);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    image: ""
  });
  const [newImage, setNewImage] = useState(null);

  // View Category Details
  const viewCategory = (category) => {
    setViewingCategory(category);
    setMobileMenuOpen(null);
  };

  // Start Editing Category
  const startEditCategory = (category) => {
    setEditingCategory(category._id);
    setEditForm({
      name: category.name || "",
      image: category.image || ""
    });
    setNewImage(null);
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

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setNewImage(file);
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm(prev => ({
          ...prev,
          image: e.target.result // Show base64 preview
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Update Category
  const updateCategory = async (id) => {
    if (!editForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', editForm.name);
      if (newImage) {
        formData.append('image', newImage);
      }

      const { data } = await axios.put(`/api/category/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (data.success) {
        toast.success(data.message);
        fetchCategories();
        setEditingCategory(null);
        setNewImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating category");
    } finally {
      setLoading(false);
    }
  };

  // Delete Category
  const deleteCategory = async (id) => {
    try {
      const { data } = await axios.delete(`/api/category/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchCategories();
        setDeletingCategory(null);
        setMobileMenuOpen(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting category");
    }
  };

  // Confirm Delete
  const confirmDelete = (category) => {
    setDeletingCategory(category);
    setMobileMenuOpen(null);
  };

  // Close all modals
  const closeModals = () => {
    setViewingCategory(null);
    setEditingCategory(null);
    setDeletingCategory(null);
    setEditForm({
      name: "",
      image: ""
    });
    setNewImage(null);
    setMobileMenuOpen(null);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle mobile menu for a specific category
  const toggleMobileMenu = (id) => {
    setMobileMenuOpen(mobileMenuOpen === id ? null : id);
  };

  // Filter out invalid categories
  const validCategories = categoriesData.filter(item => item && item._id);

  return (
    <div className="py-6 md:py-12 relative">
      {/* Header */}
      <div className="px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">All Categories</h1>
        <p className="text-gray-600 text-sm md:text-base mt-2 text-center md:text-left">
          Manage your product categories
        </p>
      </div>

      {/* Mobile Stats */}
      <div className="md:hidden px-4 mt-4 mb-6">
        <div className="bg-primary/10 rounded-lg p-4">
          <p className="text-center text-primary font-medium">
            {validCategories.length} {validCategories.length === 1 ? 'Category' : 'Categories'}
          </p>
          <p className="text-xs text-gray-500 text-center mt-1">Swipe left to see actions</p>
        </div>
      </div>

      {/* Categories List - Desktop Table / Mobile Cards */}
      <div className="mt-4 md:mt-6 px-4 md:px-0">
        {/* Desktop Table Header - Hidden on Mobile */}
        <div className="hidden md:grid md:grid-cols-3 font-semibold text-gray-700 max-w-5xl mx-auto p-3 border-b border-gray-300">
          <div className="pl-4">Image & Name</div>
          <div>Details</div>
          <div className="text-center">Actions</div>
        </div>

        {/* Categories Container */}
        <div className="space-y-4 md:space-y-0 md:border md:border-gray-400 md:max-w-5xl md:mx-auto md:p-3">
          {validCategories.length === 0 ? (
            <div className="text-center py-12 md:py-8">
              <Image size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-lg">No categories found</p>
              <p className="text-gray-400 text-sm mt-2">Add your first category to get started</p>
            </div>
          ) : (
            <div className="md:space-y-0">
              {validCategories.map((item) => {
                const isEditing = editingCategory === item._id;
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
                      transition-all duration-200
                    `}
                  >
                    {/* Mobile Card View */}
                    <div className="md:hidden p-4">
                      {/* Mobile Header with Toggle */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 flex-shrink-0">
                            <img
                              src={`http://localhost:4000/uploads/${item.image || 'default-category.jpg'}`}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/80";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg truncate">{item.name || "N/A"}</h3>
                            <p className="text-gray-500 text-sm truncate">
                              ID: {item._id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleMobileMenu(item._id)}
                          className="p-2 text-gray-500"
                        >
                          {isMenuOpen ? <XCircle size={20} /> : <Menu size={20} />}
                        </button>
                      </div>

                      {/* Mobile Menu Actions */}
                      {isMenuOpen && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => viewCategory(item)}
                              className="flex flex-col items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-lg"
                            >
                              <Eye size={20} />
                              <span className="text-xs mt-1">View</span>
                            </button>
                            <button
                              onClick={() => startEditCategory(item)}
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

                    {/* Desktop Table Row */}
                    <div className="hidden md:grid md:grid-cols-3 items-center min-h-[80px] py-3 px-4 hover:bg-gray-50">
                      {/* Image & Name Column */}
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 flex-shrink-0">
                          {isEditing ? (
                            <div className="relative">
                              <img
                                src={editForm.image.startsWith('data:') || editForm.image.startsWith('blob:') 
                                  ? editForm.image 
                                  : `http://localhost:4000/uploads/${editForm.image}`}
                                alt="Preview"
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                              <label className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer text-xs">
                                <Edit2 size={12} />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          ) : (
                            <img
                              src={`http://localhost:4000/uploads/${item.image || 'default-category.jpg'}`}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/80";
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              type="text"
                              name="name"
                              value={editForm.name}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              placeholder="Category Name"
                            />
                          ) : (
                            <>
                              <p className="font-semibold truncate">{item.name || "N/A"}</p>
                              <p className="text-gray-500 text-sm truncate">
                                ID: {item._id.substring(0, 12)}...
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Details Column */}
                      <div className="px-4">
                        {isEditing ? (
                          <div className="text-xs text-gray-500">
                            <p>Click image icon to change</p>
                            <p className="mt-1">Press Save to update</p>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">
                            <p>Created: {formatDate(item.createdAt)}</p>
                            <p className="mt-1">Click actions to manage</p>
                          </div>
                        )}
                      </div>

                      {/* Actions Column */}
                      <div className="flex justify-center">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCategory(item._id)}
                              disabled={loading}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                              title="Save Changes"
                            >
                              {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Save size={16} />
                              )}
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingCategory(null);
                                setNewImage(null);
                              }}
                              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm"
                              title="Cancel"
                            >
                              <X size={16} />
                              <span>Cancel</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => viewCategory(item)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => startEditCategory(item)}
                              className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                              title="Edit Category"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => confirmDelete(item)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Delete Category"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
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

      {/* View Category Modal - Mobile Optimized */}
      {viewingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center z-50 p-0 md:p-4 overflow-y-auto">
          <div className="bg-white w-full min-h-screen md:min-h-0 md:max-w-md md:rounded-lg md:max-h-[90vh] md:overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-4 md:p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Category Details</h2>
              <button
                onClick={() => setViewingCategory(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 md:p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-48 h-48 md:w-56 md:h-56 mb-4">
                  <img
                    src={`http://localhost:4000/uploads/${viewingCategory.image || 'default-category.jpg'}`}
                    alt={viewingCategory.name}
                    className="w-full h-full object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300";
                    }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-center">{viewingCategory.name}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Category ID</p>
                    <p className="font-mono text-sm break-all">{viewingCategory._id}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Created</p>
                    <p className="font-medium text-sm">{formatDate(viewingCategory.createdAt)}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Image URL</p>
                  <p className="text-sm break-all text-gray-700">
                    {`http://localhost:4000/uploads/${viewingCategory.image}`}
                  </p>
                </div>
                
                {viewingCategory.description && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-800">Description</h4>
                    <p className="text-gray-700">{viewingCategory.description}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    startEditCategory(viewingCategory);
                    setViewingCategory(null);
                  }}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-medium"
                >
                  Edit Category
                </button>
                <button
                  onClick={() => setViewingCategory(null)}
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
      {deletingCategory && (
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
                    src={`http://localhost:4000/uploads/${deletingCategory.image || 'default-category.jpg'}`}
                    alt={deletingCategory.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate">{deletingCategory.name}</h3>
                  <p className="text-gray-600 text-sm truncate">ID: {deletingCategory._id.substring(0, 16)}...</p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="text-red-600 mr-3 text-lg">⚠️</div>
                  <div>
                    <p className="text-red-700 font-medium mb-1">Important Notice</p>
                    <p className="text-red-600 text-sm">
                      Deleting this category will affect all products under it. 
                      Please reassign products first.
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 text-center">
                Are you sure you want to delete this category?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setDeletingCategory(null)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteCategory(deletingCategory._id)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Action Button */}
      {validCategories.length > 0 && (
        <div className="md:hidden fixed bottom-6 right-6 z-40">
          <div className="bg-primary text-white rounded-full p-4 shadow-lg">
            <p className="text-sm font-medium">{validCategories.length}</p>
            <p className="text-xs">Categories</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCategories;