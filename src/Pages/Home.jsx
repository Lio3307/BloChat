import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PostList } from "../components/PostList";
import { useAuthContext } from "../contexts/AuthContext";
import { NavBar } from "../components/NavBar";

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
    <div className="container py-5">
      <div className="mb-4 text-end">
        <button
          className="btn btn-danger px-4 shadow-sm"
          onClick={handleLogOut}
        >
          <i className="bi bi-box-arrow-right me-2" /> Log Out
        </button>
      </div>

      <div className="text-center mb-5">
        <img
          src={`https://ui-avatars.com/api/?name=${userDetail.fullName}&background=random`}
          className="rounded-circle shadow-sm border border-3 border-light"
          style={{ width: "80px", height: "80px" }}
          alt="avatar"
        />
        <h3 className="mt-3 fw-bold text-dark">
          Welcome, {userDetail.fullName}
        </h3>
        <p className="text-muted">Share your thoughts with the world!</p>
      </div>

      <div className="card mb-4 border-0 shadow rounded-4 bg-light-subtle">
        <div className="card-body p-3">
          <Link
            to="/create-post"
            className="form-control bg-white border border-2 border-secondary-subtle text-dark rounded-pill ps-4 pe-3 py-2"
            style={{
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            💬 What's on your mind?
          </Link>
        </div>
      </div>

      <NavBar />

      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <h5 className="fw-semibold text-dark">📬 Recent Posts</h5>
      </div>

      <PostList />
    </div>
  );
};
