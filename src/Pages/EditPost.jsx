import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { updatePost } from "../utils/updatePost";

export const EditPost = () => {
  const [newText, setNewText] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = doc(db, "Posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNewText(data.postText);
          setNewTitle(data.postTitle);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
      <>
        <label>Title</label>
        <br />
        <input
          value={newTitle}
          onChange={(e) => {
            setNewTitle(e.target.value);
          }}
          type="text"
        />

        <label>Text</label>
        <br />
        <textarea
          value={newText}
          onChange={(e) => {
            setNewText(e.target.value);
          }}
        />
        <button onClick={updateHandler}>Update</button>
      </>;
    };
    getData();
  }, []);

  const updateHandler = async (e) => {
    e.preventDefault();
    if (!newText.trim() || !newTitle.trim()) {
      alert("Input Field Cannot Be Empty!!");
      return;
    }
    updatePost(id, {
      postText: newText,
      postTitle: newTitle,
    });
    navigate("/home");
  };

  return (
    <>
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-muted">Loading data...</p>
        </div>
      ) : (
        <div className="container my-5">
          <div className="card shadow-sm rounded-4 border-0 p-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-primary m-0">Edit Postingan</h4>
              <Link
                to="/home"
                className="btn btn-outline-secondary btn-sm rounded-pill px-3"
              >
                ✖ Cancel
              </Link>
            </div>

            <div className="mb-3">
              <label htmlFor="editTitle" className="form-label fw-semibold">
                Judul Postingan
              </label>
              <input
                id="editTitle"
                type="text"
                className="form-control"
                placeholder="Masukkan judul..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="editText" className="form-label fw-semibold">
                Isi Postingan
              </label>
              <textarea
                id="editText"
                className="form-control"
                placeholder="Tulis isi postingan kamu di sini..."
                style={{ height: "180px" }}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="text-end">
              <button
                onClick={updateHandler}
                className="btn btn-success rounded-pill px-4"
              >
                ✅ Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
