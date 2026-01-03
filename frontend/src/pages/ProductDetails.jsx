import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion"; // Make sure you use 'framer-motion' or 'motion/react' consistently
import { Heart, ShoppingBasket } from "lucide-react";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {
  const { productsData, currency, addToCart, addToFavorite } = useContext(AppContext);
  const { id } = useParams();
  
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Load Product Data
  useEffect(() => {
    if (productsData && productsData.length > 0) {
      const foundProduct = productsData.find((item) => item._id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        
        // SAFE IMAGE SETTING
        if (foundProduct.images && foundProduct.images.length > 0) {
          setMainImage(foundProduct.images[0]);
        } else {
          setMainImage(null); // Will trigger fallback in getImageUrl
        }
      }
    }
  }, [id, productsData]);

  // Load Related Products
  useEffect(() => {
    if (product && productsData) {
      const related = productsData.filter(
        (item) => item.category?._id === product.category?._id && item._id !== product._id
      );
      setRelatedProducts(related);
    }
  }, [product, productsData]);

  // Image URL Helper
  const getImageUrl = (imageName) => {
    if (!imageName) return "https://placehold.co/600x600?text=No+Image";
    if (imageName.startsWith("http")) return imageName;
    return `http://localhost:4000/uploads/${imageName}`;
  };

  if (!product) return <div className="text-center py-20">Loading product details...</div>;

  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row items-start mt-6 gap-6 justify-center">
        
        {/* Left Side - Gallery */}
        <div className="flex flex-col items-center space-y-4 w-full md:w-1/2">
          <div className="w-full max-w-lg border rounded-lg overflow-hidden bg-gray-50">
            <img
              src={getImageUrl(mainImage)}
              alt="Main Product"
              className="w-full h-96 object-contain mix-blend-multiply"
            />
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto py-2">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={getImageUrl(img)}
                alt={`Thumbnail ${index}`}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                  mainImage === img ? "border-secondary" : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Info */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-500 text-sm">Category: {product.category?.name || "N/A"}</p>
          
          <div className="flex items-center gap-4">
             <span className="text-3xl font-bold text-red-600">
               {currency}{product.offerPrice > 0 ? product.offerPrice : product.price}
             </span>
             {product.offerPrice > 0 && (
               <span className="text-xl text-gray-400 line-through">
                 {currency}{product.price}
               </span>
             )}
          </div>
          
          <p className="text-gray-600">{product.description}</p>
          
          <div className="flex gap-4 mt-6">
            <motion.button
              onClick={() => addToCart(product)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-green-700 transition"
            >
              <ShoppingBasket size={20} />
              Add to Cart
            </motion.button>
            
            <motion.button
              onClick={() => addToFavorite(product)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              <Heart size={20} />
              Wishlist
            </motion.button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;