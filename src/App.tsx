import { RouterProvider, useRouter } from '@/lib/router';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ServicesPage from '@/pages/ServicesPage';
import BookingPage from '@/pages/BookingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import AccountPage from '@/pages/AccountPage';
import AboutPage from '@/pages/AboutPage';

function Routes() {
  const { path } = useRouter();
  const route = path.split('?')[0];
  const query = path.split('?')[1] || '';

  if (route === '/' || route === '') return <HomePage />;
  if (route === '/shop') return <ShopPage key={query} />;
  if (route.startsWith('/product/')) {
    const slug = route.replace('/product/', '');
    return <ProductDetailPage slug={slug} />;
  }
  if (route === '/cart') return <CartPage />;
  if (route === '/checkout') return <CheckoutPage />;
  if (route === '/services') return <ServicesPage />;
  if (route.startsWith('/book/')) {
    const serviceId = route.replace('/book/', '');
    return <BookingPage serviceId={serviceId} />;
  }
  if (route === '/login') return <LoginPage />;
  if (route === '/signup') return <SignupPage />;
  if (route === '/account') return <AccountPage />;
  if (route === '/about') return <AboutPage />;

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 sm:px-6 text-center">
      <h1 className="font-display text-4xl font-semibold text-forest-900">404</h1>
      <p className="mt-2 text-forest-500">This page doesn't exist.</p>
      <a href="/" className="mt-6 btn-primary">Go Home</a>
    </div>
  );
}

function AppContent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </RouterProvider>
  );
}
