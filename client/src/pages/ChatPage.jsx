import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, ChevronDown, LogOut, Search, Menu, X, Plus, Loader2, User,
  UploadCloud, FolderOpen, Brain, ClipboardList, FileText, Sparkles,
  Volume2, VolumeX, Mic, MicOff, HelpCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { speechService, extractVocabulariesFromMessage, extractOptionArabic } from '../utils/speechHelper';
import { 
  GRADE_CONFIGS, 
  GRADE_KEYS, 
  normalizeGrade, 
  getGradeConfig, 
  getAllThemesForGrade,
  getAllThemesFlat
} from '../constants/gradeCurriculum';
import BukuPanduanModal from '../components/BukuPanduanModal';

// Import local assets
import assetPetunjuk from '../assets/Asset petunjuk.png';
import assetPengaturan from '../assets/asset Pengaturan.png';
import assetChat from '../assets/asset chat.png';
import assetDiskusiBaru from '../assets/asset diskusi baru.png';
import assetGuided from '../assets/asset guided.png';
import assetLatihanSoal from '../assets/asset latihan soal.png';
import assetModeBelajar from '../assets/asset mode belajar.png';
import assetSesiBelajar from '../assets/asset sesi belajar.png';
import assetSocratic from '../assets/asset socratic.png';
import iconAIKakIfham from '../assets/icon AI Pahamin.png';
import iconPerson from '../assets/icon person.png';

const ChatPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Audio & Speech States
  const [activeSpeakingIndex, setActiveSpeakingIndex] = useState(null);
  const [activePlayingVocab, setActivePlayingVocab] = useState(null);
  const [isListening, setIsListening] = useState(false);
  
  // States and refs for revisions
  const [showPlusOptions, setShowPlusOptions] = useState(false);
  const [showThinkingTrace, setShowThinkingTrace] = useState(false);
  const [showPanduanModal, setShowPanduanModal] = useState(false);
  const [showAllThemes, setShowAllThemes] = useState(false);
  const fileInputRef = useRef(null);
  const chatInputRef = useRef(null);

  // Grade & Curriculum States (Akomodasi 5 Tingkatan Kelas Rekomendasi Ahli Materi)
  const initialGradeKey = normalizeGrade(user?.grade || '3');
  const [activeGradeKey, setActiveGradeKey] = useState(initialGradeKey);

  // Sync with user's grade when user profile changes
  useEffect(() => {
    if (user?.grade) {
      const normalized = normalizeGrade(user.grade);
      setActiveGradeKey(normalized);
      const conf = getGradeConfig(normalized);
      if (conf?.allowedThemes?.length > 0) {
        setActiveTopicId(conf.allowedThemes[0].id);
      }
    }
  }, [user?.grade, user?.id]);

  const activeGradeConfig = getGradeConfig(activeGradeKey);
  const gradeThemes = activeGradeConfig.allowedThemes;
  const topicSessions = showAllThemes ? getAllThemesFlat() : gradeThemes;

  const [activeTopicId, setActiveTopicId] = useState(gradeThemes[0]?.id || 'k3-hewan');
  const [activeMode, setActiveMode] = useState('socratic');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const API_URL = '/api/chat';

  const handleGradeChange = (newGradeKey) => {
    setActiveGradeKey(newGradeKey);
    const conf = getGradeConfig(newGradeKey);
    const firstThemeId = conf.allowedThemes[0].id;
    setActiveTopicId(firstThemeId);
    setToastMessage(`Beralih ke kurikulum ${conf.label}: ${conf.badge}`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const getInitialHistory = (topicId, mode, gradeKey) => {
    const curConfig = getGradeConfig(gradeKey);
    const allThemes = getAllThemesFlat();
    const topic = allThemes.find(t => t.id === topicId) || curConfig.allowedThemes[0];
    const topicName = topic ? topic.name : 'Materi Belajar';

    if (mode === 'guided') {
      return [{
        role: 'assistant',
        content: `Assalamu'alaikum sahabat ceria! 🌟 Di petualangan **${topicName}**, Kak Ifham akan bimbing kamu tebak kata Arab yang seru langkah demi langkah! Siap kita mulai tebakan pertama?\n\n[OPSI: Bismillah, siap mulai! 🚀 | Tebak hewan lucu 🦁 | Hitung angka 🔢]`
      }];
    } else if (mode === 'latihan') {
      return [{
        role: 'assistant',
        content: `🎯 **Kuis Teka-Teki Ceria** 🎯\n\nYuk main kuis tebakan seru tentang **${topicName}**! Siap tebak soal pertamanya?\n\n[OPSI: Bismillah, siap mulai! 🚀 | Kasih soal pertama 🎯 | Berikan petunjuk 💡]`
      }];
    } else {
      if (topic && topic.initialMessage) {
        return [{ role: 'assistant', content: topic.initialMessage }];
      }
      return [{
        role: 'assistant',
        content: `Assalamu'alaikum sahabat ceria! 🌟 Hari ini Kak Ifham temani kamu belajar **${topicName}**. Mau mulai dari mana jagoan?\n\n[OPSI: Mau tebak kata Arab! 🌟 | Dengar pelafalan suara 🔊 | Coba kuis teka-teki 🎯]`
      }];
    }
  };

  // Sync sessionId and load history/initial messages whenever activeGradeKey, activeTopicId, or activeMode changes
  useEffect(() => {
    const key = `sessionId_${activeGradeKey}_${activeTopicId}_${activeMode}`;
    let storedSessionId = localStorage.getItem(key);
    
    setSessionId(storedSessionId || null);

    if (storedSessionId) {
      const loadHistoryDirect = async (sid) => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${API_URL}/history/${sid}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data && res.data.length > 0) {
            setMessages(res.data);
          } else {
            const initialMessages = getInitialHistory(activeTopicId, activeMode, activeGradeKey);
            setMessages(initialMessages);
          }
        } catch (err) {
          console.error("Failed to load history", err);
          const initialMessages = getInitialHistory(activeTopicId, activeMode, activeGradeKey);
          setMessages(initialMessages);
        }
      };
      loadHistoryDirect(storedSessionId);
    } else {
      const initialMessages = getInitialHistory(activeTopicId, activeMode, activeGradeKey);
      setMessages(initialMessages);
    }
  }, [activeGradeKey, activeTopicId, activeMode, user?.id]);
  
  const messagesEndRef = useRef(null);

  const handleFileUploadClick = () => {
    setShowPlusOptions(false);
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessages(prev => [...prev, { role: 'user', content: `[Mengunggah dokumen: ${file.name}]` }]);
    setLoading(true);
    setShowPlusOptions(false);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Wah, dokumen **${file.name}** berhasil diunggah! 📁\n\nBerdasarkan isi dokumen tersebut, mari kita diskusikan bersama. Apa yang ingin kamu tanyakan atau bagian mana yang menurutmu paling sulit dipahami dari materi ini?` 
      }]);
      setLoading(false);
    }, 1200);

    e.target.value = '';
  };

  const handleOptionLatihanSoal = () => {
    setShowPlusOptions(false);
    setInput("Tolong buatkan beberapa soal latihan mengenai topik ini dong!");
    chatInputRef.current?.focus();
  };

  const handleOptionRingkasan = () => {
    setShowPlusOptions(false);
    setInput("Bisa tolong buatkan ringkasan materi dari diskusi kita ini?");
    chatInputRef.current?.focus();
  };

  const renderThinkingTraceModal = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowThinkingTrace(false)}
          className="absolute inset-0 bg-[#0f172a]"
        />
        
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative z-10 border border-slate-100 text-[#1E3A5F] text-left max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EAF9F9] flex items-center justify-center text-[#00B4B4]">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black font-sans leading-tight">AI Thinking Trace & Kurikulum</h3>
                <span className="text-[11px] font-black text-[#00B4B4]">{activeGradeConfig.label} • {activeGradeConfig.badge}</span>
              </div>
            </div>
            <button 
              onClick={() => setShowThinkingTrace(false)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Active Grade Curriculum Badge Box */}
          <div className="mb-5 p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-sm">🎯</span>
              <div>
                <span className="font-black text-[#008383]">Fokus Capaian: </span>
                <span className="font-bold text-[#1E3A5F]">{activeGradeConfig.focus}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm">⛔</span>
              <div>
                <span className="font-black text-amber-700">Batasan Ahli Materi: </span>
                <span className="font-bold text-[#1E3A5F]">{activeGradeConfig.boundaryDescription}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm">📚</span>
              <div>
                <span className="font-black text-blue-700">Tema Resmi: </span>
                <span className="font-bold text-[#1E3A5F]">{activeGradeConfig.themes.join(', ')}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-bold mb-5 leading-relaxed font-sans">
            Alur penalaran Socratic 4 tahap ini dirancang agar santri cilik menemukan konsep bahasa Arab secara mandiri tanpa disuapi jawaban:
          </p>

          <div className="space-y-5 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 font-sans">
            <div className="flex gap-4 relative">
              <div className="w-9 h-9 rounded-full bg-[#EAF9F9] border-2 border-white flex items-center justify-center text-[#00B4B4] font-black text-sm z-10 shadow-sm shrink-0">
                1
              </div>
              <div>
                <h5 className="text-sm font-black">Tahap 1: Asesmen Pengetahuan Awal</h5>
                <p className="text-xs text-slate-500 font-bold mt-0.5 leading-relaxed">
                  Mendeteksi kosakata yang sudah dikenal santri seputar {activeGradeConfig.themes[0]} dan mengaitkannya dengan pengalaman sehari-hari.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="w-9 h-9 rounded-full bg-[#EBF5FF] border-2 border-white flex items-center justify-center text-blue-500 font-black text-sm z-10 shadow-sm shrink-0">
                2
              </div>
              <div>
                <h5 className="text-sm font-black">Tahap 2: Pemberian Pertanyaan Pemantik</h5>
                <p className="text-xs text-slate-500 font-bold mt-0.5 leading-relaxed">
                  Memberikan teka-teki, opsi pilihan, dan ciri fisik tanpa langsung membocorkan jawaban agar santri berpikir aktif.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="w-9 h-9 rounded-full bg-[#F5F3FF] border-2 border-white flex items-center justify-center text-purple-500 font-black text-sm z-10 shadow-sm shrink-0">
                3
              </div>
              <div>
                <h5 className="text-sm font-black">Tahap 3: Scaffolding Kaidah {activeGradeConfig.shortLabel}</h5>
                <p className="text-xs text-slate-500 font-bold mt-0.5 leading-relaxed">
                  Membimbing perakitan kalimat sesuai batasan: {activeGradeConfig.focus}.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="w-9 h-9 rounded-full bg-[#FFF9E6] border-2 border-white flex items-center justify-center text-amber-500 font-black text-sm z-10 shadow-sm shrink-0">
                4
              </div>
              <div>
                <h5 className="text-sm font-black">Tahap 4: Penguatan & Umpan Balik Positif</h5>
                <p className="text-xs text-slate-500 font-bold mt-0.5 leading-relaxed">
                  Merayakan keberhasilan berpikir, merefleksikan arti makhraj, dan menyajikan tantangan ceria berikutnya.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2 font-sans">
            <button 
              type="button"
              onClick={() => {
                setShowThinkingTrace(false);
                setShowPanduanModal(true);
              }}
              className="flex-1 py-2.5 px-3 bg-teal-50 hover:bg-teal-100 text-[#008383] border border-teal-200/60 rounded-xl font-black text-xs transition-all text-center"
            >
              📖 Buka Matriks Kurikulum 5 Kelas
            </button>
            <button 
              onClick={() => setShowThinkingTrace(false)}
              className="py-2.5 px-5 bg-[#1E3A5F] hover:bg-[#152a46] text-white rounded-xl font-black text-xs transition-all shadow-sm"
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const displayName = user?.name || "Budi Saputra";
  const firstName = displayName.split(' ')[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // Initial history helper moved above useEffect

  const handleModeChange = (mode) => {
    setActiveMode(mode);
  };

  const handleTopicChange = (topicId) => {
    setActiveTopicId(topicId);
    setSidebarOpen(false);
  };

  // Helper for parsing quick options from assistant messages
  const extractOptions = (content) => {
    if (!content) return { cleanText: '', options: [] };
    const match = content.match(/\[OPSI:\s*(.*?)\]/is);
    if (!match) return { cleanText: content, options: [] };
    const cleanText = content.replace(/\[OPSI:\s*(.*?)\]/is, '').trim();
    const options = match[1].split('|').map(o => o.trim()).filter(Boolean);
    return { cleanText, options };
  };

  // Helper for generating client-side dummy Socratic responses matching the 5 grade curricula
  const generateClientSocraticDummyResponse = (message, mode, topicId, msgCount, gradeKey) => {
    const norm = normalizeGrade(gradeKey);
    const msgLower = (message || '').toLowerCase();
    const curConfig = getGradeConfig(norm);
    const allThemes = getAllThemesFlat();
    const currentTopic = allThemes.find(t => t.id === topicId)?.name || curConfig.allowedThemes[0].name;

    // KELAS 1: Kata tunjuk (haza/hazihi), angka 1-10, huruf hijaiyah
    if (norm === '1') {
      const isAngka = topicId === 'k1-angka' || currentTopic.toLowerCase().includes('angka') || currentTopic.toLowerCase().includes('nomor') || currentTopic.toLowerCase().includes('hitung');

      if (msgLower.includes('ringkasan') || msgLower.includes('rangkuman')) {
        if (isAngka) {
          return `🌟 **Rangkuman Angka 1-10 bersama Kak Ifham** 🌟\n\nAlhamdulillah! Kamu sudah hafal berhitung angka:\n\n1. **وَاحِدٌ** (*Waahidun*) = Satu ☝️\n2. **اِثْنَانِ** (*Itsnaani*) = Dua ✌️\n3. **ثَلَاثَةٌ** (*Tsalaatsatun*) = Tiga 3️⃣\n4. **خَمْسَةٌ** (*Khamsatun*) = Lima 🖐️\n5. **عَشَرَةٌ** (*Asyarotun*) = Sepuluh 🔟\n\nKamu pintar sekali! Mau ulangi berhitung bersama?\n\n[OPSI: Ulangi suara angka 🔊 | Hitung angka 1-10 🔢 | Coba kuis bintang 🎯]`;
        }
        return `🌟 **Rangkuman Bintang Kelas 1 bersama Kak Ifham** 🌟\n\nAlhamdulillah! Kamu sudah hebat belajar di topik **${currentTopic}**:\n\n1. **هٰذَا** (*Haadzaa*) = Ini (untuk laki-laki)\n2. **هٰذِهِ** (*Haadzihi*) = Ini (untuk perempuan)\n3. **وَاحِدٌ** (*Waahidun*) = Satu ☝️, **اِثْنَانِ** (*Itsnaani*) = Dua ✌️\n\nKamu hebat sekali! Mau lanjut tebakan berikutnya?\n\n[OPSI: هٰذَا أَبِي (Ini ayahku) 👨 | هٰذِهِ أُمِّي (Ini ibuku) 👩 | Hitung angka 1-10! 🔢]`;
      }

      if (msgLower.includes('latihan') || msgLower.includes('soal') || mode === 'latihan') {
        if (isAngka) {
          return `🎯 **Kuis Angka Ceria!** 🎯\n\nSetelah angka satu (**وَاحِدٌ**), angka DUA dalam bahasa Arab apa ya jagoan?\n\n[OPSI: A. اِثْنَانِ (Itsnaani = 2) ✌️ | B. ثَلَاثَةٌ (Tsalaatsatun = 3) 3️⃣ | C. خَمْسَةٌ (Khamsatun = 5) 🖐️]`;
        }
        return `🎯 **Kuis Teka-Teki Ceria!** 🎯\n\nKak Ifham punya gambar buah apel manis (**تُفَّاحَةٌ** / *Tuffaahatun*). Kata tunjuk mana yang tepat ya?\n\n[OPSI: A. هٰذِهِ تُفَّاحَةٌ (Haadzihi) 🍎 | B. هٰذَا تُفَّاحَةٌ (Haadzaa) 🍎 | C. وَاحِدٌ (Waahidun) ☝️]`;
      }

      if (isAngka) {
        const k1AngkaDialogues = [
          `Assalamu'alaikum sahabat kecil! 🌟 Yuk kita berhitung 1 sampai 10! Angka satu adalah **وَاحِدٌ** (*Waahidun* = 1) ☝️. Setelah angka satu, angka DUA apa ya?\n\n[OPSI: A. اِثْنَانِ (Itsnaani = 2) ✌️ | B. ثَلَاثَةٌ (Tsalaatsatun = 3) 3️⃣ | C. خَمْسَةٌ (Khamsatun = 5) 🖐️]`,
          `Keren! ✌️ **اِثْنَانِ** (*Itsnaani*) itu dua! Nah, kalau angka TIGA (3) bahasa Arabnya apa jagoan?\n\n[OPSI: A. ثَلَاثَةٌ (Tsalaatsatun = 3) 3️⃣ | B. أَرْبَعَةٌ (Arba'atun = 4) 4️⃣ | C. خَمْسَةٌ (Khamsatun = 5) 🖐️]`,
          `Mumtaz! ⭐ Sekarang coba tebak: jari di satu tanganmu ada LIMA (5). Bahasa Arabnya apa ya?\n\n[OPSI: A. خَمْسَةٌ (Khamsatun = 5) 🖐️ | B. سِتَّةٌ (Sittatun = 6) 6️⃣ | C. عَشَرَةٌ (Asyarotun = 10) 🔟]`,
          `MasyaAllah hebat sekali! 👏 Kalau jari kedua tanganmu ada SEPULUH (10), bahasa Arabnya apa?\n\n[OPSI: A. عَشَرَةٌ (Asyarotun = 10) 🔟 | B. تِسْعَةٌ (Tis'atun = 9) 9️⃣ | C. ثَمَانِيَةٌ (Tsamaaniyatun = 8) 8️⃣]`
        ];
        return k1AngkaDialogues[(msgCount - 1) % k1AngkaDialogues.length] || k1AngkaDialogues[0];
      }

      const k1Dialogues = [
        `Assalamu'alaikum sahabat kecil! 🌟 Senang sekali belajar **${currentTopic}** bareng kamu! Coba perhatikan huruf pertama dari kata **أَبٌ** (*Abun = Ayah*). Huruf apa ya?\n\n[OPSI: A. Huruf Alif (أ) 🌟 | B. Huruf Ba (ب) 🎈 | C. Huruf Ta (ت) 🎀]`,
        `Mumtaz jagoan! 👏 Kalau orangnya laki-laki dekat kita, ucapkan **هٰذَا** (*Haadzaa*). Kalau ini ayahku, bahasa Arabnya adalah:\n\n[OPSI: A. هٰذَا أَبِي (Haadzaa abii) 👨 | B. هٰذِهِ أُمِّي (Haadzihi ummii) 👩 | C. ثَلَاثَةٌ (Tsalaatsatun) 3️⃣]`,
        `Wah kamu pintar sekali! ⭐ Sekarang mari kita berhitung ya! Angka satu adalah **وَاحِدٌ** (*Waahidun*). Setelah angka satu, angka dua apa ya?\n\n[OPSI: A. اِثْنَانِ (Itsnaani = 2) ✌️ | B. ثَلَاثَةٌ (Tsalaatsatun = 3) 3️⃣ | C. خَمْسَةٌ (Khamsatun = 5) 🖐️]`,
        `MasyaAllah kamu hebat sekali! 🌟 Mau lanjut tebakan seru lainnya bareng Kak Ifham?\n\n[OPSI: Mau tebak buah apel! 🍎 | Ulangi suara pelafalan 🔊 | Buat rangkuman bintang 📝]`
      ];
      return k1Dialogues[(msgCount - 1) % k1Dialogues.length] || k1Dialogues[0];
    }

    // KELAS 3: Pola tanya jawab dasar (Hal indaka?, Maza tuhibbu?)
    if (norm === '3') {
      const isHewan = topicId === 'k3-hewan' || currentTopic.toLowerCase().includes('hewan');

      if (msgLower.includes('ringkasan') || msgLower.includes('rangkuman')) {
        if (isHewan) {
          return `🌟 **Rangkuman Hewan Ceria bersama Kak Ifham** 🌟\n\nMumtaz! Kamu sudah lancar mengenal nama-nama hewan:\n\n1. **قِطٌّ** (*Qit-thun*) = Kucing 🐱\n2. **بَقَرَةٌ** (*Baqaratun*) = Sapi 🐄\n3. **أَسَدٌ** (*Asadun*) = Singa 🦁\n4. **سَمَكٌ** (*Samakun*) = Ikan 🐟\n\nKamu hebat sekali! Mau lanjut tebak hewan lainnya?\n\n[OPSI: Tanya tentang hewan 🦁 | Dengar pelafalan suara 🔊 | Latihan kuis teka-teki 🎯]`;
        }
        return `🌟 **Rangkuman Percakapan Kelas 3 bersama Kak Ifham** 🌟\n\nMumtaz! Kamu sudah lancar bertanya-jawab tentang **${currentTopic}**:\n\n1. **هَلْ عِنْدَكَ...؟** (*Hal 'indaka...?*) = Apakah kamu punya...?\n2. **نَعَمْ، عِنْدِي...** (*Na'am, 'indii...*) = Ya, saya punya...\n3. **مَاذَا تُحِبُّ...؟** (*Maadzaa tuhibbu...?*) = Apa yang kamu sukai?\n\n[OPSI: Tanya tentang hewan 🦁 | Tanya tentang olahraga ⚽ | Latihan kuis bintang 🎯]`;
      }

      if (msgLower.includes('latihan') || msgLower.includes('soal') || mode === 'latihan') {
        if (isHewan) {
          return `🎯 **Kuis Teka-Teki Hewan!** 🎯\n\nHewan ini suka makan ikan dan bersuara 'Meong...' (**قِطٌّ** / *Qit-thun*). Kalau kamu punya kucing di rumah, apa jawabanmu?\n\n[OPSI: A. نَعَمْ، عِنْدِي قِطٌّ (Ya, aku punya kucing) 🐱 | B. لَا، مَا عِنْدِي (Tidak, aku tidak punya) ❌ | C. أُحِبُّ السَّمَكَ (Aku suka ikan) 🐟]`;
        }
        return `🎯 **Kuis Tanya Jawab Kelas 3!** 🎯\n\nJika Kak Ifham bertanya: **هَلْ عِنْدَكَ قِطٌّ؟** (*Hal 'indaka qitthun?*). Jika kamu punya, jawabannya adalah:\n\n[OPSI: A. نَعَمْ، عِنْدِي قِطٌّ (Na'am, 'indii) 🐱 | B. لَا، مَا عِنْدِي (Laa, maa 'indii) ❌ | C. أُحِبُّ الكَلْبَ 🐶]`;
      }

      if (isHewan) {
        const k3HewanDialogues = [
          `Assalamu'alaikum sahabat ceria! 🌟 Di topik **Hewan (الحَيَوَانَات)**, Kak Ifham mau tanya nih: **مَاذَا تُحِبُّ مِنَ الحَيَوَانَاتِ؟** (*Maadzaa tuhibbu minal-hayawaanaat?* = Hewan apa yang kamu sukai?).\n\n[OPSI: A. أُحِبُّ القِطَّ (Aku suka kucing) 🐱 | B. أُحِبُّ الأَسَدَ (Aku suka singa) 🦁 | C. أُحِبُّ الفِيلَ (Aku suka gajah) 🐘]`,
          `Pilihan yang keren! ⭐ Kalau hewan berkaki empat penghasil susu segar yang bunyinya 'Moo...', dalam bahasa Arab apa ya?\n\n[OPSI: A. بَقَرَةٌ (Baqaratun = Sapi) 🐄 | B. خَرُوفٌ (Khoruufun = Domba) 🐑 | C. قِرْدٌ (Qirdun = Monyet) 🐒]`,
          `Mumtaz jagoan! 👏 Sekarang coba tebak sang raja hutan yang gagah perkasa mengaum 'Roaaar!' 🦁:\n\n[OPSI: A. أَسَدٌ (Asadun = Singa) 🦁 | B. نَمِرٌ (Namirun = Harimau) 🐅 | C. دُبٌّ (Dubbun = Beruang) 🐻]`,
          `Keren sekali! 🌟 Nah kalau hewan yang pandai berenang di air dan punya sirip apa ya?\n\n[OPSI: A. سَمَكٌ (Samakun = Ikan) 🐟 | B. طَائِرٌ (Thoo-irun = Burung) 🦜 | C. فِيلٌ (Fiilun = Gajah) 🐘]`
        ];
        return k3HewanDialogues[(msgCount - 1) % k3HewanDialogues.length] || k3HewanDialogues[0];
      }

      const k3Dialogues = [
        `Assalamu'alaikum sahabat ceria! 🌟 Di topik **${currentTopic}**, Kak Ifham mau tanya nih: **مَاذَا تُحِبُّ؟** (*Maadzaa tuhibbu?* = Apa yang kamu sukai?).\n\n[OPSI: A. أُحِبُّ القِطَّ (Aku suka kucing) 🐱 | B. أُحِبُّ كُرَةَ القَدَمِ (Aku suka bola) ⚽ | C. أُحِبُّ السِّبَاحَةَ (Aku suka renang) 🏊]`,
        `Wah pilihan yang hebat! 👏 Kalau Kak Ifham bertanya: **هَلْ عِنْدَكَ كُرَةٌ؟** (*Hal 'indaka kurotun?* = Apakah kamu punya bola?), apa jawabanmu?\n\n[OPSI: A. نَعَمْ، عِنْدِي كُرَةٌ (Ya, aku punya bola) ⚽ | B. لَا، مَا عِنْدِي (Tidak, aku tidak punya) ❌ | C. أُحِبُّ السِّبَاحَةَ (Aku suka renang) 🏊]`,
        `Mumtaz! Jawabanmu sangat fasih! 👏 Sekarang coba tebak: Kalau teman sedang demam (**حُمَّى** / *Hummaa*), apa jawaban saat ditanya keadaannya?\n\n[OPSI: A. عِنْدِي حُمَّى (Aku sedang demam) 🤒 | B. أَنَا بِخَيْرٍ (Aku baik) 🌟 | C. أُحِبُّ الدَّوَاءَ 💊]`,
        `Subhanallah, kamu jagoan tanya-jawab bahasa Arab yang hebat! 🌟 Mau rangkum kosakata yang sudah dipelajari?\n\n[OPSI: Buatkan rangkuman! 📝 | Lanjut tebak kata baru 🌟 | Coba kuis berikutnya 🎯]`
      ];
      return k3Dialogues[(msgCount - 1) % k3Dialogues.length] || k3Dialogues[0];
    }

    // KELAS 4: Pengenalan gender (Muzakkar/Muannats) & Fi'il Mudhari' dasar
    if (norm === '4') {
      if (msgLower.includes('ringkasan') || msgLower.includes('rangkuman')) {
        return `🌟 **Rangkuman Materi Kelas 4 bersama Kak Ifham** 🌟\n\nAlhamdulillah! Kamu sudah memahami gender & kata kerja sekarang pada topik **${currentTopic}**:\n\n1. **Gender Profesi**: **طَبِيبٌ** (Dokter lk) vs **طَبِيبَةٌ** (Dokter pr)\n2. **Fi'il Mudhari'**: **هُوَ يَعْمَلُ** (*Huwa ya'malu*) vs **هِيَ تَعْمَلُ** (*Hiya ta'malu*)\n3. **Aktivitas Sekarang**: **أَنَا أُسَاعِدُ أُمِّي** (*Anaa usaa'idu ummii*)\n\n[OPSI: Lanjut tebak profesi dokter 👨‍⚕️ | Latihan Fi'il Mudhari' 📝 | Coba kuis gender 🎯]`;
      }
      if (msgLower.includes('latihan') || msgLower.includes('soal') || mode === 'latihan') {
        return `🎯 **Kuis Gender & Fi'il Mudhari' Kelas 4!** 🎯\n\nFatimah adalah seorang dokter perempuan (**طَبِيبَةٌ**). Dia sedang memeriksa pasien di rumah sakit. Kata kerja sekarang (Fi'il Mudhari') yang tepat adalah:\n\n[OPSI: A. هِيَ تَفْحَصُ (Hiya taf-hashu) 👩‍⚕️ | B. هُوَ يَفْحَصُ (Huwa yaf-hashu) 👨‍⚕️ | C. هُوَ يَقْرَأُ (Huwa yaqro-u) 📖]`;
      }
      const k4Dialogues = [
        `Assalamu'alaikum sobat cerdas Kelas 4! 💼 Di topik **${currentTopic}**, kita belajar membedakan profesi Muzakkar & Muannats. Kalau guru laki-laki adalah **مُدَرِّسٌ**, guru perempuan apa ya?\n\n[OPSI: A. مُدَرِّسَةٌ (Mudarrisatun) 👩‍🏫 | B. طَبِيبَةٌ (Thobiibatun) 👩‍⚕️ | C. شُرْطِيٌّ (Syurthiyyun) 👮]`,
        `Ahsanto! Tepat sekali karena ada Ta Marbuthah (ة)! 🌟 Kalau Ahmad (laki-laki) sedang membaca buku, kita ucapkan **هُوَ يَقْرَأُ**. Tapi kalau Aisyah yang sedang membaca, menjadi apa ya?\n\n[OPSI: A. هِيَ تَقْرَأُ (Hiya taqro-u) 👧 | B. هُوَ يَكْتُبُ (Huwa yaktubu) 👦 | C. هِيَ يَقْرَأُ (Bentuk salah) ❌]`,
        `Mumtaz! Huruf mudhara'ah berganti dari Ya menjadi Ta! 👏 Nah kalau cita-citamu ingin menjadi insinyur arsitek laki-laki di masa depan, bahasa Arabnya apa?\n\n[OPSI: A. مُهَنْدِسٌ (Muhandisun) 👷 | B. مُهَنْدِسَةٌ (Muhandisatun) 👷‍♀️ | C. طَيَّارٌ (Thoyyaarun) ✈️]`,
        `Hebat sekali penalaranmu tentang gender dan kata kerja hari ini! ⭐ Kamu sudah siap menjadi santri yang mahir tata bahasa Arab.\n\n[OPSI: Rangkum belajarku! 📝 | Lanjut aktivitas di rumah 🏠 | Coba soal kuis 🎯]`
      ];
      return k4Dialogues[(msgCount - 1) % k4Dialogues.length] || k4Dialogues[0];
    }

    // KELAS 5: Susunan kalimat Mubtada' & Khabar serta Kata Sifat (Na'at)
    if (norm === '5') {
      if (msgLower.includes('ringkasan') || msgLower.includes('rangkuman')) {
        return `🌟 **Rangkuman Kalimat Kelas 5 bersama Kak Ifham** 🌟\n\nSubhanallah! Kamu berhasil menyusun kalimat indah pada topik **${currentTopic}**:\n\n1. **Mubtada' & Khabar**: **الفَصْلُ نَظِيفٌ** (*Al-fashlu nazhiifun* = Kelas itu bersih)\n2. **Kesesuaian Muannats**: **غُرْفَةُ الجُلُوسِ مُرَتَّبَةٌ** (*Ghurfatul juluusi murattabatun*)\n3. **Kata Sifat (Na'at)**: **حَدِيقَةٌ كَبِيرَةٌ** (*Hadiiqatun kabiiratun* = Kebun luas)\n\n[OPSI: Susun kalimat ruang tamu 🛋️ | Pelajari sifat anggota tubuh 🖐️ | Kuis Mubtada' Khabar 🎯]`;
      }
      if (msgLower.includes('latihan') || msgLower.includes('soal') || mode === 'latihan') {
        return `🎯 **Kuis Mubtada' & Na'at Kelas 5!** 🎯\n\nKantin sekolah kita sangat luas dan bersih (**المَقْصَفُ** / *Al-Maqshafu*). Bagaimanakah susunan kalimat Mubtada' dan Khabar yang benar?\n\n[OPSI: A. المَقْصَفُ وَاسِعٌ وَنَظِيفٌ 🍲 | B. المَقْصَفُ وَاسِعَةٌ (Bentuk salah) ❌ | C. مَقْصَفٌ كَبِيرَةٌ 🏫]`;
      }
      const k5Dialogues = [
        `Assalamu'alaikum penjelajah bahasa Arab Kelas 5! 🏛️ Di topik **${currentTopic}**, kita belajar kalimat deskriptif. Coba lihat ruang tamu: **غُرْفَةُ الجُلُوسِ ...**. Kata sifat yang cocok untuk menyatakan "rapi" adalah?\n\n[OPSI: A. مُرَتَّبَةٌ (Murattabatun) 🛋️ | B. مُرَتَّبٌ (Murattabun - tanpa ta) 🛋️ | C. صَغِيرٌ (Shoghiirun) 📦]`,
        `Mumtaz! Karena kata *Ghurfah* muannats, kata sifatnya wajib memakai ta marbuthah: **مُرَتَّبَةٌ**! 👏 Coba lihat anggota tubuh kita: Mata yang indah dalam bahasa Arab adalah **عَيْنٌ جَمِيلَةٌ**. Mengapa pakai *jamiilatun*?\n\n[OPSI: A. Karena mata berpasangan (muannats) 👀 | B. Karena mata muzakkar 👁️ | C. Keduanya benar 🤔]`,
        `MasyaAllah tepat sekali! 🌟 Sekarang kalau kita pergi ke kebun binatang yang luas, kalimat bahasa Arabnya adalah:\n\n[OPSI: A. حَدِيقَةُ الحَيَوَانَاتِ وَاسِعَةٌ 🦒 | B. الحَدِيقَةُ جَمِيلٌ 🌳 | C. قَفَصٌ صَغِيرَةٌ 🦜]`,
        `Kamu sangat cerdas merangkai Mubtada' dan Na'at! 🌟 Pemahaman tata bahasamu sudah setara santri berprestasi.\n\n[OPSI: Buat ringkasan materi! 📝 | Lanjut bahas kantin sekolah 🍲 | Tantang kuis bintang 🎯]`
      ];
      return k5Dialogues[(msgCount - 1) % k5Dialogues.length] || k5Dialogues[0];
    }

    // KELAS 6: Perubahan waktu kata kerja utuh (Fi'il Madhi, Mudhari', Amr) & Narasi masa lalu
    if (norm === '6') {
      if (msgLower.includes('ringkasan') || msgLower.includes('rangkuman')) {
        return `🌟 **Rangkuman Narasi & 3 Waktu Fi'il Kelas 6** 🌟\n\nAllahu Akbar! Kamu sudah menguasai dimensi waktu kata kerja utuh pada topik **${currentTopic}**:\n\n1. **Fi'il Madhi (Lampau)**: **ذَهَبْتُ إِلَى الشَّاطِئِ** (*Aku telah pergi ke pantai*)\n2. **Fi'il Mudhari' (Sekarang)**: **أَذْهَبُ مَعَ أُسْرَتِي** (*Aku sedang pergi*)\n3. **Fi'il Amr (Perintah)**: **اِذْهَبْ بِسَلَامَةٍ!** (*Pergilah dengan selamat!*)\n4. **Waktu & Jam**: **فِي السَّاعَةِ السَّابِعَةِ صَبَاحًا** (*Pada jam 7 pagi*)\n\n[OPSI: Cerita liburan ke pantai 🏖️ | Latihan tasyrif 3 waktu kata kerja ⏰ | Kuis narasi masa lalu 🎯]`;
      }
      if (msgLower.includes('latihan') || msgLower.includes('soal') || mode === 'latihan') {
        return `🎯 **Kuis 3 Dimensi Waktu Kata Kerja Kelas 6!** 🎯\n\nPerhatikan narasi ini: "Kemarin Ahmad telah mengunjungi rumah kakeknya". Bentuk Fi'il Madhi (lampau) yang tepat adalah:\n\n[OPSI: A. زَارَ أَحْمَدُ جَدَّهُ (Zaaro = Telah mengunjungi) 🏡 | B. يَزُورُ أَحْمَدُ (Yazuuru = Sedang mengunjungi) 🚗 | C. زُرْ يَا أَحْمَدُ (Zur = Kunjungilah!) 📣]`;
      }
      const k6Dialogues = [
        `Assalamu'alaikum sahabat mahir Kelas 6! ⏰ Di topik **${currentTopic}**, kita belajar menceritakan kegiatan masa lalu dan perubahan kata kerja 3 waktu. Kalau kata kerjanya adalah "Membaca":\n- Lampau: **قَرَأَ** (*Qoro-a*)\n- Sekarang: **يَقْرَأُ** (*Yaqro-u*)\nBagaimana bentuk perintahnya (Fi'il Amr)?\n\n[OPSI: A. اِقْرَأْ (Iqro'! = Bacalah!) 📖 | B. قَرَأْتُ (Qoro'tu = Aku telah baca) ✍️ | C. تَقْرَأُ (Taqro-u) 👓]`,
        `Mumtaz! *Iqra'* adalah kata kerja perintah pertama dalam Al-Qur'an! 🌟 Saat menceritakan piknik: "Pada jam tujuh pagi kami berangkat bersama keluarga". Jam tujuh pagi dalam bahasa Arab adalah:\n\n[OPSI: A. فِي السَّاعَةِ السَّابِعَةِ صَبَاحًا 🕖 | B. فِي السَّاعَةِ الخَامِسَةِ مَسَاءً 🕔 | C. فِي السَّاعَةِ الوَاحِدَةِ ظُهْرًا 🕐]`,
        `Luar biasa lancar! 👏 Jika kamu bercerita bahwa kamu sendiri yang pergi liburan ke pantai, kata kerja Madhi untuk "Saya telah pergi" adalah:\n\n[OPSI: A. ذَهَبْتُ (Dzahabtu = Saya telah pergi) 🏖️ | B. ذَهَبَ (Dzahaba = Dia telah pergi) 🚶 | C. نَذْهَبُ (Nadzhabu = Kami sedang pergi) 🚌]`,
        `MasyaAllah, narasi bahasa Arabmu sangat runtut dan kaya kosakata! ⭐ Kamu siap melanjutkan ke jenjang MTs/SMP dengan prestasi gemilang.\n\n[OPSI: Rangkum narasiku! 📝 | Lanjut bercerita piknik 🧺 | Tantangan kuis akhir 🎯]`
      ];
      return k6Dialogues[(msgCount - 1) % k6Dialogues.length] || k6Dialogues[0];
    }

    return `Assalamu'alaikum sahabat pintar! 🌟 Senang sekali belajar bersama kamu tentang **${currentTopic}**. Apa yang ingin kamu tanyakan pada Kak Ifham hari ini?\n\n[OPSI: Tanya materi 📚 | Latihan soal 🎯 | Petunjuk belajar 💡]`;
  };

  // Focused Vocabulary Pronunciation handler
  const handlePlayVocab = (arabic, phonetic, id) => {
    if (activePlayingVocab === id) {
      speechService.stop();
      setActivePlayingVocab(null);
      return;
    }

    speechService.stop();
    setActiveSpeakingIndex(null);
    setActivePlayingVocab(id);

    speechService.speakVocab(arabic, phonetic, {
      onEnd: () => setActivePlayingVocab(null)
    });
  };

  // Speak handler using Web Speech API (whole sentence)
  const handleSpeak = (text, index) => {
    if (activeSpeakingIndex === index) {
      speechService.stop();
      setActiveSpeakingIndex(null);
      return;
    }

    speechService.stop();
    setActivePlayingVocab(null);
    const { cleanText } = extractOptions(text);
    setActiveSpeakingIndex(index);
    speechService.speak(cleanText, {
      onEnd: () => setActiveSpeakingIndex(null)
    });
  };

  // Voice Input (Speech-to-Text) handler
  const handleVoiceInput = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    if (!speechService.isRecognitionSupported()) {
      setToastMessage('Browser tidak mendukung mikrofon Speech-to-Text.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    setIsListening(true);
    speechService.startListening({
      lang: 'id-ID',
      onResult: (transcript) => {
        setInput(transcript);
        setIsListening(false);
      },
      onError: () => setIsListening(false),
      onEnd: () => setIsListening(false)
    });
  };

  // Send an option directly when clicking quick pill
  const handleSendOption = (optionText) => {
    if (loading) return;
    sendMessageDirect(optionText);
  };

  const sendMessageDirect = async (userMessage) => {
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    const userMsgCount = newMessages.filter(m => m.role === 'user').length;
    const currentTopicObj = topicSessions.find(t => t.id === activeTopicId) || activeGradeConfig.allowedThemes[0];

    try {
      const token = localStorage.getItem('token');
      const reqData = {
        message: userMessage,
        sessionId: sessionId,
        mode: activeMode,
        topic: currentTopicObj?.name || 'Hewan (الحَيَوَانَات)',
        grade: activeGradeConfig.label
      };

      if (!sessionId) {
        const initialHistory = getInitialHistory(activeTopicId, activeMode, activeGradeKey);
        reqData.seedHistory = initialHistory;
      }

      const res = await axios.post(`${API_URL}/message`, reqData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
      if (!sessionId) {
        setSessionId(res.data.sessionId);
        localStorage.setItem(`sessionId_${activeGradeKey}_${activeTopicId}_${activeMode}`, res.data.sessionId);
      }
    } catch (err) {
      const dummyResponse = generateClientSocraticDummyResponse(userMessage, activeMode, activeTopicId, userMsgCount, activeGradeKey);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: dummyResponse }]);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    const userMsgCount = newMessages.filter(m => m.role === 'user').length;
    const currentTopicObj = topicSessions.find(t => t.id === activeTopicId) || activeGradeConfig.allowedThemes[0];

    try {
      const token = localStorage.getItem('token');
      const reqData = {
        message: userMessage,
        sessionId: sessionId,
        mode: activeMode,
        topic: currentTopicObj?.name || 'Hewan (الحَيَوَANَات)',
        grade: activeGradeConfig.label
      };

      // Seed initial dummy history if starting a new session
      if (!sessionId) {
        const initialHistory = getInitialHistory(activeTopicId, activeMode, activeGradeKey);
        reqData.seedHistory = initialHistory;
      }

      const res = await axios.post(`${API_URL}/message`, reqData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
      if (!sessionId) {
        setSessionId(res.data.sessionId);
        localStorage.setItem(`sessionId_${activeGradeKey}_${activeTopicId}_${activeMode}`, res.data.sessionId);
      }
    } catch (err) {
      const dummyResponse = generateClientSocraticDummyResponse(userMessage, activeMode, activeTopicId, userMsgCount, activeGradeKey);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: dummyResponse }]);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    try {
      const key = `sessionId_${activeGradeKey}_${activeTopicId}_${activeMode}`;
      localStorage.removeItem(key);
      setSessionId(null);
      const initialMessages = getInitialHistory(activeTopicId, activeMode, activeGradeKey);
      setMessages(initialMessages);
      setSidebarOpen(false);
      setToastMessage("Sesi diskusi baru telah dimulai!");
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      console.error("Failed to reset chat", err);
    }
  };

  const renderSidebar = (isMobile = false) => {
    const filteredSessions = topicSessions.filter(sess => 
      sess.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-6">
          {isMobile && (
            <div className="mb-3 pb-3 border-b border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <Logo size="small" />
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] font-black text-[#1E3A5F]">
                <Link to="/dashboard" className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 flex flex-col items-center gap-1">
                  <span>🏠</span>
                  <span>Beranda</span>
                </Link>
                <Link to="/library" className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 flex flex-col items-center gap-1">
                  <span>📚</span>
                  <span>Library</span>
                </Link>
                <Link to="/progress" className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 flex flex-col items-center gap-1">
                  <span>📈</span>
                  <span>Progress</span>
                </Link>
              </div>
            </div>
          )}

          {/* Tingkatan Kelas Selector (5 Tingkatan Rekomendasi Ahli Materi) */}
          <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[#1E3A5F] font-black text-xs uppercase tracking-wider">
                <span>🎓</span>
                <span>Tingkatan Kelas</span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-100/70 text-[#008383]">
                {activeGradeConfig.shortLabel}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1 p-1 bg-white rounded-xl border border-slate-200/60 shadow-xs">
              {GRADE_KEYS.map((k) => {
                const g = GRADE_CONFIGS[k];
                const isSelected = activeGradeKey === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => handleGradeChange(k)}
                    className={`py-1.5 rounded-lg text-xs font-black transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-[#00B4B4] text-white shadow-xs scale-105'
                        : 'text-slate-600 hover:text-[#1E3A5F] hover:bg-slate-50'
                    }`}
                    title={`${g.label}: ${g.focus}`}
                  >
                    <span className="text-[9px] opacity-80">{g.badge.split(' ')[0]}</span>
                    <span className="text-[11px] font-black leading-none">{g.shortLabel.replace('Kelas ', 'K')}</span>
                  </button>
                );
              })}
            </div>

            {/* Capaian & Batasan summary box */}
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-left">
              <div className="flex items-center justify-between text-[11px] font-black text-[#008383]">
                <span>🎯 {activeGradeConfig.label}:</span>
                <button 
                  type="button"
                  onClick={() => setShowPanduanModal(true)} 
                  className="text-[10px] underline hover:text-[#1E3A5F] cursor-pointer"
                >
                  Panduan 📖
                </button>
              </div>
              <p className="text-[11px] text-[#1E3A5F] font-bold mt-1 line-clamp-2 leading-snug">
                {activeGradeConfig.focus}
              </p>
            </div>
          </div>

          {/* Sesi Belajar Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 text-[#1E3A5F] font-extrabold">
                <img src={assetSesiBelajar} alt="Sesi Belajar" className="w-[18px] h-[18px] object-contain" />
                <span className="text-[15px]">Tema Belajar</span>
              </div>
              <span className="text-[10px] font-black text-[#00B4B4] bg-[#EAF9F9] px-2 py-0.5 rounded-full">
                {showAllThemes ? 'Semua Tema' : activeGradeConfig.shortLabel}
              </span>
            </div>
            <div className="space-y-2.5">
              <button 
                onClick={resetChat}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#00B4B4] text-[#1E3A5F] bg-white hover:bg-[#00B4B4]/5 font-extrabold text-sm transition-all text-left"
              >
                <img src={assetDiskusiBaru} alt="Diskusi Baru" className="w-5 h-5 object-contain" />
                <span>Diskusi Baru</span>
              </button>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Cari Diskusi" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-[#1E3A5F] placeholder-slate-400 font-extrabold text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#00B4B4] focus:border-transparent transition-all"
                />
                <Search className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              </div>
              
              {/* List of Sessions */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {filteredSessions.map((sess) => {
                  const isActive = activeTopicId === sess.id;
                  return (
                    <button
                      key={sess.id}
                      onClick={() => handleTopicChange(sess.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border font-extrabold text-xs transition-all text-left ${
                        isActive 
                          ? 'bg-[#EAF9F9] border-[#00B4B4] text-[#00B4B4] shadow-xs' 
                          : 'border-slate-200 text-[#1E3A5F] hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-sm shrink-0">
                        {sess.icon || '📚'}
                      </div>
                      <div className="truncate flex-1">
                        <div className="truncate">{sess.name}</div>
                        {sess.grade && (
                          <div className="text-[10px] text-slate-400 font-bold">{sess.grade}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-center pt-1">
                <button 
                  type="button"
                  onClick={() => setShowAllThemes(!showAllThemes)} 
                  className="text-[#00B4B4] hover:underline font-extrabold text-xs cursor-pointer"
                >
                  {showAllThemes ? `Tampilkan Tema ${activeGradeConfig.shortLabel} Saja` : 'Lihat Semua Tema 5 Kelas'}
                </button>
              </div>
            </div>
          </div>

          {/* Mode Belajar Section */}
          <div>
            <div className="flex items-center gap-2.5 text-[#1E3A5F] font-extrabold mb-3">
              <img src={assetModeBelajar} alt="Mode Belajar" className="w-[18px] h-[18px] object-contain" />
              <span className="text-[15px]">Mode Belajar</span>
            </div>
            <div className="space-y-2.5">
              <button
                onClick={() => handleModeChange('socratic')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border font-extrabold text-sm transition-all text-left ${
                  activeMode === 'socratic' 
                    ? 'bg-[#EAF9F9] border-[#00B4B4] text-[#00B4B4]' 
                    : 'border-slate-200 text-[#1E3A5F] hover:bg-slate-50 bg-white'
                }`}
              >
                <img src={assetSocratic} alt="Socratic" className="w-[18px] h-[18px] object-contain" />
                <span>Socratic</span>
              </button>
              <button
                onClick={() => handleModeChange('guided')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border font-extrabold text-sm transition-all text-left ${
                  activeMode === 'guided' 
                    ? 'bg-[#EAF9F9] border-[#00B4B4] text-[#00B4B4]' 
                    : 'border-slate-200 text-[#1E3A5F] hover:bg-slate-50 bg-white'
                }`}
              >
                <img src={assetGuided} alt="Guided Practice" className="w-[18px] h-[18px] object-contain" />
                <span>Guided Practice</span>
              </button>
              <button
                onClick={() => handleModeChange('latihan')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border font-extrabold text-sm transition-all text-left ${
                  activeMode === 'latihan' 
                    ? 'bg-[#EAF9F9] border-[#00B4B4] text-[#00B4B4]' 
                    : 'border-slate-200 text-[#1E3A5F] hover:bg-slate-50 bg-white'
                }`}
              >
                <img src={assetLatihanSoal} alt="Latihan Soal" className="w-[18px] h-[18px] object-contain" />
                <span>Latihan Soal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2.5 pt-6 border-t border-slate-100 mt-6">
          <button 
            type="button"
            onClick={() => setShowPanduanModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#00B4B4] text-[#1E3A5F] hover:bg-[#00B4B4]/5 font-extrabold text-sm transition-all text-left bg-white cursor-pointer"
          >
            <img src={assetPetunjuk} alt="Petunjuk" className="w-[18px] h-[18px] object-contain" />
            <span>Petunjuk & Kurikulum</span>
          </button>
          <button 
            type="button"
            onClick={() => {
              setToastMessage('Pengaturan: Semua model AI beroperasi pada Bahasa Arab MI/SD.');
              setTimeout(() => setToastMessage(''), 3000);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#00B4B4] text-[#1E3A5F] hover:bg-[#00B4B4]/5 font-extrabold text-sm transition-all text-left bg-white"
          >
            <img src={assetPengaturan} alt="Pengaturan" className="w-[18px] h-[18px] object-contain" />
            <span>Pengaturan</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#EEF4FC] flex flex-col h-screen overflow-hidden font-sans">
      
      {/* NAVBAR */}
      <nav className="bg-white px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center select-none shadow-sm relative z-40 border-b border-slate-100 shrink-0">
        <div className="flex items-center">
          {/* Menu Hamburger for mobile */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 text-[#1E3A5F] hover:bg-slate-100 rounded-lg transition-colors mr-1 sm:mr-2 flex items-center justify-center"
          >
            <Menu size={20} />
          </button>
          <Logo size="normal" />
        </div>

        {/* Navigation Items (Middle) */}
        <div className="hidden md:flex items-center gap-8 font-bold text-slate-500">
          <Link to="/dashboard" className="hover:text-[#1E3A5F] transition-colors">Beranda</Link>
          <Link to="/chat" className="text-[#00B4B4] relative pb-1">
            Socratic Chat
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00B4B4] rounded-full"></span>
          </Link>
          <Link to="/library" className="hover:text-[#1E3A5F] transition-colors">Library</Link>
          <Link to="/progress" className="hover:text-[#1E3A5F] transition-colors">Progress</Link>
        </div>

        {/* User Profile Pill (Right) */}
        <div className="relative font-bold">
          <button 
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-3.5 bg-[#1E3A5F] hover:bg-[#152a46] text-white px-5 py-2.5 rounded-full transition-all shadow-sm transform hover:scale-[1.01]"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <User size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold hidden sm:inline">{displayName}</span>
            <span className="text-sm font-semibold sm:hidden">{firstName}</span>
            <ChevronDown size={16} className={`transition-transform duration-300 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          <AnimatePresence>
            {profileDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 p-1.5"
              >
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50/50 rounded-xl transition-colors font-bold text-sm text-left"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* SPLIT LAYOUT AREA */}
      <div className="flex-1 flex overflow-hidden p-2 sm:p-4 lg:p-6 gap-3 lg:gap-6 bg-[#EEF4FC]">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="w-80 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-y-auto shrink-0 hidden lg:block h-full">
          {renderSidebar(false)}
        </aside>

        {/* MOBILE SIDEBAR DRAWER */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black z-40 lg:hidden"
              />
              <motion.aside 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="fixed inset-y-0 left-0 w-72 bg-white z-50 p-6 flex flex-col overflow-y-auto shadow-2xl lg:hidden"
              >
                {renderSidebar(true)}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* RIGHT CHAT AREA */}
        <main className="flex-1 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 flex flex-col min-h-0 relative overflow-hidden">
          
          {/* Active Session Header with Grade & Curriculum Control */}
          <div className="px-3.5 sm:px-6 py-3 border-b border-slate-100 bg-white shrink-0">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF9F9] flex items-center justify-center text-[#00B4B4] font-black shrink-0 shadow-xs">
                  {topicSessions.find(t => t.id === activeTopicId)?.icon || '📚'}
                </div>
                <div className="text-left font-sans">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[15px] font-black text-[#1E3A5F]">
                      {topicSessions.find(t => t.id === activeTopicId)?.name || 'Diskusi Belajar'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#EAF9F9] text-[#00B4B4] border border-[#00B4B4]/20">
                      {activeGradeConfig.label}
                    </span>
                    {/* Quick button to pronounce active topic */}
                    <button
                      type="button"
                      onClick={() => {
                        const curTopic = topicSessions.find(t => t.id === activeTopicId);
                        if (curTopic?.arabicVocab) {
                          handlePlayVocab(curTopic.arabicVocab, curTopic.name, 'header-topic');
                        } else {
                          handlePlayVocab('اللُّغَةُ العَرَبِيَّةُ', 'Al-Lughatul Arabiyyah', 'header-topic');
                        }
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border transition-all cursor-pointer ${
                        activePlayingVocab === 'header-topic'
                          ? 'bg-[#FFCA28] border-amber-300 text-[#1E3A5F] scale-105 shadow-xs animate-pulse'
                          : 'bg-[#EAF9F9] border-[#00B4B4]/30 text-[#00B4B4] hover:bg-[#d6f4f4]'
                      }`}
                      title="Dengarkan pelafalan makhraj topik ini"
                    >
                      <span>{activePlayingVocab === 'header-topic' ? '⏹️' : '🔊'}</span>
                      <span>Lafal Topik</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[#00B4B4] font-extrabold flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00B4B4] animate-pulse" />
                    {activeMode === 'socratic' && 'Socratic Tutor Aktif'}
                    {activeMode === 'guided' && 'Guided Practice Aktif'}
                    {activeMode === 'latihan' && 'Mode Latihan Soal Aktif'}
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500 font-bold hidden sm:inline">{activeGradeConfig.badge}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => setShowPanduanModal(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-[#008383] bg-teal-50 hover:bg-teal-100/80 border border-teal-200/60 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-sans"
                  title="Buka Buku Panduan & Capaian Ahli Materi"
                >
                  <span>📖</span>
                  <span>Panduan Capaian</span>
                </button>
                <button 
                  onClick={resetChat}
                  className="text-xs font-black text-slate-400 hover:text-slate-600 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-xl transition-all font-sans cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Quick Grade Switcher Bar inside Chat Header */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-[#1E3A5F] shrink-0">
                <span className="text-slate-400">Pilih Kelas:</span>
                <div className="flex items-center gap-1">
                  {GRADE_KEYS.map((k) => {
                    const g = GRADE_CONFIGS[k];
                    const isSelected = activeGradeKey === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => handleGradeChange(k)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#00B4B4] text-white shadow-xs scale-105'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-[#1E3A5F]'
                        }`}
                        title={`${g.label}: ${g.focus}`}
                      >
                        {g.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="text-[11px] text-slate-500 font-bold truncate max-w-md hidden lg:block text-right">
                <span className="text-[#008383] font-black">🎯 Capaian: </span>
                <span>{activeGradeConfig.focus}</span>
              </div>
            </div>
          </div>
          
          {/* Message Thread Scrollable List */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6 flex flex-col min-h-0">
            <div className="max-w-4xl w-full mx-auto space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  const { cleanText, options } = extractOptions(msg.content);
                  const vocabs = extractVocabulariesFromMessage(msg.content);
                  const isSpeaking = activeSpeakingIndex === i;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[85%] sm:max-w-[78%] gap-3.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                        
                        {/* Avatar Image */}
                        <div className="relative shrink-0">
                          <img 
                            src={isUser ? iconPerson : iconAIKakIfham} 
                            alt={isUser ? "User" : "Kak Ifham"} 
                            className="w-10 h-10 rounded-full shadow-sm object-cover border-2 border-white" 
                          />
                          {!isUser && (
                            <span className="absolute -bottom-1 -right-1 bg-[#00B4B4] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                              ⭐
                            </span>
                          )}
                        </div>

                        {/* Speech Bubble Box */}
                        <div className={`p-4 sm:p-5 rounded-2xl shadow-sm border leading-relaxed font-semibold text-left transition-all ${
                          isUser 
                            ? 'bg-[#1E3A5F] text-white border-navy/20' 
                            : 'bg-white text-[#1E3A5F] border-slate-100/80'
                        }`}>
                          
                          {/* Message Text */}
                          <div className="text-sm whitespace-pre-wrap font-sans">
                            {cleanText}
                          </div>

                          {/* Target Vocabulary Audio Pronunciation Chips (Focused on target word!) */}
                          {!isUser && vocabs && vocabs.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-slate-100/90">
                              <div className="flex items-center gap-1.5 mb-2 text-[#00B4B4] font-black text-[11px] uppercase tracking-wider">
                                <Volume2 size={13} className="text-[#00B4B4]" />
                                <span>Lafal Kosakata Ditanyakan (Makhraj):</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {vocabs.map((vocab, vIdx) => {
                                  const vocabId = `vocab-${i}-${vIdx}`;
                                  const isPlaying = activePlayingVocab === vocabId;
                                  return (
                                    <button
                                      key={vIdx}
                                      type="button"
                                      onClick={() => handlePlayVocab(vocab.arabic, vocab.phonetic, vocabId)}
                                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs border ${
                                        isPlaying
                                          ? 'bg-[#FFCA28] border-amber-300 text-[#1E3A5F] scale-105 shadow-md animate-pulse'
                                          : 'bg-[#EAF9F9] hover:bg-[#d5f3f3] border-[#00B4B4]/30 text-[#008383]'
                                      }`}
                                      title={`Dengarkan lafal makhraj ${vocab.arabic}`}
                                    >
                                      <span className="text-sm">{isPlaying ? '⏹️' : '🔊'}</span>
                                      <span className="font-sans text-sm font-black">{vocab.arabic}</span>
                                      {vocab.phonetic && (
                                        <span className="text-[11px] font-semibold text-slate-500">({vocab.phonetic})</span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Interactive Quick Answer Option Pills with Audio Buttons */}
                          {!isUser && options && options.length > 0 && (
                            <div className="mt-3.5 pt-2.5 border-t border-slate-100">
                              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
                                💡 Pilihan Jawaban (Klik 🔊 untuk dengarkan lafal):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {options.map((opt, optIdx) => {
                                  const optArabic = extractOptionArabic(opt);
                                  const optVocabId = `opt-${i}-${optIdx}`;
                                  const isPlayingOpt = activePlayingVocab === optVocabId;

                                  return (
                                    <div
                                      key={optIdx}
                                      className="inline-flex items-center bg-white border-2 border-[#00B4B4] rounded-full shadow-xs hover:border-[#009b9b] transition-all overflow-hidden"
                                    >
                                      {optArabic && (
                                        <button
                                          type="button"
                                          title={`Dengarkan lafal makhraj ${optArabic}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handlePlayVocab(optArabic, '', optVocabId);
                                          }}
                                          className={`px-2.5 py-1.5 text-xs transition-colors flex items-center justify-center border-r border-[#00B4B4]/20 cursor-pointer ${
                                            isPlayingOpt
                                              ? 'bg-[#FFCA28] text-[#1E3A5F] animate-pulse font-black'
                                              : 'bg-[#EAF9F9] text-[#00B4B4] hover:bg-[#d6f4f4]'
                                          }`}
                                        >
                                          {isPlayingOpt ? '⏹️' : '🔊'}
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => handleSendOption(opt)}
                                        disabled={loading}
                                        className="px-3.5 py-1.5 text-xs font-black text-[#00B4B4] hover:text-[#009b9b] hover:bg-[#EAF9F9] transition-all cursor-pointer text-left"
                                      >
                                        {opt}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Dedicated Kak Ifham Audio Playback */}
                          {!isUser && (
                            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100/80">
                              <button
                                type="button"
                                onClick={() => handleSpeak(cleanText, i)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer shadow-2xs ${
                                  isSpeaking 
                                    ? 'bg-[#FFCA28] text-[#1E3A5F] animate-pulse' 
                                    : 'bg-[#EAF9F9] hover:bg-[#d4f2f2] text-[#008383] border border-[#00B4B4]/20'
                                }`}
                                title="Dengarkan penjelasan suara Kak Ifham"
                              >
                                {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                                <span>{isSpeaking ? 'Hentikan Suara ⏹️' : 'Dengarkan Suara Kak Ifham 🔊'}</span>
                              </button>
                            </div>
                          )}



                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {loading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-4 max-w-[85%]">
                    <img 
                      src={iconAIKakIfham} 
                      alt="Kak Ifham" 
                      className="w-10 h-10 rounded-full flex-shrink-0 shadow-sm object-cover" 
                    />
                    <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-sm flex items-center gap-3">
                      <Loader2 size={16} className="animate-spin text-[#00B4B4]" />
                      <span className="text-sm text-slate-400 italic font-semibold">Kak Ifham sedang menyiapkan teka-teki... 🌟</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area Form */}
          <div className="p-2 sm:p-4 lg:p-6 bg-[#EEF4FC] shrink-0">
            <form 
              onSubmit={handleSend}
              className="max-w-4xl mx-auto relative flex items-center"
            >
              <div className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center px-3 sm:px-4 py-2.5 sm:py-3 gap-2 sm:gap-2.5">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />

                <div className="relative flex items-center justify-center shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPlusOptions(!showPlusOptions);
                    }}
                    className={`p-1.5 rounded-xl transition-all hover:bg-slate-50 ${
                      showPlusOptions ? 'bg-[#EAF9F9] text-[#00B4B4]' : 'text-slate-400'
                    }`}
                  >
                    <Plus 
                      size={20} 
                      className={`transition-transform duration-200 ${showPlusOptions ? 'rotate-45 text-[#00B4B4]' : 'text-[#00B4B4]'}`} 
                    />
                  </button>

                  <AnimatePresence>
                    {showPlusOptions && (
                      <>
                        <div 
                          className="fixed inset-0 z-20" 
                          onClick={() => setShowPlusOptions(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute bottom-12 left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-30 text-[#1E3A5F] text-left font-bold text-sm flex flex-col gap-1"
                        >
                          <button
                            type="button"
                            onClick={handleFileUploadClick}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                          >
                            <UploadCloud size={16} className="text-[#00B4B4]" />
                            <span>Upload Gambar / Teks</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowPlusOptions(false);
                              navigate('/library');
                            }}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                          >
                            <FolderOpen size={16} className="text-[#00B4B4]" />
                            <span>Buka Perpustakaan Kosakata</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setShowPlusOptions(false);
                              setShowThinkingTrace(true);
                            }}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                          >
                            <Brain size={16} className="text-[#00B4B4]" />
                            <span>Alur Berpikir Sokrates</span>
                          </button>

                          <div className="h-px bg-slate-100 my-1" />

                          <button
                            type="button"
                            onClick={handleOptionLatihanSoal}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                          >
                            <ClipboardList size={16} className="text-[#00B4B4]" />
                            <span>Minta Soal Kuis Teka-Teki</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleOptionRingkasan}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                          >
                            <FileText size={16} className="text-[#00B4B4]" />
                            <span>Rangkum Kosakata Hari Ini</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
                
                <input 
                  type="text"
                  ref={chatInputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Mendengarkan suaramu... Bicara sekarang!" : "Tulis jawabanmu atau klik tombol di atas..."}
                  className="flex-1 bg-transparent text-[#1E3A5F] placeholder-slate-400 focus:outline-none font-semibold text-sm"
                  disabled={loading}
                />

                {/* Microphone Button (Speech Recognition) */}
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  title={isListening ? "Sedang mendengarkan... Klik untuk berhenti" : "Bicara dengan suara 🎙️"}
                  className={`p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-md' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                
                <button 
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2.5 bg-[#00B4B4] text-white rounded-xl hover:bg-[#009b9b] transition-all disabled:opacity-50 disabled:hover:bg-[#00B4B4] flex items-center justify-center flex-shrink-0 cursor-pointer"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] text-slate-400 font-bold mt-2.5">
              💡 Tips: Klik tombol speaker 🔊 untuk mendengar lafal kata Arab yang fasih dan benar!
            </p>
          </div>

        </main>
      </div>
      <AnimatePresence>
        {showThinkingTrace && renderThinkingTraceModal()}
      </AnimatePresence>
      <BukuPanduanModal isOpen={showPanduanModal} onClose={() => setShowPanduanModal(false)} />
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#00B4B4] text-white px-6 py-3 rounded-full shadow-lg font-bold text-sm z-50 flex items-center gap-2"
          >
            <span>✨ {toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatPage;
