import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  FileText,
  Lock,
  MapPin,
  Phone,
  ShoppingCart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../components/ProductCard';
import { saveOrderHistory } from '../data/mockOrders';
import { applyImageFallback, getProductPlaceholder } from '../utils/productImage';
import './Checkout.css';

const CHECKOUT_TEXT = {
  TR: {
    steps: ['Adres', 'Ödeme', 'İnceleme', 'Onay'],
    empty: 'Sepetiniz boş',
    start: 'Alışverişe Başla',
    addressTitle: 'Teslimat Adresi',
    paymentTitle: 'Ödeme Bilgileri',
    reviewTitle: 'Sipariş İnceleme',
    backCart: 'Sepete Dön',
    nextPayment: 'Ödeme Adımına Geç',
    notice: 'Tüm ödeme bilgileriniz 256-bit SSL şifreleme ile korunmaktadır. Bu bir simülasyondur — gerçek ödeme alınmaz.',
    backAddress: 'Adrese Dön',
    reviewOrder: 'Siparişi İncele',
    addressReview: 'Teslimat Adresi',
    paymentMethod: 'Ödeme Yöntemi',
    change: 'Değiştir',
    products: 'Ürünler',
    quantity: 'Adet',
    backPayment: 'Ödemeye Dön',
    processing: 'Sipariş işleniyor...',
    placeOrder: 'Siparişi Ver',
    success: 'Siparişiniz Alındı!',
    orderNo: 'Sipariş No',
    successMsg: 'Siparişiniz başarıyla oluşturuldu. Kargo takip bilgileriniz e-posta adresinize gönderilecektir.',
    eta: 'Tahmini Teslimat',
    payment: 'Ödeme',
    total: 'Toplam',
    goOrders: 'Siparişlerime Git',
    goHome: 'Ana Sayfaya Dön',
    summary: 'Sipariş Özeti',
    items: 'Ürünler',
    shipping: 'Kargo',
    free: 'ÜCRETSİZ',
    secure: 'Güvenli Ödeme',
    cardNumber: 'Kart numarası 16 haneli olmalıdır.',
    cardHolder: 'Kart sahibi adı giriniz.',
    cardExpiry: 'Son kullanma tarihi giriniz.',
    cardCvv: 'CVV en az 3 haneli olmalıdır.',
  },
  EN: {
    steps: ['Address', 'Payment', 'Review', 'Done'],
    empty: 'Your cart is empty',
    start: 'Start Shopping',
    addressTitle: 'Shipping Address',
    paymentTitle: 'Payment Information',
    reviewTitle: 'Order Review',
    backCart: 'Back to Cart',
    nextPayment: 'Continue to Payment',
    notice: 'Your payment details are protected with 256-bit SSL encryption. This is a demo and no real payment is taken.',
    backAddress: 'Back to Address',
    reviewOrder: 'Review Order',
    addressReview: 'Shipping Address',
    paymentMethod: 'Payment Method',
    change: 'Change',
    products: 'Products',
    quantity: 'Qty',
    backPayment: 'Back to Payment',
    processing: 'Processing order...',
    placeOrder: 'Place Order',
    success: 'Your Order Has Been Placed!',
    orderNo: 'Order No',
    successMsg: 'Your order was created successfully. Tracking details will be sent to your email address.',
    eta: 'Estimated Delivery',
    payment: 'Payment',
    total: 'Total',
    goOrders: 'Go to My Orders',
    goHome: 'Back to Home',
    summary: 'Order Summary',
    items: 'Items',
    shipping: 'Shipping',
    free: 'FREE',
    secure: 'Secure Payment',
    cardNumber: 'Card number must be 16 digits.',
    cardHolder: 'Please enter the cardholder name.',
    cardExpiry: 'Please enter an expiry date.',
    cardCvv: 'CVV must be at least 3 digits.',
  },
  DE: {
    steps: ['Adresse', 'Zahlung', 'Prüfen', 'Fertig'],
    empty: 'Ihr Warenkorb ist leer',
    start: 'Jetzt einkaufen',
    addressTitle: 'Lieferadresse',
    paymentTitle: 'Zahlungsinformationen',
    reviewTitle: 'Bestellung prüfen',
    backCart: 'Zurück zum Warenkorb',
    nextPayment: 'Weiter zur Zahlung',
    notice: 'Ihre Zahlungsdaten sind mit 256-Bit-SSL geschützt. Dies ist eine Demo ohne echte Zahlung.',
    backAddress: 'Zurück zur Adresse',
    reviewOrder: 'Bestellung prüfen',
    addressReview: 'Lieferadresse',
    paymentMethod: 'Zahlungsmethode',
    change: 'Ändern',
    products: 'Produkte',
    quantity: 'Menge',
    backPayment: 'Zurück zur Zahlung',
    processing: 'Bestellung wird bearbeitet...',
    placeOrder: 'Bestellung aufgeben',
    success: 'Ihre Bestellung ist eingegangen!',
    orderNo: 'Bestellnr.',
    successMsg: 'Ihre Bestellung wurde erfolgreich erstellt. Sendungsdaten werden per E-Mail verschickt.',
    eta: 'Voraussichtliche Lieferung',
    payment: 'Zahlung',
    total: 'Gesamt',
    goOrders: 'Zu meinen Bestellungen',
    goHome: 'Zur Startseite',
    summary: 'Bestellübersicht',
    items: 'Produkte',
    shipping: 'Versand',
    free: 'KOSTENLOS',
    secure: 'Sichere Zahlung',
    cardNumber: 'Die Kartennummer muss 16-stellig sein.',
    cardHolder: 'Bitte Namen des Karteninhabers eingeben.',
    cardExpiry: 'Bitte Ablaufdatum eingeben.',
    cardCvv: 'CVV muss mindestens 3-stellig sein.',
  },
  AR: {
    steps: ['العنوان', 'الدفع', 'المراجعة', 'تم'],
    empty: 'سلتك فارغة',
    start: 'ابدأ التسوق',
    addressTitle: 'عنوان الشحن',
    paymentTitle: 'بيانات الدفع',
    reviewTitle: 'مراجعة الطلب',
    backCart: 'العودة إلى السلة',
    nextPayment: 'المتابعة إلى الدفع',
    notice: 'بيانات الدفع محمية بتشفير SSL 256-bit. هذا عرض تجريبي ولا يتم تحصيل أي دفعة فعلية.',
    backAddress: 'العودة إلى العنوان',
    reviewOrder: 'مراجعة الطلب',
    addressReview: 'عنوان الشحن',
    paymentMethod: 'طريقة الدفع',
    change: 'تغيير',
    products: 'المنتجات',
    quantity: 'الكمية',
    backPayment: 'العودة إلى الدفع',
    processing: 'جارٍ معالجة الطلب...',
    placeOrder: 'تأكيد الطلب',
    success: 'تم استلام طلبك!',
    orderNo: 'رقم الطلب',
    successMsg: 'تم إنشاء طلبك بنجاح. سيتم إرسال تفاصيل التتبع إلى بريدك الإلكتروني.',
    eta: 'موعد التسليم المتوقع',
    payment: 'الدفع',
    total: 'الإجمالي',
    goOrders: 'اذهب إلى طلباتي',
    goHome: 'العودة للرئيسية',
    summary: 'ملخص الطلب',
    items: 'المنتجات',
    shipping: 'الشحن',
    free: 'مجاني',
    secure: 'دفع آمن',
    cardNumber: 'يجب أن يكون رقم البطاقة 16 رقماً.',
    cardHolder: 'يرجى إدخال اسم صاحب البطاقة.',
    cardExpiry: 'يرجى إدخال تاريخ الانتهاء.',
    cardCvv: 'يجب أن يكون CVV من 3 أرقام على الأقل.',
  },
};

const CARDS = [
  { id: 'visa', label: 'Visa', color: '#1A1F71' },
  { id: 'mc', label: 'Mastercard', color: '#EB001B' },
  { id: 'troy', label: 'Troy', color: '#006FCF' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const ui = CHECKOUT_TEXT[language] || CHECKOUT_TEXT.TR;
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Address form
  const [address, setAddress] = useState({
    name: '', surname: '', phone: '', city: 'İstanbul', district: '', address: '', zip: ''
  });

  // Payment form
  const [payment, setPayment] = useState({
    cardType: 'visa', cardHolder: '', cardNumber: '', expMonth: '', expYear: '', cvv: ''
  });
  const [cardErrors, setCardErrors] = useState({});

  const shippingCost = items.some(i => i.freeShipping) ? 0 : 39.99;
  const grandTotal = totalPrice + shippingCost;

  if (items.length === 0 && step < 3) {
    return (
      <div className="checkout page-enter">
        <div className="container">
          <div style={{ background: 'white', borderRadius: 8, padding: 48, textAlign: 'center', border: '1px solid #DDD', maxWidth: 480, margin: '40px auto' }}>
            <div className="co__empty-state-icon" aria-hidden="true">
              <ShoppingCart size={30} strokeWidth={2.1} />
            </div>
            <h2>{ui.empty}</h2>
            <button onClick={() => navigate('/')} style={{ marginTop: 16, background: '#FFA41C', border: '1px solid #C8A021', borderRadius: 24, padding: '10px 24px', cursor: 'pointer', fontSize: 14 }}>
              {ui.start}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddressNext = (e) => {
    e.preventDefault();
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateCard = () => {
    const errs = {};
    const raw = payment.cardNumber.replace(/\s/g, '');
    if (raw.length !== 16) errs.cardNumber = ui.cardNumber;
    if (!payment.cardHolder.trim()) errs.cardHolder = ui.cardHolder;
    if (!payment.expMonth || !payment.expYear) errs.exp = ui.cardExpiry;
    if (payment.cvv.length < 3) errs.cvv = ui.cardCvv;
    return errs;
  };

  const handlePaymentNext = (e) => {
    e.preventDefault();
    const errs = validateCard();
    if (Object.keys(errs).length) { setCardErrors(errs); return; }
    setCardErrors({});
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    setTimeout(() => {
      const id = 'TR' + Date.now().toString().slice(-8);
      const paymentLabel = `${CARDS.find(c => c.id === payment.cardType)?.label} •••• ${payment.cardNumber.replace(/\s/g, '').slice(-4)}`;
      const dateLabel = new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date());

      saveOrderHistory({
        id,
        createdAt: Date.now(),
        date: dateLabel,
        status: 'Hazırlanıyor',
        total: grandTotal,
        estimatedDelivery: '1-2 iş günü içinde teslim',
        payment: paymentLabel,
        shippingAddress: `${address.address}, ${address.district}, ${address.city} ${address.zip}`.trim(),
        items: items.map(({ id: itemId, name, quantity, price, image }) => ({
          id: itemId,
          name,
          quantity,
          price,
          image,
        })),
      });

      setOrderId(id);
      clearCart();
      setStep(3);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2200);
  };

  const formatCardInput = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    return raw.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="checkout page-enter">
      <div className="container">
        {/* Steps indicator */}
        {step < 3 && (
          <div className="co__steps">
            {ui.steps.slice(0, 3).map((s, i) => (
              <React.Fragment key={s}>
                <div className={`co__step ${i === step ? 'co__step--active' : i < step ? 'co__step--done' : ''}`}>
                  <div className="co__step-num">{i < step ? <Check size={16} strokeWidth={2.6} /> : i + 1}</div>
                  <div className="co__step-label">{s}</div>
                </div>
                {i < 2 && <div className={`co__step-line ${i < step ? 'co__step-line--done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className={`co__layout ${step === 3 ? 'co__layout--full' : ''}`}>
          {/* Left: Form */}
          <div className="co__form-area">

            {/* STEP 0: Address */}
            {step === 0 && (
              <div className="co__card">
                <h2 className="co__card-title">
                  <MapPin size={20} strokeWidth={2.1} className="co__card-title-icon" />
                  <span>{ui.addressTitle}</span>
                </h2>
                <form onSubmit={handleAddressNext} className="co__form">
                  <div className="co__form-row">
                    <div className="co__form-group">
                      <label>Ad *</label>
                      <input required value={address.name} onChange={e => setAddress({...address, name: e.target.value})} placeholder="Adınız" />
                    </div>
                    <div className="co__form-group">
                      <label>Soyad *</label>
                      <input required value={address.surname} onChange={e => setAddress({...address, surname: e.target.value})} placeholder="Soyadınız" />
                    </div>
                  </div>
                  <div className="co__form-group">
                    <label>Telefon *</label>
                    <input required type="tel" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} placeholder="05XX XXX XX XX" />
                  </div>
                  <div className="co__form-row">
                    <div className="co__form-group">
                      <label>İl *</label>
                      <select value={address.city} onChange={e => setAddress({...address, city: e.target.value})}>
                        {['İstanbul','Ankara','İzmir','Bursa','Antalya','Adana','Konya','Gaziantep','Mersin','Kocaeli'].map(c => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="co__form-group">
                      <label>İlçe *</label>
                      <input required value={address.district} onChange={e => setAddress({...address, district: e.target.value})} placeholder="İlçe" />
                    </div>
                    <div className="co__form-group co__form-group--sm">
                      <label>Posta Kodu</label>
                      <input value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} placeholder="34000" maxLength={5} />
                    </div>
                  </div>
                  <div className="co__form-group">
                    <label>Adres *</label>
                    <textarea required rows={3} value={address.address} onChange={e => setAddress({...address, address: e.target.value})} placeholder="Mahalle, cadde, sokak ve kapı no" />
                  </div>
                  <div className="co__form-actions">
                    <button type="button" className="co__btn-back" onClick={() => navigate('/cart')}>
                      <ArrowLeft size={16} strokeWidth={2.2} />
                      <span>{ui.backCart}</span>
                    </button>
                    <button type="submit" className="co__btn-next">
                      <span>{ui.nextPayment}</span>
                      <ArrowRight size={16} strokeWidth={2.2} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 1: Payment */}
            {step === 1 && (
              <div className="co__card">
                <h2 className="co__card-title">
                  <CreditCard size={20} strokeWidth={2.1} className="co__card-title-icon" />
                  <span>{ui.paymentTitle}</span>
                </h2>
                <div className="co__payment-notice">
                  <Lock size={16} strokeWidth={2.1} />
                  <span>{ui.notice}</span>
                </div>

                <div className="co__card-types">
                  {CARDS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      className={`co__card-type ${payment.cardType === c.id ? 'co__card-type--active' : ''}`}
                      onClick={() => setPayment({...payment, cardType: c.id})}
                      style={{ '--card-color': c.color }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Visual Card Preview */}
                <div className="co__card-preview" style={{ background: `linear-gradient(135deg, ${CARDS.find(c=>c.id===payment.cardType)?.color}CC, ${CARDS.find(c=>c.id===payment.cardType)?.color}88)` }}>
                  <div className="co__card-preview-chip" aria-hidden="true" />
                  <div className="co__card-preview-num">
                    {payment.cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="co__card-preview-bottom">
                    <div>
                      <div style={{fontSize:10,opacity:.7}}>KART SAHİBİ</div>
                      <div>{payment.cardHolder || 'AD SOYAD'}</div>
                    </div>
                    <div>
                      <div style={{fontSize:10,opacity:.7}}>SON KULLANMA</div>
                      <div>{payment.expMonth || 'AA'}/{payment.expYear || 'YY'}</div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePaymentNext} className="co__form">
                  <div className="co__form-group">
                    <label>Kart Numarası *</label>
                    <input
                      required
                      value={payment.cardNumber}
                      onChange={e => setPayment({...payment, cardNumber: formatCardInput(e.target.value)})}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className={cardErrors.cardNumber ? 'co__input-error' : ''}
                    />
                    {cardErrors.cardNumber && <span className="co__error">{cardErrors.cardNumber}</span>}
                  </div>
                  <div className="co__form-group">
                    <label>Kart Sahibi *</label>
                    <input
                      required
                      value={payment.cardHolder}
                      onChange={e => setPayment({...payment, cardHolder: e.target.value.toUpperCase()})}
                      placeholder="AD SOYAD"
                      className={cardErrors.cardHolder ? 'co__input-error' : ''}
                    />
                    {cardErrors.cardHolder && <span className="co__error">{cardErrors.cardHolder}</span>}
                  </div>
                  <div className="co__form-row">
                    <div className="co__form-group">
                      <label>Son Kullanma Ay *</label>
                      <select value={payment.expMonth} onChange={e => setPayment({...payment, expMonth: e.target.value})} className={cardErrors.exp ? 'co__input-error' : ''}>
                        <option value="">Ay</option>
                        {Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0')).map(m=>(
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="co__form-group">
                      <label>Son Kullanma Yıl *</label>
                      <select value={payment.expYear} onChange={e => setPayment({...payment, expYear: e.target.value})} className={cardErrors.exp ? 'co__input-error' : ''}>
                        <option value="">Yıl</option>
                        {Array.from({length:10},(_,i)=>String(2024+i)).map(y=>(
                          <option key={y} value={y.slice(2)}>{y}</option>
                        ))}
                      </select>
                      {cardErrors.exp && <span className="co__error">{cardErrors.exp}</span>}
                    </div>
                    <div className="co__form-group co__form-group--sm">
                      <label>CVV *</label>
                      <input
                        required
                        value={payment.cvv}
                        onChange={e => setPayment({...payment, cvv: e.target.value.replace(/\D/,'').slice(0,4)})}
                        placeholder="•••"
                        maxLength={4}
                        type="password"
                        className={cardErrors.cvv ? 'co__input-error' : ''}
                      />
                      {cardErrors.cvv && <span className="co__error">{cardErrors.cvv}</span>}
                    </div>
                  </div>
                  <div className="co__form-actions">
                    <button type="button" className="co__btn-back" onClick={() => setStep(0)}>
                      <ArrowLeft size={16} strokeWidth={2.2} />
                      <span>{ui.backAddress}</span>
                    </button>
                    <button type="submit" className="co__btn-next">
                      <span>{ui.reviewOrder}</span>
                      <ArrowRight size={16} strokeWidth={2.2} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: Review */}
            {step === 2 && (
              <div className="co__card">
                <h2 className="co__card-title">
                  <FileText size={20} strokeWidth={2.1} className="co__card-title-icon" />
                  <span>{ui.reviewTitle}</span>
                </h2>

                <div className="co__review-section">
                  <h3>{ui.addressReview}</h3>
                  <div className="co__review-box">
                    <strong>{address.name} {address.surname}</strong><br/>
                    {address.address}<br/>
                    {address.district}, {address.city} {address.zip}<br/>
                    <span className="co__review-inline-icon">
                      <Phone size={14} strokeWidth={2.1} />
                      <span>{address.phone}</span>
                    </span>
                    <button className="co__review-edit" onClick={() => setStep(0)}>{ui.change}</button>
                  </div>
                </div>

                <div className="co__review-section">
                  <h3>{ui.paymentMethod}</h3>
                  <div className="co__review-box">
                    {CARDS.find(c=>c.id===payment.cardType)?.label} - •••• {payment.cardNumber.replace(/\s/g,'').slice(-4)}
                    <button className="co__review-edit" onClick={() => setStep(1)}>{ui.change}</button>
                  </div>
                </div>

                <div className="co__review-section">
                  <h3>{ui.products}</h3>
                  {items.map(item => (
                    <div key={item.id} className="co__review-item">
                      <img src={item.image || getProductPlaceholder(item)} alt={item.name} onError={(e) => applyImageFallback(e, item)} />
                      <div className="co__review-item-info">
                        <div className="co__review-item-name">{item.name}</div>
                        <div className="text-secondary" style={{fontSize:13}}>{ui.quantity}: {item.quantity}</div>
                      </div>
                      <div className="co__review-item-price">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <div className="co__form-actions">
                  <button className="co__btn-back" onClick={() => setStep(1)}>
                    <ArrowLeft size={16} strokeWidth={2.2} />
                    <span>{ui.backPayment}</span>
                  </button>
                  <button
                    className="co__btn-place"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="co__loading">
                        <span className="co__spinner" />
                        {ui.processing}
                      </span>
                    ) : (
                      <>
                        <Check size={16} strokeWidth={2.4} />
                        <span>{ui.placeOrder} — {formatPrice(grandTotal)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Confirmation */}
            {step === 3 && (
              <div className="co__success page-enter">
                <div className="co__success-icon" aria-hidden="true">
                  <CheckCircle2 size={72} strokeWidth={1.9} />
                </div>
                <h1>{ui.success}</h1>
                <p className="co__success-id">{ui.orderNo}: <strong>{orderId}</strong></p>
                <p className="co__success-msg">
                  {ui.successMsg}
                </p>
                <div className="co__success-info">
                  <div className="co__success-info-item">
                    <div className="co__success-info-label">{ui.eta}</div>
                    <div className="co__success-info-val">1-2 İş Günü</div>
                  </div>
                  <div className="co__success-info-item">
                    <div className="co__success-info-label">{ui.payment}</div>
                    <div className="co__success-info-val">{CARDS.find(c=>c.id===payment.cardType)?.label} •••• {payment.cardNumber.replace(/\s/g,'').slice(-4)}</div>
                  </div>
                  <div className="co__success-info-item">
                    <div className="co__success-info-label">{ui.total}</div>
                    <div className="co__success-info-val">{formatPrice(grandTotal)}</div>
                  </div>
                </div>
                <div className="co__success-actions">
                  <button className="co__btn-next" onClick={() => navigate('/orders')}>{ui.goOrders}</button>
                  <button className="co__btn-back" onClick={() => navigate('/')}>{ui.goHome}</button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          {step < 3 && (
            <div className="co__sidebar">
              <div className="co__summary-card">
                <h2 className="co__summary-title">{ui.summary}</h2>
                <div className="co__summary-items">
                  {items.map(item => (
                    <div key={item.id} className="co__summary-item">
                      <div className="co__summary-item-img-wrap">
                        <img src={item.image || getProductPlaceholder(item)} alt={item.name} onError={(e) => applyImageFallback(e, item)} />
                        <span className="co__summary-item-qty">{item.quantity}</span>
                      </div>
                      <div className="co__summary-item-name">{item.name.slice(0, 45)}{item.name.length > 45 ? '...' : ''}</div>
                      <div className="co__summary-item-price">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
                <div className="co__summary-divider" />
                <div className="co__summary-row">
                  <span>{ui.items} ({totalItems})</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="co__summary-row">
                  <span>{ui.shipping}</span>
                  <span className={shippingCost === 0 ? 'text-green' : ''}>{shippingCost === 0 ? ui.free : formatPrice(shippingCost)}</span>
                </div>
                <div className="co__summary-divider" />
                <div className="co__summary-total">
                  <span>{ui.total}</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
                <div className="co__summary-secure">
                  <Lock size={14} strokeWidth={2.1} />
                  <span>{ui.secure}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
