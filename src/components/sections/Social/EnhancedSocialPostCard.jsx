import React, { useState, useEffect } from 'react';

/**
 * EnhancedSocialPostCard - A social media style post with enhanced reaction options
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content of the post
 * @param {string} props.title - Title of the post
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.iconBg - Background color class for the icon
 * @param {string} props.iconColor - Text color class for the icon
 * @param {string} props.id - Unique identifier for the post
 */
const EnhancedSocialPostCard = ({ children, title, icon, iconBg, iconColor, id }) => {
  // State for reactions and comment functionality
  const [reaction, setReaction] = useState('none'); // 'none', 'like', 'love', 'hate'
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [timestamp] = useState(new Date());
  
  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedReaction = localStorage.getItem(`${id}_reaction`);
    const savedComments = localStorage.getItem(`${id}_comments`);
    
    if (savedReaction) {
      setReaction(savedReaction);
    }
    
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (error) {
        console.error('Error parsing saved comments:', error);
      }
    }
  }, [id]);
  
  // Handle reaction button click
  const handleReaction = (newReaction) => {
    // Toggle reaction if clicking the same one
    const updatedReaction = reaction === newReaction ? 'none' : newReaction;
    setReaction(updatedReaction);
    localStorage.setItem(`${id}_reaction`, updatedReaction);
  };
  
  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        text: comment,
        author: 'You',
        timestamp: new Date()
      };
      
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setComment('');
      
      localStorage.setItem(`${id}_comments`, JSON.stringify(updatedComments));
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {/* Post header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full ${iconBg} ${iconColor} flex items-center justify-center mr-3`}>
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-500">
              {new Date(timestamp).toLocaleDateString()} at {new Date(timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
      
      {/* Post content */}
      <div className="p-4">
        {children}
      </div>
      
      {/* Post footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-2">
            <button 
              className={`flex items-center px-3 py-1 rounded ${reaction === 'like' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => handleReaction('like')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={reaction === 'like' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              Like
            </button>
            
            <button 
              className={`flex items-center px-3 py-1 rounded ${reaction === 'love' ? 'bg-red-100 text-red-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={( ) => handleReaction('love')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={reaction === 'love' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Love
            </button>
            
            <button 
              className={`flex items-center px-3 py-1 rounded ${reaction === 'hate' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={( ) => handleReaction('hate')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={reaction === 'hate' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2" />
              </svg>
              Hate
            </button>
          </div>
          
          <button 
            className="flex items-center text-gray-600 px-3 py-1 rounded hover:bg-gray-100"
            onClick={( ) => setShowComments(!showComments)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comment {comments.length > 0 && `(${comments.length} )`}
          </button>
        </div>
        
        {/* Reaction summary */}
        {reaction !== 'none' && (
          <div className="text-xs text-gray-500 mb-2">
            You {reaction}d this post
          </div>
        )}
      </div>
      
      {/* Comments section */}
      {showComments && (
        <div className="border-t border-gray-200 p-4">
          {comments.length > 0 ? (
            <div className="mb-4 space-y-3">
              {comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded">
                  <div className="flex justify-between">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toLocaleDateString()} at {new Date(comment.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-4">No comments yet. Be the first to comment!</p>
          )}
          
          <form onSubmit={handleCommentSubmit} className="flex">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 p-2 border border-gray-300 rounded-l"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EnhancedSocialPostCard;
