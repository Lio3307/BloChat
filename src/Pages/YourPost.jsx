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
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2">Loading your posts...</p>
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
    <div className="container mt-4">
      <h3 className="mb-4 text-center text-primary">Your Posts</h3>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {getUserPost.map((post) => (
          <div className="col" key={post.id}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title">{post.postTitle}</h5>
                <p className="card-text text-muted">{post.postText}</p>
              </div>
                <small className="text-muted">
                  Created : {post.createdAt?.toDate().toLocaleString()}
                </small>
              <div className="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  By: {post.userName || "Unknown"}
                </small>
                <Link
                  to={`/view-detail/${post.id}`}
                  className="btn btn-sm btn-outline-primary"
                >
                  View Detail
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
