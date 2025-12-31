import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";
const Products = () => {
  const { productsData, navigate } = useContext(AppContext);
  
  // Handle loading/empty states
  if (!productsData || productsData.length === 0) {
    return (
      <div className="py-12">
        <div className="flex items-center">
          <h2 className="max-w-lg text-lg font-medium">
            Recently Arrived Products
          </h2>
          <div className="ml-1 w-20 flex border-b border-secondary border-2"></div>
        </div>
        <h2 className="mt-4 text-secondary font-extrabold text-3xl">
          Pick Your Favorite One
        </h2>
        <div className="mt-6 text-center py-10">
          <p className="text-gray-500">No products available at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="flex items-center">
        <h2 className="max-w-lg text-lg font-medium">
          Recently Arrived Products
        </h2>
        <div className="ml-1 w-20 flex border-b border-secondary border-2"></div>
      </div>
      <h2 className="mt-4 text-secondary font-extrabold text-3xl">
        Pick Your Favorite One
      </h2>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center justify-center gap-4">
        {productsData.map((product) => (
          <ProductCard key={product?._id || Math.random()} product={product} />
        ))}
      </div>
    </div>
  );
};
export default Products;