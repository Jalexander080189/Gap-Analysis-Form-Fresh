import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Controller, useFormContext } from 'react-hook-form';
import { BuildingIcon, TrendingUpIcon, PercentIcon, UsersIcon } from 'lucide-react';

const CompanyOverview = () => {
  const form = useFormContext();
  
  // Watch values for calculations
  const watchedAnnualRevenue = form.watch("annualRevenue");
  const watchedPercentNew = form.watch("percentNewCustomers");
  const watchedPercentCurrent = form.watch("percentCurrentCustomers");
  
  // Get market overview values for market share calculation
  const watchedMarketSize = form.watch("audienceSize");
  const watchedBuyerRate = form.watch("buyerRate");
  const watchedAnnualCustomerValue = form.watch("annualCustomerValue");
  
  // Calculate total customers, new customers, and current customers
  const calculations = React.useMemo(() => {
    if (!watchedAnnualRevenue || !watchedAnnualCustomerValue) return null;
    
    const annualRevenue = typeof watchedAnnualRevenue === 'string' 
      ? parseFloat(watchedAnnualRevenue.replace(/[^0-9.-]+/g, '')) 
      : watchedAnnualRevenue;
      
    const customerValue = typeof watchedAnnualCustomerValue === 'string'
      ? parseFloat(watchedAnnualCustomerValue.replace(/[^0-9.-]+/g, ''))
      : watchedAnnualCustomerValue;
    
    if (isNaN(annualRevenue) || isNaN(customerValue) || customerValue === 0) return null;
    
    // Calculate total customers
    const totalCustomers = Math.round(annualRevenue / customerValue);
    
    // Calculate new and current customers
    let newCustomers = 0;
    let currentCustomers = 0;
    
    if (watchedPercentNew) {
      const percentNew = typeof watchedPercentNew === 'string'
        ? parseFloat(watchedPercentNew.replace(/[^0-9.-]+/g, '')) / 100
        : watchedPercentNew / 100;
        
      if (!isNaN(percentNew)) {
        newCustomers = Math.round(totalCustomers * percentNew);
      }
    }
    
    if (watchedPercentCurrent) {
      const percentCurrent = typeof watchedPercentCurrent === 'string'
        ? parseFloat(watchedPercentCurrent.replace(/[^0-9.-]+/g, '')) / 100
        : watchedPercentCurrent / 100;
        
      if (!isNaN(percentCurrent)) {
        currentCustomers = Math.round(totalCustomers * percentCurrent);
      }
    }
    
    return {
      totalCustomers,
      newCustomers,
      currentCustomers
    };
  }, [watchedAnnualRevenue, watchedAnnualCustomerValue, watchedPercentNew, watchedPercentCurrent]);
  
  // Calculate market revenue share
  const marketShare = React.useMemo(() => {
    if (!watchedAnnualRevenue || !watchedMarketSize || !watchedBuyerRate || !watchedAnnualCustomerValue) return null;
    
    const annualRevenue = typeof watchedAnnualRevenue === 'string' 
      ? parseFloat(watchedAnnualRevenue.replace(/[^0-9.-]+/g, '')) 
      : watchedAnnualRevenue;
      
    const marketSize = typeof watchedMarketSize === 'string'
      ? parseFloat(watchedMarketSize.replace(/[^0-9.-]+/g, ''))
      : watchedMarketSize;
      
    const buyerRate = typeof watchedBuyerRate === 'string'
      ? parseFloat(watchedBuyerRate.replace(/[^0-9.-]+/g, '')) / 100
      : watchedBuyerRate / 100;
      
    const customerValue = typeof watchedAnnualCustomerValue === 'string'
      ? parseFloat(watchedAnnualCustomerValue.replace(/[^0-9.-]+/g, ''))
      : watchedAnnualCustomerValue;
    
    if (isNaN(annualRevenue) || isNaN(marketSize) || isNaN(buyerRate) || isNaN(customerValue)) return null;
    
    // Calculate total market value
    const totalMarketValue = marketSize * buyerRate * customerValue;
    
    if (totalMarketValue === 0) return null;
    
    // Calculate market share percentage
    const sharePercentage = (annualRevenue / totalMarketValue) * 100;
    
    // Calculate gap percentage
    const gapPercentage = 100 - sharePercentage;
    
    return {
      sharePercentage: parseFloat(sharePercentage.toFixed(1)),
      gapPercentage: parseFloat(gapPercentage.toFixed(1))
    };
  }, [watchedAnnualRevenue, watchedMarketSize, watchedBuyerRate, watchedAnnualCustomerValue]);
  
  // Format number with commas
  const formatNumber = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('en-US').format(value);
  };
  
  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BuildingIcon className="h-5 w-5 text-primary" />
          Company Overview
        </CardTitle>
        <CardDescription>
          Enter company revenue and customer breakdown
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="annualRevenue" className="flex items-center gap-1">
              <TrendingUpIcon className="h-4 w-4" /> Annual Revenue
            </Label>
            <Controller
              name="annualRevenue"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <Input
                    id="annualRevenue"
                    placeholder="$0"
                    {...field}
                    className={fieldState.error ? "border-red-500" : ""}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
          </div>
          
          <div>
            <Label htmlFor="percentNewCustomers" className="flex items-center gap-1">
              <PercentIcon className="h-4 w-4" /> % New Customers
            </Label>
            <Controller
              name="percentNewCustomers"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <Input
                    id="percentNewCustomers"
                    placeholder="0"
                    {...field}
                    className={fieldState.error ? "border-red-500" : ""}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
          </div>
          
          <div>
            <Label htmlFor="percentCurrentCustomers" className="flex items-center gap-1">
              <PercentIcon className="h-4 w-4" /> % Current Customers
            </Label>
            <Controller
              name="percentCurrentCustomers"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <Input
                    id="percentCurrentCustomers"
                    placeholder="0"
                    {...field}
                    className={fieldState.error ? "border-red-500" : ""}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>
        
        {/* Customer Calculations */}
        {calculations && (
          <div className="mt-6 p-4 bg-secondary/30 rounded-md">
            <h3 className="font-medium mb-3">Customer Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers:</p>
                <p className="text-lg font-semibold">{formatNumber(calculations.totalCustomers)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Customers:</p>
                <p className="text-lg font-semibold">{formatNumber(calculations.newCustomers)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Customers:</p>
                <p className="text-lg font-semibold">{formatNumber(calculations.currentCustomers)}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Market Share Calculations */}
        {marketShare && (
          <div className="mt-4 p-4 bg-secondary/30 rounded-md">
            <h3 className="font-medium mb-3">Market Revenue Share</h3>
            <div className="flex justify-between mb-2">
              <span className="text-green-600 font-medium">{marketShare.sharePercentage}% Market Share</span>
              <span className="text-red-600 font-medium">{marketShare.gapPercentage}% Gap</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${marketShare.sharePercentage}%` }}
              ></div>
            </div>
            <p className="text-sm mt-2 text-muted-foreground">
              Your company has captured {marketShare.sharePercentage}% of the available market revenue, 
              with a {marketShare.gapPercentage}% revenue gap representing growth opportunity.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyOverview;
