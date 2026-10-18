// MEB müfredatı, 2026-2027 eğitim-öğretim yılı.
//
// 9, 10 ve 11. sınıflar: Türkiye Yüzyılı Maarif Modeli öğretim programları. Ünite/tema adları ve konular
// tymm.meb.gov.tr'deki ünite sayfalarının "İçerik Çerçevesi" bölümlerinden alındı. Türk Dili ve
// Edebiyatı'nda içerik çerçevesi beceri temelli olduğundan (okuma, yazma, dinleme/izleme, konuşma) konular,
// temanın öğrenme-öğretme sürecinde adı geçen metin türleri ve dil bilgisi başlıklarından derlendi.
//
// 12. sınıf: 2018 öğretim programları. Maarif Modeli 12. sınıfta 2027-2028'de başlıyor; 2026-2027'de
// 12. sınıfta önceki programlar uygulanıyor.
//
// Biçim: "## sınıf | program", "### etiket: ünite adı", "> ara başlık" (isteğe bağlı), "- konu [ipuçları]".
// Köşeli parantezdeki ipuçları yalnızca yapay zekânın konuyu tanımasına yardım eder, ekranda gösterilmez.

export const MUFREDAT_SURUM = '2026-2027';

const MAARIF = 'Türkiye Yüzyılı Maarif Modeli';
const P2018 = '2018 öğretim programı';

const KAYNAK = {
  matematik: `
## 9 | ${MAARIF}
### 1. Tema: Sayılar
- Gerçek Sayıların Üslü ve Köklü Gösterimleri ile Yapılan İşlemler [üslü sayılar, köklü sayılar]
- Gerçek Sayı Aralıklarının Gösterimi ve Aralıklarla İlgili İşlemlerde Küme Sembollerinin Kullanımı [aralıklar, kümeler]
- Sayı Kümeleri ve İşlem Özellikleri
- Gerçek Sayıların İşlem Özelliklerini Cebirsel Olarak İfade Etme [sayı doğrusu, ondalık gösterim]
### 2. Tema: Nicelikler ve Değişimler
- Doğrusal Fonksiyonlar ve Nitel Özellikleri [eğim, doğru grafiği]
- Mutlak Değer Fonksiyonu ve Nitel Özellikleri [mutlak değer]
- Doğrusal Fonksiyonlarla İfade Edilebilen Denklem ve Eşitsizlikler İçeren Problemler [birinci dereceden denklemler, eşitsizlikler]
### 3. Tema: Geometrik Şekiller
- Üçgende Açı ve Kenarla İlgili Özellikler ve Bu Özellikler Arasındaki İlişkiler [üçgende açılar, üçgen eşitsizliği]
### 4. Tema: Eşlik ve Benzerlik
- Geometrik Dönüşümler [öteleme, yansıma, dönme]
- Eşlik ve Benzerlik Koşulları
- Benzer Üçgenler Oluşturma
- Tales, Öklid ve Pisagor Teoremleri
- Eşlik ve Benzerlik Problemleri
### 5. Tema: Algoritma ve Bilişim
- Algoritma Temelli Problemler [akış şeması]
- Mantık Bağlaçları ve Niceleyiciler [önermeler, ve, veya, ise, her, bazı]
- Mantık Bağlaçları ve Niceleyicilerin Algoritmik Problemlerde Kullanımı
### 6. Tema: İstatistiksel Araştırma Süreci
- Tek Nicel Değişkenli Veri Dağılımları [ortalama, medyan, açıklık, standart sapma, histogram, kutu grafiği]
- Başkaları Tarafından Oluşturulan Tek Nicel Değişkenli Veri Dağılımlarını İnceleme
### 7. Tema: Veriden Olasılığa
- Deneysel Olasılık
- Teorik Olasılık
## 10 | ${MAARIF}
### 1. Tema: Geometrik Şekiller
- Dik Üçgende Trigonometrik Oranlar ve Trigonometrik Özdeşlikler [sinüs, kosinüs, tanjant]
- Üçgende Yardımcı Elemanlar [açıortay, kenarortay, yükseklik]
- Üçgenin Alanı
- Sinüs ve Kosinüs Teoremleri
### 2. Tema: İstatistiksel Araştırma Süreci
- İki Kategorik Değişkenli Veriler [çapraz tablo]
- Başkaları Tarafından Oluşturulan İki Kategorik Değişkenli Verileri İnceleme
### 3. Tema: Sayılar
- Bir Doğal Sayının Asal Çarpanları, Bölenleri
- En Büyük Ortak Bölen, En Küçük Ortak Kat [EBOB, EKOK]
- Bölünebilme [bölünebilme kuralları]
### 4. Tema: Nicelikler ve Değişimler
- Gerçek Sayılarda Fonksiyon Olma Şartları [tanım kümesi, değer kümesi]
- Karesel Fonksiyon ve Nitel Özellikleri [parabol, ikinci dereceden fonksiyon]
- Karekök Fonksiyonu ve Nitel Özellikleri
- Rasyonel Fonksiyon ve Nitel Özellikleri
- Doğrusal, Karesel, Karekök ve Rasyonel Fonksiyonların Ters Fonksiyonları [ters fonksiyon]
- Gerçek Sayılarda Tanımlı Fonksiyonlarla İfade Edilebilen Denklem ve Eşitsizlikler İçeren Problemler [ikinci dereceden denklemler]
### 5. Tema: Sayma, Algoritma ve Bilişim
- Sayma Stratejileri [permütasyon, kombinasyon, toplama ve çarpma yoluyla sayma]
- Cebirsel ve Fonksiyonel İşlemlerin Algoritmik Yapısı
### 6. Tema: Analitik İnceleme
- Dik Koordinat Sisteminde Noktanın Analitik İncelenmesi [iki nokta arası uzaklık, orta nokta]
- Dik Koordinat Sisteminde Doğrunun Analitik İncelenmesi [doğrunun denklemi, eğim]
### 7. Tema: Veriden Olasılığa
- Koşullu Olasılık
- Bayes Teoremi
## 11 | ${MAARIF}
### 1. Tema: İstatistiksel Araştırma Süreci
- İki Nicel Değişkenli Veriler [serpme diyagramı, korelasyon]
- Başkaları Tarafından Oluşturulan İki Nicel Değişkenli Verileri İnceleme
### 2. Tema: Geometrik Şekiller
- Dörtgenlerin Özellikleri
- Özel Dörtgenler Arasındaki İlişkiler [paralelkenar, eşkenar dörtgen, dikdörtgen, kare, yamuk, deltoid]
- Çokgenlerin Sınıflandırılması
- Dışbükey Çokgenlerin Özellikleri
- Çokgenlerle İlgili Problemler
### 3. Tema: Nicelikler ve Değişimler (1)
- Trigonometrik Fonksiyonlar ve Nitel Özellikleri [birim çember, radyan]
- Trigonometrik Fonksiyonlarla İfade Edilebilen Denklemler İçeren Problemler
### 3. Tema: Nicelikler ve Değişimler (2)
- Üstel Fonksiyonlar ve Nitel Özellikleri
- Üstel Fonksiyonların Ters Fonksiyonları
- Logaritmik Fonksiyonlar ve Nitel Özellikleri [logaritma]
- Üstel ve Logaritmik Fonksiyonlarla İfade Edilebilen Denklem ve Eşitsizlikler İçeren Problemler
### 3. Tema: Nicelikler ve Değişimler (3)
- Fonksiyonların Bileşkesi
- Fonksiyonlarda Dört İşlem
## 12 | ${P2018}
### 1. Ünite: Üstel ve Logaritmik Fonksiyonlar
- Üstel Fonksiyon
- Logaritma Fonksiyonu
- Üstel, Logaritmik Denklemler ve Eşitsizlikler
### 2. Ünite: Diziler
- Gerçek Sayı Dizileri [aritmetik dizi, geometrik dizi]
### 3. Ünite: Trigonometri
- Toplam-Fark ve İki Kat Açı Formülleri
- Trigonometrik Denklemler
### 4. Ünite: Dönüşümler
- Analitik Düzlemde Temel Dönüşümler
### 5. Ünite: Türev
- Limit ve Süreklilik
- Anlık Değişim Oranı ve Türev [türev alma kuralları]
- Türevin Uygulamaları [maksimum, minimum, artan, azalan]
### 6. Ünite: İntegral
- Belirsiz İntegral
- Belirli İntegral ve Uygulamaları [alan hesabı]
### 7. Ünite: Analitik Geometri
- Çemberin Analitik İncelenmesi [çember denklemi]
`,

  edebiyat: `
## 9 | ${MAARIF}
### 1. Tema: Sözün İnceliği
- Şiir [Cumhuriyet Dönemi şiiri, edebî dil, imge, sembol, söz sanatları, şiirin şekil unsurları]
- Deneme
- Mülakat [dinleme/izleme metni]
- Betimleme [betimleyici paragraf yazma]
- Dil Bilgisi: Ses Bilgisi [ses olayları, ünlü uyumu]
- Dil Bilgisi: Yazım ve Noktalama
### 2. Tema: Anlam Arayışı
- Hikâye [Cumhuriyet Dönemi hikâyesi, olay, kişi, zaman, mekân, karakter]
- Anı (Hatıra)
- Şiir: Lirik ve Pastoral Şiir [İstiklal Marşı]
- Konu, Tema, Ana Düşünce ve Yardımcı Düşünce [açık ve örtük ileti]
### 3. Tema: Anlamın Yapı Taşları
- Hikâye: Anlatıcı ve Bakış Açısı [olay örgüsü, şahıs kadrosu, serim, düğüm, çözüm]
- Gezi Yazısı
- Eski Anadolu Türkçesiyle Şiir ve Ahenk Unsurları [Yunus Emre, ölçü, kafiye, redif, dörtlük, durak]
- Belgesel, Öğretici Metin ve Bilgi Görseli
- Dil Bilgisi: Şekil Bilgisi ve Eksiltili Cümleler [kök, gövde, yapım eki, çekim eki]
- Söz Varlığı: Deyim, Atasözü ve Kalıplaşmış İfadeler
### 4. Tema: Dilin Zenginliği
- Roman [Cumhuriyet Dönemi romanı]
- Tiyatro
- Eleştiri (Tenkit)
- Otobiyografi
- Anlatım Özellikleri, Anlatım Teknikleri ve Üslup [geriye dönüş, monolog, diyalog, tanımlama, karşılaştırma]
- Dil Bilgisi: Cümle Yapıları ve Ekler [bağdaşıklık, tutarlılık]
## 10 | ${MAARIF}
### 1. Tema: Sözün Ezgisi
- Sözlü Kültür ve Anonim Halk Edebiyatı [koşuk, sagu, destan, sav, ninni, türkü, tekerleme]
- Halk Şiiri: Koşma ve Âşık Atışması
- Masal [masalın bölümleri, olağanüstülük, varyant]
- Dil Bilgisi: İsim ve İsim Tamlamaları [isim çeşitleri, hâl ekleri, iyelik ekleri]
- Dil Bilgisi: Sıfat ve Sıfat Tamlamaları [niteleme sıfatı, belirtme sıfatı, işaret sıfatı]
### 2. Tema: Kelimelerin Ritmi
- Divan Şiiri: Gazel, Kaside ve Şarkı [aruz, beyit]
- Cumhuriyet Dönemi Saf Şiir
- Söyleşi ve Podcast
- Ahenk Unsurları: Ritim, Ölçü, Kafiye; İmge ve Sembol
- Dil Bilgisi: Zamir, Edat, Bağlaç ve Ünlem
- Dil Bilgisi: Eksiltili ve Devrik Cümle
### 3. Tema: Dünden Bugüne
- Destan [doğal destan, yapma destan]
- Mesnevi
- Halk Hikâyesi
- Fabl
- Dil Bilgisi: Zarf [neden-sonuç ve koşul-varsayım ifadeleri]
- Söz Varlığı ve Bağdaşıklık [deyim, atasözü]
### 4. Tema: Nesillerin Mirası
- Dede Korkut Hikâyeleri
- Tanzimat Dönemi Şiiri
- Servetifünun Dönemi Romanı ve Fecriati Şiiri
- Millî Edebiyat Dönemi Hikâyesi
- Dil Bilgisi: Fiiller [fiil kipleri, ek fiil]
## 11 | ${MAARIF}
### 1. Tema: Bir Diyeceğim Var!
- Geleneksel Türk Tiyatrosu: Karagöz [gölge oyunu, mizah, figür]
- Mektup
- Dilekçe
- E-posta ve İletişim
- Dil Bilgisi: Fiilimsiler [isim-fiil, sıfat-fiil, zarf-fiil]
- Dil Bilgisi: Eksiltili Yapılar ve Bağdaşıklık Ögeleri
### 2. Tema: Kültür Yolculuğu
- Türk Dünyası Edebiyatından Hikâye
- Orhun Abideleri
- Dîvânu Lugâti't-Türk ve Kutadgu Bilig
- Anı
- Halk Şiiri Geleneği: Âşık Atışması [ozanlık geleneği]
- İzlenim Yazısı
- Dil Bilgisi: Fiilde Kip ve Çatı
- Dil Bilgisi: Ekler ve Anlatım Bozuklukları
### 3. Tema: Yaşamın İzinde
- Roman
- Biyografi (Yaşam Öyküsü)
- Tezkire [divan edebiyatı geleneği]
- Radyo Tiyatrosu
- Dil Bilgisi: Cümlenin Ögeleri ve Cümle Kuruluşları
- Dil Bilgisi: Anlatım Bozuklukları
### 4. Tema: Hayatın Aynası
- Tiyatro [modern Türk tiyatrosu, dramatik örgü, perde, sahne, monolog, diyalog]
- Küçürek Hikâye
- Belgesel ve Afiş
- Dil Bilgisi: Cümle Türleri
## 12 | ${P2018}
### 1. Ünite: Giriş
- Edebiyat-Felsefe İlişkisi
- Edebiyat-Psikoloji İlişkisi
- Dilin Tarihî Süreç İçinde Değişimini Etkileyen Sebepler
- İlk Örneklerden Günümüze Türkçenin Önemli Sözlükleri
### 2. Ünite: Hikâye
- 1960 Sonrası Cumhuriyet Dönemi Hikâyesi
- Küçürek (Minimal) Hikâye
### 3. Ünite: Şiir
- Cumhuriyet Dönemi Saf Şiir Anlayışı [Ahmet Haşim, Yahya Kemal, Ahmet Hamdi Tanpınar]
- Cumhuriyet Dönemi Toplumcu Eğilimleri Yansıtan Şiir [Nazım Hikmet]
- Millî Edebiyat Anlayışını Yansıtan Şiir [Beş Hececiler]
- Garip Akımını Temsil Eden Şiir [Orhan Veli]
- İkinci Yeni Şiiri
- Dinî Değerleri, Geleneğe Duyarlığı ve Metafizik Anlayışı Öne Çıkaran Şiir [Necip Fazıl]
- 1960 Sonrası Toplumcu Eğilimleri Öne Çıkaran Şiir
- 1980 Sonrası Türk Şiiri
- Cumhuriyet Sonrası Halk Şiiri
### 4. Ünite: Roman
- Cumhuriyet Dönemi (1923-1950) Türk Romanı
- Cumhuriyet Dönemi (1950-1980) Türk Romanı
- 1980 Sonrası Türk Romanı
- Türk Dünyası Edebiyatında Roman
- Dünya Edebiyatında Roman
### 5. Ünite: Tiyatro
- 1950 Sonrası Türk Tiyatrosu
### 6. Ünite: Deneme
- Dünya Edebiyatında Deneme
- Cumhuriyet Dönemi (1923-1960) Deneme
- Cumhuriyet Dönemi (1960 Sonrası) Deneme
### 7. Ünite: Söylev (Nutuk)
- Cumhuriyet Dönemi'nde Söylev
- İslamiyet Öncesi ve İslamiyet Etkisindeki Türk Edebiyatında Söylev
`,

  felsefe: `
## 10 | ${MAARIF}
### 1. Ünite: Felsefenin Doğası
- Felsefenin Anlamı
- Felsefi Düşüncenin Özellikleri
- Felsefi Düşüncenin Gelişimi
- Felsefi Sorunun Temel Özellikleri
- Felsefenin Diğer Alanlarla İlişkisi
- Felsefenin Bireysel ve Toplumsal İşlevi
### 2. Ünite: Felsefe, Mantık ve Argümantasyon
- Düşünme ve Dil İlişkisi
- Mantık ve Argümantasyonun Temel Kavramları [önerme, çıkarım, tümdengelim, tümevarım]
- Argümantasyonun Yapısı [öncül, sonuç, geçerlilik]
### 3. Ünite: Varlık Felsefesi
- Varlık Felsefesinin Konusu ve Temel Kavramları [ontoloji]
- Varlık Felsefesinin Temel Problemleri [varlığın var olup olmadığı, varlığın ne olduğu, idealizm, materyalizm]
### 4. Ünite: Bilgi Felsefesi
- Bilgi Felsefesinin Konusu ve Temel Kavramları [epistemoloji]
- Bilgi Felsefesinin Temel Problemleri [bilginin imkânı, kaynağı, doğruluk ölçütleri, rasyonalizm, empirizm, şüphecilik]
### 5. Ünite: Ahlak Felsefesi
- Ahlak Felsefesinin Konusu ve Temel Kavramları [etik, iyi, kötü, erdem]
- Ahlak Felsefesinin Temel Problemleri [evrensel ahlak yasası, özgürlük-sorumluluk]
### 6. Ünite: Estetik ve Sanat Felsefesi
- Estetik ve Sanat Felsefesinin Konusu ve Temel Kavramları
- Estetik ve Sanat Felsefesinin Temel Problemleri [sanatın ne olduğu, güzellik, ortak estetik yargı]
### 7. Ünite: Siyaset Felsefesi
- Siyaset Felsefesinin Konusu ve Temel Kavramları [devlet, iktidar, meşruiyet]
- Siyaset Felsefesinin Temel Problemleri [devletin kökeni, iktidarın kaynağı, ideal düzen, ütopyalar]
### 8. Ünite: Din Felsefesi
- Din Felsefesinin Konusu ve Temel Kavramları
- Din Felsefesinin Temel Problemleri [Tanrı'nın varlığı, evrenin sonluluğu, ruhun ölümsüzlüğü]
### 9. Ünite: Bilim Felsefesi
- Bilim Felsefesinin Konusu ve Temel Kavramları
- Bilim Felsefesinin Temel Problemleri [bilimin ne olduğu, bilimi oluşturan unsurlar, bilimsel yöntem]
## 11 | ${MAARIF}
### 1. Ünite: Çevre Sorunları ve Felsefe
- Çevre ve İnsan İlişkisi
- Çevre Etiği [insan merkezci, canlı merkezci, çevre merkezci etik]
### 2. Ünite: Teknoloji ve Hayat
- Teknoloji ve İnsan Hayatı
- Teknoloji Bağlamında Ontolojik Problemler [anlam kaybı, yabancılaşma]
- Teknoloji Bağlamında Aksiyolojik Problemler [güvenlik, değerlerin tahribatı, ahlaki eylem]
### 3. Ünite: Akıl ve İnanç
- Akıl-İnanç İlişkisine Yönelik Felsefi Sorular ve Problemler
- Akıl-İnanç İlişkisine Yönelik Felsefi Görüş ve Argümanlar
### 4. Ünite: Edebiyat ve Felsefe
- Edebiyat-Felsefe İlişkisi
- Edebiyat-Felsefe İlişkisi Problemleri [edebî unsurlara felsefi bakış]
### 5. Ünite: Hayatın Anlamı
- Hayatın Anlamına Yönelik Felsefi Sorular ve Problemler [mutluluk, varoluş, kendi olma]
- Hayatın Anlamına Yönelik Felsefi Görüş ve Argümanlar
### 6. Ünite: Hukuk ve Felsefe
- Hukuk ve İnsan
- Hukukun Doğasına Yönelik Felsefi Problemler [doğal hukuk, pozitif hukuk, ahlak-hukuk ilişkisi]
`,

  kimya: `
## 9 | ${MAARIF}
### 1. Tema: Etkileşim
> Kimya Hayattır
- Günlük Hayatta Kimya
- Kimyasal Maddelerin Kullanımı ve Güvenlik [güvenlik simgeleri]
- Kimyanın Alt Disiplinleri
- Kimya Alanında Kariyer Olanakları
> Atomdan Periyodik Tabloya
- Atom Teorileri ve Atomun Yapısı [Bohr atom teorisi, modern atom teorisi, proton, nötron, elektron]
- Atom Orbitalleri ve Elektron Dizilimi
- Periyodik Tabloda Yer Bulma [grup, periyot]
- Periyodik Özellikler [atom yarıçapı, iyonlaşma enerjisi, elektronegatiflik]
### 2. Tema: Çeşitlilik
> Etkileşimler
- Metalik Bağ
- İyonik Bağ
- Kovalent Bağ
- Lewis Nokta Yapısı
- Molekül Polarlığı ve Apolarlığı
- Bileşiklerin Adlandırılması
> Etkileşimden Maddeye
- Moleküller Arası Etkileşimler [hidrojen bağı, van der Waals]
- Katılar ve Özellikleri [amorf ve kristal katılar]
- Sıvılar ve Özellikleri [kaynama sıcaklığı, buhar basıncı, viskozite, adezyon, kohezyon, yüzey gerilimi]
### 3. Tema: Sürdürülebilirlik
> Nanoparçacıklar ve Ekolojik Sürdürülebilirlik
- Metal Nanoparçacıklar
- Metal, Alaşım ve Metal Nanoparçacıkların Çevresel Etkileri
- Yeşil Kimyanın Atık Önleme İlkesi
## 10 | ${MAARIF}
### 1. Tema: Etkileşim
> Kimyasal Tepkimeler
- Kimyasal Değişimin Göstergeleri
- Kimyasal Tepkimelerin Oluşumu
- Kimyasal Tepkime Türleri [yanma, sentez, analiz, asit-baz, çökelme]
- Mol Kavramı [Avogadro sayısı, mol kütlesi]
- Kimyasal Tepkime Denklemlerinin Denkleştirilmesi
- Kimyasal (Stokiyometrik) Hesaplamalar [sınırlayıcı bileşen, verim]
> Gazlar
- Gazların Özellikleri ve Kinetik Moleküler Teori
- Gaz Yasaları [Boyle, Charles, Gay-Lussac, Avogadro]
- İdeal Gaz Yasası [PV=nRT]
- Graham Difüzyon ve Efüzyon Yasası
### 2. Tema: Çeşitlilik
> Çözeltiler
- Çözünme Süreci
- Maddelerin Birbiri İçindeki Çözünebilirliği
- Çözünme Olayının Sınıflandırılması
- Çözünürlük
- Çözünürlüğe Etki Eden Faktörler [sıcaklık, basınç, madde cinsi]
- Çözeltilerin Sınıflandırılması [doymuş, doymamış, aşırı doymuş]
- Derişim Birimleri [molarite, ppm]
- Koligatif Özellikler [kaynama noktası yükselmesi, donma noktası düşmesi]
### 3. Tema: Sürdürülebilirlik
> Yeşil Kimya, Çevresel ve Ekolojik Sürdürülebilirlik
- Makro ve Mikro Ölçekli Deneyler
- Atmosferdeki Tepkimeler ve Küresel Sorunlar [asit yağmuru, ozon, sera etkisi]
## 11 | ${MAARIF}
### 1. Tema: Etkileşim
> Enerji
- Tepkimelerde Meydana Gelen Enerji Değişimi [ekzotermik, endotermik, entalpi]
- Maddelerin Enerji Kaynağı Olma Potansiyeli
- Bağ Enerjileriyle Tepkime Entalpisinin Hesaplanması
- Standart Oluşum Entalpileriyle Tepkime Entalpisinin Hesaplanması [Hess yasası]
> Kimyasal Tepkimelerde Hız
- Kimyasal Tepkimelerin Gerçekleşmesi İçin Gerekli Şartlar [çarpışma teorisi, aktivasyon enerjisi]
- Tepken ve Ürün Derişimleriyle Ortalama Tepkime Hızlarının Hesaplanması
- Tepkime Hızına Etki Eden Faktörler [tepken cinsi, fiziksel hâl, derişim, sıcaklık, temas yüzeyi, katalizör]
- Tek Basamaklı Kimyasal Tepkimelerin Hız Denklemi [hız sabiti]
### 2. Tema: Çeşitlilik
> Denge
- Tersinir Tepkimelerin Özellikleri
- Fiziksel ve Kimyasal Değişimlerde Denge
- Denge Sabiti İfadesinin Yazılması [Kc, Kp]
- Tepkime Oranı
- Dengeyi Etkileyen Faktörler [Le Chatelier, derişim, hacim, basınç, sıcaklık, katalizör]
> Asit ve Baz Çözeltilerinde Denge
- Suyun Otoiyonizasyonu
- Asit Baz Teorilerinin Karşılaştırılması [Arrhenius, Brønsted-Lowry]
- Asitlerin ve Bazların Kuvveti [Ka, Kb]
- Kuvvetli ve Zayıf Asit-Baz Çözeltilerinde pH Hesaplamaları [pH, pOH]
- Kuvvetli Asit ve Kuvvetli Bazların Nötralleşme Tepkimeleri
- Kuvvetli Asit-Kuvvetli Baz Titrasyonları
- Asidik ve Bazik Ürünlerin Seçiminde Dikkat Edilmesi Gerekenler
> Çözünürlük Dengesi
- Suda Az Çözünen Tuzların Molar Çözünürlükleri
- Çözünürlük Çarpımı (Kçç)
- Tuzların Çözünürlüğüne Etki Eden Faktörler [sıcaklık, ortak iyon]
### 3. Tema: Sürdürülebilirlik
> Nanoteknoloji ve Sürdürülebilirlik
- Fermantasyon Yöntemi ile Yeşil Hidrojen Enerjisi
- Nanoteknolojik Ürünlerin Potansiyel Faydaları ve Olası Zararları
- Mikroplastik ve Nanoplastiklerin Etkileri
## 12 | ${P2018}
### 1. Ünite: Kimya ve Elektrik
- İndirgenme-Yükseltgenme Tepkimelerinde Elektrik Akımı
- Elektrotlar ve Elektrokimyasal Hücreler
- Elektrot Potansiyelleri
- Kimyasallardan Elektrik Üretimi [pil]
- Elektroliz
- Korozyon
### 2. Ünite: Karbon Kimyasına Giriş
- Anorganik ve Organik Bileşikler
- Basit Formül ve Molekül Formülü
- Doğada Karbon [elmas, grafit, fulleren]
- Lewis Formülleri
- Hibritleşme ve Molekül Geometrileri
### 3. Ünite: Organik Bileşikler
- Hidrokarbonlar [alkanlar, alkenler, alkinler, aromatik bileşikler]
- Fonksiyonel Gruplar
- Alkoller
- Eterler
- Karbonil Bileşikleri [aldehitler, ketonlar]
- Karboksilik Asitler
- Esterler
### 4. Ünite: Enerji Kaynakları ve Bilimsel Gelişmeler
- Fosil Yakıtlar
- Alternatif Enerji Kaynakları
- Sürdürülebilirlik
- Nanoteknoloji
`,

  fizik: `
## 9 | ${MAARIF}
### 1. Ünite: Fizik Bilimi ve Kariyer Keşfi
- Fizik Bilimi
- Fizik Biliminin Alt Dalları
- Fizik Bilimine Yön Verenler
- Fizik Bilimi ile İlgili Kariyer Keşfi
### 2. Ünite: Kuvvet ve Hareket
- Temel ve Türetilmiş Nicelikler [birimler]
- Skaler ve Vektörel Nicelikler
- Vektörler [bileşke vektör]
- Doğadaki Temel Kuvvetler [kütle çekimi, elektromanyetik, güçlü ve zayıf nükleer kuvvet]
- Hareket ve Hareket Türleri [konum, yer değiştirme, yol, sürat, hız]
### 3. Ünite: Akışkanlar
- Basınç [katı basıncı]
- Sıvılarda Basınç [Pascal ilkesi]
- Açık Hava Basıncı [Torricelli]
- Kaldırma Kuvveti [Arşimet ilkesi, yüzme, batma]
- Bernoulli İlkesi
### 4. Ünite: Enerji
- İç Enerji, Isı ve Sıcaklık Arasındaki İlişki
- Isı, Öz Isı, Isı Sığası ve Sıcaklık Farkı Arasındaki İlişki
- Hâl Değişimi [erime, donma, buharlaşma, yoğuşma]
- Isıl Denge
- Isı Aktarım Yolları [iletim, konveksiyon, ışıma]
- Isı İletim Hızı
## 10 | ${MAARIF}
### 1. Ünite: Kuvvet ve Hareket
- Sabit Hızlı Hareket [düzgün doğrusal hareket, konum-zaman grafiği, hız, ortalama hız]
- Bir Boyutta Sabit İvmeli Hareket [ivme, düzgün hızlanan ve yavaşlayan hareket, hız-zaman grafiği]
### 2. Ünite: Enerji
- İş, Enerji ve Güç
- Enerji Biçimleri [kinetik enerji, potansiyel enerji]
- Mekanik Enerji [enerjinin korunumu]
- Enerji Kaynakları [yenilenebilir enerji]
### 3. Ünite: Elektrik
- Basit Elektrik Devreleri
- Elektrik Akımı [potansiyel fark]
- Ohm Yasası [direnç]
- Dirençlerin Bağlanması [seri, paralel, eşdeğer direnç]
- Üreteçlerin Bağlanması
- Elektrik Akımının Oluşturabileceği Tehlikelere Karşı Alınması Gereken Önlemler
- Topraklamanın Önemi
### 4. Ünite: Dalgalar
- Periyodik Hareketler [periyot, frekans]
- Dalgaların Temel Kavramları [dalga boyu, genlik]
- Dalgaların Sınıflandırılması [enine, boyuna, mekanik, elektromanyetik]
- Dalgaların Yayılma Süratini Etkileyen Etmenler
- Su Dalgalarında Yansıma ve Kırılma
- Rezonans ve Deprem
## 11 | ${MAARIF}
### 1. Ünite: Kuvvet ve Hareket
- Serbest Düşme
- İki Boyutta Sabit İvmeli Hareket [atışlar, yatay atış, eğik atış]
- Newton Hareket Yasaları
- Sürtünme Kuvveti
- Limit Hız
- Çembersel Hareket [merkezcil kuvvet]
### 2. Ünite: Elektrik ve Manyetizma
- Elektriksel Kuvvet ve Elektriksel Alan [Coulomb yasası]
- Manyetik Alan ve Manyetik Kuvvet
- İndüksiyon Akımı
- Transformatörler
### 3. Ünite: Optik
- Işık Şiddeti, Işık Akısı ve Aydınlanma
- Düzlem Aynalar
- Küresel Aynalar [çukur ayna, tümsek ayna]
- Kırılma [Snell yasası, kırıcılık indisi]
- Görünür Derinlik
- Fiber Optik [tam yansıma]
- Prizmalar
- Mercekler [ince kenarlı, kalın kenarlı mercek]
## 12 | ${P2018}
### 1. Ünite: Çembersel Hareket
- Düzgün Çembersel Hareket
- Dönerek Öteleme Hareketi
- Açısal Momentum
- Kütle Çekim ve Kepler Kanunları
### 2. Ünite: Basit Harmonik Hareket
- Basit Harmonik Hareket [yay sarkacı, basit sarkaç]
### 3. Ünite: Dalga Mekaniği
- Dalgalarda Kırınım, Girişim ve Doppler Olayı
- Elektromanyetik Dalgalar
### 4. Ünite: Atom Fiziğine Giriş ve Radyoaktivite
- Atom Kavramının Tarihsel Gelişimi
- Büyük Patlama ve Evrenin Oluşumu
- Radyoaktivite
### 5. Ünite: Modern Fizik
- Özel Görelilik
- Kuantum Fiziğine Giriş
- Fotoelektrik Olayı
- Compton Saçılması ve De Broglie Dalga Boyu
### 6. Ünite: Modern Fiziğin Teknolojideki Uygulamaları
- Görüntüleme Teknolojileri
- Yarı İletken Teknolojisi
- Süper İletkenler
- Nanoteknoloji
- Laser Işınları
`,

  biyoloji: `
## 9 | ${MAARIF}
### 1. Tema: Yaşam
> Yaşam Bilimi: Biyoloji
- Biyolojinin Önemi
- Biyoloji Biliminin Gelişimindeki Dönüm Noktaları
- Bilimin Doğası
- Bilimsel Araştırma Süreçleri [hipotez, deney, kontrol grubu]
- Bilim Etiği
- Canlıların Ortak Özellikleri [hücresel yapı, beslenme, solunum, boşaltım, büyüme, metabolizma, uyarılara tepki, homeostazi, üreme, adaptasyon]
> Temel Bileşenler
- İnorganik Moleküller [su, mineraller]
- Karbohidratlar [monosakkarit, disakkarit, polisakkarit, glikoz, nişasta, glikojen, selüloz]
- Lipitler [yağ asitleri, trigliserit, fosfolipit, steroit]
- Proteinler ve Enzimler [amino asit, peptit bağı, enzim-substrat, aktivasyon enerjisi]
- Nükleik Asitler [DNA ve RNA'nın yapısı, nükleotit]
- Vitaminler [yağda çözünen, suda çözünen vitaminler]
### 2. Tema: Organizasyon
> Hücrenin Organizasyonu
- Prokaryot ve Ökaryot Hücre
- Hücre Zarı
- Sitoplazma
- Sitoplazmik Yapılar
- Organeller ve Çekirdek [mitokondri, ribozom, endoplazmik retikulum, Golgi, lizozom, kloroplast]
- Hücre Zarından Madde Geçişleri [difüzyon, ozmoz, aktif taşıma, endositoz, ekzositoz]
> Sınıflandırma ve Biyoçeşitlilik
- Sınıflandırmada Temel Yaklaşımlar ve Modern Sınıflandırma [Linne, ikili adlandırma, sınıflandırma kategorileri]
- Üç Üst Âlem Sistemindeki Canlılar [bakteriler, arkeler, ökaryotlar, protistler, bitkiler, mantarlar, hayvanlar]
- Biyoçeşitlilik
## 10 | ${MAARIF}
### 1. Tema: Enerji
> Güneşten Besinlere
- Canlılık İçin Enerjinin Önemi [ATP]
- Fotosentez [ışığa bağlı ve ışıktan bağımsız tepkimeler, fotosentez hızına etki eden faktörler]
- Kemosentez
> Besinlerden Enerjiye
- Sindirim [hücre içi ve hücre dışı sindirim]
- Canlılarda Sindirim Yapıları
- İnsanda Sindirim, Emilim ve Taşınma
- Hücresel Solunum [glikoliz, sitrik asit döngüsü, Krebs, elektron taşıma sistemi]
- Besinlerin Solunuma Katılma Yolları
- Fermantasyon [laktik asit, etil alkol fermantasyonu]
- Enerji-Metabolizma İlişkisi
### 2. Tema: Ekoloji
> Ekosistemler
- Ekosistemin Bileşenleri [popülasyon, komünite]
- Tür İçi ve Türler Arası Etkileşimler [simbiyoz, mutualizm, parazitlik]
- Süksesyon
- Popülasyon Dinamikleri
- Ekosistemde Madde ve Enerji Akışı [besin zinciri, besin ağı, ekolojik piramit, biyolojik birikim]
- Madde Döngüleri [su, karbon, azot döngüsü]
> Ekolojik Sürdürülebilirlik
- Ekolojik Sürdürülebilirliğin Önemi
- Ekolojik Sürdürülebilirliği Kısıtlayan Durumlar [habitat kaybı, kirlilik, biyoçeşitlilik kaybı]
- Ekolojik Sürdürülebilirliğin Sağlanması [ekolojik ayak izi, atık yönetimi]
## 11 | ${MAARIF}
### 1. Tema: Tepki
> Canlılık ve Tepki
- Farklı Canlıların Uyaranlara Karşı Oluşturduğu Tepkiler
- Bitkilerde Tepki [bitki hormonları, tropizma, nasti]
- Hayvanlarda Tepki [reseptörler, nöron, sinaps, duyu organları, sinir sistemi, refleks]
- Uyartıya Mekanik Tepki [kemik, eklem, kas, kasılma mekanizması]
- Bağışıklık [doğal ve kazanılmış bağışıklık, aşı, alerji]
### 2. Tema: Homeostazi
> Homeostazi ve Canlılar İçin Önemi
- Farklı Canlı Türlerindeki Homeostatik Yapı ve Sistemler
- Homeostatik Süreçler
- Pozitif ve Negatif Geri Bildirim
- Sinir Sistemi ve Homeostazi
- Endokrin Sistem ve Homeostazi [hormonlar, iç salgı bezleri]
- Dolaşım Sistemi ve Homeostazi [kalp, kan damarları]
- Solunum Sistemi ve Homeostazi
- Boşaltım Sistemi ve Homeostazi [böbrek, nefron]
- Sistemlerin Eş Güdümlü Çalışması
> Homeostazinin Sağlanamadığı Durumlarda Oluşabilecek Sağlık Problemleri
- Homeostazinin Sağlanamadığı Durumlarda Oluşabilecek Sağlık Problemleri [diyabet, kan basıncı, obezite]
## 12 | ${P2018}
### 1. Ünite: Genden Proteine
- Nükleik Asitlerin Keşfi ve Önemi [DNA'nın kendini eşlemesi]
- Genetik Şifre ve Protein Sentezi [transkripsiyon, translasyon]
### 2. Ünite: Canlılarda Enerji Dönüşümleri
- Canlılık ve Enerji [ATP]
- Fotosentez
- Kemosentez
- Hücresel Solunum [oksijenli solunum, fermantasyon]
### 3. Ünite: Bitki Biyolojisi
- Bitkilerin Yapısı [kök, gövde, yaprak, doku]
- Bitkilerde Madde Taşınması [ksilem, floem, terleme]
- Bitkilerde Eşeyli Üreme [çiçek, tozlaşma, döllenme, tohum]
### 4. Ünite: Canlılar ve Çevre
- Canlılar ve Çevre
`,

  tarih: `
## 9 | ${MAARIF}
### 1. Ünite: Geçmişin İnşa Sürecinde Tarih
- Tarih Öğrenmenin Faydaları
- Tarihin Doğası
- Tarihsel Bilginin Üretim Süreci [kaynak, belge, kronoloji]
- Tarih Araştırma ve Yazımında Dijitalleşme
### 2. Ünite: Eski Çağ Medeniyetleri
- Tarım Devrimi'nin Eski Çağ Medeniyetlerindeki Yerleşmeye ve Ekonomiye Etkisi [Mezopotamya, Mısır, Anadolu]
- Eski Çağ Medeniyetlerinde Yönetim ve Ordu
- Eski Çağ Medeniyetlerinde Hukuk [Hammurabi kanunları]
- Eski Çağ'da İnançlar ile Bilim ve Sanat Anlayışları
- Türklerde Konargöçer Yaşam [Hunlar, Göktürkler, bozkır kültürü]
### 3. Ünite: Orta Çağ Medeniyetleri
- Orta Çağ'da Yaşanan Kitlesel Göçler [Kavimler Göçü]
- Orta Çağ'daki Başlıca Devletlerin Yönetim ve Ordu Yapıları [feodalite, Emevi, Abbasi]
- Orta Çağ'daki Ticaret Yolları [İpek Yolu, Baharat Yolu]
- Orta Çağ'daki Başlıca Medeniyet Havzalarında Bilim, Kültür ve Sanat
## 10 | ${MAARIF}
### 1. Ünite: Türkistan'dan Türkiye'ye (1040-1299)
- Türkistan'dan Türkiye'ye Uzanan Süreçte Önemli Askerî Mücadeleler [Dandanakan, Malazgirt, Miryokefalon, Haçlı Seferleri, Kösedağ]
- Türkistan'dan Türkiye'ye Uzanan Süreçte Türk Devlet ve Ordu Teşkilatındaki Değişim [Büyük Selçuklu, Türkiye Selçukluları, ikta]
- Türkistan'dan Türkiye'ye Uzanan Süreçte Türklerin Sosyal Yaşamları ve Ekonomik Faaliyetleri [Ahilik, kervansaray]
- Türk-İslam Medeniyetinin Bilim, Kültür, Eğitim ve Sanat Alanlarındaki Etkileri [Nizamiye medreseleri]
### 2. Ünite: Beylikten Devlete Osmanlı (1299-1453)
- Osmanlı Devleti'nin Kuruluşuna Dair Farklı Görüşler
- Osmanlı Devleti'nin Anadolu ve Rumeli'deki Siyasi ve Askerî Mücadeleleri [Koyunhisar, Sırpsındığı, Kosova, Niğbolu, Ankara Savaşı, Fetret Devri]
- Osmanlı Devleti'nin Devletleşme Süreci ile Ordu, Hukuk ve Toprak Sistemleri Arasındaki İlişkiler [tımar, yeniçeri, devşirme]
- Osmanlı Devleti'nin Fethettiği Topraklarda Kalıcı Olabilmek İçin İzlediği Politikalar [iskân, istimalet]
- Osmanlı Devleti'nin İlim ve İrfan Geleneğinin Oluşmasında Mekânların ve Kişilerin Etkisi
### 3. Ünite: Cihan Devleti Osmanlı (1453-1683)
- 1453-1683 Yılları Arasındaki Siyasi ve Askerî Mücadeleler [İstanbul'un fethi, Mercidabık, Ridaniye, Mohaç, Preveze]
- Osmanlı Devleti'nin Yönetim ve Ordu Yapısındaki Değişim [Divan-ı Hümayun, kanunnameler]
- Avrupa'nın Sömürgeci Politikalarının Etkileri [Coğrafi Keşifler]
- Osmanlı Devleti'ndeki Önemli İsyanların Neden ve Sonuçları [Celali isyanları]
- 1453-1683 Yılları Arasında Osmanlı Devleti'nde Bilim, Kültür, Eğitim ve Sanat [Mimar Sinan, enderun]
## 11 | ${MAARIF}
### 1. Ünite: Değişen Dünyada Osmanlı Devleti (1683-1789)
- Osmanlı Devleti'nin 1683-1789 Yılları Arasındaki Siyasi ve Askerî Mücadeleleri [II. Viyana Kuşatması, Karlofça, Pasarofça, Küçük Kaynarca]
- Lale Devri'nin Devlet ve Toplum Hayatına Etkileri [matbaa]
- 1755 Lizbon ve 1766 İstanbul Depremlerinin Etkileri
- Sanayi Devrimi'nin Meydana Getirdiği Siyasi, Sosyal ve Ekonomik Değişim
### 2. Ünite: Dönüşüm Sürecinde Osmanlı (1789-1908)
- Fransız İhtilali'nin Devlet ve Toplum Hayatında Meydana Getirdiği Değişim [milliyetçilik]
- 1789-1908 Yılları Arasında Osmanlı Devleti'nde Siyasi, Askerî ve İdari Gelişmeler [Nizam-ı Cedid, Tanzimat Fermanı, Islahat Fermanı, I. Meşrutiyet, Kanun-i Esasi]
- 1789-1908 Yılları Arasında Osmanlı Devleti'nde Bilim, Sanat ve Teknoloji Alanlarındaki Gelişmeler
- Osmanlı Devleti'nde Sanayileşme Çabaları
### 3. Ünite: Savaşlar Sarmalında Osmanlı (1908-1918)
- 1908-1918 Yılları Arasında Osmanlı Devleti'nde Siyasi ve Askerî Gelişmeler [II. Meşrutiyet, 31 Mart, Trablusgarp, Balkan Savaşları, I. Dünya Savaşı, Çanakkale, Mondros]
- 1908-1918 Yılları Arasında Gerçekleşen Kitlesel Göç ve Salgınlar
- Osmanlı Devleti'nin İnsanlık Tarihine Katkıları
## 12 | ${P2018} (T.C. İnkılap Tarihi ve Atatürkçülük)
### 1. Ünite: 20. Yüzyıl Başlarında Osmanlı Devleti ve Dünya
- Mustafa Kemal'in Eğitim ve Askerlik Hayatı
- 20. Yüzyıl Başlarında Osmanlı Devleti
- I. Dünya Savaşı ve Osmanlı Devleti
- I. Dünya Savaşı'nın Sonuçları [Mondros Ateşkes Antlaşması, işgaller]
### 2. Ünite: Millî Mücadele
- Kuvâ-yı Millîye'nin Oluşumundan Büyük Millet Meclisine [cemiyetler, Amasya Genelgesi, Erzurum ve Sivas Kongreleri]
- Büyük Millet Meclisinin Açılış Süreci ve Sonrasındaki Gelişmeler
- Sevr Antlaşması
- Millî Mücadele'de Doğu ve Güney Cepheleri
- Millî Mücadele'de Batı Cephesi [İnönü, Sakarya, Büyük Taarruz]
- Mudanya Ateşkes Antlaşması ve Lozan Barış Antlaşması
- Millî Mücadele Kahramanları
### 3. Ünite: Atatürkçülük ve Türk İnkılabı
- Atatürk İlkeleri
- Siyasi Alanda Meydana Gelen Gelişmeler [saltanatın kaldırılması, Cumhuriyet'in ilanı, halifeliğin kaldırılması]
- Hukuk Alanında Meydana Gelen Gelişmeler [Türk Medeni Kanunu]
- Eğitim ve Kültür Alanlarında İnkılaplar ve Gelişmeler [Tevhid-i Tedrisat, harf inkılabı]
- Toplumsal Alanda İnkılaplar ve Gelişmeler [şapka, soyadı kanunu]
- Ekonomi Alanında Meydana Gelen Gelişmeler [İzmir İktisat Kongresi]
- Sağlık Alanında Meydana Gelen Gelişmeler
- Atatürk İlke ve İnkılaplarını Oluşturan Temel Esaslar
### 4. Ünite: İki Savaş Arasındaki Dönemde Türkiye ve Dünya
- Atatürk Dönemi'nde İç Politikadaki Gelişmeler [çok partili hayat denemeleri]
- Atatürk Dönemi Türk Dış Politikası [Musul, Hatay, Montrö, Balkan Antantı, Sadabat Paktı]
- İki Dünya Savaşı Arasındaki Dönemde Dünyadaki Gelişmeler
### 5. Ünite: II. Dünya Savaşı Sürecinde Türkiye ve Dünya
- II. Dünya Savaşı
- II. Dünya Savaşı'nda Türkiye
- II. Dünya Savaşı'nın Sonuçları
### 6. Ünite: II. Dünya Savaşı Sonrasında Türkiye ve Dünya
- 1945-1950 Yılları Arasında Türkiye
- II. Dünya Savaşı Sonrasında Uluslararası İlişkiler ve Türk Dış Politikası [Soğuk Savaş, NATO]
- 1950'lerde Türkiye
### 7. Ünite: Toplumsal Devrim Çağında Dünya ve Türkiye
- 1960 Sonrasında Dünya Siyaseti
- 1960'lardan İtibaren Türk Dış Politikası [Kıbrıs Barış Harekâtı]
- 1960-1990 Yılları Arasında Türkiye
### 8. Ünite: 21. Yüzyılın Eşiğinde Türkiye ve Dünya
- 1990 Sonrasında Türkiye
- 1990 Sonrasında Dünyadaki Gelişmeler ve Türkiye'ye Etkileri
`,
};

// ---------------------------------------------------------------------------
// Ayrıştırma

function parse(source) {
  const grades = [];
  let grade = null;
  let unit = null;
  let group = '';
  for (const raw of source.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    let m;
    if ((m = line.match(/^##\s+(\d{1,2})\s*\|\s*(.+)$/))) {
      grade = { sinif: Number(m[1]), program: m[2].trim(), uniteler: [] };
      grades.push(grade);
      unit = null;
      group = '';
    } else if ((m = line.match(/^###\s+(.+?):\s*(.+)$/))) {
      if (!grade) throw new Error('Sınıf yok: ' + line);
      unit = { no: grade.uniteler.length + 1, etiket: m[1].trim(), ad: m[2].trim(), konular: [] };
      grade.uniteler.push(unit);
      group = '';
    } else if ((m = line.match(/^>\s*(.+)$/))) {
      group = m[1].trim();
    } else if ((m = line.match(/^-\s*(.+?)\s*(?:\[(.+)\])?$/))) {
      if (!unit) throw new Error('Ünite yok: ' + line);
      unit.konular.push({ no: unit.konular.length + 1, ad: m[1].trim(), grup: group, ipucu: (m[2] || '').trim() });
    } else {
      throw new Error('Tanınmayan satır: ' + line);
    }
  }
  return grades;
}

const DERS_ADI = {
  matematik: 'Matematik',
  edebiyat: 'Türk Dili ve Edebiyatı',
  felsefe: 'Felsefe',
  kimya: 'Kimya',
  fizik: 'Fizik',
  biyoloji: 'Biyoloji',
  tarih: 'Tarih',
};

const PARSED = {};
for (const [bolum, source] of Object.entries(KAYNAK)) PARSED[bolum] = parse(source);

export function mufredat(bolum) {
  return PARSED[bolum] || null;
}

// Bir sayfanın müfredattaki yeri: { sinif, unite, uniteEtiket, uniteAdi, konu, konuAdi, program } ya da null
export function konuBul(bolum, sinif, unite, konu) {
  const g = (PARSED[bolum] || []).find((x) => x.sinif === Number(sinif));
  const u = g && g.uniteler[Number(unite) - 1];
  const k = u && u.konular[Number(konu) - 1];
  if (!k) return null;
  return {
    sinif: g.sinif,
    unite: u.no,
    uniteEtiket: u.etiket,
    uniteAdi: u.ad,
    konu: k.no,
    konuAdi: k.ad,
    grup: k.grup,
    program: g.program,
  };
}

// Yapay zekâ için: her konunun "sınıf.ünite.konu" kodlu listesi
export function mufredatMetni(bolum) {
  const grades = PARSED[bolum];
  if (!grades) return '';
  const out = [`${DERS_ADI[bolum]} dersi`];
  for (const g of grades) {
    out.push(`${g.sinif}. sınıf`);
    for (const u of g.uniteler) {
      out.push(`  ${g.sinif}.${u.no} ${u.etiket}: ${u.ad}`);
      for (const k of u.konular) {
        const extra = [k.grup, k.ipucu].filter(Boolean).join('; ');
        out.push(`    ${g.sinif}.${u.no}.${k.no} ${k.ad}${extra ? ` (${extra})` : ''}`);
      }
    }
  }
  return out.join('\n');
}

// "10.1.2" biçimindeki kodu çözer; müfredatta yoksa null
export function koduCoz(bolum, kod) {
  const m = String(kod || '').match(/(\d{1,2})\s*\.\s*(\d{1,2})\s*\.\s*(\d{1,2})/);
  if (!m) return null;
  return konuBul(bolum, Number(m[1]), Number(m[2]), Number(m[3]));
}

// Tarayıcıdaki "müfredattaki yerini değiştir" penceresi için: ipuçları olmadan bütün ağaç
export function mufredatAgaci() {
  const out = {};
  for (const [bolum, grades] of Object.entries(PARSED)) {
    out[bolum] = grades.map((g) => ({
      sinif: g.sinif,
      program: g.program,
      uniteler: g.uniteler.map((u) => ({ no: u.no, etiket: u.etiket, ad: u.ad, konular: u.konular.map((k) => k.ad) })),
    }));
  }
  return { surum: MUFREDAT_SURUM, dersler: DERS_ADI, bolumler: out };
}
