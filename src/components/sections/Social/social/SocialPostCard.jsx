import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';

/**
 * SocialPostCard - A reusable component for displaying section content as a social media post
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to display in the card
 * @param {string} props.title - The title of the post (section name)
 * @param {string} props.icon - Icon for the avatar (SVG path or component)
 * @param {string} props.iconBg - Background color for the avatar
 * @param {string} props.iconColor - Color for the icon
 * @param {string} props.id - Unique identifier for the post (for like/comment storage)
 */
const SocialPostCard = ({ 
  children, 
  title, 
  icon, 
  iconBg = "bg-blue-100", 
  iconColor = "text-blue-800",
  id
}) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [timestamp] = useState(new Date());

  // Load likes and comments from localStorage on mount
  useEffect(() => {
    const storedLiked = localStorage.getItem(`${id}_liked`);
    if (storedLiked) {
      setLiked(storedLiked === 'true');
    }

    const storedComments = localStorage.getItem(`${id}_comments`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [id]);

  // Handle like button click
  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    localStorage.setItem(`${id}_liked`, newLiked.toString());
  };

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        text: comment,
        timestamp: new Date(),
        author: 'You'
      };
      
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      localStorage.setItem(`${id}_comments`, JSON.stringify(updatedComments));
      setComment('');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="p-3 border-b border-gray-200">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full ${iconBg} ${iconColor} flex items-center justify-center mr-3`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">
              Posted {formatDistanceToNow(timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {children}
      </CardContent>
      
      <CardFooter className="border-t border-gray-200 p-3 flex justify-between">
        <Button 
          variant={liked ? "default" : "ghost"} 
          size="sm" 
          onClick={handleLike}
          className={`flex items-center ${liked ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Like {liked && '(1)'}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comment {comments.length > 0 && `(${comments.length})`}
        </Button>
      </CardFooter>
      
      {showComments && (
        <div className="border-t border-gray-200 p-3">
          {comments.length > 0 && (
            <div className="mb-4 space-y-3">
              {comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{comment.author}</p>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <form onSubmit={handleCommentSubmit} className="flex">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </Card>
  );
};

export default SocialPostCard;
