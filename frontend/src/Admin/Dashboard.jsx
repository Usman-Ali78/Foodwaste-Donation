import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import api from "../../api/api";
import LoadingSpinner from "../Components/LoadingSpinner";


const Dashboard = () => {
  const [donations, setDonations] = useState([]);
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found");
      return;
    }

    try {
      const [donationRes, userRes, claimRes] = await Promise.all([
        api.get("/admin/donations", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/admin/claims", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setDonations(donationRes.data);
      setUsers(userRes.data);
      setClaims(claimRes.data);
    } catch (error) {
      console.error("❌ Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const pendingRequest = claims.filter((claim) => claim.status === "pending");

  const [topDonor, setTopDonors] = useState([]);

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/admin/top-donors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTopDonors(data);
      } catch (err) {
        console.error("Error fetching top donors:", err);
      }
    };

    fetchTopDonors();
  }, []);

  if (loading) return <LoadingSpinner />;

  // Animation variants for cards
  const cardVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Dashboard Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            title: "Total Donations",
            value: donations.length,
            color: "bg-blue-500",
          },
          { title: "Active Users", value: users.length, color: "bg-green-500" },
          {
            title: "Pending Requests",
            value: pendingRequest.length,
            color: "bg-yellow-500",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-lg shadow-lg text-white ${stat.color} cursor-pointer`}
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <h3 className="text-xl font-semibold">{stat.title}</h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard - Top Donors */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Top Donors</h3>
        <div className="space-y-4">
          {topDonor.map((donor, index) => (
            <div
              key={donor.donorId}
              className="p-5 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {donor.name}
                    </p>
                    <p className="text-sm text-gray-500">{donor.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Donations</p>
                  <p className="text-xl font-bold text-green-600">
                    {donor.totalDonations}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;