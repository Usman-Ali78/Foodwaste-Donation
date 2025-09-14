import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.tel) {
      newErrors.tel = "Phone number is required";
    } else if (formData.tel.length < 11) {
      newErrors.tel = "Phone number must be at least 11 characters";
    }
    if (!formData.message) newErrors.message = "Message cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
      setFormData({ name: "", email: "", tel: "", message: "" });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[700px] bg-gradient-to-r from-green-100 to-orange-100 sm:pt-0">
      <div className="max-w-5xl w-full mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/70 backdrop-blur-md shadow-xl rounded-xl overflow-hidden">
          {/* Left Section */}
          <div className="bg-gradient-to-br from-green-50 to-orange-50 p-10 flex flex-col justify-center ">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-6">
              We’d love to hear from you! <br />
              Fill out the form or reach us directly:
            </p>
            <ul className="space-y-3">
              <li className="text-gray-700">📍 Address: XYZ Street, City</li>
              <li className="text-gray-700">📧 Email: contact@example.com</li>
              <li className="text-gray-700">📞 Phone: +92-300-0000000</li>
            </ul>
          </div>

          {/* Right Section (Form) */}
          <form
            onSubmit={handleSubmit}
            className="p-8 flex flex-col justify-center bg-gradient-to-br from-green-50 to-orange-50 shadow-lg rounded-xl"
          >
            <div className="flex flex-col mb-4">
              <label htmlFor="name" className="font-medium text-gray-800">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-2 py-3 px-4 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:outline-none"
                placeholder="Full Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="email" className="font-medium text-gray-800">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-2 py-3 px-4 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:outline-none"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="tel" className="font-medium text-gray-800">
                Telephone Number
              </label>
              <input
                type="tel"
                name="tel"
                id="tel"
                value={formData.tel}
                onChange={handleChange}
                className="w-full mt-2 py-3 px-4 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:outline-none"
                placeholder="Telephone Number"
              />
              {errors.tel && (
                <p className="text-red-500 text-sm">{errors.tel}</p>
              )}
            </div>

            <div className="flex flex-col mb-4">
              <label htmlFor="message" className="font-medium text-gray-800">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full mt-2 py-3 px-4 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:outline-none"
                placeholder="Your message..."
                rows="4"
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full md:w-40 bg-orange-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
