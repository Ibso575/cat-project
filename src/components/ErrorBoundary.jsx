import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white px-6 py-16 text-slate-900">
          <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-2xl font-bold text-red-700">
              Sayt ishga tushishda xatolik bo'ldi
            </h1>
            <p className="mt-3 text-sm text-slate-700">
              Brauzer konsolida xatolik tafsilotlari bor. Sahifani yangilab
              ko'ring yoki quyidagi xabarni tekshiring.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-white">
              {this.state.error?.message || "Noma'lum xatolik"}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
