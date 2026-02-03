import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import TrustBadges from '@/components/home/TrustBadges';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import BestsellerProducts from '@/components/home/BestsellerProducts';
import UpcomingProducts from '@/components/home/UpcomingProducts';
import Testimonials from '@/components/home/Testimonials';

export default function Index() {
  return (
    <Layout>
      <Hero />
      <TrustBadges />
      <FeaturedCategories />
      <BestsellerProducts />
      <UpcomingProducts />
      <Testimonials />
    </Layout>
  );
}
