import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/reviews`, {
        productId,
        rating,
        comment
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setRating(5);
      setComment('');
      onReviewSubmitted();
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="rating" className="block mb-1">Rating</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>{value} stars</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="comment" className="block mb-1">Comment</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows="4"
        ></textarea>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;