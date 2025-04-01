import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { FaPaperPlane, FaUserCircle, FaSearch, FaEllipsisV, 
         FaImage, FaSmile, FaCircle } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const { otherUserId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
    if (otherUserId) {
      fetchMessages(otherUserId);
    }
    setIsLoading(false);
  }, [otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/messages/conversations`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/api/messages/${userId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setMessages(response.data);
      setCurrentConversation(userId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        `${API_URL}/api/messages`,
        { receiverId: currentConversation, content: newMessage },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      setNewMessage('');
      fetchMessages(currentConversation);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-brown/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-4 border-brand-brown border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.other_user_id}
                onClick={() => fetchMessages(conv.other_user_id)}
                className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50
                  ${currentConversation === conv.other_user_id ? 'bg-brand-brown/5 border-l-4 border-brand-brown' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <FaUserCircle className="w-full h-full text-gray-400" />
                    </div>
                    <FaCircle className={`absolute bottom-0 right-0 text-xs 
                      ${conv.is_online ? 'text-green-500' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conv.other_username}</h3>
                      <span className="text-xs text-gray-500">{formatMessageTime(conv.last_message_time)}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 py-4 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUserCircle className="w-full h-full text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {conversations.find(c => c.other_user_id === currentConversation)?.other_username}
                    </h3>
                    <span className="text-sm text-green-500">Online</span>
                  </div>
                </div>
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                  <FaEllipsisV />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender_id !== user.id && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 mr-2">
                      <FaUserCircle className="w-full h-full text-gray-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-md rounded-2xl py-2 px-4 ${
                      message.sender_id === user.id
                        ? 'bg-brand-brown text-white ml-12'
                        : 'bg-gray-100 text-gray-900 mr-12'
                    }`}
                  >
                    <p className="mb-1">{message.content}</p>
                    <p className="text-xs opacity-75">
                      {formatMessageTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={sendMessage} className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaImage />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaSmile />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 py-2 px-4 bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-brand-brown/20"
                />
                <button
                  type="submit"
                  className="p-2 bg-brand-brown text-white rounded-full hover:bg-opacity-90 transition-colors"
                  disabled={!newMessage.trim()}
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-brown/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPaperPlane className="text-2xl text-brand-brown" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Messages</h3>
              <p className="text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;