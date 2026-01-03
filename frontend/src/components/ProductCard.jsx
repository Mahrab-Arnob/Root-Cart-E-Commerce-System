import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const { currency, addToCart } = useContext(AppContext);

  // Safe Image URL Getter
  const getImageUrl = (product) => {
    // 1. Fallback if no images
    if (!product.images || !Array.isArray(product.images) || product.images.length === 0) {
      return "https://placehold.co/400x400?text=No+Image";
    }

    const imgName = product.images[0];
    
    // 2. Fallback if filename is invalid
    if (!imgName) return "https://placehold.co/400x400?text=No+Image";

    // 3. Return correct URL
    if (imgName.startsWith('http')) return imgName;
    return `http://localhost:4000/uploads/${imgName}`;
  };

  return (
    <div className="w-full max-w-[250px] bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex flex-col justify-between">
      <Link to={`/product/${product._id}`} className="group block">
        <div className="relative w-full h-44 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={getImageUrl(product)}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
            onError={(e) => { e.target.src = "https://placehold.co/400x400?text=Error"; }}
          />
        </div>

        <div className="mt-3">
          <p className="text-xs text-gray-500 uppercase font-medium">
            {product.category?.name || "Uncategorized"}
          </p>
          <h3 className="text-gray-900 font-semibold truncate mt-1" title={product.name}>
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-gray-900">
              {currency}{product.offerPrice > 0 ? product.offerPrice : product.price}
            </span>
            {product.offerPrice > 0 && (
              <span className="text-xs text-gray-400 line-through">
                {currency}{product.price}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={() => addToCart(product)}
        className="mt-3 w-full py-2 bg-secondary text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition active:scale-95"
      >
        <ShoppingCart size={16} />
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;