import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const Settings = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // 🔑 stored at login

  // Fetch restaurant profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      restaurant_location: {
        type: "Point",
        coordinates: value.split(",").map(Number), // e.g. "74.123,31.456"
      },
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      restaurant_name: formData.restaurant_name,
      license_number: formData.license_number,
      restaurant_phone: formData.restaurant_phone,
      restaurant_location: formData.restaurant_location,
    };

    await api.put("/user/profile", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Profile updated successfully!");
  } catch (err) {
    console.error("Error updating profile:", err.response?.data || err);
    alert("Failed to update profile");
  }
};


  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Restaurant Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Restaurant Name</label>
          <input
            type="text"
            name="restaurant_name"
            value={formData.restaurant_name || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">License Number</label>
          <input
            type="text"
            name="license_number"
            value={formData.license_number || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Phone</label>
          <input
            type="text"
            name="restaurant_phone"
            value={formData.restaurant_phone || ""}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Location (lng,lat)</label>
          <input
            type="text"
            placeholder="74.123,31.456"
            onChange={handleLocationChange}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Settings;
