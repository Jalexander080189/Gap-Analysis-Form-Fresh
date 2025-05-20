"use client";

import { useState } from 'react';
import useGapAnalysisForm from '../hooks/useGapAnalysisForm';
import ClientInformation from '../components/sections/ClientInformation';
import MarketOverview from '../components/sections/MarketOverview';
import CompanyOverview from '../components/sections/CompanyOverview';
import GapsOpportunity from '../components/sections/GapsOpportunity';
import Scenario from '../components/sections/Scenario';
import Demographics from '../components/sections/Demographics';
import MarketingChannels from '../components/sections/MarketingChannels';
import SBABudget from '../components/sections/SBABudget';
import GPTData from '../components/sections/GPTData';

export default function Home() {
  // Initialize the form state using the hook
  const { 
    formData, 
    setFormDataWithTracking, 
    handleSubmit,
    saveReport,
    isSaving,
    saveSuccess,
    reportUrl,
    isFieldFromParsedData = () => false
  } = useGapAnalysisForm();

  // For navigation between sections
  const [activeSection, setActiveSection] = useState(0);
  const sections = [
    { id: 0, name: "Client Information", component: ClientInformation },
    { id: 1, name: "Market Overview", component: MarketOverview },
    { id: 2, name: "Company Overview", component: CompanyOverview },
    { id: 3, name: "Gaps & Opportunity", component: GapsOpportunity },
    { id: 4, name: "Scenario", component: Scenario },
    { id: 5, name: "Demographics", component: Demographics },
    { id: 6, name: "Marketing Channels", component: MarketingChannels },
    { id: 7, name: "SBA Budget", component: SBABudget },
    { id: 8, name: "GPT Data", component: GPTData }
  ];

  // Navigate to next/previous section
  const nextSection = () => {
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
      window.scrollTo(0, 0);
    }
  };

  // Render the current section component
  const CurrentSection = sections[activeSection].component;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-white text-black">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">Business Gap Analysis</h1>
      
      {/* Save success message */}
      {saveSuccess && (
        <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-800">
          <p className="font-medium">Report saved successfully!</p>
          <p>You can view and share your report at: <a href={reportUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{reportUrl}</a></p>
        </div>
      )}
      
      {/* Section navigation */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap
                ${activeSection === section.id 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              {section.name}
            </button>
          ))}
        </div>
        <div className="h-1 bg-blue-600"></div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Render current section */}
        <CurrentSection 
          formData={formData} 
          setFormData={setFormDataWithTracking} 
          isFieldFromParsedData={isFieldFromParsedData}
        />
        
        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          <button 
            type="button" 
            onClick={prevSection}
            className={`px-6 py-2 rounded-md transition-colors text-black ${
              activeSection > 0 
                ? "bg-gray-300 hover:bg-gray-400" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={activeSection === 0}
          >
            Previous
          </button>
          
          <div className="flex gap-3">
            {/* Save Report Button */}
            <button
              type="button"
              onClick={saveReport}
              disabled={isSaving || !formData.clientInfo?.companyName}
              className={`px-6 py-2 rounded-md transition-colors text-white
                ${isSaving 
                  ? "bg-gray-400 cursor-wait" 
                  : !formData.clientInfo?.companyName
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"}`}
            >
              {isSaving ? "Saving..." : "Save Report"}
            </button>
            
            {activeSection < sections.length - 1 ? (
              <button 
                type="button" 
                onClick={nextSection}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit Analysis
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}