import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { db } from "../firebase/config"
import { updatePost } from "../utils/updatePost"

export const EditPost = () => {
    const [newText, setNewText] = useState("")
    const [newTitle, setNewTitle] = useState("")

    const {id} = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        const getData = async () => {
            try {
                const docRef = doc(db, "Posts", id)
                const docSnap = await getDoc(docRef)
                if(docSnap.exists()){
                    const data = docSnap.data()
                    setNewText(data.postText)
                    setNewTitle(data.postTitle)
                } 
            } catch (err) {
                console.error(err)
            }
        }
        getData()
    }, [])

    const updateHandler = async (e) => {
        e.preventDefault()
        if(!newText.trim() || !newTitle.trim()){
            alert("Input Field Cannot Be Empty!!")
            return;
        }
        updatePost(id, {
            postText: newText,
            postTitle: newTitle
        })
        navigate("/home")
    }

    return (
        <>
            <label>Title</label><br />
            <input
            value={newTitle}
            onChange={(e) => {
                setNewTitle(e.target.value)
            }}
            type="text" />

            <label>Text</label><br />
            <textarea
            value={newText}
            onChange={(e) => {
                setNewText(e.target.value)
            }}
             />
             <button onClick={updateHandler}>Update</button>
        </>
    )
}