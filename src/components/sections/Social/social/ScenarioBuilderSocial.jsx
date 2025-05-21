import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EnhancedSocialPostCard from './EnhancedSocialPostCard';

// Import icons
const ScenarioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

/**
 * ScenarioBuilderSocial - A social media styled wrapper for the Scenario component
 * 
 * @param {Object} props
 * @param {Object} props.formData - The form data
 * @param {Function} props.updateFormData - Function to update form data
 */
const ScenarioBuilderSocial = ({ formData, updateFormData }) => {
  // Get the funnel type from form data
  const funnelType = formData?.funnelType || 'leadGen';
  
  // Determine labels based on funnel type
  const getLabels = () => {
    if (funnelType === 'retail') {
      return {
        visibility: 'Store Traffic Improvement',
        conversion: 'Purchase Rate Improvement',
        retention: 'Repeat Customer Rate Improvement'
      };
    }
    return {
      visibility: 'Visibility Improvement',
      conversion: 'Lead Conversion Improvement',
      closing: 'Closing Rate Improvement'
    };
  };
  
  const labels = getLabels();
  
  // Scenario state
  const [visibilityImprovement, setVisibilityImprovement] = useState(25);
  const [conversionImprovement, setConversionImprovement] = useState(15);
  const [closingImprovement, setClosingImprovement] = useState(10);
  
  // Calculate projected results
  const calculateResults = () => {
    const currentRevenue = parseFloat(formData?.annualRevenue || 2500000);
    const totalImprovement = (1 + visibilityImprovement/100) * 
                            (1 + conversionImprovement/100) * 
                            (1 + closingImprovement/100) - 1;
    
    const projectedRevenue = currentRevenue * (1 + totalImprovement);
    const revenueIncrease = projectedRevenue - currentRevenue;
    const growthPercentage = totalImprovement * 100;
    
    return {
      currentRevenue: currentRevenue.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}),
      projectedRevenue: projectedRevenue.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}),
      revenueIncrease: revenueIncrease.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}),
      growthPercentage: growthPercentage.toFixed(0) + '%'
    };
  };
  
  const results = calculateResults();
  
  // Update form data when scenario changes
  useEffect(() => {
    const scenarioData = {
      visibilityImprovement,
      conversionImprovement,
      closingImprovement,
      projectedResults: calculateResults()
    };
    
    updateFormData({
      ...formData,
      scenario: scenarioData
    });
  }, [visibilityImprovement, conversionImprovement, closingImprovement]);
  
  return (
    <EnhancedSocialPostCard
      title="Scenario Builder"
      icon={<ScenarioIcon />}
      iconBg="bg-indigo-100"
      iconColor="text-indigo-800"
      id="scenario-builder"
      enhancedReactions={true}
    >
      <p className="text-gray-700 mb-3">
        What if we improved our marketing funnel? Let's run some scenarios:
      </p>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-3">Scenario Builder</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {labels.visibility}
            </label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={visibilityImprovement} 
                onChange={(e) => setVisibilityImprovement(parseInt(e.target.value))}
                className="w-full mr-2"
              />
              <span className="text-sm font-medium">{visibilityImprovement}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {funnelType === 'retail' ? 'Increase in store visitors' : 'Increase in website visitors'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {labels.conversion}
            </label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={conversionImprovement} 
                onChange={(e) => setConversionImprovement(parseInt(e.target.value))}
                className="w-full mr-2"
              />
              <span className="text-sm font-medium">{conversionImprovement}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {funnelType === 'retail' ? 'Increase in purchase rate' : 'Increase in lead conversion rate'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {labels.closing}
            </label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={closingImprovement} 
                onChange={(e) => setClosingImprovement(parseInt(e.target.value))}
                className="w-full mr-2"
              />
              <span className="text-sm font-medium">{closingImprovement}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {funnelType === 'retail' ? 'Increase in repeat customer rate' : 'Increase in lead-to-customer conversion'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-3">Scenario Results</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Current Annual Revenue</p>
            <p className="text-xl font-bold">{results.currentRevenue}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Projected Annual Revenue</p>
            <p className="text-xl font-bold text-green-600">{results.projectedRevenue}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Revenue Increase</p>
            <p className="text-xl font-bold text-green-600">{results.revenueIncrease}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Growth Percentage</p>
            <p className="text-xl font-bold text-green-600">+{results.growthPercentage}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${Math.min(parseInt(results.growthPercentage), 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>Current</span>
            <span>Projected</span>
          </div>
        </div>
      </div>
    </EnhancedSocialPostCard>
  );
};

export default ScenarioBuilderSocial;
