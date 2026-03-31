import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../components/ProductCard';
import { applyImageFallback, getProductPlaceholder } from '../utils/productImage';
import './Cart.css';

const CART_TEXT = {
  TR: {
    emptyTitle: 'Sepetiniz boş',
    emptyText: 'Alışverişe başlamak için ürünlere göz atın.',
    startShopping: 'Alışverişe Başla',
    cartTitle: 'Alışveriş Sepeti',
    price: 'Fiyat',
    freeShipping: 'Ücretsiz Kargo',
    onlyLeft: (stock) => `Sadece ${stock} adet kaldı`,
    seller: 'Satıcı:',
    qty: 'Adet',
    remove: 'Sil',
    saveForLater: 'Sonra Al',
    total: (count) => `Toplam (${count} ürün):`,
    primeNotice: 'Sipariş ücretsiz kargo kapsamında',
    checkout: 'Siparişi Tamamla',
  },
  EN: {
    emptyTitle: 'Your cart is empty',
    emptyText: 'Browse products to start shopping.',
    startShopping: 'Start Shopping',
    cartTitle: 'Shopping Cart',
    price: 'Price',
    freeShipping: 'Free Shipping',
    onlyLeft: (stock) => `Only ${stock} left in stock`,
    seller: 'Seller:',
    qty: 'Qty',
    remove: 'Delete',
    saveForLater: 'Save for Later',
    total: (count) => `Total (${count} items):`,
    primeNotice: 'This order qualifies for free delivery',
    checkout: 'Proceed to Checkout',
  },
  DE: {
    emptyTitle: 'Ihr Warenkorb ist leer',
    emptyText: 'Stöbern Sie in Produkten, um loszulegen.',
    startShopping: 'Jetzt einkaufen',
    cartTitle: 'Warenkorb',
    price: 'Preis',
    freeShipping: 'Kostenloser Versand',
    onlyLeft: (stock) => `Nur noch ${stock} auf Lager`,
    seller: 'Verkäufer:',
    qty: 'Menge',
    remove: 'Entfernen',
    saveForLater: 'Für später',
    total: (count) => `Summe (${count} Artikel):`,
    primeNotice: 'Diese Bestellung ist versandkostenfrei',
    checkout: 'Zur Kasse',
  },
  AR: {
    emptyTitle: 'سلتك فارغة',
    emptyText: 'تصفّح المنتجات لبدء التسوق.',
    startShopping: 'ابدأ التسوق',
    cartTitle: 'سلة التسوق',
    price: 'السعر',
    freeShipping: 'شحن مجاني',
    onlyLeft: (stock) => `متبقي ${stock} فقط`,
    seller: 'البائع:',
    qty: 'الكمية',
    remove: 'حذف',
    saveForLater: 'احفظ لوقت لاحق',
    total: (count) => `الإجمالي (${count} منتجات):`,
    primeNotice: 'هذا الطلب مؤهل للشحن المجاني',
    checkout: 'إتمام الطلب',
  },
};

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQty, totalPrice, totalItems } = useCart();
  const { language } = useLanguage();
  const ui = CART_TEXT[language] || CART_TEXT.TR;

  if (items.length === 0) {
    return (
      <div className="cart-empty page-enter">
        <div className="container">
          <div className="cart-empty__inner">
            <div className="cart-empty__icon" aria-hidden="true">
              <ShoppingCart size={34} strokeWidth={2.1} />
            </div>
            <h2>{ui.emptyTitle}</h2>
            <p>{ui.emptyText}</p>
            <button onClick={() => navigate('/')}>{ui.startShopping}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart page-enter">
      <div className="container">
        <div className="cart__layout">
          {/* Items */}
          <div className="cart__main">
            <div className="cart__header">
              <h1>{ui.cartTitle}</h1>
              <span className="cart__header-fiyat">{ui.price}</span>
            </div>
            <div className="cart__divider" />

            {items.map(item => (
              <div key={item.id} className="cart__item">
                <img
                  src={item.image || getProductPlaceholder(item)}
                  alt={item.name}
                  className="cart__item-img"
                  onClick={() => navigate(`/product/${item.id}`)}
                  onError={(e) => applyImageFallback(e, item)}
                />
                <div className="cart__item-body">
                  <div
                    className="cart__item-name"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    {item.name}
                  </div>
                  <div className="cart__item-meta">
                    {item.prime && <span className="prime-badge" style={{ fontSize: 11 }}>prime</span>}
                    {item.freeShipping && <span className="cart__free-ship">{ui.freeShipping}</span>}
                    {item.stock <= 5 && item.stock > 0 && (
                      <span className="text-orange" style={{ fontSize: 12 }}>{ui.onlyLeft(item.stock)}</span>
                    )}
                  </div>
                  <div className="cart__item-seller text-secondary">{ui.seller} {item.seller}</div>

                  <div className="cart__item-actions">
                    <select
                      className="cart__qty-select"
                      value={item.quantity}
                      onChange={e => updateQty(item.id, Number(e.target.value))}
                    >
                      {Array.from({ length: Math.min(10, item.stock || 10) }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{ui.qty}: {n}</option>
                      ))}
                    </select>
                    <span className="cart__action-sep">|</span>
                    <button className="cart__action-btn" onClick={() => removeItem(item.id)}>{ui.remove}</button>
                    <span className="cart__action-sep">|</span>
                    <button className="cart__action-btn">{ui.saveForLater}</button>
                  </div>
                </div>
                <div className="cart__item-price">{formatPrice(item.price * item.quantity)}</div>
              </div>
            ))}

            <div className="cart__divider" />
            <div className="cart__subtotal-right">
              {ui.total(totalItems)} <strong>{formatPrice(totalPrice)}</strong>
            </div>
          </div>

          {/* Summary */}
          <div className="cart__summary">
            <div className="cart__summary-inner">
              {items.some(i => i.prime) && (
                <div className="cart__summary-prime">
                  <span className="prime-badge" style={{ fontSize: 12, padding: '2px 8px' }}>prime</span>
                  <span style={{ fontSize: 13, marginLeft: 6 }}>{ui.primeNotice}</span>
                </div>
              )}
              <div className="cart__summary-total">
                {ui.total(totalItems)}
                <strong> {formatPrice(totalPrice)}</strong>
              </div>
              <button
                className="cart__checkout-btn"
                onClick={() => navigate('/checkout')}
              >
                {ui.checkout}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
