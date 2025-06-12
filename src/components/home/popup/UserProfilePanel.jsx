import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { FaSpinner } from "react-icons/fa";

const UserProfilePanel = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onLogout = () => {
    setLoading(true);
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
        alert("Failed to log out");
        setLoading(false);
      });
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-[#303f8e] shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 bg-[#303f8e] text-white">
        <h2 className="text-lg font-semibold">User Profile</h2>
        <button onClick={onClose} className="text-white text-xl">×</button>
      </div>

      <div className="p-6">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-full bg-[#f4711d] flex items-center justify-center text-white text-2xl font-bold">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-semibold text-white mb-1">
            Username
          </label>
          <input
            type="text"
            value={user.username}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-semibold text-white mb-1">
            Nickname
          </label>
          <input
            type="text"
            value={user.nickname}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-semibold text-white mb-1">
            Phone
          </label>
          <input
            type="text"
            value={user.phone}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-white mb-1">
            Email
          </label>
          <input
            type="text"
            value={user.email}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <button
          onClick={onLogout}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 ${
            loading ? "bg-[#f4711d]/70 cursor-not-allowed" : "bg-[#f4711d] hover:bg-[#f8b237]"
          } text-white font-semibold py-2 rounded transition-all duration-200`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Logging out...
            </>
          ) : (
            "Log Out"
          )}
        </button>
      </div>
    </div>
  );
};

export default UserProfilePanel;
