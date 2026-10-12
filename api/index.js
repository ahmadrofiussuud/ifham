const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Supabase Setup (Graceful Fallback if not configured)
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'placeholder-key';
let supabase;
try {
    supabase = createClient(supabaseUrl, supabaseKey);
} catch (err) {
    console.warn('Supabase initialization failed, running in guest memory mode:', err.message);
    supabase = {
        from: () => ({
            select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [] }) }), single: () => Promise.resolve({ data: null }) }),
            insert: () => Promise.resolve({ data: null }),
            update: () => Promise.resolve({ data: null })
        })
    };
}

// Gemini Setup
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(geminiApiKey);

app.use(cors());
app.use(express.json());

// Auth Middleware (Graceful for Guests & Direct AI Experience)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Direct access for guests: auto-assign demo student
        req.user = { id: 'demo-murid-a', email: 'murida@ifhamkids.com', name: 'Ahmad Cilik' };
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET || 'ifham-secret-key-default', (err, user) => {
        if (err) {
            req.user = { id: 'demo-murid-a', email: 'murida@ifhamkids.com', name: 'Ahmad Cilik' };
            return next();
        }
        req.user = user;
        next();
    });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { data, error } = await supabase
            .from('users')
            .insert([
                { full_name: fullName, email, password_hash: hashedPassword }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.full_name },
            process.env.JWT_SECRET || 'ifham-secret-key-default',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.full_name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json(req.user);
});

// Socratic Dummy Response Generator
const generateSocraticDummyResponse = (message, mode = 'socratic', topic = 'Hewan Ceria (Al-Hayawaanaat)', userMsgCount = 1) => {
    const msgLower = (message || '').toLowerCase();
    const activeTopic = topic || 'Hewan Ceria (Al-Hayawaanaat)';

    if (msgLower.includes('ringkasan') || msgLower.includes('rangkuman')) {
        return `🌟 **Rangkuman Belajar Bersama Kak Ifham** 🌟\n\nWah, hebat sekali jagoan! Berikut kosa kata Arab yang sudah kita pelajari tentang **${activeTopic}**:\n\n1. **قِطٌّ** (*Qit-thun*) = Kucing 🐱\n2. **أَسَدٌ** (*Asadun*) = Singa Si Raja Hutan 🦁\n3. **فِيلٌ** (*Fiilun*) = Gajah Belalai Panjang 🐘\n\nKamu hebat dan cepat paham! Mau lanjut tebak hewan lainnya?\n\n[OPSI: Mau lanjut tebak hewan! 🦁 | Ulangi suara tadi 🔊 | Ganti topik belajar 📚]`;
    }

    if (msgLower.includes('latihan') || msgLower.includes('soal')) {
        return `🎯 **Kuis Teka-Teki Seru Kak Ifham!** 🎯\n\nKak Ifham punya hewan yang punya belalai panjang dan suka makan rumput. Hewan ini badannya besar sekali!\n\nBahasa Arabnya apa ya?\n\n[OPSI: A. فِيلٌ (Fiilun) 🐘 | B. قِطٌّ (Qit-thun) 🐱 | C. Butuh petunjuk Kak! 💡]`;
    }

    if (msgLower.includes('petunjuk') || msgLower.includes('clue') || msgLower.includes('bantuan')) {
        return `💡 **Petunjuk Rahasia dari Kak Ifham:**\nHewan ini bunyinya "Meoong..." suka tidur di kasur dan suka makan ikan! Huruf depannya **Qoof** (ق).\n\nCoba tebak sekarang!\n\n[OPSI: A. قِطٌّ (Qit-thun) 🐱 | B. كَلْبٌ (Kalbun) 🐶 | C. طَائِرٌ (Thoo-irun) 🐦]`;
    }

    if (msgLower.includes('fiilun') || msgLower.includes('gajah') || msgLower.includes('a.')) {
        return `🌟 **Mumtaz! Hebat sekali!** 🌟\n\nJawabanmu tepat 100%! Gajah dalam bahasa Arab adalah **فِيلٌ** (*Fiilun*).\n\nSekarang coba tebak: Kalau hewan yang bisa terbang tinggi di langit dan punya sayap, apa ya bahasa Arabnya?\n\n[OPSI: A. طَائِرٌ (Thoo-irun) 🐦 | B. سَمَكٌ (Samakun) 🐟 | C. أَسَدٌ (Asadun) 🦁]`;
    }

    if (mode === 'guided') {
        const guidedResponses = [
            `Ahlan wa sahlan sahabat kecil! 🌟 Hari ini Kak Ifham temani belajar **${activeTopic}** ya. Langkah pertama, coba sebutkan hewan apa yang paling kamu sukai di rumah atau di kebun binatang?\n\n[OPSI: Aku suka kucing 🐱 | Aku suka burung 🐦 | Aku suka singa 🦁]`,
            `Wah pilihan yang bagus! Kalau hewan kesukaanmu itu, bunyinya seperti apa sih? Kak Ifham mau tahu! 🎈\n\n[OPSI: Suaranya meong meong 🐱 | Suaranya cuit cuit 🐦 | Suaranya roarrr 🦁]`,
            `Keren banget! Nah, sekarang kamu sudah tahu bahasa Arabnya dan cara membacanya dengan fasih. Mumtaz jagoan! ⭐\n\n[OPSI: Coba hewan lain dong Kak! 🌟 | Aku mau coba kuis 🎯 | Simpulkan belajarku 📝]`
        ];
        return guidedResponses[userMsgCount % guidedResponses.length];
    }

    if (mode === 'latihan') {
        if (msgLower.includes('siap') || msgLower.includes('mulai')) {
            return `Bismillah, yuk kita mulai tantangan bintang **${activeTopic}**! ⭐\n\n**Soal 1**: Di kelas ada benda untuk menulis di buku. Bahasa Arabnya adalah **قَلَمٌ** (*Qolamun*). Artinya apa ya?\n\n[OPSI: A. Pena / Pulpen ✏️ | B. Papan Tulis 📋 | C. Penghapus 🧼]`;
        }
        return `Allahu Akbar, pintar sekali! 🎯 Jawaban dan penalaranmu sangat tepat untuk **${activeTopic}**. Kamu dapat 1 bintang tambahan! ⭐ Mau lanjut ke level berikutnya?\n\n[OPSI: Lanjut level berikutnya! 🚀 | Coba kuis lainnya 🌟 | Istirahat sebentar ☕]`;
    }

    const socraticKidsResponses = [
        `Assalamu'alaikum sahabat ceria! 🌟 Senang sekali belajar bahasa Arab bareng kamu tentang **${activeTopic}**. Coba lihat sekelilingmu, ada hewan yang suka dielus dan bunyinya "meoong". Kamu tahu bahasa Arabnya?\n\n[OPSI: A. قِطٌّ (Qit-thun) 🐱 | B. نَمِرٌ (Namirun) 🐯 | C. Butuh petunjuk 💡]`,
        `Wah jawaban yang menarik! Coba bayangkan kalau hewannya punya surai lebat dan dijuluki Raja Hutan yang gagah perkasa 🦁. Menurutmu bahasa Arabnya **أَسَدٌ** (*Asadun*) atau **فِيلٌ** (*Fiilun*)?\n\n[OPSI: A. أَسَدٌ (Asadun) 🦁 | B. فِيلٌ (Fiilun) 🐘 | C. Keduanya benar 🤔]`,
        `Mumtaz! Kamu pintar sekali menghubungkan ciri-cirinya! 👏 Sekarang coba ucapkan pelan-pelan kata Arab tersebut. Apakah kamu sudah mendengar lafal suaranya di tombol speaker 🔊?\n\n[OPSI: Sudah Kak, fasih banget! 🔊 | Mau dengarkan lagi 👂 | Tebak kata berikutnya! 🚀]`,
        `Subhanallah, kamu jagoan bahasa Arab cilik yang hebat! 🌟 Semua teka-teki berhasil kamu selesaikan. Mau simpulkan kata apa saja yang sudah kamu kuasai hari ini?\n\n[OPSI: Ya, buatkan ringkasan! 📝 | Lanjut petualangan baru 🗺️ | Coba kuis seru 🎯]`
    ];

    return socraticKidsResponses[(userMsgCount - 1) % socraticKidsResponses.length] || socraticKidsResponses[0];
};

app.post(['/api/chat/message', '/chat/message'], authenticateToken, async (req, res) => {
    const { message, sessionId, seedHistory, mode, topic } = req.body;
    const userId = req.user.id;
    let currentSessionId = sessionId;

    try {
        if (!currentSessionId) {
            try {
                const { data: newSession, error: sError } = await supabase
                    .from('chat_sessions')
                    .insert([{ user_id: userId }])
                    .select()
                    .single();
                if (!sError && newSession) {
                    currentSessionId = newSession.id;
                }
            } catch (err) {
                currentSessionId = 'session-demo-' + Date.now();
            }

            if (seedHistory && Array.isArray(seedHistory) && currentSessionId && !currentSessionId.startsWith('session-demo')) {
                const seedMessages = seedHistory.map(msg => ({
                    session_id: currentSessionId,
                    role: msg.role === 'assistant' ? 'assistant' : 'user',
                    content: msg.content
                }));
                await supabase.from('messages').insert(seedMessages).catch(() => {});
            }
        }

        let history = [];
        if (currentSessionId && !currentSessionId.startsWith('session-demo')) {
            const { data } = await supabase
                .from('messages')
                .select('role, content')
                .eq('session_id', currentSessionId)
                .order('created_at', { ascending: true });
            history = data || [];
        }

        const userMsgCount = history ? history.filter(m => m.role === 'user').length : 0;

        let aiResponse = '';
        try {
            const activeTopic = topic || 'Hewan Ceria (Al-Hayawaanaat)';
            const activeMode = mode || 'socratic';
            
            let systemPrompt = `Kamu adalah "Kak Ifham", seorang AI Tutor Bahasa Arab yang sangat ramah, hangat, ceria, dan penyabar untuk anak-anak Sekolah Dasar (SD usia 7-12 tahun). Saat ini kamu mendampingi adik SD belajar topik "${activeTopic}".

ATURAN WAJIB & KETAT:
1. GAYA BAHASA: Sangat ceria, bersahabat, menggunakan sapaan ramah ("Jagoan", "Sobat Pintar", "Adik shalih/shalihah").
2. HARAKAT LENGKAP: Setiap kata atau frasa Arab WAJIB memiliki HARAKAT LENGKAP (fathah, kasrah, dhammah, sukun, tasydid, tanwin). Contoh: كِتَابٌ, قِطٌّ, مَدْرَسَةٌ.
3. TRANSLITERASI & ARTI: Selalu sertakan cara baca latin dan arti Indonesianya, contoh: **قِطٌّ** (*Qit-thun = Kucing*).
4. METODE SOCRATIC RAMAH ANAK:
   - Jangan beri ceramah panjang (cukup 2 - 4 kalimat pendek).
   - Jangan langsung beri semua jawaban instan, berikan teka-teki atau petunjuk (clue) lucu dan dekat dengan dunia anak.
   - Puji dengan kata positif Islami: "Mumtaz! ⭐", "Ahsanto! 👏", "Hebat sekali! 🌟".
5. TOMBOL OPSI DI AKHIR PESAN: Selalu akhiri pesanmu dengan 1 baris opsi jawaban cepat dalam kurung siku format:
   [OPSI: Pilihan A | Pilihan B | Pilihan C] agar anak SD mudah mengklik tanpa kesulitan mengetik huruf Arab.`;

            if (activeMode === 'guided') {
                systemPrompt += `\nMode saat ini adalah "Guided Practice" (Latihan Terbimbing langkah demi langkah). Tuntun anak dengan langkah 1-2-3 yang sangat teratur.`;
            } else if (activeMode === 'latihan') {
                systemPrompt += `\nMode saat ini adalah "Latihan Soal & Kuis Teka-Teki". Berikan 1 soal kuis tebakan Arab bergambar/emoji dengan 3 pilihan ganda.`;
            }

            const geminiHistory = [];
            let expectedRole = 'user';
            
            for (const msg of history) {
                const currentRole = msg.role === 'user' ? 'user' : 'model';
                if (geminiHistory.length === 0 && currentRole !== 'user') continue;
                
                if (currentRole === expectedRole) {
                    geminiHistory.push({
                        role: currentRole,
                        parts: [{ text: msg.content }]
                    });
                    expectedRole = expectedRole === 'user' ? 'model' : 'user';
                } else if (geminiHistory.length > 0) {
                    geminiHistory[geminiHistory.length - 1].parts[0].text += "\n" + msg.content;
                }
            }
            
            while (geminiHistory.length > 0 && geminiHistory[geminiHistory.length - 1].role !== 'model') {
                geminiHistory.pop();
            }

            const socraticModel = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                systemInstruction: systemPrompt
            });

            let chat = socraticModel.startChat({
                history: geminiHistory,
                generationConfig: { maxOutputTokens: 600 }
            });

            const result = await chat.sendMessage(message);
            aiResponse = result.response.text();

        } catch (geminiError) {
            console.warn("Gemini API error or quota limit reached, falling back to Socratic Kids Arabic AI:", geminiError.message);
            aiResponse = generateSocraticDummyResponse(message, mode, topic, userMsgCount + 1);
        }

        if (currentSessionId && !currentSessionId.startsWith('session-demo')) {
            await supabase.from('messages').insert([
                { session_id: currentSessionId, role: 'user', content: message },
                { session_id: currentSessionId, role: 'assistant', content: aiResponse }
            ]).catch(() => {});
        }

        res.json({
            response: aiResponse,
            sessionId: currentSessionId || ('session-demo-' + Date.now()),
            messageCount: userMsgCount + 1
        });

    } catch (error) {
        console.error(error);
        const fallbackResponse = generateSocraticDummyResponse(message, mode, topic, 1);
        res.json({
            response: fallbackResponse,
            sessionId: 'session-demo-' + Date.now(),
            messageCount: 1
        });
    }
});

app.get(['/api/chat/history/:sessionId', '/chat/history/:sessionId'], authenticateToken, async (req, res) => {
    try {
        const { data: history, error } = await supabase
            .from('messages')
            .select('*')
            .eq('session_id', req.params.sessionId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'History failed' });
    }
});

app.post(['/api/chat/reset', '/chat/reset'], authenticateToken, async (req, res) => {
    try {
        const { data: newSession, error } = await supabase
            .from('chat_sessions')
            .insert([{ user_id: req.user.id }])
            .select()
            .single();

        if (error) throw error;
        res.json({ sessionId: newSession.id });
    } catch (error) {
        res.status(500).json({ message: 'Reset failed' });
    }
});

// Audio TTS Endpoint
app.get(['/api/tts', '/tts'], async (req, res) => {
    try {
        const text = req.query.q || '';
        const lang = req.query.lang || 'ar';
        if (!text) {
            return res.status(400).send('Missing text parameter');
        }

        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text)}`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            return res.status(response.status).send('TTS upstream error');
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const range = req.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : buffer.length - 1;
            const chunksize = (end - start) + 1;
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${buffer.length}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'audio/mpeg',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(buffer.subarray(start, end + 1));
        } else {
            res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Content-Length': buffer.length,
                'Accept-Ranges': 'bytes',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=86400'
            });
            res.end(buffer);
        }
    } catch (err) {
        console.error('TTS Proxy Error:', err);
        res.status(500).send('TTS generation failed');
    }
});

module.exports = app;
