import { useState, useEffect, createContext, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


const AuthProvider = createContext()

export const AuthContext = ({children}) => {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const[userDetail, setUserDetail] = useState(null)

    const navigate = useNavigate()

    function subscribe(auth, db, setLoading) {
        const result = auth.onAuthStateChanged(async (user) => {
            if(user) {
                try {
                    const docRef = doc(db, "Users", user.uid)
                    const docSnap = await getDoc(docRef)
                    if(docSnap.exists()){
                        setUserDetail(docSnap.data())
                    } else {
                        console.log("User document not found")
                    }
                } catch (err) {
                    console.error(err)
                }
            } else {
                setUserDetail(null)
            }
            setLoading(false)
        })
        return result
    }

    
    async function signUpEmail(db, auth, email, password) {
        if(password.length < 6) {
            alert("Create password at least 6 length!")
            return;
        }
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)
            const currentUser = auth.currentUser
            if(currentUser){
                await setDoc(doc(db, "Users", currentUser.uid), {
                    email: currentUser.email,
                    fullName: fullName
                })
            }
            if(result?.user){
                navigate("/home")
            }
            alert("Register successfully")

        } catch (err) {
            console.log(err)
        }
    }

    async function signInEmail(auth, email, password) {
        if(email.trim() === "" || password.trim() === "" || fullName.trim() === ""){
            alert("input field canno be empty or space!!")
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (err) {
            console.error(err)
        }
    }

    async function signInGoogle(db, auth, GoogleProvider) {
        try {
            const result = await signInWithPopup(auth, GoogleProvider)
            const userDetail = result.user

            const userRef = doc(db, "Users", userDetail.uid)
            const userSnap = await getDoc(userRef)

            if(!userSnap.exists()){
                await setDoc(userRef, {
                    email: userDetail.email,
                    fullName: userDetail.displayName
                })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const value = {
        email,
        password,
        fullName,
        setFullName,
        setEmail,
        setPassword,
        signUpEmail,
        signInEmail,
        signInGoogle,
        userDetail,
        setUserDetail,
        subscribe

    }

    return (
        <>
            <AuthProvider.Provider value={value}>
                {children}
            </AuthProvider.Provider>
        
        </>
    )
}

export const useAuthContext = () => useContext(AuthProvider)