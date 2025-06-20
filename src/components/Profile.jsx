import { auth } from "../firebase/config";
import { Link, useNavigate } from "react-router-dom";
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
        <div className="container d-flex justify-content-center align-items-center mt-5">
          <div
            className="card shadow rounded-4 p-4 border-0 w-100"
            style={{ maxWidth: "480px" }}
          >
            <div className="text-center mb-4">
              <img
                src={`https://ui-avatars.com/api/?name=${userDetail.fullName}&background=random`}
                alt="avatar"
                className="rounded-circle border shadow"
                style={{ width: "90px", height: "90px", objectFit: "cover" }}
              />
              <h4 className="mt-3 fw-bold text-primary">
                {userDetail.fullName}
              </h4>
              <span className="badge bg-light text-dark mt-2 px-3 py-2 border">
                {userDetail.email}
              </span>
            </div>

            <hr className="text-muted" />

            <div className="d-grid gap-3">
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger rounded-pill"
              >
                <i className="bi bi-box-arrow-right me-2" />
                Logout
              </button>
              <Link
                to="/home"
                className="btn btn-light border rounded-pill fw-medium"
              >
                ⬅️ Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
