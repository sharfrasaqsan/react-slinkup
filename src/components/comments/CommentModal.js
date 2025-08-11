import CommentList from "./CommentList";

const CommentModal = ({ show, handleClose, post }) => {
  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Comments</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
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
