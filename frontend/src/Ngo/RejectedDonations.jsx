import React from "react";

const RejectedDonations = ({ claims }) => {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {claims.length === 0 ? (
          <p className="text-gray-500">No rejected donations found.</p>
        ) : (
          claims.map((claim) => (
            <div
              key={claim._id}
              className="bg-red-100 p-4 rounded shadow border-l-4 border-red-500"
            >
              <h3 className="font-bold text-lg">
                {claim.donation?.item}
              </h3>
              <p className="text-sm">
                Donor:{" "}
                {claim.donation?.donor?.restaurant_name ||
                  claim.donor?.restaurant_name ||
                  claim.restaurant_name ||
                  "N/A"}
              </p>
              <p className="text-sm">
                Quantity: {claim.donation?.quantity}
                {claim.donation?.unit}
              </p>
              <p className="text-sm">
                Rejected On: {new Date(claim.updatedAt).toLocaleString()}
              </p>
              <p className="text-sm italic text-gray-600">
                Status: {claim.status}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default RejectedDonations;