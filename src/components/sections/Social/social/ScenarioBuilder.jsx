import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageSquare, LineChart, Sliders, Users, ShoppingCart } from "lucide-react";

const ScenarioBuilder = ({ formData, updateFormData }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [timestamp] = useState(new Date());
  const [visibilityImprovement, setVisibilityImprovement] = useState(25);
  const [conversionImprovement, setConversionImprovement] = useState(15);
  const [retentionImprovement, setRetentionImprovement] = useState(10);
  const [scenarioResults, setScenarioResults] = useState(null);
  const [funnelType, setFunnelType] = useState(formData.funnelType || 'leadGen');

  // Calculate scenario results
  const calculateScenario = () => {
    const annualRevenue = parseFloat(formData.annualRevenue?.replace(/,/g, '') || 0);
    if (!annualRevenue) return null;
    
    if (funnelType === 'leadGen') {
      // Lead Generation model calculations
      const audienceSize = parseFloat(formData.audienceSize?.replace(/,/g, '') || 0);
      const websiteVisitors = parseFloat(formData.websiteVisitors?.replace(/,/g, '') || 0);
      const leads = parseFloat(formData.leads?.replace(/,/g, '') || 0);
      const closedAccounts = parseFloat(formData.closedAccounts?.replace(/,/g, '') || 0);
      const customerValue = parseFloat(formData.customerValue?.replace(/,/g, '') || 0);
      
      // Calculate improved metrics
      const improvedVisitors = websiteVisitors * (1 + (visibilityImprovement / 100));
      const improvedLeads = improvedVisitors * (leads / websiteVisitors) * (1 + (conversionImprovement / 100));
      const improvedClosedAccounts = improvedLeads * (closedAccounts / leads) * (1 + (retentionImprovement / 100));
      
      // Calculate projected revenue
      const projectedRevenue = improvedClosedAccounts * customerValue;
      const revenueIncrease = projectedRevenue - annualRevenue;
      const growthPercentage = (revenueIncrease / annualRevenue) * 100;
      
      return {
        currentRevenue: annualRevenue.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }),
        projectedRevenue: projectedRevenue.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }),
        revenueIncrease: revenueIncrease.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }),
        growthPercentage: growthPercentage.toFixed(0),
        growthRatio: growthPercentage / 100
      };
    } else {
      // Retail model calculations
      const audienceSize = parseFloat(formData.audienceSize?.replace(/,/g, '') || 0);
      const storeVisitors = parseFloat(formData.storeVisitors?.replace(/,/g, '') || 0);
      const purchasers = parseFloat(formData.purchasers?.replace(/,/g, '') || 0);
      const repeatCustomers = parseFloat(formData.repeatCustomers?.replace(/,/g, '') || 0);
      const customerValue = parseFloat(formData.customerValue?.replace(/,/g, '') || 0);
      
      // Calculate improved metrics
      const improvedVisitors = storeVisitors * (1 + (visibilityImprovement / 100));
      const improvedPurchasers = improvedVisitors * (purchasers / storeVisitors) * (1 + (conversionImprovement / 100));
      const improvedRepeatCustomers = improvedPurchasers * (repeatCustomers / purchasers) * (1 + (retentionImprovement / 100));
      
      // Calculate projected revenue
      const avgPurchaseValue = annualRevenue / purchasers;
      const projectedRevenue = improvedPurchasers * avgPurchaseValue;
      const revenueIncrease = projectedRevenue - annualRevenue;
      const growthPercentage = (revenueIncrease / annualRevenue) * 100;
      
      return {
        currentRevenue: annualRevenue.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }),
        projectedRevenue: projectedRevenue.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }),
        revenueIncrease: revenueIncrease.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }),
        growthPercentage: growthPercentage.toFixed(0),
        growthRatio: growthPercentage / 100
      };
    }
  };

  // Run scenario when sliders change or form data updates
  useEffect(() => {
    const results = calculateScenario();
    setScenarioResults(results);
  }, [visibilityImprovement, conversionImprovement, retentionImprovement, formData, funnelType]);

  // Handle like button click
  const handleLike = () => {
    setLiked(!liked);
    // Save like state to localStorage
    localStorage.setItem('scenario_liked', !liked ? 'true' : 'false');
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
      localStorage.setItem('scenario_comments', JSON.stringify([...comments, newComment]));
    }
  };

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedLiked = localStorage.getItem('scenario_liked');
    if (savedLiked) {
      setLiked(savedLiked === 'true');
    }
    
    const savedComments = localStorage.getItem('scenario_comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
    
    const savedVisibilityImprovement = localStorage.getItem('visibility_improvement');
    if (savedVisibilityImprovement) {
      setVisibilityImprovement(parseInt(savedVisibilityImprovement));
    }
    
    const savedConversionImprovement = localStorage.getItem('conversion_improvement');
    if (savedConversionImprovement) {
      setConversionImprovement(parseInt(savedConversionImprovement));
    }
    
    const savedRetentionImprovement = localStorage.getItem('retention_improvement');
    if (savedRetentionImprovement) {
      setRetentionImprovement(parseInt(savedRetentionImprovement));
    }
  }, []);

  // Update funnel type when it changes in formData
  useEffect(() => {
    if (formData.funnelType) {
      setFunnelType(formData.funnelType);
    }
  }, [formData.funnelType]);

  // Save slider values to localStorage when they change
  useEffect(() => {
    localStorage.setItem('visibility_improvement', visibilityImprovement.toString());
    localStorage.setItem('conversion_improvement', conversionImprovement.toString());
    localStorage.setItem('retention_improvement', retentionImprovement.toString());
  }, [visibilityImprovement, conversionImprovement, retentionImprovement]);

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
            <AvatarImage src="/strategy-consultant-avatar.png" alt="Strategy Consultant" />
            <AvatarFallback className="bg-indigo-100 text-indigo-800">
              <LineChart size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base">Strategy Consultant</h3>
            <p className="text-sm text-gray-500">Posted {formatTimestamp(timestamp)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-3">
          What if we improved our {funnelType === 'leadGen' ? 'marketing funnel' : 'customer journey'}? Let's run some scenarios:
        </p>
        
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">
            Business Model: <span className="font-bold">{funnelType === 'leadGen' ? 'Lead Generation' : 'Retail'}</span>
          </p>
          <p className="text-xs text-gray-500">
            {funnelType === 'leadGen' 
              ? 'Projecting improvements to lead generation funnel metrics.' 
              : 'Projecting improvements to retail customer journey metrics.'}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-3">Scenario Builder</h3>
          
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                {funnelType === 'leadGen' ? 'Visibility Improvement' : 'Foot Traffic Improvement'}
              </Label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={visibilityImprovement} 
                  onChange={(e) => setVisibilityImprovement(parseInt(e.target.value))}
                  className="w-full mr-2"
                />
                <span className="text-sm font-medium">{visibilityImprovement}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {funnelType === 'leadGen' 
                  ? 'Increase in website visitors' 
                  : 'Increase in store visitors'}
              </p>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                {funnelType === 'leadGen' ? 'Lead Conversion Improvement' : 'Purchase Conversion Improvement'}
              </Label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={conversionImprovement} 
                  onChange={(e) => setConversionImprovement(parseInt(e.target.value))}
                  className="w-full mr-2"
                />
                <span className="text-sm font-medium">{conversionImprovement}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {funnelType === 'leadGen' 
                  ? 'Increase in lead conversion rate' 
                  : 'Increase in visitor-to-purchaser conversion'}
              </p>
            </div>
            
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                {funnelType === 'leadGen' ? 'Closing Rate Improvement' : 'Customer Retention Improvement'}
              </Label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={retentionImprovement} 
                  onChange={(e) => setRetentionImprovement(parseInt(e.target.value))}
                  className="w-full mr-2"
                />
                <span className="text-sm font-medium">{retentionImprovement}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {funnelType === 'leadGen' 
                  ? 'Increase in lead-to-customer conversion' 
                  : 'Increase in repeat customer rate'}
              </p>
            </div>
          </div>
        </div>
        
        {scenarioResults && (
          <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 mb-3">Scenario Results</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Current Annual Revenue</p>
                <p className="text-xl font-bold">{scenarioResults.currentRevenue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Projected Annual Revenue</p>
                <p className="text-xl font-bold text-green-600">{scenarioResults.projectedRevenue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Revenue Increase</p>
                <p className="text-xl font-bold text-green-600">{scenarioResults.revenueIncrease}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Growth Percentage</p>
                <p className="text-xl font-bold text-green-600">+{scenarioResults.growthPercentage}%</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-500 h-4 rounded-full" 
                  style={{ width: `${Math.min(100, scenarioResults.growthRatio * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Current</span>
                <span>Projected</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col pt-0">
        <Separator className="mb-3" />
        
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center ${liked ? 'text-blue-600' : ''}`}
              onClick={handleLike}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {liked ? 'Liked' : 'Like'}
            </Button>
            <span className="text-gray-500 text-sm ml-2">24 likes</span>
          </div>
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
              
              {/* Default comment */}
              <div className="flex items-start">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/user-avatar.png" alt="John Smith" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-2xl px-4 py-2 flex-grow">
                  <p className="font-medium">John Smith</p>
                  <p className="text-gray-700">These projections look promising! Let's discuss implementation next week.</p>
                  <p className="text-xs text-gray-500 mt-1">2h ago</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ScenarioBuilder;
