import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import closeIcon from "../assets/close.png";
import deleteIcon from "../assets/deleteicon.png";
import { useAuth } from "../AuthContext";
import api from "../../api/posts";

const CommentModal = ({ onClose, id }) => {
  const { status } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/${id}`);
        setComments(response.data.post.comments);
      } catch (err) {
        setError("Failed to load comments.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  const submitComment = async () => {
    setIsLoading(true);
    setError("");
    const finalComment= { content: newComment };

    try {
      const response = await api.post(`/${id}/comment`, finalComment);
      setComments((prevComments) => [...prevComments, response.data.post.comment]);
      setNewComment("");
    } catch (err) {
      setError("Failed to submit comment.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    setIsLoading(true);
    setError("");

    try {
      await api.delete(`/${id}/comment/${commentId}`);
      setComments((prevComments) => prevComments.filter(comment => comment._id !== commentId));
    } catch (err) {
      setError("Failed to delete comment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-[95%] p-4 relative">
      <span onClick={onClose} className="text-red-500 hover:cursor-pointer">
            <img className="w-10" src={closeIcon} alt="close comments" />
        </span>
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          {
            error? 
            <p className="text-red-500 mb-2">{error}</p>
            :
            isLoading?
            <p className="text-gray-600">Loading comments...</p>
            :
            <div className="space-y-4">
            {
            comments.length === 0 && !isLoading? 
            <p>No comments yet.</p>
            :
            comments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-start justify-between p-4 border rounded-lg shadow-sm bg-gray-100"
              >
                <div className="flex-1">
                  <p className="text-lg font-semibold">{comment.authorId.name}</p>
                  <p className="mt-1 text-gray-700">{comment.content}</p>
                </div>
                {comment.authorId._id === status.userId && (
                  <button
                    onClick={() => deleteComment(comment._id)}
                    className="ml-4 text-red-500 hover:cursor-pointer"
                    aria-label="Delete comment"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-6" />
                  </button>
                )}
              </div>
            ))}
          </div>
          }
          
          {status.loggedIn ? (
            <div className="mt-6">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isLoading}
                rows="4"
              ></textarea>
              <button
                className="mt-2 w-full bg-gray-900 text-white py-2 rounded-md"
                onClick={submitComment}
                disabled={isLoading || !newComment.trim()}
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
    </div>
  );
};

export default CommentModal;
