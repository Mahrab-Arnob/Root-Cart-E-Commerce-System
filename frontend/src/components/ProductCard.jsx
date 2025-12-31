import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  // Add early return if product is null
  if (!product) {
    return null; // Or return a placeholder/skeleton if you prefer
  }

  const { navigate, currency, addToCart } = useContext(AppContext);
  
  // Use optional chaining and default values
  const productId = product?._id || "";
  const productImages = product?.images || [];
  const productCategory = product?.category || {};
  const productName = product?.name || "Product Name";
  const productWeight = product?.weight || "";
  const productPrice = product?.price || 0;
  const productOfferPrice = product?.offerPrice || 0;

  return (
    <div className="w-[250px] h-[350px] rounded-xl bg-[#FAFAFA] p-[20px] hover:border hover:border-secondary hover:transform hover:scale-105 transition-all ease-in-out duration-300">
      <p>{productWeight}</p>
      <Link to={`/product/${productId}`} className="cursor-pointer">
        <img
          src={`http://localhost:4000/uploads/${productImages[0] || ''}`}
          alt={productName}
          className="w-full h-48 object-cover"
        />
      </Link>
      <button
        onClick={() => addToCart(product)}
        className="flex items-center justify-center mb-3 w-full py-1 bg-secondary text-white cursor-pointer"
      >
        <ShoppingCart />
      </button>
      <hr className="w-full" />
      <div>
        <p className="text-secondary text-sm font-normal">
          {productCategory?.name || "Category"}
        </p>
        <h2 className="text-lg font-semibold text-gray-800">{productName}</h2>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-base font-normal line-through text-gray-400">
          {currency}
          {productPrice}
        </p>
        <p className="text-base font-normal ">
          {currency}
          {productOfferPrice}
        </p>
      </div>
    </div>
  );
};
export default ProductCard;