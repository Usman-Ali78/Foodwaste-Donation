import React, { useMemo, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useDonations from "../../hooks/useDonations";
import LoadingSpinner from "../LoadingSpinner";
import DonationClaimsModal from "./Claim/DonationsClaimModal";
import { toast } from "react-toastify";

const allowedDonationItems = [
  "Buffet leftovers",
  "Unserved banquet/event meals",
  "Breakfast items (pastries, pancakes, scrambled eggs)",
  "Soups & stews (kept at safe temps)",
  "Pasta dishes (lasagna, spaghetti)",
  "Rice-based dishes (biriyani, fried rice)",
  "Pizza (whole, unsliced preferred)",
  "Sandwiches/wraps (unwrapped, fresh)",
  "Fresh bread rolls/baguettes",
  "Croissants, muffins, danishes",
  "Cakes (whole or sliced, no cream if perishable)",
  "Cookies & biscuits",
  "Donuts (day-old acceptable)",
  "Salad bar leftovers (undressed)",
  "Sliced fruits (melons, pineapples, berries)",
  "Vegetable platters (carrots, celery, cucumbers)",
  "Whole fruits (bananas, apples, oranges)",
  "Cheese platters",
  "Yogurt parfaits",
  "Hard-boiled eggs",
  "Milk cartons (unopened)",
  "Condiment packets (ketchup, mustard, mayo)",
  "Cereal boxes (individual servings)",
  "Jam/honey packets",
  "Bottled beverages (unopened)",
  "Coffee/tea pods",
  "Packed lunches (sandwiches, fruit cups)",
  "Granola bars/protein bars",
  "Chips/snack packs",
];

const Donations = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showClaimsModal, setShowClaimsModal] = useState(false);
  const [donationClaims, setDonationClaims] = useState([]);

  const {
    donations,
    loading,
    error,
    authError,
    formData,
    editingId,
    donationToDelete,
    setDonationToDelete,
    handleSubmit,
    handleChange,
    editDonation,
    deleteDonation,
    resetForm,
    fetchDonationClaims,
    approveClaimRequest,
    rejectClaimRequest,
    setDonations,
  } = useDonations();

  console.log(donations);
  

  const sortedDonations = useMemo(() => {
    const statusOrder = {
      available: 0,
      pending_pickup: 1,
      delivered: 2,
      expired: 3,
    };

    return [...donations].sort((a, b) => {
      const orderA = statusOrder[a.status] ?? 99;
      const orderB = statusOrder[b.status] ?? 99;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Optional: sort within the same status by expiry_time
      return new Date(a.expiry_time) - new Date(b.expiry_time);
    });
  }, [donations]);

  

  const filteredDonations = sortedDonations.filter((donation) =>
    donation.item?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatExpiryTime = (dateString, status) => {
    if (status === "delivered") return "✅ Delivered";
    if (status === "expired") return "⛔ Expired";

    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((date - now) / (1000 * 60 * 60));

    if (diffHours <= 0) return "⛔ Expired";
    if (diffHours < 24)
      return `⏳ Expires in ${diffHours} hour${diffHours !== 1 ? "s" : ""}`;

    const diffDays = Math.floor(diffHours / 24);
    return `⏳ Expires in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  };

  const handleApproveClaim = async (claimId) => {
    try {
      await approveClaimRequest(claimId);

      // Refresh the data
      if (selectedDonation) {
        const updatedClaims = await fetchDonationClaims(selectedDonation._id);
        setDonationClaims(updatedClaims);

        // Update the donation status to "pending_pickup"
        setDonations((prev) =>
          prev.map((d) =>
            d._id === selectedDonation._id
              ? { ...d, status: "pending_pickup" }
              : d
          )
        );
      }
    } catch (error) {
      console.error("Approval error:", error);
    }
  };

  const handleRejectClaim = async (claimId) => {
    try {
      await rejectClaimRequest(claimId);

      // Refresh claims after rejection
      if (selectedDonation) {
        const updatedClaims = await fetchDonationClaims(selectedDonation._id);
        setDonationClaims(updatedClaims);
      }
    } catch (error) {
      console.error("Rejection error:", error);
    }
  };

  if (authError) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          Authentication Required
        </h2>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Manage Food Donations</h2>

      {/* Search and Add Donation */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center bg-white p-2 rounded-lg shadow-sm w-full md:w-1/2">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search donations..."
            className="outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all w-full md:w-auto justify-center"
          onClick={() => {
            resetForm();
            setIsFormModalOpen(true);
          }}
        >
          <FaPlus className="mr-2" />
          Add Donation
        </button>
      </div>

      {/* Donation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonations.length > 0 ? (
          filteredDonations.map((donation) => (
            <div
              key={donation._id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all flex flex-col h-full"
            >
              {/* Top content area */}
              <div>
                <div className="relative mb-4 min-h-[3rem]">
                  <h3 className="text-xl font-semibold pr-20 break-words">
                    {donation.item}
                  </h3>
                  <span
                    className={`absolute top-0 right-0 text-sm px-2 py-1 rounded-full ${
                      donation.status === "available"
                        ? "bg-green-600 text-white"
                        : donation.status === "pending_pickup"
                        ? "bg-yellow-300 text-yellow-800"
                        : donation.status === "expired"
                        ? "bg-red-500 text-white"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {donation.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-2">
                  Quantity: {donation.quantity}
                  {donation.unit}
                </p>
                <p className="text-gray-500 text-sm mb-2">
                  📍 {donation.pickup_address}
                </p>
                <p className="text-gray-500 text-sm">
                  {formatExpiryTime(donation.expiry_time, donation.status)}
                </p>

                {donation.ngo_id && (
                  <p className="text-gray-500 text-sm mt-2">
                    Assigned to: {donation.ngo_id.ngo_name}
                  </p>
                )}
              </div>

              {/* Button area pinned at bottom */}
              <div className="flex justify-end items-center space-x-2 mt-auto pt-4 border-t border-gray-200">
                {["available", "pending_pickup"].includes(donation.status) && (
                  <button
                    className="border-none text-white rounded-2xl px-1.5 py-1 text-center cursor-pointer bg-blue-500"
                    onClick={async () => {
                      const claims = await fetchDonationClaims(donation._id);
                      if (claims.length === 0) {
                        toast.info("No claims yet.");
                      }
                      if (claims.length > 0) {
                        setSelectedDonation(donation);
                        setDonationClaims(claims);
                        setShowClaimsModal(true);
                      }
                    }}
                  >
                    Claims
                  </button>
                )}

                <button
                  className={`text-[17px] transition-all ${
                    donation.status === "available"
                      ? "text-blue-500 hover:text-blue-700 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (donation.status === "available") {
                      editDonation(donation);
                      setIsFormModalOpen(true);
                    }
                  }}
                  disabled={donation.status !== "available"}
                >
                  <FaEdit />
                </button>

                <button
                  className={`text-[17px] transition-all ${
                    donation.status === "available"
                      ? "text-red-500 hover:text-red-700 cursor-pointer"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (donation.status === "available") {
                      setDonationToDelete(donation);
                    }
                  }}
                  disabled={donation.status !== "available"}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No donations found matching your criteria
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Donation" : "Add New Donation"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
                setIsFormModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block mb-1 text-gray-700">Food Item</label>
                <select
                  name="item"
                  value={formData.item}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="" disabled>
                    Select a food item...
                  </option>
                  {allowedDonationItems.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-gray-700">Quantity</label>
                <div className="flex">
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="p-2 border border-gray-700 rounded-lg"
                  >
                    <option value="">Select</option>
                    <option value="kg">Kg</option>
                    <option value="litre">Litre</option>
                    <option value="pieces">Pieces</option>
                    <option value="packets">Packets</option>
                    <option value="boxes">Boxes</option>
                    <option value="bottles">Bottles</option>
                    <option value="grams">Grams</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-gray-700">Expiry Time</label>
                <input
                  type="datetime-local"
                  name="expiry_time"
                  value={formData.expiry_time}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">
                  Pickup Address
                </label>
                <input
                  type="text"
                  name="pickup_address"
                  value={formData.pickup_address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                  onClick={() => setIsFormModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer"
                >
                  {editingId ? "Update Donation" : "Add Donation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showClaimsModal && selectedDonation && (
        <DonationClaimsModal
          donation={selectedDonation}
          claims={donationClaims}
          onApprove={handleApproveClaim}
          onReject={handleRejectClaim}
          onClose={() => {
            setShowClaimsModal(false);
            setSelectedDonation(null);
          }}
        />
      )}

      {/* Delete Modal */}
      {donationToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setDonationToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={deleteDonation}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donations;
