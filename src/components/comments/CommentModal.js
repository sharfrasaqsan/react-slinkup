import { useEffect, useRef, useState } from "react";
import CommentList from "./CommentList";
import LikeCommentCounts from "../post/LikeCommentCounts";
import LoadingSpinner from "../../utils/LoadingSpinner";

const CommentModal = ({ showComment, handleCloseComment, post }) => {
  const modalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true); // Assume comments are being fetched
  const [comments, setComments] = useState([]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleCloseComment();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleCloseComment]);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleCloseComment();
      }
    };
    if (showComment) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showComment, handleCloseComment]);

  useEffect(() => {
    if (showComment) {
      setIsLoading(true);
      // Simulating a comment fetch, set isLoading to false after fetching
      setTimeout(() => {
        setComments(post.comments); // Assuming post.comments has the comments data
        setIsLoading(false);
      }, 1000); // Simulated delay
    }
  }, [showComment, post.comments]);

  if (!showComment) return null;

  return (
    <div
      className={`modal fade ${showComment ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      aria-hidden={!showComment}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div className="modal-dialog modal-lg" role="document" ref={modalRef}>
        <div className="modal-content rounded-3">
          <div className="modal-header">
            <h5
              className="modal-title"
              id="modalLabel"
              aria-labelledby="modalLabel"
            >
              Comments on Post
            </h5>

            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleCloseComment}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <LikeCommentCounts post={post} />
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <CommentList post={post} comments={comments} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
