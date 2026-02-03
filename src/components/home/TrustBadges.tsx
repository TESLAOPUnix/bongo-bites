import { Shield, Package, Truck, Leaf } from 'lucide-react';

const badges = [
  {
    icon: Shield,
    title: 'Secure Checkout',
    description: '100% secure payment',
  },
  {
    icon: Package,
    title: 'Fresh Packing',
    description: 'Freshly packed to order',
  },
  {
    icon: Truck,
    title: 'Worldwide Shipping',
    description: 'Delivering to 30+ countries',
  },
  {
    icon: Leaf,
    title: 'Authentic Products',
    description: 'Sourced from Bengal',
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-secondary/50 py-8 md:py-10">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="trust-badge">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <badge.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">{badge.title}</h4>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
