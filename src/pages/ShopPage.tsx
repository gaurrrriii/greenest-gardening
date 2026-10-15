import { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Sprout } from 'lucide-react';
import { supabase, type Product, type Category } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const { path } = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [plantType, setPlantType] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(path.split('?')[1] || '');
    const cat = params.get('category');
    if (cat) setSelectedCategory(cat);
  }, [path]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('categories').select('*'),
      ]);
      setProducts(prodRes.data as Product[] || []);
      setCategories(catRes.data as Category[] || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) result = result.filter((p) => p.category_id === cat.id);
    }
    if (plantType) {
      result = result.filter((p) => p.plant_type === plantType);
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return result;
  }, [products, search, selectedCategory, plantType, priceRange, sortBy, categories]);

  const clearFilters = () => {
    setSelectedCategory('');
    setPlantType('');
    setPriceRange([0, 2000]);
    setSearch('');
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-forest-900">Category</h4>
        <div className="mt-3 space-y-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              !selectedCategory ? 'bg-forest-100 font-medium text-forest-800' : 'text-forest-600 hover:bg-forest-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedCategory === cat.slug ? 'bg-forest-100 font-medium text-forest-800' : 'text-forest-600 hover:bg-forest-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-forest-900">Plant Type</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {['', 'indoor', 'outdoor', 'flowering'].map((type) => (
            <button
              key={type || 'all'}
              onClick={() => setPlantType(type)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                plantType === type
                  ? 'bg-forest-600 text-white'
                  : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
              }`}
            >
              {type || 'All Types'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-forest-900">Price Range</h4>
        <div className="mt-3">
          <input
            type="range"
            min={0}
            max={2000}
            step={50}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-full accent-forest-600"
          />
          <div className="mt-2 flex justify-between text-xs text-forest-600">
            <span>₹0</span>
            <span className="font-medium">Up to ₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <button onClick={clearFilters} className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600">
        <X size={16} /> Clear all filters
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-forest-900 sm:text-4xl">Shop Plants & Supplies</h1>
        <p className="mt-2 text-forest-500">Discover quality plants, seeds, pots and tools from verified nurseries</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
          <input
            type="text"
            placeholder="Search plants, tools, seeds..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input !pl-10"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input sm:w-48"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary lg:hidden"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24">
            <h3 className="font-display text-lg font-semibold text-forest-900">Filters</h3>
            <div className="mt-4"><FilterContent /></div>
          </div>
        </aside>

        <div className="flex-1">
          <p className="mb-4 text-sm text-forest-500">
            {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
          </p>

          {showFilters && (
            <div className="mb-6 rounded-2xl bg-white p-5 ring-1 ring-forest-100 lg:hidden">
              <FilterContent />
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-forest-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 ring-1 ring-forest-100">
              <Sprout size={48} className="text-forest-200" />
              <p className="mt-4 text-lg font-medium text-forest-700">No products found</p>
              <p className="mt-1 text-sm text-forest-500">Try adjusting your filters or search</p>
              <button onClick={clearFilters} className="mt-4 btn-primary">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
