import React, { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import image from '../../assets/imgge.png';
import { db, auth } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const AddRoomPage = ({ setStep }) => {
  const [college, setCollege] = useState('');
  const [centers, setCenters] = useState([{ centerName: '', rooms: [{ roomNo: '', capacity: '' }] }]);
  const [loading, setLoading] = useState(false);

  const handleAddCenter = () => {
    setCenters([...centers, { centerName: '', rooms: [{ roomNo: '', capacity: '' }] }]);
  };

  const handleDeleteCenter = (index) => {
    const updated = [...centers];
    updated.splice(index, 1);
    setCenters(updated);
  };

  const handleCenterChange = (index, value) => {
    const updated = [...centers];
    updated[index].centerName = value;
    setCenters(updated);
  };

  const handleRoomChange = (centerIndex, roomIndex, field, value) => {
    const updated = [...centers];
    updated[centerIndex].rooms[roomIndex][field] = value;
    setCenters(updated);
  };

  const handleAddRoom = (centerIndex) => {
    const updated = [...centers];
    updated[centerIndex].rooms.push({ roomNo: '', capacity: '' });
    setCenters(updated);
  };

  const handleDeleteRoom = (centerIndex, roomIndex) => {
    const updated = [...centers];
    updated[centerIndex].rooms.splice(roomIndex, 1);
    setCenters(updated);
  };

  const handleSaveAndNext = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("No logged-in user.");
      return;
    }

    setLoading(true);
    try {
      const userDocRef = doc(db, "users", currentUser.email);

      await updateDoc(userDocRef, {
        data: {
          "Collage/University Name": college,
          centers: centers.map(center => ({
            "Center Name": center.centerName,
            rooms: center.rooms.map(r => ({
              "Room/Hall No": r.roomNo,
              "Capacity": r.capacity
            }))
          }))
        }
      });

      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 1000);
    } catch (error) {
      console.error("Error saving data:", error);
      setLoading(false);
      alert("Failed to save data.");
    }
  };

  return (
    <div className='w-full h-screen flex overflow-hidden'>
      {/* Left Panel (Form) */}
      <div className='w-full md:w-1/2 p-6 flex flex-col overflow-y-auto'>
        <div className="sticky top-0 bg-white z-10 py-2">
          <h2 className="text-3xl font-bold text-[#2f3b92] mb-1 text-center">Examino</h2>
          <p className="text-lg text-[#2f3b92] mb-4 text-center">Teachers Partner in Exam</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-[#2f3b92] mb-1">Collage/University Name</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-b-4 border-[#f8b237] border shadow-md focus:outline-none"
            />
          </div>

          {centers.map((center, cIndex) => (
            <div key={cIndex} className='border border-gray-300 p-4 rounded-xl shadow-md mb-6'>
              <div className='flex justify-between items-center mb-2'>
                <label className="block text-[#2f3b92] mb-1">Center Name</label>
                {centers.length > 1 && (
                  <FaTrash
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDeleteCenter(cIndex)}
                  />
                )}
              </div>
              <input
                type="text"
                value={center.centerName}
                onChange={(e) => handleCenterChange(cIndex, e.target.value)}
                className="w-full mb-4 px-4 py-2 rounded-lg border-b-4 border-[#f8b237] border shadow-md focus:outline-none"
              />

              {center.rooms.map((room, rIndex) => (
                <div key={rIndex} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[#2f3b92] mb-1">Room/Hall No.</label>
                    <input
                      type="text"
                      value={room.roomNo}
                      onChange={(e) => handleRoomChange(cIndex, rIndex, 'roomNo', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-b-4 border-[#f8b237] border shadow-md focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[#2f3b92] mb-1">Capacity</label>
                    <input
                      type="number"
                      value={room.capacity}
                      onChange={(e) => handleRoomChange(cIndex, rIndex, 'capacity', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-b-4 border-[#f8b237] border shadow-md focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-start mt-2 md:mt-0">
                    {center.rooms.length > 1 && (
                      <FaTrash
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDeleteRoom(cIndex, rIndex)}
                      />
                    )}
                  </div>
                </div>
              ))}

              <div className='flex justify-end items-center'>
                <div
                  type="button"
                  onClick={() => handleAddRoom(cIndex)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className='p-1 rounded-full bg-[#303f8e] text-white cursor-pointer'>
                    <FaPlus />
                  </div>
                  <p className='text-[#303f8e]'>Add Room</p>
                </div>
              </div>
            </div>
          ))}

          <div className='w-full flex justify-start items-center'>
            <div
              type="button"
              onClick={handleAddCenter}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className='p-1 rounded-full bg-[#303f8e] text-white cursor-pointer'>
                <FaPlus />
              </div>
              <p className='text-[#303f8e]'>Add Center</p>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              type="submit"
              onClick={handleSaveAndNext}
              disabled={loading}
              className="bg-[#2f3b92] text-white font-semibold cursor-pointer py-3 px-8 rounded-xl hover:bg-[#1f2b7a] flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Next & Save'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Right Side Image */}
      <div className='w-1/2 hidden md:block'>
        <img src={image} alt="cover" className='w-full h-full object-cover' />
      </div>
    </div>
  );
};

export default AddRoomPage;
