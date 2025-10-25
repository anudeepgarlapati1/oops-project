
import React from 'react';
import { Complaint } from '../types';
import Badge from './common/Badge';

interface ComplaintListProps {
  complaints: Complaint[];
  onSelectComplaint: (id: string) => void;
}

const ComplaintListItem: React.FC<{ complaint: Complaint; onSelect: () => void }> = ({ complaint, onSelect }) => {
  return (
    <li 
      onClick={onSelect}
      className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-primary hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">{complaint.id}</p>
          <h3 className="text-md font-bold text-slate-800">{complaint.subject}</h3>
          <p className="mt-1 text-sm text-slate-500">
            From: {complaint.name} &middot; {new Date(complaint.date).toLocaleDateString()}
          </p>
        </div>
        <Badge status={complaint.status} />
      </div>
      <p className="mt-3 text-sm text-slate-600 line-clamp-2">{complaint.details}</p>
    </li>
  );
};

const ComplaintList: React.FC<ComplaintListProps> = ({ complaints, onSelectComplaint }) => {
    if (complaints.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white p-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-900">No complaints found</h3>
                <p className="mt-1 text-sm text-slate-500">There are no complaints matching your current filters.</p>
            </div>
        )
    }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {complaints.map(complaint => (
        <ComplaintListItem 
          key={complaint.id} 
          complaint={complaint} 
          onSelect={() => onSelectComplaint(complaint.id)}
        />
      ))}
    </ul>
  );
};

export default ComplaintList;
