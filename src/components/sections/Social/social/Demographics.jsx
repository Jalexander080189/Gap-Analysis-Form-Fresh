import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageSquare, Users, Building, BarChart } from "lucide-react";

const Demographics = ({ formData, updateFormData }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [timestamp] = useState(new Date());
  const [businessType, setBusinessType] = useState('b2b');

  // Handle business type change
  const handleBusinessTypeChange = (type) => {
    setBusinessType(type);
    updateFormData({ ...formData, businessType: type });
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    updateFormData({ ...formData, [field]: value });
  };

  // Handle like button click
  const handleLike = () => {
    setLiked(!liked);
    // Save like state to localStorage
    localStorage.setItem('demographics_liked', !liked ? 'true' : 'false');
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
      setComments([...comments, newComment]);
      setComment('');
      // Save comments to localStorage
      localStorage.setItem('demographics_comments', JSON.stringify([...comments, newComment]));
    }
  };

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedLiked = localStorage.getItem('demographics_liked');
    if (savedLiked) {
      setLiked(savedLiked === 'true');
    }
    
    const savedComments = localStorage.getItem('demographics_comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
    
    const savedBusinessType = localStorage.getItem('business_type');
    if (savedBusinessType) {
      setBusinessType(savedBusinessType);
    }
  }, []);

  // Save business type to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('business_type', businessType);
  }, [businessType]);

  // Format timestamp
  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="/demographics-specialist-avatar.png" alt="Demographics Specialist" />
            <AvatarFallback className="bg-teal-100 text-teal-800">
              <Users size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base">Demographics Specialist</h3>
            <p className="text-sm text-gray-500">Posted {formatTimestamp(timestamp)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">Target audience demographics:</p>
        
        <div className="mb-4">
          <Label className="block text-sm font-medium mb-2">Business Type</Label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="b2b"
                name="businessType"
                value="b2b"
                checked={businessType === 'b2b'}
                onChange={() => handleBusinessTypeChange('b2b')}
                className="h-4 w-4 text-blue-600"
              />
              <Label htmlFor="b2b" className="ml-2">B2B</Label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="b2c"
                name="businessType"
                value="b2c"
                checked={businessType === 'b2c'}
                onChange={() => handleBusinessTypeChange('b2c')}
                className="h-4 w-4 text-blue-600"
              />
              <Label htmlFor="b2c" className="ml-2">B2C</Label>
            </div>
          </div>
        </div>
        
        {businessType === 'b2b' ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="companySize" className="flex items-center text-sm font-medium">
                <Building className="h-4 w-4 mr-1" /> Target Company Size
              </Label>
              <Input 
                id="companySize"
                placeholder="e.g., 50-200 employees"
                value={formData.companySize || ''}
                onChange={(e) => handleInputChange('companySize', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="industryFocus" className="flex items-center text-sm font-medium">
                <BarChart className="h-4 w-4 mr-1" /> Industry Focus
              </Label>
              <Input 
                id="industryFocus"
                placeholder="e.g., Healthcare, Technology, Finance"
                value={formData.industryFocus || ''}
                onChange={(e) => handleInputChange('industryFocus', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="decisionMakers" className="flex items-center text-sm font-medium">
                <Users className="h-4 w-4 mr-1" /> Decision Makers
              </Label>
              <Input 
                id="decisionMakers"
                placeholder="e.g., CTO, IT Director, HR Manager"
                value={formData.decisionMakers || ''}
                onChange={(e) => handleInputChange('decisionMakers', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="geographicFocus" className="flex items-center text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                </svg>
                Geographic Focus
              </Label>
              <Input 
                id="geographicFocus"
                placeholder="e.g., North America, Global, Midwest US"
                value={formData.geographicFocus || ''}
                onChange={(e) => handleInputChange('geographicFocus', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="ageRange" className="flex items-center text-sm font-medium">
                <Users className="h-4 w-4 mr-1" /> Age Range
              </Label>
              <Input 
                id="ageRange"
                placeholder="e.g., 25-45"
                value={formData.ageRange || ''}
                onChange={(e) => handleInputChange('ageRange', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="incomeLevel" className="flex items-center text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Income Level
              </Label>
              <Input 
                id="incomeLevel"
                placeholder="e.g., $75,000-$120,000"
                value={formData.incomeLevel || ''}
                onChange={(e) => handleInputChange('incomeLevel', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="interests" className="flex items-center text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Interests
              </Label>
              <Input 
                id="interests"
                placeholder="e.g., Fitness, Technology, Travel"
                value={formData.interests || ''}
                onChange={(e) => handleInputChange('interests', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="geographicLocation" className="flex items-center text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                </svg>
                Geographic Location
              </Label>
              <Input 
                id="geographicLocation"
                placeholder="e.g., Urban areas, Suburban, West Coast"
                value={formData.geographicLocation || ''}
                onChange={(e) => handleInputChange('geographicLocation', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col pt-0">
        <Separator className="mb-3" />
        
        <div className="flex justify-between w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center ${liked ? 'text-blue-600' : ''}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            {liked ? 'Liked' : 'Like'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Comment
          </Button>
        </div>
        
        {showComments && (
          <div className="mt-3 w-full">
            <Separator className="mb-3" />
            
            <form onSubmit={handleCommentSubmit} className="flex mb-3">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/user-avatar.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Input 
                placeholder="Write a comment..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-grow"
              />
            </form>
            
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/user-avatar.png" alt={c.author} />
                    <AvatarFallback>{c.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-2xl px-4 py-2 flex-grow">
                    <p className="font-medium">{c.author}</p>
                    <p className="text-gray-700">{c.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimestamp(new Date(c.timestamp))}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Demographics;
