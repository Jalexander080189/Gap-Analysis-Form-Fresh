import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageSquare, BarChart2, Users, Percent, DollarSign } from "lucide-react";

const MarketAnalyst = ({ formData, updateFormData }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [timestamp] = useState(new Date());

  // Calculate total buyers and market revenue when inputs change
  const calculateResults = () => {
    const audienceSize = parseFloat(formData.audienceSize?.replace(/,/g, '') || 0);
    const buyerPercentage = parseFloat(formData.buyerPercentage || 0);
    const customerValue = parseFloat(formData.customerValue?.replace(/,/g, '') || 0);
    
    const totalBuyers = audienceSize * (buyerPercentage / 100);
    const totalMarketRevenue = totalBuyers * customerValue;
    
    return {
      totalBuyers: totalBuyers.toLocaleString(),
      totalMarketRevenue: totalMarketRevenue.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      })
    };
  };

  const results = calculateResults();
  
  // Handle input changes
  const handleInputChange = (field, value) => {
    updateFormData({ ...formData, [field]: value });
  };

  // Handle like button click
  const handleLike = () => {
    setLiked(!liked);
    // Save like state to localStorage
    localStorage.setItem('market_liked', !liked ? 'true' : 'false');
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
      localStorage.setItem('market_comments', JSON.stringify([...comments, newComment]));
    }
  };

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedLiked = localStorage.getItem('market_liked');
    if (savedLiked) {
      setLiked(savedLiked === 'true');
    }
    
    const savedComments = localStorage.getItem('market_comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

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
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="/market-analyst-avatar.png" alt="Market Analyst" />
            <AvatarFallback className="bg-blue-100 text-blue-800">
              <BarChart2 size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base">Market Analyst</h3>
            <p className="text-sm text-gray-500">Posted {formatTimestamp(timestamp)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-3">Market overview data for your company:</p>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="audienceSize" className="flex items-center text-sm font-medium">
              <Users className="h-4 w-4 mr-1" /> Audience Size
            </Label>
            <Input 
              id="audienceSize"
              placeholder="e.g., 500,000"
              value={formData.audienceSize || ''}
              onChange={(e) => handleInputChange('audienceSize', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="buyerPercentage" className="flex items-center text-sm font-medium">
              <Percent className="h-4 w-4 mr-1" /> Buyer %
            </Label>
            <Input 
              id="buyerPercentage"
              placeholder="e.g., 2.5"
              value={formData.buyerPercentage || ''}
              onChange={(e) => handleInputChange('buyerPercentage', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="customerValue" className="flex items-center text-sm font-medium">
              <DollarSign className="h-4 w-4 mr-1" /> Yearly Avg Customer Value
            </Label>
            <Input 
              id="customerValue"
              placeholder="e.g., 2,500"
              value={formData.customerValue || ''}
              onChange={(e) => handleInputChange('customerValue', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        
        {/* Only show calculations if at least one field has a value */}
        {(formData.audienceSize || formData.buyerPercentage || formData.customerValue) && (
          <>
            <Separator className="my-4" />
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">Calculations:</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Total Buyers:</span>
                  <span className="font-semibold">{results.totalBuyers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Market Revenue:</span>
                  <span className="font-semibold text-green-600">{results.totalMarketRevenue}</span>
                </div>
              </div>
            </div>
          </>
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

export default MarketAnalyst;
