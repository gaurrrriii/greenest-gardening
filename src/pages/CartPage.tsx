import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { Link } from '@/lib/router';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 sm:px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest-50 text-forest-300">
          <ShoppingBag size={40} />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold text-forest-800">Your cart is empty</h1>
        <p className="mt-2 text-forest-500">Browse our collection and add some greenery to your home.</p>
        <Link to="/shop" className="mt-6 btn-primary">Start Shopping <ArrowRight size={18} /></Link>
      </div>
    );
  }

  const shipping = total >= 999 ? 0 : 49;
  const grandTotal = total + shipping;

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest-900">Shopping Cart</h1>
      <p className="mt-2 text-forest-500">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-forest-100">
              <Link to={`/product/${product.slug}`} className="shrink-0">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-24 w-24 rounded-xl object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="font-display text-base font-semibold text-forest-900 hover:text-forest-600">{product.name}</h3>
                    </Link>
                    {product.plant_type && (
                      <span className="text-xs capitalize text-forest-500">{product.plant_type} plant</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-forest-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-forest-200">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-forest-600 hover:bg-forest-50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-forest-600 hover:bg-forest-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-display text-lg font-semibold text-forest-800">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between">
            <button onClick={clearCart} className="text-sm font-medium text-red-500 hover:text-red-600">
              Clear cart
            </button>
            <Link to="/shop" className="text-sm font-medium text-forest-600 hover:text-forest-800">
              Continue shopping
            </Link>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-white p-6 ring-1 ring-forest-100">
            <h2 className="font-display text-lg font-semibold text-forest-900">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-forest-600">
                <span>Subtotal</span>
                <span className="font-medium text-forest-900">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-forest-600">
                <span>Shipping</span>
                <span className="font-medium text-forest-900">
                  {shipping === 0 ? <span className="text-forest-600">Free</span> : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="rounded-lg bg-forest-50 px-3 py-2 text-xs text-forest-600">
                  Add {formatPrice(999 - total)} more for free delivery
                </p>
              )}
              <div className="border-t border-forest-100 pt-3 flex justify-between">
                <span className="font-semibold text-forest-900">Total</span>
                <span className="font-display text-xl font-semibold text-forest-800">{formatPrice(grandTotal)}</span>
              </div>
            </div>
            <Link to="/checkout" className="mt-6 btn-primary w-full">
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
