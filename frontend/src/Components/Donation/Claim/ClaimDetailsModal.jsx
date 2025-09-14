import React, { useState } from "react";
import { FaTimes, FaCheck, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const ClaimDetailsModal = ({ claim, onClose, onMarkDelivered }) => {
  if (!claim) return null;
  const [isProcessing, setIsProcessing] = useState(false);
  
const handleDelivery = async () => {
  if (!claim?.donation?._id) {
    console.error("Cannot mark delivered: donation ID missing");
    return;
  }
  setIsProcessing(true);

  try {
    await onMarkDelivered(); // this calls the backend

    // show success message
    alert("Donation marked as delivered successfully!");
    onClose();
  } catch (error) {
    console.error("Delivery failed:", error);

    // Check if backend returned a message
    const errMsg =
      error.response?.data?.message ||
      "Failed to mark donation as delivered.";
    alert(errMsg);
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{claim.donation.item}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-3">
          <p className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                claim.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : claim.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {claim.status}
            </span>
          </p>

          <p>
            <span className="font-medium">Quantity:</span>{" "}
            {claim.donation.quantity}
            {claim.donation.unit}
          </p>

          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-500" />
            <span>{claim.donation.pickup_address}</span>
          </p>

          <p className="flex items-center gap-2">
            <FaClock className="text-gray-500" />
            <span>
              Expires: {new Date(claim.donation.expiry_time).toLocaleString()}
            </span>
          </p>

          {claim.message && (
            <div className="mt-3 p-2 bg-gray-50 rounded">
              <p className="font-medium">Your message:</p>
              <p className="text-sm">{claim.message}</p>
            </div>
          )}
        </div>

        {claim.status === "approved" && (
          <button
            onClick={handleDelivery}
            disabled={isProcessing}
            className={`mt-4 w-full py-2 rounded flex items-center justify-center gap-2 ${
              isProcessing ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {isProcessing ? "Processing..." : (
              <>
                <FaCheck /> Mark as Delivered
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ClaimDetailsModal;