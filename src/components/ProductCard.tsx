import { Star, ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/lib/supabase';
import { Link } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="card group flex flex-col overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-forest-50">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.plant_type && (
          <span className="absolute left-3 top-3 badge bg-white/90 text-forest-700 capitalize backdrop-blur-sm">
            {product.plant_type}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute left-3 top-3 badge bg-red-100 text-red-700">Out of stock</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1 text-xs text-sand-500">
          <Star size={14} fill="currentColor" />
          <span className="font-medium">{product.rating.toFixed(1)}</span>
        </div>
        <h3 className="mt-1 font-display text-base font-semibold text-forest-900 line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-forest-500 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-forest-800">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0 || added}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all active:scale-90 disabled:cursor-not-allowed ${
              added
                ? 'bg-forest-600 text-white'
                : 'bg-forest-100 text-forest-700 hover:bg-forest-200'
            }`}
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </Link>
  );
}
