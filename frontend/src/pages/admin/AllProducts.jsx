import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import { Edit, Trash2, X, Save, Loader2 } from "lucide-react";

const AllProducts = () => {
  const { productsData, currency, axios, fetchProducts } = useContext(AppContext);
  
  // State for managing edits
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    offerPrice: "",
    stock: "",
    weight: "",
    description: ""
  });

  // Load product data into form when editing starts
  useEffect(() => {
    if (editingProduct) {
      setEditForm({
        name: editingProduct.name || "",
        price: editingProduct.price || 0,
        offerPrice: editingProduct.offerPrice || 0,
        stock: editingProduct.stock || 0,
        weight: editingProduct.weight || "",
        description: editingProduct.description || ""
      });
    }
  }, [editingProduct]);

  // ✅ IMPROVED: Robust Image URL Handler
  const getImageUrl = (product) => {
    if (!product) return "https://placehold.co/400x400?text=No+Product";

    let imageName = null;

    // 1. Check images array (Standard)
    if (Array.isArray(product.images) && product.images.length > 0) {
      imageName = product.images[0];
    } 
    // 2. Check legacy single image field
    else if (product.image && typeof product.image === 'string') {
      imageName = product.image;
    }
    // 3. Check for specific string fallback
    else if (typeof product.images === 'string' && product.images.length > 0) {
      imageName = product.images;
    }

    if (!imageName) return "https://placehold.co/400x400?text=No+Image";

    // If it's already a full URL
    if (imageName.startsWith('http') || imageName.startsWith('data:')) return imageName;

    // Clean up pathing
    const cleanName = imageName.replace(/^uploads\//, '').replace(/^\//, '');
    return `http://localhost:4000/uploads/${cleanName}`;
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { data } = await axios.delete(`/api/product/delete/${id}`);
        if (data.success) {
          toast.success("Product deleted");
          fetchProducts();
        }
      } catch (error) {
        toast.error("Error deleting product");
      }
    }
  };

  const handleUpdate = async () => {
    if (!editForm.name.trim()) return toast.error("Product name is required");

    try {
      setLoading(true);
      const payload = {
        ...editForm,
        price: parseFloat(editForm.price),
        offerPrice: editForm.offerPrice ? parseFloat(editForm.offerPrice) : 0,
        stock: parseInt(editForm.stock)
      };

      const { data } = await axios.put(`/api/product/update/${editingProduct._id}`, payload);
      if (data.success) {
        toast.success("Product updated successfully");
        fetchProducts();
        setEditingProduct(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">All Products</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {productsData && productsData.length > 0 ? (
              productsData.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <img 
                      src={getImageUrl(product)} 
                      alt={product.name} 
                      className="w-12 h-12 object-cover rounded border"
                    />
                  </td>
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3 text-gray-600">{product.category?.name || "N/A"}</td>
                  <td className="p-3">
                    {currency}{product.price}
                    {product.offerPrice > 0 && (
                       <span className="text-xs text-red-500 ml-2">(-{Math.round(((product.price - product.offerPrice)/product.price)*100)}%)</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button 
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-lg font-bold mb-4">Edit Product</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full border rounded p-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input 
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Offer Price</label>
                  <input 
                    type="number"
                    value={editForm.offerPrice}
                    onChange={(e) => setEditForm({...editForm, offerPrice: e.target.value})}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input 
                    type="number"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Weight</label>
                  <input 
                    type="text"
                    value={editForm.weight}
                    onChange={(e) => setEditForm({...editForm, weight: e.target.value})}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              <button 
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;