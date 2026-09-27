import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import api from '../services/api';
import socket from '../services/socket';

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeCarts: 0,
    fraudAlerts: 0,
    topProducts: [],
  });

  const [loading, setLoading] = useState(true);
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected);
  const [liveAlerts, setLiveAlerts] = useState([
    {
      _id: 'sample-1',
      cartId: 'CART-9042',
      severity: 'high',
      difference: 350,
      timestamp: new Date().toISOString(),
    },
  ]);

  // Mock hourly data for today's orders
  const hourlyData = [
    { hour: '9am', orders: 2 },
    { hour: '10am', orders: 5 },
    { hour: '11am', orders: 8 },
    { hour: '12pm', orders: 12 },
    { hour: '1pm', orders: 7 },
    { hour: '2pm', orders: 9 },
  ];

  // Fetch stats on mount
  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/admin/stats');
        if (res?.stats && isMounted) {
          setStats(res.stats);
        }
      } catch (err) {
        console.warn('Failed to load stats, using initial data:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  // Socket.io connection state & fraud-alert listener
  useEffect(() => {
    setIsSocketConnected(socket.connected);

    const handleConnect = () => setIsSocketConnected(true);
    const handleDisconnect = () => setIsSocketConnected(false);

    const handleFraudAlert = (alert) => {
      setLiveAlerts((prev) => [alert, ...prev].slice(0, 5));
      setStats((prev) => ({
        ...prev,
        fraudAlerts: (prev.fraudAlerts || 0) + 1,
      }));
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('fraud-alert', handleFraudAlert);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('fraud-alert', handleFraudAlert);
    };
  }, []);

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const topProductsList =
    stats.topProducts && stats.topProducts.length > 0
      ? stats.topProducts
      : [
          { productName: 'Parle-G Biscuits', totalQuantity: 12 },
          { productName: 'Almond Milk 1L', totalQuantity: 8 },
          { productName: 'Dark Chocolate 70%', totalQuantity: 5 },
        ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">{todayDate}</p>
        </div>

        {/* Live Socket.io Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-3 py-1.5 rounded-full border border-brand-200 shadow-sm">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isSocketConnected
                ? 'bg-emerald-500 animate-pulse'
                : 'bg-amber-400'
            }`}
          />
          <span className="text-xs font-semibold text-text-primary">
            {isSocketConnected ? 'Live' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* STATS ROW (4 Cards) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card
              key={i}
              className="border-brand-200 bg-brand-100 p-6 animate-pulse"
            >
              <div className="h-4 bg-brand-200 rounded w-24 mb-4" />
              <div className="h-8 bg-brand-200 rounded w-32" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Revenue */}
          <Card className="border-brand-200 bg-brand-100 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-sm text-text-secondary">
                <span>💰 Total Revenue</span>
                <span className="text-xs font-semibold text-emerald-600">
                  ↑ +12%
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-text-primary tracking-tight">
                ₹{(Number(stats.totalRevenue || 0) / 100).toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className="border-brand-200 bg-brand-100 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-sm text-text-secondary">
                <span>📦 Total Orders</span>
                <span className="text-xs font-semibold text-emerald-600">
                  ↑ +5%
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-text-primary tracking-tight">
                {stats.totalOrders ?? 0}
              </div>
            </CardContent>
          </Card>

          {/* Active Carts */}
          <Card className="border-brand-200 bg-brand-100 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-sm text-text-secondary">
                <span>🛒 Active Carts</span>
                <span className="text-xs font-semibold text-text-muted">
                  Live in-store
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-text-primary tracking-tight">
                {stats.activeCarts ?? 0}
              </div>
            </CardContent>
          </Card>

          {/* Fraud Alerts */}
          <Card className="border-brand-200 bg-brand-100 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between text-sm text-text-secondary">
                <span>🚨 Fraud Alerts</span>
                <span className="text-xs font-semibold text-text-muted">
                  {stats.fraudAlerts > 0 ? '⚠️ Attention' : 'All clear'}
                </span>
              </div>
              <div
                className={`mt-2 text-2xl font-bold tracking-tight ${
                  (stats.fraudAlerts || 0) > 0
                    ? 'text-red-600'
                    : 'text-text-primary'
                }`}
              >
                {stats.fraudAlerts ?? 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CHARTS & TOP PRODUCTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REVENUE CHART */}
        <Card className="lg:col-span-2 border-brand-200 bg-brand-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-text-primary">
              Orders today
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={hourlyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#D9CFC7"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="hour"
                    stroke="#6B6560"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#6B6560"
                    fontSize={12}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#D9CFC7',
                      borderRadius: 8,
                      fontSize: 12,
                      color: '#2D2D2D',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#C9B59C"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#C9B59C', strokeWidth: 1 }}
                    activeDot={{ r: 6, fill: '#C9B59C' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* TOP PRODUCTS */}
        <Card className="border-brand-200 bg-brand-100 shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-text-primary">
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topProductsList.map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-brand-200/60 last:border-b-0"
                >
                  <span
                    className="text-sm font-medium text-text-primary truncate pr-2"
                    title={product.productName}
                  >
                    {product.productName}
                  </span>
                  <span className="bg-brand-100 text-text-primary border border-brand-200 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0">
                    {product.totalQuantity} sold
                  </span>
                </div>
              ))}
            </CardContent>
          </div>
        </Card>
      </div>

      {/* LIVE FRAUD ALERTS FEED */}
      <Card className="border-brand-200 bg-brand-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold text-text-primary flex items-center gap-2">
            <span>Live Fraud Alerts Feed</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </CardTitle>

          <Link
            to="/alerts"
            className="text-xs font-semibold text-brand-accent hover:underline"
          >
            View all alerts →
          </Link>
        </CardHeader>

        <CardContent className="space-y-3">
          {liveAlerts.length === 0 ? (
            <p className="text-xs text-text-muted text-center py-6">
              No recent fraud alerts. Scales are fully calibrated.
            </p>
          ) : (
            liveAlerts.map((alert, index) => {
              const cartId =
                alert.cartId && typeof alert.cartId === 'string'
                  ? alert.cartId.slice(-6).toUpperCase()
                  : 'CART-9042';

              const severity = alert.severity || 'high';
              const diffGrams = alert.difference || 0;

              return (
                <div
                  key={alert._id || index}
                  className="bg-white rounded-lg p-3.5 border border-brand-200 border-l-4 border-l-red-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm text-text-primary">
                      Cart #{cartId}
                    </span>
                    <Badge
                      variant={
                        severity === 'high' ? 'destructive' : 'warning'
                      }
                      className="text-[11px] capitalize px-2 py-0.5"
                    >
                      {severity} Severity
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
                    <span>Weight difference:</span>
                    <span className="font-bold text-red-600">
                      +{diffGrams}g discrepancy
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
