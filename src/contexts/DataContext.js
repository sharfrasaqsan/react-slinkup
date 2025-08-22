import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase/Config";
import { toast } from "react-toastify";
import { orderBy } from "lodash";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Data storage
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Pagination
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Function to handle error states
  const handleError = (err) => {
    toast.error(`Error: ${err.message}`);
    setLoading(false);
  };

  // Initial fetch (first 10 posts)
  const fetchInitialPosts = async () => {
    try {
      setLoading(true);
      const res = await getDocs(
        query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(10))
      );
      const resData = res.docs?.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(resData);
      setLastDoc(res.docs[res.docs.length - 1]);
      setHasMore(res.docs.length === 10);
    } catch (err) {
      handleError(err);
    }
  };

  const fetchMorePosts = async () => {
    if (!lastDoc) return;

    try {
      const res = await getDocs(
        query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(10)
        )
      );
      const resData = res.docs?.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts((prev) => [...prev, ...resData]);
      setLastDoc(res.docs[res.docs.length - 1] || null);
      setHasMore(res.docs.length === 10);
    } catch (err) {
      handleError(err);
    }
  };

  // Load first batch on mount
  useEffect(() => {
    fetchInitialPosts();
  }, []);

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

  // Search
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput) return;
    setLoading(true);
    setSearch(searchInput);
    setLoading(false);
  };

  useEffect(() => {
    if (searchInput.trim() === "") {
      setSearch("");
    }
  }, [searchInput]);

  return (
    <DataContext.Provider
      value={{
        users,
        setUsers,
        posts,
        setPosts,
        hasMore,
        fetchMorePosts,
        likes,
        setLikes,
        comments,
        setComments,
        notifications,
        setNotifications,
        loading,
        setLoading,
        search,
        setSearch,
        handleSearch,
        searchInput,
        setSearchInput,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
