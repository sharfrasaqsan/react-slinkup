import { useEffect, useRef } from "react";
import CommentList from "./CommentList";
import LikeCommentCounts from "../post/LikeCommentCounts";

const CommentModal = ({ showComment, handleCloseComment, post }) => {
  const modalRef = useRef(null);

  // Prevent background scroll
  useEffect(() => {
    if (showComment) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showComment]);

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

  if (!showComment) return null;

  return (
    <div
      className={`modal fade ${showComment ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div className="modal-dialog" role="document" ref={modalRef}>
        <div className="modal-content">
          <div className="modal-header">
            <LikeCommentCounts post={post} />
            <button
              type="button"
              className="btn-close"
              onClick={handleCloseComment}
            ></button>
          </div>
          <div className="modal-body">
            <CommentList post={post} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
