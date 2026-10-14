import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, BookOpen, Volume2, Sparkles, MessageCircle, 
  HelpCircle, Star, ArrowRight, Award, Compass, HeartHandshake
} from 'lucide-react';
import { speechService } from '../utils/speechHelper';

const BukuPanduanModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('pengenalan');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const sampleArabicWord = "قِطٌّ (Qit-thun = Kucing)";

  const handleTestAudio = () => {
    setIsPlayingAudio(true);
    speechService.speakVocab("قِطٌّ", "Qit-thun", {
      onEnd: () => setIsPlayingAudio(false)
    });
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'pengenalan', label: '1. Kenalan dengan Kak Ifham', icon: '🌟' },
    { id: 'suara', label: '2. Cara Pakai Suara 🔊', icon: '🎙️' },
    { id: 'sokrates', label: '3. Teka-Teki & Tombol Cepat', icon: '💡' },
    { id: 'level', label: '4. Petualangan Materi SD', icon: '🗺️' },
    { id: 'ortu', label: '5. Panduan Orang Tua & Guru', icon: '👨‍👩‍👧‍👦' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-navy/60 backdrop-blur-sm bg-black/40"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-teal-100 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1E3A5F] via-[#1a4a6e] to-[#00B4B4] p-6 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
                📖
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="bg-[#FFCA28] text-[#1E3A5F] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Edisi Anak SD
                  </span>
                  <span className="text-xs text-white/80 font-bold">Ramah Pemula & Seru</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                  Buku Panduan Petualangan Ifham
                </h3>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all transform hover:rotate-90"
              aria-label="Tutup Panduan"
            >
              <X size={20} />
            </button>
          </div>

          {/* Subheader Navigation Pills */}
          <div className="flex overflow-x-auto gap-2 p-3 bg-slate-50 border-b border-slate-100 shrink-0 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#1E3A5F] text-white shadow-md shadow-navy/10' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-left space-y-6">
            
            {/* TAB 1: PENGENALAN */}
            {activeTab === 'pengenalan' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-teal-50/70 to-blue-50/70 p-6 rounded-2xl border border-teal-100">
                  <div className="w-24 h-24 rounded-full bg-white shadow-md flex items-center justify-center text-5xl shrink-0 border-4 border-[#00B4B4]/20 animate-bounce">
                    🐪
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#1E3A5F]">
                      Ahlan wa Sahlan! Kenalan dengan Kak Ifham 👋
                    </h4>
                    <p className="text-slate-600 text-sm font-medium mt-2 leading-relaxed">
                      Hai adik-adik yang hebat! **Ifham (إِفْهَمْ)** artinya *"Pahamilah!"*. Kak Ifham adalah sahabat pintar yang siap menemani kamu belajar bahasa Arab seperti sedang bermain tebak-tebakan seru di kebun binatang, sekolah, atau pasar buah!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">⭐</span>
                    <h5 className="font-black text-[#1E3A5F] text-sm">Tanpa Hafalan Kaku</h5>
                    <p className="text-xs text-slate-500 mt-1">Belajar lewat teka-teki asyik dan gambar yang gampang diingat.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">🔊</span>
                    <h5 className="font-black text-[#1E3A5F] text-sm">Ada Suara Pelafalan</h5>
                    <p className="text-xs text-slate-500 mt-1">Tinggal klik tombol speaker untuk mendengar makhraj yang benar.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center">
                    <span className="text-3xl mb-2">🎮</span>
                    <h5 className="font-black text-[#1E3A5F] text-sm">Tombol Opsi Jawaban</h5>
                    <p className="text-xs text-slate-500 mt-1">Gak perlu pusing ngetik Arab di keyboard, tinggal klik pilihan jawaban!</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: FITUR SUARA */}
            {activeTab === 'suara' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="bg-white border-2 border-[#00B4B4] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-block bg-[#EAF9F9] text-[#00B4B4] font-black text-xs px-3 py-1 rounded-full mb-2">
                        Fitur Audio & Suara
                      </span>
                      <h4 className="text-lg font-black text-[#1E3A5F]">
                        Belajar Mendengar & Melafalkan Huruf Arab 🎙️
                      </h4>
                      <p className="text-slate-600 text-sm font-medium mt-1 leading-relaxed">
                        Bahasa Arab itu sangat merdu jika dilafalkan dengan tepat. Di setiap pesan Kak Ifham, adik-adik bisa menemukan tombol suara berikut:
                      </p>
                    </div>
                  </div>

                  {/* Interactive Test Audio Widget */}
                  <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-2xl">
                        🐱
                      </div>
                      <div className="text-left">
                        <span className="font-arabic text-2xl font-bold text-[#1E3A5F]">قِطٌّ</span>
                        <p className="text-xs text-slate-500 font-bold">Qit-thun = Kucing</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleTestAudio}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all transform active:scale-95 ${
                        isPlayingAudio 
                          ? 'bg-[#FFCA28] text-[#1E3A5F] animate-pulse' 
                          : 'bg-[#00B4B4] hover:bg-[#009b9b] text-white'
                      }`}
                    >
                      <Volume2 size={18} />
                      <span>{isPlayingAudio ? 'Sedang Bersuara... 🔊' : 'Coba Dengarkan Suara 🔊'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-black text-[#1E3A5F] text-sm">Langkah Praktik untuk Anak:</h5>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 font-medium">
                    <li><strong className="text-[#1E3A5F]">Klik tombol speaker 🔊</strong> di samping kata Arab.</li>
                    <li><strong className="text-[#1E3A5F]">Pasang telinga baik-baik</strong> dan dengarkan irama hurufnya.</li>
                    <li><strong className="text-[#1E3A5F]">Tirukan 2-3 kali</strong> dengan suara lantang dan ceria!</li>
                    <li>Jika ada mikrofon 🎙️, kamu juga bisa menjawab dengan langsung bersuara lho!</li>
                  </ol>
                </div>
              </motion.div>
            )}

            {/* TAB 3: SOKRATES & TOMBOL CEPAT */}
            {activeTab === 'sokrates' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <h4 className="text-lg font-black text-[#1E3A5F]">
                    Bagaimana Cara Kak Ifham Membimbingmu? 💡
                  </h4>
                  <p className="text-slate-600 text-sm font-medium mt-1 leading-relaxed">
                    Kak Ifham tidak langsung memberi contekan jawaban, tapi memberikan teka-teki petunjuk bertahap agar adik-adik bangga bisa menemukan jawabannya sendiri!
                  </p>
                </div>

                {/* Example Chat Simulator */}
                <div className="bg-[#EEF4FC] rounded-2xl p-5 border border-blue-100 space-y-4">
                  {/* AI Bubble */}
                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center text-sm font-black shrink-0">
                      AI
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-left max-w-md">
                      <p className="text-xs sm:text-sm text-[#1E3A5F] font-semibold leading-relaxed">
                        Coba tebak jagoan! Hewan ini suka makan rumput, punya leher yang panjaaaang sekali menjulang ke langit 🦒. Bahasa Arabnya apa ya?
                      </p>
                    </div>
                  </div>

                  {/* Quick Pills Example */}
                  <div className="pl-12 flex flex-wrap gap-2">
                    <span className="bg-white hover:bg-teal-50 border-2 border-[#00B4B4] text-[#00B4B4] font-extrabold text-xs px-3.5 py-1.5 rounded-full cursor-pointer shadow-sm">
                      A. Zaroofatun (زَرَافَةٌ) 🦒
                    </span>
                    <span className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold text-xs px-3.5 py-1.5 rounded-full cursor-pointer shadow-sm">
                      B. Asadun (أَسَدٌ) 🦁
                    </span>
                    <span className="bg-white hover:bg-slate-50 border border-amber-300 text-amber-700 font-bold text-xs px-3.5 py-1.5 rounded-full cursor-pointer shadow-sm">
                      Minta Petunjuk 💡
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-semibold flex items-center gap-3">
                  <span className="text-xl">✨</span>
                  <span>Cukup klik salah satu tombol jawaban, dan pesanmu akan langsung terkirim secara otomatis!</span>
                </div>
              </motion.div>
            )}

            {/* TAB 4: LEVEL MATERI SD (REKOMENDASI AHLI MATERI) */}
            {activeTab === 'level' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                      Standar Capaian Ahli Materi
                    </span>
                    <span className="text-xs text-slate-400 font-bold">5 Tingkatan Kelas</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-[#1E3A5F] mt-1">
                    Peta Capaian Kurikulum Bahasa Arab SD 🗺️
                  </h4>
                  <p className="text-slate-600 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                    Setiap tingkatan kelas dirancang dengan batasan pedagogis ketat agar materi sesuai dengan tingkat kognitif santri cilik:
                  </p>
                </div>

                <div className="space-y-3">
                  {/* KELAS 1 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/70 to-orange-50/40 border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-base shrink-0 shadow-sm">
                      K1
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-black text-[#1E3A5F] text-sm sm:text-base">SD Kelas 1: Kata Tunjuk, Angka & Hijaiyah</h5>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Pemula Dasar</span>
                      </div>
                      <p className="text-xs text-slate-700 font-bold mt-1">
                        🎯 <span className="text-[#1E3A5F]">Fokus Capaian:</span> Kata tunjuk (هٰذَا/هٰذِهِ - haza/hazihi), angka 1-10 (الأَرْقَام ١-١٠), dan huruf hijaiyah.
                      </p>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        📚 <span className="text-slate-700 font-bold">Tema Resmi:</span> Perkenalan (التَّعَارُف), Keluarga (الأُسْرَة), Hobi (الهِوَايَة), Buah (الفَوَاكِه).
                      </p>
                      <p className="text-[11px] text-amber-800 font-semibold mt-1 bg-amber-100/70 px-2.5 py-1 rounded-lg">
                        ⚠️ <strong>Batasan:</strong> Kosakata 1-2 kata, tanpa kalimat majemuk, dekat dengan dunia anak usia 6-7 tahun.
                      </p>
                    </div>
                  </div>

                  {/* KELAS 3 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-teal-50/40 border border-emerald-200 shadow-sm flex flex-col sm:flex-row sm:items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-sm">
                      K3
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-black text-[#1E3A5F] text-sm sm:text-base">SD Kelas 3: Pola Tanya Jawab Dasar</h5>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Interaksi Dialogis</span>
                      </div>
                      <p className="text-xs text-slate-700 font-bold mt-1">
                        🎯 <span className="text-[#1E3A5F]">Fokus Capaian:</span> Pola tanya jawab dasar seperti <em>Hal 'indaka...?</em> (Apakah kamu punya...?) &amp; <em>Maza tuhibbu...?</em> (Apa yang kamu sukai?).
                      </p>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        📚 <span className="text-slate-700 font-bold">Tema Resmi:</span> Hewan (الحَيَوَانَات), Olahraga (الرِّيَاضَة), Penyakit &amp; Kesehatan (الأَمْرَاض).
                      </p>
                      <p className="text-[11px] text-emerald-800 font-semibold mt-1 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                        ⚠️ <strong>Batasan:</strong> Dialog sederhana 1 kalimat bolak-balik (Na'am/Laa/'Indii/Uhibbu), belum perubahan fi'il rumit.
                      </p>
                    </div>
                  </div>

                  {/* KELAS 4 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50/70 to-blue-50/40 border border-sky-200 shadow-sm flex flex-col sm:flex-row sm:items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-sm">
                      K4
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-black text-[#1E3A5F] text-sm sm:text-base">SD Kelas 4: Gender &amp; Fi'il Mudhari' Dasar</h5>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">Tata Bahasa Dasar</span>
                      </div>
                      <p className="text-xs text-slate-700 font-bold mt-1">
                        🎯 <span className="text-[#1E3A5F]">Fokus Capaian:</span> Pengenalan gender (Muzakkar/Muannats) dan kata kerja aktivitas sekarang (Fi'il Mudhari' dasar).
                      </p>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        📚 <span className="text-slate-700 font-bold">Tema Resmi:</span> Profesi (المِهْنَة), Cita-cita (آمَال / أُمْنِيَّات), Aktivitas di rumah (الأَنْشِطَة فِي البَيْت).
                      </p>
                      <p className="text-[11px] text-sky-800 font-semibold mt-1 bg-sky-100/70 px-2.5 py-1 rounded-lg">
                        ⚠️ <strong>Batasan:</strong> Fokus hanya pada waktu SEKARANG (Fi'il Mudhari' Huwa/Hiya). Jangan mencampur dengan Fi'il Madhi/Amr.
                      </p>
                    </div>
                  </div>

                  {/* KELAS 5 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/70 to-purple-50/40 border border-indigo-200 shadow-sm flex flex-col sm:flex-row sm:items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-sm">
                      K5
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-black text-[#1E3A5F] text-sm sm:text-base">SD Kelas 5: Mubtada' Khabar &amp; Kata Sifat (Na'at)</h5>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">Struktur Kalimat</span>
                      </div>
                      <p className="text-xs text-slate-700 font-bold mt-1">
                        🎯 <span className="text-[#1E3A5F]">Fokus Capaian:</span> Susunan kalimat nominal Mubtada' &amp; Khabar serta Kata Sifat (Na'at &amp; Man'ut).
                      </p>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        📚 <span className="text-slate-700 font-bold">Tema Resmi:</span> Anggota tubuh (أَعْضَاء الجِسْم), Kebun binatang (حَدِيقَة الحَيَوَانَات), Ruang tamu (غُرْفَة الجُلُوس), Kantin (المَقْصَف).
                      </p>
                      <p className="text-[11px] text-indigo-800 font-semibold mt-1 bg-indigo-100/70 px-2.5 py-1 rounded-lg">
                        ⚠️ <strong>Batasan:</strong> Kalimat deskriptif nominal dan kesesuaian jenis sifat (muannats/muzakkar). Hindari amil rumit (inna/kaana).
                      </p>
                    </div>
                  </div>

                  {/* KELAS 6 */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/70 to-pink-50/40 border border-purple-200 shadow-sm flex flex-col sm:flex-row sm:items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-base shrink-0 shadow-sm">
                      K6
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-black text-[#1E3A5F] text-sm sm:text-base">SD Kelas 6: 3 Waktu Fi'il &amp; Narasi Masa Lalu</h5>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">Tingkat Mahir</span>
                      </div>
                      <p className="text-xs text-slate-700 font-bold mt-1">
                        🎯 <span className="text-[#1E3A5F]">Fokus Capaian:</span> Perubahan waktu kata kerja utuh (Fi'il Mudhari', Amr, Madhi) dan bercerita/narasi masa lalu.
                      </p>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        📚 <span className="text-slate-700 font-bold">Tema Resmi:</span> Waktu/Jam (السَّاعَة / الوَقْت), Liburan (العُطْلَة), Piknik (النُّزْهَة).
                      </p>
                      <p className="text-[11px] text-purple-800 font-semibold mt-1 bg-purple-100/70 px-2.5 py-1 rounded-lg">
                        ⚠️ <strong>Batasan:</strong> Membandingkan perubahan bentuk 3 waktu kata kerja dan merangkai cerita liburan masa lalu berbasis waktu.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 5: PANDUAN ORTU & GURU */}
            {activeTab === 'ortu' && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                  <h4 className="text-lg font-black text-[#1E3A5F] flex items-center gap-2">
                    <HeartHandshake className="text-[#00B4B4]" size={22} />
                    <span>Catatan Khusus untuk Ayah, Bunda & Bapak/Ibu Guru</span>
                  </h4>
                  <p className="text-slate-600 text-sm font-medium mt-2 leading-relaxed">
                    Tujuan utama Ifham Kids adalah menumbuhkan rasa cinta dan percaya diri anak pada bahasa Arab sejak dini.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-teal-100 text-[#00B4B4] font-black flex items-center justify-center shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <h5 className="font-black text-[#1E3A5F] text-sm">Fokus pada Pelafalan & Kesenangan</h5>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Biarkan anak sering menekan tombol suara 🔊 dan menirukannya tanpa membebani tata bahasa yang rumit.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-teal-100 text-[#00B4B4] font-black flex items-center justify-center shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <h5 className="font-black text-[#1E3A5F] text-sm">Berikan Waktu Belajar 10-15 Menit Sehari</h5>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Rentang konsentrasi anak SD idealnya 10–15 menit per sesi. Belajar sedikit demi sedikit jauh lebih efektif.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-teal-100 text-[#00B4B4] font-black flex items-center justify-center shrink-0 text-xs">
                      3
                    </div>
                    <div>
                      <h5 className="font-black text-[#1E3A5F] text-sm">Rayakan Setiap Bintang yang Didapat</h5>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Setiap kali anak menjawab dan mendapat "Mumtaz! ⭐", berikan tos tangan atau tepuk tangan agar anak makin bersemangat!</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Footer Action */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <span className="text-xs text-slate-500 font-bold">
              Sudah paham caranya? Yuk langsung mulai petualanganmu! 🚀
            </span>
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-[#1E3A5F] hover:bg-[#152a46] text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-md transition-all transform hover:scale-[1.02]"
            >
              Tutup Panduan & Mulai Belajar ➔
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BukuPanduanModal;
