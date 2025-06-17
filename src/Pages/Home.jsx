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
      <div className="d-flex justify-content-center align-items-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!userDetail) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Redirecting...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3>Welcome {userDetail.fullName}</h3>
      <button className="btn btn-danger" onClick={handleLogOut}>
        LogOut
      </button>
      <Link to={"/create-post"}>Add Post</Link>
      <PostList />
    </>
  );
};
