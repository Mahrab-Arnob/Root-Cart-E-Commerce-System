import { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { useSearchParams } from "react-router-dom";

const Shop = () => {
  const { productsData, categoriesData } = useContext(AppContext);
  const [input, setInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  
  // Debug: Check what we're receiving
  console.log("Category ID from URL:", categoryId);
  console.log("Total products:", productsData?.length);
  console.log("Categories:", categoriesData);

  const handleSearch = useCallback(() => {
    if (!productsData || productsData.length === 0) {
      setFilteredProducts([]);
      return;
    }
    
    let result = [...productsData];
    
    // Filter by category if categoryId exists
    if (categoryId && categoryId !== "undefined") {
      console.log("Filtering for category:", categoryId);
      result = result.filter(product => {
        // Check multiple possible category field structures
        const productCategoryId = 
          product.category?._id || 
          product.category || 
          product.categoryId ||
          product.category_id;
        
        console.log(`Product: ${product.name}, Category: ${productCategoryId}`);
        return productCategoryId === categoryId;
      });
    }
    
    // Then filter by search query
    const query = input.toLowerCase().trim();
    if (query !== "") {
      result = result.filter((product) =>
        product.name?.toLowerCase().includes(query)
      );
    }
    
    console.log("Filtered result:", result.length, "products");
    setFilteredProducts(result);
  }, [input, productsData, categoryId]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  // Get category name for display
  const getCategoryName = () => {
    if (!categoryId || categoryId === "undefined" || !categoriesData) return null;
    const category = categoriesData.find(cat => cat._id === categoryId);
    return category?.name;
  };

  // If products are still loading
  if (productsData.length === 0) {
    return (
      <div className="py-12 px-4 md:px-8 lg:px-16 text-center">
        <h1 className="text-2xl font-bold">Loading products...</h1>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 md:px-8 lg:px-16">
      <div className="flex items-center justify-center mt-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-4 md:px-10 py-3 outline-none border border-secondary w-full max-w-md"
          placeholder="Search for products"
        />
        <button className="hidden md:flex px-10 py-3 bg-primary text-white cursor-pointer ml-2">
          Search
        </button>
      </div>
      
      {/* Category Filter Header */}
      {categoryId && categoryId !== "undefined" && (
        <div className="mt-6 flex items-center justify-between">
          <div>
            <h1 className="text-secondary font-extrabold text-3xl">
              {getCategoryName() || "Category"} Products
            </h1>
            <p className="text-gray-600 mt-2">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 text-primary border border-primary rounded hover:bg-primary hover:text-white"
          >
            Back to All Categories
          </button>
        </div>
      )}
      
      {(!categoryId || categoryId === "undefined") && (
        <h1 className="mt-8 text-secondary font-extrabold text-3xl">
          Explore All Products
        </h1>
      )}
      
      {filteredProducts.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-lg">
            {categoryId && categoryId !== "undefined"
              ? `No products found in "${getCategoryName() || "this category"}". Try another category.`
              : input
                ? `No products found for "${input}"`
                : "No products available in the shop"}
          </p>
          <button
            onClick={() => {
              setInput("");
              if (categoryId) {
                window.location.href = "/shop";
              }
            }}
            className="mt-4 px-6 py-2 bg-primary text-white rounded"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;