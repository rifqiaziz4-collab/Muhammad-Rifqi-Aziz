import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client lazily to avoid crashing on startup if key is missing as per guidelines
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!ai) {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }
      ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return ai;
  }

  // API endpoint for Gemini operations
  app.post("/api/gemini/analyze", async (req: Request, res: Response) => {
    try {
      const { action, title, abstract, content, userPrompt } = req.body;
      const client = getGeminiClient();
      
      let prompt = "";
      if (action === "summarize") {
        prompt = `Anda adalah editor jurnal ilmiah senior. Ringkaslah artikel ilmiah berikut dalam bahasa Indonesia yang ringkas, berfokus pada:
1. Latar Belakang & Masalah
2. Metode Penelitian
3. Temuan Utama
4. Kontribusi Penelitian

Judul: ${title}
Abstrak: ${abstract || "N/A"}
Konten: ${content}

Tulis ringkasan akademis yang rapi dan terstruktur dalam Markdown. Jawab mengalir namun padat pesan ilmiah.`;
      } else if (action === "suggest") {
        prompt = `Anda adalah peninjau (reviewer) ahli untuk jurnal ilmiah internasional bereputasi. Berikan umpan balik konstruktif dalam bahasa Indonesia untuk draf/konten artikel ilmiah berikut:
1. Kebaruan Akademis (Academic Novelty).
2. Kekuatan Metodologi.
3. Kualitas Penulisan & Struktur.
4. Rekomendasi Detail & Spesifik untuk Publikasi Terakreditasi (misal SINTA atau Scopus).

Judul: ${title}
Abstrak: ${abstract || "N/A"}
Konten: ${content}

Tulis tinjauan sejawat (peer review) akademis dalam format Markdown yang elegan dan detail.`;
      } else if (action === "chat") {
        prompt = `Anda adalah seorang Professor pembimbing akademis ahli dan asisten AI yang luar biasa yang membantu pembaca memahami artikel ilmiah berikut secara mendalam. Rujuk konten spesifik makalah jika relevan. Jawab dalam bahasa Indonesia.

Judul Makalah: ${title}
Abstrak Makalah: ${abstract || "N/A"}
Konten Makalah: ${content}

Pertanyaan Pembaca: ${userPrompt}

Tulis tanggapan yang santun, informatif, mendalam, dan terstruktur menggunakan Markdown.`;
      } else if (action === "draft") {
        prompt = `Bantu penulis menyusun draft abstrak ilmiah formal (Bahasa Indonesia dan Bahasa Inggris) beserta kata kunci berdasarkan catatan penelitian/draf mentah berikut.

Judul/Topik Draf: ${title}
Pikiran/Konten Draf: ${content}

Format dengan rapi:
1. ABSTRAK (Bahasa Indonesia)
2. ABSTRACT (Bahasa Inggris - miring/italic)
3. Kata Kunci / Keywords

Rancang tulisan bertata bahasa akademis formal berstandar tinggi menggunakan Markdown.`;
      } else if (action === "general") {
        prompt = `Anda adalah asisten penulisan akademis ahli dan profesor metodologi riset. Bantu pengguna menjawab pertanyaan akademik mereka atau mendraf penulisan ilmiah mereka dalam bahasa Indonesia.
Pertanyaan/Petunjuk: ${userPrompt}

Tulis respons Markdown yang sangat rapi, mendidik, terstruktur, disertai contoh-contoh relevan demi kelancaran kegiatan ilmiah pengguna.`;
      } else {
        res.status(400).json({ error: "Aksi tidak dikenal" });
        return;
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error("Kesalahan API Gemini:", error);
      res.status(500).json({ 
        error: error.message || "Terjadi kesalahan internal saat memproses request Anda dengan Gemini.",
        missingKey: !process.env.GEMINI_API_KEY
      });
    }
  });

  // Serve Vite or static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
}

startServer();
