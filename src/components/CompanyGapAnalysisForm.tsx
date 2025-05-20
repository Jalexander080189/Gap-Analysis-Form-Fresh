import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Share2Icon, PrinterIcon, SparklesIcon, InfoIcon, PlusCircleIcon, Trash2Icon, Wand2Icon, SaveIcon, Building2Icon, GlobeIcon, UserIcon, UsersIcon, CalendarDaysIcon, BriefcaseIcon, TargetIcon, DollarSignIcon, PercentIcon, Users2Icon, LineChartIcon, ExternalLinkIcon } from 'lucide-react'; // Added ExternalLinkIcon

// Helper function to parse numbers with K/M suffixes
const parseNumberWithSuffixes = (value: string | number | undefined): number | undefined => {
  if (value === undefined || value === null || String(value).trim() === '') return undefined;
  let numStr = String(value).trim().toUpperCase();
  let multiplier = 1;
  if (numStr.endsWith('K')) {
    multiplier = 1000;
    numStr = numStr.slice(0, -1);
  } else if (numStr.endsWith('M')) {
    multiplier = 1000000;
    numStr = numStr.slice(0, -1);
  }
  numStr = numStr.replace(/,/g, ''); // Remove commas
  const num = parseFloat(numStr);
  if (isNaN(num)) return undefined;
  return num * multiplier;
};

// Zod schema for individual marketing channel
const marketingChannelSchema = z.object({
  channelName: z.string().min(1, 'Channel name is required').optional().or(z.literal('')),
  monthlySpend: z.preprocess(
    (val) => parseNumberWithSuffixes(String(val)),
    z.number({ invalid_type_error: "Must be a number" }).positive({ message: "Must be a positive number" }).optional()
  ),
  notes: z.string().optional(),
});

// Zod schema definition
const formSchema = z.object({
  // Client Information
  clientName: z.string().min(1, 'Company Name is required, especially for new reports.').optional().or(z.literal('')),
  website: z.string().url({ message: "Invalid URL format" }).optional().or(z.literal('')),
  ownerNamePrimary: z.string().optional(),
  coOwnerNameOptional: z.string().optional(),
  yearsInBusiness: z.preprocess(
    (val) => (val === "" || val === undefined || val === null) ? undefined : (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number({ invalid_type_error: "Must be a whole number" }).int({ message: "Must be a whole number" }).min(0, { message: "Years in business cannot be negative" }).optional()
  ),
  industry: z.string().optional(),
  industryOther: z.string().optional(),
  lookerStudioLink: z.string().url({ message: "Invalid URL format for Looker Studio link" }).optional().or(z.literal('')), // New field
  
  // Project Details
  projectName: z.string().min(1, 'Project name is required').optional().or(z.literal('')),
  projectDate: z.string().min(1, 'Project date is required').optional().or(z.literal('')),
  preparedFor: z.string().optional(),
  preparedBy: z.string().optional(),
  shareableLink: z.string().url().optional().or(z.literal('')),
  
  // Market Overview
  marketOverviewNotes: z.string().optional(),
  audienceSize: z.preprocess(
    (val) => parseNumberWithSuffixes(String(val)),
    z.number({ invalid_type_error: "Audience size must be a number" }).positive({ message: "Audience size must be positive" }).optional()
  ),
  buyerRate: z.preprocess(
    (val) => (val === "" || val === undefined || val === null) ? undefined : (typeof val === 'string' ? parseFloat(String(val).replace(/%/g, '')) : val),
    z.number({ invalid_type_error: "Buyer rate must be a number" }).min(0, {message: "Buyer rate cannot be negative"}).max(100, {message: "Buyer rate cannot exceed 100"}).optional()
  ),
  annualCustomerValue: z.preprocess(
    (val) => parseNumberWithSuffixes(String(val)),
    z.number({ invalid_type_error: "Annual customer value must be a number" }).positive({ message: "Annual customer value must be positive" }).optional()
  ),

  // Company Overview
  companyMission: z.string().optional(),
  companyVision: z.string().optional(),
  companyValues: z.string().optional(),
  keyProductsServices: z.string().optional(),
  competitiveAdvantages: z.string().optional(),

  // Gaps & Opportunity / Funnel
  currentPerformance: z.string().optional(),
  desiredFutureState: z.string().optional(),
  identifiedGaps: z.string().optional(),
  opportunitiesForGrowth: z.string().optional(),
  funnelStage1Name: z.string().optional(),
  funnelStage1Metrics: z.string().optional(),
  funnelStage2Name: z.string().optional(),
  funnelStage2Metrics: z.string().optional(),
  funnelStage3Name: z.string().optional(),
  funnelStage3Metrics: z.string().optional(),
  funnelStage4Name: z.string().optional(),
  funnelStage4Metrics: z.string().optional(),

  // Scenario Planning
  scenarioName1: z.string().optional(),
  scenarioDescription1: z.string().optional(),
  scenarioLikelihood1: z.string().optional(),
  scenarioImpact1: z.string().optional(),
  scenarioMitigation1: z.string().optional(),
  scenarioName2: z.string().optional(),
  scenarioDescription2: z.string().optional(),
  scenarioLikelihood2: z.string().optional(),
  scenarioImpact2: z.string().optional(),
  scenarioMitigation2: z.string().optional(),
  scenarioName3: z.string().optional(),
  scenarioDescription3: z.string().optional(),
  scenarioLikelihood3: z.string().optional(),
  scenarioImpact3: z.string().optional(),
  scenarioMitigation3: z.string().optional(),

  // Current Marketing
  marketingChannels: z.array(marketingChannelSchema).optional(),

  // 5-Year SBA Marketing Budget
  sbaBudgetYear1: z.preprocess(
    (val) => parseNumberWithSuffixes(String(val)),
    z.number({ invalid_type_error: "Must be a number" }).nonnegative({ message: "Must be a non-negative number" }).optional()
  ),
  sbaBudgetYear2: z.preprocess(
    (val) => parseNumberWithSuffixes(String(val)),
    z.number({ invalid_type_error: "Must be a number" }).nonnegative({ message: "Must be a non-negative number" }).optional()
  ),
  sbaBudgetYear3: z.preprocess(
    (val) => parseNumberWithSuffixes(String(val)),
    z.number({ invalid_type_error: "Must be a number" }).nonnegative({ message: "Must be a non-negative number" }).optional()
  ),
  sbaBudgetYear4: z.preprocess(
    (val) => parseNumberWithSuffixes(String(val)),
    z.number({ invalid_type_error: "Must be a number" }).nonnegative({ message: "Must be a non-negative number" }).optional()
  ),
  sbaBudgetYear5: z.preprocess(
    (val) => parseNumberWithSuffixes(String(val)),
    z.number({ invalid_type_error: "Must be a number" }).nonnegative({ message: "Must be a non-negative number" }).optional()
  ),
  sbaBudgetNotes: z.string().optional(),

  // Demographics & Target Audience
  targetAudienceType: z.enum(["B2C", "B2B", "Both"]).optional(),
  demographicsB2C: z.string().optional(),
  demographicsB2B: z.string().optional(),
  targetAudienceNotes: z.string().optional(),

  // GPT Data Block
  gptDataBlock: z.string().optional(),
  owners: z.string().optional(), 
});

export type CompanyGapAnalysisFormValues = z.infer<typeof formSchema>;

interface CompanyGapAnalysisFormProps {
  initialData?: Partial<CompanyGapAnalysisFormValues>;
  onSubmit: (data: CompanyGapAnalysisFormValues) => void;
  isLoading?: boolean;
  isGenerating?: boolean;
  onGenerate?: (section: keyof CompanyGapAnalysisFormValues | 'all' | 'currentVsDesired' | 'gapAnalysis' | 'recommendations' | 'actionableInsights' | 'scenarioPlanning') => void;
  setFormState?: (state: CompanyGapAnalysisFormValues) => void; 
  isNewAnalysisMode?: boolean;
}

const likelihoodOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const impactOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const industryOptions = [
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail' },
  { value: 'finance', label: 'Finance' },
  { value: 'construction', label: 'Construction' },
  { value: 'technology', label: 'Technology' },
  { value: 'food_beverage', label: 'Food & Beverage' },
  { value: 'other', label: 'Other' },
];

const gptIgnoreKeywords = ["N/A", "COULD NOT FIND", "UNKNOWN", "—", ""];

const formatNumberWithCommas = (num?: number): string => {
  if (num === undefined || num === null || isNaN(num)) return '';
  return num.toLocaleString('en-US');
};

const formatCurrency = (num?: number): string => {
  if (num === undefined || num === null || isNaN(num)) return '';
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export const CompanyGapAnalysisForm: React.FC<CompanyGapAnalysisFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  isGenerating = false,
  onGenerate,
  setFormState,
  isNewAnalysisMode = false,
}) => {
  const form = useForm<CompanyGapAnalysisFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { 
      marketingChannels: [{ channelName: '', monthlySpend: undefined, notes: '' }],
      targetAudienceType: undefined,
      gptDataBlock: '', 
      industry: '',
      industryOther: '',
      audienceSize: undefined,
      buyerRate: undefined,
      annualCustomerValue: undefined,
      lookerStudioLink: '', // Initialize new field
    }, 
  });

  const [gptPasteInput, setGptPasteInput] = useState('');
  const watchedIndustry = form.watch("industry");
  const watchedAudienceSize = form.watch("audienceSize");
  const watchedBuyerRate = form.watch("buyerRate");
  const watchedAnnualCustomerValue = form.watch("annualCustomerValue");
  const watchedLookerStudioLink = form.watch("lookerStudioLink"); // Watch the new field

  const { fields: marketingChannelFields, append: appendMarketingChannel, remove: removeMarketingChannel } = useFieldArray({
    control: form.control,
    name: "marketingChannels",
  });

  const targetAudienceTypeValue = form.watch("targetAudienceType");

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  useEffect(() => {
    if (setFormState && !isNewAnalysisMode) {
      const subscription = form.watch((value) => {
        const currentValues = form.getValues();
        setFormState(currentValues as CompanyGapAnalysisFormValues);
      });
      return () => subscription.unsubscribe();
    }
  }, [form, setFormState, isNewAnalysisMode]);

  const handleFormSubmit = (data: CompanyGapAnalysisFormValues) => {
    onSubmit(data);
  };

  const handleGptAutofill = () => {
    const lines = gptPasteInput.split('\n');
    const dataToSet: Partial<CompanyGapAnalysisFormValues> = {};

    lines.forEach(line => {
      const parts = line.split(':');
      if (parts.length < 2) return;
      const key = parts[0].trim();
      let value = parts.slice(1).join(':').trim();

      if (gptIgnoreKeywords.includes(value.toUpperCase()) || value === '') {
        value = ''; 
      } else {
        switch (key.toLowerCase()) {
          case 'company name':
            if (value) dataToSet.clientName = value;
            break;
          case 'website':
            if (value) dataToSet.website = value;
            break;
          case 'owner':
          case 'owner name':
            if (value) dataToSet.ownerNamePrimary = value;
            break;
          case 'co-owner':
          case 'co-owner name':
            if (value) dataToSet.coOwnerNameOptional = value;
            break;
          case 'years in business':
            const years = parseInt(value, 10);
            if (!isNaN(years) && value) dataToSet.yearsInBusiness = years;
            break;
          case 'industry':
            if (value) {
                const foundIndustry = industryOptions.find(opt => opt.label.toLowerCase() === value.toLowerCase());
                if (foundIndustry) {
                    dataToSet.industry = foundIndustry.value;
                } else {
                    dataToSet.industry = 'other';
                    dataToSet.industryOther = value;
                }
            }
            break;
          case 'audience size':
            const audience = parseNumberWithSuffixes(value);
            if (audience !== undefined && value) dataToSet.audienceSize = audience;
            break;
          case 'buyer rate':
          case 'buyer %':
            const rate = parseFloat(value.replace(/%/g, ''));
            if (!isNaN(rate) && value) dataToSet.buyerRate = rate;
            break;
          case 'annual customer value':
          case 'customer value':
            const acv = parseNumberWithSuffixes(value);
            if (acv !== undefined && value) dataToSet.annualCustomerValue = acv;
            break;
          // Note: lookerStudioLink is not part of GPT autofill per user request
          default:
            break;
        }
      }
    });

    Object.entries(dataToSet).forEach(([fieldName, fieldValue]) => {
        if (fieldValue !== '' || fieldName === 'industryOther') { 
             form.setValue(fieldName as keyof CompanyGapAnalysisFormValues, fieldValue, { shouldValidate: true, shouldDirty: true });
        }
    });
    form.setValue('gptDataBlock', gptPasteInput, { shouldValidate: true, shouldDirty: true });
  };

  const calculatedBuyers = React.useMemo(() => {
    if (watchedAudienceSize && watchedBuyerRate !== undefined && watchedBuyerRate !== null) {
      return watchedAudienceSize * (watchedBuyerRate / 100);
    }
    return undefined;
  }, [watchedAudienceSize, watchedBuyerRate]);

  const calculatedMarketCap = React.useMemo(() => {
    if (calculatedBuyers && watchedAnnualCustomerValue) {
      return calculatedBuyers * watchedAnnualCustomerValue;
    }
    return undefined;
  }, [calculatedBuyers, watchedAnnualCustomerValue]);

  const showCalculatedMarketFields = 
    watchedAudienceSize !== undefined && watchedAudienceSize > 0 &&
    watchedBuyerRate !== undefined && watchedBuyerRate >= 0 &&
    watchedAnnualCustomerValue !== undefined && watchedAnnualCustomerValue > 0;

  const renderScenarioFields = (index: 1 | 2 | 3) => (
    <div key={index} className="space-y-4 p-4 border rounded-md">
      <h4 className="text-md font-semibold text-gray-700">Scenario {index}</h4>
      <div>
        <Label htmlFor={`scenarioName${index}`} className="block text-sm font-medium text-gray-700 mb-1">Scenario Name</Label>
        <Controller name={`scenarioName${index}` as any} control={form.control} render={({ field }) => <Input id={`scenarioName${index}`} {...field} placeholder={`Name of scenario ${index}`} />} />
      </div>
      <div>
        <Label htmlFor={`scenarioDescription${index}`} className="block text-sm font-medium text-gray-700 mb-1">Description</Label>
        <Controller name={`scenarioDescription${index}` as any} control={form.control} render={({ field }) => <Textarea id={`scenarioDescription${index}`} {...field} placeholder={`Describe scenario ${index}...`} rows={3} />} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`scenarioLikelihood${index}`} className="block text-sm font-medium text-gray-700 mb-1">Likelihood</Label>
          <Controller
            name={`scenarioLikelihood${index}` as any}
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id={`scenarioLikelihood${index}`}><SelectValue placeholder="Select likelihood" /></SelectTrigger>
                <SelectContent>
                  {likelihoodOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div>
          <Label htmlFor={`scenarioImpact${index}`} className="block text-sm font-medium text-gray-700 mb-1">Impact</Label>
          <Controller
            name={`scenarioImpact${index}` as any}
            control={form.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id={`scenarioImpact${index}`}><SelectValue placeholder="Select impact" /></SelectTrigger>
                <SelectContent>
                  {impactOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <div>
        <Label htmlFor={`scenarioMitigation${index}`} className="block text-sm font-medium text-gray-700 mb-1">Mitigation Plan / Response</Label>
        <Controller name={`scenarioMitigation${index}` as any} control={form.control} render={({ field }) => <Textarea id={`scenarioMitigation${index}`} {...field} placeholder={`Mitigation plan for scenario ${index}...`} rows={3} />} />
      </div>
    </div>
  );

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="max-w-5xl mx-auto bg-white rounded-xl print-friendly-form">

        {/* GPT Data Autofill Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">GPT Data Autofill <Wand2Icon className="w-5 h-5 ml-2 text-purple-500" /></CardTitle>
            <CardDescription>Paste structured data (e.g., from GPT) below to autofill relevant fields. Fields with "N/A", "Unknown", etc., will be skipped.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Paste your GPT output here. Example:\nCompany Name: Example Corp\nWebsite: https://example.com\nYears in Business: 5\nOwner: Jane Doe\nIndustry: Technology\nAudience Size: 100K or 1.2M\nBuyer Rate: 5%\nAnnual Customer Value: $1.2K or $2M"
              value={gptPasteInput}
              onChange={(e) => setGptPasteInput(e.target.value)}
              rows={10}
              className="text-sm"
            />
            <Button type="button" onClick={handleGptAutofill} disabled={!gptPasteInput.trim()}>
              <SparklesIcon className="w-4 h-4 mr-2" /> Autofill From Pasted Data
            </Button>
          </CardContent>
        </Card>
        
        {/* Client Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Building2Icon className="w-5 h-5 mr-2 text-blue-600" />Client Information</CardTitle>
            <CardDescription>Basic details about the client, their business, and the project.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <Label htmlFor="clientName" className="font-medium">Company Name *</Label>
              <Controller
                name="clientName"
                control={form.control}
                render={({ field }) => <Input id="clientName" {...field} placeholder="e.g., Suncoast Cooling" className="mt-1" />}
              />
              {form.formState.errors.clientName && <p className="text-xs text-red-600 mt-1">{form.formState.errors.clientName.message}</p>}
            </div>
            <div>
              <Label htmlFor="website" className="font-medium">Website</Label>
              <Controller
                name="website"
                control={form.control}
                render={({ field }) => <Input id="website" {...field} placeholder="https://example.com" className="mt-1" />}
              />
              {form.formState.errors.website && <p className="text-xs text-red-600 mt-1">{form.formState.errors.website.message}</p>}
            </div>
            <div>
              <Label htmlFor="ownerNamePrimary" className="font-medium">Owner Name (Primary Contact)</Label>
              <Controller
                name="ownerNamePrimary"
                control={form.control}
                render={({ field }) => <Input id="ownerNamePrimary" {...field} placeholder="e.g., Jane Doe" className="mt-1" />}
              />
            </div>
            <div>
              <Label htmlFor="coOwnerNameOptional" className="font-medium">Co-Owner Name (Optional)</Label>
              <Controller
                name="coOwnerNameOptional"
                control={form.control}
                render={({ field }) => <Input id="coOwnerNameOptional" {...field} placeholder="e.g., John Smith" className="mt-1" />}
              />
            </div>
            <div>
              <Label htmlFor="yearsInBusiness" className="font-medium">Years in Business</Label>
              <Controller
                name="yearsInBusiness"
                control={form.control}
                render={({ field }) => <Input id="yearsInBusiness" type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value,10))} placeholder="e.g., 12" className="mt-1" min="0" />}
              />
              {form.formState.errors.yearsInBusiness && <p className="text-xs text-red-600 mt-1">{form.formState.errors.yearsInBusiness.message}</p>}
            </div>
            <div>
              <Label htmlFor="industry" className="font-medium">Industry</Label>
              <Controller
                name="industry"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <SelectTrigger id="industry" className="mt-1"><SelectValue placeholder="Select industry" /></SelectTrigger>
                    <SelectContent>
                      {industryOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {watchedIndustry === 'other' && (
              <div className="md:col-span-2">
                <Label htmlFor="industryOther" className="font-medium">Other Industry (Please specify)</Label>
                <Controller
                  name="industryOther"
                  control={form.control}
                  render={({ field }) => <Input id="industryOther" {...field} placeholder="Specify other industry" className="mt-1" />}
                />
              </div>
            )}
            {/* New Looker Studio Link Field */}
            <div className="md:col-span-2 pt-4 mt-4 border-t">
                <Label htmlFor="lookerStudioLink" className="font-medium">Market Research Dashboard Link (Looker Studio)</Label>
                <Controller
                    name="lookerStudioLink"
                    control={form.control}
                    render={({ field }) => <Input id="lookerStudioLink" {...field} placeholder="Paste Looker Studio URL here" className="mt-1" />}
                />
                {form.formState.errors.lookerStudioLink && <p className="text-xs text-red-600 mt-1">{form.formState.errors.lookerStudioLink.message}</p>}
                {watchedLookerStudioLink && form.formState.errors.lookerStudioLink === undefined && (
                    <Button 
                        type="button" 
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => window.open(watchedLookerStudioLink, '_blank')}
                    >
                        <ExternalLinkIcon className="w-4 h-4 mr-2" /> Open Market Research Dashboard
                    </Button>
                )}
            </div>

            <div className="md:col-span-2 pt-4 mt-4 border-t">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Project Details (Optional)</h4>
            </div>
            <div>
              <Label htmlFor="projectName" className="font-medium">Project Name</Label>
              <Controller
                name="projectName"
                control={form.control}
                render={({ field }) => <Input id="projectName" {...field} placeholder="e.g., Q3 Growth Strategy" className="mt-1" />}
              />
               {form.formState.errors.projectName && <p className="text-xs text-red-600 mt-1">{form.formState.errors.projectName.message}</p>}
            </div>
            <div>
              <Label htmlFor="projectDate" className="font-medium">Project Date</Label>
              <Controller
                name="projectDate"
                control={form.control}
                render={({ field }) => <Input id="projectDate" type="date" {...field} className="mt-1" />}
              />
              {form.formState.errors.projectDate && <p className="text-xs text-red-600 mt-1">{form.formState.errors.projectDate.message}</p>}
            </div>
             <div>
              <Label htmlFor="preparedFor" className="font-medium">Prepared For (Client Contact)</Label>
              <Controller
                name="preparedFor"
                control={form.control}
                render={({ field }) => <Input id="preparedFor" {...field} placeholder="e.g., John Doe, CEO" className="mt-1" />}
              />
            </div>
            <div>
              <Label htmlFor="preparedBy" className="font-medium">Prepared By (Your Name/Company)</Label>
              <Controller
                name="preparedBy"
                control={form.control}
                render={({ field }) => <Input id="preparedBy" {...field} placeholder="e.g., Your Name, Your Agency" className="mt-1" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Market Overview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><LineChartIcon className="w-5 h-5 mr-2 text-green-600" />Market Overview</CardTitle>
            <CardDescription>Define the market size, buyer behavior, and potential value.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                    <Label htmlFor="audienceSize" className="font-medium">Audience Size</Label>
                    <Controller
                        name="audienceSize"
                        control={form.control}
                        render={({ field }) => <Input id="audienceSize" type="text" {...field} onChange={e => field.onChange(parseNumberWithSuffixes(e.target.value))} placeholder="e.g., 185K or 2.1M" className="mt-1" />}
                    />
                    {form.formState.errors.audienceSize && <p className="text-xs text-red-600 mt-1">{form.formState.errors.audienceSize.message}</p>}
                </div>
                <div>
                    <Label htmlFor="buyerRate" className="font-medium">Buyer Rate (%)</Label>
                    <Controller
                        name="buyerRate"
                        control={form.control}
                        render={({ field }) => <Input id="buyerRate" type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value.replace(/%/g, '')))} placeholder="e.g., 6.2" className="mt-1" min="0" max="100" step="0.1" />}
                    />
                    {form.formState.errors.buyerRate && <p className="text-xs text-red-600 mt-1">{form.formState.errors.buyerRate.message}</p>}
                </div>
                <div>
                    <Label htmlFor="annualCustomerValue" className="font-medium">Annual Customer Value ($)</Label>
                    <Controller
                        name="annualCustomerValue"
                        control={form.control}
                        render={({ field }) => <Input id="annualCustomerValue" type="text" {...field} onChange={e => field.onChange(parseNumberWithSuffixes(e.target.value))} placeholder="e.g., 1.9K or 2M" className="mt-1" />}
                    />
                    {form.formState.errors.annualCustomerValue && <p className="text-xs text-red-600 mt-1">{form.formState.errors.annualCustomerValue.message}</p>}
                </div>
            </div>

            {showCalculatedMarketFields && (
                <div className="pt-4 mt-4 border-t border-gray-200 bg-slate-50 p-4 rounded-md space-y-3">
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Calculated Market Metrics:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        <div>
                            <Label className="text-sm text-gray-600">Calculated Buyers:</Label>
                            <p className="text-lg font-semibold text-blue-700 mt-0.5">{formatNumberWithCommas(calculatedBuyers)}</p>
                        </div>
                        <div>
                            <Label className="text-sm text-gray-600">Calculated Market Cap:</Label>
                            <p className="text-lg font-semibold text-green-700 mt-0.5">{formatCurrency(calculatedMarketCap)}</p>
                        </div>
                    </div>
                </div>
            )}

            <div>
              <Label htmlFor="marketOverviewNotes" className="font-medium">Market Overview Notes/Summary</Label>
              <Controller
                name="marketOverviewNotes"
                control={form.control}
                render={({ field }) => <Textarea {...field} placeholder="Provide a summary of the market, trends, competitive landscape, etc." rows={6} className="mt-1" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Overview Section - Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><BriefcaseIcon className="w-5 h-5 mr-2 text-indigo-600"/>Company Overview</CardTitle>
            <CardDescription>Details about the company's mission, vision, values, products/services, and competitive advantages.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-sm text-gray-500">Detailed fields for Company Overview will be added here based on user specifications.</p>
          </CardContent>
        </Card>

        {/* Gaps & Opportunity / Funnel Section - Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><TargetIcon className="w-5 h-5 mr-2 text-orange-600" />Gaps & Opportunity / Funnel</CardTitle>
            <CardDescription>Analysis of current vs. desired states, identified gaps, opportunities, and marketing/sales funnel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-gray-500">Detailed fields for Gaps & Opportunity / Funnel will be added here based on user specifications.</p>
          </CardContent>
        </Card>

        {/* Scenario Planning Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">Scenario Planning ("What If?")</CardTitle>
            <CardDescription>Outline potential future scenarios, their likelihood, impact, and mitigation strategies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderScenarioFields(1)}
            {renderScenarioFields(2)}
            {renderScenarioFields(3)}
          </CardContent>
        </Card>

        {/* Current Marketing Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">Current Marketing Activities</CardTitle>
            <CardDescription>Detail current marketing channels, spend, and notes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {marketingChannelFields.map((item, index) => (
              <div key={item.id} className="p-4 border rounded-md space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="text-md font-semibold text-gray-700">Marketing Channel {index + 1}</h5>
                  {marketingChannelFields.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeMarketingChannel(index)} className="text-red-500 hover:text-red-700">
                      <Trash2Icon className="w-4 h-4 mr-1" /> Remove Channel
                    </Button>
                  )}
                </div>
                <div>
                  <Label htmlFor={`marketingChannels.${index}.channelName`} className="font-medium">Channel Name *</Label>
                  <Controller
                    name={`marketingChannels.${index}.channelName`}
                    control={form.control}
                    render={({ field }) => <Input {...field} placeholder="e.g., Google Ads, Facebook Ads, SEO" className="mt-1" />}
                  />
                  {form.formState.errors.marketingChannels?.[index]?.channelName && 
                    <p className="text-xs text-red-600 mt-1">{form.formState.errors.marketingChannels?.[index]?.channelName?.message}</p>}
                </div>
                <div>
                  <Label htmlFor={`marketingChannels.${index}.monthlySpend`} className="font-medium">Monthly Spend ($)</Label>
                  <Controller
                    name={`marketingChannels.${index}.monthlySpend`}
                    control={form.control}
                    render={({ field }) => <Input type="text" {...field} onChange={e => field.onChange(parseNumberWithSuffixes(e.target.value))} placeholder="e.g., 1.5K or 2000" className="mt-1" />}
                  />
                   {form.formState.errors.marketingChannels?.[index]?.monthlySpend && 
                    <p className="text-xs text-red-600 mt-1">{form.formState.errors.marketingChannels?.[index]?.monthlySpend?.message}</p>}
                </div>
                <div>
                  <Label htmlFor={`marketingChannels.${index}.notes`} className="font-medium">Notes/Details</Label>
                  <Controller
                    name={`marketingChannels.${index}.notes`}
                    control={form.control}
                    render={({ field }) => <Textarea {...field} placeholder="e.g., Target audience, campaign goals, performance notes" rows={3} className="mt-1" />}
                  />
                </div>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline"
              onClick={() => appendMarketingChannel({ channelName: '', monthlySpend: undefined, notes: '' })}
              className="mt-2 text-sm"
            >
              <PlusCircleIcon className="w-4 h-4 mr-2" /> Add Marketing Channel
            </Button>
          </CardContent>
        </Card>

        {/* 5-Year SBA Marketing Budget Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">5-Year SBA Marketing Budget</CardTitle>
            <CardDescription>Projected marketing budget allocation over the next 5 years.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(year => (
                <div key={year}>
                  <Label htmlFor={`sbaBudgetYear${year}`} className="font-medium">Year {year} Budget ($)</Label>
                  <Controller
                    name={`sbaBudgetYear${year}` as any}
                    control={form.control}
                    render={({ field }) => <Input type="text" {...field} onChange={e => field.onChange(parseNumberWithSuffixes(e.target.value))} placeholder={`Year ${year} total`} className="mt-1" />}
                  />
                  {form.formState.errors[`sbaBudgetYear${year}` as any] && <p className="text-xs text-red-600 mt-1">{form.formState.errors[`sbaBudgetYear${year}` as any]?.message}</p>}
                </div>
              ))}
            </div>
            <div>
              <Label htmlFor="sbaBudgetNotes" className="font-medium">Budget Notes/Assumptions</Label>
              <Controller
                name="sbaBudgetNotes"
                control={form.control}
                render={({ field }) => <Textarea {...field} placeholder="Explain any assumptions or details about the budget allocation..." rows={4} className="mt-1" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Demographics & Target Audience Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">Demographics & Target Audience</CardTitle>
            <CardDescription>Define the target audience type and provide detailed demographic information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="font-medium mb-2 block">Target Audience Type</Label>
              <Controller
                name="targetAudienceType"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || ''} 
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B2C" id="r1" />
                      <Label htmlFor="r1">B2C (Business-to-Consumer)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="B2B" id="r2" />
                      <Label htmlFor="r2">B2B (Business-to-Business)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Both" id="r3" />
                      <Label htmlFor="r3">Both</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {(targetAudienceTypeValue === "B2C" || targetAudienceTypeValue === "Both") && (
              <div>
                <Label htmlFor="demographicsB2C" className="font-medium">B2C Demographics</Label>
                <Controller
                  name="demographicsB2C"
                  control={form.control}
                  render={({ field }) => <Textarea {...field} placeholder="Describe B2C target audience: age, gender, location, income, interests, pain points, etc." rows={5} className="mt-1" />}
                />
              </div>
            )}

            {(targetAudienceTypeValue === "B2B" || targetAudienceTypeValue === "Both") && (
              <div>
                <Label htmlFor="demographicsB2B" className="font-medium">B2B Demographics</Label>
                <Controller
                  name="demographicsB2B"
                  control={form.control}
                  render={({ field }) => <Textarea {...field} placeholder="Describe B2B target audience: industry, company size, job titles, decision-makers, pain points, etc." rows={5} className="mt-1" />}
                />
              </div>
            )}
            <div>
              <Label htmlFor="targetAudienceNotes" className="font-medium">General Target Audience Notes</Label>
              <Controller
                name="targetAudienceNotes"
                control={form.control}
                render={({ field }) => <Textarea {...field} placeholder="Any additional notes or context about the target audience..." rows={3} className="mt-1" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* GPT Data Block Section (for storing raw data) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">GPT Raw Data Block</CardTitle>
            <CardDescription>Optional: Paste the raw, original GPT output here for reference or later use. This data is saved with the report.</CardDescription>
          </CardHeader>
          <CardContent>
            <Controller
              name="gptDataBlock"
              control={form.control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Paste raw GPT output here if you want to save it with the report..."
                  rows={10}
                  className="text-sm mt-1"
                />
              )}
            />
          </CardContent>
        </Card>

        <CardFooter className="flex justify-end pt-6 mt-8 border-t">
          <Button type="submit" disabled={isLoading || isGenerating} size="lg">
            <SaveIcon className="w-4 h-4 mr-2" />
            {isNewAnalysisMode ? 'Save New Report & Create Link' : (isLoading ? 'Saving...' : 'Save Report Updates')}
          </Button>
        </CardFooter>
      </div>
    </form>
  );
};

export default CompanyGapAnalysisForm;

