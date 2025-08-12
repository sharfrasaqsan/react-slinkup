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
  const [comments, setComments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Get all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getDocs(collection(db, "users"));
        const resData = res.docs?.map((doc) => ({
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

  // Get all posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getDocs(collection(db, "posts"));
        const resData = res.docs?.map((doc) => ({
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

  // Get all likes
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await getDocs(collection(db, "likes"));
        const resData = res.docs?.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLikes(resData);
      } catch (err) {
        toast.error(getAuthErrorMessage(err.code));
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, []);

  // Get all comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getDocs(collection(db, "comments"));
        const resData = res.docs?.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(resData);
      } catch (err) {
        toast.error(getAuthErrorMessage(err.code));
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  // Get all notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getDocs(collection(db, "notifications"));
        const resData = res.docs?.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(resData);
      } catch (err) {
        toast.error(getAuthErrorMessage(err.code));
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Handle likes function

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
