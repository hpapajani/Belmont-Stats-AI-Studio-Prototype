import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { Upload, ChevronRight, CheckSquare, FileSpreadsheet, AlertCircle, Play, Sparkles } from "lucide-react";

interface CsvMapperProps {
  gameId: string;
  sportId: string;
  allPlayers: any[];
  onUploadSuccess: (msg: string) => void;
  onUploadError: (msg: string) => void;
}

export default function CsvMapper({
  gameId,
  sportId,
  allPlayers,
  onUploadSuccess,
  onUploadError,
}: CsvMapperProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [columnMappings, setColumnMappings] = useState<{ [key: string]: string }>({});
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mappedStatsResult, setMappedStatsResult] = useState<any[] | null>(null);

  // Target database keys for Varsity Football stats
  const targetStatsKeys = [
    { key: "athlete_name", label: "Athlete Name * (Required)", required: true },
    
    // Passing
    { key: "passing_completions", label: "Passing Completions", category: "Passing" },
    { key: "passing_attempts", label: "Passing Attempts", category: "Passing" },
    { key: "passing_yards", label: "Passing Yards", category: "Passing" },
    { key: "passing_touchdowns", label: "Passing Touchdowns", category: "Passing" },
    { key: "passing_interceptions", label: "Passing Interceptions", category: "Passing" },
    { key: "passing_longest", label: "Passing Longest Pass", category: "Passing" },

    // Rushing
    { key: "rushing_carries", label: "Rushing Carries", category: "Rushing" },
    { key: "rushing_yards", label: "Rushing Yards", category: "Rushing" },
    { key: "rushing_touchdowns", label: "Rushing Touchdowns", category: "Rushing" },
    { key: "rushing_longest", label: "Rushing Longest Run", category: "Rushing" },
    { key: "rushing_fumbles", label: "Rushing Fumbles", category: "Rushing" },

    // Receiving
    { key: "receiving_receptions", label: "Receiving Receptions", category: "Receiving" },
    { key: "receiving_targets", label: "Receiving Targets", category: "Receiving" },
    { key: "receiving_yards", label: "Receiving Yards", category: "Receiving" },
    { key: "receiving_touchdowns", label: "Receiving Touchdowns", category: "Receiving" },

    // Defense
    { key: "defense_tackles", label: "Defensive Tackles (Total)", category: "Defense" },
    { key: "defense_sacks", label: "Defensive Sacks", category: "Defense" },
    { key: "defense_interceptions", label: "Defensive Interceptions", category: "Defense" },
    { key: "defense_fumble_recoveries", label: "Defensive Fumble Recoveries", category: "Defense" },

    // Special Teams
    { key: "special_fg_made", label: "FG Made", category: "Special Teams" },
    { key: "special_fg_attempts", label: "FG Attempts", category: "Special Teams" },
    { key: "special_xp_made", label: "Extra Points Made", category: "Special Teams" },
    { key: "special_xp_attempts", label: "Extra Points Attempted", category: "Special Teams" },
    { key: "special_punting_attempts", label: "Punting Attempts", category: "Special Teams" },
    { key: "special_punting_average", label: "Punting Average", category: "Special Teams" },
    { key: "special_punting_longest", label: "Punting Longest", category: "Special Teams" },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      onUploadError("File type unsupported. Roster statistics upload must be a valid '.csv' format.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      onUploadError("File too large. Maximum CSV upload sizing limit is 10MB.");
      return;
    }

    setCsvFile(file);

    // Parse the system via Papa Parse
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const headers = Object.keys(results.data[0]);
          setParsedHeaders(headers);
          setParsedRows(results.data);
          setPreviewRows(results.data.slice(0, 5));

          // Auto map common columns
          const initialMap: any = {};
          headers.forEach((h) => {
            const cleanHeader = h.toLowerCase().trim().replace(/[\s_-]+/g, "_");
            
            // Look for athlete name matches
            if (["name", "athlete", "player", "player_name", "athlete_name"].includes(cleanHeader)) {
              initialMap["athlete_name"] = h;
            }

            // Look for passing yards
            if (["passing_yards", "pass_yd", "passing_yd", "py", "pass_yards"].includes(cleanHeader)) {
              initialMap["passing_yards"] = h;
            }

            // Look for rushes
            if (["rushing_yards", "rush_yd", "rushing_yd", "ry", "rushing_yards", "carries", "rush_attempts"].includes(cleanHeader)) {
              initialMap["rushing_yards"] = h;
            }
          });

          setColumnMappings(initialMap);
          onUploadSuccess(`Successfully loaded ${results.data.length} statistics rows from ${file.name}. Review mappings now.`);
        } else {
          onUploadError("CSV parsing produced empty sheets. Please verify content formatting.");
        }
      },
      error: (err) => {
        onUploadError("Failed to parse CSV: " + err.message);
      }
    });
  };

  const updateMappingHandler = (targetKey: string, csvHeader: string) => {
    setColumnMappings((prev) => ({
      ...prev,
      [targetKey]: csvHeader
    }));
  };

  // Convert raw mapped columns into formatted sports JSON list
  const runVerificationMapping = () => {
    const nameColumn = columnMappings["athlete_name"];
    if (!nameColumn) {
      onUploadError("Athlete Name mapping is absolute mandatory. Select corresponding CSV column.");
      return;
    }

    const compiledImports: any[] = [];
    const unmatchedNames: string[] = [];

    parsedRows.forEach((row, rowIndex) => {
      const csvName = String(row[nameColumn] || "").trim();
      if (!csvName) return;

      // Fuzzy name matches inside roster records
      const matchedPlayer = allPlayers.find(
        (p) => p.name.toLowerCase().replace(/[\s-]/g, "") === csvName.toLowerCase().replace(/[\s-]/g, "")
      );

      if (!matchedPlayer) {
        unmatchedNames.push(csvName);
        return;
      }

      // Map statistics
      const statsObj: any = {};
      targetStatsKeys.forEach((tsk) => {
        if (tsk.key === "athlete_name") return;
        const csvCol = columnMappings[tsk.key];
        if (csvCol && row[csvCol] !== undefined) {
          const val = Number(row[csvCol]);
          if (!isNaN(val)) {
            statsObj[tsk.key] = val;
          }
        }
      });

      compiledImports.push({
        player_id: matchedPlayer.id,
        player_name: matchedPlayer.name,
        stats: statsObj
      });
    });

    if (unmatchedNames.length > 0) {
      const uniqueNames = Array.from(new Set(unmatchedNames));
      onUploadSuccess(`Fuzzy mapping done. Note: ${uniqueNames.length} athlete names in the CSV did not match this varsity team's roster (e.g. ${uniqueNames.slice(0, 3).join(", ")}) and will be skipped.`);
    }

    setMappedStatsResult(compiledImports);
  };

  const handleImportSubmit = async () => {
    if (!mappedStatsResult || mappedStatsResult.length === 0) return;

    setIsProcessing(true);
    try {
      const res = await fetch("/api/admin/csv-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("belmont_stats_token")}`
        },
        body: JSON.stringify({
          gameId,
          sportId,
          playerStats: mappedStatsResult,
          teamStats: [
            // Precalculate team stats aggregates
            {
              team_id: "a2cb10b-58cc-4372-a567-0e02b2c3d481", // Belmont
              stats: {
                total_offensive_yards: mappedStatsResult.reduce((sum, p) => sum + (p.stats.passing_yards || 0) + (p.stats.rushing_yards || 0), 0),
                passing_yards: mappedStatsResult.reduce((sum, p) => sum + (p.stats.passing_yards || 0), 0),
                rushing_yards: mappedStatsResult.reduce((sum, p) => sum + (p.stats.rushing_yards || 0), 0),
                turnovers: mappedStatsResult.reduce((sum, p) => sum + (p.stats.rushing_fumbles || 0) + (p.stats.passing_interceptions || 0), 0),
                points_scored: mappedStatsResult.reduce((sum, p) => sum + ((p.stats.passing_touchdowns || 0)*6) + ((p.stats.rushing_touchdowns || 0)*6) + ((p.stats.receiving_touchdowns || 0)*6) + ((p.stats.special_xp_made || 0)*1) + ((p.stats.special_fg_made || 0)*3), 0)
              }
            }
          ]
        })
      });

      if (!res.ok) {
        throw new Error("Admin stats uploading route failed");
      }

      onUploadSuccess(`Success! Stats imported for ${mappedStatsResult.length} roster athletes. Standings tables & leaderboard cash refreshed!`);
      // Clear states
      setCsvFile(null);
      setMappedStatsResult(null);
    } catch (err: any) {
      console.error(err);
      onUploadError("Stats delivery failed: Check connections or auth credentials.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* DRAG AND DROP MANUAL INPUT COMPLIANCE AT LAST */}
      {!csvFile ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 hover:border-belmont-maroon bg-gray-50 hover:bg-red-50/10 rounded-2xl p-10 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3"
        >
          <Upload size={36} className="text-gray-400 animate-bounce" />
          <h3 className="font-bold text-gray-700 text-sm md:text-base">Drag & Drop Varsity Footage CSV</h3>
          <p className="text-xs text-gray-500 max-w-sm">
            Upload CSV stats files exported by your external AI tracking tools. Max size 10MB.
          </p>
          <span className="px-3 py-1.5 bg-belmont-navy text-white font-semibold rounded-lg text-xs leading-none">
            Browse File
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-6 animate-fade-in">
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="text-green-600 shrink-0" size={20} />
              <div>
                <span className="font-semibold text-gray-800 font-mono text-xs">{csvFile.name}</span>
                <span className="text-[10px] text-gray-400 block">Sized: {(csvFile.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>
            <button
              onClick={() => {
                setCsvFile(null);
                setMappedStatsResult(null);
              }}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Reset
            </button>
          </div>

          {/* COLUMN MAPPING CONTROL BOARD */}
          <div className="space-y-3">
            <h4 className="font-display font-semibold uppercase text-xs tracking-wider text-gray-600">
              Step 1: Match CSV Columns to Statistics Keys
            </h4>
            <p className="text-xs text-gray-400">
              Matches custom column names in your camera/analysis export into standard Belmont Varsity parameters:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              {targetStatsKeys.map((tsk) => {
                const mappedVal = columnMappings[tsk.key] || "";
                return (
                  <div key={tsk.key} className="flex justify-between items-center gap-2">
                    <span className={`text-xs font-medium shrink-0 ${tsk.required ? "text-belmont-maroon font-bold" : "text-gray-600"}`}>
                      {tsk.label}
                    </span>
                    <select
                      value={mappedVal}
                      onChange={(e) => updateMappingHandler(tsk.key, e.target.value)}
                      className="text-xs border border-gray-200 bg-white p-1.5 rounded focus:border-belmont-maroon focus:outline-none w-1/2"
                    >
                      <option value="">-- Ignored / Empty --</option>
                      {parsedHeaders.map((head, hi) => (
                        <option key={hi} value={head}>
                          {head}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mapped Row Previews */}
          <div className="space-y-2">
            <h4 className="font-display font-semibold uppercase text-xs tracking-wider text-gray-600 flex items-center gap-2">
              Step 2: Dry Run Parsing Preview (First 5 Rows)
            </h4>

            <div className="border border-gray-100 rounded-lg overflow-x-auto text-[11px] font-mono">
              <table className="w-full text-left separator-y bg-gray-50">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    {parsedHeaders.map((h, hi) => (
                      <th key={hi} className="p-2 border-r border-gray-200">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {previewRows.map((row, ri) => (
                    <tr key={ri} className="border-b border-gray-100">
                      {parsedHeaders.map((h, hi) => (
                        <td key={hi} className="p-2 border-r border-gray-200 text-gray-600 max-w-[150px] truncate">
                          {row[h]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 flex justify-between gap-4">
            <button
              onClick={runVerificationMapping}
              className="flex-1 py-2.5 bg-belmont-navy hover:bg-belmont-navy-light text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Play size={14} />
              Verify & Resolve Team Roster Hits
            </button>

            {mappedStatsResult && (
              <button
                onClick={handleImportSubmit}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-belmont-maroon hover:bg-belmont-maroon-light text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition animate-pulse"
              >
                <Sparkles size={14} className="text-amber-300" />
                {isProcessing ? "Processing Standings..." : `Confirm Import Roster (${mappedStatsResult.length} Mapped Athlete Entries)`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
