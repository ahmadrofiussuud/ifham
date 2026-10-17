import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Volume2, Square } from 'lucide-react';
import { speechService } from '../utils/speechHelper';
import './LandingHero.css';

export default function LandingHero({ onOpenGuide }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => speechService.stop(), []);

  const pronounce = () => {
    if (playing) {
      speechService.stop();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    speechService.speakVocab('كِتَابٌ', 'kitaabun', {
      onEnd: () => setPlaying(false),
    });
  };

  return (
    <main className="arabic-hero" aria-labelledby="hero-heading">
      <div className="arabic-hero__inner">
        <div className="arabic-hero__intro">
          <p className="arabic-hero__eyebrow"><span /> BAHASA ARAB UNTUK ANAK SD / MI</p>
          <h1 id="hero-heading">Dari satu kata,<br />jadi bisa<br /><span>bahasa Arab.</span></h1>
          <p className="arabic-hero__description">
            Kenali kosakata, dengarkan pelafalan, lalu coba kalimat sederhana.
            Bersama Kak Ifham, anak belajar memahami sedikit demi sedikit.
          </p>
          <div className="arabic-hero__actions">
            <Link to="/chat" className="arabic-hero__primary">Mulai belajar <ArrowRight size={18} aria-hidden="true" /></Link>
            <button type="button" onClick={onOpenGuide} className="arabic-hero__secondary">Lihat panduan <BookOpen size={17} aria-hidden="true" /></button>
          </div>
          <div className="arabic-hero__notes" aria-label="Materi pembelajaran">
            <span>Huruf & harakat</span><span>Pelafalan</span><span>Percakapan sehari-hari</span>
          </div>
        </div>

        <div className="arabic-hero__lesson">
          <div className="arabic-hero__lesson-heading">
            <span>SEBUAH KATA, SEBUAH AWAL.</span>
            <span lang="ar" dir="rtl">أَهْلًا وَسَهْلًا</span>
          </div>
          <article className="word-page" aria-label="Contoh kosakata bahasa Arab: buku">
            <header className="word-page__header">
              <span>01 <span className="word-page__divider">/</span> DI SEKITAR KITA</span>
              <span lang="ar" dir="rtl">دَرْسُ الْيَوْمِ</span>
            </header>
            <div className="word-page__vocabulary">
              <div className="word-page__drawing" aria-hidden="true">
                <svg viewBox="0 0 180 140" fill="none">
                  <path d="M25 36 82 25l66 13 7 83-65-9-62 12Z" fill="#E3BD6B" />
                  <path d="M90 42C67 29 47 30 23 38l5 71c23-7 43-6 62 6m0-73c22-12 43-12 66-4l-5 71c-22-7-42-6-61 6m0-73v73" fill="#FFFDF6" stroke="#254F4B" strokeWidth="3" strokeLinejoin="round" />
                  <path d="m39 53 30-3m-29 17 29-2M41 80l28-1m42-27 28 2m-29 12 28 3m-29 11 27 3" stroke="#95ADA1" strokeWidth="3" strokeLinecap="round" />
                  <path d="m123 31-1 27 8-5 7 8 1-27" fill="#BD6547" />
                </svg>
              </div>
              <div className="word-page__word">
                <p className="word-page__arabic" lang="ar" dir="rtl">كِتَابٌ</p>
                <p className="word-page__latin">kitaabun <span>— buku</span></p>
                <button type="button" onClick={pronounce} className="word-page__audio" aria-pressed={playing} aria-label={playing ? 'Hentikan pelafalan kitaabun' : 'Dengarkan pelafalan kitaabun'}>
                  {playing ? <Square size={15} aria-hidden="true" /> : <Volume2 size={17} aria-hidden="true" />}
                  {playing ? 'Hentikan suara' : 'Dengarkan'}
                </button>
              </div>
            </div>
            <div className="word-page__sentence">
              <p className="word-page__label">SEKARANG, COBA SATU KALIMAT</p>
              <p lang="ar" dir="rtl" className="word-page__example">هٰذَا كِتَابٌ</p>
              <p>Ini sebuah buku.</p>
            </div>
            <footer className="word-page__footer"><span>Kenali. Dengarkan. Ucapkan.</span><span>ا ب ت</span></footer>
          </article>
          <p className="arabic-hero__caption">Belajar dimulai dari hal-hal yang dekat dengan anak.</p>
        </div>
      </div>
    </main>
  );
}
