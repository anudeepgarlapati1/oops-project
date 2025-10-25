
import React, { useState, useEffect, useCallback } from 'react';
import { Complaint, ComplaintCategory } from '../types';
import Button from './common/Button';
import Icon from './common/Icon';
import Spinner from './common/Spinner';
import { suggestCategory } from '../services/geminiService';

interface ComplaintFormModalProps {
  onClose: () => void;
  onAddComplaint: (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => void;
}

const ComplaintFormModal: React.FC<ComplaintFormModalProps> = ({ onClose, onAddComplaint }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>(ComplaintCategory.Other);
  const [isSuggestingCategory, setIsSuggestingCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddComplaint({ name, email, subject, details, category });
  };
  
  const handleSuggestCategory = useCallback(async (text: string) => {
    if (text.length > 50) { // Only trigger after a reasonable amount of text
      setIsSuggestingCategory(true);
      const suggested = await suggestCategory(text);
      setCategory(suggested);
      setIsSuggestingCategory(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
        handleSuggestCategory(details);
    }, 1000); // Debounce time

    return () => {
        clearTimeout(handler);
    };
  }, [details, handleSuggestCategory]);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-modal="true" role="dialog">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl m-4">
        <div className="flex items-start justify-between p-4 border-b rounded-t">
          <h3 className="text-xl font-semibold text-slate-900">
            Submit New Complaint
          </h3>
          <Button variant="ghost" onClick={onClose} className="p-1.5">
            <Icon name="close" className="w-5 h-5"/>
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-700">Full Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-700">Email Address</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium text-slate-700">Subject</label>
              <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="form-input" required />
            </div>
            <div>
              <label htmlFor="category" className="block mb-2 text-sm font-medium text-slate-700">Category</label>
              <div className="flex items-center gap-2">
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ComplaintCategory)} className="form-input flex-grow">
                  {Object.values(ComplaintCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {isSuggestingCategory && <Spinner size="sm" />}
              </div>
              <p className="text-xs text-slate-500 mt-1">AI will suggest a category as you type the details.</p>
            </div>
            <div>
              <label htmlFor="details" className="block mb-2 text-sm font-medium text-slate-700">Complaint Details</label>
              <textarea id="details" rows={6} value={details} onChange={(e) => setDetails(e.target.value)} className="form-input" required />
            </div>
          </div>

          <div className="flex items-center p-6 space-x-2 border-t border-slate-200 rounded-b">
            <Button type="submit">Submit Complaint</Button>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
      <style>{`
        .form-input {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid #cbd5e1;
          background-color: #f8fafc;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: #1e293b;
        }
        .form-input:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          --tw-ring-color: #0284c7;
          border-color: #0284c7;
        }
      `}</style>
    </div>
  );
};

export default ComplaintFormModal;
