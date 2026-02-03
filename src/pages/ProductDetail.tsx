import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Check, Truck, Shield, ArrowLeft, Star, Bell, Clock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { getProductBySlug, getProductsByCategory, Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/products/ProductCard';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || '');
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <Layout>
        <div className="section-container section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
        </div>
      </Layout>
    );
  }

  const relatedProducts = getProductsByCategory(product.categorySlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.stockStatus !== 'in-stock') return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
    }, quantity);
  };

  const handleNotifyMe = () => {
    toast({
      title: "You'll be notified!",
      description: `We'll let you know when "${product.name}" becomes available.`,
    });
  };

  const images = product.images || [product.image];

  const isAvailable = product.stockStatus === 'in-stock';
  const isOutOfStock = product.stockStatus === 'out-of-stock';
  const isUpcoming = product.stockStatus === 'upcoming';

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-4">
        <div className="section-container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span>/</span>
            <Link to="/shop" className="breadcrumb-link">Shop</Link>
            <span>/</span>
            <Link to={`/category/${product.categorySlug}`} className="breadcrumb-link">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="section-container section-padding">
        {/* Back Button - Mobile */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary relative">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className={`w-full h-full object-cover ${!isAvailable ? 'opacity-75' : ''}`}
              />
              {isUpcoming && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 text-sm font-semibold rounded-full bg-accent text-accent-foreground">
                    Coming Soon
                  </span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Stock Badge */}
            <div className="mb-4">
              {isAvailable && (
                <span className="stock-badge stock-badge-in">
                  <Check className="h-4 w-4" />
                  In Stock
                </span>
              )}
              {isOutOfStock && (
                <span className="stock-badge stock-badge-out">
                  Out of Stock
                </span>
              )}
              {isUpcoming && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full bg-accent/10 text-accent">
                  <Clock className="h-4 w-4" />
                  Coming Soon
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
              {product.name}
            </h1>

            {/* Category */}
            <Link
              to={`/category/${product.categorySlug}`}
              className="text-sm text-primary hover:underline"
            >
              {product.category}
            </Link>

            {/* Rating */}
            {product.rating && product.reviewCount && product.reviewCount > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating!) ? 'fill-accent text-accent' : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{product.rating}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mt-6 mb-6">
              {isUpcoming ? (
                <span className="text-lg text-muted-foreground">Price coming soon</span>
              ) : (
                <>
                  <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="price-discount">{discountPercentage}% OFF</span>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {product.description.slice(0, 200)}...
            </p>

            {/* Quantity & Add to Cart / Notify Me */}
            {isAvailable ? (
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="qty-btn"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="qty-btn"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleAddToCart} size="lg" className="flex-1 touch-target">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <a
                    href={`https://wa.me/919330396636?text=Hi, I'm interested in ${encodeURIComponent(product.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="lg" className="w-full touch-target border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-whatsapp-foreground">
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Order via WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                <Button onClick={handleNotifyMe} size="lg" variant="outline" className="w-full touch-target">
                  <Bell className="h-5 w-5 mr-2" />
                  Notify Me When Available
                </Button>
                <a
                  href={`https://wa.me/919330396636?text=Hi, I'm interested in ${encodeURIComponent(product.name)} - please notify me when it's available`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg" className="w-full touch-target border-whatsapp text-whatsapp hover:bg-whatsapp hover:text-whatsapp-foreground">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Ask on WhatsApp
                  </Button>
                </a>
              </div>
            )}

            {/* Trust Signals */}
            <div className="flex flex-col sm:flex-row gap-4 py-6 border-t border-b border-border">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Fast Shipping</p>
                  <p className="text-xs text-muted-foreground">Worldwide delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">100% protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Description
              </TabsTrigger>
              {product.ingredients && (
                <TabsTrigger
                  value="ingredients"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  Ingredients
                </TabsTrigger>
              )}
              {product.howToUse && (
                <TabsTrigger
                  value="usage"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  How to Use
                </TabsTrigger>
              )}
              <TabsTrigger
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Shipping
              </TabsTrigger>
            </TabsList>
            <div className="py-6">
              <TabsContent value="description" className="mt-0">
                <p className="text-muted-foreground leading-relaxed max-w-3xl">
                  {product.description}
                </p>
              </TabsContent>
              {product.ingredients && (
                <TabsContent value="ingredients" className="mt-0">
                  <p className="text-muted-foreground leading-relaxed max-w-3xl">
                    {product.ingredients}
                  </p>
                </TabsContent>
              )}
              {product.howToUse && (
                <TabsContent value="usage" className="mt-0">
                  <p className="text-muted-foreground leading-relaxed max-w-3xl">
                    {product.howToUse}
                  </p>
                </TabsContent>
              )}
              <TabsContent value="shipping" className="mt-0">
                <p className="text-muted-foreground leading-relaxed max-w-3xl">
                  {product.shippingInfo || 'Standard shipping within India takes 3-5 business days. International shipping available to 30+ countries. Products are freshly packed to ensure quality during transit.'}
                </p>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Add to Cart / Notify Me */}
      {isAvailable ? (
        <div className="sticky-cart-mobile">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xl font-bold">{formatPrice(product.price)}</p>
              {product.originalPrice && (
                <p className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>
            <Button onClick={handleAddToCart} className="flex-1 touch-target">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      ) : (
        <div className="sticky-cart-mobile">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {isUpcoming ? 'Coming Soon' : 'Out of Stock'}
              </p>
            </div>
            <Button onClick={handleNotifyMe} variant="outline" className="flex-1 touch-target">
              <Bell className="h-5 w-5 mr-2" />
              Notify Me
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}
