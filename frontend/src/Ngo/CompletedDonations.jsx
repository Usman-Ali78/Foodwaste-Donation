import React from "react";

const CompletedDonations = ({ donations }) => {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donations.length === 0 ? (
          <p className="text-gray-500">No completed donations.</p>
        ) : (
          donations.map((donation) => (
            <div
              key={donation._id}
              className="bg-green-100 p-4 rounded shadow border-l-4 border-green-500"
            >
              <h3 className="font-bold text-lg">{donation.item}</h3>
              <p className="text-sm">
                Donor: {donation.donor?.restaurant_name || "N/A"}
              </p>
              <p className="text-sm">
                Quantity: {donation.quantity}
                {donation.unit}
              </p>
              <p className="text-sm">
                Delivered: {new Date(donation.updatedAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CompletedDonations;