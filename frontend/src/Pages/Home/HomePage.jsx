import React, { useState, useEffect } from "react";
import mainImage from "../../assets/MainPage.jpg";
import image1 from "../../assets/Needy1.jfif";
import image2 from "../../assets/Needy2.jfif";
import image3 from "../../assets/Needy3.jfif";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const handleClick = () => {
    navigate("/login");
  };

  const handleLearnMore = () => {
    navigate("/about");
  };

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      text: "This platform made it so easy for our restaurant to donate excess food instead of throwing it away.",
      author: "Rajesh, Restaurant Owner"
    },
    {
      text: "As a volunteer, I've seen firsthand how these donations transform lives in our community.",
      author: "Priya, NGO Volunteer"
    },
    {
      text: "The seamless process ensures that food reaches those who need it most while still fresh.",
      author: "Amit, Food Distribution Coordinator"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-green-100  to-orange-100 w-full min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            <span className="text-green-600 block">Reduce Food Waste,</span>
            <span className="text-orange-500">Nourish Communities</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-md">
            We connect food donors with local charities to ensure surplus food reaches people in need instead of landfills. Join our mission to fight hunger and reduce environmental impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleClick}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition duration-300"
            >
              Donate Food
            </button>
            <button 
              onClick={handleLearnMore}
              className="bg-white hover:bg-gray-100 text-green-600 border border-green-600 font-semibold px-8 py-3 rounded-lg shadow-sm transition duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="flex justify-center">
          <img 
            src={mainImage} 
            alt="Food donation helping community" 
            className="w-full max-w-md rounded-3xl shadow-xl object-cover" 
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-700">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">List Your Surplus Food</h3>
              <p className="text-gray-600">Register and provide details about your available food donation</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-700">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">We Match with NGOs</h3>
              <p className="text-gray-600">Our system connects you with verified organizations in your area</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-700">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Coordinate Pickup</h3>
              <p className="text-gray-600">Schedule a convenient time for collection and distribution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">See Your Impact</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Every donation creates meaningful change in your community
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { image: image1, text: "Nutritious meals reach families facing food insecurity", title: "Supporting Families" },
            { image: image2, text: "Your donations help reduce environmental impact from waste", title: "Reducing Waste" },
            { image: image3, text: "Building stronger communities through shared resources", title: "Community Building" }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-green-700 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-green-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">What Our Community Says</h2>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <p className="text-gray-800 text-xl italic mb-6">"{testimonials[currentTestimonial].text}"</p>
            <p className="text-green-600 font-semibold">- {testimonials[currentTestimonial].author}</p>
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === currentTestimonial ? 'bg-green-600' : 'bg-gray-300'}`}
                  onClick={() => setCurrentTestimonial(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-orange-100 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Make a Difference?</h2>
          <p className="text-gray-700 text-xl mb-8">
            Join thousands of individuals and businesses fighting food waste in your community.
          </p>
          <button 
            onClick={handleClick}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg shadow-md transition duration-300"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;