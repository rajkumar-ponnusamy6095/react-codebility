import {
  Alert,
  Button,
  Spinner,
} from "react-bootstrap";
import {
  Navigate,
  Outlet,
} from "react-router";

import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
  const {
    isAuthenticated,
    isLoading,
    authError,
    retryAuthentication,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Verifying session...</span>
        </Spinner>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="container py-5">
        <Alert variant="danger" role="alert">
          <Alert.Heading>Unable to verify your session</Alert.Heading>
          <p>{authError}</p>
          <Button variant="danger" onClick={retryAuthentication}>
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
}