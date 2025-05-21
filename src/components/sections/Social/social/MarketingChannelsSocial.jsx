import React, { useState, useEffect } from 'react';
import EnhancedSocialPostCard from './EnhancedSocialPostCard';

// Import icons
const MarketingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

/**
 * MarketingChannelsSocial - A social media styled wrapper for the Marketing Channels component
 * 
 * @param {Object} props
 * @param {Object} props.formData - The form data
 * @param {Function} props.updateFormData - Function to update form data
 */
const MarketingChannelsSocial = ({ formData, updateFormData }) => {
  // Marketing channels state
  const [channels, setChannels] = useState(formData?.marketingChannels || [{ id: Date.now(), channel: '', monthlySpend: '' }]);
  const [annualRevenue, setAnnualRevenue] = useState(parseFloat(formData?.annualRevenue || 0));

  // Calculate marketing budget metrics
  const calculateBudgetMetrics = () => {
    const monthlyTotal = channels.reduce((total, channel) => {
      const spend = parseFloat(channel.monthlySpend) || 0;
      return total + spend;
    }, 0);
    
    const yearlyTotal = monthlyTotal * 12;
    const percentOfRevenue = annualRevenue > 0 ? (yearlyTotal / annualRevenue) * 100 : 0;
    const targetMonthlySpend = annualRevenue * 0.08 / 12;
    const additionalSpendNeeded = Math.max(0, targetMonthlySpend - monthlyTotal);
    
    return {
      monthlyTotal: monthlyTotal.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}),
      yearlyTotal: yearlyTotal.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0}),
      percentOfRevenue: percentOfRevenue.toFixed(2) + '%',
      additionalSpendNeeded: additionalSpendNeeded.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})
    };
  };
  
  const budgetMetrics = calculateBudgetMetrics();

  // Add a new marketing channel
  const addChannel = () => {
    setChannels([...channels, { id: Date.now(), channel: '', monthlySpend: '' }]);
  };

  // Remove a marketing channel
  const removeChannel = (id) => {
    setChannels(channels.filter(channel => channel.id !== id));
  };

  // Update a marketing channel
  const updateChannel = (id, field, value) => {
    setChannels(channels.map(channel => {
      if (channel.id === id) {
        return { ...channel, [field]: value };
      }
      return channel;
    }));
  };

  // Update form data when channels change
  useEffect(() => {
    updateFormData({
      ...formData,
      marketingChannels: channels,
      marketingBudgetMetrics: calculateBudgetMetrics()
    });
  }, [channels]);

  // Update annual revenue from form data
  useEffect(() => {
    if (formData?.annualRevenue) {
      setAnnualRevenue(parseFloat(formData.annualRevenue));
    }
  }, [formData?.annualRevenue]);

  return (
    <EnhancedSocialPostCard
      title="Marketing Channels"
      icon={<MarketingIcon />}
      iconBg="bg-yellow-100"
      iconColor="text-yellow-800"
      id="marketing-channels"
      enhancedReactions={true}
    >
      <p className="text-gray-700 mb-4">Current marketing channels:</p>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Spend</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {channels.map((channel) => (
              <tr key={channel.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="text" 
                    value={channel.channel}
                    onChange={(e) => updateChannel(channel.id, 'channel', e.target.value)}
                    placeholder="e.g., Google Ads" 
                    className="p-2 w-full border border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="text" 
                    value={channel.monthlySpend}
                    onChange={(e) => updateChannel(channel.id, 'monthlySpend', e.target.value)}
                    placeholder="e.g., 2000" 
                    className="p-2 w-full border border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => removeChannel(channel.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3">
        <button 
          onClick={addChannel}
          className="flex items-center text-blue-600 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Marketing Channel
        </button>
      </div>
      
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-3">Marketing Budget Summary</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Calculated Monthly Total:</span>
            <span className="text-sm font-semibold">{budgetMetrics.monthlyTotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Calculated Yearly Total:</span>
            <span className="text-sm font-semibold">{budgetMetrics.yearlyTotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Calculated % of Annual Revenue:</span>
            <span className="text-sm font-semibold">{budgetMetrics.percentOfRevenue}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Additional spend needed to reach 8% Monthly:</span>
            <span className="text-sm font-semibold text-red-600">{budgetMetrics.additionalSpendNeeded}</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          Remember to include all monthly management costs, salaries, internal employees, etc.
        </p>
      </div>
    </EnhancedSocialPostCard>
  );
};

export default MarketingChannelsSocial;
