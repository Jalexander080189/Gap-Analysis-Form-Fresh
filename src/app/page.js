"use client";

import React, { useState } from 'react';
import { CompanyGapAnalysisForm } from '@/components/CompanyGapAnalysisForm';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ClientInformation from '@/components/sections/ClientInformation';
import MarketOverview from '@/components/sections/MarketOverview';
import CompanyOverview from '@/components/sections/CompanyOverview';
import GapsOpportunity from '@/components/sections/GapsOpportunity';
import Demographics from '@/components/sections/Demographics';
import Scenario from '@/components/sections/Scenario';
import SBABudget from '@/components/sections/SBABudget';
import MarketingChannels from '@/components/sections/MarketingChannels';
import GPTData from '@/components/sections/GPTData';

// Import your form schema from CompanyGapAnalysisForm
import { formSchema } from '@/components/CompanyGapAnalysisForm';

export default function Home() {
  const [activeComponent, setActiveComponent] = useState(null);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      marketingChannels: [{ channelName: '', monthlySpend: undefined, notes: '' }],
      targetAudienceType: undefined,
      gptDataBlock: '', 
      industry: '',
      industryOther: '',
      audienceSize: undefined,
      buyerRate: undefined,
      annualCustomerValue: undefined,
      lookerStudioLink: '',
      funnelType: "leadGen",
      websiteVisitors: undefined,
      leads: undefined,
      newClosedAccounts: undefined,
      visibilityIncrease: undefined,
      leadConversionIncrease: undefined,
      closeRateIncrease: undefined,
    }
  });

  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
    // Handle form submission
  };

  const renderComponent = () => {
    switch(activeComponent) {
      case 'client':
        return <ClientInformation />;
      case 'market':
        return <MarketOverview />;
      case 'company':
        return <CompanyOverview />;
      case 'gaps':
        return <GapsOpportunity />;
      case 'scenario':
        return <Scenario />;
      case 'demographics':
        return <Demographics />;
      case 'marketing':
        return <MarketingChannels />;
      case 'sba':
        return <SBABudget />;
      case 'gpt':
        return <GPTData />;
      default:
        return <div className="p-6 text-center">Select a component to view</div>;
    }
  };

  return (
    <main className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Business Gap Analysis</h1>
      <p className="text-center text-gray-600 mb-8">Complete the form to analyze business gaps and opportunities</p>
      
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-6">
              <button 
                type="button"
                onClick={() => setActiveComponent(null)}
                className={`px-4 py-2 rounded-md ${!activeComponent ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Overview
              </button>
              <button 
                type="button"
                onClick={() => setActiveComponent('client')}
                className={`px-4 py-2 rounded-md ${activeComponent === 'client' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Client Information
              </button>
              <button 
                type="button"
                onClick={() => setActiveComponent('market')}
                className={`px-4 py-2 rounded-md ${activeComponent === 'market' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Market Overview
              </button>
              <button 
                type="button"
                onClick={() => setActiveComponent('company')}
                className={`px-4 py-2 rounded-md ${activeComponent === 'company' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Company Overview
              </button>
              <button 
                type="button"
                onClick={() => setActiveComponent('gaps')}
                className={`px-4 py-2 rounded-md ${activeComponent === 'gaps' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Gaps & Opportunity
              </button>
              <button 
                type="button"
                onClick={() => setActiveComponent('scenario')}
                className={`px-4 py-2 rounded-md ${activeComponent === 'scenario' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Scenario
              </button>
              <button 
                type="button"
                onClick={() => setActiveComponent('demographics')}
                className={`px-4 py-2 rounded-md ${activeComponent === 'demographics' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Demographics
              </button>
              <button 
                type="button"
                onClick={() => setActiveComponent('marketing')}
                className={`px-4 py-2 rounded-md ${activeComponent === 'marketing' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                Marketing Channels
              </button>
              <button 
                type="button"
                onClick={() => setActiveComponent('sba')}
                className={`px-4 py-2 rounded-md ${activeComponent === 'sba' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                SBA Budget
              </button>
              <button 
                type="button"
                onClick={() => setActiveComponent('gpt')}
                className={`px-4 py-2 rounded-md ${activeComponent === 'gpt' ? 'bg-primary text-white' : 'bg-gray-200'}`}
              >
                GPT Data
              </button>
            </div>
            
            <div className="border rounded-lg shadow-sm">
              {renderComponent()}
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <button 
              type="submit" 
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Save Analysis
            </button>
          </div>
        </form>
      </FormProvider>
    </main>
  );
}
