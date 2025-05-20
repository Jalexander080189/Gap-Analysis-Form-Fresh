import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Controller, useFormContext } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Users2Icon, PlusCircleIcon } from 'lucide-react';

const Demographics = () => {
  const form = useFormContext();
  
  // Watch the target audience type toggle value
  const watchedTargetAudienceType = form.watch("targetAudienceType");
  
  // State for additional B2B options
  const [b2bAdditionalOptions, setB2bAdditionalOptions] = React.useState([]);
  
  // State for additional B2C options
  const [b2cAdditionalOptions, setB2cAdditionalOptions] = React.useState([]);
  
  // Add additional B2B option
  const addB2bOption = () => {
    const newId = `b2b-option-${b2bAdditionalOptions.length}`;
    setB2bAdditionalOptions([...b2bAdditionalOptions, { id: newId, label: '', value: '' }]);
  };
  
  // Add additional B2C option
  const addB2cOption = () => {
    const newId = `b2c-option-${b2cAdditionalOptions.length}`;
    setB2cAdditionalOptions([...b2cAdditionalOptions, { id: newId, label: '', value: '' }]);
  };
  
  // Update B2B option
  const updateB2bOption = (index, field, value) => {
    const updatedOptions = [...b2bAdditionalOptions];
    updatedOptions[index][field] = value;
    setB2bAdditionalOptions(updatedOptions);
    
    // Update form value
    const allOptions = updatedOptions.map(opt => `${opt.label}: ${opt.value}`).join('\n');
    form.setValue('b2bAdditionalOptionsText', allOptions);
  };
  
  // Update B2C option
  const updateB2cOption = (index, field, value) => {
    const updatedOptions = [...b2cAdditionalOptions];
    updatedOptions[index][field] = value;
    setB2cAdditionalOptions(updatedOptions);
    
    // Update form value
    const allOptions = updatedOptions.map(opt => `${opt.label}: ${opt.value}`).join('\n');
    form.setValue('b2cAdditionalOptionsText', allOptions);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users2Icon className="h-5 w-5 mr-2 text-primary" />
          Demographics & Target Audience
        </CardTitle>
        <CardDescription>
          Define your target audience segments and demographics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Target Audience Type Toggle */}
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Target Audience Type
          </Label>
          <Controller
            name="targetAudienceType"
            control={form.control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B2C" id="audience-b2c" />
                  <Label htmlFor="audience-b2c">B2C</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="B2B" id="audience-b2b" />
                  <Label htmlFor="audience-b2b">B2B</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Both" id="audience-both" />
                  <Label htmlFor="audience-both">Both</Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
        
        {/* B2B Demographics - show when B2B or Both is selected */}
        {(watchedTargetAudienceType === "B2B" || watchedTargetAudienceType === "Both") && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-md font-semibold mb-4">B2B Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="b2bLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Location / Radius
                </Label>
                <Controller
                  name="b2bLocation"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="b2bLocation"
                      placeholder="e.g., Nationwide, 50-mile radius of Chicago"
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="b2bIndustries" className="block text-sm font-medium text-gray-700 mb-1">
                  Industries
                </Label>
                <Controller
                  name="b2bIndustries"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="b2bIndustries"
                      placeholder="e.g., Healthcare, Finance, Technology"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="b2bCompanySize" className="block text-sm font-medium text-gray-700 mb-1">
                  Size of Company
                </Label>
                <Controller
                  name="b2bCompanySize"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id="b2bCompanySize">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (1-50 employees)</SelectItem>
                        <SelectItem value="medium">Medium (51-500 employees)</SelectItem>
                        <SelectItem value="large">Large (501+ employees)</SelectItem>
                        <SelectItem value="all">All Sizes</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="b2bRevenueRange" className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Revenue Range
                </Label>
                <Controller
                  name="b2bRevenueRange"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="b2bRevenueRange"
                      placeholder="e.g., $1M-$10M"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            
            {/* Additional B2B Options */}
            {b2bAdditionalOptions.map((option, index) => (
              <div key={option.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor={`${option.id}-label`} className="block text-sm font-medium text-gray-700 mb-1">
                    Option Label
                  </Label>
                  <Input
                    id={`${option.id}-label`}
                    value={option.label}
                    onChange={(e) => updateB2bOption(index, 'label', e.target.value)}
                    placeholder="e.g., Decision Makers"
                  />
                </div>
                <div>
                  <Label htmlFor={`${option.id}-value`} className="block text-sm font-medium text-gray-700 mb-1">
                    Option Value
                  </Label>
                  <Input
                    id={`${option.id}-value`}
                    value={option.value}
                    onChange={(e) => updateB2bOption(index, 'value', e.target.value)}
                    placeholder="e.g., CTO, IT Director"
                  />
                </div>
              </div>
            ))}
            
            {/* Hidden field to store additional options */}
            <Controller
              name="b2bAdditionalOptionsText"
              control={form.control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addB2bOption}
              className="mt-4"
            >
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Add Additional Option
            </Button>
          </div>
        )}
        
        {/* B2C Demographics - show when B2C or Both is selected */}
        {(watchedTargetAudienceType === "B2C" || watchedTargetAudienceType === "Both") && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-md font-semibold mb-4">B2C Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="b2cLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Location / Radius
                </Label>
                <Controller
                  name="b2cLocation"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="b2cLocation"
                      placeholder="e.g., 25-mile radius of downtown"
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="b2cAgeGroup" className="block text-sm font-medium text-gray-700 mb-1">
                  Age Group
                </Label>
                <Controller
                  name="b2cAgeGroup"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="b2cAgeGroup"
                      placeholder="e.g., 25-45"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="b2cIncomeLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Income Level
                </Label>
                <Controller
                  name="b2cIncomeLevel"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="b2cIncomeLevel"
                      placeholder="e.g., $75K-$150K annually"
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <Label htmlFor="b2cHomeownership" className="block text-sm font-medium text-gray-700 mb-1">
                  Assets, Homeowner Status
                </Label>
                <Controller
                  name="b2cHomeownership"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="b2cHomeownership"
                      placeholder="e.g., Homeowners with 2+ vehicles"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            
            {/* Additional B2C Options */}
            {b2cAdditionalOptions.map((option, index) => (
              <div key={option.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor={`${option.id}-label`} className="block text-sm font-medium text-gray-700 mb-1">
                    Option Label
                  </Label>
                  <Input
                    id={`${option.id}-label`}
                    value={option.label}
                    onChange={(e) => updateB2cOption(index, 'label', e.target.value)}
                    placeholder="e.g., Interests"
                  />
                </div>
                <div>
                  <Label htmlFor={`${option.id}-value`} className="block text-sm font-medium text-gray-700 mb-1">
                    Option Value
                  </Label>
                  <Input
                    id={`${option.id}-value`}
                    value={option.value}
                    onChange={(e) => updateB2cOption(index, 'value', e.target.value)}
                    placeholder="e.g., Fitness, Travel, Technology"
                  />
                </div>
              </div>
            ))}
            
            {/* Hidden field to store additional options */}
            <Controller
              name="b2cAdditionalOptionsText"
              control={form.control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addB2cOption}
              className="mt-4"
            >
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Add Additional Option
            </Button>
          </div>
        )}
        
        {/* Notes field */}
        <div className="mt-6">
          <Label htmlFor="targetAudienceNotes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </Label>
          <Controller
            name="targetAudienceNotes"
            control={form.control}
            render={({ field }) => (
              <Textarea
                id="targetAudienceNotes"
                placeholder="Additional notes about your target audience..."
                rows={3}
                {...field}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Demographics;
