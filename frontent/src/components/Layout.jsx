
import { Outlet } from 'react-router-dom';


import Footer from './Footer';
import { ShoppingCart } from './ShoppingCart';
import { useAppSelector } from '../hooks/useAppSelector';
import Navbar from './Navbar';

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
