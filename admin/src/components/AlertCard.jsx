import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, CheckCircle, Scale, Clock } from 'lucide-react';

export const AlertCard = ({ alert, onResolve }) => {
  const isResolved = alert.resolved || alert.status === 'resolved';

  return (
    <Card className="border-brand-200 bg-brand-100/90 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isResolved
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  : 'bg-amber-100 text-amber-700 border border-amber-300'
              }`}
            >
              {isResolved ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-text-primary text-sm">
                  {alert.title || `Weight Mismatch on Cart #${alert.cartId?.slice(-6) || 'N/A'}`}
                </h4>
                <Badge variant={isResolved ? 'success' : 'warning'}>
                  {isResolved ? 'Resolved' : 'Action Required'}
                </Badge>
              </div>

              <p className="text-xs text-text-secondary mt-1">
                {alert.message || alert.reason || 'Sensor discrepancy detected between scale and scanned total.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" />
                  Expected: {alert.expectedWeight || 0}g • Sensor: {alert.sensorWeight || 0}g
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                </span>
              </div>
            </div>
          </div>

          {!isResolved && onResolve && (
            <Button
              size="sm"
              onClick={() => onResolve(alert._id)}
              className="bg-brand-accent hover:bg-[#b8a287] text-white text-xs h-8 rounded-lg shrink-0"
            >
              Mark Resolved
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertCard;
