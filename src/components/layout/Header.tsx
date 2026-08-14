import React, { useState } from 'react';
import { Menu, MapPin, Globe, ChevronDown, Search, Bell, Settings, User, LogOut, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { NotificationCenter } from '../ui/NotificationCenter';
import { SearchModal } from '../ui/SearchModal';
import { getSelectedLocation, saveSelectedLocation, INDIAN_LOCATIONS, type CityInfo } from '../../data/locations';
import type { Language } from '../../data/translations';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const selectedLocation = getSelectedLocation();

  const handleLocationSelect = (city: CityInfo) => {
    saveSelectedLocation(city);
    setLocationDropdownOpen(false);
    window.location.reload(); 
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'മലയാളം' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  ];

  // Derive current section label
  const getSectionLabel = () => {
    const path = location.pathname;
    if (path === '/' || path === '/citizen') return 'Home';
    if (path === '/report' || path === '/citizen/report') return 'Report Issue';
    if (path === '/reports' || path === '/citizen/issues') return 'My Reports';
    if (path === '/map') return 'City Map';
    if (path === '/transparency') return 'Transparency';
    if (path === '/notifications') return 'Notifications';
    if (path === '/settings') return 'Settings';
    if (path === '/help') return 'Help Support';
    if (path === '/profile') return 'Profile';
    if (path.startsWith('/admin')) return 'Admin Panel';
    return 'Portal';
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-[68px] px-4 bg-[#FFFFFF] dark:bg-[#0e1714] border-b border-[#D6E2DE] dark:border-[#1e332f] shadow-2xs">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-[#536761] dark:text-[#a3c4b9] hover:bg-[#F5F8F7] dark:hover:bg-[#152420] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative">
            <button 
              onClick={() => {
                setLocationDropdownOpen(!locationDropdownOpen);
                setLangDropdownOpen(false);
                setProfileDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-[#F5F8F7] dark:hover:bg-[#152420] transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#053229] dark:text-[#0ca688]" />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-[#10201C] dark:text-[#f2f7f5] leading-none">{selectedLocation.name}</div>
                <div className="text-[9px] text-[#73827D] dark:text-[#73948b] font-medium mt-0.5">{selectedLocation.state}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#73827D] dark:text-[#73948b] ml-0.5" />
            </button>

            {locationDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 max-h-[300px] overflow-y-auto bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] rounded-xl shadow-lg z-50">
                <div className="p-2">
                  {INDIAN_LOCATIONS.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleLocationSelect(city)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        selectedLocation.name === city.name 
                          ? 'bg-[#E6F1EE] dark:bg-[#142e2a] text-[#053229] dark:text-[#0ca688] font-bold' 
                          : 'text-[#536761] dark:text-[#a3c4b9] hover:bg-[#F5F8F7] dark:hover:bg-[#152420]'
                      }`}
                    >
                      {city.name}, <span className="text-[10px] text-[#73827D] dark:text-[#73948b]">{city.state}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Clean navigation/search area */}
        <div className="flex-1 max-w-md mx-6 hidden md:flex items-center gap-3">
          <div className="text-xs font-black text-[#053229] dark:text-[#0ca688] px-2.5 py-1.5 bg-[#E6F1EE] dark:bg-[#142e2a] rounded-xl border border-[#BFD5CE] dark:border-[#1e332f] shrink-0">
            {getSectionLabel()}
          </div>
          
          <button 
            onClick={() => setSearchOpen(true)}
            className="flex-1 flex items-center gap-2.5 px-3 py-1.5 bg-[#F5F8F7] dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] hover:border-[#053229] dark:hover:border-[#0ca688] rounded-xl text-left text-xs text-[#73827D] dark:text-[#73948b] transition-all"
          >
            <Search className="w-4 h-4 text-[#73827D] dark:text-[#73948b]" />
            <span>Search civic issues, tracking IDs...</span>
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile search toggle */}
          <button 
            onClick={() => setSearchOpen(true)}
            className="md:hidden p-2 rounded-full text-[#536761] dark:text-[#a3c4b9] hover:bg-[#F5F8F7] dark:hover:bg-[#152420] transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

          <NotificationCenter />

          {/* Language selector */}
          <div className="relative">
            <button 
              onClick={() => {
                setLangDropdownOpen(!langDropdownOpen);
                setLocationDropdownOpen(false);
                setProfileDropdownOpen(false);
              }}
              className="p-2 rounded-full text-[#536761] dark:text-[#a3c4b9] hover:bg-[#F5F8F7] dark:hover:bg-[#152420] transition-colors"
            >
              <Globe className="w-5 h-5" />
            </button>
            {langDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] rounded-xl shadow-lg z-50">
                <div className="p-1.5 max-h-[250px] overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code as Language)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                        language === lang.code 
                          ? 'bg-[#E6F1EE] dark:bg-[#142e2a] text-[#053229] dark:text-[#0ca688] font-bold' 
                          : 'text-[#536761] dark:text-[#a3c4b9] hover:bg-[#F5F8F7] dark:hover:bg-[#152420]'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User profile avatar dropdown */}
          {user && (
            <div className="relative ml-1 pl-2 border-l border-[#D6E2DE] dark:border-[#1e332f]">
              <button 
                onClick={() => {
                  setProfileDropdownOpen(!profileDropdownOpen);
                  setLocationDropdownOpen(false);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center focus:outline-none rounded-full border-2 border-transparent hover:border-[#053229] dark:hover:border-[#0ca688] transition-all"
              >
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {profileDropdownOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-48 bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] rounded-xl shadow-lg z-50 py-1.5">
                  <div className="px-3.5 py-2 border-b border-[#D6E2DE] dark:border-[#1e332f] mb-1">
                    <p className="text-xs font-bold text-[#10201C] dark:text-[#f2f7f5] truncate">{user.name}</p>
                    <p className="text-[9px] text-[#73827D] dark:text-[#73948b] font-extrabold uppercase mt-0.5 tracking-wider">{user.role}</p>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#536761] dark:text-[#a3c4b9] hover:bg-[#F5F8F7] dark:hover:bg-[#152420] transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Profile</span>
                  </Link>

                  <Link 
                    to="/reports" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#536761] dark:text-[#a3c4b9] hover:bg-[#F5F8F7] dark:hover:bg-[#152420] transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>My Reports</span>
                  </Link>

                  <Link 
                    to="/notifications" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#536761] dark:text-[#a3c4b9] hover:bg-[#F5F8F7] dark:hover:bg-[#152420] transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Notifications</span>
                  </Link>

                  <Link 
                    to="/settings" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-[#536761] dark:text-[#a3c4b9] hover:bg-[#F5F8F7] dark:hover:bg-[#152420] transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </Link>

                  <div className="border-t border-[#D6E2DE] dark:border-[#1e332f] my-1.5" />

                  <button 
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
};
