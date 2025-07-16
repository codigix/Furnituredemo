
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addToCart } from '../store/cartSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from 'sonner';
import { Product } from '../services/productService';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  
  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    }));
    toast.success(`${product.name} added to cart!`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Link to={`/product/${product._id}`} className="block">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`} className="block">
          <h3 className="font-medium text-lg mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart size={16} className="mr-1" /> Add
          </Button>
        </div>
        {product.stock <= 0 && (
          <p className="text-red-500 text-xs mt-2">Out of stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
