import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ShoppingBag, Search } from 'lucide-react';
import api from '../services/api';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([
    {
      _id: 'ord-89218',
      orderNumber: 'SC-89218',
      customerName: 'Bhuvan',
      itemsCount: 3,
      totalAmount: 145000, // paise
      status: 'paid',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'ord-89217',
      orderNumber: 'SC-89217',
      customerName: 'Rahul M.',
      itemsCount: 1,
      totalAmount: 4900,
      status: 'paid',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      _id: 'ord-89216',
      orderNumber: 'SC-89216',
      customerName: 'Ananya S.',
      itemsCount: 5,
      totalAmount: 82000,
      status: 'pending',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.get('/api/admin/orders');
        if (data?.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.warn('Fallback to demo orders:', err.message);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-brand-accent" /> Checkout Orders
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Log of customer transactions and exit turnstile gate clearance tokens
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search order # or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-brand-200 bg-brand-100 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent"
          />
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border-brand-200 bg-brand-100 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-brand-200/50">
              <TableRow>
                <TableHead className="font-semibold text-xs text-text-primary">Order ID</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Customer</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Items</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Total Amount</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Status</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-text-muted">
                    No orders match your search query.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const isPaid = order.status === 'paid' || order.status === 'completed';
                  const amount = (Number(order.totalAmount || 0) / 100).toFixed(2);

                  return (
                    <TableRow key={order._id} className="hover:bg-brand-50/50">
                      <TableCell className="font-medium text-xs text-text-primary">
                        {order.orderNumber || order._id}
                      </TableCell>
                      <TableCell className="text-xs text-text-secondary">
                        {order.customerName || order.userId?.name || 'Walk-in Shopper'}
                      </TableCell>
                      <TableCell className="text-xs text-text-secondary">
                        {order.itemsCount || order.items?.length || 1} items
                      </TableCell>
                      <TableCell className="font-bold text-xs text-text-primary">
                        ₹{amount}
                      </TableCell>
                      <TableCell>
                        <Badge variant={isPaid ? 'success' : 'warning'}>
                          {isPaid ? 'Paid & Verified' : 'Pending Payment'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-text-muted">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Recent'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
