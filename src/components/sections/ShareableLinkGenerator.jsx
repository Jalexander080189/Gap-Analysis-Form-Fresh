import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { Share2Icon, ClipboardIcon, SaveIcon, LinkIcon } from 'lucide-react';

const ShareableLinkGenerator = () => {
  const form = useFormContext();
  const watchedShareableLink = form.watch("shareableLink");
  const watchedClientName = form.watch("clientName");
  
  const generateShareableLink = () => {
    // Generate a slug from the company name or use a random ID if no name
    const slug = watchedClientName 
      ? watchedClientName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : `company-${Math.random().toString(36).substring(2, 10)}`;
    
    // Generate the shareable URL
    const shareableUrl = `${window.location.origin}/reports/${slug}`;
    
    // Update the form with the shareable link
    form.setValue('shareableLink', shareableUrl);
    
    // Save data to localStorage
    const formData = form.getValues();
    localStorage.setItem(`report-${slug}`, JSON.stringify(formData));
    
    // Show success message
    alert(`Report saved! Shareable link generated.`);
  };
  
  const copyToClipboard = () => {
    if (watchedShareableLink) {
      navigator.clipboard.writeText(watchedShareableLink);
      alert('Link copied to clipboard!');
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2Icon className="h-5 w-5 text-primary" />
          Save & Share Analysis
        </CardTitle>
        <CardDescription>
          Generate a unique URL to save this analysis and share with others
        </CardDescription>
      </CardHeader>
      <CardContent>
        {watchedShareableLink ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your shareable link:</p>
              <div className="flex items-center gap-2">
                <Input 
                  value={watchedShareableLink} 
                  readOnly 
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex-shrink-0"
                >
                  <ClipboardIcon className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
            <div className="bg-secondary/30 p-3 rounded-md">
              <h4 className="font-medium flex items-center gap-1 mb-1">
                <LinkIcon className="h-4 w-4" /> Link Features
              </h4>
              <ul className="text-sm space-y-1">
                <li>• Share this link to allow others to view this report</li>
                <li>• Return to this link anytime to continue editing</li>
                <li>• All changes are automatically saved to this URL</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              No shareable link has been generated yet. Click the button below to create one.
            </p>
            <Button
              type="button"
              onClick={generateShareableLink}
              className="flex items-center gap-2"
              disabled={!watchedClientName}
            >
              <SaveIcon className="h-4 w-4" />
              Generate Shareable Link
            </Button>
            {!watchedClientName && (
              <p className="text-sm text-destructive mt-2">
                Please enter a company name first to generate a link.
              </p>
            )}
          </div>
        )}
      </CardContent>
      {watchedShareableLink && (
        <CardFooter className="flex justify-between border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={generateShareableLink}
            className="flex items-center gap-2"
          >
            <SaveIcon className="h-4 w-4" />
            Update Saved Report
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={() => window.open(watchedShareableLink, '_blank')}
            className="flex items-center gap-2"
          >
            <Share2Icon className="h-4 w-4" />
            View Report
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ShareableLinkGenerator;
