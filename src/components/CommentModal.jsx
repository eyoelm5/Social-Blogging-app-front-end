import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import closeIcon from "../assets/close.png";
import deleteIcon from "../assets/deleteicon.png";
import { useAuth } from "../AuthContext";
import api from "../../api/posts";

const CommentModal = ({ comments, onClose, id }) => {
  const { status } = useAuth();
  const navigate = useNavigate();
  const [allComments, setAllComments] = useState(comments);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get(`/${id}`);
        setAllComments(response.data.post.comments);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    fetchComments();
  }, [id]); 

  const submitComment = async () => {
    setIsLoading(true);
    const finalComment = { content: newComment };

    try {
      const response = await api.post(`/${id}/comment`, finalComment);
      setAllComments((prevData) => [...prevData, response.data.comment]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to submit comment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    setIsLoading(true);

    try {
      await api.delete(`/${id}/comment/${commentId}`);
      setAllComments((prevData) => prevData.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-[95%] p-4">
        <div className="flex justify-between items-center pb-2 border-b">
          <h2 className="text-xl font-bold">Comments</h2>
          <span onClick={onClose} className="text-red-500 hover:cursor-pointer">
            <img className="w-10" src={closeIcon} alt="close comments" />
          </span>
        </div>
        <div className="mt-4 min-h-6">
          {allComments.length !== 0 ? (
            !isLoading &&
            allComments.map((comment) => (
              <div
                key={comment._id}
                className="mb-2 mx-8 flex justify-between items-center"
              >
                <div>
                  <div className="text-lg font-semibold">
                    {comment.authorId.name}
                  </div>
                  <p className="mt-1 text-gray-700">{comment.content}</p>
                </div>
                {comment.authorId._id === status.userId && (
                  <img
                    src={deleteIcon}
                    alt="Delete Icon"
                    className="h-6 hover:cursor-pointer"
                    onClick={() => deleteComment(comment._id)}
                  />
                )}
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
        {status.loggedIn ? (
          <div className="mt-4">
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              className="mt-2 w-full bg-gray-900 text-white py-2 rounded-md"
              onClick={submitComment}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        ) : (
          <button
            className="text-white bg-black py-3 rounded-md w-full mt-4 mx-auto hover:cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Login To Comment
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentModal;
