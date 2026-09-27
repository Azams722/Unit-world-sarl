import React from 'react';
import { Bell, CheckCircle2, Truck, AlertCircle, X } from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationToastProps {
  notification: AppNotification | null;
  onDismiss: () => void;
  onClick?: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onDismiss,
  onClick,
}) => {
  if (!notification) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-slate-700 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30">
          {notification.type === 'order' ? (
            <Truck className="w-5 h-5 text-sky-400" />
          ) : notification.type === 'inventory' ? (
            <AlertCircle className="w-5 h-5 text-amber-400" />
          ) : (
            <Bell className="w-5 h-5 text-emerald-400" />
          )}
        </div>

        <div className="flex-1 min-w-0" onClick={onClick}>
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{notification.title}</h4>
            <span className="text-[10px] text-slate-400">Just now</span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-snug">{notification.message}</p>
          <p className="text-[10px] text-sky-400 font-semibold mt-1.5 cursor-pointer hover:underline">
            Tap to view in ERP tracker →
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
