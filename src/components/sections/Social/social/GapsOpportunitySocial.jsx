import React, { useState, useEffect } from 'react';
import SocialPostCard from './SocialPostCard';

// Import icons
const GapsOpportunityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

/**
 * GapsOpportunitySocial - A social media styled wrapper for the Gaps/Opportunity component
 * that adapts based on the selected funnel type (Lead Generation or Retail)
 * 
 * @param {Object} props
 * @param {Object} props.formData - The form data
 * @param {Function} props.updateFormData - Function to update form data
 */
const GapsOpportunitySocial = ({ formData, updateFormData }) => {
  // Get funnel type from form data
  const funnelType = formData?.funnelType || 'leadGen';
  
  // State for Lead Generation model
  const [websiteVisitors, setWebsiteVisitors] = useState(formData?.gapsOpportunity?.websiteVisitors || '');
  const [leads, setLeads] = useState(formData?.gapsOpportunity?.leads || '');
  const [closedAccounts, setClosedAccounts] = useState(formData?.gapsOpportunity?.closedAccounts || '');
  
  // State for Retail model
  const [storeVisitors, setStoreVisitors] = useState(formData?.gapsOpportunity?.storeVisitors || '');
  const [purchasers, setPurchasers] = useState(formData?.gapsOpportunity?.purchasers || '');
  const [repeatCustomers, setRepeatCustomers] = useState(formData?.gapsOpportunity?.repeatCustomers || '');
  
  // Calculate gaps based on funnel type
  const calculateGaps = () => {
    if (funnelType === 'leadGen') {
      // Lead Generation calculations
      const visitors = parseInt(websiteVisitors) || 0;
      const leadsCount = parseInt(leads) || 0;
      const closed = parseInt(closedAccounts) || 0;
      
      const visibilityGap = visitors > 0 ? ((formData?.audienceSize || 0) - visitors) / (formData?.audienceSize || 1) * 100 : 95;
      const leadConversionGap = visitors > 0 ? ((visitors - leadsCount) / visitors) * 100 : 95;
      const closingRateGap = leadsCount > 0 ? ((leadsCount - closed) / leadsCount) * 100 : 80;
      
      return {
        visibilityGap: visibilityGap.toFixed(1) + '%',
        leadConversionGap: leadConversionGap.toFixed(1) + '%',
        closingRateGap: closingRateGap.toFixed(1) + '%',
        visibilityGapDesc: '% of buyers who didn\'t see you',
        leadConversionGapDesc: '% who didn\'t leave info',
        closingRateGapDesc: '% of hot leads we say no to'
      };
    } else {
      // Retail calculations
      const visitors = parseInt(storeVisitors) || 0;
      const purchase = parseInt(purchasers) || 0;
      const repeat = parseInt(repeatCustomers) || 0;
      
      const trafficGap = visitors > 0 ? ((formData?.audienceSize || 0) - visitors) / (formData?.audienceSize || 1) * 100 : 95;
      const purchaseRateGap = visitors > 0 ? ((visitors - purchase) / visitors) * 100 : 90;
      const repeatRateGap = purchase > 0 ? ((purchase - repeat) / purchase) * 100 : 70;
      
      return {
        trafficGap: trafficGap.toFixed(1) + '%',
        purchaseRateGap: purchaseRateGap.toFixed(1) + '%',
        repeatRateGap: repeatRateGap.toFixed(1) + '%',
        trafficGapDesc: '% of potential customers who don\'t visit',
        purchaseRateGapDesc: '% of visitors who don\'t purchase',
        repeatRateGapDesc: '% of customers who don\'t return'
      };
    }
  };
  
  const gaps = calculateGaps();
  
  // Update form data when gaps/opportunity values change
  useEffect(() => {
    const gapsOpportunityData = funnelType === 'leadGen' 
      ? {
          websiteVisitors,
          leads,
          closedAccounts,
          gaps: calculateGaps()
        }
      : {
          storeVisitors,
          purchasers,
          repeatCustomers,
          gaps: calculateGaps()
        };
    
    updateFormData({
      ...formData,
      gapsOpportunity: gapsOpportunityData
    });
  }, [websiteVisitors, leads, closedAccounts, storeVisitors, purchasers, repeatCustomers, funnelType]);
  
  return (
    <SocialPostCard
      title="Gaps/Opportunity"
      icon={<GapsOpportunityIcon />}
      iconBg="bg-green-100"
      iconColor="text-green-800"
      id="gaps-opportunity"
    >
      <p className="text-gray-700 mb-4">
        Business Model: <span className="font-medium">{funnelType === 'leadGen' ? 'Lead Generation' : 'Retail'}</span>
      </p>
      
      <p className="text-gray-700 mb-4">
        {funnelType === 'leadGen' 
          ? 'Analyzing lead generation funnel gaps and opportunities.' 
          : 'Analyzing retail business gaps and opportunities.'}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {funnelType === 'leadGen' ? (
          // Lead Generation inputs
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website Visitors</label>
              <input 
                type="text" 
                value={websiteVisitors}
                onChange={(e) => setWebsiteVisitors(e.target.value)}
                placeholder="e.g., 5000" 
                className="p-2 w-full border border-gray-300 rounded"
              />
              <p className="text-xs text-gray-500 mt-1">Monthly website visitors</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leads</label>
              <input 
                type="text" 
                value={leads}
                onChange={(e) => setLeads(e.target.value)}
                placeholder="e.g., 250" 
                className="p-2 w-full border border-gray-300 rounded"
              />
              <p className="text-xs text-gray-500 mt-1">Monthly leads generated</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Closed Accounts</label>
              <input 
                type="text" 
                value={closedAccounts}
                onChange={(e) => setClosedAccounts(e.target.value)}
                placeholder="e.g., 50" 
                className="p-2 w-full border border-gray-300 rounded"
              />
              <p className="text-xs text-gray-500 mt-1">Monthly closed deals</p>
            </div>
          </>
        ) : (
          // Retail inputs
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Visitors</label>
              <input 
                type="text" 
                value={storeVisitors}
                onChange={(e) => setStoreVisitors(e.target.value)}
                placeholder="e.g., 1000" 
                className="p-2 w-full border border-gray-300 rounded"
              />
              <p className="text-xs text-gray-500 mt-1">Monthly store visitors</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchasers</label>
              <input 
                type="text" 
                value={purchasers}
                onChange={(e) => setPurchasers(e.target.value)}
                placeholder="e.g., 400" 
                className="p-2 w-full border border-gray-300 rounded"
              />
              <p className="text-xs text-gray-500 mt-1">Monthly customers who purchase</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repeat Customers</label>
              <input 
                type="text" 
                value={repeatCustomers}
                onChange={(e) => setRepeatCustomers(e.target.value)}
                placeholder="e.g., 120" 
                className="p-2 w-full border border-gray-300 rounded"
              />
              <p className="text-xs text-gray-500 mt-1">Monthly repeat customers</p>
            </div>
          </>
        )}
      </div>
      
      {/* Display calculated gaps */}
      {(websiteVisitors || storeVisitors) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-3">Calculated Gaps:</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">
                  {funnelType === 'leadGen' ? 'Visibility Gap' : 'Traffic Gap'}:
                </span>
                <span className="font-medium text-red-600">
                  {funnelType === 'leadGen' ? gaps.visibilityGap : gaps.trafficGap}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {funnelType === 'leadGen' ? gaps.visibilityGapDesc : gaps.trafficGapDesc}
              </p>
              <div className="h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ width: funnelType === 'leadGen' ? gaps.visibilityGap : gaps.trafficGap }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">
                  {funnelType === 'leadGen' ? 'Lead Conversion Gap' : 'Purchase Rate Gap'}:
                </span>
                <span className="font-medium text-orange-600">
                  {funnelType === 'leadGen' ? gaps.leadConversionGap : gaps.purchaseRateGap}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {funnelType === 'leadGen' ? gaps.leadConversionGapDesc : gaps.purchaseRateGapDesc}
              </p>
              <div className="h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className="h-full bg-orange-500 rounded-full" 
                  style={{ width: funnelType === 'leadGen' ? gaps.leadConversionGap : gaps.purchaseRateGap }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">
                  {funnelType === 'leadGen' ? 'Closing Rate Gap' : 'Repeat Rate Gap'}:
                </span>
                <span className="font-medium text-yellow-600">
                  {funnelType === 'leadGen' ? gaps.closingRateGap : gaps.repeatRateGap}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {funnelType === 'leadGen' ? gaps.closingRateGapDesc : gaps.repeatRateGapDesc}
              </p>
              <div className="h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className="h-full bg-yellow-500 rounded-full" 
                  style={{ width: funnelType === 'leadGen' ? gaps.closingRateGap : gaps.repeatRateGap }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SocialPostCard>
  );
};

export default GapsOpportunitySocial;
