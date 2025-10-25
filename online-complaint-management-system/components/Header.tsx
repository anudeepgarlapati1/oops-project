
import React, { useState } from 'react';
import Icon from './common/Icon';
import Button from './common/Button';

interface HeaderProps {
  onNewComplaint: () => void;
  onSearch: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNewComplaint, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  }
  
  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-slate-800">Complaints Dashboard</h1>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="relative w-full max-w-xs">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon name="search" className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full rounded-md border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <Button onClick={onNewComplaint} leftIcon={<Icon name="plus" className="h-5 w-5"/>}>
          New Complaint
        </Button>
      </div>
    </header>
  );
};

export default Header;
