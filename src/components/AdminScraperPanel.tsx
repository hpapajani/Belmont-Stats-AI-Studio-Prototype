import React, { useState, useEffect } from "react";
import { Play, Pause, AlertTriangle, Shield, Check, Trash2, Pencil, RefreshCcw, FileText, ChevronDown, ChevronRight, CheckCircle, Plus } from "lucide-react";

export function AdminScraperPanel({ authHeaders, dSports }: { authHeaders: any, dSports: any[] }) {
  const [configs, setConfigs] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [formConfig, setFormConfig] = useState<any>({ sport_id: "", platform: "maxpreps", scrape_type: "schedule", target_url: "", cron_schedule: "0 6 * * *" });

  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  const reloadData = async () => {
    try {
      const cRes = await fetch("/api/scraper/configs", { headers: authHeaders }).then(r => r.json());
      setConfigs(cRes);
      const sRes = await fetch("/api/scraper/status", { headers: authHeaders }).then(r => r.json());
      setStatus(sRes);
      const lRes = await fetch("/api/scraper/logs", { headers: authHeaders }).then(r => r.json());
      setLogs(lRes);
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    reloadData();
    const iv = setInterval(reloadData, 15000);
    return () => clearInterval(iv);
  }, []);

  const triggerRun = async (configId: string) => {
    await fetch(`/api/scraper/run/${configId}`, { method: "POST", headers: authHeaders });
    setTimeout(reloadData, 2000);
  };

  const triggerRunAll = async () => {
    const active = configs.filter((c) => c.is_active);
    if (active.length === 0) {
      alert("No active scraper configurations are enabled to run.");
      return;
    }
    if (!confirm(`Are you sure you want to trigger all ${active.length} active scrapers to run now?`)) return;
    await fetch("/api/scraper/run-all", { method: "POST", headers: authHeaders });
    setTimeout(reloadData, 2000);
  };

  const deleteConfig = async (configId: string) => {
    if(!confirm("Are you sure you want to delete this source?")) return;
    await fetch(`/api/scraper/configs/${configId}`, { method: "DELETE", headers: authHeaders });
    reloadData();
  };

  const toggleConfig = async (configId: string, isActive: boolean) => {
    await fetch(`/api/scraper/configs/${configId}`, { 
      method: "PATCH", 
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !isActive })
    });
    reloadData();
  };

  const saveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const m = formConfig.id ? "PATCH" : "POST";
    const u = formConfig.id ? `/api/scraper/configs/${formConfig.id}` : "/api/scraper/configs";
    await fetch(u, {
      method: m,
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(formConfig)
    });
    setShowConfigModal(false);
    reloadData();
  };

  const pendingAthletesLogs = logs.filter(l => l.raw_payload && l.raw_payload.pending_athletes && l.raw_payload.pending_athletes.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-belmont-navy">Scraper Configurations</h3>
          <p className="text-xs text-gray-500">Automate game schedules, scores, and roster syncing</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={triggerRunAll} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition">
            <Play size={14} /> Run All Scrapers
          </button>
          <button onClick={() => { setFormConfig({ sport_id: "", platform: "maxpreps", scrape_type: "schedule", target_url: "", cron_schedule: "0 6 * * *" }); setShowConfigModal(true); }} className="px-4 py-2 bg-belmont-navy text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-belmont-navy-light transition">
            <Plus size={14} /> Add Source
          </button>
        </div>
      </div>

      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={saveConfig} className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl text-left space-y-4">
            <h3 className="font-bold text-lg text-belmont-navy">{formConfig.id ? "Edit Source" : "Add New Source"}</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-gray-600 mb-1">Sport</label>
                <select className="w-full p-2 border rounded" value={formConfig.sport_id} onChange={e => setFormConfig({...formConfig, sport_id: e.target.value})} required>
                  <option value="">Select Sport</option>
                  {dSports.map(s => <option key={s.id} value={s.id}>{s.name} ({s.gender})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Platform</label>
                <select className="w-full p-2 border rounded" value={formConfig.platform} onChange={e => setFormConfig({...formConfig, platform: e.target.value})}>
                  <option value="maxpreps">MaxPreps</option>
                  <option value="milesplit">MileSplit</option>
                  <option value="athletic_net">Athletic.net</option>
                  <option value="miaa">MIAA GameDay</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Scrape Type</label>
                <select className="w-full p-2 border rounded" value={formConfig.scrape_type} onChange={e => setFormConfig({...formConfig, scrape_type: e.target.value})}>
                  <option value="schedule">Schedule & Scores</option>
                  <option value="roster">Roster</option>
                  <option value="meet_results">Meet Results</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Target URL</label>
                <input type="url" className="w-full p-2 border rounded" required value={formConfig.target_url} onChange={e => setFormConfig({...formConfig, target_url: e.target.value})} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-gray-600 mb-1">Cron Schedule</label>
                <select className="w-full p-2 border rounded" value={formConfig.cron_schedule} onChange={e => setFormConfig({...formConfig, cron_schedule: e.target.value})}>
                  <option value="0 6 * * *">Daily at 6am</option>
                  <option value="0 7 * * 1">Weekly Monday</option>
                  <option value="">Manual Only</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-4">
              <button type="button" onClick={() => setShowConfigModal(false)} className="px-4 py-2 border rounded text-xs font-bold text-gray-600">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-belmont-maroon text-white text-xs font-bold rounded">Save</button>
            </div>
          </form>
        </div>
      )}

      {/* Configurations Table */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-400 border-b">
              <th className="pb-2 font-normal">Sport</th>
              <th className="pb-2 font-normal">Platform</th>
              <th className="pb-2 font-normal">Type</th>
              <th className="pb-2 font-normal">Schedule</th>
              <th className="pb-2 font-normal">Status</th>
              <th className="pb-2 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {configs.length === 0 ? (
              <tr><td colSpan={6} className="py-4 text-center text-gray-400 italic">No configurations added.</td></tr>
            ) : configs.map((c) => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="py-3 font-semibold text-belmont-navy">{c.sport_name}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${c.platform === 'maxpreps' ? 'bg-blue-600' : c.platform === 'milesplit' ? 'bg-green-600' : c.platform === 'athletic_net' ? 'bg-teal-600' : 'bg-orange-500'}`}>{c.platform}</span>
                </td>
                <td className="py-3">{c.scrape_type}</td>
                <td className="py-3 text-gray-500">{c.cron_schedule ? "Scheduled" : "Manual"}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${!c.is_active ? 'bg-gray-100 text-gray-500' : c.last_run_status === 'failed' ? 'bg-red-100 text-red-700' : c.last_run_status === 'running' ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-green-100 text-green-700'}`}>
                    {!c.is_active ? "Paused" : (c.last_run_status || "Ready")}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex justify-end gap-2 text-gray-400">
                    {c.last_run_status !== "running" && <button onClick={() => triggerRun(c.id)} className="hover:text-belmont-maroon"><Play size={14} /></button>}
                    <button onClick={() => { setFormConfig(c); setShowConfigModal(true); }} className="hover:text-blue-600"><Pencil size={14} /></button>
                    <button onClick={() => toggleConfig(c.id, c.is_active)} className="hover:text-orange-500">{c.is_active ? <Pause size={14}/> : <Check size={14}/>}</button>
                    <button onClick={() => deleteConfig(c.id)} className="hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pendingAthletesLogs.length > 0 && (
        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
          <h3 className="font-bold text-amber-800 text-sm flex items-center gap-2 mb-3"><AlertTriangle size={16}/> Athletes Need Review from Sync</h3>
          <div className="space-y-3">
            {pendingAthletesLogs.map(l => l.raw_payload.pending_athletes.map((pa: any, idx: number) => (
               <div key={idx} className="bg-white p-3 rounded-lg border text-xs shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div>
                   <p className="font-bold">{pa.scraped_name}</p>
                   <p className="text-gray-500">{pa.event} - {pa.mark} ({pa.meet_name})</p>
                 </div>
                 <div className="flex gap-2">
                   {pa.candidates && pa.candidates.length > 0 && (
                     <button className="px-3 py-1 bg-belmont-navy text-white rounded text-[10px] whitespace-nowrap" onClick={async () => {
                       await fetch("/api/scraper/resolve-staging", {
                          method: "POST",
                          headers: { ...authHeaders, "Content-Type": "application/json" },
                          body: JSON.stringify({ log_id: l.id, scraped_name: pa.scraped_name, player_id: pa.candidates[0].id })
                       });
                       reloadData();
                     }}>
                       Link to {pa.candidates[0].name} ({(pa.candidates[0].confidence_score * 100).toFixed(0)}%)
                     </button>
                   )}
                   <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-[10px]" onClick={async () => {
                     await fetch("/api/scraper/resolve-staging", {
                        method: "POST",
                        headers: { ...authHeaders, "Content-Type": "application/json" },
                        body: JSON.stringify({ log_id: l.id, scraped_name: pa.scraped_name, reject: true })
                     });
                     reloadData();
                   }}>Ignore</button>
                 </div>
               </div>
            )))}
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-belmont-navy mb-4">Run History (Last 50)</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-400 border-b">
              <th className="pb-2 font-normal">Time</th>
              <th className="pb-2 font-normal">Config</th>
              <th className="pb-2 font-normal">Status</th>
              <th className="pb-2 font-normal text-right">In/Up/Skip</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-b last:border-0 hover:bg-slate-50 cursor-pointer" onClick={() => setExpandedLogs({...expandedLogs, [l.id]: !expandedLogs[l.id]})}>
                <td className="py-3 text-gray-500">{new Date(l.started_at).toLocaleString()}</td>
                <td className="py-3 font-semibold">{l.sport_name} ({l.platform})</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] ${l.status === 'failed' ? 'bg-red-100 text-red-700' : l.status === 'partial' ? 'bg-amber-100 text-amber-700' : l.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                    {l.status}
                  </span>
                </td>
                <td className="py-3 text-right font-mono text-gray-500">
                  <span className="text-green-600">+{l.rows_inserted}</span> / <span className="text-blue-600">^{l.rows_updated}</span> / <span>-{l.rows_skipped}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
