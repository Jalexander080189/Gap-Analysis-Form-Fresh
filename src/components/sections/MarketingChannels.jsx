import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import { LineChartIcon, DollarSignIcon, PlusCircleIcon, Trash2Icon } from 'lucide-react';

const MarketingChannels = () => {
  const form = useFormContext();
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "marketingChannels",
  });
  
  // Calculate total monthly spend
  const totalMonthlySpend = React.useMemo(() => {
    let total = 0;
    
    if (fields && fields.length > 0) {
      fields.forEach(field => {
        const spend = form.watch(`marketingChannels.${field.id}.monthlySpend`);
        if (spend) {
          const amount = typeof spend === 'string' 
            ? parseFloat(spend.replace(/[^0-9.-]+/g, '')) 
            : spend;
          if (!isNaN(amount)) total += amount;
        }
      });
    }
    
    return total;
  }, [fields, form]);
  
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
          Current Marketing Channels
        </CardTitle>
        <CardDescription>
          List all current marketing channels and monthly spend
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start border-b pb-4">
            <div className="md:col-span-5">
              <Label htmlFor={`marketingChannels.${index}.channelName`} className="mb-1 block">
                Channel Name
              </Label>
              <Controller
                name={`marketingChannels.${index}.channelName`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      id={`marketingChannels.${index}.channelName`}
                      placeholder="e.g., Google Ads, Facebook, SEO"
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
            
            <div className="md:col-span-3">
              <Label htmlFor={`marketingChannels.${index}.monthlySpend`} className="mb-1 block">
                Monthly Spend
              </Label>
              <Controller
                name={`marketingChannels.${index}.monthlySpend`}
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      id={`marketingChannels.${index}.monthlySpend`}
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
            
            <div className="md:col-span-3">
              <Label htmlFor={`marketingChannels.${index}.notes`} className="mb-1 block">
                Notes
              </Label>
              <Controller
                name={`marketingChannels.${index}.notes`}
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    id={`marketingChannels.${index}.notes`}
                    placeholder="Optional notes about this channel"
                    {...field}
                    rows={1}
                  />
                )}
              />
            </div>
            
            <div className="md:col-span-1 flex items-end justify-end h-full">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                <Trash2Icon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ channelName: '', monthlySpend: undefined, notes: '' })}
          className="flex items-center gap-1"
        >
          <PlusCircleIcon className="h-4 w-4" />
          Add Marketing Channel
        </Button>
        
        {/* Total Monthly Spend Summary */}
        {totalMonthlySpend > 0 && (
          <div className="mt-6 p-4 bg-secondary/30 rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Total Monthly Marketing Spend:</h3>
              <span className="text-xl font-bold text-primary">{formatCurrency(totalMonthlySpend)}</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Estimated annual spend: {formatCurrency(totalMonthlySpend * 12)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketingChannels;
