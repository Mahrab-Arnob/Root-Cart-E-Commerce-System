
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { navigate, currency, addToCart } = useContext(AppContext);
  return (
    <div className="w[250px] h[350px] rounded-xl bg-[#FAFAFA] p[20px] hover:border hover:border-secondary hover:transform hover:scale-105 transition-all ease-in-out duration-300">
      <p>{product.weight}</p>
      <Link to={`/product/${product._id}`} className="cursor-pointer">
        <img
          src={`http://localhost:4000/uploads/${product.images[0]}`}
          alt=""
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
          {product.category.name}
        </p>
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-base font-normal line-through text-gray-400">
          {currency}
          {product.price}
        </p>
        <p className="text-base font-normal ">
          {currency}
          {product.offerPrice}
        </p>
      </div>
    </div>
  );
};
export default ProductCard;
