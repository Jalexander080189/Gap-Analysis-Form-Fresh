import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useFormContext } from 'react-hook-form';
import { BuildingIcon, GlobeIcon, UserIcon, CalendarDaysIcon } from 'lucide-react';

const ClientInformation = () => {
  const form = useFormContext();
  const watchedIndustry = form.watch("industry");
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BuildingIcon className="h-5 w-5 text-primary" />
          Client Information
        </CardTitle>
        <CardDescription>
          Enter basic information about the client company
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="clientName" className="flex items-center gap-1">
                <BuildingIcon className="h-4 w-4" /> Company Name
              </Label>
              <Controller
                name="clientName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      id="clientName"
                      placeholder="Enter company name"
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
              <Label htmlFor="website" className="flex items-center gap-1">
                <GlobeIcon className="h-4 w-4" /> Website
              </Label>
              <Controller
                name="website"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      id="website"
                      placeholder="https://example.com"
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
              <Label htmlFor="industry" className="flex items-center gap-1">
                <BuildingIcon className="h-4 w-4" /> Industry
              </Label>
              <Controller
                name="industry"
                control={form.control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="food_beverage">Food & Beverage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            
            {watchedIndustry === 'other' && (
              <div>
                <Label htmlFor="industryOther" className="flex items-center gap-1">
                  Specify Industry
                </Label>
                <Controller
                  name="industryOther"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="industryOther"
                      placeholder="Specify industry"
                      {...field}
                    />
                  )}
                />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="ownerNamePrimary" className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" /> Primary Owner Name
              </Label>
              <Controller
                name="ownerNamePrimary"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="ownerNamePrimary"
                    placeholder="Enter primary owner name"
                    {...field}
                  />
                )}
              />
            </div>
            
            <div>
              <Label htmlFor="coOwnerNameOptional" className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" /> Co-Owner Name (Optional)
              </Label>
              <Controller
                name="coOwnerNameOptional"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="coOwnerNameOptional"
                    placeholder="Enter co-owner name (if applicable)"
                    {...field}
                  />
                )}
              />
            </div>
            
            <div>
              <Label htmlFor="yearsInBusiness" className="flex items-center gap-1">
                <CalendarDaysIcon className="h-4 w-4" /> Years in Business
              </Label>
              <Controller
                name="yearsInBusiness"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      id="yearsInBusiness"
                      type="number"
                      placeholder="0"
                      min="0"
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
              <Label htmlFor="lookerStudioLink" className="flex items-center gap-1">
                <GlobeIcon className="h-4 w-4" /> Looker Studio Link (Optional)
              </Label>
              <Controller
                name="lookerStudioLink"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div>
                    <Input
                      id="lookerStudioLink"
                      placeholder="https://lookerstudio.google.com/..."
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInformation;
