import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

const SORT_OPTIONS = [
  { value: 'featured', labelKey: 'featured' },
  { value: 'price-asc', labelKey: 'priceAsc' },
  { value: 'price-desc', labelKey: 'priceDesc' },
  { value: 'rating', labelKey: 'rating' },
  { value: 'reviews', labelKey: 'reviews' },
  { value: 'discount', labelKey: 'discount' },
];

const CATEGORY_NAMES = {
  'Elektronik': { TR: 'Elektronik', EN: 'Electronics', DE: 'Elektronik', AR: 'إلكترونيات' },
  'Moda': { TR: 'Moda', EN: 'Fashion', DE: 'Mode', AR: 'موضة' },
  'Ev & Yaşam': { TR: 'Ev & Yaşam', EN: 'Home & Living', DE: 'Wohnen', AR: 'المنزل' },
  'Gıda': { TR: 'Gıda', EN: 'Food', DE: 'Lebensmittel', AR: 'بقالة' },
  'Oyuncak': { TR: 'Oyuncak', EN: 'Toys', DE: 'Spielzeug', AR: 'ألعاب' },
  'Kitap': { TR: 'Kitap', EN: 'Books', DE: 'Bücher', AR: 'كتب' },
  'Spor': { TR: 'Spor', EN: 'Sports', DE: 'Sport', AR: 'رياضة' },
  'Güzellik': { TR: 'Güzellik', EN: 'Beauty', DE: 'Beauty', AR: 'جمال' },
};

const PRODUCT_LIST_TEXT = {
  TR: {
    featured: 'Öne Çıkanlar',
    priceAsc: 'Fiyat: Düşükten Yükseğe',
    priceDesc: 'Fiyat: Yüksekten Düşüğe',
    rating: 'En Yüksek Puan',
    reviews: 'En Çok Değerlendirilen',
    discount: 'En Yüksek İndirim',
    allProducts: 'Tüm Ürünler',
    deals: 'Günün Fırsatları',
    resultsFor: (q) => `"${q}" için sonuçlar`,
    filters: 'Filtreler',
    priceRange: 'Fiyat Aralığı',
    minPrice: 'Min ₺',
    maxPrice: 'Max ₺',
    ratings: 'Müşteri Değerlendirmeleri',
    andUp: 've üzeri',
    deliveryMembership: 'Teslimat & Üyelik',
    freeShipping: 'Ücretsiz Kargo',
    clear: 'Filtreleri Temizle',
    results: (count) => `${count} sonuç`,
    sortBy: 'Sırala:',
    noResults: 'Sonuç bulunamadı',
    noResultsText: (term) => `"${term}" için ürün bulunamadı. Filtrelerinizi değiştirmeyi deneyin.`,
  },
  EN: {
    featured: 'Featured',
    priceAsc: 'Price: Low to High',
    priceDesc: 'Price: High to Low',
    rating: 'Highest Rated',
    reviews: 'Most Reviewed',
    discount: 'Biggest Discount',
    allProducts: 'All Products',
    deals: 'Today\'s Deals',
    resultsFor: (q) => `Results for "${q}"`,
    filters: 'Filters',
    priceRange: 'Price Range',
    minPrice: 'Min ₺',
    maxPrice: 'Max ₺',
    ratings: 'Customer Ratings',
    andUp: 'and up',
    deliveryMembership: 'Delivery & Membership',
    freeShipping: 'Free Shipping',
    clear: 'Clear Filters',
    results: (count) => `${count} results`,
    sortBy: 'Sort by:',
    noResults: 'No results found',
    noResultsText: (term) => `No products found for "${term}". Try changing your filters.`,
  },
  DE: {
    featured: 'Empfohlen',
    priceAsc: 'Preis: aufsteigend',
    priceDesc: 'Preis: absteigend',
    rating: 'Beste Bewertung',
    reviews: 'Am häufigsten bewertet',
    discount: 'Größter Rabatt',
    allProducts: 'Alle Produkte',
    deals: 'Angebote des Tages',
    resultsFor: (q) => `Ergebnisse für "${q}"`,
    filters: 'Filter',
    priceRange: 'Preisspanne',
    minPrice: 'Min ₺',
    maxPrice: 'Max ₺',
    ratings: 'Kundenbewertungen',
    andUp: 'und mehr',
    deliveryMembership: 'Lieferung & Mitgliedschaft',
    freeShipping: 'Kostenloser Versand',
    clear: 'Filter löschen',
    results: (count) => `${count} Ergebnisse`,
    sortBy: 'Sortieren:',
    noResults: 'Keine Ergebnisse',
    noResultsText: (term) => `Keine Produkte für "${term}" gefunden.`,
  },
  AR: {
    featured: 'مميزة',
    priceAsc: 'السعر: من الأقل إلى الأعلى',
    priceDesc: 'السعر: من الأعلى إلى الأقل',
    rating: 'الأعلى تقييماً',
    reviews: 'الأكثر تقييماً',
    discount: 'أعلى خصم',
    allProducts: 'كل المنتجات',
    deals: 'عروض اليوم',
    resultsFor: (q) => `نتائج البحث عن "${q}"`,
    filters: 'الفلاتر',
    priceRange: 'نطاق السعر',
    minPrice: 'الحد الأدنى ₺',
    maxPrice: 'الحد الأقصى ₺',
    ratings: 'تقييمات العملاء',
    andUp: 'فأعلى',
    deliveryMembership: 'التوصيل والعضوية',
    freeShipping: 'شحن مجاني',
    clear: 'مسح الفلاتر',
    results: (count) => `${count} نتيجة`,
    sortBy: 'ترتيب:',
    noResults: 'لم يتم العثور على نتائج',
    noResultsText: (term) => `لم يتم العثور على منتجات لـ "${term}".`,
  },
};

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const ui = PRODUCT_LIST_TEXT[language] || PRODUCT_LIST_TEXT.TR;
  const q = searchParams.get('q') || '';
  const cat = searchParams.get('cat') || '';
  const showDiscount = searchParams.get('discount') === 'true';

  const { products, loading } = useProducts();
  const [sort, setSort] = useState('featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [primeOnly, setPrimeOnly] = useState(false);
  const [freeShipOnly, setFreeShipOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];

    if (showDiscount) list = list.filter(p => p.discount >= 20);
    else if (q) {
      const qLower = q.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(qLower) ||
        p.brand.toLowerCase().includes(qLower) ||
        p.category.toLowerCase().includes(qLower) ||
        p.subcategory.toLowerCase().includes(qLower)
      );
    } else if (cat && cat !== 'Tümü') {
      list = list.filter(p => p.category === cat);
    }

    if (minPrice) list = list.filter(p => p.price >= Number(minPrice));
    if (maxPrice) list = list.filter(p => p.price <= Number(maxPrice));
    if (minRating > 0) list = list.filter(p => p.rating >= minRating);
    if (primeOnly) list = list.filter(p => p.prime);
    if (freeShipOnly) list = list.filter(p => p.freeShipping);

    switch (sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      case 'reviews': return list.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'discount': return list.sort((a, b) => b.discount - a.discount);
      default: return list;
    }
  }, [products, q, cat, showDiscount, sort, minPrice, maxPrice, minRating, primeOnly, freeShipOnly]);

  const localizedCategory = CATEGORY_NAMES[cat]?.[language] || cat;
  const title = showDiscount ? ui.deals : q ? ui.resultsFor(q) : cat && cat !== 'Tümü' ? localizedCategory : ui.allProducts;

  return (
    <div className="pl page-enter">
      <div className="container">
        <div className="pl__layout">
          {/* Sidebar Filters */}
          <aside className="pl__sidebar">
            <div className="pl__filter-section">
              <h3>{ui.filters}</h3>

              <div className="pl__filter-group">
                <h4>{ui.priceRange}</h4>
                <div className="pl__price-range">
                  <input
                    type="number"
                    placeholder={ui.minPrice}
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="pl__price-input"
                  />
                  <span>—</span>
                  <input
                    type="number"
                    placeholder={ui.maxPrice}
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="pl__price-input"
                  />
                </div>
              </div>

              <div className="pl__filter-group">
                <h4>{ui.ratings}</h4>
                {[4, 3, 2].map(r => (
                  <label key={r} className="pl__filter-label">
                    <input
                      type="radio"
                      name="rating"
                      value={r}
                      checked={minRating === r}
                      onChange={() => setMinRating(minRating === r ? 0 : r)}
                    />
                    <span className="stars">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
                    <span> {ui.andUp}</span>
                  </label>
                ))}
              </div>

              <div className="pl__filter-group">
                <h4>{ui.deliveryMembership}</h4>
                <label className="pl__filter-label">
                  <input type="checkbox" checked={primeOnly} onChange={e => setPrimeOnly(e.target.checked)} />
                  <span className="prime-badge">prime</span>
                </label>
                <label className="pl__filter-label">
                  <input type="checkbox" checked={freeShipOnly} onChange={e => setFreeShipOnly(e.target.checked)} />
                  <span> {ui.freeShipping}</span>
                </label>
              </div>

              <button
                className="pl__clear-filters"
                onClick={() => { setMinPrice(''); setMaxPrice(''); setMinRating(0); setPrimeOnly(false); setFreeShipOnly(false); }}
              >
                {ui.clear}
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="pl__main">
            <div className="pl__header">
              <div className="pl__title">
                <h1>{title}</h1>
                <span className="pl__count">{ui.results(filtered.length)}</span>
              </div>
              <div className="pl__sort">
                <label>{ui.sortBy}</label>
                <select value={sort} onChange={e => setSort(e.target.value)} className="pl__sort-select">
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{ui[o.labelKey] || ui.featured}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="spinner" />
            ) : filtered.length === 0 ? (
              <div className="pl__empty">
                <div className="pl__empty-icon" aria-hidden="true">
                  <Search size={30} strokeWidth={2.1} />
                </div>
                <h3>{ui.noResults}</h3>
                <p>{ui.noResultsText(q || cat || ui.allProducts)}</p>
              </div>
            ) : (
              <div className="pl__grid">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
