export interface DzikrItem {
  id: number;
  arabic: string;
  latin?: string;
  translation: string;
  source?: string;
  count: number;
  category: string;
  description?: string;
  note?: string;
}

export const dzikrData: DzikrItem[] = [
  {
    id: 1,
    arabic:
      "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\nاللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    latin: "",
    translation:
      "Allah, tidak ada ilah (yang berhak disembah) melainkan Dia, yang hidup kekal lagi terus menerus mengurus (makhluk-Nya). Dia tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafa'at di sisi-Nya tanpa izin-Nya. Dia mengetahui apa-apa yang di hadapan mereka dan di belakang mereka. Mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dia tidak merasa berat memelihara keduanya. Dan Dia Maha Tinggi lagi Maha besar.",
    source: "Q.S. Al-Baqarah: 255",
    count: 1,
    category: "Membaca Ayat Kursi",
    description:
      "Faedah: Siapa yang membacanya ketika petang, maka ia akan dilindungi (oleh Allah dari berbagai gangguan) hingga pagi. Siapa yang membacanya ketika pagi, maka ia akan dilindungi hingga petang. [HR. Al Hakim]\nHikmah: Ayat Kursi adalah salah satu ayat yang paling agung dalam Al-Qur'an. Membacanya memberikan perlindungan dari gangguan setan dan kejahatan lainnya. Ayat ini juga mengingatkan kita akan kebesaran dan kekuasaan Allah yang tidak terbatas.",
    note: "Dibaca setelah shalat fardhu dan sebelum tidur.",
  },
  {
    id: 2,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\nقُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
    latin: "",
    translation:
      "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Dialah Allah, Yang Maha Esa. Allah adalah ilah yang bergantung kepada-Nya segala urusan. Dia tidak beranak dan tiada pula diperanakkan, dan tidak ada seorang pun yang setara dengan Dia.",
    source: "Q.S. Al Ikhlas: 1-4",
    count: 3,
    category: "Membaca Surah Al-Ikhlas",
    description:
      "Faedah: Siapa yang mengucapkannya masing-masing tiga kali ketika pagi dan petang, maka segala sesuatu akan dicukupkan untuknya. [HR. Abu Daud no. 5082, Tirmidzi no. 3575. Al Hafizh Abu Thohir mengatakan bahwa sanad hadits ini hasan]\nHikmah: Surah Al-Ikhlas mengandung penjelasan tentang tauhid (keesaan Allah) yang merupakan dasar keimanan. Membacanya tiga kali di pagi dan petang hari memberikan kecukupan dalam segala urusan.",
  },
  {
    id: 3,
    arabic:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
    latin: "",
    translation:
      "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Aku berlindung kepada Rabb yang menguasai Shubuh, dari kejahatan makhluk-Nya, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan-kejahatan wanita tukang sihir yang menghembus pada buhul-buhul, dan dari kejahatan orang yang dengki apabila ia dengki.",
    source: "Q.S. Al Falaq: 1-5",
    count: 3,
    category: "Membaca Surah Al-Falaq",
    description:
      "Faedah: Siapa yang mengucapkannya masing-masing tiga kali ketika pagi dan petang, maka segala sesuatu akan dicukupkan untuknya. [HR. Abu Daud no. 5082, Tirmidzi no. 3575. Al Hafizh Abu Thohir mengatakan bahwa sanad hadits ini hasan]\nHikmah: Surah Al-Falaq mengajarkan kita untuk berlindung kepada Allah dari berbagai kejahatan, termasuk kejahatan makhluk-Nya, kejahatan malam, sihir, dan kedengkian. Membacanya memberikan perlindungan dari bahaya-bahaya tersebut.",
  },
  {
    id: 4,
    arabic:
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ",
    latin: "",
    translation:
      "Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang. Katakanlah: Aku berlindung kepada Rabb manusia. Raja manusia. Sembahan manusia, dari kejahatan (bisikan) syaitan yang biasa bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari jin dan manusia.",
    source: "Q.S. An Naas: 1-6",
    count: 3,
    category: "Membaca Surah An-Nas",
    description:
      "Faedah: Siapa yang mengucapkannya masing-masing tiga kali ketika pagi dan petang, maka segala sesuatu akan dicukupkan untuknya. [HR. Abu Daud no. 5082, Tirmidzi no. 3575. Al Hafizh Abu Thohir mengatakan bahwa sanad hadits ini hasan]\nHikmah: Surah An-Nas mengajarkan kita untuk berlindung kepada Allah dari godaan dan bisikan setan yang tersembunyi, baik dari jin maupun manusia. Membacanya memberikan perlindungan dari godaan-godaan tersebut yang dapat mengganggu hati dan pikiran kita.",
  },
  {
    id: 5,
    arabic:
      "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِيْ هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوْذُ بِكَ مِنْ شَرِّ مَا فِيْ هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوْذُ بِكَ مِنَ الْكَسَلِ وَسُوْءِ الْكِبَرِ، رَبِّ أَعُوْذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
    latin:
      "Ash-bahnaa wa ash-bahal mulku lillah walhamdulillah, laa ilaha illallah wahdahu laa syarika lah, lahul mulku walahul hamdu wa huwa 'ala kulli syai-in qodir. Robbi as-aluka khoiro maa fii hadzal yaum wa khoiro maa ba'dahu, wa a'udzu bika min syarri maa fii hadzal yaum wa syarri maa ba'dahu. Robbi a'udzu bika minal kasali wa su-il kibar. Robbi a'udzu bika min 'adzabin fin naari wa 'adzabin fil qobri.",
    translation:
      "Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada ilah (yang berhak disembah) kecuali Allah semata, tiada sekutu bagi-Nya. Milik Allah kerajaan dan bagi-Nya pujian. Dia-lah Yang Mahakuasa atas segala sesuatu. Wahai Rabbku, aku mohon kepada-Mu kebaikan di hari ini dan kebaikan sesudahnya. Aku berlindung kepada-Mu dari kejahatan hari ini dan kejahatan sesudahnya. Wahai Rabbku, aku berlindung kepada-Mu dari kemalasan dan kejelekan di hari tua. Wahai Rabbku, aku berlindung kepada-Mu dari siksaan di neraka dan siksaan di alam kubur.",
    source: "HR. Muslim no. 2723",
    count: 1,
    category: "Dzikir #1",
    description:
      "Faedah: Meminta pada Allah kebaikan di hari ini dan kebaikan sesudahnya, juga agar terhindar dari kejelekan di hari ini dan kejelekan sesudahnya. Di dalamnya berisi pula permintaan agar terhindar dari rasa malas padahal mampu untuk beramal, juga agar terhindar dari kejelekan di masa tua. Di dalamnya juga berisi permintaan agar terselamatkan dari siksa kubur dan siksa neraka yang merupakan siksa terberat di hari kiamat kelak.\nHikmah: Dzikir ini mengajarkan kita untuk memulai hari dengan mengakui kekuasaan Allah dan memohon perlindungan-Nya. Ini mengingatkan kita bahwa segala sesuatu adalah milik Allah dan kita bergantung pada-Nya untuk keselamatan dan kebaikan dalam hidup kita.",
    note: "Untuk dzikir petang, dibaca: أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ... (Amsayna wa amsal mulku lillah...)",
  },
  {
    id: 6,
    arabic: "اَللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوْتُ وَإِلَيْكَ النُّشُوْرُ",
    latin: "Allahumma bika ash-bahnaa wa bika amsaynaa wa bika nahyaa wa bika namuutu wa ilaikan nusyuur.",
    translation:
      "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu petang. Dengan rahmat dan pertolongan-Mu kami hidup dan dengan kehendak-Mu kami mati. Dan kepada-Mu kebangkitan (bagi semua makhluk).",
    source: "HR. Tirmidzi no. 3391 dan Abu Daud no. 5068",
    count: 1,
    category: "Dzikir #2",
    description:
      "Faedah: Dengan dzikir ini, kita telah menyerahkan segala urusan kepada Allah di pagi hari, di petang hari, ketika hidup dan ketika mati.\nHikmah: Dzikir ini mengingatkan kita bahwa Allah adalah sumber kehidupan dan kematian. Kita bergantung pada-Nya dalam setiap aspek kehidupan kita, dari bangun tidur hingga kembali tidur, dan bahkan dalam kematian dan kebangkitan kita.",
    note: "Untuk dzikir petang, dibaca: اَللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوْتُ وَإِلَيْكَ الْمَصِيْرُ (Allahumma bika amsaynaa wa bika ash-bahnaa wa bika nahyaa wa bika namuutu wa ilaikal mashiir).",
  },
  {
    id: 7,
    arabic:
      "اَللَّهُمَّ أَنْتَ رَبِّيْ لاَ إِلَـهَ إِلاَّ أَنْتَ، خَلَقْتَنِيْ وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوْبَ إِلاَّ أَنْتَ",
    latin:
      "Allahumma anta robbii laa ilaha illa anta, kholaqtanii wa anaa 'abduka wa anaa 'ala 'ahdika wa wa'dika mas-tatho'tu. A'udzu bika min syarri maa shona'tu. Abu-u laka bi ni'matika 'alayya wa abu-u bi dzambii. Fagh-firlii fainnahu laa yagh-firudz dzunuuba illa anta.",
    translation:
      "Ya Allah, Engkau adalah Rabbku, tidak ada ilah yang berhak disembah kecuali Engkau, Engkaulah yang menciptakanku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku pada-Mu (yaitu aku akan mentauhidkan-Mu) semampuku dan aku yakin akan janji-Mu (berupa surga untukku). Aku berlindung kepadaMu dari kejelekan yang kuperbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku. Oleh karena itu, ampunilah aku. Sesungguhnya tiada yang mengampuni dosa kecuali Engkau.",
    source: "HR. Bukhari no. 6306",
    count: 1,
    category: "Sayyidul Istighfar",
    description:
      "Faedah: Barangsiapa mengucapkan dzikir ini di pagi hari dengan penuh keyakinan, lalu ia meninggal pada hari tersebut sebelum petang hari, maka ia termasuk penghuni surga. Barangsiapa yang mengucapkannya di petang hari dengan penuh keyakinan, lalu ia meninggal sebelum pagi, maka ia termasuk penghuni surga.\nHikmah: Sayyidul Istighfar (penghulu istighfar) adalah doa pengampunan terbaik yang mengandung pengakuan akan ketuhanan Allah, pengakuan diri sebagai hamba-Nya, pengakuan akan dosa-dosa, dan permohonan ampunan. Doa ini mengajarkan kita untuk selalu introspeksi dan memohon ampunan kepada Allah.",
  },
  {
    id: 8,
    arabic:
      "اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَاْلآخِرَةِ، اَللَّهُمَّ إِنِّيْ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِيْنِيْ وَدُنْيَايَ وَأَهْلِيْ وَمَالِيْ اللَّهُمَّ اسْتُرْ عَوْرَاتِى وَآمِنْ رَوْعَاتِى. اَللَّهُمَّ احْفَظْنِيْ مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِيْ، وَعَنْ يَمِيْنِيْ وَعَنْ شِمَالِيْ، وَمِنْ فَوْقِيْ، وَأَعُوْذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِيْ",
    latin:
      "Allahumma innii as-alukal 'afwa wal 'aafiyah fid dunyaa wal aakhiroh. Allahumma innii as-alukal 'afwa wal 'aafiyah fii diinii wa dun-yaaya wa ahlii wa maalii. Allahumas-tur 'awrootii wa aamin row'aatii. Allahummahfazh-nii mim bayni yadayya wa min kholfii wa 'an yamiinii wa 'an syimaalii wa min fawqii wa a'udzu bi 'azhomatik an ughtaala min tahtii.",
    translation:
      "Ya Allah, sesungguhnya aku memohon kebajikan dan keselamatan di dunia dan akhirat. Ya Allah, sesungguhnya aku memohon kebajikan dan keselamatan dalam agama, dunia, keluarga dan hartaku. Ya Allah, tutupilah auratku (aib dan sesuatu yang tidak layak dilihat orang) dan tenteramkanlah aku dari rasa takut. Ya Allah, peliharalah aku dari muka, belakang, kanan, kiri dan atasku. Aku berlindung dengan kebesaran-Mu, agar aku tidak disambar dari bawahku (oleh ular atau tenggelam dalam bumi dan lain-lain yang membuat aku jatuh).",
    source: "HR. Abu Daud no. 5074 dan Ibnu Majah no. 3871",
    count: 1,
    category: "Dzikir #3",
    description:
      "Faedah: Rasulullah shallallahu 'alaihi wa sallam tidaklah pernah meninggalkan do'a ini di pagi dan petang hari. Di dalamnya berisi perlindungan dan keselamatan pada agama, dunia, keluarga dan harta dari berbagai macam gangguan yang datang dari berbagai arah.\nHikmah: Dzikir ini mengajarkan kita untuk memohon perlindungan Allah dari segala arah dan aspek kehidupan. Ini mengingatkan kita bahwa kita membutuhkan perlindungan Allah dalam setiap saat dan dari segala arah.",
  },
  {
    id: 9,
    arabic:
      "اَللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَاْلأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيْكَهُ، أَشْهَدُ أَنْ لاَ إِلَـهَ إِلاَّ أَنْتَ، أَعُوْذُ بِكَ مِنْ شَرِّ نَفْسِيْ، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِيْ سُوْءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ",
    latin:
      "Allahumma 'aalimal ghoybi wasy syahaadah faathiros samaawaati wal ardh. Robba kulli syai-in wa maliikah. Asyhadu alla ilaha illa anta. A'udzu bika min syarri nafsii wa min syarrisy syaythooni wa syirkihi, wa an aqtarifa 'alaa nafsii suu-an aw ajurrohu ilaa muslim.",
    translation:
      "Ya Allah, Yang Maha Mengetahui yang ghaib dan yang nyata, wahai Rabb pencipta langit dan bumi, Rabb segala sesuatu dan yang merajainya. Aku bersaksi bahwa tidak ada ilah yang berhak disembah kecuali Engkau. Aku berlindung kepadaMu dari kejahatan diriku, setan dan balatentaranya (godaan untuk berbuat syirik pada Allah), dan aku (berlindung kepada-Mu) dari berbuat kejelekan terhadap diriku atau menyeretnya kepada seorang muslim.",
    source: "HR. Tirmidzi no. 3392 dan Abu Daud no. 5067",
    count: 1,
    category: "Dzikir #4",
    description:
      "Faedah: Do'a ini diajarkan oleh Rasulullah shallallahu 'alaihi wa sallam pada Abu Bakar Ash Shiddiq radhiyallahu 'anhu untuk dibaca pada pagi, petang dan saat beranjak tidur.\nHikmah: Dzikir ini mengajarkan kita untuk mengakui keesaan Allah dan memohon perlindungan-Nya dari kejahatan diri sendiri dan setan. Ini mengingatkan kita bahwa musuh terbesar kita bisa jadi adalah diri kita sendiri dan godaan setan.",
  },
  {
    id: 10,
    arabic: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي اْلأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيْعُ الْعَلِيْمُ",
    latin:
      "Bismillahilladzi laa yadhurru ma'asmihi syai-un fil ardhi wa laa fis samaa' wa huwas samii'ul 'aliim.",
    translation:
      "Dengan nama Allah yang bila disebut, segala sesuatu di bumi dan langit tidak akan berbahaya, Dia-lah Yang Maha Mendengar lagi Maha Mengetahui.",
    source: "HR. Abu Daud no. 5088, 5089, Tirmidzi no. 3388, dan Ibnu Majah no. 3869",
    count: 3,
    category: "Dzikir #5",
    description:
      "Faedah: Barangsiapa yang mengucapkan dzikir tersebut sebanyak tiga kali di pagi hari dan tiga kali di petang hari, maka tidak akan ada bahaya yang tiba-tiba memudaratkannya.\nHikmah: Dzikir ini mengajarkan kita untuk selalu menyebut nama Allah sebagai perlindungan dari segala bahaya. Ini mengingatkan kita bahwa dengan menyebut nama Allah, kita akan terlindungi dari bahaya di bumi dan di langit.",
  },
  {
    id: 11,
    arabic: "رَضِيْتُ بِاللهِ رَبًّا، وَبِاْلإِسْلاَمِ دِيْنًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    latin: "Rodhiitu billaahi robbaa, wa bil-islaami diinaa, wa bi-muhammadin shallallaahu 'alaihi wa sallama nabiyya.",
    translation:
      "Aku ridha Allah sebagai Rabb, Islam sebagai agama dan Muhammad shallallahu 'alaihi wa sallam sebagai nabi.",
    source: "HR. Abu Daud no. 5072, Tirmidzi no. 3389",
    count: 3,
    category: "Dzikir #6",
    description:
      "Faedah: Barangsiapa yang mengucapkan dzikir ini sebanyak tiga kali di pagi hari dan tiga kali di petang hari, maka pantas baginya mendapatkan ridha Allah.\nHikmah: Dzikir ini mengajarkan kita untuk meneguhkan keimanan kita kepada Allah, Islam, dan Nabi Muhammad SAW. Ini adalah bentuk pengakuan dan kerelaan hati terhadap tiga hal fundamental dalam keimanan seorang Muslim.",
  },
  {
    id: 12,
    arabic: "يَا حَيُّ يَا قَيُّوْمُ بِرَحْمَتِكَ أَسْتَغِيْثُ، أَصْلِحْ لِيْ شَأْنِيْ كُلَّهُ وَلاَ تَكِلْنِيْ إِلَى نَفْسِيْ طَرْفَةَ عَيْنٍ",
    latin:
      "Yaa Hayyu Yaa Qoyyum, bi-rohmatika astaghiits, wa ash-lih lii sya'nii kullahu wa laa takilnii ilaa nafsii thorfata 'ain.",
    translation:
      "Wahai Rabb Yang Maha Hidup, wahai Rabb Yang Berdiri Sendiri (tidak butuh segala sesuatu), dengan rahmat-Mu aku minta pertolongan, perbaikilah segala urusanku dan jangan diserahkan kepadaku sekali pun sekejap mata (tanpa mendapat pertolongan dari-Mu).",
    source:
      "HR. Ibnu As-Sunni dalam 'Amalul Yaum wal Lailah no. 46, An-Nasa'i dalam Al-Kubra (381/ 570), Al-Bazzar dalam musnadnya (4/ 25/ 3107)",
    count: 1,
    category: "Dzikir #7",
    description:
      "Faedah: Dzikir ini diajarkan oleh Nabi shallallahu 'alaihi wa sallam pada Fathimah supaya diamalkan pagi dan petang.\nHikmah: Dzikir ini mengajarkan kita untuk selalu bergantung pada Allah dan memohon pertolongan-Nya dalam segala urusan. Ini mengingatkan kita bahwa kita tidak bisa mandiri bahkan sekejap mata pun tanpa pertolongan Allah.",
  },
  {
    id: 13,
    arabic:
      "أَصْبَحْنَا عَلَى فِطْرَةِ اْلإِسْلاَمِ وَعَلَى كَلِمَةِ اْلإِخْلاَصِ، وَعَلَى دِيْنِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِيْنَا إِبْرَاهِيْمَ، حَنِيْفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِيْنَ",
    latin:
      "Ash-bahnaa 'ala fithrotil islaam wa 'alaa kalimatil ikhlaash, wa 'alaa diini nabiyyinaa Muhammadin shallallahu 'alaihi wa sallam, wa 'alaa millati abiinaa Ibraahiima haniifam muslimaaw wa maa kaana minal musyrikin.",
    translation:
      "Di waktu pagi kami memegang agama Islam, kalimat ikhlas (kalimat syahadat), agama Nabi kami Muhammad shallallahu 'alaihi wa sallam, dan agama bapak kami Ibrahim, yang berdiri di atas jalan yang lurus, muslim dan tidak tergolong orang-orang musyrik.",
    source: "HR. Ahmad (3/406-407), Ad-Darimi (2/292) dan lain-lain",
    count: 1,
    category: "Dzikir #8",
    description:
      "Faedah: Dzikir ini menunjukkan bahwa kita berada di atas fitrah Islam, kalimat ikhlas (kalimat syahadat), agama Nabi Muhammad shallallahu 'alaihi wa sallam, dan millah (agama) Ibrahim yang lurus.\nHikmah: Dzikir ini mengajarkan kita untuk meneguhkan identitas kita sebagai Muslim yang mengikuti ajaran Nabi Muhammad SAW dan agama Ibrahim yang lurus. Ini mengingatkan kita untuk selalu berpegang teguh pada fitrah Islam dan menjauhi kesyirikan.",
    note: "Untuk dzikir petang, dibaca: أَمْسَيْنَا عَلَى فِطْرَةِ اْلإِسْلاَمِ... (Amsaynaa 'ala fithrotil islam...)",
  },
  {
    id: 14,
    arabic: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
    latin: "Subhanallahi wa bihamdihi.",
    translation: "Maha Suci Allah, aku memuji-Nya.",
    source: "HR. Muslim no. 2692",
    count: 100,
    category: "Dzikir #9",
    description:
      "Faedah: Barangsiapa yang mengucapkan kalimat 'Subhanallahi wa bihamdihi' di pagi dan petang hari sebanyak 100x, maka tidak ada yang datang pada hari kiamat yang lebih baik dari yang ia lakukan kecuali orang yang mengucapkan semisal atau lebih dari itu.\nHikmah: Dzikir ini mengajarkan kita untuk selalu mensucikan dan memuji Allah. Ini adalah bentuk pengakuan akan kesempurnaan Allah dan rasa syukur atas segala nikmat-Nya.",
  },
  {
    id: 15,
    arabic:
      "لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيْرُ",
    latin:
      "Laa ilaha illallah wahdahu laa syarika lah, lahul mulku walahul hamdu wa huwa 'ala kulli syai-in qodiir.",
    translation:
      "Tidak ada ilah yang berhak disembah selain Allah semata, tidak ada sekutu bagi-Nya. Milik Allah kerajaan dan segala pujian. Dia-lah yang berkuasa atas segala sesuatu.",
    source: "HR. An-Nasa'i dalam 'Amalul Yaum wal Lailah no. 24",
    count: 10,
    category: "Dzikir #10",
    description:
      "Faedah: Barangsiapa yang mengucapkan dzikir tersebut di pagi hari sebanyak 10x, Allah akan mencatatkan baginya 10 kebaikan, menghapuskan baginya 10 kesalahan, ia juga mendapatkan kebaikan semisal memerdekakan 10 budak, Allah akan melindunginya dari gangguan setan hingga petang hari. Siapa yang mengucapkannya di petang hari, ia akan mendapatkan keutamaan semisal itu pula.\nHikmah: Dzikir ini mengajarkan kita tentang tauhid (keesaan Allah) dan kekuasaan-Nya atas segala sesuatu. Ini mengingatkan kita bahwa hanya Allah yang berhak disembah dan Dia memiliki kekuasaan mutlak atas segala sesuatu.",
  },
];
