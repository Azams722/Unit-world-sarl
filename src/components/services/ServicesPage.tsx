import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Wrench,
  Hammer,
  Droplets,
  Zap,
  Wind,
  Car,
  PaintBucket,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Search,
  ChevronRight,
  ChevronDown,
  Loader2,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { ServiceBooking } from '../../types';
import {
  SERVICES_CATALOG,
  DISPATCH_ZONES,
  ServiceCategoryDetail,
  SubServiceDetail,
  POPULAR_SERVICE_LOCATIONS,
  SITE_CONTACT_PHONE,
  SITE_WHATSAPP_INTL,
} from '../../data/servicesCatalog';

interface ServicesPageProps {
  initialCategoryId?: string;
  userId?: string;
  defaultCustomerName?: string;
  defaultCustomerPhone?: string;
  onBack: () => void;
  onSubmitBooking: (booking: ServiceBooking) => Promise<ServiceBooking>;
}

function getTradeIcon(id: string) {
  switch (id) {
    case 'carpentry':
      return <Hammer className="w-4 h-4" />;
    case 'plumbing':
      return <Droplets className="w-4 h-4" />;
    case 'electrical':
      return <Zap className="w-4 h-4" />;
    case 'ac-appliances':
      return <Wind className="w-4 h-4" />;
    case 'auto-mechanic':
      return <Car className="w-4 h-4" />;
    case 'painting-renovation':
      return <PaintBucket className="w-4 h-4" />;
    case 'cleaning-fumigation':
      return <Sparkles className="w-4 h-4" />;
    default:
      return <Wrench className="w-4 h-4" />;
  }
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  initialCategoryId,
  userId,
  defaultCustomerName = '',
  defaultCustomerPhone = '',
  onBack,
  onSubmitBooking,
}) => {
  const initialCat =
    SERVICES_CATALOG.find((c) => c.id === initialCategoryId) || SERVICES_CATALOG[0];

  const [activeCategoryId, setActiveCategoryId] = useState<string>(initialCat.id);
  const [selectedSubServiceName, setSelectedSubServiceName] = useState<string>(
    initialCat.subServices[0]?.name || ''
  );
  const [expandedSubId, setExpandedSubId] = useState<string>(
    initialCat.subServices[0]?.id || ''
  );
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [subSearch, setSubSearch] = useState('');

  // Simple booking form states (Location + Details required; everything else optional)
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [customerPhone, setCustomerPhone] = useState(defaultCustomerPhone);
  const [urgency, setUrgency] = useState('Today / Urgent');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ServiceBooking | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  const activeCategory: ServiceCategoryDetail =
    SERVICES_CATALOG.find((c) => c.id === activeCategoryId) || SERVICES_CATALOG[0];

  useEffect(() => {
    if (initialCategoryId) {
      const found = SERVICES_CATALOG.find((c) => c.id === initialCategoryId);
      if (found) {
        setActiveCategoryId(found.id);
        setSelectedSubServiceName(found.subServices[0]?.name || '');
        setExpandedSubId(found.subServices[0]?.id || '');
        setOpenFaqIdx(0);
      }
    }
  }, [initialCategoryId]);

  const handleSelectTrade = (cat: ServiceCategoryDetail) => {
    setActiveCategoryId(cat.id);
    setSelectedSubServiceName(cat.subServices[0]?.name || cat.shortName);
    setExpandedSubId(cat.subServices[0]?.id || '');
    setOpenFaqIdx(0);
    setConfirmedBooking(null);
  };

  const handlePickSubService = (sub: SubServiceDetail, cat?: ServiceCategoryDetail) => {
    const targetCat = cat || activeCategory;
    setActiveCategoryId(targetCat.id);
    setSelectedSubServiceName(sub.name);
    setExpandedSubId(sub.id);
    setConfirmedBooking(null);
    if (!details.trim()) {
      setDetails(`Need ${sub.name.toLowerCase()} — `);
    }
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const filteredSubServices = subSearch.trim()
    ? SERVICES_CATALOG.flatMap((cat) =>
        cat.subServices
          .filter(
            (sub) =>
              sub.name.toLowerCase().includes(subSearch.toLowerCase()) ||
              sub.summary.toLowerCase().includes(subSearch.toLowerCase()) ||
              sub.commonSymptoms.some((s) =>
                s.toLowerCase().includes(subSearch.toLowerCase())
              ) ||
              cat.title.toLowerCase().includes(subSearch.toLowerCase())
          )
          .map((sub) => ({ cat, sub }))
      )
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (location.trim().length < 2) {
      setSubmitError('Please tell us your location (street, estate, or area).');
      return;
    }
    if (details.trim().length < 3) {
      setSubmitError('Please briefly describe what you want done.');
      return;
    }

    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      const bookingCode = `UW-SRV-${Math.floor(1000 + Math.random() * 9000)}`;
      const booking: ServiceBooking = {
        id: `srv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        bookingCode,
        serviceCategory: activeCategory.title,
        subService:
          selectedSubServiceName ||
          activeCategory.subServices[0]?.name ||
          activeCategory.shortName,
        location: location.trim(),
        details: details.trim(),
        customerPhone: customerPhone.trim() || undefined,
        customerName: defaultCustomerName.trim() || undefined,
        urgency,
        sourceSection: 'dedicated_services_page',
        userId: userId || undefined,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };
      const saved = await onSubmitBooking(booking);
      setConfirmedBooking(saved);
      setLocation('');
      setDetails('');
    } catch (err: any) {
      setSubmitError(
        err?.message ||
          `Unable to submit online right now. Please call or WhatsApp ${SITE_CONTACT_PHONE}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 font-semibold text-slate-700 hover:text-[#0284C7] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Storefront</span>
            </button>
            <span aria-hidden="true">/</span>
            <span>Trades & Home Services</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-slate-900">{activeCategory.shortName}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${SITE_CONTACT_PHONE}`}
              className="inline-flex items-center gap-1.5 font-semibold text-slate-800 hover:text-[#0284C7] tabular-nums"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Service Desk: {SITE_CONTACT_PHONE}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-10">
        {/* 1. Architectural Hero Split */}
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between gap-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
                <span>Unitworld Technical Division</span>
                <span aria-hidden="true">·</span>
                <span>Lagos & Nationwide</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">Direct Hotline {SITE_CONTACT_PHONE}</span>
              </div>

              <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-slate-900 leading-[1.12] tracking-tight text-balance">
                Skilled Carpentry, Plumbing, Electrical & Auto Dispatch
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Review full trade scopes, inspection guidelines, and arrival windows below. When ready, booking takes just two inputs — your <strong>location</strong> and <strong>details of what you need</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="px-6 py-3 bg-[#0284C7] hover:bg-[#0369a1] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span>Submit a Service Request</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <a
                href={`tel:${SITE_CONTACT_PHONE}`}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors inline-flex items-center gap-2 tabular-nums whitespace-nowrap"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {SITE_CONTACT_PHONE}</span>
              </a>
              <a
                href={`https://wa.me/${SITE_WHATSAPP_INTL}?text=${encodeURIComponent('Hello Unitworld Services, I want to book a technician.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 text-slate-700 hover:text-slate-950 font-semibold text-xs sm:text-sm underline underline-offset-4 inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Dispatch</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-200">
            <img
              src="/assets/images/service_home_tech_hero_1795702144709.jpg"
              alt="Unitworld Technical Dispatch Crew arriving with toolkits"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
              <p className="text-xs text-slate-300">Same-Day & Scheduled Field Teams</p>
              <p className="text-sm font-semibold leading-snug">
                Uniformed technicians arriving with full diagnostic tools and standard spares.
              </p>
            </div>
          </div>
        </section>

        {/* 2. 3-Step Dispatch Process Strip (Hairline Divided) */}
        <section className="bg-white border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-xs">
          <div className="p-5 space-y-1">
            <p className="font-semibold text-slate-900 text-sm">01. Enter Location & Request</p>
            <p className="text-slate-600 leading-relaxed">
              Pick a trade or describe the fault directly in plain language — no complex quotes needed to start.
            </p>
          </div>
          <div className="p-5 space-y-1">
            <p className="font-semibold text-slate-900 text-sm tabular-nums">02. Dispatch Confirmation ({SITE_CONTACT_PHONE})</p>
            <p className="text-slate-600 leading-relaxed">
              A coordinator confirms arrival window, upfront inspection guide, and assigns the nearest vetted specialist.
            </p>
          </div>
          <div className="p-5 space-y-1">
            <p className="font-semibold text-slate-900 text-sm">03. On-Site Execution & Sign-Off</p>
            <p className="text-slate-600 leading-relaxed">
              Every trade completes pressure, voltage, level, or road checks with clean site sweep before handover.
            </p>
          </div>
        </section>

        {/* 3. Sticky Trade Selector & Search Bar */}
        <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-playfair text-xl sm:text-2xl font-bold text-slate-900">
                Select a Trade Department
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Inspect sub-services, checklists, typical rates, and area arrival times across 8 specialized trades.
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                placeholder="Search any repair (e.g. door, toilet, inverter)..."
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {SERVICES_CATALOG.map((cat) => {
              const isActive = cat.id === activeCategory.id && !filteredSubServices;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSubSearch('');
                    handleSelectTrade(cat);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {getTradeIcon(cat.id)}
                  <span>{cat.shortName}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Main Content Grid: Detailed Trade Workspace (Left) + Simple Sticky Booking Box (Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLS */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {filteredSubServices ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <p className="text-sm font-semibold text-slate-800">
                    {filteredSubServices.length} matching task(s) for “{subSearch}”
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubSearch('')}
                    className="text-xs font-semibold text-[#0284C7] hover:underline cursor-pointer"
                  >
                    Return to full trade view
                  </button>
                </div>

                {filteredSubServices.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2">
                    <p className="text-sm font-bold text-slate-900">No preset sub-service matched</p>
                    <p className="text-xs text-slate-500">
                      Describe what you need in the booking box on the right — custom maintenance jobs are handled daily.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSubServices.map(({ cat, sub }, i) => (
                      <SubServicePanel
                        key={sub.id}
                        index={i + 1}
                        categoryTitle={cat.shortName}
                        sub={sub}
                        isExpanded={true}
                        isSelected={selectedSubServiceName === sub.name && activeCategoryId === cat.id}
                        onToggle={() => handlePickSubService(sub, cat)}
                        onBookSub={() => handlePickSubService(sub, cat)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* A. Active Trade Editorial Banner */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
                  <div className="md:col-span-7 p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{activeCategory.responseWindow}</span>
                        <span aria-hidden="true">·</span>
                        <span>{activeCategory.warrantyLabel}</span>
                      </div>

                      <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900">
                        {activeCategory.title}
                      </h3>

                      <p className="text-sm text-slate-600 leading-relaxed">
                        {activeCategory.overview}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <p>
                        <strong className="text-slate-900">Site Standard:</strong> {activeCategory.teamStandard}
                      </p>
                      <p>
                        <strong className="text-slate-900">Primary Hubs:</strong> {activeCategory.popularAreas.join(' · ')}
                      </p>
                    </div>
                  </div>

                  <div className="md:col-span-5 min-h-[220px] bg-slate-100 border-t md:border-t-0 md:border-l border-slate-200">
                    <img
                      src={activeCategory.image}
                      alt={activeCategory.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* B. Detailed Sub-Services Breakdown */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-2.5">
                    <h4 className="font-playfair text-xl font-bold text-slate-900">
                      Detailed Sub-Services & Scope ({activeCategory.subServices.length})
                    </h4>
                    <span className="text-xs text-slate-500">
                      Expand any sub-service to inspect checklists & handover checks
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeCategory.subServices.map((sub, idx) => (
                      <SubServicePanel
                        key={sub.id}
                        index={idx + 1}
                        categoryTitle={activeCategory.shortName}
                        sub={sub}
                        isExpanded={expandedSubId === sub.id}
                        isSelected={selectedSubServiceName === sub.name}
                        onToggle={() =>
                          setExpandedSubId((prev) => (prev === sub.id ? '' : sub.id))
                        }
                        onBookSub={() => handlePickSubService(sub)}
                      />
                    ))}
                  </div>
                </div>

                {/* C. Transparent Rate & Inspection Guide Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-slate-200">
                    <h4 className="font-playfair text-lg font-bold text-slate-900">
                      Labour & Inspection Rate Guide — {activeCategory.shortName}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Typical labour ranges before site materials. Exact totals are confirmed transparently before work starts.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                        <tr>
                          <th className="py-3 px-5">Service Tier</th>
                          <th className="py-3 px-5">Typical Scope</th>
                          <th className="py-3 px-5 text-right">Guide Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeCategory.rateTable.map((row) => (
                          <tr key={row.serviceLevel} className="hover:bg-slate-50/60">
                            <td className="py-3.5 px-5 font-semibold text-slate-900 whitespace-nowrap">
                              {row.serviceLevel}
                            </td>
                            <td className="py-3.5 px-5 text-slate-600">{row.scope}</td>
                            <td className="py-3.5 px-5 text-right font-bold text-slate-900 tabular-nums whitespace-nowrap">
                              {row.guideRate}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* D. Dispatch Coverage & Arrival Windows */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-slate-200">
                    <h4 className="font-playfair text-lg font-bold text-slate-900">
                      Dispatch Zones & Average Arrival Windows
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Technicians dispatch from our Lagos Island, Ikeja, and Igando operations hubs.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:gap-px bg-slate-200">
                    {DISPATCH_ZONES.map((z) => (
                      <div key={z.zone} className="bg-white p-4 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900">{z.zone}</span>
                          <span className="text-xs font-semibold text-[#0284C7] tabular-nums">
                            {z.eta}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{z.areas}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* E. Practical Trade FAQs */}
                {activeCategory.faqs.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-slate-200">
                      <h4 className="font-playfair text-lg font-bold text-slate-900">
                        Frequently Asked Questions — {activeCategory.shortName}
                      </h4>
                    </div>
                    <div className="divide-y divide-slate-200">
                      {activeCategory.faqs.map((faq, idx) => {
                        const isOpen = openFaqIdx === idx;
                        return (
                          <div key={faq.question}>
                            <button
                              type="button"
                              onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                              className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <span className="text-sm font-semibold text-slate-900">
                                {faq.question}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                            {isOpen && (
                              <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT STICKY BOOKING BOX */}
          <div ref={formRef} className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
              {confirmedBooking ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-emerald-700">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Booking Received</h3>
                      <p className="text-xs text-slate-500 tabular-nums">
                        Ref: <strong className="font-mono text-slate-900">{confirmedBooking.bookingCode}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs">
                    <div>
                      <span className="text-slate-500">Trade & Task</span>
                      <p className="font-bold text-slate-900">
                        {confirmedBooking.serviceCategory} · {confirmedBooking.subService}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Location</span>
                      <p className="font-semibold text-slate-900">{confirmedBooking.location}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Request Details</span>
                      <p className="text-slate-700 leading-relaxed">{confirmedBooking.details}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Need immediate dispatch? Call or send this reference to our direct line{' '}
                    <strong className="tabular-nums text-slate-900">{SITE_CONTACT_PHONE}</strong>.
                  </p>

                  <div className="space-y-2">
                    <a
                      href={`tel:${SITE_CONTACT_PHONE}`}
                      className="w-full py-2.5 px-4 bg-[#0284C7] hover:bg-[#0369a1] text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 tabular-nums"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Call {SITE_CONTACT_PHONE}</span>
                    </a>
                    <a
                      href={`https://wa.me/${SITE_WHATSAPP_INTL}?text=${encodeURIComponent(
                        `Hello Unitworld Services, I submitted booking ${confirmedBooking.bookingCode}.\nService: ${confirmedBooking.serviceCategory} (${confirmedBooking.subService})\nLocation: ${confirmedBooking.location}\nDetails: ${confirmedBooking.details}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Send on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setConfirmedBooking(null)}
                      className="w-full py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Book Another Service
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-1 border-b border-slate-100 pb-4">
                    <h3 className="font-playfair text-xl font-bold text-slate-900">
                      Quick Service Booking
                    </h3>
                    <p className="text-xs text-slate-500">
                      Just enter your location and details of what you want — super easy and fast.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Trade Category
                      </label>
                      <select
                        value={activeCategory.id}
                        onChange={(e) => {
                          const cat = SERVICES_CATALOG.find((c) => c.id === e.target.value);
                          if (cat) handleSelectTrade(cat);
                        }}
                        className="w-full px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0284C7]"
                      >
                        {SERVICES_CATALOG.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Sub-Service
                      </label>
                      <select
                        value={selectedSubServiceName}
                        onChange={(e) => setSelectedSubServiceName(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-[#0284C7]"
                      >
                        {activeCategory.subServices.map((sub) => (
                          <option key={sub.id} value={sub.name}>
                            {sub.name}
                          </option>
                        ))}
                        <option value="Custom / General Task">Custom / General Task</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        Your Location *
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#0284C7] absolute left-3 top-2.5 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Street, Estate, or Area (e.g. Lekki, Igando)"
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {POPULAR_SERVICE_LOCATIONS.slice(0, 4).map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setLocation(loc)}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-sky-50 hover:text-[#0284C7] text-slate-600 transition-colors cursor-pointer"
                          >
                            {loc.replace(', Lagos', '')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-900 mb-1">
                        Details of What You Want *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Describe what needs fixing, built, or inspected..."
                        className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] resize-y"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Phone (Optional)
                        </label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="e.g. 080..."
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0284C7]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Timing
                        </label>
                        <select
                          value={urgency}
                          onChange={(e) => setUrgency(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-[#0284C7]"
                        >
                          <option value="Today / Urgent">Today / Urgent</option>
                          <option value="Tomorrow">Tomorrow</option>
                          <option value="This Week">This Week</option>
                          <option value="Weekend / Flexible">Weekend / Flexible</option>
                        </select>
                      </div>
                    </div>

                    {submitError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-5 bg-[#0284C7] hover:bg-[#0369a1] disabled:opacity-60 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <span>Submit Booking</span>
                      )}
                    </button>
                  </form>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Direct Dispatch Line</span>
                    <a
                      href={`tel:${SITE_CONTACT_PHONE}`}
                      className="font-bold text-slate-900 hover:text-[#0284C7] tabular-nums inline-flex items-center gap-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>{SITE_CONTACT_PHONE}</span>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

interface SubServicePanelProps {
  index: number;
  categoryTitle: string;
  sub: SubServiceDetail;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onBookSub: () => void;
}

const SubServicePanel: React.FC<SubServicePanelProps> = ({
  index,
  categoryTitle,
  sub,
  isExpanded,
  isSelected,
  onToggle,
  onBookSub,
}) => {
  return (
    <div
      className={`bg-white border rounded-xl overflow-hidden transition-colors ${
        isSelected ? 'border-[#0284C7]' : 'border-slate-200'
      }`}
    >
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="text-left space-y-1 flex-1 cursor-pointer"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>{categoryTitle}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock className="w-3 h-3" />
              {sub.typicalDuration}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-900 tabular-nums">{sub.startingEstimate}</span>
          </div>
          <h5 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>
              {String(index).padStart(2, '0')}. {sub.name}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </h5>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{sub.summary}</p>
        </button>

        <button
          type="button"
          onClick={onBookSub}
          className={`px-4 py-2 rounded-lg text-xs font-semibold shrink-0 transition-colors cursor-pointer whitespace-nowrap ${
            isSelected
              ? 'bg-[#0284C7] text-white'
              : 'bg-slate-900 hover:bg-[#0284C7] text-white'
          }`}
        >
          {isSelected ? 'Selected' : 'Book Task'}
        </button>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 pt-4 border-t border-slate-100 bg-slate-50/70 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-bold text-slate-900">On-Site Scope Checklist</p>
              <ul className="space-y-1.5 text-slate-600">
                {sub.includedChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-slate-900">Common Faults Addressed</p>
              <ul className="space-y-1.5 text-slate-600 list-disc pl-4">
                {sub.commonSymptoms.map((sym) => (
                  <li key={sym}>{sym}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600">
            <div>
              <p className="font-semibold text-slate-900">Tools & Materials Policy</p>
              <p className="mt-0.5 leading-relaxed">{sub.materialsNote}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Handover Verification Standard</span>
              </p>
              <p className="mt-0.5 leading-relaxed">{sub.handoverStandard}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
