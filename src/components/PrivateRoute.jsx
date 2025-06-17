import { useAuthContext } from "../contexts/AuthContext";

export const PrivateRoute = ({ children }) => {
  const { loading, userDetail } = useAuthContext();

  if (loading) return <p>Loading...</p>;

  return userDetail ? children : <Navigate to="/login" />;
};
