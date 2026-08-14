import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { INDIAN_LOCATIONS, getSelectedLocation, saveSelectedLocation } from '../data/locations';
import { showToast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Sun, Moon, Laptop, Bell, 
  MapPin, ShieldAlert, Key, LogOut, CheckCircle2, ChevronRight 
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
];

export const Settings: React.FC = () => {
  const { user, loginCustom, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  // Form State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState(localStorage.getItem('nagarsathi_profile_phone') || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || AVATAR_PRESETS[0]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Appearance State
  const [interfaceLayout, setInterfaceLayout] = useState(() => {
    return localStorage.getItem('nagarsathi_layout_pref') || 'comfortable';
  });

  // Notifications State
  const [notifyStatus, setNotifyStatus] = useState(() => {
    return localStorage.getItem('nagarsathi_notify_status') !== 'false';
  });
  const [notifyAck, setNotifyAck] = useState(() => {
    return localStorage.getItem('nagarsathi_notify_ack') !== 'false';
  });
  const [notifyResolution, setNotifyResolution] = useState(() => {
    return localStorage.getItem('nagarsathi_notify_resolution') !== 'false';
  });
  const [notifyAlerts, setNotifyAlerts] = useState(() => {
    return localStorage.getItem('nagarsathi_notify_alerts') !== 'false';
  });
  const [notifyEmail, setNotifyEmail] = useState(() => {
    return localStorage.getItem('nagarsathi_notify_email') !== 'false';
  });
  const [notifyPush, setNotifyPush] = useState(() => {
    return localStorage.getItem('nagarsathi_notify_push') !== 'false';
  });

  // Location State
  const currentSelectedCity = getSelectedLocation();
  const [prefCity, setPrefCity] = useState(currentSelectedCity.name);
  const [prefLocality, setPrefLocality] = useState(() => {
    return localStorage.getItem('nagarsathi_pref_locality') || '';
  });
  const [shareGPS, setShareGPS] = useState(() => {
    return localStorage.getItem('nagarsathi_share_gps') !== 'false';
  });

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    loginCustom({
      ...user,
      name: profileName,
      email: profileEmail,
      avatar: profileAvatar
    });
    localStorage.setItem('nagarsathi_profile_phone', profilePhone);
    setIsEditingProfile(false);
    showToast('Profile updated successfully', 'success');
  };

  const handleSaveAppearance = () => {
    localStorage.setItem('nagarsathi_layout_pref', interfaceLayout);
    showToast('Appearance settings saved', 'success');
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('nagarsathi_notify_status', String(notifyStatus));
    localStorage.setItem('nagarsathi_notify_ack', String(notifyAck));
    localStorage.setItem('nagarsathi_notify_resolution', String(notifyResolution));
    localStorage.setItem('nagarsathi_notify_alerts', String(notifyAlerts));
    localStorage.setItem('nagarsathi_notify_email', String(notifyEmail));
    localStorage.setItem('nagarsathi_notify_push', String(notifyPush));
    showToast('Notification settings persisted', 'success');
  };

  const handleSaveLocation = () => {
    const targetCity = INDIAN_LOCATIONS.find(c => c.name === prefCity);
    if (targetCity) {
      saveSelectedLocation(targetCity);
    }
    localStorage.setItem('nagarsathi_pref_locality', prefLocality);
    localStorage.setItem('nagarsathi_share_gps', String(shareGPS));
    showToast('Location settings updated', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('All password fields are required', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password changed successfully (Demo simulation)', 'success');
  };

  const handleLogoutAll = () => {
    if (confirm('Are you sure you want to log out from all devices?')) {
      logout();
      navigate('/login');
      showToast('Logged out from all devices successfully', 'info');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
      showToast('Logged out successfully', 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto px-4 py-2 relative">
      <div>
        <h1 className="text-2xl font-black text-[#10201C] dark:text-[#f2f7f5]">Settings</h1>
        <p className="text-sm text-[#536761] dark:text-[#a3c4b9]">Configure account information, interface theme, location, notifications, and language.</p>
      </div>

      {/* Account Settings */}
      <section className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#D6E2DE] dark:border-[#1e332f]">
          <User className="w-5 h-5 text-[#053229] dark:text-[#0ca688]" />
          <h2 className="font-extrabold text-[#10201C] dark:text-[#f2f7f5] text-base">Account Settings</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <img 
                src={profileAvatar} 
                alt="Profile Avatar" 
                className="w-20 h-20 rounded-full object-cover border-2 border-[#053229] dark:border-[#0ca688] shadow-sm" 
              />
              {isEditingProfile && (
                <div className="absolute inset-0 bg-[#053229]/60 rounded-full flex items-center justify-center text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Preset Mode
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3 w-full">
              {isEditingProfile ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#73827D] uppercase tracking-wider block">Select Avatar Preset</label>
                  <div className="flex flex-wrap gap-2.5">
                    {AVATAR_PRESETS.map((preset, index) => (
                      <button 
                        key={index} 
                        type="button" 
                        onClick={() => setProfileAvatar(preset)}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                          profileAvatar === preset 
                            ? 'border-[#053229] dark:border-[#0ca688] scale-105 shadow-sm' 
                            : 'border-[#D6E2DE] dark:border-[#1e332f] opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt={`preset-${index}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-black text-[#10201C] dark:text-[#f2f7f5]">{user?.name}</p>
                  <p className="text-xs text-[#73827D] dark:text-[#73948b] font-medium">{user?.role} account type</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#536761] dark:text-[#a3c4b9]">Profile Name</label>
              <input 
                type="text" 
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-sm focus:outline-none focus:border-[#053229] disabled:opacity-60"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#536761] dark:text-[#a3c4b9]">Email Address</label>
              <input 
                type="email" 
                value={profileEmail}
                onChange={e => setProfileEmail(e.target.value)}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-sm focus:outline-none focus:border-[#053229] disabled:opacity-60"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#536761] dark:text-[#a3c4b9]">Phone Number</label>
              <input 
                type="tel" 
                value={profilePhone}
                placeholder="+91 XXXXX XXXXX"
                onChange={e => setProfilePhone(e.target.value)}
                disabled={!isEditingProfile}
                className="w-full px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-sm focus:outline-none focus:border-[#053229] disabled:opacity-60"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            {isEditingProfile ? (
              <>
                <button 
                  type="button"
                  onClick={() => {
                    setProfileName(user?.name || '');
                    setProfileEmail(user?.email || '');
                    setProfileAvatar(user?.avatar || AVATAR_PRESETS[0]);
                    setIsEditingProfile(false);
                  }}
                  className="px-4 py-2 border border-[#D6E2DE] dark:border-[#1e332f] text-[#536761] dark:text-[#a3c4b9] text-xs font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#053229] dark:bg-[#0ca688] hover:bg-[#07483A] text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button 
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="px-5 py-2 border border-[#053229] dark:border-[#0ca688] text-[#053229] dark:text-[#0ca688] hover:bg-[#E6F1EE] dark:hover:bg-[#142e2a] text-xs font-bold rounded-xl transition-all"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Language settings */}
      <section className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#D6E2DE] dark:border-[#1e332f]">
          <Sun className="w-5 h-5 text-[#053229] dark:text-[#0ca688]" />
          <h2 className="font-extrabold text-[#10201C] dark:text-[#f2f7f5] text-base">Language Preference</h2>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#10201C] dark:text-[#f2f7f5]">Language Selection</p>
            <p className="text-xs text-[#73827D] dark:text-[#73948b]">Select the default portal display language.</p>
          </div>
          <select 
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value as any);
              showToast(`Language updated to ${e.target.value === 'hi' ? 'Hindi' : 'English'}`, 'success');
            }}
            className="px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-sm focus:outline-none focus:border-[#053229]"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </section>

      {/* Appearance settings */}
      <section className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#D6E2DE] dark:border-[#1e332f]">
          <Sun className="w-5 h-5 text-[#053229] dark:text-[#0ca688]" />
          <h2 className="font-extrabold text-[#10201C] dark:text-[#f2f7f5] text-base">Appearance Settings</h2>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#536761] dark:text-[#a3c4b9]">Theme Selection</label>
            <div className="grid grid-cols-3 gap-3">
              <button 
                type="button"
                onClick={() => { setTheme('light'); showToast('Light mode set', 'success'); }}
                className={`py-3 px-4 flex items-center justify-center gap-2 rounded-xl text-xs font-bold border transition-all ${
                  theme === 'light' 
                    ? 'border-[#053229] dark:border-[#0ca688] bg-[#E6F1EE] dark:bg-[#142e2a] text-[#053229] dark:text-[#0ca688]' 
                    : 'border-[#D6E2DE] dark:border-[#1e332f] text-[#536761] dark:text-[#a3c4b9] hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <Sun className="w-4 h-4" /> Light Mode
              </button>
              <button 
                type="button"
                onClick={() => { setTheme('dark'); showToast('Dark mode set', 'success'); }}
                className={`py-3 px-4 flex items-center justify-center gap-2 rounded-xl text-xs font-bold border transition-all ${
                  theme === 'dark' 
                    ? 'border-[#053229] dark:border-[#0ca688] bg-[#E6F1EE] dark:bg-[#142e2a] text-[#053229] dark:text-[#0ca688]' 
                    : 'border-[#D6E2DE] dark:border-[#1e332f] text-[#536761] dark:text-[#a3c4b9] hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <Moon className="w-4 h-4" /> Dark Mode
              </button>
              <button 
                type="button"
                onClick={() => { setTheme('system'); showToast('System theme set', 'success'); }}
                className={`py-3 px-4 flex items-center justify-center gap-2 rounded-xl text-xs font-bold border transition-all ${
                  theme === 'system' 
                    ? 'border-[#053229] dark:border-[#0ca688] bg-[#E6F1EE] dark:bg-[#142e2a] text-[#053229] dark:text-[#0ca688]' 
                    : 'border-[#D6E2DE] dark:border-[#1e332f] text-[#536761] dark:text-[#a3c4b9] hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <Laptop className="w-4 h-4" /> System
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#D6E2DE] dark:border-[#1e332f]">
            <div>
              <p className="text-sm font-bold text-[#10201C] dark:text-[#f2f7f5]">Interface Layout Mode</p>
              <p className="text-xs text-[#73827D] dark:text-[#73948b]">Choose between compact density or comfortable padding.</p>
            </div>
            <select 
              value={interfaceLayout}
              onChange={(e) => setInterfaceLayout(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-sm focus:outline-none focus:border-[#053229]"
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>

          <div className="flex justify-end pt-3">
            <button 
              type="button"
              onClick={handleSaveAppearance}
              className="px-4 py-2 bg-[#053229] dark:bg-[#0ca688] hover:bg-[#07483A] text-white text-xs font-bold rounded-xl"
            >
              Save Appearance
            </button>
          </div>
        </div>
      </section>

      {/* Notifications settings */}
      <section className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#D6E2DE] dark:border-[#1e332f]">
          <Bell className="w-5 h-5 text-[#053229] dark:text-[#0ca688]" />
          <h2 className="font-extrabold text-[#10201C] dark:text-[#f2f7f5] text-base">Notifications Control</h2>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-[#73827D] dark:text-[#73948b] font-medium">Select which events trigger system and browser notifications.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#10201C] dark:text-[#f2f7f5]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyStatus}
                onChange={e => setNotifyStatus(e.target.checked)}
                className="rounded text-[#053229] focus:ring-[#053229] w-4 h-4 border-[#D6E2DE]"
              />
              <span>Issue status updates</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyAck}
                onChange={e => setNotifyAck(e.target.checked)}
                className="rounded text-[#053229] focus:ring-[#053229] w-4 h-4 border-[#D6E2DE]"
              />
              <span>Report acknowledgements</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyResolution}
                onChange={e => setNotifyResolution(e.target.checked)}
                className="rounded text-[#053229] focus:ring-[#053229] w-4 h-4 border-[#D6E2DE]"
              />
              <span>Resolution notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyAlerts}
                onChange={e => setNotifyAlerts(e.target.checked)}
                className="rounded text-[#053229] focus:ring-[#053229] w-4 h-4 border-[#D6E2DE]"
              />
              <span>Important civic alerts</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyEmail}
                onChange={e => setNotifyEmail(e.target.checked)}
                className="rounded text-[#053229] focus:ring-[#053229] w-4 h-4 border-[#D6E2DE]"
              />
              <span>Email notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyPush}
                onChange={e => setNotifyPush(e.target.checked)}
                className="rounded text-[#053229] focus:ring-[#053229] w-4 h-4 border-[#D6E2DE]"
              />
              <span>Push/browser notifications</span>
            </label>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#D6E2DE] dark:border-[#1e332f]">
            <button 
              type="button"
              onClick={handleSaveNotifications}
              className="px-4 py-2 bg-[#053229] dark:bg-[#0ca688] hover:bg-[#07483A] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Save Notification Choices
            </button>
          </div>
        </div>
      </section>

      {/* Location settings */}
      <section className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#D6E2DE] dark:border-[#1e332f]">
          <MapPin className="w-5 h-5 text-[#053229] dark:text-[#0ca688]" />
          <h2 className="font-extrabold text-[#10201C] dark:text-[#f2f7f5] text-base">Location Preferences</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#536761] dark:text-[#a3c4b9]">Current City</label>
            <select 
              value={prefCity}
              onChange={e => setPrefCity(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-sm focus:outline-none focus:border-[#053229]"
            >
              {INDIAN_LOCATIONS.map(c => <option key={c.name} value={c.name}>{c.name} ({c.state})</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#536761] dark:text-[#a3c4b9]">Preferred Locality/Area</label>
            <input 
              type="text" 
              value={prefLocality}
              placeholder="e.g. Zone-II, Arera Colony"
              onChange={e => setPrefLocality(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-sm focus:outline-none focus:border-[#053229]"
            />
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-[#D6E2DE] dark:border-[#1e332f] text-sm text-[#10201C] dark:text-[#f2f7f5]">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={shareGPS}
              onChange={e => setShareGPS(e.target.checked)}
              className="rounded text-[#053229] focus:ring-[#053229] w-4 h-4 border-[#D6E2DE]"
            />
            <span>Allow app to access browser GPS location</span>
          </label>
        </div>

        <div className="flex justify-end pt-3">
          <button 
            type="button"
            onClick={handleSaveLocation}
            className="px-4 py-2 bg-[#053229] dark:bg-[#0ca688] hover:bg-[#07483A] text-white text-xs font-bold rounded-xl"
          >
            Save Location Settings
          </button>
        </div>
      </section>

      {/* Privacy & Security settings */}
      <section className="bg-white dark:bg-[#0e1714] border border-[#D6E2DE] dark:border-[#1e332f] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#D6E2DE] dark:border-[#1e332f]">
          <Key className="w-5 h-5 text-[#053229] dark:text-[#0ca688]" />
          <h2 className="font-extrabold text-[#10201C] dark:text-[#f2f7f5] text-base">Privacy &amp; Security</h2>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <h3 className="text-sm font-bold text-[#10201C] dark:text-[#f2f7f5]">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input 
              type="password" 
              placeholder="Current Password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-sm focus:outline-none focus:border-[#053229]"
            />
            <input 
              type="password" 
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-sm focus:outline-none focus:border-[#053229]"
            />
            <input 
              type="password" 
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-[#152420] border border-[#D6E2DE] dark:border-[#1e332f] text-[#10201C] dark:text-[#f2f7f5] rounded-xl text-sm focus:outline-none focus:border-[#053229]"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="px-4 py-2 bg-[#053229] dark:bg-[#0ca688] hover:bg-[#07483A] text-white text-xs font-bold rounded-xl"
            >
              Update Password
            </button>
          </div>
        </form>

        <div className="pt-6 border-t border-rose-100/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#10201C] dark:text-[#f2f7f5]">Device Sessions</p>
            <p className="text-xs text-[#73827D] dark:text-[#73948b]">Log out of this browser or reset all active logins.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 border border-[#D6E2DE] dark:border-[#1e332f] text-[#536761] dark:text-[#a3c4b9] hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout Device
            </button>
            <button 
              type="button"
              onClick={handleLogoutAll}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout All Devices
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
