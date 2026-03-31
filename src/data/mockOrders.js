const STORAGE_KEY = 'amazonOrderHistory';

const SAMPLE_ORDERS = [
  {
    id: 'TR93847562',
    createdAt: new Date('2026-03-30T10:15:00').getTime(),
    date: '30 Mart 2026',
    status: 'Yolda',
    total: 12499.9,
    estimatedDelivery: '1 Nisan • 09:00 - 18:00',
    payment: 'Visa •••• 4242',
    shippingAddress: 'Acıbadem Mah., Kadıköy / İstanbul',
    items: [
      { id: 'airpods-pro', name: 'Apple AirPods Pro (2. Nesil)', quantity: 1, price: 12499.9 }
    ]
  },
  {
    id: 'TR93841027',
    createdAt: new Date('2026-03-24T15:40:00').getTime(),
    date: '24 Mart 2026',
    status: 'Teslim Edildi',
    total: 1899.8,
    estimatedDelivery: '26 Mart tarihinde teslim edildi',
    payment: 'Mastercard •••• 1188',
    shippingAddress: 'Kızılay Mah., Çankaya / Ankara',
    items: [
      { id: 'kindle-case', name: 'Kindle Paperwhite Kılıfı', quantity: 1, price: 699.9 },
      { id: 'usb-c-adapter', name: 'USB-C Hızlı Şarj Adaptörü', quantity: 2, price: 599.95 }
    ]
  },
  {
    id: 'TR93830011',
    createdAt: new Date('2026-03-19T09:05:00').getTime(),
    date: '19 Mart 2026',
    status: 'Hazırlanıyor',
    total: 749.9,
    estimatedDelivery: '2 Nisan • Kargoya veriliyor',
    payment: 'Troy •••• 5531',
    shippingAddress: 'Nilüfer Mah., Bursa',
    items: [
      { id: 'desk-lamp', name: 'Akıllı Masa Lambası', quantity: 1, price: 749.9 }
    ]
  }
];

const isBrowser = typeof window !== 'undefined';

export function getStoredOrders() {
  if (!isBrowser) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOrderHistory(order) {
  if (!isBrowser) return;

  const existingOrders = getStoredOrders();
  const nextOrders = [order, ...existingOrders].slice(0, 12);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrders));
}

export function getAllOrders() {
  return [...getStoredOrders(), ...SAMPLE_ORDERS].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}
