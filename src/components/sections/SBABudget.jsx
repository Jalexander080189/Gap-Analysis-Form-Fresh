import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useFormContext } from 'react-hook-form';
import { DollarSignIcon, CalendarIcon } from 'lucide-react';

const SBABudget = () => {
  const form = useFormContext();
  
  // Watch values for calculations
  const watchedYear1 = form.watch("sbaBudgetYear1");
  const watchedYear2 = form.watch("sbaBudgetYear2");
  const watchedYear3 = form.watch("sbaBudgetYear3");
  const watchedYear4 = form.watch("sbaBudgetYear4");
  const watchedYear5 = form.watch("sbaBudgetYear5");
  
  // Calculate total budget
  const totalBudget = React.useMemo(() => {
    let total = 0;
    
    if (watchedYear1) {
      const year1 = typeof watchedYear1 === 'string' 
        ? parseFloat(watchedYear1.replace(/[^0-9.-]+/g, '')) 
        : watchedYear1;
      if (!isNaN(year1)) total += year1;
    }
    
    if (watchedYear2) {
      const year2 = typeof watchedYear2 === 'string' 
        ? parseFloat(watchedYear2.replace(/[^0-9.-]+/g, '')) 
        : watchedYear2;
      if (!isNaN(year2)) total += year2;
    }
    
    if (watchedYear3) {
      const year3 = typeof watchedYear3 === 'string' 
        ? parseFloat(watchedYear3.replace(/[^0-9.-]+/g, '')) 
        : watchedYear3;
      if (!isNaN(year3)) total += year3;
    }
    
    if (watchedYear4) {
      const year4 = typeof watchedYear4 === 'string' 
        ? parseFloat(watchedYear4.replace(/[^0-9.-]+/g, '')) 
        : watchedYear4;
      if (!isNaN(year4)) total += year4;
    }
    
    if (watchedYear5) {
      const year5 = typeof watchedYear5 === 'string' 
        ? parseFloat(watchedYear5.replace(/[^0-9.-]+/g, '')) 
        : watchedYear5;
      if (!isNaN(year5)) total += year5;
    }
    
    return total;
  }, [watchedYear1, watchedYear2, watchedYear3, watchedYear4, watchedYear5]);
  
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
          <DollarSignIcon className="h-5 w-5 text-primary" />
          5-Year SBA Marketing Budget
        </CardTitle>
        <CardDescription>
          Enter the marketing budget allocation for each year of the SBA loan term
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="sbaBudgetYear1" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" /> Year 1 Budget
              </Label>
              <Controller
                name="sbaBudgetYear1"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      id="sbaBudgetYear1"
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
              <Label htmlFor="sbaBudgetYear2" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" /> Year 2 Budget
              </Label>
              <Controller
                name="sbaBudgetYear2"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      id="sbaBudgetYear2"
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
              <Label htmlFor="sbaBudgetYear3" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" /> Year 3 Budget
              </Label>
              <Controller
                name="sbaBudgetYear3"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      id="sbaBudgetYear3"
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
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="sbaBudgetYear4" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" /> Year 4 Budget
              </Label>
              <Controller
                name="sbaBudgetYear4"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      id="sbaBudgetYear4"
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
              <Label htmlFor="sbaBudgetYear5" className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" /> Year 5 Budget
              </Label>
              <Controller
                name="sbaBudgetYear5"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      id="sbaBudgetYear5"
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
              <Label htmlFor="sbaBudgetNotes" className="flex items-center gap-1">
                Budget Notes
              </Label>
              <Controller
                name="sbaBudgetNotes"
                control={form.control}
                render={({ field }) => (
                  <Textarea
                    id="sbaBudgetNotes"
                    placeholder="Enter any notes about the budget allocation..."
                    {...field}
                    rows={3}
                  />
                )}
              />
            </div>
          </div>
        </div>
        
        {/* Total Budget Summary */}
        {totalBudget > 0 && (
          <div className="mt-6 p-4 bg-secondary/30 rounded-md">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Total 5-Year Marketing Budget:</h3>
              <span className="text-xl font-bold text-primary">{formatCurrency(totalBudget)}</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Average annual budget: {formatCurrency(totalBudget / 5)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SBABudget;
