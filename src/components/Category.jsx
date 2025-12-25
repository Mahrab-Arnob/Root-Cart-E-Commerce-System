import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
const Category = () => {
  const { categoriesData } = useContext(AppContext);
  const colors = [
    "bg-red-300",
    "bg-green-300",
    "bg-blue-300",
    "bg-cyan-300",
    "bg-purple-300",
    "bg-pink-300",
    "bg-orange-300",
    "bg-teal-300",
  ];
  return (
    <div className="py-12">
      <div className="flex items-center">
        <h2 className="max-w-lg text-lg font-medium">Category</h2>
        <div className="ml-1 w-20 flex border-b border-secondary border-2"></div>
      </div>
      <h2 className="mt-4 text-secondary font-extrabold text-3xl">
        Shop By Collection{" "}
      </h2>

      <Swiper
        modules={{ Autoplay }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        slidesPerView={6}
        breakpoints={{
          0: {
            slidesPerView: 2,
          },

          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 6,
          },
        }}
        className="w-full my-5"
      >
        {categoriesData.map((category, i) => (
          <SwiperSlide key={i}>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.3 }}
              className={`w-130px] md:w[150px] h[170px]  rounded-md ${colors[i]} flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300`}
            >
              <img
                src={`http://localhost:4000/uploads/${category.image}`}
                alt=""
                className="w-32 h-32"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {category.name}
              </h3>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default Category;