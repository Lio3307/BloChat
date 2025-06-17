import { useState } from "react";
import { auth, db } from "../firebase/config";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

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
      <div className="card shadow p-4">
        <h4 className="mb-4 text-center">Buat Postingan Baru</h4>
        <form onSubmit={addPostHandler}>
          <div className="mb-3">
            <label htmlFor="postTitle" className="form-label">
              Judul
            </label>
            <input
              id="postTitle"
              value={textPostTitle}
              onChange={(e) => setTextPostTitle(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Tulis judul postingan"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="postText" className="form-label">
              Isi Postingan
            </label>
            <textarea
              id="postText"
              value={textPost}
              onChange={(e) => setTextPost(e.target.value)}
              className="form-control"
              placeholder="Apa yang kamu pikirkan?"
              style={{ height: "150px" }}
              required
            ></textarea>
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-success">
              Kirim Postingan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
