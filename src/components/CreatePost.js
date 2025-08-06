import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ButtonSpinner from "../utils/ButtonSpinner";
import { toast } from "react-toastify";

const CreatePost = () => {
  const { user } = useAuth();

  const [postBody, setPostBody] = useState("");
  const [postLoading, setPostLoading] = useState(false);

  const handlePost = async (e) => {
    e.preventDefault();

    setPostLoading(true);
    try {
    } catch (err) {
      toast.error(err.message);
    }
    setPostLoading(false);
  };

  return (
    <div>
      <form>
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
