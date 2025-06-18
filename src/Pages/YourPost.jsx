import { auth, db } from "../firebase/config";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

export const YourPost = () => {
  const [loading, setLoading] = useState(true);
  const [getUserPost, setGetUserPost] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const queryPost = query(
            collection(db, "Posts"),
            where("userId", "==", user.uid)
          );
          const queryPostSnapshot = await getDocs(queryPost);
          const filteredPost = queryPostSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setGetUserPost(filteredPost);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setGetUserPost([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
        </div>
        <p className="mt-3 text-muted fs-5">Loading Your Posts...</p>
      </div>
    );
  }

  if (getUserPost.length === 0) {
    return (
      <div className="text-center text-muted mt-5">
        <h5>You haven't posted anything yet.</h5>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4 mb-4 bg-light rounded">
        <div className="d-flex justify-content-between align-items-center"></div>
        <hr />
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-3">Your Post</h5>
          <Link to="/create-post" className="m-2 btn btn-success">
            + Create New Post
          </Link>
        </div>

        <div className="row row-cols-1 row-cols-md-2 g-4">
          {getUserPost.map((data) => (
            <div className="col" key={data.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">{data.postTitle}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    By {data.userName || "Unknown"}
                  </h6>
                  <p className="text-muted small">
                    Created :{" "}
                    {data.createdAt?.toDate().toLocaleString() ||
                      "Unknown date"}
                  </p>
                  <p
                    className="card-text text-truncate"
                    style={{ maxWidth: "150px" }}
                  >
                    {data.postText}
                  </p>
                </div>
                <div className="card-footer bg-white border-top-0 text-end">
                  <Link
                    to={`/view-detail/${data.id}`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
