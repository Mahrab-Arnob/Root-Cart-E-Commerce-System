import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { CircleX } from "lucide-react";

const Cart = () => {
  const { cart, currency, navigate, removeFromCart, getCartTotal } =
    useContext(AppContext);
  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold">My Cart</h1>
      <div className="border border-gray-400 max-w-5xl mx-auto p-3">
        <div className="grid grid-cols-5 font-semibold text-gray-700">
          <div>Product</div>
          <div>Price</div>
          <div>Quantity</div>
          <div>Subtotal</div>
          <div>Actions</div>
        </div>
        <hr className="w-full my-4 text-gray-200" />
        <ul>
          {cart.map((item) => (
            <div key={item._id}>
              <div className="grid grid-cols-5 items-center mb-4">
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
                <p>{item.quantity}</p>
                <p>
                  {currency}
                  {item.quantity * item.offerPrice}
                </p>
                <p
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 cursor-pointer hover:underline"
                >
                  <CircleX />
                </p>
              </div>
              <hr className="w-full text-gray-300" />
            </div>
          ))}
        </ul>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Total</p>
            <p className="font-semibold">
              {currency}
              {getCartTotal()}
            </p>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-5 flex items-center justify-center mb-3 w-full bg-secondary py-3
           text-white cursor-pointer uppercase"
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};
export default Cart;