import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
const MyOrder = () => {
  const { currency, axios, user } = useContext(AppContext);
  const [myOrders, setMyOrders] = useState([]);
  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/my-orders");
      console.log(data);

      if (data.success) {
        setMyOrders(data.orders);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, []);
  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <div className="border border-gray-400 max-w-5xl mx-auto p-3">
        <div className="grid grid-cols-5 font-semibold text-gray-700">
          <div>Order ID</div>
          <div>Amount</div>
          <div>Payment</div>
          <div>Status</div>
          <div>Date</div>
        </div>
        <hr className="w-full my-4 text-gray-200" />
        <ul className="space-y-3">
          {myOrders.map((item) => (
            <li key={item._id}>
              <div className="grid grid-cols-5 items-center text-gray-800">
                <p className="text-sm font-mono">
                  #{item._id.slice(-6).toUpperCase()}
                </p>

                {/* Total Amount */}
                <p className="font-semibold">
                  {currency}
                  {item.totalAmount}
                </p>

                {/* Payment Method */}
                <p className="capitalize">{item.paymentMethod}</p>

                {/* Status with color badge */}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium text-white
            ${item.status === "Pending" && "bg-yellow-500"}
            ${item.status === "Processing" && "bg-blue-500"}
            ${item.status === "Shipped" && "bg-indigo-500"}
            ${item.status === "Delivered" && "bg-green-600"}
            ${item.status === "Cancelled" && "bg-red-500"}
          `}
                >
                  {item.status}
                </span>

                {/* Created Date */}
                <p className="text-sm">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <hr className="w-full mt-3 text-gray-200" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default MyOrder;