import { useEffect, useState } from 'react';
import { Package, Calendar, User, LogOut, Clock, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase, type Order, type OrderItem, type Booking } from '@/lib/supabase';
import { Link, useRouter } from '@/lib/router';
import { formatPrice, formatDate } from '@/lib/format';

const statusColors: Record<string, string> = {
  pending: 'bg-sand-100 text-sand-700',
  confirmed: 'bg-forest-100 text-forest-700',
  delivered: 'bg-forest-600 text-white',
  completed: 'bg-forest-600 text-white',
  cancelled: 'bg-red-100 text-red-600',
};

export default function AccountPage() {
  const { user, profile, signOut, loading } = useAuth();
  const { navigate } = useRouter();
  const [tab, setTab] = useState<'orders' | 'bookings'>('orders');
  const [orders, setOrders] = useState<(Order & { items: OrderItem[] })[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setDataLoading(true);
      const [ordersRes, bookingsRes] = await Promise.all([
        supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);
      setOrders((ordersRes.data as (Order & { items: OrderItem[] })[]) || []);
      setBookings((bookingsRes.data as Booking[]) || []);
      setDataLoading(false);
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="h-48 animate-pulse rounded-2xl bg-forest-100" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 sm:px-6">
        <User size={48} className="text-forest-200" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-forest-800">Sign in to view your account</h1>
        <p className="mt-2 text-forest-500">Access your orders and service bookings</p>
        <div className="mt-6 flex gap-3">
          <Link to="/login" className="btn-secondary">Sign In</Link>
          <Link to="/signup" className="btn-primary">Create Account</Link>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="animate-fade-in mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Profile header */}
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-br from-forest-700 to-forest-900 p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sand-400 font-display text-xl font-semibold text-white">
            {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-white">
              {profile?.full_name || 'GreenNest Member'}
            </h1>
            <p className="text-sm text-forest-200">{user.email}</p>
            {profile?.city && (
              <p className="mt-1 flex items-center gap-1 text-xs text-forest-300">
                <MapPin size={12} /> {profile.city}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 border-b border-forest-100">
        <button
          onClick={() => setTab('orders')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === 'orders' ? 'border-forest-600 text-forest-800' : 'border-transparent text-forest-500 hover:text-forest-700'
          }`}
        >
          <Package size={18} /> Orders ({orders.length})
        </button>
        <button
          onClick={() => setTab('bookings')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            tab === 'bookings' ? 'border-forest-600 text-forest-800' : 'border-transparent text-forest-500 hover:text-forest-700'
          }`}
        >
          <Calendar size={18} /> Bookings ({bookings.length})
        </button>
      </div>

      <div className="mt-6">
        {dataLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-forest-100" />
            ))}
          </div>
        ) : tab === 'orders' ? (
          orders.length === 0 ? (
            <EmptyState
              icon={<Package size={48} className="text-forest-200" />}
              title="No orders yet"
              desc="When you place an order, it will appear here."
              cta={<Link to="/shop" className="btn-primary">Browse Products</Link>}
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-2xl bg-white p-5 ring-1 ring-forest-100">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-forest-100 pb-3">
                    <div>
                      <p className="font-mono text-xs text-forest-500">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-forest-600">{formatDate(order.created_at)}</p>
                    </div>
                    <span className={`badge capitalize ${statusColors[order.status] || 'bg-forest-100 text-forest-700'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.image_url} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-forest-900">{item.name}</p>
                          <p className="text-xs text-forest-500">Qty: {item.quantity} · {formatPrice(item.price)}</p>
                        </div>
                        <span className="text-sm font-medium text-forest-700">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between border-t border-forest-100 pt-3">
                    <span className="text-sm text-forest-500">{order.city && `${order.city} · `}{order.shipping_address}</span>
                    <span className="font-display text-lg font-semibold text-forest-800">{formatPrice(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={<Calendar size={48} className="text-forest-200" />}
            title="No bookings yet"
            desc="Book a gardener service and track it here."
            cta={<Link to="/services" className="btn-primary">Browse Services</Link>}
          />
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl bg-white p-5 ring-1 ring-forest-100">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base font-semibold text-forest-900">{booking.service_name}</h3>
                    <p className="text-sm text-forest-500">{booking.gardener_name}</p>
                  </div>
                  <span className={`badge capitalize ${statusColors[booking.status] || 'bg-forest-100 text-forest-700'}`}>
                    {booking.status === 'completed' ? <CheckCircle2 size={12} /> : booking.status === 'cancelled' ? <XCircle size={12} /> : null}
                    {booking.status}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-forest-400">Date</p>
                    <p className="font-medium text-forest-700">{formatDate(booking.scheduled_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-forest-400">Time</p>
                    <p className="font-medium text-forest-700">{booking.scheduled_time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-forest-400">City</p>
                    <p className="font-medium text-forest-700">{booking.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-forest-400">Price</p>
                    <p className="font-medium text-forest-700">{formatPrice(booking.service_price)}</p>
                  </div>
                </div>
                {booking.notes && (
                  <p className="mt-3 rounded-lg bg-forest-50 px-3 py-2 text-xs text-forest-600">
                    Notes: {booking.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, desc, cta }: { icon: React.ReactNode; title: string; desc: string; cta: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 ring-1 ring-forest-100">
      {icon}
      <p className="mt-4 text-lg font-medium text-forest-700">{title}</p>
      <p className="mt-1 text-sm text-forest-500">{desc}</p>
      <div className="mt-4">{cta}</div>
    </div>
  );
}
