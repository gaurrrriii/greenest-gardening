import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Check, Shield, Truck, Leaf, ChevronLeft, Minus, Plus, Sprout } from 'lucide-react';
import { supabase, type Product } from '@/lib/supabase';
import { Link, useRouter } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/format';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      const prod = data as Product | null;
      setProduct(prod);

      if (prod) {
        const { data: relData } = await supabase
          .from('products')
          .select('*')
          .neq('id', prod.id)
          .limit(4);
        setRelated((relData as Product[]) || []);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-forest-100" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-forest-100" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-forest-100" />
            <div className="h-24 w-full animate-pulse rounded bg-forest-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 sm:px-6">
        <Sprout size={56} className="text-forest-200" />
        <h1 className="mt-4 font-display text-2xl font-semibold text-forest-800">Product not found</h1>
        <p className="mt-2 text-forest-500">The product you're looking for doesn't exist.</p>
        <Link to="/shop" className="mt-6 btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/shop" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-800">
        <ChevronLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-forest-50">
          <img
            src={product.image_url}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
          {product.plant_type && (
            <span className="absolute left-4 top-4 badge bg-white/90 text-forest-700 capitalize backdrop-blur-sm">
              {product.plant_type} plant
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm text-sand-500">
            <Star size={16} fill="currentColor" />
            <span className="font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-forest-300">·</span>
            <span className={`font-medium ${product.stock > 0 ? 'text-forest-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <h1 className="mt-2 font-display text-3xl font-semibold text-forest-900">{product.name}</h1>
          <p className="mt-3 text-forest-600 leading-relaxed">{product.description}</p>

          <div className="mt-4">
            <span className="font-display text-3xl font-semibold text-forest-800">
              {formatPrice(product.price)}
            </span>
          </div>

          {product.care_instructions && (
            <div className="mt-6 rounded-xl bg-forest-50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-forest-800">
                <Leaf size={18} className="text-forest-600" /> Care Instructions
              </h3>
              <p className="mt-2 text-sm text-forest-600 leading-relaxed">{product.care_instructions}</p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-forest-200 bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full text-forest-600 hover:bg-forest-50"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-medium text-forest-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full text-forest-600 hover:bg-forest-50"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || added}
              className={`btn-primary flex-1 ${added ? '!bg-forest-600' : ''}`}
            >
              {added ? <><Check size={18} /> Added to Cart</> : <><ShoppingCart size={18} /> Add to Cart</>}
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="mt-3 btn-accent w-full"
          >
            Buy Now
          </button>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-forest-100 pt-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <Truck size={22} className="text-forest-600" />
              <span className="text-xs text-forest-600">Free delivery over ₹999</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Shield size={22} className="text-forest-600" />
              <span className="text-xs text-forest-600">Quality assured</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Leaf size={22} className="text-forest-600" />
              <span className="text-xs text-forest-600">Eco-friendly packaging</span>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-forest-900">You might also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
