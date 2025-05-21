import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageSquare, TrendingUp, Globe, UserPlus, Handshake, Users, ShoppingCart } from "lucide-react";

const GapStrategist = ({ formData, updateFormData }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [timestamp] = useState(new Date());
  const [funnelType, setFunnelType] = useState(formData.funnelType || 'leadGen');

  // Calculate funnel gaps when inputs change
  const calculateResults = () => {
    if (funnelType === 'leadGen') {
      // Lead Generation model calculations
      const audienceSize = parseFloat(formData.audienceSize?.replace(/,/g, '') || 0);
      const websiteVisitors = parseFloat(formData.websiteVisitors?.replace(/,/g, '') || 0);
      const leads = parseFloat(formData.leads?.replace(/,/g, '') || 0);
      const closedAccounts = parseFloat(formData.closedAccounts?.replace(/,/g, '') || 0);
      
      // Calculate visibility gap (% of buyers who didn't see you)
      const visibilityGap = audienceSize ? ((audienceSize - websiteVisitors) / audienceSize) * 100 : 0;
      
      // Calculate lead conversion gap (% who didn't leave info)
      const leadConversionGap = websiteVisitors ? ((websiteVisitors - leads) / websiteVisitors) * 100 : 0;
      
      // Calculate closing rate gap (% of hot leads we say no to)
      const closingRateGap = leads ? ((leads - closedAccounts) / leads) * 100 : 0;
      
      return {
        visibilityGap: visibilityGap.toFixed(1),
        leadConversionGap: leadConversionGap.toFixed(1),
        closingRateGap: closingRateGap.toFixed(1)
      };
    } else {
      // Retail model calculations
      const audienceSize = parseFloat(formData.audienceSize?.replace(/,/g, '') || 0);
      const storeVisitors = parseFloat(formData.storeVisitors?.replace(/,/g, '') || 0);
      const purchasers = parseFloat(formData.purchasers?.replace(/,/g, '') || 0);
      const repeatCustomers = parseFloat(formData.repeatCustomers?.replace(/,/g, '') || 0);
      
      // Calculate foot traffic gap (% of potential customers who don't visit)
      const footTrafficGap = audienceSize ? ((audienceSize - storeVisitors) / audienceSize) * 100 : 0;
      
      // Calculate conversion gap (% of visitors who don't purchase)
      const conversionGap = storeVisitors ? ((storeVisitors - purchasers) / storeVisitors) * 100 : 0;
      
      // Calculate loyalty gap (% of customers who don't return)
      const loyaltyGap = purchasers ? ((purchasers - repeatCustomers) / purchasers) * 100 : 0;
      
      return {
        footTrafficGap: footTrafficGap.toFixed(1),
        conversionGap: conversionGap.toFixed(1),
        loyaltyGap: loyaltyGap.toFixed(1)
      };
    }
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
    localStorage.setItem('gaps_liked', !liked ? 'true' : 'false');
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
      localStorage.setItem('gaps_comments', JSON.stringify([...comments, newComment]));
    }
  };

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedLiked = localStorage.getItem('gaps_liked');
    if (savedLiked) {
      setLiked(savedLiked === 'true');
    }
    
    const savedComments = localStorage.getItem('gaps_comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  // Update funnel type when it changes in formData
  useEffect(() => {
    if (formData.funnelType) {
      setFunnelType(formData.funnelType);
    }
  }, [formData.funnelType]);

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
            <AvatarImage src="/gap-strategist-avatar.png" alt="Gap Strategist" />
            <AvatarFallback className="bg-purple-100 text-purple-800">
              <TrendingUp size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base">Gap Strategist</h3>
            <p className="text-sm text-gray-500">Posted {formatTimestamp(timestamp)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-3">Gaps/Opportunity analysis:</p>
        
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">
            Business Model: <span className="font-bold">{funnelType === 'leadGen' ? 'Lead Generation' : 'Retail'}</span>
          </p>
          <p className="text-xs text-gray-500">
            {funnelType === 'leadGen' 
              ? 'Analyzing lead generation funnel gaps and opportunities.' 
              : 'Analyzing retail customer journey gaps and opportunities.'}
          </p>
        </div>
        
        {funnelType === 'leadGen' ? (
          // Lead Generation Model Inputs
          <div className="space-y-3">
            <div>
              <Label htmlFor="websiteVisitors" className="flex items-center text-sm font-medium">
                <Globe className="h-4 w-4 mr-1" /> Website Visitors (Annual)
              </Label>
              <Input 
                id="websiteVisitors"
                placeholder="e.g., 50,000"
                value={formData.websiteVisitors || ''}
                onChange={(e) => handleInputChange('websiteVisitors', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="leads" className="flex items-center text-sm font-medium">
                <UserPlus className="h-4 w-4 mr-1" /> Leads (Annual)
              </Label>
              <Input 
                id="leads"
                placeholder="e.g., 2,500"
                value={formData.leads || ''}
                onChange={(e) => handleInputChange('leads', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="closedAccounts" className="flex items-center text-sm font-medium">
                <Handshake className="h-4 w-4 mr-1" /> New Closed Accounts
              </Label>
              <Input 
                id="closedAccounts"
                placeholder="e.g., 500"
                value={formData.closedAccounts || ''}
                onChange={(e) => handleInputChange('closedAccounts', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        ) : (
          // Retail Model Inputs
          <div className="space-y-3">
            <div>
              <Label htmlFor="storeVisitors" className="flex items-center text-sm font-medium">
                <Users className="h-4 w-4 mr-1" /> Store Visitors (Annual)
              </Label>
              <Input 
                id="storeVisitors"
                placeholder="e.g., 25,000"
                value={formData.storeVisitors || ''}
                onChange={(e) => handleInputChange('storeVisitors', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="purchasers" className="flex items-center text-sm font-medium">
                <ShoppingCart className="h-4 w-4 mr-1" /> Purchasers (Annual)
              </Label>
              <Input 
                id="purchasers"
                placeholder="e.g., 10,000"
                value={formData.purchasers || ''}
                onChange={(e) => handleInputChange('purchasers', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="repeatCustomers" className="flex items-center text-sm font-medium">
                <Users className="h-4 w-4 mr-1" /> Repeat Customers
              </Label>
              <Input 
                id="repeatCustomers"
                placeholder="e.g., 3,500"
                value={formData.repeatCustomers || ''}
                onChange={(e) => handleInputChange('repeatCustomers', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        )}
        
        {/* Only show calculations if at least one field has a value */}
        {funnelType === 'leadGen' ? (
          // Lead Generation Model Calculations
          (formData.websiteVisitors || formData.leads || formData.closedAccounts) && (
            <>
              <Separator className="my-4" />
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-2">Calculated Gaps:</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm">Visibility Gap:</span>
                      <span className="text-sm font-semibold text-red-600">{results.visibilityGap}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${results.visibilityGap}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">% of buyers who didn't see you</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm">Lead Conversion Gap:</span>
                      <span className="text-sm font-semibold text-red-600">{results.leadConversionGap}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${results.leadConversionGap}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">% who didn't leave info</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm">Closing Rate Gap:</span>
                      <span className="text-sm font-semibold text-red-600">{results.closingRateGap}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${results.closingRateGap}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">% of hot leads we say no to</p>
                  </div>
                </div>
              </div>
            </>
          )
        ) : (
          // Retail Model Calculations
          (formData.storeVisitors || formData.purchasers || formData.repeatCustomers) && (
            <>
              <Separator className="my-4" />
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm font-medium text-gray-700 mb-2">Calculated Gaps:</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm">Foot Traffic Gap:</span>
                      <span className="text-sm font-semibold text-red-600">{results.footTrafficGap}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${results.footTrafficGap}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">% of potential customers who don't visit</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm">Conversion Gap:</span>
                      <span className="text-sm font-semibold text-red-600">{results.conversionGap}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${results.conversionGap}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">% of visitors who don't purchase</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm">Loyalty Gap:</span>
                      <span className="text-sm font-semibold text-red-600">{results.loyaltyGap}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${results.loyaltyGap}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">% of customers who don't return</p>
                  </div>
                </div>
              </div>
            </>
          )
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

export default GapStrategist;
