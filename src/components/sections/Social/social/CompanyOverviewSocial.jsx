import React, { useState, useEffect } from 'react';
import SocialPostCard from './SocialPostCard';

// Import icons
const CompanyOverviewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

/**
 * CompanyOverviewSocial - A social media styled wrapper for the Company Overview component
 * 
 * @param {Object} props
 * @param {Object} props.formData - The form data
 * @param {Function} props.updateFormData - Function to update form data
 */
const CompanyOverviewSocial = ({ formData, updateFormData }) => {
  // Company overview state
  const [annualRevenue, setAnnualRevenue] = useState(formData?.annualRevenue || '');
  const [percentNew, setPercentNew] = useState(formData?.percentNew || '');
  const [percentCurrent, setPercentCurrent] = useState(formData?.percentCurrent || '');
  
  // Calculate company metrics
  const calculateCompanyMetrics = () => {
    const revenue = parseFloat(annualRevenue) || 0;
    const newPct = parseFloat(percentNew) || 0;
    const currentPct = parseFloat(percentCurrent) || 0;
    
    const newCustomers = Math.round(revenue * (newPct / 100));
    const currentCustomers = Math.round(revenue * (currentPct / 100));
    
    // Calculate market share
    const totalMarketRevenue = parseFloat(formData?.marketMetrics?.totalMarketRevenue?.replace(/[^0-9.]/g, '')) || 0;
    const marketSharePct = totalMarketRevenue > 0 ? (revenue / totalMarketRevenue) * 100 : 0;
    const marketShareGap = 100 - marketSharePct;
    
    return {
      newCustomers: newCustomers.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}),
      currentCustomers: currentCustomers.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}),
      marketSharePct: marketSharePct.toFixed(1) + '%',
      marketShareGap: marketShareGap.toFixed(1) + '%'
    };
  };
  
  const companyMetrics = calculateCompanyMetrics();
  
  // Update form data when company overview values change
  useEffect(() => {
    updateFormData({
      ...formData,
      annualRevenue,
      percentNew,
      percentCurrent,
      companyMetrics: calculateCompanyMetrics()
    });
  }, [annualRevenue, percentNew, percentCurrent, formData?.marketMetrics?.totalMarketRevenue]);
  
  return (
    <SocialPostCard
      title="Company Overview"
      icon={<CompanyOverviewIcon />}
      iconBg="bg-indigo-100"
      iconColor="text-indigo-800"
      id="company-overview"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue</label>
          <input 
            type="text" 
            value={annualRevenue}
            onChange={(e) => setAnnualRevenue(e.target.value)}
            placeholder="e.g., 2500000" 
            className="p-2 w-full border border-gray-300 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Total annual company revenue</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">% New</label>
          <input 
            type="text" 
            value={percentNew}
            onChange={(e) => setPercentNew(e.target.value)}
            placeholder="e.g., 30" 
            className="p-2 w-full border border-gray-300 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Percentage from new customers</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">% Current</label>
          <input 
            type="text" 
            value={percentCurrent}
            onChange={(e) => setPercentCurrent(e.target.value)}
            placeholder="e.g., 70" 
            className="p-2 w-full border border-gray-300 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Percentage from existing customers</p>
        </div>
      </div>
      
      {/* Display calculated metrics if inputs are provided */}
      {annualRevenue && (percentNew || percentCurrent) && (
        <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-medium text-indigo-800 mb-3">Company Analysis:</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">New Customer Revenue</p>
                <p className="text-xl font-bold">{companyMetrics.newCustomers}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Customer Revenue</p>
                <p className="text-xl font-bold">{companyMetrics.currentCustomers}</p>
              </div>
            </div>
            
            {formData?.marketMetrics?.totalMarketRevenue && (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Market Share</span>
                  <span className="text-sm font-medium">{companyMetrics.marketSharePct}</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-indigo-600 rounded-full" 
                    style={{ width: companyMetrics.marketSharePct }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Market Share Gap: {companyMetrics.marketShareGap}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </SocialPostCard>
  );
};

export default CompanyOverviewSocial;
