import { useState } from "react";
import ButtonSpinner from "../../utils/ButtonSpinner";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useData } from "../../contexts/DataContext";
import NotFound from "../../utils/NotFound";
import UserAvatar from "../UserAvatar";
import { FaRegImage } from "react-icons/fa6";
import axios from "axios";
import { IoTrashBinOutline } from "react-icons/io5";

const CreatePost = () => {
  const { user, setUser } = useAuth();
  const { setPosts, setUsers } = useData();

  const [postBody, setPostBody] = useState("");
  const [bodyImage, setBodyImage] = useState("");

  const [postLoading, setPostLoading] = useState(false);
  const [error, setError] = useState(""); // State for error messages
  const [charCount, setCharCount] = useState(0); // State for character count

  const [uploadLoading, setUploadLoading] = useState(false);

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
          bodyImage,
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
        setBodyImage("");
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

  const handleImageUpload = async (file) => {
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "slinkup_post");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/sharfras/image/upload",
        formData
      );

      const image = res.data.secure_url;
      setBodyImage(image);
    } catch (err) {
      console.error("Upload error:", err.message);
      toast.error("Upload failed. Please try again.");
    }
    setUploadLoading(false);
  };

  return (
    <div className="card shadow-sm border-0 mb-4 p-3">
      <div className="d-flex align-items-start">
        <UserAvatar fontSize="50px" width="50px" height="50px" user={user} />

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

              <label htmlFor="bodyimage">
                {/* File input for post image */}
                <input
                  type="file"
                  id="bodyimage"
                  accept="image/*"
                  style={{ display: "none" }}
                  disabled={postLoading}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                />

                {/* Icon for adding image */}
                {uploadLoading ? (
                  <ButtonSpinner />
                ) : (
                  <FaRegImage
                    size={20}
                    className="mt-2"
                    color="#999"
                    cursor="pointer"
                    title="Add image"
                    aria-label="Add image"
                  />
                )}
              </label>

              {bodyImage && (
                <IoTrashBinOutline
                  size={20}
                  color="red"
                  cursor="pointer"
                  onClick={() => setBodyImage("")}
                  title="Remove image"
                  aria-label="Remove image"
                  className="ms-2 mt-2"
                />
              )}

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

          {bodyImage && (
            <div className="mt-3">
              <img
                src={bodyImage}
                alt="post"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
