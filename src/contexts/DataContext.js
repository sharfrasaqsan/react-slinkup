import { createContext, useContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/Config";
import { toast } from "react-toastify";
import { getAuthErrorMessage } from "../utils/authErrors";
import { useAuth } from "./AuthContext";
import { format } from "date-fns";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  // Data storage
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
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
  const handleLikes = async (postId) => {
    try {
      // Check if user is logged in
      if (!user) {
        toast.error("You must be logged in to like a post.");
        return;
      }

      // Find the current post
      const currentPost = posts.find((post) => post.id === postId);
      if (!currentPost) return;

      // Check if user has already liked the post
      const alreadyLiked = (currentPost.likes || [])?.includes(user.id);

      // Add or remove like
      const updatedLikes = alreadyLiked
        ? currentPost.likes?.filter((userId) => userId !== user.id)
        : [...(currentPost.likes || []), user.id];

      await updateDoc(doc(db, "posts", postId), { likes: updatedLikes });

      // Update post local UI
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: updatedLikes } : post
        )
      );

      // Add notification if user has not already liked the post and the post is not by the user
      if (!alreadyLiked && currentPost.userId !== user.id) {
        const newNotification = {
          postId,
          recieverId: currentPost.userId,
          senderId: user.id,
          type: "like",
          isRead: false,
          message: `${user.username} liked your post.`,
          createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        };
        const res = await addDoc(
          collection(db, "notifications"),
          newNotification
        );
        setNotifications((prev) => [
          ...prev,
          { id: res.id, ...newNotification },
        ]);
      }

      // Add or remove like used only firestore. not local states.
      // so it should be used query to get the updated data from firestore
      // Check if user has already liked the post
      if (!alreadyLiked) {
        // Add like to likes collection
        const newLike = {
          postId,
          userId: user.id,
          createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        };
        await addDoc(collection(db, "likes"), newLike);
      } else {
        // Find the like document
        const likeDocs = await getDocs(
          query(
            collection(db, "likes"),
            where("postId", "==", postId),
            where("userId", "==", user.id)
          )
        );

        // Delete like
        likeDocs.forEach(
          async (singleDoc) => await deleteDoc(doc(db, "likes", singleDoc.id))
        );
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <DataContext.Provider
      value={{
        users,
        setUsers,
        posts,
        setPosts,
        notifications,
        setNotifications,
        handleLikes,
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
