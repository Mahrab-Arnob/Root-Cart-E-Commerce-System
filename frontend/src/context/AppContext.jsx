import { createContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext();

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
  
  const axiosInstance = useRef(
    axios.create({
      baseURL: import.meta.env.VITE_BASEURL || "http://localhost:4000",
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    })
  );

  const updateAxiosToken = (token) => {
    if (token && token !== "null" && token !== "undefined") {
      axiosInstance.current.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.current.defaults.headers.common['Authorization'];
    }
  };

  // Auth Checks
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token || token === "null") { setUser(false); return; }
      updateAxiosToken(token);
      
      const { data } = await axiosInstance.current.get("/api/auth/is-auth");
      if (data?.success) setUser(data.user);
      else { setUser(false); localStorage.removeItem("token"); }
    } catch (error) { setUser(false); }
  };

  const checkAdmin = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token || token === "null") { setAdmin(false); return; }
      updateAxiosToken(token);
      
      // Ensure this endpoint exists in admin.routes.js
      const { data } = await axiosInstance.current.get("/api/admin/is-admin");
      if (data?.success) setAdmin(data.user);
      else setAdmin(false);
    } catch (error) { setAdmin(false); }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.current.get("/api/category/all");
      if (data.success) setCategoriesData(data.categories || []);
      else setCategoriesData([]);
    } catch (error) {
      console.log("Error fetching categories:", error.message);
      setCategoriesData([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: Fetch Products with Data Sanitization
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.current.get("/api/product/all");
      
      if (data.success && Array.isArray(data.products)) {
        const validProducts = data.products
          .map(product => ({
            ...product,
            // Ensure images is ALWAYS an array to prevent "undefined" errors
            images: Array.isArray(product.images) ? product.images : [],
            // Ensure price is a number
            price: Number(product.price) || 0
          }))
          .filter(product => product && product._id && product.name);
          
        setProductsData(validProducts);
      } else {
        setProductsData([]);
      }
    } catch (error) {
      console.log("Error fetching products:", error.message);
      setProductsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Mock Blogs
  const fetchBlogs = async () => {
    const mockBlogs = [
      { id: 1, image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=500", date: "Jan 15, 2024", title: "Healthy Shopping", desc: "Tips for better eating habits." },
      { id: 2, image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=500", date: "Jan 10, 2024", title: "Seasonal Guide", desc: "Discover seasonal fruits." },
      { id: 3, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500", date: "Jan 5, 2024", title: "Storage Tips", desc: "Extend produce life." }
    ];
    setBlogsData(mockBlogs);
  };

  // Cart & Favorite Logic
  const addToCart = (product) => {
    setCart((prev) => {
      const newCart = [...prev];
      const existing = newCart.find((item) => item._id === product._id);
      if (existing) existing.quantity += 1;
      else newCart.push({ ...product, quantity: 1 });
      toast.success("Added to cart");
      return newCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const newCart = [...prev];
      const existing = newCart.find((item) => item._id === id);
      if (existing) {
        if (existing.quantity === 1) return newCart.filter((item) => item._id !== id);
        else existing.quantity -= 1;
      }
      return newCart;
    });
  };

  const clearCart = () => { setCart([]); toast.success("Cart cleared"); };

  const addToFavorite = (product) => {
    setFavorite((prev) => {
      if (!prev.find((item) => item._id === product._id)) {
        toast.success("Added to favorites");
        return [...prev, product];
      }
      toast.error("Already in favorites");
      return prev;
    });
  };

  const removeFromFavorite = (id) => {
    setFavorite((prev) => prev.filter((item) => item._id !== id));
    toast.success("Removed from favorites");
  };

  const getCartTotal = () => cart.reduce((total, item) => total + (item.offerPrice || item.price || 0) * (item.quantity || 1), 0);

  // Auth Handlers
  const handleLogin = async (token, rememberMe) => {
    rememberMe ? localStorage.setItem("token", token) : sessionStorage.setItem("token", token);
    updateAxiosToken(token);
    await checkAuth();
  };

  const handleAdminLogin = async (token, rememberMe) => {
    rememberMe ? localStorage.setItem("token", token) : sessionStorage.setItem("token", token);
    updateAxiosToken(token);
    await checkAdmin();
  };

  const handleRegister = async (name, email, password, rememberMe) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.current.post("/api/auth/register", { name, email, password });
      if (data.success) {
        rememberMe ? localStorage.setItem("token", data.token) : sessionStorage.setItem("token", data.token);
        updateAxiosToken(data.token);
        setUser(data.user);
        toast.success("Registration successful");
        navigate("/");
        return { success: true, data };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return { success: false, error };
    } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); sessionStorage.removeItem("token");
    updateAxiosToken(null); setUser(false); setAdmin(false); setCart([]);
    toast.success("Logged out"); navigate("/login");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("token"); sessionStorage.removeItem("token");
    updateAxiosToken(null); setAdmin(false);
    toast.success("Admin logged out"); navigate("/admin");
  };

  // Init App
  useEffect(() => {
    const initApp = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) updateAxiosToken(token);
      await Promise.all([fetchCategories(), fetchProducts(), fetchBlogs(), checkAuth()]);
    };
    initApp();
  }, []);

  return (
    <AppContext.Provider value={{
      user, setUser, admin, setAdmin, loading, setLoading,
      categoriesData, productsData, blogsData, cart, setCart, favorite, setFavorite,
      currency: import.meta.env.VITE_CURRENCY || '৳',
      addToCart, removeFromCart, clearCart, addToFavorite, removeFromFavorite, getCartTotal,
      handleLogin, handleAdminLogin, handleRegister, handleLogout, handleAdminLogout, checkAuth, checkAdmin,
      fetchCategories, fetchProducts, fetchBlogs, axios: axiosInstance.current, navigate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;