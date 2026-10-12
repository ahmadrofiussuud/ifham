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
    this.voices = this.synth.getVoices() || [];
  }

  containsArabic(text) {
    return /[\u0600-\u06FF]/.test(text || '');
  }

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
   */
  speakVocab(arabicText, phoneticText = '', options = {}) {
    this.stop();

    if (!arabicText && !phoneticText) return false;

    const cleanArabic = (arabicText || '').trim();
    const cleanPhonetic = (phoneticText || '').trim();

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
    
    // Primary: Relative backend/serverless proxy (proxied by Vite locally & handled by Vercel serverless)
    const primaryUrl = `/api/tts?q=${encodeURIComponent(targetWord)}&lang=ar`;
    // Fallback 1: Direct Google Translate TTS
    const directFallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ar&q=${encodeURIComponent(targetWord)}`;

    const playWithFallback = (url, isFallback = false) => {
      try {
        const audio = new Audio(url);
        this.currentAudio = audio;

        let hasStartedPlaying = false;

        audio.onplay = () => {
          hasStartedPlaying = true;
        };

        audio.onended = () => {
          handleFinished();
        };

        audio.onerror = () => {
          if (!isFallback) {
            // Try direct Google TTS
            playWithFallback(directFallbackUrl, true);
          } else {
            // Both failed, fallback to Web Speech API
            this.speakVocabSynth(cleanArabic, cleanPhonetic, handleFinished);
          }
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (!isFallback) {
              playWithFallback(directFallbackUrl, true);
            } else {
              this.speakVocabSynth(cleanArabic, cleanPhonetic, handleFinished);
            }
          });
        }
      } catch (e) {
        if (!isFallback) {
          playWithFallback(directFallbackUrl, true);
        } else {
          this.speakVocabSynth(cleanArabic, cleanPhonetic, handleFinished);
        }
      }
    };

    playWithFallback(primaryUrl);
    return true;
  }

  /**
   * Internal SpeechSynthesis fallback for Arabic vocabulary
   */
  speakVocabSynth(arabicText, phoneticText, onEndCallback) {
    if (!this.synth) {
      if (onEndCallback) onEndCallback();
      return false;
    }

    if (this.synth.paused) {
      this.synth.resume();
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
      utteranceText = arabicText;
      utteranceLang = 'ar-SA';
      selectedVoice = arabicVoice;
    } else {
      utteranceText = phoneticText || arabicText;
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
  }

  /**
   * Speak friendly Indonesian explanation (skips Arabic symbols so voice doesn't choke)
   */
  speak(text, options = {}) {
    if (!this.synth) return false;
    this.stop();

    const cleanText = text
      .replace(/\[OPSI:.*?\]/gis, '')
      .replace(/\*\*([\u0600-\u06FF\s]+)\*\*/g, '')
      .replace(/[\u0600-\u06FF]+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s?/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return false;

    if (this.synth.paused) {
      this.synth.resume();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;
    utterance.pitch = 1.05;

    if (this.voices.length === 0) {
      this.loadVoices();
    }

    const indonesianVoice = this.voices.find(v => v.lang.startsWith('id') || v.lang.includes('Indonesian'));
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
      this.recognition.stop();
      this.recognition = null;
    }
  }
}

/**
 * Extracts target Arabic vocabularies and their romanization/translation
 * from a message to display dedicated voice pronunciation buttons.
 * Guarantees ANY Arabic word found gets an audio button!
 */
export const extractVocabulariesFromMessage = (content = '') => {
  if (!content) return [];
  const results = [];
  const seen = new Set();

  // Pattern 1: **قِطٌّ** (*Qit-thun = Kucing*) or **قِطٌّ** (Qit-thun)
  const pattern1 = /\*\*([\u0600-\u06FF\s]+)\*\*\s*(?:\(\*?([a-zA-Z\s'-]+)(?:=|\-)?([^\*)]*)\*?\))?/g;
  let match;
  while ((match = pattern1.exec(content)) !== null) {
    const arabic = match[1].trim();
    const phonetic = (match[2] || '').trim();
    if (!seen.has(arabic) && arabic.length >= 2) {
      seen.add(arabic);
      results.push({
        arabic,
        phonetic,
        label: phonetic ? `${arabic} (${phonetic})` : arabic
      });
    }
  }

  // Pattern 2: [OPSI: A. قِطٌّ (Qit-thun) 🐱 | ...]
  const pattern2 = /([A-Z]\.?\s*)?([\u0600-\u06FF\s]+)\s*\(([a-zA-Z\s'-]+)\)/g;
  while ((match = pattern2.exec(content)) !== null) {
    const arabic = match[2].trim();
    const phonetic = match[3].trim();
    if (!seen.has(arabic) && arabic.length >= 2) {
      seen.add(arabic);
      results.push({
        arabic,
        phonetic,
        label: `${arabic} (${phonetic})`
      });
    }
  }

  // Pattern 3: Any other Arabic word / phrase with 2+ characters
  const arabicRegex = /([\u0600-\u06FF\u0670-\u06D3\u0640]{2,30})/g;
  while ((match = arabicRegex.exec(content)) !== null) {
    const arabic = match[1].trim();
    if (arabic.length >= 2 && !seen.has(arabic)) {
      seen.add(arabic);
      results.push({
        arabic,
        phonetic: '',
        label: arabic
      });
    }
  }

  return results;
};

export const speechService = new SpeechService();
export default speechService;
