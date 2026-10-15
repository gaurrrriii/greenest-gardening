import { useEffect, useState } from 'react';
import { CheckCircle2, Calendar, Clock, MapPin, ArrowRight, ChevronLeft } from 'lucide-react';
import { supabase, type Service, type Gardener } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Link, useRouter } from '@/lib/router';
import { formatPrice } from '@/lib/format';

export default function BookingPage({ serviceId }: { serviceId: string }) {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [service, setService] = useState<(Service & { gardener: Gardener }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ bookingId: string } | null>(null);

  const timeSlots = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('services')
        .select('*, gardener:gardeners(*)')
        .eq('id', serviceId)
        .maybeSingle();
      setService(data as (Service & { gardener: Gardener }) | null);
      setLoading(false);
    };
    load();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="h-64 animate-pulse rounded-2xl bg-forest-100" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-forest-800">Service not found</h1>
        <Link to="/services" className="mt-6 btn-primary">Back to Services</Link>
      </div>
    );
  }

  if (!user && !success) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-forest-800">Please sign in to book a service</h1>
        <p className="mt-2 text-forest-500">You need an account to schedule a gardener visit.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/login" className="btn-secondary">Sign In</Link>
          <Link to="/signup" className="btn-primary">Create Account</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 sm:px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest-100 text-forest-600 animate-scale-in">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold text-forest-900">Booking Request Sent!</h1>
        <p className="mt-3 text-forest-600">
          {service.gardener.name} will review your request and confirm your appointment shortly.
        </p>
        <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-forest-100 w-full max-w-sm">
          <p className="text-sm text-forest-500">Booking ID</p>
          <p className="font-mono text-sm font-medium text-forest-800 mt-1 break-all">{success.bookingId}</p>
          <div className="mt-4 space-y-2 border-t border-forest-100 pt-4 text-sm">
            <div className="flex justify-between"><span className="text-forest-500">Service</span><span className="font-medium text-forest-800">{service.name}</span></div>
            <div className="flex justify-between"><span className="text-forest-500">Gardener</span><span className="font-medium text-forest-800">{service.gardener.name}</span></div>
            <div className="flex justify-between"><span className="text-forest-500">Date</span><span className="font-medium text-forest-800">{date}</span></div>
            <div className="flex justify-between"><span className="text-forest-500">Time</span><span className="font-medium text-forest-800">{time}</span></div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Link to="/account" className="btn-primary">View My Bookings</Link>
          <Link to="/services" className="btn-secondary">Browse More Services</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');
    setPlacing(true);

    try {
      const { data, error: insertErr } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          service_id: service.id,
          gardener_name: service.gardener.name,
          service_name: service.name,
          service_price: service.price,
          scheduled_date: date,
          scheduled_time: time,
          address,
          city,
          notes,
          status: 'pending',
        })
        .select('id')
        .single();

      if (insertErr) throw insertErr;
      setSuccess({ bookingId: data.id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="animate-fade-in mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link to="/services" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-800">
        <ChevronLeft size={16} /> Back to Services
      </Link>

      <h1 className="font-display text-3xl font-semibold text-forest-900">Book Gardener Service</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-forest-100">
            <h2 className="font-display text-lg font-semibold text-forest-900">Schedule</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-forest-700 mb-1">
                  <Calendar size={15} /> Select Date
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-forest-700 mb-1">
                  <Clock size={15} /> Select Time
                </label>
                <select value={time} onChange={(e) => setTime(e.target.value)} required className="input">
                  <option value="">Choose a slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-forest-100">
            <h2 className="font-display text-lg font-semibold text-forest-900">Service Address</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1">Full Address</label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  placeholder="House no, street, area, landmark"
                  className="input"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-forest-700 mb-1">
                  <MapPin size={15} /> City
                </label>
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Your city"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Any specific requirements or instructions for the gardener"
                  className="input"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <button type="submit" disabled={placing} className="btn-primary w-full">
            {placing ? 'Sending Request...' : <>Confirm Booking <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-white p-6 ring-1 ring-forest-100">
            <h2 className="font-display text-lg font-semibold text-forest-900">Service Summary</h2>
            <div className="mt-4 flex items-center gap-3">
              <img
                src={service.gardener.avatar_url}
                alt={service.gardener.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-forest-900">{service.gardener.name}</p>
                <p className="text-xs text-forest-500">{service.gardener.city} · {service.gardener.years_experience}y exp</p>
              </div>
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-forest-800">{service.name}</h3>
            <p className="mt-1 text-sm text-forest-500">{service.description}</p>
            <div className="mt-4 space-y-2 border-t border-forest-100 pt-4 text-sm">
              <div className="flex justify-between text-forest-600">
                <span>Duration</span>
                <span className="font-medium text-forest-900">{service.duration_mins} mins</span>
              </div>
              <div className="flex justify-between text-forest-600">
                <span>Service fee</span>
                <span className="font-medium text-forest-900">{formatPrice(service.price)}</span>
              </div>
              <div className="flex justify-between text-forest-600">
                <span>Visit charge</span>
                <span className="font-medium text-forest-600">Included</span>
              </div>
              <div className="flex justify-between border-t border-forest-100 pt-2">
                <span className="font-semibold text-forest-900">Total</span>
                <span className="font-display text-xl font-semibold text-forest-800">{formatPrice(service.price)}</span>
              </div>
            </div>
            <p className="mt-4 rounded-lg bg-forest-50 px-3 py-2 text-xs text-forest-600">
              Pay after service completion. Cancel free up to 12 hours before the appointment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
