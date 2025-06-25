import React from 'react';
import { Interview, InterviewStatus, UserRole } from '../../types';
import Button from '../shared/Button';
import { useAuth } from '../../hooks/useAuth';
import { useInterviews } from '../../hooks/useInterviews';
import { CalendarIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '../shared/Icons';

interface InterviewCardProps {
  interview: Interview;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ interview }) => {
  const { selectedRole } = useAuth();
  const { updateInterviewStatus } = useInterviews();

  const formatDate = (isoDate: string) => {
    if (!isoDate) return 'N/A';
    try {
        const date = new Date(isoDate);
        return date.toLocaleString(undefined, { 
            weekday: 'short', month: 'short', day: 'numeric', 
            hour: 'numeric', minute: 'numeric', hour12: true 
        });
    } catch (e) {
        return 'Invalid Date';
    }
  };

  // Adjusted status colors for new theme
  const statusColors: Record<InterviewStatus, string> = {
    [InterviewStatus.SCHEDULED]: 'bg-yellow-500/30 text-yellow-200 border-yellow-500/40', // Kept yellow, adjusted opacity
    [InterviewStatus.PENDING_CONFIRMATION]: 'bg-orange-500/30 text-orange-200 border-orange-500/40', // Kept orange
    [InterviewStatus.CONFIRMED]: 'bg-green-500/30 text-green-200 border-green-500/40', // Kept green
    [InterviewStatus.COMPLETED]: 'bg-blue-600/30 text-blue-300 border-blue-600/40', // Kept blue
    [InterviewStatus.CANCELLED]: 'bg-red-600/30 text-red-300 border-red-600/40', // Kept red
    [InterviewStatus.RESCHEDULE_REQUESTED]: 'bg-purple-500/30 text-purple-300 border-purple-500/40', // Kept purple
  };

  const handleConfirm = () => updateInterviewStatus(interview.id, InterviewStatus.CONFIRMED);
  const handleCancel = () => updateInterviewStatus(interview.id, InterviewStatus.CANCELLED);
  const handleRequestReschedule = () => updateInterviewStatus(interview.id, InterviewStatus.RESCHEDULE_REQUESTED);

  const isPast = new Date(interview.endTime) < new Date();


  return (
    <div className={`bg-secondary-light shadow-lg rounded-xl overflow-hidden border border-secondary-lighter hover:shadow-primary/20 transition-shadow duration-300 ${isPast && interview.status !== InterviewStatus.COMPLETED ? 'opacity-70' : ''}`}>
      <div className={`px-5 py-3 border-b border-secondary-lighter flex justify-between items-center ${statusColors[interview.status]}`}>
        <h3 className="text-lg font-semibold text-primary">{interview.jobTitle}</h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[interview.status]}`}>
          {interview.status}
        </span>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-400">Candidate:</p>
          <p className="text-gray-100 font-medium">{interview.candidateName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Hiring Manager:</p>
          <p className="text-gray-100 font-medium">{interview.hiringManagerName}</p>
        </div>
        <div className="md:col-span-2">
            <p className="text-sm text-gray-400">Scheduled Time (UTC):</p>
            <p className="text-gray-100 font-medium flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-primary" /> 
                {formatDate(interview.startTime)} - {formatDate(interview.endTime).split(',').pop()?.trim()}
            </p>
        </div>
        {interview.candidateReadableTime && (
            <div>
                <p className="text-sm text-gray-400">Candidate Local Time:</p>
                <p className="text-gray-200">{interview.candidateReadableTime}</p>
            </div>
        )}
        {interview.managerReadableTime && (
            <div>
                <p className="text-sm text-gray-400">Manager Local Time:</p>
                <p className="text-gray-200">{interview.managerReadableTime}</p>
            </div>
        )}

        {interview.feedbackNotes && (
             <div className="md:col-span-2 mt-2 p-3 bg-secondary/70 rounded-md border border-secondary-lighter">
                <p className="text-sm text-gray-400 font-semibold">Feedback Notes:</p>
                <p className="text-gray-200 text-sm italic">{interview.feedbackNotes}</p>
            </div>
        )}
      </div>

      {!isPast && 
        (interview.status === InterviewStatus.PENDING_CONFIRMATION || 
         interview.status === InterviewStatus.SCHEDULED || 
         interview.status === InterviewStatus.CONFIRMED) && (
        <div className="px-5 py-3 bg-secondary-light/80 border-t border-secondary-lighter flex flex-wrap gap-2 justify-end">
          {selectedRole === UserRole.CANDIDATE && interview.status === InterviewStatus.PENDING_CONFIRMATION && (
            <Button onClick={handleConfirm} variant="primary" size="sm" leftIcon={<CheckCircleIcon />}>Confirm</Button>
          )}
           {(selectedRole === UserRole.CANDIDATE || selectedRole === UserRole.HIRING_MANAGER) && 
             (interview.status === InterviewStatus.SCHEDULED || interview.status === InterviewStatus.CONFIRMED) && (
            <Button onClick={handleRequestReschedule} variant="secondary" size="sm" leftIcon={<InformationCircleIcon />}>Request Reschedule</Button>
          )}
          {(selectedRole === UserRole.RECRUITER || selectedRole === UserRole.CANDIDATE) && (
            <Button onClick={handleCancel} variant="danger" size="sm" leftIcon={<XCircleIcon />}>Cancel Interview</Button>
          )}
        </div>
      )}
       {selectedRole === UserRole.HIRING_MANAGER && interview.status === InterviewStatus.COMPLETED && !interview.feedbackNotes && (
         <div className="px-5 py-3 bg-secondary-light/80 border-t border-secondary-lighter flex justify-end">
            <Button variant="primary" size="sm" onClick={() => alert("Provide feedback form would open here.")}>Provide Feedback</Button>
         </div>
       )}
    </div>
  );
};

export default InterviewCard;