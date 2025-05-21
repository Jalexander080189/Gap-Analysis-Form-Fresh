import React, { useState, useEffect } from 'react';
import SocialPostCard from './SocialPostCard';

// Import icons
const ClientInfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

/**
 * ClientInformationSocial - A social media styled wrapper for the Client Information component
 * 
 * @param {Object} props
 * @param {Object} props.formData - The form data
 * @param {Function} props.updateFormData - Function to update form data
 */
const ClientInformationSocial = ({ formData, updateFormData }) => {
  // Client information state
  const [companyName, setCompanyName] = useState(formData?.companyName || '');
  const [website, setWebsite] = useState(formData?.website || '');
  const [industry, setIndustry] = useState(formData?.industry || '');
  const [primaryOwner, setPrimaryOwner] = useState(formData?.primaryOwner || '');
  const [coOwners, setCoOwners] = useState(formData?.coOwners || '');
  const [founded, setFounded] = useState(formData?.founded || '');
  const [funnelType, setFunnelType] = useState(formData?.funnelType || 'leadGen');
  
  // Calculate profile completion percentage
  const calculateCompletionPercentage = () => {
    const fields = [companyName, website, industry, primaryOwner, coOwners, founded];
    const filledFields = fields.filter(field => field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };
  
  const completionPercentage = calculateCompletionPercentage();
  
  // Update form data when client information changes
  useEffect(() => {
    updateFormData({
      ...formData,
      companyName,
      website,
      industry,
      primaryOwner,
      coOwners,
      founded,
      funnelType,
      completionPercentage
    });
  }, [companyName, website, industry, primaryOwner, coOwners, founded, funnelType]);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {/* Cover photo */}
      <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-24 h-24 rounded-full bg-white p-1">
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {companyName ? (
                <span className="text-3xl font-bold text-gray-700">
                  {companyName.charAt(0)}
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
            </div>
          </div>
        </div>
        
        <button className="absolute top-4 right-4 px-3 py-1 bg-white bg-opacity-90 rounded-md text-sm font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Profile
        </button>
      </div>
      
      {/* Profile info */}
      <div className="pt-16 px-6 pb-6">
        <h2 className="text-2xl font-bold text-center mb-1">
          {companyName || 'Your Company'}
        </h2>
        <p className="text-gray-500 text-center mb-6">
          {industry || 'Industry'} • {founded ? `Founded ${founded}` : 'Founded Year'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input 
              type="text" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Acme Corporation" 
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input 
              type="text" 
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., Technology" 
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input 
              type="text" 
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="e.g., www.acmecorp.com" 
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Founded</label>
            <input 
              type="text" 
              value={founded}
              onChange={(e) => setFounded(e.target.value)}
              placeholder="e.g., 2010" 
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Owner</label>
            <input 
              type="text" 
              value={primaryOwner}
              onChange={(e) => setPrimaryOwner(e.target.value)}
              placeholder="e.g., John Smith" 
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Co-Owners</label>
            <input 
              type="text" 
              value={coOwners}
              onChange={(e) => setCoOwners(e.target.value)}
              placeholder="e.g., Jane Doe, Bob Johnson" 
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Model Type</label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input 
                type="radio" 
                id="leadGen" 
                name="funnelType" 
                value="leadGen" 
                checked={funnelType === 'leadGen'}
                onChange={() => setFunnelType('leadGen')}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="leadGen" className="ml-2">Lead Generation</label>
            </div>
            <div className="flex items-center">
              <input 
                type="radio" 
                id="retail" 
                name="funnelType" 
                value="retail" 
                checked={funnelType === 'retail'}
                onChange={() => setFunnelType('retail')}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="retail" className="ml-2">Retail</label>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This setting affects what's displayed in the Gaps/Opportunity and Scenario Builder sections. 
            Select "Retail" for businesses like restaurants and bars that don't use leads.
          </p>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-600 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 p-4 flex justify-between">
        <button className="flex items-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Like
        </button>
        
        <button className="flex items-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comment
        </button>
      </div>
    </div>
  );
};

export default ClientInformationSocial;
