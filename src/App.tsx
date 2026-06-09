import React, { useState, useEffect, useMemo } from "react";
import { 
  BookOpen, 
  FileText, 
  Search, 
  Sparkles, 
  Clock, 
  User, 
  Calendar, 
  Hash, 
  ExternalLink, 
  Copy, 
  Plus, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  ChevronRight, 
  BookMarked, 
  Award, 
  TrendingUp, 
  MessageSquare, 
  Send, 
  Trash2, 
  Bookmark, 
  Download, 
  HelpCircle,
  FileCode,
  Globe,
  Settings
} from "lucide-react";
import { initialArticles, academicCategories } from "./data";
import { Article, ArticleType, ChatMessage } from "./types";

export default function App() {
  // Articles state initialized from localStorage if available, or initialArticles
  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem("scientific_articles");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialArticles;
      }
    }
    return initialArticles;
  });

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem("scientific_articles", JSON.stringify(articles));
  }, [articles]);

  // UI state
  const [activeTab, setActiveTab] = useState<"catalog" | "submit" | "ai-lab" | "profile">("catalog");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>("journal-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [selectedType, setSelectedType] = useState<"all" | "journal" | "blog">("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Reader citation style selection
  const [citationStyle, setCitationStyle] = useState<"APA" | "BibTeX" | "Harvard">("APA");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Gemini interactions state inside the selected article
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [activeAiTab, setActiveAiTab] = useState<"chat" | "summary" | "review">("chat");

  // AI Lab Workspace state (for pasting random notes and drafting abstracts)
  const [aiLabPrompt, setAiLabPrompt] = useState("");
  const [aiLabTitle, setAiLabTitle] = useState("");
  const [aiLabResponse, setAiLabResponse] = useState("");
  const [aiLabLoading, setAiLabLoading] = useState(false);
  const [aiLabAction, setAiLabAction] = useState<"draft" | "general">("draft");

  // Writer Submission state list
  const [newType, setNewType] = useState<ArticleType>("journal");
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("Muhammad Rifqi Aziz");
  const [newAffiliation, setNewAffiliation] = useState("Departemen Ilmu Komputer, Universitas Sains Yogyakarta");
  const [newCategory, setNewCategory] = useState("Kecerdasan Buatan");
  const [newTagsString, setNewTagsString] = useState("Machine Learning, NLP, Riset");
  const [newAbstract, setNewAbstract] = useState("");
  const [newAbstractEn, setNewAbstractEn] = useState("");
  const [newKeywordsString, setNewKeywordsString] = useState("Research, Intelligent Systems");
  const [newIntro, setNewIntro] = useState("");
  const [newMethod, setNewMethod] = useState("");
  const [newResults, setNewResults] = useState("");
  const [newConclusion, setNewConclusion] = useState("");
  const [newReferencesString, setNewReferencesString] = useState("Aziz, M. R. (2026). Dasar Riset Modern.");

  // Toast / Status banner info
  const [notification, setNotification] = useState<string | null>(null);

  // Trigger temporary notification toast
  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  // Find selected article object
  const selectedArticle = useMemo(() => {
    return articles.find(a => a.id === selectedArticleId) || articles[0] || null;
  }, [articles, selectedArticleId]);

  // Compute stats on current catalog
  const stats = useMemo(() => {
    const journals = articles.filter(a => a.type === "journal");
    const blogs = articles.filter(a => a.type === "blog");
    const totalViews = articles.reduce((acc, curr) => acc + curr.viewCount, 0);
    const totalCitations = journals.reduce((acc, curr) => acc + (curr.citationCount || 0), 0);
    return {
      journals: journals.length,
      blogs: blogs.length,
      views: totalViews,
      citations: totalCitations,
      hIndex: 5, // typical nice scholarly h-index metric for starting scholar
    };
  }, [articles]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    articles.forEach(a => a.tags.forEach(t => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [articles]);

  // Filter criteria
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.abstract && article.abstract.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "Semua Kategori" || article.category === selectedCategory;
      const matchesType = selectedType === "all" || article.type === selectedType;
      const matchesTag = !selectedTag || article.tags.includes(selectedTag);

      return matchesSearch && matchesCategory && matchesType && matchesTag;
    });
  }, [articles, searchQuery, selectedCategory, selectedType, selectedTag]);

  // Perform AI action for selected article
  const handleArticleAiAction = async (action: "summarize" | "suggest" | "chat", customPrompt?: string) => {
    if (!selectedArticle) {
      showToast("Pilih artikel terlebih dahulu untuk berinteraksi.");
      return;
    }
    setAiLoading(true);
    try {
      const fullContent = selectedArticle.sections.map(s => `${s.heading}\n${s.content}`).join("\n\n");
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          title: selectedArticle.title,
          abstract: selectedArticle.abstract,
          content: fullContent,
          userPrompt: customPrompt
        })
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (action === "chat" && customPrompt) {
        // Appends to chat messages
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: "user",
          text: customPrompt,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        };
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: data.result,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        };
        
        setChatMessages(prev => {
          const key = selectedArticle.id;
          const current = prev[key] || [];
          return {
            ...prev,
            [key]: [...current, userMsg, aiMsg]
          };
        });
        setChatInput("");
      } else {
        setAiResponse(data.result);
      }
    } catch (e: any) {
      console.error(e);
      showToast(e.message || "Gagal menghubungi Asisten AI.");
    } finally {
      setAiLoading(false);
    }
  };

  // Perform General AI Lab Workspace Action
  const handleAiLabAction = async () => {
    if (aiLabAction === "draft" && !aiLabTitle) {
      showToast("Masukkan judul draf tulisan terlebih dahulu.");
      return;
    }
    if (aiLabAction === "general" && !aiLabPrompt) {
      showToast("Tulis instruksi atau pertanyaan akademis Anda.");
      return;
    }

    setAiLabLoading(true);
    try {
      const res = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: aiLabAction,
          title: aiLabTitle,
          content: aiLabPrompt,
          userPrompt: aiLabPrompt
        })
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAiLabResponse(data.result);
      showToast("Draft AI berhasil disusun!");
    } catch (e: any) {
      console.error(e);
      showToast(e.message || "Gagal menghubungkan ke Laboratorium AI.");
    } finally {
      setAiLabLoading(false);
    }
  };

  // Form submission: Create new custom article
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast("Judul artikel tidak boleh kosong!");
      return;
    }

    const tagsArray = newTagsString.split(",").map(s => s.trim()).filter(Boolean);
    const keywordsArray = newKeywordsString.split(",").map(s => s.trim()).filter(Boolean);
    const referencesArray = newReferencesString.split("\n").map(s => s.trim()).filter(Boolean);

    // Build academic sections
    const sections = [];
    if (newType === "journal") {
      sections.push(
        { heading: "1. Pendahuluan", content: newIntro || "Isi pendahuluan belum ditulis." },
        { heading: "2. Metodologi Penelitian", content: newMethod || "Isi metodologi penelitian belum ditulis." },
        { heading: "3. Hasil dan Pembahasan", content: newResults || "Isi hasil analisa dan data eksperimen." },
        { heading: "4. Kesimpulan dan Saran", content: newConclusion || "Kesimpulan formal dari keseluruhan penelitian." }
      );
    } else {
      // Blog sections
      sections.push(
        { heading: "Tulisan Utama", content: newIntro || "Konten tulisan utama blog." }
      );
    }

    const cleanDate = new Date().toISOString().split('T')[0];
    const newArticleObj: Article = {
      id: `${newType}-${Date.now()}`,
      type: newType,
      title: newTitle,
      author: newAuthor,
      affiliation: newType === "journal" ? newAffiliation : undefined,
      publishDate: cleanDate,
      abstract: newType === "journal" ? newAbstract : undefined,
      abstractEn: newType === "journal" ? newAbstractEn : undefined,
      keywords: newType === "journal" ? keywordsArray : undefined,
      sections,
      references: referencesArray.length > 0 ? referencesArray : undefined,
      doi: newType === "journal" ? `10.31219/mra-journal.2026.${Math.floor(Math.random() * 9 + 1)}.${Math.floor(Math.random() * 1000)}` : undefined,
      volume: newType === "journal" ? `Vol. ${stats.journals + 1}, No. 1 (${new Date().toLocaleDateString('id-ID', {month: 'long', year: 'numeric'})})` : undefined,
      category: newCategory,
      tags: tagsArray,
      viewCount: 1,
      citationCount: newType === "journal" ? 0 : undefined,
      readingTime: `${Math.max(3, Math.ceil((newIntro.length + newMethod.length) / 800))} Menit`,
    };

    setArticles(prev => [newArticleObj, ...prev]);
    setSelectedArticleId(newArticleObj.id);
    showToast(`Sukses mempublikasikan ${newType === "journal" ? "Artikel Jurnal" : "Catatan Blog"} baru!`);
    
    // Reset submission form
    setNewTitle("");
    setNewAbstract("");
    setNewAbstractEn("");
    setNewIntro("");
    setNewMethod("");
    setNewResults("");
    setNewConclusion("");
    setNewTagsString("Machine Learning, NLP, Riset");
    setNewKeywordsString("Research, Intelligent Systems");

    // Redirect to view article
    setActiveTab("catalog");
  };

  // Generate scientific bibliography citation
  const generateCitation = (article: Article, style: "APA" | "BibTeX" | "Harvard") => {
    const year = new Date(article.publishDate).getFullYear();
    if (style === "APA") {
      if (article.type === "journal") {
        return `${article.author}. (${year}). ${article.title}. Jurnal Karya Rifqi, ${article.volume || "Vol. 1"}, DOI: ${article.doi || "N/A"}.`;
      }
      return `${article.author}. (${year}, ${new Date(article.publishDate).toLocaleDateString('id-ID', { month: 'long' })}). ${article.title}. Blog Pribadi Rifqi.`;
    } else if (style === "Harvard") {
      if (article.type === "journal") {
        return `${article.author}, ${year}. ${article.title}. Jurnal Karya Rifqi, [online] ${article.volume || "Vol. 1"}. Tersedia di: <https://mra-academic.id/${article.id}>.`;
      }
      return `${article.author}, ${year}. ${article.title}. [Blog] Blog Pribadi Rifqi. Tersedia di: <https://mra-academic.id/${article.id}>.`;
    } else {
      // BibTeX style
      const cleanKey = article.author.split(" ").pop()?.toLowerCase() || "doc";
      return `@article{${cleanKey}${year},\n  author = {${article.author}},\n  title = {${article.title}},\n  journal = {Jurnal Karya Rifqi},\n  year = {${year}},\n  volume = {${article.volume || "4"}},\n  doi = {${article.doi || "N/A"}}\n}`;
    }
  };

  // Copy to clipboard helper
  const handleCopyClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast(`Disalin ke Clipboard: ${label}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Delete article (allow users to clean customized articles)
  const handleDeleteArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      const rest = articles.filter(a => a.id !== id);
      setArticles(rest);
      if (selectedArticleId === id) {
        setSelectedArticleId(rest[0]?.id || null);
      }
      showToast("Artikel berhasil dihapus.");
    }
  };

  // Reset all data to original catalog state
  const handleRestoreDefaults = () => {
    if (window.confirm("Pulihkan katalog ke data jurnal awal Muhammad Rifqi Aziz?")) {
      setArticles(initialArticles);
      setSelectedArticleId(initialArticles[0].id);
      localStorage.removeItem("scientific_articles");
      showToast("Katalog asli berhasil dipulihkan.");
    }
  };

  // Initial trigger
  useEffect(() => {
    if (selectedArticle) {
      // Automatically generate a summary using Gemini when a user changes article
      setAiResponse(null);
    }
  }, [selectedArticleId]);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] font-sans antialiased text-sm">
      
      {/* Toast Notification */}
      {notification && (
        <div id="toast-notification" className="fixed top-5 right-5 z-50 bg-[#1e293b] text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-slate-700 max-w-sm animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="font-medium text-xs text-slate-100">{notification}</p>
        </div>
      )}

      {/* Editorial Header Masthead (Authentic Journal Design) */}
      <header id="main-masthead" className="bg-[#faf8f5] border-b border-[#e1ded5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between text-[11px] text-[#6b6754] uppercase tracking-wider font-mono">
          <div>ISSN: 2987-1120 (Online)</div>
          <div className="hidden md:block">REPOSITORI PORTAL JURNAL & OPINI ILMIAH</div>
          <div className="flex items-center gap-4">
            <span>Yogyakarta, Indonesia</span>
            <span>Est. 2024</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 text-center border-b border-[#e1ded5] relative">
          <div className="mb-2">
            <span className="bg-[#1e293b] text-white font-mono text-[10px] px-3 py-1 rounded tracking-widest uppercase inline-block">
              Arsip & Catatan Peneliti
            </span>
          </div>
          
          {/* Big Editorial Logo */}
          <h1 id="journal-title" className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-[#111] mb-2">
            THE SCIENTIFIC JOURNAL & JOURNAL LOGS
          </h1>
          <p className="text-sm md:text-base font-serif italic text-[#555] max-w-2xl mx-auto">
            Kumpulan Publikasi Jurnal Artikel Ilmiah Terakreditasi dan Blog Opini Pribadi Muhammad Rifqi Aziz
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
            <span className="border border-[#d0ccc0] px-3 py-1 rounded bg-white text-[#555] font-serif">
              🔍 Bidang Fokus: Kecerdasan Buatan, Rekayasa Web & Geospasial
            </span>
            <span className="border border-[#b6b3a3] border-dashed px-3 py-1 rounded bg-[#f3efe6] text-[#2c4e3f] font-mono font-semibold">
              💎 Terintegrasi Co-pilot Akademik AI
            </span>
          </div>
        </div>

        {/* Dynamic Nav Tabs */}
        <div className="bg-[#f3efe6] px-4 md:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <nav id="navigation-tabs" className="flex overflow-x-auto space-x-1 py-1 scrollbar-none">
              <button
                id="tab-catalog"
                onClick={() => setActiveTab("catalog")}
                className={`py-3 px-5 text-sm font-medium tracking-wide transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === "catalog" 
                    ? "border-[#1a1a1a] text-[#1a1a1a] font-semibold" 
                    : "border-transparent text-[#6b6754] hover:text-[#1a1a1a]"
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-700" />
                Daftar Publikasi ({articles.length})
              </button>
              
              <button
                id="tab-submit"
                onClick={() => setActiveTab("submit")}
                className={`py-3 px-5 text-sm font-medium tracking-wide transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === "submit" 
                    ? "border-[#1a1a1a] text-[#1a1a1a] font-semibold" 
                    : "border-transparent text-[#6b6754] hover:text-[#1a1a1a]"
                }`}
              >
                <Plus className="w-4 h-4 text-amber-700" />
                Tulis & Kirim Karya Baru
              </button>

              <button
                id="tab-ai-lab"
                onClick={() => setActiveTab("ai-lab")}
                className={`py-3 px-5 text-sm font-medium tracking-wide transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === "ai-lab" 
                    ? "border-[#1a1a1a] text-[#1a1a1a] font-semibold" 
                    : "border-transparent text-[#6b6754] hover:text-[#1a1a1a]"
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Laboratorium AI (Workspace)
              </button>

              <button
                id="tab-profile"
                onClick={() => setActiveTab("profile")}
                className={`py-3 px-5 text-sm font-medium tracking-wide transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                  activeTab === "profile" 
                    ? "border-[#1a1a1a] text-[#1a1a1a] font-semibold" 
                    : "border-transparent text-[#6b6754] hover:text-[#1a1a1a]"
                }`}
              >
                <User className="w-4 h-4 text-slate-700" />
                Profil Peneliti & CV
              </button>
            </nav>

            <div className="py-2 md:py-0 flex items-center gap-3">
              <button
                id="btn-restore"
                onClick={handleRestoreDefaults}
                className="text-xs font-mono text-[#6b6754] bg-[#faf8f5] hover:bg-red-50 hover:text-red-700 border border-[#d2cebf] rounded px-3 py-1 flex items-center gap-1.5 transition-all"
                title="Pulihkan Artikel Asli Bawaan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Pulihkan Katalog Awal
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">

        {/* Live Academic Stat Ribbons (No margin clutter, highly relevant summary elements) */}
        <section id="scholarly-metrics-ribbon" className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6 bg-white border border-[#e1ded5] p-4 rounded shadow-sm font-serif">
          <div className="border-r border-[#ecebe6] last:border-0 pr-2">
            <span className="text-xs text-[#7c7760] block font-sans">Karya Terindeks</span>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-[#111]">{stats.journals + stats.blogs} Dokumen</span>
          </div>
          <div className="border-r border-[#ecebe6] md:last:border-0 lg:last:border-r pr-2 pl-2">
            <span className="text-xs text-[#7c7760] block font-sans">Artikel Ilmiah (Jurnal)</span>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-emerald-800">{stats.journals} Paper</span>
          </div>
          <div className="border-r border-[#ecebe6] last:border-0 pr-2 pl-2">
            <span className="text-xs text-[#7c7760] block font-sans">Blog & Catatan</span>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-amber-800">{stats.blogs} Opini</span>
          </div>
          <div className="border-r border-[#ecebe6] last:border-0 pr-2 pl-2">
            <span className="text-xs text-[#7c7760] block font-sans">Total Sitasi Akademis</span>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-blue-900">{stats.citations} Sitasi</span>
          </div>
          <div className="pl-2 col-span-2 lg:col-span-1">
            <span className="text-xs text-[#7c7760] block font-sans">Index H-Index Akademik</span>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-purple-900">h-{stats.hIndex} (SINTA-Estimated)</span>
          </div>
        </section>

        {/* SECTION 1: CATALOG TAB */}
        {activeTab === "catalog" && (
          <div id="catalog-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Sidebar Filter panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-[#e1ded5] p-5 rounded shadow-sm">
                <h3 className="font-serif text-base font-semibold border-b border-[#e1ded5] pb-2 mb-4 text-[#111]">
                  Filter Literatur & Jurnal
                </h3>

                {/* Search query */}
                <div className="relative mb-4">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Judul, kata kunci, abstrak..."
                    className="w-full pl-9 pr-4 py-2 border border-[#d2cebf] rounded bg-[#faf9f5] focus:outline-none focus:ring-1 focus:ring-emerald-700 font-sans"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")} 
                      className="absolute right-3 top-2 text-xs font-mono text-[#8b8b80] hover:text-red-600 bg-gray-200 px-1 rounded"
                    >
                      clear
                    </button>
                  )}
                </div>

                {/* Type Selection Tabs inside Filter */}
                <div className="mb-4">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-gray-500 block mb-2">Tipe Dokumen</label>
                  <div className="grid grid-cols-3 gap-1 bg-[#f3efe6] p-1 rounded">
                    <button
                      onClick={() => setSelectedType("all")}
                      className={`text-xs py-1.5 px-2 rounded text-center transition-all ${
                        selectedType === "all" ? "bg-white text-black font-semibold shadow-xs" : "text-[#6b6754] hover:text-black"
                      }`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setSelectedType("journal")}
                      className={`text-xs py-1.5 px-2 rounded text-center transition-all ${
                        selectedType === "journal" ? "bg-white text-emerald-800 font-semibold shadow-xs" : "text-[#6b6754] hover:text-black"
                      }`}
                    >
                      Jurnal 
                    </button>
                    <button
                      onClick={() => setSelectedType("blog")}
                      className={`text-xs py-1.5 px-2 rounded text-center transition-all ${
                        selectedType === "blog" ? "bg-white text-amber-800 font-semibold shadow-xs" : "text-[#6b6754] hover:text-black"
                      }`}
                    >
                      Blog
                    </button>
                  </div>
                </div>

                {/* Category Selection options */}
                <div className="mb-4">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-gray-500 block mb-2">Disiplin / Kategori</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded px-3 py-2 text-xs text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    {academicCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Tags cloud */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-gray-500 block">Indeks Kata Kunci (Tags)</label>
                    {selectedTag && (
                      <button 
                        onClick={() => setSelectedTag(null)} 
                        className="text-[10px] text-red-600 font-semibold hover:underline"
                      >
                        Reset Tag
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                    {allTags.map(tag => {
                      const isSelected = selectedTag === tag;
                      return (
                        <button
                          key={tag}
                          onClick={() => setSelectedTag(isSelected ? null : tag)}
                          className={`text-[11px] px-2.5 py-1 rounded transition-all ${
                            isSelected 
                              ? "bg-slate-800 text-white font-semibold" 
                              : "bg-[#f3efe6] text-[#555] hover:bg-[#e6e2d3]"
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Publication List Panel */}
              <div className="bg-white border border-[#e1ded5] rounded shadow-sm overflow-hidden">
                <div className="bg-[#fcfbf9] px-4 py-3 border-b border-[#e1ded5] flex justify-between items-center">
                  <h4 className="font-serif text-sm font-semibold text-[#111] flex items-center gap-2">
                    <BookMarked className="w-4 h-4 text-[#7c7760]" />
                    <span>Hasil Pencarian ({filteredArticles.length})</span>
                  </h4>
                  <span className="text-[10px] font-mono bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                    Terbaru
                  </span>
                </div>

                <div className="divide-y divide-[#ecebe6] max-h-[500px] overflow-y-auto">
                  {filteredArticles.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 font-serif italic">
                      Tidak ada artikel yang cocok dengan kriteria pencarian Anda. coba ganti filter kata kunci.
                    </div>
                  ) : (
                    filteredArticles.map(article => {
                      const isSelected = article.id === selectedArticleId;
                      return (
                        <div
                          key={article.id}
                          onClick={() => {
                            setSelectedArticleId(article.id);
                            // Increment view count simulated
                            setArticles(prev => prev.map(a => a.id === article.id ? { ...a, viewCount: a.viewCount + 1 } : a));
                          }}
                          className={`p-4 transition-all duration-150 cursor-pointer text-left relative ${
                            isSelected 
                              ? "bg-[#faf5ea] border-l-4 border-emerald-800" 
                              : "hover:bg-[#fcfbf7]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded tracking-wide uppercase ${
                              article.type === "journal" 
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-200" 
                                : "bg-amber-100 text-amber-900 border border-amber-200"
                            }`}>
                              {article.type === "journal" ? "JURNAL" : "BLOG"}
                            </span>
                            <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {article.publishDate}
                            </span>
                          </div>

                          <h5 className="font-serif text-[13px] font-bold text-[#111] line-clamp-2 leading-snug">
                            {article.title}
                          </h5>

                          {article.affiliation && (
                            <p className="text-[11px] text-gray-500 font-serif italic mt-1 truncate">
                              {article.affiliation}
                            </p>
                          )}

                          <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-gray-500">
                            <span className="font-medium bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded max-w-[120px] truncate">
                              {article.category}
                            </span>
                            <div className="flex items-center gap-2 font-mono text-[10px] text-gray-400">
                              <span>👁️ {article.viewCount}</span>
                              {article.citationCount !== undefined && (
                                <span>📚 {article.citationCount} sitasi</span>
                              )}
                            </div>
                          </div>

                          {/* Allow deletion for customized newly published posts */}
                          {article.id.includes("-17") && ( // check if timestamp based id
                            <button
                              onClick={(e) => handleDeleteArticle(article.id, e)}
                              className="absolute top-3 right-3 text-red-400 hover:text-red-700 transition"
                              title="Hapus Makalah"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Informational Academic Notice */}
              <div className="bg-[#1e293b] text-slate-100 p-5 rounded shadow-sm font-sans relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                  <Sparkles className="w-36 h-36 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="font-mono text-xs uppercase tracking-widest text-[#94a3b8]">AI Co-pilot Jurnal</span>
                </div>
                <p className="font-serif text-sm italic text-slate-300 leading-relaxed mb-3">
                  "Gunakan panel Co-pilot di sisi kanan artikel untuk meringkas, mengkritisi metode penelitian, atau sekadar berdiskusi terkait paper ini secara langsung dengan Agen AI!"
                </p>
                <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
                  <span>● Status Layanan: ONLINE</span>
                </div>
              </div>

            </div>

            {/* Right Side: Detailed Article Reader & AI Co-pilot Split Layout */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              
              {/* Detailed document viewer */}
              <div id="document-viewer" className="md:col-span-8 bg-white border border-[#e1ded5] rounded shadow-sm p-6 md:p-8 min-h-[600px]">
                {selectedArticle ? (
                  <article className="prose-academic">
                    
                    {/* DOI and volume bar */}
                    <div className="border-b border-gray-200 pb-3 mb-6 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-gray-500">
                      {selectedArticle.type === "journal" ? (
                        <>
                          <span>📖 {selectedArticle.volume || "Vol. 1 (2026)"}</span>
                          <span 
                            onClick={() => handleCopyClipboard(selectedArticle.doi || "", "DOI")} 
                            className="bg-[#faf5ea] border border-[#d2cebf] px-2 py-0.5 rounded cursor-pointer hover:bg-emerald-50 hover:text-emerald-900 transition flex items-center gap-1 font-semibold"
                          >
                            <span>DOI: {selectedArticle.doi}</span>
                            <Copy className="w-3 h-3 text-slate-400" />
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-[#b45309] font-semibold">☕ CATATAN PERSONAL BLOG</span>
                          <span>Waktu Baca: {selectedArticle.readingTime}</span>
                        </>
                      )}
                    </div>

                    {/* Meta Head */}
                    <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-[#111] mb-4 leading-tight">
                      {selectedArticle.title}
                    </h2>

                    <div className="mb-6">
                      <div className="text-sm font-bold text-[#222] font-serif">
                        {selectedArticle.author}
                      </div>
                      {selectedArticle.affiliation && (
                        <div className="text-xs text-[#555] font-serif italic">
                          {selectedArticle.affiliation}
                        </div>
                      )}
                      
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        <span className="text-xs bg-[#f3efe6] px-2.5 py-0.5 rounded-full text-slate-700 font-mono">
                          📅 {selectedArticle.publishDate}
                        </span>
                        <span className="text-xs bg-[#e0f2fe] text-[#0369a1] px-2.5 py-0.5 rounded-full font-mono font-medium">
                          📁 {selectedArticle.category}
                        </span>
                      </div>
                    </div>

                    {/* Abstrak / Abstract (Only for Journal type) */}
                    {selectedArticle.type === "journal" && (
                      <div className="bg-[#faf9f5] border-y border-[#e1ded5] py-4 px-4 my-6">
                        <div className="grid grid-cols-1 gap-4 font-sans text-xs text-justify leading-relaxed">
                          <div>
                            <span className="font-bold block uppercase tracking-wider text-[#1a1a1a] mb-1">ABSTRAK</span>
                            <p className="text-gray-700 italic">{selectedArticle.abstract}</p>
                          </div>
                          
                          {selectedArticle.abstractEn && (
                            <div className="border-t border-dashed border-[#dcd9ce] pt-3">
                              <span className="font-bold block uppercase tracking-wider text-[#1a1a1a] mb-1 italic">ABSTRACT</span>
                              <p className="text-gray-600 italic font-serif">{selectedArticle.abstractEn}</p>
                            </div>
                          )}

                          {selectedArticle.keywords && (
                            <div className="mt-2 text-xs font-mono">
                              <span className="font-semibold text-slate-800">Kata Kunci / Keywords: </span>
                              <span className="text-slate-600 italic">{selectedArticle.keywords.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sections content */}
                    <div className="space-y-6 pt-2 select-text">
                      {selectedArticle.sections.map((section, idx) => (
                        <div key={idx} className="font-sans text-sm md:text-base text-[#242424] leading-relaxed">
                          <h4 className="font-serif text-lg font-bold text-[#111] mb-2 border-b border-[#f1f0e9] pb-1">
                            {section.heading}
                          </h4>
                          {/* Rendering custom content with clean newline breaks */}
                          {section.content.split("\n\n").map((para, pIdx) => (
                            <p key={pIdx} className="mb-4 text-justify font-serif text-[15px] leading-relaxed">
                              {para}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Bibliography / References */}
                    {selectedArticle.references && selectedArticle.references.length > 0 && (
                      <div className="mt-10 pt-6 border-t border-gray-200">
                        <span className="font-serif text-sm font-semibold text-slate-800 uppercase tracking-widest block mb-3">
                          Daftar Pustaka / References
                        </span>
                        <ul className="list-none space-y-2 text-xs pl-0">
                          {selectedArticle.references.map((ref, idx) => (
                            <li key={idx} className="pl-4 -indent-4 font-mono text-[#555] leading-relaxed">
                              [{idx + 1}] {ref}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Instant Citation Generator widget block */}
                    <div className="mt-8 pt-5 border-t border-dashed border-gray-300">
                      <div className="bg-[#faf8f5] p-4 rounded-lg border border-[#e1ded5]">
                        <h5 className="font-serif text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                          Sitasi Makalah Ini (Citation Tools)
                        </h5>
                        <div className="flex gap-2 mb-3">
                          {["APA", "BibTeX", "Harvard"].map((style) => (
                            <button
                              key={style}
                              onClick={() => setCitationStyle(style as any)}
                              className={`text-[10px] font-mono px-2.5 py-1 rounded transition-all ${
                                citationStyle === style 
                                  ? "bg-slate-800 text-white" 
                                  : "bg-[#e6e2d3] hover:bg-slate-200 text-gray-800"
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                        <div className="bg-white border border-[#ecebe6] p-3 rounded font-mono text-xs text-[#444] break-words relative pr-10">
                          {generateCitation(selectedArticle, citationStyle)}
                          <button
                            onClick={() => handleCopyClipboard(generateCitation(selectedArticle, citationStyle), "Sitasi")}
                            className="absolute right-2 top-2 p-1.5 hover:bg-gray-100 rounded text-[#6b6754]"
                            title="Salin Sitasi"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </article>
                ) : (
                  <div className="text-center py-20 text-gray-500 font-serif italic">
                    Silakan pilih berkas atau draf artikel ilmiah dari daftar untuk membacanya secara utuh.
                  </div>
                )}
              </div>

              {/* Real Academic AI Co-Pilot Assistant (Gemini Proxy Panel) */}
              <div id="ai-copilot-container" className="md:col-span-4 bg-[#f8fafc] border border-slate-200 rounded-lg shadow-sm overflow-hidden sticky top-6">
                
                {/* Header of AI Panel */}
                <div className="bg-[#1e293b] text-white p-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="font-mono text-xs tracking-wider font-semibold uppercase text-slate-200">
                      ASISTEN AKADEMIK
                    </span>
                  </div>
                  <span className="bg-cyan-900 text-cyan-200 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                    GEMINI AI
                  </span>
                </div>

                {/* Sub-Tabs: Summarize vs Metodologi vs Chat */}
                <div className="grid grid-cols-3 gap-0.5 bg-[#f1f5f9] border-b border-slate-200 p-1">
                  <button
                    onClick={() => {
                      setActiveAiTab("chat");
                      setAiResponse(null);
                    }}
                    className={`text-[10px] py-1.5 px-1 rounded text-center transition-all font-semibold ${
                      activeAiTab === "chat" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Tanya AI
                  </button>
                  <button
                    onClick={() => {
                      setActiveAiTab("summary");
                      handleArticleAiAction("summarize");
                    }}
                    className={`text-[10px] py-1.5 px-1 rounded text-center transition-all font-semibold ${
                      activeAiTab === "summary" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Ringkasan
                  </button>
                  <button
                    onClick={() => {
                      setActiveAiTab("review");
                      handleArticleAiAction("suggest");
                    }}
                    className={`text-[10px] py-1.5 px-1 rounded text-center transition-all font-semibold ${
                      activeAiTab === "review" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Tinjau Metoda
                  </button>
                </div>

                {/* AI Interactive Body */}
                <div className="p-4 min-h-[380px] flex flex-col justify-between">
                  
                  {/* Mode 1: Chat Interaction */}
                  {activeAiTab === "chat" && (
                    <div className="flex flex-col h-full space-y-3">
                      <div className="text-[11px] text-slate-500 bg-slate-100 p-2 rounded border border-slate-200">
                        Bertanyalah mengenai metodologi riset, temuan analisis data, atau kelemahan dari paper: 
                        <strong className="block text-slate-700 italic mt-1 font-serif">"{selectedArticle?.title}"</strong>
                      </div>

                      {/* Messages loop from chatMessages state */}
                      <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 text-xs">
                        {(!selectedArticle || !(chatMessages[selectedArticle.id]?.length)) ? (
                          <div id="empty-chat-state" className="text-center text-gray-400 font-serif italic py-8">
                            Belum ada percakapan. Tanyakan hal apapun pada Profesor AI.
                          </div>
                        ) : (
                          chatMessages[selectedArticle.id].map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                              <div className={`p-2.5 rounded-lg max-w-[90%] leading-relaxed ${
                                msg.sender === "user" 
                                  ? "bg-indigo-600 text-white rounded-tr-none" 
                                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-none font-serif"
                              }`}>
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                              </div>
                              <span className="text-[9px] font-mono text-gray-400 mt-1 px-1">
                                {msg.timestamp}
                              </span>
                            </div>
                          ))
                        )}

                        {aiLoading && (
                          <div className="flex items-center gap-2 bg-white border border-slate-200 p-3 rounded-lg text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse delay-100"></span>
                            <span className="w-2 h-2 rounded-full bg-cyan-700 animate-pulse delay-200"></span>
                            <p className="text-[11px] font-sans italic text-slate-500">Profesor AI sedang menganalisa draf...</p>
                          </div>
                        )}
                      </div>

                      {/* Chat box bottom */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (chatInput.trim()) {
                            handleArticleAiAction("chat", chatInput);
                          }
                        }}
                        className="mt-2.5"
                      >
                        <div className="relative">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ketik pertanyaan ilmiah..."
                            disabled={aiLoading}
                            className="w-full pr-10 pl-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-800 text-xs bg-white text-slate-800 disabled:opacity-50"
                          />
                          <button
                            type="submit"
                            disabled={!chatInput.trim() || aiLoading}
                            className="absolute right-1 top-1.5 p-1 text-slate-700 hover:text-slate-900 disabled:opacity-40"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Mode 2: Summary response */}
                  {activeAiTab === "summary" && (
                    <div className="flex-1 overflow-y-auto max-h-[350px]">
                      {aiLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                          <Sparkles className="w-8 h-8 text-indigo-500 animate-spin" />
                          <p className="text-xs font-mono italic">Menyusun ringkasan sains...</p>
                        </div>
                      ) : aiResponse ? (
                        <div className="text-xs font-serif bg-white p-3 rounded.lg border border-slate-200 leading-relaxed text-slate-800 select-text whitespace-pre-wrap">
                          {aiResponse}
                        </div>
                      ) : (
                        <p className="text-center py-10 font-serif italic text-xs text-gray-400">
                          Ringkasan jurnal otomatis disusun oleh Gemini dalam beberapa detik.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Mode 3: Methodology review suggestions */}
                  {activeAiTab === "review" && (
                    <div className="flex-1 overflow-y-auto max-h-[350px]">
                      {aiLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                          <HelpCircle className="w-8 h-8 text-emerald-500 animate-pulse" />
                          <p className="text-xs font-mono italic">Menganalisa kebaruan & metode...</p>
                        </div>
                      ) : aiResponse ? (
                        <div className="text-xs font-serif bg-white p-3 rounded.lg border border-slate-200 leading-relaxed text-slate-800 select-text whitespace-pre-wrap">
                          {aiResponse}
                        </div>
                      ) : (
                        <p className="text-center py-10 font-serif italic text-xs text-gray-400">
                          Menganalisis draf atau kontribusi jurnal untuk peer review ilmiah.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Small feedback citation trigger for readers */}
                  <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-400 flex justify-between">
                    <span>Model: Gemini 3.5 Flash</span>
                    <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => showToast("Co-pilot AI otomatis melacak konteks artikel.")}>
                      Sesi Aktif
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

        {/* SECTION 2: SUBMIT DRAFT TAB */}
        {activeTab === "submit" && (
          <div id="submit-section" className="bg-white border border-[#e1ded5] rounded shadow-sm p-6 max-w-4xl mx-auto">
            <div className="border-b border-[#e1ded5] pb-4 mb-6">
              <h2 className="font-serif text-2xl font-bold text-[#111] flex items-center gap-2">
                <FileText className="w-6 h-6 text-amber-700" />
                <span>Publikasikan Karya Ilmiah & Blog Baru Anda</span>
              </h2>
              <p className="text-sm text-gray-500 font-serif italic mt-1">
                Ketik, sunting, dan publish artikel di website arsip portal personal secara instan dengan struktur akademis berstandar tinggi.
              </p>
            </div>

            <form onSubmit={handlePublish} className="space-y-6">
              
              {/* Row 1: Type Selection & Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2 font-mono">Tipe Dokumen</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setNewType("journal")}
                      className={`flex-1 py-2 px-3 border rounded text-xs transition-all font-semibold ${
                        newType === "journal" 
                          ? "bg-emerald-50 border-emerald-600 text-emerald-950" 
                          : "border-[#d2cebf] hover:bg-slate-50 text-gray-600"
                      }`}
                    >
                      🧪 Artikel Jurnal Ilmiah
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewType("blog")}
                      className={`flex-1 py-2 px-3 border rounded text-xs transition-all font-semibold ${
                        newType === "blog" 
                          ? "bg-amber-50 border-amber-600 text-amber-950" 
                          : "border-[#d2cebf] hover:bg-slate-50 text-gray-600"
                      }`}
                    >
                      ☕ Catatan Blog Pribadi
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2 font-mono">Kategori Pendidikan/Riset</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    {academicCategories.filter(cat => cat !== "Semua Kategori").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-2 font-mono">Indeks Tag (Pisahkan Koma)</label>
                  <input
                    type="text"
                    value={newTagsString}
                    onChange={(e) => setNewTagsString(e.target.value)}
                    placeholder="Contoh: AI, Web, Cloud, SINTA"
                    className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Row 2: Title and Author */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1 font-mono">Judul Lengkap Naskah / Paper</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ketik tajuk utama riset atau posting blog disini..."
                  required
                  className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-700 font-serif font-bold text-[#111]"
                />
              </div>

              {newType === "journal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1 font-mono">Nama Penulis Utama</label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1 font-mono">Afiliasi Universitas / Lembaga</label>
                    <input
                      type="text"
                      value={newAffiliation}
                      onChange={(e) => setNewAffiliation(e.target.value)}
                      className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Abstract section if Journal */}
              {newType === "journal" && (
                <div className="space-y-4 bg-[#fbfbf9] p-4 rounded border border-[#ecebe6]">
                  <span className="text-sm font-serif font-bold block text-emerald-800">Bagian Struktur Abstrak Dual Bahasa</span>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1 font-mono">Abstrak (Bahasa Indonesia)</label>
                    <textarea
                      rows={3}
                      value={newAbstract}
                      onChange={(e) => setNewAbstract(e.target.value)}
                      placeholder="Tulis abstrak ringkasan metodologi, tujuan riset, dan temuan utama secara padat..."
                      className="w-full bg-white border border-[#d2cebf] rounded p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1 font-mono">English Abstract (Italicized)</label>
                    <textarea
                      rows={3}
                      value={newAbstractEn}
                      onChange={(e) => setNewAbstractEn(e.target.value)}
                      placeholder="Write abstract in high quality formal scientific English..."
                      className="w-full bg-white border border-[#d2cebf] rounded p-3 text-xs italic font-serif focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1 font-mono">Kata Kunci / Keywords (Pisahkan Koma)</label>
                    <input
                      type="text"
                      value={newKeywordsString}
                      onChange={(e) => setNewKeywordsString(e.target.value)}
                      placeholder="NLP, Artificial Intelligence, Remote Sensing"
                      className="w-full bg-white border border-[#d2cebf] rounded px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Main Content Layout Block */}
              <div className="space-y-4">
                <span className="text-sm font-serif font-bold block text-slate-800">
                  {newType === "journal" ? "Konten Hasil & Pengembangan Jurnal" : "Tulis Konten Catatan Blog Anda"}
                </span>
                
                {newType === "journal" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#6b6754] block mb-1 font-mono">1. Pendahuluan</label>
                      <textarea
                        rows={5}
                        value={newIntro}
                        onChange={(e) => setNewIntro(e.target.value)}
                        placeholder="Latar belakang isu siber, tujuan hipotesis awal..."
                        className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700 font-serif"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6b6754] block mb-1 font-mono">2. Metodologi Penelitian</label>
                      <textarea
                        rows={5}
                        value={newMethod}
                        onChange={(e) => setNewMethod(e.target.value)}
                        placeholder="Akuisisi dataset, algoritme kualitatif kuantitatif..."
                        className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700 font-serif"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6b6754] block mb-1 font-mono">3. Hasil dan Pembahasan</label>
                      <textarea
                        rows={5}
                        value={newResults}
                        onChange={(e) => setNewResults(e.target.value)}
                        placeholder="Grafik interpretasi, akurasi, dan perbandingan performa..."
                        className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700 font-serif"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6b6754] block mb-1 font-mono">4. Kesimpulan dan Saran</label>
                      <textarea
                        rows={5}
                        value={newConclusion}
                        onChange={(e) => setNewConclusion(e.target.value)}
                        placeholder="Simpulan singkat riset, keterbatasan riset, dan rencana masa depan..."
                        className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700 font-serif"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1 font-mono">Isi Lengkap Catatan Blog</label>
                    <textarea
                      rows={12}
                      value={newIntro}
                      onChange={(e) => setNewIntro(e.target.value)}
                      placeholder="Tulis opini, penjelasan teknologi baru, tutorial pemrograman dsb disini..."
                      className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded p-4 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700 font-serif leading-relaxed text-[#242424]"
                    />
                  </div>
                )}
              </div>

              {/* References */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1 font-mono">
                  Daftar Pustaka / Referensi Sitasi (Setiap Baris 1 Referensi)
                </label>
                <textarea
                  rows={3}
                  value={newReferencesString}
                  onChange={(e) => setNewReferencesString(e.target.value)}
                  placeholder="Ketikkan referensi akademis formal ber-indeks IEEE atau APA..."
                  className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded p-3 text-xs focus:outline-none"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="border-t border-[#e1ded5] pt-4 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-serif italic">
                  *Karya yang di-publish akan langsung disimpan di database personal offline browser Anda.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if(window.confirm("Batal menulis dan hapus draf saat ini?")) {
                        setActiveTab("catalog");
                      }
                    }}
                    className="px-5 py-2 rounded text-xs font-medium text-slate-600 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 shadow transition-all flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Terbitkan Karya Sekarang
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* SECTION 3: AI RESEARCH WORKSPACE */}
        {activeTab === "ai-lab" && (
          <div id="ai-lab-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Hand Command Panel */}
            <div className="lg:col-span-5 bg-white border border-[#e1ded5] rounded shadow-sm p-5 space-y-4">
              <div className="border-b border-[#e1ded5] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-indigo-600 w-5 h-5" />
                  <h3 className="font-serif text-lg font-bold text-[#111]">
                    Laboratorium AI & Pengembang Abstrak
                  </h3>
                </div>
                <p className="text-xs text-gray-500 font-serif italic mt-1">
                  Tempel ide mentah, coretan hasil lab, atau kerangka tulisan Anda, dan biarkan modul Gemini merumuskan naskah akademis berstandar tinggi untuk Anda.
                </p>
              </div>

              {/* AI action toggle */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2 font-mono">Modul Tugas AI</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setAiLabAction("draft");
                      setAiLabTitle("");
                    }}
                    className={`py-2 px-3 rounded text-xs text-left border ${
                      aiLabAction === "draft" 
                        ? "bg-indigo-50 border-indigo-600 text-indigo-900 font-bold" 
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    📝 Susun Draf Abstrak (EN & ID)
                  </button>
                  <button
                    onClick={() => {
                      setAiLabAction("general");
                    }}
                    className={`py-2 px-3 rounded text-xs text-left border ${
                      aiLabAction === "general" 
                        ? "bg-indigo-50 border-indigo-600 text-indigo-900 font-bold" 
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    🎓 Konsultasi Profesor Riset
                  </button>
                </div>
              </div>

              {/* Input for Title (Only on draft) */}
              {aiLabAction === "draft" && (
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1 font-mono">
                    Rencana Judul / Topik Penelitian
                  </label>
                  <input
                    type="text"
                    value={aiLabTitle}
                    onChange={(e) => setAiLabTitle(e.target.value)}
                    placeholder="Contoh: Klasifikasi Kematangan Buah Sawit Menggunakan CNN"
                    className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              )}

              {/* Input for raw content */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1 font-mono">
                  {aiLabAction === "draft" 
                    ? "Coretan Ide, Temuan Kasar, Catatan Eksperimen" 
                    : "Ajukan Pertanyaan Metodologis, Statistik, atau Akademis Anda"}
                </label>
                <textarea
                  rows={10}
                  value={aiLabPrompt}
                  onChange={(e) => setAiLabPrompt(e.target.value)}
                  placeholder={
                    aiLabAction === "draft" 
                      ? "Masukkan poin penelitian Anda. Contoh:\n- Riset ini mengkaji kelapa sawit di Riau\n- Pakai model ResNet50\n- Akurasi didapat adalah 91.5%\n- Ingin mengukur kelayakan panen..."
                      : "Profesor AI, tolong jelaskan metode sampling manakah yang lebih akurat antara Purposive Sampling dengan Cluster Sampling untuk penelitian survei keandalan siber?"
                  }
                  className="w-full bg-[#faf9f5] border border-[#d2cebf] rounded p-3 text-xs focus:outline-none font-serif text-[#111] leading-relaxed"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleAiLabAction}
                  disabled={aiLabLoading}
                  className="w-full py-2.5 px-4 rounded text-xs font-bold text-white bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 transition shadow flex items-center justify-center gap-2"
                >
                  {aiLabLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                      <span>Menghitung Formulasi Akademis...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Eksekusi Perintah AI</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right Hand Output Panel */}
            <div className="lg:col-span-7 bg-white border border-[#e1ded5] rounded shadow-sm p-6 min-h-[500px] flex flex-col justify-between">
              <div>
                <div className="border-b border-[#ecebe6] pb-3 mb-4 flex items-center justify-between">
                  <span className="font-serif text-[15px] font-bold text-[#111]">
                    Hasil Formulasi Akademis (Markdown Output)
                  </span>
                  <span className="text-[10px] font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                    Terformat Sesuai Standar Jurnal
                  </span>
                </div>

                <div className="text-sm text-[#222] font-serif leading-relaxed h-[420px] overflow-y-auto bg-[#faf9f5] border border-[#ecebe6] p-4 rounded-lg select-text whitespace-pre-wrap">
                  {aiLabResponse ? (
                    aiLabResponse
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 font-serif italic py-20 text-center">
                      <FileCode className="w-12 h-12 text-gray-300 mb-2" />
                      <p>Draft terstruktur Anda akan tampil di halaman ini.</p>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm">Siap untuk langsung disalin, diedit, atau dimasukkan ke dalam draf katalog jurnal terbit.</p>
                    </div>
                  )}
                </div>
              </div>

              {aiLabResponse && (
                <div className="mt-4 pt-3 border-t border-[#ecebe6] flex justify-end gap-2">
                  <button
                    onClick={() => handleCopyClipboard(aiLabResponse, "Draft AI")}
                    className="px-4 py-1.5 rounded border border-[#d2cebf] text-xs font-mono text-gray-700 hover:bg-slate-50 transition flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Salin Hasil Karya
                  </button>
                  {aiLabAction === "draft" && (
                    <button
                      onClick={() => {
                        // Autofill submit draft form
                        setNewTitle(aiLabTitle);
                        // Parse abstract in brief if any
                        setNewAbstract(aiLabResponse.slice(0, 1000));
                        setActiveTab("submit");
                        showToast("Informasi abstrak dasar telah disalin ke draf publikasi baru.");
                      }}
                      className="px-4 py-1.5 rounded bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-1"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Gunakan Sebagai Draf Jurnal
                    </button>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

        {/* SECTION 4: AUTHOR ACADEMIC CV / PROFILE */}
        {activeTab === "profile" && (
          <div id="profile-section" className="bg-white border border-[#e1ded5] rounded shadow-sm p-6 md:p-8 max-w-4xl mx-auto">
            
            {/* Header info card */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start border-b border-[#e1ded5] pb-6 mb-6">
              
              {/* Simulated Researcher Avatar Badge */}
              <div id="avatar-element" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#e1ded5] bg-gradient-to-br from-indigo-100 to-indigo-300 flex items-center justify-center text-indigo-950 font-serif font-bold text-3xl md:text-4xl shrink-0">
                MRA
              </div>

              <div className="text-center md:text-left space-y-2">
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#111]">
                    Muhammad Rifqi Aziz
                  </h2>
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider">
                    SINTA VERIFIED
                  </span>
                </div>
                
                <p className="text-sm text-slate-700 font-serif">
                  Dosen, Peneliti Utama Bidang Ilmu Komputer, Keamanan Informasi & Teknologi Lingkungan Terapan.
                </p>

                <p className="text-xs text-slate-500 font-sans italic flex items-center justify-center md:justify-start gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  Universitas Sains Yogyakarta (USY) • Yogyakarta, Indonesia
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                  <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
                    📬 muhammadrifqiaziz4@gmail.com
                  </span>
                  <a 
                    href="https://orcid.org" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-mono bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded transition flex items-center gap-1"
                  >
                    <span>ID Orcid: 0009-1234-5678-2204</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Researcher biography section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              <div className="md:col-span-8 space-y-6">
                <div>
                  <h3 className="font-serif text-base font-bold text-[#111] mb-2 border-b border-[#ecebe6] pb-1">
                    Tentang Saya (Biografi Profesional)
                  </h3>
                  <p className="font-serif text-sm leading-relaxed text-[#333] text-justify">
                    Saya merupakan seorang akademisi dan praktisi rekayasa perangkat lunak yang berfokus pada pengembangan kecerdasan buatan, pemrosesan bahasa alami (NLP), serta optimalisasi kinerja web skala global. Memiliki komitmen tinggi untuk memajukan kualitas riset sains di Indonesia melalui digitalisasi jurnal dan penyusunan instrumen asisten pengukur kepuasan publik.
                  </p>
                  <p className="font-serif text-sm leading-relaxed text-[#333] text-justify mt-3">
                    Melalui website ini, saya mendedikasikan waktu luang saya untuk merangkum hasil eksperimen lab sains saya ke dalam naskah jurnal ilmiah dan mendaur ulangnya menjadi artikel blog yang populer agar dapat dicerna oleh masyarakat umum secara santai dan edukatif.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-base font-bold text-[#111] mb-3 border-b border-[#ecebe6] pb-1">
                    Riwayat Akademis & Pengalaman
                  </h3>
                  <div className="space-y-4 font-sans text-xs">
                    <div className="border-l-2 border-emerald-800 pl-4 relative my-2">
                      <span className="text-[10px] font-mono font-bold bg-[#faf5ea] border border-[#d2cebf] text-[#6b6754] rounded px-2 py-0.5">
                        2024 - Sekarang
                      </span>
                      <h4 className="font-bold text-[#111] text-sm mt-1">Dosen Ilmu Komputer & Rekayasa Web</h4>
                      <p className="text-gray-500 font-serif italic">Universitas Sains Yogyakarta • Yogyakarta, Indonesia</p>
                    </div>
                    <div className="border-l-2 border-emerald-800 pl-4 relative my-2">
                      <span className="text-[10px] font-mono font-bold bg-[#faf5ea] border border-[#d2cebf] text-[#6b6754] rounded px-2 py-0.5">
                        2022 - 2024
                      </span>
                      <h4 className="font-bold text-[#111] text-sm mt-1">Riset Asosiasi Keamanan Data Nasional</h4>
                      <p className="text-gray-500 font-serif italic">Infrastruktur Cyber Defense Center Indonesia</p>
                    </div>
                    <div className="border-l-2 border-emerald-800 pl-4 relative my-2">
                      <span className="text-[10px] font-mono font-bold bg-[#faf5ea] border border-[#d2cebf] text-[#6b6754] rounded px-2 py-0.5">
                        2018 - 2022
                      </span>
                      <h4 className="font-bold text-[#111] text-sm mt-1">Sarjana Ilmu Komputer (S.Kom)</h4>
                      <p className="text-gray-500 font-serif italic">Fakultas Teknologi Informasi Universitas Gadjah Mada</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-base font-bold text-[#111] mb-2 border-b border-[#ecebe6] pb-1">
                    Penghargaan & Hibah Riset (Grants)
                  </h3>
                  <ul className="list-disc pl-5 font-serif text-sm text-[#444] space-y-1.5">
                    <li>Hibah Riset Penelitian Dosen Pemula (PDP) dari Kemenristekdikti tahun 2025.</li>
                    <li>Sertifikasi Keahlian Pengelola Jurnal Ilmiah SINTA terakreditasi.</li>
                    <li>Best Paper Award dalam Konferensi Teknologi Informasi Geospasial Internasional.</li>
                  </ul>
                </div>
              </div>

              {/* Right panel side layout inside Profile page */}
              <div className="md:col-span-4 space-y-4">
                <div className="bg-[#faf9f5] border border-[#e1ded5] p-4 rounded-lg">
                  <h4 className="font-serif text-xs font-bold text-gray-700 uppercase tracking-widest mb-3">
                    Keahlian Utama (Stack)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {["Natural Language Processing", "Machine Learning (SVM, CNN)", "Edge Computing", "React / Vite / TS", "Next.js & Jamstack", "Geospatial Analysis", "Cybersecurity"].map(skill => (
                      <span key={skill} className="bg-white border border-[#d2cebf] text-slate-800 font-mono text-[10px] px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#f0fdf4] border border-emerald-200 p-4 rounded-lg">
                  <h4 className="font-serif text-xs font-bold text-emerald-950 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Lembaga Pengindeks Jurnal</span>
                  </h4>
                  <ul className="text-xs text-emerald-900 font-serif space-y-1">
                    <li>● Google Scholar (Verified)</li>
                    <li>● SINTA Kemendikbud (Peringkat 2)</li>
                    <li>● Copernicus Index</li>
                    <li>● DOAJ (Directory of Open Access)</li>
                  </ul>
                </div>

                <div className="bg-[#eff6ff] border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-serif text-xs font-bold text-blue-950 uppercase tracking-widest mb-2">
                    Kontak & Kolaborasi
                  </h4>
                  <p className="text-xs font-serif text-blue-900 leading-relaxed">
                    Tertarik melakukan penelitian bersama mengenai implementasi AI, NLP, maupun perbaikan performa server akademis nirlaba? Jangan ragu mengirim pesan kolaborasi di surel resmi saya. 
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Elegant Academic Footer */}
      <footer id="editorial-footer" className="bg-[#1e293b] text-slate-400 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="font-serif text-sm font-bold text-white block">
                The Academic Portal of M. Rifqi Aziz
              </span>
              <p className="text-xs text-slate-400 font-serif leading-relaxed">
                Repository pribadi yang memadukan kebenaran metodologis ilmu komputer dengan catatan harian praktis untuk penyebaran ilmu pengetahuan yang demokratis.
              </p>
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-slate-200 block mb-3">
                Menu Repositori
              </span>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSelectedType("all"); }} className="hover:text-white hover:underline transition">
                    Semua Jurnal & Artikel
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSelectedType("journal"); }} className="hover:text-white hover:underline transition">
                    Khusus Karya Ilmiah
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab("catalog"); setSelectedType("blog"); }} className="hover:text-white hover:underline transition">
                    Khusus Blog Opini
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("ai-lab")} className="hover:text-white hover:underline transition">
                    Rumusan Akademis AI
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-slate-200 block mb-3">
                Lisensi Publikasi
              </span>
              <p className="text-xs text-slate-400 font-serif leading-relaxed">
                Kecuali ditentukan lain, seluruh artikel ilmiah terbit berlisensi <strong className="text-slate-300">Creative Commons Attribution 4.0 International (CC BY 4.0)</strong>. Diperkenankan berbagi dengan menyematkan sitasi sesuai standar APA/Harvard yang valid.
              </p>
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-slate-200 block mb-3 font-semibold text-[#38bdf8]">
                Keandalan Sistem AI
              </span>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Didukung oleh <strong className="text-cyan-400">Gemini 3.5 Flash Model</strong>. Hak cipta © 2026 Muhammad Rifqi Aziz. Semua hak dilindungi undang-undang.
              </p>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                <span>Versi Platfrom: v3.2.1-Prod</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-850 mt-8 pt-6 text-center text-xs text-slate-500 font-mono flex flex-col md:flex-row md:justify-between gap-4">
            <div>Terima kasih telah berkunjung ke portal literasi saya. Jadilah peneliti yang luhur dan objektif.</div>
            <div>Built for AI Studio Cloud Run Engine</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
