import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client with proper user-agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint to generate exam questions in Kurdish
app.post('/api/gemini/generate-questions', async (req, res) => {
  try {
    const {
      subject,
      grade,
      topic,
      questionTypes,
      questionCount = 4,
      difficulty = 'مامناوەند', // ئاسان، مامناوەند، سەخت
      language = 'sorani', // Kurdish Sorani
      additionalNotes = '',
    } = req.body;

    const prompt = `
تۆ مامۆستایەکی پسپۆڕ و شارەزایت لە وەزارەتی پەروەردەی حکومەتی هەرێمی کوردستان.
تکایە تاقیکردنەوەیەکی پەروەردەیی بەپێی ستانداردی وەزارەتی پەروەردەی هەرێمی کوردستان بە زمانی کوردی (${language === 'badini' ? 'بادینی / کورمانجی' : 'سۆرانی / کوردیی ناوەڕاست'}) ئامادە بکە.

زانیارییەکانی تاقیکردنەوە:
- بابەت: ${subject || 'گشتی'}
- پۆل: ${grade || 'ناوەندی'}
- تەوەر / بابەتەکان: ${topic || 'گشت وانەکە'}
- ئاستی سەختی: ${difficulty}
- جۆری پرسیارە داواکراوەکان: ${questionTypes?.join('، ') || 'هەڵبژاردن، بۆشایی، راست و هەڵە، پرسیاری وتاری'}
- ژمارەی پرسیاری سەرەکی: نزیکەی ${questionCount} پرسیار
${additionalNotes ? `- تێبینی تایبەت: ${additionalNotes}` : ''}

یاسا گرنگەکان:
١. نووسین بە زمانی کوردیی ڕەوان و ڕێزمانی دروست، بەبێ هەڵەی ڕێنووس بێت.
٢. پیت و هێما کوردییەکان بە دروستی بەکاربهێنە (ێ, ۆ, ڕ, ڵ, ڤ, گ, ژ, چ, پ, ە).
٣. هەر پرسیارێک ژمارەی پرسیار (پ١/، پ٢/، پ٣/ ...) و نمرەی دیاریکراو و بەشەکانی (الف، ب، ج یان ١، ٢، ٣) لەخۆبگرێت.
٤. هەروەها لە کۆتایی پرسیارەکاندا، بەشی "کلیلی وەڵامە نموونەییەکان بۆ مامۆستا" دابنێ تا مامۆستا بتوانێت بەکاری بهێنێت بۆ نمرەدانان.

تکایە وەڵامەکەت بە فۆرماتی JSON بەم شێوازەی خوارەوە بدەرەوە:
{
  "questionsText": "دەقی تەواوی پرسیارەکان بە شێوەیەکی رێکخراو و ئامادەکراو بۆ پەڕەی تاقیکردنەوە...",
  "answerKey": "دەقی وەڵامە نموونەییەکان بە جیاوازی بۆ مامۆستا...",
  "suggestedTime": "١ کاتژمێر و ٣٠ خولەک",
  "suggestedTotalMarks": ٥٠,
  "summary": "پوختەی ئەم تاقیکردنەوەیە و ئامانجەکانی"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = {
        questionsText: responseText,
        answerKey: '',
        suggestedTime: '١ کاتژمێر',
        suggestedTotalMarks: 20,
        summary: 'تاقیکردنەوەی دروستکراو',
      };
    }

    res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'هەڵەیەک ڕوویدا لە دروستکردنی پرسیارەکان بە ژیری دەستکرد',
    });
  }
});

// API endpoint to enhance or reformat existing questions text
app.post('/api/gemini/format-exam', async (req, res) => {
  try {
    const { questionsText, action } = req.body;
    // action: 'clean_grammar' | 'add_marks' | 'convert_to_mcq' | 'generate_answers'

    let instruction = '';
    if (action === 'clean_grammar') {
      instruction = 'تکایە دەقی ئەم پرسیارانەی تاقیکردنەوە لە ڕووی ڕێزمانی کوردی، خاڵبەندی، پیتە کوردییەکان (ڕ، ڵ، ێ، ۆ، وو) و ڕێکخستنی شێواز چاک بکە و بە شێوازێکی زۆر فەرمی دایبڕێژەرەوە بەبێ ئەوەی واتای پرسیارەکان بگۆڕیت.';
    } else if (action === 'add_marks') {
      instruction = 'تکایە بەسەرپەرشتی شێوازی پەروەردە، نمرە بەسەر هەموو پرسیار و بەشەکاندا دابەش بکە لە شێوەی (١٠ نمرە)، (٥ نمرە) و هەروەها دیاری بکە کە کۆی گشتی نمرەکان دەبێتە چەند.';
    } else if (action === 'generate_answers') {
      instruction = 'تکایە وەڵامی نموونەیی ورد و پێوانەیی بۆ هەموو ئەم پرسیارانە بنووسە بۆ ئەوەی مامۆستا وەک کلیل لەکاتی نمرەداناندا سودی لێ ببینێت.';
    } else {
      instruction = 'تکایە دەقی پرسیارەکان رێکبخە و جوانکاری بۆ بکە.';
    }

    const prompt = `
${instruction}

دەقی پرسیارەکان:
"""
${questionsText}
"""

تکایە تەنها ئەنجامە ڕێکخراوەکە بنووسەوە بێ قسەی زیادە.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ success: true, formattedText: response.text || '' });
  } catch (error: any) {
    console.error('Error formatting exam:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'هەڵەیەک ڕوویدا لە ڕێکخستنی دەق',
    });
  }
});

// Setup Vite in development or serve static in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Exam Paper Generator server running on http://localhost:${port}`);
  });
}

startServer();
