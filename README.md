# Anıl’ın Defteri

Arkadaşlarının ders notu fotoğraflarını yüklediği, yalnızca QR kodla girilen ve fotoğrafları yalnızca parolayı bilenin gördüğü site. Her şey tek bir platformda çalışır: **Cloudflare** (sayfa barındırma, fotoğraf depolama ve yapay zekâ denetimi). Ücretsiz plan yeterlidir.

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

Site ilk açıldığında kendi adresini de aynı veritabanına yazar; adresi kaybedersen oradan bulunabilir.

## Nasıl çalışır

- **Giriş:** Her QR kodun içinde gizli bir anahtar vardır. Kod okutulunca sunucu 12 saat geçerli, imzalı bir oturum çerezi verir. Kod ya da giriş şifresi olmadan kimse fotoğraf yükleyemez. Birden çok kod oluşturabilirsin (örneğin sınıf başına bir tane); arşivden kaldırdığın kod çalışmaz. Kodlar fotoğraf deposunda durur; Cloudflare’deki ayar veritabanının `ayarlar` tablosuna anahtarı `qr:<kodun SHA-256 özeti>`, değeri `{"label": "…", "token": "<kod>"}` olan bir satır eklenerek de kod tanımlanabilir. Bu kodlar da arşivde görünür ve oradan kaldırılabilir.
- **Yükleme:** İsim → bölüm (Matematik, Edebiyat, Felsefe, Kimya, Fizik, Biyoloji, Tarih) → fotoğraflar. Fotoğraflar telefonda küçültülerek gönderilir (en uzun kenar 1600 piksel).
- **Denetim:** İsim ve not önce yerel küfür listesinden, ardından yapay zekâdan geçer. Uygunsuz isim giren kişi siteden atılır ve cihazı 30 gün engellenir. Her fotoğraf yapay zekâyla incelenir; uygunsuzsa kabul edilmez, üçüncü uygunsuz fotoğrafta kişi siteden atılır. Denetim herhangi bir nedenle çalışmazsa fotoğraf kabul edilmez.
- **Yazıya dökme:** Aynı inceleme sırasında sayfadaki tüm yazı (el yazısı dahil, Türkçe harfleri ve formülleriyle) çıkarılır. Yazı okunaklıysa sayfa, bölümünün **defterine** temiz bir sayfa olarak yazılır. Sayfadaki çizim, diyagram ve grafikler de fotoğraftan kesilir, kâğıt zemini ve eski satır çizgileri temizlenerek yazıda geçtikleri yere mürekkep çizimi gibi konur; etiketleri şeklin altyazısında da yazılır. Kesme ve temizleme tarayıcıda yapılır, yapay zekâ kotası harcamaz. Okunaksız sayfalar arşivde kalır ama deftere girmez; yükleyene daha net bir fotoğraf eklemesi söylenir. Bu özellikten önce yüklenen sayfalar için arşivde **Hepsini yazıya dök** düğmesi çıkar; sayfalar en eskisinden başlayarak okunur ve aralarındaki kopyalar ayıklanır.
- **Kopyalar:** Aynı fotoğraf ya da aynı yazının başka bir fotoğrafı yeniden gelirse yükleyene “Var zaten” denir ve sayfa ikinci kez kaydedilmez. Aynı sayfanın daha eksiksiz ya da daha okunaklı bir kopyası gelirse eskisi otomatik silinir; yenisi defterde onun yerini alır. Arşivde aynı sayfadan iki tane kalmaz.
- **Arşiv:** Fotoğrafları ve defterleri yalnızca parolayı bilen görür. Her sayfayı büyütüp döndürebilir, bölümünü değiştirebilir, başka fotoğrafla değiştirebilir, indirebilir ya da silebilirsin. **Yazı** görünümünde sayfanın yazıya dökülmüş hâlini temiz bir defter sayfası görseli olarak görür ve indirirsin; yanlış okunan yeri **Yazıyı düzelt** ile düzeltebilir, **Yeniden oku** ile yapay zekâya tekrar okutabilirsin. **Defterler** sekmesinde her bölümün defterini sayfa çevirerek okursun. Yanlışlıkla atılan biri olursa **Engelleri kaldır** düğmesi herkesin engelini kaldırır.

## Ücretsiz plan sınırları (yaklaşık)

| Ne | Sınır |
| --- | --- |
| Fotoğraf yükleme | Günde ~450 (depolama: günde 1.000 yazma) |
| Denetim ve yazıya dökme | Günde ~600 sayfa (Workers AI: günde 10.000 nöron, sayfa başına ~15) |
| Toplam fotoğraf | ~2.000 (1 GB depolama) |
| Yazılar ve defterler | Ayar veritabanında (D1, 5 GB; günde 100.000 satır yazma) |

Günlük sınır dolarsa site bunu ziyaretçiye söyler; sınırlar her gün UTC gece yarısı sıfırlanır. Daha fazlası gerekirse Cloudflare Workers Paid planına (aylık 5 $) geçebilirsin.

## Ayarlar

`wrangler.jsonc` içindeki `vars` bölümü: `SESSION_HOURS` (QR girişinin süresi), `ADMIN_HOURS` (arşivin açık kalma süresi), `MAX_REJECTIONS` (kaç uygunsuz fotoğrafta siteden atılsın), `MAX_UPLOADS_PER_SESSION`. Yapay zekâ modelleri `VISION_MODEL` ve `TEXT_MODEL` ile değiştirilebilir; varsayılanlar `src/worker.js` dosyasının başındadır.

## Bilmen gerekenler

- Denetim ve yazıya dökme Workers AI üzerindeki Google Gemma 4 modeliyle yapılır; çalışmazsa Llama 4 Scout devreye girer. İkisi de çalışmazsa fotoğraf yalnızca Meta Llama 3.2 Vision ile denetlenip eklenir, yazısı daha sonra arşivden **Yazıya dök** ile çıkarılır. Llama 3.2 Vision ilk kullanımda bir kez lisans onayı ister; site onayı senin hesabın adına kendiliğinden gönderir.
- Engelleme, cihazdaki imzalı çereze dayanır. Tarayıcı verilerini silen biri QR kodu yeniden okutarak girebilir. Okul ağında herkes aynı IP adresini paylaştığı için IP’ye göre engelleme bilerek kullanılmadı.
- Yapay zekâ denetimi ve okuması hatasız değildir. Kabul edilen her fotoğrafı arşivde görüp silebilir, yanlış okunan yazıyı düzeltebilirsin.
- Site arama motorlarına kapalıdır.

## Dosyalar

- `public/index.html`: sitenin tamamı (tasarım, animasyonlar, akış, arşiv)
- `src/worker.js`: sunucu (QR girişi, parola, denetim, depolama)
- `wrangler.jsonc`: Cloudflare ayarları
