import React, { useState, useEffect } from 'react';
import EnhancedSocialPostCard from './EnhancedSocialPostCard';

// Import icons
const ShareableLinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

/**
 * ShareableLinkSocial - A social media styled wrapper for the Shareable Link Generator component
 * 
 * @param {Object} props
 * @param {Object} props.formData - The form data
 */
const ShareableLinkSocial = ({ formData }) => {
  // Generate a slug from company name
  const generateSlug = () => {
    if (!formData?.companyName) return '';
    
    return formData.companyName
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };
  
  const companySlug = generateSlug();
  
  // Generate shareable URL
  const generateShareableUrl = () => {
    if (!companySlug) return '';
    
    // Use window.location to get the base URL in browser environment
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}`
      : 'https://yourdomain.com';
    
    return `${baseUrl}/reports/${companySlug}`;
  };
  
  const shareableUrl = generateShareableUrl();
  
  // Copy URL to clipboard
  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl)
        .then(() => {
          alert('URL copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy URL: ', err);
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareableUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('URL copied to clipboard!');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Share This Analysis</h2>
        <button 
          onClick={copyToClipboard}
          disabled={!shareableUrl}
          className={`px-4 py-2 rounded-md flex items-center ${
            shareableUrl 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShareableLinkIcon />
          <span className="ml-2">Copy Link</span>
        </button>
      </div>
      
      {shareableUrl ? (
        <div className="bg-gray-50 p-4 rounded-lg break-all">
          <p className="text-gray-700 mb-2">Shareable URL:</p>
          <p className="font-mono text-blue-600">{shareableUrl}</p>
          <p className="text-xs text-gray-500 mt-2">
            This link provides access to a live, editable version of this analysis. 
            Anyone with this link can view and edit the data.
          </p>
        </div>
      ) : (
        <p className="text-gray-500">
          Enter a company name to generate a shareable link.
        </p>
      )}
    </div>
  );
};

export default ShareableLinkSocial;
