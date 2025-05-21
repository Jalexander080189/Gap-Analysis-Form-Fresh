import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Import all components
import ClientInformation from '@/components/ClientInformation';
import MarketAnalyst from '@/components/MarketAnalyst';
import CompanyAdvisor from '@/components/CompanyAdvisor';
import GapStrategist from '@/components/GapStrategist';
import ScenarioBuilder from '@/components/ScenarioBuilder';
import Demographics from '@/components/Demographics';
import MarketingManager from '@/components/MarketingManager';
import SBABudget from '@/components/SBABudget';
import CopywriterNotes from '@/components/CopywriterNotes';
import GPTDataBlock from '@/components/GPTDataBlock';
import ShareableLink from '@/components/ShareableLink';

const SocialFeedLayout = () => {
  const [formData, setFormData] = useState({});
  
  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('gap_analysis_form_data');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);
  
  // Save form data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('gap_analysis_form_data', JSON.stringify(formData));
  }, [formData]);
  
  // Update form data
  const updateFormData = (newData) => {
    setFormData(newData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src="/drive_logo.gif" alt="Drive Social Media" />
              <AvatarFallback>DS</AvatarFallback>
            </Avatar>
            <h1 className="text-xl font-bold">Business Gap Analysis</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Feed</Button>
            <Button variant="outline" size="sm">Analytics</Button>
            <Button variant="outline" size="sm">Clients</Button>
            <Button variant="outline" size="sm">Settings</Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Complete this form to analyze your business gaps and opportunities. All changes are automatically saved.
          </p>
        </CardContent>
      </Card>
      
      {/* Section 1: Client Information (Horizontal) */}
      <ClientInformation formData={formData} updateFormData={updateFormData} />
      
      {/* Sections 2-4: Market Overview, Company Overview, Gaps/Opportunity (Vertical and symmetrical) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <MarketAnalyst formData={formData} updateFormData={updateFormData} />
        </div>
        <div>
          <CompanyAdvisor formData={formData} updateFormData={updateFormData} />
        </div>
        <div>
          <GapStrategist formData={formData} updateFormData={updateFormData} />
        </div>
      </div>
      
      {/* Sections 5-8: Scenario, Demographics, Current Marketing, SBA Budget (Horizontal) */}
      <ScenarioBuilder formData={formData} updateFormData={updateFormData} />
      <Demographics formData={formData} updateFormData={updateFormData} />
      <MarketingManager formData={formData} updateFormData={updateFormData} />
      <SBABudget formData={formData} updateFormData={updateFormData} />
      
      {/* Section 9: Copywriter Notes (Large with ability to expand) */}
      <CopywriterNotes formData={formData} updateFormData={updateFormData} />
      
      {/* Section 10: GPT Data Block */}
      <GPTDataBlock formData={formData} updateFormData={updateFormData} />
      
      {/* Shareable Link Generator */}
      <ShareableLink formData={formData} />
      
      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>© 2025 Drive Social Media. All rights reserved.</p>
      </div>
    </div>
  );
};

export default SocialFeedLayout;
