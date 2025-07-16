
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const CartPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingCost = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;
  
  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };
  
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex flex-col items-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Button asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between">
                <h2 className="font-semibold">{items.length} {items.length === 1 ? 'Item' : 'Items'}</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearCart}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Clear Cart
                </Button>
              </div>
            </div>
            
            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.id} className="p-6 flex items-center">
                  <div className="w-20 h-20 rounded bg-gray-100 overflow-hidden mr-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link 
                      to={`/products/${item.id}`} 
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-500 text-sm">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-10 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="w-24 text-right font-medium">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-4 text-gray-400 hover:text-red-500"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="font-semibold mb-6 pb-4 border-b">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span>{shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}</span>
              </div>
              <div className="border-t pt-4 mt-4 flex justify-between font-semibold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <p className="text-sm text-gray-500">
                {subtotal < 50 
                  ? `Add ${formatCurrency(50 - subtotal)} more to get free shipping!`
                  : 'You qualify for free shipping!'}
              </p>
              <Button 
                className="w-full" 
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
