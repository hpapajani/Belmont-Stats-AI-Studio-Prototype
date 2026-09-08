import React, { useState, useRef } from "react";
import { Upload, Sparkles, Check, AlertCircle, Calendar } from "lucide-react";

interface AiSchedulerUploadProps {
  allSports: any[];
  token: string;
  onSuccess: (msg: string) => void;
}

export default function AiSchedulerUpload({ allSports, token, onSuccess }: AiSchedulerUploadProps) {
  const [selectedSportId, setSelectedSportId] = useState("");
  const [csvText, setCsvText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState("");
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize selectedSportId if allSports loads
  React.useEffect(() => {
    if (allSports.length > 0 && !selectedSportId) {
      // Find First sport or s2/s3 for Basketball
      const defaultSport = allSports.find(s => s.id === "s2") || allSports[0];
      setSelectedSportId(defaultSport.id);
    }
  }, [allSports, selectedSportId]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvText(text || "");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) {
      setErrorMessage("Please upload a schedule CSV report or paste the schedule text.");
      return;
    }
    if (!selectedSportId) {
      setErrorMessage("Please select a target sport category.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessInfo("");
    setStatusMessage("Opening secure connection to Gemini Flash. Parsing CSV metadata...");

    const steps = [
      "Analyzing CSV file structure and table coordinates...",
      "Filtering out team practices, physical training sessions, and scrimmages...",
      "Extracting official dates, times, and opponent schools...",
      "Matching existing athletic team entries or auto-creating records for opponents...",
      "Generating official scheduled sport matchups inside Belmont database..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setStatusMessage(steps[currentStep]);
        currentStep++;
      }
    }, 1500);

    try {
      const response = await fetch("/api/admin/ai-schedule-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          csvText,
          sportId: selectedSportId
        })
      });

      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "AI parsing pipeline experienced an error.");
      }

      const resData = await response.json();
      setSuccessInfo(resData.message);
      setCsvText("");
      onSuccess(resData.message);
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setErrorMessage(err.message || "An error occurred while uploading schedule.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-scheduler-panel" className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div>
        <h3 className="font-display font-bold text-base uppercase tracking-wider text-belmont-navy flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500 animate-pulse" />
          AI Multi-Sport Game Scheduler Importer
        </h3>
        <p className="text-[10px] text-gray-400 mt-1 leading-normal">
          Provide your seasonal team schedule sheet (games, practices, meetings). Our integrated athletic Gemini engine filters training and imports official games with complete dates and times automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-semibold mb-1 uppercase tracking-wider">
              1. Select Varsity Sport
            </label>
            <select
              value={selectedSportId}
              onChange={(e) => setSelectedSportId(e.target.value)}
              className="w-full text-xs p-2.5 bg-gray-50 border rounded-xl focus:border-belmont-maroon focus:outline-none"
              disabled={isLoading}
            >
              {allSports.map((s) => (
                <option key={s.id} value={s.id}>
                  {(() => {
                    const name = s.name || "";
                    const gender = s.gender || "";
                    const isFBORBB = name.toLowerCase().includes("football") || name.toLowerCase().includes("baseball");
                    if (isFBORBB) {
                      let clean = name.replace(/\b(Boys|Girls)\b/gi, "").trim();
                      if (clean.toLowerCase().startsWith("boys ")) clean = clean.substring(5);
                      else if (clean.toLowerCase().startsWith("girls ")) clean = clean.substring(6);
                      return clean.replace(/\s+/g, " ");
                    }
                    if (gender && !name.toLowerCase().startsWith(gender.toLowerCase())) {
                      return `${gender} ${name}`;
                    }
                    return name;
                  })()} ({s.season_type} Season)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1 uppercase tracking-wider">
              2. Load Schedule Worksheet File
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={triggerFileInput}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-belmont-navy font-bold rounded-xl transition flex items-center gap-1.5"
                disabled={isLoading}
              >
                <Upload size={14} />
                <span>Select File (CSV / TXT)</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 min-h-[120px] ${
            dragActive ? "border-belmont-maroon bg-red-50/20" : "border-gray-200 bg-gray-50 hover:bg-gray-100/50"
          }`}
        >
          <Calendar size={24} className="text-gray-400" />
          <div>
            <p className="font-semibold text-gray-600">Drag & drop your CSV or TXT here</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Or click to select file from explorer</p>
          </div>
        </div>

        <div>
          <label className="block text-gray-600 font-semibold mb-1 uppercase tracking-wider">
            3. Preview or Paste Schedule Content Raw
          </label>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-[10px] focus:outline-none focus:border-belmont-maroon focus:ring-1 focus:ring-belmont-maroon-light transition"
            placeholder="Date,Activity,Opponent,Location,Time&#10;2025/11/02,Practice,Practice - Varsity Field,Harris Field,15:30&#10;2025/11/05,Game,Arlington High School,Belmont High Gym,19:00"
            disabled={isLoading}
          />
        </div>

        {isLoading && (
          <div className="p-4 bg-slate-50 border border-gray-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2.5 text-belmont-navy font-bold">
              <div className="w-4 h-4 border-2 border-belmont-maroon border-t-transparent rounded-full animate-spin"></div>
              <span className="uppercase tracking-wider">Uploading schedule via Gemini AI...</span>
            </div>
            <p className="text-[10px] text-gray-500 font-mono animate-pulse">{statusMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 flex gap-2 items-center">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successInfo && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 flex gap-2 items-center font-semibold">
            <Check size={14} className="shrink-0" />
            <span>{successInfo}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-belmont-maroon hover:bg-belmont-maroon-light text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          disabled={isLoading || !csvText.trim()}
        >
          <Sparkles size={14} className="text-amber-300 animate-pulse" />
          <span>Parse and Schedule Season Games with AI</span>
        </button>
      </form>
    </div>
  );
}
