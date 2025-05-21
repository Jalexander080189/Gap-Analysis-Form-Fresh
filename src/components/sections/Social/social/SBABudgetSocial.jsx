import React, { useState, useEffect } from 'react';
import EnhancedSocialPostCard from './EnhancedSocialPostCard';

// Import icons
const SBABudgetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/**
 * SBABudgetSocial - A social media styled wrapper for the SBA Budget component
 * 
 * @param {Object} props
 * @param {Object} props.formData - The form data
 * @param {Function} props.updateFormData - Function to update form data
 */
const SBABudgetSocial = ({ formData, updateFormData }) => {
  // Get annual revenue and growth rate from form data
  const annualRevenue = parseFloat(formData?.annualRevenue || 2500000);
  const growthRate = parseFloat(formData?.scenario?.projectedResults?.growthPercentage || 45);
  
  // Calculate 5-year forecast
  const calculateForecast = () => {
    const forecast = [];
    let yearlyRevenue = annualRevenue;
    
    for (let year = 1; year <= 5; year++) {
      const marketingBudget = yearlyRevenue * 0.08;
      const monthlyBudget = marketingBudget / 12;
      
      forecast.push({
        year,
        revenue: yearlyRevenue.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}),
        marketingBudget: marketingBudget.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}),
        monthlyBudget: monthlyBudget.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})
      });
      
      // Apply growth rate for next year
      yearlyRevenue = yearlyRevenue * (1 + (growthRate / 100));
    }
    
    return forecast;
  };
  
  const forecast = calculateForecast();
  
  // Update form data when forecast changes
  useEffect(() => {
    updateFormData({
      ...formData,
      sbaBudgetForecast: forecast
    });
  }, [annualRevenue, growthRate]);
  
  return (
    <EnhancedSocialPostCard
      title="SBA Marketing Budget"
      icon={<SBABudgetIcon />}
      iconBg="bg-red-100"
      iconColor="text-red-800"
      id="sba-budget"
      enhancedReactions={true}
    >
      <p className="text-gray-700 mb-4">5 Year Marketing Budget Forecast:</p>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marketing Budget (8%)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Budget</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {forecast.map((year) => (
              <tr key={year.year}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">Year {year.year}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{year.revenue}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{year.marketingBudget}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{year.monthlyBudget}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-3">5 Year Growth Projection</h3>
        
        <div className="h-40 bg-white p-2 rounded border border-gray-200 flex items-center justify-center">
          <div className="w-full h-32 relative">
            {/* Simple bar chart visualization */}
            {forecast.map((year, index) => {
              const height = 20 + (index * 20); // Increasing height for each year
              return (
                <div key={year.year} className="absolute bottom-0" style={{ left: `${index * 20}%`, height: `${height}%`, width: '15%' }}>
                  <div className="bg-blue-500 h-full rounded-t"></div>
                  <div className="text-xs text-center mt-1">Year {year.year}</div>
                </div>
              );
            })}
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          This projection assumes consistent {growthRate}% year-over-year growth with 8% of revenue allocated to marketing.
        </p>
      </div>
    </EnhancedSocialPostCard>
  );
};

export default SBABudgetSocial;
