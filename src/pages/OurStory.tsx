import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function OurStory() {
  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-4">
        <div className="section-container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span>/</span>
            <span className="text-foreground">Our Story</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 to-background" />
        <div className="section-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              From the Heart of Bengal
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Bongo Hridoy was born from a simple yet powerful idea — to bring the authentic 
              flavors of Bengal to Bengali hearts around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Story Content */}
      <section className="section-padding">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
                Our Journey Began with a Craving
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  It all started when our founders, living away from Bengal, found themselves 
                  longing for the tastes of home — the tangy kick of homemade pickle, the 
                  sweetness of Nolen Gur Sandesh, the warmth of a cup of chai with Nimki.
                </p>
                <p>
                  They realized they weren't alone. Millions of Bengalis worldwide share this 
                  same craving, this connection to their roots through food. And so, Bongo Hridoy 
                  was born — a bridge between Bengal and Bengalis everywhere.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&h=500&fit=crop"
                alt="Traditional Bengali sweets"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-xl bg-primary/10 -z-10" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="order-2 md:order-1 relative">
              <img
                src="https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=500&fit=crop"
                alt="Homemade pickles"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-xl bg-accent/10 -z-10" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
                Authenticity is Our Promise
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Every product we sell is carefully sourced from trusted makers across Bengal — 
                  from the famous sweet shops of Kolkata to the home kitchens of rural artisans 
                  who have perfected their craft over generations.
                </p>
                <p>
                  We don't just sell products; we preserve traditions. Each jar of pickle, each 
                  piece of mishti, each packet of spice carries with it the love, care, and 
                  expertise of Bengali culinary heritage.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="bg-card rounded-2xl p-8 md:p-12 border border-border">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">
              What We Stand For
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Authenticity',
                  description: 'Every product is sourced from Bengal, made with traditional recipes passed down through generations.',
                },
                {
                  title: 'Quality',
                  description: 'We ensure the highest standards in packaging and shipping so you receive products as fresh as possible.',
                },
                {
                  title: 'Connection',
                  description: 'More than a store, we are a community connecting Bengalis worldwide through the love of food.',
                },
              ].map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-display font-bold text-primary">{index + 1}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary/50 section-padding">
        <div className="section-container text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Taste the Tradition
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Explore our collection of authentic Bengali products and bring a piece of home to your kitchen.
          </p>
          <Link to="/shop">
            <Button size="lg" className="px-8">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
