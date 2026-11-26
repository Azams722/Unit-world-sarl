import React from 'react';
import { Home, LayoutGrid, ShoppingCart, User, Wrench } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'home' | 'categories' | 'services' | 'cart' | 'account';
  onSelectTab: (tab: 'home' | 'categories' | 'services' | 'cart' | 'account') => void;
  cartCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 md:hidden py-1.5 px-2 flex items-center justify-around shadow-lg">
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center p-1 text-[10px] font-bold transition-colors ${
          currentTab === 'home' ? 'text-[#0284C7]' : 'text-slate-500'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onSelectTab('categories')}
        className={`flex flex-col items-center p-1 text-[10px] font-bold transition-colors ${
          currentTab === 'categories' ? 'text-[#0284C7]' : 'text-slate-500'
        }`}
      >
        <LayoutGrid className="w-5 h-5 mb-0.5" />
        <span>Shop</span>
      </button>

      <button
        onClick={() => onSelectTab('services')}
        className={`flex flex-col items-center p-1 text-[10px] font-bold transition-colors ${
          currentTab === 'services' ? 'text-[#0284C7]' : 'text-slate-500'
        }`}
      >
        <Wrench className="w-5 h-5 mb-0.5" />
        <span>Services</span>
      </button>

      <button
        onClick={() => onSelectTab('cart')}
        className={`flex flex-col items-center p-1 text-[10px] font-bold transition-colors relative ${
          currentTab === 'cart' ? 'text-[#0284C7]' : 'text-slate-500'
        }`}
      >
        <ShoppingCart className="w-5 h-5 mb-0.5" />
        <span>Cart</span>
        {cartCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onSelectTab('account')}
        className={`flex flex-col items-center p-1 text-[10px] font-bold transition-colors ${
          currentTab === 'account' ? 'text-[#0284C7]' : 'text-slate-500'
        }`}
      >
        <User className="w-5 h-5 mb-0.5" />
        <span>Account</span>
      </button>
    </nav>
  );
};
