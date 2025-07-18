
import { Link } from 'react-router-dom';

import { ShoppingCart } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addToCart } from '../store/cartSlice';
import { formatCurrency } from '../utils/formatCurrency';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

const ProductCard = ({ product }) => {
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
    toast.success(`${product.name} added to cart!`);
  };
  
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105"
          />
        </div>
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-white px-4 py-2 rounded-full text-sm font-medium">View Details</span>
          </div>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
        </Link>
        <p className="text-lg font-semibold mb-2">{formatCurrency(product.price)}</p>
        <Button 
          onClick={handleAddToCart}
          className="w-full"
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
