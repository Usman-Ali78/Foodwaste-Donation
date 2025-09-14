import React from "react";
import { FaMapMarkerAlt, FaClock, FaHandHoldingHeart } from "react-icons/fa";

const AvailableDonations = ({ 
  donations, 
  handleClaimSubmit, 
  isDonationRequested 
}) => {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donations.length === 0 ? (
          <p className="text-gray-500">No available donations.</p>
        ) : (
          donations.map((donation) => (
            <div
              key={donation._id}
              className="bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg text-blue-700">
                {donation.item}
              </h3>
              <p className="text-sm text-gray-600">
                Donor: {donation.donor?.restaurant_name || "N/A"}
              </p>
              <p className="text-sm">
                Quantity: {donation.quantity}
                {donation.unit}
              </p>
              <p className="text-sm flex items-center gap-1">
                <FaMapMarkerAlt /> {donation.pickup_address}
              </p>
              <p className="text-sm flex items-center gap-1">
                <FaClock /> {new Date(donation.expiry_time).toLocaleString()}
              </p>

              <button
                onClick={() => handleClaimSubmit(donation._id)}
                className={`mt-3 w-full text-white py-2 rounded flex items-center justify-center gap-2 cursor-pointer ${
                  isDonationRequested(donation._id)
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={isDonationRequested(donation._id)}
              >
                <FaHandHoldingHeart />
                {isDonationRequested(donation._id)
                  ? "Requested"
                  : "Request Donation"}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default AvailableDonations;