
export enum ComplaintStatus {
  New = 'New',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export enum ComplaintCategory {
  Technical = 'Technical',
  Billing = 'Billing',
  Service = 'Service',
  Other = 'Other',
}

export interface Complaint {
  id: string;
  name: string;
  email: string;
  subject: string;
  details: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  date: string;
  attachments?: File[];
  resolution?: string;
}
