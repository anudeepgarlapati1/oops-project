
import { useState, useCallback } from 'react';
import { Complaint, ComplaintStatus, ComplaintCategory } from '../types';

const initialComplaints: Complaint[] = [
    {
        id: 'CMP-001',
        name: 'Alice Johnson',
        email: 'alice.j@example.com',
        subject: 'Internet connection is very slow',
        details: 'For the past week, my internet speed has been dropping significantly, especially during peak hours. It makes it impossible to stream videos or attend online meetings. I have tried restarting my router multiple times without any luck.',
        category: ComplaintCategory.Technical,
        status: ComplaintStatus.New,
        date: '2024-07-20T10:00:00Z',
    },
    {
        id: 'CMP-002',
        name: 'Bob Williams',
        email: 'bob.w@example.com',
        subject: 'Incorrect billing amount on my last invoice',
        details: 'I was overcharged on my last invoice (INV-12345). My plan is $49.99 per month, but I was billed $79.99. Please correct this and refund the difference.',
        category: ComplaintCategory.Billing,
        status: ComplaintStatus.InProgress,
        date: '2024-07-19T14:30:00Z',
    },
    {
        id: 'CMP-003',
        name: 'Charlie Brown',
        email: 'charlie.b@example.com',
        subject: 'Service outage in my area',
        details: 'There seems to be a complete service outage in my neighborhood (zip code 90210). My modem shows a red light and I cannot connect to the internet at all. Is there an estimated time for restoration?',
        category: ComplaintCategory.Service,
        status: ComplaintStatus.Resolved,
        date: '2024-07-18T09:00:00Z',
        resolution: 'Service was restored after a local fiber cut was repaired. Customer was notified and confirmed connection is back to normal.'
    },
    {
        id: 'CMP-004',
        name: 'Diana Prince',
        email: 'diana.p@example.com',
        subject: 'Request for new feature',
        details: 'I would like to suggest adding a feature to the customer portal that allows us to see historical usage data for the past 12 months. This would be very helpful for budgeting.',
        category: ComplaintCategory.Other,
        status: ComplaintStatus.Closed,
        date: '2024-07-15T11:45:00Z',
        resolution: 'Feature request has been logged and passed to the product development team for consideration in a future update.'
    },
];

export const useComplaints = () => {
    const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);

    const addComplaint = useCallback((newComplaintData: Omit<Complaint, 'id' | 'date' | 'status'>) => {
        const newComplaint: Complaint = {
            ...newComplaintData,
            id: `CMP-${String(complaints.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString(),
            status: ComplaintStatus.New,
        };
        setComplaints(prev => [newComplaint, ...prev]);
    }, [complaints.length]);

    const updateComplaint = useCallback((updatedComplaint: Complaint) => {
        setComplaints(prev => prev.map(c => c.id === updatedComplaint.id ? updatedComplaint : c));
    }, []);

    return { complaints, addComplaint, updateComplaint };
};
