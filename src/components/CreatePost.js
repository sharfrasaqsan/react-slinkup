import { useState } from "react";
import { toast } from "react-toastify";
import { getAuthErrorMessage } from "../utils/authErrors";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/Config";
import { useData } from "../contexts/DataContext";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const { user } = useAuth();
  const { setPosts } = useData();

  const [content, setContent] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const navigate = useNavigate();

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      toast.error("Please enter the post content!");
      return;
    }

    if (!user || !user.uid) {
      toast.error("User is not logged in!");
      return;
    }

    setPostLoading(true);
    try {
      const newPostData = {
        content,
        likes: [],
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        userId: user?.uid,
      };
      const res = await addDoc(collection(db, "posts"), newPostData);
      if (!res) {
        toast.error("Failed to create post! Please try again.");
      }
      setPosts((prev) => [...prev, res]);
      toast.success("Post created successfully!");
      setContent("");
      navigate("/");
    } catch (err) {
      console.log("Error: ", err.message, "Code: ", err.code);
      toast.error(getAuthErrorMessage(err.code));
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handlePostSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          cols="30"
          rows="3"
        />

        <button type="submit" disabled={postLoading}>
          {postLoading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
