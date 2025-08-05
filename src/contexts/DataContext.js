import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/Config";
import { toast } from "react-toastify";
import { getAuthErrorMessage } from "../utils/authErrors";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Data storage
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getDocs(collection(db, "users"));
        const resData = res.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(resData);
      } catch (err) {
        toast.error(getAuthErrorMessage(err.code));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getDocs(collection(db, "posts"));
        const resData = res.docs.map((doc) => ({
          id: doc.id,
          likes: doc.data().likes || [],
          ...doc.data(),
        }));
        setPosts(resData);
      } catch (err) {
        toast.error(getAuthErrorMessage(err.code));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await getDocs(collection(db, "likes"));
        const resData = res.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLikes(resData);
      } catch (err) {
        toast.error(getAuthErrorMessage(err.code));
      }
    };

    fetchLikes();
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
