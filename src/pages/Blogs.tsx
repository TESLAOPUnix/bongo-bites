import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import Layout from '@/components/layout/Layout';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'history-of-bengali-sweets',
    title: 'The Rich History of Bengali Sweets: From Sandesh to Rosogolla',
    excerpt: 'Explore the fascinating journey of Bengali sweets through centuries, from royal kitchens to modern-day celebrations.',
    image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&h=400&fit=crop',
    category: 'Culture',
    date: '2024-01-15',
    readTime: '5 min read',
  },
  {
    id: '2',
    slug: 'authentic-kasundi-recipe',
    title: 'How to Make Authentic Bengali Kasundi at Home',
    excerpt: 'Learn the traditional recipe of Kasundi, the beloved Bengali mustard sauce that pairs perfectly with fish and snacks.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop',
    category: 'Recipes',
    date: '2024-01-10',
    readTime: '8 min read',
  },
  {
    id: '3',
    slug: 'nolen-gur-season-guide',
    title: 'Nolen Gur Season: Everything You Need to Know',
    excerpt: 'Discover why winter is the most awaited season for Bengali food lovers and how Nolen Gur transforms our sweets.',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=400&fit=crop',
    category: 'Seasonal',
    date: '2024-01-05',
    readTime: '6 min read',
  },
  {
    id: '4',
    slug: 'durga-puja-food-guide',
    title: 'Complete Food Guide for Durga Puja Celebrations',
    excerpt: 'From bhog to street food, explore the culinary delights that make Durga Puja the biggest food festival of Bengal.',
    image: 'https://images.unsplash.com/photo-1609941189988-b2f7c9e2d4a6?w=600&h=400&fit=crop',
    category: 'Festivals',
    date: '2023-10-20',
    readTime: '10 min read',
  },
  {
    id: '5',
    slug: 'bengali-pickle-varieties',
    title: '10 Traditional Bengali Pickle Varieties You Must Try',
    excerpt: 'From Aam ka Achar to Nimbu Achar, discover the diverse world of Bengali pickles and their unique flavors.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop',
    category: 'Food Guide',
    date: '2023-09-15',
    readTime: '7 min read',
  },
];

const categories = ['All', 'Culture', 'Recipes', 'Seasonal', 'Festivals', 'Food Guide'];

export default function Blogs() {
  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary/30 py-4">
        <div className="section-container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <span>/</span>
            <span className="text-foreground">Blogs</span>
          </nav>
        </div>
      </div>

      <div className="section-container section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            Stories from Bengal
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore recipes, traditions, and the rich culinary heritage of Bengali cuisine
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cat === 'All'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <Link to={`/blog/${blogPosts[0].slug}`} className="block group">
            <div className="relative rounded-2xl overflow-hidden aspect-[21/9]">
              <img
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold mb-3">
                  {blogPosts[0].category}
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-background mb-3 max-w-2xl group-hover:text-primary transition-colors">
                  {blogPosts[0].title}
                </h2>
                <p className="text-background/80 mb-4 max-w-xl hidden md:block">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-background/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(blogPosts[0].date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {blogPosts[0].readTime}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(1).map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                    <Tag className="h-3 w-3" />
                    {post.category}
                  </span>
                </div>
                <h3 className="font-display font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="flex items-center gap-1">
                    {post.readTime}
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
