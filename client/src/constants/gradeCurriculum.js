// client/src/constants/gradeCurriculum.js
// Standar Kurikulum Bahasa Arab SD (Rekomendasi Ahli Materi)
// 5 Tingkatan Kelas: Kelas 1, Kelas 3, Kelas 4, Kelas 5, Kelas 6

export const GRADE_CONFIGS = {
  '1': {
    id: '1',
    gradeNumber: 1,
    label: 'SD Kelas 1',
    shortLabel: 'Kelas 1',
    badge: 'Kata Tunjuk & Angka',
    color: 'from-amber-400 to-orange-500',
    themeBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    focus: 'Fokus pada kata tunjuk (haza/hazihi), angka 1-10, dan huruf hijaiyah.',
    boundaryDescription: 'Kosakata sangat sederhana (1-2 kata), tanpa kalimat majemuk. Tebakan huruf hijaiyah & kata tunjuk haza/hazihi.',
    allowedThemes: [
      { 
        id: 'k1-perkenalan', 
        name: 'Perkenalan (التَّعَارُف)', 
        arabic: 'التَّعَارُف', 
        icon: '👋', 
        desc: 'Nama & sapaan awal',
        initialMessage: 'Assalamu\'alaikum sahabat kecil! 🌟 Siapa namamu yang shalih/shalihah? Kak Ifham mau ajak kenalan dengan kata tunjuk **هٰذَا** (*Haadzaa* = Ini untuk anak laki-laki). Coba tebak kalau ini temanku apa ya?\n\n[OPSI: A. هٰذَا صَدِيقِي (Ini temanku) 👦 | B. هٰذِهِ صَدِيقَتِي (Ini temanku pr) 👧 | C. أَهْلًا وَسَهْلًا (Ahlan wa Sahlan) 👋]'
      },
      { 
        id: 'k1-keluarga', 
        name: 'Keluarga (الأُسْرَة)', 
        arabic: 'الأُسْرَة', 
        icon: '👨‍👩‍👧‍👦', 
        desc: 'Ayah, Ibu, Saudara',
        initialMessage: 'Alhamdulillah kita punya keluarga yang menyayangi kita! 👨‍👩‍👧‍👦 Huruf pertama dari kata **أَبٌ** (*Abun = Ayah*) adalah huruf apa ya jagoan?\n\n[OPSI: A. Huruf Alif (أ) 🌟 | B. Huruf Ba (ب) 🎈 | C. Huruf Jim (ج) 🐫]'
      },
      { 
        id: 'k1-hobi', 
        name: 'Hobi (الهِوَايَة)', 
        arabic: 'الهِوَايَة', 
        icon: '🎨', 
        desc: 'Membaca, Menggambar',
        initialMessage: 'Hobi apa yang paling kamu sukai di rumah? 🎨 Membaca buku dalam bahasa Arab adalah **قِرَاءَةٌ** (*Qiroo-atun*). Ada huruf Ta Marbuthah di akhirnya, jadi kita gunakan kata tunjuk apa?\n\n[OPSI: A. هٰذِهِ قِرَاءَةٌ (Haadzihi) 📖 | B. هٰذَا قِرَاءَةٌ (Haadzaa) 📖 | C. وَاحِدٌ (Waahidun) ☝️]'
      },
      { 
        id: 'k1-buah', 
        name: 'Buah (الفَوَاكِه)', 
        arabic: 'الفَوَاكِه', 
        icon: '🍎', 
        desc: 'Apel, Pisang, Jeruk, Kurma',
        initialMessage: 'Nyam! Di atas meja ada buah apel manis (**تُفَّاحَةٌ** / *Tuffaahatun*) 🍎. Coba tebak kalau kata tunjuk dekat untuk buah apel apa ya?\n\n[OPSI: A. هٰذِهِ تُفَّاحَةٌ (Haadzihi) 🍎 | B. هٰذَا تُفَّاحَةٌ (Haadzaa) 🍎 | C. وَاحِدٌ (Waahidun) ☝️]'
      },
      { 
        id: 'k1-angka', 
        name: 'Angka & Nomor 1-10 (الأَرْقَام)', 
        arabic: 'الأَرْقَام', 
        icon: '🔢', 
        desc: 'Berhitung angka 1 sampai 10 ceria',
        initialMessage: 'Assalamu\'alaikum sahabat kecil! 🌟 Yuk kita belajar berhitung angka 1 sampai 10! Angka satu dalam bahasa Arab adalah **وَاحِدٌ** (*Waahidun* = 1) ☝️. Setelah angka satu, angka dua bahasa Arabnya apa ya?\n\n[OPSI: A. اِثْنَانِ (Itsnaani = 2) ✌️ | B. ثَلَاثَةٌ (Tsalaatsatun = 3) 3️⃣ | C. خَمْسَةٌ (Khamsatun = 5) 🖐️]'
      }
    ]
  },

  '3': {
    id: '3',
    gradeNumber: 3,
    label: 'SD Kelas 3',
    shortLabel: 'Kelas 3',
    badge: 'Tanya Jawab Dasar',
    color: 'from-emerald-500 to-teal-600',
    themeBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    focus: 'Fokus pada pola tanya jawab dasar (Hal indaka?, Maza tuhibbu?).',
    boundaryDescription: 'Dialog tanya jawab bolak-balik sederhana (Hal \'indaka? / Na\'am \'indii, Maza tuhibbu? / Uhibbu). Belum perubahan kata kerja rumit.',
    allowedThemes: [
      { 
        id: 'k3-hewan', 
        name: 'Hewan (الحَيَوَانَات)', 
        arabic: 'الحَيَوَانَات', 
        icon: '🦁', 
        desc: 'Kucing, Gajah, Singa, Burung',
        initialMessage: 'Assalamu\'alaikum sahabat ceria Kelas 3! 🌟 Kak Ifham mau tanya nih: **هَلْ عِنْدَكَ قِطٌّ فِي البَيْتِ؟** (*Hal \'indaka qitthun fil-baiti?* = Apakah kamu punya kucing di rumah?).\n\n[OPSI: A. نَعَمْ، عِنْدِي قِطٌّ (Ya, aku punya kucing) 🐱 | B. لَا، مَا عِنْدِي (Tidak, aku tidak punya) ❌ | C. أُحِبُّ القِطَّ (Aku suka kucing) ❤️]'
      },
      { 
        id: 'k3-olahraga', 
        name: 'Olahraga (الرِّيَاضَة)', 
        arabic: 'الرِّيَاضَة', 
        icon: '⚽', 
        desc: 'Sepak Bola, Renang, Lari',
        initialMessage: 'Badan sehat pikiran cerdas! ⚽ Coba jawab pertanyaan Kak Ifham: **مَاذَا تُحِبُّ مِنَ الرِّيَاضَةِ؟** (*Maadzaa tuhibbu minar-riyaadhoh?* = Olahraga apa yang kamu sukai?).\n\n[OPSI: A. أُحِبُّ كُرَةَ القَدَمِ (Aku suka sepak bola) ⚽ | B. أُحِبُّ السِّبَاحَةَ (Aku suka renang) 🏊 | C. أُحِبُّ الجَرْيَ (Aku suka lari) 🏃]'
      },
      { 
        id: 'k3-penyakit', 
        name: 'Penyakit & Kesehatan (الأَمْرَاض)', 
        arabic: 'الأَمْرَاض', 
        icon: '🩺', 
        desc: 'Demam, Sakit Gigi, Sehat',
        initialMessage: 'Semoga kita selalu diberi kesehatan oleh Allah! 🩺 Kalau temanmu terlihat lemas, kamu bertanya: **مَا بِكَ؟** (*Maa bika?* = Kamu kenapa?). Kalau dia sedang demam (**حُمَّى** / *Hummaa*), apa jawabannya?\n\n[OPSI: A. عِنْدِي حُمَّى (Aku sedang demam) 🤒 | B. أَنَا بِخَيْرٍ (Aku baik-baik saja) 🌟 | C. أُحِبُّ الدَّوَاءَ (Aku suka obat) 💊]'
      }
    ]
  },

  '4': {
    id: '4',
    gradeNumber: 4,
    label: 'SD Kelas 4',
    shortLabel: 'Kelas 4',
    badge: 'Gender & Fi\'il Mudhari\'',
    color: 'from-sky-500 to-blue-600',
    themeBadgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    focus: 'Fokus pada pengenalan gender (Muzakkar/Muannats) dan kata kerja aktivitas sekarang (Fi\'il Mudhari\' dasar).',
    boundaryDescription: 'Penyesuaian gender kata benda & kata kerja orang ke-3 dan ke-2 (Huwa yaktubu vs Hiya taktubu). Batasi hanya pada waktu sekarang.',
    allowedThemes: [
      { 
        id: 'k4-profesi', 
        name: 'Profesi (المِهْنَة)', 
        arabic: 'المِهْنَة', 
        icon: '👨‍⚕️', 
        desc: 'Dokter, Guru, Polisi, Petani',
        initialMessage: 'Ahlan wa sahlan sobat cerdas Kelas 4! 💼 Jika seorang dokter laki-laki disebut **طَبِيبٌ** (*Thobiibun*), bagaimana bentuk muannats untuk dokter perempuan?\n\n[OPSI: A. طَبِيبَةٌ (Thobiibatun) 👩‍⚕️ | B. مُدَرِّسَةٌ (Mudarrisatun) 👩‍🏫 | C. هُوَ طَبِيبٌ (Bentuk muzakkar) 👨‍⚕️]'
      },
      { 
        id: 'k4-citacita', 
        name: 'Cita-cita (آمَال / أُمْنِيَّات)', 
        arabic: 'الأُمْنِيَّات', 
        icon: '🌟', 
        desc: 'Masa Depan Mulia',
        initialMessage: 'Semua anak hebat punya cita-cita mulia! 🌟 Coba perhatikan Fi\'il Mudhari\' ini: **أَنَا أُرِيدُ أَنْ أَكُونَ...** (*Anaa uriidu an akuuna...* = Aku ingin menjadi...). Kamu ingin menjadi apa jagoan?\n\n[OPSI: A. طَبِيبًا / طَبِيبَةً (Dokter) 🩺 | B. مُهَنْدِسًا (Insinyur/Arsitek) 👷 | C. مُعَلِّمًا (Guru) 📚]'
      },
      { 
        id: 'k4-aktivitas', 
        name: 'Aktivitas di Rumah (الأَنْشِطَة فِي البَيْت)', 
        arabic: 'الأَنْشِطَة فِي البَيْت', 
        icon: '🏠', 
        desc: 'Membantu Ibu, Belajar, Shalat',
        initialMessage: 'Di rumah, kita melakukan banyak aktivitas bermanfaat. Perhatikan kata kerjanya ya! Kalau Ahmad (laki-laki) sedang membaca, kita sebut **هُوَ يَقْرَأُ**. Kalau Maryam (perempuan) sedang membaca, menjadi apa ya?\n\n[OPSI: A. هِيَ تَقْرَأُ (Hiya taqro-u) 👧 | B. هُوَ يَكْتُبُ (Huwa yaktubu) 👦 | C. هِيَ يَقْرَأُ (Bentuk salah) ❌]'
      }
    ]
  },

  '5': {
    id: '5',
    gradeNumber: 5,
    label: 'SD Kelas 5',
    shortLabel: 'Kelas 5',
    badge: 'Mubtada\' Khabar & Na\'at',
    color: 'from-indigo-500 to-purple-600',
    themeBadgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    focus: 'Fokus pada susunan kalimat Mubtada\' & Khabar serta Kata Sifat (Na\'at).',
    boundaryDescription: 'Menyusun kalimat deskriptif nominal (Mubtada\' + Khabar) dan frasa kata sifat (Na\'at wa Man\'ut) dengan kesesuaian jenis kelamin (mudzakkar/muannats).',
    allowedThemes: [
      { 
        id: 'k5-tubuh', 
        name: 'Anggota Tubuh (أَعْضَاء الجِسْم)', 
        arabic: 'أَعْضَاء الجِسْم', 
        icon: '🖐️', 
        desc: 'Mata, Telinga, Tangan, Kaki',
        initialMessage: 'Alhamdulillah atas nikmat tubuh yang sempurna! 🖐️ Dalam bahasa Arab, organ tubuh berpasangan seperti mata (**عَيْنٌ**) dianggap muannats. Jika kita pasangkan dengan Kata Sifat (Na\'at) "indah", mana yang benar?\n\n[OPSI: A. عَيْنٌ جَمِيلَةٌ (Jamiilatun) 👀 | B. عَيْنٌ جَمِيلٌ (Jamiilun) 👁️ | C. رَأْسٌ كَبِيرٌ (Kepala besar) 🧠]'
      },
      { 
        id: 'k5-kebunbinatang', 
        name: 'Kebun Binatang (حَدِيقَة الحَيَوَانَات)', 
        arabic: 'حَدِيقَة الحَيَوَانَات', 
        icon: '🦒', 
        desc: 'Kandang Luas, Hewan Jinak',
        initialMessage: 'Mari kita berkunjung ke kebun binatang! 🦒 Coba rangkai kalimat Mubtada\' & Khabar: Kebun binatang itu sangat luas (**حَدِيقَةُ الحَيَوَانَاتِ ...**). Kata penjelas (Khabar) yang tepat adalah?\n\n[OPSI: A. وَاسِعَةٌ (Waasi\'atun) 🌳 | B. وَاسِعٌ (Waasi\'un - tanpa ta) 🌳 | C. نَظِيفٌ (Nazhiifun) ✨]'
      },
      { 
        id: 'k5-ruangtamu', 
        name: 'Ruang Tamu (غُرْفَة الجُلُوس)', 
        arabic: 'غُرْفَة الجُلُوس', 
        icon: '🛋️', 
        desc: 'Sofa Bersih, Meja Tamu Rapi',
        initialMessage: 'Ruang tamu rumah kita sangat rapi dan nyaman. 🛋️ Manakah susunan kalimat Mubtada\' dan Khabar yang benar?\n\n[OPSI: A. غُرْفَةُ الجُلُوسِ مُرَتَّبَةٌ (Ruang tamu itu rapi) 🛋️ | B. الغُرْفَةُ مُرَتَّبٌ (Bentuk salah) ❌ | C. كِتَابٌ جَدِيدٌ (Buku baru) 📖]'
      },
      { 
        id: 'k5-kantin', 
        name: 'Kantin (المَقْصَف)', 
        arabic: 'المَقْصَف', 
        icon: '🍲', 
        desc: 'Makanan Lezat, Kantin Bersih',
        initialMessage: 'Waktunya istirahat ke kantin sekolah (**المَقْصَفُ** / *Al-Maqshafu*) 🍲! Kantin adalah isim muzakkar. Bagaimana kalimat deskriptif "Kantin itu bersih"?\n\n[OPSI: A. المَقْصَفُ نَظِيفٌ (Al-maqshafu nazhiifun) ✨ | B. المَقْصَفُ نَظِيفَةٌ (Bentuk salah) ❌ | C. طَعَامٌ لَذِيذٌ (Makanan lezat) 🍛]'
      }
    ]
  },

  '6': {
    id: '6',
    gradeNumber: 6,
    label: 'SD Kelas 6',
    shortLabel: 'Kelas 6',
    badge: '3 Dimensi Fi\'il & Narasi',
    color: 'from-purple-600 to-pink-600',
    themeBadgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    focus: 'Fokus pada perubahan waktu kata kerja utuh (Fi\'il Mudhari\', Amr, Madhi) dan bercerita/narasi masa lalu.',
    boundaryDescription: 'Memahami perubahan kata kerja (Madhi lampau, Mudhari\' sekarang, Amr perintah) dan menyusun narasi masa lalu mengenai liburan/waktu.',
    allowedThemes: [
      { 
        id: 'k6-waktu', 
        name: 'Waktu / Jam (السَّاعَة / الوَقْت)', 
        arabic: 'السَّاعَة', 
        icon: '⏰', 
        desc: 'Jam Dinding, Kronologi Waktu',
        initialMessage: 'Ahlan wa sahlan santri mahir Kelas 6! ⏰ Di kelas ini kita belajar membaca waktu dan jam untuk menyusun cerita. Jika kita berangkat sekolah pada jam 06.30 atau jam 07.00 pagi, jam tujuh pagi adalah:\n\n[OPSI: A. فِي السَّاعَةِ السَّابِعَةِ صَبَاحًا 🕖 | B. فِي السَّاعَةِ الخَامِسَةِ مَسَاءً 🕔 | C. فِي السَّاعَةِ الثَّانِيَةَ عَشْرَةَ 🕛]'
      },
      { 
        id: 'k6-liburan', 
        name: 'Liburan (العُطْلَة)', 
        arabic: 'العُطْلَة', 
        icon: '🏖️', 
        desc: 'Liburan ke Pantai, Rumah Kakek',
        initialMessage: 'Bercerita masa lalu membutuhkan Fi\'il Madhi (kata kerja lampau) 🏖️. Jika kamu menceritakan "Kemarin saya telah pergi ke pantai bersama keluarga", kata kerja lampaunya adalah:\n\n[OPSI: A. ذَهَبْتُ إِلَى الشَّاطِئِ (Dzahabtu = Aku telah pergi) 🏖️ | B. أَذْهَبُ مَعَ أُسْرَتِي (Adzhabu = Aku sedang pergi) 🚶 | C. اِذْهَبْ يَا أَحْمَدُ (Idzhab = Pergilah!) 📣]'
      },
      { 
        id: 'k6-piknik', 
        name: 'Piknik (النُّزْهَة)', 
        arabic: 'النُّزْهَة', 
        icon: '🧺', 
        desc: 'Rekreasi Gunung, Bekal Piknik',
        initialMessage: 'Subhanallah indahnya pemandangan saat piknik (**النُّزْهَة** / *An-Nuz-hah*)! 🧺 Coba ubah kata kerja "Makan" ke dalam 3 bentuk waktu:\n- Lampau: **أَكَلَ** (*Akala*)\n- Sekarang: **يَأْكُلُ** (*Ya\'kulu*)\nBentuk kata kerja perintahnya (Fi\'il Amr) adalah?\n\n[OPSI: A. كُلْ! (Kul! = Makanlah!) 🍽️ | B. أَكَلْتُ (Akaltu = Aku telah makan) 😋 | C. تَأْكُلِينَ (Ta\'kuliina) 👧]'
      }
    ]
  }
};

export const GRADE_KEYS = ['1', '3', '4', '5', '6'];

export function normalizeGrade(gradeInput) {
  if (!gradeInput) return '3';
  const str = String(gradeInput).toLowerCase().trim();
  if (str.includes('1')) return '1';
  if (str.includes('3')) return '3';
  if (str.includes('4')) return '4';
  if (str.includes('5')) return '5';
  if (str.includes('6')) return '6';
  if (str.includes('2')) return '1';
  return '3';
}

export function getGradeConfig(gradeInput) {
  const norm = normalizeGrade(gradeInput);
  return GRADE_CONFIGS[norm] || GRADE_CONFIGS['3'];
}

// 5 Official Demo Accounts matching the 5 Grade levels requested by the Subject Matter Expert
export const DEMO_USERS_5_GRADES = [
  {
    id: 'demo-murid-k1',
    name: 'Maryam Cilik (Murid Kelas 1)',
    email: 'maryam.k1@ifhamkids.com',
    grade: 'SD Kelas 1',
    gradeKey: '1',
    avatar: '👧',
    focusSummary: 'Kata Tunjuk (هٰذَا/هٰذِهِ), Angka 1-10, Huruf Hijaiyah',
    badgeColor: 'bg-amber-100 text-amber-700 border border-amber-300'
  },
  {
    id: 'demo-murid-k3',
    name: 'Ahmad Cilik (Murid Kelas 3)',
    email: 'ahmad.k3@ifhamkids.com',
    grade: 'SD Kelas 3',
    gradeKey: '3',
    avatar: '👦',
    focusSummary: 'Pola Tanya Jawab Dasar (Hal \'Indaka?, Maza Tuhibbu?)',
    badgeColor: 'bg-emerald-100 text-emerald-700 border border-emerald-300'
  },
  {
    id: 'demo-murid-k4',
    name: 'Fatimah Ceria (Murid Kelas 4)',
    email: 'fatimah.k4@ifhamkids.com',
    grade: 'SD Kelas 4',
    gradeKey: '4',
    avatar: '🧕',
    focusSummary: 'Gender (Muzakkar/Muannats) & Fi\'il Mudhari\' Dasar',
    badgeColor: 'bg-sky-100 text-sky-700 border border-sky-300'
  },
  {
    id: 'demo-murid-k5',
    name: 'Umar Penjelajah (Murid Kelas 5)',
    email: 'umar.k5@ifhamkids.com',
    grade: 'SD Kelas 5',
    gradeKey: '5',
    avatar: '🧒',
    focusSummary: 'Mubtada\' & Khabar, Kata Sifat (Na\'at & Man\'ut)',
    badgeColor: 'bg-indigo-100 text-indigo-700 border border-indigo-300'
  },
  {
    id: 'demo-murid-k6',
    name: 'Aisyah Mahir (Murid Kelas 6)',
    email: 'aisyah.k6@ifhamkids.com',
    grade: 'SD Kelas 6',
    gradeKey: '6',
    avatar: '👩‍🎓',
    focusSummary: '3 Waktu Fi\'il (Madhi, Mudhari\', Amr) & Narasi Masa Lalu',
    badgeColor: 'bg-purple-100 text-purple-700 border border-purple-300'
  }
];

// Helper to get all topics across all grades or for a specific grade
export function getAllThemesForGrade(gradeKey) {
  const norm = normalizeGrade(gradeKey);
  return GRADE_CONFIGS[norm]?.allowedThemes || [];
}

export function getAllThemesFlat() {
  const flat = [];
  GRADE_KEYS.forEach(k => {
    GRADE_CONFIGS[k].allowedThemes.forEach(t => {
      flat.push({
        ...t,
        gradeKey: k,
        gradeLabel: GRADE_CONFIGS[k].shortLabel
      });
    });
  });
  return flat;
}
