import React, { useEffect, useState } from "react";
import image from "../../assets/imgge.png";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbaar from "../layout/Navbaar";
import { getAuth } from "firebase/auth";

const AllotmentSuccess = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seatingData, setSeatingData] = useState([]);
  const [leftStudents, setLeftStudents] = useState([]);
  const [viewModal, setViewModal] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) setUserEmail(user.email);
  }, []);

  const fetchSeatingData = async (email) => {
    const userDoc = doc(db, "users", email);
    const snap = await getDoc(userDoc);
    if (!snap.exists()) throw new Error("User not found.");
    return snap.data().data;
  };

  const expandStudents = (courses) => {
    const students = [];
    for (const c of courses) {
      const from = parseInt(c.rollFrom);
      const to = parseInt(c.rollTo);
      for (let i = from; i <= to; i++) {
        students.push({ roll: i.toString(), course: c.course });
      }
    }
    return students;
  };

  const interleaveStudents = (students) => {
    const groups = {};
    students.forEach((s) => {
      if (!groups[s.course]) groups[s.course] = [];
      groups[s.course].push(s);
    });

    const interleaved = [];
    const keys = Object.keys(groups);
    while (Object.values(groups).some((g) => g.length)) {
      for (const k of keys) {
        if (groups[k].length) interleaved.push(groups[k].shift());
      }
    }

    return interleaved;
  };

  const assignSeatingToRooms = (students, centers, seatingType) => {
    const perBench = seatingType === "Single" ? 1 : 2;
    const allRooms = centers.flatMap(center =>
      center.rooms.map(room => ({
        center: center["Center Name"],
        roomNo: room["Room/Hall No"],
        capacity: parseInt(room.Capacity)
      }))
    );

    const courseGroups = {};
    for (const student of students) {
      if (!courseGroups[student.course]) {
        courseGroups[student.course] = [];
      }
      courseGroups[student.course].push(student);
    }

    const getDifferentCourseStudent = (excludeCourse) => {
      for (const course in courseGroups) {
        if (course !== excludeCourse && courseGroups[course].length > 0) {
          return courseGroups[course].shift();
        }
      }
      return null;
    };

    const seatingPlan = [];
    const leftStudents = [];

    for (const room of allRooms) {
      const benches = [];

      for (let i = 0; i < room.capacity; i++) {
        let bench = [];

        let primaryCourse = Object.keys(courseGroups).find(course => courseGroups[course].length > 0);
        if (!primaryCourse) break;

        let student1 = courseGroups[primaryCourse].shift();
        bench.push(student1);

        if (perBench === 2) {
          let student2 = getDifferentCourseStudent(student1.course);
          if (student2) {
            bench.push(student2);
          }
        }

        benches.push(bench);
      }

      seatingPlan.push({ room: room.roomNo, center: room.center, benches });
    }

    // Add remaining students to the list
    for (const course in courseGroups) {
      for (const s of courseGroups[course]) {
        leftStudents.push({ roll: s.roll, course: s.course });
      }
    }

    return { seatingPlan, leftStudents };
  };

  const handleView = async () => {
    setLoading(true);
    try {
      const data = await fetchSeatingData(userEmail);
      const students = expandStudents(data.courses);
      const interleaved = interleaveStudents(students);
      const { seatingPlan, leftStudents } = assignSeatingToRooms(interleaved, data.centers, data.seatingType);
      setSeatingData(seatingPlan);
      setLeftStudents(leftStudents);
      setViewModal(true);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const data = await fetchSeatingData(userEmail);
      const students = expandStudents(data.courses);
      const interleaved = interleaveStudents(students);
      const { seatingPlan, leftStudents } = assignSeatingToRooms(interleaved, data.centers, data.seatingType);

      const doc = new jsPDF();

      seatingPlan.forEach((roomBlock, index) => {
        if (index !== 0) doc.addPage();

        doc.setFontSize(18);
        doc.text("Seating Plan", 105, 15, { align: "center" });

        doc.setFontSize(14);
        doc.text(`Center: ${roomBlock.center} | Room: ${roomBlock.room}`, 14, 30);

        autoTable(doc, {
          startY: 40,
          head: [["Bench No", "Seat 1", "Seat 2"]],
          body: roomBlock.benches.map((bench, i) => [
            i + 1,
            bench[0] ? `${bench[0].roll} (${bench[0].course})` : "",
            bench[1] ? `${bench[1].roll} (${bench[1].course})` : "",
          ]),
        });
      });

      if (leftStudents.length > 0) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text("Unassigned Students", 14, 20);
        doc.setFontSize(12);
        leftStudents.forEach((s, idx) => {
          doc.text(`${idx + 1}. ${s.roll} (${s.course})`, 14, 30 + idx * 7);
        });
      }

      doc.save("seating-plan.pdf");
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbaar />
      <div className="min-h-screen bg-[#fefbfb] flex items-center justify-center px-6 py-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-[#2f3c8e] mb-2">Allotment Successful</h1>
            <p className="text-lg text-[#2f3c8e] mb-6">Thank you!!</p>
            <div className="flex gap-4 justify-center md:justify-start">
              <button
                onClick={handleView}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                {loading ? "Loading..." : "View"}
              </button>
              <button
                onClick={handleDownload}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                {loading ? "Loading..." : "Download"}
              </button>
            </div>
          </div>
          <div className="hidden md:flex w-full md:w-[50%] lg:w-[40%] h-full bg-[#303f8e] justify-center items-center overflow-hidden p-2">
            <img
              src={image}
              alt="examino"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {viewModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-h-[80vh] w-[90%] md:w-[70%] overflow-y-auto relative">
            <button
              className="absolute top-3 right-3 text-black text-2xl font-bold"
              onClick={() => setViewModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Seating Plan</h2>

            {seatingData.map((room, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Center: {room.center} | Room: {room.room}
                </h3>
                <table className="w-full border border-gray-400 text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border p-2">Bench No</th>
                      <th className="border p-2">Seat 1</th>
                      <th className="border p-2">Seat 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {room.benches.map((bench, i) => (
                      <tr key={i}>
                        <td className="border p-2 text-center">{i + 1}</td>
                        <td className="border p-2 text-center">
                          {bench[0] ? `${bench[0].roll} (${bench[0].course})` : ""}
                        </td>
                        <td className="border p-2 text-center">
                          {bench[1] ? `${bench[1].roll} (${bench[1].course})` : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            {leftStudents.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Unassigned Students:</h3>
                <ul className="list-disc list-inside text-sm text-red-600">
                  {leftStudents.map((s, i) => (
                    <li key={i}>{s.roll} ({s.course})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AllotmentSuccess;
