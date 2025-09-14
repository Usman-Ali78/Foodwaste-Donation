import ReactStars from "react-rating-stars-component";
import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const ReviewForm = ({ donationId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/reviews/donations/${donationId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="font-semibold mb-2">Leave a Review</h3>
      <ReactStars
        count={5}
        value={rating}
        onChange={(newRating) => setRating(newRating)}
        size={28}
        activeColor="#ffd700"
      />
      <textarea
        className="w-full border rounded-lg p-2 mt-2 text-sm"
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={submitReview}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
};

export default ReviewForm;
