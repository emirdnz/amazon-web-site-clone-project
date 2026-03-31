import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

const FOOTER_COPY = {
  TR: {
    backToTop: 'Başa dön',
    columns: [
      { title: 'Hakkımızda', items: ['Hakkımızda', 'Kariyer', 'Basın Merkezi', 'Yatırımcı İlişkileri', 'Amazon Cihazları'] },
      { title: 'Para Kazan', items: ['Satıcı Olun', "Amazon'da Sat", 'Amazon İş Ortağı Ol', 'Lojistik'] },
      { title: 'Amazon Ödeme', items: ['Amazon Hesabı', 'Güvenli İşlem', 'Kredi Kartları', 'Amazon Business Card'] },
      { title: 'Müşteri Hizmetleri', items: ['Amazon Yardım', 'Sipariş Durumu', 'İade & Değişim', 'Geri Dönüşüm', 'İletişim'] },
    ],
    links: ['Gizlilik Bildirimi', 'Kullanım Koşulları', 'Çerez Tercihleri', 'Reklamlara Yönelik Tercihler', '© 2026, Amazon Türkiye tarzı demo mağaza'],
  },
  EN: {
    backToTop: 'Back to top',
    columns: [
      { title: 'About Us', items: ['About us', 'Careers', 'Press Center', 'Investor Relations', 'Amazon Devices'] },
      { title: 'Make Money', items: ['Become a Seller', 'Sell on Amazon', 'Affiliate Program', 'Logistics'] },
      { title: 'Amazon Payment', items: ['Amazon Account', 'Secure Checkout', 'Credit Cards', 'Amazon Business Card'] },
      { title: 'Customer Service', items: ['Amazon Help', 'Order Status', 'Returns & Exchanges', 'Recycling', 'Contact'] },
    ],
    links: ['Privacy Notice', 'Terms of Use', 'Cookie Preferences', 'Ads Preferences', '© 2026, Amazon-style Türkiye demo store'],
  },
  DE: {
    backToTop: 'Nach oben',
    columns: [
      { title: 'Über uns', items: ['Über uns', 'Karriere', 'Pressezentrum', 'Investor Relations', 'Amazon Geräte'] },
      { title: 'Geld verdienen', items: ['Verkäufer werden', 'Auf Amazon verkaufen', 'Partnerprogramm', 'Logistik'] },
      { title: 'Amazon Zahlung', items: ['Amazon Konto', 'Sicher bezahlen', 'Kreditkarten', 'Amazon Business Card'] },
      { title: 'Kundenservice', items: ['Amazon Hilfe', 'Bestellstatus', 'Rückgabe & Umtausch', 'Recycling', 'Kontakt'] },
    ],
    links: ['Datenschutzhinweis', 'Nutzungsbedingungen', 'Cookie-Einstellungen', 'Werbepräferenzen', '© 2026, Amazon-inspirierter Demo-Store Türkei'],
  },
  AR: {
    backToTop: 'العودة إلى الأعلى',
    columns: [
      { title: 'معلومات عنا', items: ['من نحن', 'الوظائف', 'المركز الصحفي', 'علاقات المستثمرين', 'أجهزة أمازون'] },
      { title: 'اكسب المال', items: ['كن بائعاً', 'البيع على أمازون', 'برنامج الشركاء', 'الخدمات اللوجستية'] },
      { title: 'مدفوعات أمازون', items: ['حساب أمازون', 'دفع آمن', 'بطاقات الائتمان', 'بطاقة أعمال أمازون'] },
      { title: 'خدمة العملاء', items: ['مساعدة أمازون', 'حالة الطلب', 'الإرجاع والاستبدال', 'إعادة التدوير', 'اتصل بنا'] },
    ],
    links: ['إشعار الخصوصية', 'شروط الاستخدام', 'تفضيلات ملفات تعريف الارتباط', 'تفضيلات الإعلانات', '© 2026 متجر تجريبي مستوحى من أمازون تركيا'],
  },
};

export default function Footer() {
  const { language } = useLanguage();
  const ui = FOOTER_COPY[language] || FOOTER_COPY.TR;
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="footer__back-top" onClick={scrollToTop}>
        {ui.backToTop}
      </div>

      <div className="footer__mid">
        <div className="footer__columns">
          {ui.columns.map((column) => (
            <div key={column.title} className="footer__col">
              <h3>{column.title}</h3>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <div className="footer__logo">
            <svg viewBox="0 0 148 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="104" height="28">
              <text x="0" y="25" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="24" fill="white">amazon</text>
              <path d="M4 30 Q42 37 78 30" stroke="#FF9900" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M73 27 L80 30 L74 34" fill="#FF9900"/>
              <text x="88" y="17" fontFamily="Arial, sans-serif" fontSize="8" letterSpacing="1.3" fill="#FFB84D">TÜRKİYE</text>
              <text x="88" y="28" fontFamily="Arial, sans-serif" fontSize="9.5" fontWeight="700" fill="white">demo mağaza</text>
            </svg>
          </div>
          <div className="footer__links">
            {ui.links.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
