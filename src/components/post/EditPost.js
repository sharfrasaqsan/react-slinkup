import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ButtonSpinner from "../../utils/ButtonSpinner";
import { format } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";

const EditPost = ({ showEditPost, handleCloseEditPost, post, setPosts }) => {
  const [editPostBody, setEditPostBody] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const MAX_CHARACTERS = 280;

  useEffect(() => {
    if (showEditPost) {
      setEditPostBody(post.body);
      setCharCount(post.body.length);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showEditPost, post.body]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleCloseEditPost();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleCloseEditPost]);

  const handleUpdatePost = async (postId) => {
    if (!editPostBody.trim()) {
      toast.error("Post content is required");
      return;
    }

    setUpdateLoading(true);
    try {
      const updatePost = {
        body: editPostBody.trim(),
        isUpdated: true,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };
      await updateDoc(doc(db, "posts", postId), updatePost);
      setPosts((prev) =>
        prev?.map((post) =>
          post.id === postId ? { ...post, ...updatePost } : post
        )
      );
      toast.success("Post updated successfully.");
    } catch (err) {
      toast.error("Failed to update post");
    }
    setUpdateLoading(false);
  };

  const handleCharCount = (e) => {
    const content = e.target.value;
    setEditPostBody(content);
    setCharCount(content.length);
  };

  const handleClear = () => {
    setEditPostBody("");
    setCharCount(0);
  };

  if (!showEditPost) return null;

  return (
    <div
      className={`modal fade ${showEditPost ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
        transition: "opacity 0.3s ease",
      }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content border-0 rounded-3">
          <div className="modal-header">
            <h5 className="modal-title">Edit Post</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleCloseEditPost}
            ></button>
          </div>

          <div className="modal-body">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePost(post.id);
                handleCloseEditPost();
              }}
            >
              <div className="mb-3">
                <label htmlFor="postBody" className="form-label">
                  Post Body
                </label>

                <textarea
                  className="form-control shadow-sm rounded-3"
                  id="postBody"
                  rows="4"
                  value={editPostBody}
                  onChange={handleCharCount}
                  required
                  autoFocus
                  placeholder="Write your post here..."
                />

                <small className="text-muted d-block mt-2">
                  {charCount}/{MAX_CHARACTERS} characters
                </small>

                {charCount > MAX_CHARACTERS && (
                  <div className="text-danger">Character limit exceeded!</div>
                )}
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary shadow-sm mt-3"
                  onClick={handleClear}
                  disabled={updateLoading}
                >
                  Clear
                </button>

                <button
                  type="submit"
                  className="btn btn-primary shadow-sm mt-3"
                  disabled={
                    editPostBody.trim() === "" || charCount > MAX_CHARACTERS
                  }
                >
                  {updateLoading ? (
                    <>
                      Updating... <ButtonSpinner />
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
