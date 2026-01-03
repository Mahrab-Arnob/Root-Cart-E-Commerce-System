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
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setFile(selectedFile);
      setFormData({ ...formData, image: selectedFile });
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setFormData({ ...formData, image: null });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.name.trim()) return toast.error("Enter category name");
    if (!formData.image) return toast.error("Select an image");

    try {
      setLoading(true);
      const dataToSend = new FormData();
      dataToSend.append('name', formData.name.trim());
      dataToSend.append('image', formData.image);

      const { data } = await axios.post("/api/category/add", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      if (data.success) {
        toast.success(data.message);
        navigate("/admin/categories");
      }
    } catch (error) {
      // CATCHES THE DUPLICATE ERROR FROM BACKEND
      const errorMsg = error.response?.data?.message || "Error adding category";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 md:py-12 pb-24">
      <div className="max-w-md mx-auto">
         {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 bg-white border-b mb-4">
           <button onClick={() => navigate("/admin/categories")} className="mr-3"><ArrowLeft size={24} /></button>
           <h1 className="text-xl font-bold">Add Category</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Category Image</label>
            {preview ? (
              <div className="relative group">
                <img src={preview} className="w-full h-56 object-cover rounded-lg border" />
                <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"><X size={16}/></button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload image</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Category Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="e.g. Vegetables"
              className="w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;