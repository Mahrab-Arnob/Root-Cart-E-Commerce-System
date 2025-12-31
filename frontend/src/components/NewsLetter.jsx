import { assets } from "../assets/assets";
const NewsLetter = () => {
  return (
    <div className="bg-[#FFF4DF] py-12 rounded-md">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6">
        <div>
          <img
            src={assets.organic_fruits}
            alt=""
            className="w-full md:w-1/2 "
          />
        </div>

        <div className="flex flex-col items-center text-center gap-3">
          <h1 className="text-3xl font-bold">Signup our NewLetter</h1>
          <p className="text-sm">Get 10% off on your first order</p>
        </div>

        <form className="flex items-center border gap-2 bg-white border-gray-500/30 h-12 max-w-md w-full rounded-full overflow-hidden">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-full pl-6 outline-none text-sm bg-transparent placeholder-gray-500"
            required
          />
          <button
            type="submit"
            className="bg-primary active:scale-95 transition w-56 h-10 rounded-full text-sm text-white cursor-pointer mr-1"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};
export default NewsLetter;