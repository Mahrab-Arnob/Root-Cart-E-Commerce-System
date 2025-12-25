import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const { productsData } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [filteredProdcuts, setFilteredProdcuts] = useState(productsData);
  const handleSearch = () => {
    const query = input.toLowerCase().trim();
    if (query === "") {
      setFilteredProdcuts(productsData);
    } else {
      const result = productsData.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
      setFilteredProdcuts(result);
    }
  };
  useEffect(() => {
    handleSearch();
  }, [input, productsData]);
  return (
    <div className="py-12 px-4 md:px-8 lg:px-16">
      <div className="flex items-center justify-center mt-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-10 py-3 outline-none border border-secondary"
          placeholder="Search for products"
        />
        <button className="hidden md:flex px-10 py-[13px] bg-primary text-white cursor-pointer">
          Search
        </button>
      </div>
      <h1 className="mt-4 text-secondary font-extrabold text-3xl">
        Explore All Products
      </h1>
      <div className="mt-6 grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center justify-center gap-4">
        {filteredProdcuts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
export default Shop;