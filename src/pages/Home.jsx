import Blogs from "../components/Blogs";
import Brands from "../components/Brands";
import CallToAction from "../components/CallToAction";
import Category from "../components/Category";
import Hero from "../components/Hero";
import NewsLetter from "../components/NewsLetter";
import Products from "../components/Products";

const Home = () => {
  return (
    <div>
      <Hero />
      <Category />
      <Products />
      <CallToAction />
      <Blogs />
      <Brands />
      <NewsLetter />
    </div>
  );
};
export default Home;