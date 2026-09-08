import React, { useState } from "react";
import { Shield, Sparkles, User, UserCheck, Users } from "lucide-react";

interface DevModeSwitcherProps {
  currentRole: string;
  currentUserEmail: string | null;
  onSwitchSession: (email: string, role: string, token: string, playerId?: string | null) => void;
  onLogout: () => void;
}

export default function DevModeSwitcher({
  currentRole,
  currentUserEmail,
  onSwitchSession,
  onLogout,
}: DevModeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      name: "1. Public Guest",
      role: "public",
      email: null,
      desc: "No login. View public sports, schedules, leaderboards, records. Download CSV files.",
      icon: Users,
      color: "bg-gray-100 text-gray-700 border-gray-200"
    },
    {
      name: "2. Registered Parent/User",
      role: "public",
      email: "parent@belmont.edu",
      token: "tok_parent_session",
      desc: "Logged in. Customize favorites, submit corrections, claim profiles, receive alerts.",
      icon: User,
      color: "bg-blue-50 text-blue-800 border-blue-200"
    },
    {
      name: "3. Claimed Athlete (QB Danny Mara)",
      role: "public",
      email: "danny.mara@belmontstats.com",
      token: "tok_danny_session",
      playerId: "p1",
      desc: "Approved profile claim. Modify personal bio, highlight photos, view private trackers.",
      icon: UserCheck,
      color: "bg-amber-50 text-amber-800 border-amber-200"
    },
    {
      name: "4. Stats Editor",
      role: "editor",
      email: "editor@belmontstats.com",
      token: "tok_editor_session",
      desc: "Varsity stats club officer. Import game CSV footage, edit rosters, schedule games.",
      icon: Sparkles,
      color: "bg-purple-50 text-purple-800 border-purple-200"
    },
    {
      name: "5. Super Admin / Owner",
      role: "owner",
      email: "belmontdataclub@gmail.com",
      token: "tok_owner_session",
      desc: "Superintendent of stats. Authorize claims, resolve corrections, tweak scrapers, full metrics.",
      icon: Shield,
      color: "bg-red-50 text-red-800 border-red-200"
    }
  ];

  const handleRoleSelect = async (r: typeof roles[number]) => {
    if (!r.email) {
      onLogout();
      setIsOpen(false);
      return;
    }

    // Auto-create/register session on server, or fall back to preseeded sessions
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: r.email,
          password: "password",
          role: r.role
        })
      });
      const data = await response.json();
      if (response.ok || data.error?.includes("already registered")) {
        // Log in if already registered
        const logRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: r.email, password: "password" })
        });
        const logData = await logRes.json();
        if (logRes.ok) {
          onSwitchSession(logData.user.email, logData.user.role, logData.token, r.playerId || null);
        }
      } else {
        // Fallback custom session injection
        onSwitchSession(r.email, r.role, r.token || "mock_tok", r.playerId || null);
      }
    } catch {
      onSwitchSession(r.email, r.role, r.token || "mock_tok", r.playerId || null);
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        id="dev-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-belmont-navy hover:bg-belmont-navy-light text-white font-medium rounded-full shadow-2xl transition duration-150 border-2 border-white focus:outline-none focus:ring-4 focus:ring-belmont-maroon"
      >
        <Shield size={18} className="animate-pulse text-amber-400" />
        <span className="text-xs tracking-wider uppercase font-semibold">Dev Role Switcher</span>
      </button>

      {isOpen && (
        <div
          id="dev-switcher-panel"
          className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-3xl border border-gray-100 overflow-hidden text-sm slide-in-bottom animate-fade-in"
        >
          <div className="bg-gradient-to-r from-belmont-navy to-belmont-navy-light text-white p-4">
            <h3 className="font-bold font-display uppercase tracking-wider text-base flex items-center gap-2">
              <Shield size={18} className="text-amber-400" />
              Dev & Grading Sandbox
            </h3>
            <p className="text-xs text-blue-200 mt-1">
              Belmont Stats has 5 distinct user tier workflows. Instantly switch here to test any capability:
            </p>
          </div>

          <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center text-xs">
            <span>
              Active: <span className="font-bold text-belmont-navy">{currentUserEmail || "Anonymous Guest"}</span>
            </span>
            <span className="px-2 py-0.5 bg-belmont-maroon text-white font-semibold rounded-full uppercase text-[10px]">
              {currentRole.toUpperCase()}
            </span>
          </div>

          <div className="max-h-[350px] overflow-y-auto p-2 space-y-2">
            {roles.map((r, i) => {
              const Icon = r.icon;
              const isActive = (r.email === currentUserEmail) || (!r.email && !currentUserEmail);

              return (
                <button
                  key={i}
                  id={`dev-role-select-${r.role}-${i}`}
                  onClick={() => handleRoleSelect(r)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex gap-3 items-start ${
                    isActive
                      ? "border-belmont-maroon bg-red-50/40 ring-1 ring-belmont-maroon"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isActive ? "bg-belmont-maroon text-white" : "bg-gray-100 text-gray-500"}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-xs flex justify-between items-center">
                      {r.name}
                      {isActive && <span className="text-[10px] text-belmont-maroon font-bold flex items-center gap-1">● Active</span>}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-gray-100 text-[11px] text-gray-400 bg-gray-50 text-center">
            Standard sandbox password for all roles is <code className="bg-gray-100 px-1 text-red-600 font-bold rounded">password</code>
          </div>
        </div>
      )}
    </div>
  );
}
