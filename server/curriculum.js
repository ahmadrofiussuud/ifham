// server/curriculum.js - Standar Kurikulum Bahasa Arab SD (Rekomendasi Ahli Materi)
// Akomodasi 5 Tingkatan Kelas: Kelas 1, Kelas 3, Kelas 4, Kelas 5, Kelas 6

const GRADE_CONFIGS = {
  '1': {
    id: '1',
    gradeNumber: 1,
    label: 'SD Kelas 1',
    shortLabel: 'Kelas 1',
    badge: 'Kata Tunjuk & Angka',
    focus: 'Fokus pada kata tunjuk (haza/hazihi), angka 1-10, dan huruf hijaiyah.',
    allowedThemes: [
      { id: 'k1-perkenalan', name: 'Perkenalan (التَّعَارُف)', arabic: 'التَّعَارُف', icon: '👋', clue: 'Nama dan sapaan halo' },
      { id: 'k1-keluarga', name: 'Keluarga (الأُسْرَة)', arabic: 'الأُسْرَة', icon: '👨‍👩‍👧‍👦', clue: 'Ayah, Ibu, Saudara' },
      { id: 'k1-hobi', name: 'Hobi (الهِوَايَة)', arabic: 'الهِوَايَة', icon: '🎨', clue: 'Membaca, menggambar' },
      { id: 'k1-buah', name: 'Buah (الفَوَاكِه)', arabic: 'الفَوَاكِه', icon: '🍎', clue: 'Apel, pisang, kurma, jeruk' },
      { id: 'k1-angka', name: 'Angka & Nomor 1-10 (الأَرْقَام)', arabic: 'الأَرْقَام', icon: '🔢', clue: 'Angka 1 sampai 10' }
    ],
    rulesText: `
[TARGET CAPAIAN & BATASAN KELAS 1 SD]:
1. FOKUS MATERI:
   - Kata tunjuk dekat dasar: **هٰذَا** (*Haadzaa* untuk muzakkar/laki-laki) dan **هٰذِهِ** (*Haadzihi* untuk muannats/perempuan/ada ta marbuthah).
   - Angka 1-10: **الأَرْقَام ١-١٠** (وَاحِدٌ, اِثْنَانِ, ثَلَاثَةٌ, أَرْبَعَةٌ, خَمْسَةٌ, سِتَّةٌ, سَبْعَةٌ, ثَمَانِيَةٌ, تِسْعَةٌ, عَشَرَةٌ).
   - Pengenalan bunyi huruf hijaiyah tunggal & makhraj (Alif, Ba, Ta, Tsa, Jim... sampai Ya).
2. TEMA PEMBELAJARAN RESMI: Perkenalan, Keluarga, Hobi, Buah.
3. BATASAN KETAT PEDAGOGIS:
   - DILARANG menggunakan kalimat panjang atau tata bahasa tingkat lanjut.
   - Kosakata harus sangat ringkas: 1-2 kata per frasa (contoh: "هٰذَا أَبِي" / *Haadzaa Abii*, "هٰذِهِ تُفَّاحَةٌ" / *Haadzihi tuffaahatun*).
   - Selalu sebutkan bunyi huruf depannya untuk tebak huruf hijaiyah (misal: "Huruf depannya adalah Alif (أ)").
   - Respons maksimal 2 kalimat pendek yang ceria, santun, dan penuh emoji visual anak-anak.`
  },

  '3': {
    id: '3',
    gradeNumber: 3,
    label: 'SD Kelas 3',
    shortLabel: 'Kelas 3',
    badge: 'Tanya Jawab Dasar',
    focus: 'Fokus pada pola tanya jawab dasar (Hal indaka?, Maza tuhibbu?).',
    allowedThemes: [
      { id: 'k3-hewan', name: 'Hewan (الحَيَوَانَات)', arabic: 'الحَيَوَانَات', icon: '🦁', clue: 'Kucing, gajah, singa, burung' },
      { id: 'k3-olahraga', name: 'Olahraga (الرِّيَاضَة)', arabic: 'الرِّيَاضَة', icon: '⚽', clue: 'Sepak bola, renang, bulu tangkis' },
      { id: 'k3-penyakit', name: 'Penyakit & Kesehatan (الأَمْرَاض)', arabic: 'الأَمْرَاض', icon: '🩺', clue: 'Demam, batuk, sakit gigi, sehat' }
    ],
    rulesText: `
[TARGET CAPAIAN & BATASAN KELAS 3 SD]:
1. FOKUS MATERI:
   - Pola tanya jawab kepemilikan dasar:
     * **هَلْ عِنْدَكَ...؟** (*Hal 'indaka...?* untuk lawan bicara lk) / **هَلْ عِنْدَكِ...؟** (*Hal 'indaki...?* untuk lawan bicara pr).
     * Jawaban: **نَعَمْ، عِنْدِي...** (*Na'am, 'indii...*) atau **لَا، مَا عِنْدِي...** (*Laa, maa 'indii...*).
   - Pola tanya jawab kesukaan:
     * **مَاذَا تُحِبُّ...؟** (*Maadzaa tuhibbu...?*) / **مَاذَا تُحِبِّينَ...؟** (*Maadzaa tuhibbiina...?*).
     * Jawaban: **أُحِبُّ...** (*Uhibbu...*).
   - Pertanyaan pengenal: **مَا هٰذَا؟** (*Maa haadzaa?*) dan **مَنْ هٰذَا؟** (*Man haadzaa?*).
2. TEMA PEMBELAJARAN RESMI: Hewan, Olahraga, Penyakit & Kesehatan.
3. BATASAN KETAT PEDAGOGIS:
   - Fokus pada latihan percakapan dialogis tanya-jawab bolak-balik sederhana.
   - JANGAN ajarkan perubahan kata kerja lampau atau kaidah i'rab rumit.
   - Respons harus membimbing siswa untuk berani memilih atau mengucapkan jawaban berbasis pola "Na'am/Laa", "'Indii", atau "Uhibbu".`
  },

  '4': {
    id: '4',
    gradeNumber: 4,
    label: 'SD Kelas 4',
    shortLabel: 'Kelas 4',
    badge: 'Gender & Fi\'il Mudhari\'',
    focus: 'Fokus pada pengenalan gender (Muzakkar/Muannats) dan kata kerja aktivitas sekarang (Fi\'il Mudhari\' dasar).',
    allowedThemes: [
      { id: 'k4-profesi', name: 'Profesi (المِهْنَة)', arabic: 'المِهْنَة', icon: '👨‍⚕️', clue: 'Dokter, guru, insinyur, polisi' },
      { id: 'k4-citacita', name: 'Cita-cita (آمَال / أُمْنِيَّات)', arabic: 'الأُمْنِيَّات', icon: '🌟', clue: 'Menjadi ilmuwan, hafiz, arsitek' },
      { id: 'k4-aktivitas', name: 'Aktivitas di Rumah (الأَنْشِطَة فِي البَيْت)', arabic: 'الأَنْشِطَة فِي البَيْت', icon: '🏠', clue: 'Belajar, membantu orang tua, makan' }
    ],
    rulesText: `
[TARGET CAPAIAN & BATASAN KELAS 4 SD]:
1. FOKUS MATERI:
   - Pengenalan Gender Muzakkar (مُذَكَّر) vs Muannats (مُؤَنَّث):
     * Ciri akhiran Ta Marbuthah (ة).
     * Perbedaan gender kata benda profesi: **طَبِيبٌ** (dokter lk) vs **طَبِيبَةٌ** (dokter pr), **مُدَرِّسٌ** vs **مُدَرِّسَةٌ**.
   - Kata kerja aktivitas sekarang / Fi'il Mudhari' dasar (فِعْل مُضَارِع):
     * Orang ketiga: **هُوَ يَكْتُبُ** (*Huwa yaktubu*) vs **هِيَ تَكْتُبُ** (*Hiya taktubu*).
     * Orang kedua: **أَنْتَ تَقْرَأُ** (*Anta taqro-u*) vs **أَنْتِ تَقْرَئِينَ** (*Anti taqro-iina*).
     * Orang pertama: **أَنَا أَعْمَلُ / أَنَا أُسَاعِدُ** (*Anaa a'malu / Anaa usaa'idu*).
2. TEMA PEMBELAJARAN RESMI: Profesi, Cita-cita, Aktivitas di rumah.
3. BATASAN KETAT PEDAGOGIS:
   - Wajib melatih penyesuaian gender kata kerja dengan subjeknya (awalan Ya untuk Huwa, awalan Ta untuk Hiya).
   - BATASI kata kerja hanya pada waktu SEKARANG (Fi'il Mudhari'). JANGAN gunakan Fi'il Madhi atau Amr di kelas ini.
   - Jangan menyulitkan murid dengan tasyrif jamak rumit; cukup fokus pada mufrad (tunggal).`
  },

  '5': {
    id: '5',
    gradeNumber: 5,
    label: 'SD Kelas 5',
    shortLabel: 'Kelas 5',
    badge: 'Mubtada\' Khabar & Na\'at',
    focus: 'Fokus pada susunan kalimat Mubtada\' & Khabar serta Kata Sifat (Na\'at).',
    allowedThemes: [
      { id: 'k5-tubuh', name: 'Anggota Tubuh (أَعْضَاء الجِسْم)', arabic: 'أَعْضَاء الجِسْم', icon: '🖐️', clue: 'Mata, telinga, tangan, kaki, kepala' },
      { id: 'k5-kebunbinatang', name: 'Kebun Binatang (حَدِيقَة الحَيَوَانَات)', arabic: 'حَدِيقَة الحَيَوَانَات', icon: '🦒', clue: 'Kandang luas, hewan buas/jinak' },
      { id: 'k5-ruangtamu', name: 'Ruang Tamu (غُرْفَة الجُلُوس)', arabic: 'غُرْفَة الجُلُوس', icon: '🛋️', clue: 'Sofa bersih, meja tamu, lampu indah' },
      { id: 'k5-kantin', name: 'Kantin (المَقْصَف)', arabic: 'المَقْصَف', icon: '🍲', clue: 'Makanan lezat, minuman sehat, kantin bersih' }
    ],
    rulesText: `
[TARGET CAPAIAN & BATASAN KELAS 5 SD]:
1. FOKUS MATERI:
   - Susunan Kalimat Nominal Mubtada' & Khabar (مُبْتَدَأ وَخَبَر):
     * Mubtada' (kata benda definit di awal kalimat dengan Alif Lam atau isim ma'rifah) + Khabar (penjelas/kata sifat).
     * Contoh: **الفَصْلُ نَظِيفٌ** (*Al-fashlu nazhiifun* = Kelas itu bersih), **المَقْصَفُ وَاسِعٌ** (*Al-maqshafu waasi'un* = Kantin itu luas).
   - Kata Sifat / Na'at & Man'ut (نَعْت وَمَنْعُوت):
     * Kesesuaian sifat dengan kata yang disifati dalam gender (muzakkar/muannats) dan ketetapan harakat.
     * Contoh: **عَيْنٌ جَمِيلَةٌ** (*'Ainun jamiilatun* = Mata yang indah), **حَدِيقَةٌ كَبِيرَةٌ** (*Hadiiqatun kabiiratun* = Kebun yang besar), **كِتَابٌ جَدِيدٌ** (*Kitaabun jadiidun* = Buku baru).
2. TEMA PEMBELAJARAN RESMI: Anggota tubuh, Kebun binatang, Ruang tamu, Kantin.
3. BATASAN KETAT PEDAGOGIS:
   - Bimbing anak merangkai 1 kalimat deskriptif berpola [Mubtada' + Khabar] atau menghubungkan benda dengan Na'at (kata sifat).
   - JANGAN gunakan kata sambung atau amil nawasikh yang rumit (hindari inna/kaana).
   - Tunjukkan mengapa kata sifat harus berubah muannats saat menyifati benda muannats (contoh: *Ghurfatun nazhiifatun*, bukan *nazhiifun*).`
  },

  '6': {
    id: '6',
    gradeNumber: 6,
    label: 'SD Kelas 6',
    shortLabel: 'Kelas 6',
    badge: '3 Bentuk Fi\'il & Narasi',
    focus: 'Fokus pada perubahan waktu kata kerja utuh (Fi\'il Mudhari\', Amr, Madhi) dan bercerita/narasi masa lalu.',
    allowedThemes: [
      { id: 'k6-waktu', name: 'Waktu / Jam (السَّاعَة / الوَقْت)', arabic: 'السَّاعَة', icon: '⏰', clue: 'Membaca jam dinding, jadwal harian' },
      { id: 'k6-liburan', name: 'Liburan (العُطْلَة)', arabic: 'العُطْلَة', icon: '🏖️', clue: 'Liburan ke pantai, rumah kakek' },
      { id: 'k6-piknik', name: 'Piknik (النُّزْهَة)', arabic: 'النُّزْهَة', icon: '🧺', clue: 'Rekreasi bersama keluarga, ke gunung' }
    ],
    rulesText: `
[TARGET CAPAIAN & BATASAN KELAS 6 SD]:
1. FOKUS MATERI:
   - 3 Dimensi Waktu Kata Kerja utuh (Tasyrif Fi'il):
     * **Fi'il Madhi** (فِعْل مَاضٍ - Masa lampau: **ذَهَبَ / ذَهَبْتُ**, **سَافَرَ / سَافَرْنَا**, **زَارَ**).
     * **Fi'il Mudhari'** (فِعْل مُضَارِع - Masa sekarang/akan datang: **يَذْهَبُ / أَذْهَبُ**, **يُسَافِرُ**, **يَزُورُ**).
     * **Fi'il Amr** (فِعْل أَمْر - Kata kerja perintah: **اِذْهَبْ**, **سَافِرْ**, **زُرْ**, **اِقْرَأْ**).
   - Narasi Masa Lalu: Merangkai cerita pendek tentang pengalaman berlibur/berpiknik di masa lampau.
   - Waktu & Jam: Menggunakan frasa jam (**السَّاعَةُ الوَاحِدَةُ, الثَّانِيَةُ, السَّابِعَةُ صَبَاحًا**) untuk menyusun kronologi narasi.
2. TEMA PEMBELAJARAN RESMI: Waktu/Jam, Liburan, Piknik.
3. BATASAN KETAT PEDAGOGIS:
   - Latih siswa mengenali dan mengubah bentuk kata kerja antar waktu (misal: Madhi -> Mudhari' -> Amr).
   - Dorong siswa menyusun narasi masa lalu 2-3 kalimat runtut dengan petunjuk waktu.
   - Pastikan konteks cerita dekat dengan petualangan anak-anak (liburan sekolah, piknik gembira).`
  }
};

// Normalize grade from inputs like "SD Kelas 1", "Kelas 1", 1, "1", "kelas-1"
function normalizeGrade(gradeInput) {
  if (!gradeInput) return '3'; // default to Grade 3
  const str = String(gradeInput).toLowerCase().trim();
  if (str.includes('1')) return '1';
  if (str.includes('3')) return '3';
  if (str.includes('4')) return '4';
  if (str.includes('5')) return '5';
  if (str.includes('6')) return '6';
  // fallback if "kelas 2" was provided
  if (str.includes('2')) return '1';
  return '3';
}

function getGradeConfig(gradeInput) {
  const norm = normalizeGrade(gradeInput);
  return GRADE_CONFIGS[norm] || GRADE_CONFIGS['3'];
}

function buildSystemPrompt({ grade, topic, mode }) {
  const gradeConfig = getGradeConfig(grade);
  const activeTopic = topic || gradeConfig.allowedThemes[0].name;
  const activeMode = mode || 'socratic';

  let prompt = `Kamu adalah "Kak Ifham", seorang AI Tutor Bahasa Arab Socratic yang sangat ramah, hangat, ceria, dan penyabar untuk anak-anak Sekolah Dasar (SD usia 6-12 tahun).
Saat ini kamu sedang mendampingi murid ${gradeConfig.label} (${gradeConfig.shortLabel}).
Topik belajar yang sedang aktif: "${activeTopic}".

${gradeConfig.rulesText}

ATURAN UMUM WAJIB & KETAT:
1. GAYA BAHASA: Sangat ceria, bersahabat, menggunakan sapaan ramah ("Jagoan", "Sobat Pintar", "Adik shalih/shalihah").
2. KEPENDEKAN & KESEDERHANAAN KALIMAT:
   - MAKSIMAL 2-3 KALIMAT PENDEK per respon!
   - Jangan gunakan istilah teknis tata bahasa rumit (seperti kaidah, mubtada, fi'il) kepada anak-anak kecil.
   - Obrolan harus mengalir santai, seru, dan 100% fokus pada topik yang sedang aktif ("${activeTopic}").
3. HARAKAT LENGKAP: Setiap kata atau frasa Arab WAJIB memiliki HARAKAT LENGKAP (fathah, kasrah, dhammah, sukun, tasydid, tanwin). Contoh: كِتَابٌ, هٰذَا, فِيلٌ, قِطٌّ.
4. TRANSLITERASI & ARTI: Selalu sertakan cara baca latin dan arti Indonesianya secara ringkas, contoh: **قِطٌّ** (*Qit-thun = Kucing*).
5. METODE SOCRATIC RAMAH ANAK:
   - Jangan beri ceramah panjang, ajak anak menebak dengan teka-teki lucu dekat dunia anak.
   - Puji dengan kata positif Islami: "Mumtaz! ⭐", "Ahsanto! 👏", "Hebat sekali! 🌟".
6. TOMBOL OPSI DI AKHIR PESAN: Selalu akhiri pesanmu dengan 1 baris opsi jawaban cepat dalam format kurung siku:
   [OPSI: A. ... | B. ... | C. ...] agar anak SD mudah mengklik tanpa kesulitan mengetik huruf Arab.`;

  if (activeMode === 'guided') {
    prompt += `\n\nMode saat ini adalah "Guided Practice" (Latihan Terbimbing langkah demi langkah). Tuntun anak dengan langkah 1-2-3 yang sangat teratur sesuai capaian ${gradeConfig.label}.`;
  } else if (activeMode === 'latihan') {
    prompt += `\n\nMode saat ini adalah "Latihan Soal & Kuis Teka-Teki". Berikan 1 soal kuis tebakan Arab bergambar/emoji dengan 3 pilihan ganda yang sesuai dengan capaian ${gradeConfig.label}.`;
  }

  return prompt;
}

// Fallback dummy responses that strictly reflect the 5 grade achievements
function generateSocraticFallback({ message = '', mode = 'socratic', topic = '', grade = '3', userMsgCount = 1 }) {
  const normGrade = normalizeGrade(grade);
  const msgLower = (message || '').toLowerCase();
  const config = getGradeConfig(normGrade);
  const activeTopic = topic || config.allowedThemes[0].name;

  // Grade 1 Fallbacks: Kata tunjuk (haza/hazihi), angka 1-10, huruf hijaiyah
  if (normGrade === '1') {
    const isAngka = activeTopic.toLowerCase().includes('angka') || activeTopic.toLowerCase().includes('nomor') || activeTopic.toLowerCase().includes('hitung');

    if (msgLower.includes('ringkasan') || msgLower.includes('rangkuman')) {
      if (isAngka) {
        return `🌟 **Rangkuman Angka 1-10 bersama Kak Ifham** 🌟\n\nAlhamdulillah! Kamu sudah hafal berhitung angka:\n\n1. **وَاحِدٌ** (*Waahidun*) = Satu ☝️\n2. **اِثْنَانِ** (*Itsnaani*) = Dua ✌️\n3. **ثَلَاثَةٌ** (*Tsalaatsatun*) = Tiga 3️⃣\n4. **خَمْسَةٌ** (*Khamsatun*) = Lima 🖐️\n5. **عَشَرَةٌ** (*Asyarotun*) = Sepuluh 🔟\n\nKamu pintar sekali! Mau ulangi berhitung bersama?\n\n[OPSI: Ulangi suara angka 🔊 | Hitung angka 1-10 🔢 | Coba kuis bintang 🎯]`;
      }
      return `🌟 **Rangkuman Bintang Kelas 1 bersama Kak Ifham** 🌟\n\nAlhamdulillah! Kamu sudah hebat mengenal kata tunjuk dan angka di topik **${activeTopic}**:\n\n1. **هٰذَا** (*Haadzaa*) = Ini (untuk laki-laki/tanpa ta marbuthah)\n2. **هٰذِهِ** (*Haadzihi*) = Ini (untuk perempuan/ada ta marbuthah ة)\n3. **وَاحِدٌ** (*Waahidun*) = Satu ☝️, **اِثْنَانِ** (*Itsnaani*) = Dua ✌️\n\nKamu pintar sekali! Mau tebak huruf hijaiyah berikutnya?\n\n[OPSI: هٰذَا أَبِي (Ini ayahku) 👨 | هٰذِهِ أُمِّي (Ini ibuku) 👩 | Hitung angka 1-10! 🔢]`;
    }

    if (msgLower.includes('latihan') || msgLower.includes('soal') || mode === 'latihan') {
      if (isAngka) {
        return `🎯 **Kuis Angka Ceria!** 🎯\n\nSetelah angka satu (**وَاحِدٌ**), angka DUA dalam bahasa Arab apa ya jagoan?\n\n[OPSI: A. اِثْنَانِ (Itsnaani = 2) ✌️ | B. ثَلَاثَةٌ (Tsalaatsatun = 3) 3️⃣ | C. خَمْسَةٌ (Khamsatun = 5) 🖐️]`;
      }
      return `🎯 **Kuis Bintang Ceria Kelas 1!** 🎯\n\nKak Ifham punya gambar buah apel manis (**تُفَّاحَةٌ** / *Tuffaahatun*). Karena ada huruf Ta Marbuthah (ة), kata tunjuk mana yang tepat ya jagoan?\n\n[OPSI: A. هٰذِهِ تُفَّاحَةٌ (Haadzihi) 🍎 | B. هٰذَا تُفَّاحَةٌ (Haadzaa) 🍎 | C. وَاحِدٌ (Waahidun) ☝️]`;
    }

    if (isAngka) {
      const k1AngkaDialogues = [
        `Assalamu'alaikum sahabat kecil! 🌟 Yuk kita berhitung 1 sampai 10! Angka satu adalah **وَاحِدٌ** (*Waahidun* = 1) ☝️. Setelah angka satu, angka DUA apa ya?\n\n[OPSI: A. اِثْنَانِ (Itsnaani = 2) ✌️ | B. ثَلَاثَةٌ (Tsalaatsatun = 3) 3️⃣ | C. خَمْسَةٌ (Khamsatun = 5) 🖐️]`,
        `Keren! ✌️ **اِثْنَانِ** (*Itsnaani*) itu dua! Nah, kalau angka TIGA (3) bahasa Arabnya apa jagoan?\n\n[OPSI: A. ثَلَاثَةٌ (Tsalaatsatun = 3) 3️⃣ | B. أَرْبَعَةٌ (Arba'atun = 4) 4️⃣ | C. خَمْسَةٌ (Khamsatun = 5) 🖐️]`,
        `Mumtaz! ⭐ Sekarang coba tebak: jari di satu tanganmu ada LIMA (5). Bahasa Arabnya apa ya?\n\n[OPSI: A. خَمْسَةٌ (Khamsatun = 5) 🖐️ | B. سِتَّةٌ (Sittatun = 6) 6️⃣ | C. عَشَرَةٌ (Asyarotun = 10) 🔟]`,
        `MasyaAllah hebat sekali! 👏 Kalau jari kedua tanganmu ada SEPULUH (10), bahasa Arabnya apa?\n\n[OPSI: A. عَشَرَةٌ (Asyarotun = 10) 🔟 | B. تِسْعَةٌ (Tis'atun = 9) 9️⃣ | C. ثَمَانِيَةٌ (Tsamaaniyatun = 8) 8️⃣]`
      ];
      return k1AngkaDialogues[(userMsgCount - 1) % k1AngkaDialogues.length] || k1AngkaDialogues[0];
    }

    const k1Dialogues = [
      `Assalamu'alaikum sahabat kecil Kelas 1! 🌟 Senang sekali belajar **${activeTopic}** bareng kamu! Coba perhatikan, huruf pertama dari kata **أَبٌ** (*Abun = Ayah*) adalah huruf apa ya?\n\n[OPSI: A. Huruf Alif (أ) 🌟 | B. Huruf Ba (ب) 🎈 | C. Huruf Ta (ت) 🎀]`,
      `Mumtaz jagoan! 👏 Sekarang coba lihat, kalau benda ini dekat dengan kita dan laki-laki, kita ucapkan **هٰذَا** (*Haadzaa*). Kalau ini ayahku, bahasa Arabnya adalah:\n\n[OPSI: A. هٰذَا أَبِي (Haadzaa abii) 👨 | B. هٰذِهِ أُمِّي (Haadzihi ummii) 👩 | C. ثَلَاثَةٌ (Tsalaatsatun) 3️⃣]`,
      `Wah kamu hebat sekali! ⭐ Sekarang mari kita berhitung ya! Angka satu adalah **وَاحِدٌ** (*Waahidun*). Setelah angka satu, angka dua bahasa Arabnya apa ya?\n\n[OPSI: A. اِثْنَانِ (Itsnaani = 2) ✌️ | B. ثَلَاثَةٌ (Tsalaatsatun = 3) 3️⃣ | C. خَمْسَةٌ (Khamsatun = 5) 🖐️]`,
      `MasyaAllah, kamu pintar sekali! 🌟 Huruf hijaiyah dan kata tunjuk sudah kamu kuasai dengan fasih. Mau lanjut tebakan berikutnya?\n\n[OPSI: Mau tebak buah apel! 🍎 | Ulangi suara pelafalan 🔊 | Buat rangkuman bintang 📝]`
    ];
    return k1Dialogues[(userMsgCount - 1) % k1Dialogues.length] || k1Dialogues[0];
  }

  // Grade 3 Fallbacks: Pola tanya jawab dasar (Hal indaka?, Maza tuhibbu?)
  if (normGrade === '3') {
    const isHewan = activeTopic.toLowerCase().includes('hewan');

    if (msgLower.includes('ringkasan') || msgLower.includes('rangkuman')) {
      if (isHewan) {
        return `🌟 **Rangkuman Hewan Ceria bersama Kak Ifham** 🌟\n\nMumtaz! Kamu sudah lancar mengenal nama-nama hewan:\n\n1. **قِطٌّ** (*Qit-thun*) = Kucing 🐱\n2. **بَقَرَةٌ** (*Baqaratun*) = Sapi 🐄\n3. **أَسَدٌ** (*Asadun*) = Singa 🦁\n4. **سَمَكٌ** (*Samakun*) = Ikan 🐟\n\nKamu hebat sekali! Mau lanjut tebak hewan lainnya?\n\n[OPSI: Tanya tentang hewan 🦁 | Dengar pelafalan suara 🔊 | Latihan kuis teka-teki 🎯]`;
      }
      return `🌟 **Rangkuman Percakapan Kelas 3 bersama Kak Ifham** 🌟\n\nMumtaz! Kamu sudah lancar bertanya-jawab tentang **${activeTopic}**:\n\n1. **هَلْ عِنْدَكَ...؟** (*Hal 'indaka...?*) = Apakah kamu punya...?\n2. **نَعَمْ، عِنْدِي...** (*Na'am, 'indii...*) = Ya, saya punya...\n3. **مَاذَا تُحِبُّ...؟** (*Maadzaa tuhibbu...?*) = Apa yang kamu sukai?\n\nLatihanmu luar biasa! Mau coba dialog seru lainnya?\n\n[OPSI: Tanya tentang hewan 🦁 | Tanya tentang olahraga ⚽ | Latihan kuis bintang 🎯]`;
    }

    if (msgLower.includes('latihan') || msgLower.includes('soal') || mode === 'latihan') {
      if (isHewan) {
        return `🎯 **Kuis Teka-Teki Hewan!** 🎯\n\nHewan ini suka makan ikan dan bersuara 'Meong...' (**قِطٌّ** / *Qit-thun*). Kalau kamu punya kucing di rumah, apa jawabanmu?\n\n[OPSI: A. نَعَمْ، عِنْدِي قِطٌّ (Ya, aku punya kucing) 🐱 | B. لَا، مَا عِنْدِي (Tidak, aku tidak punya) ❌ | C. أُحِبُّ السَّمَكَ (Aku suka ikan) 🐟]`;
      }
      return `🎯 **Kuis Tanya Jawab Kelas 3!** 🎯\n\nJika Kak Ifham bertanya padamu: **هَلْ عِنْدَكَ قِطٌّ؟** (*Hal 'indaka qitthun?* = Apakah kamu punya kucing?). Jika kamu punya, apa jawaban yang tepat?\n\n[OPSI: A. نَعَمْ، عِنْدِي قِطٌّ (Na'am, 'indii) 🐱 | B. لَا، مَا عِنْدِي (Laa, maa 'indii) ❌ | C. أُحِبُّ الكَلْبَ 🐶]`;
    }

    if (isHewan) {
      const k3HewanDialogues = [
        `Assalamu'alaikum sahabat ceria! 🌟 Di topik **Hewan (الحَيَوَانَات)**, Kak Ifham mau tanya nih: **مَاذَا تُحِبُّ مِنَ الحَيَوَانَاتِ؟** (*Maadzaa tuhibbu minal-hayawaanaat?* = Hewan apa yang kamu sukai?).\n\n[OPSI: A. أُحِبُّ القِطَّ (Aku suka kucing) 🐱 | B. أُحِبُّ الأَسَدَ (Aku suka singa) 🦁 | C. أُحِبُّ الفِيلَ (Aku suka gajah) 🐘]`,
        `Pilihan yang keren! ⭐ Kalau hewan berkaki empat penghasil susu segar yang bunyinya 'Moo...', dalam bahasa Arab apa ya?\n\n[OPSI: A. بَقَرَةٌ (Baqaratun = Sapi) 🐄 | B. خَرُوفٌ (Khoruufun = Domba) 🐑 | C. قِرْدٌ (Qirdun = Monyet) 🐒]`,
        `Mumtaz jagoan! 👏 Sekarang coba tebak sang raja hutan yang gagah perkasa mengaum 'Roaaar!' 🦁:\n\n[OPSI: A. أَسَدٌ (Asadun = Singa) 🦁 | B. نَمِرٌ (Namirun = Harimau) 🐅 | C. دُبٌّ (Dubbun = Beruang) 🐻]`,
        `Keren sekali! 🌟 Nah kalau hewan yang pandai berenang di air dan punya sirip apa ya?\n\n[OPSI: A. سَمَكٌ (Samakun = Ikan) 🐟 | B. طَائِرٌ (Thoo-irun = Burung) 🦜 | C. فِيلٌ (Fiilun = Gajah) 🐘]`
      ];
      return k3HewanDialogues[(userMsgCount - 1) % k3HewanDialogues.length] || k3HewanDialogues[0];
    }

    const k3Dialogues = [
      `Assalamu'alaikum sahabat ceria Kelas 3! 🌟 Di topik **${activeTopic}**, Kak Ifham mau tanya nih: **مَاذَا تُحِبُّ؟** (*Maadzaa tuhibbu?* = Apa yang kamu sukai?).\n\n[OPSI: A. أُحِبُّ القِطَّ (Aku suka kucing) 🐱 | B. أُحِبُّ كُرَةَ القَدَمِ (Aku suka bola) ⚽ | C. أُحِبُّ السِّبَاحَةَ (Aku suka renang) 🏊]`,
      `Wah pilihan yang keren! 🦁 Kalau Kak Ifham bertanya: **هَلْ عِنْدَكَ كُرَةُ القَدَمِ؟** (*Hal 'indaka kurotul-qodam?* = Apakah kamu punya bola sepak?), kamu mau jawab apa jagoan?\n\n[OPSI: A. نَعَمْ، عِنْدِي كُرَةٌ (Ya, aku punya bola) ⚽ | B. لَا، مَا عِنْدِي (Tidak, aku tidak punya) ❌ | C. أُحِبُّ السِّبَاحَةَ (Aku suka renang) 🏊]`,
      `Mumtaz! Jawabanmu sangat fasih! 👏 Sekarang coba tebak: Kalau ada teman sedang demam (**حُمَّى** / *Hummaa*), kata tanya apa yang kita pakai untuk menanyakan keadaannya?\n\n[OPSI: A. كَيْفَ حَالُكَ؟ (Kaifa haaluk?) 🩺 | B. مَاذَا تُحِبُّ؟ (Maadzaa tuhibbu?) 🎈 | C. مَنْ هٰذَا؟ (Man haadzaa?) 🤔]`,
      `Subhanallah, kamu jagoan tanya-jawab bahasa Arab yang hebat! 🌟 Pola kalimatmu sudah sangat teratur. Mau rangkum kalimat yang sudah dipelajari?\n\n[OPSI: Buatkan rangkuman! 📝 | Lanjut tebak olahraga ⚽ | Coba kuis berikutnya 🎯]`
    ];
    return k3Dialogues[(userMsgCount - 1) % k3Dialogues.length] || k3Dialogues[0];
  }

  // Grade 4 Fallbacks: Pengenalan gender (Muzakkar/Muannats) & Fi'il Mudhari' dasar
  if (normGrade === '4') {
    if (msgLower.includes('ringkasan') || msgLower.includes('rangkuman')) {
      return `🌟 **Rangkuman Materi Kelas 4 bersama Kak Ifham** 🌟\n\nAlhamdulillah! Kamu sudah memahami gender & kata kerja sekarang pada topik **${activeTopic}**:\n\n1. **Gender Profesi**: **طَبِيبٌ** (Dokter lk) vs **طَبِيبَةٌ** (Dokter pr)\n2. **Fi'il Mudhari' Orang Ketiga**: **هُوَ يَعْمَلُ** (*Huwa ya'malu*) vs **هِيَ تَعْمَلُ** (*Hiya ta'malu*)\n3. **Aktivitas Sekarang**: **أَنَا أُسَاعِدُ أُمِّي** (*Anaa usaa'idu ummii = Saya sedang membantu ibuku*)\n\nKamu luar biasa teliti membedakan Muzakkar & Muannats!\n\n[OPSI: Lanjut tebak profesi dokter 👨‍⚕️ | Latihan Fi'il Mudhari' 📝 | Coba kuis gender 🎯]`;
    }
    if (msgLower.includes('latihan') || msgLower.includes('soal') || mode === 'latihan') {
      return `🎯 **Kuis Gender & Fi'il Mudhari' Kelas 4!** 🎯\n\nPerhatikan kalimat ini: Fatimah adalah seorang dokter perempuan (**طَبِيبَةٌ**). Dia sedang memeriksa pasien di rumah sakit. Kata kerja sekarang yang tepat adalah:\n\n[OPSI: A. هِيَ تَفْحَصُ (Hiya taf-hashu) 👩‍⚕️ | B. هُوَ يَفْحَصُ (Huwa yaf-hashu) 👨‍⚕️ | C. هُوَ يَقْرَأُ (Huwa yaqro-u) 📖]`;
    }
    const k4Dialogues = [
      `Assalamu'alaikum sobat cerdas Kelas 4! 💼 Di topik **${activeTopic}**, kita belajar membedakan profesi Muzakkar & Muannats. Kalau guru laki-laki adalah **مُدَرِّسٌ**, kalau guru perempuan apa ya?\n\n[OPSI: A. مُدَرِّسَةٌ (Mudarrisatun) 👩‍🏫 | B. طَبِيبَةٌ (Thobiibatun) 👩‍⚕️ | C. شُرْطِيٌّ (Syurthiyyun) 👮]`,
      `Ahsanto! Tepat sekali karena ada Ta Marbuthah (ة) di akhirnya! 🌟 Sekarang coba perhatikan kata kerjanya: Jika Ahmad sedang membaca buku di rumah, kita ucapkan **هُوَ يَقْرَأُ**. Tapi kalau Aisyah yang sedang membaca, menjadi apa ya?\n\n[OPSI: A. هِيَ تَقْرَأُ (Hiya taqro-u) 👧 | B. هُوَ يَكْتُبُ (Huwa yaktubu) 👦 | C. هِيَ يَقْرَأُ (Bentuk salah) ❌]`,
      `Mumtaz! Huruf mudhara'ah berganti dari Ya menjadi Ta! 👏 Nah, kalau cita-citamu ingin menjadi insinyur arsitek laki-laki di masa depan, bahasa Arabnya apa jagoan?\n\n[OPSI: A. مُهَنْدِسٌ (Muhandisun) 👷 | B. مُهَنْدِسَةٌ (Muhandisatun) 👷‍♀️ | C. طَيَّارٌ (Thoyyaarun = Pilot) ✈️]`,
      `Hebat sekali penalaranmu tentang gender dan kata kerja hari ini! ⭐ Kamu sudah siap menjadi santri yang mahir tata bahasa Arab.\n\n[OPSI: Rangkum belajarku! 📝 | Lanjut aktivitas di rumah 🏠 | Coba soal kuis 🎯]`
    ];
    return k4Dialogues[(userMsgCount - 1) % k4Dialogues.length] || k4Dialogues[0];
  }

  // Grade 5 Fallbacks: Mubtada' & Khabar serta Kata Sifat (Na'at)
  if (normGrade === '5') {
    if (msgLower.includes('ringkasan') || msgLower.includes('rangkuman')) {
      return `🌟 **Rangkuman Kalimat Kelas 5 bersama Kak Ifham** 🌟\n\nSubhanallah! Kamu berhasil menyusun struktur kalimat indah pada topik **${activeTopic}**:\n\n1. **Mubtada' & Khabar**: **الفَصْلُ نَظِيفٌ** (*Al-fashlu nazhiifun* = Kelas itu bersih)\n2. **Kesesuaian Muannats**: **غُرْفَةُ الجُلُوسِ مُرَتَّبَةٌ** (*Ghurfatul juluusi murattabatun* = Ruang tamu itu rapi)\n3. **Kata Sifat (Na'at)**: **حَدِيقَةٌ كَبِيرَةٌ** (*Hadiiqatun kabiiratun* = Kebun yang luas)\n\nSusunan kalimatmu sudah sesuai kaidah tata bahasa resmi!\n\n[OPSI: Susun kalimat ruang tamu 🛋️ | Pelajari sifat anggota tubuh 🖐️ | Kuis Mubtada' Khabar 🎯]`;
    }
    if (msgLower.includes('latihan') || msgLower.includes('soal') || mode === 'latihan') {
      return `🎯 **Kuis Mubtada' & Na'at Kelas 5!** 🎯\n\nKantin sekolah kita sangat luas dan bersih (**المَقْصَفُ** / *Al-Maqshafu*). Bagaimanakah susunan kalimat Mubtada' dan Khabar yang benar?\n\n[OPSI: A. المَقْصَفُ وَاسِعٌ وَنَظِيفٌ 🍲 | B. المَقْصَفُ وَاسِعَةٌ (Bentuk salah) ❌ | C. مَقْصَفٌ كَبِيرَةٌ 🏫]`;
    }
    const k5Dialogues = [
      `Assalamu'alaikum penjelajah bahasa Arab Kelas 5! 🏛️ Di topik **${activeTopic}**, kita belajar membuat kalimat deskriptif. Coba lihat ruang tamu: **غُرْفَةُ الجُلُوسِ ...**. Kata sifat yang cocok untuk menyatakan "rapi" adalah?\n\n[OPSI: A. مُرَتَّبَةٌ (Murattabatun) 🛋️ | B. مُرَتَّبٌ (Murattabun - tanpa ta) 🛋️ | C. صَغِيرٌ (Shoghiirun) 📦]`,
      `Mumtaz! Karena kata *Ghurfah* berjenis muannats, maka kata sifatnya wajib memakai ta marbuthah: **مُرَتَّبَةٌ**! 👏 Sekarang coba lihat anggota tubuh kita: Mata kita yang indah dalam bahasa Arab adalah **عَيْنٌ جَمِيلَةٌ**. Mengapa pakai *jamiilatun*?\n\n[OPSI: A. Karena mata berpasangan (muannats) 👀 | B. Karena mata muzakkar 👁️ | C. Keduanya benar 🤔]`,
      `MasyaAllah tepat sekali! Organ tubuh yang berpasangan termasuk muannats majazi! 🌟 Sekarang kalau kita pergi ke kebun binatang yang luas, bahasa Arabnya adalah:\n\n[OPSI: A. حَدِيقَةُ الحَيَوَانَاتِ وَاسِعَةٌ 🦒 | B. الحَدِيقَةُ جَمِيلٌ 🌳 | C. قَفَصٌ صَغِيرَةٌ 🦜]`,
      `Kamu sangat cerdas merangkai Mubtada' dan Na'at! 🌟 Pemahaman tata bahasamu sudah setara santri berprestasi.\n\n[OPSI: Buat ringkasan materi! 📝 | Lanjut bahas kantin sekolah 🍲 | Tantang kuis bintang 🎯]`
    ];
    return k5Dialogues[(userMsgCount - 1) % k5Dialogues.length] || k5Dialogues[0];
  }

  // Grade 6 Fallbacks: Perubahan waktu kata kerja utuh (Fi'il Madhi, Mudhari', Amr) & Narasi masa lalu
  if (normGrade === '6') {
    if (msgLower.includes('ringkasan') || msgLower.includes('rangkuman')) {
      return `🌟 **Rangkuman Narasi & 3 Waktu Fi'il Kelas 6** 🌟\n\nAllahu Akbar! Kamu sudah menguasai dimensi waktu kata kerja utuh pada topik **${activeTopic}**:\n\n1. **Fi'il Madhi (Lampau)**: **ذَهَبْتُ إِلَى الشَّاطِئِ** (*Dzahabtu ilasy-syaathi-i* = Aku telah pergi ke pantai)\n2. **Fi'il Mudhari' (Sekarang)**: **أَذْهَبُ مَعَ أُسْرَتِي** (*Adzhabu ma'a usratii* = Aku sedang pergi bersama keluargaku)\n3. **Fi'il Amr (Perintah)**: **اِذْهَبْ بِسَلَامَةٍ!** (*Idzhab bisalaamatin!* = Pergilah dengan selamat!)\n4. **Waktu & Jam**: **فِي السَّاعَةِ السَّابِعَةِ صَبَاحًا** (*Pada jam 7 pagi*)\n\nKamu sudah mahir merangkai narasi cerita bahasa Arab!\n\n[OPSI: Cerita liburan ke pantai 🏖️ | Latihan tasyrif 3 waktu kata kerja ⏰ | Kuis narasi masa lalu 🎯]`;
    }
    if (msgLower.includes('latihan') || msgLower.includes('soal') || mode === 'latihan') {
      return `🎯 **Kuis 3 Dimensi Waktu Kata Kerja Kelas 6!** 🎯\n\nPerhatikan kalimat narasi liburan ini: "Kemarin Ahmad telah mengunjungi rumah kakeknya". Bentuk Fi'il Madhi (lampau) yang tepat adalah:\n\n[OPSI: A. زَارَ أَحْمَدُ جَدَّهُ (Zaaro = Telah mengunjungi) 🏡 | B. يَزُورُ أَحْمَدُ (Yazuuru = Sedang mengunjungi) 🚗 | C. زُرْ يَا أَحْمَدُ (Zur = Kunjungilah!) 📣]`;
    }
    const k6Dialogues = [
      `Assalamu'alaikum sahabat mahir Kelas 6! ⏰ Di topik **${activeTopic}**, kita belajar menceritakan kegiatan masa lalu dan perubahan kata kerja 3 waktu. Kalau kata kerjanya adalah "Membaca":\n- Lampau: **قَرَأَ** (*Qoro-a*)\n- Sekarang: **يَقْرَأُ** (*Yaqro-u*)\nBagaimana bentuk kata kerja perintahnya (Fi'il Amr)?\n\n[OPSI: A. اِقْرَأْ (Iqro'! = Bacalah!) 📖 | B. قَرَأْتُ (Qoro'tu = Aku telah baca) ✍️ | C. تَقْرَأُ (Taqro-u) 👓]`,
      `Mumtaz! *Iqra'* adalah kata kerja perintah pertama yang turun dalam Al-Qur'an! 🌟 Sekarang saat menceritakan piknik akhir pekan lalu: "Pada jam tujuh pagi kami berangkat bersama keluarga". Jam tujuh pagi dalam bahasa Arab adalah:\n\n[OPSI: A. فِي السَّاعَةِ السَّابِعَةِ صَبَاحًا 🕖 | B. فِي السَّاعَةِ الخَامِسَةِ مَسَاءً 🕔 | C. فِي السَّاعَةِ الوَاحِدَةِ ظُهْرًا 🕐]`,
      `Luar biasa lancar! 👏 Jika kamu menceritakan bahwa kamu sendiri yang telah bersenang-senang saat liburan di pantai, kata kerja Madhi untuk "Saya telah pergi" adalah:\n\n[OPSI: A. ذَهَبْتُ (Dzahabtu = Saya telah pergi) 🏖️ | B. ذَهَبَ (Dzahaba = Dia telah pergi) 🚶 | C. نَذْهَبُ (Nadzhabu = Kami sedang pergi) 🚌]`,
      `MasyaAllah, narasi bahasa Arabmu sangat runtut dan kaya kosakata! ⭐ Kamu siap melanjutkan ke jenjang MTs/SMP dengan prestasi gemilang.\n\n[OPSI: Rangkum narasiku! 📝 | Lanjut bercerita piknik 🧺 | Tantangan kuis akhir 🎯]`
    ];
    return k6Dialogues[(userMsgCount - 1) % k6Dialogues.length] || k6Dialogues[0];
  }

  // Fallback generic
  return `Assalamu'alaikum sahabat pintar! 🌟 Senang sekali belajar bersama kamu tentang **${activeTopic}**. Apa yang ingin kamu tanyakan pada Kak Ifham hari ini?\n\n[OPSI: Tanya materi 📚 | Latihan soal 🎯 | Petunjuk belajar 💡]`;
}

module.exports = {
  GRADE_CONFIGS,
  normalizeGrade,
  getGradeConfig,
  buildSystemPrompt,
  generateSocraticFallback
};
