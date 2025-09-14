import { useState, useEffect, useCallback } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

// Initial form state
const initialFormState = {
  item: "",
  quantity: "",
  unit: "",
  expiry_time: "",
  pickup_address: "",
  status: "available",
};

const useDonations = () => {
  const [donations, setDonations] = useState([]);
  const [claims, setClaims] = useState([]);
  const [requestedDonations, setRequestedDonations] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [donationToDelete, setDonationToDelete] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(false);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(false);

  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleAuthError();
      return null;
    }
    return token;
  };

  const handleAuthError = () => {
    setAuthError(true);
    localStorage.removeItem("token");
    setError("Session expired. Please login again.");
  };

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await api.get("/donation", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(res.data || []);
    } catch (err) {
      if (err.response?.status === 401) handleAuthError();
      else setError(err.response?.data?.message || "Failed to fetch donations");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClaims = useCallback(async () => {
    setLoadingClaims(true);
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await api.get("/donation/my-claims", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClaims(res.data || []);
    } catch (err) {
      if (err.response?.status === 401) handleAuthError();
      else setError(err.response?.data?.message || "Failed to fetch claims");
    } finally {
      setLoadingClaims(false);
    }
  }, []);

  const createClaimRequest = async (donationId, message = "") => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await api.post(
        `/donation/${donationId}/claim-request`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequestedDonations((prev) => [...prev, donationId]);
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) handleAuthError();
      throw err;
    }
  };

  const approveClaimRequest = async (claimId) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await api.put(
        `/donation/claims/${claimId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) handleAuthError();
      throw err;
    }
  };

  const rejectClaimRequest = async (claimId) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await api.put(
        `/donation/claims/${claimId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) handleAuthError();
      throw err;
    }
  };

  const markDelivered = async (donationId) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      // Optimistic UI update
      setDonations((prev) =>
        prev.map((d) =>
          d._id === donationId ? { ...d, status: "delivered" } : d
        )
      );
      setClaims((prev) =>
        prev.map((claim) =>
          claim.donation?._id === donationId
            ? { ...claim, status: "delivered" }
            : claim
        )
      );

      // Update server
      await api.put(
        `/donation/${donationId}/delivered`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Delivery failed:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        ...formData,
        status: "available",
        pickup_location: formData.pickup_location || {
          type: "Point",
          coordinates: [0, 0],
        },
      };

      if (editingId) {
        const res = await api.put(
          `/donation/${editingId}/edit`,
          payload,
          config
        );
        setDonations((prev) =>
          prev.map((d) => (d._id === editingId ? res.data : d))
        );
        toast.success("Donation updated successfulyy");
      } else {
        const res = await api.post("/donation", payload, config);
        setDonations((prev) => [res.data, ...prev]);
        toast.success("Donation added successfully");
      }

      resetForm();
    } catch (err) {
      if (err.response?.status === 401) handleAuthError();
      else alert(err.response?.data?.message || "Failed to submit");
    }
  };

  const deleteDonation = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await api.delete(`/donation/${donationToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonations((prev) =>
        prev.filter((d) => d._id !== donationToDelete._id)
      );
      setDonationToDelete(null);
    } catch (err) {
      if (err.response?.status === 401) handleAuthError();
      else alert(err.response?.data?.message || "Delete failed");
    }
  };

  const editDonation = (donation) => {
    setFormData({
      item: donation.item,
      quantity: donation.quantity,
      unit: donation.unit,
      expiry_time: new Date(donation.expiry_time).toISOString().slice(0, 16),
      pickup_address: donation.pickup_address,
      status: donation.status,
    });
    setEditingId(donation._id);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 0 : value,
    }));
  };

  const fetchDonationClaims = async (donationId) => {
    try {
      const token = getAuthToken();
      if (!token) return [];

      const res = await api.get(`/donation/${donationId}/claims`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err) {
      if (err.response?.status === 401) handleAuthError();
      console.error("Error fetching claims:", err);
      return [];
    }
  };

  useEffect(() => {
    (async () => {
      await fetchDonations();
      await fetchClaims();
    })();
  }, [fetchDonations, fetchClaims]);

  return {
    donations,
    claims,
    formData,
    editingId,
    loading,
    error,
    authError,
    donationToDelete,
    requestedDonations,
    loadingClaims,

    setFormData,
    setDonationToDelete,
    setEditingId,

    handleSubmit,
    handleChange,
    editDonation,
    deleteDonation,
    resetForm,

    fetchDonations,
    fetchClaims,
    createClaimRequest,
    approveClaimRequest,
    rejectClaimRequest,
    markDelivered,
    fetchDonationClaims,
    setDonations,
  };
};

export default useDonations;
