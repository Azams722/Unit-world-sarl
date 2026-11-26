export interface SubServiceDetail {
  id: string;
  name: string;
  summary: string;
  typicalDuration: string;
  startingEstimate: string;
  includedChecklist: string[];
  commonSymptoms: string[];
  materialsNote: string;
  handoverStandard: string;
}

export interface ServiceRateRow {
  serviceLevel: string;
  scope: string;
  guideRate: string;
}

export interface ServiceFaqItem {
  question: string;
  answer: string;
}

export interface ServiceCategoryDetail {
  id: string;
  title: string;
  shortName: string;
  tagline: string;
  overview: string;
  image: string;
  responseWindow: string;
  warrantyLabel: string;
  teamStandard: string;
  popularAreas: string[];
  subServices: SubServiceDetail[];
  rateTable: ServiceRateRow[];
  faqs: ServiceFaqItem[];
}

export interface DispatchZoneInfo {
  zone: string;
  areas: string;
  eta: string;
}

export const SITE_CONTACT_PHONE = '07070554285';
export const SITE_WHATSAPP_INTL = '2347070554285';

export const POPULAR_SERVICE_LOCATIONS = [
  'Victoria Island, Lagos',
  'Lekki Phase 1, Lagos',
  'Ikeja / GRA, Lagos',
  'Igando / Ikotun, Lagos',
  'Surulere / Yaba, Lagos',
  'Ajah / Sangotedo, Lagos',
  'Gbagada / Festac, Lagos',
  'Abuja / Nationwide',
];

export const DISPATCH_ZONES: DispatchZoneInfo[] = [
  {
    zone: 'Island Core',
    areas: 'Victoria Island, Ikoyi, Oniru, Lekki Phase 1',
    eta: '60 – 90 mins',
  },
  {
    zone: 'Lekki – Epe Corridor',
    areas: 'Ikate, Chevron, VGC, Ajah, Sangotedo',
    eta: '75 – 120 mins',
  },
  {
    zone: 'Alimosho Hub',
    areas: 'Igando, Ikotun, Idimu, Egbeda, Ayobo',
    eta: '45 – 75 mins',
  },
  {
    zone: 'Mainland Central',
    areas: 'Ikeja GRA, Maryland, Yaba, Surulere, Gbagada',
    eta: '60 – 110 mins',
  },
  {
    zone: 'Amuwo & Apapa',
    areas: 'Festac Town, Mile 2, Okota, Isolo, Apapa',
    eta: '75 – 120 mins',
  },
  {
    zone: 'Abuja & Interstate',
    areas: 'Wuse, Maitama, Gwarinpa, Port Harcourt, Ibadan',
    eta: 'Scheduled 24 hrs',
  },
];

export const SERVICES_CATALOG: ServiceCategoryDetail[] = [
  {
    id: 'carpentry',
    title: 'Carpentry & Bespoke Woodwork',
    shortName: 'Carpentry',
    tagline: 'Kitchen cabinets, security doors, wardrobes, office furniture & roof timber',
    overview:
      'Master joiners equipped with cordless routers, laser levels, miter saws, and cabinet jigs for residential apartments, corporate offices, and retail showrooms.',
    image: '/assets/images/service_carpentry_craft_1795702144508.jpg',
    responseWindow: 'Same-day visit or within 3 hours',
    warrantyLabel: '30-day joinery & hardware warranty',
    teamStandard: 'Dust sheet laid before sawing; full off-cut sweep on completion',
    popularAreas: ['Victoria Island', 'Lekki', 'Ikeja', 'Igando', 'Surulere'],
    rateTable: [
      {
        serviceLevel: 'On-Site Assessment & Measurement',
        scope: 'Exact dimensions, wood sample check & itemized material bill',
        guideRate: '₦5,000 (waived on job award)',
      },
      {
        serviceLevel: 'Minor Door, Hinge & Lock Fix',
        scope: 'Alignment, planing, soft-close hinges or mortise lock swap',
        guideRate: '₦12,000 – ₦20,000',
      },
      {
        serviceLevel: 'Standard Full-Day Carpenter',
        scope: 'Shelving, furniture restoration, multi-door hanging',
        guideRate: '₦22,000 – ₦35,000 / day',
      },
      {
        serviceLevel: 'Custom Cabinets & Wardrobes',
        scope: 'HDF/MDF/Marine board built-ins crafted to space',
        guideRate: 'Itemized contract quote',
      },
    ],
    faqs: [
      {
        question: 'Can you source the HDF boards, plywood, and hinges for me?',
        answer:
          'Yes. You can either provide materials on-site or ask our carpenter to purchase directly from vetted timber depots with receipts provided.',
      },
      {
        question: 'Do you fix swelling or rubbing bathroom/bedroom wooden doors without replacing the frame?',
        answer:
          'In most cases yes — our carpenters plane the swollen edge cleanly, re-seat loose butt hinges with longer anchor screws, and seal exposed wood edges.',
      },
    ],
    subServices: [
      {
        id: 'carpentry-cabinets',
        name: 'Kitchen Cabinets, Wardrobes & Pantry Shelving',
        summary:
          'Custom built-in storage, under-sink waterproof marine board replacements, soft-close hydraulic hinges, and sliding wardrobe rail repairs.',
        typicalDuration: '4 hrs – 3 days',
        startingEstimate: 'From ₦25,000 labour',
        includedChecklist: [
          'Laser room measurement & wall plumb check',
          'Moisture-resistant HDF, MDF, or solid mahogany joinery',
          'Concealed hinges, soft-close drawer channels & handle alignment',
        ],
        commonSymptoms: [
          'Sagging cabinet doors or broken drawer runners',
          'Water-damaged under-sink wooden carcass',
          'Walk-in closet needing extra shelves & hanging rods',
        ],
        materialsNote: 'Carry spare hydraulic hinges, PVC edge tape, wood screws, and shelf pins in van.',
        handoverStandard: 'Every door gap squared to uniform 2mm tolerance with smooth latch action.',
      },
      {
        id: 'carpentry-doors',
        name: 'Door Hanging, Smart Locks & Frame Alignment',
        summary:
          'Turkish security door installation, interior panel doors, jammed frame planing, and biometric/mortise lockset fitting.',
        typicalDuration: '1.5 – 3 hrs',
        startingEstimate: 'From ₦12,000 labour',
        includedChecklist: [
          'Frame squaring & anchor bolt tightening into blockwork',
          'Mortise lock pocket routing, cylinder & handle fitting',
          'Threshold trimming for tiled/marble floor clearance',
        ],
        commonSymptoms: [
          'Door dragging against floor tiles or refusing to lock cleanly',
          'Broken handle spindle or jammed cylinder key',
          'New apartment security door fitting',
        ],
        materialsNote: 'Compatible with heavy Turkish steel doors, HDF flush doors, and solid iroko.',
        handoverStandard: 'Door latches cleanly with one finger pressure; zero rattle in wind.',
      },
      {
        id: 'carpentry-furniture',
        name: 'Bed Frames, TV Consoles & Office Workstations',
        summary:
          'Flat-pack furniture assembly, broken slat & joint reinforcement, floating TV panels, and bespoke office desks.',
        typicalDuration: '2 – 6 hrs',
        startingEstimate: 'From ₦15,000 labour',
        includedChecklist: [
          'Heavy-duty L-bracket & hardwood cleat reinforcement',
          'Clean cable-passthrough cutouts on TV & office desks',
          'Wood-filler & satin varnish touch-up on scuffs',
        ],
        commonSymptoms: [
          'Squeaking or collapsed king/queen bed slat base',
          'Flat-pack wardrobe or dining table needing clean assembly',
          'Executive office desk cable grommets and drawer locks',
        ],
        materialsNote: 'Standard dowels, industrial PVA adhesive, and anchor bolts brought on-site.',
        handoverStandard: 'Load-tested frames free of wobble, creaking, or exposed sharp screws.',
      },
      {
        id: 'carpentry-roofing',
        name: 'Roof Trusses, Fascia Boards & Outdoor Pergolas',
        summary:
          'Treated hardwood roof carcass repairs, rotten fascia replacement, and shaded timber pergolas.',
        typicalDuration: '1 – 4 days',
        startingEstimate: 'Custom site quote',
        includedChecklist: [
          'Solignum/anti-termite wood preservative treatment',
          'Purlin spacing reinforcement & galvanized hurricane ties',
          'Clean fascia board sealing before roofing sheets',
        ],
        commonSymptoms: [
          'Ceiling leak stains traced to sagged rafters or cracked fascia',
          'Termite-damaged roof beams requiring section swap',
        ],
        materialsNote: 'Full timber & nail schedule issued immediately after inspection.',
        handoverStandard: 'Weather-tight, termite-treated timber frame inspected before sheet capping.',
      },
    ],
  },
  {
    id: 'plumbing',
    title: 'Plumbing & Water Engineering',
    shortName: 'Plumbing',
    tagline: 'Concealed leak repair, WC & mixer fitting, water pumps, borehole lines & drains',
    overview:
      'Licensed residential and estate plumbers carrying PPR fusion machines, mechanical drain augers, and static pressure gauges for clean, lasting water systems.',
    image: '/assets/images/service_plumbing_repair_1795702144593.jpg',
    responseWindow: 'Urgent dispatch within 90 mins',
    warrantyLabel: '30-day leak-free workmanship guarantee',
    teamStandard: 'Pressure-tested before sign-off; zero silicone mess on tiles',
    popularAreas: ['Lekki', 'Victoria Island', 'Ikeja', 'Igando', 'Ajah'],
    rateTable: [
      {
        serviceLevel: 'Leak Diagnostic & Call-Out',
        scope: 'Pipe tracing, pressure check & valve isolation inspection',
        guideRate: '₦5,000 (deducted on repair)',
      },
      {
        serviceLevel: 'Tap, Sink Trap & Flush Valve Fix',
        scope: 'Single fixture repair, mixer swap, or cistern rebuild',
        guideRate: '₦10,000 – ₦18,000',
      },
      {
        serviceLevel: 'Water Pump / Tank Plumbing',
        scope: 'Booster pump wiring, float switch & non-return check valve',
        guideRate: '₦18,000 – ₦30,000',
      },
      {
        serviceLevel: 'Drainage & Chamber Unblocking',
        scope: 'Kitchen/bathroom trap & outdoor inspection chamber clearing',
        guideRate: '₦12,000 – ₦25,000',
      },
    ],
    faqs: [
      {
        question: 'My wall is damp behind the bathroom — can you trace concealed PPR/PVC leaks?',
        answer:
          'Yes. Our plumbers isolate hot, cold, and drain lines one by one using static pressure drop testing so only the exact faulty tile needs opening.',
      },
      {
        question: 'Can you replace an electric water heater or low-pressure booster pump same day?',
        answer:
          'Yes. Call 07070554285 or submit your location; we handle Ariston/Thermocool water heaters and Pedrollo/Sumo pumping machines.',
      },
    ],
    subServices: [
      {
        id: 'plumbing-leaks',
        name: 'Pipe Leak Detection & Burst PPR/PVC Repair',
        summary:
          'Under-sink siphon leaks, cracked wall elbows, PPR hot-water thermal welding, and corroded brass stopcocks.',
        typicalDuration: '1 – 3 hrs',
        startingEstimate: 'From ₦10,000 labour',
        includedChecklist: [
          'Hot & cold supply line static pressure isolation',
          'Thermal fusion PPR welding or thick-wall PVC replacement',
          '15-minute post-repair drip & gauge inspection',
        ],
        commonSymptoms: [
          'Puddles forming under kitchen sink or bathroom vanity',
          'Peeling paint or bubbling dampness on shared bathroom wall',
          'Water tank draining fast even when taps are off',
        ],
        materialsNote: 'Carry Teflon, braided flex hoses, angle valves, and PPR couplers.',
        handoverStandard: 'Dry paper-towel joint test passed at full operating pump pressure.',
      },
      {
        id: 'plumbing-sanitary',
        name: 'WC Toilets, Concealed Cisterns, Mixers & Showers',
        summary:
          'Running cistern repair, new close-coupled or wall-hung WC installation, rain shower mixers, and kitchen faucets.',
        typicalDuration: '1.5 – 4 hrs',
        startingEstimate: 'From ₦15,000 labour',
        includedChecklist: [
          'Dual-flush inlet & siphon seal calibration',
          'Anti-mold neutral-cure silicone perimeter sealing',
          'Wax/rubber pan connector leak sealing at floor outlet',
        ],
        commonSymptoms: [
          'Toilet tank keeps filling or trickling into bowl nonstop',
          'Weak shower pressure or dripping mixer handle',
          'Renovation requiring brand-new bathroom suite installation',
        ],
        materialsNote: 'Fits Geberit, Twyford, Ideal Standard, and modern Chinese/Italian sanitary ware.',
        handoverStandard: '3 consecutive full flushes checked for zero bowl trickle and zero base seepage.',
      },
      {
        id: 'plumbing-pumps',
        name: 'Overhead Tanks, Pressure Pumps & Borehole Piping',
        summary:
          'Automatic float switch wiring, pumping machine priming & valve setup, tank washout, and manifold piping.',
        typicalDuration: '2 – 5 hrs',
        startingEstimate: 'From ₦18,000 labour',
        includedChecklist: [
          'Brass non-return valve & union fitting for easy servicing',
          'Overhead tank float switch cutoff installation',
          'Pump seal check & electrical draw safety test',
        ],
        commonSymptoms: [
          'Overhead tank overflowing onto compound every time pump runs',
          'Pumping machine humming without lifting water upstairs',
          'Low tap pressure in top-floor bathrooms',
        ],
        materialsNote: 'Supports surface centrifugal, submersible borehole, and silent booster pumps.',
        handoverStandard: 'Automatic pump start/stop cycle verified with full tank cutoff.',
      },
      {
        id: 'plumbing-drainage',
        name: 'Blocked Sinks, Floor Drains & Soakaway Clearing',
        summary:
          'High-torque mechanical augering for grease-clogged kitchen sinks, shower traps, and compound chambers.',
        typicalDuration: '1 – 3 hrs',
        startingEstimate: 'From ₦12,000 labour',
        includedChecklist: [
          'Trap & bottle-siphon disassembly and grease removal',
          'Flexible steel auger clearance along branch pipe bends',
          'High-volume flush verification across adjacent drains',
        ],
        commonSymptoms: [
          'Kitchen sink water backing up into washing machine drain',
          'Slow-draining bathroom floor gully or foul trap odor',
        ],
        materialsNote: 'Zero harsh acid that melts older PVC joints unless strictly cleared.',
        handoverStandard: 'Rapid whirlpool drainage verified under continuous full-tap flow.',
      },
    ],
  },
  {
    id: 'electrical',
    title: 'Electrical, Inverter & Solar Engineering',
    shortName: 'Electrical & Solar',
    tagline: 'Fault tracing, DB breakers, lithium solar inverters, changeover switches & lighting',
    overview:
      'Qualified electrical engineers equipped with digital clamp meters, earth loop testers, and hydraulic cable lug crimpers for residential and commercial power systems.',
    image: '/assets/images/service_electrical_solar_1795702620175.jpg',
    responseWindow: 'Urgent fault response within 2 hours',
    warrantyLabel: 'Full load-balance & thermal safety check',
    teamStandard: 'Insulated tooling & proper color-coded conductor termination',
    popularAreas: ['Ikeja', 'Victoria Island', 'Lekki', 'Yaba', 'Surulere'],
    rateTable: [
      {
        serviceLevel: 'Electrical Fault Diagnostic',
        scope: 'Short-circuit tracing, tripping breaker or phase fault locate',
        guideRate: '₦8,000 – ₦15,000',
      },
      {
        serviceLevel: 'Sockets, Switches & Cooker Unit',
        scope: 'Burnt socket replacement, surge arresters & chandelier mount',
        guideRate: '₦10,000 – ₦20,000',
      },
      {
        serviceLevel: 'Changeover & DB Upgrade',
        scope: 'Automatic/manual generator changeover & MCB/RCCB DB rework',
        guideRate: '₦20,000 – ₦45,000',
      },
      {
        serviceLevel: 'Solar & Hybrid Inverter Install',
        scope: '1kVA–15kVA inverter, lithium battery & roof panel commissioning',
        guideRate: 'From ₦35,000 labour',
      },
    ],
    faqs: [
      {
        question: 'My inverter keeps beeping overload when the fridge or microwave starts — can you rewire load separation?',
        answer:
          'Yes. We split your distribution board cleanly so heavy loads (ACs, water heaters, irons) stay on grid/generator while lights, TVs, sockets, and inverter-friendly fridges run smoothly on solar.',
      },
      {
        question: 'Do you fix burning smell from cooker control units and distribution boxes?',
        answer:
          'Yes, immediately. Loose neutral bars or undersized 1.5mm cooker spurs are a fire risk; we re-lug terminals cleanly and install rated 32A/45A DP switches.',
      },
    ],
    subServices: [
      {
        id: 'electrical-faults',
        name: 'Power Fault Tracing, Sockets & Breaker Upgrades',
        summary:
          'Tripping MCB/RCCB breakers, dead socket rings, burnt AC/cooker control switches, and loose neutral fixes.',
        typicalDuration: '1 – 3 hrs',
        startingEstimate: 'From ₦10,000 labour',
        includedChecklist: [
          'Line-to-neutral & earth voltage drop measurement',
          'Distribution board terminal torque & hotspot check',
          'Properly rated ABB/Schneider/Chint breaker replacement',
        ],
        commonSymptoms: [
          'Half the apartment sockets going off or flickering on load',
          'Breaker tripping instantly when water heater or AC turns on',
          'Warm or melted 13A wall socket faceplates',
        ],
        materialsNote: 'Strictly recommends genuine copper Coleman/Kabelmetal conductors.',
        handoverStandard: 'Stable voltage reading and zero terminal heating under 15-minute peak test.',
      },
      {
        id: 'electrical-solar',
        name: 'Solar Panels, Lithium Batteries & Hybrid Inverters',
        summary:
          'Full system wiring for 3kVA–15kVA inverters, MPPT arrays, DC surge arresters, and battery BMS balancing.',
        typicalDuration: '4 hrs – 2 days',
        startingEstimate: 'From ₦35,000 labour',
        includedChecklist: [
          'Appliance wattage audit & clean essential-load separation',
          'DC isolators, SPD lightning arresters & proper MC4 solar crimps',
          'Battery charging voltage & cutoff parameter programming',
        ],
        commonSymptoms: [
          'Purchased new Felicity/Deye/Luminous inverter + lithium battery needing safe setup',
          'Existing solar panels charging slowly due to poor wiring losses',
        ],
        materialsNote: 'Proper 16mm–35mm flexible battery cables with copper lugs used.',
        handoverStandard: 'Grid-to-battery-to-solar automatic transfer verified with load telemetry.',
      },
      {
        id: 'electrical-lighting',
        name: 'Changeover Switches, Chandeliers & Security Lights',
        summary:
          '63A–100A automatic generator changeover installation, staircase chandeliers, POP spotlights, and motion floodlights.',
        typicalDuration: '1.5 – 4 hrs',
        startingEstimate: 'From ₦12,000 labour',
        includedChecklist: [
          'Zero-backfeed interlocked generator changeover wiring',
          'Reinforced ceiling hook anchoring for heavy chandeliers',
          'Weatherproof IP65 outdoor junction sealing',
        ],
        commonSymptoms: [
          'Manual changeover arcing or generator failing to supply one room',
          'Flickering LED drivers in POP ceiling coves',
        ],
        materialsNote: 'Trunking and clean concealed routing available for finished walls.',
        handoverStandard: 'Smooth grid/generator switching and balanced illumination across circuits.',
      },
    ],
  },
  {
    id: 'ac-appliances',
    title: 'AC, Fridge & Home Appliance Servicing',
    shortName: 'AC & Appliances',
    tagline: 'AC chemical wash, gas top-up, freezer repairs, washers & smart TV wall mounting',
    overview:
      'Clean HVAC and white-goods specialists using indoor waterproof catch bags to wash split ACs with zero dirty water splash on walls or curtains.',
    image: '/assets/images/service_ac_painting_1795702621082.jpg',
    responseWindow: 'Same-day scheduled slot',
    warrantyLabel: '14-day cooling & operation guarantee',
    teamStandard: 'Splash-bag coil protection & calibrated refrigerant manifold check',
    popularAreas: ['Lekki', 'Victoria Island', 'Ikeja', 'Gbagada', 'Igando'],
    rateTable: [
      {
        serviceLevel: 'Split AC Deep Chemical Wash',
        scope: 'Indoor blower + outdoor condenser jet wash & drain clearing',
        guideRate: '₦12,000 – ₦15,000 / unit',
      },
      {
        serviceLevel: 'New Split AC Installation',
        scope: 'Wall core drill, bracket, flare nuts, vacuum & test run',
        guideRate: '₦25,000 – ₦35,000 / unit',
      },
      {
        serviceLevel: 'Fridge / Freezer Repair & Gas',
        scope: 'Thermostat, relay, copper leak weld & R600a/R134a charge',
        guideRate: 'From ₦12,000 labour',
      },
      {
        serviceLevel: 'Washing Machine & TV Mounting',
        scope: 'Drain pump repair, belt/valve swap or laser TV bracket fit',
        guideRate: 'From ₦10,000 labour',
      },
    ],
    faqs: [
      {
        question: 'My split AC is blowing cool air instead of ice cold, or dripping water inside the room.',
        answer:
          'Dripping indoor water usually means a clogged drain tray or iced-up dirty coils. A deep pressure wash with our splash bag clears it in 45 minutes; if gas pressure is low, we flare-check before topping up.',
      },
    ],
    subServices: [
      {
        id: 'ac-servicing',
        name: 'Split & Standing AC Jet Wash + Gas Recharge',
        summary:
          'Complete evaporator coil wash, clogged drain hose flushing, R410A/R32/R22 refrigerant check, and relocation.',
        typicalDuration: '1 – 2.5 hrs',
        startingEstimate: 'From ₦12,000 / unit',
        includedChecklist: [
          'Waterproof service jacket prevents wall/floor splashes',
          'Outdoor condenser fins straightened & pressure-rinsed',
          'Manifold PSI pressure & compressor amp reading recorded',
        ],
        commonSymptoms: [
          'Water leaking down interior wall under indoor AC unit',
          'Musty airflow odor or warm air blowing with compressor running',
        ],
        materialsNote: 'Handles Hisense, LG Dual Inverter, Samsung, Scanfrost, Midea, and Polystar.',
        handoverStandard: 'Supply vent temperature drop confirmed <= 10°C below room ambient.',
      },
      {
        id: 'appliance-fridge',
        name: 'Refrigerator & Deep Freezer Diagnostics',
        summary:
          'Inverter & standard fridge cooling failure, overloaded relay/capacitor swaps, thermostat replacement, and gas recharge.',
        typicalDuration: '1.5 – 3 hrs',
        startingEstimate: 'From ₦12,000 labour',
        includedChecklist: [
          'Compressor winding ohm & start-relay check',
          'Nitrogen leak sweep & vacuum pump purge before gas refill',
          'Door magnetic gasket seal check to prevent icing',
        ],
        commonSymptoms: [
          'Freezer top compartment cooling weakly while bottom is warm',
          'Clicking sound every 5 minutes from behind fridge',
        ],
        materialsNote: 'Exact R600a / R134a weight charging without over-pressuring.',
        handoverStandard: 'Frost line verified evenly across evaporator plate prior to departure.',
      },
      {
        id: 'appliance-washer',
        name: 'Washing Machine Repair & Wall TV Mounting',
        summary:
          'Front-load & top-load spin/drainage fault fixes, inlet solenoid swaps, and laser-leveled TV mounts up to 85".',
        typicalDuration: '1 – 2 hrs',
        startingEstimate: 'From ₦10,000 labour',
        includedChecklist: [
          'Coin-trap & drain pump impeller obstruction clearing',
          'Heavy-duty masonry sleeve anchors for 55"–85" smart TVs',
          'Concealed PVC cable channel option underneath TV',
        ],
        commonSymptoms: [
          'Washer showing OE/DE error or holding dirty water in drum',
          'New 65-inch Sony/LG TV needing safe center wall mounting',
        ],
        materialsNote: 'Carries digital spirit levels, masonry anchors, and drain hoses.',
        handoverStandard: 'Full spin & drain test passed; wall mounts load-checked cleanly.',
      },
    ],
  },
  {
    id: 'auto-mechanic',
    title: 'Auto Mechanic & Pre-Buy Inspection',
    shortName: 'Auto Mechanic',
    tagline: 'OBD-II computerized scan, mobile servicing, brakes, car AC & pre-purchase check',
    overview:
      'Mobile Toyota, Lexus, Mercedes, and SUV technicians — matching Unitworld Motors inspection standards — dispatched directly to your home, office, or car lot.',
    image: '/assets/images/service_auto_mechanic_1795702621487.jpg',
    responseWindow: 'Mobile dispatch within 2 hours (Lagos)',
    warrantyLabel: 'Digital fault scan & road-test sheet',
    teamStandard: 'Protective oil drip mats & fender covers used on every vehicle',
    popularAreas: ['Lekki', 'Victoria Island', 'Igando', 'Ikeja', 'Festac'],
    rateTable: [
      {
        serviceLevel: 'OBD-II Full System Computer Scan',
        scope: 'Engine, ABS, gearbox, hybrid battery & live misfire data',
        guideRate: '₦15,000',
      },
      {
        serviceLevel: 'Mobile Oil, Filter & Brake Service',
        scope: 'Synthetic oil drain, brake pad change & suspension check',
        guideRate: '₦15,000 – ₦25,000 labour',
      },
      {
        serviceLevel: 'Pre-Purchase Car Inspection',
        scope: 'Body paint check, chassis VIN verify, scan & road test',
        guideRate: '₦25,000 – ₦35,000 report',
      },
      {
        serviceLevel: 'Car AC Recharge & Compressor',
        scope: 'Leak dye test, R134a vacuum refill & condenser fan check',
        guideRate: 'From ₦15,000',
      },
    ],
    faqs: [
      {
        question: 'Can you inspect a Tokunbo or Nigerian-used car at a dealer before I pay?',
        answer:
          'Yes — our Pre-Purchase Inspector meets you at the lot (Lekki, Berger, Festac, VI, or Ikeja), checks if codes were recently cleared, checks accident repairs, and hands you an honest go/no-go verdict.',
      },
    ],
    subServices: [
      {
        id: 'auto-diagnostics',
        name: 'Computerized OBD-II Engine & Transmission Scan',
        summary:
          'Check-engine light troubleshooting, VSC/ABS fault codes, misfire coil pinpointing, and hybrid battery cell health.',
        typicalDuration: '45 – 90 mins',
        startingEstimate: 'From ₦15,000 scan',
        includedChecklist: [
          'All-module diagnostic sweep (ECM, TCM, ABS, SRS Airbag)',
          'Live fuel-trim, O2 sensor & alternator charging trace',
          'Clear action sheet sent to your phone/WhatsApp',
        ],
        commonSymptoms: [
          'Check Engine, VSC, or Triangle warning light illuminated',
          'Rough idling, hesitation, or sudden fuel consumption spike',
        ],
        materialsNote: 'Pro Bi-directional Launch/Autel scanners supporting Japanese, German & US cars.',
        handoverStandard: 'Full DTC fault PDF/text breakdown explained plainly with zero jargon.',
      },
      {
        id: 'auto-service',
        name: 'Mobile Oil Change, Brake Pads & Suspension Check',
        summary:
          'On-site synthetic oil & OEM filter servicing, ceramic brake pad replacement, spark plugs, and belt checks.',
        typicalDuration: '1 – 2.5 hrs',
        startingEstimate: 'From ₦15,000 labour',
        includedChecklist: [
          'Full drain & clean torque with protective driveway drip mats',
          'Front/rear pad thickness, caliper pin grease & brake fluid test',
          'Underbody shock, bushing & stabilizer link inspection',
        ],
        commonSymptoms: [
          'Squealing brakes or vibration when slowing down',
          'Due for 5,000km oil change without sitting in workshop traffic',
        ],
        materialsNote: 'Can supply genuine Toyota/Mobil1/Castrol oil & OEM filters on request.',
        handoverStandard: 'Dipstick level, zero drain plug seep & smooth pedal bite confirmed.',
      },
      {
        id: 'auto-inspection',
        name: 'Pre-Purchase Vehicle Inspection (Tokunbo / Registered)',
        summary:
          'Send a Unitworld inspector before buying any vehicle to uncover hidden putty, flooded electronics, or gearbox slip.',
        typicalDuration: '60 – 90 mins',
        startingEstimate: 'From ₦25,000 report',
        includedChecklist: [
          'Frame rails, apron welds, airbag sensor & flood rust check',
          'Check for recently cleared OBD codes & Readiness Monitors',
          'Cold-start knock test & full-load gearbox shift road test',
        ],
        commonSymptoms: [
          'Buying a car in Lagos and wanting an independent mechanic verdict first',
        ],
        materialsNote: 'Completely independent evaluation; we protect the buyer.',
        handoverStandard: 'Photo + diagnostic findings delivered straight to you before transfer.',
      },
    ],
  },
  {
    id: 'painting-renovation',
    title: 'Painting, Tiling, POP & Renovation',
    shortName: 'Painting & POP',
    tagline: 'Wall screeding, interior/exterior paint, floor & wall tiling, POP ceiling & damp fix',
    overview:
      'Meticulous painters, tilers, and POP plasterers delivering crisp roller finishes, laser-leveled tile joints, and lasting rising-damp waterproofing.',
    image: '/assets/images/service_ac_painting_1795702621082.jpg',
    responseWindow: 'Free scope check within 24 hours',
    warrantyLabel: 'Full surface masking & clean handover',
    teamStandard: 'Polythene floor/furniture sheets laid before opening any paint bucket',
    popularAreas: ['Lekki', 'Ajah', 'Ikeja', 'Surulere', 'Abuja'],
    rateTable: [
      {
        serviceLevel: 'Single Room Refresh (2 Coats)',
        scope: 'Crack puttying, sanding & clean satin/emulsion finish',
        guideRate: 'From ₦25,000 labour',
      },
      {
        serviceLevel: '2–3 Bedroom Flat Repainting',
        scope: 'Full interior walls, ceilings, door frames & masking',
        guideRate: 'Custom site quote',
      },
      {
        serviceLevel: 'Tile Replacement / Repair',
        scope: 'Broken/lifted floor tiles or kitchen backsplash install',
        guideRate: 'From ₦15,000 / spot',
      },
      {
        serviceLevel: 'Damp Wall & POP Repair',
        scope: 'Moisture-shield sealing, skimming & sunken POP patching',
        guideRate: 'From ₦20,000 repair',
      },
    ],
    faqs: [
      {
        question: 'My lower bedroom wall keeps peeling paint due to damp — can you stop it before repainting?',
        answer:
          'Yes. Scraping and painting right over damp fails within weeks. We strip weak plaster, check external/bathroom seepage, apply chemical damp-proof primer, re-screed with white cement/acrylic putty, then finish with satin paint.',
      },
    ],
    subServices: [
      {
        id: 'renovation-painting',
        name: 'Wall Screeding & Interior / Exterior Painting',
        summary:
          'Multi-coat satin, matte, or weather-shield exterior finishes, wall hairline crack skimming, and clean color changes.',
        typicalDuration: '1 – 5 days',
        startingEstimate: 'From ₦25,000 / room',
        includedChecklist: [
          'Floor, AC unit, socket & wardrobe masking tape protection',
          'Crack opening, putty filling & fine grit dust sanding',
          'Two uniform top coats with sharp ceiling cut lines',
        ],
        commonSymptoms: [
          'Scuffed tenant walls before moving into a flat',
          'Sun-faded exterior paint or patchy stains',
        ],
        materialsNote: 'Experienced with Dulux, Caplux, Berger, Sandtex, and Portland finishes.',
        handoverStandard: 'Zero roller streaks, crisp switch plate edges & mopped floor handover.',
      },
      {
        id: 'renovation-tiling',
        name: 'Floor & Wall Tiling (Porcelain, Marble, Kitchens)',
        summary:
          'Tenting/popped tile relay, wet bathroom retiling with proper slope, granite backsplashes, and re-grouting.',
        typicalDuration: '1 – 4 days',
        startingEstimate: 'Quote by area (m²)',
        includedChecklist: [
          'Anti-popping tile adhesive buttering + leveling clips',
          'Correct gradient slope toward bathroom floor gully',
          'Stain-resistant waterproof epoxy/cement grout sealing',
        ],
        commonSymptoms: [
          'Hollow-sounding or popped sitting-room floor tiles',
          'Leaky bathroom grout seeping into downstairs ceiling',
        ],
        materialsNote: 'Laser leveling and wet diamond saw cuts with zero jagged edges.',
        handoverStandard: 'Level lippage check passed and water drainage slope verified.',
      },
      {
        id: 'renovation-pop',
        name: 'POP Ceilings, LED Coves & Rising Damp Repair',
        summary:
          'Water-stained POP replacement, minimalist false ceiling molding, and moisture-barrier wall skimming.',
        typicalDuration: '1 – 3 days',
        startingEstimate: 'From ₦20,000 repair',
        includedChecklist: [
          'Fiber-mesh reinforced gypsum casting with corrosion-free tie wire',
          'Seamless plaster skimming matched to adjacent ceiling height',
          'Cutout coordination for recessed downlights & fans',
        ],
        commonSymptoms: [
          'Sagging or brown water-stained POP after roof/AC leak fix',
        ],
        materialsNote: 'Pure fine casting plaster & damp-block sealants.',
        handoverStandard: 'Smooth jointless surface ready for priming and ceiling emulsion.',
      },
    ],
  },
  {
    id: 'cleaning-fumigation',
    title: 'Deep Cleaning & Odorless Fumigation',
    shortName: 'Cleaning & Pest Control',
    tagline: 'Move-in deep clean, post-construction scrub, upholstery steam & WHO pest control',
    overview:
      'Uniformed sanitation crews arriving with rotary floor scrubbers, HEPA vacuums, upholstery extractors, and low-odor eco pest treatments.',
    image: '/assets/images/service_home_tech_hero_1795702144709.jpg',
    responseWindow: 'Next-morning or urgent crew dispatch',
    warrantyLabel: 'Full room-by-room walkthrough sign-off',
    teamStandard: 'Color-coded microfiber cloths separating kitchen, bath & living areas',
    popularAreas: ['Victoria Island', 'Lekki', 'Ikeja', 'Yaba', 'Ajah'],
    rateTable: [
      {
        serviceLevel: '1–2 Bedroom Deep Clean',
        scope: 'Windows, tracks, kitchen degreasing, bath descaling & mopping',
        guideRate: '₦25,000 – ₦40,000',
      },
      {
        serviceLevel: '3–5 Bedroom / Duplex Post-Build',
        scope: 'Paint/cement stain removal, cabinet wipe & machine floor polish',
        guideRate: '₦50,000 – ₦95,000',
      },
      {
        serviceLevel: 'Eco Odorless Fumigation',
        scope: 'Cockroaches, ants, mosquitoes, bedbugs & rodent barrier',
        guideRate: '₦18,000 – ₦35,000',
      },
    ],
    faqs: [
      {
        question: 'How soon can my family enter the house after odorless fumigation?',
        answer:
          'Usually within 2 to 3 hours after ventilation. Our gel baiting and targeted micro-encapsulated sprays leave no choking chemical smell.',
      },
    ],
    subServices: [
      {
        id: 'cleaning-deep',
        name: 'Move-In & Post-Construction Deep Cleaning',
        summary:
          'Detailed scrubbing of paint splatters, cement haze, sliding window tracks, kitchen range hoods, and tiled bathrooms.',
        typicalDuration: '3 – 7 hrs',
        startingEstimate: 'From ₦25,000 crew',
        includedChecklist: [
          'Ceiling cobwebs, AC filters, fans & chandeliers wiped',
          'Glass shower screens & toilet bases descaled free of limescale',
          'Inside & outside wipe of kitchen cabinets, cooker & extractor',
        ],
        commonSymptoms: [
          'Dust and paint drops left after builders or painters leave',
          'Pre-move-in hygiene refresh on a newly rented apartment',
        ],
        materialsNote: 'Crew brings industrial wet/dry vacuums, ladders, and safe neutral cleaners.',
        handoverStandard: 'Clean-glove inspection across window sills, cabinets, and bathroom glass.',
      },
      {
        id: 'cleaning-fumigation',
        name: 'Odorless Pest Control & Targeted Fumigation',
        summary:
          'Long-acting treatment against kitchen cockroaches, bedbugs, mosquitoes, sugar ants, and compound rodents.',
        typicalDuration: '1 – 2 hrs',
        startingEstimate: 'From ₦18,000 flat',
        includedChecklist: [
          'Cabinet hinge, drain gully & behind-fridge crevice treatment',
          'Targeted mattress/skirting thermal or mist spray (for bedbugs)',
          'Compound soakaway & outdoor perimeter larvicide spray',
        ],
        commonSymptoms: [
          'Kitchen roaches emerging around fridge compressor or sink hinges',
          'Pre-move-in preventive pest barrier',
        ],
        materialsNote: 'WHO-approved low-toxicity odorless formulations safe around furnishings.',
        handoverStandard: 'Safe re-entry window confirmed + drainage prevention tips shared.',
      },
    ],
  },
  {
    id: 'welding-fabrication',
    title: 'Welding, Steel Gates & Aluminum Works',
    shortName: 'Welding & Aluminum',
    tagline: 'Sliding gate repairs, burglary proof, tank stands, carports & aluminum windows',
    overview:
      'Mobile arc/inverter welders and aluminum fabricators for residential security gates, galvanized tank towers, burglary protection, and sliding window net repairs.',
    image: '/assets/images/service_home_tech_hero_1795702144709.jpg',
    responseWindow: 'Same-day mobile weld / site measure',
    warrantyLabel: 'Red-oxide anti-rust coat applied on fresh welds',
    teamStandard: 'Clean weld grinding & protective ground sheets',
    popularAreas: ['Igando', 'Ikeja', 'Lekki', 'Festac', 'Surulere'],
    rateTable: [
      {
        serviceLevel: 'Gate Hinge / Roller Welding',
        scope: 'Broken sliding gate track, pulley swap or lockbox repair',
        guideRate: '₦15,000 – ₦28,000',
      },
      {
        serviceLevel: 'Aluminum Window / Net Repair',
        scope: 'Mosquito net re-mesh, sliding rollers & latches',
        guideRate: '₦12,000 – ₦22,000',
      },
      {
        serviceLevel: 'Water Tank Stand Fabrication',
        scope: 'Custom 1,000L–5,000L heavy angle-iron / H-beam scaffold',
        guideRate: 'Custom quote',
      },
    ],
    faqs: [
      {
        question: 'My heavy compound sliding gate derailed or is dragging on the floor — do you bring a welder on-site?',
        answer:
          'Yes. Our welders bring compact inverter welding gear, angle grinders, and spare heavy steel rollers directly to your compound.',
      },
    ],
    subServices: [
      {
        id: 'welding-gates',
        name: 'Compound Gates, Rollers, Handrails & Burglary Proof',
        summary:
          'On-site gate hinge re-welding, track straightening, staircase handrails, and fitted window security grilles.',
        typicalDuration: '2 – 6 hrs',
        startingEstimate: 'From ₦15,000 labour',
        includedChecklist: [
          'Mobile inverter welder setup with clean slag grinding',
          'Heavy-duty steel gate bearing roller replacement',
          'Anti-rust red oxide primer over all exposed welds',
        ],
        commonSymptoms: [
          'Compound gate leaning, scraping compound interlock, or off track',
          'Broken lock staple or loose balcony handrail',
        ],
        materialsNote: 'Uses thick-gauge steel pipe/flat bar; finishes primed cleanly.',
        handoverStandard: 'Gate rolls smoothly end-to-end with zero derailment play.',
      },
      {
        id: 'welding-aluminum',
        name: 'Aluminum Sliding Windows, Netting & Tank Towers',
        summary:
          'Torn mosquito net mesh replacement, stuck window rollers, weather sealing, and raised steel water tank stands.',
        typicalDuration: '2 hrs – 2 days',
        startingEstimate: 'From ₦12,000 labour',
        includedChecklist: [
          'Weatherproof fiberglass or aluminum mosquito mesh fitting',
          'Rain-leak outer frame silicone bead sealing',
          'Braced tank platform welded to distribute full water weight',
        ],
        commonSymptoms: [
          'Mosquito net torn allowing insects inside bedrooms',
          'Rain leaking through aluminum window bottom channel',
        ],
        materialsNote: 'Anodized black, silver, champagne & bronze aluminum trims available.',
        handoverStandard: 'Windows glide freely and lock firmly; net tension taught on all corners.',
      },
    ],
  },
];
