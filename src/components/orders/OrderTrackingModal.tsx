import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PackageCheck, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Order } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialTrackingCode?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialTrackingCode = '',
}) => {
  const [searchCode, setSearchCode] = useState(initialTrackingCode);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    orders.length > 0 ? orders[0] : null
  );

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === searchCode.trim().toLowerCase() ||
        o.trackingNumber.toLowerCase() === searchCode.trim().toLowerCase()
    );
    if (found) {
      setSelectedOrder(found);
    } else {
      alert(`No order found matching "${searchCode}". Check your receipt.`);
    }
  };

  const stepsList = [
    { key: 'pending', label: 'Order Received' },
    { key: 'processing', label: 'Processing in ERP' },
    { key: 'shipped', label: 'Dispatched in Transit' },
    { key: 'out_for_delivery', label: 'Out with Courier' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const getStepIndex = (status: Order['orderStatus']) => {
    if (status === 'cancelled') return -1;
    return stepsList.findIndex(s => s.key === status);
  };

  const currentStepIdx = selectedOrder ? getStepIndex(selectedOrder.orderStatus) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#0284C7]" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight">
              Real-Time Order & Logistics Tracker
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Enter Order # (e.g. UW-2026-...) or Tracking Code"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="py-2 px-4 bg-[#0284C7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl transition-colors shrink-0"
            >
              Track Status
            </button>
          </form>

          {selectedOrder ? (
            <div className="space-y-6">
              {/* Order Meta Bar */}
              <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-100 flex flex-wrap justify-between items-center gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Order Number</span>
                  <span className="font-extrabold text-slate-900 font-mono text-sm">{selectedOrder.orderNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Tracking Code</span>
                  <span className="font-extrabold text-sky-700 font-mono text-sm">{selectedOrder.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Placed On</span>
                  <span className="font-semibold text-slate-800">{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Current Status</span>
                  <span className="font-extrabold uppercase px-2 py-0.5 rounded text-[11px] bg-sky-600 text-white">
                    {selectedOrder.orderStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Visual Step Timeline */}
              <div className="py-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Logistics Milestones
                </h3>

                <div className="relative">
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {stepsList.map((st, idx) => {
                      const isPast = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div key={st.key} className="flex flex-col items-center relative">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors z-10 ${
                              isCurrent
                                ? 'bg-sky-600 text-white ring-4 ring-sky-100 shadow-sm'
                                : isPast
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isPast && !isCurrent ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>
                          <span className={`text-[10px] sm:text-[11px] font-semibold mt-2 ${
                            isCurrent ? 'text-sky-700 font-bold' : isPast ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Real-time Tracking Events Log */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Live Milestone History
                </h3>

                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {selectedOrder.trackingUpdates && selectedOrder.trackingUpdates.length > 0 ? (
                    selectedOrder.trackingUpdates.map((step, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-slate-900">{step.label}</span>
                            <span className="text-[10px] text-slate-500">{formatDate(step.timestamp)}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">{step.location}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                      Order logged into system. Dispatch team is assigning routing.
                    </p>
                  )}
                </div>
              </div>

              {/* Items in this order */}
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Purchased Items ({selectedOrder.items.length})
                </h3>

                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg bg-white border border-slate-200 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                          <p className="text-slate-500 text-[11px]">Qty: {item.quantity} · {item.category}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address & Settlement Total */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Delivery Destination
                  </span>
                  <p className="font-bold text-slate-900">{selectedOrder.customerName}</p>
                  <p className="text-slate-600">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-slate-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                  <p className="text-slate-600 mt-1 font-mono">Tel: {selectedOrder.customerPhone}</p>
                </div>

                <div className="sm:text-right space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Settlement Summary
                  </span>
                  <div className="flex justify-between sm:justify-end gap-4 text-slate-600">
                    <span>Payment Gateway:</span>
                    <span className="font-bold uppercase text-emerald-700">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-4 text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-4 text-slate-600">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-4 text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total Amount:</span>
                    <span className="tabular-nums">{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <PackageCheck className="w-12 h-12 text-slate-400 mx-auto" />
              <p className="text-xs font-semibold">No order selected or recorded yet</p>
              <p className="text-[11px] text-slate-400">Place an order or enter your tracking code above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
