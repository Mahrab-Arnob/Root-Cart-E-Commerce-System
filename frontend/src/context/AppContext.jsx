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
  const [blogsData, setBlogsData] = useState([]); // Add this line back
  const [cart, setCart] = useState([]);
  const [favorite, setFavorite] = useState([]);
  
  // Create axios instance
  const axiosInstance = useRef(
    axios.create({
      baseURL: import.meta.env.VITE_BASEURL || "http://localhost:4000",
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  );

  // Update axios token in headers
  const updateAxiosToken = (token) => {
    if (token && token !== "null" && token !== "undefined") {
      axiosInstance.current.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.current.defaults.headers.common['Authorization'];
    }
  };

  // Check authentication
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      if (!token || token === "null" || token === "undefined") {
        setUser(false);
        return;
      }

      updateAxiosToken(token);
      
      const { data } = await axiosInstance.current.get("/api/auth/is-auth");
      
      if (data?.success) {
        setUser(data.user);
      } else {
        setUser(false);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
      }
    } catch (error) {
      setUser(false);
    }
  };

  // Check admin status
  const checkAdmin = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      if (!token || token === "null" || token === "undefined") {
        setAdmin(false);
        return;
      }

      updateAxiosToken(token);
      
      const { data } = await axiosInstance.current.get("/api/admin/is-admin");
      
      if (data?.success) {
        setAdmin(data.user);
      } else {
        setAdmin(false);
      }
    } catch (error) {
      setAdmin(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.current.get("/api/category/all");
      
      if (data.success) {
        setCategoriesData(data.categories || []);
      } else {
        setCategoriesData([]);
      }
    } catch (error) {
      console.log("Error fetching categories:", error.message);
      setCategoriesData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.current.get("/api/product/all");
      
      if (data.success && Array.isArray(data.products)) {
        const validProducts = data.products.filter(product => 
          product && product._id && product.name
        );
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

  // FETCH BLOGS FUNCTION - Add this back
  const fetchBlogs = async () => {
    try {
      // Create mock blog data matching your Blogs.jsx structure
      const mockBlogs = [
        {
          id: 1,
          image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          date: "Jan 15, 2024",
          title: "5 Tips for Healthy Grocery Shopping",
          desc: "Learn how to make healthier choices at the grocery store with these simple tips and tricks for better eating habits."
        },
        {
          id: 2,
          image: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          date: "Jan 10, 2024",
          title: "Seasonal Fruits and Vegetables Guide",
          desc: "Discover which fruits and vegetables are in season this month for the best flavor, nutrition, and value."
        },
        {
          id: 3,
          image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          date: "Jan 5, 2024",
          title: "How to Store Fresh Produce Longer",
          desc: "Proper storage techniques can extend the life of your fruits and vegetables and reduce food waste."
        }
      ];
      
      setBlogsData(mockBlogs);
    } catch (error) {
      console.log("Error in fetchBlogs:", error.message);
      setBlogsData([]);
    }
  };

  // Cart operations
  const addToCart = (product) => {
    setCart((prev) => {
      const newCart = [...prev];
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

  const removeFromCart = (id) => {
    setCart((prev) => {
      const newCart = [...prev];
      const existingProduct = newCart.find((item) => item._id === id);
      
      if (existingProduct) {
        if (existingProduct.quantity === 1) {
          return newCart.filter((item) => item._id !== id);
        } else {
          existingProduct.quantity -= 1;
        }
      }
      
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    toast.success("Cart cleared");
  };

  // Favorite operations
  const addToFavorite = (product) => {
    setFavorite((prev) => {
      const newFavs = [...prev];
      if (!newFavs.find((item) => item._id === product._id)) {
        newFavs.push(product);
        toast.success("Product added to favorites");
      } else {
        toast.error("Product already in favorites");
      }
      return newFavs;
    });
  };

  const removeFromFavorite = (id) => {
    setFavorite((prev) => {
      const newFavs = prev.filter((item) => item._id !== id);
      toast.success("Product removed from favorites");
      return newFavs;
    });
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + (item.offerPrice || item.price || 0) * (item.quantity || 1),
      0
    );
  };

  // Auth operations
  const handleLogin = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.current.post("/api/auth/login", {
        email,
        password
      });
      
      if (data.success) {
        if (rememberMe) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }
        
        updateAxiosToken(data.token);
        setUser(data.user);
        
        await checkAdmin();
        
        toast.success("Login successful");
        navigate("/");
        return { success: true, data };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (name, email, password, rememberMe = false) => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.current.post("/api/auth/register", {
        name,
        email,
        password
      });
      
      if (data.success) {
        if (rememberMe) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }
        
        updateAxiosToken(data.token);
        setUser(data.user);
        
        toast.success("Registration successful");
        navigate("/");
        return { success: true, data };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    updateAxiosToken(null);
    setUser(false);
    setAdmin(false);
    setCart([]);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    updateAxiosToken(null);
    setAdmin(false);
    toast.success("Admin logged out");
    navigate("/admin");
  };

  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      // Set up token if exists
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token && token !== "null" && token !== "undefined") {
        updateAxiosToken(token);
      }
      
      // Load data - ADD fetchBlogs here
      await Promise.all([
        fetchCategories(),
        fetchProducts(),
        fetchBlogs(), // ADD THIS LINE
        checkAuth()
      ]);
    };
    
    initApp();
  }, []);

  // Value to provide - MAKE SURE blogsData and fetchBlogs are included
  const value = {
    user,
    setUser,
    admin,
    setAdmin,
    loading,
    setLoading,
    categoriesData,
    productsData,
    blogsData, // MAKE SURE THIS IS INCLUDED
    cart,
    setCart,
    favorite,
    setFavorite,
    currency: import.meta.env.VITE_CURRENCY || '৳',
    
    // Methods
    addToCart,
    removeFromCart,
    clearCart,
    addToFavorite,
    removeFromFavorite,
    getCartTotal,
    
    // Auth methods
    handleLogin,
    handleRegister,
    handleLogout,
    handleAdminLogout,
    checkAuth,
    checkAdmin,
    
    // Data methods
    fetchCategories,
    fetchProducts,
    fetchBlogs, // MAKE SURE THIS IS INCLUDED
    
    // Axios instance
    axios: axiosInstance.current
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;