const Contact = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="text-center mb-10 md:mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We're always here to help! Reach out to us through any of the channels below for 
          product inquiries, order assistance, or general support.
        </p>
      </div>

      {/* Contact Information Card - Now centered */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 md:p-8 rounded-3xl shadow-xl border border-primary/20">
        <div className="flex items-center mb-8">
          <div className="bg-primary p-4 rounded-2xl mr-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Contact Information</h2>
            <p className="text-gray-600 mt-1">We'd love to hear from you!</p>
          </div>
        </div>
        
        <p className="mb-8 text-gray-700 text-lg leading-relaxed text-center">
         Root&Cart brings Bangladesh's freshest groceries directly to your doorstep. Have questions about our products, delivery, or need order support? Our team is here to ensure your online grocery experience is seamless and satisfying. We're passionate about connecting you with quality local produce and providing the personalized service you deserve.
        </p>
        
        {/* Contact Details Grid */}
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Address */}
          <div className="flex items-start bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-primary/10 p-3 rounded-lg mr-5">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg mb-1">Visit Our Store</h3>
              <p className="text-gray-600">70/2, Razzan Ali Sardar Road, Jurain, Dhaka, Bangladesh</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">📍 Central Location</span>
                
              </div>
            </div>
          </div>
          
          {/* Phone */}
          <div className="flex items-start bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-primary/10 p-3 rounded-lg mr-5">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg mb-1">Call Us Directly</h3>
              <a href="tel:+8801902400639" className="text-primary hover:text-secondary text-xl font-semibold block mb-1 transition-colors">
                +880 19024 00639
              </a>
              <p className="text-gray-600">Speak with our customer service team</p>
              <div className="mt-2">
                <p className="text-sm text-gray-500"><strong>Hours:</strong> Mon-Sat: 9:00 AM - 8:00 PM</p>
                <p className="text-sm text-gray-500"><strong>After Hours:</strong> Leave a voicemail for callback</p>
              </div>
            </div>
          </div>
          
          {/* Email */}
          <div className="flex items-start bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-primary/10 p-3 rounded-lg mr-5">
              <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg mb-1">Email Us</h3>
              <a href="mailto:support@grocerystore.com" className="text-primary hover:text-secondary text-xl font-semibold block mb-1 transition-colors">
                support@grocerystore.com
              </a>
              <p className="text-gray-600">For inquiries, orders, and support</p>
              <div className="mt-2">
                <p className="text-sm text-gray-500"><strong>Response Time:</strong> Typically within 2-4 business hours</p>
                <p className="text-sm text-gray-500"><strong>Order Support:</strong> orders@rootandcart.com</p>
              </div>
            </div>
          </div>
          
          
        </div>
        
       
      </div>
    </div>
  );
};

export default Contact;