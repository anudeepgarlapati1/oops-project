
import React from 'react';
import { ComplaintStatus } from '../../types';

interface BadgeProps {
  status: ComplaintStatus;
}

const statusColors: Record<ComplaintStatus, string> = {
  [ComplaintStatus.New]: 'bg-blue-100 text-blue-800',
  [ComplaintStatus.InProgress]: 'bg-amber-100 text-amber-800',
  [ComplaintStatus.Resolved]: 'bg-green-100 text-green-800',
  [ComplaintStatus.Closed]: 'bg-slate-100 text-slate-800',
};

const Badge: React.FC<BadgeProps> = ({ status }) => {
  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[status]}`}>
      {status}
    </span>
  );
};

export default Badge;
