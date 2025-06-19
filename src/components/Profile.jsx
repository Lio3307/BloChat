import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuthContext } from "../contexts/AuthContext";

export const Profile = () => {
  const navigate = useNavigate();

  const { userDetail, loading } = useAuthContext();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      alert("You have been log out...");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container d-flex justify-content-center mt-5">
          <div
            className="card shadow-lg p-4"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <h3 className="text-center mb-3 text-primary">User Profile</h3>
            <div className="mb-2">
              <strong>Name:</strong>
              <p className="form-control-plaintext">{userDetail.fullName}</p>
            </div>
            <div className="mb-2">
              <strong>Email:</strong>
              <p className="form-control-plaintext">{userDetail.email}</p>
            </div>
            <button onClick={handleLogout} className="btn btn-danger">
              LogOut
            </button>
          </div>
        </div>
      )}
    </>
  );
};
