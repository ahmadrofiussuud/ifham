import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, BookOpen, Headphones, MessagesSquare } from 'lucide-react';
import LandingHero from '../components/LandingHero';
import Logo from '../components/Logo';
import BukuPanduanModal from '../components/BukuPanduanModal';
import './LandingPage.css';

const lessons = [
  { number: '01', arabic: 'ا ب ت', title: 'Kenali kata dan harakatnya', description: 'Mulai dari benda, hewan, dan kegiatan yang ditemui anak sehari-hari.', icon: BookOpen },
  { number: '02', arabic: 'كِتَابٌ', title: 'Dengarkan, lalu ucapkan', description: 'Dengarkan pelafalan kosakata Arab dan coba ucapkan kembali dengan tenang.', icon: Headphones },
  { number: '03', arabic: 'مَا هٰذَا؟', title: 'Pakai dalam percakapan', description: 'Susun pemahaman lewat pertanyaan dan latihan kalimat sederhana bersama Kak Ifham.', icon: MessagesSquare },
];

export default function LandingPage() {
  const [showGuide, setShowGuide] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <nav className="landing-nav" aria-label="Navigasi utama">
          <Link to="/" aria-label="Ifham Kids, beranda"><Logo size="normal" /></Link>
          <div className="landing-nav__links">
            <Link to="/" aria-current="page">Beranda</Link>
            <Link to="/fitur">Fitur</Link>
            <Link to="/cara-kerja">Cara belajar</Link>
            <Link to="/tentang">Tentang</Link>
          </div>
          <div className="landing-nav__actions">
            <Link className="landing-nav__login" to="/login">Masuk</Link>
            <Link className="landing-nav__start" to="/chat">Mulai belajar <ArrowRight size={15} aria-hidden="true" /></Link>
            <button className="landing-menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="landing-mobile-menu" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
        {menuOpen && <nav id="landing-mobile-menu" className="landing-mobile-menu" aria-label="Navigasi seluler">
          <Link to="/fitur" onClick={() => setMenuOpen(false)}>Fitur</Link>
          <Link to="/cara-kerja" onClick={() => setMenuOpen(false)}>Cara belajar</Link>
          <Link to="/tentang" onClick={() => setMenuOpen(false)}>Tentang Ifham</Link>
          <button type="button" onClick={() => { setMenuOpen(false); setShowGuide(true); }}>Buku panduan</button>
        </nav>}
      </header>

      <LandingHero onOpenGuide={() => setShowGuide(true)} />

      <section className="landing-learning" aria-labelledby="learning-heading">
        <div className="landing-section-heading">
          <p className="landing-kicker">CARA KITA BELAJAR</p>
          <h2 id="learning-heading">Pahami dulu.<br />Lalu berani mencoba.</h2>
          <p>Tak perlu terburu-buru menghafal. Mulai dari satu kata yang dikenal, lalu beri ruang untuk bertanya dan berlatih.</p>
        </div>
        <div className="landing-learning__grid">
          {lessons.map(({ number, arabic, title, description, icon: Icon }) => <article className="landing-lesson" key={number}>
            <div className="landing-lesson__top"><span>{number}</span><Icon size={20} strokeWidth={1.5} aria-hidden="true" /></div>
            <p className="landing-lesson__arabic" lang="ar" dir="rtl">{arabic}</p>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>)}
        </div>
      </section>

      <section className="landing-guide" aria-labelledby="guide-heading">
        <div>
          <p className="landing-kicker">UNTUK ORANG TUA DAN GURU</p>
          <h2 id="guide-heading">Temani langkah kecil mereka.</h2>
          <p>Kenali cara memilih materi, menggunakan suara, dan mendampingi anak berdialog dengan Kak Ifham.</p>
        </div>
        <button type="button" onClick={() => setShowGuide(true)}>Baca buku panduan <ArrowRight size={18} aria-hidden="true" /></button>
      </section>

      <footer className="landing-footer">
        <div><Logo size="small" /><p>Bahasa Arab, satu langkah setiap hari.</p></div>
        <nav aria-label="Navigasi footer"><Link to="/tentang">Tentang Ifham</Link><Link to="/cara-kerja">Cara belajar</Link><a href="mailto:ifhamkids@gmail.com">Hubungi kami</a></nav>
        <p>© 2026 Ifham Kids</p>
      </footer>
      <BukuPanduanModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
}
