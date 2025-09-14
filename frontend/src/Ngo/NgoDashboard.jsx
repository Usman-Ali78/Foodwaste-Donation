// import React, { useState, useMemo, useEffect } from "react";
// import ReviewModal from "../Components/Donation/Review/ReviewModal";
// import {
//   FaMapMarkerAlt,
//   FaHandHoldingHeart,
//   FaClipboardCheck,
//   FaSearch,
//   FaBars,
//   FaClock,
//   FaTimesCircle,
// } from "react-icons/fa";
// import useDonations from "../hooks/useDonations";
// import ClaimDetailsModal from "../Components/Donation/Claim/ClaimDetailsModal";
// import LoadingSpinner from "../Components/LoadingSpinner";
// import api from "../../api/api";
// import { FiSettings } from "react-icons/fi";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   Popup,
// } from "react-leaflet";
// import L from "leaflet";

// // custom icons
// const ngoIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // green NGO pin
//   iconSize: [35, 35],
// });

// const restaurantIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png", // red Restaurant pin
//   iconSize: [35, 35],
// });

// // haversine distance (km)
// const haversine = (coords1, coords2) => {
//   const toRad = (x) => (x * Math.PI) / 180;
//   const [lat1, lng1] = coords1;
//   const [lat2, lng2] = coords2;
//   const R = 6371;
//   const dLat = toRad(lat2 - lat1);
//   const dLng = toRad(lng2 - lng1);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// };

// function NgoDashboard() {
//   const [showReviewModal, setShowReviewModal] = useState(false);
//   const [reviewDonationId, setReviewDonationId] = useState(null);

//   // State for UI controls
//   const [activeSection, setActiveSection] = useState("available");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedClaim, setSelectedClaim] = useState(null);

//   // Get donation data from custom hook
//   const {
//     donations,
//     loading,
//     claims,
//     loadingClaims,
//     requestedDonations,
//     createClaimRequest,
//     markDelivered,
//   } = useDonations();

//   // Memoized filtered data
//   const availableDonations = useMemo(
//     () => donations.filter((d) => d.status === "available"),
//     [donations]
//   );
//   const completedDonations = useMemo(
//     () =>
//       claims
//         .filter((claim) => claim.status === "delivered")
//         .map((claim) => claim.donation),
//     [claims]
//   );

//   const myActiveClaims = useMemo(
//     () =>
//       claims.filter(
//         (claim) =>
//           claim.status !== "delivered" &&
//           claim.status !== "completed" &&
//           claim.status !== "rejected"
//       ),
//     [claims]
//   );
//   const rejectedClaims = useMemo(
//     () => claims.filter((claim) => claim.status === "rejected"),
//     [claims]
//   );

//   // Filter donations and claims based on search query
//   const filteredDonations = useMemo(
//     () =>
//       availableDonations.filter((d) =>
//         d.item.toLowerCase().includes(searchQuery.toLowerCase())
//       ),
//     [availableDonations, searchQuery]
//   );
//   const filteredClaims = useMemo(
//     () =>
//       claims.filter((c) =>
//         c.donation?.item?.toLowerCase().includes(searchQuery.toLowerCase())
//       ),
//     [claims, searchQuery]
//   );

//   // Handle claim submission directly
//   const handleClaimSubmit = async (donationId) => {
//     try {
//       await createClaimRequest(
//         donationId,
//         "Requesting this donation for our NGO"
//       );
//       // The hook will automatically update the requestedDonations list
//     } catch (error) {
//       console.error("Error submitting claim:", error);
//     }
//   };

//   // Check if a donation has been requested
//   const isDonationRequested = (donationId) => {
//     return (
//       requestedDonations.includes(donationId) ||
//       claims.some((claim) => claim.donation?._id === donationId)
//     );
//   };

//   const [formData, setFormData] = useState({
//     ngo_name: "",
//     registration_number: "",
//     ngo_phone: "",
//     ngo_location: { type: "Point", coordinates: [0, 0] },
//   });

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const { data } = await api.get("/user/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setFormData({
//           ngo_name: data.ngo_name || "",
//           registration_number: data.registration_number || "",
//           ngo_phone: data.ngo_phone || "",
//           ngo_location: data.ngo_location || {
//             type: "Point",
//             coordinates: [0, 0],
//           },
//         });
//       } catch (err) {
//         console.error("Error fetching NGO profile:", err);
//       }
//     };
//     if (token) fetchProfile();
//   }, [token]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     try {
//       await api.put("/user/profile", formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert("NGO Profile updated successfully!");
//     } catch (err) {
//       console.error("Error updating NGO profile:", err.response?.data || err);
//       alert("Failed to update NGO profile");
//     }
//   };

//   // Navigation tabs configuration
//   const navTabs = [
//     { key: "available", label: "Available Donations", icon: <FaSearch /> },
//     { key: "my-claims", label: "My Claims", icon: <FaHandHoldingHeart /> },
//     {
//       key: "completed",
//       label: "Completed Donations",
//       icon: <FaClipboardCheck />,
//     },

//     { key: "map", label: "Donation Map", icon: <FaMapMarkerAlt /> },
//     { key: "rejected", label: "Rejected Donations", icon: <FaTimesCircle /> },
//     { key: "settings", label: "Settings", icon: <FiSettings /> },
//   ];

//   // Section titles mapping
//   const sectionTitles = {
//     available: "Available Donations",
//     "my-claims": "My Claim Requests",
//     completed: "Completed Donations",
//     map: "Donation Map",
//     rejected: "Rejected Donations",
//     settings: "Profile Setting",
//   };

//   const handleReviewSubmit = async ({ rating, comment, donationId }) => {
//     try {
//       const response = await api.post(
//         `/reviews/donations/${donationId}`,
//         { rating, comment }, // <-- body goes here directly
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`, // add auth token if needed
//           },
//         }
//       );

//       alert("Review submitted successfully!");
//       setShowReviewModal(false);
//       setReviewDonationId(null);
//     } catch (err) {
//       console.error(
//         "Error submitting review:",
//         err.response?.data || err.message
//       );
//       alert("Failed to submit review.");
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-screen bg-gray-100 text-gray-900">
//       {/* Sidebar Navigation */}
//       <aside className="w-full md:w-64 p-6 shadow-lg bg-white">
//         <h2 className="text-xl font-bold flex items-center gap-2">
//           <FaBars /> NGO Dashboard
//         </h2>
//         <ul className="mt-6 space-y-2">
//           {navTabs.map((tab) => (
//             <li
//               key={tab.key}
//               className={`p-3 rounded cursor-pointer transition-all duration-200 flex items-center gap-2 ${
//                 activeSection === tab.key ? "bg-gray-300" : "hover:bg-gray-200"
//               }`}
//               onClick={() => setActiveSection(tab.key)}
//             >
//               {tab.icon} {tab.label}
//             </li>
//           ))}
//         </ul>
//       </aside>

//       {/* Main Content Area */}
//       <main className="flex-1 p-4 md:p-6 overflow-y-auto">
//         {/* Header and Search */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-semibold">
//             {sectionTitles[activeSection]}
//           </h1>
//         </div>

//         <div className="mt-6 relative">
//           <FaSearch className="absolute top-3 left-3 text-gray-400" />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search donations..."
//             className="w-full pl-10 pr-4 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//         </div>

//         {/* Loading State */}
//         {loading || loadingClaims ? (
//           <LoadingSpinner />
//         ) : (
//           <>
//             {/* Available Donations Section */}
//             {activeSection === "available" && (
//               <section className="mt-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredDonations.length === 0 ? (
//                     <p className="text-gray-500">No available donations.</p>
//                   ) : (
//                     filteredDonations.map((donation) => (
//                       <div
//                         key={donation._id}
//                         className="bg-white p-4 rounded shadow hover:shadow-md transition"
//                       >
//                         <h3 className="font-bold text-lg text-blue-700">
//                           {donation.item}
//                         </h3>
//                         <p className="text-sm text-gray-600">
//                           Donor: {donation.donor?.restaurant_name || "N/A"}
//                         </p>
//                         <p className="text-sm">
//                           Quantity: {donation.quantity}
//                           {donation.unit}
//                         </p>
//                         <p className="text-sm flex items-center gap-1">
//                           <FaMapMarkerAlt /> {donation.pickup_address}
//                         </p>
//                         <p className="text-sm flex items-center gap-1">
//                           <FaClock />{" "}
//                           {new Date(donation.expiry_time).toLocaleString()}
//                         </p>

//                         <button
//                           onClick={() => handleClaimSubmit(donation._id)}
//                           className={`mt-3 w-full text-white py-2 rounded flex items-center justify-center gap-2 cursor-pointer ${
//                             isDonationRequested(donation._id)
//                               ? "bg-gray-500 hover:bg-gray-600"
//                               : "bg-blue-500 hover:bg-blue-600"
//                           }`}
//                           disabled={isDonationRequested(donation._id)}
//                         >
//                           <FaHandHoldingHeart />
//                           {isDonationRequested(donation._id)
//                             ? "Requested"
//                             : "Request Donation"}
//                         </button>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </section>
//             )}

//             {/* Other sections remain unchanged */}
//             {activeSection === "my-claims" && (
//               <section className="mt-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {myActiveClaims.filter(
//                     (claim) => claim.donation?.status !== "expired"
//                   ).length === 0 ? (
//                     <p className="text-gray-500">No active claim requests.</p>
//                   ) : (
//                     myActiveClaims
//                       .filter(
//                         (claim) =>
//                           claim.donation?._id &&
//                           claim.donation?.status !== "expired"
//                       )
//                       .map((claim) => (
//                         <div
//                           key={claim._id}
//                           className={`bg-white p-4 rounded shadow hover:shadow-md transition border-l-4 ${
//                             claim.status === "approved"
//                               ? "border-green-500"
//                               : claim.status === "rejected"
//                               ? "border-red-500"
//                               : "border-blue-500"
//                           }`}
//                           onClick={() => setSelectedClaim(claim)}
//                           style={{ cursor: "pointer" }}
//                         >
//                           <h3 className="font-bold text-lg">
//                             {claim.donation?.item || "Unknown Item"}
//                           </h3>
//                           <p className="text-sm">Status: {claim.status}</p>
//                           <p className="text-sm">
//                             Quantity: {claim.donation?.quantity}
//                             {claim.donation?.unit}
//                           </p>
//                           <p className="text-sm">
//                             Requested:{" "}
//                             {new Date(claim.requestedAt).toLocaleString()}
//                           </p>

//                           {/* ✅ Show pickup address */}
//                           {claim.donation?.pickup_address && (
//                             <p className="text-sm">
//                               Address: {claim.donation.pickup_address}
//                             </p>
//                           )}

//                           {/* ✅ Show pickup location coordinates safely */}
//                           {claim.donation?.pickup_location?.coordinates && (
//                             <p className="text-sm">
//                               Location:{" "}
//                               {claim.donation.pickup_location.coordinates[1]},
//                               {claim.donation.pickup_location.coordinates[0]}
//                             </p>
//                           )}
//                         </div>
//                       ))
//                   )}
//                 </div>
//               </section>
//             )}

//             {activeSection === "completed" && (
//               <section className="mt-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {completedDonations.length === 0 ? (
//                     <p className="text-gray-500">No completed donations.</p>
//                   ) : (
//                     completedDonations.map((donation) => (
//                       <div
//                         key={donation._id}
//                         className="bg-green-100 p-4 rounded shadow border-l-4 border-green-500"
//                       >
//                         <h3 className="font-bold text-lg">{donation.item}</h3>
//                         <p className="text-sm">
//                           Donor: {donation.donor?.restaurant_name || "N/A"}
//                         </p>
//                         <p className="text-sm">
//                           Quantity: {donation.quantity}
//                           {donation.unit}
//                         </p>
//                         <p className="text-sm">
//                           Delivered:{" "}
//                           {new Date(donation.updatedAt).toLocaleString()}
//                         </p>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </section>
//             )}

//             {activeSection === "map" && (
//               <section className="mt-6 h-[600px]">
//                 {formData.ngo_location?.coordinates?.length === 2 ? (
//                   <MapContainer
//                     center={[
//                       formData.ngo_location.coordinates[1],
//                       formData.ngo_location.coordinates[0],
//                     ]}
//                     zoom={12}
//                     style={{ height: "100%", width: "100%" }}
//                   >
//                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//                     {/* NGO marker */}
//                     <Marker
//                       position={[
//                         formData.ngo_location.coordinates[1],
//                         formData.ngo_location.coordinates[0],
//                       ]}
//                       icon={ngoIcon}
//                     >
//                       <Popup>Your NGO Location</Popup>
//                     </Marker>

//                     {/* 🚩 Show ALL available donations */}
//                     {availableDonations.map((donation) => {
//                       if (!donation?.pickup_location?.coordinates) return null;

//                       const restaurantCoords = [
//                         donation.pickup_location.coordinates[1], // lat
//                         donation.pickup_location.coordinates[0], // lng
//                       ];
//                       const ngoCoords = [
//                         formData.ngo_location.coordinates[1],
//                         formData.ngo_location.coordinates[0],
//                       ];

//                       return (
//                         <Marker
//                           key={donation._id}
//                           position={restaurantCoords}
//                           icon={restaurantIcon}
//                         >
//                           <Popup>
//                             <strong>{donation.item}</strong> <br />
//                             Donor:{" "}
//                             {donation.donor?.restaurant_name || "Unknown"}{" "}
//                             <br />
//                             Quantity: {donation.quantity} {donation.unit} <br />
//                             Distance:{" "}
//                             {haversine(ngoCoords, restaurantCoords).toFixed(
//                               2
//                             )}{" "}
//                             km
//                           </Popup>
//                         </Marker>
//                       );
//                     })}

//                     {/* 🚩 Show claimed donations with line */}
//                     {myActiveClaims.map((claim) => {
//                       if (!claim.donation?.pickup_location?.coordinates)
//                         return null;

//                       const restaurantCoords = [
//                         claim.donation.pickup_location.coordinates[1], // lat
//                         claim.donation.pickup_location.coordinates[0], // lng
//                       ];
//                       const ngoCoords = [
//                         formData.ngo_location.coordinates[1],
//                         formData.ngo_location.coordinates[0],
//                       ];

//                       return (
//                         <React.Fragment key={claim._id}>
//                           <Marker
//                             position={restaurantCoords}
//                             icon={restaurantIcon}
//                           >
//                             <Popup>
//                               <strong>{claim.donation.item}</strong> <br />
//                               Donor:{" "}
//                               {claim.donation.donor?.restaurant_name ||
//                                 "Unknown"}{" "}
//                               <br />
//                               Distance:{" "}
//                               {haversine(ngoCoords, restaurantCoords).toFixed(
//                                 2
//                               )}{" "}
//                               km
//                             </Popup>
//                           </Marker>

//                           {/* Route line NGO → Restaurant */}
//                           <Polyline
//                             positions={[ngoCoords, restaurantCoords]}
//                             color="blue"
//                           />
//                         </React.Fragment>
//                       );
//                     })}
//                   </MapContainer>
//                 ) : (
//                   <p className="text-gray-500">
//                     Set your NGO location in Profile Settings to view map.
//                   </p>
//                 )}
//               </section>
//             )}

//             {activeSection === "rejected" && (
//               <section className="mt-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {rejectedClaims.length === 0 ? (
//                     <p className="text-gray-500">
//                       No rejected donations found.
//                     </p>
//                   ) : (
//                     rejectedClaims.map((claim) => (
//                       <div
//                         key={claim._id}
//                         className="bg-red-100 p-4 rounded shadow border-l-4 border-red-500"
//                       >
//                         <h3 className="font-bold text-lg">
//                           {claim.donation?.item}
//                         </h3>
//                         <p className="text-sm">
//                           Donor:{" "}
//                           {claim.donation?.donor?.restaurant_name ||
//                             claim.donor?.restaurant_name ||
//                             claim.restaurant_name ||
//                             "N/A"}
//                         </p>
//                         <p className="text-sm">
//                           Quantity: {claim.donation?.quantity}
//                           {claim.donation?.unit}
//                         </p>
//                         <p className="text-sm">
//                           Rejected On:{" "}
//                           {new Date(claim.updatedAt).toLocaleString()}
//                         </p>
//                         <p className="text-sm italic text-gray-600">
//                           Status: {claim.status}
//                         </p>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </section>
//             )}
//             {activeSection === "settings" && (
//               <div className="p-5 bg-white rounded-lg shadow">
//                 <h2 className="text-xl font-bold mb-4">NGO Profile Settings</h2>
//                 <form onSubmit={handleSubmit}>
//                   <label className="block mb-2">NGO Name:</label>
//                   <input
//                     type="text"
//                     name="ngo_name"
//                     value={formData.ngo_name}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded mb-4"
//                   />

//                   <label className="block mb-2">Registration Number:</label>
//                   <input
//                     type="text"
//                     name="registration_number"
//                     value={formData.registration_number}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded mb-4"
//                   />

//                   <label className="block mb-2">NGO Phone:</label>
//                   <input
//                     type="text"
//                     name="ngo_phone"
//                     value={formData.ngo_phone}
//                     onChange={handleChange}
//                     className="w-full p-2 border rounded mb-4"
//                   />

//                   <button
//                     type="submit"
//                     className="bg-green-600 text-white px-4 py-2 rounded-lg"
//                   >
//                     Update Profile
//                   </button>
//                 </form>
//               </div>
//             )}
//           </>
//         )}

//         <ClaimDetailsModal
//           claim={selectedClaim}
//           onClose={() => setSelectedClaim(null)}
//           onMarkDelivered={async () => {
//             const donationId = selectedClaim.donation._id;
//             if (!donationId) return;

//             // call the hook
//             await markDelivered(donationId);
//             setReviewDonationId(donationId);
//             setShowReviewModal(true);
//           }}
//         />

//         {showReviewModal && reviewDonationId && (
//           <ReviewModal
//             donationId={reviewDonationId}
//             onClose={() => setShowReviewModal(false)}
//             onSubmit={handleReviewSubmit}
//           />
//         )}
//       </main>
//     </div>
//   );
// }

// export default NgoDashboard;

import React, { useState, useMemo, useEffect } from "react";
import useDonations from "../hooks/useDonations";
import LoadingSpinner from "../Components/LoadingSpinner";
import api from "../../api/api";

// Import Components
import SidebarNavigation from "./SidebarNavigation";
import SearchHeader from "./SearchHeader";
import AvailableDonations from "./AvailableDonation";
import MyClaims from "./MyClaims";
import CompletedDonations from "./CompletedDonations";
import DonationMap from "./DonationMap";
import RejectedDonations from "./RejectedDonations";
import Settings from "./Settings";
import ClaimDetailsModal from "../Components/Donation/Claim/ClaimDetailsModal";
import ReviewModal from "../Components/Donation/Review/ReviewModal";

function NgoDashboard() {
  const [activeSection, setActiveSection] = useState("available");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewDonationId, setReviewDonationId] = useState(null);
  const [formData, setFormData] = useState({
    ngo_name: "",
    registration_number: "",
    ngo_phone: "",
    ngo_location: { type: "Point", coordinates: [0, 0] },
  });

  // Get donation data from custom hook
  const {
    donations,
    loading,
    claims,
    loadingClaims,
    requestedDonations,
    createClaimRequest,
    markDelivered,
  } = useDonations();

  // Memoized filtered data
  const availableDonations = useMemo(
    () => donations.filter((d) => d.status === "available"),
    [donations]
  );

  const completedDonations = useMemo(
    () =>
      claims
        .filter((claim) => claim.status === "delivered")
        .map((claim) => claim.donation),
    [claims]
  );

  const myActiveClaims = useMemo(
    () =>
      claims.filter(
        (claim) =>
          claim.status !== "delivered" &&
          claim.status !== "completed" &&
          claim.status !== "rejected"
      ),
    [claims]
  );

  const rejectedClaims = useMemo(
    () => claims.filter((claim) => claim.status === "rejected"),
    [claims]
  );

  // Filter donations and claims based on search query
  const filteredDonations = useMemo(
    () =>
      availableDonations.filter((d) =>
        d.item.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [availableDonations, searchQuery]
  );

  const filteredMyClaims = useMemo(
    () =>
      myActiveClaims.filter((c) =>
        c.donation?.item?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [myActiveClaims, searchQuery]
  );

  const filteredCompletedDonations = useMemo(
    () =>
      completedDonations.filter((d) =>
        d.item.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [completedDonations, searchQuery]
  );

  const filteredRejectedClaims = useMemo(
    () =>
      rejectedClaims.filter((c) =>
        c.donation?.item?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [rejectedClaims, searchQuery]
  );

  // Handle claim submission directly
  const handleClaimSubmit = async (donationId) => {
    try {
      await createClaimRequest(
        donationId,
        "Requesting this donation for our NGO"
      );
    } catch (error) {
      console.error("Error submitting claim:", error);
    }
  };

  // Check if a donation has been requested
  const isDonationRequested = (donationId) => {
    return (
      requestedDonations.includes(donationId) ||
      claims.some((claim) => claim.donation?._id === donationId)
    );
  };

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          ngo_name: data.ngo_name || "",
          registration_number: data.registration_number || "",
          ngo_phone: data.ngo_phone || "",
          ngo_location: data.ngo_location || {
            type: "Point",
            coordinates: [0, 0],
          },
        });
      } catch (err) {
        console.error("Error fetching NGO profile:", err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleReviewSubmit = async ({ rating, comment, donationId }) => {
    try {
      const response = await api.post(
        `/reviews/donations/${donationId}`,
        { rating, comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Review submitted successfully!");
      setShowReviewModal(false);
      setReviewDonationId(null);
    } catch (err) {
      console.error(
        "Error submitting review:",
        err.response?.data || err.message
      );
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar Navigation */}
      <SidebarNavigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {/* Header and Search */}
        <SearchHeader
          activeSection={activeSection}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Loading State */}
        {loading || loadingClaims ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Available Donations Section */}
            {activeSection === "available" && (
              <AvailableDonations
                donations={filteredDonations}
                handleClaimSubmit={handleClaimSubmit}
                isDonationRequested={isDonationRequested}
              />
            )}

            {/* My Claims Section */}
            {activeSection === "my-claims" && (
              <MyClaims
                claims={filteredMyClaims}
                setSelectedClaim={setSelectedClaim}
              />
            )}

            {/* Completed Donations Section */}
            {activeSection === "completed" && (
              <CompletedDonations donations={filteredCompletedDonations} />
            )}

            {/* Map Section */}
            {activeSection === "map" && (
              <DonationMap
                ngoLocation={formData.ngo_location}
                availableDonations={availableDonations}
                myActiveClaims={myActiveClaims}
              />
            )}

            {/* Rejected Claims Section */}
            {activeSection === "rejected" && (
              <RejectedDonations claims={filteredRejectedClaims} />
            )}

            {/* Settings Section */}
            {activeSection === "settings" && (
              <Settings formData={formData} setFormData={setFormData} />
            )}
          </>
        )}

        <ClaimDetailsModal
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
          onMarkDelivered={async () => {
            const donationId = selectedClaim.donation._id;
            if (!donationId) return;

            await markDelivered(donationId);
            setReviewDonationId(donationId);
            setShowReviewModal(true);
          }}
        />

        {showReviewModal && reviewDonationId && (
          <ReviewModal
            donationId={reviewDonationId}
            onClose={() => setShowReviewModal(false)}
            onSubmit={handleReviewSubmit}
          />
        )}
      </main>
    </div>
  );
}

export default NgoDashboard;
