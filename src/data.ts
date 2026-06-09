import { Article } from "./types";

export const initialArticles: Article[] = [
  {
    id: "journal-1",
    type: "journal",
    title: "Analisis Sentimen Publik Berbasis Pembelajaran Mesin Terhadap Keamanan Data Informasi Pribadi di Indonesia",
    author: "Muhammad Rifqi Aziz",
    affiliation: "Departemen Ilmu Komputer & Rekayasa Perangkat Lunak, Universitas Sains Yogyakarta",
    publishDate: "2026-05-12",
    volume: "Vol. 4, No. 1 (Mei 22, 2026)",
    doi: "10.31219/mra-journal.2026.1.1",
    category: "Kecerdasan Buatan",
    tags: ["Machine Learning", "NLP", "Keamanan Data", "Indonesia"],
    viewCount: 1245,
    citationCount: 14,
    readingTime: "12 Menit",
    abstract: "Penelitian ini menganalisis opini dan sentimen masyarakat Indonesia mengenai isu keamanan data informasi pribadi yang marak terjadi belakangan ini. Dengan memanfaatkan algoritma pembelajaran mesin seperti Naive Bayes dan Support Vector Machine (SVM), penelitian berhasil mengekstrak dan mengklasifikasikan 10.000 data opini dari media sosial ke dalam kategori positif, netral, dan negatif. Hasil penelitian menunjukkan sentimen negatif mendominasi sebesar 68,4%, didorong oleh kekhawatiran kebocoran data (data breaches) dan kurangnya transparansi tata kelola data. Algoritma SVM menghasilkan akurasi terbaik sebesar 89.2% dalam mendeteksi polaritas sentimen spesifik ini, memberikan wawasan berharga bagi pembuat kebijakan publik untuk menyusun strategi perlindungan data yang lebih andal di masa depan.",
    abstractEn: "This study analyzes the opinion and sentiment of the Indonesian public regarding the recent rise of personal data security issues. By utilizing machine learning algorithms such as Naive Bayes and Support Vector Machine (SVM), this research successfully extracted and classified 10,000 opinion data points from social media into positive, neutral, and negative categories. The results show that negative sentiment dominates at 68.4%, driven by fears of data breaches and lack of transparency in data governance. The SVM algorithm produced the best accuracy of 89.2% in detecting this specific sentiment polarity, providing valuable insights for public policymakers to draft more reliable data protection strategies in the future.",
    keywords: ["Sentiment Analysis", "SVM", "Data Protection", "Natural Language Processing"],
    sections: [
      {
        heading: "1. Pendahuluan",
        content: "Di era transformasi digital yang masif, data pribadi telah menjelma menjadi komoditas paling berharga sekaligus paling rentan. Kasus kebocoran data berskala nasional yang silih berganti di Indonesia memicu gejolak reaksi keras di tengah masyarakat. Hal ini menimbulkan pertanyaan fundamental mengenai sejauh mana rasa percaya publik terhadap infrastruktur keamanan siber nasional dan bagaimana sentimen kolektif ini memengaruhi adopsi teknologi finansial serta administrasi e-government. Penelitian ini bertujuan mengukur secara ilmiah pergeseran opini publik tersebut melalui analisis komputasional berbasis Natural Language Processing (NLP)."
      },
      {
        heading: "2. Metodologi Penelitian",
        content: "Metode penelitian yang diusulkan terdiri dari lima tahap utama: (1) Akuisisi Data melalui teknik crawling media sosial menggunakan kata kunci seperti 'kebocoran data', 'data pribadi', dan 'keamanan siber'; (2) Pra-pemrosesan data yang mencakup case folding, filtering token, stemming bahasa Indonesia menggunakan pustaka Sastrawi, dan penghapusan stop words; (3) Ekstraksi Fitur menggunakan pembobotan TF-IDF (Term Frequency-Inverse Document Frequency); (4) Pelatihan model klasifikasi menggunakan algoritma klasifikasi berbasis statistik (Naive Bayes) dan batas margin maksimal (Support Vector Machine); serta (5) Evaluasi Model menggunakan metrik matriks konfusi (Accuracy, Precision, Recall, dan F1-Score)."
      },
      {
        heading: "3. Hasil dan Pembahasan",
        content: "Distribusi sentimen publik menunjukkan ketidakpuasan yang signifikan. Dari total dataset yang berhasil dibersihkan, sebanyak 6.840 tweet berkategori negatif, 2.050 netral, dan hanya 1.110 tweet berkategori positif. Analisis kata kunci (Word Cloud) pada sentimen negatif memperlihatkan dominasi frekuensi tinggi pada kata-kata seperti 'bocor', 'rugi', 'sanksi', 'aman', dan 'pemerintah'. Pada pengujian akurasi, metode Support Vector Machine dengan kernel radial basis function (RBF) mengungguli Naive Bayes tradisional dengan nilai akurasi 89,2% berbanding 81,5%. Hal ini menunjukkan bahwa pemisahan hyperplane non-linear sangat efektif dalam mereduksi noise pada percakapan bermakna ganda di media sosial Indonesia."
      },
      {
        heading: "4. Kesimpulan",
        content: "Berdasarkan hasil analisis komputasi sentimen, kecemasan publik terkait perlindungan data pribadi di Indonesia berada pada tingkat kritis. Dominasi sentimen negatif sebesar 68,4% mencerminkan urgensi penegakan hukum yang konkret sesuai dengan UU Perlindungan Data Pribadi (UU PDP). Pemanfaatan algoritma SVM terbukti andal dalam memetakan dinamika gejolak publik secara akurat dan real-time. Diharapkan model ini dapat digunakan oleh lembaga pengawas untuk memantau indeks kepercayaan publik secara berkala."
      }
    ],
    references: [
      "Aziz, M. R. (2025). Pengantar Pemrosesan Bahasa Alami untuk Analisis Sosial. Yogyakarta: Pers Akademika.",
      "Pratama, A., & Lestari, S. (2024). Evaluasi Kritis Hukum Perlindungan Data Pribadi di Asia Tenggara. Jurnal Hukum Siber, 11(2), 143-156.",
      "Cortes, C., & Vapnik, V. (1995). Support-Vector Networks. Machine Learning, 20(3), 273-297."
    ]
  },
  {
    id: "journal-2",
    type: "journal",
    title: "Optimasi Arsitektur Jamstack Terdesentralisasi dengan Edge Computing untuk Aksesibilitas Jurnal Ilmiah Kecepatan Tinggi",
    author: "Muhammad Rifqi Aziz",
    affiliation: "Departemen Ilmu Komputer & Rekayasa Perangkat Lunak, Universitas Sains Yogyakarta",
    publishDate: "2026-04-05",
    volume: "Vol. 3, No. 2 (April 5, 2026)",
    doi: "10.31219/mra-journal.2026.1.2",
    category: "Rekayasa Web",
    tags: ["Jamstack", "Edge Computing", "Web Performance", "React"],
    viewCount: 912,
    citationCount: 8,
    readingTime: "10 Menit",
    abstract: "Infrastruktur distribusi konten jurnal penelitian tradisional sering kali terhambat oleh keterbatasan server terpusat yang mengakibatkan waktu muat (loading time) yang lambat bagi peneliti di daerah terpencil. Penelitian ini menawarkan solusi berupa optimasi arsitektur pengembangan web berbasis Jamstack (JavaScript, APIs, dan Markup) yang dipadukan dengan Edge Computing. Dengan mendistribusikan static pre-rendered pages ke CDN global dan mengeksekusi fungsi serverless dinamis di node edge terdekat dari pengguna, kami berhasil memangkas First Contentful Paint (FCP) hingga 65% dan Time to Interactive (TTI) di bawah 1,2 detik secara konsisten global. Model ini menjamin keandalan akses artikel ilmiah tanpa memerlukan pemeliharaan server database monolitik yang mahal.",
    abstractEn: "Traditional journal content distribution infrastructures are often hampered by centralized server limitations resulting in slow loading times for researchers in remote areas. This research offers a solution in the form of optimization of Jamstack-based web development architecture combined with Edge Computing. By distributing static pre-rendered pages across global CDNs and executing dynamic serverless functions at the nearest edge nodes, we successfully cut First Contentful Paint (FCP) by 65% and maintained Time to Interactive (TTI) under 1.2 seconds globally. This model ensures reliable access to scientific articles without requiring the maintenance of costly, monolithic database servers.",
    keywords: ["Jamstack", "Edge Computing", "Serverless", "CDN", "Web Optimization"],
    sections: [
      {
        heading: "1. Pendahuluan",
        content: "Aksesibilitas informasi riset adalah pilar kemandirian akademis. Namun, sebagian besar portal jurnal institusional masih mengandalkan Content Management System (CMS) tradisional berbasis database SQL monolitik (seperti WordPress atau OJS standar) yang rentan terhadap beban tinggi (traffic spikes) dan lambat jika diakses dari daerah pelosok dengan koneksi internet terbatas. Jamstack menjanjikan alternatif mutakhir dengan memisahkan total lapisan presentasi (frontend) dari database/logika backend."
      },
      {
        heading: "2. Desain Sistem dan Spesifikasi",
        content: "Kami merancang portal repositori jurnal terdistribusi menggunakan React, Vite, dan Tailwind CSS sebagai generator file statis. Seluruh halaman artikel di-render pada saat proses build (static site generation) dan dideploy ke Cloud Run dan edge network global. Logika dinamis seperti pencarian teks penuh (full-text search) dan sistem asisten AI berbasis LLM didelegasikan ke fungsi serverless (API routes) yang dieksekusi di edge node wilayah Asia Tenggara."
      },
      {
        heading: "3. Hasil Analisis Performa",
        content: "Pengujian dilakukan dengan menggunakan Google Lighthouse dan pengujian stres (load testing). FCP berkurang drastis dari rata-rata 3,4 detik menjadi hanya 0,9 detik. Selain itu, keandalan server berada pada level 99,99% karena server statis tahan terhadap serangan distributed denial of service (DDoS) secara inheren. Biaya operasional server publikasi terpangkas secara eksponensial hingga hampir 90% karena ditiadakannya idle compute servers."
      },
      {
        heading: "4. Kesimpulan",
        content: "Penerapan arsitektur Jamstack terdesentralisasi dengan dukungan edge server merupakan model masa depan penyebaran dokumen publikasi riset. Kecepatan transfer data yang tinggi, keamanan lapis baja yang terpadu, dan biaya operasional yang sangat ekonomis menjadikannya solusi andal untuk mendemokratisasi akses ilmu pengetahuan di seluruh nusantara."
      }
    ],
    references: [
      "Aziz, M. R. (2026). Panduan Membangun Web Skala Global Berbasis Serverless. Yogyakarta: Penerbit TechMedia.",
      "Biemer, F. (2023). Architectural Patterns of Modern Jamstack Formulations. Journal of Web Engineering, 22(1), 89-112.",
      "Netlify State of Jamstack Report (2024). Web Architecture Decoupling Standards. Technical whitepaper."
    ]
  },
  {
    id: "journal-3",
    type: "journal",
    title: "Deteksi Dini Degradasi Hutan Tropis Berbasi Citra Satelit Sentinel-2 Menggunakan Algoritma Kombinasi CNN dan Random Forest",
    author: "Muhammad Rifqi Aziz",
    affiliation: "Departemen Ilmu Komputer & Rekayasa Perangkat Lunak, Universitas Sains Yogyakarta",
    publishDate: "2026-03-18",
    volume: "Vol. 3, No. 1 (Maret 18, 2026)",
    doi: "10.31219/mra-journal.2026.1.3",
    category: "Ilmu Lingkungan / Geospasial",
    tags: ["Remote Sensing", "CNN", "Random Forest", "Konservasi Hutan"],
    viewCount: 1530,
    citationCount: 22,
    readingTime: "15 Menit",
    abstract: "Degradasi dan deforestasi hutan tropis di Kalimantan menyumbang emisi karbon global secara masif. Pemantauan manual di area seluas jutaan hektar tidaklah realistis. Penelitian ini menguji model hibrida Convolutional Neural Network (CNN) untuk ekstraksi fitur spasial tekstur hutan dan klasifikasi Random Forest (RF) untuk membedakan antara penutup lahan hutan primer, hutan sekunder, kelapa sawit, dan lahan gundul dari citra optik multispektral Sentinel-2. Model gabungan ini mencapai Overall Accuracy (OA) sebesar 94,1% dengan laju kesalahan klasifikasi (false alarms) yang sangat rendah. Penemuan ini membantu otoritas kehutanan melakukan intervensi dini terhadap pembalakan liar sebelum kerusakan meluas.",
    abstractEn: "Tropical forest degradation and deforestation in Kalimantan contribute massively to global carbon emissions. Manual monitoring across millions of hectares is unrealistic. This study evaluates a hybrid model of Convolutional Neural Network (CNN) for spatial forest texture feature extraction and Random Forest (RF) classification to distinguish between primary forest, secondary forest, oil palm, and bare land covers from Sentinel-2 multispectral optical imagery. This hybrid model achieves an Overall Accuracy (OA) of 94.1% with very low false alarm rates. This discovery assists forest authorities in initiating early interventions against illegal logging before damage propagates.",
    keywords: ["Remote Sensing", "Environmental Science", "Deep Learning", "Random Forest", "Sentinel-2"],
    sections: [
      {
        heading: "1. Pendahuluan",
        content: "Hutan hujan tropis Kalimantan sering disebut sebagai salah satu paru-paru dunia. Namun, aktivitas alih fungsi lahan ilegal yang tidak terkontrol mengancam keanekaragaman hayati dan stabilitas iklim mikrokosmos setempat. Penerapan teknologi penginderaan jauh (satellite remote sensing) beresolusi temporal tinggi memberikan secercah harapan bagi tata kelola lingkungan yang presisi."
      },
      {
        heading: "2. Metodologi Data dan Pemodelan",
        content: "Kami memproses 35 ubin citra Sentinel-2 bebas awan rilis tahun 2025-2026 yang menangkap wilayah Kalimantan Timur dan Tengah. Citra dipotong menjadi potongan kecil (blocks) berukuran 64x64 piksel. Sebagai langkah awal, CNN 1D mengekstrak tanda spektral (spectral signature), disusul CNN 2D untuk mendeteksi kontur tekstur geospasial. Pola fitur yang diekstrak kemudian diumpankan pada pengklasifikasi ensemble Random Forest dengan 500 pohon keputusan (decision trees)."
      },
      {
        heading: "3. Evaluasi Hasil Klasifikasi",
        content: "Model hibrida CNN-RF berhasil memetakan kawasan perkebunan monokultur kelapa sawit berskala besar dengan indeks presisi mencapai 96,2%. Yang paling mengesankan, model ini sanggup membedakan wilayah bekas tebangan (degraded forest) dengan hutan sekunder yang tumbuh kembali, suatu tugas yang amat sulit bagi algoritma klasifikasi piksel tunggal tradisional. Keuntungan utama dari pendekatan hibrida ini adalah efisiensi waktu komputasi yang 4 kali lipat lebih tangguh dibanding model CNN murni (End-to-End Deep Learning)."
      },
      {
        heading: "4. Kesimpulan",
        content: "Integrasi kecerdasan buatan berbasis spasial-spektral memicu lompatan revolusioner dalam upaya penyelamatan hutan tropis regional. Implementasi model terautomasi ini diharapkan dapat menjadi fondasi terbangunnya dasbor pemantauan deforestasi nasional yang terbuka, transparan, dan responsif."
      }
    ],
    references: [
      "Aziz, M. R. (2024). Analisis Big Data Geospasial untuk Pembangunan Berkelanjutan. Jakarta: Lembaga Kajian Bumi.",
      "Breiman, L. (2001). Random Forests. Machine Learning, 45(1), 5-32.",
      "Gorelick, N. et al. (2017). Google Earth Engine: Planetary-scale geospatial analysis for everyone. Remote Sensing of Environment, 202, 18-27."
    ]
  },
  {
    id: "blog-1",
    type: "blog",
    title: "Dibalik Layar Penelitian AI: Mengapa Menulis Jurnal Akademis Melatih Logika dan Berpikir Kritis Kita",
    author: "Muhammad Rifqi Aziz",
    publishDate: "2026-06-02",
    category: "Opini & Gaya Hidup",
    tags: ["Produktif", "Writing", "Critical Thinking", "Riset"],
    viewCount: 420,
    readingTime: "5 Menit",
    sections: [
      {
        heading: "Fokus Publikasi vs. Fokus Esensi",
        content: "Banyak mahasiswa atau pemula memandang bahwa menulis artikel ilmiah hanyalah prasyarat administratif kelulusan. Awalnya, saya pun berpikir demikian. Namun setelah menulis beberapa publikasi, esensinya jauh melebihi gelar akademis: ini adalah latihan berpikir kritis yang luar biasa."
      },
      {
        heading: "Anatomi Berpikir Terstruktur",
        content: "Dalam kehidupan sehari-hari, kepala kita dipenuhi hipotesis tanpa bukti, prasangka bias, dan argumentasi subjektif. Jurnal ilmiah menolak itu semua. Jurnal memaksa kita bertransisi dari klaim sembarang ('Metode saya sangat cepat!') menjadi pernyataan empiris terukur ('Sistem memotong latency sebesar 65% dengan p-value di bawah 0.05').\n\nPola penulisan jurnal menuntut disiplin logis yang ketat:\n1. Masalah: Mengapa dunia butuh solusi ini?\n2. Metodologi: Bisakah orang lain mengulangi eksperimen ini dengan hasil yang sama?\n3. Hasil: Apa fakta objektif yang ditemukan?\n4. Refleksi: Di mana celah keterbatasan riset kita?"
      },
      {
        heading: "Perjalanan Terbuka Menuju Kebenaran",
        content: "Proses peer-review (tinjauan sejawat) sering kali terasa menyakitkan bagi ego kita ketika peninjau anonim menilai draf kita cacat logika. Namun, di sanalah letak indahnya. Menulis blog akademis seperti ini melatih ketatanegaraan intelektual kita untuk rendah hati menerima kritik demi melahirkan sains yang murni dan bermanfaat bagi kemanusiaan."
      }
    ],
    references: [
      "Aziz, M. R. (2026). Catatan Reflektif Peneliti Muda Indonesia. Blog personal."
    ]
  },
  {
    id: "blog-2",
    type: "blog",
    title: "Panduan Bijak Menggunakan Generative AI (seperti Gemini) untuk Membantu Menulis Tugas Akhir dan Riset Ilmiah",
    author: "Muhammad Rifqi Aziz",
    publishDate: "2026-05-28",
    category: "Pendidikan & Teknologi",
    tags: ["Generative AI", "Gemini", "Etika Riset", "Tips Menulis"],
    viewCount: 680,
    readingTime: "6 Menit",
    sections: [
      {
        heading: "Teknologi Sebagai Sahabat, Bukan Joki",
        content: "Ledakan kecerdasan buatan menyulut perdebatan sengit di lingkungan universitas. Banyak dosen melarang keras AI, sementara mahasiswa memakainya diam-diam untuk me-generate dokumen instan. Menurut saya, melarang penggunaan AI seutuhnya adalah langkah keliru, namun membiarkannya menulis tugas akhir sepenuhnya (plagiarisme AI) adalah tindakan yang mencederai etika keilmuan."
      },
      {
        heading: "Cara Bijak Memanfaatkan AI dalam Siklus Riset",
        content: "AI generatif sangat mahir jika diposisikan sebagai asisten bertukar pikiran (brainstorming partner) yang cerdas. Berikut taktik etis pemanfaatannya:\n\n1. **Menghilangkan Writer's Block**: Alih-alih menyuruh AI menulis bab analisis, mintalah garis besar (outline) pemikiran. Contoh prompt: 'Tolong buatkan struktur bab pembahasan untuk analisis dampak ekonomi digital.'\n2. **Melatih Memadatkan Kalimat**: AI sangat mumpuni dalam merangkum abstrak yang bertele-tele agar sesuai jumlah kata maksimal dari penerbit jurnal ilmiah.\n3. **Mengecek Tata Bahasa & Format**: Anda bisa memanfaatkannya sebagai proofreader handal untuk mengecek koherensi tulisan bahasa Indonesia atau kebenaran Grammar bahasa Inggris Anda."
      },
      {
        heading: "Larangan Keras dalam Menyalahgunakan AI",
        content: "Ingat batas garis merah ini: Jangan pernah menyuruh AI berasumsi menyemburkan data hasil kuesioner fiktif atau merangkum kesimpulan dari eksperimen yang sebenarnya tidak pernah Anda jalankan di laboratorium! AI memiliki kecenderungan berhalusinasi (data fabrication), dan pemalsuan data riset adalah pelanggaran akademik tertinggi. Gunakan hati nurani ilmiah Anda."
      }
    ],
    references: [
      "Komite Kode Etik Universitas Nasional (2025). Pedoman Pemanfaatan Teknologi Kecerdasan Buatan dalam Karya Ilmiah."
    ]
  }
];

export const academicCategories = [
  "Semua Kategori",
  "Kecerdasan Buatan",
  "Rekayasa Web",
  "Ilmu Lingkungan / Geospasial",
  "Pendidikan & Teknologi",
  "Opini & Gaya Hidup"
];
