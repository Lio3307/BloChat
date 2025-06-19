import { useParams, Link, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { deletePost } from "../utils/deletePost";
import { CreateCommentForm } from "../components/CreateCommentForm";
import { DisplayComment } from "../components/DisplayComment";

export const ViewDetail = () => {
  const { id } = useParams();
  const [getData, setGetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isIdUserMatch, setIsIdUserMatch] = useState(null);

  const [refreshTrigger, setRefreshTrigger] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    const getUserIdIsMatch = async () => {
      try {
        const user = await auth.currentUser;
        const docRef = doc(db, "Posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsIdUserMatch(data.userId === user.uid);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const getPostById = async () => {
      try {
        const docRef = doc(db, "Posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGetData({ postId: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getUserIdIsMatch();
    getPostById();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-muted">Memuat data postingan...</p>
        </div>
      </div>
    );
  }

  if (!getData) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <h5 className="text-danger">⚠️ Postingan tidak ditemukan ⚠️</h5>
          <p className="text-muted">Mungkin sudah dihapus</p>
          <Link to="/home" className="btn btn-outline-secondary mt-3">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 position-relative">
      <div className="mb-4">
        <Link to="/home" className="btn btn-secondary btn-sm rounded-pill px-3">
          ← Back to Home
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-4 p-4 border position-relative">
        {isIdUserMatch && (
          <div className="position-absolute top-0 end-0 p-3">
            <div className="dropdown">
              <button
                className="btn btn-light border rounded-circle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-three-dots-vertical"></i>
              </button>

              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuButton"
              >
                <li>
                  <Link className="dropdown-item" to={`/edit-post/${id}`}>
                    ✏️ Edit
                  </Link>
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={(e) => {
                      e.preventDefault();
                      deletePost(id);
                      navigate("/home");
                    }}
                  >
                    🗑 Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="d-flex align-items-center mb-4">
          <img
            src={`https://ui-avatars.com/api/?name=${
              getData.userName || "U"
            }&background=random`}
            alt="avatar"
            className="rounded-circle me-3 border shadow-sm"
            style={{ width: "55px", height: "55px", objectFit: "cover" }}
          />
          <div>
            <h5 className="fw-semibold mb-1">
              {getData.userName || "Unknown Author"}
            </h5>
            <small className="text-muted">
              {getData.createdAt?.toDate().toLocaleString() || "Unknown Date"}
            </small>
          </div>
        </div>

        {/* Future media area */}
        {/* <img src={getData.imageUrl} className="img-fluid rounded mb-3" alt="Post media" /> */}

        <h4 className="fw-bold text-primary mb-3">{getData.postTitle}</h4>

        <p className="text-secondary fs-5" style={{ whiteSpace: "pre-wrap" }}>
          {getData.postText}
        </p>

        <h5>Comment Section</h5>
        <CreateCommentForm id={id} setRefreshTrigger={setRefreshTrigger} />

        <h5>Comment List</h5>
        <DisplayComment id={id} refreshTrigger={refreshTrigger}/>
      </div>
    </div>
  );
};
