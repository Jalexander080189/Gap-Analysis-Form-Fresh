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
  // SBA budget state
  const [year1Budget, setYear1Budget] = useState(formData?.sba?.year1Budget || '');
  const [year2Budget, setYear2Budget] = useState(formData?.sba?.year2Budget || '');
  const [year3Budget, setYear3Budget] = useState(formData?.sba?.year3Budget || '');
  const [year4Budget, setYear4Budget] = useState(formData?.sba?.year4Budget || '');
  const [year5Budget, setYear5Budget] = useState(formData?.sba?.year5Budget || '');
  
  // Calculate total budget
  const calculateTotalBudget = () => {
    const y1 = parseFloat(year1Budget) || 0;
    const y2 = parseFloat(year2Budget) || 0;
    const y3 = parseFloat(year3Budget) || 0;
    const y4 = parseFloat(year4Budget) || 0;
    const y5 = parseFloat(year5Budget) || 0;
    
    return y1 + y2 + y3 + y4 + y5;
  };
  
  const totalBudget = calculateTotalBudget();
  
  // Calculate percentage of annual revenue
  const calculatePercentageOfRevenue = () => {
    const annualRevenue = parseFloat(formData?.annualRevenue) || 0;
    if (annualRevenue === 0) return 0;
    
    const y1 = parseFloat(year1Budget) || 0;
    return (y1 / annualRevenue) * 100;
  };
  
  const percentageOfRevenue = calculatePercentageOfRevenue();
  
  // Update form data when SBA budget values change
  useEffect(() => {
    updateFormData({
      ...formData,
      sba: {
        year1Budget,
        year2Budget,
        year3Budget,
        year4Budget,
        year5Budget,
        totalBudget: calculateTotalBudget(),
        percentageOfRevenue: calculatePercentageOfRevenue()
      }
    });
  }, [year1Budget, year2Budget, year3Budget, year4Budget, year5Budget, formData?.annualRevenue]);
  
  return (
    <EnhancedSocialPostCard
      title="SBA Marketing Budget 5 Year Forecast"
      icon={<SBABudgetIcon />}
      iconBg="bg-purple-100"
      iconColor="text-purple-800"
      id="sba-budget"
    >
      <div className="space-y-6">
        <p className="text-gray-700">
          Plan your SBA marketing budget for the next 5 years. This forecast helps you allocate your marketing funds strategically over time.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year 1</label>
            <input 
              type="text" 
              value={year1Budget}
              onChange={(e) => setYear1Budget(e.target.value)}
              placeholder="e.g., 50000" 
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year 2</label>
            <input 
              type="text" 
              value={year2Budget}
              onChange={(e) => setYear2Budget(e.target.value)}
              placeholder="e.g., 55000" 
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year 3</label>
            <input 
              type="text" 
              value={year3Budget}
              onChange={(e) => setYear3Budget(e.target.value)}
              placeholder="e.g., 60000" 
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year 4</label>
            <input 
              type="text" 
              value={year4Budget}
              onChange={(e) => setYear4Budget(e.target.value)}
              placeholder="e.g., 65000" 
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year 5</label>
            <input 
              type="text" 
              value={year5Budget}
              onChange={(e) => setYear5Budget(e.target.value)}
              placeholder="e.g., 70000" 
              className="p-2 w-full border border-gray-300 rounded"
            />
          </div>
        </div>
        
        {/* Display calculated metrics if inputs are provided */}
        {year1Budget && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800 mb-3">Budget Analysis:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total 5-Year Budget</p>
                <p className="text-xl font-bold">
                  {totalBudget.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}
                </p>
              </div>
              
              {formData?.annualRevenue && (
                <div>
                  <p className="text-sm text-gray-600">Year 1 as % of Annual Revenue</p>
                  <p className="text-xl font-bold">{percentageOfRevenue.toFixed(1)}%</p>
                  
                  {percentageOfRevenue < 8 && (
                    <p className="text-sm text-red-600 mt-1">
                      Recommended: Increase to at least 8% of annual revenue
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </EnhancedSocialPostCard>
  );
};

export default SBABudgetSocial;
