/**
 * Utility for Web Speech API & Focused Arabic Vocabulary Audio
 * Tailored for Ifham Kids - Bahasa Arab Ramah Anak SD
 */

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
    this.voices = this.synth.getVoices();
  }

  containsArabic(text) {
    return /[\u0600-\u06FF]/.test(text || '');
  }

  /**
   * Stop any playing audio or speech synthesis
   */
  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
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
   * Focused pronunciation for target Arabic vocabulary (e.g. Al-Hayawanat, Qittun, Baqaratun)
   * Plays pure Arabic pronunciation with clear makhraj
   * @param {string} arabicText - The arabic word (e.g. "قِطٌّ" or "الحَيَوَانَات")
   * @param {string} phoneticText - Romanized makhraj (e.g. "Qit-thun" or "Al-Hayawaanaat")
   * @param {object} options - { onStart, onEnd }
   */
  speakVocab(arabicText, phoneticText = '', options = {}) {
    this.stop();

    if (!arabicText && !phoneticText) return false;

    const cleanArabic = (arabicText || '').trim();
    const cleanPhonetic = (phoneticText || '').trim();

    if (options.onStart) options.onStart();
    this.isSpeaking = true;

    const handleFinished = () => {
      this.isSpeaking = false;
      this.currentAudio = null;
      if (options.onEnd) options.onEnd();
    };

    // 1. Try High-Quality Audio from Google TTS API
    if (cleanArabic) {
      try {
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ar&q=${encodeURIComponent(cleanArabic)}`;
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;

        let hasPlayed = false;

        audio.onplay = () => {
          hasPlayed = true;
        };

        audio.onended = () => {
          handleFinished();
        };

        audio.onerror = () => {
          // If network / CORS audio fails, fallback to Web Speech Synthesis
          if (!hasPlayed) {
            this.speakVocabSynth(cleanArabic, cleanPhonetic, handleFinished);
          } else {
            handleFinished();
          }
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay restriction or network blocked, fallback to SpeechSynthesis
            this.speakVocabSynth(cleanArabic, cleanPhonetic, handleFinished);
          });
        }
        return true;
      } catch (e) {
        // Fallback to synth
        return this.speakVocabSynth(cleanArabic, cleanPhonetic, handleFinished);
      }
    }

    return this.speakVocabSynth(cleanArabic, cleanPhonetic, handleFinished);
  }

  /**
   * Internal SpeechSynthesis fallback for vocabulary
   */
  speakVocabSynth(arabicText, phoneticText, onEndCallback) {
    if (!this.synth) {
      if (onEndCallback) onEndCallback();
      return false;
    }

    if (this.voices.length === 0) {
      this.loadVoices();
    }

    const arabicVoice = this.voices.find(v => v.lang.startsWith('ar') || v.lang.includes('Arabic'));
    const indonesianVoice = this.voices.find(v => v.lang.startsWith('id') || v.lang.includes('Indonesian'));

    let utteranceText = '';
    let utteranceLang = 'ar-SA';
    let selectedVoice = null;

    if (arabicVoice && arabicText) {
      // Browser has Arabic voice engine!
      utteranceText = arabicText;
      utteranceLang = 'ar-SA';
      selectedVoice = arabicVoice;
    } else {
      // Browser lacks Arabic voice pack (common on Windows):
      // Use clean phonetic pronunciation with Indonesian/default voice for clear sound!
      utteranceText = phoneticText || arabicText;
      utteranceLang = 'id-ID';
      selectedVoice = indonesianVoice || null;
    }

    const utterance = new SpeechSynthesisUtterance(utteranceText);
    utterance.lang = utteranceLang;
    utterance.rate = 0.82; // Child-friendly slow & clear rate
    utterance.pitch = 1.05;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      if (onEndCallback) onEndCallback();
    };

    this.synth.speak(utterance);
    return true;
  }

  /**
   * Standard speak text (for backward compatibility)
   */
  speak(text, options = {}) {
    if (!this.synth) return false;
    this.stop();

    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s?/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/`{1,3}.*?`{1,3}/gs, '')
      .trim();

    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const hasArabic = this.containsArabic(cleanText);
    const targetLang = options.lang || (hasArabic ? 'ar-SA' : 'id-ID');
    utterance.lang = targetLang;
    utterance.rate = options.rate || (hasArabic ? 0.85 : 0.95);
    utterance.pitch = options.pitch || 1.05;

    if (this.voices.length === 0) {
      this.loadVoices();
    }

    if (this.voices.length > 0) {
      let matchedVoice = null;
      if (targetLang.startsWith('ar')) {
        matchedVoice = this.voices.find(v => v.lang.startsWith('ar') || v.lang.includes('Arabic'));
      } else {
        matchedVoice = this.voices.find(v => v.lang.startsWith('id') || v.lang.includes('Indonesian'));
      }
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      if (options.onEnd) options.onEnd();
    };

    this.synth.speak(utterance);
    return true;
  }

  isRecognitionSupported() {
    return typeof window !== 'undefined' && 
      (Boolean(window.SpeechRecognition) || Boolean(window.webkitSpeechRecognition));
  }

  startListening({ lang = 'id-ID', onResult, onError, onEnd }) {
    if (!this.isRecognitionSupported()) {
      if (onError) onError('Browser tidak mendukung perekaman suara (Speech-to-Text).');
      return null;
    }

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
      console.warn('Speech recognition error:', event.error);
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
      this.recognition.stop();
      this.recognition = null;
    }
  }
}

/**
 * Extracts target Arabic vocabularies and their romanization/translation
 * from a message to display dedicated voice pronunciation buttons.
 * @param {string} content
 * @returns {Array<{arabic: string, phonetic: string, label: string}>}
 */
export const extractVocabulariesFromMessage = (content = '') => {
  if (!content) return [];
  const results = [];
  const seen = new Set();

  // Pattern 1: **قِطٌّ** (*Qit-thun = Kucing*) or **قِطٌّ** (Qit-thun)
  const pattern1 = /\*\*([\u0600-\u06FF\s]+)\*\*\s*\(\*?([a-zA-Z\s'-]+)(?:=|\-)?([^\*)]*)\*?\)/g;
  let match;
  while ((match = pattern1.exec(content)) !== null) {
    const arabic = match[1].trim();
    const phonetic = match[2].trim();
    const key = `${arabic}-${phonetic}`;
    if (!seen.has(key) && arabic.length >= 2) {
      seen.add(key);
      results.push({
        arabic,
        phonetic,
        label: `${arabic} (${phonetic})`
      });
    }
  }

  // Pattern 2: [OPSI: A. قِطٌّ (Qit-thun) 🐱 | ...]
  const pattern2 = /([A-Z]\.?\s*)?([\u0600-\u06FF\s]+)\s*\(([a-zA-Z\s'-]+)\)/g;
  while ((match = pattern2.exec(content)) !== null) {
    const arabic = match[2].trim();
    const phonetic = match[3].trim();
    const key = `${arabic}-${phonetic}`;
    if (!seen.has(key) && arabic.length >= 2) {
      seen.add(key);
      results.push({
        arabic,
        phonetic,
        label: `${arabic} (${phonetic})`
      });
    }
  }

  // Pattern 3: Topik e.g. (**Al-Hayawaanaat** / الحَيَوَانَات)
  const pattern3 = /\(\*?([a-zA-Z\s'-]+)\*?\s*\/\s*([\u0600-\u06FF\s]+)\)/g;
  while ((match = pattern3.exec(content)) !== null) {
    const phonetic = match[1].trim();
    const arabic = match[2].trim();
    const key = `${arabic}-${phonetic}`;
    if (!seen.has(key) && arabic.length >= 2) {
      seen.add(key);
      results.push({
        arabic,
        phonetic,
        label: `${arabic} (${phonetic})`
      });
    }
  }

  return results;
};

export const speechService = new SpeechService();
export default speechService;

