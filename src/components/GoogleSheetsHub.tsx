import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink,
  Users,
  Calendar,
  Layers,
  Copy,
  Plus
} from "lucide-react";

interface GoogleSheetsHubProps {
  allSports: any[];
  onSyncComplete: (message: string) => void;
  token?: string;
}

export default function GoogleSheetsHub({ 
  allSports, 
  onSyncComplete,
  token = ""
}: GoogleSheetsHubProps) {
  const [sheetUrl, setSheetUrl] = useState("");
  const [dataType, setDataType] = useState<"roster" | "schedule">("roster");
  const [selectedSportId, setSelectedSportId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [teams, setTeams] = useState<any[]>([]);
  const [isFetchingPrivate, setIsFetchingPrivate] = useState(false);
  const [privateAccessToken, setPrivateAccessToken] = useState("");
  const [googleClientInitialized, setGoogleClientInitialized] = useState(false);
  
  // Parsed spreadsheet status
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [columnMappings, setColumnMappings] = useState<{ [key: string]: string }>({});
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [copiedData, setCopiedData] = useState(false);

  // Fetch teams of selected sport dynamically
  useEffect(() => {
    if (!selectedSportId) {
      setTeams([]);
      return;
    }
    fetch(`/api/teams/${selectedSportId}`)
      .then(res => res.json())
      .then(data => setTeams(data || []))
      .catch(err => console.error("Failed to load sport team options", err));
  }, [selectedSportId]);

  // Filter teams list
  const filteredTeams = teams;

  // Extract Spreadsheet ID and optional gid from URL
  const parseGoogleSheetUrl = (url: string) => {
    try {
      const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) return null;
      
      const spreadsheetId = match[1];
      let gid = "0";
      const gidMatch = url.match(/[#&]gid=([0-9]+)/);
      if (gidMatch) {
        gid = gidMatch[1];
      }
      return { spreadsheetId, gid };
    } catch {
      return null;
    }
  };

  // Fetch from the Google spreadsheet
  const handleFetchSpreadsheet = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setParsedHeaders([]);
    setParsedRows([]);
    setColumnMappings({});
    setPreviewRows([]);

    if (!selectedSportId) {
      setErrorMsg("Please select a target varsity sport first.");
      return;
    }

    if (!sheetUrl) {
      setErrorMsg("Please provide a valid Google Sheet URL link.");
      return;
    }

    const parsed = parseGoogleSheetUrl(sheetUrl);
    if (!parsed) {
      setErrorMsg("Invalid link format. Please paste a standard Google Sheets web url.");
      return;
    }

    setIsProcessing(true);
    const { spreadsheetId, gid } = parsed;

    // Build immediate public CSV download URL as the default high-performance route
    const publicCsvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

    try {
      let csvText = "";

      // Option A: If we have an access token, query the official Sheets API for maximum power
      if (privateAccessToken) {
        const sheetsApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:Z200`;
        const res = await fetch(sheetsApiUrl, {
          headers: { Authorization: `Bearer ${privateAccessToken}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.values && data.values.length > 0) {
            // Convert json values matrix to CSV
            const headers = data.values[0];
            const rows = data.values.slice(1).map((row: any) => {
              const obj: any = {};
              headers.forEach((h: string, idx: number) => {
                obj[h] = row[idx] !== undefined ? row[idx].toString() : "";
              });
              return obj;
            });
            setParsedHeaders(headers);
            setParsedRows(rows);
            setPreviewRows(rows.slice(0, 5));
            initializeDefaultMappings(headers);
            setSuccessMsg(`Google Sheet connected successfully! Retrieved ${rows.length} rows.`);
            setIsProcessing(false);
            return;
          } else {
            throw new Error("No value ranges found inside the spreadsheet boundary.");
          }
        }
      }

      // Option B: Public shared spreadsheet fast-crawl fallback (reliable, needs no oauth setup)
      const proxyRes = await fetch(publicCsvUrl);
      if (!proxyRes.ok) {
        throw new Error(
          "Could not retrieve spreadsheet data. Ensure your sheet is shared with 'Anyone with the link can view' or configure the private access token."
        );
      }
      
      csvText = await proxyRes.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0 && results.data.length === 0) {
            setErrorMsg(`CSV parser failed: ${results.errors[0].message}`);
            setIsProcessing(false);
            return;
          }
          
          const headers = results.meta.fields || [];
          const rows = results.data;
          
          if (headers.length === 0) {
            setErrorMsg("No columnar headers found. Ensure your sheet has label titles on row 1.");
            setIsProcessing(false);
            return;
          }

          setParsedHeaders(headers);
          setParsedRows(rows);
          setPreviewRows(rows.slice(0, 5));
          initializeDefaultMappings(headers);
          setSuccessMsg(`Google Sheet connected as public CSV reader! Loaded ${rows.length} records.`);
          setIsProcessing(false);
        },
        error: (err) => {
          setErrorMsg(`Spreadsheet parse error: ${err.message}`);
          setIsProcessing(false);
        }
      });

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to make HTTP sync request with Google servers.");
      setIsProcessing(false);
    }
  };

  // Attempt to smartly match standard column labels
  const initializeDefaultMappings = (headers: string[]) => {
    const mappings: { [key: string]: string } = {};
    
    headers.forEach((h) => {
      const clean = h.toLowerCase().trim().replace(/_/g, " ").replace(/#/g, "");
      
      if (dataType === "roster") {
        if (clean.includes("name") || clean.includes("athlete") || clean.includes("player")) {
          mappings["name"] = h;
        } else if (clean.includes("jersey") || clean.includes("number") || clean.includes("num")) {
          mappings["jersey_number"] = h;
        } else if (clean.includes("position") || clean.includes("pos")) {
          mappings["position"] = h;
        } else if (clean.includes("year") || clean.includes("class") || clean.includes("gr")) {
          mappings["year"] = h;
        } else if (clean.includes("bio") || clean.includes("description") || clean.includes("about")) {
          mappings["bio"] = h;
        }
      } else {
        if (clean.includes("opponent") || clean.includes("versus") || clean.includes("vs") || clean.includes("away")) {
          mappings["opponent"] = h;
        } else if (clean.includes("date") || clean.includes("time") || clean.includes("scheduled")) {
          mappings["game_date"] = h;
        } else if (clean.includes("location") || clean.includes("venue") || clean.includes("field")) {
          mappings["location"] = h;
        } else if (clean.includes("score") || clean.includes("point") || clean.includes("runs")) {
          mappings["scores"] = h;
        }
      }
    });

    setColumnMappings(mappings);
  };

  // Trigger registration payload
  const handleImportReadyData = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedSportId) return;
    setIsProcessing(true);

    try {
      const targetTeamId = selectedTeamId || (filteredTeams.length > 0 ? filteredTeams[0].id : "");
      if (!targetTeamId && dataType === "roster") {
        throw new Error("A specific corporate team ID is required to map rosters.");
      }

      let successCount = 0;
      let skippedCount = 0;

      if (dataType === "roster") {
        const nameField = columnMappings["name"];
        if (!nameField) throw new Error("Please map the 'Athlete Name' field boundary.");

        // Sequentially create players
        for (const row of parsedRows) {
          const name = row[nameField];
          if (!name) {
            skippedCount++;
            continue;
          }

          const jersey = row[columnMappings["jersey_number"]] || "99";
          const position = row[columnMappings["position"]] || "ATH";
          const year = row[columnMappings["year"]] || "SR";
          const bio = row[columnMappings["bio"]] || "";

          const playerPayload = {
            name: name.toString().trim(),
            jersey_number: jersey.toString().trim(),
            position: position.toString().trim().toUpperCase().slice(0, 4),
            year: year.toString().trim().toUpperCase().slice(0, 2),
            team_id: targetTeamId,
            bio: bio.toString().trim(),
            alumni: false
          };

          const postRes = await fetch("/api/admin/players", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(playerPayload)
          });

          if (postRes.ok) {
            successCount++;
          } else {
            skippedCount++;
          }
        }

        onSyncComplete(`Successfully imported and Enrolled ${successCount} players from google sheets into roster database (${skippedCount} skipped).`);
        setSuccessMsg(`Successfully written ${successCount} athlete profiles directly into Varsity state!`);
      } else {
        // Schedule import
        const oppField = columnMappings["opponent"];
        const dateField = columnMappings["game_date"];
        if (!oppField || !dateField) {
          throw new Error("Please map both target 'Opponent/Match' and 'Game Date' fields.");
        }

        const activeSport = allSports.find(s => s.id === selectedSportId);
        const activeSeasonId = `season_${selectedSportId}`;

        for (const row of parsedRows) {
          const opponentName = row[oppField];
          const rawDate = row[dateField];
          if (!opponentName || !rawDate) {
            skippedCount++;
            continue;
          }

          const venue = row[columnMappings["location"]] || "Belmont Home Grounds";
          
          // Try to safely format date (YYYY-MM-DD)
          let dateStr = new Date(rawDate).toISOString().split("T")[0];
          if (dateStr === "NaN-NaN-NaN") {
            dateStr = new Date().toISOString().split("T")[0];
          }

          const gamePayload = {
            sport_id: selectedSportId,
            season_id: activeSeasonId,
            home_team_id: "belmont_varsity", // Standard Belmont home anchor
            away_team_id: "opponent_varsity", // Standard Opponent anchor
            game_date: dateStr,
            location: venue,
            home_or_away: "home" // default
          };

          const postRes = await fetch("/api/admin/games", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(gamePayload)
          });

          if (postRes.ok) {
            successCount++;
          } else {
            skippedCount++;
          }
        }

        onSyncComplete(`Successfully written ${successCount} high-school matches directly into active calendar records.`);
        setSuccessMsg(`Successfully synced scheduled matchups! ${successCount} games registered.`);
      }

      // Reset state on successful ingestion
      setParsedRows([]);
      setParsedHeaders([]);
      setColumnMappings({});
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to commit Google Sheet values to standard storage.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate tab-separated columns for the copy-paste action to Sheet
  const handleCopyRosterTemplate = () => {
    let output = "Name\tJersey#\tPosition\tYear\tBiography\n";
    
    // Seed templates based on selected sport
    if (selectedSportId === "s1" || selectedSportId === "s2" || selectedSportId === "s3" || selectedSportId === "s4") {
      output += "John Doe\t10\tPG\tSR\tVarsity Point Guard Belmont MA\n";
      output += "Alex Marauder\t22\tSG\tJR\tBelmont Varsity Shooting Guard\n";
    } else {
      output += "Ryan Wilde\tRun\t100m_Dash\tSO\tDual meet records specialist\n";
      output += "Maya Andrews\tField\tShot_Put\tSR\tShot put varsity throwing seed\n";
    }

    navigator.clipboard.writeText(output);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-150 p-6 space-y-6 text-xs shadow-sm">
      <div className="flex items-center gap-2.5 border-b pb-3.5">
        <div className="p-1.5 bg-green-50 text-green-700 rounded-lg">
          <FileSpreadsheet size={22} />
        </div>
        <div>
          <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-belmont-navy">
            Google Sheets Synchronizer & Importer
          </h3>
          <p className="text-[10px] text-gray-400">
            Map athletic Google Sheets directly into Belmont High varsity databases.
          </p>
        </div>
      </div>

      {/* OPTIONS CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sync Type Selection */}
        <div className="space-y-1 text-left">
          <label className="font-semibold text-gray-600 block">Data Import Target</label>
          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setDataType("roster")}
              className={`flex-1 py-2 text-center font-bold ${dataType === "roster" ? "bg-belmont-navy text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
            >
              <Users size={12} className="inline mr-1" /> Rosters
            </button>
            <button
              onClick={() => setDataType("schedule")}
              className={`flex-1 py-2 text-center font-bold ${dataType === "schedule" ? "bg-belmont-navy text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
            >
              <Calendar size={12} className="inline mr-1" /> Schedule
            </button>
          </div>
        </div>

        {/* Selected Sport Selection */}
        <div className="space-y-1 text-left">
          <label className="font-semibold text-gray-600 block">Varsity Sport</label>
          <select
            value={selectedSportId}
            onChange={(e) => {
              setSelectedSportId(e.target.value);
              setSelectedTeamId("");
            }}
            className="w-full p-2.5 bg-gray-50 border outline-none rounded-lg focus:border-belmont-maroon text-xs"
          >
            <option value="">-- Choose Sport --</option>
            {allSports.map((s) => {
              const name = s.name || "";
              const gender = s.gender || "";
              const isFBORBB = name.toLowerCase().includes("football") || name.toLowerCase().includes("baseball");
              let clean = name;
              if (isFBORBB) {
                clean = name.replace(/\b(Boys|Girls)\b/gi, "").trim();
                if (clean.toLowerCase().startsWith("boys ")) clean = clean.substring(5);
                else if (clean.toLowerCase().startsWith("girls ")) clean = clean.substring(6);
              } else if (gender && !name.toLowerCase().includes(gender.toLowerCase())) {
                clean = `${gender} ${name}`;
              }
              clean = clean.replace(/\s+/g, " ");
              return (
                <option key={s.id} value={s.id}>{clean}</option>
              );
            })}
          </select>
        </div>

        {/* Selected Team Selection (Only for roster) */}
        {dataType === "roster" && (
          <div className="space-y-1 text-left">
            <label className="font-semibold text-gray-600 block">Varsity Team Gender</label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border outline-none rounded-lg focus:border-belmont-maroon text-xs"
            >
              <option value="">-- Main Team / Select Standard --</option>
              {filteredTeams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* GOOGLE ACCESS SETTINGS */}
      <div className="p-4 bg-slate-50 rounded-xl border space-y-3">
        <span className="font-semibold text-belmont-navy block text-left">
          Workspace Secret Access Credentials (Optional Private Mapping)
        </span>
        <div className="flex gap-2 justify-between flex-col sm:flex-row items-stretch sm:items-center">
          <input
            type="password"
            value={privateAccessToken}
            onChange={(e) => setPrivateAccessToken(e.target.value)}
            className="flex-1 p-2 bg-white border border-gray-200 outline-none rounded text-xs font-mono"
            placeholder="Paste Google user OAuth AccessToken to bypass public constraints..."
          />
          <button 
            type="button" 
            onClick={() => setGoogleClientInitialized(!googleClientInitialized)}
            className="px-4 py-2 bg-white text-gray-600 rounded border hover:bg-gray-50 font-semibold"
          >
            {googleClientInitialized ? "🔓 Connected" : "🔑 Configure Private"}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-left">
          Note: If you leave this empty, simply share your Google sheet with 
          <strong> "Anyone with link can view"</strong> and paste the link below to fetch instantly! No setup needed.
        </p>
      </div>

      {/* URL INPUT & ATTACH */}
      <div className="space-y-1.5 text-left">
        <label className="font-semibold text-gray-600 block">Google Sheets Spreadsheet Link</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            className="flex-1 p-2.5 bg-gray-50 border outline-none rounded-lg focus:border-belmont-maroon text-xs"
            placeholder="e.g. https://docs.google.com/spreadsheets/d/1XyZ..._abC/edit#gid=0"
          />
          <button
            onClick={handleFetchSpreadsheet}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-belmont-maroon hover:bg-belmont-maroon-light text-white font-bold rounded-lg transition shrink-0 flex items-center gap-1.5 shadow-md"
          >
            {isProcessing ? (
              <RefreshCw className="animate-spin" size={13} />
            ) : (
              <Upload size={13} />
            )}
            <span>Connect Sheet</span>
          </button>
        </div>
      </div>

      {/* LOG MESSAGES */}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-left flex gap-2 items-center leading-relaxed">
          <AlertTriangle size={14} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-left flex gap-2 items-center leading-relaxed">
          <Check size={14} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* COLUMN SECTOR MAPPER GRID */}
      {parsedHeaders.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-xl border text-left space-y-4 animate-fade-in">
          <span className="font-semibold text-belmont-navy block">
            Map Spreadsheet Columns to Varsity State Attributes
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {dataType === "roster" ? (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Athlete Name *</label>
                  <select
                    value={columnMappings["name"] || ""}
                    onChange={(e) => setColumnMappings(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-1.5 bg-white border border-gray-200 rounded"
                  >
                    <option value="">-- Select Column --</option>
                    {parsedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Jersey Number</label>
                  <select
                    value={columnMappings["jersey_number"] || ""}
                    onChange={(e) => setColumnMappings(prev => ({ ...prev, jersey_number: e.target.value }))}
                    className="w-full p-1.5 bg-white border border-gray-200 rounded"
                  >
                    <option value="">-- Select Column --</option>
                    {parsedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Position Profile</label>
                  <select
                    value={columnMappings["position"] || ""}
                    onChange={(e) => setColumnMappings(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full p-1.5 bg-white border border-gray-200 rounded"
                  >
                    <option value="">-- Select Column --</option>
                    {parsedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Class Year (SR, JR...)</label>
                  <select
                    value={columnMappings["year"] || ""}
                    onChange={(e) => setColumnMappings(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full p-1.5 bg-white border border-gray-200 rounded"
                  >
                    <option value="">-- Select Column --</option>
                    {parsedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="space-y-1 select-none">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Paragraph Biography</label>
                  <select
                    value={columnMappings["bio"] || ""}
                    onChange={(e) => setColumnMappings(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full p-1.5 bg-white border border-gray-200 rounded"
                  >
                    <option value="">-- Select Column (Optional) --</option>
                    {parsedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Opponent Team *</label>
                  <select
                    value={columnMappings["opponent"] || ""}
                    onChange={(e) => setColumnMappings(prev => ({ ...prev, opponent: e.target.value }))}
                    className="w-full p-1.5 bg-white border border-gray-200 rounded"
                  >
                    <option value="">-- Select Column --</option>
                    {parsedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Calendar Date *</label>
                  <select
                    value={columnMappings["game_date"] || ""}
                    onChange={(e) => setColumnMappings(prev => ({ ...prev, game_date: e.target.value }))}
                    className="w-full p-1.5 bg-white border border-gray-200 rounded"
                  >
                    <option value="">-- Select Column --</option>
                    {parsedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500">Stadium Location</label>
                  <select
                    value={columnMappings["location"] || ""}
                    onChange={(e) => setColumnMappings(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-1.5 bg-white border border-gray-200 rounded"
                  >
                    <option value="">-- Select Column --</option>
                    {parsedHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>

          {/* TABLE PREVIEW */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-gray-450">Data Preview Matrix</span>
            <div className="table-scroll border rounded overflow-hidden bg-white max-h-40">
              <table className="w-full min-w-max border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    {parsedHeaders.map((h) => (
                      <th key={h} className="p-2 border-r text-left truncate max-w-[120px] font-semibold text-gray-600">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-slate-50 text-gray-500">
                      {parsedHeaders.map((h) => (
                        <td key={h} className="p-2 border-r text-left max-w-[150px] truncate">
                          {row[h]?.toString() || <span className="text-gray-300 italic">null</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={handleImportReadyData}
            disabled={isProcessing}
            className="w-full py-2.5 bg-belmont-navy hover:bg-belmont-navy-light text-white font-bold rounded-lg text-xs uppercase flex items-center justify-center gap-1.5 transition shadow"
          >
            {isProcessing ? (
              <RefreshCw className="animate-spin" size={13} />
            ) : (
              <Plus size={13} />
            )}
            <span>Commit Sheets To Application Core Storage</span>
          </button>
        </div>
      )}

      {/* SHEETS BACKUP EXPORTER TEMPLATES */}
      <div className="border-t pt-5 text-left space-y-4">
        <div>
          <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-belmont-navy">
            Google Sheets Template Backups
          </h4>
          <p className="text-[10px] text-gray-400">
            Export standard structured templates to easily paste correct headers directly into your new Google Sheet!
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopyRosterTemplate}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center gap-1.5 transition"
          >
            {copiedData ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
            <span>{copiedData ? "Copied Header Template!" : "Copy Roster Columns"}</span>
          </button>

          <button
            onClick={() => {
              let csvStr = "Opponent\tGameDate\tLocation\tHomeScore\tAwayScore\n";
              csvStr += "Lexington High\t2026-06-04\tHarris Field\t0\t0\n";
              csvStr += "Winchester High\t2026-06-11\tAway Field\t0\t0\n";
              navigator.clipboard.writeText(csvStr);
              alert("Matches schedule column headers copied to clipboard! Paste directly into Google Sheets.");
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center gap-1.5 transition"
          >
            <Copy size={12} />
            <span>Copy Schedule Columns</span>
          </button>
        </div>
      </div>
    </div>
  );
}
