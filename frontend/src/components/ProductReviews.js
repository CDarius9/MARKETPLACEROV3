import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaStar } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reviews/product/${productId}`);
      setReviews(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to fetch reviews');
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/reviews`, {
        productId,
        rating: newReview.rating,
        comment: newReview.comment
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setNewReview({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('Failed to submit review');
    }
  };

  const handleEditReview = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/reviews/${editingReview.id}`, {
        rating: editingReview.rating,
        comment: editingReview.comment
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setEditingReview(null);
      fetchReviews();
    } catch (err) {
      console.error('Error editing review:', err);
      setError('Failed to edit review');
    }
  };

  const StarRating = ({ rating, onRatingChange }) => {
    return (
      <div className="flex">
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1;
          return (
            <label key={i}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => onRatingChange(ratingValue)}
                className="hidden"
              />
              <FaStar
                className="cursor-pointer"
                color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                size={20}
              />
            </label>
          );
        })}
      </div>
    );
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Product Reviews</h2>
      {user && !editingReview && (
        <form onSubmit={handleSubmitReview} className="mb-6 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Write a Review</h3>
          <div className="mb-4">
            <label htmlFor="rating" className="block mb-1">Rating</label>
            <StarRating 
              rating={newReview.rating} 
              onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="comment" className="block mb-1">Comment</label>
            <textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows="4"
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Submit Review
          </button>
        </form>
      )}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            {editingReview && editingReview.id === review.id ? (
              <form onSubmit={handleEditReview} className="bg-gray-100 p-4 rounded-lg">
                <StarRating 
                  rating={editingReview.rating} 
                  onRatingChange={(rating) => setEditingReview({ ...editingReview, rating })}
                />
                <textarea
                  value={editingReview.comment}
                  onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg mt-2"
                  rows="4"
                ></textarea>
                <div className="mt-2">
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 mr-2">
                    Save Changes
                  </button>
                  <button onClick={() => setEditingReview(null)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{review.username}</span>
                  <StarRating rating={review.rating} />
                </div>
                <p>{review.comment}</p>
                {review.edited && (
                  <p className="text-sm text-gray-500 mt-1 italic">
                    (Edited)
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
                {user && user.id === review.user_id && (
                  <button 
                    onClick={() => setEditingReview(review)} 
                    className="text-blue-500 hover:text-blue-700 mt-2"
                  >
                    Edit Review
                  </button>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;