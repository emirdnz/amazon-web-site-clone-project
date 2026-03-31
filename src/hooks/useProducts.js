import { useState, useEffect } from 'react';

let cachedProducts = null;

export const useProducts = () => {
  const [products, setProducts] = useState(cachedProducts || []);
  const [loading, setLoading] = useState(!cachedProducts);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedProducts) return;
    setLoading(true);
    fetch('/data/products.json')
      .then(r => r.json())
      .then(data => {
        cachedProducts = data;
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const getById = (id) => products.find(p => p.id === parseInt(id));
  const getByCategory = (cat) => products.filter(p => p.category === cat);
  const search = (query) => {
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q)
    );
  };

  const categories = [...new Set(products.map(p => p.category))];

  return { products, loading, error, getById, getByCategory, search, categories };
};
