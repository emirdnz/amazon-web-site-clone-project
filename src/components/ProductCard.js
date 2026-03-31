import React from 'react';
import { Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { applyImageFallback, getProductPlaceholder } from '../utils/productImage';
import './ProductCard.css';

const formatPrice = (n) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n);

const CARD_TEXT = {
  TR: {
    listPrice: 'Liste fiyatı:',
    freeDelivery: ' ÜCRETSİZ teslimat',
    tomorrow: 'Yarın teslim',
    inDays: (days) => `${days} günde teslim`,
    add: 'Sepete Ekle',
    added: 'Sepete Eklendi',
  },
  EN: {
    listPrice: 'List price:',
    freeDelivery: ' FREE delivery',
    tomorrow: 'Delivery tomorrow',
    inDays: (days) => `Delivery in ${days} days`,
    add: 'Add to Cart',
    added: 'Added to Cart',
  },
  DE: {
    listPrice: 'Listenpreis:',
    freeDelivery: ' KOSTENLOSE Lieferung',
    tomorrow: 'Morgen geliefert',
    inDays: (days) => `Lieferung in ${days} Tagen`,
    add: 'In den Warenkorb',
    added: 'Zum Warenkorb hinzugefügt',
  },
  AR: {
    listPrice: 'السعر الأصلي:',
    freeDelivery: ' توصيل مجاني',
    tomorrow: 'التسليم غداً',
    inDays: (days) => `التسليم خلال ${days} أيام`,
    add: 'أضف إلى السلة',
    added: 'تمت الإضافة إلى السلة',
  },
};

const Stars = ({ rating, count }) => (
  <div className="pc__stars">
    <span className="pc__stars-icons" aria-label={`Puan ${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i + 1));
        return (
          <span key={i} className="pc__star-wrap">
            <Star size={16} className="pc__star pc__star--base" strokeWidth={1.9} />
            <span className="pc__star-fill" style={{ width: `${fill * 100}%` }}>
              <Star size={16} className="pc__star pc__star--active" strokeWidth={1.9} fill="currentColor" />
            </span>
          </span>
        );
      })}
    </span>
    <span className="pc__stars-count">{count?.toLocaleString('tr-TR')}</span>
  </div>
);

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { language } = useLanguage();
  const [added, setAdded] = React.useState(false);
  const fallbackImage = getProductPlaceholder(product);
  const ui = CARD_TEXT[language] || CARD_TEXT.TR;

  const handleAdd = (e) => {
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="pc" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="pc__img-wrap">
        {product.discount > 0 && (
          <div className="pc__badge">-%{product.discount}</div>
        )}
        <img
          src={product.image || fallbackImage}
          alt={product.name}
          className="pc__img"
          loading="lazy"
          onError={(e) => applyImageFallback(e, product)}
        />
      </div>
      <div className="pc__body">
        <div className="pc__name">{product.name}</div>
        <Stars rating={product.rating} count={product.reviewCount} />
        {product.prime && (
          <div className="pc__prime">
            <span className="pc__prime-badge">prime</span>
            {product.freeShipping && <span className="pc__free-ship">{ui.freeDelivery}</span>}
          </div>
        )}
        <div className="pc__price-row">
          <div className="pc__price">
            <span className="pc__price-sym">₺</span>
            <span className="pc__price-val">{formatPrice(product.price).replace('₺','').replace('TRY','').trim()}</span>
          </div>
          {product.originalPrice > product.price && (
            <div className="pc__original">{ui.listPrice} <span>{formatPrice(product.originalPrice)}</span></div>
          )}
        </div>
        <div className="pc__delivery">
          {product.deliveryDays === 1
            ? <span className="pc__delivery-fast">{ui.tomorrow}</span>
            : <span className="pc__delivery-normal">{ui.inDays(product.deliveryDays)}</span>
          }
        </div>
        <button
          className={`pc__add-btn ${added ? 'pc__add-btn--added' : ''}`}
          onClick={handleAdd}
        >
          {added ? (
            <>
              <Check size={14} strokeWidth={2.4} />
              <span>{ui.added}</span>
            </>
          ) : (
            ui.add
          )}
        </button>
      </div>
    </div>
  );
}

export { formatPrice, Stars };
