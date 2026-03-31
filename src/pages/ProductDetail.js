import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { formatPrice, Stars } from '../components/ProductCard';
import { applyImageFallback, getProductPlaceholder } from '../utils/productImage';
import './ProductDetail.css';

const DETAIL_TEXT = {
  TR: {
    added: 'Ürün sepete eklendi!',
    notFound: 'Ürün bulunamadı',
    backHome: 'Ana Sayfaya Dön',
    home: 'Ana Sayfa',
    features: 'Ürün Özellikleri',
    listPrice: 'Liste Fiyatı:',
    save: 'tasarruf',
    freeShipping: 'ÜCRETSİZ Kargo',
    freeDelivery: 'ÜCRETSİZ Teslimat',
    tomorrow: 'Yarın teslim alın',
    inDays: (days) => `${days} iş günü içinde teslim`,
    inStock: 'Stokta var',
    onlyLeft: (stock) => `Sadece ${stock} adet kaldı`,
    outOfStock: 'Stok yok',
    quantity: 'Adet:',
    addToCart: 'Sepete Ekle',
    alreadyInCart: 'Sepete Ekle (Zaten sepette)',
    buyNow: 'Şimdi Satın Al',
    seller: 'Satıcı:',
    description: 'Ürün Açıklaması',
    specs: 'Teknik Özellikler',
    reviews: (count) => `Değerlendirmeler (${count})`,
    reviewCount: (count) => `${count} değerlendirme`,
    related: 'Benzer Ürünler',
    brand: 'Marka',
    category: 'Kategori',
    stock: 'Stok',
    delivery: 'Teslimat',
    unit: 'adet',
    workday: 'iş günü',
  },
  EN: {
    added: 'Product added to cart!',
    notFound: 'Product not found',
    backHome: 'Back to Home',
    home: 'Home',
    features: 'Product Features',
    listPrice: 'List Price:',
    save: 'save',
    freeShipping: 'FREE Shipping',
    freeDelivery: 'FREE Delivery',
    tomorrow: 'Get it tomorrow',
    inDays: (days) => `Delivered within ${days} business days`,
    inStock: 'In stock',
    onlyLeft: (stock) => `Only ${stock} left`,
    outOfStock: 'Out of stock',
    quantity: 'Qty:',
    addToCart: 'Add to Cart',
    alreadyInCart: 'Add to Cart (Already in cart)',
    buyNow: 'Buy Now',
    seller: 'Seller:',
    description: 'Product Description',
    specs: 'Technical Details',
    reviews: (count) => `Reviews (${count})`,
    reviewCount: (count) => `${count} reviews`,
    related: 'Related Products',
    brand: 'Brand',
    category: 'Category',
    stock: 'Stock',
    delivery: 'Delivery',
    unit: 'pcs',
    workday: 'business days',
  },
  DE: {
    added: 'Produkt wurde zum Warenkorb hinzugefügt!',
    notFound: 'Produkt nicht gefunden',
    backHome: 'Zur Startseite',
    home: 'Startseite',
    features: 'Produktmerkmale',
    listPrice: 'Listenpreis:',
    save: 'Ersparnis',
    freeShipping: 'KOSTENLOSER Versand',
    freeDelivery: 'KOSTENLOSE Lieferung',
    tomorrow: 'Morgen geliefert',
    inDays: (days) => `Lieferung in ${days} Werktagen`,
    inStock: 'Auf Lager',
    onlyLeft: (stock) => `Nur noch ${stock} Stück`,
    outOfStock: 'Nicht auf Lager',
    quantity: 'Menge:',
    addToCart: 'In den Warenkorb',
    alreadyInCart: 'In den Warenkorb (bereits im Warenkorb)',
    buyNow: 'Jetzt kaufen',
    seller: 'Verkäufer:',
    description: 'Produktbeschreibung',
    specs: 'Technische Daten',
    reviews: (count) => `Bewertungen (${count})`,
    reviewCount: (count) => `${count} Bewertungen`,
    related: 'Ähnliche Produkte',
    brand: 'Marke',
    category: 'Kategorie',
    stock: 'Bestand',
    delivery: 'Lieferung',
    unit: 'Stk.',
    workday: 'Werktage',
  },
  AR: {
    added: 'تمت إضافة المنتج إلى السلة!',
    notFound: 'المنتج غير موجود',
    backHome: 'العودة للرئيسية',
    home: 'الرئيسية',
    features: 'مميزات المنتج',
    listPrice: 'السعر الأصلي:',
    save: 'توفير',
    freeShipping: 'شحن مجاني',
    freeDelivery: 'توصيل مجاني',
    tomorrow: 'استلمه غداً',
    inDays: (days) => `التسليم خلال ${days} أيام عمل`,
    inStock: 'متوفر',
    onlyLeft: (stock) => `متبقي ${stock} فقط`,
    outOfStock: 'غير متوفر',
    quantity: 'الكمية:',
    addToCart: 'أضف إلى السلة',
    alreadyInCart: 'أضف إلى السلة (موجود بالفعل)',
    buyNow: 'اشترِ الآن',
    seller: 'البائع:',
    description: 'وصف المنتج',
    specs: 'المواصفات التقنية',
    reviews: (count) => `التقييمات (${count})`,
    reviewCount: (count) => `${count} تقييم`,
    related: 'منتجات مشابهة',
    brand: 'العلامة التجارية',
    category: 'الفئة',
    stock: 'المخزون',
    delivery: 'التوصيل',
    unit: 'قطعة',
    workday: 'أيام عمل',
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const ui = DETAIL_TEXT[language] || DETAIL_TEXT.TR;
  const { getById, products, loading } = useProducts();
  const { addItem, items } = useCart();

  const product = getById(id);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedMsg, setAddedMsg] = useState('');
  const [activeTab, setActiveTab] = useState('desc');

  const inCart = items.find(i => i.id === product?.id);
  const related = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAddedMsg(ui.added);
    setTimeout(() => setAddedMsg(''), 2500);
  };

  const handleBuyNow = () => {
    addItem(product);
    navigate('/cart');
  };

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!product) return (
    <div className="pd-notfound">
      <h2>{ui.notFound}</h2>
      <button onClick={() => navigate('/')}>{ui.backHome}</button>
    </div>
  );

  const fallbackImage = getProductPlaceholder(product);
  const imgs = product.images?.length ? product.images : [product.image || fallbackImage];

  return (
    <div className="pd page-enter">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="pd__breadcrumb">
          <span onClick={() => navigate('/')}>{ui.home}</span>
          <span> › </span>
          <span onClick={() => navigate(`/search?cat=${product.category}`)}>{product.category}</span>
          <span> › </span>
          <span onClick={() => navigate(`/search?cat=${product.subcategory}`)}>{product.subcategory}</span>
          <span> › </span>
          <span className="pd__breadcrumb-current">{product.name.slice(0, 40)}...</span>
        </nav>

        <div className="pd__main">
          {/* Image Gallery */}
          <div className="pd__gallery">
            <div className="pd__thumbs">
              {imgs.map((img, i) => (
                <div
                  key={i}
                  className={`pd__thumb ${i === selectedImg ? 'pd__thumb--active' : ''}`}
                  onClick={() => setSelectedImg(i)}
                >
                  <img src={img || fallbackImage} alt={`${product.name} ${i+1}`} loading="lazy" onError={(e) => applyImageFallback(e, product)} />
                </div>
              ))}
            </div>
            <div className="pd__img-main">
              {product.discount > 0 && (
                <div className="pd__badge">-%{product.discount} İndirim</div>
              )}
              <img src={imgs[selectedImg] || fallbackImage} alt={product.name} onError={(e) => applyImageFallback(e, product)} />
            </div>
          </div>

          {/* Info */}
          <div className="pd__info">
            <div className="pd__brand">{product.brand}</div>
            <h1 className="pd__name">{product.name}</h1>

            <div className="pd__rating-row">
              <Stars rating={product.rating} count={product.reviewCount} />
              <span className="pd__rating-val">{product.rating}</span>
              {product.prime && <span className="prime-badge" style={{ marginLeft: 12, fontSize: 13, padding: '2px 8px' }}>prime</span>}
            </div>

            <div className="pd__divider" />

            <div className="pd__price-block">
              {product.originalPrice > product.price && (
                <div className="pd__original">
                  {ui.listPrice} <span>{formatPrice(product.originalPrice)}</span>
                  <span className="pd__you-save"> (%{product.discount} {ui.save})</span>
                </div>
              )}
              <div className="pd__price">
                <span className="pd__price-sym">₺</span>
                <span className="pd__price-val">{formatPrice(product.price).replace('₺','').replace('TRY','').trim()}</span>
              </div>
              {product.freeShipping && (
                <div className="pd__free-ship">
                  <Check size={14} strokeWidth={2.4} />
                  <span>{ui.freeShipping}</span>
                </div>
              )}
            </div>

            <div className="pd__divider" />

            {/* Features */}
            {product.features?.length > 0 && (
              <div className="pd__features">
                <h3>{ui.features}</h3>
                <ul>
                  {product.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Buy Box */}
          <div className="pd__buybox">
            <div className="pd__buybox-price">{formatPrice(product.price)}</div>

            {product.freeShipping && (
              <div className="pd__buybox-ship">
                <span className="pd__buybox-ship-prime">prime</span>
                <span> {ui.freeDelivery}</span>
              </div>
            )}

            <div className="pd__buybox-delivery">
              <span className="pd__status-line">
                <Check size={14} strokeWidth={2.4} />
                <span>
                  {product.deliveryDays === 1
                    ? ui.tomorrow
                    : ui.inDays(product.deliveryDays)}
                </span>
              </span>
            </div>

            <div className="pd__buybox-stock">
              {product.stock > 5
                ? <span className="text-green">{ui.inStock}</span>
                : product.stock > 0
                  ? <span className="text-orange">{ui.onlyLeft(product.stock)}</span>
                  : <span className="text-red">{ui.outOfStock}</span>
              }
            </div>

            <div className="pd__buybox-qty">
              <label>{ui.quantity}</label>
              <select value={qty} onChange={e => setQty(Number(e.target.value))}>
                {Array.from({ length: Math.min(10, product.stock) }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {addedMsg && (
              <div className="pd__added-msg">
                <Check size={14} strokeWidth={2.4} />
                <span>{addedMsg}</span>
              </div>
            )}

            <button className="pd__add-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
              {inCart ? ui.alreadyInCart : ui.addToCart}
            </button>
            <button className="pd__buy-btn" onClick={handleBuyNow} disabled={product.stock === 0}>
              {ui.buyNow}
            </button>

            <div className="pd__buybox-seller">
              <span className="text-secondary">{ui.seller} </span>
              <span className="text-orange">{product.seller}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pd__tabs">
          {[
            { id: 'desc', label: ui.description },
            { id: 'specs', label: ui.specs },
            { id: 'reviews', label: ui.reviews(product.reviewCount?.toLocaleString('tr-TR')) },
          ].map(t => (
            <button
              key={t.id}
              className={`pd__tab ${activeTab === t.id ? 'pd__tab--active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="pd__tab-content">
          {activeTab === 'desc' && (
            <div className="pd__desc">
              <p>{product.description}</p>
            </div>
          )}
          {activeTab === 'specs' && (
            <div className="pd__specs">
              <table>
                <tbody>
                  <tr><td>{ui.brand}</td><td>{product.brand}</td></tr>
                  <tr><td>{ui.category}</td><td>{product.category} › {product.subcategory}</td></tr>
                  <tr><td>{ui.seller}</td><td>{product.seller}</td></tr>
                  <tr><td>{ui.stock}</td><td>{product.stock} {ui.unit}</td></tr>
                  <tr><td>{ui.delivery}</td><td>{product.deliveryDays} {ui.workday}</td></tr>
                  {product.features?.map((f, i) => (
                    <tr key={i}><td>Özellik {i+1}</td><td>{f}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="pd__reviews">
              <div className="pd__review-summary">
                <div className="pd__review-score">{product.rating}</div>
                <div>
                  <Stars rating={product.rating} />
                  <div className="text-secondary">{ui.reviewCount(product.reviewCount?.toLocaleString('tr-TR'))}</div>
                </div>
              </div>
              {/* Fake reviews */}
              {[
                { name: 'Ahmet Y.', rating: 5, date: '12 Ocak 2024', text: 'Harika bir ürün, kesinlikle tavsiye ederim. Kargo da çok hızlıydı.' },
                { name: 'Fatma K.', rating: 4, date: '5 Şubat 2024', text: 'Ürün beklentilerimi karşıladı. Kalitesi gayet iyi, fiyatına göre mükemmel.' },
                { name: 'Mehmet D.', rating: 5, date: '22 Mart 2024', text: 'Çok memnun kaldım. İkinci kez alıyorum, yine aldım.' },
              ].map((r, i) => (
                <div key={i} className="pd__review-item">
                  <div className="pd__review-header">
                    <div className="pd__review-avatar">{r.name[0]}</div>
                    <div>
                      <div className="pd__review-name">{r.name}</div>
                      <Stars rating={r.rating} />
                    </div>
                    <div className="pd__review-date text-secondary">{r.date}</div>
                  </div>
                  <p className="pd__review-text">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="pd__related">
            <h2>{ui.related}</h2>
            <div className="pd__related-grid">
              {related.map(p => (
                <div key={p.id} className="pd__related-card" onClick={() => navigate(`/product/${p.id}`)}>
                  <img src={p.image || getProductPlaceholder(p)} alt={p.name} onError={(e) => applyImageFallback(e, p)} />
                  <div className="pd__related-name">{p.name}</div>
                  <div className="pd__related-price">{formatPrice(p.price)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
