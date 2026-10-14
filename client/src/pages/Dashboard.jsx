import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  ChevronDown, 
  User
} from 'lucide-react';
import Logo from '../components/Logo';
import MobileBottomNav from '../components/MobileBottomNav';

// Asset Imports
import imgMulaiDiskusi from '../assets/mulai diskusi.png';
import imgUploadMateri from '../assets/upload materi (2).png';
import imgLanjutkanBelajar from '../assets/lanjutkan belajar.png';
import imgStar from '../assets/bintang beranda.png'; // Bintang Beranda Asset
import imgFire from '../assets/fire flame.png';
import imgBook from '../assets/book.png';
import imgRajin from '../assets/rajin.png';
import imgFokus from '../assets/fokus.png';
import imgEksplorer from '../assets/eksplorer.png';
import imgSaran1 from '../assets/saran materi 1.png';
import imgSaran2 from '../assets/saran materi 2.png';
import imgSaran3 from '../assets/materi 3.png';

// Recent Activity PNG Assets
import imgChat from '../assets/chat.png';
import imgRingkasanMateri from '../assets/icon ringkasan materi.png';
import imgProgress from '../assets/progress.png';
import imgUploadMateriIcon from '../assets/upload materi.png';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('Minggu ini');

  // Extract display name or use default
  const displayName = user?.name || "Budi Saputra";
  const firstName = displayName.split(' ')[0];

  return (
    <div className="min-h-screen bg-[#EEF4FC] overflow-x-hidden font-sans pb-24 md:pb-16">
      
      {/* NAVBAR */}
      <nav className="bg-white px-6 py-4 flex justify-between items-center select-none shadow-sm relative z-40 border-b border-slate-100">
        <Logo size="normal" />

        {/* Navigation Items (Middle) */}
        <div className="hidden md:flex items-center gap-8 font-bold text-slate-500">
          <Link to="/dashboard" className="text-[#1E3A5F] relative pb-1">
            Beranda
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#1E3A5F] rounded-full"></span>
          </Link>
          <Link to="/chat" className="hover:text-[#1E3A5F] transition-colors">Socratic Chat</Link>
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

      {/* DASHBOARD CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-6 mt-10">
        
        {/* Welcoming Header */}
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 bg-[#EAF9F9] border border-[#00B4B4]/30 px-3.5 py-1 rounded-full mb-3 text-xs font-black text-[#00B4B4] flex-wrap">
            <span>🐪</span>
            <span>Ifham Kids • Sahabat Belajar Bahasa Arab</span>
            {user?.grade && (
              <span className="bg-[#00B4B4] text-white px-2.5 py-0.5 rounded-full text-[10px] font-black">
                {user.grade}
              </span>
            )}
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">
            Ahlan wa Sahlan, <span className="text-[#00B4B4]">{firstName}!</span> 🌟 Mau berpetualang apa hari ini?
          </h1>
        </div>

        {/* 3 Action Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Card 1: Mulai Diskusi */}
          <div className="bg-[#D4E6FF] rounded-[24px] p-6 flex items-center gap-6 border border-[#c0dbff] relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <img src={imgMulaiDiskusi} alt="Mulai Diskusi" className="w-[110px] h-[110px] object-contain shrink-0" />
            <div className="flex flex-col text-left">
              <h3 className="text-[21px] font-extrabold text-[#1E3A5F] leading-tight">Mulai Petualangan</h3>
              <p className="text-slate-600 text-[13.5px] font-bold mt-1.5 leading-relaxed max-w-[210px]">
                Pecahkan teka-teki kosakata seru bersama Kak Ifham.
              </p>
              <Link 
                to="/chat" 
                className="mt-4 bg-[#1E3A5F] hover:bg-[#152a46] text-white px-5 py-2.5 rounded-xl text-xs font-black text-center transition-all inline-block w-fit"
              >
                Mulai Chat ➔
              </Link>
            </div>
          </div>

          {/* Card 2: Latihan Suara */}
          <div className="bg-[#BDE3F5] rounded-[24px] p-6 flex items-center gap-6 border border-[#a2d4ef] relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <img src={imgUploadMateri} alt="Latihan Suara" className="w-[110px] h-[110px] object-contain shrink-0" />
            <div className="flex flex-col text-left">
              <h3 className="text-[21px] font-extrabold text-[#1E3A5F] leading-tight">Suara & Makhraj</h3>
              <p className="text-slate-600 text-[13.5px] font-bold mt-1.5 leading-relaxed max-w-[210px]">
                Dengarkan lafal kata Arab berharakat dengan audio jernih.
              </p>
              <Link 
                to="/chat" 
                className="mt-4 bg-[#00B4B4] hover:bg-[#009c9c] text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all w-fit text-center block"
              >
                Latihan Suara ➔
              </Link>
            </div>
          </div>

          {/* Card 3: Lanjutkan Belajar */}
          <div className="bg-[#D4E6FF] rounded-[24px] p-6 flex items-center gap-6 border border-[#c0dbff] relative overflow-hidden transition-all duration-300 hover:shadow-lg">
            <img src={imgLanjutkanBelajar} alt="Lanjutkan belajar" className="w-[110px] h-[110px] object-contain shrink-0" />
            <div className="flex flex-col text-left">
              <h3 className="text-[21px] font-extrabold text-[#1E3A5F] leading-tight">Lanjutkan Belajar</h3>
              <p className="text-slate-600 text-[13.5px] font-bold mt-1.5 leading-relaxed max-w-[210px]">
                Lanjutkan topik hewan, angka, dan benda di sekolahmu.
              </p>
              <Link 
                to="/chat" 
                className="mt-4 bg-[#1E3A5F] hover:bg-[#152a46] text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all w-fit text-center block"
              >
                Lanjut Belajar ➔
              </Link>
            </div>
          </div>

        </section>

        {/* Middle Section: Grid of 2 Rounded White Containers */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          
          {/* Left panel: Aktivitas Terbaru */}
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 sm:p-8 flex flex-col text-left justify-between min-h-[400px]">
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-[#1E3A5F]">Aktivitas Terakhir</h3>
                <Link to="/library?tab=Terbaru" className="text-sm font-extrabold text-[#3B82F6] hover:underline">Lihat semua</Link>
              </div>

              {/* Activity List with dotted separators */}
              <div className="flex-1 flex flex-col justify-between">
                
                {/* Item 1 */}
                <div className="flex items-center gap-4">
                  <div className="w-[52px] h-[52px] rounded-2xl bg-amber-50 flex items-center justify-center text-2xl shrink-0 border border-amber-100">
                    🦁
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-extrabold text-[#1E3A5F] truncate">Teka-teki Hewan (الحَيَوَانَات)</h4>
                    <p className="text-xs text-slate-500 font-bold mt-0.5 truncate">Menebak kata Asadun (أَسَدٌ) & Qit-thun (قِطٌّ)</p>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200" />

                {/* Item 2 */}
                <div className="flex items-center gap-4">
                  <div className="w-[52px] h-[52px] rounded-2xl bg-blue-50 flex items-center justify-center text-2xl shrink-0 border border-blue-100">
                    🎒
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-extrabold text-[#1E3A5F] truncate">Benda di Kelasku (الأَدَوَات)</h4>
                    <p className="text-xs text-slate-500 font-bold mt-0.5 truncate">Mengenal Qolamun (قَلَمٌ) & Kitaabun (كِتَابٌ)</p>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200" />

                {/* Item 3 */}
                <div className="flex items-center gap-4">
                  <div className="w-[52px] h-[52px] rounded-2xl bg-teal-50 flex items-center justify-center text-2xl shrink-0 border border-teal-100">
                    ⭐
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-extrabold text-[#1E3A5F] truncate">Kuis Teka-Teki Ceria</h4>
                    <p className="text-xs text-slate-500 font-bold mt-0.5 truncate">5 soal tebakan | Skor: 100% Mumtaz!</p>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200" />

                {/* Item 4 */}
                <div className="flex items-center gap-4">
                  <div className="w-[52px] h-[52px] rounded-2xl bg-rose-50 flex items-center justify-center text-2xl shrink-0 border border-rose-100">
                    🔊
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-extrabold text-[#1E3A5F] truncate">Praktik Audio & Makhraj</h4>
                    <p className="text-xs text-slate-500 font-bold mt-0.5 truncate">Mendengarkan 12 pelafalan kata berharakat</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right panel: Progress Belajar */}
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-6 sm:p-8 flex flex-col text-left justify-between min-h-[400px]">
            <div>
              {/* Header with selector dropdown */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black text-[#1E3A5F]">Progress Belajar</h3>
                <div className="relative">
                  <select 
                    value={timeframe} 
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs font-extrabold text-[#1E3A5F] focus:outline-none cursor-pointer shadow-sm"
                  >
                    <option>Minggu ini</option>
                    <option>Bulan ini</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Progress and statistics inline block */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-7">
                
                {/* Circular Progress Gauge SVG (87%) - Larger & Bold */}
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#1E3A5F"
                      strokeWidth="11"
                      fill="transparent"
                      className="text-[#1E3A5F]"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#00B4B4"
                      strokeWidth="11"
                      fill="transparent"
                      strokeDasharray="238.76"
                      strokeDashoffset={238.76 * (1 - 0.87)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-3xl font-black text-[#00B4B4]">87%</span>
                </div>

                {/* 3 Metric Cards */}
                <div className="flex-1 grid grid-cols-3 gap-2.5 w-full">
                  
                  {/* XP */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1">
                      <img src={imgStar} alt="Star" className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] object-contain shrink-0" />
                      <span className="text-sm sm:text-base md:text-lg font-black text-[#1E3A5F] whitespace-nowrap">1.250</span>
                    </div>
                    <span className="text-[11px] sm:text-xs text-[#00B4B4] font-extrabold mt-1.5">+120 XP</span>
                    <span className="text-xs sm:text-sm text-slate-800 font-black mt-0.5">XP</span>
                  </div>

                  {/* Streak */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1">
                      <img src={imgFire} alt="Flame" className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] object-contain shrink-0" />
                      <span className="text-sm sm:text-base md:text-lg font-black text-[#1E3A5F] whitespace-nowrap">7 hari</span>
                    </div>
                    <span className="text-[11px] sm:text-xs text-[#00B4B4] font-extrabold mt-1.5">Terbaik!</span>
                    <span className="text-xs sm:text-sm text-slate-800 font-black mt-0.5">Streak</span>
                  </div>

                  {/* Topik */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-1">
                      <img src={imgBook} alt="Book" className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] object-contain shrink-0" />
                      <span className="text-sm sm:text-base md:text-lg font-black text-[#1E3A5F] whitespace-nowrap">18</span>
                    </div>
                    <span className="text-[11px] sm:text-xs text-[#00B4B4] font-extrabold mt-1.5">Topik</span>
                    <span className="text-xs sm:text-sm text-slate-800 font-black mt-0.5">Materi</span>
                  </div>

                </div>
              </div>

              {/* Pencapaian Terbaru Badges */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-extrabold text-[#1E3A5F]">Pencapaian Terbaru</h4>
                  <a href="#" className="text-xs font-extrabold text-[#3B82F6] hover:underline">Lihat semua</a>
                </div>

                {/* 3 badges responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full bg-white py-1">
                  
                  {/* Badge 1: Rajin */}
                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-amber-50/50 sm:bg-transparent border sm:border-0 border-amber-100 min-w-0">
                    <div className="w-[48px] h-[48px] bg-[#FFCA28] flex items-center justify-center shrink-0 rounded-xl">
                      <img src={imgRajin} alt="Rajin" className="w-[65%] h-[65%] object-contain" />
                    </div>
                    <div className="min-w-0 text-left">
                      <h5 className="text-sm font-black text-[#1E3A5F]">Rajin</h5>
                      <p className="text-xs text-slate-500 font-bold leading-tight mt-0.5">Belajar 5 hari berturut-turut</p>
                    </div>
                  </div>

                  {/* Badge 2: Fokus */}
                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-blue-50/50 sm:bg-transparent border sm:border-0 border-blue-100 min-w-0">
                    <img src={imgFokus} alt="Fokus" className="w-[48px] h-[48px] object-contain shrink-0" />
                    <div className="min-w-0 text-left">
                      <h5 className="text-sm font-black text-[#1E3A5F]">Fokus</h5>
                      <p className="text-xs text-slate-500 font-bold leading-tight mt-0.5">Selesaikan 10 kuis</p>
                    </div>
                  </div>

                  {/* Badge 3: Explorer */}
                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-emerald-50/50 sm:bg-transparent border sm:border-0 border-emerald-100 min-w-0">
                    <img src={imgEksplorer} alt="Explorer" className="w-[48px] h-[48px] object-contain shrink-0" />
                    <div className="min-w-0 text-left">
                      <h5 className="text-sm font-black text-[#1E3A5F]">Explorer</h5>
                      <p className="text-xs text-slate-500 font-bold leading-tight mt-0.5">Pelajari 20 topik</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Bottom Section: Rekomendasi Untukmu */}
        <section className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-8 text-left">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-black text-[#1E3A5F]">Petualangan Seru Selanjutnya 🗺️</h3>
              <p className="text-xs text-slate-400 font-bold mt-0.5">Pilih topik seru yang ingin kamu jelajahi bersama Kak Ifham</p>
            </div>
            <Link to="/library" className="text-sm font-extrabold text-[#00B4B4] hover:underline">Buka Semua Topik</Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Hewan Ceria */}
            <Link to="/chat" className="border-2 border-slate-100 hover:border-[#00B4B4] bg-white rounded-[20px] p-6 flex items-center gap-5 hover:shadow-md transition-all duration-300 cursor-pointer block">
              <div className="w-[72px] h-[72px] rounded-2xl bg-amber-50 flex items-center justify-center text-4xl shrink-0 border border-amber-200">
                🦁
              </div>
              <div className="min-w-0">
                <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full uppercase">Level 1</span>
                <h4 className="text-base sm:text-lg font-black text-[#1E3A5F] leading-tight mt-1">Hewan Ceria (الحَيَوَانَات)</h4>
                <p className="text-xs text-slate-500 font-bold mt-1 leading-relaxed">
                  Kenali nama singa, gajah, kucing, dan burung dalam bahasa Arab.
                </p>
              </div>
            </Link>

            {/* Card 2: Benda di Kelasku */}
            <Link to="/chat" className="border-2 border-slate-100 hover:border-[#00B4B4] bg-white rounded-[20px] p-6 flex items-center gap-5 hover:shadow-md transition-all duration-300 cursor-pointer block">
              <div className="w-[72px] h-[72px] rounded-2xl bg-blue-50 flex items-center justify-center text-4xl shrink-0 border border-blue-200">
                🎒
              </div>
              <div className="min-w-0">
                <span className="text-[10px] bg-blue-100 text-blue-800 font-black px-2 py-0.5 rounded-full uppercase">Level 2</span>
                <h4 className="text-base sm:text-lg font-black text-[#1E3A5F] leading-tight mt-1">Di Kelasku (الأَدَوَات)</h4>
                <p className="text-xs text-slate-500 font-bold mt-1 leading-relaxed">
                  Pahami kosakata buku, pulpen, tas, penggaris, dan meja kelas.
                </p>
              </div>
            </Link>

            {/* Card 3: Buah & Makanan */}
            <Link to="/chat" className="border-2 border-slate-100 hover:border-[#00B4B4] bg-white rounded-[20px] p-6 flex items-center gap-5 hover:shadow-md transition-all duration-300 cursor-pointer block">
              <div className="w-[72px] h-[72px] rounded-2xl bg-rose-50 flex items-center justify-center text-4xl shrink-0 border border-rose-200">
                🍎
              </div>
              <div className="min-w-0">
                <span className="text-[10px] bg-rose-100 text-rose-800 font-black px-2 py-0.5 rounded-full uppercase">Level 3</span>
                <h4 className="text-base sm:text-lg font-black text-[#1E3A5F] leading-tight mt-1">Buah & Makanan (الفَوَاكِه)</h4>
                <p className="text-xs text-slate-500 font-bold mt-1 leading-relaxed">
                  Tebak bahasa Arab apel manis, pisang, kurma, dan susu segar.
                </p>
              </div>
            </Link>

          </div>
        </section>

      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Dashboard;
