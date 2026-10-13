import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { OrderItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Estimate shipping: standard flat ₦3,500, free for items over ₦150k (except cars which has special logistics handling)
  const hasVehicle = items.some(i => i.category === 'Automobiles & Cars');
  const shippingFee = items.length === 0 ? 0 : hasVehicle ? 50000 : subtotal > 150000 ? 0 : 3500;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0284C7]" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight">
              My Shopping Cart ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Your Cart is Empty</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                Explore our showroom of verified cars, flat ₦25k fashion wear, phones, and groceries.
              </p>
              <button
                onClick={onClose}
                className="mt-2 py-2 px-4 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.productId}
                className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 relative group"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg bg-white shrink-0 border border-slate-200"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0 pr-6">
                  <div>
                    <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs font-extrabold text-slate-900 tabular-nums mt-0.5">
                      {formatCurrency(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                    <div className="flex items-center border border-slate-300 rounded-md bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, -1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-bold text-slate-700 tabular-nums">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.productId)}
                  className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  Estimated Delivery / Escrow
                </span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Payable</span>
                <span className="text-base sm:text-lg font-black text-slate-900 tabular-nums">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Unitworld Verified Escrow & Secure Checkout</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 px-4 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
