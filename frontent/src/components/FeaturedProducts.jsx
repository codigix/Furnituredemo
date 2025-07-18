
import { useAppSelector } from '../hooks/useAppSelector';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';


const FeaturedProducts = () => {
  const { featuredProducts } = useAppSelector((state) => state.products);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Button variant="outline" asChild>
            <Link to="/products">View All</Link>
          </Button>
        </div>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
