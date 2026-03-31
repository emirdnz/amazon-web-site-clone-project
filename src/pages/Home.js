import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BadgePercent,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Home as HomeIcon,
  Monitor,
  Package2,
  ShoppingBasket,
  Shirt,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import './Home.css';

const BANNERS = [
  {
    id: 1,
    title: 'Yaz İndirimleri Başladı',
    subtitle: 'Elektronik ürünlerde %30\'a varan indirim',
    cta: 'Alışverişe Başla',
    bg: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)',
    cat: 'Elektronik'
  },
  {
    id: 2,
    title: 'Prime Üyeliği',
    subtitle: 'Hızlı teslimat, özel fırsatlar ve daha fazlası',
    cta: 'Prime\'ı Dene',
    bg: 'linear-gradient(135deg, #00A8E1, #0066A2)',
    cat: 'prime'
  },
  {
    id: 3,
    title: 'Moda Sezonu',
    subtitle: 'En yeni koleksiyonlar şimdi burada',
    cta: 'Keşfet',
    bg: 'linear-gradient(135deg, #2C3E50, #4CA1AF)',
    cat: 'Moda'
  }
];

const CATEGORIES = [
  { name: { TR: 'Elektronik', EN: 'Electronics', DE: 'Elektronik', AR: 'إلكترونيات' }, icon: Monitor, cat: 'Elektronik' },
  { name: { TR: 'Moda', EN: 'Fashion', DE: 'Mode', AR: 'موضة' }, icon: Shirt, cat: 'Moda' },
  { name: { TR: 'Ev & Yaşam', EN: 'Home & Living', DE: 'Wohnen', AR: 'المنزل' }, icon: HomeIcon, cat: 'Ev & Yaşam' },
  { name: { TR: 'Gıda', EN: 'Food', DE: 'Lebensmittel', AR: 'بقالة' }, icon: ShoppingBasket, cat: 'Gıda' },
  { name: { TR: 'Oyuncak', EN: 'Toys', DE: 'Spielzeug', AR: 'ألعاب' }, icon: Package2, cat: 'Oyuncak' },
  { name: { TR: 'Spor', EN: 'Sports', DE: 'Sport', AR: 'رياضة' }, icon: Dumbbell, cat: 'Spor' },
  { name: { TR: 'Kitap', EN: 'Books', DE: 'Bücher', AR: 'كتب' }, icon: BookOpen, cat: 'Kitap' },
  { name: { TR: 'Güzellik', EN: 'Beauty', DE: 'Beauty', AR: 'جمال' }, icon: Sparkles, cat: 'Güzellik' },
];

const HOME_COPY = {
  TR: {
    banners: [
      { title: 'Yaz İndirimleri Başladı', subtitle: 'Elektronik ürünlerde %30\'a varan indirim', cta: 'Alışverişe Başla' },
      { title: 'Prime Üyeliği', subtitle: 'Hızlı teslimat, özel fırsatlar ve daha fazlası', cta: 'Prime\'ı Dene' },
      { title: 'Moda Sezonu', subtitle: 'En yeni koleksiyonlar şimdi burada', cta: 'Keşfet' },
    ],
    prev: 'Önceki banner',
    next: 'Sonraki banner',
    promos: [
      { title: 'Günün Fırsatları', subtitle: '%20\'den fazla indirim', cta: 'Hepsini Gör' },
      { title: 'Yeni Elektronik', subtitle: 'En yeni ürünler geldi', cta: 'İncele' },
      { title: 'Moda Trendi', subtitle: 'Bu sezonun favorileri', cta: 'Keşfet' },
      { title: 'Ev & Yaşam', subtitle: 'Evi güzelleştir', cta: 'Alışverişe Başla' },
    ],
    dealsTitle: 'Günün Fırsatları',
    dealsMore: 'Tüm fırsatları gör',
    electronicsTitle: 'Öne Çıkan Elektronik',
    showAll: 'Tümünü Gör',
    favoritesTitle: 'Müşterilerin En Çok Sevdikleri',
    primeTitle: 'Sınırsız Ücretsiz Teslimat',
    primeText: 'Prime ile milyonlarca ürünü 1 günde kapınıza getirin. 30 gün ücretsiz deneyin.',
    primeCta: '30 Gün Ücretsiz Deneyin',
  },
  EN: {
    banners: [
      { title: 'Summer Deals Are Here', subtitle: 'Save up to 30% on electronics', cta: 'Start Shopping' },
      { title: 'Prime Membership', subtitle: 'Fast delivery, special offers and more', cta: 'Try Prime' },
      { title: 'Fashion Season', subtitle: 'The newest collections are here', cta: 'Discover' },
    ],
    prev: 'Previous banner',
    next: 'Next banner',
    promos: [
      { title: 'Today\'s Deals', subtitle: 'More than 20% off', cta: 'See All' },
      { title: 'New Electronics', subtitle: 'Latest tech has arrived', cta: 'Explore' },
      { title: 'Trending Fashion', subtitle: 'This season\'s favorites', cta: 'Discover' },
      { title: 'Home & Living', subtitle: 'Refresh your space', cta: 'Start Shopping' },
    ],
    dealsTitle: 'Today\'s Deals',
    dealsMore: 'See all deals',
    electronicsTitle: 'Featured Electronics',
    showAll: 'See All',
    favoritesTitle: 'Customer Favorites',
    primeTitle: 'Unlimited Free Delivery',
    primeText: 'Get millions of products delivered in as little as 1 day with Prime. Try it free for 30 days.',
    primeCta: 'Try 30 Days Free',
  },
  DE: {
    banners: [
      { title: 'Sommerangebote sind da', subtitle: 'Bis zu 30% Rabatt auf Elektronik', cta: 'Jetzt einkaufen' },
      { title: 'Prime Mitgliedschaft', subtitle: 'Schnelle Lieferung, exklusive Angebote und mehr', cta: 'Prime testen' },
      { title: 'Mode-Saison', subtitle: 'Die neuesten Kollektionen sind hier', cta: 'Entdecken' },
    ],
    prev: 'Vorheriges Banner',
    next: 'Nächstes Banner',
    promos: [
      { title: 'Angebote des Tages', subtitle: 'Mehr als 20% Rabatt', cta: 'Alle ansehen' },
      { title: 'Neue Elektronik', subtitle: 'Die neuesten Produkte sind da', cta: 'Ansehen' },
      { title: 'Modetrend', subtitle: 'Die Favoriten dieser Saison', cta: 'Entdecken' },
      { title: 'Wohnen', subtitle: 'Verschönern Sie Ihr Zuhause', cta: 'Jetzt einkaufen' },
    ],
    dealsTitle: 'Angebote des Tages',
    dealsMore: 'Alle Angebote sehen',
    electronicsTitle: 'Empfohlene Elektronik',
    showAll: 'Alle anzeigen',
    favoritesTitle: 'Kundenlieblinge',
    primeTitle: 'Unbegrenzte kostenlose Lieferung',
    primeText: 'Mit Prime erhalten Sie Millionen von Produkten schon in 1 Tag. 30 Tage kostenlos testen.',
    primeCta: '30 Tage gratis testen',
  },
  AR: {
    banners: [
      { title: 'انطلقت عروض الصيف', subtitle: 'خصومات تصل إلى 30% على الإلكترونيات', cta: 'ابدأ التسوق' },
      { title: 'عضوية برايم', subtitle: 'توصيل سريع وعروض خاصة والمزيد', cta: 'جرّب برايم' },
      { title: 'موسم الموضة', subtitle: 'أحدث التشكيلات متوفرة الآن', cta: 'اكتشف' },
    ],
    prev: 'البانر السابق',
    next: 'البانر التالي',
    promos: [
      { title: 'عروض اليوم', subtitle: 'خصم أكثر من 20%', cta: 'عرض الكل' },
      { title: 'إلكترونيات جديدة', subtitle: 'وصلت أحدث المنتجات', cta: 'استعرض' },
      { title: 'موضة رائجة', subtitle: 'مفضلات هذا الموسم', cta: 'اكتشف' },
      { title: 'المنزل والمعيشة', subtitle: 'جدّد منزلك', cta: 'ابدأ التسوق' },
    ],
    dealsTitle: 'عروض اليوم',
    dealsMore: 'عرض كل العروض',
    electronicsTitle: 'إلكترونيات مميزة',
    showAll: 'عرض الكل',
    favoritesTitle: 'الأكثر إعجاباً من العملاء',
    primeTitle: 'توصيل مجاني غير محدود',
    primeText: 'مع برايم تصلك ملايين المنتجات خلال يوم واحد. جرّبه مجاناً لمدة 30 يوماً.',
    primeCta: 'جرّب 30 يوماً مجاناً',
  },
};

export default function Home() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const ui = HOME_COPY[language] || HOME_COPY.TR;
  const { products, loading } = useProducts();
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const deals = products.filter(p => p.discount >= 20).slice(0, 8);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const electronics = products.filter(p => p.category === 'Elektronik').slice(0, 4);

  return (
    <div className="home page-enter">
      {/* Hero Carousel */}
      <div className="home__hero">
        {BANNERS.map((b, i) => (
          <div
            key={b.id}
            className={`home__banner ${i === bannerIdx ? 'home__banner--active' : ''}`}
            style={{ background: b.bg }}
          >
            <div className="home__banner-content">
              <h1>{ui.banners[i]?.title || b.title}</h1>
              <p>{ui.banners[i]?.subtitle || b.subtitle}</p>
              <button onClick={() => navigate(`/search?cat=${b.cat}`)}>{ui.banners[i]?.cta || b.cta}</button>
            </div>
          </div>
        ))}
        <div className="home__hero-dots">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              className={`home__hero-dot ${i === bannerIdx ? 'home__hero-dot--active' : ''}`}
              onClick={() => setBannerIdx(i)}
            />
          ))}
        </div>
        <button className="home__hero-prev" onClick={() => setBannerIdx(i => (i - 1 + BANNERS.length) % BANNERS.length)} aria-label={ui.prev}>
          <ChevronLeft size={22} strokeWidth={2.2} />
        </button>
        <button className="home__hero-next" onClick={() => setBannerIdx(i => (i + 1) % BANNERS.length)} aria-label={ui.next}>
          <ChevronRight size={22} strokeWidth={2.2} />
        </button>
      </div>

      {/* Category Quick Links */}
      <div className="home__categories">
        <div className="container">
          <div className="home__cat-grid">
            {CATEGORIES.map(c => {
              const Icon = c.icon;
              return (
                <div
                  key={c.cat}
                  className="home__cat-item"
                  onClick={() => navigate(`/search?cat=${c.cat}`)}
                >
                  <span className="home__cat-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <span className="home__cat-name">{c.name[language] || c.name.TR}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Promo Cards */}
      <div className="container">
        <div className="home__promo-grid">
          <div className="home__promo home__promo--orange" onClick={() => navigate('/search?discount=true')}>
            <div className="home__promo-title">{ui.promos[0].title}</div>
            <div className="home__promo-sub">{ui.promos[0].subtitle}</div>
            <div className="home__promo-cta">{ui.promos[0].cta} <ArrowRight size={14} strokeWidth={2.2} /></div>
          </div>
          <div className="home__promo home__promo--blue" onClick={() => navigate('/search?cat=Elektronik')}>
            <div className="home__promo-title">{ui.promos[1].title}</div>
            <div className="home__promo-sub">{ui.promos[1].subtitle}</div>
            <div className="home__promo-cta">{ui.promos[1].cta} <ArrowRight size={14} strokeWidth={2.2} /></div>
          </div>
          <div className="home__promo home__promo--dark" onClick={() => navigate('/search?cat=Moda')}>
            <div className="home__promo-title">{ui.promos[2].title}</div>
            <div className="home__promo-sub">{ui.promos[2].subtitle}</div>
            <div className="home__promo-cta">{ui.promos[2].cta} <ArrowRight size={14} strokeWidth={2.2} /></div>
          </div>
          <div className="home__promo home__promo--green" onClick={() => navigate('/search?cat=Ev & Yaşam')}>
            <div className="home__promo-title">{ui.promos[3].title}</div>
            <div className="home__promo-sub">{ui.promos[3].subtitle}</div>
            <div className="home__promo-cta">{ui.promos[3].cta} <ArrowRight size={14} strokeWidth={2.2} /></div>
          </div>
        </div>
      </div>

      {/* Deals Section */}
      <div className="container">
        <div className="home__section">
          <div className="home__section-header">
            <h2 className="home__section-title">
              <BadgePercent size={20} strokeWidth={2.1} />
              <span>{ui.dealsTitle}</span>
            </h2>
            <button className="home__section-more" onClick={() => navigate('/search?discount=true')}>
              {ui.dealsMore}
            </button>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="home__product-grid">
              {deals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Electronics Showcase */}
      {electronics.length > 0 && (
        <div className="home__electronics-banner">
          <div className="container">
            <div className="home__section-header">
              <h2 className="home__section-title" style={{ color: 'white' }}>
                <Smartphone size={20} strokeWidth={2.1} />
                <span>{ui.electronicsTitle}</span>
              </h2>
              <button className="home__section-more" style={{ color: 'var(--amazon-orange)' }} onClick={() => navigate('/search?cat=Elektronik')}>
                {ui.showAll}
              </button>
            </div>
            <div className="home__product-grid home__product-grid--4">
              {electronics.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* Top Rated */}
      <div className="container">
        <div className="home__section">
          <div className="home__section-header">
            <h2 className="home__section-title">
              <Award size={20} strokeWidth={2.1} />
              <span>{ui.favoritesTitle}</span>
            </h2>
            <button className="home__section-more" onClick={() => navigate('/search')}>
              {ui.showAll}
            </button>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="home__product-grid">
              {topRated.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Prime Banner */}
      <div className="home__prime-banner">
        <div className="container">
          <div className="home__prime-inner">
            <div className="home__prime-text">
              <div className="home__prime-logo">prime</div>
              <h3>{ui.primeTitle}</h3>
              <p>{ui.primeText}</p>
            </div>
            <button className="home__prime-btn" onClick={() => navigate('/search')}>
              {ui.primeCta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
