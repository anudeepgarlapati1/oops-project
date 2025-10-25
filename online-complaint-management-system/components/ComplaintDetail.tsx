
import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../types';
import Button from './common/Button';
import Icon from './common/Icon';
import Badge from './common/Badge';
import Spinner from './common/Spinner';
import { summarizeComplaint, suggestResponse } from '../services/geminiService';

interface ComplaintDetailProps {
  complaint: Complaint;
  onBack: () => void;
  onUpdate: (complaint: Complaint) => void;
}

const ComplaintDetail: React.FC<ComplaintDetailProps> = ({ complaint, onBack, onUpdate }) => {
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [resolution, setResolution] = useState<string>(complaint.resolution || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [suggestedResponse, setSuggestedResponse] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleUpdate = () => {
    setIsUpdating(true);
    const updatedComplaint: Complaint = { ...complaint, status, resolution };
    onUpdate(updatedComplaint);
    setTimeout(() => setIsUpdating(false), 500); // Simulate network delay
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const result = await summarizeComplaint(complaint.details);
    setSummary(result);
    setIsSummarizing(false);
  };
  
  const handleSuggestResponse = async () => {
    setIsSuggesting(true);
    const result = await suggestResponse(complaint);
    setSuggestedResponse(result);
    setIsSuggesting(false);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="p-4 md:p-6 border-b border-slate-200">
        <Button onClick={onBack} variant="ghost" leftIcon={<Icon name="back" className="w-5 h-5"/>}>
          Back to List
        </Button>
      </div>

      <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Complaint Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start justify-between">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">{complaint.subject}</h2>
                <p className="text-sm text-slate-500 mt-1">Complaint ID: {complaint.id}</p>
            </div>
            <Badge status={complaint.status} />
          </div>
          
          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-800 mb-2">Customer Information</h3>
            <p className="text-sm text-slate-600"><strong>Name:</strong> {complaint.name}</p>
            <p className="text-sm text-slate-600"><strong>Email:</strong> {complaint.email}</p>
            <p className="text-sm text-slate-600"><strong>Date Submitted:</strong> {new Date(complaint.date).toLocaleString()}</p>
          </div>
          
          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-800 mb-2">Full Complaint Details</h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{complaint.details}</p>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-4">
            <h3 className="font-semibold text-slate-800">AI Assistance</h3>
            {/* Summary Section */}
            <div>
              <Button onClick={handleSummarize} isLoading={isSummarizing} disabled={isSummarizing} variant="secondary" leftIcon={<Icon name="sparkles" className="w-4 h-4"/>}>
                Generate Summary
              </Button>
              {summary && (
                <div className="mt-2 text-sm p-3 bg-slate-50 border border-slate-200 rounded-md">
                    <p className="font-semibold text-slate-700">Summary:</p>
                    <p className="text-slate-600">{summary}</p>
                </div>
              )}
            </div>

            {/* Suggested Response Section */}
            <div>
              <Button onClick={handleSuggestResponse} isLoading={isSuggesting} disabled={isSuggesting} variant="secondary" leftIcon={<Icon name="sparkles" className="w-4 h-4"/>}>
                Suggest Response
              </Button>
              {suggestedResponse && (
                <div className="mt-2 text-sm p-3 bg-slate-50 border border-slate-200 rounded-md">
                     <p className="font-semibold text-slate-700">Suggested Response:</p>
                     <textarea
                        readOnly
                        value={suggestedResponse}
                        className="w-full h-40 mt-1 text-sm text-slate-600 bg-white border-none focus:ring-0 p-0 resize-none"
                    />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Status */}
        <div className="lg:col-span-1 lg:border-l lg:pl-6 border-slate-200 space-y-6">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700">Update Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            >
              {Object.values(ComplaintStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="resolution" className="block text-sm font-medium text-slate-700">Resolution Notes</label>
            <textarea
              id="resolution"
              rows={8}
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="Add notes about how this complaint was resolved..."
            />
          </div>
          
          <Button onClick={handleUpdate} isLoading={isUpdating} disabled={isUpdating} className="w-full">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
