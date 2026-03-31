# 🛍️ Amazon Clone

Modern, responsive ve çok özellikli bir **Amazon tarzı e-ticaret arayüzü**.  
Bu proje `React` ile geliştirildi ve ürün listeleme, arama, sepet, checkout, sipariş geçmişi ve çoklu dil desteği gibi temel alışveriş deneyimlerini demo amaçlı sunar.

---

## 🚀 Özellikler

- 🏠 **Ana Sayfa**
  - hero banner alanı
  - kategori kısayolları
  - kampanya kartları
  - öne çıkan ürün bölümleri

- 🔍 **Arama / Listeleme**
  - kategoriye göre filtreleme
  - fiyat aralığı filtreleri
  - puan, Prime ve ücretsiz kargo filtreleri
  - sıralama seçenekleri

- 📦 **Ürün Detay Sayfası**
  - ürün galerisi
  - özellikler alanı
  - değerlendirme sekmesi
  - benzer ürünler

- 🛒 **Sepet ve Checkout**
  - sepet yönetimi
  - adet güncelleme
  - sipariş özeti
  - simüle ödeme akışı

- 📜 **Sipariş Geçmişi**
  - örnek sipariş verileri
  - teslimat ve ödeme özeti

- 🌍 **Çoklu Dil Desteği**
  - Türkçe
  - English
  - Deutsch
  - العربية

- 🖼️ **Görsel Yedekleme Sistemi**
  - kırık ürün görsellerinde otomatik fallback

---

## 🧰 Kullanılan Teknolojiler

- `React 18`
- `React Router DOM`
- `Context API`
- `CSS`
- `Lucide React`
- `LocalStorage`
- mock veri yapısı (`public/data/products.json`)

---

## 📂 Proje Yapısı

```bash
src/
 ├── components/     # Header, Footer, ProductCard
 ├── pages/          # Home, Cart, Checkout, Orders, Account
 ├── context/        # Cart ve Language context
 ├── data/           # Örnek sipariş verileri
 ├── hooks/          # Ürün hook'ları
 └── utils/          # Görsel fallback yardımcıları
```

---

## ⚙️ Kurulum

### 1) Depoyu klonla

```bash
git clone <repo-url>
cd amazon-clone
```

### 2) Bağımlılıkları yükle

```bash
npm install
```

### 3) Geliştirme sunucusunu başlat

```bash
npm start
```

Tarayıcıda aç:

```bash
http://localhost:3000
```

---

## 🏗️ Production Build

```bash
npm run build
```

Doğrulanmış build komutu:

```bash
CI=true npm run build
```

---

## 🔐 Güvenlik Notları

- Bu proje **demo amaçlıdır**.
- Gerçek ödeme altyapısı yoktur.
- Gerçek kullanıcı hesabı / gerçek kart işlemi bulunmaz.
- Secret, token veya `.env` verileri repoda tutulmaz.
- `build/` ve `node_modules/` GitHub takibinden çıkarılmıştır.

---

## 📌 Not

Bu proje portföy, arayüz geliştirme pratiği ve React yetkinliği göstermek için uygundur.

---
