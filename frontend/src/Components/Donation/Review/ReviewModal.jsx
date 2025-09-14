import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

function ReviewModal({ donationId, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide a rating and comment.");
      return;
    }
    onSubmit({ rating, comment, donationId });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Leave a Review</h2>

        {/* Star rating */}
        <div className="flex space-x-1 mb-4">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <FaStar
                key={starValue}
                size={28}
                className={`cursor-pointer ${
                  starValue <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
              />
            );
          })}
        </div>

        {/* Comment box */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your feedback..."
          className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
