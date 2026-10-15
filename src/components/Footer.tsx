import { Leaf, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from '@/lib/router';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-forest-100 bg-forest-950 text-forest-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-600 text-white">
                <Leaf size={22} />
              </div>
              <span className="font-display text-xl font-semibold text-white">GreenNest</span>
            </div>
            <p className="mt-4 text-sm text-forest-200">
              Your one-stop platform for plants, gardening supplies, and verified gardener
              services. Bringing green living to every home.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 transition-colors hover:bg-forest-700">
                <Instagram size={18} />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 transition-colors hover:bg-forest-700">
                <Facebook size={18} />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 transition-colors hover:bg-forest-700">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-white">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/shop?category=indoor-plants" className="text-forest-200 transition-colors hover:text-white">Indoor Plants</Link></li>
              <li><Link to="/shop?category=outdoor-plants" className="text-forest-200 transition-colors hover:text-white">Outdoor Plants</Link></li>
              <li><Link to="/shop?category=flowering-plants" className="text-forest-200 transition-colors hover:text-white">Flowering Plants</Link></li>
              <li><Link to="/shop?category=seeds" className="text-forest-200 transition-colors hover:text-white">Seeds</Link></li>
              <li><Link to="/shop?category=pots-planters" className="text-forest-200 transition-colors hover:text-white">Pots & Planters</Link></li>
              <li><Link to="/shop?category=gardening-tools" className="text-forest-200 transition-colors hover:text-white">Gardening Tools</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-white">Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/services" className="text-forest-200 transition-colors hover:text-white">Home Gardening</Link></li>
              <li><Link to="/services" className="text-forest-200 transition-colors hover:text-white">Lawn Maintenance</Link></li>
              <li><Link to="/services" className="text-forest-200 transition-colors hover:text-white">Plant Care & Pruning</Link></li>
              <li><Link to="/services" className="text-forest-200 transition-colors hover:text-white">Garden Landscaping</Link></li>
              <li><Link to="/services" className="text-forest-200 transition-colors hover:text-white">Balcony Gardens</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-semibold text-white">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-3 text-forest-200">
                <Mail size={16} className="shrink-0" /> hello@greennest.in
              </li>
              <li className="flex items-center gap-3 text-forest-200">
                <Phone size={16} className="shrink-0" /> +91 98765 43210
              </li>
              <li className="flex items-center gap-3 text-forest-200">
                <MapPin size={16} className="shrink-0" /> Mumbai, Pune, Bengaluru
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-forest-800 pt-6 text-center text-sm text-forest-300">
          <p>&copy; {new Date().getFullYear()} GreenNest. Promoting green living and sustainable gardening.</p>
        </div>
      </div>
    </footer>
  );
}
