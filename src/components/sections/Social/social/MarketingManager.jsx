import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageSquare, Plus, Trash2 } from "lucide-react";

const MarketingManager = ({ formData, updateFormData }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [timestamp] = useState(new Date());
  const [channels, setChannels] = useState([{ id: Date.now(), channel: '', spend: '' }]);

  // Calculate marketing budget metrics
  const calculateResults = () => {
    // Get total monthly spend
    const monthlyTotal = channels.reduce((total, channel) => {
      const spend = parseFloat(channel.spend?.replace(/[^0-9.]/g, '') || 0);
      return total + spend;
    }, 0);
    
    // Calculate yearly total
    const yearlyTotal = monthlyTotal * 12;
    
    // Calculate percentage of annual revenue
    const annualRevenue = parseFloat(formData.annualRevenue?.replace(/[^0-9.]/g, '') || 0);
    const revenuePercentage = annualRevenue ? (yearlyTotal / annualRevenue) * 100 : 0;
    
    // Calculate additional spend needed to reach 8% monthly
    const targetMonthly = annualRevenue ? (annualRevenue * 0.08) / 12 : 0;
    const additionalSpend = Math.max(0, targetMonthly - monthlyTotal);
    
    return {
      monthlyTotal: monthlyTotal.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }),
      yearlyTotal: yearlyTotal.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }),
      revenuePercentage: revenuePercentage.toFixed(2),
      additionalSpend: additionalSpend.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      })
    };
  };

  const results = calculateResults();
  
  // Add a new marketing channel
  const addChannel = () => {
    setChannels([...channels, { id: Date.now(), channel: '', spend: '' }]);
  };
  
  // Remove a marketing channel
  const removeChannel = (id) => {
    setChannels(channels.filter(channel => channel.id !== id));
  };
  
  // Update channel data
  const updateChannel = (id, field, value) => {
    const updatedChannels = channels.map(channel => {
      if (channel.id === id) {
        return { ...channel, [field]: value };
      }
      return channel;
    });
    setChannels(updatedChannels);
    
    // Update formData with the new channels
    updateFormData({ ...formData, marketingChannels: updatedChannels });
  };

  // Handle like button click
  const handleLike = () => {
    setLiked(!liked);
    // Save like state to localStorage
    localStorage.setItem('marketing_liked', !liked ? 'true' : 'false');
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
      localStorage.setItem('marketing_comments', JSON.stringify([...comments, newComment]));
    }
  };

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedLiked = localStorage.getItem('marketing_liked');
    if (savedLiked) {
      setLiked(savedLiked === 'true');
    }
    
    const savedComments = localStorage.getItem('marketing_comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
    
    const savedChannels = localStorage.getItem('marketing_channels');
    if (savedChannels) {
      setChannels(JSON.parse(savedChannels));
    }
  }, []);

  // Save channels to localStorage when they change
  useEffect(() => {
    localStorage.setItem('marketing_channels', JSON.stringify(channels));
  }, [channels]);

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
            <AvatarImage src="/marketing-manager-avatar.png" alt="Marketing Manager" />
            <AvatarFallback className="bg-green-100 text-green-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M3 3v18h18" />
                <path d="M18.4 9.6a9 9 0 0 0-9.2 10h9.2V9.6Z" />
                <path d="m8 4 4 4-4 4" />
              </svg>
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base">Marketing Manager</h3>
            <p className="text-sm text-gray-500">Posted {formatTimestamp(timestamp)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-3">Current marketing channels and performance:</p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 mb-4">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Spend</th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel) => (
                <tr key={channel.id}>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <Input
                      placeholder="e.g., Google Ads"
                      value={channel.channel}
                      onChange={(e) => updateChannel(channel.id, 'channel', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <Input
                      placeholder="e.g., $1,000"
                      value={channel.spend}
                      onChange={(e) => updateChannel(channel.id, 'spend', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeChannel(channel.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <Button 
            variant="outline" 
            className="flex items-center justify-center w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 mb-4"
            onClick={addChannel}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Marketing Channel
          </Button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-3">Marketing Budget Analysis</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Calculated Monthly Total</p>
              <p className="text-xl font-bold">{results.monthlyTotal}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Calculated Yearly Total</p>
              <p className="text-xl font-bold">{results.yearlyTotal}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Calculated % of Annual Revenue</p>
              <p className="text-xl font-bold">{results.revenuePercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Additional Spend for 8% Monthly</p>
              <p className="text-xl font-bold text-red-600">{results.additionalSpend}</p>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 inline-block mr-1">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Remember to include all monthly management costs, salaries, internal employees, and other marketing-related expenses in your calculations.
            </p>
          </div>
        </div>
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

export default MarketingManager;
