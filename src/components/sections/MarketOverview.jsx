import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Controller, useFormContext } from 'react-hook-form';
import { LineChartIcon, UsersIcon, DollarSignIcon, PercentIcon } from 'lucide-react';

const MarketOverview = () => {
  const form = useFormContext();
  
  // Watch values for calculations
  const watchedAudienceSize = form.watch("audienceSize");
  const watchedBuyerRate = form.watch("buyerRate");
  const watchedAnnualCustomerValue = form.watch("annualCustomerValue");
  
  // Calculate total buyers and market value
  const calculations = React.useMemo(() => {
    if (!watchedAudienceSize || !watchedBuyerRate) return null;
    
    const audience = typeof watchedAudienceSize === 'string' 
      ? parseFloat(watchedAudienceSize.replace(/[^0-9.-]+/g, '')) 
      : watchedAudienceSize;
      
    const buyerRate = typeof watchedBuyerRate === 'string'
      ? parseFloat(watchedBuyerRate.replace(/[^0-9.-]+/g, '')) / 100
      : watchedBuyerRate / 100;
    
    if (isNaN(audience) || isNaN(buyerRate)) return null;
    
    // Calculate total buyers
    const totalBuyers = Math.round(audience * buyerRate);
    
    // Calculate total market value if customer value is available
    let totalMarketValue = null;
    if (watchedAnnualCustomerValue) {
      const customerValue = typeof watchedAnnualCustomerValue === 'string'
        ? parseFloat(watchedAnnualCustomerValue.replace(/[^0-9.-]+/g, ''))
        : watchedAnnualCustomerValue;
        
      if (!isNaN(customerValue)) {
        totalMarketValue = totalBuyers * customerValue;
      }
    }
    
    return {
      totalBuyers,
      totalMarketValue
    };
  }, [watchedAudienceSize, watchedBuyerRate, watchedAnnualCustomerValue]);
  
  // Format number with commas
  const formatNumber = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US').format(value);
  };
  
  // Format currency
  const formatCurrency = (value) => {
    if (!value) return '';
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
          <LineChartIcon className="h-5 w-5 text-primary" />
          Market Overview
        </CardTitle>
        <CardDescription>
          Enter details about the target market size and value
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="audienceSize" className="flex items-center gap-1">
              <UsersIcon className="h-4 w-4" /> Audience Size
            </Label>
            <Controller
              name="audienceSize"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <Input
                    id="audienceSize"
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
            <Label htmlFor="buyerRate" className="flex items-center gap-1">
              <PercentIcon className="h-4 w-4" /> Buyer %
            </Label>
            <Controller
              name="buyerRate"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <Input
                    id="buyerRate"
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
            <Label htmlFor="annualCustomerValue" className="flex items-center gap-1">
              <DollarSignIcon className="h-4 w-4" /> Yearly Average Customer Value
            </Label>
            <Controller
              name="annualCustomerValue"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <Input
                    id="annualCustomerValue"
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
        </div>
        
        {/* Calculations */}
        {calculations && (
          <div className="mt-6 p-4 bg-secondary/30 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Buyers:</p>
                <p className="text-xl font-semibold">{formatNumber(calculations.totalBuyers)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on {formatNumber(watchedAudienceSize)} audience × {watchedBuyerRate}% buyer rate
                </p>
              </div>
              
              {calculations.totalMarketValue && (
                <div>
                  <p className="text-sm text-muted-foreground">Total Market Revenue:</p>
                  <p className="text-xl font-semibold text-primary">{formatCurrency(calculations.totalMarketValue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on {formatNumber(calculations.totalBuyers)} buyers × {formatCurrency(watchedAnnualCustomerValue)} per customer
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
