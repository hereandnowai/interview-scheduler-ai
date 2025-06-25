import React from 'react';
import { InterviewStatus } from '../../types';

interface FilterTabsProps {
  currentFilter: InterviewStatus | 'ALL';
  onFilterChange: (filter: InterviewStatus | 'ALL') => void;
  counts: Record<InterviewStatus | 'ALL', number>;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ currentFilter, onFilterChange, counts }) => {
  const tabs: (InterviewStatus | 'ALL')[] = [
    'ALL',
    InterviewStatus.PENDING_CONFIRMATION,
    InterviewStatus.CONFIRMED,
    InterviewStatus.SCHEDULED, // Includes confirmed & pending
    InterviewStatus.RESCHEDULE_REQUESTED,
    InterviewStatus.COMPLETED,
    InterviewStatus.CANCELLED,
  ];

  const getDisplayName = (status: InterviewStatus | 'ALL') => {
    if (status === 'ALL') return 'All Interviews';
    if (status === InterviewStatus.SCHEDULED) return 'Upcoming'; 
    return status;
  }

  return (
    <div className="mb-6">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">Select a tab</label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-secondary-lighter bg-secondary-light py-2 pl-3 pr-10 text-base text-gray-100 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value as InterviewStatus | 'ALL')}
        >
          {tabs.map((tab) => (
            <option key={tab} value={tab}>{`${getDisplayName(tab)} (${counts[tab] || 0})`}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-secondary-lighter">
          <nav className="-mb-px flex space-x-5 overflow-x-auto pb-px" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onFilterChange(tab)}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150
                  ${tab === currentFilter
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  }`}
              >
                {`${getDisplayName(tab)} `} 
                <span className={`ml-1 inline-block py-0.5 px-2 rounded-full text-xs font-semibold 
                  ${tab === currentFilter ? 'bg-primary text-secondary-dark' : 'bg-secondary-light text-gray-300'}`}>
                   {counts[tab] || 0}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;