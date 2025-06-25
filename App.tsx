import React from 'react';
import { useAuth } from './hooks/useAuth';
import AuthScreen from './components/auth/AuthScreen';
import Navbar from './components/shared/Navbar';
import InterviewDashboard from './components/dashboard/InterviewDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import SchedulingWizard from './components/scheduling/SchedulingWizard';
import { UserRole } from './types';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GithubIcon, InstagramIcon, LinkedInIcon, XIcon, YoutubeIcon, BlogIcon } from './components/shared/Icons';

const App: React.FC = () => {
  const { currentUser, selectedRole } = useAuth();

  if (!currentUser || !selectedRole) {
    return <AuthScreen />;
  }

  const brand = {
    organizationShortName: "HERE AND NOW AI",
    slogan: "designed with passion for innovation",
    socialMedia: {
      blog: "https://hereandnowai.com/blog",
      linkedin: "https://www.linkedin.com/company/hereandnowai/",
      instagram: "https://instagram.com/hereandnow_ai",
      github: "https://github.com/hereandnowai",
      x: "https://x.com/hereandnow_ai",
      youtube: "https://youtube.com/@hereandnow_ai"
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-secondary-dark via-secondary to-secondary-light text-gray-100">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<InterviewDashboard />} />
            {selectedRole === UserRole.RECRUITER && (
              <>
                <Route path="/schedule" element={<SchedulingWizard />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </>
            )}
            {/* Add more role-specific routes if needed */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} /> {/* Fallback route */}
          </Routes>
        </main>
        <footer className="bg-secondary-dark text-center py-6 text-sm text-gray-400 border-t border-secondary-light">
          <p className="mb-2">{brand.organizationShortName} &copy; {new Date().getFullYear()}</p>
          <p className="italic mb-3">{brand.slogan}</p>
          <div className="flex justify-center space-x-4">
            <a href={brand.socialMedia.blog} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><BlogIcon className="w-5 h-5" /></a>
            <a href={brand.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><LinkedInIcon className="w-5 h-5" /></a>
            <a href={brand.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><InstagramIcon className="w-5 h-5" /></a>
            <a href={brand.socialMedia.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><GithubIcon className="w-5 h-5" /></a>
            <a href={brand.socialMedia.x} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><XIcon className="w-5 h-5" /></a>
            <a href={brand.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><YoutubeIcon className="w-5 h-5" /></a>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;