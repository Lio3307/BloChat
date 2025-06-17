import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useEffect, useState } from "react";

export const PostList = () => {
  const [loading, setLoading] = useState(true);
  const [allPost, setAllPost] = useState([]);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const queryPostSnapshot = await getDocs(collection(db, "Posts"));
        if (queryPostSnapshot) {
          const getAllPost = queryPostSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAllPost(getAllPost);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getAllPosts();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-secondary" role="status" />
        <p className="mt-2">Loading posts...</p>
      </div>
    );
  }

  if (allPost.length === 0) {
    return <p className="text-center text-muted">No posts available yet.</p>;
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 g-4">
      {allPost.map((data) => (
        <div className="col" key={data.id}>
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">{data.postTitle}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                By {data.userName || "Unknown"}
              </h6>
              <p className="card-text">{data.postText}</p>
            </div>
            <div className="card-footer bg-white border-top-0 text-end">
              <button className="btn btn-sm btn-outline-primary">
                Read More
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
