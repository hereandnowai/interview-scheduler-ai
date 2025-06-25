import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import Button from './Button';
import { CalendarIcon, CogIcon, UsersIcon, LogoutIcon } from './Icons';
import { APP_NAME } from '../../constants';

const Navbar: React.FC = () => {
  const { currentUser, selectedRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  const navLinkClasses = (isActive: boolean) =>
    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive ? 'bg-primary text-secondary-dark font-semibold' : 'text-gray-300 hover:bg-secondary-light hover:text-white'
    }`;
  
  const brandLogoUrl = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png";

  return (
    <nav className="bg-secondary-dark shadow-lg border-b border-secondary-light">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20"> {/* Increased height for logo */}
          <div className="flex items-center">
            <img src={brandLogoUrl} alt={`${APP_NAME} Logo`} className="h-12 w-auto" /> {/* Adjusted logo size */}
            {/* <span className="ml-3 text-2xl font-bold text-primary">{APP_NAME}</span> */} {/* Name can be part of logo */}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/dashboard" className={({ isActive }) => navLinkClasses(isActive)}>
              <CalendarIcon className="w-5 h-5 mr-2" />
              Dashboard
            </NavLink>

            {selectedRole === UserRole.RECRUITER && (
              <>
                <NavLink to="/schedule" className={({ isActive }) => navLinkClasses(isActive)}>
                  <UsersIcon className="w-5 h-5 mr-2" />
                  Schedule Interview
                </NavLink>
                <NavLink to="/admin" className={({ isActive }) => navLinkClasses(isActive)}>
                  <CogIcon className="w-5 h-5 mr-2" />
                  Admin Panel
                </NavLink>
              </>
            )}
          </div>
          <div className="flex items-center">
            {currentUser && (
              <span className="text-gray-300 text-sm mr-4 hidden sm:block">
                Welcome, {currentUser.name} ({selectedRole})
              </span>
            )}
            <Button onClick={handleLogout} variant="ghost" size="sm" leftIcon={<LogoutIcon />}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;