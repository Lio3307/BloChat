import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [showFullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  useEffect(() => {
    const fetchDataUser = async () => {
      const user = auth.currentUser;
      try {
        if (user) {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFullName(docSnap.data().fullName);
          }
        } else {
            alert("You cannot access this page, login on register first!!")
            navigate("/register")
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataUser();
  }, []);

  const handleLogOut = async (e) => {
    e.preventDefault()

    try {
        await signOut(auth)
        navigate("/register")
    } catch (err) {
        console.error(err)
    }
  }

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (<>
        <h3>Welcome {showFullName}</h3>
        <button className="btn btn-danger" onClick={handleLogOut}>LogOut</button>
        </>
      )}
    </>
  );
};
