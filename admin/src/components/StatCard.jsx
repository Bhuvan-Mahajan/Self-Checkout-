import React from 'react';
import { Card, CardContent } from './ui/card';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'brand' }) => {
  return (
    <Card className="hover:shadow-md transition-shadow border-brand-200 bg-brand-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          {Icon && (
            <div className="w-10 h-10 rounded-xl bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent">
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="mt-3">
          <h3 className="text-2xl font-bold tracking-tight text-text-primary">{value}</h3>
          {(subtitle || trend) && (
            <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
              {trend && (
                <span className="font-semibold text-emerald-600">
                  {trend}
                </span>
              )}
              <span>{subtitle}</span>
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
