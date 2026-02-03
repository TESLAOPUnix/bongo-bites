import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown, Phone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import MiniCart from './MiniCart';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartCount, isCartOpen, setIsCartOpen } = useCart();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Story', path: '/our-story' },
    { name: 'Shop', path: '/shop' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact', path: '/contact' },
  ];

  const cartCount = getCartCount();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-tertiary text-tertiary-foreground py-2 text-sm hidden md:block">
        <div className="section-container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="tel:+913368263382" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Phone className="w-3.5 h-3.5" />
              +91 33-68263382
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span>Ordering from abroad?</span>
            <a
              href="https://wa.me/919330396636"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
            >
              Connect on WhatsApp →
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 bg-background transition-all duration-300 ${
          isScrolled ? 'shadow-md' : 'border-b border-border'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="touch-target">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <div className="p-6 border-b border-border">
                  <Link to="/" className="font-display text-2xl font-bold text-primary">
                    Bongo Hridoy
                  </Link>
                </div>
                <nav className="p-4">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.path}>
                      <Link
                        to={link.path}
                        className={`block py-3 px-4 rounded-lg text-lg transition-colors ${
                          location.pathname === link.path
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="border-t border-border mt-4 pt-4">
                    <p className="px-4 py-2 text-sm font-semibold text-muted-foreground">Categories</p>
                    {categories.slice(0, 6).map((cat) => (
                      <SheetClose asChild key={cat.slug}>
                        <Link
                          to={`/category/${cat.slug}`}
                          className="block py-2 px-4 text-sm hover:bg-secondary rounded-lg transition-colors"
                        >
                          {cat.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="font-display text-xl md:text-2xl font-bold text-primary">
                Bongo Hridoy
              </h1>
              <p className="text-[10px] md:text-xs text-muted-foreground -mt-0.5">
                From the Heart of Bengal
              </p>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-border bg-secondary/50 
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           transition-all duration-200"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-foreground/80 hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Categories Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/50 transition-colors">
                    Categories
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                  {categories.map((cat) => (
                    <DropdownMenuItem key={cat.slug} asChild>
                      <Link to={`/category/${cat.slug}`} className="cursor-pointer">
                        {cat.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {navLinks.slice(3).map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-foreground/80 hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search */}
              <Button variant="ghost" size="icon" className="md:hidden touch-target">
                <Search className="h-5 w-5" />
              </Button>

              {/* Account */}
              <Link to={isAuthenticated ? '/account' : '/login'}>
                <Button variant="ghost" size="icon" className="touch-target">
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="touch-target relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Button>

              {/* WhatsApp CTA - Desktop */}
              <a
                href="https://wa.me/919330396636"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex"
              >
                <Button variant="outline" size="sm" className="border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-whatsapp-foreground">
                  <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Order via WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mini Cart Drawer */}
      <MiniCart />
    </>
  );
}
