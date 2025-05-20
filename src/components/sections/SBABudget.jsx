import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Controller, useFormContext } from 'react-hook-form';
import { DollarSignIcon, TrendingUpIcon, UsersIcon, CalendarIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SBABudget = () => {
  const form = useFormContext();
  const [spendIncreaseRate, setSpendIncreaseRate] = useState(15); // Default 15% increase
  
  // Watch values for calculations
  const watchedAnnualRevenue = form.watch("annualRevenue");
  const watchedAverageCustomerValue = form.watch("annualCustomerValue");
  
  // Calculate budget and projections for 5 years
  const calculations = React.useMemo(() => {
    if (!watchedAnnualRevenue) return null;
    
    const annualRevenue = typeof watchedAnnualRevenue === 'string' 
      ? parseFloat(watchedAnnualRevenue.replace(/[^0-9.-]+/g, '')) 
      : watchedAnnualRevenue;
      
    if (isNaN(annualRevenue)) return null;
    
    const avgCustomerValue = typeof watchedAverageCustomerValue === 'string'
      ? parseFloat(watchedAverageCustomerValue.replace(/[^0-9.-]+/g, ''))
      : watchedAverageCustomerValue || 0;
    
    // Calculate 5-year projections
    const years = [];
    let currentRevenue = annualRevenue;
    let previousYearBudget = 0;
    let totalMarketingSpend = 0;
    
    for (let i = 1; i <= 5; i++) {
      // Calculate marketing budget (8% of revenue)
      const yearlyMarketingBudget = currentRevenue * 0.08;
      
      // Calculate spend increase from previous year
      const spendIncrease = i === 1 ? 0 : yearlyMarketingBudget - previousYearBudget;
      
      // Calculate minimum ROI (3x marketing spend)
      const minimumROI = yearlyMarketingBudget * 3;
      
      // Calculate end of year revenue
      const endOfYearRevenue = currentRevenue + minimumROI;
      
      // Calculate percentage revenue increase
      const revenueIncreasePercent = (minimumROI / currentRevenue) * 100;
      
      // Calculate customers needed
      const customersNeeded = avgCustomerValue > 0 ? minimumROI / avgCustomerValue : 0;
      
      years.push({
        year: i,
        startRevenue: currentRevenue,
        spendIncrease: spendIncrease,
        yearlyBudget: yearlyMarketingBudget,
        monthlyBudget: yearlyMarketingBudget / 12,
        minimumROI: minimumROI,
        endRevenue: endOfYearRevenue,
        revenueIncreasePercent: revenueIncreasePercent,
        customersNeeded: {
          annually: customersNeeded,
          monthly: customersNeeded / 12,
          weekly: customersNeeded / 52,
          daily: customersNeeded / 365
        }
      });
      
      // Update for next year
      currentRevenue = endOfYearRevenue;
      previousYearBudget = yearlyMarketingBudget;
      totalMarketingSpend += yearlyMarketingBudget;
    }
    
    return {
      years: years,
      worstCaseRevenue: years[4].endRevenue, // Year 5 end revenue
      totalMarketingSpend: totalMarketingSpend
    };
  }, [watchedAnnualRevenue, watchedAverageCustomerValue, spendIncreaseRate]);
  
  // Format currency
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Format percentage
  const formatPercent = (value) => {
    if (value === undefined || value === null) return '0%';
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };
  
  // Format number
  const formatNumber = (value) => {
    if (value === undefined || value === null) return '0';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSignIcon className="h-5 w-5 text-primary" />
          SBA Marketing Budget – 5 Year Calculation
        </CardTitle>
        <CardDescription>
          Calculate 5-year marketing budget and projected growth
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="annualRevenue" className="flex items-center gap-1">
              <DollarSignIcon className="h-4 w-4" /> Annual Revenue
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
            <Label htmlFor="annualCustomerValue" className="flex items-center gap-1">
              <UsersIcon className="h-4 w-4" /> Average Customer Value
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
        
        {/* 5-Year Budget Table */}
        {calculations && (
          <div className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Year</TableHead>
                  <TableHead>Start Revenue</TableHead>
                  <TableHead>Spend Increase</TableHead>
                  <TableHead>Yearly Budget</TableHead>
                  <TableHead className="text-red-600">Monthly Budget</TableHead>
                  <TableHead>Min 3x ROI</TableHead>
                  <TableHead className="text-green-600">End Year Revenue</TableHead>
                  <TableHead>% Increase</TableHead>
                  <TableHead>Customers Needed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculations.years.map((year) => (
                  <TableRow key={year.year}>
                    <TableCell className="font-medium">{year.year}</TableCell>
                    <TableCell>{formatCurrency(year.startRevenue)}</TableCell>
                    <TableCell>{formatCurrency(year.spendIncrease)}</TableCell>
                    <TableCell>{formatCurrency(year.yearlyBudget)}</TableCell>
                    <TableCell className="text-red-600 font-medium">{formatCurrency(year.monthlyBudget)}</TableCell>
                    <TableCell>{formatCurrency(year.minimumROI)}</TableCell>
                    <TableCell className="text-green-600 font-medium">{formatCurrency(year.endRevenue)}</TableCell>
                    <TableCell>{formatPercent(year.revenueIncreasePercent)}</TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div>Annual: {formatNumber(year.customersNeeded.annually)}</div>
                        <div>Monthly: {formatNumber(year.customersNeeded.monthly)}</div>
                        <div>Weekly: {formatNumber(year.customersNeeded.weekly)}</div>
                        <div>Daily: {formatNumber(year.customersNeeded.daily)}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Worst Case Scenario Summary */}
        {calculations && (
          <div className="mt-6 p-4 bg-secondary/30 rounded-md">
            <h3 className="font-medium mb-3">Worst Case Scenario (5 Years)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">5-Year Annual Revenue:</p>
                <p className="text-xl font-semibold text-green-600">{formatCurrency(calculations.worstCaseRevenue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">5-Year Marketing Spend:</p>
                <p className="text-xl font-semibold text-red-600">{formatCurrency(calculations.totalMarketingSpend)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SBABudget;
