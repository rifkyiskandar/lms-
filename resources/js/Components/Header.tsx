import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';

interface HeaderProps {
    onNavigate: (view: string) => void;
    isDark: boolean;
    toggleTheme: () => void;
    language: 'en' | 'id';
    toggleLanguage: () => void;
    // Tambahkan role (opsional) untuk ditampilkan
    user?: { name: string; avatar?: string; role?: string };
}

const Header: React.FC<HeaderProps> = ({ onNavigate, isDark, toggleTheme, language, toggleLanguage, user }) => {
  const [openDropdown, setOpenDropdown] = useState<'notifications' | 'settings' | null>(null);

  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        if (openDropdown === 'notifications') setOpenDropdown(null);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        if (openDropdown === 'settings') setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = (name: 'notifications' | 'settings') => {
      setOpenDropdown(openDropdown === name ? null : name);
  };

  // Mock Notification Data
  const recentNotifications = [
    { id: 1, title: 'New Student Enrollment', time: '2 mins ago', unread: true },
    { id: 2, title: 'System Maintenance', time: '1 hour ago', unread: true },
    { id: 3, title: 'Grade Submission Deadline', time: '5 hours ago', unread: false },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-end border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-4 sm:px-8 transition-colors duration-200">
      {/* ToolBar */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Notification Button */}
        <div className="relative" ref={notifRef}>
        <button
            onClick={() => toggleDropdown('notifications')}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative ${openDropdown === 'notifications' ? 'bg-gray-100 dark:bg-gray-800 text-primary' : 'text-gray-600 dark:text-gray-300'}`}
        >
            <Icon name="notifications" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#19222c]"></span>
        </button>

        {/* Notification Dropdown */}
        {openDropdown === 'notifications' && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#19222c] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Notifications</h3>
                    <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                    {recentNotifications.map(notif => (
                        <div key={notif.id} className={`px-4 py-3 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${notif.unread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                            <div className="flex justify-between items-start mb-1">
                                <p className={`text-sm ${notif.unread ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                                    {notif.title}
                                </p>
                                {notif.unread && <span className="w-2 h-2 rounded-full bg-primary mt-1.5"></span>}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{notif.time}</p>
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => {
                        setOpenDropdown(null);
                        onNavigate('notifications');
                    }}
                    className="w-full py-3 text-center text-sm font-medium text-primary hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                    View All Notifications
                </button>
            </div>
        )}
        </div>

        {/* Settings Button */}
        <div className="relative" ref={settingsRef}>
            <button
            onClick={() => toggleDropdown('settings')}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${openDropdown === 'settings' ? 'bg-gray-100 dark:bg-gray-800 text-primary' : 'text-gray-600 dark:text-gray-300'}`}
            >
            <Icon name="settings" />
            </button>

            {/* Settings Dropdown */}
            {openDropdown === 'settings' && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#19222c] border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl overflow-hidden animate-fade-in z-50 p-2">
                <div className="space-y-1">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Icon name={isDark ? "dark_mode" : "light_mode"} />
                            <span>Appearance</span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded capitalize">
                            {isDark ? "Dark" : "Light"}
                        </span>
                    </button>

                    {/* Language Toggle */}
                    <button
                            onClick={toggleLanguage}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                            <div className="flex items-center gap-3">
                            <Icon name="language" />
                            <span>Language</span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded uppercase">
                            {language}
                        </span>
                    </button>

                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                        {/* Advanced Settings Link */}
                        <button
                            onClick={() => {
                            setOpenDropdown(null);
                            onNavigate('advanced_settings');
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <Icon name="tune" />
                        <span>Advanced Settings</span>
                    </button>
                </div>
            </div>
        )}
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

        {/* Profile Button (Dengan Nama & Role) */}
        <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-3 p-1 pr-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
        >
            <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold border border-primary/20 overflow-hidden relative shrink-0">
                {user?.avatar ? (
                    <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <span>{user?.name?.charAt(0) || 'U'}</span>
                )}
            </div>

            {/* Tampilkan Nama & Role (Hidden di Mobile) */}
            <div className="text-left hidden sm:block min-w-[80px]">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors line-clamp-1">
                    {user?.name || 'Guest'}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                    {user?.role || 'User'} {/* Default 'User' jika role tidak ada */}
                </p>
            </div>

        </button>

      </div>
    </header>
  );
};

export default Header;
