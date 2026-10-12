import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Logo from '../components/Logo';
import progressImg from '../assets/Vector-1.png';
import chatImg from '../assets/icon socratic chat.png';

const FiturPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      title: 'Socratic Chat & Suara',
      desc: 'Kak Ifham membimbing santri cilik dengan teka-teki ramah anak, dilengkapi audio pengucapan makhraj dan tombol suara.',
      details: [
        'Teka-teki & dialog Socratic ramah anak SD',
        'Audio lafal Arab (Text-to-Speech) & input mikrofon',
        'Pilihan jawaban cepat (quick reply) tanpa ribet mengetik',
      ],
      icon: (
        <img src={chatImg} alt="Socratic Chat" className="w-12 h-12 object-contain" />
      ),
      color: 'from-teal-50 to-cyan-50',
      border: 'border-[#00B4B4]/20',
    },
    {
      title: 'Materi & Lembar Kerja',
      desc: 'Unggah modul bergambar, buku paket bahasa Arab SD, atau lembar tugas, lalu Kak Ifham akan menjelaskan artinya dengan ceria.',
      details: [
        'Mendukung format PDF, PNG, JPG',
        'Penjelasan kosakata lengkap harakat & latin',
        'Visualisasi gambar yang ramah anak',
      ],
      icon: (
        <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 28C8.686 28 6 25.314 6 22C6 19.18 7.93 16.81 10.6 16.14C11.3 11.56 15.25 8 20 8C25.52 8 30 12.48 30 18C30 18.68 29.93 19.35 29.8 20C32.32 20.73 34 23.11 34 26C34 29.31 31.31 32 28 32H12" stroke="#00B4B4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 28V18" stroke="#00B4B4" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M16 22L20 18L24 22" stroke="#00B4B4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      color: 'from-blue-50 to-slate-50',
      border: 'border-blue-100',
    },
    {
      title: 'Thinking Trace',
      desc: 'Lihat alur penalaran langkah demi langkah agar adik-adik paham asal-usul kata dan makna bahasa Arab.',
      details: [
        'Visualisasi alur berpikir yang runut dan mudah dipahami',
        'Dekomposisi harakat, makna, dan kaidah dasar',
        'Ideal untuk penguasaan mufrodat & percakapan anak',
      ],
      icon: (
        <svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="20" r="4" fill="none" stroke="#00B4B4" strokeWidth="2.5"/>
          <circle cx="26" cy="10" r="4" fill="none" stroke="#00B4B4" strokeWidth="2.5"/>
          <circle cx="26" cy="30" r="4" fill="none" stroke="#00B4B4" strokeWidth="2.5"/>
          <path d="M13.5 18.5L22.5 11.5" stroke="#00B4B4" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M13.5 21.5L22.5 28.5" stroke="#00B4B4" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
      color: 'from-emerald-50 to-teal-50',
      border: 'border-emerald-100',
    },
    {
      title: 'Progress & Kuis Ceria',
      desc: 'Pantau perkembangan belajarmu secara menyenangkan dengan lencana bintang, streak harian, dan kuis adaptif.',
      details: [
        'Dasbor kemajuan belajar dan lencana ceria',
        'Kuis tebak kata berbasis topik kurikulum SD',
        'Evaluasi santai tanpa rasa takut salah',
      ],
      icon: (
        <img src={progressImg} alt="Progress" className="w-12 h-12 object-contain" />
      ),
      color: 'from-violet-50 to-purple-50',
      border: 'border-violet-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f6fc] to-[#e6eef8] font-sans relative overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-4 flex justify-between items-center shadow-sm">
        <Logo size="normal" />
        <div className="hidden md:flex items-center gap-8 font-bold text-slate-500">
          <Link to="/" className="hover:text-[#1E3A5F] transition-colors relative pb-1 group">
            Beranda
            <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#00B4B4] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
          <Link to="/fitur" className="text-[#1E3A5F] relative pb-1">
            Fitur
            <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#00B4B4] rounded-full"></span>
          </Link>
          <Link to="/cara-kerja" className="hover:text-[#1E3A5F] transition-colors relative pb-1 group">
            Cara kerja
            <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#00B4B4] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
          <Link to="/tentang" className="hover:text-[#1E3A5F] transition-colors relative pb-1 group">
            Tentang
            <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#00B4B4] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-4 font-bold text-sm">
          <Link to="/login" className="bg-[#1E3A5F] hover:bg-[#152a46] text-white px-6 py-2.5 rounded-xl transition-all shadow-sm">
            Masuk
          </Link>
          <Link to="/register" className="bg-white border-2 border-[#00B4B4] text-[#00B4B4] hover:bg-[#00B4B4] hover:text-white px-5 py-2 rounded-xl transition-all shadow-sm">
            Registrasi
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-[#1E3A5F] hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="fixed top-16 left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 hover:text-[#00B4B4] font-bold py-2 border-b border-slate-100">Beranda</Link>
            <Link to="/fitur" onClick={() => setMobileMenuOpen(false)} className="text-[#00B4B4] font-bold py-2 border-b border-slate-100">Fitur</Link>
            <Link to="/cara-kerja" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 hover:text-[#00B4B4] font-bold py-2 border-b border-slate-100">Cara Kerja</Link>
            <Link to="/tentang" onClick={() => setMobileMenuOpen(false)} className="text-slate-700 hover:text-[#00B4B4] font-bold py-2 border-b border-slate-100">Tentang</Link>
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center bg-[#1E3A5F] text-white py-3 rounded-xl font-bold text-sm">Masuk</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center border-2 border-[#00B4B4] text-[#00B4B4] py-3 rounded-xl font-bold text-sm">Registrasi</Link>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 lg:pt-40 pb-12 sm:pb-16 text-center select-none">
        <div className="flex flex-col items-center">
          <span className="bg-[#00B4B4]/10 text-[#00B4B4] font-extrabold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            Fitur Unggulan
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-[#1E3A5F] leading-tight tracking-tighter max-w-3xl">
            Semua yang Kamu Butuhkan untuk <span className="text-[#00B4B4]">Belajar Lebih Cerdas</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base md:text-lg mt-4 sm:mt-6 max-w-2xl leading-relaxed">
            IfhamKids hadir dengan ekosistem fitur lengkap yang ramah anak — dari dialog Socratic Kak Ifham, audio pelafalan makhraj, hingga kuis teka-teki ceria — semua untuk membantumu lancar berbahasa Arab.
          </p>
        </div>
      </header>

      {/* FEATURE CARDS GRID */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24 select-none">
        <div className="border border-[#00B4B4] bg-[#EEF4FC]/40 p-4 sm:p-8 lg:p-10 rounded-[32px] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${f.color} border ${f.border} rounded-[24px] p-6 sm:p-7 shadow-[0_8px_30px_rgba(15,34,61,0.04)] flex flex-col hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(15,34,61,0.08)] transition-all duration-300`}
              >
                {/* Icon + Title row */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                    {f.icon}
                  </div>
                  <h3 className="font-extrabold text-[#1E3A5F] text-xl">{f.title}</h3>
                </div>

                {/* Description */}
                <p className="text-slate-500 font-semibold text-sm leading-relaxed mb-5">
                  {f.desc}
                </p>

                {/* Bullet points */}
                <ul className="space-y-2.5 mt-auto">
                  {f.details.map((d, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00B4B4] shrink-0 mt-1.5" />
                      <span className="text-[#1E3A5F] font-semibold text-xs leading-relaxed">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1E3A5F] text-white py-20 px-6 text-center select-none">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
            Siap Coba Semua Fitur IfhamKids?
          </h2>
          <p className="text-slate-300 font-semibold text-base mt-6 max-w-xl leading-relaxed">
            Daftar gratis hari ini dan nikmati seluruh petualangan belajar bahasa Arab ceria yang menunggumu!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 font-bold w-full sm:w-auto justify-center">
            <Link to="/register" className="bg-[#00B4B4] hover:bg-[#009c9c] text-white px-8 py-4 rounded-xl shadow-lg transition-all text-center">
              Mulai Belajar Sekarang
            </Link>
            <Link to="/cara-kerja" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl shadow-lg transition-all text-center">
              Lihat Cara Kerja
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0F223D] text-white pt-16 pb-8 px-6 border-t border-slate-800 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-4 flex flex-col justify-start">
            <div className="flex items-center gap-3 mb-4">
              <Logo size="normal" showText={false} />
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-white">Ifham</span>
                <span className="text-[#00B4B4]">Kids</span>
              </span>
            </div>
            <p className="text-slate-400 font-bold text-xs">Sahabat Socratic AI Belajar Bahasa Arab Ramah Anak SD</p>
            <span className="text-slate-300 font-bold text-xs mt-8 mb-3 block">Follow us</span>
            <div className="flex gap-3">
              {['twitter', 'linkedin', 'facebook', 'instagram'].map((soc, i) => (
                <div key={i} className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-colors cursor-pointer text-xs font-bold uppercase">
                  {soc[0]}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-white font-extrabold text-sm mb-5">Navigasi</h4>
            <div className="space-y-3">
              <Link to="/" className="block text-slate-400 hover:text-white font-semibold text-xs transition-colors">Beranda</Link>
              <Link to="/fitur" className="block text-slate-400 hover:text-white font-semibold text-xs transition-colors">Fitur</Link>
              <Link to="/cara-kerja" className="block text-slate-400 hover:text-white font-semibold text-xs transition-colors">Cara Kerja</Link>
              <Link to="/tentang" className="block text-slate-400 hover:text-white font-semibold text-xs transition-colors">Tentang</Link>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-white font-extrabold text-sm mb-5">Fitur</h4>
            <div className="space-y-3">
              <span className="block text-slate-400 font-semibold text-xs">Socratic Chat</span>
              <span className="block text-slate-400 font-semibold text-xs">Audio Suara Arab</span>
              <span className="block text-slate-400 font-semibold text-xs">Tombol Opsi Cepat</span>
              <span className="block text-slate-400 font-semibold text-xs">Quiz & Progress</span>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-white font-extrabold text-sm mb-5">Tentang</h4>
            <div className="space-y-3">
              <Link to="/tentang" className="block text-slate-400 hover:text-white font-semibold text-xs transition-colors">Tentang Kami</Link>
              <span className="block text-slate-400 font-semibold text-xs">Kebijakan Privasi</span>
              <span className="block text-slate-400 font-semibold text-xs">Syarat & Ketentuan</span>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-white font-extrabold text-sm mb-5">Hubungi Kami</h4>
            <div className="space-y-3 text-slate-400 font-semibold text-xs">
              <span className="block">ifhamkids@gmail.com</span>
              <span className="block">+62 813-5832-8568</span>
              <span className="block">Malang, Indonesia</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800/80 my-6"></div>
        <p className="text-slate-500 font-bold text-xs text-center">IfhamKids All Right Reserved, 2026</p>
      </footer>

    </div>
  );
};

export default FiturPage;
