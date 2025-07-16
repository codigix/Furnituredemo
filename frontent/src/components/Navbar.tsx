
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Search, User } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { toggleCart } from '../store/cartSlice';
import { Input } from '@/components/ui/input';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleOpenCart = () => {
    dispatch(toggleCart());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            ShopEase
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center relative flex-1 max-w-md mx-8">
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10"
            />
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            <Link to="/products" className="text-sm font-medium hover:text-primary">
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="text-sm font-medium hover:text-primary">
                  Orders
                </Link>
                
                <div className="relative group">
                  <Button variant="ghost" className="p-2" asChild>
                    <Link to="/profile">
                      <User className="h-5 w-5" />
                    </Link>
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md hidden group-hover:block z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">Hello, {user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-secondary">
                        Your Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-secondary">
                        Your Orders
                      </Link>
                      {user?.isAdmin && (
                        <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-secondary">
                          Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout} 
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-secondary"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              onClick={handleOpenCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
