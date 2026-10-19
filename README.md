# Anıl’ın Defteri

Arkadaşlarının ders notu fotoğraflarını yüklediği, yalnızca QR kodla girilen ve fotoğrafları yalnızca parolayı bilenin gördüğü site. Okuma şifresini bilenler defterlerin temize çekilmiş yazılarını okuyup geri bildirim gönderebilir. Her şey tek bir platformda çalışır: **Cloudflare** (sayfa barındırma, fotoğraf depolama ve yapay zekâ). Ücretsiz plan yeterlidir.

## Yayınlama

Bu depo Cloudflare **Workers Builds** ile bağlanır. Bağlantıdan sonra depoya gönderilen her değişiklik siteyi kendiliğinden günceller. Depoda hiçbir sır yoktur; parolanın yalnızca şifreli özeti Cloudflare hesabındaki ayar veritabanında durur.

İlk bağlantı (bir kez, telefondan da olur):

1. [Cloudflare panelinde Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages/create) sayfasını aç ve **Create application**’a dokun.
2. **GitHub**’ı seç. İstenirse Cloudflare’in GitHub uygulamasına bu depo için izin ver.
3. Listeden **anilin-defteri** deposunu seç. Proje adını değiştirme (`wrangler.jsonc` içindeki adla aynı olmalı).
4. **Save and Deploy**’a dokun. İlk Worker’ın buysa Cloudflare senden bir `workers.dev` alt alan adı seçmeni ister.
5. Sitenin adresi Worker’ın sayfasında görünür: `https://anilin-defteri.<alt-alan-adın>.workers.dev`

Fotoğraf deposu (KV, `anilin-defteri`) ve ayar veritabanı (D1, `anilin-defteri-ayar`) Cloudflare hesabında hazır; kimlikleri `wrangler.jsonc` içinde yazılı.

Bilgisayardan yayınlamak istersen: `npm install`, `npm run giris`, `npm run yayinla`.

## İlk kullanım

Siteyi aç, sağ üstteki lacivert mühre dokun, parolanı gir. **Giriş QR kodları** sekmesinden **QR kodu oluştur**’a bas. Kodu yazdırabilir, PNG olarak indirebilir ya da telefonundan gösterebilirsin.

## Parola

Parolanın kendisi depoda ya da kodda yer almaz. Cloudflare hesabındaki `anilin-defteri-ayar` veritabanında yalnızca tuzlu PBKDF2 özeti durur. Parolayı değiştirmek için Worker’ın **Settings → Variables and Secrets** bölümüne `ADMIN_PASSWORD` adlı bir **Secret** ekleyebilirsin; tanımlanırsa veritabanındaki özetin yerine o geçerli olur. Bilgisayardan aynısı: `npm run parola`.

**Giriş şifresi:** QR kodu okutamayanlar giriş ekranındaki **Şifreyle gir** düğmesiyle girebilir. Bu şifre yalnızca deftere sayfa eklemeye izin verir, arşivi açmaz. Telefonda kolay yazılsın diye büyük-küçük harfe, boşluklara ve ı/i farkına takılmaz. Özeti aynı veritabanında `giris-parola` satırında, arşiv parolasıyla aynı biçimde durur (özet, şifrenin boşluksuz, küçük harfli ve ı yerine i yazılmış hâlinden alınır). Değiştirmek için Worker’a `ENTRY_PASSWORD` adlı bir Secret ekleyebilirsin; satırı silersen şifreyle giriş kapanır ve düğme kaybolur. Yanlış denemeler aynı ağdan 15 dakikada 20 ile sınırlıdır.

**Okuma şifresi:** Defterleri okumak isteyenler giriş ekranındaki **defterleri aç** bağlantısından ya da doğrudan `https://<sitenin adresi>/#defterler` adresinden okuma şifresiyle girer. Bu şifre yalnızca defterlerin yazılarını açar: fotoğraflar, yükleyenlerin adları, arşiv ve sayfa yükleme kapalı kalır. Şifre büyük-küçük harfe, boşluklara, ı/i farkına ve Türkçe harflere takılmaz (ç, ğ, ö, ş, ü yerine c, g, o, s, u yazılabilir). Özeti aynı veritabanında `okur-parola` satırında, öbür parolalarla aynı biçimde durur (özet, şifrenin bu biçimde sadeleştirilmiş hâlinden alınır). Değiştirmek için Worker’a `READER_PASSWORD` adlı bir Secret ekleyebilirsin; satırı silersen okuma alanı kapanır. Okuma oturumu 30 gün sürer; yanlış denemeler aynı ağdan 15 dakikada 20 ile sınırlıdır.

Site ilk açıldığında kendi adresini de aynı veritabanına yazar; adresi kaybedersen oradan bulunabilir.

## Nasıl çalışır

- **Giriş:** Her QR kodun içinde gizli bir anahtar vardır. Kod okutulunca sunucu 12 saat geçerli, imzalı bir oturum çerezi verir. Kod ya da giriş şifresi olmadan kimse fotoğraf yükleyemez. Birden çok kod oluşturabilirsin (örneğin sınıf başına bir tane); arşivden kaldırdığın kod çalışmaz. Kodlar fotoğraf deposunda durur; Cloudflare’deki ayar veritabanının `ayarlar` tablosuna anahtarı `qr:<kodun SHA-256 özeti>`, değeri `{"label": "…", "token": "<kod>"}` olan bir satır eklenerek de kod tanımlanabilir. Bu kodlar da arşivde görünür ve oradan kaldırılabilir.
- **Yükleme:** İsim → bölüm (Matematik, Edebiyat, Felsefe, Kimya, Fizik, Biyoloji, Tarih) → fotoğraflar. Fotoğraflar telefonda küçültülerek gönderilir (en uzun kenar 1600 piksel).
- **Denetim:** İsim ve not önce yerel küfür listesinden, ardından yapay zekâdan geçer. Uygunsuz isim giren kişi siteden atılır ve cihazı 30 gün engellenir. Her fotoğraf yapay zekâyla incelenir; uygunsuzsa kabul edilmez, üçüncü uygunsuz fotoğrafta kişi siteden atılır. Denetim herhangi bir nedenle çalışmazsa fotoğraf kabul edilmez.
- **Yazıya dökme:** Aynı inceleme sırasında sayfadaki tüm yazı (el yazısı dahil, Türkçe harfleri ve formülleriyle) çıkarılır. Yazı okunaklıysa sayfa **Yazılar**’a eklenir. Sayfadaki çizim, diyagram ve grafikler de fotoğraftan kesilir, kâğıt zemini ve eski satır çizgileri temizlenerek yazıda geçtikleri yere mürekkep çizimi gibi konur; etiketleri şeklin altyazısında da yazılır. Kesme ve temizleme tarayıcıda yapılır, yapay zekâ kotası harcamaz. Okunaksız sayfalar arşivde kalır ama Yazılar’a girmez; yükleyene daha net bir fotoğraf eklemesi söylenir. Bu özellikten önce yüklenen sayfalar için arşivde **Hepsini yazıya dök** düğmesi çıkar; sayfalar en eskisinden başlayarak okunur. Şekiller eklenmeden önce okunmuş sayfalar da bu sıraya girer; yeniden okununca çizimleri de yazısına geçer. Yazısı elle düzeltilmiş sayfalar bu toplu okumaya alınmaz, elle yazılan yazı ezilmez.
- **MEB müfredatındaki yer:** Yazısı çıkan her sayfanın hangi sınıfın, hangi ünitenin (temanın) kaçıncı konusu olduğunu yapay zekâ MEB müfredatına göre belirler. Ders, sayfanın yüklendiği bölümdür. Yükleyen kişi teşekkür ekranında eklediği sayfaların yerini görür (örneğin “10. sınıf, 2. Tema: …, 3. konu: …”). Arşivde yanlış bulunan yeri görüntüleyicideki **Değiştir** ile elle seçebilir ya da **Yapay zekâya yeniden sor** diyebilirsin; elle seçilen yer sonradan ezilmez. Sayfa başka bölüme taşınınca yeri yeni dersin müfredatına göre yeniden belirlenir. Kopyalar yerini aslından alır. Konusu henüz belirlenmemiş sayfalar için arşivde **Konularını belirle** düğmesi çıkar. Müfredat 2026-2027 öğretim yılına göredir ve `src/mufredat.js` dosyasında yazılıdır: 9, 10 ve 11. sınıflar Türkiye Yüzyılı Maarif Modeli programları, 12. sınıf 2018 programları. Felsefe 10 ve 11. sınıflarda okutulur.
- **Kopyalar:** Kopyalar silinmez. Aynı fotoğraf ya da aynı yazının başka bir fotoğrafı yeniden gelirse sayfa yine kaydedilir, **“Var zaten”** olarak işaretlenir ve aslına bağlanır; yükleyene de bu söylenir. Aslının kartında kaç kopya geldiği yazar, kopyanın görüntüleyicisinde **Aslını aç** düğmesi çıkar. Aynı sayfanın daha eksiksiz ya da daha okunaklı bir hâli gelirse o asıl olur, eskiler onun kopyası olarak işaretlenir. Asıl sayfa silinirse en eski kopyası asıl olur.
- **Arşiv:** Fotoğrafları ve yazıları yalnızca parolayı bilen görür. Her sayfayı büyütüp döndürebilir, bölümünü değiştirebilir, başka fotoğrafla değiştirebilir, indirebilir ya da silebilirsin. **Yazı** görünümünde sayfanın yazıya dökülmüş hâlini temiz bir defter sayfası görseli olarak görür ve indirirsin; görselin başında müfredattaki yeri yazar. Yanlış okunan yeri **Yazıyı düzelt** ile düzeltebilir, **Yeniden oku** ile yapay zekâya tekrar okutabilirsin. Yanlışlıkla atılan biri olursa **Engelleri kaldır** düğmesi herkesin engelini kaldırır.
- **Yazılar:** Okunaklı bütün sayfaların yazısı, çizimleriyle birlikte, iki sıralamayla okunur. **Yüklenme sırası** sayfaları geldikleri sırayla numaralar (1., 2., 3. yüklenen…). **Müfredat sırası** onları ders, sınıf, ünite ve konu sırasına dizer; her yazının yanında konunun numarası durur. Her yazıda öbür sıradaki yeri de yazar. Müfredat sırasında her sınıfın başında o sınıfın konularından kaçının defterde olduğu yazar; **Defterde olmayan konular** listesi eksikleri gösterir. Bölüme göre süzülebilir; kopyalar “Var zaten” işaretiyle görünür ve aslına götürür.
- **Yazı ekleme ve düzenleme:** Yazılar’daki **Yeni yazı** ile deftere fotoğrafsız bir yazı eklenir: bölüm, başlık, yazı, istenirse özet ve anahtar kavramlar. Müfredattaki yerini yapay zekâ belirler ya da elle seçilir. Her yazının **Düzenle** düğmesi aynı düzenleyiciyi açar. Fotoğraftan okunan yazılarda okunan ilk hâl saklanır; **Okunan hâline dön** ile ona dönülür. Elle yazılan yazılar düzenleyiciden silinebilir. Elle yazılanlar kopya karşılaştırmasına girmez.
- **Yapay zekâyla güzelleştirme:** Bir yazıdaki **Yapay zekâyla güzelleştir** düğmesi ya da Yazılar’daki **Hepsini güzelleştir** yazıyı yapay zekâya temize çektirir: yanlış okunan kelimeler, yazım ve Türkçe harfler düzeltilir, yazı başlık, madde ve kısa paragraflarla düzenlenir; bilgi eklenmez, çıkarılmaz, şekiller yerinde kalır. Yazının başına kısa bir özet ve anahtar kavramlar eklenir; yapay zekânın neleri düzelttiği yazının altında listelenir. Sonuç aslından çok kısa ya da çok uzunsa, aslına yeterince benzemiyorsa ya da şekilleri eksikse kaydedilmez. Yapay zekâ yazının çoğunu anlamsız bulursa (fotoğraf yanlış okunmuşsa) yazı kaydedilmez ve Yazılar’da “Yanlış okunmuş olabilir” diye işaretlenir; o sayfa **Yeniden oku** ile yeniden okutulur. Düzenleyicide önce önizleme görülür (**Eski hâline al** önizlemeyi geri alır); kaydedilmiş bir güzelleştirme **Okunan hâline dön** ile geri alınır.
- **Üç defter:** Yazılar’da ve okuma alanında üç defter vardır: **Ders notları** (fotoğraflardan okunan ve derse bağlı yazılar), **Yazılarım** (okuyanlara “Anıl’ın yazıları”; Anıl’ın kendi yazdıkları) ve **Gelişmiş yapay zekâ** (Claude’un fotoğraflardan baştan yazdıkları).
- **Yazılarım ve görseller:** “Yeni yazı” ile yazılan her yazı Yazılarım’da da görünür. Yazı bir derse bağlı olmak zorunda değildir (**Genel**); Genel yazılar ders notlarına girmez. Düzenleyicideki **Görsel ekle** ile yazıya görsel eklenir: görsel telefonda küçültülüp yüklenir, yazıda kendi satırında `[Görsel: kimlik | açıklama]` olarak durur ve okuyanlara o satırın yerinde görünür. Satır silinince görsel de silinir. Görseller fotoğraf deposunda (`gorsel:` anahtarlarıyla) durur ve yalnızca okuma şifresi ya da arşiv parolasıyla açılır.
- **Gelişmiş yapay zekâ:** Sayfaların fotoğrafları, Worker’ın saatlik zamanlayıcısıyla (`wrangler.jsonc` > `triggers`, her seferde en fazla 5 sayfa) ayar veritabanındaki bir kuyruğa konur (`claude_kuyruk`, fotoğraflar base64 parçalar hâlinde `claude_parca` tablosunda). Anıl’ın Claude’daki zamanlanmış görevi her pazar ve perşembe sabahı Cloudflare bağlantısıyla kuyruğu okur; Claude Sonnet 5.5 sayfaları fotoğraflarına bakarak düzgün, resmî Türkçeyle baştan yazar ve sonucu `gelismis` tablosuna yazar; biten sayfalar kuyruktan silinir. Site Claude’u kendisi çağırmaz, bu yüzden siteye ek ücret yoktur. Kopyalar kuyruğa girmez; fotoğrafı değişen sayfa yeniden kuyruğa girer. Arşivde Claude’un bir yazısı **Yeniden yazdır** ile silinir ve sayfa bir sonraki çalışmada baştan yazılır.
- **Defterleri okuma:** Okuma şifresiyle girenler okunaklı ve kopya olmayan bütün yazıları şekilleriyle, Yazılar’daki iki sıralamayla okur; bölüme göre süzer ve arar (arama Türkçe harflere ve büyük-küçük harfe takılmaz). Yükleyenlerin adları ve fotoğraflar gösterilmez. Şekiller arşivi açanın tarayıcısında fotoğraftan kesilir ve Yazılar sekmesi açılınca okuyanlar için yayımlanır. Arşivdeki **Okuyanlar nasıl görüyor?** düğmesi bu görünümü açar.
- **Geri bildirim:** Okuyanlar her yazıdaki **Geri bildirim yaz** ile o yazı için, sayfanın üstündeki düğmeyle de genel olarak mesaj gönderir: hata, öneri, soru ya da teşekkür; ad yazmak isteğe bağlıdır. Mesajlar arşivin **Geri bildirim** sekmesine gelir, yenilerin sayısı sekmede görünür. Okundu sayılabilir, silinebilir, ilgili yazıya gidilebilir. Mesajlar küfür listesinden geçer; bir okuma oturumu saatte en fazla 10, bütün site günde en fazla 300 mesaj gönderebilir.

## Ücretsiz plan sınırları (yaklaşık)

| Ne | Sınır |
| --- | --- |
| Fotoğraf yükleme | Günde ~450 (depolama: günde 1.000 yazma) |
| Denetim, yazıya dökme ve müfredattaki yer | Günde ~180 sayfa (Workers AI: günde 10.000 nöron; sayfa başına okuma ~15-27, müfredattaki yer ~25 nöron) |
| Yapay zekâyla güzelleştirme | Aynı günlük nöron kotasından, yazı başına ~15-30 nöron (çok uzun yazılarda daha fazla); bir yazı ~5-20 saniye sürer |
| Okuma ve geri bildirim | Kota harcamaz (geri bildirimler ayar veritabanında durur) |
| Gelişmiş yapay zekâ | Site kotası harcamaz; yazıya dökme Anıl’ın Claude hesabında çalışır. Kuyruktaki fotoğraflar yazılınca silinir |
| Yazılarım’daki görseller | Fotoğraf deposundan (KV); görsel başına bir yazma |
| Toplam fotoğraf | ~2.000 (1 GB depolama) |
| Yazılar ve müfredat bilgisi | Ayar veritabanında (D1, 5 GB; günde 100.000 satır yazma) |

Günlük sınır dolarsa site bunu ziyaretçiye söyler; sınırlar her gün UTC gece yarısı sıfırlanır. Sınır dolduğu için okunamayan ya da konusu belirlenemeyen sayfalar yine kaydedilir; ertesi gün arşivdeki toplu düğmeyle tamamlanır. Daha fazlası gerekirse Cloudflare Workers Paid planına (aylık 5 $) geçebilirsin.

## Ayarlar

`wrangler.jsonc` içindeki `vars` bölümü: `SESSION_HOURS` (QR girişinin süresi), `ADMIN_HOURS` (arşivin açık kalma süresi), `MAX_REJECTIONS` (kaç uygunsuz fotoğrafta siteden atılsın), `MAX_UPLOADS_PER_SESSION`. `READER_HOURS` eklenirse okuma oturumunun süresini (saat, varsayılan 720) değiştirir. Yapay zekâ modelleri `VISION_MODEL`, `TEXT_MODEL`, `TOPIC_MODEL` (müfredattaki yer) ve `WRITE_MODEL` (güzelleştirme) ile değiştirilebilir; varsayılanlar `src/worker.js` dosyasının başındadır.

## Bilmen gerekenler

- Denetim ve yazıya dökme Workers AI üzerindeki Google Gemma 4 modeliyle yapılır; çalışmazsa Llama 4 Scout devreye girer. İkisi de çalışmazsa fotoğraf yalnızca Meta Llama 3.2 Vision ile denetlenip eklenir, yazısı daha sonra arşivden **Yazıya dök** ile çıkarılır. Llama 3.2 Vision ilk kullanımda bir kez lisans onayı ister; site onayı senin hesabın adına kendiliğinden gönderir.
- Güzelleştirme de Workers AI üzerindeki Gemma 4 ile yapılır, çalışmazsa Llama 4 Scout devreye girer. Bu yüzden ücretsizdir; Claude gibi ücretli modeller ve notları Google’a gönderen ücretsiz Gemini API kullanılmadı. Yapay zekânın düzenlediği yazı da hatasız olmayabilir; okunan hâli her zaman saklanır.
- Engelleme, cihazdaki imzalı çereze dayanır. Tarayıcı verilerini silen biri QR kodu yeniden okutarak girebilir. Okul ağında herkes aynı IP adresini paylaştığı için IP’ye göre engelleme bilerek kullanılmadı.
- Yapay zekâ denetimi ve okuması hatasız değildir. Kabul edilen her fotoğrafı arşivde görüp silebilir, yanlış okunan yazıyı düzeltebilirsin. Müfredattaki yer de yapay zekânın tahminidir; yanlışsa görüntüleyicide düzeltilir.
- MEB programları değişirse (örneğin 12. sınıfta Maarif Modeli 2027-2028’de başlayınca) `src/mufredat.js` güncellenmelidir.
- Site arama motorlarına kapalıdır.

## Dosyalar

- `public/index.html`: sitenin tamamı (tasarım, animasyonlar, akış, arşiv)
- `src/worker.js`: sunucu (QR girişi, parolalar, denetim, yazıya dökme, kopyalar, güzelleştirme, okuma alanı, geri bildirim, Claude kuyruğu, görseller, depolama)
- `src/mufredat.js`: MEB müfredatı (dersler, sınıflar, üniteler ve konular)
- `wrangler.jsonc`: Cloudflare ayarları
