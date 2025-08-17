import { useState, useRef } from "react";
import ButtonSpinner from "../../utils/ButtonSpinner";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";

const CreatePost = () => {
  const { user, setUser } = useAuth();
  const { setPosts, setUsers } = useData();

  const [postBody, setPostBody] = useState("");
  const [postLoading, setPostLoading] = useState(false);
  const [error, setError] = useState(""); // State for error messages
  const [charCount, setCharCount] = useState(0); // State for character count

  if (!user) return <NotFound text={"No user found! Please log in first."} />;

  // Max characters for the post
  const MAX_CHARACTERS = 280;

  const handlePost = async (e) => {
    e.preventDefault();
    setError(""); // Clear error message on each submit attempt

    if (!postBody.trim()) {
      setError("Post cannot be empty!"); // Set error if post body is empty
      return;
    }

    setPostLoading(true);
    try {
      if (user) {
        const newPost = {
          body: postBody.trim(),
          userId: user.id,
          likes: [],
          comments: [],
          isUpdated: false,
          createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        };
        const res = await addDoc(collection(db, "posts"), newPost);
        setPosts((prev) => [...prev, { id: res.id, ...newPost }]);
        setPostBody("");
        setCharCount(0);
        toast.success("Post created successfully.");

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
      toast.error("There was an error creating the post. Please try again.");
      console.error(err);
    }
    setPostLoading(false);
  };

  // Handle character count update
  const handleTextChange = (e) => {
    const text = e.target.value;
    setPostBody(text);
    setCharCount(text.length);
  };

  return (
    <div className="card shadow-sm border-0 mb-4 p-3">
      <div className="d-flex align-items-start">
        {/* User Avatar */}
        <img
          src={user?.avatar || "https://via.placeholder.com/40"}
          alt="User Avatar"
          className="rounded-circle me-3"
          style={{ width: "40px", height: "40px" }}
        />

        <div className="w-100">
          <form onSubmit={handlePost}>
            <div className="mb-3">
              {/* Textarea for post body */}
              <textarea
                name="body"
                id="body"
                rows="2"
                value={postBody}
                onChange={handleTextChange}
                placeholder={`What's on your mind ${user.username}?`}
                disabled={postLoading}
                className={`form-control shadow-sm ${
                  error ? "is-invalid" : ""
                }`}
                style={{
                  resize: "none",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              />

              {/* Error message */}
              {error && <div className="invalid-feedback">{error}</div>}
            </div>

            {/* Character counter */}
            <div
              className="text-right"
              style={{ fontSize: "14px", color: "#999" }}
            >
              {charCount} / {MAX_CHARACTERS} characters
            </div>

            {charCount > MAX_CHARACTERS && (
              <div className="text-danger">Character limit exceeded!</div>
            )}

            <button
              type="submit"
              disabled={postLoading || charCount > MAX_CHARACTERS}
              className="btn btn-primary w-100 shadow-sm mt-3"
            >
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
      </div>
    </div>
  );
};

export default CreatePost;
