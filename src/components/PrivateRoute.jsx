import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export const PrivateRoute = ({ children }) => {
  const { loading, userDetail } = useAuthContext();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return userDetail ? children : <Navigate to="/login" />;
};
