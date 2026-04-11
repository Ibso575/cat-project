# 🚀 Quick Start Guide

## Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

**Dev Server**: http://localhost:5174/

---

## 📁 Key Files

| File                                        | Purpose                    |
| ------------------------------------------- | -------------------------- |
| `src/store/store.js`                        | Redux store configuration  |
| `src/store/apis/productsApi.js`             | RTK Query API endpoints    |
| `src/components/products/ProductList.jsx`   | All products page          |
| `src/components/products/ProductDetail.jsx` | Single product page        |
| `src/components/products/ProductCard.jsx`   | Product card component     |
| `src/components/SkeletonLoader.jsx`         | Loading skeleton UI        |
| `src/App.jsx`                               | Main routing configuration |
| `src/config/axios.js`                       | API client setup           |
| `.env`                                      | Environment variables      |

---

## 🎯 Using RTK Query Hooks

```javascript
import { useGetProductsQuery } from "../store/apis/productsApi";

function MyComponent() {
  // Get all products with filters
  const { data, isLoading, isFetching, error } = useGetProductsQuery({
    page: 1,
    limit: 12,
    search: "shampoo",
    category: "Cats",
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

## 🔀 Routing

```javascript
// Home
navigate("/");

// Product List
navigate("/products");

// Product Detail
navigate(`/products/${productId}`);
```

---

## 🎨 Component Examples

### ProductCard Component

```javascript
import ProductCard from "../components/products/ProductCard";

<ProductCard
  product={{
    id: 1,
    name: "Shampoo",
    price: 1500,
    image: "url",
    rating: 4.5,
    discount: 20,
  }}
/>;
```

### SkeletonLoader Component

```javascript
import SkeletonLoader from "../components/SkeletonLoader";

{
  loading ? <SkeletonLoader count={12} variant="product" /> : <ProductGrid />;
}
```

---

## 📊 Project Structure at a Glance

```
src/
├── store/          ← Redux + RTK Query
├── components/     ← React components
├── config/         ← Axios, constants
├── assets/         ← Images, logos
├── App.jsx         ← Main app
└── main.jsx        ← Entry point (Redux Provider)
```

---

## ⚙️ Environment Variables

```env
VITE_API_URL=https://e-commerce-api-v4.nt.azimumarov.uz
```

Access in code:

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🐛 Common Issues & Solutions

### Issue: Components re-rendering when switching routes

**Solution**: Already fixed! Navbar & Footer are outside `<Routes>`

### Issue: API requests failing

**Solution**: Check `.env` file has correct API URL

### Issue: Tailwind styles not applying

**Solution**: Ensure `src/index.css` has `@import "tailwindcss";`

### Issue: Can't find RTK Query hooks

**Solution**: Import from `src/store/apis/productsApi.js`

---

## 📈 Performance Tips

1. **Use RTK Query for all API calls** - automatic caching
2. **Memoize components** - prevents unnecessary re-renders
3. **Split large components** - easier to manage
4. **Lazy load images** - use `loading="lazy"`
5. **Use SkeletonLoader** - better UX while loading

---

## 🔗 API Endpoints

- `GET /products` - List all products
- `GET /products?search=term` - Search products
- `GET /products?category=cat` - Filter by category
- `GET /products?page=1&limit=10` - Pagination
- `GET /products/:id` - Get single product

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (1 column)
- **Tablet**: 640px - 1024px (2 columns)
- **Desktop**: > 1024px (3-4 columns)

Used in components:

```javascript
className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
```

---

## ✨ Features Available

✅ Product listing with search & filters  
✅ Product detail page  
✅ Responsive design (mobile/tablet/desktop)  
✅ Loading skeleton states  
✅ Error handling  
✅ Redux state management  
✅ RTK Query caching  
✅ Navbar & Footer (no re-renders)  
✅ Pagination  
✅ Product ratings

---

## 🎓 Learning Resources

- Redux Toolkit: https://redux-toolkit.js.org
- RTK Query: https://redux-toolkit.js.org/rtk-query/overview
- TailwindCSS: https://tailwindcss.com
- React Router: https://reactrouter.com
- Vite: https://vitejs.dev

---

**Happy Coding! 🎉**
