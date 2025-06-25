import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import Button from '../shared/Button';
import Select from '../shared/Select';
import { APP_NAME } from '../../constants';
import { UsersIcon, CalendarIcon, CogIcon } from '../shared/Icons';

const AuthScreen: React.FC = () => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CANDIDATE);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); 

  const handleLogin = () => {
    if (!name.trim() || !email.trim()) {
        alert("Please enter your name and email.");
        return;
    }
    const mockUser = {
      id: `${selectedRole.toLowerCase()}_${Date.now()}`,
      name: name,
      email: email,
      role: selectedRole,
    };
    login(mockUser, selectedRole);
  };

  const roleOptions = Object.values(UserRole).map(role => ({ value: role, label: role }));

  const roleDescriptions: Record<UserRole, {icon: React.ReactNode, text: string}> = {
    [UserRole.CANDIDATE]: { icon: <UsersIcon className="w-5 h-5 mr-2 text-primary" />, text: "View your upcoming interviews and manage your schedule." },
    [UserRole.RECRUITER]: { icon: <CogIcon className="w-5 h-5 mr-2 text-primary" />, text: "Manage job roles, schedule interviews, and oversee the hiring process." },
    [UserRole.HIRING_MANAGER]: { icon: <CalendarIcon className="w-5 h-5 mr-2 text-primary" />, text: "View scheduled interviews for your team and provide feedback." },
  }
  
  const brandLogoUrl = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png";
  const slogan = "designed with passion for innovation";


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary-dark via-secondary to-secondary-light p-4">
      <div className="w-full max-w-md p-8 bg-secondary-light shadow-2xl rounded-xl">
        <div className="flex flex-col items-center mb-8">
            <img src={brandLogoUrl} alt={`${APP_NAME} Logo`} className="h-20 w-auto mb-3" />
            {/* <h1 className="text-4xl font-bold text-primary">{APP_NAME}</h1> */}
            <p className="text-gray-400 mt-2 text-center">{slogan}</p>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex Smith"
              className="w-full px-4 py-2.5 bg-secondary-lighter border border-secondary rounded-lg text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., alex@example.com"
              className="w-full px-4 py-2.5 bg-secondary-lighter border border-secondary rounded-lg text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              required
            />
          </div>
          
          <Select
            label="Select Your Role"
            options={roleOptions}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
            containerClassName="mb-6"
          />

          <div className="mb-8 p-3 bg-secondary/50 rounded-lg border border-secondary-lighter flex items-start">
            {roleDescriptions[selectedRole].icon}
            <p className="text-sm text-gray-400">{roleDescriptions[selectedRole].text}</p>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Proceed as {selectedRole}
          </Button>
        </form>

        <p className="mt-8 text-xs text-gray-500 text-center">
            This is a demonstration. Authentication is mocked. <br/>
            Enter any name/email and select a role to continue.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;