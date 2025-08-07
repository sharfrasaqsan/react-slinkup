import ButtonSpinner from "../utils/ButtonSpinner";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/Config";
import { useData } from "../contexts/DataContext";
import LoadingSpinner from "../utils/LoadingSpinner";
import NotFound from "../utils/NotFound";

const CreatePost = () => {
  const { user, setUser } = useAuth();
  const { setPosts, setUsers, loading } = useData();

  const [postBody, setPostBody] = useState("");
  const [postLoading, setPostLoading] = useState(false);

  if (!user) return <NotFound text={"No user found! Please log in first."} />;

  if (loading) {
    return <LoadingSpinner />;
  }

  const handlePost = async (e) => {
    e.preventDefault();

    setPostLoading(true);
    if (!postBody) {
      toast.error("No post body. Please write something.");
      return;
    }

    try {
      // Check if user is logged in
      if (user) {
        // Create a new post
        const newPost = {
          body: postBody,
          userId: user.id,
          likes: [],
          createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        };
        const res = await addDoc(collection(db, "posts"), newPost);
        setPosts((prev) => [...prev, newPost]);
        setPostBody("");
        toast.success("Post created successfully.");

        // Update user's posts
        const newUserPost = [user.userPosts || [].length]
          ? [...user.userPosts, res.id]
          : [res.id];

        await updateDoc(doc(db, "users", user.id), { userPosts: newUserPost });
        setUser((prev) => ({ ...prev, userPosts: newUserPost }));
        setUsers((prev) =>
          prev.map((i) =>
            i.id === user.id ? { ...i, userPosts: newUserPost } : i
          )
        );
      } else {
        toast.error("You are not logged in. Please log in to create a post.");
      }
    } catch (err) {
      toast.error(err.message);
    }
    setPostLoading(false);
  };

  return (
    <div>
      <form onSubmit={handlePost}>
        <textarea
          name="body"
          id="body"
          cols="60"
          rows="2"
          required
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
        />
        <button type="submit">
          {postLoading ? (
            <>
              Posting... <ButtonSpinner />
            </>
          ) : (
            "Post"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
