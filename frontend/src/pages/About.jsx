import { assets } from "../assets/assets";
import Brands from "../components/Brands";
const About = () => {
  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold text-center">
        About Our Farm & Farmers
      </h1>
      <p className="text-lg mt-4 text-center max-w-4xl mx-auto">
        Nam mollis odio vitae enim vulputate, eget tempor magna auctor.
        Phasellus a scelerisque nisl, sit amet suscipit diam. Nulla accumsan
        sodales venenatis. Aenean commodo porta nibh, et fringilla velit
        convallis eget. In hac habitasse platea dictumst. Ut efficitur sem nibh,
        nec molestie sapien finibus eget. In id semper enim. Duis dignissim
        convallis est, ut finibus nisi tempor maxim
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center mt-12 bg-black text-white">
        <div>
          <img src={assets.about_hero} alt="" className="w-full md:w-1/2" />
        </div>
        <div className="flex flex-col gap-3 p-3">
          <h1 className="text-3xl font-bold">Deal of the Day</h1>
          <p>
            {" "}
            Della semper accumsan magna et ultrices. Aenean at varius purus.
            Nulla egestas semper tellus.
          </p>
          <button className="bg-secondary text-white px-4 py-2">Shop</button>
        </div>
      </div>
      <Brands />
    </div>
  );
};
export default About;