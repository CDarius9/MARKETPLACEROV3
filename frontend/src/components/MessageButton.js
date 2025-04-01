// src/components/MessageButton.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MessageButton = ({ sellerId, sellerName }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleMessageClick = () => {
    if (user) {
      navigate(`/messages/${sellerId}`, { state: { sellerName } });
    } else {
      navigate('/login', { state: { from: `/messages/${sellerId}` } });
    }
  };

  return (
    <button
      onClick={handleMessageClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Message Seller
    </button>
  );
};

export default MessageButton;