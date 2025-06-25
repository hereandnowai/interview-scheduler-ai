import React, { useState } from 'react';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';
import Select from '../shared/Select';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import Card from '../shared/Card';
import { TIMEZONES, SuggestedSlot, UserRole } from '../../types';
import { getSuggestedInterviewSlots } from '../../services/geminiService';
import { useInterviews } from '../../hooks/useInterviews';
import { useAuth } from '../../hooks/useAuth';
import SuggestedSlotsDisplay from './SuggestedSlotsDisplay';
import { SparklesIcon, UsersIcon } from '../shared/Icons';

interface SchedulingFormData {
  candidateName: string;
  candidateAvailability: string;
  candidateTimezone: string;
  managerName: string;
  managerAvailability: string;
  managerTimezone: string;
  interviewDurationMinutes: number;
  bufferMinutes: number;
  preferredBusinessHours: string;
  jobTitle: string;
}

const initialFormData: SchedulingFormData = {
  candidateName: 'Alex Candidate',
  candidateAvailability: 'Mondays 9 AM - 12 PM, Wednesdays 2 PM - 5 PM',
  candidateTimezone: 'EST',
  managerName: 'Casey Manager',
  managerAvailability: 'Mondays 10 AM - 1 PM, Wednesdays 9 AM - 11 AM',
  managerTimezone: 'PST',
  interviewDurationMinutes: 60,
  bufferMinutes: 15,
  preferredBusinessHours: '9 AM - 5 PM EST',
  jobTitle: 'Senior Frontend Engineer',
};

const SchedulingWizard: React.FC = () => {
  const [formData, setFormData] = useState<SchedulingFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [suggestedSlots, setSuggestedSlots] = useState<SuggestedSlot[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addInterview } = useInterviews();
  const { currentUser } = useAuth(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'interviewDurationMinutes' || name === 'bufferMinutes' ? parseInt(value) : value }));
  };

  const handleGetSuggestions = async () => {
    setIsLoadingSuggestions(true);
    setError(null);
    setSuggestedSlots([]);
    try {
      if (!process.env.API_KEY) {
        setError("Gemini API Key is not configured. Cannot fetch suggestions.");
        setIsLoadingSuggestions(false);
        return;
      }
      const slots = await getSuggestedInterviewSlots({
        ...formData,
        currentDate: new Date().toISOString().split('T')[0],
      });
      setSuggestedSlots(slots);
      if (slots.length === 0) {
        setError('No suitable interview slots found with the given availabilities. Please adjust the criteria.');
      } else {
        setCurrentStep(2); 
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching suggestions. Please try again.');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleScheduleInterview = (slot: SuggestedSlot) => {
    if (!currentUser || currentUser.role !== UserRole.RECRUITER) {
      alert("Only recruiters can schedule interviews.");
      return;
    }
    const mockCandidateId = formData.candidateName === 'Alex Candidate' ? 'cand1' : `cand_${Date.now()}`;
    const mockManagerId = formData.managerName === 'Casey Manager' ? 'hm1' : `hm_${Date.now()}`;

    addInterview({
      jobTitle: formData.jobTitle,
      candidateName: formData.candidateName,
      candidateId: mockCandidateId, 
      hiringManagerName: formData.managerName,
      hiringManagerId: mockManagerId,
      recruiterId: currentUser.id,
      startTime: slot.utcStart,
      endTime: slot.utcEnd,
      candidateReadableTime: slot.candidateReadable,
      managerReadableTime: slot.managerReadable,
    });
    alert(`Interview scheduled for ${formData.jobTitle} with ${formData.candidateName}!`);
    setSuggestedSlots([]);
    setCurrentStep(1); 
  };

  const timezoneOptions = TIMEZONES.map(tz => ({ value: tz.value, label: tz.label }));

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-8 flex items-center">
        <UsersIcon className="w-8 h-8 mr-3 text-primary" />
        Schedule New Interview
      </h1>

      {currentStep === 1 && (
        <Card title="Step 1: Provide Details & Preferences" className="animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <Input label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
          </div>
          <hr className="my-6 border-secondary-lighter" />
          
          <h3 className="text-lg font-semibold text-primary mb-3">Candidate Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <Input label="Candidate Name" name="candidateName" value={formData.candidateName} onChange={handleChange} required />
            <Select label="Candidate Timezone" name="candidateTimezone" options={timezoneOptions} value={formData.candidateTimezone} onChange={handleChange} required />
            <Textarea label="Candidate Availability" name="candidateAvailability" value={formData.candidateAvailability} onChange={handleChange} placeholder="e.g., Mondays 9 AM - 12 PM, Wednesdays 2 PM - 5 PM" required className="md:col-span-2" />
          </div>

          <hr className="my-6 border-secondary-lighter" />
          <h3 className="text-lg font-semibold text-primary mb-3">Hiring Manager Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <Input label="Hiring Manager Name" name="managerName" value={formData.managerName} onChange={handleChange} required />
            <Select label="Hiring Manager Timezone" name="managerTimezone" options={timezoneOptions} value={formData.managerTimezone} onChange={handleChange} required />
            <Textarea label="Hiring Manager Availability" name="managerAvailability" value={formData.managerAvailability} onChange={handleChange} placeholder="e.g., Tuesdays 10 AM - 1 PM, Fridays 9 AM - 11 AM" required className="md:col-span-2"/>
          </div>

          <hr className="my-6 border-secondary-lighter" />
          <h3 className="text-lg font-semibold text-primary mb-3">Interview Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <Input type="number" label="Interview Duration (minutes)" name="interviewDurationMinutes" value={formData.interviewDurationMinutes.toString()} onChange={handleChange} required min="15" />
            <Input type="number" label="Buffer Time (minutes)" name="bufferMinutes" value={formData.bufferMinutes.toString()} onChange={handleChange} required min="0" />
            <Input label="Recruiter Business Hours (for context)" name="preferredBusinessHours" value={formData.preferredBusinessHours} onChange={handleChange} placeholder="e.g., 9 AM - 5 PM EST" required className="md:col-span-2"/>
          </div>
          
          <div className="mt-8 text-right">
            <Button
              onClick={handleGetSuggestions}
              disabled={isLoadingSuggestions}
              variant="primary"
              size="lg"
              leftIcon={<SparklesIcon className="text-secondary-dark" />}
            >
              {isLoadingSuggestions ? 'Finding Slots...' : 'Find Available Slots with AI'}
            </Button>
          </div>
          {isLoadingSuggestions && <Spinner text="AI is thinking..." className="mt-4 mx-auto" />}
          {error && !isLoadingSuggestions && <p className="mt-4 text-center text-red-300 bg-red-700/50 p-3 rounded-md">{error}</p>}
        </Card>
      )}

      {currentStep === 2 && !isLoadingSuggestions && (
        <Card title="Step 2: Select Preferred Slot" className="animate-fadeIn">
            <SuggestedSlotsDisplay
                slots={suggestedSlots}
                onSelectSlot={handleScheduleInterview}
                timezoneInfo={{candidate: formData.candidateTimezone, manager: formData.managerTimezone}}
            />
            {suggestedSlots.length === 0 && !error && (
                 <p className="mt-4 text-center text-yellow-300 bg-yellow-700/40 p-3 rounded-md">
                    No slots were returned by the AI. This might be due to restrictive availabilities or an issue with the AI's response.
                 </p>
            )}
             {error && <p className="mt-4 text-center text-red-300 bg-red-700/50 p-3 rounded-md">{error}</p>}
            <div className="mt-6 text-right">
                <Button onClick={() => { setCurrentStep(1); setError(null); setSuggestedSlots([]); }} variant="secondary">
                    Back to Edit Details
                </Button>
            </div>
        </Card>
      )}
    </div>
  );
};

export default SchedulingWizard;