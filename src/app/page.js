"use client";

import { useState } from 'react';

// We'll test each component one by one
const TestComponent = () => {
  const [activeComponent, setActiveComponent] = useState('none');
  
  // Helper function to dynamically import components
  const renderComponent = () => {
    try {
      switch (activeComponent) {
        case 'ClientInformation':
          const ClientInformation = require('../components/sections/ClientInformation').default;
          return <ClientInformation formData={{}} setFormData={() => {}} />;
        case 'MarketOverview':
          const MarketOverview = require('../components/sections/MarketOverview').default;
          return <MarketOverview formData={{}} setFormData={() => {}} />;
        case 'CompanyOverview':
          const CompanyOverview = require('../components/sections/CompanyOverview').default;
          return <CompanyOverview formData={{}} setFormData={() => {}} />;
        case 'GapsOpportunity':
          const GapsOpportunity = require('../components/sections/GapsOpportunity').default;
          return <GapsOpportunity formData={{}} setFormData={() => {}} />;
        case 'Scenario':
          const Scenario = require('../components/sections/Scenario').default;
          return <Scenario formData={{}} setFormData={() => {}} />;
        case 'Demographics':
          const Demographics = require('../components/sections/Demographics').default;
          return <Demographics formData={{}} setFormData={() => {}} />;
        case 'MarketingChannels':
          const MarketingChannels = require('../components/sections/MarketingChannels').default;
          return <MarketingChannels formData={{}} setFormData={() => {}} />;
        case 'SBABudget':
          const SBABudget = require('../components/sections/SBABudget').default;
          return <SBABudget formData={{}} setFormData={() => {}} />;
        case 'GPTData':
          const GPTData = require('../components/sections/GPTData').default;
          return <GPTData formData={{}} setFormData={() => {}} />;
        default:
          return <div>Select a component to test</div>;
      }
    } catch (error) {
      return <div>Error loading component: {error.message}</div>;
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-white text-black">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">Business Gap Analysis</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Component Tester</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setActiveComponent('none')} className="px-3 py-1 bg-gray-200 rounded">None</button>
          <button onClick={() => setActiveComponent('ClientInformation')} className="px-3 py-1 bg-gray-200 rounded">Client Information</button>
          <button onClick={() => setActiveComponent('MarketOverview')} className="px-3 py-1 bg-gray-200 rounded">Market Overview</button>
          <button onClick={() => setActiveComponent('CompanyOverview')} className="px-3 py-1 bg-gray-200 rounded">Company Overview</button>
          <button onClick={() => setActiveComponent('GapsOpportunity')} className="px-3 py-1 bg-gray-200 rounded">Gaps & Opportunity</button>
          <button onClick={() => setActiveComponent('Scenario')} className="px-3 py-1 bg-gray-200 rounded">Scenario</button>
          <button onClick={() => setActiveComponent('Demographics')} className="px-3 py-1 bg-gray-200 rounded">Demographics</button>
          <button onClick={() => setActiveComponent('MarketingChannels')} className="px-3 py-1 bg-gray-200 rounded">Marketing Channels</button>
          <button onClick={() => setActiveComponent('SBABudget')} className="px-3 py-1 bg-gray-200 rounded">SBA Budget</button>
          <button onClick={() => setActiveComponent('GPTData')} className="px-3 py-1 bg-gray-200 rounded">GPT Data</button>
        </div>
        
        <div className="border p-4 rounded-lg min-h-64">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return <TestComponent />;
}