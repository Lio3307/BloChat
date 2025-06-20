import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const PostList = () => {
  const [loading, setLoading] = useState(true);
  const [allPost, setAllPost] = useState([]);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const postCollection = collection(db, "Posts");
        const queryPostSnapshot = await getDocs(postCollection);
        if (queryPostSnapshot) {
          const getAllPost = queryPostSnapshot.docs.map((doc) => ({
            postId: doc.id,
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
    <div className="row">
      {allPost.map((data) => (
        <div className="col-12 col-md-6 col-lg-4 mb-4" key={data.postId}>
          <div
            className="card h-100 border-0 shadow-sm rounded-4"
            style={{ backgroundColor: "#fdfdfd" }} // warna putih sedikit berbeda dari default
          >
            <div className="card-body d-flex flex-column">
              {/* Header: Avatar & User Info */}
              <div className="d-flex align-items-center mb-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${
                    data.userName || "U"
                  }&background=random`}
                  alt="avatar"
                  className="rounded-circle me-3 border border-2 border-light shadow-sm"
                  style={{ width: "48px", height: "48px", objectFit: "cover" }}
                />
                <div>
                  <h6 className="mb-0 fw-semibold text-dark">
                    {data.userName || "Unknown"}
                  </h6>
                  <small className="text-muted">
                    {data.createdAt?.toDate().toLocaleString() ||
                      "Unknown date"}
                  </small>
                </div>
              </div>

              <h5 className="fw-bold text-primary mb-2">{data.postTitle}</h5>

              <p
                className="text-muted mb-3"
                style={{
                  whiteSpace: "pre-wrap",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                  flexGrow: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {data.postText}
              </p>

              <div className="text-end mt-auto pt-3 border-top">
                <Link
                  to={`/view-detail/${data.postId}`}
                  className="btn btn-outline-primary btn-sm rounded-pill px-3"
                >
                  Baca Selengkapnya
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
