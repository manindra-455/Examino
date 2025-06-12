import React, { useEffect, useState } from 'react';
import logo from "../../assets/logo_examino.png";
import { FaUserCircle } from "react-icons/fa";
import UserProfilePanel from '../home/popup/UserProfilePanel';
import { db, auth } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const Navbaar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState({
    username: '',
    nickname: '',
    phone: '',
    email: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const email = currentUser.email;
        const docRef = doc(db, "users", email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          console.warn("No user document found for email:", email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setShowProfile(false);
      navigate('/'); // 🔴 Redirect to login page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <div className='w-full h-[70px] bg-[#303f8e] flex items-center justify-between px-6'>
        <div className='flex items-center gap-2'>
          <img src={logo} alt='examino' className='w-10 h-10 object-cover' />
          <h1 className='text-xl font-bold text-white'>Examino</h1>
        </div>
        <FaUserCircle
          className="text-white text-2xl cursor-pointer"
          onClick={() => setShowProfile(true)}
        />
      </div>

      <UserProfilePanel
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Navbaar;
