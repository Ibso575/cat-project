
import React, { useEffect, useState } from 'react';
import api from '../config/axios';

const ProductList = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [quantities, setQuantities] = useState({});

	useEffect(() => {
		api.get('/products')
			.then(response => {
				const fetchedData = response.data?.data || response.data;
				setProducts(Array.isArray(fetchedData) ? fetchedData : []);
				setLoading(false);
			})
			.catch(error => {
				setLoading(false);
			});
	}, []);

	const handleQuantity = (id, type) => {
		setQuantities(q => {
			const current = q[id] || 1;
			if (type === 'inc') return { ...q, [id]: current + 1 };
			if (type === 'dec') return { ...q, [id]: Math.max(1, current - 1) };
			return q;
		});
	};

	if (loading) return <div style={{padding: 40, textAlign: 'center'}}>Yuklanmoqda...</div>;

	return (
		<div style={{ background: '#fff', padding: '40px 0' }}>
			<div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 20px' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
					<h2 style={{ fontSize: 36, fontWeight: 900, margin: 0 }}>Акции</h2>
					<a href="#" style={{ color: '#ff9800', fontWeight: 700, textDecoration: 'none', fontSize: 16, display: 'flex', alignItems: 'center' }}>Смотреть все <span style={{marginLeft: 4}}>&rarr;</span></a>
				</div>
				<div style={{ display: 'flex', gap: 0, flexWrap: 'wrap', border: 'none' }}>
					{products && products.length > 0 ? products.map(product => {
						const main = product.main_variant || {};
						const discount = (main.old_price && main.price) ? Math.round(((main.old_price - main.price) / main.old_price) * 100) : 0;
						const qty = quantities[product.id] || 1;
						return (
							<div key={product.id} style={{ flex: '1 1 20%', minWidth: 260, maxWidth: 320, border: '1px solid #e0e0e0', borderRadius: 8, margin: 8, background: '#fff', display: 'flex', flexDirection: 'column', position: 'relative', padding: 20 }}>
								{discount > 0 && <div style={{ position: 'absolute', top: 12, left: 12, background: '#e53935', color: '#fff', fontWeight: 700, fontSize: 16, borderRadius: 4, padding: '2px 16px', zIndex: 2 }}>– {discount}%</div>}
								<div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
									<img src={product.image_url} alt={product.name} style={{ maxHeight: 120, maxWidth: '100%', objectFit: 'contain' }} />
								</div>
								<div style={{ fontSize: 16, fontWeight: 500, minHeight: 48, marginBottom: 8 }}>{product.name}</div>
								{main.weight && <div style={{ marginBottom: 12 }}>
									<select style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', fontSize: 15 }}>
										<option>{main.weight} {main.weight_unit}</option>
									</select>
								</div>}
								<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
									<span style={{ color: '#e53935', fontWeight: 700, fontSize: 22 }}>{main.price} ₽</span>
									{main.old_price && <span style={{ color: '#bdbdbd', textDecoration: 'line-through', fontSize: 16 }}>{main.old_price} ₽</span>}
								</div>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
									<button onClick={() => handleQuantity(product.id, 'dec')} style={{ background: '#fff', border: '1px solid #ff9800', color: '#ff9800', fontWeight: 700, borderRadius: 4, width: 32, height: 32, fontSize: 20, cursor: 'pointer' }}>–</button>
									<span style={{ minWidth: 32, textAlign: 'center', fontWeight: 700 }}>{qty} шт</span>
									<button onClick={() => handleQuantity(product.id, 'inc')} style={{ background: '#fff', border: '1px solid #ff9800', color: '#ff9800', fontWeight: 700, borderRadius: 4, width: 32, height: 32, fontSize: 20, cursor: 'pointer' }}>+</button>
								</div>
								<button style={{ background: '#ff9800', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 6, padding: '10px 0', marginBottom: 8, cursor: 'pointer' }}>В корзину</button>
								<div style={{ textAlign: 'center', color: '#ff9800', fontWeight: 500, fontSize: 15, cursor: 'pointer', textDecoration: 'underline' }}>Купить в 1 клик</div>
							</div>
						);
					}) : <div style={{ width: '100%', textAlign: 'center', color: '#bdbdbd', fontSize: 20, padding: 40 }}>Mahsulotlar topilmadi.</div>}
				</div>
			</div>
		</div>
	);
};

export default ProductList;
