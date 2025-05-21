import React, { useState, useEffect } from 'react';
import SocialPostCard from './SocialPostCard';

// Import icons
const MarketOverviewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

/**
 * MarketOverviewSocial - A social media styled wrapper for the Market Overview component
 * 
 * @param {Object} props
 * @param {Object} props.formData - The form data
 * @param {Function} props.updateFormData - Function to update form data
 */
const MarketOverviewSocial = ({ formData, updateFormData }) => {
  // Market overview state
  const [audienceSize, setAudienceSize] = useState(formData?.audienceSize || '');
  const [buyerPercentage, setBuyerPercentage] = useState(formData?.buyerPercentage || '');
  const [customerValue, setCustomerValue] = useState(formData?.customerValue || '');
  
  // Calculate market metrics
  const calculateMarketMetrics = () => {
    const audience = parseInt(audienceSize) || 0;
    const buyerPct = parseFloat(buyerPercentage) || 0;
    const custValue = parseFloat(customerValue) || 0;
    
    const totalBuyers = Math.round(audience * (buyerPct / 100));
    const totalMarketRevenue = totalBuyers * custValue;
    
    return {
      totalBuyers: totalBuyers.toLocaleString(),
      totalMarketRevenue: totalMarketRevenue.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})
    };
  };
  
  const marketMetrics = calculateMarketMetrics();
  
  // Update form data when market overview values change
  useEffect(() => {
    updateFormData({
      ...formData,
      audienceSize,
      buyerPercentage,
      customerValue,
      marketMetrics: calculateMarketMetrics()
    });
  }, [audienceSize, buyerPercentage, customerValue]);
  
  return (
    <SocialPostCard
      title="Market Overview"
      icon={<MarketOverviewIcon />}
      iconBg="bg-blue-100"
      iconColor="text-blue-800"
      id="market-overview"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Audience Size</label>
          <input 
            type="text" 
            value={audienceSize}
            onChange={(e) => setAudienceSize(e.target.value)}
            placeholder="e.g., 100000" 
            className="p-2 w-full border border-gray-300 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Total addressable market size</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Buyer %</label>
          <input 
            type="text" 
            value={buyerPercentage}
            onChange={(e) => setBuyerPercentage(e.target.value)}
            placeholder="e.g., 5" 
            className="p-2 w-full border border-gray-300 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Percentage who buy annually</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Average Customer Value</label>
          <input 
            type="text" 
            value={customerValue}
            onChange={(e) => setCustomerValue(e.target.value)}
            placeholder="e.g., 5000" 
            className="p-2 w-full border border-gray-300 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Average annual revenue per customer</p>
        </div>
      </div>
      
      {/* Display calculated metrics if inputs are provided */}
      {audienceSize && buyerPercentage && customerValue && (
        <div className="mt-4 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-3">Market Analysis:</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Buyers</p>
              <p className="text-xl font-bold">{marketMetrics.totalBuyers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Market Revenue</p>
              <p className="text-xl font-bold">{marketMetrics.totalMarketRevenue}</p>
            </div>
          </div>
        </div>
      )}
    </SocialPostCard>
  );
};

export default MarketOverviewSocial;
