
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { clearCart, getCartTotal } from '../store/cartSlice';
import { createOrder } from '../store/orderSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '../utils/formatCurrency';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States'
  });
  
  // Calculate totals
  const subtotal = getCartTotal(items);
  const shippingCost = 10.00;
  const tax = subtotal * 0.08; // 8% tax
  const orderTotal = subtotal + shippingCost + tax;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress({
      ...shippingAddress,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }
    
    // Prepare order items
    const orderItems = items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
      product: item.id
    }));
    
    // Create order
    dispatch(createOrder({
      items: orderItems,
      shippingAddress,
      total: orderTotal
    })).then(() => {
      // Clear cart and redirect
      dispatch(clearCart());
      navigate('/orders');
    });
  };
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="mb-6">Your cart is empty. Add some products before checking out.</p>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input 
                      id="postalCode"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="payment-card"
                      name="paymentMethod"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                      checked
                      readOnly
                    />
                    <label htmlFor="payment-card" className="ml-2 block text-sm text-gray-700">
                      Credit/Debit Card (Demonstration Only)
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button type="submit" className="w-full">
                  Place Order
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="font-medium">{formatCurrency(subtotal)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Shipping</p>
                <p className="font-medium">{formatCurrency(shippingCost)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Tax (8%)</p>
                <p className="font-medium">{formatCurrency(tax)}</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-bold">
              <p>Total</p>
              <p>{formatCurrency(orderTotal)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
