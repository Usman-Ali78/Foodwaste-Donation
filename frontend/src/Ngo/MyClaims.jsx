import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const MyClaims = ({ claims, setSelectedClaim }) => {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {claims.length === 0 ? (
          <p className="text-gray-500">No active claim requests.</p>
        ) : (
          claims
            .filter(
              (claim) =>
                claim.donation?._id &&
                claim.donation?.status !== "expired"
            )
            .map((claim) => (
              <div
                key={claim._id}
                className={`bg-white p-4 rounded shadow hover:shadow-md transition border-l-4 ${
                  claim.status === "approved"
                    ? "border-green-500"
                    : claim.status === "rejected"
                    ? "border-red-500"
                    : "border-blue-500"
                }`}
                onClick={() => setSelectedClaim(claim)}
                style={{ cursor: "pointer" }}
              >
                <h3 className="font-bold text-lg">
                  {claim.donation?.item || "Unknown Item"}
                </h3>
                <p className="text-sm">Status: {claim.status}</p>
                <p className="text-sm">
                  Quantity: {claim.donation?.quantity}
                  {claim.donation?.unit}
                </p>
                <p className="text-sm">
                  Requested: {new Date(claim.requestedAt).toLocaleString()}
                </p>

                {claim.donation?.pickup_address && (
                  <p className="text-sm">
                    <FaMapMarkerAlt /> Address: {claim.donation.pickup_address}
                  </p>
                )}

                {claim.donation?.pickup_location?.coordinates && (
                  <p className="text-sm">
                    Location:{" "}
                    {claim.donation.pickup_location.coordinates[1]},
                    {claim.donation.pickup_location.coordinates[0]}
                  </p>
                )}
              </div>
            ))
        )}
      </div>
    </section>
  );
};

export default MyClaims;