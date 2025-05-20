'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ReportPage() {
  const params = useParams();
  const { companyslug } = params;
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll use localStorage
    const savedReport = localStorage.getItem(`report-${companyslug}`);
    
    if (savedReport) {
      setReportData(JSON.parse(savedReport));
    }
    
    setLoading(false);
  }, [companyslug]);
  
  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <div className="text-center">Loading report...</div>
      </div>
    );
  }
  
  if (!reportData) {
    return (
      <div className="container mx-auto p-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
          <p className="mb-4">The report you're looking for doesn't exist or may have been deleted.</p>
          <Link href="/" className="text-primary hover:underline">
            Create a new report
          </Link>
        </div>
      </div>
    );
  }
  
  // Calculate gaps
  const calculateGaps = () => {
    const audience = parseInt(reportData.audienceSize?.replace(/,/g, '') || '0', 10);
    const visitors = parseInt(reportData.yearlyWebsiteVisitors?.replace(/,/g, '') || '0', 10);
    const leads = parseInt(reportData.yearlyLeads?.replace(/,/g, '') || '0', 10);
    const accounts = parseInt(reportData.yearlyNewAccountsClosed?.replace(/,/g, '') || '0', 10);
    
    // Market Visibility Gap
    const reach = audience > 0 ? (visitors / audience) * 100 : 0;
    
    // Lead Gen Gap
    const conversion = visitors > 0 ? (leads / visitors) * 100 : 0;
    
    // Close Rate Gap
    const close = leads > 0 ? (accounts / leads) * 100 : 0;
    
    return {
      marketVisibility: { 
        reach: parseFloat(reach.toFixed(1)), 
        gap: parseFloat((100 - reach).toFixed(1)) 
      },
      leadGen: { 
        conversion: parseFloat(conversion.toFixed(1)), 
        gap: parseFloat((100 - conversion).toFixed(1)) 
      },
      closeRate: { 
        close: parseFloat(close.toFixed(1)), 
        gap: parseFloat((100 - close).toFixed(1)) 
      }
    };
  };
  
  const gaps = calculateGaps();
  
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gap Analysis Report</h1>
        <Link href="/" className="text-primary hover:underline">
          Create New Report
        </Link>
      </div>
      
      {/* Company Details */}
      <section className="bg-card p-4 md:p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-2xl font-semibold mb-4">{reportData.companyName}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportData.website && (
            <div>
              <span className="text-muted-foreground">Website:</span>{' '}
              <a 
                href={reportData.website.startsWith('http') ? reportData.website : `https://${reportData.website}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {reportData.website}
              </a>
            </div>
          )}
          
          {reportData.yearsInBusiness && (
            <div>
              <span className="text-muted-foreground">Years in Business:</span> {reportData.yearsInBusiness}
            </div>
          )}
          
          {reportData.owner1 && (
            <div>
              <span className="text-muted-foreground">Primary Contact:</span> {reportData.owner1}
            </div>
          )}
        </div>
      </section>
      
      {/* Gaps & Opportunity Summary */}
      <section className="bg-card p-4 md:p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Marketing Funnel Gaps Summary</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-secondary/30 p-4 rounded">
            <h3 className="font-medium mb-2">Market Visibility</h3>
            <div className="flex justify-between mb-1">
              <span className="text-green-600 font-medium">{gaps.marketVisibility.reach}% Reach</span>
              <span className="text-red-600 font-medium">{gaps.marketVisibility.gap}% Gap</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${gaps.marketVisibility.reach}%` }}
              ></div>
            </div>
            <p className="text-sm mt-2">
              {gaps.marketVisibility.gap}% of your potential market isn't seeing your brand.
            </p>
          </div>
          
          <div className="bg-secondary/30 p-4 rounded">
            <h3 className="font-medium mb-2">Lead Generation</h3>
            <div className="flex justify-between mb-1">
              <span className="text-green-600 font-medium">{gaps.leadGen.conversion}% Conversion</span>
              <span className="text-red-600 font-medium">{gaps.leadGen.gap}% Gap</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${gaps.leadGen.conversion}%` }}
              ></div>
            </div>
            <p className="text-sm mt-2">
              {gaps.leadGen.gap}% of your website visitors aren't becoming leads.
            </p>
          </div>
          
          <div className="bg-secondary/30 p-4 rounded">
            <h3 className="font-medium mb-2">Close Rate</h3>
            <div className="flex justify-between mb-1">
              <span className="text-green-600 font-medium">{gaps.closeRate.close}% Close</span>
              <span className="text-red-600 font-medium">{gaps.closeRate.gap}% Gap</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${gaps.closeRate.close}%` }}
              ></div>
            </div>
            <p className="text-sm mt-2">
              {gaps.closeRate.gap}% of your leads aren't converting to customers.
            </p>
          </div>
        </div>
      </section>
      
      {/* Market Overview */}
      {(reportData.audienceSize || reportData.buyerPercentage || reportData.annualCustomerValue) && (
        <section className="bg-card p-4 md:p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportData.audienceSize && (
              <div>
                <span className="text-muted-foreground">Total Audience Size:</span>{' '}
                <span className="font-medium">{reportData.audienceSize}</span>
              </div>
            )}
            
            {reportData.buyerPercentage && (
              <div>
                <span className="text-muted-foreground">Likely to Buy (%):</span>{' '}
                <span className="font-medium">{reportData.buyerPercentage}</span>
              </div>
            )}
            
            {reportData.annualCustomerValue && (
              <div>
                <span className="text-muted-foreground">Annual Customer Value:</span>{' '}
                <span className="font-medium">{reportData.annualCustomerValue}</span>
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Current Marketing */}
      {reportData.marketingChannels?.length > 0 && reportData.marketingChannels[0].channel && (
        <section className="bg-card p-4 md:p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Marketing</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Channel</th>
                  <th className="text-left py-2">Monthly Spend</th>
                </tr>
              </thead>
              <tbody>
                {reportData.marketingChannels.map((channel, index) => (
                  channel.channel && (
                    <tr key={index} className="border-b">
                      <td className="py-2">{channel.channel}</td>
                      <td className="py-2">{channel.spend}</td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      
      {/* Demographics & Target Audience */}
      {reportData.audienceType && (
        <section className="bg-card p-4 md:p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Target Audience</h2>
          
          <div>
            <span className="text-muted-foreground">Audience Type:</span>{' '}
            <span className="font-medium">
              {reportData.audienceType === 'b2c' ? 'B2C' : 
                reportData.audienceType === 'b2b' ? 'B2B' : 'B2B & B2C'}
            </span>
          </div>
          
          {(reportData.audienceType === 'b2c' || reportData.audienceType === 'both') && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">B2C Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportData.locations && (
                  <div>
                    <span className="text-muted-foreground">Location:</span>{' '}
                    {reportData.locations}
                  </div>
                )}
                
                {reportData.ageGroups && (
                  <div>
                    <span className="text-muted-foreground">Age Groups:</span>{' '}
                    {reportData.ageGroups}
                  </div>
                )}
                
                {reportData.incomeLevels && (
                  <div>
                    <span className="text-muted-foreground">Income Levels:</span>{' '}
                    {reportData.incomeLevels}
                  </div>
                )}
                
                {reportData.additionalOption1 && (
                  <div>
                    <span className="text-muted-foreground">Additional:</span>{' '}
                    {reportData.additionalOption1}
                  </div>
                )}
                
                {reportData.additionalOption2 && (
                  <div>
                    <span className="text-muted-foreground">Additional:</span>{' '}
                    {reportData.additionalOption2}
                  </div>
                )}
                
                {reportData.additionalOption3 && (
                  <div>
                    <span className="text-muted-foreground">Additional:</span>{' '}
                    {reportData.additionalOption3}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {(reportData.audienceType === 'b2b' || reportData.audienceType === 'both') && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">B2B Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportData.businessLocations && (
                  <div>
                    <span className="text-muted-foreground">Location:</span>{' '}
                    {reportData.businessLocations}
                  </div>
                )}
                
                {reportData.businessSizeRevenue && (
                  <div>
                    <span className="text-muted-foreground">Revenue Size:</span>{' '}
                    {reportData.businessSizeRevenue}
                  </div>
                )}
                
                {reportData.businessSizeEmployees && (
                  <div>
                    <span className="text-muted-foreground">Employee Count:</span>{' '}
                    {reportData.businessSizeEmployees}
                  </div>
                )}
                
                {reportData.jobTitles && (
                  <div>
                    <span className="text-muted-foreground">Job Titles:</span>{' '}
                    {reportData.jobTitles}
                  </div>
                )}
                
                {reportData.businessAdditionalOption1 && (
                  <div>
                    <span className="text-muted-foreground">Additional:</span>{' '}
                    {reportData.businessAdditionalOption1}
                  </div>
                )}
                
                {reportData.businessAdditionalOption2 && (
                  <div>
                    <span className="text-muted-foreground">Additional:</span>{' '}
                    {reportData.businessAdditionalOption2}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}
      
      {/* Notes & Recommendations */}
      {reportData.customNotes && (
        <section className="bg-card p-4 md:p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Notes & Recommendations</h2>
          
          <div className="whitespace-pre-wrap">
            {reportData.customNotes}
          </div>
        </section>
      )}
      
      <div className="flex justify-between mt-8">
        <Link href="/" className="text-primary hover:underline">
          Create New Report
        </Link>
        
        <button
          onClick={() => window.print()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          Save as PDF
        </button>
      </div>
    </div>
  );
}