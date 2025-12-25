import { motion } from "motion/react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
const Blogs = () => {
  const { blogsData } = useContext(AppContext);
  return (
    <div className="py-12 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center">
        {blogsData.map((item, i) => (
          <div key={i}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
            >
              <img src={item.image} alt="" className="w-full rounded-2xl" />
            </motion.div>
            <div className="flex items-center my-4">
              <h2 className="max-w-lg text-lg font-semibold">{item.date}</h2>
              <div className="ml-1 w-20 flex border-b border-secondary border-2"></div>
            </div>
            <h1 className="text-xl font-bold">{item.title}</h1>
            <p className="text-sm font-normal">{item.desc}</p>
            <button className="bg-secondary text-white px-6 py-2 cursor-pointer mt-5">
              Read More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Blogs;