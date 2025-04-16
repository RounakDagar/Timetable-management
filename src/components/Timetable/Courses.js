import React, { useEffect, useState } from "react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/courses/all")
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  const handleAddCourse = () => {
    const newCourse = { courseCode, courseName, semester: parseInt(semester) };
    fetch("http://localhost:8080/courses/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
    }).then(() => window.location.reload());
  };

  const handleDelete = (code) => {
    fetch(`http://localhost:8080/courses/delete/${code}`, { method: "DELETE" })
      .then(() => window.location.reload());
  };

  return (
    <div className="container">
      <h2>Courses</h2>
      <div className="course-form">
        <input type="text" placeholder="Code" onChange={(e) => setCourseCode(e.target.value)} />
        <input type="text" placeholder="Name" onChange={(e) => setCourseName(e.target.value)} />
        <input type="number" placeholder="Semester" onChange={(e) => setSemester(e.target.value)} />
        <button onClick={handleAddCourse}>Add Course</button>
      </div>
      <ul className="course-list">
        {courses.map((course) => (
          <li key={course.courseCode}>
            {course.courseCode} - {course.courseName} (Sem {course.semester})
            <button onClick={() => handleDelete(course.courseCode)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
