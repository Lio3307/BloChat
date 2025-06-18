import { collection, getDocs} from "firebase/firestore";
import { db } from "../firebase/config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <div className="list-group">
      {allPost.map((data) => (
        <div
          key={data.id}
          className="list-group-item bg-white rounded-3 shadow-sm mb-3 p-3"
        >
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
            <div className="d-flex align-items-center mb-2 mb-sm-0">
              <img
                src={`https://ui-avatars.com/api/?name=${
                  data.userName || "U"
                }&background=random`}
                alt="avatar"
                className="rounded-circle me-2"
                style={{ width: "40px", height: "40px" }}
              />
              <div>
                <h6 className="mb-0">{data.userName || "Unknown"}</h6>
                <small className="text-muted">
                  {data.createdAt?.toDate().toLocaleString() || "Unknown date"}
                </small>
              </div>
            </div>
          </div>

          <h5 className="mb-1 text-primary">{data.postTitle}</h5>
          <p className="mb-2 text-secondary" style={{ whiteSpace: "pre-wrap" }}>
            {data.postText.length > 300
              ? data.postText.slice(0, 300) + "…"
              : data.postText}
          </p>

          <div className="text-end">
            <Link
              to={`/view-detail/${data.id}`}
              className="btn btn-sm btn-outline-primary"
            >
              Read More
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
