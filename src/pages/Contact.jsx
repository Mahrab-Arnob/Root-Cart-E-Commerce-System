import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-md"
        >
          <div className="mb-4">
            <label htmlFor="" className="block mb-1 font-medium"></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-green-300"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-green-300"
              placeholder="Enter your email address"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-green-300"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            Send Message
          </button>
        </form>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <p className="mb-3 text-gray-600">
            Have questions about our products or services? Reach out to us using
            the form or contact details below.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li>
              <strong>Address:</strong> 123 Green Street, Lahore, Pakistan
            </li>
            <li>
              <strong>Phone:</strong> +92 300 1234567
            </li>
            <li>
              <strong>Email:</strong> support@example.com
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Contact;