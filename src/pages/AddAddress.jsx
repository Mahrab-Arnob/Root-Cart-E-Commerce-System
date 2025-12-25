import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
const AddAddress = () => {
  const { navigate, axios, loading, setLoading } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    country: "",
    zipCode: "",
    state: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/address/add", formData);
      if (data.success) {
        toast.success(data.message);
        navigate("/checkout");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="py-12 bg-[#0B482F]"
      style={{ backgroundImage: `url(${assets.footer_img})` }}
    >
      <div>
        <form
          onSubmit={submitHandler}
          className="max-w-xl w-full mx-auto text-white p-4 border border-white rounded"
        >
          <div className="text-white flex flex-col gap-2 mb-4">
            <label htmlFor="">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full outline-none border border-white py-3 rounded p-2"
            />
          </div>

          <div className="text-white flex flex-col gap-2 mb-4">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              required
              placeholder="Enter your email"
              className="w-full outline-none border border-white py-3 p-2 rounded"
            />
          </div>

          <div className="text-white flex flex-col gap-2 mb-4">
            <label htmlFor="city">City</label>
            <input
              type="text"
              name="city"
              onChange={handleChange}
              value={formData.city}
              required
              placeholder="Enter your city"
              className="w-full outline-none border border-white py-3 p-2 rounded"
            />
          </div>

          <div className="text-white flex flex-col gap-2 mb-4">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              name="country"
              onChange={handleChange}
              value={formData.country}
              required
              placeholder="Enter your country"
              className="w-full outline-none border border-white py-3 p-2 rounded"
            />
          </div>
          <div className="text-white flex flex-col gap-2 mb-4">
            <label htmlFor="zipCode">Zip Code</label>
            <input
              type="number"
              name="zipCode"
              onChange={handleChange}
              value={formData.zipCode}
              required
              placeholder="Enter your country"
              className="w-full outline-none border border-white py-3 p-2 rounded"
            />
          </div>
          <div className="text-white flex flex-col gap-2 mb-4">
            <label htmlFor="state">State</label>
            <input
              type="text"
              name="state"
              onChange={handleChange}
              value={formData.state}
              required
              placeholder="Enter your state"
              className="w-full outline-none border border-white py-3 p-2 rounded"
            />
          </div>
          <button className="w-full bg-primary text-white cursor-pointer py-3">
            {loading ? "Please wait..." : "Add Address"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AddAddress;