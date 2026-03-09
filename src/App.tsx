import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Loader2, ArrowRight, Briefcase, Building2, Target } from 'lucide-react';

const SECTORS = [
  'D2C / E-commerce',
  'SaaS',
  'Fintech',
  'Retail (offline + omnichannel)',
  'Real Estate',
  'Healthcare',
  'Edtech',
  'Logistics / Supply Chain'
];
const STAGES = ['Early', 'Scaling', 'Mature'];

const REVENUE_TRAJECTORIES = [
  "Growing fast but margins are thinning",
  "Flat — growth has plateaued",
  "Inconsistent — good months and bad months with no clear pattern",
  "Declining"
];

const ACQUISITION_CHANNELS = [
  "Paid digital (Meta, Google)",
  "Organic / SEO / Content",
  "Referrals / Word of mouth",
  "Direct sales / Outbound",
  "Partnerships / Channels",
  "Not clearly tracked"
];

const CAC_AWARENESS_OPTIONS = [
  "Yes, tracked in real time",
  "Roughly — checked occasionally",
  "No visibility"
];

const VENDOR_SITUATIONS = [
  "Stable and well managed",
  "Works but has recurring friction points",
  "Frequently causes delays or cash flow stress",
  "Not applicable to my business"
];

const CASH_FLOW_VISIBILITIES = [
  "Clear visibility with forecasts",
  "Rough idea but not structured",
  "Reactive — we find out when it is a problem",
  "Not monitored formally"
];

const WORKING_CAPITAL_PRESSURES = [
  "Comfortable — no immediate pressure",
  "Tight but manageable",
  "Under stress — affecting decisions",
  "Critical"
];

const TEAM_STRUCTURES = [
  "Founder or COO doing most things directly",
  "Small core team, everyone wearing multiple hats",
  "Functional teams in place but coordination is breaking down",
  "Scaled team with clear owners per function"
];

const REPORTING_SITUATIONS = [
  "Data dashboards reviewed regularly",
  "Ad hoc — pulled when needed",
  "Gut and experience, minimal data",
  "No structured reporting in place"
];

interface DiagnosticOutput {
  biggestLever: string;
  frictionPoints: {
    revenue: string;
    operations: string;
    reporting: string;
  };
  ninetyDayPlan: string[];
  uncomfortableQuestion: string;
  closingLine: string;
  teamAndOrgRisk?: string;
  financialRisk?: string;
  theHardestThing?: string;
}

export default function App() {
  const [mode, setMode] = useState<'quick' | 'deep'>('quick');
  const [company, setCompany] = useState('');
  const [sector, setSector] = useState(SECTORS[0]);
  const [stage, setStage] = useState(STAGES[0]);
  
  // Deep Diagnostic State
  const [revenueTrajectory, setRevenueTrajectory] = useState(REVENUE_TRAJECTORIES[0]);
  const [biggestRevenueBlocker, setBiggestRevenueBlocker] = useState('');
  const [primaryAcquisitionChannel, setPrimaryAcquisitionChannel] = useState(ACQUISITION_CHANNELS[0]);
  const [cacAwareness, setCacAwareness] = useState(CAC_AWARENESS_OPTIONS[0]);
  const [operationalBottleneck, setOperationalBottleneck] = useState('');
  const [vendorSituation, setVendorSituation] = useState(VENDOR_SITUATIONS[0]);
  const [cashFlowVisibility, setCashFlowVisibility] = useState(CASH_FLOW_VISIBILITIES[0]);
  const [workingCapitalPressure, setWorkingCapitalPressure] = useState(WORKING_CAPITAL_PRESSURES[0]);
  const [teamStructure, setTeamStructure] = useState(TEAM_STRUCTURES[0]);
  const [reportingSituation, setReportingSituation] = useState(REPORTING_SITUATIONS[0]);
  const [keepingUpAtNight, setKeepingUpAtNight] = useState('');

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<DiagnosticOutput | null>(null);
  const [error, setError] = useState('');

  const handleModeSwitch = (newMode: 'quick' | 'deep') => {
    if (newMode === mode) return;
    setMode(newMode);
    // Clear inputs
    setCompany('');
    setSector(SECTORS[0]);
    setStage(STAGES[0]);
    setRevenueTrajectory(REVENUE_TRAJECTORIES[0]);
    setBiggestRevenueBlocker('');
    setPrimaryAcquisitionChannel(ACQUISITION_CHANNELS[0]);
    setCacAwareness(CAC_AWARENESS_OPTIONS[0]);
    setOperationalBottleneck('');
    setVendorSituation(VENDOR_SITUATIONS[0]);
    setCashFlowVisibility(CASH_FLOW_VISIBILITIES[0]);
    setWorkingCapitalPressure(WORKING_CAPITAL_PRESSURES[0]);
    setTeamStructure(TEAM_STRUCTURES[0]);
    setReportingSituation(REPORTING_SITUATIONS[0]);
    setKeepingUpAtNight('');
    setOutput(null);
    setError('');
  };

  const generateDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) {
      setError('Please enter a company name or description.');
      return;
    }

    setLoading(true);
    setError('');
    setOutput(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const quickSystemInstruction = `You are a founder's office operator who has worked directly with COOs and founders across D2C, SaaS, Fintech, Retail, Healthcare, Edtech, Real Estate, and Logistics businesses in India. You have personally managed vendor negotiations, built reporting systems from scratch, diagnosed revenue leaks, restructured operational workflows, and executed cross-functional projects with no supervision. You think in root causes, not symptoms. You prioritise cash flow and execution speed over strategy. You sequence actions by impact, not effort.

You are given a company name or description, a sector, and a stage. Your job is to produce a structured 90-day operational diagnostic for that business.

---

SECTOR + STAGE MATRIX

Use this matrix to identify the most relevant friction points for the given combination. Select the ones most applicable to the specific company described.

D2C / E-COMMERCE
Early: High CAC with no clear payback period, no post-purchase retention mechanic, inventory forecasting done manually, no contribution margin visibility per SKU, customer feedback not feeding into product decisions.
Scaling: CAC rising faster than LTV, supply chain strain from demand spikes, return rates eating margin silently, no cohort analysis to understand retention, performance marketing hitting diminishing returns.
Mature: Brand differentiation eroding, over-reliance on paid acquisition, no second product line or upsell mechanic, operational costs scaling linearly with revenue, wholesale vs direct channel conflict.

SAAS
Early: No clear ICP defined, sales cycle too long for runway, onboarding drop-off before activation, pricing not tied to value metric, founder doing all sales with no repeatable process.
Scaling: Churn masking growth, customer success under-resourced vs sales, product roadmap driven by loudest customer not data, revenue concentration risk in top 3 accounts, no expansion revenue motion.
Mature: Net revenue retention below 110%, sales and marketing misaligned on pipeline quality, technical debt slowing product velocity, enterprise deals stalling procurement, category definition becoming commoditised.

FINTECH
Early: Compliance and regulatory bottlenecks slowing go-to-market, unit economics not proven at small scale, B2B sales cycle longer than expected, onboarding drop-off due to KYC friction, dependency on one banking or NBFC partner.
Scaling: Fraud rates rising with scale, collections efficiency dropping, cost of compliance scaling with headcount not automation, customer support volume growing faster than revenue, regulatory risk concentrated in one product.
Mature: Net interest margin compression, over-reliance on one acquisition channel, credit model performance degrading in new geographies, embedded finance partnerships not converting, talent retention in engineering.

RETAIL (OFFLINE + OMNICHANNEL)
Early: Inventory visibility across locations is manual, no customer data being captured at point of sale, vendor payment cycles straining working capital, staff training and retention high cost, no understanding of per-store unit economics.
Scaling: Inconsistent customer experience across locations, supply chain not built for omnichannel, online and offline pricing creating channel conflict, store P&L visibility delayed by weeks, expansion decisions made on gut not data.
Mature: Same-store sales growth stagnating, private label margins not materialising, loyalty program not driving incremental revenue, real estate costs fixed against variable demand, e-commerce cannibalising offline without clear strategy.

HEALTHCARE
Early: Patient acquisition cost high with no referral mechanic, doctor or specialist dependency creating single point of failure, insurance and TPA claim cycles destroying cash flow, no digital health record creating repeat visit friction, regulatory compliance consuming founder bandwidth.
Scaling: Quality consistency across locations or doctors, insurance empanelment delays blocking revenue, operational complexity of diagnostics vs consultation vs pharmacy under one roof, no data infrastructure to understand patient lifetime value, staff burnout and attrition.
Mature: EBITDA margins thin due to high fixed costs, technology adoption by clinical staff low, no preventive care revenue stream, brand not differentiated in commoditised segments, expansion into tier 2 cities operationally expensive.

EDTECH
Early: Content production costs high before product market fit proven, B2C CAC unsustainable, completion rates low destroying word of mouth, no clear outcome metric to sell against, over-reliance on founder's personal brand.
Scaling: B2B2C or institutional sales cycle longer than B2C cash flow supports, content library becoming a maintenance liability, instructor quality inconsistency at scale, refund rates high signalling outcome gap, no community or network effect built in.
Mature: Revenue concentration in one course or category, international expansion unit economics not proven, platform commoditisation as competitors copy content, alumni outcomes not being tracked or marketed, technology platform costs scaling with users not revenue.

REAL ESTATE
Early: Lead quality poor from digital channels, sales cycle too long for working capital, project delivery delays destroying referral pipeline, no CRM or lead tracking in place, broker dependency with no direct channel.
Scaling: Collections efficiency dropping as project pipeline grows, customer complaints post-booking handled reactively, construction vendor management creating delays, no systematic upsell or upgrade motion, legal and approval bottlenecks not mapped or tracked.
Mature: Unsold inventory in completed projects tying up capital, brand differentiation weak in commoditised micro-markets, NPS low due to post-handover service gaps, new project launches dependent on completing sales of current pipeline, regulatory compliance costs rising.

LOGISTICS / SUPPLY CHAIN
Early: Network density too low for unit economics to work, technology for tracking and visibility manual or absent, driver or fleet acquisition and retention costly, customer concentration risk in top 2-3 accounts, SLA breach rate high damaging retention.
Scaling: Cost per delivery not improving with volume, last mile efficiency plateauing, no data infrastructure to optimise routing or load, enterprise contracts requiring capabilities not yet built, working capital stress from long payment cycles with large clients.
Mature: Margin compression from fuel and labour cost inflation, platform commoditisation with price as only differentiator, cross-border or new corridor expansion unit economics unproven, technology debt in core operations platform, talent in operations and technology hard to retain.

---

OUTPUT RULES

1. Output must be valid JSON only. No text before or after the JSON block.
2. Every field must follow the length constraints below exactly.
3. Be specific to the sector, stage, and company described. Never give generic output.
4. If the company name or description is unclear or fictional, still produce a diagnosis based on the sector and stage provided.

LENGTH CONSTRAINTS
- biggestLever: One sentence, maximum 25 words.
- frictionPoints.revenue: 2-3 sentences maximum.
- frictionPoints.operations: 2-3 sentences maximum.
- frictionPoints.reporting: 2-3 sentences maximum.
- ninetyDayPlan: Three items. Each item maximum 30 words.
- uncomfortableQuestion: One sentence, maximum 30 words.
- closingLine: Always exactly this — "This is how I think. Imagine what I'd find in week one inside your business."

---

OUTPUT FORMAT

{
  "biggestLever": "",
  "frictionPoints": {
    "revenue": "",
    "operations": "",
    "reporting": ""
  },
  "ninetyDayPlan": [
    "1. ",
    "2. ",
    "3. "
  ],
  "uncomfortableQuestion": "",
  "closingLine": "This is how I think. Imagine what I'd find in week one inside your business."
}

---

EXAMPLE OUTPUT

Input: Company — Zepto, Sector — D2C / E-commerce, Stage — Scaling

{
  "biggestLever": "Fix contribution margin visibility per dark store before expanding to new cities.",
  "frictionPoints": {
    "revenue": "CAC is rising faster than LTV as paid acquisition scales. There is no post-purchase retention mechanic beyond discounting, which is compressing margins silently.",
    "operations": "Supply chain strain is appearing at demand spikes with no buffer inventory logic per location. Return rates are being tracked at aggregate level, masking per-SKU margin destruction.",
    "reporting": "Store-level P&L is not visible in real time. Expansion decisions are being made on GMV growth without contribution margin data per dark store."
  },
  "ninetyDayPlan": [
    "1. Build per-dark-store contribution margin dashboard — identify the 3 highest and lowest performing locations by unit economics within 30 days.",
    "2. Implement post-purchase retention sequence — push notifications, reorder nudges, and loyalty mechanic — target 15% repeat purchase rate improvement by day 60.",
    "3. Restructure CAC reporting by cohort and channel — cut or reprice the two lowest-performing acquisition channels by day 90."
  ],
  "uncomfortableQuestion": "If you removed your top 3 performing dark stores from the numbers, would this business still look like it's working?",
  "closingLine": "This is how I think. Imagine what I'd find in week one inside your business."
}`;

      const deepSystemInstruction = `You are a founder's office operator who has worked directly with COOs and founders across D2C, SaaS, Fintech, Retail, Healthcare, Edtech, Real Estate, and Logistics businesses in India. You have personally managed vendor negotiations, built reporting systems from scratch, diagnosed revenue leaks, restructured operational workflows, and executed cross-functional projects with no supervision. You think in root causes, not symptoms. You prioritise cash flow and execution speed over strategy. You sequence actions by impact, not effort.

You are given a detailed 14-point operational diagnostic input for a business. Your job is to produce a structured, deep 90-day operational diagnostic for that business.

Analyze the provided company context, revenue, marketing, operations, finance, team, and open signals.
Provide the output strictly in the requested JSON format.

OUTPUT RULES
1. Output must be valid JSON only. No text before or after the JSON block.
2. Every field must follow the length constraints below exactly.
3. Be highly specific to the detailed inputs provided. Never give generic output.

LENGTH CONSTRAINTS
- biggestLever: One sentence, maximum 25 words.
- frictionPoints.revenue: 2-3 sentences maximum.
- frictionPoints.operations: 2-3 sentences maximum.
- frictionPoints.reporting: 2-3 sentences maximum.
- ninetyDayPlan: Three items. Each item maximum 30 words.
- uncomfortableQuestion: One sentence, maximum 30 words.
- teamAndOrgRisk: 2-3 sentences maximum.
- financialRisk: 2-3 sentences maximum.
- theHardestThing: 2-3 sentences maximum.
- closingLine: Always exactly this — "This is how I think. Imagine what I'd find in week one inside your business."
`;

      const systemInstruction = mode === 'quick' ? quickSystemInstruction : deepSystemInstruction;

      let prompt = '';
      if (mode === 'quick') {
        prompt = `Company Name/Description: ${company}\nSector: ${sector}\nStage: ${stage}`;
      } else {
        prompt = `Company: ${company}
Sector: ${sector}
Stage: ${stage}
Revenue trajectory: ${revenueTrajectory}
Biggest revenue blocker: ${biggestRevenueBlocker}
Primary acquisition channel: ${primaryAcquisitionChannel}
CAC awareness: ${cacAwareness}
Operational bottleneck: ${operationalBottleneck}
Vendor situation: ${vendorSituation}
Cash flow visibility: ${cashFlowVisibility}
Working capital pressure: ${workingCapitalPressure}
Team structure: ${teamStructure}
Reporting situation: ${reportingSituation}
The thing keeping them up at night: ${keepingUpAtNight}`;
      }

      const schemaProperties: any = {
        biggestLever: { type: Type.STRING, description: "One sentence, the highest impact move for this business right now" },
        frictionPoints: {
          type: Type.OBJECT,
          properties: {
            revenue: { type: Type.STRING },
            operations: { type: Type.STRING },
            reporting: { type: Type.STRING }
          },
          required: ["revenue", "operations", "reporting"]
        },
        ninetyDayPlan: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Three specific actions, sequenced by impact"
        },
        uncomfortableQuestion: { type: Type.STRING, description: "One uncomfortable question the COO should be sitting with" },
        closingLine: { type: Type.STRING, description: "Always exactly this — 'This is how I think. Imagine what I'd find in week one inside your business.'" }
      };

      const requiredFields = ["biggestLever", "frictionPoints", "ninetyDayPlan", "uncomfortableQuestion", "closingLine"];

      if (mode === 'deep') {
        schemaProperties.teamAndOrgRisk = { type: Type.STRING, description: "2-3 sentences maximum about team and org risk" };
        schemaProperties.financialRisk = { type: Type.STRING, description: "2-3 sentences maximum about financial risk" };
        schemaProperties.theHardestThing = { type: Type.STRING, description: "2-3 sentences maximum about the hardest thing" };
        requiredFields.push("teamAndOrgRisk", "financialRisk", "theHardestThing");
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: schemaProperties,
            required: requiredFields
          }
        }
      });

      if (response.text) {
        const parsedOutput = JSON.parse(response.text) as DiagnosticOutput;
        setOutput(parsedOutput);
      } else {
        throw new Error("No response received from the AI.");
      }
    } catch (err) {
      console.error(err);
      setError('damn that wasnt supposed to happen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-[#387F39] selection:text-white relative">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 relative z-10">
        
        {/* Header */}
        <header className="mb-16 flex flex-col items-center text-center">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black tracking-[0.15em] text-[#808285] leading-none ml-3">
              FIRST
            </h1>
            <div className="flex items-center relative mt-1">
              <span className="text-[5rem] md:text-[6.5rem] font-black text-[#387F39] leading-none tracking-tighter">
                90
              </span>
              <svg className="w-16 h-16 md:w-20 md:h-20 text-[#387F39] ml-1 -mt-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
          </div>
          <p className="text-zinc-500 text-lg md:text-xl max-w-xl leading-relaxed">
            A GTM diagnostic engine. Enter your business context, get a structured 90-day operational brief in 60 seconds.
          </p>
        </header>

        {/* Input Form */}
        <form onSubmit={generateDiagnostic} className="space-y-8 mb-16 bg-white p-8 border border-zinc-200 shadow-sm">
          
          {/* Mode Toggle */}
          <div className="flex flex-col sm:flex-row gap-2 mb-8 bg-zinc-100 p-1 rounded-lg w-full sm:w-fit mx-auto relative group">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Switching modes will clear your inputs
            </div>
            <button
              type="button"
              onClick={() => handleModeSwitch('quick')}
              className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-colors w-full sm:w-auto ${mode === 'quick' ? 'bg-white text-[#387F39] shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              Quick Scan
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('deep')}
              className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider transition-colors w-full sm:w-auto ${mode === 'deep' ? 'bg-white text-[#387F39] shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              Deep Diagnostic
            </button>
          </div>

          {mode === 'quick' ? (
            <>
              <div>
                <label htmlFor="company" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Company Context
                </label>
                <textarea
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company name or brief description of what you do..."
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors resize-none h-32 text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sector" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Sector
                  </label>
                  <select
                    id="sector"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors appearance-none cursor-pointer"
                  >
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="stage" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Stage
                  </label>
                  <select
                    id="stage"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors appearance-none cursor-pointer"
                  >
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-8">
              {/* SECTION 1 — BUSINESS CONTEXT */}
              <div className="flex items-center gap-4 mb-6 mt-8">
                <div className="h-px bg-zinc-200 flex-1"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Section 1 — Business Context</span>
                <div className="h-px bg-zinc-200 flex-1"></div>
              </div>
              
              <div>
                <label htmlFor="company-deep" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                  Company name or description
                </label>
                <input
                  type="text"
                  id="company-deep"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Réia Diamonds — lab grown jewellery brand in Bangalore"
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors text-base"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="sector-deep" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                    Sector
                  </label>
                  <select
                    id="sector-deep"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors appearance-none cursor-pointer"
                  >
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="stage-deep" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                    Stage
                  </label>
                  <select
                    id="stage-deep"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors appearance-none cursor-pointer"
                  >
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* SECTION 2 — REVENUE & GROWTH */}
              <div className="flex items-center gap-4 mb-6 mt-12">
                <div className="h-px bg-zinc-200 flex-1"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Section 2 — Revenue & Growth</span>
                <div className="h-px bg-zinc-200 flex-1"></div>
              </div>

              <div>
                <label htmlFor="revenueTrajectory" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                  Revenue trajectory
                </label>
                <select
                  id="revenueTrajectory"
                  value={revenueTrajectory}
                  onChange={(e) => setRevenueTrajectory(e.target.value)}
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors appearance-none cursor-pointer"
                >
                  {REVENUE_TRAJECTORIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="biggestRevenueBlocker" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                  Biggest revenue blocker
                </label>
                <input
                  type="text"
                  id="biggestRevenueBlocker"
                  value={biggestRevenueBlocker}
                  onChange={(e) => setBiggestRevenueBlocker(e.target.value)}
                  placeholder="What is the single biggest thing stopping revenue growth right now?"
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors text-base"
                  required
                />
              </div>

              {/* SECTION 3 — MARKETING & ACQUISITION */}
              <div className="flex items-center gap-4 mb-6 mt-12">
                <div className="h-px bg-zinc-200 flex-1"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Section 3 — Marketing & Acquisition</span>
                <div className="h-px bg-zinc-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="primaryAcquisitionChannel" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                    Primary acquisition channel
                  </label>
                  <select
                    id="primaryAcquisitionChannel"
                    value={primaryAcquisitionChannel}
                    onChange={(e) => setPrimaryAcquisitionChannel(e.target.value)}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors appearance-none cursor-pointer"
                  >
                    {ACQUISITION_CHANNELS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="cacAwareness" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                    CAC awareness
                  </label>
                  <select
                    id="cacAwareness"
                    value={cacAwareness}
                    onChange={(e) => setCacAwareness(e.target.value)}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors appearance-none cursor-pointer"
                  >
                    {CAC_AWARENESS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* SECTION 4 — OPERATIONS & VENDORS */}
              <div className="flex items-center gap-4 mb-6 mt-12">
                <div className="h-px bg-zinc-200 flex-1"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Section 4 — Operations & Vendors</span>
                <div className="h-px bg-zinc-200 flex-1"></div>
              </div>

              <div>
                <label htmlFor="operationalBottleneck" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                  Operational bottleneck
                </label>
                <input
                  type="text"
                  id="operationalBottleneck"
                  value={operationalBottleneck}
                  onChange={(e) => setOperationalBottleneck(e.target.value)}
                  placeholder="Where does execution most commonly break down or slow down?"
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors text-base"
                  required
                />
              </div>

              <div>
                <label htmlFor="vendorSituation" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                  Vendor / supply chain situation
                </label>
                <select
                  id="vendorSituation"
                  value={vendorSituation}
                  onChange={(e) => setVendorSituation(e.target.value)}
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors appearance-none cursor-pointer"
                >
                  {VENDOR_SITUATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* SECTION 5 — FINANCE & CASH FLOW */}
              <div className="flex items-center gap-4 mb-6 mt-12">
                <div className="h-px bg-zinc-200 flex-1"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Section 5 — Finance & Cash Flow</span>
                <div className="h-px bg-zinc-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="cashFlowVisibility" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                    Cash flow visibility
                  </label>
                  <select
                    id="cashFlowVisibility"
                    value={cashFlowVisibility}
                    onChange={(e) => setCashFlowVisibility(e.target.value)}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors appearance-none cursor-pointer"
                  >
                    {CASH_FLOW_VISIBILITIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="workingCapitalPressure" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                    Working capital pressure
                  </label>
                  <select
                    id="workingCapitalPressure"
                    value={workingCapitalPressure}
                    onChange={(e) => setWorkingCapitalPressure(e.target.value)}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors appearance-none cursor-pointer"
                  >
                    {WORKING_CAPITAL_PRESSURES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* SECTION 6 — TEAM & REPORTING */}
              <div className="flex items-center gap-4 mb-6 mt-12">
                <div className="h-px bg-zinc-200 flex-1"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Section 6 — Team & Reporting</span>
                <div className="h-px bg-zinc-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="teamStructure" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                    Team structure
                  </label>
                  <select
                    id="teamStructure"
                    value={teamStructure}
                    onChange={(e) => setTeamStructure(e.target.value)}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors appearance-none cursor-pointer"
                  >
                    {TEAM_STRUCTURES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="reportingSituation" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                    Reporting and decision making
                  </label>
                  <select
                    id="reportingSituation"
                    value={reportingSituation}
                    onChange={(e) => setReportingSituation(e.target.value)}
                    className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors appearance-none cursor-pointer"
                  >
                    {REPORTING_SITUATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* SECTION 7 — OPEN SIGNAL */}
              <div className="flex items-center gap-4 mb-6 mt-12">
                <div className="h-px bg-zinc-200 flex-1"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Section 7 — Open Signal</span>
                <div className="h-px bg-zinc-200 flex-1"></div>
              </div>

              <div>
                <label htmlFor="keepingUpAtNight" className="block text-sm font-semibold uppercase tracking-wider text-zinc-700 mb-2">
                  The thing keeping you up at night
                </label>
                <input
                  type="text"
                  id="keepingUpAtNight"
                  value={keepingUpAtNight}
                  onChange={(e) => setKeepingUpAtNight(e.target.value)}
                  placeholder="The one operational or business problem you have not been able to solve yet"
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 focus:border-[#387F39] focus:ring-0 transition-colors text-base"
                  required
                />
              </div>
            </div>
          )}

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#387F39] text-white py-4 px-6 font-semibold hover:bg-[#2d662e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Diagnosing...
              </>
            ) : (
              <>
                {mode === 'quick' ? 'Generate Brief' : 'Run Deep Diagnostic'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Output Display */}
        {output && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="bg-white border-t-4 border-[#387F39] shadow-sm p-8 md:p-12 space-y-12">
              
              {/* The Biggest Lever */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#387F39] mb-4">01 / The Biggest Lever</h2>
                <p className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-zinc-900">
                  {output.biggestLever}
                </p>
              </section>

              <hr className="border-zinc-100" />

              {/* Friction Points */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#387F39] mb-6">02 / Friction Points</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 mb-3 border-b border-zinc-200 pb-2">Revenue</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed">{output.frictionPoints.revenue}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 mb-3 border-b border-zinc-200 pb-2">Operations</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed">{output.frictionPoints.operations}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 mb-3 border-b border-zinc-200 pb-2">Reporting</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed">{output.frictionPoints.reporting}</p>
                  </div>
                </div>
              </section>

              <hr className="border-zinc-100" />

              {/* 90-Day Plan */}
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#387F39] mb-6">03 / The 90-Day Plan</h2>
                <ol className="space-y-6">
                  {output.ninetyDayPlan.map((action, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="text-zinc-300 font-mono font-bold">{(index + 1).toString().padStart(2, '0')}</span>
                      <p className="text-zinc-800 leading-relaxed">{action}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <hr className="border-zinc-100" />

              {/* Uncomfortable Question */}
              <section className="bg-[#F8F9FA] p-6 md:p-8 border-l-4 border-[#387F39]">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#808285] mb-3">04 / The Question You're Not Asking</h2>
                <p className="text-lg md:text-xl font-bold text-zinc-900 italic">
                  "{output.uncomfortableQuestion}"
                </p>
              </section>

              {/* Deep Diagnostic Extra Sections */}
              {mode === 'deep' && output.teamAndOrgRisk && (
                <>
                  <hr className="border-zinc-100" />
                  <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-[#387F39] mb-4">05 / Team & Org Risk</h2>
                    <p className="text-zinc-600 leading-relaxed">
                      {output.teamAndOrgRisk}
                    </p>
                  </section>
                </>
              )}

              {mode === 'deep' && output.financialRisk && (
                <>
                  <hr className="border-zinc-100" />
                  <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-[#387F39] mb-4">06 / Financial Risk</h2>
                    <p className="text-zinc-600 leading-relaxed">
                      {output.financialRisk}
                    </p>
                  </section>
                </>
              )}

              {mode === 'deep' && output.theHardestThing && (
                <>
                  <hr className="border-zinc-100" />
                  <section>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-[#387F39] mb-4">07 / The Hardest Thing</h2>
                    <p className="text-zinc-600 leading-relaxed">
                      {output.theHardestThing}
                    </p>
                  </section>
                </>
              )}

            </div>

            {/* Footer Contact Line */}
            <div className="mt-12 text-center pb-12">
              <p className="text-zinc-500 font-medium">
                {output.closingLine}
              </p>
              <a href="mailto:hello@example.com" className="inline-block mt-4 text-sm font-bold uppercase tracking-widest text-[#387F39] hover:text-[#2d662e] transition-colors border-b border-[#387F39] hover:border-[#2d662e] pb-1">
                Let's Talk
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
