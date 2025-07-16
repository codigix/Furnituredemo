
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ShoppingCart } from './ShoppingCart';
import { useAppSelector } from '../hooks/useAppSelector';

const Layout = () => {
  const isCartOpen = useAppSelector((state) => state.cart.isOpen);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      {isCartOpen && <ShoppingCart />}
      <Footer />
    </div>
  );
};

export default Layout;
