import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Calendar,
  CheckSquare,
  ChevronRight,
  ClipboardList,
  Clock,
  Download,
  Edit,
  Eye,
  Heart,
  HelpCircle,
  History,
  Lock,
  LogOut,
  Mail,
  MapPin,
  PlayCircle,
  Plus,
  RefreshCcw,
  Search as SearchIcon,
  Send,
  Share2,
  Shield,
  Sparkles,
  Trophy,
  Flame,
  Dribbble,
  Waves,
  Timer,
  Activity,
  Upload,
  User,
  UserCheck,
  UserPlus,
  Tv,
  Camera,
  Layers,
  BarChart,
  UserX,
  BookOpen
} from "lucide-react";

import Logo from "./components/Logo";
import DevModeSwitcher from "./components/DevModeSwitcher";
import LNLSearch from "./components/LNLSearch";
import CsvMapper from "./components/CsvMapper";
import AiSchedulerUpload from "./components/AiSchedulerUpload";
import GoogleSheetsHub from "./components/GoogleSheetsHub";
import { AdminScraperPanel } from "./components/AdminScraperPanel";

const getPlayerPhotoUrl = (url?: string) => {
  if (!url || url.trim() === "" || url.includes("placeholder") || url === "null" || url.includes("unsplash.com/photo-1535713875002-d1d0cf377fde")) {
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" fill="%23E2E8F0"/><circle cx="50" cy="38" r="18" fill="%2364748B"/><path d="M50 62c-15 0-25 10-25 22h50c0-12-10-22-25-22z" fill="%2364748B"/></svg>`;
  }
  return url;
};

const getCleanSportDisplay = (s: { name: string; gender?: string }) => {
  if (!s) return "";
  let name = s.name || "";
  let gender = s.gender || "";

  const lowerName = name.toLowerCase();
  const isFootballOrBaseball = lowerName.includes("football") || lowerName.includes("baseball");
  
  if (isFootballOrBaseball) {
    let clean = name;
    if (clean.toLowerCase().startsWith("boys ")) {
      clean = clean.substring(5);
    } else if (clean.toLowerCase().startsWith("girls ")) {
      clean = clean.substring(6);
    }
    clean = clean.replace(/\b(Boys|Girls)\b/gi, "").trim();
    return clean.replace(/\s+/g, " ");
  }

  if (gender) {
    const startsWithGender = name.toLowerCase().startsWith(gender.toLowerCase());
    if (startsWithGender) {
      return name;
    } else {
      return `${gender} ${name}`;
    }
  }

  return name;
};

const getSportIcon = (sportName: string, gender?: string, justIcon: boolean = false) => {
  const name = sportName.toLowerCase();
  const isBoys = gender === "Boys";
  const iconColorClass = isBoys 
    ? "text-blue-500 bg-blue-50 dark:bg-blue-950/45 dark:text-blue-400" 
    : "text-pink-500 bg-pink-50 dark:bg-pink-950/45 dark:text-pink-400";
  const containerClass = `p-2 rounded-xl ${iconColorClass} shrink-0 flex items-center justify-center`;

  let IconComp = Trophy;
  if (name.includes("football")) {
    IconComp = Trophy;
  } else if (name.includes("basketball")) {
    IconComp = Dribbble;
  } else if (name.includes("swim")) {
    IconComp = Waves;
  } else if (name.includes("track")) {
    IconComp = Activity;
  } else if (name.includes("baseball")) {
    IconComp = Flame;
  }

  if (justIcon) {
    const iconColorOnly = isBoys ? "text-blue-400" : "text-pink-400";
    return <IconComp className={`w-8 h-8 ${iconColorOnly}`} />;
  }

  return (
    <div className={containerClass}>
      <IconComp className="w-5 h-5 md:w-6 md:h-6" />
    </div>
  );
};

export default function App() {
  // Navigation / Router States
  const [currentView, setCurrentView] = useState<string>("home");

  // Dark mode theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("belmont_dark_mode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("belmont_dark_mode", darkMode.toString());
  }, [darkMode]);

  // Auto-rotating Slideshow state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slideshowImages = [
    { url: "/assets/sports_photos/Football/IMG_0489.jpg", sport: "Varsity Football", action: "Matchup Field Play 1" },
    { url: "/assets/sports_photos/Football/IMG_0492.jpg", sport: "Varsity Football", action: "Matchup Field Play 2" },
    { url: "/assets/sports_photos/Football/IMG_0530.jpg", sport: "Varsity Football", action: "Matchup Field Play 3" },
    { url: "/assets/sports_photos/Football/IMG_0546.jpg", sport: "Varsity Football", action: "Matchup Field Play 4" },
    { url: "/assets/sports_photos/Basketball/Boys_Basketball/IMG_8589.jpg", sport: "Boys Basketball", action: "Basketball Offense 1" },
    { url: "/assets/sports_photos/Basketball/Boys_Basketball/IMG_8610.jpg", sport: "Boys Basketball", action: "Basketball Offense 2" },
    { url: "/assets/sports_photos/Basketball/Boys_Basketball/IMG_8629.jpg", sport: "Boys Basketball", action: "Basketball Offense 3" },
    { url: "/assets/sports_photos/Basketball/Girls_Basketball/IMG_0290.jpg", sport: "Girls Basketball", action: "Basketball Game Play 1" },
    { url: "/assets/sports_photos/Basketball/Girls_Basketball/IMG_0303.jpg", sport: "Girls Basketball", action: "Basketball Game Play 2" },
    { url: "/assets/sports_photos/Track/Boys_Track/1Z2A4011-Enhanced-NR.jpg", sport: "Boys Track", action: "Running Hurdle Play" },
    { url: "/assets/sports_photos/Track/Boys_Track/1Z2A4030-Enhanced-NR.jpg", sport: "Boys Track", action: "Running Track Play" },
    { url: "/assets/sports_photos/Track/Boys_Track/1Z2A4206-Enhanced-NR.jpg", sport: "Boys Track", action: "Running Finish Dash" },
    { url: "/assets/sports_photos/Track/Girls_Track/1Z2A4006.jpg", sport: "Girls Track", action: "Track Relay Run" },
    { url: "/assets/sports_photos/Baseball/IMG_4084.jpg", sport: "Baseball", action: "Baseball Swing" },
    { url: "/assets/sports_photos/Baseball/IMG_4109.jpg", sport: "Baseball", action: "Baseball Pitch" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
  
  // Sport selectors for Leaderboard and Records
  const [leaderboardSportId, setLeaderboardSportId] = useState<string>("f47ac10b-58cc-4372-a567-0e02b2c3d479");
  const [recordsSportId, setRecordsSportId] = useState<string>("f47ac10b-58cc-4372-a567-0e02b2c3d479");
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("a2cb10b-58cc-4372-a567-0e02b2c3d481"); // Belmont High by default
  const [selectedSportId, setSelectedSportId] = useState<string>("f47ac10b-58cc-4372-a567-0e02b2c3d479"); // Football by default

  // Auth / session states
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string; token: string } | null>(null);
  const [claimedPlayerId, setClaimedPlayerId] = useState<string | null>(null);

  // Core Data Tables Fetch storage
  const [allSports, setAllSports] = useState<any[]>([]);
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [allGames, setAllGames] = useState<any[]>([]);
  const [allLeaderboards, setAllLeaderboards] = useState<any>({});
  const [allRecords, setAllRecords] = useState<any[]>([]);
  const [userFavorites, setUserFavorites] = useState<any[]>([]);
  const [userNotifications, setUserNotifications] = useState<any[]>([]);

  // Detailed page details payload
  const [activePlayerDetail, setActivePlayerDetail] = useState<any | null>(null);
  const [activeGameDetail, setActiveGameDetail] = useState<any | null>(null);
  const [activeTeamDetail, setActiveTeamDetail] = useState<any | null>(null);

  // Admin and Submissions Form states
  const [registerForm, setRegisterForm] = useState({ email: "", password: "", role: "public" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");

  const [correctionForm, setCorrectionForm] = useState({
    stat_key: "",
    current_value: 0,
    suggested_value: 0,
    reason: ""
  });
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

  const [newPlayerForm, setNewPlayerForm] = useState({
    name: "",
    jersey_number: "",
    position: "QB",
    year: "SR",
    bio: "",
    photo_url: "",
    is_alumni: "false"
  });

  const [newGameForm, setNewGameForm] = useState({
    home_team_id: "a2cb10b-58cc-4372-a567-0e02b2c3d481", // Belmont
    away_team_id: "",
    game_date: "",
    location: "Harris Field, Belmont",
    home_or_away: "Home"
  });

  const [editBioText, setEditBioText] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);

  // Admin lists reviewed payloads
  const [pendingClaims, setPendingClaims] = useState<any[]>([]);
  const [pendingCorrections, setPendingCorrections] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [scrapingConfig, setScrapingConfig] = useState<any | null>(null);
  const [scrapingLogMsg, setScrapingLogMsg] = useState("");
  const [gameCsvSuccessAlert, setGameCsvSuccessAlert] = useState("");
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);

  // Notification UI visual flags
  const [activeNotificationsCount, setActiveNotificationsCount] = useState(0);

  // Share alert feedback
  const [copiedAlert, setCopiedAlert] = useState(false);

  // Setup initial triggers and loads
  useEffect(() => {
    // Attempt local load parameters
    const cacheToken = localStorage.getItem("belmont_stats_token");
    const cacheEmail = localStorage.getItem("belmont_stats_email");
    const cacheRole = localStorage.getItem("belmont_stats_role");
    const cachePlayerId = localStorage.getItem("belmont_stats_claimed_player_id");

    if (cacheToken && cacheEmail && cacheRole) {
      setCurrentUser({ email: cacheEmail, role: cacheRole, token: cacheToken });
      if (cachePlayerId) {
        setClaimedPlayerId(cachePlayerId);
      }
    }

    refreshCorePublicData();
  }, []);

  // Sync session states when auth token is active
  useEffect(() => {
    if (currentUser) {
      fetchUserSpecificDetails();
    } else {
      setUserFavorites([]);
      setUserNotifications([]);
      setActiveNotificationsCount(0);
    }
  }, [currentUser]);

  // Page tracking triggers
  useEffect(() => {
    if (currentView === "player_detail" && selectedPlayerId) {
      logPageViewToServer("player", selectedPlayerId);
    } else if (currentView === "game_detail" && selectedGameId) {
      logPageViewToServer("game", selectedGameId);
    }
  }, [currentView, selectedPlayerId, selectedGameId]);

  // Load leaderboards dynamically based on selected sport
  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const pLeaders = await fetch(`/api/leaderboards?sportId=${leaderboardSportId}`).then(r => r.json());
        setAllLeaderboards(pLeaders || {});
      } catch (err) {
        console.error("Failed to fetch leaders", err);
      }
    };
    fetchLeaders();
  }, [leaderboardSportId]);

  // Load records dynamically based on selected sport
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const pRecords = await fetch(`/api/records?sportId=${recordsSportId}`).then(r => r.json());
        setAllRecords(pRecords || []);
      } catch (err) {
        console.error("Failed to fetch records", err);
      }
    };
    fetchRecs();
  }, [recordsSportId]);

  const refreshCorePublicData = async () => {
    try {
      const pSports = await fetch("/api/sports").then(r => r.json());
      setAllSports(pSports);

      const pPlayers = await fetch("/api/players/raw").then(async (r) => {
        // Mock fallback if route isn't listed or parsed incorrectly
        if (r.ok && r.headers.get("content-type")?.includes("application/json")) return r.json();
        const d = await fetch("/api/teams/details/a2cb10b-58cc-4372-a567-0e02b2c3d481").then(res => res.headers.get("content-type")?.includes("application/json") ? res.json() : { roster: [] });
        return d.roster || [];
      }).catch(() => [
        { id: "p1", name: "Danny Mara", jersey_number: "12", position: "QB", year: "SR", photo_url: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200", bio: "Danny is a senior quarterback leading the Belmont Marauders with varsity spirit.", is_claimed: true, is_alumni: false },
        { id: "p1_bball", name: "Marcus Durant", jersey_number: "3", position: "G", year: "SR", photo_url: "https://images.unsplash.com/photo-1544602629-a19313ee0272?auto=format&fit=crop&q=80&w=200", bio: "James is a junior center dominating the paint with active blocking and double-digit rebounds.", is_claimed: false, is_alumni: false }
      ]);
      setAllPlayers(pPlayers);

      const pGames = await fetch("/api/games")
        .then(r => r.json())
        .catch(() => []);
      setAllGames(pGames || []);

      const pLeaders = await fetch(`/api/leaderboards?sportId=${leaderboardSportId}`).then(r => r.json());
      setAllLeaderboards(pLeaders || {});

      const pRecords = await fetch(`/api/records?sportId=${recordsSportId}`).then(r => r.json());
      setAllRecords(pRecords || []);
    } catch (err) {
      console.error("Failed to sync core Belmont Stats charts", err);
    }
  };

  const fetchUserSpecificDetails = async () => {
    if (!currentUser) return;
    const authHeaders = { Authorization: `Bearer ${currentUser.token}` };

    try {
      const favorites = await fetch("/api/favorites", { headers: authHeaders }).then(r => r.json());
      setUserFavorites(Array.isArray(favorites) ? favorites : []);

      const notifications = await fetch("/api/notifications", { headers: authHeaders }).then(r => r.json());
      const notificationsArray = Array.isArray(notifications) ? notifications : [];
      setUserNotifications(notificationsArray);
      setActiveNotificationsCount(notificationsArray.filter((n: any) => !n.is_read).length);

      // If Owner / Admin level, fetch reviews folders
      if (currentUser.role === "owner" || currentUser.role === "editor") {
        fetchAdminAdministrativeDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminAdministrativeDetails = async () => {
    const authHeaders = { Authorization: `Bearer ${currentUser?.token}` };
    try {
      if (currentUser?.role === "owner") {
        const claims = await fetch("/api/admin/claims", { headers: authHeaders }).then(r => r.json());
        setPendingClaims(claims || []);

        const corrections = await fetch("/api/admin/corrections", { headers: authHeaders }).then(r => r.json());
        setPendingCorrections(corrections || []);

        const users = await fetch("/api/admin/users", { headers: authHeaders }).then(r => r.json());
        setAdminUsers(users || []);

        const config = await fetch("/api/admin/scraping/config", { headers: authHeaders }).then(r => r.json());
        setScrapingConfig(config || null);
      }

      const analytics = await fetch("/api/admin/analytics", { headers: authHeaders }).then(r => r.json());
      setAnalyticsData(analytics || null);
    } catch (err) {
      console.error(err);
    }
  };

  const logPageViewToServer = async (pageType: string, entityId: string) => {
    try {
      await fetch("/api/page-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_type: pageType, entity_id: entityId })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlayerDetailNavigation = async (playerId: string) => {
    setSelectedPlayerId(playerId);
    setCurrentView("player_detail");
    try {
      const detail = await fetch(`/api/players/${playerId}`).then(r => r.json());
      setActivePlayerDetail(detail);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGameDetailNavigation = async (gameId: string) => {
    setSelectedGameId(gameId);
    setCurrentView("game_detail");
    try {
      const detail = await fetch(`/api/games/${gameId}`).then(r => r.json());
      setActiveGameDetail(detail);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwitchSession = (email: string, role: string, token: string, claimedPid?: string | null) => {
    const safeUser = { email, role, token };
    setCurrentUser(safeUser);
    setClaimedPlayerId(claimedPid || null);

    localStorage.setItem("belmont_stats_token", token);
    localStorage.setItem("belmont_stats_email", email);
    localStorage.setItem("belmont_stats_role", role);
    if (claimedPid) {
      localStorage.setItem("belmont_stats_claimed_player_id", claimedPid);
    } else {
      localStorage.removeItem("belmont_stats_claimed_player_id");
    }

    refreshCorePublicData();
  };

  const handleLogout = () => {
    if (currentUser) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
    }
    setCurrentUser(null);
    setClaimedPlayerId(null);
    localStorage.removeItem("belmont_stats_token");
    localStorage.removeItem("belmont_stats_email");
    localStorage.removeItem("belmont_stats_role");
    localStorage.removeItem("belmont_stats_claimed_player_id");
  };

  const toggleFavoriteAthlete = async (pId: string) => {
    if (!currentUser) {
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ entity_type: "player", entity_id: pId })
      });
      if (res.ok) {
        fetchUserSpecificDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkIsFavorited = (pId: string): boolean => {
    return userFavorites.some(f => f.entity_id === pId && f.entity_type === "player");
  };

  // Auth processing
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = authMode === "login" ? loginForm : registerForm;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Authentication failed.");
        return;
      }

      handleSwitchSession(data.user.email, data.user.role, data.token);
      setShowAuthModal(false);
      // Clear forms
      setLoginForm({ email: "", password: "" });
      setRegisterForm({ email: "", password: "", role: "public" });
    } catch (err) {
      setAuthError("Failed to connect to school server.");
    }
  };

  const handleNotificationRead = async (nid: string) => {
    try {
      await fetch("/api/notifications/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({ notificationId: nid })
      });
      fetchUserSpecificDetails();
    } catch (err) {
      console.error(err);
    }
  };

  // Athlete claim submissions
  const handleAthleteClaimRequest = async (pId: string) => {
    if (!currentUser) {
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }
    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ playerId: pId })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Profile claim request failed.");
        return;
      }
      alert("A profile claim request has been posted successfully. Belmont stats club owners will review and approve posthaste.");
      refreshCorePublicData();
    } catch (err) {
      alert("Verification connection failed.");
    }
  };

  // Correction handling
  const handleCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const res = await fetch("/api/corrections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          playerId: selectedPlayerId,
          gameId: activePlayerDetail?.gameLogs[0]?.game_id || "g1_belmont_arlington", // default fallback
          statKey: correctionForm.stat_key,
          currentValue: correctionForm.current_value,
          suggestedValue: correctionForm.suggested_value,
          reason: correctionForm.reason
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Correction request failed.");
        return;
      }

      alert("Stat correction submitted successfully! Supervisors will match your suggestion with official tapes.");
      setShowCorrectionForm(false);
      setCorrectionForm({ stat_key: "", current_value: 0, suggested_value: 0, reason: "" });
    } catch (err) {
      alert("Failed connection to statistics system.");
    }
  };

  // Claim approval/rejections (Super Admin)
  const resolvePlayerClaim = async (claimId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/claims/${claimId}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAdminAdministrativeDetails();
        refreshCorePublicData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Correction approval/rejections
  const resolveStatCorrection = async (corrId: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/corrections/${corrId}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAdminAdministrativeDetails();
        refreshCorePublicData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save modified claimed bio
  const savePersonalBioText = async () => {
    try {
      const res = await fetch("/api/player/bio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({ bio: editBioText, photoUrl: editPhotoUrl })
      });
      if (res.ok) {
        setIsEditingBio(false);
        if (selectedPlayerId) {
          handlePlayerDetailNavigation(selectedPlayerId);
        }
        alert("Personal profile bio successfully updated!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin and Editor Forms submissions
  const handleAddNewPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({
          name: newPlayerForm.name,
          jersey_number: newPlayerForm.jersey_number,
          position: newPlayerForm.position,
          year: newPlayerForm.year,
          team_id: "a2cb10b-58cc-4372-a567-0e02b2c3d481", // Belmont
          bio: newPlayerForm.bio,
          photo_url: newPlayerForm.photo_url || "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200",
          alumni: newPlayerForm.is_alumni === "true"
        })
      });

      if (res.ok) {
        alert("New player successfully rostered!");
        setNewPlayerForm({ name: "", jersey_number: "", position: "QB", year: "SR", bio: "", photo_url: "", is_alumni: "false" });
        refreshCorePublicData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNewGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({
          sport_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479", // Football
          season_id: "d73bc10b-58cc-4372-a567-0e02b2c3d480", // 2025
          home_team_id: newGameForm.home_team_id,
          away_team_id: newGameForm.away_team_id,
          game_date: newGameForm.game_date,
          location: newGameForm.location,
          home_or_away: newGameForm.home_or_away
        })
      });

      if (res.ok) {
        alert("Varsity match scheduled successfully!");
        setNewGameForm({ home_team_id: "a2cb10b-58cc-4372-a567-0e02b2c3d481", away_team_id: "", game_date: "", location: "Harris Field, Belmont", home_or_away: "Home" });
        refreshCorePublicData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const triggerMileSplitScraper = async () => {
    try {
      const res = await fetch("/api/admin/scraping/trigger", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser?.token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setScrapingLogMsg(data.summary);
        fetchAdminAdministrativeDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const changeUserRoleSuperOwner = async (uid: string, targetRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${uid}/role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({ role: targetRole })
      });
      if (res.ok) {
        alert("User role successfully escalated!");
        fetchAdminAdministrativeDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareAppCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 2000);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none antialiased transition-colors duration-300 ${
      darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
    }`}>
      {/* HEADER NAV */}
      <header className="sticky top-0 z-50 bg-belmont-navy text-white shadow-xl border-b-2 border-belmont-maroon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center gap-4">
          <div onClick={() => setCurrentView("home")} className="cursor-pointer flex justify-center">
            <Logo size={46} showText={true} />
          </div>

          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10 pt-3">
            <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs font-display uppercase tracking-widest font-semibold">
              <button
                onClick={() => setCurrentView("home")}
                className={`hover:text-belmont-maroon-light transition py-1 ${currentView === "home" ? "border-b-2 border-belmont-maroon text-belmont-maroon-light" : "text-gray-300"}`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView("sports_hub")}
                className={`hover:text-belmont-maroon-light transition py-1 ${currentView === "sports_hub" || currentView === "team_detail" ? "border-b-2 border-belmont-maroon text-belmont-maroon-light" : "text-gray-300"}`}
              >
                Sports Hub
              </button>
              <button
                onClick={() => setCurrentView("leaderboards")}
                className={`hover:text-belmont-maroon-light transition py-1 ${currentView === "leaderboards" ? "border-b-2 border-belmont-maroon text-belmont-maroon-light" : "text-gray-300"}`}
              >
                Leaderboards
              </button>
              <button
                onClick={() => setCurrentView("records")}
                className={`hover:text-belmont-maroon-light transition py-1 ${currentView === "records" ? "border-b-2 border-belmont-maroon text-belmont-maroon-light" : "text-gray-300"}`}
              >
                Records
              </button>
              <button
                onClick={() => setCurrentView("about")}
                className={`hover:text-belmont-maroon-light transition py-1 ${currentView === "about" ? "border-b-2 border-belmont-maroon text-belmont-maroon-light" : "text-gray-305"}`}
              >
                About
              </button>
              <button
                onClick={() => setCurrentView("search")}
                className={`hover:text-belmont-maroon-light transition py-1 flex items-center justify-center ${currentView === "search" ? "border-b-2 border-belmont-maroon text-belmont-maroon-light" : "text-gray-305"}`}
                title="Search"
              >
                <SearchIcon size={16} />
              </button>
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              {/* Elegant Theme Toggle Switcher */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition shadow-md border border-white/20 flex items-center justify-center cursor-pointer"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? (
                  <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                  </svg>
                )}
              </button>

              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView("dashboard")}
                    className="px-3.5 py-1.5 bg-belmont-maroon text-white font-semibold text-xs rounded-lg hover:bg-belmont-maroon-light transition shadow-md flex items-center gap-2"
                  >
                    <User size={14} />
                    <span>Dashboard</span>
                    {activeNotificationsCount > 0 && (
                      <span className="w-4 h-4 bg-amber-400 text-belmont-navy rounded-full text-[9px] font-bold flex items-center justify-center">
                        {activeNotificationsCount}
                      </span>
                    )}
                  </button>

                  {(currentUser?.role === "owner" || currentUser?.role === "editor") && (
                    <button
                      onClick={() => setCurrentView("admin")}
                      className="px-3.5 py-1.5 bg-white text-belmont-navy font-bold text-xs rounded-lg hover:bg-gray-100 transition shadow-md flex items-center gap-1.5 border border-gray-200"
                    >
                      <Shield size={14} className="text-belmont-maroon" />
                      <span>Admin</span>
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-1.5 text-gray-450 hover:text-white transition rounded-lg hover:bg-white/5"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 bg-white text-belmont-navy font-bold text-xs rounded-lg hover:bg-gray-100 transition shadow-md border"
                >
                  Accredit Account
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {copiedAlert && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-2 rounded-xl shadow-lg z-50 animate-fade-in font-semibold">
          App URL Link copied to clipboard! Share on social streams.
        </div>
      )}

      {/* RENDER DYNAMIC PAGES */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* HOME VIEW */}
          {currentView === "home" && (
            <div className="space-y-12">
              {/* TOP GLOBAL SEARCH BOX */}
              <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <LNLSearch
                  onNavigateToPlayer={handlePlayerDetailNavigation}
                  allPlayers={allPlayers}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="lg:col-span-7 space-y-5">
                  <h1 className="athletic-title font-bold text-3xl md:text-5xl text-belmont-navy leading-none">
                    Unveiling Belmont High <br />
                    <span className="text-belmont-maroon font-extrabold text-belmont-maroon-light">Varsity Athletics</span> Standings
                  </h1>
                  <p className="text-sm md:text-base text-gray-500 leading-relaxed font-sans mt-2">
                    Belmont Stats provides secure, certified statistical aggregation and AI performance insights for and by the varsity athletics student club. Read official rosters, schedule books, play analysis, and find historic records.
                  </p>

                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={() => setCurrentView("sports_hub")}
                      className="px-6 py-3 bg-belmont-navy hover:bg-belmont-navy-light text-white font-semibold rounded-xl text-xs uppercase tracking-widest transition shadow-lg flex items-center gap-2"
                    >
                      <Logo size={16} showText={false} className="text-white shrink-0" />
                      <span>Browse Sports</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 flex justify-center w-full">
                  <div className="relative w-full max-w-sm h-64 md:h-80 rounded-2xl overflow-hidden border-2 border-belmont-maroon shadow-xl group bg-slate-950">
                    {/* Cross-fading sliding track images */}
                    {slideshowImages.map((slide, idx) => (
                      <img 
                        key={idx}
                        src={slide.url} 
                        alt={slide.action} 
                        referrerPolicy="no-referrer"
                        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1000ms] ease-in-out transform ${
                          currentSlideIndex === idx 
                            ? "opacity-100 scale-100 pointer-events-auto z-10" 
                            : "opacity-0 scale-95 pointer-events-none z-0"
                        } group-hover:scale-105`} 
                      />
                    ))}
                    
                    {/* Elegant floating indicator dots (fully styled, no labels) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/50 px-3 py-1.5 rounded-full z-20 backdrop-blur-xs">
                      {slideshowImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlideIndex(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 pointer-events-auto cursor-pointer ${
                            currentSlideIndex === idx ? "bg-amber-300 w-3.5" : "bg-white/40 hover:bg-white/70"
                          }`}
                          title={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SCHEDULE / EVENTS BANNER */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/40 p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <h3 className="font-display font-semibold text-base uppercase tracking-wider text-belmont-navy flex items-center gap-2">
                    <Calendar size={16} className="text-belmont-maroon" />
                    Fall Football Schedule & Game logs
                  </h3>

                  <div className="space-y-3">
                    {allGames.slice(0, 3).map((g) => {
                      const isHome = g.home_team_id === "a2cb10b-58cc-4372-a567-0e02b2c3d481" || g.home_team_id.startsWith("team_belmont_");
                      const oppName = g.opponent_name || (isHome ? "Arlington Spy Ponders" : "Winchester Sachems");
                      const hasScore = g.home_score !== null && g.away_score !== null;
                      
                      const outcome = hasScore 
                        ? (g.home_score === g.away_score ? "T" : (isHome ? (g.home_score > g.away_score ? "W" : "L") : (g.away_score > g.home_score ? "W" : "L")))
                        : "-";

                      return (
                        <div
                          key={g.id}
                          onClick={() => handleGameDetailNavigation(g.id)}
                          className="p-3.5 bg-white hover:bg-slate-50 border border-gray-100 rounded-xl cursor-pointer transition flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              outcome === "W" ? "bg-green-100 text-green-800" :
                              outcome === "L" ? "bg-red-100 text-red-800" :
                              outcome === "T" ? "bg-slate-100 text-slate-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              {outcome === "-" ? "S" : outcome}
                            </span>
                            <div>
                              <span className="font-semibold text-sm text-belmont-navy block">
                                {isHome ? `vs ${oppName}` : `@ ${oppName}`}
                              </span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">{g.game_date} • {g.location}</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0 ml-4">
                            <span className={`font-display font-bold block ${hasScore ? "text-base text-gray-800" : "text-[11px] text-gray-400 font-sans"}`}>
                              {hasScore ? `${g.home_score} - ${g.away_score}` : "Score not recorded"}
                            </span>
                            <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-mono">
                              {hasScore ? "Box Score" : "Upcoming"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* HIGHLIGHT ROSTER ATHLETES */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="font-display font-semibold text-base uppercase tracking-wider text-belmont-navy flex items-center gap-2">
                    <Trophy size={16} className="text-amber-500 animate-pulse" />
                    Varsity Player Leaders
                  </h3>

                  <div className="space-y-3">
                    {allPlayers.slice(0, 4).map((p) => {
                      const isAlumni = p.is_alumni;
                      return (
                        <div
                          key={p.id}
                          onClick={() => handlePlayerDetailNavigation(p.id)}
                          className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition border border-transparent hover:border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <img src={getPlayerPhotoUrl(p.photo_url)} alt={p.name} className="w-10 h-10 rounded-full object-cover border-2 border-belmont-navy" />
                            <div>
                              <span className="font-bold text-xs text-belmont-navy block">{p.name}</span>
                              <span className="text-[10px] text-gray-400">
                                #{p.jersey_number} • {p.position} • {p.is_alumni ? "Alumni" : p.year === "SR" ? "Class of 2026" : p.year === "JR" ? "Class of 2027" : p.year === "SO" ? "Class of 2028" : p.year === "FR" ? "Class of 2029" : `Class of ${p.year}`}
                              </span>
                            </div>
                          </div>
                          
                          {isAlumni && (
                            <span className="px-2 py-0.5 bg-slate-100 border text-slate-800 font-mono text-[9px] uppercase font-bold rounded-full">
                              Alumni
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SPORTS HUB VIEW */}
          {currentView === "sports_hub" && (
            <div className="space-y-6">
              <div>
                <h2 className="athletic-title font-bold text-2xl text-belmont-navy tracking-wider">
                  Belmont Varsity Sports
                </h2>
                <p className="text-xs text-gray-400">
                  Select a registered sport to view team rosters, live action analytics, calendars, and box games.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allSports.map((s) => {
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        const targetTeamId = s.id === "f47ac10b-58cc-4372-a567-0e02b2c3d479" 
                          ? "a2cb10b-58cc-4372-a567-0e02b2c3d481" 
                          : `team_belmont_${s.id}`;
                        setSelectedTeamId(targetTeamId);
                        setSelectedSportId(s.id);
                        setCurrentView("team_detail");
                      }}
                      className={`bg-white rounded-2xl p-6 shadow-sm border cursor-pointer hover:shadow-md transition text-left relative overflow-hidden group ${
                        s.is_active ? "border-belmont-maroon hover:border-belmont-maroon-light" : "border-gray-200"
                      }`}
                    >
                      <div className="absolute top-4 right-4 text-gray-300 group-hover:text-belmont-maroon font-bold font-mono text-xl">
                        {s.gender === "Boys" ? "M" : "W"}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[9px] uppercase font-bold rounded">
                            {s.season_type}
                          </span>
                          <div className="flex items-center gap-2.5 mt-2">
                            {getSportIcon(s.name, s.gender)}
                            <h3 className="font-display font-bold text-lg text-belmont-navy group-hover:text-belmont-maroon uppercase tracking-wide">
                              {getCleanSportDisplay(s)}
                            </h3>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">
                            {s.is_active ? "Active Season" : "Offseason"}
                          </span>
                          <span className="text-belmont-maroon hover:underline font-bold text-xs flex items-center gap-1">
                            View Roster &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TEAM DETAIL VIEW */}
          {currentView === "team_detail" && (() => {
            const currentSport = allSports.find(s => s.id === selectedSportId) || allSports[0] || { name: "Football", season_type: "Fall", gender: "Boys" };
            const targetTeamId = selectedSportId === "f47ac10b-58cc-4372-a567-0e02b2c3d479" 
              ? "a2cb10b-58cc-4372-a567-0e02b2c3d481" 
              : `team_belmont_${selectedSportId}`;
            const rosterPlayers = allPlayers.filter(p => p.team_id === targetTeamId);
            const sportGames = allGames.filter(g => g.sport_id === selectedSportId);

            let wins = 0;
            let losses = 0;
            let ties = 0;
            sportGames.forEach(g => {
              if (g.home_score !== null && g.away_score !== null) {
                const isHomeTeam = g.home_team_id === "a2cb10b-58cc-4372-a567-0e02b2c3d481" || g.home_team_id.startsWith("team_belmont_");
                const belmontS = isHomeTeam ? g.home_score : g.away_score;
                const opponentS = isHomeTeam ? g.away_score : g.home_score;
                if (belmontS > opponentS) wins++;
                else if (opponentS > belmontS) losses++;
                else ties++;
              }
            });
            const currentStanding = `${wins} - ${losses} - ${ties}`;

            const getTeamPhotos = (sid: string): string[] => {
              switch (sid) {
                case "f47ac10b-58cc-4372-a567-0e02b2c3d479": // Football
                  return [
                    "/assets/sports_photos/Football/IMG_0489.jpg",
                    "/assets/sports_photos/Football/IMG_0492.jpg",
                    "/assets/sports_photos/Football/IMG_0530.jpg",
                    "/assets/sports_photos/Football/IMG_0546.jpg"
                  ];
                case "s2": // Boys Basketball
                  return [
                    "/assets/sports_photos/Basketball/Boys_Basketball/IMG_8589.jpg",
                    "/assets/sports_photos/Basketball/Boys_Basketball/IMG_8610.jpg",
                    "/assets/sports_photos/Basketball/Boys_Basketball/IMG_8629.jpg"
                  ];
                case "s3": // Girls Basketball
                  return [
                    "/assets/sports_photos/Basketball/Girls_Basketball/IMG_0290.jpg",
                    "/assets/sports_photos/Basketball/Girls_Basketball/IMG_0303.jpg"
                  ];
                case "s5": // Boys Indoor Track
                case "s7": // Boys Outdoor Track
                  return [
                    "/assets/sports_photos/Track/Boys_Track/1Z2A4011-Enhanced-NR.jpg",
                    "/assets/sports_photos/Track/Boys_Track/1Z2A4030-Enhanced-NR.jpg",
                    "/assets/sports_photos/Track/Boys_Track/1Z2A4206-Enhanced-NR.jpg"
                  ];
                case "s6": // Girls Indoor Track
                case "s8": // Girls Outdoor Track
                  return [
                    "/assets/sports_photos/Track/Girls_Track/1Z2A4006.jpg"
                  ];
                case "s9": // Baseball
                  return [
                    "/assets/sports_photos/Baseball/IMG_4084.jpg",
                    "/assets/sports_photos/Baseball/IMG_4109.jpg"
                  ];
                default:
                  return [];
              }
            };

            const activePhotos = getTeamPhotos(selectedSportId);

            return (
              <div className="space-y-8 animate-fade-in">
                               {activePhotos.length > 0 && (
                  <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden border border-gray-150 shadow-sm bg-slate-100">
                    <img 
                      src={activePhotos[0]} 
                      alt={`${getCleanSportDisplay(currentSport)} banner play`} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-belmont-navy/90 via-belmont-navy/60 to-transparent flex items-end p-6">
                      <div className="text-white space-y-1">
                        <span className="text-[10px] bg-belmont-maroon text-white font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Belmont {currentSport.season_type} Season Division
                        </span>
                        <h2 className="athletic-title font-bold text-3xl md:text-5xl uppercase tracking-wide mt-1">
                          {getCleanSportDisplay(currentSport)} Matchups
                        </h2>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-belmont-navy rounded-full p-2.5 flex items-center justify-center border-2 border-belmont-maroon shadow uppercase">
                      {getSportIcon(currentSport.name, currentSport.gender, true)}
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-widest font-mono">
                        {currentSport.season_type} Varsity Season
                      </span>
                      <h2 className="athletic-title font-bold text-2xl text-belmont-navy uppercase tracking-wide">
                        Belmont {getCleanSportDisplay(currentSport)}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50 px-4 py-2.5 rounded-xl border">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-mono">Calculated Record</span>
                      <span className="font-bold text-lg text-belmont-navy font-display">{currentStanding}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Roster list */}
                  <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-display font-semibold text-lg text-belmont-navy uppercase tracking-wider flex items-center gap-2">
                      <ClipboardList size={18} className="text-belmont-maroon" />
                      Official Varsity Team Roster ({rosterPlayers.length} Members)
                    </h3>

                    {rosterPlayers.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50 border border-all rounded-xl text-xs text-gray-400">
                        No official rosters recorded yet for this season.
                      </div>
                    ) : (
                      <div className="table-scroll border border-gray-100 rounded-xl">
                        <table className="w-full text-left separator-y text-xs">
                          <thead className="bg-[#0A1F44] text-white">
                            <tr>
                              <th className="p-3">Athlete Name</th>
                              <th className="p-3 text-center">Jersey</th>
                              <th className="p-3">Position</th>
                              <th className="p-3">Class Year</th>
                              <th className="p-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rosterPlayers.map((p) => (
                              <tr key={p.id} className="hover:bg-slate-50 transition border-b border-gray-100">
                                <td className="p-3 flex items-center gap-3">
                                  <img 
                                    src={getPlayerPhotoUrl(p.photo_url)} 
                                    alt={p.name} 
                                    referrerPolicy="no-referrer" 
                                    className="w-8 h-8 rounded-full object-cover border-2 border-belmont-navy shrink-0" 
                                  />
                                  <div>
                                    <span className="font-semibold text-gray-800 block text-xs">{p.name}</span>
                                    {p.is_alumni && <span className="text-[9px] bg-slate-100 border text-slate-800 font-mono uppercase font-semibold px-1 rounded">Alumni</span>}
                                  </div>
                                </td>
                                <td className="p-3 text-center font-bold text-belmont-maroon">#{p.jersey_number}</td>
                                <td className="p-3 font-semibold text-gray-600">{p.position}</td>
                                <td className="p-3 text-gray-500">{p.is_alumni ? "Alumni" : p.year === "SR" ? "Class of 2026" : p.year === "JR" ? "Class of 2027" : p.year === "SO" ? "Class of 2028" : p.year === "FR" ? "Class of 2029" : `Class of ${p.year}`}</td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => handlePlayerDetailNavigation(p.id)}
                                    className="text-xs text-belmont-maroon font-bold hover:underline"
                                  >
                                    View Analytics &rarr;
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Games Schedule log */}
                  <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-display font-semibold text-lg text-belmont-navy uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={18} className="text-belmont-maroon" />
                      Competition Schedules
                    </h3>

                    <div className="space-y-4">
                      {sportGames.length === 0 ? (
                        <div className="p-8 text-center bg-slate-50 border rounded-xl text-xs text-gray-400">
                          No competitions scheduled yet for this season.
                        </div>
                      ) : (
                        sportGames.map((g) => {
                          const isHomeGame = g.home_team_id === "a2cb10b-58cc-4372-a567-0e02b2c3d481" || g.home_team_id.startsWith("team_belmont_");
                          const oppName = g.opponent_name || (isHomeGame ? "Arlington Spy Ponders" : "Winchester Sachems");
                          const hasGameScore = g.home_score !== null && g.away_score !== null;

                          return (
                            <div
                              key={g.id}
                              onClick={() => handleGameDetailNavigation(g.id)}
                              className="p-4 bg-gray-50 hover:bg-slate-100 rounded-xl cursor-pointer transition border border-gray-200 flex flex-col gap-2 text-xs"
                            >
                              <div className="flex justify-between items-center font-mono text-[10px] text-gray-400">
                                <span>{g.game_date}</span>
                                <span className={`uppercase font-bold tracking-wider ${hasGameScore ? "text-belmont-maroon" : "text-blue-500"}`}>
                                  {hasGameScore ? g.status : "Scheduled"}
                                </span>
                              </div>

                              <div className="flex justify-between items-center gap-2">
                                <span className="font-bold text-slate-700 truncate">
                                  {isHomeGame ? `vs ${oppName}` : `@ ${oppName}`}
                                </span>

                                <span className={`font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${hasGameScore ? "text-slate-900 bg-white" : "text-gray-400 text-[10px] bg-gray-100"}`}>
                                  {hasGameScore ? `${g.home_score} - ${g.away_score}` : "Score not recorded"}
                                </span>
                              </div>

                              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                <MapPin size={10} />
                                {g.location}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* PLAYER DETAIL VIEW */}
          {currentView === "player_detail" && activePlayerDetail && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden">
                <img
                  src={getPlayerPhotoUrl(activePlayerDetail.player.photo_url)}
                  alt={activePlayerDetail.player.name}
                  referrerPolicy="no-referrer"
                  className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-belmont-navy shrink-0"
                />

                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-belmont-maroon uppercase tracking-widest">
                        <span>Jersey #{activePlayerDetail.player.jersey_number}</span>
                        <span>•</span>
                        <span>{activePlayerDetail.player.position}</span>
                      </div>
                      <h2 className="athletic-title font-bold text-3xl text-belmont-navy mt-1 flex items-center gap-3">
                        {activePlayerDetail.player.name}
                        <button
                          onClick={() => toggleFavoriteAthlete(activePlayerDetail.player.id)}
                          className="shrink-0 focus:outline-none"
                        >
                          <Heart
                            size={20}
                            className={checkIsFavorited(activePlayerDetail.player.id) ? "fill-red-600 text-red-600" : "text-gray-400 hover:text-red-500"}
                          />
                        </button>
                      </h2>
                    </div>

                    <div className="flex gap-2">
                      {claimedPlayerId === activePlayerDetail.player.id ? (
                        <button
                          onClick={() => {
                            setEditBioText(activePlayerDetail.player.bio);
                            setEditPhotoUrl(activePlayerDetail.player.photo_url);
                            setIsEditingBio(!isEditingBio);
                          }}
                          className="px-3.5 py-1.5 bg-belmont-maroon text-white font-semibold text-xs rounded-lg hover:bg-belmont-maroon-light transition flex items-center gap-1.5"
                        >
                          <Edit size={12} />
                          <span>Edit Roster Info</span>
                        </button>
                      ) : (
                        !activePlayerDetail.player.is_claimed && (
                          <button
                            onClick={() => handleAthleteClaimRequest(activePlayerDetail.player.id)}
                            className="px-3.5 py-1.5 bg-belmont-navy text-white font-semibold text-xs rounded-lg hover:bg-belmont-navy-light transition flex items-center gap-1.5"
                          >
                            <UserCheck size={12} />
                            <span>Claim This Athlete Profile</span>
                          </button>
                        )
                      )}

                      <button
                        onClick={() => setShowCorrectionForm(!showCorrectionForm)}
                        className="px-3.5 py-1.5 bg-white text-gray-700 font-semibold text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                      >
                        Submit Correction
                      </button>
                    </div>
                  </div>

                  {isEditingBio ? (
                    <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600">Personal Bio Text (Max 500 chars)</label>
                        <textarea
                          value={editBioText}
                          onChange={(e) => setEditBioText(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-gray-200 outline-none rounded focus:border-belmont-maroon"
                          rows={3}
                          maxLength={500}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600">Profile Photo URL</label>
                        <input
                          type="text"
                          value={editPhotoUrl}
                          onChange={(e) => setEditPhotoUrl(e.target.value)}
                          className="w-full text-xs p-2 bg-white border border-gray-200 outline-none rounded focus:border-belmont-maroon"
                        />
                      </div>
                      <button
                        onClick={savePersonalBioText}
                        className="px-4 py-1.5 bg-belmont-maroon text-white rounded text-xs font-bold hover:bg-belmont-maroon-light transition"
                      >
                        Save Updated Bio
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 leading-relaxed max-w-2xl font-sans italic">
                      "{activePlayerDetail.player.bio || "No custom bio compiled. Claims verified athletes may add highlights, bios, and collegiate recruitment targets."}"
                    </p>
                  )}
                </div>
              </div>

              {showCorrectionForm && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-fade-in space-y-4">
                  <h3 className="font-display font-semibold text-lg text-belmont-navy uppercase tracking-wider flex items-center gap-2">
                    <ClipboardList size={18} className="text-belmont-maroon" />
                    Propose Stat Correction
                  </h3>

                  <form onSubmit={handleCorrectionSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1 text-xs">
                      <label className="font-semibold text-gray-600 block">Select Stat Key</label>
                      <select
                        value={correctionForm.stat_key}
                        onChange={(e) => setCorrectionForm(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 outline-none rounded focus:border-belmont-maroon"
                        required
                      >
                        <option value="">-- Choose Key --</option>
                        <option value="passing_yards">Passing Yards</option>
                        <option value="rushing_yards">Rushing Yards</option>
                        <option value="receiving_yards">Receiving Yards</option>
                        <option value="defense_tackles">Defensive Tackles</option>
                        <option value="defense_sacks">Sacks</option>
                        <option value="passing_touchdowns">Passing Touchdowns</option>
                        <option value="rushing_touchdowns">Rushing Touchdowns</option>
                        <option value="receiving_touchdowns">Receiving Touchdowns</option>
                      </select>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="font-semibold text-gray-600 block">Current Logged Count</label>
                      <input
                        type="number"
                        value={correctionForm.current_value}
                        onChange={(e) => setCorrectionForm((prev: any) => ({ ...prev, current_value: Number(e.target.value) }))}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 outline-none rounded focus:border-belmont-maroon"
                        required
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="font-semibold text-gray-600 block">Suggested Tape Value</label>
                      <input
                        type="number"
                        value={correctionForm.suggested_value}
                        onChange={(e) => setCorrectionForm((prev: any) => ({ ...prev, suggested_value: Number(e.target.value) }))}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 outline-none rounded focus:border-belmont-maroon"
                        required
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1 text-xs">
                      <label className="font-semibold text-gray-600 block">Explanation & Video Timestamp backing</label>
                      <textarea
                        value={correctionForm.reason}
                        onChange={(e) => setCorrectionForm(prev => ({ ...prev, reason: e.target.value }))}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 outline-none rounded focus:border-belmont-maroon"
                        rows={3}
                        placeholder="Must specify footage context (e.g. 'At 12:14 of Lexington dual broadcast, wide receiver caught pass for 12 yards, but game sheets listed WR Jacob Wilde instead...')"
                        required
                      />
                    </div>

                    <div className="md:col-span-3 text-right">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-belmont-maroon text-white font-bold rounded-lg text-xs uppercase"
                      >
                        Submit Correction Request
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* STATS LOG TABLE */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-display font-semibold text-lg text-belmont-navy uppercase tracking-wider">
                  Game-by-Game Statistical Breakdown
                </h3>

                <div className="table-scroll border border-gray-100 rounded-xl">
                  <table className="w-full text-left separator-y text-xs">
                    <thead className="bg-[#0A1F44] text-white">
                      <tr>
                        <th className="p-3">Matched Game</th>
                        <th className="p-3">Match Date</th>
                        <th className="p-3">Opponent Outcome</th>
                        <th className="p-3 text-right">Detailed Metrics Logged</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activePlayerDetail.gameLogs.map((log: any, index: number) => (
                        <tr key={index} className="hover:bg-slate-50 transition border-b border-gray-100">
                          <td className="p-3 font-semibold text-belmont-navy text-xs">
                            Game #{index + 1}
                          </td>
                          <td className="p-3 text-gray-500 font-mono text-[11px]">{log.game_date}</td>
                          <td className="p-3 font-semibold text-slate-700">{log.opponent} • ({log.score})</td>
                          <td className="p-3 text-right space-x-2">
                            {Object.keys(log.stats).map((key) => (
                              <span key={key} className="inline-block px-2.5 py-1 bg-slate-100 border text-slate-700 font-mono text-[10px] font-bold rounded-lg uppercase">
                                {key.replace(/_/g, " ")}: <span className="text-belmont-maroon font-bold">{log.stats[key]}</span>
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}

                      {activePlayerDetail.gameLogs.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-gray-400 text-xs font-semibold">
                            No individual stats recorded yet for this active season player rosters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* GAME DETAIL BOX SCORE VIEW */}
          {currentView === "game_detail" && activeGameDetail && (
            <div className="space-y-8 animate-fade-in shadow-xs p-4 bg-white/40 rounded-3xl">
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                <div className="text-center md:text-left flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-gray-400 block uppercase">Match Date</span>
                    <span className="font-semibold text-sm text-belmont-navy">{activeGameDetail.game.game_date}</span>
                    <span className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin size={10} />
                      {activeGameDetail.game.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8 md:gap-14">
                  <div className="text-center">
                    <span className="block font-display font-black text-xl md:text-3xl text-belmont-navy uppercase">
                      BELMONT
                    </span>
                  </div>

                  <div className="text-center font-display font-black text-2xl md:text-4xl text-belmont-navy">
                    {activeGameDetail.game.home_score !== null && activeGameDetail.game.away_score !== null 
                      ? `${activeGameDetail.game.home_score} - ${activeGameDetail.game.away_score}`
                      : "Score not recorded"
                    }
                  </div>

                  <div className="text-center">
                    <span className="block font-display font-bold text-xl md:text-3xl text-gray-600 uppercase">
                      OPPONENT
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  <a
                    href={`/api/games/${activeGameDetail.game.id}/download`}
                    className="px-4 py-2 bg-belmont-navy hover:bg-belmont-navy-light text-white text-xs font-bold rounded-lg flex items-center gap-2 transition"
                  >
                    <Download size={14} />
                    <span>Download CSV Box Score</span>
                  </a>

                  {activeGameDetail.game.video_url && (
                    <a
                      href={activeGameDetail.game.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-belmont-maroon hover:bg-belmont-maroon-light text-white text-xs font-bold rounded-lg flex items-center gap-2 transition"
                    >
                      <Tv size={14} />
                      <span>Watch Tape Broadcast</span>
                    </a>
                  )}
                </div>
              </div>

              {/* STATS TABLES CONTAINER */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Team stats column comparison */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="font-display font-semibold text-lg text-belmont-navy uppercase tracking-wider">
                    Team Yards Comparison
                  </h3>

                  <div className="space-y-4">
                    {activeGameDetail.teamStats.filter((ts: any) => ts.team_id === "a2cb10b-58cc-4372-a567-0e02b2c3d481").map((ts: any) => {
                      const opponentStat = activeGameDetail.teamStats.find((s: any) => s.team_id !== "a2cb10b-58cc-4372-a567-0e02b2c3d481" && s.stat_key === ts.stat_key);
                      return (
                        <div key={ts.id} className="space-y-1.5 text-xs">
                          <div className="flex justify-between font-semibold text-gray-600 uppercase font-mono text-[10px]">
                            <span>{ts.stat_key.replace(/_/g, " ")}</span>
                            <span>{ts.stat_value} vs {opponentStat?.stat_value || 0}</span>
                          </div>

                          {/* Quick bar visualizer */}
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                            <div
                              className="bg-belmont-maroon h-full"
                              style={{ width: `${(Number(ts.stat_value) / (Number(ts.stat_value) + Number(opponentStat?.stat_value || 1))) * 100}%` }}
                            ></div>
                            <div
                              className="bg-slate-300 h-full flex-1"
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Individual players detail stats lists */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h3 className="font-display font-semibold text-lg text-belmont-navy uppercase tracking-wider flex items-center gap-2">
                    <Trophy size={18} className="text-belmont-maroon" />
                    Belmont Player Performance Records
                  </h3>

                  <div className="table-scroll border border-gray-100 rounded-xl">
                    <table className="w-full text-left separator-y text-xs">
                      <thead className="bg-[#0A1F44] text-white">
                        <tr>
                          <th className="p-3">Athlete</th>
                          <th className="p-3 text-center">Jersey</th>
                          <th className="p-3">Category</th>
                          <th className="p-3 text-right">Value Recorded</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeGameDetail.playerStats.map((s: any) => (
                          <tr key={s.id} className="hover:bg-slate-50 transition border-b border-gray-100">
                            <td className="p-3 font-semibold text-belmont-navy">{s.player_name}</td>
                            <td className="p-3 text-center text-belmont-maroon font-bold font-mono">#{s.player_jersey}</td>
                            <td className="p-3 font-semibold uppercase text-gray-500 font-mono text-[10px]">{s.stat_key.replace(/_/g, " ")}</td>
                            <td className="p-3 text-right font-bold text-gray-700 font-mono">{s.stat_value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEADERBOARDS VIEW */}
          {currentView === "leaderboards" && (
            <div className="space-y-8 animate-fade-in shadow-xs p-4 bg-white/40 rounded-3xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="athletic-title font-bold text-2xl text-belmont-navy tracking-wider">
                    Belmont Standing Leaderboards
                  </h2>
                  <p className="text-xs text-gray-400">
                    Aggregated seasonal statistical leaders computed from verified varsity score sheets.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView("search")}
                  className="flex items-center gap-2 bg-belmont-navy hover:bg-belmont-navy-light text-white text-[10px] font-semibold px-4 py-2.5 rounded-xl transition shadow"
                >
                  <SearchIcon size={12} className="text-amber-300" />
                  <span>Search Stats with AI</span>
                </button>
              </div>

              {/* Sports Tab Selector */}
              <div className="flex flex-wrap gap-2 pb-2">
                {allSports.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setLeaderboardSportId(s.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl uppercase tracking-wider transition ${
                      leaderboardSportId === s.id
                        ? "bg-belmont-maroon text-white shadow-md border-b-2 border-amber-300"
                        : "bg-white hover:bg-gray-50 text-belmont-navy border border-gray-150"
                    }`}
                  >
                    {getCleanSportDisplay(s)}
                  </button>
                ))}
              </div>

              {Object.keys(allLeaderboards).length === 0 ? (
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md mx-auto space-y-4">
                  <Trophy size={48} className="text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 font-display uppercase tracking-wider text-sm">No Leaderboard data recorded</p>
                  <p className="text-xs text-gray-400">No score calculations exist yet for this sport. Administrators can upload schedule sheets or game boxes in the Admin panel to populate standings!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(allLeaderboards).map((catName) => (
                    <div key={catName} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                      <h3 className="font-display font-bold text-base text-belmont-navy uppercase border-b pb-2 tracking-wide flex items-center justify-between">
                        <span>{catName.replace(/_/g, " ")}</span>
                        <Trophy size={16} className="text-amber-500 shrink-0" />
                      </h3>

                      <div className="space-y-3 text-xs">
                        {allLeaderboards[catName].slice(0, 5).map((entry: any, index: number) => (
                          <div
                            key={entry.id}
                            onClick={() => handlePlayerDetailNavigation(entry.player_id)}
                            className="flex justify-between items-center bg-gray-50 hover:bg-slate-100 p-2.5 rounded-xl cursor-pointer transition border border-gray-100"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-xs text-gray-400">#{index + 1}</span>
                              <div>
                                <span className="font-bold text-slate-800 block">{entry.player_name}</span>
                                <span className="text-[10px] text-gray-450 uppercase font-mono tracking-wider">#{entry.player_jersey || "N/A"} • {entry.player_position || "ATH"}</span>
                              </div>
                            </div>

                            <span className="font-mono font-bold text-sm text-belmont-maroon">
                              {entry.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RECORDS VIEW */}
          {currentView === "records" && (
            <div className="space-y-8 animate-fade-in shadow-xs p-4 bg-white/40 rounded-3xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="athletic-title font-bold text-2xl text-belmont-navy tracking-wider">
                    Belmont Varsity Record Archive
                  </h2>
                  <p className="text-xs text-gray-400">
                    Dual milestones for Belmont athletes. Reflecting maximum benchmarks inside single game logs and full history seasons.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView("search")}
                  className="flex items-center gap-2 bg-belmont-navy hover:bg-belmont-navy-light text-white text-[10px] font-semibold px-4 py-2.5 rounded-xl transition shadow"
                >
                  <SearchIcon size={12} className="text-amber-300" />
                  <span>Search Records with AI</span>
                </button>
              </div>

              {/* Sports Tab Selector */}
              <div className="flex flex-wrap gap-2 pb-2">
                {allSports.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setRecordsSportId(s.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl uppercase tracking-wider transition ${
                      recordsSportId === s.id
                        ? "bg-belmont-maroon text-white shadow-md border-b-2 border-amber-300"
                        : "bg-white hover:bg-gray-50 text-belmont-navy border border-gray-150"
                    }`}
                  >
                    {getCleanSportDisplay(s)}
                  </button>
                ))}
              </div>

              {allRecords.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md mx-auto space-y-4">
                  <CheckSquare size={48} className="text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-700 font-display uppercase tracking-wider text-sm">No Record landmarks recorded</p>
                  <p className="text-xs text-gray-400">No team benchmarks have been registered under this category yet. Upload a box score or scheduled play reports in Admin section to update!</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 className="font-display font-semibold text-lg text-belmont-navy uppercase tracking-wider">
                    Varsity Milestones Standing Table
                  </h3>

                  <div className="table-scroll border border-gray-100 rounded-xl">
                    <table className="w-full text-left separator-y text-xs">
                      <thead className="bg-[#0A1F44] text-white">
                        <tr>
                          <th className="p-3">Stat Key</th>
                          <th className="p-3">Record Class</th>
                          <th className="p-3">Athlete Holder</th>
                          <th className="p-3">Opposition Context</th>
                          <th className="p-3 text-right">Value Record</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allRecords.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50 transition border-b border-gray-100">
                            <td className="p-3 font-semibold uppercase text-belmont-navy font-mono text-[10px]">
                              {r.stat_key.replace(/_/g, " ")}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold border ${r.record_type === "single_game" ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-purple-100 text-purple-800 border-purple-200"}`}>
                                {r.record_type === "single_game" ? "Game Record" : "Season Aggregate"}
                              </span>
                            </td>
                            <td className="p-3 font-bold text-gray-700">{r.player_name}</td>
                            <td className="p-3 text-gray-500">{r.opponent_name !== "N/A" ? `vs ${r.opponent_name} (${r.game_date})` : "Season Aggregate Standing"}</td>
                            <td className="p-3 text-right font-black text-belmont-maroon font-mono">{r.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEARCH VIEW */}
          {currentView === "search" && (
            <div className="space-y-4">
              <div>
                <h2 className="athletic-title font-bold text-2xl text-belmont-navy tracking-wider">
                  Belmont Varsity Search Engine
                </h2>
                <p className="text-xs text-gray-400">
                  Ask sports standouts, team averages, and milestones. Generated instantly by lightweight Gemini.
                </p>
              </div>
              <LNLSearch
                onNavigateToPlayer={handlePlayerDetailNavigation}
                allPlayers={allPlayers}
              />
            </div>
          )}

          {/* ABOUT CLUB VIEW */}
          {currentView === "about" && (
            <div className="space-y-6 max-w-3xl mx-auto text-left animate-fade-in bg-white p-6 md:p-10 rounded-3xl shadow-sm border">
              {/* Added a beautiful sports photo as a showcase placeholder/header for the about page */}
              <div className="relative h-48 md:h-60 rounded-2xl overflow-hidden mb-6 bg-slate-100 border">
                <img 
                  src="/assets/sports_photos/Track/Boys_Track/1Z2A4011-Enhanced-NR.jpg"
                  alt="Belmont Marauders Track Team Action"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-belmont-navy/90 via-belmont-navy/40 to-transparent flex items-end p-6 font-display">
                  <div>
                    <span className="font-mono text-[10px] text-amber-300 font-bold uppercase tracking-widest block">Official Club Portal</span>
                    <h2 className="athletic-title font-bold text-2xl md:text-3xl text-white uppercase tracking-wide mt-1">
                      About Belmont Stats
                    </h2>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed font-sans">
                The Belmont Varsity Stats Club is a student-led organization at Belmont High School. We specialize in aggregating high school sports logs, video tapes, playbooks, and athletics archives to provide certified sports visualizations to students, parents, and recruiter systems.
              </p>

              <h3 className="font-display font-semibold uppercase text-lg text-belmont-navy tracking-wide">
                Our Mission & Systems
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-sans">
                By implementing completely custom, free local analytics databases, we guarantee historical data integrity for Belmont High School. Our software integrates natural language Search via Gemini models, Resend emails to rostered players post-game, and provides clean photographic highlights drive portals.
              </p>

              <h3 className="font-display font-semibold uppercase text-lg text-belmont-navy tracking-wide pt-4">
                Official Photography Partners
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-sans mb-4">
                Dynamic sports imagery on this platform is generously provided by our official pupil photographers. Please support and follow their work on Instagram:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
                <a 
                  href="https://www.instagram.com/benzoflics/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl border border-gray-100 bg-slate-50/50 hover:bg-slate-100 transition flex items-center gap-3 group text-left"
                >
                  <Camera className="text-belmont-maroon group-hover:scale-110 transition duration-200" size={20} />
                  <div>
                    <span className="font-bold text-sm text-belmont-navy block">Benzoflics</span>
                    <span className="text-[11px] text-gray-400 font-mono">Follow on Instagram &rarr;</span>
                  </div>
                </a>
                <a 
                  href="https://www.instagram.com/patphotos19/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl border border-gray-100 bg-slate-50/50 hover:bg-slate-100 transition flex items-center gap-3 group text-left"
                >
                  <Camera className="text-belmont-maroon group-hover:scale-110 transition duration-200" size={20} />
                  <div>
                    <span className="font-bold text-sm text-belmont-navy block">Patphotos19</span>
                    <span className="text-[11px] text-gray-400 font-mono">Follow on Instagram &rarr;</span>
                  </div>
                </a>
              </div>

              <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400">
                <span>Contact Email: <strong className="text-belmont-navy font-mono">belmontstats@gmail.com</strong></span>
                <span>•</span>
                <span>Instagram: <a href="https://www.instagram.com/bhs_stats/" target="_blank" rel="noopener noreferrer" className="text-belmont-maroon font-bold hover:underline">@bhs_stats</a></span>
                <span>•</span>
                <span>Belmont, MA 02478</span>
              </div>
            </div>
          )}

          {/* USER DASHBOARD VIEW */}
          {currentView === "dashboard" && currentUser && (
            <div className="space-y-8 animate-fade-in animate-pulse-none shadow-xs p-4 bg-white/40 rounded-3xl">
              <div>
                <h2 className="athletic-title font-bold text-2xl text-belmont-navy tracking-wider">
                  Contributor Dashboard
                </h2>
                <p className="text-xs text-gray-400">
                  Customize favorites, manage claimed athlete bios, and review certified notifications.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Favorites and custom notification feeds */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-belmont-navy flex items-center gap-2">
                      <Mail size={16} className="text-belmont-maroon" />
                      Alert Inbox ({userNotifications.length})
                    </h3>

                    <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                      {userNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 rounded-lg text-xs leading-relaxed border transition flex flex-col gap-2 ${
                            n.is_read ? "bg-gray-50 text-gray-400 border-gray-100" : "bg-red-50/20 text-belmont-navy border-red-100 font-medium"
                          }`}
                        >
                          <p>{n.message}</p>
                          <div className="flex justify-between items-center font-mono text-[9px] mt-1 text-gray-400">
                            <span>{new Date(n.created_at).toLocaleDateString()}</span>
                            {!n.is_read && (
                              <button
                                onClick={() => handleNotificationRead(n.id)}
                                className="text-belmont-maroon font-bold hover:underline"
                              >
                                Mark as Read
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {userNotifications.length === 0 && (
                        <p className="text-xs text-gray-400 italic text-center py-4">No notifications logged.</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 border-t pt-5">
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-belmont-navy flex items-center gap-2">
                      <Heart size={16} className="text-red-500 fill-red-500" />
                      Bookmarked Athletes
                    </h3>

                    <div className="space-y-2">
                      {userFavorites.map((f) => {
                        const player = allPlayers.find(p => p.id === f.entity_id);
                        if (!player) return null;
                        return (
                          <div
                            key={f.id}
                            onClick={() => handlePlayerDetailNavigation(player.id)}
                            className="p-2.5 border rounded-lg hover:bg-gray-50 transition cursor-pointer flex justify-between items-center text-xs"
                          >
                            <span className="font-bold text-slate-700">{player.name}</span>
                            <span className="font-mono text-gray-400">#{player.jersey_number} • WR</span>
                          </div>
                        );
                      })}

                      {userFavorites.length === 0 && (
                        <p className="text-xs text-gray-400 italic text-center py-4">Bookmarks empty.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Claimed profiles editor bio targets */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="font-display font-semibold text-base uppercase tracking-wider text-belmont-navy flex items-center gap-2">
                    <UserCheck size={18} className="text-belmont-maroon" />
                    Athlete Claimed Workspace
                  </h3>

                  {claimedPlayerId ? (
                    <div className="space-y-4">
                      {(() => {
                        const cl = allPlayers.find(p => p.id === claimedPlayerId);
                        if (!cl) return null;
                        return (
                          <div className="p-4 bg-gray-50 border rounded-xl flex flex-col md:flex-row gap-4 items-start">
                            <img src={getPlayerPhotoUrl(cl.photo_url)} alt={cl.name} className="w-16 h-16 rounded-xl object-cover border" />
                            <div className="space-y-2 flex-1">
                              <div>
                                <span className="font-bold text-belmont-navy text-base block">{cl.name}</span>
                                <span className="text-xs text-gray-400 font-mono">Jersey #{cl.jersey_number} • WR</span>
                              </div>
                              <p className="text-xs text-gray-500 italic mt-1 font-sans">
                                "{cl.bio || "Roster bio is blank. Populate text bios using edit tools below:"}"
                              </p>

                              <div className="pt-2">
                                <button
                                  onClick={() => handlePlayerDetailNavigation(cl.id)}
                                  className="text-xs text-belmont-maroon font-bold hover:underline"
                                >
                                  Browse My Detailed Analytics Tracker &rarr;
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      <div className="border-t pt-5 space-y-3">
                        <h4 className="font-semibold text-xs text-gray-700">Modify Athlete Information Cards</h4>
                        <div className="space-y-2">
                          <textarea
                            value={editBioText}
                            onChange={(e) => setEditBioText(e.target.value)}
                            placeholder="Write career accomplishments, college interest, highlights..."
                            className="w-full text-xs p-3 bg-gray-50 border outline-none rounded-xl focus:border-belmont-maroon"
                            rows={4}
                            maxLength={500}
                          />
                          <button
                            onClick={savePersonalBioText}
                            className="px-4 py-2 bg-belmont-maroon text-white font-bold text-xs rounded-lg hover:bg-belmont-maroon-light transition"
                          >
                            Save Bio Adjustments
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-6 rounded-2xl border text-center space-y-3">
                      <UserX className="mx-auto text-gray-400" size={32} />
                      <h4 className="font-bold text-gray-700 text-sm">No Claimed athlete associated with session</h4>
                      <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                        If you compete on Belmont's varsity rosters, browse Roster lists under Sports Hub, click "Claim Profile" to submit certified credential claims to club supervisor groups.
                      </p>
                      <button
                        onClick={() => setCurrentView("sports_hub")}
                        className="px-4 py-2 bg-belmont-navy text-white hover:bg-belmont-navy-light rounded-lg font-semibold text-xs uppercase tracking-wide"
                      >
                        Search Players list
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ADMIN AND STATS RECONCILER ENGINE VIEW */}
          {currentView === "admin" && currentUser && (currentUser.role === "owner" || currentUser.role === "editor") && (
            <div className="space-y-8 animate-fade-in shadow-xs p-4 bg-white/40 rounded-3xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="athletic-title font-bold text-2xl text-belmont-navy tracking-wider">
                    Official Administration Panel
                  </h2>
                  <p className="text-xs text-gray-400">
                    Roster rosters, map CSV game sheets, trigger athletic crawlers, or reconcile parent claims.
                  </p>
                </div>
                
                {currentUser.role === "owner" && (
                  <button
                    onClick={() => {
                      fetchAdminAdministrativeDetails();
                      refreshCorePublicData();
                    }}
                    className="px-4 py-2 bg-white border text-belmont-navy font-bold rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1.5 shadow-sm"
                  >
                    <RefreshCcw size={12} />
                    <span>Sync Dashboard</span>
                  </button>
                )}
              </div>

              {/* ADMIN CONTROL MODULES ROW (ROSTERS, CSV, MAP) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Roster form schedule */}
                <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-belmont-navy border-b pb-1.5">
                      Roster New Athlete
                    </h3>

                    <form onSubmit={handleAddNewPlayer} className="space-y-3 text-xs text-left">
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600 block">FullName</label>
                        <input
                          type="text"
                          required
                          value={newPlayerForm.name}
                          onChange={(e) => setNewPlayerForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border outline-none rounded focus:border-belmont-maroon text-xs"
                          placeholder="Danny Mara"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="font-semibold text-gray-600 block">Class Year</label>
                          <select
                            value={newPlayerForm.year}
                            onChange={(e) => setNewPlayerForm(prev => ({ ...prev, year: e.target.value }))}
                            className="w-full p-2 bg-gray-50 border outline-none rounded focus:border-belmont-maroon text-xs"
                          >
                            <option value="SR">Class of 2026</option>
                            <option value="JR">Class of 2027</option>
                            <option value="SO">Class of 2028</option>
                            <option value="FR">Class of 2029</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-gray-600 block">Jersey #</label>
                          <input
                            type="text"
                            required
                            value={newPlayerForm.jersey_number}
                            onChange={(e) => setNewPlayerForm(prev => ({ ...prev, jersey_number: e.target.value }))}
                            className="w-full p-2 bg-gray-50 border outline-none rounded focus:border-belmont-maroon text-xs"
                            placeholder="12"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="font-semibold text-gray-600 block">Position Key</label>
                          <select
                            value={newPlayerForm.position}
                            onChange={(e) => setNewPlayerForm(prev => ({ ...prev, position: e.target.value }))}
                            className="w-full p-2 bg-gray-50 border outline-none rounded focus:border-belmont-maroon text-xs"
                          >
                            <option value="QB">QB (Quarterback)</option>
                            <option value="RB">RB (Runningback)</option>
                            <option value="WR">WR (Receiver)</option>
                            <option value="LB">LB (Linebacker)</option>
                            <option value="OL">TE (TE / Punter)</option>
                            <option value="CB">CB (Special / Corner)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-gray-600 block">Roster Alumni</label>
                          <select
                            value={newPlayerForm.is_alumni}
                            onChange={(e) => setNewPlayerForm(prev => ({ ...prev, is_alumni: e.target.value }))}
                            className="w-full p-2 bg-gray-50 border outline-none rounded focus:border-belmont-maroon text-xs"
                          >
                            <option value="false">Active Roster</option>
                            <option value="true">Alumni (Lock Bio)</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-belmont-navy hover:bg-belmont-navy-light text-white font-bold rounded text-xs uppercase"
                      >
                        Enroll Roster Player
                      </button>
                    </form>
                  </div>

                  <div className="space-y-3 border-t pt-5">
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-belmont-navy border-b pb-1.5">
                      Schedule Game
                    </h3>

                    <form onSubmit={handleAddNewGame} className="space-y-3 text-xs text-left">
                      <div className="space-y-1">
                        <label className="font-semibold text-gray-600 block">Opponent High School</label>
                        <select
                          required
                          value={newGameForm.away_team_id}
                          onChange={(e) => setNewGameForm(prev => ({ ...prev, away_team_id: e.target.value }))}
                          className="w-full p-2.5 bg-gray-50 border outline-none rounded focus:border-belmont-maroon text-xs"
                        >
                          <option value="">-- Select Opponent --</option>
                          <option value="b3cb10b-58cc-4372-a567-0e02b2c3d482">Arlington Spy Ponders</option>
                          <option value="c4cb10b-58cc-4372-a567-0e02b2c3d483">Winchester Sachems</option>
                          <option value="d5cb10b-58cc-4372-a567-0e02b2c3d484">Lexington Minutemen</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="font-semibold text-gray-600 block">Game Date</label>
                          <input
                            type="date"
                            required
                            value={newGameForm.game_date}
                            onChange={(e) => setNewGameForm(prev => ({ ...prev, game_date: e.target.value }))}
                            className="w-full p-2 bg-gray-50 border outline-none rounded focus:border-belmont-maroon text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-gray-600 block">Stadium Venue</label>
                          <input
                            type="text"
                            required
                            value={newGameForm.location}
                            onChange={(e) => setNewGameForm(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full p-2 bg-gray-50 border outline-none rounded focus:border-belmont-maroon text-xs"
                            placeholder="Harris Field"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-belmont-navy hover:bg-belmont-navy-light text-white font-bold rounded text-xs uppercase"
                      >
                        Calendar Scheduled Match
                      </button>
                    </form>
                  </div>
                </div>

                {/* CSV mapping control pipeline */}
                <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="border-b pb-2 flex justify-between items-center flex-wrap gap-2">
                    <div>
                      <h3 className="font-display font-semibold text-base uppercase tracking-wider text-belmont-navy">
                        CSV Varsity Game upload & Verification Mapping
                      </h3>
                      <p className="text-[10px] text-gray-400">
                        Upload analysis sheet, verify mapped headers, match roster athletes.
                      </p>
                    </div>

                    <select
                      className="text-xs p-1.5 border rounded border-gray-100 font-mono"
                      defaultValue="g1_belmont_arlington"
                    >
                      <option value="g1_belmont_arlington">Arlington Dual Match Game</option>
                    </select>
                  </div>

                  {gameCsvSuccessAlert && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs flex gap-2 items-center leading-relaxed">
                      <CheckSquare size={14} className="shrink-0" />
                      <span>{gameCsvSuccessAlert}</span>
                    </div>
                  )}

                  <CsvMapper
                    gameId="g1_belmont_arlington"
                    sportId="f47ac10b-58cc-4372-a567-0e02b2c3d479"
                    allPlayers={allPlayers}
                    onUploadSuccess={(msg) => {
                      setGameCsvSuccessAlert(msg);
                      refreshCorePublicData();
                    }}
                    onUploadError={(msg) => alert(msg)}
                  />
                </div>

                {/* Google Sheets Synchronizer Hub */}
                <div className="lg:col-span-12">
                  <GoogleSheetsHub
                    allSports={allSports}
                    onSyncComplete={(msg) => {
                      setGameCsvSuccessAlert(msg);
                      refreshCorePublicData();
                    }}
                    token={currentUser?.token || ""}
                  />
                </div>

                {/* AI-powered CSV Scheduling Multi-Sport module */}
                <div className="lg:col-span-12">
                  <AiSchedulerUpload
                    allSports={allSports}
                    token={currentUser?.token || ""}
                    onSuccess={(msg) => {
                      setGameCsvSuccessAlert(msg);
                      refreshCorePublicData();
                    }}
                  />
                </div>
              </div>

              {/* SUPER ADMIN REVIEW QUEUES (PENDING CLAIMS & CORRECTIONS) */}
              {currentUser.role === "owner" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* claims verification */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-belmont-navy border-b pb-1.5 flex justify-between items-center">
                      <span>Roster Athlete Claims Pending Review ({pendingClaims.filter(c => c.status === "pending").length})</span>
                      <UserCheck size={16} className="text-amber-500" />
                    </h3>

                    <div className="space-y-3 max-h-[250px] overflow-y-auto">
                      {pendingClaims.map((claim) => (
                        <div
                          key={claim.id}
                          className="p-3 bg-gray-50 border rounded-lg text-xs space-y-2 flex flex-col justify-between"
                        >
                          <div className="space-y-1">
                            <span className="font-bold text-slate-800 text-xs block">{claim.player_name}</span>
                            <span className="text-[10px] text-gray-400 block">Requested by: {claim.user_email}</span>
                            <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded uppercase font-semibold inline-block font-mono mt-1">
                              {claim.status}
                            </span>
                          </div>

                          {claim.status === "pending" && (
                            <div className="flex gap-2 justify-end mt-1">
                              <button
                                onClick={() => resolvePlayerClaim(claim.id, "approved")}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] rounded"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => resolvePlayerClaim(claim.id, "rejected")}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}

                      {pendingClaims.length === 0 && (
                        <p className="text-xs text-gray-400 italic text-center py-4">No profile claims registered.</p>
                      )}
                    </div>
                  </div>

                  {/* Stat Corrections */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-belmont-navy border-b pb-1.5 flex justify-between items-center">
                      <span>Statistics Corrections Proposals ({pendingCorrections.filter(c => c.status === "pending").length})</span>
                      <ClipboardList size={16} className="text-amber-500" />
                    </h3>

                    <div className="space-y-3 max-h-[250px] overflow-y-auto">
                      {pendingCorrections.map((corr) => (
                        <div
                          key={corr.id}
                          className="p-3 bg-gray-50 border rounded-lg text-xs space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-slate-800 text-xs block">{corr.player_name}</span>
                              <span className="text-[10px] text-gray-400">Category: {corr.stat_key.replace(/_/g, " ")}</span>
                            </div>
                            <span className="font-mono text-[10px] font-bold text-belmont-maroon">
                              Proposal: {corr.current_value} &rarr; {corr.suggested_value}
                            </span>
                          </div>

                          <p className="text-[11px] text-gray-500 italic bg-white p-2 rounded border leading-relaxed">
                            "{corr.reason}"
                          </p>

                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-gray-400 font-mono">Submitter: {corr.submitter_email}</span>

                            {corr.status === "pending" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => resolveStatCorrection(corr.id, "approved")}
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] rounded"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => resolveStatCorrection(corr.id, "rejected")}
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {pendingCorrections.length === 0 && (
                        <p className="text-xs text-gray-400 italic text-center py-4">No statistical corrections proposals registered.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ATHLETIC CRAWLERS PLATFORM SCHEDULING (NEW COMPONENT) */}
              {currentUser.role === "owner" && (
                <div className="space-y-8">
                  <AdminScraperPanel authHeaders={{ Authorization: `Bearer ${currentUser.token}` }} dSports={allSports} />

                  {/* USER Escalation Access */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-belmont-navy border-b pb-1.5 flex justify-between items-center">
                      <span>Rostered User Role Registry Escalation</span>
                      <Shield size={16} className="text-belmont-maroon shrink-0" />
                    </h3>

                    <div className="table-scroll border border-gray-100 rounded-lg">
                      <table className="w-full text-left font-mono text-[11px]">
                        <thead className="bg-[#0a1f44] text-white">
                          <tr>
                            <th className="p-2">User Email</th>
                            <th className="p-2">Current Title</th>
                            <th className="p-2 text-right">Escalate Access</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminUsers.map((u) => (
                            <tr key={u.id} className="border-b border-gray-100">
                              <td className="p-2 truncate max-w-[120px]">{u.email}</td>
                              <td className="p-2 text-belmont-maroon font-bold uppercase">{u.role}</td>
                              <td className="p-2 text-right">
                                {u.role !== "owner" && (
                                  <button
                                    onClick={() => changeUserRoleSuperOwner(u.id, "owner")}
                                    className="px-2 py-0.5 bg-belmont-navy text-white text-[9px] rounded font-semibold uppercase hover:bg-belmont-navy-light"
                                  >
                                    Promote Owner
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* GOOGLE ANALYTICS MOCK METRICS DEMONSRATIONAL DASHBOARDS */}
              {analyticsData && (
                <div className="bg-gradient-to-br from-[#0A1F44] to-[#162f5e] text-white rounded-2xl p-6 shadow border-b-4 border-belmont-maroon space-y-6">
                  <div className="border-b border-white/10 pb-3 flex justify-between items-center flex-wrap gap-2">
                    <h3 className="font-display font-bold text-base uppercase tracking-wider text-amber-300">
                      Google Analytics & Database Metrics Tracker
                    </h3>
                    <span className="font-mono text-[10px] text-gray-300">Active Live Stream Indicators</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                      <span className="font-mono text-[10px] text-gray-400 block uppercase">Visitors Today</span>
                      <strong className="text-2xl font-black font-display text-white">{analyticsData.googleAnalytics.visitorsToday}</strong>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                      <span className="font-mono text-[10px] text-gray-400 block uppercase">Weekly Sessions</span>
                      <strong className="text-2xl font-black font-display text-white">{analyticsData.googleAnalytics.sessionsThisWeek}</strong>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                      <span className="font-mono text-[10px] text-gray-400 block uppercase">Page Views Total</span>
                      <strong className="text-2xl font-black font-display text-white">{analyticsData.googleAnalytics.pageViewsTotal}</strong>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                      <span className="font-mono text-[10px] text-gray-400 block uppercase">Avg duration</span>
                      <strong className="text-2xl font-black font-display text-white">{analyticsData.googleAnalytics.avgSessionDuration}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 text-xs">
                    {/* Top viewed athletes */}
                    <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                      <h4 className="font-display font-semibold text-amber-300 uppercase tracking-wide">Most Searched Athletes</h4>
                      <div className="space-y-2">
                        {analyticsData.topPlayers.map((tp: any, index: number) => (
                          <div key={tp.id} className="flex justify-between items-center text-[11px] font-mono border-b border-white/5 pb-1">
                            <span>#{index+1} {tp.name}</span>
                            <span className="text-amber-300">{tp.views} lookups</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Highly active search queries */}
                    <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                      <h4 className="font-display font-semibold text-amber-300 uppercase tracking-wide">Highly Consulted Queries</h4>
                      <div className="space-y-2">
                        {analyticsData.topSearches.slice(0, 5).map((ts: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-[11px] font-mono border-b border-white/5 pb-1 truncate">
                            <span className="truncate max-w-[150px]">"{ts.query_text}"</span>
                            <span className="text-amber-300">{ts.count} times</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Core logs */}
                    <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                      <h4 className="font-display font-semibold text-amber-300 uppercase tracking-wide">CSV Downloads log</h4>
                      <div className="space-y-2">
                        {analyticsData.topDownloads.map((td: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-[11px] font-mono border-b border-white/5 pb-1">
                            <span className="truncate max-w-[150px]">{td.label}</span>
                            <span className="text-amber-300">{td.count} files</span>
                          </div>
                        ))}
                        {analyticsData.topDownloads.length === 0 && <span className="text-gray-400 italic">No files downloaded yet</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* FOOTER METRICS AND CREDITS */}
      <footer className="bg-belmont-navy text-gray-400 text-xs py-8 border-t-4 border-belmont-maroon mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <div className="flex justify-center items-center gap-3">
            <Logo size={36} />
          </div>

          <p className="max-w-xl mx-auto text-[11px] leading-relaxed font-sans text-gray-400">
            Belmont High School Varsity stats aggregation portals are run cooperatively by varsity sports club members. Natural language querying utilizes Google Gemini 1.5 flash-lite endpoints. This system runs on completely free local databases inside sandbox preview environments.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-sans pb-2">
            <a 
              href="https://www.instagram.com/bhs_stats/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-amber-300 font-bold hover:underline flex items-center gap-1"
            >
              <span>Follow us on Instagram: @bhs_stats</span>
            </a>
            <span className="text-white/10">|</span>
            <span className="text-gray-400">
              Varsity Action Photos by:{" "}
              <a href="https://www.instagram.com/benzoflics/" target="_blank" rel="noopener noreferrer" className="text-[#ff5588] font-semibold hover:underline bg-white/5 px-2 py-0.5 rounded">
                @benzoflics
              </a>
              {" and "}
              <a href="https://www.instagram.com/patphotos19/" target="_blank" rel="noopener noreferrer" className="text-[#ff5588] font-semibold hover:underline bg-white/5 px-2 py-0.5 rounded">
                @patphotos19
              </a>
            </span>
          </div>

          <div className="pt-4 border-t border-white/5 text-[10px] text-gray-500 text-center font-mono w-full">
            <span>© {new Date().getFullYear()} Belmont High Stats Club. All Varsity Marauders trademarks respected.</span>
          </div>
        </div>
      </footer>

      {/* ACCREDIT SIGNUP/LOGIN WINDOW MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-100 animate-fade-in text-xs">
            <div className="bg-belmont-navy p-5 text-white border-b-2 border-belmont-maroon text-center">
              <h3 className="font-display font-extrabold uppercase text-base tracking-widest text-[#FFFFFF]">
                {authMode === "login" ? "Contributor Login" : "Register Contributor"}
              </h3>
              <p className="text-[10px] text-blue-200 mt-1">Belmont Stats Certified Club Credentials</p>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-5 space-y-4">
              {authError && (
                <div className="p-2 py-2.5 bg-red-100 text-red-800 rounded font-semibold text-[11px]">
                  {authError}
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-gray-600 block">Personal Club Email</label>
                <input
                  type="email"
                  required
                  value={authMode === "login" ? loginForm.email : registerForm.email}
                  onChange={(e) => {
                    const email = e.target.value;
                    if (authMode === "login") setLoginForm(prev => ({ ...prev, email }));
                    else setRegisterForm(prev => ({ ...prev, email }));
                  }}
                  className="w-full p-2.5 bg-gray-50 border outline-none rounded focus:border-belmont-maroon text-xs"
                  placeholder="editor@belmontstats.com"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-gray-600 block">System Password</label>
                <input
                  type="password"
                  required
                  value={authMode === "login" ? loginForm.password : registerForm.password}
                  onChange={(e) => {
                    const password = e.target.value;
                    if (authMode === "login") setLoginForm(prev => ({ ...prev, password }));
                    else setRegisterForm(prev => ({ ...prev, password }));
                  }}
                  className="w-full p-2.5 bg-gray-50 border outline-none rounded focus:border-belmont-maroon text-xs"
                  placeholder="••••••••"
                />
              </div>

              {authMode === "register" && (
                <div className="space-y-1">
                  <label className="font-semibold text-gray-600 block">Role Assigned</label>
                  <select
                    value={registerForm.role}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full p-2 bg-gray-50 border outline-none rounded focus:border-belmont-maroon text-xs"
                  >
                    <option value="public">Standard Roster Reader</option>
                    <option value="editor">Varsity Stats Editor</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-belmont-maroon hover:bg-belmont-maroon-light text-white font-bold text-xs uppercase rounded transition shadow"
              >
                {authMode === "login" ? "Authenticate User" : "Establish Account"}
              </button>

              <div className="text-center pt-2 border-t text-[11px] text-gray-400 flex justify-between">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                  className="hover:underline font-semibold"
                >
                  {authMode === "login" ? "Create Account &rarr;" : "&larr; Back to Login"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-500 hover:underline"
                >
                  Close Window
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED GRADING SANDBOX COMPONENT INJECTED AT LAST */}
      <DevModeSwitcher
        currentRole={currentUser ? currentUser.role : "public"}
        currentUserEmail={currentUser ? currentUser.email : null}
        onSwitchSession={handleSwitchSession}
        onLogout={handleLogout}
      />
    </div>
  );
}
