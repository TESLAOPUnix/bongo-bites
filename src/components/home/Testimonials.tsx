import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Priya Mukherjee',
    location: 'USA',
    rating: 5,
    text: "The Nolen Gur Sandesh reminded me of my grandmother's kitchen in Kolkata. So authentic and fresh! Will definitely order again.",
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    id: 2,
    name: 'Amit Roy',
    location: 'London, UK',
    rating: 5,
    text: "Living abroad, I miss Bengali food the most. Bongo Hridoy delivers the exact taste of home. Their pickles are exceptional!",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    id: 3,
    name: 'Susmita Das',
    location: 'Delhi, India',
    rating: 5,
    text: "Ordered the Gobindobhog rice for Durga Puja bhog. The quality and aroma was perfect. Highly recommend for authentic Bengali cooking.",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
];

export default function Testimonials() {
  return (
    <section className="section-padding bg-gradient-warm">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Trusted by Bengali families worldwide for authentic taste and quality
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <Quote className="h-8 w-8 text-primary/20 mb-4" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/80 mb-6 text-sm leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
