import { useState, useEffect } from "react";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [userDetail, setUserDetail] = useState(null);

  const navigate = useNavigate();

  //   const handleLogout = (e) => {
  //     e.preventDefault();

  //     alert("Log Out Success!!");
  //     navigate("/");
  //   };

  //With Non Unscubscribe
  //   useEffect(() => {
  //     const getUserDetails = async () => {
  //       try {
  //         auth.onAuthStateChanged(async (user) => {
  //           console.log(user);
  //           const docRef = doc(db, "Users", user.uid);
  //           const docSnap = await getDoc(docRef);
  //           if (docSnap.exists()) {
  //             setUserDetail(docSnap.data());
  //           } else {
  //             alert("User Not Login!!!");
  //           }
  //         });
  //       } catch (err) {
  //         console.error(err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     getUserDetails();
  //   }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetail(docSnap.data());
          } else {
            console.log("User document not found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserDetail(null); // explicitly set to null
      }

      // ✅ only set loading false after this block runs
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : userDetail ? (
        <div className="container d-flex justify-content-center mt-5">
          <div
            className="card shadow-lg p-4"
            style={{ maxWidth: "500px", width: "100%" }}
          >
            <h3 className="text-center mb-3 text-primary">User Profile</h3>
            <div className="mb-2">
              <strong>Name:</strong>
              <p className="form-control-plaintext">{userDetail.fullName}</p>
            </div>
            <div className="mb-2">
              <strong>Email:</strong>
              <p className="form-control-plaintext">{userDetail.email}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-danger mt-5">
          <h5>You are not Logged In!</h5>
        </div>
      )}
    </>
  );
};
