import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import { p } from "motion/react-client";
Upload;
const AddProduct = () => {
  const { loading, navigate, categoriesData, setLoading, axios } =
    useContext(AppContext);

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
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...formData.images];
      updatedImages[index] = file;

      const updatedPreviews = [...previews];
      updatedPreviews[index] = URL.createObjectURL(file);

      setFormData({ ...formData, images: updatedImages });
      setPreviews(updatedPreviews);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    try {
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
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="py-12">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl w-full flex flex-col gap-5"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            placeholder="Enter product name"
          />
        </div>

        {/* Price & Offer Price */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="e.g. 15.99"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Price
            </label>
            <input
              type="number"
              name="offerPrice"
              value={formData.offerPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="e.g. 12.99"
            />
          </div>
        </div>

        {/* Small Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <input
            type="text"
            name="smallDesc"
            value={formData.smallDesc}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            placeholder="Enter short description"
          />
        </div>

        {/* Long Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Long Description
          </label>
          <textarea
            name="longDesc"
            value={formData.longDesc}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            placeholder="Enter detailed description"
          />
        </div>

        {/* Weight & Category */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight
            </label>

            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="e.g. 250g"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categoriesData.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Image Uploads */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images (up to 4)
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index}>
                <input
                  type="file"
                  id={`fileUpload-${index}`}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, index)}
                />
                <label
                  htmlFor={`fileUpload-${index}`}
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-secondary transition overflow-hidden"
                >
                  {previews[index] ? (
                    <img
                      src={previews[index]}
                      className="l h-full object-contain"
                      alt="images"
                    />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-gray-500 text-xs">
                        Upload image {index + 1}
                      </span>
                    </>
                  )}
                </label>
                {formData.images[index] && (
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    {formData.images[index].name}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Submit */}
        <button
          type="submit"
          className="bg-primary text-white px-8 py-3 rounded-md cursor-pointer hover:bg-primary/90 transition"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};
export default AddProduct;