import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { LANGUAGE_OPTIONS, useLanguage } from '../context/LanguageContext';
import './Header.css';

const categories = [
  { value: 'Tümü', labels: { TR: 'Tümü', EN: 'All', DE: 'Alle', AR: 'الكل' } },
  { value: 'Elektronik', labels: { TR: 'Elektronik', EN: 'Electronics', DE: 'Elektronik', AR: 'إلكترونيات' } },
  { value: 'Moda', labels: { TR: 'Moda', EN: 'Fashion', DE: 'Mode', AR: 'موضة' } },
  { value: 'Ev & Yaşam', labels: { TR: 'Ev & Yaşam', EN: 'Home & Living', DE: 'Wohnen', AR: 'المنزل' } },
  { value: 'Gıda', labels: { TR: 'Gıda', EN: 'Food', DE: 'Lebensmittel', AR: 'بقالة' } },
  { value: 'Oyuncak', labels: { TR: 'Oyuncak', EN: 'Toys', DE: 'Spielzeug', AR: 'ألعاب' } },
  { value: 'Kitap', labels: { TR: 'Kitap', EN: 'Books', DE: 'Bücher', AR: 'كتب' } },
  { value: 'Spor', labels: { TR: 'Spor', EN: 'Sports', DE: 'Sport', AR: 'رياضة' } },
  { value: 'Güzellik', labels: { TR: 'Güzellik', EN: 'Beauty', DE: 'Beauty', AR: 'جمال' } },
];

const headerCopy = {
  TR: { language: 'Dil', delivery: 'Konuma teslim et', greeting: 'Merhaba, Emir', account: 'Hesap ve Listeler', returns: 'İadeler', orders: 've Siparişler', cart: 'Sepet', all: 'Tümü', searchPlaceholder: "Amazon'da ara" },
  EN: { language: 'Language', delivery: 'Deliver to', greeting: 'Hello, Emir', account: 'Account & Lists', returns: 'Returns', orders: '& Orders', cart: 'Cart', all: 'All', searchPlaceholder: 'Search Amazon' },
  DE: { language: 'Sprache', delivery: 'Liefern nach', greeting: 'Hallo, Emir', account: 'Konto & Listen', returns: 'Rückgaben', orders: '& Bestellungen', cart: 'Warenkorb', all: 'Alle', searchPlaceholder: 'Amazon durchsuchen' },
  AR: { language: 'اللغة', delivery: 'التوصيل إلى', greeting: 'مرحباً، Emir', account: 'الحساب والقوائم', returns: 'المرتجعات', orders: 'والطلبات', cart: 'السلة', all: 'الكل', searchPlaceholder: 'ابحث في أمازون' },
};

const navItems = [
  { key: 'Fırsatlar', route: '/search?discount=true', labels: { TR: 'Fırsatlar', EN: 'Deals', DE: 'Angebote', AR: 'العروض' } },
  { key: 'Prime', route: '/search?cat=Tümü', labels: { TR: 'Prime', EN: 'Prime', DE: 'Prime', AR: 'برايم' } },
  { key: 'Elektronik', route: '/search?cat=Elektronik', labels: { TR: 'Elektronik', EN: 'Electronics', DE: 'Elektronik', AR: 'إلكترونيات' } },
  { key: 'Moda', route: '/search?cat=Moda', labels: { TR: 'Moda', EN: 'Fashion', DE: 'Mode', AR: 'موضة' } },
  { key: 'Ev & Yaşam', route: '/search?cat=Ev%20%26%20Ya%C5%9Fam', labels: { TR: 'Ev & Yaşam', EN: 'Home & Living', DE: 'Wohnen', AR: 'المنزل' } },
  { key: 'Gıda', route: '/search?cat=Gıda', labels: { TR: 'Gıda', EN: 'Food', DE: 'Lebensmittel', AR: 'بقالة' } },
  { key: 'Oyuncak', route: '/search?cat=Oyuncak', labels: { TR: 'Oyuncak', EN: 'Toys', DE: 'Spielzeug', AR: 'ألعاب' } },
  { key: 'Kitap', route: '/search?cat=Kitap', labels: { TR: 'Kitap', EN: 'Books', DE: 'Bücher', AR: 'كتب' } },
  { key: 'Spor', route: '/search?cat=Spor', labels: { TR: 'Spor', EN: 'Sports', DE: 'Sport', AR: 'رياضة' } },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCat, setSearchCat] = useState('Tümü');
  const [scrolled, setScrolled] = useState(false);

  const activeLanguage = LANGUAGE_OPTIONS.find((option) => option.code === language) || LANGUAGE_OPTIONS[0];
  const uiText = headerCopy[language] || headerCopy.TR;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync search input with URL param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
    else if (!location.pathname.startsWith('/search')) setSearchQuery('');
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&cat=${encodeURIComponent(searchCat)}`);
    }
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      {/* Top Bar */}
      <div className="header__top">
        <div className="header__top-inner">
          {/* Logo */}
          <div className="header__logo" onClick={() => navigate('/')} aria-label="Amazon ana sayfa">
            <svg viewBox="0 0 170 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="header__logo-svg">
              <text x="0" y="25" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="25" fill="white">amazon</text>
              <path d="M7 31 Q46 39 88 30" stroke="#FF9900" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
              <path d="M82 27 L90 30 L83 35" fill="#FF9900"/>
              <text x="98" y="17" fontFamily="Arial, sans-serif" fontSize="8" letterSpacing="1.4" fill="#FFB84D">TÜRKİYE</text>
              <text x="98" y="29" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="700" fill="white">online mağaza</text>
            </svg>
          </div>

          {/* Delivery Location */}
          <div className="header__deliver" onClick={() => {}}>
            <div className="header__deliver-top">{uiText.delivery}</div>
            <div className="header__deliver-loc">
              <svg width="14" height="18" viewBox="0 0 24 30" fill="white"><path d="M12 0C7.6 0 4 3.6 4 8c0 7.3 8 18 8 18s8-10.7 8-18c0-4.4-3.6-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" fill="currentColor"/></svg>
              <strong>İstanbul 34000</strong>
            </div>
          </div>

          {/* Search Bar */}
          <form className="header__search" onSubmit={handleSearch}>
            <select
              className="header__search-cat"
              value={searchCat}
              onChange={e => setSearchCat(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.labels[language] || category.labels.TR}
                </option>
              ))}
            </select>
            <input
              className="header__search-input"
              type="text"
              placeholder={uiText.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button className="header__search-btn" type="submit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#131921" strokeWidth="2.5"/>
                <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="#131921" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </form>

          {/* Right links */}
          <div className="header__right">
            {/* Language */}
            <div className="header__nav-item header__nav-item--lang">
              <span className="header__nav-top">{uiText.language}</span>
              <div className="header__lang-picker">
                <span className="header__lang-flag" aria-hidden="true">{activeLanguage.flag}</span>
                <select
                  className="header__lang-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  aria-label="Dil seçimi"
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.code} · {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Account */}
            <div className="header__nav-item" onClick={() => navigate('/account')}>
              <span className="header__nav-top">{uiText.greeting}</span>
              <span className="header__nav-bottom">
                {uiText.account}
                <svg width="8" height="6" viewBox="0 0 12 8" fill="white" style={{marginLeft:3}}><path d="M1 1l5 5 5-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
              </span>
            </div>

            {/* Orders */}
            <div className="header__nav-item" onClick={() => navigate('/orders')}>
              <span className="header__nav-top">{uiText.returns}</span>
              <span className="header__nav-bottom">{uiText.orders}</span>
            </div>

            {/* Cart */}
            <div className="header__cart" onClick={() => navigate('/cart')}>
              <div className="header__cart-icon">
                <svg width="40" height="36" viewBox="0 0 46 40" fill="none">
                  <path d="M4 4h4l6 18h18l4-14H10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <circle cx="18" cy="34" r="2.5" fill="white"/>
                  <circle cx="32" cy="34" r="2.5" fill="white"/>
                </svg>
                <span className="header__cart-count">{totalItems}</span>
              </div>
              <span className="header__cart-label">{uiText.cart}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="header__nav">
        <div className="header__nav-inner">
          <button className="header__nav-all" onClick={() => navigate('/search?cat=Tümü')}>
            <svg width="16" height="13" viewBox="0 0 16 13" fill="none">
              <rect y="0" width="16" height="2" rx="1" fill="white"/>
              <rect y="5.5" width="16" height="2" rx="1" fill="white"/>
              <rect y="11" width="16" height="2" rx="1" fill="white"/>
            </svg>
            {uiText.all}
          </button>
          <div className="header__nav-links">
            {navItems.map((item) => (
              <button
                key={item.key}
                className="header__nav-link"
                onClick={() => navigate(item.route)}
              >
                {item.labels[language] || item.labels.TR}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
