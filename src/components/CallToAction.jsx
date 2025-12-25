import { assets } from "../assets/assets";
import { motion } from "motion/react";
const CallToAction = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between  gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#FDF5F1] flex flex-col md:flex-row gap-5 items-center justify-between p-4 rounded-2xl"
        >
          <div className="flex flex-col gap-3">
            <h1 className="text-primary text-2xl font-bold uppercase">
              Healty Organic Fruits
            </h1>
            <h2 className="text-2xl font-semibold text-secondary">
              Get 20% Flat Off
            </h2>
            <button className="px-6 py-3 bg-secondary text-white hover:bg-primary transition-all ease-in-out duration-300 cursor-pointer">
              View all items
            </button>
          </div>
          <img src={assets.organic_fruits} alt="" className="w-1/2" />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-[#EEF9FC] flex flex-col md:flex-row gap-5 items-center justify-between p-4 rounded-2xl"
        >
          <div className="flex flex-col gap-3">
            <h1 className="text-primary text-2xl font-bold uppercase">
              Get 10% Flat Offer on
            </h1>
            <h2 className="text-2xl font-semibold text-secondary">
              Fresh Organic Vegetables
            </h2>
            <button className="px-6 py-3 bg-secondary text-white hover:bg-primary transition-all ease-in-out duration-300 cursor-pointer">
              View all items
            </button>
          </div>
          <img src={assets.organic_fruits} alt="" className="w-1/2" />
        </motion.div>
      </div>
    </div>
  );
};
export default CallToAction;