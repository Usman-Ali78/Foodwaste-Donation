import React, { useState, useEffect } from "react";
import {
  FaLock,
  FaUnlock,
  FaStar,
  FaFilter,
} from "react-icons/fa";
import api from "../../api/api";



import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await api.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data);
      } catch (error) {
        toast.error("Failed to fetch users.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/reviews/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(data);
      } catch (error) {
        toast.error("Failed to fetch reviews.");
      }
    };
    fetchReviews();
  }, []);

  // Calculate average stars for a restaurant
  const getAverageStars = (restaurantId) => {
    const userReviews = reviews.filter(
      (r) => r.restaurant && r.restaurant._id === restaurantId
    );
    if (userReviews.length === 0) return 0;
    const avg =
      userReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
      userReviews.length;
    return avg;
  };

  const toggleBlock = async (id, isBlocked) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.put(
        `/admin/users/${id}/block`,
        { block: !isBlocked },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, blocked: data.data.blocked } : u
        )
      );

      toast.success(data.message);
    } catch (error) {
      toast.error("Failed to update user status.");
    }
  };

  // Filter users (excluding admins)
  const filteredUsers = users.filter(
    (u) => u.userType !== "admin" && (filter === "all" || u.userType === filter)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-2">View and manage all system users</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaFilter className="text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Filter by:
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "all"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Users
              </button>
              <button
                onClick={() => setFilter("restaurant")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "restaurant"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Restaurants
              </button>
              <button
                onClick={() => setFilter("ngo")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === "ngo"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                NGOs
              </button>
            </div>
          </div>
        </div>

        {/* Users List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 flex flex-col"
              >
                {/* User Info */}
                <div className="flex-grow mb-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {user.name}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {user.userType}
                    </span>
                  </div>

                  {/* Show rating only for restaurants */}
                  {user.userType === "restaurant" && (
                    <div className="mt-4 flex items-center">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < Math.round(getAverageStars(user._id))
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                            size={16}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {getAverageStars(user._id).toFixed(1)} / 5
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Button - Now consistently at the bottom */}
                <div className="mt-auto pt-4">
                  <button
                    onClick={() => toggleBlock(user._id, user.blocked)}
                    className={`w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                      user.blocked
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {user.blocked ? (
                      <>
                        <FaUnlock size={14} /> Unblock User
                      </>
                    ) : (
                      <>
                        <FaLock size={14} /> Block User
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
              <FaFilter className="text-gray-500 text-xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No users found
            </h3>
            <p className="text-gray-500">Try changing your filter settings</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;