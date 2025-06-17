import { Spinner, Box } from "@chakra-ui/react";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, userRole, loading } = React.useContext(AuthContext);

  console.log("ProtectedRoute:", { isAuthenticated, userRole, role });

  if (loading) {
    return (
      <Box textAlign="center" mt="20">
        <Spinner size="xl" color="teal.500" />
        <p>Loading...</p>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};