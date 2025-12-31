import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";
import { Upload, Image, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const { loading, setLoading, axios } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", image: null });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Please select an image file (JPEG, PNG, etc.)");
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setFile(selectedFile);
      setFormData({ ...formData, image: selectedFile });
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange({ target: { files: [droppedFile] } });
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setFormData({ ...formData, image: null });
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (!formData.image) {
      toast.error("Please select a category image");
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData object for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('image', formData.image);

      const { data } = await axios.post("/api/category/add", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (data.success) {
        toast.success(data.message);
        navigate("/admin/categories");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 md:py-12">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 bg-white border-b z-10">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate("/admin/categories")}
            className="p-2 mr-3"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Add New Category</h1>
            <p className="text-xs text-gray-500">Create a new product category</p>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block mb-8 px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
        <p className="text-gray-600 mt-2">Create a new category for your products</p>
      </div>

      <div className="p-4 md:p-0">
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-white rounded-xl shadow-sm md:shadow-md border border-gray-200 md:border-0 p-4 md:p-8"
        >
          {/* Image Preview Section */}
          <div className="mb-6 md:mb-8">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Category Image
            </label>
            
            {preview ? (
              <div className="relative">
                <div className="w-full h-64 md:h-72 rounded-xl overflow-hidden border border-gray-300">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="fileUpload"
                className={`
                  flex flex-col items-center justify-center w-full h-56 md:h-64 
                  border-2 ${dragOver ? 'border-primary border-solid bg-primary/5' : 'border-dashed border-gray-300'} 
                  rounded-2xl cursor-pointer transition-all duration-200
                  hover:border-primary hover:bg-primary/5
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center p-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    {dragOver ? (
                      <Upload className="w-8 h-8 text-primary animate-pulse" />
                    ) : (
                      <Image className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="mb-2">
                    <p className="text-gray-700 font-medium">
                      {dragOver ? "Drop image here" : "Upload category image"}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      PNG, JPG, JPEG up to 5MB
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors"
                    >
                      Browse Files
                    </button>
                    <p className="text-gray-500 text-xs mt-3">
                      or drag & drop here
                    </p>
                  </div>
                </div>
                <input
                  id="fileUpload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            )}
            
            {/* Selected file info */}
            {file && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Image size={18} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Category Name Input */}
          <div className="mb-6 md:mb-8">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Category Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Electronics, Clothing, Food"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         placeholder-gray-400 text-gray-900
                         transition-all duration-200"
                maxLength={50}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-gray-400">
                  {formData.name.length}/50
                </span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Choose a descriptive name for your category
            </p>
          </div>

          {/* Form Actions */}
          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3.5 rounded-xl font-semibold text-base
                transition-all duration-200 transform hover:scale-[1.02]
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-secondary'
                }
                active:scale-95
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-3"></div>
                  Adding Category...
                </div>
              ) : (
                "Add Category"
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="w-full py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl 
                       font-semibold hover:bg-gray-50 transition-colors active:bg-gray-100"
            >
              Cancel
            </button>
          </div>

          {/* Form Tips */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-xs">1</span>
                </div>
                <span>Use clear, high-quality images (500×500px recommended)</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-xs">2</span>
                </div>
                <span>Keep category names short and descriptive</span>
              </li>
              <li className="flex items-start">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-xs">3</span>
                </div>
                <span>Categories help customers find products easily</span>
              </li>
            </ul>
          </div>
        </form>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/admin/categories")}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium"
            >
              View All Categories
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`
                px-6 py-2.5 rounded-lg font-semibold
                ${loading 
                  ? 'bg-gray-400' 
                  : 'bg-primary text-white hover:bg-secondary'
                }
              `}
            >
              {loading ? "..." : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;