import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageSquare, Briefcase, DollarSign, Percent } from "lucide-react";

const CompanyAdvisor = ({ formData, updateFormData }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [timestamp] = useState(new Date());

  // Calculate customer breakdown and market share when inputs change
  const calculateResults = () => {
    const annualRevenue = parseFloat(formData.annualRevenue?.replace(/,/g, '') || 0);
    const percentNew = parseFloat(formData.percentNew || 0);
    const percentCurrent = parseFloat(formData.percentCurrent || 0);
    
    // Calculate from Market Overview if available
    const totalMarketRevenue = parseFloat(
      (formData.audienceSize?.replace(/,/g, '') || 0) * 
      (formData.buyerPercentage / 100 || 0) * 
      (formData.customerValue?.replace(/,/g, '') || 0)
    );
    
    // Calculate customer breakdown
    const customerValue = parseFloat(formData.customerValue?.replace(/,/g, '') || 0);
    const totalCustomers = customerValue ? Math.round(annualRevenue / customerValue) : 0;
    const newCustomers = Math.round(totalCustomers * (percentNew / 100));
    const currentCustomers = Math.round(totalCustomers * (percentCurrent / 100));
    
    // Calculate market share
    const marketShare = totalMarketRevenue ? (annualRevenue / totalMarketRevenue) * 100 : 0;
    const marketGap = 100 - marketShare;
    
    return {
      totalCustomers: totalCustomers.toLocaleString(),
      newCustomers: newCustomers.toLocaleString(),
      currentCustomers: currentCustomers.toLocaleString(),
      marketShare: marketShare.toFixed(1),
      marketGap: marketGap.toFixed(1)
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
    localStorage.setItem('company_liked', !liked ? 'true' : 'false');
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
      localStorage.setItem('company_comments', JSON.stringify([...comments, newComment]));
    }
  };

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedLiked = localStorage.getItem('company_liked');
    if (savedLiked) {
      setLiked(savedLiked === 'true');
    }
    
    const savedComments = localStorage.getItem('company_comments');
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
            <AvatarImage src="/company-advisor-avatar.png" alt="Company Advisor" />
            <AvatarFallback className="bg-amber-100 text-amber-800">
              <Briefcase size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base">Company Advisor</h3>
            <p className="text-sm text-gray-500">Posted {formatTimestamp(timestamp)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-3">Company overview for your business:</p>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="annualRevenue" className="flex items-center text-sm font-medium">
              <DollarSign className="h-4 w-4 mr-1" /> Annual Revenue
            </Label>
            <Input 
              id="annualRevenue"
              placeholder="e.g., 5,000,000"
              value={formData.annualRevenue || ''}
              onChange={(e) => handleInputChange('annualRevenue', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="percentNew" className="flex items-center text-sm font-medium">
              <Percent className="h-4 w-4 mr-1" /> % New
            </Label>
            <Input 
              id="percentNew"
              placeholder="e.g., 35"
              value={formData.percentNew || ''}
              onChange={(e) => handleInputChange('percentNew', e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="percentCurrent" className="flex items-center text-sm font-medium">
              <Percent className="h-4 w-4 mr-1" /> % Current
            </Label>
            <Input 
              id="percentCurrent"
              placeholder="e.g., 65"
              value={formData.percentCurrent || ''}
              onChange={(e) => handleInputChange('percentCurrent', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        
        {/* Only show calculations if at least one field has a value */}
        {(formData.annualRevenue || formData.percentNew || formData.percentCurrent) && (
          <>
            <Separator className="my-4" />
            
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">Customer Breakdown:</p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="font-semibold">{results.totalCustomers}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">New</p>
                  <p className="font-semibold">{results.newCustomers}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current</p>
                  <p className="font-semibold">{results.currentCustomers}</p>
                </div>
              </div>
              
              <p className="text-sm font-medium text-gray-700 mt-3 mb-2">Market Revenue Share:</p>
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-green-600 font-medium">{results.marketShare}%</span>
                  <span className="text-red-600 font-medium">{results.marketGap}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${results.marketShare}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">Share</span>
                  <span className="text-gray-500">Gap</span>
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

export default CompanyAdvisor;
