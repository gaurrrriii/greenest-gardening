import { useEffect, useState } from 'react';
import {
  Sprout, Trees, Flower2, Leaf, Shovel, ShoppingCart,
  Star, Shield, Truck, Clock, ChevronRight, Quote,
} from 'lucide-react';
import { Link } from '@/lib/router';
import { supabase, type Product, type Category, type Service, type Gardener } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { formatPrice } from '@/lib/format';

const categoryIconMap: Record<string, typeof Sprout> = {
  'indoor-plants': Sprout,
  'outdoor-plants': Trees,
  'flowering-plants': Flower2,
  'seeds': Leaf,
  'pots-planters': Flower2,
  'gardening-tools': Shovel,
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<(Service & { gardener: Gardener })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [prodRes, catRes, svcRes] = await Promise.all([
        supabase.from('products').select('*').eq('featured', true).limit(8),
        supabase.from('categories').select('*'),
        supabase.from('services').select('*, gardener:gardeners(*)').limit(4),
      ]);
      setProducts(prodRes.data as Product[] || []);
      setCategories(catRes.data as Category[] || []);
      setServices((svcRes.data as (Service & { gardener: Gardener })[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-950">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg"
            alt=""
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-2xl">
            <span className="badge bg-forest-800/80 text-forest-200 backdrop-blur-sm">
              <Sprout size={14} /> Sustainable Gardening Platform
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl text-balance">
              Bring nature home with plants & expert gardeners
            </h1>
            <p className="mt-5 text-lg text-forest-200 max-w-xl">
              Shop quality plants and gardening supplies from verified nurseries, and book
              skilled gardeners for home services — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-accent">
                Shop Plants <ChevronRight size={18} />
              </Link>
              <Link to="/services" className="btn-secondary !bg-white/10 !text-white !border-white/30 hover:!bg-white/20">
                Book a Gardener
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              <div className="flex items-center gap-2 text-sm text-forest-200">
                <Shield size={18} className="text-sand-400" /> Verified Nurseries
              </div>
              <div className="flex items-center gap-2 text-sm text-forest-200">
                <Truck size={18} className="text-sand-400" /> Doorstep Delivery
              </div>
              <div className="flex items-center gap-2 text-sm text-forest-200">
                <Star size={18} className="text-sand-400" /> Expert Gardeners
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="border-b border-forest-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 md:grid-cols-4">
          {[
            { icon: Truck, title: 'Free Delivery', desc: 'On orders over ₹999' },
            { icon: Shield, title: 'Verified Vendors', desc: 'Quality assured plants' },
            { icon: Clock, title: 'Easy Scheduling', desc: 'Book services anytime' },
            { icon: Leaf, title: 'Eco-Friendly', desc: 'Sustainable practices' },
          ].map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
                <f.icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-forest-900">{f.title}</p>
                <p className="text-xs text-forest-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-forest-900">Shop by Category</h2>
            <p className="mt-2 text-forest-500">Find exactly what your garden needs</p>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-800 sm:flex">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => {
            const Icon = categoryIconMap[cat.slug] || Sprout;
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="card group flex flex-col items-center gap-3 p-5 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-50 text-forest-600 transition-colors group-hover:bg-forest-600 group-hover:text-white">
                  <Icon size={26} />
                </div>
                <span className="text-sm font-medium text-forest-800">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-forest-900">Featured Plants</h2>
            <p className="mt-2 text-forest-500">Handpicked favorites from our nurseries</p>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-800 sm:flex">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-forest-100" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Services banner */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-forest-800">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <span className="badge bg-forest-700 text-sand-300">
                <Sprout size={14} /> Gardener Services
              </span>
              <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
                Book verified gardeners for your home
              </h2>
              <p className="mt-4 text-forest-200">
                From home gardening setups to lawn maintenance and pruning — our experienced,
                background-verified gardeners bring professional care to your plants.
              </p>
              <Link to="/services" className="mt-6 inline-flex btn-accent">
                Explore Services <ChevronRight size={18} />
              </Link>
            </div>
            <div className="h-64 lg:h-full">
              <img
                src="https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg"
                alt="Gardener at work"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold text-forest-900">Popular Services</h2>
            <p className="mt-2 text-forest-500">Professional gardening help at your doorstep</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc) => (
            <Link
              key={svc.id}
              to={`/services`}
              className="card group flex flex-col p-5"
            >
              <div className="flex items-center gap-3">
                <img
                  src={svc.gardener.avatar_url}
                  alt={svc.gardener.name}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-forest-900">{svc.gardener.name}</p>
                  <div className="flex items-center gap-1 text-xs text-sand-500">
                    <Star size={12} fill="currentColor" />
                    {svc.gardener.rating.toFixed(1)} · {svc.gardener.years_experience}y exp
                  </div>
                </div>
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-forest-800">{svc.name}</h3>
              <p className="mt-1 text-sm text-forest-500 line-clamp-2 flex-1">{svc.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-forest-800">
                  {formatPrice(svc.price)}
                </span>
                <span className="text-xs text-forest-400">{svc.duration_mins} mins</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold text-forest-900">What Our Customers Say</h2>
          <p className="mt-2 text-forest-500">Trusted by gardening enthusiasts across India</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { name: 'Ananya Desai', city: 'Mumbai', text: 'The plants arrived in perfect condition and the gardener who set up my balcony garden was incredibly skilled. Highly recommend GreenNest!', rating: 5 },
            { name: 'Rohit Mehta', city: 'Pune', text: 'Finally a platform where I can find quality plants and book gardening services in one place. The lawn maintenance service exceeded my expectations.', rating: 5 },
            { name: 'Kavya Nair', city: 'Bengaluru', text: 'Ordered a Monstera and some terracotta pots. Great quality and fast delivery. The care instructions were very helpful for a beginner like me.', rating: 4 },
          ].map((t) => (
            <div key={t.name} className="card p-6">
              <Quote size={28} className="text-forest-200" />
              <p className="mt-3 text-sm text-forest-700 leading-relaxed">{t.text}</p>
              <div className="mt-4 flex items-center gap-1 text-sand-500">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <div className="mt-3 border-t border-forest-100 pt-3">
                <p className="text-sm font-semibold text-forest-900">{t.name}</p>
                <p className="text-xs text-forest-500">{t.city}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-forest-700 to-forest-900 p-8 text-center lg:p-14">
          <ShoppingCart size={40} className="mx-auto text-sand-400" />
          <h2 className="mt-4 font-display text-3xl font-semibold text-white sm:text-4xl">
            Start your green journey today
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-forest-200">
            Join thousands of happy plant parents who trust GreenNest for their gardening needs.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn-accent">Browse Plants</Link>
            <Link to="/signup" className="btn-secondary !bg-white/10 !text-white !border-white/30 hover:!bg-white/20">Create Account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
