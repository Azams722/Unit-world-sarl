import React, { useState } from 'react';
import { 
  X, 
  User, 
  Package, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  Truck, 
  Check, 
  Plus, 
  Trash2, 
  KeyRound,
  ExternalLink,
  Lock
} from 'lucide-react';
import { UserProfile, Order, UserAddress } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface CustomerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  orders: Order[];
  onUpdateProfile: (updated: UserProfile) => void;
  onTrackOrder: (order: Order) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  isOpen,
  onClose,
  user,
  orders,
  onUpdateProfile,
  onTrackOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'security' | 'preferences'>('orders');

  // Address form
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Lagos');
  const [newState, setNewState] = useState('Lagos State');
  const [newPhone, setNewPhone] = useState(user.phone || '');
  const [showAddAddress, setShowAddAddress] = useState(false);

  // Security
  const [mfaActive, setMfaActive] = useState(user.mfaEnabled);

  // Preferences
  const [emailAlerts, setEmailAlerts] = useState(user.preferences.emailNotifications);
  const [smsAlerts, setSmsAlerts] = useState(user.preferences.smsNotifications);
  const [whatsappAlerts, setWhatsappAlerts] = useState(user.preferences.whatsappAlerts);

  if (!isOpen) return null;

  const userOrders = orders.filter(
    (o) => o.userId === user.uid || o.customerEmail.toLowerCase() === user.email.toLowerCase()
  );

  const handleSavePreferences = () => {
    const updated: UserProfile = {
      ...user,
      mfaEnabled: mfaActive,
      preferences: {
        ...user.preferences,
        emailNotifications: emailAlerts,
        smsNotifications: smsAlerts,
        whatsappAlerts: whatsappAlerts,
      },
    };
    onUpdateProfile(updated);
    alert('Account settings & preferences updated successfully.');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet) return;
    const newAddr: UserAddress = {
      id: `addr-${Date.now()}`,
      fullName: user.displayName || user.email.split('@')[0],
      phone: newPhone || '+234 800 000 0000',
      street: newStreet,
      city: newCity,
      state: newState,
      isDefault: user.addresses.length === 0,
    };
    const updated: UserProfile = {
      ...user,
      addresses: [...user.addresses, newAddr],
    };
    onUpdateProfile(updated);
    setNewStreet('');
    setShowAddAddress(false);
  };

  const handleRemoveAddress = (addrId: string) => {
    const updated: UserProfile = {
      ...user,
      addresses: user.addresses.filter(a => a.id !== addrId),
    };
    onUpdateProfile(updated);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center font-black text-sm border border-sky-200">
              {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'UW'}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                {user.displayName || 'Customer Account'}
              </h2>
              <p className="text-xs text-slate-500 font-mono">{user.email} · {user.role.toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-4 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#0284C7] text-[#0284C7]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'addresses'
                ? 'border-[#0284C7] text-[#0284C7]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Address Book ({user.addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'border-[#0284C7] text-[#0284C7]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Security & 2FA</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'preferences'
                ? 'border-[#0284C7] text-[#0284C7]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Alert Preferences</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Tab 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {userOrders.length === 0 ? (
                <div className="text-center py-10 space-y-2 text-slate-500">
                  <Package className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-bold text-slate-700">No Orders Placed Yet</p>
                  <p className="text-[11px]">When you purchase vehicles, fashion items, or groceries, track them here.</p>
                </div>
              ) : (
                userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                      <div>
                        <span className="font-mono font-bold text-slate-900 text-sm">{ord.orderNumber}</span>
                        <span className="text-slate-400 text-[11px] block">{formatDate(ord.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-sky-100 text-sky-800">
                          {ord.orderStatus.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                          {ord.paymentStatus} ({ord.paymentMethod})
                        </span>
                      </div>
                    </div>

                    {/* Order items preview */}
                    <div className="space-y-1.5">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-slate-700">
                          <span className="truncate max-w-xs font-medium">
                            {item.quantity}x {item.title}
                          </span>
                          <span className="font-mono font-bold text-slate-900">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200/80">
                      <div>
                        <span className="text-[11px] text-slate-500">Total Settled: </span>
                        <span className="font-extrabold text-slate-900 text-sm tabular-nums">
                          {formatCurrency(ord.totalAmount)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onTrackOrder(ord);
                        }}
                        className="py-1.5 px-3 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Delivery</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 2: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600">Saved shipping locations for fast checkout</p>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="py-1.5 px-3 bg-sky-50 text-[#0284C7] hover:bg-sky-100 border border-sky-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddAddress ? 'Cancel' : 'Add New Address'}</span>
                </button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="p-4 bg-sky-50/50 border border-sky-200 rounded-xl space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900">New Destination Address</h4>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Street & House Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 24 Admiralty Way, Lekki Phase 1"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">City</label>
                      <input
                        type="text"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">State</label>
                      <input
                        type="text"
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-[#0284C7] text-white font-bold rounded-lg hover:bg-[#0369a1] transition-colors"
                  >
                    Save Address
                  </button>
                </form>
              )}

              <div className="space-y-2">
                {user.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-start"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 mt-1">{addr.street}</p>
                      <p className="text-slate-500">{addr.city}, {addr.state}</p>
                      <p className="text-slate-500 font-mono mt-0.5">{addr.phone}</p>
                    </div>

                    <button
                      onClick={() => handleRemoveAddress(addr.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Security & Multi-Factor Authentication */}
          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-[#0284C7]" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Two-Factor Authentication (MFA)</h4>
                      <p className="text-slate-600 text-[11px]">
                        Protects your account by requiring an extra verification code on high-ticket vehicle orders and logins.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mfaActive}
                      onChange={(e) => setMfaActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0284C7]"></div>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900">Security Credentials Status</h4>
                <div className="space-y-1 text-slate-600">
                  <p>• Verified Email: <strong className="text-slate-900">{user.email}</strong></p>
                  <p>• Authorization Level: <strong className="text-sky-700 uppercase font-mono">{user.role}</strong></p>
                  <p>• Active Sessions: <span className="text-emerald-700 font-bold">1 Active (Secured)</span></p>
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                className="py-2.5 px-4 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Save Security Settings
              </button>
            </div>
          )}

          {/* Tab 4: Preferences */}
          {activeTab === 'preferences' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-900 block">Email Order Notifications</span>
                    <span className="text-slate-500 text-[11px]">Receive receipts, tracking codes, and status updates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#0284C7] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-900 block">SMS Shipping Alerts</span>
                    <span className="text-slate-500 text-[11px]">Instant text alert when driver is arriving at your destination</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#0284C7] rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-900 block">WhatsApp VIP Dispatch Updates</span>
                    <span className="text-slate-500 text-[11px]">Direct messages from Unitworld logistics desk</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={whatsappAlerts}
                    onChange={(e) => setWhatsappAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#0284C7] rounded"
                  />
                </label>
              </div>

              <button
                onClick={handleSavePreferences}
                className="py-2.5 px-4 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
