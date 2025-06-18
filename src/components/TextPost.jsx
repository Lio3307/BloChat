import { useState } from "react";
import { auth, db } from "../firebase/config";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useNavigate, Link } from "react-router-dom";

export const TextPost = () => {
  const [textPost, setTextPost] = useState("");
  const [textPostTitle, setTextPostTitle] = useState("");

  const navigate = useNavigate();

  const addPostHandler = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    const userDocRef = doc(db, "Users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!textPost.trim()) {
      alert("Isi postingan tidak boleh kosong!");
      return;
    }

    let fullName = "";
    if (userDocSnap.exists()) {
      fullName = userDocSnap.data().fullName;
    }

    await addDoc(collection(db, "Posts"), {
      userName: fullName,
      userId: user.uid,
      postText: textPost,
      postTitle: textPostTitle,
      createdAt: serverTimestamp(),
    });

    alert("Post berhasil dikirim!");
    setTextPost("");
    setTextPostTitle("");
    navigate("/home");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg rounded-4 border-0 p-4">
            <h4 className="mb-4 text-center text-primary fw-semibold">
              Buat Postingan Baru
            </h4>
            <form onSubmit={addPostHandler}>
              <div className="mb-3">
                <label htmlFor="postTitle" className="form-label fw-medium">
                  Judul Postingan
                </label>
                <input
                  id="postTitle"
                  type="text"
                  value={textPostTitle}
                  onChange={(e) => setTextPostTitle(e.target.value)}
                  className="form-control rounded-3"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="postText" className="form-label fw-medium">
                  Isi Postingan
                </label>
                <textarea
                  id="postText"
                  value={textPost}
                  onChange={(e) => setTextPost(e.target.value)}
                  className="form-control rounded-3"
                  placeholder="Apa yang ingin kamu bagikan hari ini?"
                  style={{ height: "180px" }}
                  required
                ></textarea>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <Link to="/home" className="btn btn-outline-secondary">
                  ← Kembali
                </Link>
                <button type="submit" className="btn btn-success">
                  Kirim Postingan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
