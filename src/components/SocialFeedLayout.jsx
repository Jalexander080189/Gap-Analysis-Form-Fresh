import React, { useState, useEffect } from 'react';

// Import all section components with corrected paths
import ClientInformationSocial from './sections/social/ClientInformationSocial';
import MarketOverviewSocial from './sections/social/MarketOverviewSocial';
import CompanyOverviewSocial from './sections/social/CompanyOverviewSocial';
import GapsOpportunitySocial from './sections/social/GapsOpportunitySocial';
import ScenarioBuilderSocial from './sections/social/ScenarioBuilderSocial';
import DemographicsSocial from './sections/social/DemographicsSocial';
import MarketingChannelsSocial from './sections/social/MarketingChannelsSocial';
import SBABudgetSocial from './sections/social/SBABudgetSocial';
import CopywriterNotesSocial from './sections/social/CopywriterNotesSocial';
import GPTDataBlockSocial from './sections/social/GPTDataBlockSocial';
import ShareableLinkSocial from './sections/social/ShareableLinkSocial';

// Main SocialFeedLayout component
const SocialFeedLayout = () => {
  // State for form data
  const [formData, setFormData] = useState({});
  
  // Load saved form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('gapAnalysisFormData');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error parsing saved form data:', error);
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
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/drive_logo.gif" alt="Drive Social Media" className="h-8 w-auto mr-3" />
            <h1 className="text-xl font-bold">Gap Analysis Form</h1>
          </div>
          
          <nav>
            <ul className="flex space-x-4">
              <li className="text-blue-600 border-b-2 border-blue-600 pb-1">Home</li>
              <li className="text-gray-600 hover:text-blue-600">Reports</li>
              <li className="text-gray-600 hover:text-blue-600">Settings</li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {/* Section 1: Client Information (Horizontal) */}
        <section className="mb-8">
          <ClientInformationSocial 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        </section>
        
        {/* Sections 2-4: Market Overview, Company Overview, Gaps/Opportunity (Vertical, Symmetrical) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <MarketOverviewSocial 
              formData={formData} 
              updateFormData={updateFormData} 
            />
          </div>
          
          <div>
            <CompanyOverviewSocial 
              formData={formData} 
              updateFormData={updateFormData} 
            />
          </div>
          
          <div>
            <GapsOpportunitySocial 
              formData={formData} 
              updateFormData={updateFormData} 
            />
          </div>
        </section>
        
        {/* Sections 5-8: Scenario, Demographics, Marketing Channels, SBA Budget (Horizontal) */}
        <section className="space-y-6 mb-8">
          <ScenarioBuilderSocial 
            formData={formData} 
            updateFormData={updateFormData} 
          />
          
          <DemographicsSocial 
            formData={formData} 
            updateFormData={updateFormData} 
          />
          
          <MarketingChannelsSocial 
            formData={formData} 
            updateFormData={updateFormData} 
          />
          
          <SBABudgetSocial 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        </section>
        
        {/* Section 9: Copywriter Notes (Large with formatting) */}
        <section className="mb-8">
          <CopywriterNotesSocial 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        </section>
        
        {/* Section 10: GPT Data Block */}
        <section className="mb-8">
          <GPTDataBlockSocial 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        </section>
        
        {/* Shareable Link Generator */}
        <section className="mb-8">
          <ShareableLinkSocial 
            formData={formData} 
          />
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 Drive Social Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SocialFeedLayout;
