import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Share2, Link } from "lucide-react";

const ShareableLink = ({ formData }) => {
  const [timestamp] = useState(new Date());
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [companySlug, setCompanySlug] = useState('');

  // Generate company slug from company name
  useEffect(() => {
    if (formData.companyName) {
      const slug = formData.companyName
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setCompanySlug(slug);
    }
  }, [formData.companyName]);

  // Generate shareable URL
  useEffect(() => {
    if (companySlug) {
      const baseUrl = window.location.origin;
      setShareUrl(`${baseUrl}/reports/${companySlug}`);
    }
  }, [companySlug]);

  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
            <AvatarImage src="/share-avatar.png" alt="Share" />
            <AvatarFallback className="bg-blue-100 text-blue-800">
              <Share2 size={20} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base">Living Document</h3>
            <p className="text-sm text-gray-500">Updated {formatTimestamp(timestamp)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">Share this Gap Analysis as a living document:</p>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Shareable Link:</p>
          
          <div className="flex items-center">
            <div className="flex-grow bg-white border border-gray-300 rounded-l-md p-2 truncate">
              {shareUrl || 'Add company name to generate link'}
            </div>
            <Button 
              onClick={copyToClipboard}
              disabled={!shareUrl}
              className="rounded-l-none bg-blue-600 hover:bg-blue-700"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            <Link className="h-3 w-3 inline-block mr-1" />
            This link will always show the latest version of your Gap Analysis
          </p>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Anyone with this link can view your Gap Analysis. All changes you make will be automatically saved and visible to anyone viewing the link.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col pt-0">
        <Separator className="mb-3" />
        
        <div className="flex justify-between w-full">
          <Button 
            variant="default" 
            size="sm" 
            className="flex items-center bg-blue-600 hover:bg-blue-700"
            onClick={copyToClipboard}
            disabled={!shareUrl}
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share Analysis
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ShareableLink;
