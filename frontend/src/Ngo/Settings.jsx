import React from "react";
import api from "../../api/api";

const Settings = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await api.put("/user/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("NGO Profile updated successfully!");
    } catch (err) {
      console.error("Error updating NGO profile:", err.response?.data || err);
      alert("Failed to update NGO profile");
    }
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">NGO Profile Settings</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">NGO Name:</label>
        <input
          type="text"
          name="ngo_name"
          value={formData.ngo_name}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Registration Number:</label>
        <input
          type="text"
          name="registration_number"
          value={formData.registration_number}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">NGO Phone:</label>
        <input
          type="text"
          name="ngo_phone"
          value={formData.ngo_phone}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Settings;