import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ButtonSpinner from "../../utils/ButtonSpinner";
import { format } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";

const EditPost = ({ showEditPost, handleCloseEditPost, post, setPosts }) => {
  // Prevent background scroll
  useEffect(() => {
    if (showEditPost) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showEditPost]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleCloseEditPost();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleCloseEditPost]);

  const [editPostBody, setEditPostBody] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (showEditPost) {
      setEditPostBody(post.body);
    }
  }, [showEditPost, post.body]);

  const handleUpdatePost = async (postId) => {
    if (!editPostBody) {
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

  if (!showEditPost) return null;

  return (
    <div
      className={`modal fade ${showEditPost ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Post</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseEditPost}
            ></button>
          </div>
          <div className="modal-body">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePost(post.id);
                setTimeout(() => {
                  handleCloseEditPost();
                }, 1000);
              }}
            >
              <div className="mb-3">
                <label htmlFor="postBody" className="form-label">
                  Post Body
                </label>
                <textarea
                  className="form-control"
                  id="postBody"
                  rows="3"
                  value={editPostBody}
                  onChange={(e) => setEditPostBody(e.target.value)}
                  required
                  autoFocus
                  placeholder="Enter edit post content"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {updateLoading ? (
                  <>
                    Updating... <ButtonSpinner />
                  </>
                ) : (
                  "Update"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
