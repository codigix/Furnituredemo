import { useEffect } from 'react';
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { fetchUserOrders } from "../store/orderSlice";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDistance } from 'date-fns';

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.orders);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  // // ...existing code...
  // console.log('orders:', orders);
  // console.log('user:', user);
  // // ...existing code...
  // const userOrders = orders.filter((order) => order.user_id === user?.id);
  // // ...existing code...
  console.log('orders:', orders);
  console.log('user:', user);

  if (!user) {
    return <div>Loading user...</div>;
  }

  const userOrders = orders.filter(
    (order) => String(order.user_id) === String(user.id)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      default:
        return 'bg-amber-500';
    }
  };

  if (userOrders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mb-4">
            <svg className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
          <p className="text-gray-600 mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Shipping Info</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                <TableCell>
                  <div>{new Date(order.created_at).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-500">
                    {formatDistance(new Date(order.created_at), new Date(), { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{order.shipping_name}</div>
                  <div className="text-sm text-gray-500">
                    {order.shipping_address}, {order.shipping_city}, {order.shipping_postal_code}, {order.shipping_country}
                  </div>
                </TableCell>
                <TableCell>
                  {order.items.map((item) => (
                    <div key={item.id} className="mb-2">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </div>
                    </div>
                  ))}
                </TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrdersPage;
