import { Leaf, Sprout, Shield, Users, Truck, Star } from 'lucide-react';
import { Link } from '@/lib/router';

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden bg-forest-950 py-20">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg"
            alt=""
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-forest-950/40" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-600 text-white">
            <Leaf size={28} />
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold text-white sm:text-5xl text-balance">
            Growing greener communities, one plant at a time
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-forest-200">
            GreenNest connects plant enthusiasts with verified nurseries and skilled gardeners,
            making home gardening accessible, transparent, and sustainable.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold text-forest-900">Our Mission</h2>
            <p className="mt-4 text-forest-600 leading-relaxed">
              With the growing interest in home gardening and sustainable living, finding quality
              plants and reliable gardening services shouldn't be difficult. GreenNest was founded to
              solve this — a single platform where you can buy plants and gardening products from
              trusted local nurseries, and book experienced gardeners for home services.
            </p>
            <p className="mt-4 text-forest-600 leading-relaxed">
              We believe everyone deserves access to green spaces, whether it's a single potted plant
              on a windowsill or a full garden makeover. By connecting customers with verified vendors
              and professionals, we're making gardening more accessible and transparent.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Sprout, label: 'Plants Sold', value: '12,000+' },
              { icon: Users, label: 'Happy Customers', value: '5,500+' },
              { icon: Shield, label: 'Verified Gardeners', value: '120+' },
              { icon: Truck, label: 'Cities Served', value: '3' },
            ].map((stat) => (
              <div key={stat.label} className="card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-forest-50 text-forest-600">
                  <stat.icon size={24} />
                </div>
                <p className="mt-3 font-display text-2xl font-semibold text-forest-900">{stat.value}</p>
                <p className="text-sm text-forest-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="text-center font-display text-3xl font-semibold text-forest-900">What We Offer</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { icon: Sprout, title: 'Quality Plants & Products', desc: 'Browse a wide catalog of indoor plants, outdoor plants, seeds, pots, and tools — all sourced from verified nurseries.' },
            { icon: Shield, title: 'Verified Gardeners', desc: 'Book experienced, background-verified gardeners for home gardening, lawn maintenance, pruning, and more.' },
            { icon: Star, title: 'Transparent Pricing', desc: 'No hidden charges. Clear product pricing, service fees, and delivery costs upfront. Cash on delivery available.' },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-600 text-white">
                <item.icon size={24} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-forest-900">{item.title}</h3>
              <p className="mt-2 text-sm text-forest-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-forest-700 to-forest-900 p-8 text-center lg:p-14">
          <h2 className="font-display text-3xl font-semibold text-white">Ready to grow something beautiful?</h2>
          <p className="mx-auto mt-3 max-w-lg text-forest-200">
            Start browsing our collection or book a gardener service today.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/shop" className="btn-accent">Shop Plants</Link>
            <Link to="/services" className="btn-secondary !bg-white/10 !text-white !border-white/30 hover:!bg-white/20">Book a Gardener</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
