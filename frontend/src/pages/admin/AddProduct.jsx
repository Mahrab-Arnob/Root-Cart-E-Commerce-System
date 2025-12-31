import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Upload, X, Image as ImageIcon, Plus, Minus, ArrowLeft, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const { loading, categoriesData, setLoading, axios } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    offerPrice: "",
    smallDesc: "",
    longDesc: "",
    weight: "",
    category: "",
    images: [],
  });
  
  const [previews, setPreviews] = useState([null, null, null, null]);
  const [dragOver, setDragOver] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const totalSteps = 3;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, index) => {
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
      
      const updatedImages = [...formData.images];
      updatedImages[index] = file;

      const updatedPreviews = [...previews];
      updatedPreviews[index] = URL.createObjectURL(file);

      setFormData(prev => ({ ...prev, images: updatedImages }));
      setPreviews(updatedPreviews);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange({ target: { files: [droppedFile] } }, index);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    const updatedPreviews = [...previews];
    
    if (updatedPreviews[index]) {
      URL.revokeObjectURL(updatedPreviews[index]);
    }
    
    updatedImages[index] = null;
    updatedPreviews[index] = null;
    
    setFormData(prev => ({ ...prev, images: updatedImages }));
    setPreviews(updatedPreviews);
  };

  const addMoreImages = () => {
    if (formData.images.length < 10) {
      setFormData(prev => ({ ...prev, images: [...prev.images, null] }));
      setPreviews(prev => [...prev, null]);
    }
  };

  const removeLastImage = () => {
    if (formData.images.length > 4) {
      const updatedImages = [...formData.images];
      const updatedPreviews = [...previews];
      
      if (updatedPreviews[updatedPreviews.length - 1]) {
        URL.revokeObjectURL(updatedPreviews[updatedPreviews.length - 1]);
      }
      
      updatedImages.pop();
      updatedPreviews.pop();
      
      setFormData(prev => ({ ...prev, images: updatedImages }));
      setPreviews(updatedPreviews);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!formData.price) {
      toast.error("Product price is required");
      return false;
    }
    if (!formData.smallDesc.trim()) {
      toast.error("Short description is required");
      return false;
    }
    if (!formData.longDesc.trim()) {
      toast.error("Detailed description is required");
      return false;
    }
    if (!formData.weight.trim()) {
      toast.error("Weight is required");
      return false;
    }
    if (!formData.category) {
      toast.error("Category is required");
      return false;
    }
    if (formData.images.filter(img => img).length === 0) {
      toast.error("At least one product image is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("price", formData.price);
      formPayload.append("offerPrice", formData.offerPrice);
      formPayload.append("smallDesc", formData.smallDesc);
      formPayload.append("longDesc", formData.longDesc);
      formPayload.append("weight", formData.weight);
      formPayload.append("category", formData.category);
      
      formData.images.forEach((file) => {
        if (file) {
          formPayload.append("images", file);
        }
      });

      const { data } = await axios.post("/api/product/add", formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (data.success) {
        toast.success(data.message);
        navigate("/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (activeStep < totalSteps) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 md:py-12">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 bg-white border-b z-10">
        <div className="flex items-center p-4">
          <button
            onClick={() => navigate("/admin/products")}
            className="p-2 mr-3"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-xs text-gray-500">Create a new product listing</p>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${step === activeStep ? 'bg-primary text-white' : 
                    step < activeStep ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}
                `}>
                  {step}
                </div>
                {step < totalSteps && (
                  <div className={`
                    h-1 w-8 md:w-12 mx-2
                    ${step < activeStep ? 'bg-green-500' : 'bg-gray-200'}
                  `}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            {activeStep === 1 && "Basic Info"}
            {activeStep === 2 && "Description"}
            {activeStep === 3 && "Images & Category"}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block mb-8 px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-2">Create a new product for your store</p>
      </div>

      <div className="p-4 md:p-0">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm md:shadow-md border border-gray-200 md:border-0 p-4 md:p-8"
        >
          {/* Step 1: Basic Information */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600 text-sm">Enter the basic details of your product</p>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Premium Wireless Headphones"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                           placeholder-gray-400 text-gray-900
                           transition-all duration-200"
                  maxLength={100}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-xs">A clear, descriptive name</p>
                  <span className="text-xs text-gray-400">
                    {formData.name.length}/100
                  </span>
                </div>
              </div>

              {/* Price & Offer Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ৳
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Offer Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ৳
                    </span>
                    <input
                      type="number"
                      name="offerPrice"
                      value={formData.offerPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl 
                               focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>

              {/* Weight & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Weight *
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 250g or 1kg"
                  />
                  <p className="text-gray-500 text-xs mt-2">Include unit (g, kg, lb, etc.)</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categoriesData.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-gray-500 text-xs mt-2">
                    {formData.category ? `${categoriesData.find(c => c._id === formData.category)?.name}` : "Required"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600 text-sm">Tell customers about your product</p>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Short Description *
                  <span className="text-gray-500 text-xs font-normal ml-2">
                    (Appears in product listings)
                  </span>
                </label>
                <input
                  type="text"
                  name="smallDesc"
                  value={formData.smallDesc}
                  onChange={handleChange}
                  required
                  placeholder="Briefly describe your product in 1-2 sentences"
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  maxLength={200}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-xs">Keep it short and impactful</p>
                  <span className="text-xs text-gray-400">
                    {formData.smallDesc.length}/200
                  </span>
                </div>
              </div>

              {/* Long Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Detailed Description *
                  <span className="text-gray-500 text-xs font-normal ml-2">
                    (Appears on product page)
                  </span>
                </label>
                <textarea
                  name="longDesc"
                  value={formData.longDesc}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Describe your product in detail. Include features, benefits, specifications, etc."
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                           resize-none"
                  maxLength={2000}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-500 text-xs">Be detailed but clear</p>
                  <span className="text-xs text-gray-400">
                    {formData.longDesc.length}/2000
                  </span>
                </div>
              </div>

              {/* Description Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Writing Tips</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li className="flex items-start">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span>Highlight key features and benefits</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span>Use bullet points for specifications</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span>Include size, material, and usage instructions</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Product Images</h2>
                <p className="text-gray-600 text-sm">Upload high-quality images of your product</p>
              </div>

              {/* Image Upload Grid */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Product Images *
                  <span className="text-gray-500 text-xs font-normal ml-2">
                    (At least 1 required, up to 10)
                  </span>
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative">
                      <input
                        type="file"
                        id={`fileUpload-${index}`}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, index)}
                      />
                      <label
                        htmlFor={`fileUpload-${index}`}
                        className={`
                          flex flex-col items-center justify-center w-full h-32 md:h-36
                          border-2 ${dragOver ? 'border-primary border-solid bg-primary/5' : 'border-dashed border-gray-300'} 
                          rounded-xl cursor-pointer transition-all duration-200 overflow-hidden
                          hover:border-primary hover:bg-primary/5
                        `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        {preview ? (
                          <div className="relative w-full h-full">
                            <img
                              src={preview}
                              className="w-full h-full object-cover"
                              alt={`Product preview ${index + 1}`}
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-200"></div>
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-gray-700 text-sm">Image {index + 1}</p>
                            <p className="text-gray-500 text-xs mt-1">Click to upload</p>
                          </div>
                        )}
                      </label>
                      
                      {preview && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                      
                      {formData.images[index] && !preview && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 truncate">
                            {formData.images[index].name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {(formData.images[index].size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Image Management Controls */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    {formData.images.filter(img => img).length} of {previews.length} images selected
                  </div>
                  <div className="flex gap-2">
                    {formData.images.length > 4 && (
                      <button
                        type="button"
                        onClick={removeLastImage}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Minus size={14} />
                        <span className="text-sm">Remove</span>
                      </button>
                    )}
                    {formData.images.length < 10 && (
                      <button
                        type="button"
                        onClick={addMoreImages}
                        className="px-3 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 flex items-center gap-1"
                      >
                        <Plus size={14} />
                        <span className="text-sm">Add More</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Image Tips */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">Image Guidelines</h4>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li>• Use high-quality, well-lit photos</li>
                    <li>• Show product from multiple angles</li>
                    <li>• Include close-ups of important details</li>
                    <li>• Recommended size: 1000×1000 pixels</li>
                    <li>• Max file size: 5MB per image</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col-reverse md:flex-row justify-between gap-4">
              {activeStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl 
                           font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Previous Step
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl 
                           font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              
              {activeStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3.5 bg-primary text-white rounded-xl 
                           font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                >
                  Next Step
                  <ArrowLeft size={18} className="rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    px-6 py-3.5 rounded-xl font-semibold text-base
                    transition-all duration-200 transform hover:scale-[1.02]
                    ${loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary text-white hover:bg-secondary'
                    }
                    active:scale-95
                  `}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                      Adding Product...
                    </div>
                  ) : (
                    "Add Product"
                  )}
                </button>
              )}
            </div>
            
            {/* Step Indicator */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Step {activeStep} of {totalSteps}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index + 1 === activeStep
                        ? 'bg-primary'
                        : index + 1 < activeStep
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={activeStep > 1 ? prevStep : () => navigate("/admin/products")}
            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium"
          >
            {activeStep > 1 ? "Back" : "Cancel"}
          </button>
          
          {activeStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-semibold ${
                loading ? 'bg-gray-400' : 'bg-primary text-white hover:bg-secondary'
              }`}
            >
              {loading ? "..." : "Add Product"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;