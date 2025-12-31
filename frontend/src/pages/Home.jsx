import Blogs from "../components/Blogs";

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

      <NewsLetter />
    </div>
  );
};
export default Home;