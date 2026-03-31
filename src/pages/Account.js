import React from 'react';
import {
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../components/ProductCard';
import { getAllOrders } from '../data/mockOrders';
import './Account.css';

const quickActions = [
  {
    icon: Package,
    title: { TR: 'Siparişlerim', EN: 'My Orders', DE: 'Meine Bestellungen', AR: 'طلباتي' },
    description: { TR: 'Aktif ve geçmiş siparişleri görüntüle', EN: 'View active and past orders', DE: 'Aktive und frühere Bestellungen anzeigen', AR: 'عرض الطلبات الحالية والسابقة' },
    action: '/orders',
  },
  {
    icon: MapPin,
    title: { TR: 'Adreslerim', EN: 'My Addresses', DE: 'Meine Adressen', AR: 'عناويني' },
    description: { TR: 'Kayıtlı teslimat adreslerini yönet', EN: 'Manage saved delivery addresses', DE: 'Gespeicherte Lieferadressen verwalten', AR: 'إدارة عناوين التوصيل المحفوظة' },
    action: '/checkout',
  },
  {
    icon: CreditCard,
    title: { TR: 'Ödeme Tercihleri', EN: 'Payment Methods', DE: 'Zahlungsarten', AR: 'طرق الدفع' },
    description: { TR: 'Kart ve ödeme bilgileri', EN: 'Cards and payment details', DE: 'Karten und Zahlungsdaten', AR: 'البطاقات وتفاصيل الدفع' },
    action: '/checkout',
  },
  {
    icon: ShoppingBag,
    title: { TR: 'Sepetim', EN: 'My Cart', DE: 'Mein Warenkorb', AR: 'سلتي' },
    description: { TR: 'Bekleyen ürünlerini tamamla', EN: 'Complete your pending items', DE: 'Offene Artikel abschließen', AR: 'أكمل منتجاتك المعلقة' },
    action: '/cart',
  },
];

const ACCOUNT_COPY = {
  TR: {
    eyebrow: 'Hesap Merkezi',
    greeting: 'Merhaba, Emir',
    intro: 'Hesap bilgilerinizi, ödeme tercihlerinizi ve sipariş geçmişinizi buradan hızlıca görüntüleyebilirsiniz.',
    badge: 'Prime üye • Hesap güvende',
    quickActions: 'Hızlı işlemler',
    profile: 'Profil Özeti',
    recentOrders: 'Son siparişler',
    seeAll: 'Tümünü gör',
  },
  EN: {
    eyebrow: 'Account Center',
    greeting: 'Hello, Emir',
    intro: 'Quickly view your account details, payment preferences, and order history here.',
    badge: 'Prime member • Account protected',
    quickActions: 'Quick actions',
    profile: 'Profile Summary',
    recentOrders: 'Recent orders',
    seeAll: 'View all',
  },
  DE: {
    eyebrow: 'Kontozentrum',
    greeting: 'Hallo, Emir',
    intro: 'Hier können Sie Kontodaten, Zahlungsarten und Bestellverlauf schnell ansehen.',
    badge: 'Prime-Mitglied • Konto geschützt',
    quickActions: 'Schnellzugriffe',
    profile: 'Profilübersicht',
    recentOrders: 'Letzte Bestellungen',
    seeAll: 'Alle ansehen',
  },
  AR: {
    eyebrow: 'مركز الحساب',
    greeting: 'مرحباً، Emir',
    intro: 'يمكنك هنا عرض تفاصيل حسابك وطرق الدفع وسجل الطلبات بسرعة.',
    badge: 'عضو برايم • الحساب آمن',
    quickActions: 'إجراءات سريعة',
    profile: 'ملخص الملف الشخصي',
    recentOrders: 'الطلبات الأخيرة',
    seeAll: 'عرض الكل',
  },
};

export default function Account() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const ui = ACCOUNT_COPY[language] || ACCOUNT_COPY.TR;
  const recentOrders = getAllOrders().slice(0, 2);

  return (
    <div className="account page-enter">
      <div className="container">
        <div className="account__hero">
          <div>
            <span className="account__eyebrow">{ui.eyebrow}</span>
            <h1>{ui.greeting}</h1>
            <p>{ui.intro}</p>
          </div>

          <div className="account__hero-badge">
            <ShieldCheck size={18} strokeWidth={2.1} />
            <span>{ui.badge}</span>
          </div>
        </div>

        <div className="account__grid">
          <section className="account__panel account__panel--wide">
            <h2>{ui.quickActions}</h2>
            <div className="account__actions">
              {quickActions.map(({ icon: Icon, title, description, action }) => (
                <button
                  key={action}
                  type="button"
                  className="account__action"
                  onClick={() => navigate(action)}
                >
                  <span className="account__action-icon">
                    <Icon size={18} strokeWidth={2.1} />
                  </span>
                  <span>
                    <strong>{title[language] || title.TR}</strong>
                    <small>{description[language] || description.TR}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="account__panel">
            <h2>{ui.profile}</h2>
            <div className="account__info-list">
              <div className="account__info-item">
                <User size={16} strokeWidth={2.1} />
                <span>Emir Yılmaz</span>
              </div>
              <div className="account__info-item">
                <MapPin size={16} strokeWidth={2.1} />
                <span>Kadıköy / İstanbul</span>
              </div>
              <div className="account__info-item">
                <CreditCard size={16} strokeWidth={2.1} />
                <span>Visa •••• 4242</span>
              </div>
            </div>
          </section>

          <section className="account__panel">
            <div className="account__panel-head">
              <h2>{ui.recentOrders}</h2>
              <button type="button" onClick={() => navigate('/orders')}>{ui.seeAll}</button>
            </div>

            <div className="account__recent-orders">
              {recentOrders.map((order) => (
                <div key={order.id} className="account__order-card">
                  <div>
                    <strong>{order.id}</strong>
                    <span>{order.date}</span>
                  </div>
                  <div>
                    <strong>{formatPrice(order.total)}</strong>
                    <span>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
