import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageSquare, Code, Share2 } from "lucide-react";

const GPTDataBlock = ({ formData, updateFormData }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [timestamp] = useState(new Date());
  const [gptData, setGptData] = useState(formData.gptData || '');
  const [parsedData, setParsedData] = useState(null);

  // Parse GPT data
  const parseGPTData = () => {
    try {
      // Simple parsing logic - this would be more sophisticated in production
      const lines = gptData.split('\n');
      const parsedObj = {};
      
      lines.forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join(':').trim();
          
          if (key && value) {
            parsedObj[key] = value;
          }
        }
      });
      
      setParsedData(parsedObj);
      return parsedObj;
    } catch (error) {
      console.error('Error parsing GPT data:', error);
      return null;
    }
  };

  // Auto-fill form with parsed data
  const autoFillForm = () => {
    const data = parsedData || parseGPTData();
    if (!data) return;
    
    const updatedFormData = { ...formData };
    
    // Map parsed data to form fields
    const fieldMappings = {
      'Company Name': 'companyName',
      'Industry': 'industry',
      'Website': 'website',
      'Primary Owner': 'primaryOwner',
      'Co-Owners': 'coOwners',
      'Founded': 'founded',
      'Audience Size': 'audienceSize',
      'Buyer Percentage': 'buyerPercentage',
      'Customer Value': 'customerValue',
      'Annual Revenue': 'annualRevenue',
      'New Percentage': 'percentNew',
      'Current Percentage': 'percentCurrent',
      'Website Visitors': 'websiteVisitors',
      'Leads': 'leads',
      'Closed Accounts': 'closedAccounts',
      'Store Visitors': 'storeVisitors',
      'Purchasers': 'purchasers',
      'Repeat Customers': 'repeatCustomers'
    };
    
    // Update form data with parsed values
    Object.entries(data).forEach(([key, value]) => {
      const formField = fieldMappings[key];
      if (formField) {
        updatedFormData[formField] = value;
      }
    });
    
    // Determine funnel type if possible
    if (data['Business Model'] === 'Retail' || data['Business Type'] === 'Retail') {
      updatedFormData.funnelType = 'retail';
    } else if (data['Business Model'] === 'Lead Generation' || data['Business Type'] === 'Lead Generation') {
      updatedFormData.funnelType = 'leadGen';
    }
    
    updateFormData(updatedFormData);
  };

  // Handle GPT data change
  const handleGPTDataChange = (value) => {
    setGptData(value);
    updateFormData({ ...formData, gptData: value });
  };

  // Handle like button click
  const handleLike = () => {
    setLiked(!liked);
    // Save like state to localStorage
    localStorage.setItem('gpt_liked', !liked ? 'true' : 'false');
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
      localStorage.setItem('gpt_comments', JSON.stringify([...comments, newComment]));
    }
  };

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedLiked = localStorage.getItem('gpt_liked');
    if (savedLiked) {
      setLiked(savedLiked === 'true');
    }
    
    const savedComments = localStorage.getItem('gpt_comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
    
    const savedGPTData = localStorage.getItem('gpt_data');
    if (savedGPTData) {
      setGptData(savedGPTData);
      updateFormData({ ...formData, gptData: savedGPTData });
    }
  }, []);

  // Save GPT data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('gpt_data', gptData);
  }, [gptData]);

  // Parse GPT data when it changes
  useEffect(() => {
    if (gptData) {
      parseGPTData();
    } else {
      setParsedData(null);
    }
  }, [gptData]);

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
            <AvatarImage src="/gpt-avatar.png" alt="GPT Data Parser" />
            <AvatarFallback className="bg-emerald-100 text-emerald-800">
              <Code size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base">GPT Data Parser</h3>
            <p className="text-sm text-gray-500">Posted {formatTimestamp(timestamp)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-3">Paste GPT-generated data here to auto-fill the form:</p>
        
        <div className="border border-gray-200 rounded-lg p-3 mb-4">
          <textarea
            value={gptData}
            onChange={(e) => handleGPTDataChange(e.target.value)}
            className="w-full h-32 resize-none border-0 focus:ring-0 p-2 bg-gray-50 rounded"
            placeholder="Paste GPT-generated data in key: value format..."
          />
        </div>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={parseGPTData}
            disabled={!gptData}
          >
            Parse Data
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={autoFillForm}
            disabled={!gptData}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Auto-Fill Form
          </Button>
        </div>
        
        {parsedData && Object.keys(parsedData).length > 0 && (
          <div className="mt-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Parsed Data:</p>
            <div className="space-y-1 text-sm">
              {Object.entries(parsedData).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="font-medium min-w-[150px]">{key}:</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col pt-0">
        <Separator className="mb-3" />
        
        <div className="flex justify-between w-full">
          <div className="flex space-x-2">
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
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
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

export default GPTDataBlock;
