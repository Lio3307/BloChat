import { useParams, Link } from "react-router-dom";
import { db, auth } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export const ViewDetail = () => {
  const { id } = useParams();
  const [getDataById, setGetDataById] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isIdUserMatch, setIsIdUserMatch] = useState(null);

  import

  useEffect(() => {
    const getUserIdIsMatch = async () => {
      try {
        const user = auth.currentUser;
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
          setGetDataById({ id: docSnap.id, ...docSnap.data() });
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

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!getDataById) return <p className="text-danger">Post not found!</p>;

  return (
    <div className="container my-5">
      <div className="mb-4">
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          ← Back to Home
        </Link>
      </div>

      <div className="card shadow rounded-4 p-4 border-0">
        <div className="d-flex align-items-center mb-4">
          <img
            src={`https://ui-avatars.com/api/?name=${
              getDataById.userName || "U"
            }&background=random`}
            alt="avatar"
            className="rounded-circle me-3"
            style={{ width: "60px", height: "60px", objectFit: "cover" }}
          />
          <div>
            <h5 className="fw-bold mb-0">
              {getDataById.userName || "Unknown Author"}
            </h5>
            <span className="badge bg-light text-muted">
              {getDataById.createdAt?.toDate().toLocaleString() ||
                "Unknown Date"}
            </span>
          </div>
        </div>

        <h3 className="text-primary fw-semibold mb-3">
          {getDataById.postTitle}
        </h3>

        <hr />

        <p className="fs-5 lh-lg">{getDataById.postText}</p>

        {isIdUserMatch && (
          <div className="mt-4 text-end">
            <button className="btn btn-outline-danger btn-sm">
              🗑 Delete Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
