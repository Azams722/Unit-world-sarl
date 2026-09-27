import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  PhoneCall, 
  Truck, 
  LayoutDashboard, 
  LogOut, 
  Bell,
  ChevronDown
} from 'lucide-react';
import { UnitworldLogo } from './UnitworldLogo';
import { CATEGORIES } from '../../data/initialProducts';
import { UserProfile, AppNotification } from '../../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenTracking: () => void;
  notifications: AppNotification[];
  brandLogoUrl?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenDashboard,
  onOpenAdmin,
  onSelectCategory,
  selectedCategory,
  searchQuery,
  onSearchChange,
  onOpenTracking,
  notifications,
  brandLogoUrl,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Utility Bar (Jumia Style) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Unitworld Official Escrow: 100% Verified Delivery
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
              Hotline: +234 800 UNITWORLD (0800 8648 967)
            </span>
          </div>

          <div className="flex items-center gap-5 text-slate-300">
            <button
              onClick={onOpenTracking}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5 text-sky-400" />
              Track Your Order
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Mobile menu toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <a href="/" className="flex items-center shrink-0">
              <UnitworldLogo logoUrl={brandLogoUrl} className="h-9 sm:h-11" showTagline={true} />
            </a>
          </div>

          {/* Search Bar (Jumia Center Style) */}
          <div className="hidden md:flex flex-1 max-w-2xl items-center relative">
            <div className="flex w-full items-center rounded-lg border-2 border-[#0284C7] focus-within:border-sky-500 overflow-hidden bg-white shadow-2xs">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search cars (Land Cruiser, Camry, Highlander), fashion sets, phones, groceries..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="pr-2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                >
                  Clear
                </button>
              )}
              <button 
                className="bg-[#0284C7] hover:bg-[#0369a1] text-white px-5 py-2.5 text-sm font-semibold transition-colors shrink-0"
              >
                SEARCH
              </button>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-slate-700 hover:text-[#0284C7] rounded-lg hover:bg-slate-100 transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Order & System Alerts</span>
                    <span className="text-[11px] text-sky-600">{notifications.length} alerts</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-3 text-center">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div key={n.id} className="p-2 bg-slate-50 rounded-lg text-xs border border-slate-100">
                          <p className="font-semibold text-slate-800">{n.title}</p>
                          <p className="text-slate-600 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account Dropdown */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-slate-100 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center font-bold text-xs uppercase border border-sky-200">
                      {currentUser.displayName ? currentUser.displayName.slice(0, 2) : 'UW'}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs font-semibold text-slate-900 leading-tight">
                        {currentUser.displayName || currentUser.email.split('@')[0]}
                      </p>
                      <p className="text-[11px] text-slate-500 capitalize">{currentUser.role}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-xs font-bold text-slate-900 truncate">{currentUser.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenDashboard();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        My Orders & Preferences
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenTracking();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Truck className="w-4 h-4 text-slate-500" />
                        Track Deliveries
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAdmin();
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-sky-700 bg-sky-50/60 hover:bg-sky-100 flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-4 h-4 text-sky-600" />
                          ERP Admin Portal
                        </button>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onSignOut();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-[#0284C7] hover:bg-[#0369a1] text-white py-2 px-3.5 rounded-lg font-semibold text-xs transition-colors shadow-2xs cursor-pointer relative"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-slate-900 text-[11px] font-black rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search input bar */}
        <div className="mt-2.5 md:hidden">
          <div className="flex w-full items-center rounded-lg border border-slate-300 focus-within:border-sky-500 bg-white overflow-hidden">
            <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Search vehicles, fashion, phones, raw foods..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full py-2 px-2.5 text-xs text-slate-900 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="pr-2 text-xs text-slate-400 font-semibold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop Jumia Department Strip) */}
      <div className="border-t border-slate-100 bg-slate-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center overflow-x-auto scrollbar-none py-1.5 gap-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0284C7] text-white shadow-2xs'
                    : 'text-slate-700 hover:text-[#0284C7] hover:bg-slate-200/60'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden backdrop-blur-xs flex">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <UnitworldLogo className="h-8" showTagline={false} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 border-b border-slate-100 space-y-2">
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full text-left px-3 py-2 bg-sky-50 text-[#0284C7] font-semibold text-xs rounded-lg flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  ERP Inventory & Orders Portal
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracking();
                }}
                className="w-full text-left px-3 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-2"
              >
                <Truck className="w-4 h-4" />
                Track Order
              </button>
            </div>

            <div className="pt-3">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                All Departments
              </h4>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      onSelectCategory(cat.name);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center justify-between ${
                      selectedCategory === cat.name
                        ? 'bg-[#0284C7] text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
