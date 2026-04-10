import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import Checkout from './pages/Checkout';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="checkout/:id" element={<Checkout />} />
            </Route>
        </Routes>
    );
}

export default App;
