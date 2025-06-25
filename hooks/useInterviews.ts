
import { useContext } from 'react';
import { InterviewContext } from '../contexts/InterviewContext';

export const useInterviews = () => {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterviews must be used within an InterviewProvider');
  }
  return context;
};
    