import { useState } from "react";
import { auth, db } from "../firebase/config";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export const TextPost = () => {
  const [textPost, setTextPost] = useState("");
  const [textPostTitle, setTextPostTitle] = useState("");

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

    alert("Posts Success!!");
    fullName = "";
    setTextPost("")
    setTextPostTitle("")
  };

  return (
    <>
      <div className="form-floating">
        <textarea
          value={textPost}
          onChange={(e) => {
            setTextPost(e.target.value);
          }}
          className="form-control"
          placeholder="Leave a comment here"
          id="floatingTextarea2"
          style="height: 100px"
        />
        <label for="floatingTextarea2">Comments</label>

          <label>Title</label><br />
        <div className="input-group mb-3">
          <input
          value={textPostTitle}
          onChange={(e) => {
            setTextPostTitle(e.target.value)
          }}
            type="text"
            className="form-control"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
          />
        </div>

        <button onClick={addPostHandler} className="btn btn-success">
          Posts
        </button>
      </div>
    </>
  );
};
