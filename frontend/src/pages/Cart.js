import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaPlus, FaMinus, FaTrash, FaShoppingCart, 
         FaArrowLeft, FaBox, FaTruck, FaShieldAlt } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-brand-brown/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingCart className="text-4xl text-brand-brown" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Browse our marketplace to find amazing local products.
          </p>
          <button 
            onClick={() => navigate('/products')} 
            className="inline-flex items-center px-8 py-3 bg-brand-brown text-white rounded-xl hover:bg-opacity-90 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button 
            onClick={() => navigate('/products')}
            className="text-brand-brown hover:text-brand-brown/80 transition-colors flex items-center gap-2"
          >
            <FaArrowLeft /> Continue Shopping
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-grow">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              {cart.map((item, index) => (
                <div key={item.id} className={`p-6 ${index !== cart.length - 1 ? 'border-b' : ''}`}>
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
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
                          <FaBox className="text-3xl text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between mb-2">
                        <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                        <p className="text-lg font-bold text-brand-brown">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">${item.price.toFixed(2)} each</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-brand-brown transition-colors"
                            >
                              <FaMinus className="text-sm" />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-brand-brown transition-colors"
                            >
                              <FaPlus className="text-sm" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-brand-brown text-white py-3 rounded-xl hover:bg-opacity-90 transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full bg-red-500/10 text-red-500 py-3 rounded-xl hover:bg-red-500/20 transition-colors font-medium"
                >
                  Clear Cart
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <FaTruck className="w-6 h-6 mx-auto text-brand-brown mb-2" />
                    <span className="text-xs text-gray-600">Free Shipping</span>
                  </div>
                  <div className="text-center">
                    <FaShieldAlt className="w-6 h-6 mx-auto text-brand-brown mb-2" />
                    <span className="text-xs text-gray-600">Secure Payment</span>
                  </div>
                  <div className="text-center">
                    <FaBox className="w-6 h-6 mx-auto text-brand-brown mb-2" />
                    <span className="text-xs text-gray-600">Local Products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;