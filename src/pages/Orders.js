import React, { useMemo } from 'react';
import {
  CheckCircle2,
  Package,
  RotateCcw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../components/ProductCard';
import { getAllOrders } from '../data/mockOrders';
import './Orders.css';

const STATUS_META = {
  'Teslim Edildi': {
    icon: CheckCircle2,
    className: 'orders__status--delivered',
    label: { TR: 'Teslim Edildi', EN: 'Delivered', DE: 'Zugestellt', AR: 'تم التسليم' },
  },
  'Yolda': {
    icon: Truck,
    className: 'orders__status--shipped',
    label: { TR: 'Yolda', EN: 'On the Way', DE: 'Unterwegs', AR: 'في الطريق' },
  },
  'Hazırlanıyor': {
    icon: Package,
    className: 'orders__status--preparing',
    label: { TR: 'Hazırlanıyor', EN: 'Preparing', DE: 'Wird vorbereitet', AR: 'قيد التجهيز' },
  },
};

const ORDERS_COPY = {
  TR: {
    eyebrow: 'Sipariş Geçmişi',
    title: 'Siparişlerim',
    intro: 'Son verdiğiniz siparişler ve örnek teslimat verileri burada listelenir.',
    continueShopping: 'Alışverişe Devam',
    secureTracking: 'Güvenli sipariş takibi',
    easyReturns: 'Kolay iade desteği',
    orderNo: 'Sipariş No',
    date: 'Tarih',
    total: 'Toplam',
    delivery: 'Teslimat:',
    address: 'Adres:',
    payment: 'Ödeme:',
    quantity: (qty) => `${qty} adet`,
  },
  EN: {
    eyebrow: 'Order History',
    title: 'My Orders',
    intro: 'Your recent purchases and sample delivery data are listed here.',
    continueShopping: 'Continue Shopping',
    secureTracking: 'Secure order tracking',
    easyReturns: 'Easy returns support',
    orderNo: 'Order No',
    date: 'Date',
    total: 'Total',
    delivery: 'Delivery:',
    address: 'Address:',
    payment: 'Payment:',
    quantity: (qty) => `${qty} pcs`,
  },
  DE: {
    eyebrow: 'Bestellverlauf',
    title: 'Meine Bestellungen',
    intro: 'Ihre letzten Käufe und Beispieldaten zur Lieferung werden hier angezeigt.',
    continueShopping: 'Weiter einkaufen',
    secureTracking: 'Sichere Sendungsverfolgung',
    easyReturns: 'Einfache Rückgabe',
    orderNo: 'Bestellnr.',
    date: 'Datum',
    total: 'Gesamt',
    delivery: 'Lieferung:',
    address: 'Adresse:',
    payment: 'Zahlung:',
    quantity: (qty) => `${qty} Stk.`,
  },
  AR: {
    eyebrow: 'سجل الطلبات',
    title: 'طلباتي',
    intro: 'تظهر هنا مشترياتك الأخيرة وبيانات التوصيل التجريبية.',
    continueShopping: 'متابعة التسوق',
    secureTracking: 'تتبع آمن للطلبات',
    easyReturns: 'دعم إرجاع سهل',
    orderNo: 'رقم الطلب',
    date: 'التاريخ',
    total: 'الإجمالي',
    delivery: 'التوصيل:',
    address: 'العنوان:',
    payment: 'الدفع:',
    quantity: (qty) => `${qty} قطعة`,
  },
};

export default function Orders() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const ui = ORDERS_COPY[language] || ORDERS_COPY.TR;
  const orders = useMemo(() => getAllOrders(), []);

  return (
    <div className="orders page-enter">
      <div className="container">
        <div className="orders__hero">
          <div>
            <span className="orders__eyebrow">{ui.eyebrow}</span>
            <h1>{ui.title}</h1>
            <p>{ui.intro}</p>
          </div>
          <button type="button" className="orders__hero-btn" onClick={() => navigate('/search')}>
            {ui.continueShopping}
          </button>
        </div>

        <div className="orders__info-bar">
          <span><ShieldCheck size={16} strokeWidth={2.1} /> {ui.secureTracking}</span>
          <span><RotateCcw size={16} strokeWidth={2.1} /> {ui.easyReturns}</span>
        </div>

        <div className="orders__list">
          {orders.map((order) => {
            const meta = STATUS_META[order.status] || STATUS_META['Hazırlanıyor'];
            const StatusIcon = meta.icon;

            return (
              <article key={order.id} className="orders__card">
                <div className="orders__card-top">
                  <div>
                    <small>{ui.orderNo}</small>
                    <strong>{order.id}</strong>
                  </div>
                  <div>
                    <small>{ui.date}</small>
                    <strong>{order.date}</strong>
                  </div>
                  <div>
                    <small>{ui.total}</small>
                    <strong>{formatPrice(order.total)}</strong>
                  </div>
                </div>

                <div className="orders__card-body">
                  <div className="orders__overview">
                    <div className={`orders__status ${meta.className}`}>
                      <StatusIcon size={16} strokeWidth={2.1} />
                      <span>{meta.label?.[language] || order.status}</span>
                    </div>

                    <div className="orders__meta">
                      <p><strong>{ui.delivery}</strong> {order.estimatedDelivery}</p>
                      <p><strong>{ui.address}</strong> {order.shippingAddress}</p>
                      <p><strong>{ui.payment}</strong> {order.payment}</p>
                    </div>
                  </div>

                  <div className="orders__items">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.id || item.name}`} className="orders__item">
                        <div className="orders__item-text">
                          <span>{item.name}</span>
                          <small>{ui.quantity(item.quantity)}</small>
                        </div>
                        <strong>{formatPrice(item.price * item.quantity)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
