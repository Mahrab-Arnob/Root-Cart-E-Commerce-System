import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import WishList from "./pages/WishList";
import AddAddress from "./pages/AddAddress";
import MyOrder from "./pages/MyOrder";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

// ✅ CHANGE: Import react-toastify components and CSS
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AllCategories from "./pages/admin/AllCategories";
import AllProducts from "./pages/admin/AllProducts";
import Orders from "./pages/admin/Orders";
import AddProduct from "./pages/admin/AddProduct";
import AddCategory from "./pages/admin/AddCategory";

const App = () => {
  const adminPath = useLocation().pathname.includes("admin");
  const { admin } = useContext(AppContext);

  return (
    <>
      {/* ✅ CHANGE: Replaced <Toaster /> with <ToastContainer /> */}
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-24">
        {!adminPath && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrder />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={admin ? <AdminLayout /> : <AdminLogin />}
          >
            <Route index element={admin ? <Dashboard /> : <AdminLogin />} />
            <Route
              path="add-category"
              element={admin ? <AddCategory /> : <AdminLogin />}
            />
            <Route
              path="add-product"
              element={admin ? <AddProduct /> : <AdminLogin />}
            />
            <Route
              path="categories"
              element={admin ? <AllCategories /> : <AdminLogin />}
            />
            <Route
              path="products"
              element={admin ? <AllProducts /> : <AdminLogin />}
            />
            <Route
              path="orders"
              element={admin ? <Orders /> : <AdminLogin />}
            />
          </Route>
        </Routes>
        {!adminPath && <Footer />}
      </div>
    </>
  );
};

export default App;