import { auth, db } from "../firebase/config";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import { deletePost } from "../utils/deletePost";
import { NavBar } from "../components/NavBar";

export const YourPost = () => {
  const [loading, setLoading] = useState(true);
  const [getUserPost, setGetUserPost] = useState([]);
  const [totalUpload, setTotalUpload] = useState(null);

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
          setTotalUpload(filteredPost.length);
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
        ></div>
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
    <>
      <NavBar />
      <div className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
          <div>
            <h3 className="fw-bold text-dark">📌 Postingan Kamu</h3>
            <span className="text-muted">
              Total Upload:{" "}
              <strong className="text-dark">
                {totalUpload > 0 ? totalUpload : 0}
              </strong>
            </span>
          </div>
          <Link to="/create-post" className="btn btn-success rounded-pill px-4">
            + Buat Postingan
          </Link>
        </div>

        <div className="row g-4">
          {getUserPost.map((data) => (
            <div className="col-12 col-md-6 col-lg-4" key={data.id}>
              <div className="card border-0 shadow-sm rounded-4 h-100 position-relative">
                <div className="position-absolute top-0 end-0 p-2">
                  <div className="dropdown">
                    <button
                      className="btn btn-light btn-sm border rounded-circle"
                      type="button"
                      id={`dropdown-${data.id}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby={`dropdown-${data.id}`}
                    >
                      <li>
                        <Link
                          className="dropdown-item"
                          to={`/edit-post/${data.id}`}
                        >
                          ✏️ Edit
                        </Link>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={(e) => {
                            e.preventDefault();
                            deletePost(data.id);
                          }}
                        >
                          🗑 Hapus
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${
                        data.userName || "U"
                      }&background=random`}
                      alt="avatar"
                      className="rounded-circle me-2 border"
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h6 className="mb-0 fw-semibold">
                        {data.userName || "Unknown"}
                      </h6>
                      <small className="text-muted">
                        {data.createdAt?.toDate().toLocaleString() ||
                          "Unknown date"}
                      </small>
                    </div>
                  </div>

                  <h5 className="card-title text-primary">{data.postTitle}</h5>
                  <p
                    className="card-text text-muted"
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {data.postText}
                  </p>

                  <div className="mt-auto d-flex justify-content-between align-items-center pt-3 border-top">
                    <Link
                      to={`/view-detail/${data.id}`}
                      className="btn btn-sm btn-outline-primary rounded-pill px-3"
                    >
                      Lihat Detail
                    </Link>
                    <span className="badge bg-light text-secondary border">
                      {data.postText.trim().split(/\s+/).length} kata
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {getUserPost.length === 0 && (
            <div className="text-center mt-5 text-muted">
              <p className="fs-5">Kamu belum memiliki postingan.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
