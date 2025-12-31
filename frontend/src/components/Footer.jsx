import { Link } from "react-router-dom";
import { assets } from "../assets/assets.js";
const Footer = () => {
  return (
    <div
      className="py-24 my-12 bg-[#086d40ee]"
      style={{ backgroundImage: `url(${assets.footer_img})` }}
    >
      <div className="flex flex-wrap justify-center items-center gap-10">
        <div>
           <Link to={'/'} className='flex items-center gap-2 '>
                <h1 className='text-3xl font-bold text-green-900'>Root <span className='text-3xl font-bold text-orange-500'>&</span> Cart</h1>
            </Link>
          <h3 className="text-white max-w-lg text-center px-4">
            {" "}
            The Future of Grocery Shopping is Here. Seamlessly browse, select, and order your groceries online with Root&Cart. Enjoy fresh produce, exclusive deals, and swift delivery right to your doorstep. Experience convenience like never before!
          </h3>
        </div>

        <div className="flex flex-col items-center text-white">
          <h1 className="text-2xl font-semibold">UseFul Pages</h1>
          <Link to={"/"}>Home</Link>
          <Link to={"/shop"}>Shop</Link>
          <Link to={"/about"}>About</Link>
          <Link to={"/contact"}>Contact</Link>
        </div>
        <div className="flex flex-col items-center text-white">
          <h1 className="text-2xl font-semibold">Help Center</h1>
          <Link to={""}>Payment</Link>
          <Link to={""}>Shipping</Link>
          <Link to={""}>Product returns</Link>
          <Link to={""}>CheckOut</Link>
        </div>
        <div className="flex flex-col items-center text-white">
          <h1 className="text-2xl font-semibold">Help Center</h1>
          <Link to={""}>Payment</Link>
          <Link to={""}>Shipping</Link>
          <Link to={""}>Product returns</Link>
          <Link to={""}>CheckOut</Link>
        </div>
        <div className="flex flex-col items-center text-white gap-3">
          <h1 className="text-2xl font-semibold">Download App</h1>
          <div className="flex items-center gap-2">
            <img src={assets.app_store} alt="" />
          </div>
          <div className="flex items-center gap-2">
            <img src={assets.play_store} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;