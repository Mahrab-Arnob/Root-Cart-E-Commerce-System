import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Category = () => {
  const { categoriesData } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Color array for category backgrounds
  const colors = [
    "bg-red-300",
    "bg-green-300", 
    "bg-blue-300",
    "bg-cyan-300",
    "bg-purple-300",
    "bg-pink-300",
    "bg-orange-300",
    "bg-teal-300",
    "bg-yellow-300",
    "bg-indigo-300",
    "bg-lime-300",
    "bg-amber-300",
  ];

  // Get color safely with fallback to first color
  const getColor = (index) => {
    return colors[index % colors.length];
  };

  // Only enable loop if we have enough categories
  const shouldLoop = categoriesData && categoriesData.length > 6;

  // Handle category click - navigate to shop with category filter
  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category._id)}`);
  };

  // Helper function to get proper image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If image URL already starts with http, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If image starts with /uploads, use it with localhost
    if (imageUrl.startsWith('/uploads')) {
      return `http://localhost:4000${imageUrl}`;
    }
    
    // Otherwise, add /uploads/ prefix
    return `http://localhost:4000/uploads/${imageUrl}`;
  };

  // Don't render if no categories
  if (!categoriesData || categoriesData.length === 0) {
    return (
      <div className="py-12">
        <div className="flex items-center">
          <h2 className="max-w-lg text-lg font-medium">Category</h2>
          <div className="ml-1 w-20 flex border-b border-secondary border-2"></div>
        </div>
        <h2 className="mt-4 text-secondary font-extrabold text-3xl">
          Shop By Collection
        </h2>
        <div className="w-full my-5 text-center py-10">
          <p className="text-gray-500">No categories available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="flex items-center">
        <h2 className="max-w-lg text-lg font-medium">Category</h2>
        <div className="ml-1 w-20 flex border-b border-secondary border-2"></div>
      </div>
      <h2 className="mt-4 text-secondary font-extrabold text-3xl">
        Shop By Collection
      </h2>

      <Swiper
        modules={[Autoplay]}
        autoplay={{ 
          delay: 4000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop={shouldLoop}
        slidesPerView={6}
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 20,
          },
        }}
        className="w-full my-5"
      >
        {categoriesData.map((category, index) => {
          const imageUrl = getImageUrl(category.image);
          
          return (
            <SwiperSlide key={category._id || index}>
              <motion.div
                whileHover={{ 
                  rotate: 360,
                  scale: 1.05 
                }}
                transition={{ 
                  rotate: { duration: 0.3 },
                  scale: { duration: 0.2 }
                }}
                onClick={() => handleCategoryClick(category)}
                className={`w-[130px] md:w-[150px] h-[170px] rounded-md ${getColor(index)} flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300 mx-auto group`}
              >
                <div className="w-28 h-28 rounded-full bg-white/70 flex items-center justify-center mb-2 group-hover:bg-white/90 transition-all overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        console.error('Failed to load image:', imageUrl);
                        e.target.style.display = 'none';
                        const fallback = document.createElement('span');
                        fallback.className = 'text-3xl font-bold text-gray-700';
                        fallback.textContent = category.name.charAt(0);
                        e.target.parentElement.appendChild(fallback);
                      }}
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-700">
                      {category.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mt-1 text-center px-1 line-clamp-1">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  {category.productCount || 0} products
                </p>
              </motion.div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Category;