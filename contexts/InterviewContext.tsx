
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Interview, InterviewStatus, UserRole } from '../types';
import { useAuth } from '../hooks/useAuth'; // To filter interviews based on user role

interface InterviewContextType {
  interviews: Interview[];
  addInterview: (interview: Omit<Interview, 'id' | 'status'>) => void;
  updateInterviewStatus: (interviewId: string, status: InterviewStatus) => void;
  getInterviewsForCurrentUser: () => Interview[];
  loading: boolean;
}

export const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

// Mock initial interviews
const MOCK_INTERVIEWS: Interview[] = [
  {
    id: 'interview1',
    jobTitle: 'Senior Frontend Engineer',
    candidateName: 'Alex Candidate',
    candidateId: 'cand1',
    hiringManagerName: 'Casey Manager',
    hiringManagerId: 'hm1',
    recruiterId: 'rec1',
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    status: InterviewStatus.CONFIRMED,
    candidateReadableTime: 'Upcoming Mon, 10:00 AM EDT',
    managerReadableTime: 'Upcoming Mon, 07:00 AM PDT',
  },
  {
    id: 'interview2',
    jobTitle: 'Product Designer',
    candidateName: 'Jamie Designer',
    candidateId: 'cand2',
    hiringManagerName: 'Casey Manager',
    hiringManagerId: 'hm1',
    recruiterId: 'rec1',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
    status: InterviewStatus.SCHEDULED,
    candidateReadableTime: 'Upcoming Thu, 02:00 PM EST',
    managerReadableTime: 'Upcoming Thu, 11:00 AM PST',
  },
  {
    id: 'interview3',
    jobTitle: 'Data Scientist',
    candidateName: 'Alex Candidate',
    candidateId: 'cand1',
    hiringManagerName: 'Drew DataLead',
    hiringManagerId: 'hm2',
    recruiterId: 'rec1',
    startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
    status: InterviewStatus.COMPLETED,
    feedbackNotes: "Candidate was strong in Python, but lacked experience with large scale deployments."
  },
];


interface InterviewProviderProps {
  children: ReactNode;
}

export const InterviewProvider: React.FC<InterviewProviderProps> = ({ children }) => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser, selectedRole } = useAuth(); // Auth hook might not be ready here if InterviewProvider is higher

  useEffect(() => {
    // Simulate fetching interviews
    const storedInterviews = localStorage.getItem('interviews');
    if (storedInterviews) {
      setInterviews(JSON.parse(storedInterviews));
    } else {
      setInterviews(MOCK_INTERVIEWS);
      localStorage.setItem('interviews', JSON.stringify(MOCK_INTERVIEWS));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if(interviews.length > 0) {
        localStorage.setItem('interviews', JSON.stringify(interviews));
    }
  }, [interviews]);

  const addInterview = (interviewData: Omit<Interview, 'id' | 'status'>) => {
    const newInterview: Interview = {
      ...interviewData,
      id: `interview_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      status: InterviewStatus.PENDING_CONFIRMATION, // Default status for new interviews
    };
    setInterviews((prev) => [...prev, newInterview]);
  };

  const updateInterviewStatus = (interviewId: string, status: InterviewStatus) => {
    setInterviews((prev) =>
      prev.map((iv) => (iv.id === interviewId ? { ...iv, status } : iv))
    );
  };
  
  const getInterviewsForCurrentUser = (): Interview[] => {
    if (!currentUser || !selectedRole) return [];

    switch (selectedRole) {
      case UserRole.CANDIDATE:
        return interviews.filter(iv => iv.candidateId === currentUser.id);
      case UserRole.HIRING_MANAGER:
        return interviews.filter(iv => iv.hiringManagerId === currentUser.id);
      case UserRole.RECRUITER:
        return interviews; // Recruiters see all interviews
      default:
        return [];
    }
  };


  return (
    <InterviewContext.Provider value={{ interviews, addInterview, updateInterviewStatus, getInterviewsForCurrentUser, loading }}>
      {children}
    </InterviewContext.Provider>
  );
};
    