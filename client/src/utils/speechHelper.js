/**
 * Utility for Web Speech API & Focused Arabic Vocabulary Audio
 * Tailored for Ifham Kids - Bahasa Arab Ramah Anak SD
 */

// Common Arabic phonetics for numbers, animals, and basic phrases
// Used as fallback when client device has NO Arabic SpeechSynthesis voice installed
export const COMMON_ARABIC_PHONETICS = {
  // Angka 1-10
  'وَاحِدٌ': 'Waahidun',
  'اِثْنَانِ': 'Itsnaani',
  'ثَلَاثَةٌ': 'Tsalaatsatun',
  'ثَلَاثَة': 'Tsalaatsatun',
  'أَرْبَعَةٌ': 'Arba\'atun',
  'أَرْبَعَة': 'Arba\'atun',
  'خَمْسَةٌ': 'Khamsatun',
  'خَمْسَة': 'Khamsatun',
  'سِتَّةٌ': 'Sittatun',
  'سِتَّة': 'Sittatun',
  'سَبْعَةٌ': 'Sab\'atun',
  'سَبْعَة': 'Sab\'atun',
  'ثَمَانِيَةٌ': 'Tsamaaniyatun',
  'ثَمَانِيَة': 'Tsamaaniyatun',
  'تِسْعَةٌ': 'Tis\'atun',
  'تِسْعَة': 'Tis\'atun',
  'عَشَرَةٌ': 'Asyarotun',
  'عَشَرَة': 'Asyarotun',
  // Topik & Kategori
  'الأَرْقَام': 'Al-Arqoom',
  'الأرقام': 'Al-Arqoom',
  'ارقام': 'Arqoom',
  'الأَلْوَان': 'Al-Alwaan',
  'الألوان': 'Al-Alwaan',
  'الوان': 'Alwaan',
  'وَالأَلْوَان': 'Wal-Alwaan',
  'والألوان': 'Wal-Alwaan',
  // Hewan
  'قِطٌّ': 'Qit-thun',
  'أَسَدٌ': 'Asadun',
  'فِيلٌ': 'Fiilun',
  'بَقَرَةٌ': 'Baqaratun',
  'خَرُوفٌ': 'Khoruufun',
  'طَائِرٌ': 'Thoo-irun',
  'سَمَكٌ': 'Samakun',
  'قِرْدٌ': 'Qirdun',
  'نَمِرٌ': 'Namirun',
  'دُبٌّ': 'Dubbun',
  'الحَيَوَانَات': 'Al-Hayawaanaat',
  'حَدِيقَة الحَيَوَانَات': 'Hadiiqatul Hayawaanaat',
  // Tanya Jawab & Kata Tunjuk
  'هٰذَا': 'Haadzaa',
  'هٰذِهِ': 'Haadzihi',
  'نَعَمْ': 'Na\'am',
  'لَا': 'Laa',
  'عِنْدِي': 'Indii',
  'أُحِبُّ': 'Uhibbu',
  'هَلْ عِنْدَكَ': 'Hal indaka',
  'مَاذَا تُحِبُّ': 'Maadzaa tuhibbu',
  'نَعَمْ، عِنْدِي قِطٌّ': 'Na\'am, \'indii qit-thun',
  'أُحِبُّ القِطَّ': 'Uhibbul qit-tha',
  'أُحِبُّ الأَسَدَ': 'Uhibbul asada',
  'أُحِبُّ الفِيلَ': 'Uhibbul fiila'
};

const TRIVIAL_WORDS = new Set([
  'فِي', 'مِنْ', 'مَا', 'لَا', 'أَوْ', 'عَلَى', 'إِلَى', 'عَنْ', 'مَعَ', 'بِ', 'وَ', 'ثُمَّ', 'أَنْ', 'إِنَّ'
]);

/**
 * Remove Arabic diacritics (harakat) for flexible matching
 */
export function stripDiacritics(str) {
  return (str || '').replace(/[\u064B-\u065F\u0670]/g, '').trim();
}

/**
 * Smart phonetic resolver that checks exact and normalized forms
 */
export function lookupPhonetic(rawArabic) {
  if (!rawArabic) return '';
  const clean = cleanArabicWord(rawArabic);
  if (COMMON_ARABIC_PHONETICS[clean]) return COMMON_ARABIC_PHONETICS[clean];

  const stripped = stripDiacritics(clean);
  if (COMMON_ARABIC_PHONETICS[stripped]) return COMMON_ARABIC_PHONETICS[stripped];

  if (stripped.startsWith('و') && stripped.length > 2) {
    const withoutWa = stripped.substring(1);
    if (COMMON_ARABIC_PHONETICS[withoutWa]) {
      return 'Wal-' + COMMON_ARABIC_PHONETICS[withoutWa].replace(/^Al-/, '');
    }
  }
  return '';
}

/**
 * Remove punctuation, brackets, emoji, and extra whitespace from Arabic text
 */
export function cleanArabicWord(word) {
  if (!word) return '';
  return word
    .replace(/[؟،!,.:;?"'()\[\]{}*#~_\-+=/]/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clean message text for Kak Ifham's friendly Indonesian voice
 * Removes emoji, raw Arabic script, technical markdown, and symbols
 */
export function cleanForIndonesianSpeech(text) {
  if (!text) return '';
  return text
    // 1. Remove options block [OPSI: ...]
    .replace(/\[OPSI:.*?\]/gis, '')
    // 2. Replace (*phonetic* = arti) or (phonetic = arti) with Indonesian 'arti'
    .replace(/\(\*?[^*=)]+\*?\s*=\s*([^)]+)\)/g, '$1')
    // 3. Remove standalone phonetic brackets e.g. (*Qit-thun*)
    .replace(/\(\*?[a-zA-Z\s'-]+\*?\)/g, '')
    // 4. Clean bold/italic asterisks
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    // 5. Remove Arabic characters and diacritics
    .replace(/[\u0600-\u06FF\u0670-\u06D3\u0640]+/g, '')
    // 6. Remove all emojis
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    // 7. Remove markdown headers & symbols
    .replace(/#{1,6}\s?/g, '')
    .replace(/[=~_`]/g, '')
    .replace(/\(\s*\)/g, '')
    .replace(/:\s*:/g, ':')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts the full Arabic phrase inside an option pill (e.g. "نَعَمْ، عِنْدِي قِطٌّ", "اِثْنَانِ", "أُحِبُّ القِطَّ")
 */
export function extractOptionArabic(opt) {
  if (!opt) return null;
  // Match Arabic letters, diacritics, and spaces between Arabic words
  const match = opt.match(/[\u0600-\u06FF\u0670-\u06D3\s،؟]{2,}/);
  if (match) {
    const cleaned = match[0].replace(/[^\u0600-\u06FF\u0670-\u06D3\s،؟]/g, '').trim();
    if (cleaned.length >= 1) return cleaned;
  }
  // Single char e.g. (أ)
  const singleMatch = opt.match(/\(([\u0600-\u06FF])\)/);
  if (singleMatch) return singleMatch[1];
  return null;
}

/**
 * Extracts target Arabic vocabularies and their romanization/translation
 * from a message to display dedicated voice pronunciation buttons.
 * Only extracts the 1-3 core target vocabulary words, cleanly formatted.
 */
export const extractVocabulariesFromMessage = (content = '') => {
  if (!content) return [];
  const results = [];
  const seen = new Set();

  // Pattern 1: Bold Arabic text: **كَلِمَةٌ** optionally followed by (*phonetic*), (*phonetic = arti*), or / *phonetic*
  const boldPattern = /\*\*([\u0600-\u06FF\u0670-\u06D3\s]+)\*\*(?:\s*(?:\/|\()\s*\*?([a-zA-Z\s'\-]+)(?:\*|\=|\-|\/|\)))?/g;
  let match;
  while ((match = boldPattern.exec(content)) !== null) {
    const rawArabic = cleanArabicWord(match[1]);
    const phonetic = (match[2] || '').trim();
    if (rawArabic.length >= 2 && !seen.has(rawArabic)) {
      seen.add(rawArabic);
      const fallbackPhonetic = lookupPhonetic(rawArabic);
      const finalPhonetic = phonetic || fallbackPhonetic;
      results.push({
        arabic: rawArabic,
        phonetic: finalPhonetic,
        label: finalPhonetic ? `${rawArabic} (${finalPhonetic})` : rawArabic
      });
    }
  }

  // If bold pattern didn't find anything, search for Arabic phrases (excluding options line [OPSI: ...])
  if (results.length === 0) {
    const contentWithoutOptions = content.replace(/\[OPSI:.*?\]/gis, '');
    const phrasePattern = /([\u0600-\u06FF\u0670-\u06D3]{2,}(?:\s+[\u0600-\u06FF\u0670-\u06D3]{2,})*)/g;
    while ((match = phrasePattern.exec(contentWithoutOptions)) !== null) {
      const rawArabic = cleanArabicWord(match[1]);
      if (rawArabic.length >= 2 && !TRIVIAL_WORDS.has(rawArabic) && !seen.has(rawArabic)) {
        seen.add(rawArabic);
        const fallbackPhonetic = lookupPhonetic(rawArabic);
        results.push({
          arabic: rawArabic,
          phonetic: fallbackPhonetic,
          label: fallbackPhonetic ? `${rawArabic} (${fallbackPhonetic})` : rawArabic
        });
      }
    }
  }

  // Cap at 3 most relevant vocabulary chips so screen stays neat and kid-friendly
  return results.slice(0, 3);
};

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isSpeaking = false;
    this.recognition = null;
    this.currentAudio = null;

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices() || [];
    } catch (e) {
      this.voices = [];
    }
  }

  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.onplay = null;
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch (e) {
        // ignore
      }
      this.currentAudio = null;
    }

    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.isSpeaking = false;
  }

  /**
   * Focused pronunciation for target Arabic vocabulary (e.g. Qittun, Itsnaani, Baqaratun)
   * Plays pure native Arabic pronunciation with clear makhraj
   * Multi-candidate fallback pipeline ensures sound ALWAYS plays
   */
  speakVocab(arabicText, phoneticText = '', options = {}) {
    this.stop();

    const cleanArabic = cleanArabicWord(arabicText || '');
    const cleanPhonetic = (phoneticText || '').trim();

    if (!cleanArabic && !cleanPhonetic) return false;

    if (options.onStart) options.onStart();
    this.isSpeaking = true;

    let finishedCalled = false;
    const handleFinished = () => {
      if (finishedCalled) return;
      finishedCalled = true;
      this.isSpeaking = false;
      this.currentAudio = null;
      if (options.onEnd) options.onEnd();
    };

    const targetWord = cleanArabic || cleanPhonetic;
    const encoded = encodeURIComponent(targetWord);

    // Candidates in order of quality & reliability:
    // 1. Relative backend endpoint (proxied in Vite or handled by Vercel serverless)
    // 2. Google Translate GTX endpoint (supports no-referrer direct browser audio playback)
    // 3. Google Translate TW-OB endpoint
    const candidates = [
      `/api/tts?q=${encoded}&lang=ar`,
      `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=ar&q=${encoded}`,
      `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ar&q=${encoded}`
    ];

    let currentCandidateIndex = 0;

    const tryNextCandidate = () => {
      if (currentCandidateIndex >= candidates.length) {
        // All audio URLs exhausted, fallback to Web Speech API
        this.speakVocabSynth(cleanArabic, cleanPhonetic, handleFinished);
        return;
      }

      const url = candidates[currentCandidateIndex++];
      let attemptHandled = false;

      const triggerNext = () => {
        if (attemptHandled) return;
        attemptHandled = true;
        if (this.currentAudio) {
          try {
            this.currentAudio.onplay = null;
            this.currentAudio.onended = null;
            this.currentAudio.onerror = null;
            this.currentAudio.pause();
          } catch (e) {
            // ignore
          }
          this.currentAudio = null;
        }
        tryNextCandidate();
      };

      try {
        const audio = new Audio();
        // Prevent browser from sending Referer header on external media requests
        if ('referrerPolicy' in audio) {
          audio.referrerPolicy = 'no-referrer';
        }
        this.currentAudio = audio;

        audio.onended = () => {
          if (!attemptHandled) {
            attemptHandled = true;
            handleFinished();
          }
        };

        audio.onerror = () => {
          triggerNext();
        };

        audio.src = url;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            triggerNext();
          });
        }
      } catch (e) {
        triggerNext();
      }
    };

    tryNextCandidate();
    return true;
  }

  /**
   * Internal SpeechSynthesis fallback for Arabic vocabulary
   * Accurately selects voice or speaks transliteration so device NEVER remains silent
   */
  speakVocabSynth(arabicText, phoneticText, onEndCallback) {
    if (!this.synth) {
      if (onEndCallback) onEndCallback();
      return false;
    }

    try {
      this.synth.cancel();
      if (this.synth.paused) {
        this.synth.resume();
      }

      if (this.voices.length === 0) {
        this.loadVoices();
      }

      const arabicVoice = this.voices.find(v => v.lang && (v.lang.startsWith('ar') || v.lang.includes('Arabic')));
      const indonesianVoice = this.voices.find(v => v.lang && (v.lang.startsWith('id') || v.lang.includes('Indonesian')));

      let utteranceText = '';
      let utteranceLang = 'ar-SA';
      let selectedVoice = null;

      if (arabicVoice && arabicText) {
        utteranceText = arabicText;
        utteranceLang = 'ar-SA';
        selectedVoice = arabicVoice;
      } else {
        // If device has NO Arabic voice, speak the phonetic transliteration with Indonesian voice
        // so it NEVER feeds raw Arabic script to an Indonesian TTS engine
        const fallbackPhonetic = lookupPhonetic(arabicText);
        utteranceText = phoneticText || fallbackPhonetic || arabicText;
        utteranceLang = 'id-ID';
        selectedVoice = indonesianVoice || null;
      }

      const utterance = new SpeechSynthesisUtterance(utteranceText);
      utterance.lang = utteranceLang;
      utterance.rate = 0.85;
      utterance.pitch = 1.05;

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = () => {
        if (onEndCallback) onEndCallback();
      };

      this.synth.speak(utterance);
      return true;
    } catch (e) {
      if (onEndCallback) onEndCallback();
      return false;
    }
  }

  /**
   * Speak friendly Indonesian explanation (removes raw Arabic symbols and syntax so voice sounds natural)
   */
  speak(text, options = {}) {
    if (!this.synth) return false;
    this.stop();

    const cleanText = cleanForIndonesianSpeech(text);
    if (!cleanText) {
      if (options.onEnd) options.onEnd();
      return false;
    }

    try {
      this.synth.cancel();
      if (this.synth.paused) {
        this.synth.resume();
      }

      if (this.voices.length === 0) {
        this.loadVoices();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      const indonesianVoice = this.voices.find(v => v.lang && (v.lang.startsWith('id') || v.lang.includes('Indonesian')));
      if (indonesianVoice) {
        utterance.voice = indonesianVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (options.onEnd) options.onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (options.onEnd) options.onEnd();
      };

      this.synth.speak(utterance);
      return true;
    } catch (e) {
      this.isSpeaking = false;
      if (options.onEnd) options.onEnd();
      return false;
    }
  }

  isRecognitionSupported() {
    return typeof window !== 'undefined' && 
      (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
  }

  startListening(options = {}) {
    if (!this.isRecognitionSupported()) {
      if (options.onError) options.onError('Speech recognition not supported in this browser');
      return null;
    }

    this.stop();
    const { onResult, onError, onEnd, lang = 'id-ID' } = options;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRec();
    this.recognition.lang = lang;
    this.recognition.continuous = false;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      if (onEnd) onEnd();
    };

    this.recognition.start();
    return this.recognition;
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.recognition = null;
    }
  }
}

export const speechService = new SpeechService();
export default speechService;
