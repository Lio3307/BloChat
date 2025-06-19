import { useState } from "react";
import { auth, db } from "../firebase/config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export const CreateCommentForm = ({id, setRefreshTrigger}) => {
  const [commentText, setCommentText] = useState("");

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      alert("input field cannot be empty!!");
      return;
    }
    try {
      const user = auth.currentUser;
      const commentCollec = collection(db, "Posts", id, "Comment");
      const userDocRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userDocRef);
      let getFullName = "";
      if (userSnap.exists()) {
        getFullName = userSnap.data().fullName;
      }

      await addDoc(commentCollec, {
        userName: getFullName,
        userId : user.uid,
        commentText: commentText,
        postId: id,
        createdAt: serverTimestamp(),
      });
      setCommentText("")
      setRefreshTrigger(prev => !prev)
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <label htmlFor="">Comment</label>
      <input
        value={commentText}
        onChange={(e) => {
          setCommentText(e.target.value);
        }}
        type="text"
      />
      <button onClick={handleAddComment}>Comment</button>
    </>
  );
};
