import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/Config";
import { toast } from "react-toastify";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Data storage
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  // Data details
  const [user, setUser] = useState({
    username: "",
    email: "",
    profilePic: "",
    bio: "",
    createdAt: "",
    updatedAt: "",
    followersCount: 0,
    followingCount: 0,
    role: "",
  });
  const [post, setPost] = useState({
    title: "",
    content: "",
    image: "",
    createdAt: "",
    updatedAt: "",
    likesCount: 0,
    userId: "",
  });

  // Loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getDocs(collection(db, "users"));
        const data = res.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(data);
      } catch (err) {
        toast.error(`Failed to fetch users data, ${err.message}`);
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
        const data = res.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(data);
      } catch (err) {
        toast.error(`Failed to fetch posts data, ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <DataContext.Provider
      value={{
        users,
        setUsers,
        posts,
        setPosts,
        user,
        setUser,
        post,
        setPost,
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
