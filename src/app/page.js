"use client";

import { useState } from 'react';
import useGapAnalysisForm from '../hooks/useGapAnalysisForm';

export default function Home() {
  const { formData, setFormData, handleSubmit } = useGapAnalysisForm();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 bg-white text-black">
      <h1 className="text-3xl font-bold text-center mb-8 text-black">Business Gap Analysis</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Test Form</h2>
          
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={formData.clientInfo?.companyName || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                clientInfo: {
                  ...prev.clientInfo,
                  companyName: e.target.value
                }
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}