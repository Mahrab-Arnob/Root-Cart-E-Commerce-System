import { Link } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext.jsx";

const Login = () => {
  const { navigate, handleLogin, axios } = useContext(AppContext);
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "",
    rememberMe: false 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data } = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password
      });
      
      if (data.success) {
        // Store the token if it exists in response
        if (data.token) {
          await handleLogin(data.token, formData.rememberMe);
        }
        
        toast.success(data.message || "Login successful!");
        navigate("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Invalid email or password");
        } else if (error.response.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Login failed. Please try again.");
        }
      } else if (error.request) {
        toast.error("Network error. Check your connection.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="py-12 min-h-screen bg-[#0B482F] flex items-center justify-center"
      style={{ 
        backgroundImage: `url(${assets.footer_img})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center' 
      }}
    >
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-white font-bold mb-2 capitalize">
            Login to your account
          </h1>
          <p className="text-white/80">Welcome back! Please enter your details</p>
        </div>
        
        <form
          onSubmit={submitHandler}
          className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/20 shadow-2xl"
        >
          {/* Email Field */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-white font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 outline-none focus:bg-white/30 focus:border-white transition-all duration-300"
              disabled={isLoading}
            />
          </div>
          
          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-white font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 outline-none focus:bg-white/30 focus:border-white transition-all duration-300"
              disabled={isLoading}
            />
          </div>
          
          {/* Remember Me */}
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-primary bg-white/20 border-white/30 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="rememberMe" className="ml-2 text-white">
              Remember me
            </label>
          </div>
          
          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-secondary hover:scale-[1.02]'}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
          
          {/* Signup Link */}
          <p className="mt-6 text-center text-white">
            Don't have an account?{" "}
            <Link 
              to="/signup" 
              className="text-primary font-semibold hover:underline transition-all duration-300"
            >
              Sign up
            </Link>
          </p>
          
          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <Link 
              to="/forgot-password" 
              className="text-white/70 text-sm hover:text-white transition-all duration-300"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;