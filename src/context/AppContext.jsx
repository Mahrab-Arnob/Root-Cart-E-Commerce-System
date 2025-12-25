import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories, products, blogs } from "../assets/assets";
import toast from "react-hot-toast";
export const AppContext = createContext();
const currency = import.meta.env.VITE_CURRENCY;

import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BASEURL;
axios.defaults.withCredentials = true;
const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [blogsData, setBlogsData] = useState([]);

  const [cart, setCart] = useState([]);
  const [favorite, setFavorite] = useState([]);

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/is-auth");
      if (data.success) {
        setUser(true);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-admin");
      if (data.success) {
        setAdmin(true);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/all");
      if (data.success) {
        setCategoriesData(data.categories);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/all");
      if (data.success) {
        setProductsData(data.products);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchBlogs = async () => {
    setBlogsData(blogs);
  };

  // add to cart

  const addToCart = (product) => {
    setCart((prev) => {
      const newCart = structuredClone(prev);
      const existingProduct = newCart.find((item) => item._id === product._id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        newCart.push({ ...product, quantity: 1 });
      }
      toast.success("Product added to cart");
      return newCart;
    });
  };

  // remove from cart
  const removeFromCart = (id) => {
    setCart((prev) => {
      const newCart = structuredClone(prev);
      const existingProduct = newCart.find((item) => item._id === id);
      if (existingProduct.quantity === 1) {
        return newCart.filter((item) => item._id !== id);
      } else {
        existingProduct.quantity -= 1;
      }
      return newCart;
    });
  };

  //  Add to Favourites
  const addToFavorite = (product) => {
    setFavorite((prev) => {
      const newFavs = structuredClone(prev);
      if (!newFavs.find((item) => item._id === product._id)) {
        newFavs.push(product);
        toast.success("Product added to favorite");
      } else {
        toast.error("Product already added to favorite");
      }
      return newFavs;
    });
  };
  //  Remove from Favourites
  const removeFromFavorite = (id) => {
    setFavorite((prev) => {
      const newFavs = structuredClone(prev);
      const removed = newFavs.filter((item) => item._id !== id);
      toast.success("Product removed from favorite");
      return removed;
    });
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + item.offerPrice * item.quantity,
      0
    );
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchBlogs();
    checkAuth();
    checkAdmin();
  }, []);
  const value = {
    navigate,
    user,
    setUser,
    categoriesData,
    productsData,
    currency,
    blogsData,
    addToCart,
    removeFromCart,
    cart,
    favorite,
    addToFavorite,
    removeFromFavorite,
    getCartTotal,
    admin,
    setAdmin,
    loading,
    setLoading,
    axios,
    fetchCategories,
    fetchProducts,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;