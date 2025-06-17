import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export const ViewDetail = () => {
  const { id } = useParams();
  const [getDataById, setGetDataById] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    getPostById();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!getDataById) return <p className="text-danger">Post not found!</p>;

  return (
    <div className="container my-5">
      <div className="mb-3">
        <Link to="/" className="btn btn-sm btn-outline-secondary">
          ← Back to Home
        </Link>
      </div>

      <div className="card shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-primary">{getDataById.postTitle}</h2>
          <p className="card-subtitle mb-2 text-muted">
            {getDataById.userName || "Unknown Author"}
            {getDataById.createdAt?.toDate().toLocaleString() || "Unknown Date"}
          </p>
          <hr />
          <p className="card-text fs-5">{getDataById.postText}</p>
        </div>
      </div>
    </div>
  );
};
