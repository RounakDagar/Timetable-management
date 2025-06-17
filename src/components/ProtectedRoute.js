import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Box, Spinner, Text } from "@chakra-ui/react";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, userRole, loading } = useContext(AuthContext);

  // Show a loading spinner while authentication state is being restored
  if (loading) {
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" color="teal.500" />
        <Text mt="4">Loading...</Text>
      </Box>
    );
  }

  // Redirect to login if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if the user's role does not match the required role
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // Render the protected content if authentication and role checks pass
  return children;
};

export default ProtectedRoute;