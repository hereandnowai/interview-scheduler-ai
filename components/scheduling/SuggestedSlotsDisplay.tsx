import React from 'react';
import { SuggestedSlot } from '../../types';
import Button from '../shared/Button';
import { CalendarIcon, CheckCircleIcon } from '../shared/Icons';

interface SuggestedSlotsDisplayProps {
  slots: SuggestedSlot[];
  onSelectSlot: (slot: SuggestedSlot) => void;
  timezoneInfo: { candidate: string; manager: string };
}

const SuggestedSlotsDisplay: React.FC<SuggestedSlotsDisplayProps> = ({ slots, onSelectSlot, timezoneInfo }) => {
  if (slots.length === 0) {
    return (
      <div className="text-center py-6">
        <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p className="mt-2 text-lg font-medium text-gray-300">No suitable slots found.</p>
        <p className="text-sm text-gray-400">Please adjust availabilities or preferences and try again.</p>
      </div>
    );
  }

  const formatUtcDateTime = (utcDate: string) => {
    try {
        return new Date(utcDate).toLocaleString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit', timeZone: 'UTC', hour12: true
        }) + " UTC";
    } catch {
        return "Invalid Date";
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-400">
        AI has found the following potential slots. Times are shown in UTC, and also converted to local times for the candidate ({timezoneInfo.candidate}) and hiring manager ({timezoneInfo.manager}).
      </p>
      <ul className="space-y-4">
        {slots.map((slot, index) => (
          <li key={index} className="p-4 bg-secondary-lighter rounded-lg shadow-md border border-secondary hover:border-primary/50 transition-colors">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex-grow mb-3 sm:mb-0">
                <div className="flex items-center text-primary font-semibold mb-2">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    Option {index + 1}: {formatUtcDateTime(slot.utcStart)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <div>
                        <span className="text-gray-400">Candidate: </span>
                        <span className="text-gray-200">{slot.candidateReadable}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Manager: </span>
                        <span className="text-gray-200">{slot.managerReadable}</span>
                    </div>
                </div>
              </div>
              <Button onClick={() => onSelectSlot(slot)} variant="primary" size="sm" leftIcon={<CheckCircleIcon className="text-secondary-dark" />}>
                Select & Schedule
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestedSlotsDisplay;