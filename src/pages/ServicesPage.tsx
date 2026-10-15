import { useEffect, useState } from 'react';
import { Star, Clock, MapPin, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import { supabase, type Service, type Gardener } from '@/lib/supabase';
import { Link } from '@/lib/router';
import { formatPrice } from '@/lib/format';

export default function ServicesPage() {
  const [services, setServices] = useState<(Service & { gardener: Gardener })[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('services')
        .select('*, gardener:gardeners(*)');
      setServices((data as (Service & { gardener: Gardener })[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const cities = [...new Set(services.map((s) => s.gardener.city))];

  const filtered = services.filter((s) => {
    if (filterCity && s.gardener.city !== filterCity) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.gardener.specialties.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-forest-900 sm:text-4xl">Gardener Services</h1>
        <p className="mt-2 text-forest-500">Book verified, experienced gardeners for your home gardening needs</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search services or specialties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input flex-1"
        />
        <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} className="input sm:w-48">
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-forest-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 ring-1 ring-forest-100">
          <Calendar size={48} className="text-forest-200" />
          <p className="mt-4 text-lg font-medium text-forest-700">No services found</p>
          <p className="mt-1 text-sm text-forest-500">Try adjusting your search or city filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((svc) => (
            <div key={svc.id} className="card flex flex-col overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <img
                    src={svc.gardener.avatar_url}
                    alt={svc.gardener.name}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-forest-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <h3 className="truncate font-display text-base font-semibold text-forest-900">{svc.gardener.name}</h3>
                      {svc.gardener.verified && (
                        <CheckCircle2 size={16} className="shrink-0 text-forest-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-forest-500">
                      <span className="flex items-center gap-0.5 text-sand-500">
                        <Star size={12} fill="currentColor" />
                        {svc.gardener.rating.toFixed(1)}
                      </span>
                      <span>·</span>
                      <span>{svc.gardener.years_experience} yrs exp</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin size={12} /> {svc.gardener.city}
                      </span>
                    </div>
                  </div>
                </div>

                <h2 className="mt-4 font-display text-lg font-semibold text-forest-800">{svc.name}</h2>
                <p className="mt-1 text-sm text-forest-500 leading-relaxed">{svc.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {svc.gardener.specialties.split(',').map((spec, i) => (
                    <span key={i} className="badge bg-forest-50 text-forest-600">{spec.trim()}</span>
                  ))}
                </div>
              </div>

              <div className="mt-auto border-t border-forest-100 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display text-xl font-semibold text-forest-800">{formatPrice(svc.price)}</span>
                    <span className="ml-2 flex items-center gap-1 text-xs text-forest-400">
                      <Clock size={12} /> {svc.duration_mins} mins
                    </span>
                  </div>
                  <Link to={`/book/${svc.id}`} className="btn-primary !px-5 !py-2.5">
                    Book Now <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
