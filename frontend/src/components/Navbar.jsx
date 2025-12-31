import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { Heart, ShoppingBag } from "lucide-react";
import { AppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
const Navbar = () => {
  const { navigate, user, setUser, cart, favorite, axios } =
    useContext(AppContext);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "text-secondary border-b border-primary"
      : "";
  };

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/auth/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
       <Link to={'/'} className='flex items-center gap-2 '>
                <h1 className='text-3xl font-bold text-green-900'>Root <span className='text-3xl font-bold text-orange-500'>&</span> Cart</h1>
            </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <Link to={"/"} className={isActive("/")}>
          Home
        </Link>
        <Link to={"/shop"} className={isActive("/shop")}>
          Shop
        </Link>
        <Link to={"/about"} className={isActive("/about")}>
          About
        </Link>
        <Link to={"/contact"} className={isActive("/contact")}>
          Contact
        </Link>
        <button
          onClick={() => navigate("/admin")}
          className="bg-primary text-white px-6 py-2 cursor-pointer rounded-full"
        >
          Admin Dashboard
        </button>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w[18px] h[18px] rounded-full">
            {cart ? cart.length : 0}
          </button>
        </div>
        <div
          onClick={() => navigate("/wishlist")}
          className="relative cursor-pointer"
        >
          <Heart className="w-5 h-5" />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w[18px] h[18px] rounded-full">
            {favorite ? favorite.length : 0}
          </button>
        </div>

        {user ? (
          <div className="relative group">
            <img
              src={assets.profile_pic}
              alt=""
              className="w-10 h-10 rounded-full cursor-pointer"
            />
            <div className="absolute right-0 mt-2 w-40 bg-secondary shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition duration-300 z-50 ">
              <ul className="text-white">
                <p
                  onClick={() => navigate("/my-orders")}
                  className="cursor-pointer hover:bg-primary py-1px-3"
                >
                  My Orders
                </p>
                <p
                  onClick={logout}
                  className="cursor-pointer hover:bg-primary py-1px-3"
                >
                  Logout
                </p>
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-secondary transition text-white rounded-full"
          >
            Login
          </button>
        )}
      </div>

      <button
        onClick={() => (open ? setOpen(false) : setOpen(true))}
        aria-label="Menu"
        className="sm:hidden"
      >
        {/* Menu Icon SVG */}
        <svg
          width="21"
          height="15"
          viewBox="0 0 21 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-50`}
      >
        <Link onClick={() => setOpen(false)} to={"/"} className={isActive("/")}>
          Home
        </Link>
        <Link
          onClick={() => setOpen(false)}
          to={"/shop"}
          className={isActive("/shop")}
        >
          Shop
        </Link>
        <Link
          onClick={() => setOpen(false)}
          to={"/about"}
          className={isActive("/about")}
        >
          About
        </Link>
        <Link
          onClick={() => setOpen(false)}
          to={"/contact"}
          className={isActive("/contact")}
        >
          Contact
        </Link>
        <button
          onClick={() => navigate("/admin")}
          className="bg-primary text-white px-4 py-2 cursor-pointer rounded-full"
        >
          Admin Dashboard
        </button>
        {user ? (
          <div className="relative group">
            <img
              src={assets.profile_pic}
              alt=""
              className="w-10 h-10 rounded-full cursor-pointer"
            />
            <div className="absolute right-0 mt-2 w-40 bg-secondary shadow-lg rounded-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition duration-300 z-50 ">
              <ul className="text-white">
                <p
                  onClick={() => navigate("/my-orders")}
                  className="cursor-pointer hover:bg-primary py-1px-3"
                >
                  My Orders
                </p>
                <p
                  onClick={logout}
                  className="cursor-pointer hover:bg-primary py-1px-3"
                >
                  Logout
                </p>
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-secondary transition text-white rounded-full"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};
export default Navbar;