import { useAppSelector } from '../../hooks/useAppSelector';
import AdminLayout from '../../components/admin/AdminLayout';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const AdminDashboard = () => {
    const { products } = useAppSelector((state) => state.products);
    const { orders } = useAppSelector((state) => state.orders);

    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
    const lowStockProducts = products.filter((product) => product.stock < 10);

    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const shippedOrders = orders.filter(order => order.status === 'shipped').length;
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;

    const orderStatusData = [
        { name: 'Pending', value: pendingOrders },
        { name: 'Shipped', value: shippedOrders },
        { name: 'Delivered', value: deliveredOrders },
    ];

    const revenueData = [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 5000 },
        { name: 'Apr', value: 4500 },
        { name: 'May', value: 6000 },
        { name: 'Jun', value: 5500 },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">${totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalOrders}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {pendingOrders} pending, {shippedOrders} shipped
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {lowStockProducts.length} low stock
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +12 this week
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <div className="flex h-64 items-end space-x-2">
                                {revenueData.map((item) => (
                                    <div key={item.name} className="flex flex-col items-center flex-1">
                                        <div
                                            className="bg-primary w-full rounded-t"
                                            style={{ height: `${(item.value / 6000) * 100}%` }}
                                        ></div>
                                        <span className="text-xs mt-2">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {orders.slice(0, 5).map((order) => (
                                <div key={order._id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Order #{order._id.slice(0, 8)}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${order.status === 'delivered'
                                            ? 'bg-green-100 text-green-800'
                                            : order.status === 'shipped'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-amber-100 text-amber-800'
                                            }`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
