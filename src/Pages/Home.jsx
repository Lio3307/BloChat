import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PostList } from "../components/PostList";
import { useAuthContext } from "../contexts/AuthContext";

export const Home = () => {
  const { loading, userDetail } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !userDetail) {
      alert("You cannot access this page, login or register first!!");
      navigate("/register");
    }
  }, [loading, userDetail]);

  const handleLogOut = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      navigate("/register");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="card shadow-sm p-4 mb-4 bg-light rounded">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h3 className="text-primary mb-2 mb-md-0">
            Welcome, <span className="fw-bold">{userDetail.fullName}</span>
          </h3>
          <button className="btn btn-outline-danger" onClick={handleLogOut}>
            Log Out
          </button>
        </div>

        {/* Upload area */}
        <div className="card shadow-sm mb-4">
          <div className="card-body d-flex align-items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${userDetail.fullName}&background=random`}
              alt="avatar"
              className="rounded-circle me-3"
              style={{ width: "45px", height: "45px" }}
            />
            <Link
              to="/create-post"
              className="form-control bg-light text-muted rounded-pill text-start"
              style={{
                textDecoration: "none",
                padding: "10px 15px",
                fontSize: "0.9rem",
              }}
            >
              What's on your mind?
            </Link>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Post List</h5>
        </div>

        <PostList />
      </div>
    </div>
  );
};
