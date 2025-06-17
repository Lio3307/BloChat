import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useEffect, useState } from "react";

export const PostList = () => {
  const [loading, setLoading] = useState(true);
  const [allPost, setAllPost] = useState(null);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const queryPostSnapshot = await getDocs(collection(db, "Posts"));
        if (queryPostSnapshot) {
          const getAllPost = queryPostSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAllPost(getAllPost);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getAllPosts();
  }, []);

  return (
    <>
      {loading ? (
        <div>
          <h3>Loading...</h3>
        </div>
      ) : (
        console.log(allPost)
        // allPost.map((data) => (
        //   <div className="card">
        //     <div className="card-header">{data.}</div>
        //     <div className="card-body">
        //       <h5 className="card-title">Special title treatment</h5>
        //       <p className="card-text">
        //         With supporting text below as a natural lead-in to additional
        //         content.
        //       </p>
        //       <a href="#" className="btn btn-primary">
        //         Go somewhere
        //       </a>
        //     </div>
        //   </div>
        // ))
      )}
    </>
  );
};
