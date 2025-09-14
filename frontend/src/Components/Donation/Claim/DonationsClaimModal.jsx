import React from "react";

const DonationClaimsModal = ({ donation, claims, onApprove, onClose, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          Claims for: {donation.item}
        </h3>

        {claims.length === 0 ? (
          <p className="text-gray-500">No claims yet</p>
        ) : (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim._id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{claim.ngo.name}</h4>
                    
                    {/* ✅ Fix: Safely show NGO location */}
                    {claim.ngo.ngo_location?.coordinates ? (
                      <a
                        href={`https://www.google.com/maps?q=${claim.ngo.ngo_location.coordinates[1]},${claim.ngo.ngo_location.coordinates[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        View Location
                      </a>
                    ) : (
                      <p className="text-sm text-gray-600">No location available</p>
                    )}
                  </div>

                  {claim.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApprove(claim._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        title="Approve this request"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onReject(claim._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        title="Reject this request"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>
                    Requested: {new Date(claim.requestedAt).toLocaleString()}
                  </span>
                  <span
                    className={`px-3 py-2 rounded ${
                      claim.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : claim.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationClaimsModal;
