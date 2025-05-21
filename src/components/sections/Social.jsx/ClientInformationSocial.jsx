import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageSquare, Edit, Globe, Briefcase, Users, Calendar } from "lucide-react";

const ClientInformation = ({ formData, updateFormData }) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [timestamp] = useState(new Date());
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [funnelType, setFunnelType] = useState('leadGen');

  // Handle input changes
  const handleInputChange = (field, value) => {
    updateFormData({ ...formData, [field]: value });
  };

  // Handle funnel type change
  const handleFunnelTypeChange = (type) => {
    setFunnelType(type);
    updateFormData({ ...formData, funnelType: type });
  };

  // Calculate profile completion percentage
  useEffect(() => {
    const fields = ['companyName', 'industry', 'website', 'primaryOwner', 'coOwners', 'founded'];
    const filledFields = fields.filter(field => formData[field]?.trim()).length;
    const percentage = Math.round((filledFields / fields.length) * 100);
    setCompletionPercentage(percentage);
  }, [formData]);

  // Handle like button click
  const handleLike = () => {
    setLiked(!liked);
    // Save like state to localStorage
    localStorage.setItem('client_liked', !liked ? 'true' : 'false');
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
      localStorage.setItem('client_comments', JSON.stringify([...comments, newComment]));
    }
  };

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedLiked = localStorage.getItem('client_liked');
    if (savedLiked) {
      setLiked(savedLiked === 'true');
    }
    
    const savedComments = localStorage.getItem('client_comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
    
    const savedFunnelType = localStorage.getItem('funnel_type');
    if (savedFunnelType) {
      setFunnelType(savedFunnelType);
    }
  }, []);

  // Save funnel type to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('funnel_type', funnelType);
  }, [funnelType]);

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
      <div className="h-36 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-lg"></div>
      <CardContent className="px-6 pb-4 relative">
        <div className="absolute -top-10 left-6">
          <Avatar className="h-20 w-20 border-4 border-white shadow-md">
            <AvatarImage 
              src={formData.logoUrl || "https://ui-avatars.com/api/?name=" + (formData.companyName || "Company")} 
              alt="Company Logo" 
            />
            <AvatarFallback className="text-2xl">
              {formData.companyName ? formData.companyName[0] : "C"}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="pt-12">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{formData.companyName || "Your Company"}</h2>
              <p className="text-gray-500">{formData.industry || "Industry"} • Founded {formData.founded || "Year"}</p>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <div className="mb-3">
                <Label htmlFor="companyName" className="flex items-center text-sm font-medium text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-400" /> Company Name
                </Label>
                <Input 
                  id="companyName"
                  placeholder="e.g., Acme Corporation"
                  value={formData.companyName || ''}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="mb-3">
                <Label htmlFor="website" className="flex items-center text-sm font-medium text-gray-600">
                  <Globe className="h-4 w-4 mr-2 text-gray-400" /> Website
                </Label>
                <Input 
                  id="website"
                  placeholder="e.g., www.acmecorp.com"
                  value={formData.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="mb-3">
                <Label htmlFor="primaryOwner" className="flex items-center text-sm font-medium text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-gray-400" /> Primary Owner
                </Label>
                <Input 
                  id="primaryOwner"
                  placeholder="e.g., Jane Doe"
                  value={formData.primaryOwner || ''}
                  onChange={(e) => handleInputChange('primaryOwner', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <div className="mb-3">
                <Label htmlFor="industry" className="flex items-center text-sm font-medium text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2 text-gray-400" /> Industry
                </Label>
                <Input 
                  id="industry"
                  placeholder="e.g., Technology"
                  value={formData.industry || ''}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="mb-3">
                <Label htmlFor="founded" className="flex items-center text-sm font-medium text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" /> Founded
                </Label>
                <Input 
                  id="founded"
                  placeholder="e.g., 2010"
                  value={formData.founded || ''}
                  onChange={(e) => handleInputChange('founded', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="mb-3">
                <Label htmlFor="coOwners" className="flex items-center text-sm font-medium text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-gray-400" /> Co-Owners
                </Label>
                <Input 
                  id="coOwners"
                  placeholder="e.g., John Smith, Sarah Johnson"
                  value={formData.coOwners || ''}
                  onChange={(e) => handleInputChange('coOwners', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          {/* Funnel Type Toggle */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Label className="block text-sm font-medium mb-2">Business Model Type</Label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="leadGen"
                  name="funnelType"
                  value="leadGen"
                  checked={funnelType === 'leadGen'}
                  onChange={() => handleFunnelTypeChange('leadGen')}
                  className="h-4 w-4 text-blue-600"
                />
                <Label htmlFor="leadGen" className="ml-2">Lead Generation</Label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="retail"
                  name="funnelType"
                  value="retail"
                  checked={funnelType === 'retail'}
                  onChange={() => handleFunnelTypeChange('retail')}
                  className="h-4 w-4 text-blue-600"
                />
                <Label htmlFor="retail" className="ml-2">Retail</Label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This setting affects what's displayed in the Gaps/Opportunity and Scenario Builder sections.
              Select "Retail" for businesses like restaurants and bars that don't use leads.
            </p>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">Profile Completion</span>
              <span className="text-sm font-medium text-blue-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
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

export default ClientInformation;
