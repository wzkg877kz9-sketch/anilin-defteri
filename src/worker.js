/**
 * Anıl'ın Defteri — Cloudflare Worker
 *
 * Tek platform: sayfa barındırma (statik dosyalar), fotoğraf depolama (KV),
 * otomatik içerik denetimi (Workers AI) ve QR + parola korumalı erişim.
 *
 * Güvenlik özeti
 * - Siteye giriş yalnızca geçerli bir QR bağlantısıyla (/?giris=KOD) açılır.
 *   Sunucu imzalı, HttpOnly bir oturum çerezi verir; çerez yoksa yükleme API'si çalışmaz.
 * - Fotoğrafları görmek için parola gerekir. Parola kodda ya da depoda yoktur; Cloudflare'de
 *   ADMIN_PASSWORD adlı gizli değişken (Secret) olarak saklanır.
 * - Her isim ve fotoğraf sunucuda denetlenir. Denetim çalışmazsa fotoğraf kabul edilmez.
 * - Uygunsuz isim giren kişi siteden çıkarılır ve cihazı engellenir.
 */
import { Buffer } from 'node:buffer';

const SECTIONS = ['matematik', 'edebiyat', 'felsefe', 'kimya', 'fizik', 'biyoloji', 'tarih'];
const SUBJECTS = [...SECTIONS, 'diger'];
const CATEGORIES = ['none', 'sexual', 'violence', 'weapon', 'drugs', 'hate', 'gesture', 'profanity', 'bullying', 'personal_data', 'disturbing', 'other'];
const REASONS = {
  none: '',
  sexual: 'Fotoğrafta cinsel veya müstehcen içerik var.',
  violence: 'Fotoğrafta şiddet ya da kan var.',
  weapon: 'Fotoğrafta tehditkâr bir silah görüntüsü var.',
  drugs: 'Fotoğraf uyuşturucu, alkol veya sigara içeriyor.',
  hate: 'Fotoğrafta nefret içeren bir sembol ya da ifade var.',
  gesture: 'Fotoğrafta kaba bir el hareketi var.',
  profanity: 'Fotoğrafta küfür veya hakaret içeren bir yazı var.',
  bullying: 'Fotoğraf birini aşağılıyor ya da alaya alıyor.',
  personal_data: 'Fotoğrafta kimlik, telefon ya da adres gibi kişisel bilgiler görünüyor.',
  disturbing: 'Fotoğraf rahatsız edici bir görüntü içeriyor.',
  other: 'Fotoğrafta uygunsuz içerik bulundu.',
};

const COOKIE_SESSION = 'defter_oturum';
const COOKIE_ADMIN = 'defter_anahtar';
const COOKIE_BAN = 'defter_engel';
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const BAN_DAYS = 30;

const enc = new TextEncoder();
const dec = new TextDecoder();

export default {
  async fetch(request, env, ctx) {
    try {
      return await handle(request, env, ctx);
    } catch (err) {
      console.error('Beklenmeyen hata:', err && (err.stack || err));
      return json({ error: 'Sunucuda beklenmeyen bir hata oluştu. Biraz sonra tekrar dene.' }, 500);
    }
  },
};

/* ------------------------------------------------------------------ */
/* Ayarlar (wrangler.jsonc içindeki "vars" ile değiştirilebilir)       */
/* ------------------------------------------------------------------ */

function config(env) {
  const num = (v, d) => {
    const x = Number(v);
    return Number.isFinite(x) && x > 0 ? x : d;
  };
  return {
    sessionHours: num(env.SESSION_HOURS, 12),
    adminHours: num(env.ADMIN_HOURS, 8),
    maxRejections: num(env.MAX_REJECTIONS, 3),
    maxUploads: num(env.MAX_UPLOADS_PER_SESSION, 60),
    visionModel: env.VISION_MODEL || '@cf/meta/llama-3.2-11b-vision-instruct',
    visionModelFallback: env.VISION_MODEL_FALLBACK || '@cf/meta/llama-4-scout-17b-16e-instruct',
    textModel: env.TEXT_MODEL || '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    textModelFallback: env.TEXT_MODEL_FALLBACK || '@cf/meta/llama-3.1-8b-instruct-fast',
  };
}

/* ------------------------------------------------------------------ */
/* Yönlendirme                                                         */
/* ------------------------------------------------------------------ */

async function handle(request, env, ctx) {
  const url = new URL(request.url);
  const cfg = config(env);

  // QR kodun içindeki bağlantı: https://site/?giris=KOD
  if ((request.method === 'GET' || request.method === 'HEAD') && url.pathname === '/' && url.searchParams.has('giris')) {
    return qrRedirect(request, env, cfg, url.searchParams.get('giris'));
  }

  if (url.pathname.startsWith('/api/')) {
    const res = await api(request, env, ctx, cfg, url);
    if (!res.headers.has('Cache-Control')) res.headers.set('Cache-Control', 'no-store');
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }

  const asset = await env.ASSETS.fetch(request);
  return withPageHeaders(asset);
}

function withPageHeaders(asset) {
  const res = new Response(asset.body, asset);
  const type = res.headers.get('Content-Type') || '';
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'no-referrer');
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  res.headers.set('Permissions-Policy', 'camera=(self), microphone=(), geolocation=(), payment=()');
  if (type.includes('text/html')) {
    res.headers.set('Cache-Control', 'no-cache');
    res.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        'font-src https://fonts.gstatic.com',
        "img-src 'self' data: blob:",
        "media-src 'self' blob:",
        "connect-src 'self'",
        "worker-src 'self' blob:",
        "frame-ancestors 'none'",
        "base-uri 'none'",
        "form-action 'self'",
      ].join('; '),
    );
  }
  return res;
}

async function api(request, env, ctx, cfg, url) {
  const method = request.method;
  const path = url.pathname.replace(/\/+$/, '');
  const mutating = method !== 'GET' && method !== 'HEAD';
  if (mutating && !sameOrigin(request, url)) return json({ error: 'İstek reddedildi.' }, 403);

  if (path === '/api/durum' && method === 'GET') return status(request, env, cfg);
  if (path === '/api/giris' && method === 'POST') return enterWithToken(request, env, cfg);
  if (path === '/api/isim' && method === 'POST') return checkNameRoute(request, env, cfg);
  if (path === '/api/yukle' && method === 'POST') return upload(request, env, ctx, cfg);
  if (path === '/api/yonetici/giris' && method === 'POST') return adminLogin(request, env, cfg);
  if (path === '/api/yonetici/cikis' && method === 'POST') return adminLogout();

  // Buradan sonrası yalnızca parolayı bilen içindir.
  if (path.startsWith('/api/yonetici/')) {
    const admin = await readCookieToken(request, env, COOKIE_ADMIN, 'a');
    if (!admin) return json({ error: 'Oturumun sona erdi. Parolayı yeniden gir.', auth: true }, 401);

    if (path === '/api/yonetici/liste' && method === 'GET') return adminList(env);
    if (path === '/api/yonetici/engelleri-kaldir' && method === 'POST') return liftBans(env);

    const m = path.match(/^\/api\/yonetici\/(foto|guncelle|degistir|qr)(?:\/([A-Za-z0-9_-]+))?$/);
    if (m) {
      const [, kind, id] = m;
      if (kind === 'foto' && id && method === 'GET') return adminPhoto(env, id);
      if (kind === 'foto' && id && method === 'DELETE') return adminDelete(env, ctx, id);
      if (kind === 'guncelle' && id && method === 'POST') return adminUpdate(request, env, ctx, id);
      if (kind === 'degistir' && id && method === 'POST') return adminReplace(request, env, url, id);
      if (kind === 'qr' && !id && method === 'GET') return qrList(env, url);
      if (kind === 'qr' && !id && method === 'POST') return qrCreate(request, env, url);
      if (kind === 'qr' && id && method === 'DELETE') return qrRevoke(env, id);
    }
  }
  return json({ error: 'Bulunamadı.' }, 404);
}

function sameOrigin(request, url) {
  const origin = request.headers.get('Origin');
  if (origin) return origin === url.origin;
  const site = request.headers.get('Sec-Fetch-Site');
  return !site || site === 'same-origin' || site === 'none';
}

/* ------------------------------------------------------------------ */
/* Ziyaretçi: durum, QR girişi, isim kontrolü, yükleme                 */
/* ------------------------------------------------------------------ */

async function status(request, env, cfg) {
  const [session, banned, admin, counts] = await Promise.all([
    readSession(request, env),
    isBanned(request, env),
    readCookieToken(request, env, COOKIE_ADMIN, 'a'),
    getCounts(env),
  ]);
  return json({
    mode: 'live',
    entered: !!session && !banned,
    banned,
    admin: !!admin,
    rejections: session ? session.rj || 0 : 0,
    maxRejections: cfg.maxRejections,
    counts,
    total: SECTIONS.reduce((sum, s) => sum + counts[s], 0),
    passwordSet: passwordConfigured(env),
  });
}

async function qrRedirect(request, env, cfg, token) {
  if (await isBanned(request, env)) return redirect('/?durum=engel');
  const qrId = await findQr(env, token);
  if (!qrId) return redirect('/?durum=gecersiz');
  const session = await startSession(request, env, cfg, qrId);
  return redirect('/?durum=giris', [await sessionCookie(env, session)]);
}

async function enterWithToken(request, env, cfg) {
  if (await isBanned(request, env)) return json({ kicked: true, reason: 'Bu cihazdan siteye erişimin kapatıldı.' }, 403);
  const body = await readJson(request);
  const raw = typeof body?.kod === 'string' ? body.kod.trim() : '';
  const token = extractToken(raw);
  const qrId = await findQr(env, token);
  if (!qrId) return json({ error: 'Bu QR kod geçersiz ya da kaldırılmış. Anıl\'dan yeni bir kod iste.' }, 400);
  const session = await startSession(request, env, cfg, qrId);
  const res = json({ ok: true });
  res.headers.append('Set-Cookie', await sessionCookie(env, session));
  return res;
}

function extractToken(raw) {
  if (!raw) return '';
  try {
    const u = new URL(raw);
    const q = u.searchParams.get('giris');
    if (q) return q;
    if (u.hash.length > 1) return u.hash.slice(1);
  } catch {
    /* düz kod */
  }
  return raw;
}

async function startSession(request, env, cfg, qrId) {
  const now = Date.now();
  const old = await readSession(request, env);
  return {
    k: 's',
    sid: old?.sid || randomId(12),
    q: qrId.slice(0, 8),
    iat: now,
    exp: now + cfg.sessionHours * 3600e3,
    rj: old?.rj || 0, // reddedilen fotoğraf sayısı (QR'ı yeniden okutmak sıfırlamaz)
    up: old?.up || 0, // bu oturumdaki yükleme sayısı
    nh: old?.nh || '', // onaylanan ismin özeti
  };
}

async function checkNameRoute(request, env, cfg) {
  if (await isBanned(request, env)) return json({ kicked: true, reason: 'Bu cihazdan siteye erişimin kapatıldı.' }, 403);
  const session = await readSession(request, env);
  if (!session) return json({ error: 'Oturumun sona erdi. QR kodu yeniden okut.', gate: true }, 401);
  const body = await readJson(request);
  const name = cleanText(body?.isim, 40);
  if (name.length < 2) return json({ error: 'Adını yaz (en az 2 harf).' }, 400);

  const verdict = await moderateText(env, cfg, name, null);
  if (verdict.bad) return banResponse(env, verdict.reason, 'isim');

  session.nh = await nameHash(name);
  const res = json({ ok: true, isim: name });
  res.headers.append('Set-Cookie', await sessionCookie(env, session));
  return res;
}

async function upload(request, env, ctx, cfg) {
  if (await isBanned(request, env)) return json({ kicked: true, reason: 'Bu cihazdan siteye erişimin kapatıldı.' }, 403);
  const session = await readSession(request, env);
  if (!session) return json({ error: 'Oturumun sona erdi. QR kodu yeniden okut.', gate: true }, 401);
  if ((session.up || 0) >= cfg.maxUploads) {
    return json({ error: 'Bu oturumdaki yükleme sınırına ulaştın. Daha sonra QR kodu yeniden okutarak devam edebilirsin.' }, 429);
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Gönderilen veri okunamadı.' }, 400);
  }
  const name = cleanText(form.get('isim'), 40);
  const note = cleanText(form.get('not'), 140);
  const section = String(form.get('bolum') || '');
  const photo = form.get('foto');
  const w = clampInt(form.get('w'), 0, 20000);
  const h = clampInt(form.get('h'), 0, 20000);

  if (!SECTIONS.includes(section)) return json({ error: 'Geçerli bir bölüm seç.' }, 400);
  if (name.length < 2) return json({ error: 'Adını yaz (en az 2 harf).' }, 400);
  if (!photo || typeof photo === 'string') return json({ error: 'Fotoğraf bulunamadı.' }, 400);
  const bytes = new Uint8Array(await photo.arrayBuffer());
  if (!bytes.length) return json({ error: 'Fotoğraf boş görünüyor.' }, 400);
  if (bytes.length > MAX_IMAGE_BYTES) return json({ error: 'Fotoğraf çok büyük (en fazla 5 MB).' }, 413);
  const type = sniffImage(bytes);
  if (!type) return json({ error: 'Yalnızca JPEG, PNG veya WebP fotoğraf yükleyebilirsin.' }, 415);

  // 1) İsim ve not denetimi. Daha önce onaylanan isim yeniden yapay zekâya sorulmaz.
  const hash = await nameHash(name);
  const nameToCheck = session.nh === hash ? null : name;
  const textVerdict = await moderateText(env, cfg, nameToCheck, note || null);
  if (textVerdict.bad) return banResponse(env, textVerdict.reason, textVerdict.field);
  session.nh = hash;

  // 2) Fotoğraf denetimi. Denetim çalışmazsa fotoğraf kabul edilmez.
  let verdict;
  try {
    verdict = await moderateImage(env, cfg, bytes, type);
  } catch (e) {
    console.error('Görsel denetimi başarısız:', e && (e.message || e));
    const res = json({ error: aiErrorMessage(e), retry: true }, 503);
    res.headers.append('Set-Cookie', await sessionCookie(env, session));
    return res;
  }
  if (!verdict.safe) {
    session.rj = (session.rj || 0) + 1;
    if (session.rj >= cfg.maxRejections) {
      return banResponse(env, 'Uygunsuz içerik yüklemeye devam ettiğin için siteden çıkarıldın.', 'foto');
    }
    const res = json(
      { rejected: true, category: verdict.category, reason: verdict.reason, rejections: session.rj, maxRejections: cfg.maxRejections },
      422,
    );
    res.headers.append('Set-Cookie', await sessionCookie(env, session));
    return res;
  }

  // 3) Kaydet
  const now = Date.now();
  const id = String(9999999999999 - now).padStart(13, '0') + '-' + randomId(8, 'abcdefghijklmnopqrstuvwxyz0123456789');
  const meta = fitMeta({ s: section, n: name, k: note, d: verdict.summary, j: verdict.subject, t: now, w, h, z: bytes.length, c: type });
  await env.DEFTER.put('p:' + id, bytes, { metadata: meta });
  session.up = (session.up || 0) + 1;
  ctx.waitUntil(adjustCounts(env, { [section]: 1 }));

  const res = json({ ok: true, id });
  res.headers.append('Set-Cookie', await sessionCookie(env, session));
  return res;
}

/* ------------------------------------------------------------------ */
/* Yönetici (parolayı bilen)                                           */
/* ------------------------------------------------------------------ */

function passwordConfigured(env) {
  return !!env.ADMIN_PASSWORD;
}

async function verifyAdminPassword(env, pw) {
  if (!env.ADMIN_PASSWORD) return false;
  return safeEqual(pw.normalize('NFC'), String(env.ADMIN_PASSWORD).normalize('NFC'));
}

async function adminLogin(request, env, cfg) {
  if (!passwordConfigured(env)) {
    return json({ error: 'Parola henüz ayarlanmadı. Cloudflare panelinde ADMIN_PASSWORD gizli değişkenini tanımla.' }, 503);
  }
  const ip = request.headers.get('CF-Connecting-IP') || 'yerel';
  const rlKey = 'rl:giris:' + (await sha256hex(ip)).slice(0, 24);
  const tries = Number(await env.DEFTER.get(rlKey)) || 0;
  if (tries >= 8) return json({ error: 'Çok fazla yanlış deneme yapıldı. 15 dakika sonra tekrar dene.' }, 429);

  const body = await readJson(request);
  const pw = typeof body?.parola === 'string' ? body.parola : '';
  const ok = pw.length > 0 && pw.length <= 256 && (await verifyAdminPassword(env, pw));
  if (!ok) {
    await env.DEFTER.put(rlKey, String(tries + 1), { expirationTtl: 900 });
    return json({ error: 'Parola yanlış.' }, 401);
  }
  const now = Date.now();
  const token = await makeToken(env, { k: 'a', iat: now, exp: now + cfg.adminHours * 3600e3 });
  const res = json({ ok: true });
  res.headers.append('Set-Cookie', cookieHeader(COOKIE_ADMIN, token, { maxAge: cfg.adminHours * 3600, sameSite: 'Strict' }));
  return res;
}

function adminLogout() {
  const res = json({ ok: true });
  res.headers.append('Set-Cookie', cookieHeader(COOKIE_ADMIN, '', { maxAge: 0, sameSite: 'Strict' }));
  return res;
}

async function adminList(env) {
  const items = [];
  let cursor;
  do {
    const page = await env.DEFTER.list({ prefix: 'p:', cursor, limit: 1000 });
    for (const k of page.keys) items.push(toItem(k.name.slice(2), k.metadata || {}));
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);

  // Sayaçlar bozulduysa kendiliğinden düzelt
  const counts = zeroCounts();
  for (const it of items) if (it.section in counts) counts[it.section]++;
  const stored = await getCounts(env);
  if (SECTIONS.some((s) => stored[s] !== counts[s])) {
    try {
      await env.DEFTER.put('stat:sayilar', JSON.stringify(counts));
    } catch (e) {
      console.warn('Sayaçlar yazılamadı:', e && e.message);
    }
  }
  return json({ items, counts });
}

async function adminPhoto(env, id) {
  if (!validId(id)) return json({ error: 'Geçersiz sayfa.' }, 400);
  const { value, metadata } = await env.DEFTER.getWithMetadata('p:' + id, { type: 'arrayBuffer' });
  if (!value) return json({ error: 'Sayfa bulunamadı.' }, 404);
  return new Response(value, {
    headers: {
      'Content-Type': metadata?.c || 'image/jpeg',
      'Cache-Control': 'private, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

async function adminUpdate(request, env, ctx, id) {
  if (!validId(id)) return json({ error: 'Geçersiz sayfa.' }, 400);
  const body = (await readJson(request)) || {};
  const { value, metadata } = await env.DEFTER.getWithMetadata('p:' + id, { type: 'arrayBuffer' });
  if (!value) return json({ error: 'Sayfa bulunamadı.' }, 404);
  const meta = { ...(metadata || {}) };
  const oldSection = meta.s;
  if (body.section !== undefined) {
    if (!SECTIONS.includes(body.section)) return json({ error: 'Geçerli bir bölüm seç.' }, 400);
    meta.s = body.section;
  }
  if (body.name !== undefined) meta.n = cleanText(body.name, 40);
  if (body.note !== undefined) meta.k = cleanText(body.note, 140);
  meta.e = Date.now();
  const fitted = fitMeta(meta);
  await env.DEFTER.put('p:' + id, value, { metadata: fitted });
  if (oldSection !== fitted.s) ctx.waitUntil(adjustCounts(env, { [oldSection]: -1, [fitted.s]: 1 }));
  return json({ ok: true, item: toItem(id, fitted) });
}

async function adminReplace(request, env, url, id) {
  if (!validId(id)) return json({ error: 'Geçersiz sayfa.' }, 400);
  const bytes = new Uint8Array(await request.arrayBuffer());
  if (!bytes.length) return json({ error: 'Fotoğraf boş görünüyor.' }, 400);
  if (bytes.length > MAX_IMAGE_BYTES) return json({ error: 'Fotoğraf çok büyük (en fazla 5 MB).' }, 413);
  const type = sniffImage(bytes);
  if (!type) return json({ error: 'Yalnızca JPEG, PNG veya WebP fotoğraf yükleyebilirsin.' }, 415);
  const { value, metadata } = await env.DEFTER.getWithMetadata('p:' + id, { type: 'arrayBuffer' });
  if (!value) return json({ error: 'Sayfa bulunamadı.' }, 404);
  const meta = {
    ...(metadata || {}),
    w: clampInt(url.searchParams.get('w'), 0, 20000),
    h: clampInt(url.searchParams.get('h'), 0, 20000),
    z: bytes.length,
    c: type,
    e: Date.now(),
  };
  const fitted = fitMeta(meta);
  await env.DEFTER.put('p:' + id, bytes, { metadata: fitted });
  return json({ ok: true, item: toItem(id, fitted) });
}

async function adminDelete(env, ctx, id) {
  if (!validId(id)) return json({ error: 'Geçersiz sayfa.' }, 400);
  const { value, metadata } = await env.DEFTER.getWithMetadata('p:' + id, { type: 'stream' });
  if (value && typeof value.cancel === 'function') value.cancel().catch(() => {});
  if (!value) return json({ ok: true, deleted: false });
  await env.DEFTER.delete('p:' + id);
  if (metadata?.s) ctx.waitUntil(adjustCounts(env, { [metadata.s]: -1 }));
  return json({ ok: true, deleted: true });
}

async function liftBans(env) {
  const epoch = await banEpoch(env);
  await env.DEFTER.put('cfg:engel-donemi', String(epoch + 1));
  return json({ ok: true });
}

async function qrList(env, url) {
  const items = [];
  let cursor;
  do {
    const page = await env.DEFTER.list({ prefix: 'qr:', cursor, limit: 1000 });
    for (const k of page.keys) {
      const m = k.metadata || {};
      if (!m.token) continue;
      items.push({ id: k.name.slice(3), label: m.label || '', createdAt: m.t || 0, url: url.origin + '/?giris=' + m.token });
    }
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  items.sort((a, b) => b.createdAt - a.createdAt);
  return json({ items });
}

async function qrCreate(request, env, url) {
  const body = (await readJson(request)) || {};
  const label = cleanText(body.label, 60) || 'Genel';
  const token = randomId(24);
  const id = await sha256hex(token);
  const t = Date.now();
  await env.DEFTER.put('qr:' + id, '1', { metadata: { label, t, token } });
  return json({ ok: true, item: { id, label, createdAt: t, url: url.origin + '/?giris=' + token } });
}

async function qrRevoke(env, id) {
  if (!/^[a-f0-9]{64}$/.test(id)) return json({ error: 'Geçersiz kod.' }, 400);
  await env.DEFTER.delete('qr:' + id);
  return json({ ok: true });
}

async function findQr(env, token) {
  if (!token || typeof token !== 'string' || !/^[A-Za-z0-9_-]{16,64}$/.test(token)) return null;
  const id = await sha256hex(token);
  const rec = await env.DEFTER.get('qr:' + id);
  return rec ? id : null;
}

/* ------------------------------------------------------------------ */
/* Engelleme (siteden atma)                                            */
/* ------------------------------------------------------------------ */

async function banEpoch(env) {
  const v = await env.DEFTER.get('cfg:engel-donemi', { cacheTtl: 60 });
  return Number(v) || 0;
}

async function isBanned(request, env) {
  const ban = await readCookieToken(request, env, COOKIE_BAN, 'b');
  if (!ban) return false;
  return (ban.ep || 0) >= (await banEpoch(env));
}

async function banResponse(env, reason, kind) {
  const now = Date.now();
  const token = await makeToken(env, { k: 'b', ep: await banEpoch(env), iat: now, exp: now + BAN_DAYS * 864e5 });
  const res = json({ kicked: true, reason, kind }, 403);
  res.headers.append('Set-Cookie', cookieHeader(COOKIE_BAN, token, { maxAge: BAN_DAYS * 86400 }));
  res.headers.append('Set-Cookie', cookieHeader(COOKIE_SESSION, '', { maxAge: 0 }));
  return res;
}

/* ------------------------------------------------------------------ */
/* İçerik denetimi                                                     */
/* ------------------------------------------------------------------ */

const LEET = { 0: 'o', 1: 'i', 2: 'z', 3: 'e', 4: 'a', 5: 's', 6: 'g', 7: 't', 8: 'b', 9: 'g', '@': 'a', $: 's', '!': 'i', '|': 'i', '€': 'e' };
const FOLD = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u', é: 'e', è: 'e', ë: 'e', á: 'a', à: 'a', ä: 'a', ï: 'i', ó: 'o', ò: 'o', ú: 'u', ñ: 'n' };
const squeeze = (s) => s.replace(/(.)\1+/g, '$1');

export function normalizeText(s) {
  let t = String(s ?? '').normalize('NFKC');
  try {
    t = t.toLocaleLowerCase('tr');
  } catch {
    t = t.toLowerCase();
  }
  t = stripMarks(t.normalize('NFD'));
  return Array.from(t, (ch) => FOLD[ch] ?? LEET[ch] ?? ch).join('');
}

// Tek bir kelimenin içinde geçmesi yeterli olan uzun kökler
const BAD_ROOTS = [
  'siktir', 'sikerim', 'sikeyim', 'sikiyim', 'sikik', 'sikis', 'aminako', 'aminakoy', 'aminakod', 'amcik', 'orospu', 'orosbu',
  'oruspu', 'yarrak', 'yarak', 'pezevenk', 'pezeveng', 'kahpe', 'kahbe', 'gavat', 'kaltak', 'surtuk', 'fahise', 'serefsiz',
  'yavsak', 'dangalak', 'gerizekali', 'gotveren', 'gotlek', 'tasak', 'ananisik', 'anasinisik', 'bacinisik', 'fuck', 'bitch',
  'pussy', 'whore', 'nigger', 'nigga', 'faggot', 'motherf', 'asshole', 'dickhead', 'porno', 'hitler',
].map(squeeze);
// Yalnızca tam kelime olarak eşleşenler (isimlerin içinde geçebilecek kısa kökler)
const BAD_WORDS = new Set(
  [
    'sik', 'sikim', 'sikimi', 'sikin', 'siko', 'sikko', 'amk', 'amq', 'aq', 'ami', 'amini', 'aminiz', 'pic', 'got', 'gotu', 'gotun',
    'ibne', 'ipne', 'pust', 'bok', 'boktan', 'mal', 'salak', 'aptal', 'gerzek', 'ezik', 'esek', 'kopek', 'domuz', 'hiyar', 'dingil',
    'embesil', 'anan', 'anani', 'bacin', 'bacini', 'yarram', 'ass', 'cock', 'cunt', 'fag', 'tits', 'boobs', 'sex', 'seks', 'porn',
    'rape', 'nazi', 'pkk', 'feto', 'wtf', 'stfu', 'slut', 'shit', 'bastard', 'retard', 'penis', 'vajina',
  ].map(squeeze),
);
const BAD_PHRASES = [/\bgeri ?zekal?i\b/, /\bpic ?kurusu\b/, /\bit ?oglu\b/, /\bananin? ?ami/, /\bamina ?(koy|kod)/, /\bsiktir ?git\b/, /\bdal ?yarak/];

export function localProfanity(text) {
  const norm = normalizeText(text);
  const words = norm.split(/[^a-z]+/).filter(Boolean);
  // Harf harf yazılmış kelimeleri birleştir: "s i k t i r" -> "siktir"
  const runs = [];
  let run = '';
  for (const w of words) {
    if (w.length === 1) run += w;
    else {
      if (run.length >= 3) runs.push(run);
      run = '';
    }
  }
  if (run.length >= 3) runs.push(run);

  for (const w of words) {
    const sq = squeeze(w);
    if (BAD_WORDS.has(sq) || BAD_WORDS.has(w)) return true;
    if (BAD_ROOTS.some((r) => sq.includes(r))) return true;
  }
  for (const r of runs) {
    const sq = squeeze(r);
    if (BAD_ROOTS.some((root) => sq.includes(root))) return true;
  }
  const phrase = words.map(squeeze).join(' ');
  return BAD_PHRASES.some((re) => re.test(phrase));
}

const textCache = new Map();

async function moderateText(env, cfg, name, note) {
  const fields = [];
  if (name) fields.push(['isim', name]);
  if (note) fields.push(['not', note]);
  if (!fields.length) return { bad: false };
  const reasonFor = (field) => (field === 'not' ? 'Yazdığın not uygunsuz bulundu.' : 'Girdiğin isim uygunsuz bulundu.');

  for (const [field, value] of fields) {
    if (localProfanity(value)) return { bad: true, field, reason: reasonFor(field) };
  }
  if (!env.AI) return { bad: false };

  const key = fields.map(([f, v]) => f + ':' + normalizeText(v)).join('|');
  if (textCache.has(key)) return textCache.get(key);

  let verdict = { bad: false };
  try {
    const raw = await runText(env, cfg, buildTextPrompt(name, note));
    const parsed = parseJsonLoose(raw);
    if (parsed && (parsed.bad === true || parsed.bad === 'true')) {
      const field = parsed.field === 'not' && note ? 'not' : name ? 'isim' : 'not';
      verdict = { bad: true, field, reason: reasonFor(field) };
    }
  } catch (e) {
    // Yapay zekâ çalışmazsa yalnızca yerel küfür listesine güvenilir.
    console.warn('Metin denetimi çalışmadı:', e && e.message);
    return { bad: false };
  }
  if (textCache.size > 500) textCache.clear();
  textCache.set(key, verdict);
  return verdict;
}

export function buildTextPrompt(name, note) {
  const system = [
    'Sen bir okul sitesinde isim ve not denetleyen dikkatli bir moderatörsün.',
    'Öğrenciler ders notlarının fotoğrafını yüklerken adlarını (veya takma adlarını) ve isteğe bağlı kısa bir not yazıyor.',
    'Şunlardan birini içeren metin KÖTÜDÜR (bad=true): Türkçe ya da başka dilde küfür, argo hakaret, cinsel ifade, aşağılayıcı lakap,',
    'nefret söylemi, ırkçılık, tehdit, uyuşturucu, terör örgütü adı, birini alaya alan ifade. Harf değiştirerek, rakam ya da sembolle',
    'gizlenmiş (s1kt1r, @mk), boşluklu (s i k) ya da kısaltılmış (amk, aq) biçimler de buna dahildir.',
    'Normal adlar, takma adlar, baş harfler, sınıf bilgileri ve sıradan ders notları İYİDİR (bad=false).',
    'İyi örnekler: "Ayşe", "Mehmet K.", "Zeynep 11-B", "Işık Tiryaki", "Can", "AM", "Anonim", "3. ünite türev", "Mitoz bölünme notları".',
    'Emin değilsen bad=false de.',
    'Yalnızca şu JSON ile yanıt ver: {"bad": true ya da false, "field": "isim" ya da "not", "reason": "kısa Türkçe gerekçe"}',
  ].join(' ');
  const user = `İsim: ${name ? JSON.stringify(name) : '(yok)'}\nNot: ${note ? JSON.stringify(note) : '(yok)'}`;
  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ];
}

export const VISION_PROMPT = `You are the content-safety checker for a school website where high-school students upload photos of their class notes (math, literature, philosophy, chemistry, physics, biology, history) to help a classmate complete his notebook. Look carefully at the whole image, including any handwriting or printed text.

Set "safe": false if the image contains ANY of these:
- nudity, sexual or suggestive content (anatomy or reproduction diagrams in textbooks or class notes are fine)
- real violence, blood, gore or injuries
- weapons shown in a threatening way
- drugs, alcohol or cigarettes being promoted
- hate symbols, extremist or terrorist content
- obscene or offensive hand gestures
- swear words, insults or slurs written anywhere, in any language (Turkish included)
- content that mocks or bullies a real person
- shocking or disgusting content
- clearly visible personal data such as ID cards, phone numbers or home addresses

Set "safe": true for normal school material: notebook pages, handwriting, textbooks, worksheets, diagrams, formulas, maps, whiteboards and printed notes, even if blurry, dark or partly visible. Ordinary harmless photos are also safe.

Reply with ONLY this JSON object and nothing else:
{"safe": true or false, "category": "none" | "sexual" | "violence" | "weapon" | "drugs" | "hate" | "gesture" | "profanity" | "bullying" | "personal_data" | "disturbing" | "other", "subject": "matematik" | "edebiyat" | "felsefe" | "kimya" | "fizik" | "biyoloji" | "tarih" | "diger", "summary_tr": "Turkish description of the content in at most 10 words"}`;

const agreedModels = new Set();

async function moderateImage(env, cfg, bytes, type) {
  if (!env.AI) throw new Error('Workers AI bağlantısı (AI) tanımlı değil.');
  const dataUrl = `data:${type};base64,` + Buffer.from(bytes).toString('base64');
  let lastError;
  for (const model of uniq([cfg.visionModel, cfg.visionModelFallback])) {
    try {
      const raw = await runVision(env, model, dataUrl);
      const verdict = parseVerdict(raw);
      if (verdict) return verdict;
      lastError = new Error('Model yanıtı çözümlenemedi: ' + String(raw).slice(0, 160));
    } catch (e) {
      lastError = e;
      if (isQuotaError(e)) throw e;
    }
  }
  throw lastError || new Error('Görsel denetimi yapılamadı.');
}

async function runVision(env, model, dataUrl) {
  if (/llama-3\.2-11b-vision/.test(model)) {
    // Bu model için Meta lisansının bir kez onaylanması gerekir ("agree").
    const input = { messages: [{ role: 'user', content: VISION_PROMPT }], image: dataUrl, max_tokens: 220, temperature: 0 };
    if (!agreedModels.has(model)) await ensureAgreement(env, model);
    try {
      return extractText(await env.AI.run(model, input));
    } catch (e) {
      if (/agree|licen[cs]e|5016/i.test(String(e && e.message))) {
        await env.AI.run(model, { prompt: 'agree' });
        agreedModels.add(model);
        return extractText(await env.AI.run(model, input));
      }
      throw e;
    }
  }
  return extractText(
    await env.AI.run(model, {
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: VISION_PROMPT },
            { type: 'image_url', image_url: { url: dataUrl } },
          ],
        },
      ],
      max_tokens: 220,
      temperature: 0,
    }),
  );
}

async function ensureAgreement(env, model) {
  const flag = 'cfg:lisans:' + model;
  try {
    if (await env.DEFTER.get(flag)) {
      agreedModels.add(model);
      return;
    }
    await env.AI.run(model, { prompt: 'agree' });
    await env.DEFTER.put(flag, '1');
    agreedModels.add(model);
  } catch (e) {
    console.warn('Lisans onayı gönderilemedi:', e && e.message);
  }
}

async function runText(env, cfg, messages) {
  let lastError;
  for (const model of uniq([cfg.textModel, cfg.textModelFallback])) {
    try {
      return extractText(await env.AI.run(model, { messages, max_tokens: 120, temperature: 0 }));
    } catch (e) {
      lastError = e;
      if (isQuotaError(e)) throw e;
    }
  }
  throw lastError;
}

export function extractText(r) {
  if (r == null) return '';
  if (typeof r === 'string') return r;
  if (typeof r.response === 'string') return r.response;
  if (r.response && typeof r.response === 'object') return JSON.stringify(r.response);
  if (r.result) return extractText(r.result);
  if (Array.isArray(r.choices) && r.choices[0]) {
    const c = r.choices[0];
    return (c.message && c.message.content) || c.text || '';
  }
  return JSON.stringify(r);
}

export function parseJsonLoose(text) {
  const s = String(text || '').trim();
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    /* devam */
  }
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) {
    try {
      return JSON.parse(fence[1]);
    } catch {
      /* devam */
    }
  }
  const a = s.indexOf('{');
  const b = s.lastIndexOf('}');
  if (a >= 0 && b > a) {
    try {
      return JSON.parse(s.slice(a, b + 1));
    } catch {
      /* devam */
    }
  }
  return null;
}

export function parseVerdict(raw) {
  const text = String(raw || '').trim();
  const p = parseJsonLoose(text);
  if (p && (typeof p.safe === 'boolean' || p.safe === 'true' || p.safe === 'false')) {
    const safe = p.safe === true || p.safe === 'true';
    let category = CATEGORIES.includes(p.category) ? p.category : safe ? 'none' : 'other';
    if (!safe && category === 'none') category = 'other';
    return {
      safe,
      category,
      subject: SUBJECTS.includes(p.subject) ? p.subject : 'diger',
      summary: cleanText(p.summary_tr || p.summary || '', 120),
      reason: safe ? '' : REASONS[category],
    };
  }
  const m = text.match(/"?safe"?\s*[:=]\s*"?(true|false)/i);
  if (m) {
    const safe = m[1].toLowerCase() === 'true';
    return { safe, category: safe ? 'none' : 'other', subject: 'diger', summary: '', reason: safe ? '' : REASONS.other };
  }
  // Model açıklama yapmayı reddettiyse görüntüyü güvenli sayma.
  if (/\b(i can(?:no|')t|i'm (?:not able|unable)|i am (?:not able|unable)|cannot (?:help|assist|provide|describe)|not appropriate|explicit)\b/i.test(text)) {
    return { safe: false, category: 'other', subject: 'diger', summary: '', reason: REASONS.other };
  }
  return null;
}

function isQuotaError(e) {
  return /4006|neuron|daily free allocation|allocation|quota|rate limit/i.test(String(e && (e.message || e)));
}

function aiErrorMessage(e) {
  if (isQuotaError(e)) return 'Bugünkü otomatik denetim kapasitesi doldu, bu yüzden fotoğraf eklenmedi. Yarın tekrar dene.';
  return 'Fotoğraf şu an denetlenemedi, bu yüzden eklenmedi. Biraz sonra tekrar dene.';
}

/* ------------------------------------------------------------------ */
/* Sayaçlar                                                            */
/* ------------------------------------------------------------------ */

function zeroCounts() {
  return Object.fromEntries(SECTIONS.map((s) => [s, 0]));
}

async function getCounts(env) {
  const out = zeroCounts();
  try {
    const c = await env.DEFTER.get('stat:sayilar', { type: 'json', cacheTtl: 60 });
    if (c && typeof c === 'object') for (const s of SECTIONS) out[s] = Math.max(0, Math.floor(Number(c[s]) || 0));
  } catch {
    /* sayaç yoksa sıfır */
  }
  return out;
}

async function adjustCounts(env, deltas) {
  try {
    const c = await getCounts(env);
    for (const [s, d] of Object.entries(deltas)) if (s in c) c[s] = Math.max(0, c[s] + d);
    await env.DEFTER.put('stat:sayilar', JSON.stringify(c));
  } catch (e) {
    console.warn('Sayaç güncellenemedi (yönetici listesi açılınca düzelir):', e && e.message);
  }
}

/* ------------------------------------------------------------------ */
/* İmzalı çerezler                                                     */
/* ------------------------------------------------------------------ */

let keyCache = null;

async function importHmac(secret) {
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function signingKey(env, refresh = false) {
  if (env.SESSION_SECRET) {
    if (!keyCache || keyCache.secret !== env.SESSION_SECRET) keyCache = { secret: env.SESSION_SECRET, key: await importHmac(env.SESSION_SECRET) };
    return keyCache.key;
  }
  if (keyCache && !refresh) return keyCache.key;
  let secret = await env.DEFTER.get('cfg:imza');
  if (!secret) {
    if (keyCache) return keyCache.key;
    secret = b64url(crypto.getRandomValues(new Uint8Array(32)));
    await env.DEFTER.put('cfg:imza', secret);
  }
  if (!keyCache || keyCache.secret !== secret) keyCache = { secret, key: await importHmac(secret) };
  return keyCache.key;
}

async function makeToken(env, payload) {
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await signingKey(env), enc.encode(body)));
  return body + '.' + b64url(sig);
}

async function readToken(env, token, kind) {
  if (!token || typeof token !== 'string' || token.length > 4096) return null;
  const dot = token.indexOf('.');
  if (dot < 1) return null;
  const body = token.slice(0, dot);
  let sig;
  try {
    sig = unb64url(token.slice(dot + 1));
  } catch {
    return null;
  }
  let ok = await crypto.subtle.verify('HMAC', await signingKey(env), sig, enc.encode(body));
  if (!ok && !env.SESSION_SECRET) ok = await crypto.subtle.verify('HMAC', await signingKey(env, true), sig, enc.encode(body));
  if (!ok) return null;
  let p;
  try {
    p = JSON.parse(dec.decode(unb64url(body)));
  } catch {
    return null;
  }
  if (!p || p.k !== kind || typeof p.exp !== 'number' || p.exp < Date.now()) return null;
  return p;
}

async function readCookieToken(request, env, name, kind) {
  return readToken(env, getCookie(request, name), kind);
}

async function readSession(request, env) {
  return readCookieToken(request, env, COOKIE_SESSION, 's');
}

async function sessionCookie(env, session) {
  return cookieHeader(COOKIE_SESSION, await makeToken(env, session), { maxAge: (session.exp - Date.now()) / 1000 });
}

function cookieHeader(name, value, { maxAge, sameSite = 'Lax' } = {}) {
  let c = `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=${sameSite}`;
  if (maxAge !== undefined) c += `; Max-Age=${Math.max(0, Math.floor(maxAge))}`;
  return c;
}

function getCookie(request, name) {
  const header = request.headers.get('Cookie') || '';
  for (const part of header.split(/;\s*/)) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i) === name) return part.slice(i + 1);
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Yardımcılar                                                         */
/* ------------------------------------------------------------------ */

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}

function redirect(location, cookies = []) {
  const res = new Response(null, { status: 302, headers: { Location: location, 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });
  for (const c of cookies) res.headers.append('Set-Cookie', c);
  return res;
}

async function readJson(request) {
  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > 64 * 1024) return null;
  try {
    const text = await request.text();
    if (text.length > 64 * 1024) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function b64url(bytes) {
  return Buffer.from(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function unb64url(s) {
  if (!/^[A-Za-z0-9_-]*$/.test(s)) throw new Error('bad b64');
  return new Uint8Array(Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64'));
}

async function sha256hex(s) {
  const d = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(s)));
  return Array.from(d, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function nameHash(name) {
  return (await sha256hex('isim:' + normalizeText(name))).slice(0, 32);
}

function randomId(len, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_') {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  let out = '';
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return out;
}

async function safeEqual(a, b) {
  const key = await crypto.subtle.importKey('raw', crypto.getRandomValues(new Uint8Array(32)), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const [x, y] = await Promise.all([crypto.subtle.sign('HMAC', key, enc.encode(a)), crypto.subtle.sign('HMAC', key, enc.encode(b))]);
  const ua = new Uint8Array(x);
  const ub = new Uint8Array(y);
  let diff = 0;
  for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i];
  return diff === 0;
}

// Görünmez/denetim karakterlerini ve birleşik aksan işaretlerini kod noktasına göre ayıkla
function stripInvisible(s) {
  let out = '';
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c < 32 || c === 127 || (c >= 0x200b && c <= 0x200f) || (c >= 0x2028 && c <= 0x202e) || (c >= 0x2066 && c <= 0x2069) || c === 0xfeff) continue;
    out += ch;
  }
  return out;
}

function stripMarks(s) {
  let out = '';
  for (const ch of s) {
    const c = ch.codePointAt(0);
    if (c >= 0x300 && c <= 0x36f) continue;
    out += ch;
  }
  return out;
}

export function cleanText(value, max) {
  const s = stripInvisible(String(value ?? '').normalize('NFC'))
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return Array.from(s).slice(0, max).join('').trim();
}

function clampInt(v, min, max) {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function sniffImage(b) {
  if (b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length > 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) return 'image/png';
  if (b.length > 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
  return null;
}

function fitMeta(meta) {
  const m = { ...meta };
  const size = () => enc.encode(JSON.stringify(m)).length;
  const shorten = (field) => {
    while (m[field] && size() > 1000) m[field] = Array.from(m[field]).slice(0, -8).join('');
  };
  shorten('d');
  shorten('k');
  shorten('n');
  return m;
}

function toItem(id, m) {
  return {
    id,
    section: m.s,
    name: m.n || '',
    note: m.k || '',
    summary: m.d || '',
    subject: m.j || '',
    createdAt: m.t || 0,
    editedAt: m.e || 0,
    w: m.w || 0,
    h: m.h || 0,
    size: m.z || 0,
    type: m.c || 'image/jpeg',
  };
}

function validId(id) {
  return /^[0-9]{13}-[a-z0-9]{6,12}$/.test(id);
}

function uniq(list) {
  return [...new Set(list.filter(Boolean))];
}
