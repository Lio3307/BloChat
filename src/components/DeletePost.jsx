import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

export const DeletePost = async (postId) => {
    const confirmDelete = confirm("Are You Sure Want To Delete This Post?")
    if(!confirmDelete) return;
    try {
        await deleteDoc(doc(db, "Posts", postId))
        alert("Success Delete The Post!!")
    } catch (err) {
        console.error(err)
        alert("Error Deleting Post!!" + err)
    }
}