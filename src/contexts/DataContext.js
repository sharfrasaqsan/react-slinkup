import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/Config";
import { toast } from "react-toastify";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Data storage
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Function to handle error states
  const handleError = (err) => {
    toast.error(`Error: ${err.message}`);
    setLoading(false);
  };

  // Reusable function to fetch data from any collection
  const fetchData = async (collectionName, setterFunction) => {
    try {
      const res = await getDocs(collection(db, collectionName));
      const resData = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setterFunction(resData);
    } catch (err) {
      handleError(err);
    }
  };

  // Fetch all necessary data concurrently when the component mounts
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchData("users", setUsers),
          fetchData("posts", setPosts),
          fetchData("likes", setLikes),
          fetchData("comments", setComments),
          fetchData("notifications", setNotifications),
        ]);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        users,
        setUsers,
        posts,
        setPosts,
        likes,
        setLikes,
        comments,
        setComments,
        notifications,
        setNotifications,
        loading,
        setLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
