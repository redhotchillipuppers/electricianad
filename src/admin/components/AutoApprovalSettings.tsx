import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { getFirebase, doc, getDoc, setDoc } from '../../firebase/firebase';
import { AutoApprovalSettings as AutoApprovalSettingsType, DEFAULT_AUTO_APPROVAL_SETTINGS } from '../../types/jobRequests';

const AutoApprovalSettings: React.FC = () => {
  const [settings, setSettings] = useState<AutoApprovalSettingsType>(DEFAULT_AUTO_APPROVAL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load settings from Firebase
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { db } = getFirebase();
      const settingsRef = doc(db, 'settings', 'autoApproval');
      const settingsDoc = await getDoc(settingsRef);

      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data() as AutoApprovalSettingsType);
      } else {
        // Initialize with defaults if not exists
        await setDoc(settingsRef, DEFAULT_AUTO_APPROVAL_SETTINGS);
        setSettings(DEFAULT_AUTO_APPROVAL_SETTINGS);
      }
    } catch (err) {
      console.error('Error loading auto-approval settings:', err);
      setError('Failed to load settings. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSaveSuccess(false);

      const { db } = getFirebase();
      const settingsRef = doc(db, 'settings', 'autoApproval');

      await setDoc(settingsRef, settings);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving auto-approval settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof AutoApprovalSettingsType, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] p-6 rounded-lg">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD300]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-[#FFD300]" />
          <h2 className="text-2xl font-bold text-white">Auto-Approval Settings</h2>
        </div>
        {settings.enabled && (
          <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-medium">
            Active
          </span>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-600 rounded-lg flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="mb-4 p-4 bg-green-900/20 border border-green-600 rounded-lg flex items-center gap-2 text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Enable/Disable Auto-Approval */}
        <div className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg">
          <div className="flex-1">
            <label className="text-lg font-semibold text-white block mb-1">
              Enable Auto-Approval
            </label>
            <p className="text-sm text-gray-400">
              Automatically assign eligible jobs to providers after the age threshold
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => updateSetting('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FFD300]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#FFD300]"></div>
          </label>
        </div>

        {/* Age Threshold */}
        <div className="p-4 bg-[#0A0A0A] rounded-lg">
          <label className="text-lg font-semibold text-white block mb-2">
            Auto-Approve After (hours)
          </label>
          <input
            type="number"
            value={settings.ageThresholdHours}
            onChange={(e) => updateSetting('ageThresholdHours', Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full p-3 bg-[#1A1A1A] text-white border border-gray-700 rounded-lg focus:outline-none focus:border-[#FFD300]"
            min="1"
            max="720"
          />
          <p className="text-sm text-gray-400 mt-2">
            Jobs older than this will be eligible for auto-assignment (1-720 hours, default: 48)
          </p>
          <div className="mt-2 text-sm text-[#FFD300]">
            ≈ {Math.round(settings.ageThresholdHours / 24 * 10) / 10} days
          </div>
        </div>

        {/* Max Jobs Limit */}
        <div className="p-4 bg-[#0A0A0A] rounded-lg">
          <label className="text-lg font-semibold text-white block mb-2">
            Max Active Jobs Per Provider
          </label>
          <input
            type="number"
            value={settings.maxOpenJobsLimit}
            onChange={(e) => updateSetting('maxOpenJobsLimit', Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full p-3 bg-[#1A1A1A] text-white border border-gray-700 rounded-lg focus:outline-none focus:border-[#FFD300]"
            min="1"
            max="100"
          />
          <p className="text-sm text-gray-400 mt-2">
            Providers with this many active jobs won't receive auto-assignments (1-100, default: 10)
          </p>
        </div>

        {/* Service Area Matching */}
        <div className="p-4 bg-[#0A0A0A] rounded-lg flex items-center justify-between">
          <div className="flex-1">
            <label className="text-lg font-semibold text-white block mb-1">
              Consider Service Area
            </label>
            <p className="text-sm text-gray-400">
              Only auto-assign to providers who work in the job's service area
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.considerServiceArea}
              onChange={(e) => updateSetting('considerServiceArea', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FFD300]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#FFD300]"></div>
          </label>
        </div>

        {/* Workload Balancing */}
        <div className="p-4 bg-[#0A0A0A] rounded-lg flex items-center justify-between">
          <div className="flex-1">
            <label className="text-lg font-semibold text-white block mb-1">
              Use Workload Balancing
            </label>
            <p className="text-sm text-gray-400">
              Prefer providers with fewer active jobs when auto-assigning
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.useWorkloadBalancing}
              onChange={(e) => updateSetting('useWorkloadBalancing', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FFD300]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#FFD300]"></div>
          </label>
        </div>

        {/* Rating Weight (Future Feature) */}
        <div className="p-4 bg-[#0A0A0A] rounded-lg flex items-center justify-between opacity-50">
          <div className="flex-1">
            <label className="text-lg font-semibold text-white block mb-1">
              Use Rating Weight (Coming Soon)
            </label>
            <p className="text-sm text-gray-400">
              Factor provider ratings into auto-assignment decisions
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-not-allowed">
            <input
              type="checkbox"
              checked={settings.useRatingWeight}
              disabled
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
          </label>
        </div>

        {/* Statistics */}
        {settings.stats && (
          <div className="border-t border-gray-700 pt-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#FFD300]" />
              <h3 className="text-lg font-semibold text-white">Auto-Approval Statistics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#0A0A0A] rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Total Auto-Approved</p>
                <p className="text-2xl font-bold text-white">{settings.stats.totalAutoApproved || 0}</p>
              </div>
              <div className="p-4 bg-[#0A0A0A] rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Last 30 Days</p>
                <p className="text-2xl font-bold text-white">{settings.stats.lastMonthAutoApproved || 0}</p>
              </div>
              <div className="p-4 bg-[#0A0A0A] rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Last 7 Days</p>
                <p className="text-2xl font-bold text-white">{settings.stats.lastWeekAutoApproved || 0}</p>
              </div>
            </div>
            {settings.lastAutoRunAt && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Last run: {new Date(settings.lastAutoRunAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#FFD300] text-black font-semibold rounded-lg hover:bg-[#E6C000] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoApprovalSettings;
