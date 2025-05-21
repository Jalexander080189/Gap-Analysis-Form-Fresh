import React, { useState, useEffect } from 'react';
import SocialPostCard from './SocialPostCard';
import EnhancedSocialPostCard from './EnhancedSocialPostCard';
import ClientInformationSocial from './ClientInformationSocial';
import MarketOverviewSocial from './MarketOverviewSocial';
import CompanyOverviewSocial from './CompanyOverviewSocial';
import GapsOpportunitySocial from './GapsOpportunitySocial';
import ScenarioBuilderSocial from './ScenarioBuilderSocial';
import DemographicsSocial from './DemographicsSocial';
import MarketingChannelsSocial from './MarketingChannelsSocial';
import SBABudgetSocial from './SBABudgetSocial';
import CopywriterNotesSocial from './CopywriterNotesSocial';
import GPTDataBlockSocial from './GPTDataBlockSocial';
import ShareableLinkSocial from './ShareableLinkSocial';

/**
 * SocialFeedLayout - Main layout component for the social media newsfeed style Gap Analysis Form
 */
const SocialFeedLayout = () => {
  // Form data state
  const [formData, setFormData] = useState({});
  
  // Load form data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('gapAnalysisFormData');
    if (storedData) {
      try {
        setFormData(JSON.parse(storedData));
      } catch (error) {
        console.error('Error parsing stored form data:', error);
      }
    }
  }, []);
  
  // Update form data and save to localStorage
  const updateFormData = (newData) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);
    localStorage.setItem('gapAnalysisFormData', JSON.stringify(updatedData));
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/drive_logo.gif" alt="Drive Social Media" className="h-8 w-auto mr-3" />
            <h1 className="text-xl font-bold">Business Gap Analysis</h1>
          </div>
          
          <nav className="flex space-x-2">
            <button className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-50">Feed</button>
            <button className="px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50">Analytics</button>
            <button className="px-3 py-1 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50">Clients</button>
            <button className="px-3 py-1 border border-purple-500 text-purple-500 rounded-md hover:bg-purple-50">Settings</button>
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Section 1: Client Information (horizontal) */}
          <ClientInformationSocial formData={formData} updateFormData={updateFormData} />
          
          {/* Sections 2-4: Market Overview, Company Overview, Gaps/Opportunity (vertical, symmetrical) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MarketOverviewSocial formData={formData} updateFormData={updateFormData} />
            <CompanyOverviewSocial formData={formData} updateFormData={updateFormData} />
            <GapsOpportunitySocial formData={formData} updateFormData={updateFormData} />
          </div>
          
          {/* Sections 5-8: Scenario, Demographics, Marketing Channels, SBA Budget (horizontal) */}
          <ScenarioBuilderSocial formData={formData} updateFormData={updateFormData} />
          <DemographicsSocial formData={formData} updateFormData={updateFormData} />
          <MarketingChannelsSocial formData={formData} updateFormData={updateFormData} />
          <SBABudgetSocial formData={formData} updateFormData={updateFormData} />
          
          {/* Section 9: Copywriter Notes (large with formatting) */}
          <CopywriterNotesSocial formData={formData} updateFormData={updateFormData} />
          
          {/* Section 10: GPT Data Block */}
          <GPTDataBlockSocial formData={formData} updateFormData={updateFormData} />
          
          {/* Shareable Link Generator */}
          <ShareableLinkSocial formData={formData} />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-sm text-gray-500">© 2025 Drive Social Media. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SocialFeedLayout;
