/**
 * Utility for Web Speech API (Text-to-Speech & Speech-to-Text)
 * Tailored for Ifham Kids - Bahasa Arab Ramah Anak SD
 */

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isSpeaking = false;
    this.recognition = null;

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

  // Extract Arabic segments or clean text for pronunciation
  containsArabic(text) {
    return /[\u0600-\u06FF]/.test(text);
  }

  /**
   * Speak text with appropriate voice & child-friendly rate
   * @param {string} text - text to speak
   * @param {object} options - { lang, rate, pitch, onStart, onEnd }
   */
  speak(text, options = {}) {
    if (!this.synth) {
      console.warn('Speech synthesis is not supported in this browser.');
      return false;
    }

    // Cancel current speech if any
    this.stop();

    // Clean markdown formatting like **, ##, etc.
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s?/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/`{1,3}.*?`{1,3}/gs, '')
      .trim();

    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // If text is primarily Arabic or Arabic phrase requested
    const hasArabic = this.containsArabic(cleanText);
    const targetLang = options.lang || (hasArabic ? 'ar-SA' : 'id-ID');
    utterance.lang = targetLang;

    // Friendly rate for kids: slower, clear pronunciation
    utterance.rate = options.rate || (hasArabic ? 0.85 : 0.95);
    utterance.pitch = options.pitch || 1.05; // slightly cheerful pitch

    // Find best matching voice
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
      console.warn('Speech synthesis error:', e);
      if (options.onEnd) options.onEnd();
    };

    this.synth.speak(utterance);
    return true;
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  /**
   * Check if Speech Recognition (Voice Input) is supported
   */
  isRecognitionSupported() {
    return typeof window !== 'undefined' && 
      (Boolean(window.SpeechRecognition) || Boolean(window.webkitSpeechRecognition));
  }

  /**
   * Start listening from microphone
   */
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

export const speechService = new SpeechService();
export default speechService;
