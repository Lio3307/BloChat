import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export const deletePost = async (postId) => {
  const confirmDelete = confirm("Are You Sure Want To Delete This Post?");
  if (!confirmDelete) return;
  try {
    const commentColection = collection(db, "Posts", postId, "Comment")
    const commentSnap = await getDocs(commentColection)
    await commentSnap.docs.map((docSnap) => (
      deleteDoc(doc(db, "Posts", postId, "Comment", docSnap.id))
    ))
    await deleteDoc(doc(db, "Posts", postId))
    alert("Success Delete The Post!!");
  } catch (err) {
    console.error(err);
    alert("Error Deleting Post!!" + err);
  }
};
