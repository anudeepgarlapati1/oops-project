
import React, { useState, useMemo } from 'react';
import { Complaint, ComplaintStatus, ComplaintCategory } from './types';
import { useComplaints } from './hooks/useComplaints';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ComplaintList from './components/ComplaintList';
import ComplaintDetail from './components/ComplaintDetail';
import ComplaintFormModal from './components/ComplaintFormModal';

const App: React.FC = () => {
  const { complaints, addComplaint, updateComplaint } = useComplaints();
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<{ status: ComplaintStatus | 'ALL', searchTerm: string }>({ status: 'ALL', searchTerm: '' });

  const handleSelectComplaint = (id: string) => {
    setSelectedComplaintId(id);
  };

  const handleDeselectComplaint = () => {
    setSelectedComplaintId(null);
  };

  const selectedComplaint = useMemo(() => {
    return complaints.find(c => c.id === selectedComplaintId) || null;
  }, [complaints, selectedComplaintId]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter(complaint => {
      const statusMatch = filter.status === 'ALL' || complaint.status === filter.status;
      const searchMatch = filter.searchTerm === '' ||
        complaint.subject.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        complaint.details.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        complaint.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        complaint.id.toLowerCase().includes(filter.searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [complaints, filter]);
  
  const statusCounts = useMemo(() => {
    return complaints.reduce((acc, complaint) => {
        acc[complaint.status] = (acc[complaint.status] || 0) + 1;
        acc.ALL = (acc.ALL || 0) + 1;
        return acc;
    }, {} as Record<ComplaintStatus | 'ALL', number>);
  }, [complaints]);

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      <Sidebar 
        onFilterChange={status => setFilter(prev => ({ ...prev, status }))}
        activeFilter={filter.status}
        statusCounts={statusCounts}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          onNewComplaint={() => setIsModalOpen(true)}
          onSearch={term => setFilter(prev => ({...prev, searchTerm: term}))}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {selectedComplaint ? (
              <ComplaintDetail 
                complaint={selectedComplaint} 
                onBack={handleDeselectComplaint} 
                onUpdate={updateComplaint}
              />
            ) : (
              <ComplaintList 
                complaints={filteredComplaints} 
                onSelectComplaint={handleSelectComplaint} 
              />
            )}
          </div>
        </main>
      </div>
      {isModalOpen && (
        <ComplaintFormModal 
          onClose={() => setIsModalOpen(false)}
          onAddComplaint={(complaint) => {
            addComplaint(complaint);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default App;
