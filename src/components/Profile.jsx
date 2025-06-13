import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState(null);

  const getUserDetails = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetail(docSnap.data());
      } else {
        alert("User Not Login!!!");
      }
    });
  };

  useEffect(() => {
    try {
      getUserDetails();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading && <h4 className="text-center m-4">Loading...</h4>}

      {userDetail ? (
        <div className="container">
          <h2>{userDetail.fullName}</h2>
          <h2>{userDetail.email}</h2>
        </div>
      ) : (
        <p className="text-center text-danger">You are not Logged In!!</p>
        
      )}
    </>
  );
};
