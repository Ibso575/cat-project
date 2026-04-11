import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import HomePage from "./components/Main/HomePage";
import ProductListPage from "./components/Main/ProductListPage";
import ProductDetailPage from "./components/Main/ProductDetailPage";

function AppShell() {
  return (
    <div className="min-h-screen bg-[#fffaf5] text-slate-900">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
