import React, { useState, useEffect } from "react";
import api from "../../../api/api";

const Dashboard = () => {
  const [activity, setActivity] = useState([]);
  const [totalDonations, setTotalDonations] = useState({
    total: 0,
    available: 0,
    claimed: 0,
    pending_pickup: 0,
    delivered: 0,
  });

  const fetchTotalDonations = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/donation/my-total", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTotalDonations(data);
    } catch (error) {
      console.error("Error fetching total donations:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.get("/activity/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setActivity(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchTotalDonations();
    fetchActivities();
  }, []);

  const isWithinLast24Hours = (timestamp) => {
  const createdAt = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - createdAt) / (1000 * 60 * 60);
  return diffInHours <= 24;
};

const filteredActivities = activity.filter((activity) => {
  const message = activity.message?.toLowerCase() || "";
  const status = activity.relatedDonation?.status;
  const createdAt = activity.createdAt;

  // Only show if within last 24 hours
  if (!isWithinLast24Hours(createdAt)) return false;

  //Always show if it's a donation being added
  if (message.startsWith("you added")) return true;

  //Always show if it's requested by NGO
  if (message.includes("requested your donation")) return true;

  //Always show if it's marked as delivered
  if (message.includes("marked your donation") && status === "delivered") return true;

  //Otherwise don't show
  return false;
});



  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 shadow rounded-xl">
          📦 Total Donations: {totalDonations.total}
        </div>
        <div className="bg-white p-5 shadow rounded-xl">
          🚚 Pending Pickups: {totalDonations.pending_pickup}
        </div>
        <div className="bg-white p-5 shadow rounded-xl">
          🌍 Available Donations: {totalDonations.available}
        </div>
      </div>
      <div className="bg-white p-5 shadow rounded-xl mb-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <ul className="space-y-2">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity, key) => (
              <li key={activity._id} className="p-3 bg-gray-100 rounded">
                <span className="font-semibold">{activity.message}</span>
                <span className="text-gray-500">
                  - {new Date(activity.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No recent activity to show.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
