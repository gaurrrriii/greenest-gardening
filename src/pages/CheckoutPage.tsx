import { useState } from 'react';
import { CheckCircle2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Link, useRouter } from '@/lib/router';
import { formatPrice } from '@/lib/format';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ orderId: string } | null>(null);

  const shipping = total >= 999 ? 0 : 49;
  const grandTotal = total + shipping;

  if (items.length === 0 && !success) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 sm:px-6">
        <ShoppingBag size={48} className="text-forest-200" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-forest-800">Your cart is empty</h1>
        <Link to="/shop" className="mt-6 btn-primary">Browse Products</Link>
      </div>
    );
  }

  if (!user && !success) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-forest-800">Please sign in to checkout</h1>
        <p className="mt-2 text-forest-500">You need an account to place an order.</p>
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
        <h1 className="mt-6 font-display text-3xl font-semibold text-forest-900">Order Placed Successfully!</h1>
        <p className="mt-3 text-forest-600">
          Thank you for your order. We've received your request and will confirm it shortly.
        </p>
        <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-forest-100 w-full max-w-sm">
          <p className="text-sm text-forest-500">Order ID</p>
          <p className="font-mono text-sm font-medium text-forest-800 mt-1 break-all">{success.orderId}</p>
        </div>
        <div className="mt-6 flex gap-3">
          <Link to="/account" className="btn-primary">View My Orders</Link>
          <Link to="/shop" className="btn-secondary">Continue Shopping</Link>
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
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total: grandTotal,
          shipping_address: address,
          city,
        })
        .select('id')
        .single();

      if (orderErr) throw orderErr;

      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image_url: item.product.image_url,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
      if (itemsErr) throw itemsErr;

      clearCart();
      setSuccess({ orderId: orderData.id });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white p-6 ring-1 ring-forest-100">
            <h2 className="font-display text-lg font-semibold text-forest-900">Delivery Details</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
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
                <label className="block text-sm font-medium text-forest-700 mb-1">City</label>
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai, Pune, Bengaluru..."
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1">Phone</label>
                <input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contact number"
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 ring-1 ring-forest-100">
            <h2 className="font-display text-lg font-semibold text-forest-900">Payment Method</h2>
            <div className="mt-4 rounded-xl border-2 border-forest-600 bg-forest-50 p-4">
              <p className="text-sm font-medium text-forest-800">Cash on Delivery</p>
              <p className="mt-1 text-xs text-forest-500">Pay when your plants arrive at your doorstep</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-white p-6 ring-1 ring-forest-100">
            <h2 className="font-display text-lg font-semibold text-forest-900">Order Summary</h2>
            <div className="mt-4 max-h-48 space-y-3 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <img src={product.image_url} alt={product.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-forest-900">{product.name}</p>
                    <p className="text-xs text-forest-500">Qty: {quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-forest-700">{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-forest-100 pt-4 text-sm">
              <div className="flex justify-between text-forest-600">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-forest-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-forest-100 pt-2">
                <span className="font-semibold text-forest-900">Total</span>
                <span className="font-display text-xl font-semibold text-forest-800">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <button type="submit" disabled={placing} className="mt-6 btn-primary w-full">
              {placing ? 'Placing Order...' : <>Place Order <ArrowRight size={18} /></>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
