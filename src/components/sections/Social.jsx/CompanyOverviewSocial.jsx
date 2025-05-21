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
  