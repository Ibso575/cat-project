import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const SupaTest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) setError(error.message);
      else setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div style={{color:'red'}}>Xatolik: {error}</div>;

  return (
    <div>
      <h2>Supabase Products</h2>
      <ul>
        {products.map((item) => (
          <li key={item.id}>{item.name || JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default SupaTest;
