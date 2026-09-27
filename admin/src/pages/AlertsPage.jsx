import React, { useEffect, useState, useRef } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { useToast } from '../components/ui/toast';
import api from '../services/api';
import socket from '../services/socket';
import { AlertTriangle, CheckCircle, Scale, ShieldAlert, Clock } from 'lucide-react';

export const AlertsPage = () => {
  const [filter, setFilter] = useState('unresolved'); // 'all' | 'unresolved' | 'resolved'
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedIds, setHighlightedIds] = useState(new Set());

  // Resolve Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const highlightTimersRef = useRef({});

  // Fallback demo alerts if backend returns none
  const demoAlerts = [
    {
      _id: 'alt-101',
      cartId: 'CART-6AA10A',
      userId: { name: 'Bhuvan', phone: '9876543211' },
      expectedWeight: 500,
      sensorWeight: 850,
      difference: 350,
      severity: 'HIGH',
      resolved: false,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'alt-102',
      cartId: 'CART-9042B1',
      userId: { name: 'Priya Sharma', phone: '9123456780' },
      expectedWeight: 1000,
      sensorWeight: 1150,
      difference: 150,
      severity: 'MEDIUM',
      resolved: false,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      _id: 'alt-103',
      cartId: 'CART-3301F2',
      userId: { name: 'Kiran Kumar', phone: '9811223344' },
      expectedWeight: 200,
      sensorWeight: 230,
      difference: 30,
      severity: 'LOW',
      resolved: true,
      resolutionNote: 'Scale re-zeroed at turnstile audit station.',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];

  // Fetch alerts from backend based on filter
  const fetchAlerts = async (selectedFilter) => {
    setLoading(true);
    try {
      let queryParam = 'resolved=false';
      if (selectedFilter === 'all') queryParam = 'resolved=all';
      if (selectedFilter === 'resolved') queryParam = 'resolved=true';

      const res = await api.get(`/api/admin/alerts?${queryParam}`);
      if (res?.alerts && res.alerts.length > 0) {
        setAlerts(res.alerts);
      } else {
        // Filter demo items if backend has no database alerts
        const filtered = demoAlerts.filter((a) => {
          if (selectedFilter === 'unresolved') return !a.resolved;
          if (selectedFilter === 'resolved') return a.resolved;
          return true;
        });
        setAlerts(filtered);
      }
    } catch (err) {
      console.warn('API error, displaying fallback alerts:', err.message);
      const filtered = demoAlerts.filter((a) => {
        if (selectedFilter === 'unresolved') return !a.resolved;
        if (selectedFilter === 'resolved') return a.resolved;
        return true;
      });
      setAlerts(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts(filter);
  }, [filter]);

  // Real-time socket 'fraud-alert' listener
  useEffect(() => {
    const handleNewAlert = (newAlert) => {
      const alertId = newAlert._id || 'alert-' + Date.now();
      const formattedAlert = {
        ...newAlert,
        _id: alertId,
        severity: (newAlert.severity || 'HIGH').toUpperCase(),
        difference: newAlert.difference || 250,
        expectedWeight: newAlert.expectedWeight || 400,
        sensorWeight: newAlert.sensorWeight || 650,
        resolved: false,
        createdAt: newAlert.createdAt || new Date().toISOString(),
      };

      // Prepend to alerts list
      setAlerts((prev) => [formattedAlert, ...prev]);

      // Highlight new alert with visual red fade
      setHighlightedIds((prev) => new Set([...prev, alertId]));

      if (highlightTimersRef.current[alertId]) {
        clearTimeout(highlightTimersRef.current[alertId]);
      }
      highlightTimersRef.current[alertId] = setTimeout(() => {
        setHighlightedIds((prev) => {
          const updated = new Set(prev);
          updated.delete(alertId);
          return updated;
        });
        delete highlightTimersRef.current[alertId];
      }, 3000);

      // Toast notification
      toast({
        title: `🚨 New fraud alert — ${formattedAlert.severity}`,
        description: `Cart #${String(formattedAlert.cartId || alertId).slice(-6).toUpperCase()} flagged with +${formattedAlert.difference}g discrepancy.`,
        variant: 'destructive',
      });
    };

    socket.on('fraud-alert', handleNewAlert);

    return () => {
      socket.off('fraud-alert', handleNewAlert);
      Object.values(highlightTimersRef.current).forEach(clearTimeout);
    };
  }, [toast]);

  // Open Resolve Modal
  const openResolveDialog = (alert) => {
    setSelectedAlert(alert);
    setResolutionNote('');
    setIsDialogOpen(true);
  };

  // Confirm Resolve Alert
  const handleConfirmResolve = async () => {
    if (!selectedAlert) return;
    setIsSubmitting(true);

    const alertId = selectedAlert._id;
    try {
      try {
        await api.patch(`/api/admin/alerts/${alertId}/resolve`, { resolutionNote });
      } catch (err) {
        // Fallback to standard patch route
        await api.patch(`/api/admin/alerts/${alertId}`, { resolutionNote });
      }

      // Update in local state
      setAlerts((prev) =>
        prev.map((a) =>
          a._id === alertId
            ? { ...a, resolved: true, resolutionNote, resolvedAt: new Date().toISOString() }
            : a
        )
      );

      toast({
        title: 'Alert resolved',
        description: `Cart #${String(selectedAlert.cartId || alertId).slice(-6).toUpperCase()} has been cleared.`,
        variant: 'success',
      });

      setIsDialogOpen(false);
      setSelectedAlert(null);
      setResolutionNote('');
    } catch (err) {
      toast({
        title: 'Resolution Failed',
        description: err.message || 'Could not resolve alert',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityBadge = (severity) => {
    const sev = String(severity || '').toUpperCase();
    switch (sev) {
      case 'LOW':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
            LOW
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            MEDIUM
          </span>
        );
      case 'HIGH':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            HIGH
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                Fraud Alerts
              </h1>
              {/* Live Badge with pulsing red dot */}
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>Live</span>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Real-time load-cell weight discrepancy surveillance
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-brand-100 p-1 rounded-xl border border-brand-200 self-start sm:self-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'unresolved', label: 'Unresolved' },
            { id: 'resolved', label: 'Resolved' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === btn.id
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'bg-brand-100 text-text-primary hover:bg-brand-200/50'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* ALERTS TABLE */}
      <Card className="border-brand-200 bg-brand-100 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-brand-200/50">
              <TableRow>
                <TableHead className="font-semibold text-xs text-text-primary">Time</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Customer</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Cart ID</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Expected</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Actual</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Difference</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Severity</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary">Status</TableHead>
                <TableHead className="font-semibold text-xs text-text-primary text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-xs text-text-muted">
                    Loading security alerts...
                  </TableCell>
                </TableRow>
              ) : alerts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-xs text-text-muted">
                    No fraud alerts found for the selected filter.
                  </TableCell>
                </TableRow>
              ) : (
                alerts.map((alert) => {
                  const alertId = alert._id || 'alt';
                  const isHighlighted = highlightedIds.has(alertId);
                  const isResolved = Boolean(alert.resolved);

                  // Formatting fields
                  const timeFormatted = alert.createdAt
                    ? new Date(alert.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })
                    : 'Recent';

                  const customerName = alert.userId?.name || 'Shopper';
                  const customerPhone = alert.userId?.phone ? ` • ${alert.userId.phone}` : '';
                  const shortCartId = String(alert.cartId?._id || alert.cartId || alertId)
                    .slice(-6)
                    .toUpperCase();

                  const diff = alert.difference != null
                    ? alert.difference
                    : (alert.sensorWeight || 0) - (alert.expectedWeight || 0);

                  return (
                    <TableRow
                      key={alertId}
                      className={`transition-colors duration-1000 ${
                        isHighlighted
                          ? 'bg-red-100/80 hover:bg-red-100'
                          : 'hover:bg-brand-50/50'
                      }`}
                    >
                      {/* Time */}
                      <TableCell className="text-xs text-text-secondary whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-text-muted" />
                          {timeFormatted}
                        </span>
                      </TableCell>

                      {/* Customer */}
                      <TableCell className="text-xs text-text-primary font-medium">
                        {customerName}
                        <span className="text-text-muted text-[11px] block">{customerPhone}</span>
                      </TableCell>

                      {/* Cart ID */}
                      <TableCell className="font-mono text-xs text-text-primary font-semibold">
                        #{shortCartId}
                      </TableCell>

                      {/* Expected */}
                      <TableCell className="text-xs text-text-secondary">
                        {alert.expectedWeight || 0}g
                      </TableCell>

                      {/* Actual */}
                      <TableCell className="text-xs text-text-secondary font-medium">
                        {alert.sensorWeight || 0}g
                      </TableCell>

                      {/* Difference */}
                      <TableCell className="text-xs font-semibold">
                        <span className={diff > 0 ? 'text-red-600 font-bold' : 'text-text-primary'}>
                          {diff > 0 ? `+${diff}g` : `${diff}g`}
                        </span>
                      </TableCell>

                      {/* Severity */}
                      <TableCell>{getSeverityBadge(alert.severity)}</TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant={isResolved ? 'success' : 'warning'}>
                          {isResolved ? 'Resolved' : 'Unresolved'}
                        </Badge>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right">
                        {!isResolved ? (
                          <Button
                            size="sm"
                            onClick={() => openResolveDialog(alert)}
                            className="bg-brand-accent hover:bg-[#b8a287] text-white text-xs h-7 px-3 rounded-lg font-medium"
                          >
                            Resolve
                          </Button>
                        ) : (
                          <span className="text-xs text-emerald-700 font-medium inline-flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Cleared
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* RESOLVE FLOW DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-accent" /> Resolve Security Alert
            </DialogTitle>
            <DialogDescription className="text-xs text-text-secondary">
              Record staff intervention and audit notes to unlock the customer&apos;s cart checkout turnstile.
            </DialogDescription>
          </DialogHeader>

          {selectedAlert && (
            <div className="space-y-4 py-2">
              {/* Alert Quick Summary */}
              <div className="bg-brand-100 p-3.5 rounded-xl border border-brand-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Cart Reference:</span>
                  <span className="font-bold text-text-primary">
                    #{String(selectedAlert.cartId?._id || selectedAlert.cartId || selectedAlert._id).slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Discrepancy:</span>
                  <span className="font-bold text-red-600">
                    +{selectedAlert.difference || 0}g on load cell
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Severity:</span>
                  <span>{getSeverityBadge(selectedAlert.severity)}</span>
                </div>
              </div>

              {/* Resolution Note Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-primary">
                  Staff Resolution Note
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Verified shopper bag weight. Scanned missing item #8901234567890."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full p-3 rounded-lg border border-brand-200 bg-white text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="text-xs h-9 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmResolve}
              disabled={isSubmitting}
              className="bg-brand-accent hover:bg-[#b8a287] text-white text-xs h-9 rounded-xl font-semibold"
            >
              {isSubmitting ? 'Clearing Alert...' : 'Mark Resolved'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlertsPage;
