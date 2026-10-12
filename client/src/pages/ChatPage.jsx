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
import { speechService } from '../utils/speechHelper';

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
  const [isListening, setIsListening] = useState(false);
  
  // States and refs for revisions
  const [showPlusOptions, setShowPlusOptions] = useState(false);
  const [showThinkingTrace, setShowThinkingTrace] = useState(false);
  const fileInputRef = useRef(null);
  const chatInputRef = useRef(null);
  
  // Account-specific multi-turn dummy chat histories for demo users (Arabic Kids Themes)
  const ACCOUNT_DEMO_HISTORIES = {
    'demo-murid-a': {
      hewan: [
        { role: 'assistant', content: 'Assalamu\'alaikum sahabat kecil! 🌟 Hari ini Kak Ifham mau ajak kamu jalan-jalan ke kebun binatang. Coba lihat, ada hewan berkaki empat yang suka dielus dan bunyinya "meoong". Kamu tahu bahasa Arabnya?\n\n[OPSI: A. قِطٌّ (Qit-thun) 🐱 | B. نَمِرٌ (Namirun) 🐯 | C. Butuh petunjuk 💡]' },
        { role: 'user', content: 'Itu kucing kak! Bahasa Arabnya Qit-thun!' },
        { role: 'assistant', content: 'Mumtaz! Pintar sekali 👏. Bahasa Arabnya **قِطٌّ** (*Qit-thun = Kucing*). Sekarang coba tebak, kalau hewan berleher panjang yang suka makan daun di pucuk pohon, bahasa Arabnya apa ya?\n\n[OPSI: A. زَرَافَةٌ (Zaroofatun) 🦒 | B. فِيلٌ (Fiilun) 🐘 | C. أَسَدٌ (Asadun) 🦁]' },
        { role: 'user', content: 'Zaroofatun (زَرَافَةٌ) Kak!' },
        { role: 'assistant', content: 'MasyaAllah, hebat sekali kamu! 🌟 Jawabanmu 100% tepat. Jerapah adalah **زَرَافَةٌ** (*Zaroofatun*). Kamu dapat 1 bintang hari ini! ⭐ Mau lanjut tebak hewan lainnya?\n\n[OPSI: Mau lanjut tebak hewan! 🦁 | Dengarkan suara tadi 🔊 | Ganti materi sekolah 🎒]' }
      ],
      sekolah: [
        { role: 'assistant', content: 'Ahlan wa Sahlan di kelasku! 🎒 Di dalam tasku ada benda penting untuk menulis di buku catatan. Bahasa Arabnya adalah **قَلَمٌ** (*Qolamun*). Artinya apa ya jagoan?\n\n[OPSI: A. Pena / Pulpen ✏️ | B. Papan Tulis 📋 | C. Penghapus 🧼]' },
        { role: 'user', content: 'Pena atau Pulpen kak!' },
        { role: 'assistant', content: 'Mumtaz jagoan! Betul sekali, **قَلَمٌ** (*Qolamun = Pena/Pulpen*). Nah, kalau benda tempat kita menyimpan buku dan pensil saat berangkat sekolah apa hayo?\n\n[OPSI: A. حَقِيبَةٌ (Haqiybatun) 🎒 | B. كِتَابٌ (Kitaabun) 📖 | C. مَكْتَبٌ (Maktabun) 🪑]' }
      ]
    }
  };

  // Topic-based sessions list with Arabic curriculum for elementary kids
  const topicSessions = [
    { 
      id: 'hewan', 
      name: 'Hewan Ceria (الحَيَوَانَات)', 
      icon: '🦁',
      history: [
        { role: 'assistant', content: 'Assalamu\'alaikum sahabat ceria! 🌟 Hari ini Kak Ifham temani kamu belajar kosakata hewan (**Al-Hayawaanaat** / الحَيَوَانَات). Coba tebak, hewan yang dijuluki Raja Hutan yang gagah bersuara "Roarrr", apa bahasa Arabnya ya?\n\n[OPSI: A. أَسَدٌ (Asadun) 🦁 | B. قِطٌّ (Qit-thun) 🐱 | C. Butuh petunjuk 💡]' }
      ]
    },
    { 
      id: 'sekolah', 
      name: 'Di Sekolahku (الأَدَوَات)', 
      icon: '🎒',
      history: [
        { role: 'assistant', content: 'Bismillah! Yuk belajar perlengkapan sekolah (**Al-Adawaat Al-Madrasiyyah** / الأَدَوَات المَدْرَسِيَّة) 🎒. Benda berlembar-lembar yang kita baca untuk belajar bahasa Arab adalah **كِتَابٌ** (*Kitaabun*). Apa ya artinya?\n\n[OPSI: A. Buku Bacaan 📖 | B. Pensil Warna ✏️ | C. Penggaris 📏]' }
      ]
    },
    { 
      id: 'angka-warna', 
      name: 'Angka & Warna (الأَرْقَام)', 
      icon: '🎨',
      history: [
        { role: 'assistant', content: 'Ahlan wa Sahlan! Mari kita hitung dan sebutkan warna-warni ceria (**Al-Arqaam wal-Alwaan** / الأَرْقَام وَالأَلْوَان) 🌈. Angka satu dalam bahasa Arab adalah **وَاحِدٌ** (*Waahidun*). Coba tebak kalau angka dua apa ya?\n\n[OPSI: A. اِثْنَانِ (Itsnaani) ✌️ | B. ثَلَاثَةٌ (Tsalaatsatun) 3️⃣ | C. أَرْبَعَةٌ (Arba\'atun) 4️⃣]' }
      ]
    },
    { 
      id: 'buah-makanan', 
      name: 'Buah & Makanan (الفَوَاكِه)', 
      icon: '🍎',
      history: [
        { role: 'assistant', content: 'Nyam! Di atas meja ada buah lezat berwarna merah manis (**Al-Fawaakih** / الفَوَاكِه) 🍎. Bahasa Arab apel adalah **تُفَّاحَةٌ** (*Tuffaahatun*). Kalau pisang berwarna kuning apa ya?\n\n[OPSI: A. مَوْزٌ (Mauzun) 🍌 | B. بُرْتُقَالٌ (Burtuqoolun) 🍊 | C. عِنَبٌ (Inabun) 🍇]' }
      ]
    },
    { 
      id: 'anggota-tubuh', 
      name: 'Anggota Tubuh (أَعْضَاء الجِسْم)', 
      icon: '🖐️',
      history: [
        { role: 'assistant', content: 'Alhamdulillah tubuh kita diciptakan sempurna! Di wajah kita ada dua indera penglihat yang indah bernama **عَيْنٌ** (*\'Ainun = Mata*). Kalau indera pendengar kita apa ya?\n\n[OPSI: A. أُذُنٌ (Udzunun) 👂 | B. أَنْفٌ (Anfun) 👃 | C. فَمٌ (Famun) 👄]' }
      ]
    },
    { 
      id: 'sapaan', 
      name: 'Sapaan & Teman (التَّعَارُف)', 
      icon: '🤝',
      history: [
        { role: 'assistant', content: 'Assalamu\'alaikum! Saat bertemu teman baru, kita mengucapkan *Kaifa haaluk?* (كَيْفَ حَالُكَ؟) yang artinya "Bagaimana kabarmu?". Coba jawab Kak Ifham dengan gembira ya!\n\n[OPSI: بِخَيْرٍ الحَمْدُ للّه (Bikhoirin Alhamdulillah) 🌟 | أَهْلًا وَسَهْلًا (Ahlan wa Sahlan) 👋 | Aku siap belajar 🚀]' }
      ]
    }
  ];

  const [activeTopicId, setActiveTopicId] = useState('hewan');
  const [activeMode, setActiveMode] = useState('socratic');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const cleanApiUrl = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;
  const API_URL = `${cleanApiUrl}/api/chat`;

  const getInitialHistory = (topicId, mode) => {
    const topic = topicSessions.find(t => t.id === topicId);
    const topicName = topic ? topic.name : 'Topik ini';

    if (mode === 'guided') {
      return [{
        role: 'assistant',
        content: `Halo! Kita masuk ke mode **Guided Practice** untuk topik **${topicName}**. 📚\n\nDi sini, kita akan membedah konsepnya secara perlahan dan bertahap. Sebelum mulai, apa bagian dari ${topicName} yang ingin kamu kuasai hari ini?`
      }];
    } else if (mode === 'latihan') {
      return [{
        role: 'assistant',
        content: `Halo! Mari mulai **Latihan Soal** untuk topik **${topicName}**! ✏️\n\nAku akan memberikan soal satu per satu untuk menguji pemahamanmu. Ketik "Siap" jika kamu ingin soal pertamanya dimuat!`
      }];
    } else {
      // Check user-specific demo histories first
      const userId = user?.id || 'demo-murid-a';
      if (ACCOUNT_DEMO_HISTORIES[userId] && ACCOUNT_DEMO_HISTORIES[userId][topicId]) {
        return ACCOUNT_DEMO_HISTORIES[userId][topicId];
      }
      
      // Fallback to topic default complete history
      if (topic && topic.history && topic.history.length > 0) {
        return topic.history;
      }
      return [];
    }
  };
  
  // Sync sessionId and load history/initial messages whenever activeTopicId or activeMode changes
  useEffect(() => {
    const key = `sessionId_${activeTopicId}_${activeMode}`;
    let storedSessionId = localStorage.getItem(key);
    
    // Auto-migration: if in Socratic mode and no new key exists, check old key format
    if (!storedSessionId && activeMode === 'socratic') {
      const oldKey = `sessionId_${activeTopicId}`;
      const oldSession = localStorage.getItem(oldKey);
      if (oldSession) {
        storedSessionId = oldSession;
        localStorage.setItem(key, oldSession);
        localStorage.removeItem(oldKey);
      }
    }
    
    setSessionId(storedSessionId || null);

    if (storedSessionId) {
      const loadHistoryDirect = async (sid) => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${API_URL}/history/${sid}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMessages(res.data);
        } catch (err) {
          console.error("Failed to load history", err);
        }
      };
      loadHistoryDirect(storedSessionId);
    } else {
      const initialMessages = getInitialHistory(activeTopicId, activeMode);
      setMessages(initialMessages);
    }
  }, [activeTopicId, activeMode, user?.id]);
  
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
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EAF9F9] flex items-center justify-center text-[#00B4B4]">
                <Brain size={20} />
              </div>
              <h3 className="text-lg font-black font-sans">AI Thinking Trace</h3>
            </div>
            <button 
              onClick={() => setShowThinkingTrace(false)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-xs text-slate-500 font-bold mb-6 leading-relaxed font-sans">
            Ini adalah alur penalaran pedagogis Socratic yang digunakan IfhamKids untuk membantumu memahami kosakata & kaidah bahasa Arab secara mandiri dengan ceria.
          </p>

          <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 font-sans">
            <div className="flex gap-4 relative">
              <div className="w-9 h-9 rounded-full bg-[#EAF9F9] border-2 border-white flex items-center justify-center text-[#00B4B4] font-black text-sm z-10 shadow-sm shrink-0">
                1
              </div>
              <div>
                <h5 className="text-sm font-black">Tahap 1: Asesmen Pengetahuan Awal</h5>
                <p className="text-xs text-slate-500 font-bold mt-1 leading-relaxed">
                  AI mendeteksi sejauh mana pemahamanmu tentang topik ini. Pertanyaan dirancang untuk membuka memori jangka panjangmu.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="w-9 h-9 rounded-full bg-[#EBF5FF] border-2 border-white flex items-center justify-center text-blue-500 font-black text-sm z-10 shadow-sm shrink-0">
                2
              </div>
              <div>
                <h5 className="text-sm font-black">Tahap 2: Pemberian Pertanyaan Pemantik</h5>
                <p className="text-xs text-slate-500 font-bold mt-1 leading-relaxed">
                  Alih-alih langsung menyuapkan jawaban arti kata, Kak Ifham menyusun teka-teki dan petunjuk bertingkat yang seru dan mudah dipahami anak SD.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="w-9 h-9 rounded-full bg-[#F5F3FF] border-2 border-white flex items-center justify-center text-purple-500 font-black text-sm z-10 shadow-sm shrink-0">
                3
              </div>
              <div>
                <h5 className="text-sm font-black">Tahap 3: Konstruksi Mandiri (Scaffolding)</h5>
                <p className="text-xs text-slate-500 font-bold mt-1 leading-relaxed">
                  Santri cilik dibimbing untuk menyatukan petunjuk makna, harakat, dan bunyi makhraj sehingga menemukan arti kata secara mandiri.
                </p>
              </div>
            </div>

            <div className="flex gap-4 relative">
              <div className="w-9 h-9 rounded-full bg-[#FFF9E6] border-2 border-white flex items-center justify-center text-amber-500 font-black text-sm z-10 shadow-sm shrink-0">
                4
              </div>
              <div>
                <h5 className="text-sm font-black">Tahap 4: Penguatan & Umpan Balik Positif</h5>
                <p className="text-xs text-slate-500 font-bold mt-1 leading-relaxed">
                  AI merayakan keberhasilan berpikirmu, meringkas kesimpulanmu, dan memberikan pemantik baru untuk topik lanjutan.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 font-sans">
            <button 
              onClick={() => setShowThinkingTrace(false)}
              className="w-full py-3 bg-[#1E3A5F] hover:bg-[#152a46] text-white rounded-xl font-black text-sm transition-all shadow-sm"
            >
              Tutup & Lanjutkan Belajar
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

  // Helper for generating client-side dummy Socratic responses for kids Arabic learning
  const generateClientSocraticDummyResponse = (message, mode, topicId, msgCount) => {
    const msgLower = (message || '').toLowerCase();
    const currentTopic = topicSessions.find(t => t.id === topicId)?.name || 'Hewan Ceria';

    if (msgLower.includes('ringkasan') || msgLower.includes('rangkuman')) {
      return `🌟 **Rangkuman Belajar Bersama Kak Ifham** 🌟\n\nAlhamdulillah! Kosakata yang sudah kita kuasai tentang **${currentTopic}**:\n\n1. **قِطٌّ** (*Qit-thun*) = Kucing 🐱\n2. **أَسَدٌ** (*Asadun*) = Singa Si Raja Hutan 🦁\n3. **فِيلٌ** (*Fiilun*) = Gajah Belalai Panjang 🐘\n\nKamu hebat dan cepat paham! Coba klik tombol suara 🔊 untuk melafalkannya kembali ya.\n\n[OPSI: Tebak hewan lain lagi! 🦁 | Ulangi suara pelafalan 🔊 | Ganti materi sekolah 🎒]`;
    }

    if (msgLower.includes('latihan') || msgLower.includes('soal')) {
      return `🎯 **Kuis Teka-Teki Seru Kak Ifham!** 🎯\n\nHewan ini punya belalai panjang, telinganya lebar seperti kipas, dan badannya besar sekali 🐘. Bahasa Arabnya apa ya?\n\n[OPSI: A. فِيلٌ (Fiilun) 🐘 | B. قِطٌّ (Qit-thun) 🐱 | C. Butuh petunjuk 💡]`;
    }

    if (msgLower.includes('petunjuk') || msgLower.includes('clue') || msgLower.includes('bantuan')) {
      return `💡 **Petunjuk Rahasia dari Kak Ifham:**\nHewan ini bunyinya "Meoong..." suka tidur di pangkuan dan suka makan ikan! Huruf depannya **Qoof** (ق).\n\n[OPSI: A. قِطٌّ (Qit-thun) 🐱 | B. كَلْبٌ (Kalbun) 🐶 | C. طَائِرٌ (Thoo-irun) 🐦]`;
    }

    if (msgLower.includes('fiilun') || msgLower.includes('gajah') || msgLower.includes('a.')) {
      return `🌟 **Mumtaz! Hebat sekali!** 🌟\n\nJawabanmu tepat 100%! Gajah dalam bahasa Arab adalah **فِيلٌ** (*Fiilun*). Kamu dapat 1 bintang tambahan! ⭐\n\nSekarang coba tebak: Kalau hewan yang bisa terbang tinggi di langit dan berkicau merdu 🐦, apa ya bahasa Arabnya?\n\n[OPSI: A. طَائِرٌ (Thoo-irun) 🐦 | B. سَمَكٌ (Samakun) 🐟 | C. أَسَدٌ (Asadun) 🦁]`;
    }

    if (mode === 'guided') {
      const guidedList = [
        `Ahlan wa sahlan sahabat kecil! 🌟 Hari ini kita pelajari materi **${currentTopic}** pelan-pelan ya. Langkah 1: Coba pilih kata yang paling ingin kamu tahu artinya!\n\n[OPSI: Nama Hewan Liar 🦁 | Nama Hewan Peliharaan 🐱 | Hewan yang Bisa Terbang 🐦]`,
        `Pilihan yang sangat bagus! Sekarang dengarkan baik-baik suaranya dengan menekan tombol 🔊 di bawah pesan ini, lalu tirukan ya!\n\n[OPSI: Sudah kutirukan Kak! 🔊 | Boleh ulangi sekali lagi? 👂 | Lanjut kata baru 🌟]`,
        `Mumtaz! Makhraj pelafalanmu semakin fasih dan jelas. Kamu anak yang sangat pintar! ⭐\n\n[OPSI: Coba kata berikutnya 🚀 | Aku mau latihan kuis 🎯 | Buatkan ringkasan 📝]`
      ];
      return guidedList[msgCount % guidedList.length];
    }

    if (mode === 'latihan') {
      if (msgLower.includes('siap') || msgLower.includes('mulai')) {
        return `Bismillah, yuk kita mulai kuis teka-teki **${currentTopic}**! 🎯\n\n**Soal 1**: Di dalam kelas ada benda untuk menulis di buku. Bahasa Arabnya **قَلَمٌ** (*Qolamun*). Artinya apa ya?\n\n[OPSI: A. Pena / Pulpen ✏️ | B. Papan Tulis 📋 | C. Penghapus 🧼]`;
      }
      return `Allahu Akbar, pintar sekali! 🎯 Penalaranmu sangat tepat untuk **${currentTopic}**. Kamu dapat bintang prestasi! ⭐\n\n[OPSI: Lanjut soal berikutnya! 🚀 | Dengarkan lafalnya 🔊 | Coba tebak kata lain 💡]`;
    }

    const socraticList = [
      `Assalamu'alaikum sahabat ceria! 🌟 Hari ini Kak Ifham temani kamu belajar tentang **${currentTopic}**. Coba lihat sekelilingmu, hewan apa yang paling sering kamu temui di rumah?\n\n[OPSI: Kucing manis 🐱 | Burung berkicau 🐦 | Ikan di kolam 🐟]`,
      `Wah seru sekali! Hewan itu dalam bahasa Arab ada sebutannya yang sangat indah. Coba klik tombol suara 🔊 untuk mendengar lafalnya ya!\n\n[OPSI: Mau dengar suaranya 🔊 | Tebak kata berikutnya! 🚀 | Minta petunjuk 💡]`,
      `Mumtaz! Kamu anak cerdas yang cepat memahami kata Arab. Coba kita rangkai menjadi kalimat sederhana ya!\n\n[OPSI: Siap Kak Ifham! 🌟 | Bagaimana caranya? 🤔 | Buka materi lainnya 📚]`,
      `Luar biasa jagoan! Kamu sudah menyelesaikan sesi diskusi dengan sangat baik. Coba simpulkan kata baru apa saja yang kamu pelajari hari ini! 🌟\n\n[OPSI: Ya, buatkan ringkasan! 📝 | Lanjut petualangan baru 🗺️ | Coba kuis seru 🎯]`
    ];

    let resp = socraticList[(msgCount - 1) % socraticList.length] || socraticList[0];
    return resp;
  };

  // Speak handler using Web Speech API
  const handleSpeak = (text, index) => {
    if (activeSpeakingIndex === index) {
      speechService.stop();
      setActiveSpeakingIndex(null);
      return;
    }

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

    try {
      const token = localStorage.getItem('token');
      const reqData = {
        message: userMessage,
        sessionId: sessionId,
        mode: activeMode,
        topic: topicSessions.find(t => t.id === activeTopicId)?.name || 'Hewan Ceria'
      };

      if (!sessionId) {
        const initialHistory = getInitialHistory(activeTopicId, activeMode);
        reqData.seedHistory = initialHistory;
      }

      const res = await axios.post(`${API_URL}/message`, reqData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
      if (!sessionId) {
        setSessionId(res.data.sessionId);
        localStorage.setItem(`sessionId_${activeTopicId}_${activeMode}`, res.data.sessionId);
      }
    } catch (err) {
      const dummyResponse = generateClientSocraticDummyResponse(userMessage, activeMode, activeTopicId, userMsgCount);
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

    try {
      const token = localStorage.getItem('token');
      const reqData = {
        message: userMessage,
        sessionId: sessionId,
        mode: activeMode,
        topic: topicSessions.find(t => t.id === activeTopicId)?.name || 'Trigonometri'
      };

      // Seed initial dummy history if starting a new session
      if (!sessionId) {
        const initialHistory = getInitialHistory(activeTopicId, activeMode);
        reqData.seedHistory = initialHistory;
      }

      const res = await axios.post(`${API_URL}/message`, reqData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
      if (!sessionId) {
          setSessionId(res.data.sessionId);
          localStorage.setItem(`sessionId_${activeTopicId}_${activeMode}`, res.data.sessionId);
      }
    } catch (err) {
      // Automatic Socratic AI Dummy fallback when API/Backend limit is hit
      const dummyResponse = generateClientSocraticDummyResponse(userMessage, activeMode, activeTopicId, userMsgCount);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: dummyResponse }]);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    try {
      const key = `sessionId_${activeTopicId}_${activeMode}`;
      localStorage.removeItem(key);
      setSessionId(null);
      const initialMessages = getInitialHistory(activeTopicId, activeMode);
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
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-2">
              <span className="font-extrabold text-[#1E3A5F] text-lg">Menu Belajar</span>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* Sesi Belajar Section */}
          <div>
            <div className="flex items-center gap-2.5 text-[#1E3A5F] font-extrabold mb-3">
              <img src={assetSesiBelajar} alt="Sesi Belajar" className="w-[18px] h-[18px] object-contain" />
              <span className="text-[15px]">Sesi Belajar</span>
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
              <div className="space-y-2">
                {filteredSessions.map((sess) => {
                  const isActive = activeTopicId === sess.id;
                  return (
                    <button
                      key={sess.id}
                      onClick={() => handleTopicChange(sess.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border font-extrabold text-sm transition-all text-left ${
                        isActive 
                          ? 'bg-[#EAF9F9] border-[#00B4B4] text-[#00B4B4]' 
                          : 'border-slate-200 text-[#1E3A5F] hover:bg-slate-50 bg-white'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center text-sm shrink-0">
                        {sess.icon || '📚'}
                      </div>
                      <span className="truncate">{sess.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-center pt-2">
                <a href="#" className="text-[#00B4B4] hover:underline font-extrabold text-xs">Lihat semua sesi</a>
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
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#00B4B4] text-[#1E3A5F] hover:bg-[#00B4B4]/5 font-extrabold text-sm transition-all text-left bg-white">
            <img src={assetPetunjuk} alt="Petunjuk" className="w-[18px] h-[18px] object-contain" />
            <span>Petunjuk</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-[#00B4B4] text-[#1E3A5F] hover:bg-[#00B4B4]/5 font-extrabold text-sm transition-all text-left bg-white">
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
      <nav className="bg-white px-6 py-4 flex justify-between items-center select-none shadow-sm relative z-40 border-b border-slate-100 shrink-0">
        <div className="flex items-center">
          {/* Menu Hamburger for mobile */}
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-[#1E3A5F] hover:bg-slate-100 rounded-lg transition-colors mr-2 flex items-center justify-center"
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
      <div className="flex-1 flex overflow-hidden p-6 gap-6 bg-[#EEF4FC]">
        
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
        <main className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col min-h-0 relative overflow-hidden">
          
          {/* Active Session Header */}
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EAF9F9] flex items-center justify-center text-[#00B4B4] font-black">
                📚
              </div>
              <div className="text-left font-sans">
                <h3 className="text-[15px] font-black text-[#1E3A5F]">
                  {topicSessions.find(t => t.id === activeTopicId)?.name || 'Diskusi Belajar'}
                </h3>
                <p className="text-[11px] text-[#00B4B4] font-extrabold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B4B4] animate-pulse" />
                  {activeMode === 'socratic' && 'Socratic Tutor Aktif'}
                  {activeMode === 'guided' && 'Guided Practice Aktif'}
                  {activeMode === 'latihan' && 'Mode Latihan Soal Aktif'}
                </p>
              </div>
            </div>

            <button 
              onClick={resetChat}
              className="text-xs font-black text-slate-400 hover:text-slate-600 border border-slate-200 hover:border-slate-300 px-3.5 py-1.5 rounded-xl transition-all font-sans"
            >
              Reset Diskusi
            </button>
          </div>
          
          {/* Message Thread Scrollable List */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-6 flex flex-col min-h-0">
            <div className="max-w-4xl w-full mx-auto space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  const { cleanText, options } = extractOptions(msg.content);
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

                          {/* Sound Audio Button for AI Messages */}
                          {!isUser && (
                            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100/80">
                              <button
                                type="button"
                                onClick={() => handleSpeak(cleanText, i)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs ${
                                  isSpeaking 
                                    ? 'bg-[#FFCA28] text-[#1E3A5F] animate-pulse' 
                                    : 'bg-[#EAF9F9] hover:bg-[#d6f4f4] text-[#00B4B4]'
                                }`}
                              >
                                {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                                <span>{isSpeaking ? 'Berhenti Bicara ⏹️' : 'Dengarkan Suara 🔊'}</span>
                              </button>

                              <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">
                                • Dengarkan makhraj & harakat
                              </span>
                            </div>
                          )}

                          {/* Interactive Quick Answer Option Pills */}
                          {!isUser && options && options.length > 0 && (
                            <div className="mt-3.5 pt-2.5 border-t border-slate-100">
                              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
                                💡 Klik salah satu jawaban:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {options.map((opt, optIdx) => (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => handleSendOption(opt)}
                                    disabled={loading}
                                    className="bg-white hover:bg-[#EAF9F9] border-2 border-[#00B4B4] text-[#00B4B4] hover:text-[#009b9b] font-black text-xs px-3.5 py-1.5 rounded-full shadow-xs transform hover:scale-[1.03] active:scale-95 transition-all text-left cursor-pointer"
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
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
          <div className="p-4 sm:p-6 bg-[#EEF4FC] shrink-0">
            <form 
              onSubmit={handleSend}
              className="max-w-4xl mx-auto relative flex items-center"
            >
              <div className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl flex items-center px-4 py-3 gap-2.5">
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
