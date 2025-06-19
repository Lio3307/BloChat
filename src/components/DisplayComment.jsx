import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";

export const DisplayComment = ({id, refreshTrigger}) => {

  const [getCommentSection, setGetCommentSection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalComment, setTotalComment] = useState(null)


  useEffect(() => {
    const getComment = async () => {
      try {
        const q = query(
          collection(db, "Posts", id, "Comment"),
          where("postId", "==", id)
        );
        const commentRef = await getDocs(q);
        if (commentRef) {
          const comments = commentRef.docs.map((doc) => ({
            commentId: doc.id,
            ...doc.data(),
          }));
          setGetCommentSection(comments);
          setTotalComment(comments.length)
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getComment();
  }, [id, refreshTrigger]);
  return (
    <>
      <div className="mt-4">
        <h5 className="fw-bold mb-3">{totalComment} Komentar</h5>

        {loading ? (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : getCommentSection.length === 0 ? (
          <p className="text-muted">Belum ada komentar.</p>
        ) : (
          <ul className="list-group">
            {getCommentSection.map((comment) => (
              <li
                key={comment.commentId}
                className="list-group-item border-0 rounded-3 shadow-sm mb-3"
              >
                <div className="d-flex align-items-start">
                  <img
                    src={`https://ui-avatars.com/api/?name=${
                      comment.userName || "U"
                    }&background=random`}
                    alt="avatar"
                    className="rounded-circle me-3"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-1 fw-semibold">
                        {comment.userName || "Anonymous"}
                      </h6>
                      <small className="text-muted ms-3">
                        {comment.createdAt?.toDate().toLocaleString() ||
                          "Baru saja"}
                      </small>
                    </div>
                    <p
                      className="mb-0 text-secondary"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {comment.commentText}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
