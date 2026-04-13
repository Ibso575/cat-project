
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ProductList2 from './pages/ProductList2';
import Sales from './pages/Sales';


const App = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="catalog" element={<ProductList2 />} />
                <Route path="sales" element={<Sales />} />
                
            </Route>
        </Routes>
    );
}

export default App;
