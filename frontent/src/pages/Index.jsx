
import HeroSection from "../components/HeroSection";
import FeaturedProducts from "../components/FeaturedProducts";
import CategorySection from "../components/CategorySection";
import Testimonials from "../components/Testimonials";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      <CategorySection />
      
      {/* Special offer section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Special Offer</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Get 15% off your first order when you sign up for our newsletter. 
            Don't miss out on exclusive deals and updates!
          </p>
          <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
            Sign Up Now
          </Button>
        </div>
      </section>
      
      <Testimonials />
      
      {/* CTA section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Browse our collection of high-quality products and find exactly what you're looking for.
          </p>
          <Button size="lg" asChild>
            <Link to="/products">Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
