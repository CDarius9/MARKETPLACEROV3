import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaTimes, FaBox, FaArrowRight, FaTrash } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CartPopup = ({ onClose }) => {
  const { cart, getCartTotal, removeFromCart } = useContext(CartContext);

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xl font-bold text-gray-900">Shopping Cart</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">{cart.length} items</p>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaShoppingCart className="text-2xl text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h4>
            <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
            <Link 
              to="/products" 
              className="text-brand-brown hover:text-brand-brown/80 flex items-center gap-2"
              onClick={onClose}
            >
              Browse Products <FaArrowRight />
            </Link>
          </div>
        ) : (
          <div className="py-4">
            {cart.map((item) => (
              <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={`${API_URL}/uploads/${item.image_url}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/path/to/placeholder-image.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBox className="text-2xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                        <p className="text-sm text-gray-500 mb-2">Quantity: {item.quantity}</p>
                        <p className="font-semibold text-brand-brown">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {cart.length > 0 && (
        <div className="border-t p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-xl font-bold text-gray-900">
              ${getCartTotal().toFixed(2)}
            </span>
          </div>
          
          <Link
            to="/cart"
            onClick={onClose}
            className="block w-full bg-brand-brown text-white text-center py-3 rounded-xl hover:bg-opacity-90 transition-colors font-medium"
          >
            View Cart
          </Link>
          
          <Link
            to="/checkout"
            onClick={onClose}
            className="block w-full bg-brand-green text-white text-center py-3 rounded-xl hover:bg-opacity-90 transition-colors font-medium"
          >
            Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPopup;