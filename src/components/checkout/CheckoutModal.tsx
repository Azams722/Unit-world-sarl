import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Banknote, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  Lock, 
  ChevronRight,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OrderItem, Order, UserProfile, PaymentMethod, GatewaySettings } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { generatePaystackReference } from '../../utils/paystack';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  currentUser: UserProfile | null;
  gatewaySettings: GatewaySettings;
  onOrderCompleted: (order: Order) => void;
  onOpenAuth: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currentUser,
  gatewaySettings,
  onOrderCompleted,
  onOpenAuth,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'paystack_sim' | 'success'>('details');
  const [deliveryMethod, setDeliveryMethod] = useState<'door_delivery' | 'pickup_station'>('door_delivery');
  const [fullName, setFullName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+234 ');
  const [street, setStreet] = useState(currentUser?.addresses?.[0]?.street || '');
  const [city, setCity] = useState(currentUser?.addresses?.[0]?.city || 'Lagos');
  const [state, setState] = useState(currentUser?.addresses?.[0]?.state || 'Lagos State');
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Paystack interactive simulation state
  const [paystackCardNumber, setPaystackCardNumber] = useState('4084 0834 1120 4920');
  const [paystackCardExpiry, setPaystackCardExpiry] = useState('08/28');
  const [paystackCardCvv, setPaystackCardCvv] = useState('583');
  const [paystackCardPin, setPaystackCardPin] = useState('1234');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const hasVehicle = items.some(i => i.category === 'Automobiles & Cars');
  const shippingFee = deliveryMethod === 'pickup_station' ? 0 : hasVehicle ? 50000 : subtotal > 150000 ? 0 : 3500;
  const grandTotal = subtotal + shippingFee;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || (!street && deliveryMethod === 'door_delivery')) {
      alert('Please fill in your delivery contact and address details.');
      return;
    }
    setStep('payment');
  };

  const handleFinalizeOrder = async (paystackRef?: string) => {
    setIsProcessing(true);

    try {
      const orderNum = `UW-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const trkNum = `UW-TRK-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date().toISOString();

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        userId: currentUser?.uid || 'guest-user',
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: {
          fullName,
          phone,
          street: deliveryMethod === 'pickup_station' ? 'Unitworld Logistics Hub (Lagos Island Hub)' : street,
          city,
          state,
          deliveryMethod,
        },
        items: [...items],
        subtotal,
        shippingFee,
        totalAmount: grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
        paystackReference: paystackRef || (paymentMethod === 'paystack' ? generatePaystackReference() : undefined),
        orderStatus: 'processing',
        trackingNumber: trkNum,
        trackingUpdates: [
          {
            status: 'pending',
            label: 'Order Placed & Payment Confirmed',
            timestamp: now,
            location: 'Unitworld Sarl Central Commerce Platform',
            completed: true,
          },
          {
            status: 'processing',
            label: 'Order Processing & Warehouse Allocation',
            timestamp: now,
            location: 'Unitworld Operations Hub, Lagos',
            completed: true,
          }
        ],
        createdAt: now,
        updatedAt: now,
      };

      setCreatedOrder(newOrder);
      onOrderCompleted(newOrder);
      setStep('success');

      // Confetti burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Order creation error:', err);
      alert('Could not record order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#0284C7]" />
            <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight">
              Unitworld Secure Checkout
            </h2>
          </div>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step 1: Delivery Address & Contact Details */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="p-5 sm:p-6 space-y-4">
            {!currentUser && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-sky-900 font-medium">Already have a Unitworld account?</span>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="font-bold text-[#0284C7] hover:underline"
                >
                  Sign In for 1-Click Checkout
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Delivery Option
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('door_delivery')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    deliveryMethod === 'door_delivery'
                      ? 'border-[#0284C7] bg-sky-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#0284C7]" />
                    Door Delivery
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Direct to your doorstep or verified inspection lot</p>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup_station')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    deliveryMethod === 'pickup_station'
                      ? 'border-[#0284C7] bg-sky-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Pickup Station (Free)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Pick up at Unitworld Central Depot / Showroom</p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Babatunde Adeleke"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (for Receipt) *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Telephone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+234 801 234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State / Region</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {deliveryMethod === 'door_delivery' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address & Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="House number, street, nearby landmark (e.g. Near Igando Bus Stop)"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>
            )}

            {/* Summary Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-500">Order Items: </span>
                <span className="font-bold text-slate-800">{items.length} items</span>
              </div>
              <div>
                <span className="text-slate-500">Total: </span>
                <span className="font-black text-slate-900 tabular-nums text-sm">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Continue to Payment Selection</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Payment Gateway Selection */}
        {step === 'payment' && (
          <div className="p-5 sm:p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Select Payment Gateway
            </h3>

            <div className="space-y-3">
              {/* Option 1: Paystack */}
              <label 
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'paystack'
                    ? 'border-[#0284C7] bg-sky-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'paystack'}
                  onChange={() => setPaymentMethod('paystack')}
                  className="mt-1 text-sky-600 focus:ring-sky-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#0284C7]" />
                      Paystack Secure Gateway
                    </span>
                    <span className="text-[10px] font-extrabold bg-[#00C3F7]/20 text-[#0089AF] px-2 py-0.5 rounded">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Pay securely using Debit/Credit Card (Mastercard, Visa, Verve), Bank Transfer, or USSD via Paystack.
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    Gateway Key: {gatewaySettings.paystackPublicKey ? `${gatewaySettings.paystackPublicKey.substring(0, 14)}...` : 'Configured'}
                  </p>
                </div>
              </label>

              {/* Option 2: Direct Bank Settlement / Escrow Wire */}
              <label 
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#0284C7] bg-sky-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="mt-1 text-sky-600 focus:ring-sky-500"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Direct Bank Settlement / Wire Transfer
                  </span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Ideal for vehicles and large corporate purchases. Wire funds directly to Unitworld GTBank Escrow Account.
                  </p>
                  {paymentMethod === 'bank_transfer' && (
                    <div className="mt-2 p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1 font-mono">
                      <p className="font-semibold text-slate-800">Bank: {gatewaySettings.bankAccountDetails.bankName}</p>
                      <p className="text-slate-700">Account Name: {gatewaySettings.bankAccountDetails.accountName}</p>
                      <p className="text-sky-700 font-bold">Account No: {gatewaySettings.bankAccountDetails.accountNumber}</p>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: Pay on Delivery (for groceries / apparel) */}
              <label 
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-[#0284C7] bg-sky-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="mt-1 text-sky-600 focus:ring-sky-500"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-amber-600" />
                    Pay on Delivery (Jumia COD Standard)
                  </span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Pay with Cash or POS upon physical inspection at delivery. (Available for eligible items).
                  </p>
                </div>
              </label>
            </div>

            {/* Total Breakdown */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery & Logistics</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total to Pay</span>
                <span className="text-base font-black text-slate-900 tabular-nums">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="py-2.5 px-4 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  if (paymentMethod === 'paystack') {
                    setStep('paystack_sim');
                  } else {
                    handleFinalizeOrder();
                  }
                }}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Transaction...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pay {formatCurrency(grandTotal)} Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Interactive Paystack Modal Bridge */}
        {step === 'paystack_sim' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="p-3 bg-sky-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-sky-300 font-mono">PAYSTACK POPUP SECURE CHECKOUT</p>
                <p className="text-xs font-bold">{fullName} · {email}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-sky-300 font-mono">AMOUNT DUE</p>
                <p className="text-base font-black text-amber-400 tabular-nums">{formatCurrency(grandTotal)}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-sky-600" />
                  Card Payment Simulation
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  256-Bit SSL
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  value={paystackCardNumber}
                  onChange={(e) => setPaystackCardNumber(e.target.value)}
                  className="w-full py-2 px-3 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Valid Thru</label>
                  <input
                    type="text"
                    value={paystackCardExpiry}
                    onChange={(e) => setPaystackCardExpiry(e.target.value)}
                    className="w-full py-2 px-3 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={paystackCardCvv}
                    onChange={(e) => setPaystackCardCvv(e.target.value)}
                    className="w-full py-2 px-3 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Card PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={paystackCardPin}
                    onChange={(e) => setPaystackCardPin(e.target.value)}
                    className="w-full py-2 px-3 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500 bg-white"
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-500 italic">
                * You can test with these demo values or input your card. Click below to verify and complete transaction.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="py-2.5 px-4 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleFinalizeOrder(generatePaystackReference())}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying with Paystack...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize Paystack Payment ({formatCurrency(grandTotal)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Order Completed Successfully */}
        {step === 'success' && createdOrder && (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Order Confirmed Successfully!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your order is now being processed by the Unitworld logistics and ERP team.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Reference:</span>
                <span className="font-bold text-slate-900">{createdOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Code:</span>
                <span className="font-bold text-sky-700">{createdOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="font-bold text-emerald-700 uppercase">{createdOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Settled:</span>
                <span className="font-extrabold text-slate-900 tabular-nums">
                  {formatCurrency(createdOrder.totalAmount)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-md"
              >
                Track Order & View Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
