const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
    GRADE_CONFIGS,
    normalizeGrade,
    getGradeConfig,
    buildSystemPrompt,
    generateSocraticFallback
} = require('./curriculum');

const app = express();
const PORT = process.env.PORT || 5000;

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
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save to Supabase
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

        // Check user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Sign JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.full_name },
            process.env.JWT_SECRET,
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

// --- Chat Routes ---

app.post(['/api/chat/message', '/chat/message'], authenticateToken, async (req, res) => {
    const { message, sessionId, seedHistory, mode, topic, grade } = req.body;
    const userId = req.user.id;
    const activeGrade = grade || req.user?.grade || 'SD Kelas 3';
    let currentSessionId = sessionId;

    try {
        // 1. Get or Create Session
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

            // Seed initial history if provided
            if (seedHistory && Array.isArray(seedHistory) && currentSessionId && !currentSessionId.startsWith('session-demo')) {
                const seedMessages = seedHistory.map(msg => ({
                    session_id: currentSessionId,
                    role: msg.role === 'assistant' ? 'assistant' : 'user',
                    content: msg.content
                }));
                await supabase.from('messages').insert(seedMessages).catch(() => {});
            }
        }

        // 2. Fetch History for Context
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

        // 3. Try Gemini API, with automatic Dummy fallback if quota/API fails
        let aiResponse = '';
        try {
            const activeTopic = topic || 'Hewan (الحَيَوَانَات)';
            const activeMode = mode || 'socratic';
            
            // Build tailored system prompt according to the official curriculum for this grade
            const systemPrompt = buildSystemPrompt({
                grade: activeGrade,
                topic: activeTopic,
                mode: activeMode
            });

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
            console.warn("Gemini API error or quota limit reached, falling back to Curriculum Socratic Arabic AI:", geminiError.message);
            aiResponse = generateSocraticFallback({
                message,
                mode,
                topic,
                grade: activeGrade,
                userMsgCount: userMsgCount + 1
            });
        }

        // 5. Save to DB if possible
        if (currentSessionId && !currentSessionId.startsWith('session-demo')) {
            await supabase.from('messages').insert([
                { session_id: currentSessionId, role: 'user', content: message },
                { session_id: currentSessionId, role: 'assistant', content: aiResponse }
            ]).catch(() => {});
        }

        res.json({
            response: aiResponse,
            sessionId: currentSessionId || ('session-demo-' + Date.now()),
            messageCount: userMsgCount + 1,
            grade: activeGrade
        });

    } catch (error) {
        console.error(error);
        const fallbackResponse = generateSocraticFallback({
            message,
            mode,
            topic,
            grade: activeGrade,
            userMsgCount: 1
        });
        res.json({
            response: fallbackResponse,
            sessionId: 'session-demo-' + Date.now(),
            messageCount: 1,
            grade: activeGrade
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

// Audio TTS Endpoint (for pure native Arabic pronunciation without CORS/403 blocks)
app.options(['/api/tts', '/tts'], (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    res.sendStatus(204);
});

app.get(['/api/tts', '/tts'], async (req, res) => {
    try {
        const rawText = req.query.q || '';
        const lang = req.query.lang || 'ar';
        const cleanText = rawText
            .replace(/[؟،!,.:;?"'()\[\]{}*#~_\-+=/]/g, '')
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
            .trim();

        if (!cleanText) {
            return res.status(400).send('Missing text parameter');
        }

        const candidateUrls = [
            `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(cleanText)}`,
            `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(cleanText)}`
        ];

        let upstreamResponse = null;
        for (const url of candidateUrls) {
            try {
                const resp = await fetch(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    }
                });
                if (resp.ok) {
                    upstreamResponse = resp;
                    break;
                }
            } catch (e) {
                // try next
            }
        }

        if (!upstreamResponse || !upstreamResponse.ok) {
            return res.status(502).send('TTS upstream error');
        }

        const arrayBuffer = await upstreamResponse.arrayBuffer();
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

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;

