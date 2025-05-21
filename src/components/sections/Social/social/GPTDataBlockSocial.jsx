import React, { useState, useEffect } from 'react';
import EnhancedSocialPostCard from './EnhancedSocialPostCard';

// Import icons
const GPTDataIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

/**
 * GPTDataBlockSocial - A social media styled wrapper for the GPT Data Block component
 * 
 * @param {Object} props
 * @param {Object} props.formData - The form data
 * @param {Function} props.updateFormData - Function to update form data
 */
const GPTDataBlockSocial = ({ formData, updateFormData }) => {
  // GPT data state
  const [gptData, setGptData] = useState(formData?.gptData || '');
  const [parsedData, setParsedData] = useState(null);
  
  // Parse GPT data
  const parseGptData = () => {
    try {
      // Simple parsing logic - this would be more sophisticated in production
      const lines = gptData.split('\n');
      const parsed = {};
      
      lines.forEach(line => {
        if (line.includes(':')) {
          const [key, value] = line.split(':').map(item => item.trim());
          parsed[key.toLowerCase().replace(/\s+/g, '_')] = value;
        }
      });
      
      setParsedData(parsed);
      return parsed;
    } catch (error) {
      console.error('Error parsing GPT data:', error);
      return null;
    }
  };
  
  // Auto-fill form with parsed data
  const autoFillForm = () => {
    const parsed = parseGptData();
    if (!parsed) return;
    
    const updatedFormData = { ...formData };
    
    // Map parsed data to form fields
    if (parsed.company_name) updatedFormData.companyName = parsed.company_name;
    if (parsed.website) updatedFormData.website = parsed.website;
    if (parsed.industry) updatedFormData.industry = parsed.industry;
    if (parsed.founded) updatedFormData.founded = parsed.founded;
    if (parsed.annual_revenue) updatedFormData.annualRevenue = parsed.annual_revenue.replace(/[^0-9.]/g, '');
    if (parsed.audience_size) updatedFormData.audienceSize = parsed.audience_size.replace(/[^0-9.]/g, '');
    if (parsed.buyer_percentage) updatedFormData.buyerPercentage = parsed.buyer_percentage.replace(/[^0-9.]/g, '');
    if (parsed.customer_value) updatedFormData.customerValue = parsed.customer_value.replace(/[^0-9.]/g, '');
    
    // Update form data
    updateFormData({
      ...updatedFormData,
      gptData: gptData,
      parsedGptData: parsed
    });
  };
  
  // Update form data when GPT data changes
  useEffect(() => {
    updateFormData({
      ...formData,
      gptData: gptData
    });
  }, [gptData]);
  
  return (
    <EnhancedSocialPostCard
      title="GPT Data Block"
      icon={<GPTDataIcon />}
      iconBg="bg-purple-100"
      iconColor="text-purple-800"
      id="gpt-data-block"
      enhancedReactions={true}
    >
      <p className="text-gray-700 mb-3">
        Paste structured data from GPT to auto-fill form fields:
      </p>
      
      <div className="mb-4">
        <textarea
          value={gptData}
          onChange={(e) => setGptData(e.target.value)}
          className="w-full h-40 p-3 border border-gray-300 rounded-md"
          placeholder="Paste GPT-generated data here in format:&#10;Company Name: Acme Corp&#10;Website: www.acmecorp.com&#10;Industry: Technology&#10;Founded: 2010&#10;Annual Revenue: $2,500,000&#10;..."
        ></textarea>
      </div>
      
      <div className="flex space-x-3 mb-4">
        <button
          onClick={parseGptData}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Parse Data
        </button>
        <button
          onClick={autoFillForm}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Auto-Fill Form
        </button>
      </div>
      
      {parsedData && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-3">Parsed Data:</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(parsedData).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-sm font-medium">{key.replace(/_/g, ' ')}:</span>
                <span className="text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </EnhancedSocialPostCard>
  );
};

export default GPTDataBlockSocial;
