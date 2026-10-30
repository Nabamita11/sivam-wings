export type JobCategory =
  | 'All'
  | 'IT & Software'
  | 'Manufacturing & Operations'
  | 'Logistics & Supply Chain'
  | 'Healthcare & Hospital'
  | 'Sales & Retail'
  | 'HR & Administration'
  | 'Finance & Accounts';

export interface JobOpening {
  id: string;
  title: string;
  department: JobCategory;
  location: string;
  type: 'Full-time' | 'Contract' | 'Part-time' | 'Urgent Staffing';
  experience: string;
  salaryRange: string;
  openPositions: number;
  featured?: boolean;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedDate: string;
  status: 'Active' | 'Urgent' | 'Filled';
}

export type ApplicationStatus =
  | 'New'
  | 'Under Review'
  | 'Interviewing'
  | 'Hired'
  | 'Rejected'
  | 'On Hold';

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  timestamp: string;
  note?: string;
  updatedBy: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  email: string;
  phone: string;
  currentLocation: string;
  experienceYears: number;
  highestQualification: string;
  currentSalary?: string;
  expectedSalary: string;
  noticePeriod: string;
  resumeFileName: string;
  resumeFileSize?: string;
  resumeStorageName?: string;
  coverNote?: string;
  portfolioUrl?: string;
  appliedDate: string;
  status: ApplicationStatus;
  adminNotes?: string;
  statusHistory?: StatusHistoryEntry[];
}

export interface ClientInquiry {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  serviceRequired: string;
  estimatedHeadcount: string;
  timeline: string;
  message: string;
  date: string;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Converted' | 'Closed';
}

export interface ServiceDetail {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  keyFeatures: string[];
  deliverables: string[];
}
