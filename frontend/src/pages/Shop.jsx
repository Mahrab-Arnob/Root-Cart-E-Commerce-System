import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";

const Shop = () => {
  const { productsData } = useContext(AppContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  useEffect(() => {
    if (!productsData) return;

    let result = [...productsData];

    if (categoryId && categoryId !== "undefined") {
      result = result.filter(product => 
        product.category?._id === categoryId || product.category === categoryId
      );
    }

    setFilteredProducts(result);
  }, [categoryId, productsData]);

  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-6 text-secondary">
        {categoryId ? "Filtered Products" : "All Products"}
      </h1>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;