import { useState } from "react";
import { auth, db } from "../firebase/config";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export const CreateCommentForm = ({ id, setRefreshTrigger }) => {
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      alert("input field cannot be empty!!");
      return;
    }
    setSendingComment(true);
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
        userId: user.uid,
        commentText: commentText,
        postId: id,
        createdAt: serverTimestamp(),
      });
      setCommentText("");
      setRefreshTrigger((prev) => !prev);
    } catch (err) {
      console.error(err);
    } finally {
      setSendingComment(false);
    }
  };

  return (
    <form onSubmit={handleAddComment} className="mb-4">
      <div className="mb-3">
        <label htmlFor="commentInput" className="form-label fw-semibold">
          Tambahkan Komentar
        </label>
        <textarea
          id="commentInput"
          className="form-control"
          placeholder="Tulis komentarmu di sini..."
          rows="3"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={sendingComment}
          required
        ></textarea>
      </div>
      <div className="text-end">
        <button
          type="submit"
          className="btn btn-primary rounded-pill px-4"
          disabled={sendingComment}
        >
          {sendingComment ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Mengirim...
            </>
          ) : (
            "Komentar"
          )}
        </button>
      </div>
    </form>
  );
};
