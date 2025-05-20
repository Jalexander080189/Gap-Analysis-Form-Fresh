import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Controller, useFormContext } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TargetIcon } from 'lucide-react';

const GapsOpportunity = () => {
  const form = useFormContext();
  
  // Watch the funnel type toggle value
  const watchedFunnelType = form.watch("funnelType");
  
  // Watch values for calculations
  const watchedWebsiteVisitors = form.watch("websiteVisitors");
  const watchedLeads = form.watch("leads");
  const watchedNewClosedAccounts = form.watch("newClosedAccounts");
  
  // Calculate visibility gap
  const calculatedVisibilityGap = React.useMemo(() => {
    if (watchedWebsiteVisitors !== undefined && form.watch("audienceSize") > 0) {
      const reachPercentage = (watchedWebsiteVisitors / form.watch("audienceSize")) * 100;
      return 100 - reachPercentage; // Gap is what's not reached
    }
    return undefined;
  }, [watchedWebsiteVisitors, form.watch("audienceSize")]);
  
  // Calculate lead gen gap (only for Lead Gen funnel)
  const calculatedLeadGenGap = React.useMemo(() => {
    if (watchedFunnelType === "leadGen" && watchedWebsiteVisitors > 0 && watchedLeads !== undefined) {
      const conversionRate = (watchedLeads / watchedWebsiteVisitors) * 100;
      return 100 - conversionRate; // Gap is what's not converted
    }
    return undefined;
  }, [watchedFunnelType, watchedWebsiteVisitors, watchedLeads]);
  
  // Calculate closing rate gap
  const calculatedClosingRateGap = React.useMemo(() => {
    if (watchedFunnelType === "leadGen" && watchedLeads > 0 && watchedNewClosedAccounts !== undefined) {
      const closingRate = (watchedNewClosedAccounts / watchedLeads) * 100;
      return 100 - closingRate; // Gap is what's not closed
    } else if (watchedFunnelType === "retail" && watchedWebsiteVisitors > 0 && watchedNewClosedAccounts !== undefined) {
      const closingRate = (watchedNewClosedAccounts / watchedWebsiteVisitors) * 100;
      return 100 - closingRate; // Gap is what's not closed
    }
    return undefined;
  }, [watchedFunnelType, watchedLeads, watchedWebsiteVisitors, watchedNewClosedAccounts]);
  
  // Format percentage for display
  const formatPercentage = (value) => {
    if (value === undefined) return '';
    return `${value.toFixed(1)}%`;
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TargetIcon className="h-5 w-5 mr-2 text-primary" />
          Gaps / Opportunity Funnel
        </CardTitle>
        <CardDescription>
          Identify gaps in your customer acquisition funnel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Funnel Type Toggle */}
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Funnel Type
          </Label>
          <Controller
            name="funnelType"
            control={form.control}
            defaultValue="leadGen"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="leadGen" id="funnel-lead-gen" />
                  <Label htmlFor="funnel-lead-gen">Lead Generation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="retail" id="funnel-retail" />
                  <Label htmlFor="funnel-retail">Retail</Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
        
        {/* Common Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="websiteVisitors" className="block text-sm font-medium text-gray-700 mb-1">
              Website Visitors (Annual)
            </Label>
            <Controller
              name="websiteVisitors"
              control={form.control}
              render={({ field }) => (
                <Input
                  id="websiteVisitors"
                  placeholder="e.g., 50000"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
          
          {/* Conditional Lead Field - only show for Lead Gen */}
          {watchedFunnelType === "leadGen" && (
            <div>
              <Label htmlFor="leads" className="block text-sm font-medium text-gray-700 mb-1">
                Leads (Annual)
              </Label>
              <Controller
                name="leads"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="leads"
                    placeholder="e.g., 2500"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="newClosedAccounts" className="block text-sm font-medium text-gray-700 mb-1">
              New Closed Accounts (Annual)
            </Label>
            <Controller
              name="newClosedAccounts"
              control={form.control}
              render={({ field }) => (
                <Input
                  id="newClosedAccounts"
                  placeholder="e.g., 500"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>
        </div>
        
        {/* Calculated Gaps - only show when values are present */}
        {watchedWebsiteVisitors > 0 && (
          <div className="mt-6 space-y-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-md font-semibold text-gray-700">Calculated Gaps</h3>
            
            {/* Visibility Gap */}
            {calculatedVisibilityGap !== undefined && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Visibility Gap:</p>
                  <p className="text-lg font-semibold text-red-600">
                    {formatPercentage(calculatedVisibilityGap)}
                  </p>
                  <p className="text-xs text-gray-500">
                    % of buyers who didn't even see you as an option
                  </p>
                </div>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500"
                    style={{ width: `${Math.min(calculatedVisibilityGap, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Lead Gen Gap - only for Lead Gen funnel */}
            {watchedFunnelType === "leadGen" && calculatedLeadGenGap !== undefined && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Lead Conversion Gap:</p>
                  <p className="text-lg font-semibold text-red-600">
                    {formatPercentage(calculatedLeadGenGap)}
                  </p>
                  <p className="text-xs text-gray-500">
                    % of researchers who didn't leave you their info
                  </p>
                </div>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500"
                    style={{ width: `${Math.min(calculatedLeadGenGap, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Closing Rate Gap */}
            {calculatedClosingRateGap !== undefined && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Closing Rate Gap:</p>
                  <p className="text-lg font-semibold text-red-600">
                    {formatPercentage(calculatedClosingRateGap)}
                  </p>
                  <p className="text-xs text-gray-500">
                    % of {watchedFunnelType === "leadGen" ? "hot leads" : "visitors"} we say no to
                  </p>
                </div>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500"
                    style={{ width: `${Math.min(calculatedClosingRateGap, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GapsOpportunity;
