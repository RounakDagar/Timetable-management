import React, { useEffect, useState } from "react";

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);
  const [day, setDay] = useState("Monday");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [timetableId, setTimetableId] = useState("");
  const [attended, setAttended] = useState(false);

  // Fetch timetable based on selected day
  useEffect(() => {
    const fetchTimetable = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8080/timetables/day/${day}`);
        if (!res.ok) throw new Error("Failed to fetch timetable");
        const data = await res.json();
        setTimetable(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [day]);

  const markAttendance = async () => {
    if (!studentId || !timetableId) {
      alert("Please enter both Student ID and Timetable ID.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/timetables/mark/${studentId}/${timetableId}?attended=${attended}`, {
        method: "PUT",
      });

      if (res.ok) {
        alert("Attendance Marked Successfully!");
      } else {
        alert("Failed to mark attendance. Please try again.");
      }
    } catch (error) {
      alert("Error: Unable to mark attendance.");
    }
  };

  return (
    <div className="container">
      <h2>{day}'s Timetable</h2>
      
      {/* Select Day */}
      <select value={day} onChange={(e) => setDay(e.target.value)}>
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Display Timetable */}
      {loading ? <p>Loading timetable...</p> : error ? <p className="error">{error}</p> : (
        <ul className="timetable-list">
          {timetable.length > 0 ? (
            timetable.map((slot) => (
              <li key={slot.id}>
                {slot.day} - {slot.timeSlot} - {slot.venue} - {slot.course.courseName}
              </li>
            ))
          ) : (
            <p>No timetable available for {day}.</p>
          )}
        </ul>
      )}

      {/* Attendance Section */}
      <h3>Mark Attendance</h3>
      <input type="text" placeholder="Student ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
      <input type="number" placeholder="Timetable ID" value={timetableId} onChange={(e) => setTimetableId(e.target.value)} />
      <select value={attended} onChange={(e) => setAttended(e.target.value === "true")}>
        <option value="false">Absent</option>
        <option value="true">Present</option>
      </select>
      <button onClick={markAttendance}>Mark Attendance</button>
    </div>
  );
};

export default Timetable;
