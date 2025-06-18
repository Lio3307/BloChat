import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/config"

export const updatePost = async (id, updatedData) => {
    try {
        const docRef = doc(db, "Posts", id)
        await updateDoc(docRef, updatedData)
        alert("Data Telah Berhasil Di Perbarui")
    } catch (err) {
        console.error(err)
    }
}