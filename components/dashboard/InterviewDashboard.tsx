import React, { useState, useMemo } from 'react';
import { useInterviews } from '../../hooks/useInterviews';
import { Interview, InterviewStatus, UserRole } from '../../types';
import InterviewCard from './InterviewCard';
import FilterTabs from './FilterTabs';
import Spinner from '../shared/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Button from '../shared/Button';
import { PlusCircleIcon, CalendarIcon } from '../shared/Icons';

const InterviewDashboard: React.FC = () => {
  const { getInterviewsForCurrentUser, loading: interviewsLoading } = useInterviews();
  const { selectedRole } = useAuth();
  const [currentFilter, setCurrentFilter] = useState<InterviewStatus | 'ALL'>('ALL');

  const interviews = getInterviewsForCurrentUser();

  const tabsDefinition: {id: InterviewStatus | 'ALL', name: string}[] = [
    { id: 'ALL', name: 'All Interviews' },
    { id: InterviewStatus.PENDING_CONFIRMATION, name: 'Pending' },
    { id: InterviewStatus.CONFIRMED, name: 'Confirmed' },
    { id: InterviewStatus.SCHEDULED, name: 'Upcoming' }, 
    { id: InterviewStatus.RESCHEDULE_REQUESTED, name: 'Reschedule Req.' },
    { id: InterviewStatus.COMPLETED, name: 'Completed' },
    { id: InterviewStatus.CANCELLED, name: 'Cancelled' },
  ];

  const filteredInterviews = useMemo(() => {
    if (currentFilter === 'ALL') return interviews;
    if (currentFilter === InterviewStatus.SCHEDULED) { 
        return interviews.filter(iv => iv.status === InterviewStatus.PENDING_CONFIRMATION || iv.status === InterviewStatus.CONFIRMED);
    }
    return interviews.filter((interview) => interview.status === currentFilter);
  }, [interviews, currentFilter]);

  const interviewCounts = useMemo(() => {
    const counts = {} as Record<InterviewStatus | 'ALL', number>;
    tabsDefinition.forEach(tab => {
        if (tab.id === 'ALL') counts[tab.id] = interviews.length;
        else if (tab.id === InterviewStatus.SCHEDULED) {
            counts[tab.id] = interviews.filter(iv => iv.status === InterviewStatus.PENDING_CONFIRMATION || iv.status === InterviewStatus.CONFIRMED).length;
        }
        else counts[tab.id] = interviews.filter(iv => iv.status === tab.id).length;
    });
    return counts;
  }, [interviews, tabsDefinition]); 


  if (interviewsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner text="Loading interviews..." />
      </div>
    );
  }

  const getDashboardTitle = () => {
    switch(selectedRole) {
      case UserRole.CANDIDATE: return "My Interviews";
      case UserRole.HIRING_MANAGER: return "My Team's Interviews";
      case UserRole.RECRUITER: return "All Company Interviews";
      default: return "Interview Dashboard";
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-primary flex items-center">
            <CalendarIcon className="w-8 h-8 mr-3 text-primary" />
            {getDashboardTitle()}
        </h1>
        {selectedRole === UserRole.RECRUITER && (
          <Link to="/schedule">
            <Button variant="primary" leftIcon={<PlusCircleIcon />}>
              Schedule New Interview
            </Button>
          </Link>
        )}
      </div>

      <FilterTabs currentFilter={currentFilter} onFilterChange={setCurrentFilter} counts={interviewCounts} />

      {filteredInterviews.length === 0 ? (
        <div className="text-center py-10 bg-secondary-light rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-300">No interviews found</h3>
          <p className="mt-1 text-sm text-gray-400">
            {currentFilter === 'ALL' ? "There are no interviews scheduled yet." : `There are no interviews with status "${currentFilter}".`}
          </p>
          {selectedRole === UserRole.RECRUITER && currentFilter === 'ALL' && (
             <div className="mt-6">
                <Link to="/schedule">
                    <Button variant="primary" leftIcon={<PlusCircleIcon />}>Schedule an Interview</Button>
                </Link>
             </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews
            .sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) 
            .map((interview: Interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewDashboard;