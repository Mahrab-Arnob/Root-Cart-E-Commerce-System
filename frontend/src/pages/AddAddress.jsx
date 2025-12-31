import { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const AddAddress = () => {
  const { navigate, axios, loading, setLoading, user } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    country: "",
    zipCode: "",
    state: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        toast.error("Please login to add an address");
        navigate("/login");
        return;
      }
      setIsAuthenticated(true);
    };
    
    checkAuth();
  }, [navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Check authentication
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }
    
    // Form validation
    if (!formData.name.trim() || !formData.email.trim() || 
        !formData.city.trim() || !formData.country.trim() || 
        !formData.zipCode.toString().trim() || !formData.state.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      
      // Add debug logging
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      console.log("Auth token exists:", !!token);
      console.log("Request headers will include Authorization:", 
        axios.defaults.headers.common['Authorization'] ? 'Yes' : 'No');
      
      const { data } = await axios.post("/api/address/add", formData);
      
      if (data.success) {
        toast.success(data.message || "Address added successfully!");
        navigate("/checkout");
      } else {
        toast.error(data.message || "Failed to add address");
      }
    } catch (error) {
      console.error("Address error:", error);
      
      // Enhanced error handling
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          navigate("/login");
        } else if (error.response.status === 404) {
          toast.error("Address service unavailable. Please try again later.");
        } else if (error.response.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(`Server error (${error.response.status}). Please try again.`);
        }
      } else if (error.request) {
        toast.error("Network error. Check your internet connection.");
      } else {
        toast.error("Error submitting form. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B482F] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="py-12 bg-[#0B482F] min-h-screen flex items-center justify-center"
      style={{ 
        backgroundImage: `url(${assets.footer_img})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <div className="w-full max-w-2xl px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Add Delivery Address</h2>
          <p className="text-white/80">Please provide your delivery details to continue with checkout</p>
        </div>
        
        <form
          onSubmit={submitHandler}
          className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/20 shadow-2xl"
        >
          {/* Name Field */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-white font-medium mb-2">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 outline-none focus:bg-white/30 focus:border-white transition-all duration-300"
              disabled={loading}
            />
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 outline-none focus:bg-white/30 focus:border-white transition-all duration-300"
              disabled={loading}
            />
          </div>

          {/* City, Country Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="city" className="block text-white font-medium mb-2">
                City <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Dhaka"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 outline-none focus:bg-white/30 focus:border-white transition-all duration-300"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-white font-medium mb-2">
                Country <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                placeholder="Bangladesh"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 outline-none focus:bg-white/30 focus:border-white transition-all duration-300"
                disabled={loading}
              />
            </div>
          </div>

          {/* Zip Code, State Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="zipCode" className="block text-white font-medium mb-2">
                ZIP Code <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                placeholder="1204"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 outline-none focus:bg-white/30 focus:border-white transition-all duration-300"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-white font-medium mb-2">
                State/Division <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="Dhaka Division"
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 outline-none focus:bg-white/30 focus:border-white transition-all duration-300"
                disabled={loading}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-6 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
              disabled={loading}
            >
              Go Back
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-6 font-semibold rounded-lg transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-secondary hover:scale-[1.02]'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding Address...
                </span>
              ) : (
                "Add Address & Continue"
              )}
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Your address information is secure and will only be used for delivery purposes.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddress;