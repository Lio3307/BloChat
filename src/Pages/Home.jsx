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
      <div className="card shadow-sm p-4 mb-4 bg-light rounded">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="text-primary mb-0">
            Welcome, <span className="fw-bold">{userDetail.fullName}</span>
          </h3>
          <button className="btn btn-outline-danger" onClick={handleLogOut}>
            Log Out
          </button>
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-3">Post List</h5>
          <Link to="/create-post" className="m-2 btn btn-success">
            + Create New Post
          </Link>
        </div>
        <PostList />
      </div>
    </div>
  );
};
