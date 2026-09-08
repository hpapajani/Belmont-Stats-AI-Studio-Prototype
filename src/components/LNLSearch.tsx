import React, { useState } from "react";
import { Search, Sparkles, User, AlertTriangle } from "lucide-react";

interface LNLSearchProps {
  onNavigateToPlayer: (id: string) => void;
  allPlayers: any[];
}

export default function LNLSearch({ onNavigateToPlayer, allPlayers }: LNLSearchProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any | null>(null);
  const [textResults, setTextResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchCount, setSearchCount] = useState<number>(() => {
    const currentVal = sessionStorage.getItem("belmont_search_count");
    return currentVal ? parseInt(currentVal, 10) : 0;
  });

  const getPlayerPhotoUrl = (url?: string) => {
    if (!url || url.trim() === "" || url.includes("placeholder") || url === "null") {
      return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";
    }
    return url;
  };

  const popularQueries = [
    "Who has the most rushing yards this season?",
    "Tell me about quarterback Danny Mara's stats",
    "Who is Sam O'Neill?",
    "Recent Belmont Football games scoreboard and records"
  ];

  const handleSearchSubmit = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const searchQuery = customQuery || query;
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setErrorMessage("");
    setAiResponse(null);
    setSearched(true);

    // Track list coordinates
    const newCount = searchCount + 1;
    setSearchCount(newCount);
    sessionStorage.setItem("belmont_search_count", newCount.toString());

    try {
      // 1. Fire Gemini stat search route
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.status === 429) {
        setErrorMessage("Rate limit exceeded (15 queries per min). Please try again in a few moments.");
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed search request");
      }

      const data = await response.json();
      setAiResponse(data);

      // 2. Perform traditional database text-match fallback filtering below
      const lowerQ = searchQuery.toLowerCase();
      const matched = allPlayers.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQ) ||
          p.position.toLowerCase().includes(lowerQ) ||
          p.jersey_number.includes(lowerQ)
      );
      setTextResults(matched);
    } catch (err) {
      console.error(err);
      setErrorMessage("AI search experienced technical issues. Showing standard text match filter instead.");
      
      // Traditional match fallback
      const lowerQ = searchQuery.toLowerCase();
      const matched = allPlayers.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQ) ||
          p.position.toLowerCase().includes(lowerQ)
      );
      setTextResults(matched);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="lnl-search-container" className="space-y-6">
      {searchCount > 15 && (
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-xl text-amber-800 text-xs flex gap-3 items-center shadow-sm animate-fade-in font-sans">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 animate-pulse" />
          <div>
            <span className="font-bold block">Activity limit checklist notification:</span>
            <span>You have completed {searchCount} database searches under this session! Our student statistics platform operates under free shared lightweight service tiers to maintain open visibility. Thank you for thoroughly analyzing Belmont Varsity stats!</span>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={(e) => handleSearchSubmit(e)} className="relative">
          <input
            id="search-query-input"
            type="text"
            className="w-full text-base md:text-lg pl-12 pr-28 py-4 bg-gray-50 border border-gray-200 focus:border-belmont-maroon focus:outline-none focus:ring-4 focus:ring-red-100 rounded-xl transition font-sans"
            placeholder="Ask anything... 'Who has the most rushing yards this season?'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          
          <button
            id="search-btn-trigger"
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-belmont-maroon text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-belmont-maroon-light transition duration-150 flex items-center gap-2"
            disabled={isLoading}
          >
            <Search size={14} className="text-white" />
            <span>Search</span>
          </button>
        </form>

        <div className="mt-4">
          <span className="text-xs text-gray-400 font-medium block mb-2 uppercase tracking-wider">Suggested queries:</span>
          <div className="flex flex-wrap gap-2">
            {popularQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(q);
                  handleSearchSubmit(undefined, q);
                }}
                className="text-xs font-semibold px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-belmont-navy rounded-full transition text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 border-4 border-belmont-maroon border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h4 className="font-bold text-gray-800 font-display text-lg tracking-wider uppercase">Querying Belmont Stats AI</h4>
            <p className="text-xs text-gray-500 max-w-sm mt-1">
              Analyzing Belmont Varsity roster context with Gemini. Generating response...
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex gap-3 items-center">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* RENDER AI ANSWER CARD ABOVE TRADITIONAL RESULTS */}
      {searched && !isLoading && aiResponse && (
        <div id="ai-answer-card" className="bg-gradient-to-br from-belmont-navy to-belmont-navy-light text-white rounded-2xl p-6 shadow-md border-b-4 border-belmont-maroon relative overflow-hidden">
          {/* Subtle branding seal */}
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
            <Sparkles size={180} />
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-belmont-maroon text-white font-bold text-xs ring-4 ring-red-900/40">
              <Sparkles size={14} className="text-amber-300 animate-pulse" />
            </div>
            <span className="text-xs font-bold font-mono text-amber-300 uppercase tracking-widest">
              Belmont Stats AI Answer
            </span>
          </div>

          {aiResponse.answer ? (
            <div className="space-y-4 relative z-10">
              <p className="text-base md:text-lg font-sans leading-relaxed text-gray-100">
                {aiResponse.answer}
              </p>

              {aiResponse.player_id && (
                <div className="pt-2">
                  <button
                    id={`search-ai-player-link-${aiResponse.player_id}`}
                    onClick={() => onNavigateToPlayer(aiResponse.player_id)}
                    className="inline-flex items-center gap-2 text-xs bg-white text-belmont-navy hover:bg-gray-100 px-4 py-2 rounded-lg font-bold transition shadow-sm uppercase tracking-wider"
                  >
                    <User size={14} className="text-belmont-maroon" />
                    <span>View Athlete Profile Page</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                We couldn't extract a highly confident answer from our local football records for this lookup.
              </p>
              <p className="text-xs text-gray-400">
                Please double-check your wording, or try browsing the general list below instead!
              </p>
            </div>
          )}
        </div>
      )}

      {/* TRADITIONAL DATABASE TEXT MATCH RESULTS SEARCH */}
      {searched && !isLoading && (
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-lg text-gray-800 uppercase tracking-wider">
            Matching Athlete Roster Profiles ({textResults.length})
          </h3>

          {textResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {textResults.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onNavigateToPlayer(p.id)}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md border border-gray-100 cursor-pointer transition flex items-center gap-4"
                >
                  <img
                    src={getPlayerPhotoUrl(p.photo_url)}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-belmont-navy shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-base text-belmont-navy">{p.name}</h4>
                    <p className="text-xs text-gray-500 font-mono">
                      Jersey #{p.jersey_number} • {p.position} • {p.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm text-center text-gray-500 text-xs">
              No direct text search hits matched that pattern inside the current player rosters. Feel free to search using other keywords.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
