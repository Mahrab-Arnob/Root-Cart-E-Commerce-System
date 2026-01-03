import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { Eye, Edit2, Trash2, X, Save, Loader2, Image as ImageIcon, Menu, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const AllCategories = () => {
  const { categoriesData, axios, fetchCategories } = useContext(AppContext);
  
  // Local State
  const [viewingCategory, setViewingCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null);
  
  // Edit Form State
  const [editForm, setEditForm] = useState({
    name: "",
    preview: "" // For showing the image preview
  });
  const [newImageFile, setNewImageFile] = useState(null); // The actual file to upload

  // --- Constants ---
  const BACKEND_URL = "http://localhost:4000";
  const PLACEHOLDER_80 = "https://placehold.co/80";
  const PLACEHOLDER_300 = "https://placehold.co/300";

  // --- Helper: Construct Image URL ---
  const getImageUrl = (imagePath) => {
    if (!imagePath) return PLACEHOLDER_80;
    if (imagePath.startsWith("data:") || imagePath.startsWith("http")) return imagePath;
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${BACKEND_URL}/uploads/${cleanPath.replace('uploads/', '')}`;
  };

  // --- Actions ---

  const viewCategory = (category) => {
    setViewingCategory(category);
    setMobileMenuOpen(null);
  };

  const startEditCategory = (category) => {
    setEditingCategory(category._id);
    setEditForm({
      name: category.name || "",
      preview: getImageUrl(category.image)
    });
    setNewImageFile(null); // Reset new file
    setMobileMenuOpen(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, name: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return toast.error("Please select a valid image file");
      }
      setNewImageFile(file); // Store file for upload
      
      // Create local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm(prev => ({ ...prev, preview: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateCategory = async (id) => {
    if (!editForm.name.trim()) return toast.error("Name is required");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', editForm.name);
      
      // Only append image if a NEW file was selected
      if (newImageFile) {
        formData.append('image', newImageFile);
      }

      const { data } = await axios.put(`/api/category/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (data.success) {
        toast.success(data.message);
        fetchCategories(); // Refresh list
        setEditingCategory(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const { data } = await axios.delete(`/api/category/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchCategories();
        setDeletingCategory(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const toggleMobileMenu = (id) => {
    setMobileMenuOpen(mobileMenuOpen === id ? null : id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  // Filter valid data
  const validCategories = Array.isArray(categoriesData) ? categoriesData : [];

  return (
    <div className="py-6 md:py-12 relative">
      <div className="px-4 md:px-0 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">All Categories</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your product categories</p>
      </div>

      {/* --- Main List --- */}
      <div className="md:border md:border-gray-200 md:rounded-lg overflow-hidden">
        {/* Header (Desktop) */}
        <div className="hidden md:grid md:grid-cols-3 font-semibold bg-gray-50 p-4 border-b">
          <div>Category Info</div>
          <div>Created Date</div>
          <div className="text-center">Actions</div>
        </div>

        {validCategories.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No categories found</p>
          </div>
        ) : (
          <div className="bg-white">
            {validCategories.map((item) => {
              const isEditing = editingCategory === item._id;
              const isMenuOpen = mobileMenuOpen === item._id;
              
              return (
                <div key={item._id} className="border-b last:border-0 border-gray-100">
                  
                  {/* --- Mobile View --- */}
                  <div className="md:hidden p-4 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={getImageUrl(item.image)} 
                          className="w-12 h-12 rounded object-cover border" 
                          alt="cat" 
                        />
                        <span className="font-semibold">{item.name}</span>
                      </div>
                      <button onClick={() => toggleMobileMenu(item._id)}>
                        {isMenuOpen ? <XCircle size={20} /> : <Menu size={20} />}
                      </button>
                    </div>

                    {isMenuOpen && (
                      <div className="mt-3 grid grid-cols-3 gap-2 pt-3 border-t">
                        <button onClick={() => viewCategory(item)} className="p-2 bg-blue-50 text-blue-600 rounded flex flex-col items-center text-xs">
                          <Eye size={16} /> View
                        </button>
                        <button onClick={() => startEditCategory(item)} className="p-2 bg-yellow-50 text-yellow-600 rounded flex flex-col items-center text-xs">
                          <Edit2 size={16} /> Edit
                        </button>
                        <button onClick={() => setDeletingCategory(item)} className="p-2 bg-red-50 text-red-600 rounded flex flex-col items-center text-xs">
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* --- Desktop View --- */}
                  <div className="hidden md:grid md:grid-cols-3 items-center p-4 hover:bg-gray-50 transition-colors">
                    
                    {/* Column 1: Image & Name (or Edit Inputs) */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 flex-shrink-0 relative">
                        {isEditing ? (
                          <>
                            <img 
                              src={editForm.preview} 
                              alt="preview" 
                              className="w-14 h-14 object-cover rounded border border-blue-400" 
                            />
                            <label className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700">
                              <Edit2 size={10} />
                              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                          </>
                        ) : (
                          <img 
                            src={getImageUrl(item.image)} 
                            alt={item.name} 
                            className="w-14 h-14 object-cover rounded border" 
                            onError={(e) => { e.target.src = PLACEHOLDER_80; }}
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={editForm.name} 
                            onChange={handleEditChange}
                            className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="font-semibold text-gray-800">{item.name}</p>
                        )}
                      </div>
                    </div>

                    {/* Column 2: Date */}
                    <div className="text-gray-500 text-sm">
                      {isEditing ? (
                        <span className="text-blue-600 text-xs italic">Editing...</span>
                      ) : (
                        formatDate(item.createdAt)
                      )}
                    </div>

                    {/* Column 3: Actions */}
                    <div className="flex justify-center gap-2">
                      {isEditing ? (
                        <>
                          <button 
                            onClick={() => updateCategory(item._id)} 
                            disabled={loading}
                            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                          >
                            {loading ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
                          </button>
                          <button 
                            onClick={() => setEditingCategory(null)} 
                            className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                          >
                            <X size={18}/>
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => viewCategory(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Eye size={18}/></button>
                          <button onClick={() => startEditCategory(item)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"><Edit2 size={18}/></button>
                          <button onClick={() => setDeletingCategory(item)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
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

      {/* --- View Modal --- */}
      {viewingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Category Details</h3>
              <button onClick={() => setViewingCategory(null)} className="hover:bg-gray-200 p-1 rounded-full"><X size={20}/></button>
            </div>
            <div className="p-6 flex flex-col items-center">
              <img 
                src={getImageUrl(viewingCategory.image)} 
                alt={viewingCategory.name} 
                className="w-full h-48 object-cover rounded-lg shadow-sm border"
              />
              <h2 className="text-2xl font-bold mt-4 text-gray-800">{viewingCategory.name}</h2>
              <p className="text-gray-500 text-sm mt-1">ID: {viewingCategory._id}</p>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Category?</h3>
              <p className="text-gray-500 mt-2 text-sm">
                Are you sure you want to delete <b>"{deletingCategory.name}"</b>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setDeletingCategory(null)} 
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteCategory(deletingCategory._id)} 
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCategories;