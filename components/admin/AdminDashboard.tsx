import React, { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Textarea from '../shared/Textarea';
import { JobRole } from '../../types';
import { PlusCircleIcon, CogIcon } from '../shared/Icons';

// Mock data store for job roles, in a real app this would be in context or fetched from API
let mockJobRoles: JobRole[] = [
    { id: 'jr1', title: 'Senior Frontend Engineer', description: 'Develops user-facing features.' },
    { id: 'jr2', title: 'Product Designer', description: 'Designs intuitive and engaging user experiences.' },
];


const JobRoleCreator: React.FC<{onAddRole: (role: JobRole) => void}> = ({onAddRole}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!title.trim() || !description.trim()) {
            alert("Title and description are required.");
            return;
        }
        const newRole: JobRole = {
            id: `jr_${Date.now()}`,
            title,
            description
        };
        onAddRole(newRole);
        setTitle('');
        setDescription('');
    }

    return (
        <Card title="Create New Job Role" className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Job Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Backend Developer" required />
                <Textarea label="Job Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Briefly describe the role..." required />
                <Button type="submit" variant="primary" leftIcon={<PlusCircleIcon />}>Add Job Role</Button>
            </form>
        </Card>
    );
}


const AdminDashboard: React.FC = () => {
  const [jobRoles, setJobRoles] = useState<JobRole[]>(mockJobRoles);
  
  const addJobRole = (role: JobRole) => {
    setJobRoles(prev => [...prev, role]);
    mockJobRoles.push(role); // Update mock store
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary flex items-center">
        <CogIcon className="w-8 h-8 mr-3 text-primary" />
        Admin Panel
      </h1>

      <JobRoleCreator onAddRole={addJobRole} />

      <Card title="Manage Job Roles">
        {jobRoles.length === 0 ? (
            <p className="text-gray-400">No job roles created yet.</p>
        ) : (
            <ul className="space-y-3">
                {jobRoles.map(role => (
                    <li key={role.id} className="p-4 bg-secondary-lighter rounded-md shadow flex justify-between items-center">
                        <div>
                            <h4 className="font-semibold text-gray-100">{role.title}</h4>
                            <p className="text-sm text-gray-400">{role.description}</p>
                        </div>
                        <Button variant="secondary" size="sm" onClick={() => alert(`Editing ${role.title}`)}>Edit</Button>
                    </li>
                ))}
            </ul>
        )}
      </Card>

      <Card title="Bulk Invite Candidates">
        <p className="text-gray-400 mb-4">Feature to bulk invite candidates (e.g., via CSV upload or pasting emails) would be here.</p>
        <Textarea label="Paste Candidate Emails (one per line)" placeholder="candidate1@example.com\ncandidate2@example.com" />
        <Button variant="primary" onClick={() => alert('Bulk invite functionality placeholder.')}>Send Invites</Button>
      </Card>
      
      <Card title="System Settings">
         <p className="text-gray-400">Placeholders for other admin settings:</p>
         <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
            <li>Notification templates customization</li>
            <li>Default buffer times and working hours</li>
            <li>User management (other recruiters/admins)</li>
         </ul>
      </Card>
    </div>
  );
};

export default AdminDashboard;