import React from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Truck, 
  Car, 
  Shirt, 
  ShoppingBag, 
  Smartphone,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Printer
} from 'lucide-react';

interface RefundPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RefundPolicyModal: React.FC<RefundPolicyModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-title"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="policy-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Refund & Cancellation Policy</span>
                <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                  Official Terms
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Unitworld Sarl Official Direct Store & Dealership • Effective 2025/2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1.5 hidden sm:flex"
              title="Print Policy"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close policy"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {/* PRIMARY NOTICE BANNER - GOODS IN GOOD SHAPE DISCLOSURE */}
          <div className="bg-rose-50 border-2 border-rose-500/80 rounded-2xl p-4 sm:p-5 text-rose-950 shadow-xs space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <h3 className="text-sm sm:text-base font-black text-rose-900 tracking-tight uppercase">
                  Important Notice: Goods Delivered in Good Condition Are Non-Refundable
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-rose-800 leading-relaxed">
                  Goods, vehicles, electronics, luxury fashion items, and foodstuffs delivered in good physical and operational shape, matching order specifications and confirmed upon handover or physical inspection, 
                  <span className="font-black text-rose-950 underline ml-1">WILL NOT BE ACCEPTED FOR RETURN, REFUND, OR EXCHANGE.</span>
                </p>
                <p className="text-xs text-rose-700 pt-1">
                  By completing an order or confirming a purchase on Unitworld Sarl, the buyer expressly acknowledges and agrees that acceptance of delivered goods in undamaged condition constitutes final sale and complete satisfaction of the purchase agreement.
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Physical Inspection on Delivery */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 border-b border-slate-200 pb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. Mandatory Physical Inspection at Point of Delivery</span>
            </h4>
            <p>
              To protect both buyers and Unitworld Sarl, every customer is granted the right and strict obligation to conduct a comprehensive physical inspection of the ordered merchandise at the immediate point of doorstep handover or warehouse dispatch exit.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li><strong>Live Examination:</strong> Customers must examine outer packaging, seal integrity, product finish, color, sizing, model specs, and operational status before the logistics courier or delivery driver departs.</li>
              <li><strong>Right of Immediate Rejection:</strong> If any item arrives damaged, flawed, incorrect, or demonstrably inconsistent with your order receipt, you must decline delivery on the spot.</li>
              <li><strong>Conclusive Handover:</strong> Affixing your signature to the physical waybill, confirming delivery via customer PIN/OTP, or accepting handover from the dispatch officer signifies that the item was received intact, complete, and in 100% satisfactory condition.</li>
            </ul>
          </div>

          {/* Section 2: Order Cancellation Policy */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 border-b border-slate-200 pb-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <span>2. Order Cancellation Windows</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
                <span className="font-bold text-emerald-900 block">A. Cancellation BEFORE Dispatch (Eligible)</span>
                <p className="text-emerald-800">
                  Orders that remain in <em>Pending</em> or <em>Processing</em> status and have not yet been boarded onto a delivery vehicle or custom-cleared can be cancelled free of charge. Contact our support desk immediately with your Order ID.
                </p>
              </div>

              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                <span className="font-bold text-amber-900 block">B. Cancellation AFTER Dispatch (Ineligible / Surcharge)</span>
                <p className="text-amber-800">
                  Once an order reaches <em>Dispatched</em>, <em>In Transit</em>, or <em>Out for Delivery</em> status, transit logistics fees and mobilization insurance cannot be refunded. Cancellation at this stage incurs two-way freight charges.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Category-Specific Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 border-b border-slate-200 pb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>3. Departmental & Category-Specific Rules</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Automobiles */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Car className="w-4 h-4 text-sky-600" />
                  <span>Automobiles & Motors</span>
                </div>
                <p className="text-slate-600">
                  All Tokunbo and registered vehicles undergo pre-purchase showroom inspection in Victoria Island or Ikeja GRA. Once the vehicle title, customs exit papers, and keys are handed over following your mechanical inspection, no return or refund is permitted.
                </p>
              </div>

              {/* Fashion & Wigs */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Shirt className="w-4 h-4 text-pink-600" />
                  <span>Fashion, Wigs & Apparel</span>
                </div>
                <p className="text-slate-600">
                  Due to hygiene standards and bespoke sizing, fashion sets (including our flat ₦25,000 designer sets) and luxury virgin hair wigs cannot be refunded once delivered and unsealed in sound condition. Check size charts prior to checkout.
                </p>
              </div>

              {/* Supermarket & Farm Produce */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>Supermarket & Raw Foods</span>
                </div>
                <p className="text-slate-600">
                  Agricultural produce including bags of rice, yam tubers, palm oil, and fresh grocery packs are perishable. Inspect freshness upon delivery. Once received in good shape, perishable items are strictly non-refundable.
                </p>
              </div>

              {/* Electronics & Phones */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <span>Phones, Laptops & Smart Tech</span>
                </div>
                <p className="text-slate-600">
                  Factory-sealed devices, smartphones, and laptops cannot be returned after the original tamper-evident seals are broken unless verified as Dead-On-Arrival (DOA) by our certified technical diagnostics team within 24 hours of delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Valid Exceptions & Claims Protocol */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 border-b border-slate-200 pb-2">
              <Truck className="w-4 h-4 text-slate-700" />
              <span>4. Claims Protocol for Incomplete or Defective Shipments</span>
            </h4>
            <p>
              In the exceptional circumstance that an order arrives with demonstrable transit damage or wrong contents:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1">
              <li><strong>Do Not Accept or Sign:</strong> Reject the parcel immediately and write "Damaged / Incorrect Item" on the dispatch manifest.</li>
              <li><strong>Photographic Proof:</strong> Take high-resolution photos and an unboxing video displaying the courier tracking slip and the defect clearly.</li>
              <li><strong>Notify Within 24 Hours:</strong> Submit your claim along with your Order ID to our VIP resolution desk at <span className="font-mono font-bold text-sky-700">support@unit-world-sarl.com</span> or via WhatsApp.</li>
              <li><strong>Remedy:</strong> Following verification, Unitworld will issue an immediate replacement shipment at zero additional courier cost, or offer Unitworld store credit.</li>
            </ol>
          </div>

          {/* Section 5: Legal & Regulatory Framework */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-800">
              Regulatory Jurisdiction & Direct Retail Terms
            </p>
            <p>
              Unitworld Sarl operates exclusively as a direct retailer and dealership selling its own inventory. All buyer payments are made directly to Unitworld Sarl; we do not sell on behalf of third-party vendors and do not provide escrow or intermediary services. This policy is executed in conformity with the Federal Competition and Consumer Protection Act (FCCPA) and Nigerian Commercial Sales of Goods Laws.
            </p>
          </div>

          {/* Contact & Support Desk */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h5 className="font-bold text-sky-950 text-xs sm:text-sm">Need Help with an Ongoing Order?</h5>
              <p className="text-xs text-sky-800">
                Our customer care officers and logistics dispatch supervisors are available 24/7.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-700 pt-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                  +234 800 UNITWORLD (0800 8648 967)
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  support@unit-world-sarl.com
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  Victoria Island, Lagos
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              I Understand & Agree
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Unitworld Sarl • Consumer Protection & Transparency</span>
          <button
            onClick={onClose}
            className="text-slate-700 hover:text-slate-900 font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
