import React, { useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

export default function UserDropdown({ isOpen, onClose }) {
  const dropdownRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !currentUser) return null;

  return (
    <div className="user-menu-dropdown" ref={dropdownRef} role="menu">
      <div className="user-menu-profile-summary">
        <div
          className="user-menu-avatar"
          style={{ backgroundColor: currentUser.avatarColor || '#2563eb' }}
        >
          {currentUser.avatarInitials || 'U'}
        </div>
        <div className="user-menu-details">
          <div className="user-menu-name">{currentUser.name}</div>
          <div className="user-menu-email">{currentUser.email}</div>
        </div>
      </div>

      <div className="user-menu-divider" />

      <div className="user-menu-nav">
        <button
          type="button"
          className="user-menu-item"
          onClick={() => {
            navigate('/profile');
            onClose();
          }}
          role="menuitem"
        >
          <User size={16} className="text-secondary" />
          <span>My Profile</span>
          <ChevronRight size={14} className="user-menu-chevron" />
        </button>

        <button
          type="button"
          className="user-menu-item"
          onClick={() => {
            navigate('/settings');
            onClose();
          }}
          role="menuitem"
        >
          <Settings size={16} className="text-secondary" />
          <span>Settings</span>
          <ChevronRight size={14} className="user-menu-chevron" />
        </button>
      </div>

      <div className="user-menu-divider" />

      <button
        type="button"
        className="user-menu-item user-menu-logout"
        onClick={() => {
          onClose();
          logout();
          navigate('/login');
        }}
        role="menuitem"
      >
        <LogOut size={16} />
        <span>Log Out</span>
      </button>
    </div>
  );
}
