import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Controller, useFormContext } from 'react-hook-form';
import { LineChartIcon } from 'lucide-react';

const Scenario = () => {
  const form = useFormContext();
  
  // Watch base values from other sections
  const watchedAudienceSize = form.watch("audienceSize");
  const watchedBuyerRate = form.watch("buyerRate");
  const watchedCalculatedBuyers = watchedAudienceSize && watchedBuyerRate ? 
    watchedAudienceSize * (watchedBuyerRate / 100) : undefined;
  
  // Watch current funnel metrics
  const watchedWebsiteVisitors = form.watch("websiteVisitors");
  const watchedLeads = form.watch("leads");
  const watchedNewClosedAccounts = form.watch("newClosedAccounts");
  const watchedAnnualCustomerValue = form.watch("annualCustomerValue");
  const watchedFunnelType = form.watch("funnelType");
  
  // Watch scenario increase percentages
  const watchedVisibilityIncrease = form.watch("visibilityIncrease");
  const watchedLeadConversionIncrease = form.watch("leadConversionIncrease");
  const watchedCloseRateIncrease = form.watch("closeRateIncrease");
  
  // Calculate current metrics
  const currentReach = React.useMemo(() => {
    if (watchedWebsiteVisitors && watchedCalculatedBuyers) {
      return (watchedWebsiteVisitors / watchedCalculatedBuyers) * 100;
    }
    return undefined;
  }, [watchedWebsiteVisitors, watchedCalculatedBuyers]);
  
  const currentLeadConversion = React.useMemo(() => {
    if (watchedFunnelType === "leadGen" && watchedWebsiteVisitors && watchedLeads) {
      return (watchedLeads / watchedWebsiteVisitors) * 100;
    }
    return undefined;
  }, [watchedFunnelType, watchedWebsiteVisitors, watchedLeads]);
  
  const currentCloseRate = React.useMemo(() => {
    if (watchedFunnelType === "leadGen" && watchedLeads && watchedNewClosedAccounts) {
      return (watchedNewClosedAccounts / watchedLeads) * 100;
    } else if (watchedFunnelType === "retail" && watchedWebsiteVisitors && watchedNewClosedAccounts) {
      return (watchedNewClosedAccounts / watchedWebsiteVisitors) * 100;
    }
    return undefined;
  }, [watchedFunnelType, watchedLeads, watchedWebsiteVisitors, watchedNewClosedAccounts]);
  
  // Calculate scenario metrics
  const scenarioReach = React.useMemo(() => {
    if (currentReach !== undefined && watchedVisibilityIncrease) {
      return currentReach + parseFloat(watchedVisibilityIncrease);
    }
    return currentReach;
  }, [currentReach, watchedVisibilityIncrease]);
  
  const scenarioLeadConversion = React.useMemo(() => {
    if (currentLeadConversion !== undefined && watchedLeadConversionIncrease) {
      return currentLeadConversion + parseFloat(watchedLeadConversionIncrease);
    }
    return currentLeadConversion;
  }, [currentLeadConversion, watchedLeadConversionIncrease]);
  
  const scenarioCloseRate = React.useMemo(() => {
    if (currentCloseRate !== undefined && watchedCloseRateIncrease) {
      return currentCloseRate + parseFloat(watchedCloseRateIncrease);
    }
    return currentCloseRate;
  }, [currentCloseRate, watchedCloseRateIncrease]);
  
  // Calculate scenario results
  const scenarioVisitors = React.useMemo(() => {
    if (watchedCalculatedBuyers && scenarioReach) {
      return watchedCalculatedBuyers * (scenarioReach / 100);
    }
    return watchedWebsiteVisitors;
  }, [watchedCalculatedBuyers, scenarioReach, watchedWebsiteVisitors]);
  
  const scenarioLeads = React.useMemo(() => {
    if (watchedFunnelType === "leadGen" && scenarioVisitors && scenarioLeadConversion) {
      return scenarioVisitors * (scenarioLeadConversion / 100);
    }
    return watchedLeads;
  }, [watchedFunnelType, scenarioVisitors, scenarioLeadConversion, watchedLeads]);
  
  const scenarioNewAccounts = React.useMemo(() => {
    if (watchedFunnelType === "leadGen" && scenarioLeads && scenarioCloseRate) {
      return scenarioLeads * (scenarioCloseRate / 100);
    } else if (watchedFunnelType === "retail" && scenarioVisitors && scenarioCloseRate) {
      return scenarioVisitors * (scenarioCloseRate / 100);
    }
    return watchedNewClosedAccounts;
  }, [watchedFunnelType, scenarioLeads, scenarioVisitors, scenarioCloseRate, watchedNewClosedAccounts]);
  
  const scenarioRevenue = React.useMemo(() => {
    if (scenarioNewAccounts && watchedAnnualCustomerValue) {
      return scenarioNewAccounts * watchedAnnualCustomerValue;
    }
    return undefined;
  }, [scenarioNewAccounts, watchedAnnualCustomerValue]);
  
  const currentRevenue = React.useMemo(() => {
    if (watchedNewClosedAccounts && watchedAnnualCustomerValue) {
      return watchedNewClosedAccounts * watchedAnnualCustomerValue;
    }
    return undefined;
  }, [watchedNewClosedAccounts, watchedAnnualCustomerValue]);
  
  const revenueIncrease = React.useMemo(() => {
    if (scenarioRevenue && currentRevenue) {
      return scenarioRevenue - currentRevenue;
    }
    return undefined;
  }, [scenarioRevenue, currentRevenue]);
  
  // Format functions
  const formatPercentage = (value) => {
    if (value === undefined) return '';
    return `${value.toFixed(1)}%`;
  };
  
  const formatNumber = (value) => {
    if (value === undefined) return '';
    return Math.round(value).toLocaleString();
  };
  
  const formatCurrency = (value) => {
    if (value === undefined) return '';
    return `$${Math.round(value).toLocaleString()}`;
  };
  
  // Check if we have enough data to show the calculator
  const showCalculator = watchedAudienceSize && watchedBuyerRate && watchedWebsiteVisitors && 
    (watchedFunnelType === "retail" || (watchedFunnelType === "leadGen" && watchedLeads)) && 
    watchedNewClosedAccounts && watchedAnnualCustomerValue;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <LineChartIcon className="h-5 w-5 mr-2 text-primary" />
          Scenario Planning / What-If Calculator
        </CardTitle>
        <CardDescription>
          Model potential improvements to your customer acquisition funnel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Scenario: Increase Key Metrics
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="visibilityIncrease" className="block text-sm font-medium text-gray-700 mb-1">
                Visibility Gap - increase additional (%)
              </Label>
              <Controller
                name="visibilityIncrease"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="visibilityIncrease"
                    placeholder="e.g., 10"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
            </div>
            
            {watchedFunnelType === "leadGen" && (
              <div>
                <Label htmlFor="leadConversionIncrease" className="block text-sm font-medium text-gray-700 mb-1">
                  Lead Conversion Gap - increase additional (%)
                </Label>
                <Controller
                  name="leadConversionIncrease"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="leadConversionIncrease"
                      placeholder="e.g., 5"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="closeRateIncrease" className="block text-sm font-medium text-gray-700 mb-1">
                Close Rate Gap - increase additional (%)
              </Label>
              <Controller
                name="closeRateIncrease"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="closeRateIncrease"
                    placeholder="e.g., 3"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
            </div>
          </div>
        </div>
        
        {showCalculator && (
          <div className="mt-6 space-y-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-md font-semibold text-gray-700">Calculated Results</h3>
            
            {/* Reach Metrics */}
            <div className="border-b pb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Calculated Reach</h4>
              <p className="text-xs text-gray-500">% of buyers who see you as an option</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-500">Current:</p>
                  <p className="text-md font-semibold">{formatPercentage(currentReach)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Scenario:</p>
                  <p className="text-md font-semibold text-green-600">{formatPercentage(scenarioReach)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Visitors:</p>
                  <p className="text-md font-semibold">{formatNumber(watchedWebsiteVisitors)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Scenario Visitors:</p>
                  <p className="text-md font-semibold text-green-600">{formatNumber(scenarioVisitors)}</p>
                </div>
              </div>
            </div>
            
            {/* Lead Conversion Metrics - only for Lead Gen */}
            {watchedFunnelType === "leadGen" && (
              <div className="border-b pb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Calculated Lead Conversion</h4>
                <p className="text-xs text-gray-500">% of visitors who leave you their info</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">Current:</p>
                    <p className="text-md font-semibold">{formatPercentage(currentLeadConversion)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Scenario:</p>
                    <p className="text-md font-semibold text-green-600">{formatPercentage(scenarioLeadConversion)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Leads:</p>
                    <p className="text-md font-semibold">{formatNumber(watchedLeads)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Scenario Leads:</p>
                    <p className="text-md font-semibold text-green-600">{formatNumber(scenarioLeads)}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Close Rate Metrics */}
            <div className="border-b pb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Calculated Closing Rate</h4>
              <p className="text-xs text-gray-500">% of {watchedFunnelType === "leadGen" ? "leads" : "visitors"} who become customers</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-500">Current:</p>
                  <p className="text-md font-semibold">{formatPercentage(currentCloseRate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Scenario:</p>
                  <p className="text-md font-semibold text-green-600">{formatPercentage(scenarioCloseRate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Accounts:</p>
                  <p className="text-md font-semibold">{formatNumber(watchedNewClosedAccounts)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Scenario Accounts:</p>
                  <p className="text-md font-semibold text-green-600">{formatNumber(scenarioNewAccounts)}</p>
                </div>
              </div>
            </div>
            
            {/* Revenue Impact */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Revenue Impact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <p className="text-xs text-gray-500">Current Annual Revenue:</p>
                  <p className="text-md font-semibold">{formatCurrency(currentRevenue)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Scenario Annual Revenue:</p>
                  <p className="text-md font-semibold text-green-600">{formatCurrency(scenarioRevenue)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Annual Revenue Increase:</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(revenueIncrease)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!showCalculator && (
          <div className="p-4 bg-amber-50 rounded-md">
            <p className="text-sm text-amber-800">
              Please complete the Market Overview, Company Overview, and Gaps/Opportunity Funnel sections to enable the scenario calculator.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Scenario;
