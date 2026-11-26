import React, { useState } from 'react';
import { Wrench, MapPin, CheckCircle2, PhoneCall, ArrowRight, Loader2, MessageSquare } from 'lucide-react';
import { ServiceBooking } from '../../types';
import {
  SERVICES_CATALOG,
  SITE_CONTACT_PHONE,
  SITE_WHATSAPP_INTL,
  POPULAR_SERVICE_LOCATIONS,
} from '../../data/servicesCatalog';

interface QuickServiceStripProps {
  title: string;
  subtitle: string;
  defaultCategoryId?: string;
  allowedCategoryIds?: string[];
  sourceSection: string;
  userId?: string;
  onSubmitBooking: (booking: ServiceBooking) => Promise<ServiceBooking>;
  onOpenFullServicesPage: (categoryId?: string) => void;
}

export const QuickServiceStrip: React.FC<QuickServiceStripProps> = ({
  title,
  subtitle,
  defaultCategoryId = 'plumbing',
  allowedCategoryIds,
  sourceSection,
  userId,
  onSubmitBooking,
  onOpenFullServicesPage,
}) => {
  const availableCategories = allowedCategoryIds
    ? SERVICES_CATALOG.filter((c) => allowedCategoryIds.includes(c.id))
    : SERVICES_CATALOG;

  const initialCat =
    availableCategories.find((c) => c.id === defaultCategoryId) || availableCategories[0];

  const [selectedCatId, setSelectedCatId] = useState<string>(initialCat.id);
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<ServiceBooking | null>(null);

  const activeCategory =
    availableCategories.find((c) => c.id === selectedCatId) || initialCat;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (location.trim().length < 2) {
      setErrorMsg('Please enter your location so a technician can reach you.');
      return;
    }
    if (details.trim().length < 3) {
      setErrorMsg('Please enter short details of what you need done.');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const bookingCode = `UW-SRV-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking: ServiceBooking = {
        id: `srv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        bookingCode,
        serviceCategory: activeCategory.title,
        subService: activeCategory.subServices[0]?.name || activeCategory.shortName,
        location: location.trim(),
        details: details.trim(),
        customerPhone: customerPhone.trim() || undefined,
        urgency: 'As soon as possible',
        sourceSection,
        userId: userId || undefined,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };
      const saved = await onSubmitBooking(newBooking);
      setSubmittedBooking(saved);
      setLocation('');
      setDetails('');
      setCustomerPhone('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not submit request right now. Please call 07070554285.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedBooking) {
    const waText = encodeURIComponent(
      `Hello Unitworld Sarl (${SITE_CONTACT_PHONE}), I just booked a service.\nRef: ${submittedBooking.bookingCode}\nService: ${submittedBooking.serviceCategory}\nLocation: ${submittedBooking.location}\nDetails: ${submittedBooking.details}`
    );

    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Booking Received — Reference <span className="font-mono tabular-nums">{submittedBooking.bookingCode}</span>
            </span>
          </div>
          <p className="text-xs text-emerald-800">
            <strong>{submittedBooking.serviceCategory}</strong> at <strong>{submittedBooking.location}</strong>: “{submittedBooking.details}”
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href={`tel:${SITE_CONTACT_PHONE}`}
            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call {SITE_CONTACT_PHONE}</span>
          </a>
          <a
            href={`https://wa.me/${SITE_WHATSAPP_INTL}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Dispatch</span>
          </a>
          <button
            type="button"
            onClick={() => setSubmittedBooking(null)}
            className="px-3 py-2 text-xs font-semibold text-emerald-800 hover:underline cursor-pointer"
          >
            New Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#0284C7] flex items-center justify-center shrink-0">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{title}</h3>
            <p className="text-[11px] text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${SITE_CONTACT_PHONE}`}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-[#0284C7] tabular-nums"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{SITE_CONTACT_PHONE}</span>
          </a>
          <button
            type="button"
            onClick={() => onOpenFullServicesPage(activeCategory.id)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0284C7] hover:text-[#0369a1] cursor-pointer whitespace-nowrap"
          >
            <span>See all sub-services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-start">
        {availableCategories.length > 1 && (
          <div className="md:col-span-3">
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              aria-label="Select Service Type"
              className="w-full px-3 py-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-[#0284C7]"
            >
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.shortName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={availableCategories.length > 1 ? 'md:col-span-3' : 'md:col-span-4'}>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Your location (e.g. Lekki, Ikeja, Igando)"
              list={`quick-loc-${sourceSection}`}
              className="w-full pl-8 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
            />
            <datalist id={`quick-loc-${sourceSection}`}>
              {POPULAR_SERVICE_LOCATIONS.map((loc) => (
                <option key={loc} value={loc} />
              ))}
            </datalist>
          </div>
        </div>

        <div className={availableCategories.length > 1 ? 'md:col-span-4' : 'md:col-span-5'}>
          <input
            type="text"
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Details of what you want (e.g. fix leaking sink, AC gas)"
            className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        <div className={availableCategories.length > 1 ? 'md:col-span-2' : 'md:col-span-3'}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-[#0284C7] hover:bg-[#0369a1] disabled:opacity-60 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <span>Book Now</span>
            )}
          </button>
        </div>
      </form>

      {errorMsg && (
        <p className="text-xs font-medium text-rose-700">{errorMsg}</p>
      )}
    </div>
  );
};
