import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import useDonations from "../../hooks/useDonations";
import api from "../../../api/api";

// // Import some additional images for the enhanced design
// import teamImage from "../../assets/team.jpg";
// import partnershipImage from "../../assets/partnership.jpg";
// import sustainabilityImage from "../../assets/sustainability.jpg";

const About = () => {
  const [ngo, setNgo] = useState([]);
  const [res, setRes] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("mission");

  let navigate = useNavigate();

  const { donations } = useDonations();

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await api.get("/donation/main-ngo");
        setNgo(res.data);
      } catch (err) {
        setError("Failed to fetch NGOs");
        console.error("Error fetching NGOs:", err);
      }
    };

    fetchNgos();
  }, []);
  useEffect(() => {
    const fetchRes = async () => {
      try {
        const res = await api.get("/donation/main-res");
        setRes(res.data);
      } catch (err) {
        setError("Failed to fetch ress");
        console.error("Error fetching res:", err);
      }
    };
    fetchRes();
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-green-600 to-orange-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Fighting Food Waste,{" "}
            <span className="block mt-2">Feeding the Hungry</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're building a sustainable future by connecting surplus food with
            those who need it most.
          </p>
        </div>
      </div>

      {/* Mission & Story Section with Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-4 px-6 font-medium text-lg ${
              activeTab === "mission"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("mission")}
          >
            Our Mission
          </button>
          <button
            className={`py-4 px-6 font-medium text-lg ${
              activeTab === "story"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("story")}
          >
            Our Story
          </button>
          <button
            className={`py-4 px-6 font-medium text-lg ${
              activeTab === "team"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("team")}
          >
            Our Team
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {activeTab === "mission" && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Our Mission
                </h2>
                <p className="text-gray-600 text-lg mb-4">
                  We connect restaurants, hotels, and food businesses with NGOs
                  to distribute surplus food to those in need—minimizing waste
                  and fighting hunger.
                </p>
                <p className="text-gray-600 mb-4">
                  Our platform makes it easy for food donors to contribute their
                  excess food while ensuring it reaches verified organizations
                  that can distribute it safely and efficiently.
                </p>
                <div className="bg-green-50 p-6 rounded-lg mt-6">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Our Vision
                  </h3>
                  <p className="text-green-700">
                    A world where no edible food goes to waste while people go
                    hungry, creating sustainable communities through food
                    redistribution.
                  </p>
                </div>
              </>
            )}

            {activeTab === "story" && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Our Story
                </h2>
                <p className="text-gray-600 text-lg mb-4">
                  Founded in 2020 during the pandemic, we noticed two critical
                  problems: increasing food waste from closed restaurants and
                  growing food insecurity in vulnerable communities.
                </p>
                <p className="text-gray-600 mb-4">
                  What started as a small initiative to connect local
                  restaurants with shelters has now grown into a nationwide
                  network of food donors and distribution partners.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                  <li>2020: Launched with 10 restaurant partners</li>
                  <li>2021: Expanded to 5 cities with 100+ partners</li>
                  <li>2022: Incorporated as a social enterprise</li>
                  <li>2023: Reached 1 million meals donated milestone</li>
                </ul>
              </>
            )}

            {activeTab === "team" && (
              <>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Our Team
                </h2>
                <p className="text-gray-600 text-lg mb-4">
                  We're a diverse group of environmentalists, software
                  developers, and community organizers united by a common goal:
                  reducing food waste and fighting hunger.
                </p>
                <p className="text-gray-600 mb-4">
                  Our team brings together expertise in logistics, technology,
                  and nonprofit management to create an efficient platform that
                  makes food donation simple and effective.
                </p>
                <div className="mt-6">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300">
                    Meet Our Team
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md h-80 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
              {/* Placeholder for team/mission image - replace with actual image */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-green-100 to-orange-100">
                <span className="text-gray-500">
                  {activeTab === "mission" && "Mission Image"}
                  {activeTab === "story" && "Our Story Image"}
                  {activeTab === "team" && "Team Photo"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Our process makes food donation simple, efficient, and impactful
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-8 rounded-xl shadow-lg text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Donate Surplus Food
              </h3>
              <p className="text-gray-600">
                Restaurants and food businesses list extra food on our platform
                with details about type, quantity, and pickup time.
              </p>
            </div>

            <div className="bg-orange-50 p-8 rounded-xl shadow-lg text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">
                Verified NGOs Collect
              </h3>
              <p className="text-gray-600">
                Our verified partner organizations receive notifications and
                arrange for pickup at the scheduled time.
              </p>
            </div>

            <div className="bg-green-50 p-8 rounded-xl shadow-lg text-center relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Help Those in Need</h3>
              <p className="text-gray-600">
                The collected food is distributed to families, homeless
                shelters, and communities in need within hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-orange-500 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-green-100 text-xl mb-12 max-w-3xl mx-auto">
            Together with our partners, we're making a significant difference in
            reducing food waste and fighting hunger
          </p>

          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 "> */}
          <div className="flex  justify-evenly">
            <div className="p-6 bg-gray-200 bg-opacity-10 rounded-lg backdrop-filter backdrop-blur-sm w-72 ">
              <div className="text-4xl font-bold mb-2">
                <CountUp
                  start={0}
                  end={donations ? donations.length : 0}
                  duration={3}
                  separator=","
                />
                +
              </div>
              <p className="text-green-950">Meals Donated</p>
            </div>

            <div className="p-6 bg-gray-200 bg-opacity-10 rounded-lg backdrop-filter backdrop-blur-sm w-72">
              <div className="text-4xl font-bold mb-2">
                <CountUp
                  start={0}
                  end={ngo ? ngo.length : 0}
                  duration={3}
                  separator=","
                />{" "}
                +
              </div>
              <p className="text-green-950">NGOs Connected</p>
            </div>

            <div className="p-6 bg-gray-200 bg-opacity-10 rounded-lg backdrop-filter backdrop-blur-sm w-72">
              <div className="text-4xl font-bold mb-2">
                <CountUp
                  start={0}
                  end={res ? res.length : 0}
                  duration={3}
                  separator=","
                />{" "}
                +
              </div>
              <p className="text-green-950">Food Donors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Environmental Impact
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Reducing food waste isn't just about feeding people—it's also about
            protecting our planet
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  Reduced Greenhouse Gases
                </h3>
                <p className="text-gray-600">
                  Food waste in landfills produces methane, a potent greenhouse
                  gas. By redirecting food, we're helping to reduce emissions.
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  Conserved Resources
                </h3>
                <p className="text-gray-600">
                  Saving food means saving all the resources that went into
                  producing it—water, energy, and labor.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  Sustainable Communities
                </h3>
                <p className="text-gray-600">
                  We're helping build circular economies where resources are
                  used efficiently and nothing goes to waste.
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold text-center text-green-800 mb-6">
                Our Environmental Savings
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">
                      CO₂ Emissions Prevented
                    </span>
                    <span className="font-semibold text-green-700">
                      125 tons
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Water Saved</span>
                    <span className="font-semibold text-green-700">
                      2.5 million gallons
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Landfill Reduction</span>
                    <span className="font-semibold text-green-700">
                      340 tons
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Join Our Mission
          </h2>
          <p className="text-gray-600 text-xl mb-8 max-w-2xl mx-auto">
            Whether you're a food business with surplus or an individual who
            wants to help, there's a place for you in our community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 duration-300 transition cursor-pointer font-semibold"
              onClick={() => navigate("/LogIn")}
            >
              Donate Food
            </button>
            <button
              className="bg-white text-green-600 border border-green-600 px-8 py-3 rounded-lg hover:bg-green-50 duration-300 transition cursor-pointer font-semibold"
              onClick={() => navigate("/signup")}
            >
              Partner With Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
