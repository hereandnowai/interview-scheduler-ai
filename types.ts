
export enum UserRole {
  CANDIDATE = 'Candidate',
  RECRUITER = 'Recruiter',
  HIRING_MANAGER = 'Hiring Manager',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export enum InterviewStatus {
  SCHEDULED = 'Scheduled',
  PENDING_CONFIRMATION = 'Pending Confirmation',
  CONFIRMED = 'Confirmed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  RESCHEDULE_REQUESTED = 'Reschedule Requested',
}

export interface Interview {
  id: string;
  jobTitle: string;
  candidateName: string;
  candidateId: string;
  hiringManagerName: string;
  hiringManagerId: string;
  recruiterId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: InterviewStatus;
  candidateReadableTime?: string;
  managerReadableTime?: string;
  feedbackNotes?: string;
}

export interface SuggestedSlot {
  utcStart: string;
  utcEnd: string;
  candidateReadable: string;
  managerReadable: string;
}

export interface JobRole {
  id: string;
  title: string;
  description: string;
  hiringManagerId?: string;
}

export const TIMEZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'GMT', label: 'GMT (Greenwich Mean Time)' },
  { value: 'EST', label: 'EST (Eastern Standard Time, UTC-5)' },
  { value: 'EDT', label: 'EDT (Eastern Daylight Time, UTC-4)' },
  { value: 'CST', label: 'CST (Central Standard Time, UTC-6)' },
  { value: 'CDT', label: 'CDT (Central Daylight Time, UTC-5)' },
  { value: 'MST', label: 'MST (Mountain Standard Time, UTC-7)' },
  { value: 'MDT', label: 'MDT (Mountain Daylight Time, UTC-6)' },
  { value: 'PST', label: 'PST (Pacific Standard Time, UTC-8)' },
  { value: 'PDT', label: 'PDT (Pacific Daylight Time, UTC-7)' },
  { value: 'AKST', label: 'AKST (Alaska Standard Time, UTC-9)' },
  { value: 'AKDT', label: 'AKDT (Alaska Daylight Time, UTC-8)' },
  { value: 'HST', label: 'HST (Hawaii Standard Time, UTC-10)' },
  { value: 'CET', label: 'CET (Central European Time, UTC+1)' },
  { value: 'CEST', label: 'CEST (Central European Summer Time, UTC+2)' },
  { value: 'EET', label: 'EET (Eastern European Time, UTC+2)' },
  { value: 'EEST', label: 'EEST (Eastern European Summer Time, UTC+3)' },
  { value: 'IST', label: 'IST (India Standard Time, UTC+5:30)' },
  { value: 'JST', label: 'JST (Japan Standard Time, UTC+9)' },
  { value: 'AEST', label: 'AEST (Australian Eastern Standard Time, UTC+10)' },
  { value: 'AEDT', label: 'AEDT (Australian Eastern Daylight Time, UTC+11)' },
];

    