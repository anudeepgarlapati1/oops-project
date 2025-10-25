
import React from 'react';
import { ComplaintStatus } from '../types';
import Icon from './common/Icon';

interface SidebarProps {
  onFilterChange: (status: ComplaintStatus | 'ALL') => void;
  activeFilter: ComplaintStatus | 'ALL';
  statusCounts: Record<ComplaintStatus | 'ALL', number>;
}

const filterOptions: { id: ComplaintStatus | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All Complaints' },
  { id: ComplaintStatus.New, label: 'New' },
  { id: ComplaintStatus.InProgress, label: 'In Progress' },
  { id: ComplaintStatus.Resolved, label: 'Resolved' },
  { id: ComplaintStatus.Closed, label: 'Closed' },
];

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange, activeFilter, statusCounts }) => {
  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="flex h-16 flex-shrink-0 items-center gap-2 px-6">
        <Icon name="dashboard" className="h-7 w-7 text-primary" />
        <span className="text-lg font-bold text-slate-800">ZenDesk</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {filterOptions.map(option => (
          <button
            key={option.id}
            onClick={() => onFilterChange(option.id)}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${
              activeFilter === option.id
                ? 'bg-primary-50 text-primary'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>{option.label}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                activeFilter === option.id
                  ? 'bg-primary text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {statusCounts[option.id] || 0}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
