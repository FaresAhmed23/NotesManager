// components/SettingsModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Download, 
  Upload, 
  Trash2, 
  Check,
  AlertCircle,
  User,
  Mail,
  Key,
  Save,
  LogOut,
  FileText,
  Languages,
  Palette
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotes } from '../hooks/useNotes';

const SettingsModal = ({ onClose, theme, toggleTheme }) => {
  const { user, updateUserSettings, logout } = useAuth();
  const { notes, exportNotes, importNotes } = useNotes();
  const [activeTab, setActiveTab] = useState('general');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: user?.settings?.notifications ?? true,
    autoSave: user?.settings?.autoSave ?? true,
    compactView: user?.settings?.compactView ?? false,
    language: user?.settings?.language ?? 'en',
    fontSize: user?.settings?.fontSize ?? 'medium',
    lineSpacing: user?.settings?.lineSpacing ?? 'normal',
    notePrivacy: user?.settings?.notePrivacy ?? 'private',
  });

  // Profile state
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const tabs = [
    { id: 'general', label: 'General', icon: <Palette className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <FileText className="w-4 h-4" /> },
    { id: 'data', label: 'Data & Privacy', icon: <Shield className="w-4 h-4" /> },
  ];

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    if (user) {
      updateUserSettings(settings);
    } else {
      localStorage.setItem('guestSettings', JSON.stringify(settings));
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleImportNotes = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const count = await importNotes(file);
        setShowSuccess(true);
        setErrorMessage(`Successfully imported ${count} notes`);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        setShowError(true);
        setErrorMessage('Failed to import notes. Please check the file format.');
        setTimeout(() => setShowError(false), 3000);
      }
    }
  };

  const handleDeleteAllNotes = () => {
    if (window.confirm('Are you sure you want to delete all notes? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete ALL your notes. Are you absolutely sure?')) {
        localStorage.removeItem(user ? `notes_${user.id}` : 'notes_guest');
        window.location.reload();
      }
    }
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Appearance</h3>
        <div className="flex gap-3">
          <button
            onClick={toggleTheme}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
              theme === 'light' 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="font-medium">Light</span>
          </button>
          <button
            onClick={toggleTheme}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
              theme === 'dark' 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="font-medium">Dark</span>
          </button>
        </div>
      </div>

      {/* Language */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          <Languages className="w-4 h-4 inline mr-2" />
          Language
        </label>
        <select 
          value={settings.language} 
          onChange={(e) => handleSettingsChange('language', e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      {/* Notifications */}
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium text-foreground">Notifications</span>
              <p className="text-xs text-muted-foreground">Get notified about important updates</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => handleSettingsChange('notifications', e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
        </label>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      {user ? (
        <>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg cursor-not-allowed opacity-60"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to logout?')) {
                  logout();
                  onClose();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Sign in to manage your profile</p>
          <button className="btn-primary">Sign In</button>
        </div>
      )}
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Auto Save */}
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <Save className="w-5 h-5 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium text-foreground">Auto Save</span>
              <p className="text-xs text-muted-foreground">Automatically save notes as you type</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.autoSave}
            onChange={(e) => handleSettingsChange('autoSave', e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
        </label>
      </div>

      {/* Compact View */}
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium text-foreground">Compact View</span>
              <p className="text-xs text-muted-foreground">Show more notes in less space</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={settings.compactView}
            onChange={(e) => handleSettingsChange('compactView', e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
        </label>
      </div>

      {/* Font Size */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Font Size
        </label>
        <select 
          value={settings.fontSize} 
          onChange={(e) => handleSettingsChange('fontSize', e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      {/* Line Spacing */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Line Spacing
        </label>
        <select 
          value={settings.lineSpacing} 
          onChange={(e) => handleSettingsChange('lineSpacing', e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="compact">Compact</option>
          <option value="normal">Normal</option>
          <option value="relaxed">Relaxed</option>
        </select>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      {/* Export Notes */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Export Data</h3>
        <button
          onClick={exportNotes}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export All Notes</span>
        </button>
        <p className="text-xs text-muted-foreground mt-2">
          Download all your notes as a JSON file
        </p>
      </div>

      {/* Import Notes */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Import Data</h3>
        <label className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Import Notes</span>
          <input
            type="file"
            accept=".json"
            onChange={handleImportNotes}
            className="hidden"
          />
        </label>
        <p className="text-xs text-muted-foreground mt-2">
          Import notes from a JSON backup file
        </p>
      </div>

      {/* Note Privacy */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          <Shield className="w-4 h-4 inline mr-2" />
          Default Note Privacy
        </label>
        <select 
          value={settings.notePrivacy} 
          onChange={(e) => handleSettingsChange('notePrivacy', e.target.value)}
          className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="private">Private</option>
          <option value="shared">Shared with Team</option>
          <option value="public">Public</option>
        </select>
      </div>

      {/* Danger Zone */}
      <div className="pt-4 border-t border-border">
        <h3 className="text-sm font-medium text-destructive mb-3">Danger Zone</h3>
        <button
          onClick={handleDeleteAllNotes}
          className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete All Notes</span>
        </button>
        <p className="text-xs text-muted-foreground mt-2">
          This will permanently delete all your notes. This action cannot be undone.
        </p>
      </div>
    </div>
  );

  return (
    <>
            <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in-up"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-scale-in-smooth">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-1 mt-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
            {activeTab === 'general' && renderGeneralTab()}
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
            {activeTab === 'data' && renderDataTab()}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showSuccess && (
                  <div className="flex items-center gap-2 text-green-600 text-sm animate-fade-in-up">
                    <Check className="w-4 h-4" />
                    <span>{errorMessage || 'Settings saved successfully!'}</span>
                  </div>
                )}
                {showError && (
                  <div className="flex items-center gap-2 text-destructive text-sm animate-fade-in-up">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  className="btn-primary flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsModal;