import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Badge, BadgePlus, CircleX } from "lucide-react";

const WishList = () => {
  const { favorite, currency, removeFromFavorite, addToCart } =
    useContext(AppContext);
  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold">My Wishlist</h1>
      <div className="border border-gray-400 max-w-5xl mx-auto p-3">
        <div className="grid grid-cols-3 font-semibold text-gray-700">
          <div>Product</div>
          <div>Price</div>
          <div>Actions</div>
        </div>
        <hr className="w-full my-4 text-gray-200" />
        <ul>
          {favorite.map((item) => (
            <div key={item._id}>
              <div className="grid grid-cols-3 items-center mb-4">
                <div>
                  <img
                    src={`http://localhost:4000/uploads/${item.images[0]}`}
                    alt=""
                    className="w-20 h-20"
                  />
                  <p>{item.name}</p>
                </div>
                <p>
                  {currency}
                  {item.offerPrice}
                </p>
                <div className="flex items-center gap-5">
                  <p
                    onClick={() => removeFromFavorite(item._id)}
                    className="text-red-500 cursor-pointer hover:underline"
                  >
                    <CircleX />
                  </p>
                  <p
                    onClick={() => addToCart(item)}
                    className="text-green-500 cursor-pointer hover:underline"
                  >
                    <BadgePlus />
                  </p>
                </div>
              </div>
              <hr className="w-full text-gray-300" />
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default WishList;