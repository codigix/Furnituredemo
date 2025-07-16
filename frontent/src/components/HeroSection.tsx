
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop the Latest Trends</h1>
            <p className="text-lg text-gray-600 mb-6">
              Discover our collection of high-quality products at competitive prices.
              Free shipping on orders over $50!
            </p>
            <div className="flex space-x-4">
              <Button size="lg" asChild>
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/products">Explore</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hvcHBpbmd8ZW58MHx8MHx8fDA%3D"
              alt="Shopping"
              className="rounded-lg shadow-lg w-full object-cover h-[400px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
