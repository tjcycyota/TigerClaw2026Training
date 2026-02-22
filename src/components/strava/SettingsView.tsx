import React, { useState } from 'react';
import { Activity, Link2, LogOut, Sun, Moon, Info, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useStravaStore } from '../../store/stravaStore';
import { useCalendarStore } from '../../store/calendarStore';
import { useStrava } from '../../hooks/useStrava';
import { getStravaAuthUrl } from '../../lib/stravaApi';
import { format } from 'date-fns';

export function SettingsView() {
  const stravaStore = useStravaStore();
  const { toggleDarkMode, darkMode } = useCalendarStore();
  const { isConnected, isSyncing, syncError, lastSyncAt, sync } = useStrava();
  const [showSecret, setShowSecret] = useState(false);
  const [localClientId, setLocalClientId] = useState(stravaStore.clientId);
  const [localSecret, setLocalSecret] = useState(stravaStore.clientSecret);
  const [credsSaved, setCredsSaved] = useState(false);

  function handleSaveCreds() {
    stravaStore.setClientId(localClientId.trim());
    stravaStore.setClientSecret(localSecret.trim());
    setCredsSaved(true);
    setTimeout(() => setCredsSaved(false), 2000);
  }

  function handleConnect() {
    if (!stravaStore.clientId || !stravaStore.clientSecret) {
      alert('Please save your Strava Client ID and Client Secret first');
      return;
    }
    try {
      window.location.href = getStravaAuthUrl();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to build auth URL');
    }
  }

  function handleDisconnect() {
    if (confirm('Disconnect Strava? Your Strava-sourced actuals will be removed.')) {
      stravaStore.disconnect();
    }
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <h2 className="text-lg font-bold text-white">Settings</h2>

      {/* ─── Strava ──────────────────────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Strava Integration</h3>
        <div className="bg-slate-800 rounded-xl divide-y divide-slate-700">
          {/* Status */}
          <div className="px-4 py-3 flex items-center gap-3">
            <Activity className={`w-5 h-5 ${isConnected ? 'text-orange-400' : 'text-slate-500'}`} />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">
                {isConnected ? 'Connected to Strava' : 'Not connected'}
              </div>
              {lastSyncAt && (
                <div className="text-xs text-slate-400">
                  Last sync: {format(new Date(lastSyncAt), 'MMM d, h:mm a')}
                </div>
              )}
              {syncError && (
                <div className="text-xs text-red-400 mt-0.5">{syncError}</div>
              )}
            </div>
            {isConnected && (
              <button
                onClick={sync}
                disabled={isSyncing}
                className="p-2 rounded-lg bg-orange-500/20 text-orange-400 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>

          {/* Credentials input */}
          <div className="px-4 py-3 space-y-3">
            <div className="text-xs text-slate-400">
              Find your credentials at{' '}
              <a
                href="https://www.strava.com/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 underline"
              >
                strava.com/settings/api
              </a>
              . Stored only in this browser — never sent anywhere except Strava.
            </div>

            {/* Client ID */}
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block">Client ID</label>
              <input
                type="text"
                inputMode="numeric"
                value={localClientId}
                onChange={e => setLocalClientId(e.target.value)}
                placeholder="e.g. 12345"
                className="w-full bg-slate-700 text-white text-xs rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-orange-500 placeholder-slate-500"
              />
            </div>

            {/* Client Secret */}
            <div>
              <label className="text-[11px] text-slate-500 mb-1 block">Client Secret</label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={localSecret}
                  onChange={e => setLocalSecret(e.target.value)}
                  placeholder="Paste client secret…"
                  className="w-full bg-slate-700 text-white text-xs rounded-lg px-3 py-2.5 pr-10 outline-none focus:ring-1 focus:ring-orange-500 placeholder-slate-500"
                />
                <button
                  onClick={() => setShowSecret(s => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveCreds}
              className={`w-full py-2.5 rounded-lg text-xs font-medium transition-colors ${
                credsSaved ? 'bg-green-500 text-white' : 'bg-slate-600 text-slate-200 active:bg-slate-500'
              }`}
            >
              {credsSaved ? '✓ Saved to browser' : 'Save credentials'}
            </button>
          </div>

          {/* Connect / Disconnect */}
          <div className="px-4 py-3">
            {isConnected ? (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 text-red-400 text-sm"
              >
                <LogOut className="w-4 h-4" />
                Disconnect Strava
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm active:bg-orange-600"
              >
                <Link2 className="w-4 h-4" />
                Connect Strava
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Appearance ──────────────────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Appearance</h3>
        <div className="bg-slate-800 rounded-xl">
          <button
            onClick={toggleDarkMode}
            className="w-full px-4 py-3.5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
              <span className="text-sm text-white">{darkMode ? 'Dark mode' : 'Light mode'}</span>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors ${darkMode ? 'bg-orange-500' : 'bg-slate-600'}`}>
              <div className={`w-5 h-5 rounded-full bg-white m-0.5 transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>
        </div>
      </section>

      {/* ─── About ───────────────────────────────────────────────────── */}
      <section>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">About</h3>
        <div className="bg-slate-800 rounded-xl px-4 py-4 space-y-2">
          <div className="flex items-start gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-500" />
            <div>
              <div className="font-medium text-slate-300 mb-1">Tiger Claw 50K Training</div>
              <div>12-week plan · Tiger Mountain, Issaquah WA · May 9, 2026</div>
              <div className="mt-1">Strava sync compares actual vs planned and auto-adjusts future volume.</div>
              <div className="mt-2 text-slate-500">
                Swipe right on a workout → mark complete<br />
                Swipe left on a workout → reschedule options
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
