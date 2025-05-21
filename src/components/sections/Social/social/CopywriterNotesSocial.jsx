import React, { useState, useEffect } from 'react';
import EnhancedSocialPostCard from './EnhancedSocialPostCard';

// Import icons
const CopywriterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

/**
 * CopywriterNotesSocial - A social media styled wrapper for the Copywriter Notes component
 * 
 * @param {Object} props
 * @param {Object} props.formData - The form data
 * @param {Function} props.updateFormData - Function to update form data
 */
const CopywriterNotesSocial = ({ formData, updateFormData }) => {
  // Notes state
  const [notes, setNotes] = useState(formData?.copywriterNotes || '');
  const [expanded, setExpanded] = useState(false);
  
  // Update form data when notes change
  useEffect(() => {
    updateFormData({
      ...formData,
      copywriterNotes: notes
    });
  }, [notes]);
  
  return (
    <EnhancedSocialPostCard
      title="Copywriter"
      icon={<CopywriterIcon />}
      iconBg="bg-pink-100"
      iconColor="text-pink-800"
      id="copywriter-notes"
      enhancedReactions={true}
    >
      <div className="flex justify-between items-center mb-3">
        <p className="text-gray-700">Notes and ideas for your marketing:</p>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1 text-sm border border-gray-300 rounded"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <div className={expanded ? 'h-auto' : 'h-40'}>
        <div className="border border-gray-200 rounded-lg p-2 mb-3">
          <div className="flex space-x-1 mb-2">
            <button 
              onClick={() => setNotes(notes + '**Bold Text**')}
              className="px-2 py-1 text-sm border border-gray-200 rounded"
            >
              B
            </button>
            <button 
              onClick={() => setNotes(notes + '*Italic Text*')}
              className="px-2 py-1 text-sm border border-gray-200 rounded"
            >
              I
            </button>
            <button 
              onClick={() => setNotes(notes + '__Underlined Text__')}
              className="px-2 py-1 text-sm border border-gray-200 rounded"
            >
              U
            </button>
            <button 
              onClick={() => setNotes(notes + '[Link Text](https://example.com)')}
              className="px-2 py-1 text-sm border border-gray-200 rounded"
            >
              Link
            </button>
            <button 
              onClick={() => setNotes(notes + '\n- List item\n- List item\n- List item')}
              className="px-2 py-1 text-sm border border-gray-200 rounded"
            >
              List
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-full resize-none border-0 focus:ring-0 p-2"
            placeholder="Add your notes, ideas, and recommendations here..."
            style={{ minHeight: expanded ? '300px' : '100px' }}
          ></textarea>
        </div>
      </div>
      
      {notes && (
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <h4 className="text-sm font-medium mb-2">Preview:</h4>
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: notes
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/__(.*?)__/g, '<u>$1</u>')
                .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
                .replace(/\n- (.*)/g, '<li>$1</li>')
                .replace(/<li>/g, '<ul><li>')
                .replace(/<\/li>\n/g, '</li></ul>')
                .replace(/\n/g, '<br />')
            }}
          />
        </div>
      )}
    </EnhancedSocialPostCard>
  );
};

export default CopywriterNotesSocial;
