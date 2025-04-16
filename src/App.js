import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/SignUp";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import FacultyDashboard from "./components/Dashboard/FacultyDashboard/FacultyDashboard";
import Navbar from "./components/Navbar";
import AttendanceSummary from "./components/Attendance/AttendanceSummary";
import TimetableDetails from "./components/Dashboard/FacultyDashboard/TimetableDetails";
import CourseDetails from "./components/Dashboard/FacultyDashboard/CourseDetails";
import ForgotPassword from "./components/Auth/ForgotPassword";
import "./App.css";

// Route Wrappers
const LoginRedirect = () => {
  const { isAuthenticated, userRole, loading } = React.useContext(AuthContext);
  const location = useLocation();

  console.log("LoginRedirect:", { isAuthenticated, userRole, loading });

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while restoring auth state
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to={userRole === "FACULTY" ? "/faculty-dashboard" : "/student-dashboard"}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Login />;
};

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, userRole } = React.useContext(AuthContext);

  console.log("ProtectedRoute:", { isAuthenticated, userRole, role });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LoginRedirect />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route
      path="/student-dashboard"
      element={
        <ProtectedRoute role="STUDENT">
          <StudentDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/faculty-dashboard"
      element={
        <ProtectedRoute role="FACULTY">
          <FacultyDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/attendance-summary/:studentId/:courseCode"
      element={<AttendanceSummary />}
    />
    <Route
      path="/timetable-details/:timetableId"
      element={
        <ProtectedRoute role="FACULTY">
          <TimetableDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path="/course-details/:courseCode"
      element={
        <ProtectedRoute role="FACULTY">
          <CourseDetails />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <AppRoutes />
      </div>
    </AuthProvider>
  );
};

export default App;

