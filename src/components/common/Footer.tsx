import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock } from 'lucide-react';
import { UnitworldLogo } from './UnitworldLogo';

interface FooterProps {
  logoUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({ logoUrl }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Trust Pillars Strip */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-900/50 text-sky-400 flex items-center justify-center shrink-0 border border-sky-800/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">100% Verified Escrow</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Physical inspection before final settlement</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-900/50 text-sky-400 flex items-center justify-center shrink-0 border border-sky-800/50">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Nationwide Dispatch</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Door delivery across all 36 states</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-900/50 text-sky-400 flex items-center justify-center shrink-0 border border-sky-800/50">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Paystack Secured</p>
              <p className="text-slate-400 text-[11px] mt-0.5">PCI-DSS Level 1 bank encryption</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-900/50 text-sky-400 flex items-center justify-center shrink-0 border border-sky-800/50">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Dedicated Support</p>
              <p className="text-slate-400 text-[11px] mt-0.5">Direct hotline & WhatsApp VIP desk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <UnitworldLogo logoUrl={logoUrl} className="h-10" inverted={true} />
            <p className="text-xs text-slate-400 leading-relaxed">
              Unitworld Sarl is Africa's trusted global marketplace and automotive dealership network. Providing verified vehicles, designer fashion, mobile tech, and essential raw foods with integrated ERP logistics and Paystack settlement.
            </p>
            <p className="text-xs text-slate-400">
              Showrooms in Victoria Island, Ikeja GRA, and Igando, Lagos, Nigeria.
            </p>
          </div>

          {/* Buying & Selling */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Automobiles & Heavy Motors
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Toyota Land Cruiser 2025 VXR</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Toyota Highlander XSE (Custom Exit 2026)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Toyota Camry 2010 (Moscow AC Standard)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Lexus RX350 F-Sport Firstbody</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Vehicle Inspection Booking</span></li>
            </ul>
          </div>

          {/* Department Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Marketplace Departments
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Fashion Hub (Flat ₦25,000 Sets)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Supermarket & Raw Foods (Rice, Yam, Palm Oil)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Phones & Tablets (iPhone 16 Pro Max, S24)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Electronics & Smart TVs</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Computing & Laptops</span></li>
            </ul>
          </div>

          {/* Payments & Escrow */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Payment & Security
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              We process secure card and direct transfer transactions via Paystack and GTBank Escrow settlements.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold font-mono">
              <span className="bg-slate-800 text-sky-400 px-2 py-1 rounded border border-slate-700">PAYSTACK</span>
              <span className="bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700">MASTERCARD</span>
              <span className="bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700">VISA</span>
              <span className="bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700">VERVE</span>
              <span className="bg-slate-800 text-amber-400 px-2 py-1 rounded border border-slate-700">GTBANK WIRE</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Unitworld Sarl. All rights reserved. Global Marketplace & ERP.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>Escrow & Inspection Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
