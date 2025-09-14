import React, { useState, useMemo } from "react";
import {
  FaUtensils,
  FaHamburger,
  FaWeight,
  FaMapPin,
  FaCalendarDay,
  FaTag,
 } from "react-icons/fa";
import useDonations from "../hooks/useDonations";



const ManageDonations = () => {
  const { donations } = useDonations();
  const sortedDonations = useMemo(() => {
    return donations.sort((a, b) => {
      const statusOrder = {
        available: 1,
        delivered: 2,
        pending_pickup: 3,
        expired: 4,
      };
      return (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
    });
  }, [donations]);

  const [filterStatus, setFilterStatus] = useState("all");

  const filteredDonations = sortedDonations.filter((donation) =>
    filterStatus === "all" ? true : donation.status === filterStatus
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Donations</h2>
      <div className="mb-6">
        <label className="mr-2">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="available">Availabe</option>
          <option value="delivered">Delivered</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDonations.map((donation) => (
          <div
            key={donation._id}
            className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-5">
              <div className="flex items-center mb-4">
                <div className="bg-amber-50 p-2 rounded-lg mr-3">
                  <FaUtensils className="text-amber-500 text-xl" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {donation.donor.restaurant_name
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </h3>
              </div>

              <div className="space-y-3 text-gray-600">
                <div className="flex items-center">
                  <FaHamburger className=" mr-2" />
                  <span>{donation.item}</span>
                </div>

                <div className="flex items-center">
                  <FaWeight className=" mr-2" />{" "}
                  {/* Changed from FaBalanceScale to FaWeight for quantity */}
                  <span>
                    {donation.quantity} {donation.unit}
                  </span>
                </div>

                <div className="flex items-center">
                  <FaMapPin className=" mr-2" />{" "}
                  {/* Changed from FaMapMarkerAlt to FaMapPin for pickup address */}
                  <span className="truncate">{donation.pickup_address}</span>
                </div>

                <div className="flex items-center">
                  <FaCalendarDay className=" mr-2" />{" "}
                  {/* Changed from FaCalendarAlt to FaCalendarDay for date */}
                  <span>
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center">
                  <FaTag className=" mr-2" />{" "}
                  {/* Unchanged, FaTag fits well for status */}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      donation.status === "available"
                        ? "bg-green-400 text-white"
                        : donation.status === "delivered"
                        ? "bg-blue-400 text-white"
                        : donation.status === "pending_pickup"
                        ? "bg-yellow-400 text-yellow-900"
                        : donation.status === "expired"
                        ? "bg-red-400 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {donation.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDonations;