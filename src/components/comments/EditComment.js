import { useEffect, useState } from "react";
import ButtonSpinner from "../../utils/ButtonSpinner";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";

const EditComment = ({
  comment,
  setComments,
  showEditComment,
  handleCloseComment,
}) => {
  const [updatedComment, setUpdatedComment] = useState();
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (showEditComment) {
      setUpdatedComment(comment.body);
    }
  }, [showEditComment, comment.body]);

  const handleUpdateComment = async (commentId) => {
    setUpdateLoading(true);
    try {
      const updateComment = {
        body: updatedComment.trim(),
        isUpdated: true,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      };
      await updateDoc(doc(db, "comments", commentId), updateComment);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, ...updateComment } : comment
        )
      );
    } catch (err) {
      toast.error("Failed to update comment!");
    }
    setUpdateLoading(false);
  };

  return (
    <form
      className={`fade ${showEditComment ? "show d-block" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        handleUpdateComment(comment.id);
        setTimeout(() => {
          handleCloseComment();
        }, 1000);
      }}
    >
      <input
        type="text"
        id="comment"
        name="comment"
        placeholder="Enter your comment"
        required
        autoFocus
        value={updatedComment}
        onChange={(e) => setUpdatedComment(e.target.value)}
      />
      <button type="submit">
        {updateLoading ? (
          <>
            Updating... <ButtonSpinner />
          </>
        ) : (
          "Update"
        )}
      </button>
      <button onClick={() => handleCloseComment()}>Cancel</button>
    </form>
  );
};

export default EditComment;
