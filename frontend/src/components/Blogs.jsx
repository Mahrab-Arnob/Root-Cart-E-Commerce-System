import { motion } from "motion/react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Blogs = () => {
  const { blogsData } = useContext(AppContext);
  
  // Add this safety check
  if (!blogsData || !Array.isArray(blogsData) || blogsData.length === 0) {
    return (
      <div className="py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Blogs</h2>
          <p className="text-gray-600">No blogs available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Blogs</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay updated with the latest tips, recipes, and news from our grocery world.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center">
        {blogsData.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
            >
              <img 
                src={item.image} 
                alt={item.title || "Blog Image"} 
                className="w-full h-48 object-cover rounded-xl mb-4" 
              />
            </motion.div>
            <div className="flex items-center my-4">
              <h2 className="text-lg font-semibold text-gray-700">{item.date}</h2>
              <div className="ml-3 w-16 border-b border-secondary border-2"></div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h1>
            <p className="text-gray-600 text-sm mb-5 line-clamp-3">{item.desc}</p>
            <button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors">
              Read More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;