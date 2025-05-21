import React, { useState, useEffect } from 'react';
import EnhancedSocialPostCard from './EnhancedSocialPostCard';

// Import icons
const DemographicsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

/**
 * DemographicsSocial - A social media styled wrapper for the Demographics component
 * 
 * @param {Object} props
 * @param {Object} props.formData - The form data
 * @param {Function} props.updateFormData - Function to update form data
 */
const DemographicsSocial = ({ formData, updateFormData }) => {
  // Demographics state
  const [businessType, setBusinessType] = useState(formData?.demographics?.businessType || 'b2b');
  const [targetSize, setTargetSize] = useState(formData?.demographics?.targetSize || '');
  const [industryFocus, setIndustryFocus] = useState(formData?.demographics?.industryFocus || '');
  const [decisionMakers, setDecisionMakers] = useState(formData?.demographics?.decisionMakers || '');
  const [geographicFocus, setGeographicFocus] = useState(formData?.demographics?.geographicFocus || '');

  // Update form data when demographics change
  useEffect(() => {
    const demographicsData = {
      businessType,
      targetSize,
      industryFocus,
      decisionMakers,
      geographicFocus
    };
    
    updateFormData({
      ...formData,
      demographics: demographicsData
    });
  }, [businessType, targetSize, industryFocus, decisionMakers, geographicFocus]);

  return (
    <EnhancedSocialPostCard
      title="Demographics"
      icon={<DemographicsIcon />}
      iconBg="bg-teal-100"
      iconColor="text-teal-800"
      id="demographics"
      enhancedReactions={true}
    >
      <p className="text-gray-700 mb-4">Target audience demographics:</p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Business Type</label>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <input 
              type="radio" 
              id="b2b" 
              name="businessType" 
              value="b2b" 
              checked={businessType === 'b2b'}
              onChange={() => setBusinessType('b2b')}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="b2b" className="ml-2">B2B</label>
          </div>
          <div className="flex items-center">
            <input 
              type="radio" 
              id="b2c" 
              name="businessType" 
              value="b2c" 
              checked={businessType === 'b2c'}
              onChange={() => setBusinessType('b2c')}
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="b2c" className="ml-2">B2C</label>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            {businessType === 'b2b' ? 'Target Company Size' : 'Target Age Group'}
          </label>
          <input 
            type="text" 
            value={targetSize}
            onChange={(e) => setTargetSize(e.target.value)}
            placeholder={businessType === 'b2b' ? 'e.g., 50-200 employees' : 'e.g., 25-45 years old'} 
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">
            {businessType === 'b2b' ? 'Industry Focus' : 'Interest Categories'}
          </label>
          <input 
            type="text" 
            value={industryFocus}
            onChange={(e) => setIndustryFocus(e.target.value)}
            placeholder={businessType === 'b2b' ? 'e.g., Healthcare, Technology, Finance' : 'e.g., Fitness, Travel, Technology'} 
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">
            {businessType === 'b2b' ? 'Decision Makers' : 'Buying Personas'}
          </label>
          <input 
            type="text" 
            value={decisionMakers}
            onChange={(e) => setDecisionMakers(e.target.value)}
            placeholder={businessType === 'b2b' ? 'e.g., CTO, IT Director, HR Manager' : 'e.g., Young Professionals, Parents, Retirees'} 
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Geographic Focus</label>
          <input 
            type="text" 
            value={geographicFocus}
            onChange={(e) => setGeographicFocus(e.target.value)}
            placeholder="e.g., North America, Global, Midwest US" 
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
      </div>
    </EnhancedSocialPostCard>
  );
};

export default DemographicsSocial;
