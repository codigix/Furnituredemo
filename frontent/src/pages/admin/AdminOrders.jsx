import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updateOrderStatus, fetchAllOrders } from "../../store/orderSlice";
import AdminLayout from "../../components/admin/AdminLayout";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

const AdminOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status) =>
    status === "delivered"
      ? "bg-green-100 text-green-800"
      : status === "shipped"
      ? "bg-blue-100 text-blue-800"
      : "bg-amber-100 text-amber-800";

  const handleUpdateStatus = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status }));
    toast.success(`Order status updated to ${status}`);
  };

  // const filteredOrders = orders.filter(
  //   (order) => statusFilter === 'all' || order.status === statusFilter
  // );
  const filteredOrders = Array.isArray(orders)
    ? orders.filter(
        (order) => statusFilter === "all" || order.status === statusFilter
      )
    : [];

  return (
    <AdminLayout title="Manage Orders">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Filter by Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-gray-500">
          {filteredOrders.length} orders found
        </div>
      </div>

      {isLoading && (
        <div className="p-4 text-center text-sm text-gray-500">
          Loading orders...
        </div>
      )}
      {error && (
        <div className="p-4 text-center text-sm text-red-500">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.shipping_name || "Unknown name"}</TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                </TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) =>
                        handleUpdateStatus(order.id, value)
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredOrders.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
