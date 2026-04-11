import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import Checkout from './pages/Checkout';

function AppShell() {
  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">
      <Header />
      <main>
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="checkout/:id" element={<Checkout />} />
            </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
