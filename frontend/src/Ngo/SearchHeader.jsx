import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchHeader = ({ activeSection, searchQuery, setSearchQuery }) => {
  const sectionTitles = {
    available: "Available Donations",
    "my-claims": "My Claim Requests",
    completed: "Completed Donations",
    map: "Donation Map",
    rejected: "Rejected Donations",
    settings: "Profile Setting",
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {sectionTitles[activeSection]}
        </h1>
      </div>

      <div className="mt-6 relative">
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search donations..."
          className="w-full pl-10 pr-4 py-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </>
  );
};

export default SearchHeader;