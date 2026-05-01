import { useState, useEffect, useRef } from "react";

// ─── GOOGLE FONTS ────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap";
document.head.appendChild(fontLink);

// ─── THEME ───────────────────────────────────────────────────────────────────
const T = {
  sage:    "#3a5e4e",
  sageDk:  "#263f34",
  sageXdk: "#1a2e26",
  sageLt:  "#6b9e82",
  sagePale:"#e6eeea",
  cream:   "#faf7f2",
  cream2:  "#f3ede4",
  terra:   "#b06b44",
  terraLt: "#f0e0d4",
  sand:    "#c9b99a",
  text:    "#2a2a2a",
  textMd:  "#5a6660",
  textLt:  "#8a9890",
  white:   "#ffffff",
  warn:    "#c0392b",
  warnLt:  "#fdf0ee",
  amber:   "#b07d2b",
  amberLt: "#fdf6e3",
  border:  "#ddd8d0",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

const ASSETS = [
  { id:"bank",        icon:"🏦", label:"Bank or credit union accounts" },
  { id:"property",    icon:"🏠", label:"Home or real estate" },
  { id:"investments", icon:"📈", label:"Retirement or investments (401K, IRA)" },
  { id:"car",         icon:"🚗", label:"Vehicle or car" },
  { id:"insurance",   icon:"📋", label:"Life insurance policy" },
  { id:"digital",     icon:"💻", label:"Subscriptions & digital accounts" },
  { id:"pension",     icon:"🏛",  label:"Pension or government benefits" },
  { id:"business",    icon:"💼", label:"Small business or self-employment" },
];

const RELATIONSHIPS = [
  { id:"spouse",   label:"Spouse or domestic partner" },
  { id:"child",    label:"Adult child or next of kin" },
  { id:"executor", label:"Named executor of the estate" },
  { id:"sibling",  label:"Sibling or other family member" },
  { id:"friend",   label:"Close friend or representative" },
];

const TIMINGS = [
  { id:"days",    label:"Within the last few days",    urgent: true },
  { id:"week",    label:"Within the last week",        urgent: true },
  { id:"month",   label:"2–4 weeks ago",               urgent: false },
  { id:"months3", label:"1–3 months ago",              urgent: false },
  { id:"longer",  label:"More than 3 months ago",      urgent: false },
];

// ─── CHECKLIST BUILDER ───────────────────────────────────────────────────────
function buildChecklist({ state, assets, relationship, timing, hasWill }) {
  const urgent = ["days","week"].includes(timing);
  const w1=[], w2=[],  m2=[];

  // Week 1 — always
  w1.push({ id:"dc",  task:"Order 10–15 certified death certificates", priority:"critical",
    note:"Request more than you think. Banks, insurance companies, and government agencies each require a certified original — photocopies are not accepted." });
  w1.push({ id:"ssa", task:"Notify Social Security Administration (1-800-772-1213)", priority:"critical",
    note:"Any SSA payment deposited after the date of death must be returned in full. Notify them immediately to avoid a repayment demand." });
  w1.push({ id:"credit", task:"Freeze the deceased's credit with all 3 bureaus", priority:"critical",
    note:"Contact Equifax, Experian, and TransUnion separately. This prevents identity theft and fraudulent accounts in the deceased's name." });
  w1.push({ id:"will", task:"Locate and secure the original will", priority:"high",
    note:"Check home safes, filing cabinets, and safety deposit boxes. Contact their attorney if you believe one exists but can't find it." });
  w1.push({ id:"employer", task:"Notify employer and request final paycheck and benefits info", priority:"high",
    note:"Ask about any unpaid wages, accrued vacation payout, pension, group life insurance, and continuation of health benefits (COBRA)." });
  w1.push({ id:"family", task:"Notify immediate family, close friends, and clergy", priority:"high" });

  if (assets.includes("insurance")) {
    w1.push({ id:"li", task:"File life insurance claim immediately", priority:"critical",
      note:"Most insurers pay within 30–60 days of receiving a complete claim. Delays cost beneficiaries nothing legally, but starting early matters." });
  }
  if (relationship === "spouse") {
    w1.push({ id:"survivor", task:"Apply for Social Security survivor benefits if eligible", priority:"high",
      note:"Surviving spouses may qualify for ongoing monthly benefits. Call SSA or visit your local office. Bring the marriage certificate and death certificate." });
  }

  // Weeks 2–4
  w2.push({ id:"mail", task:"Redirect mail with USPS Change of Address or Hold Mail", priority:"medium" });
  w2.push({ id:"health", task:"Notify health insurance provider and cancel or transfer coverage", priority:"high",
    note:"If you were covered under their plan, you typically have 60 days to enroll in COBRA or find new coverage. Don't miss this window." });

  if (assets.includes("bank")) {
    w2.push({ id:"banks", task:"Notify all banks and credit unions — present the death certificate", priority:"high",
      note:"Individual accounts will be frozen. Joint accounts typically transfer automatically. Ask about any safe deposit boxes." });
    w2.push({ id:"autopay", task:"Cancel or redirect all automatic payments and direct deposits", priority:"high",
      note:"Check 3 months of bank statements carefully. Subscriptions, insurance premiums, and memberships are easy to miss." });
  }
  if (assets.includes("investments")) {
    w2.push({ id:"invest", task:"Contact brokerage, 401K, and IRA providers to file beneficiary claims", priority:"high",
      note:"Named beneficiaries on retirement accounts bypass probate entirely. This is often the fastest asset to transfer." });
  }
  if (assets.includes("pension")) {
    w2.push({ id:"pension", task:"Notify pension administrator and any veteran's benefits office", priority:"high",
      note:"Contact the VA at 1-800-827-1000 if the deceased was a veteran. Survivor pension benefits may be available." });
  }
  if (assets.includes("car")) {
    w2.push({ id:"car", task:`Transfer or retitle vehicle at the ${state} DMV`, priority:"medium",
      note:"Bring the death certificate, original title, and your ID. Some states allow small estate affidavits for vehicle transfer without probate." });
  }
  if (assets.includes("digital")) {
    w2.push({ id:"subs", task:"Cancel subscriptions (streaming, phone, software, memberships)", priority:"medium",
      note:"Check their email inbox for subscription receipts — this is the fastest way to find everything. Also check PayPal and Venmo for recurring payments." });
    w2.push({ id:"social", task:"Handle social media accounts — memorialize or delete", priority:"low",
      note:"Facebook, Instagram, Google, and Apple all have official legacy contact or account removal processes. Each requires a death certificate." });
    w2.push({ id:"email", task:"Decide what to do with email and cloud storage accounts", priority:"low",
      note:"Google and Apple both have inactive account policies. Download important files (photos, documents) before accounts are closed." });
  }
  w2.push({ id:"utilities", task:"Cancel or transfer utilities — electric, gas, water, internet, phone", priority:"medium" });
  w2.push({ id:"dmv2", task:`Cancel driver's license at the ${state} DMV`, priority:"medium" });
  w2.push({ id:"voter", task:"Cancel voter registration with the county election office", priority:"low" });
  w2.push({ id:"passport", task:"Cancel passport (mail to State Department with death certificate)", priority:"low" });
  if (assets.includes("bank")) {
    w2.push({ id:"estate_acct", task:"Open an estate bank account to manage estate funds", priority:"medium",
      note:"All incoming estate funds (asset sales, refunds, final paychecks) should flow through a single dedicated account for clean record-keeping." });
  }

  // Month 2–3
  if (assets.includes("property")) {
    m2.push({ id:"probate", task:`Determine if probate is required in ${state} for real estate transfer`, priority:"critical",
      note:`${state} has specific probate thresholds. Real property almost always requires probate unless held in a trust or joint tenancy with right of survivorship.` });
    m2.push({ id:"mortgage", task:"Notify mortgage lender and homeowner's insurance company", priority:"high",
      note:"Lenders must be notified promptly. The estate is responsible for mortgage payments until the property is transferred or sold." });
    m2.push({ id:"propertytax", task:"Continue paying property taxes and maintain homeowner's insurance", priority:"high",
      note:"Lapses in insurance or property tax payments can jeopardize the estate's assets during the settlement period." });
    m2.push({ id:"atty", task:"Consult an estate attorney about property title transfer or sale", priority:"high" });
  } else {
    m2.push({ id:"probate2", task:`Check if formal probate is required in ${state} for other assets`, priority:"high",
      note:"Even without real estate, courts may need to appoint an administrator. Many states have simplified small estate procedures for estates under a certain value." });
  }

  if (hasWill === "no") {
    m2.push({ id:"intestate", task:"Work with the court to appoint an estate administrator (intestate process)", priority:"critical",
      note:`Because there is no will, ${state}'s intestacy laws determine how assets are distributed. A court-appointed administrator manages the process.` });
  }

  if (assets.includes("business")) {
    m2.push({ id:"biz", task:"Notify business partners, clients, vendors, and accountant", priority:"high" });
    m2.push({ id:"biztax", task:"File final business tax returns and arrange ownership transfer or wind-down", priority:"high" });
  }

  m2.push({ id:"taxes", task:"File the deceased's final federal and state income tax return", priority:"high",
    note:"Due April 15 of the year following death. An estate tax return (Form 706) may also be required if the estate exceeds federal thresholds." });
  m2.push({ id:"distribute", task:"Distribute assets to beneficiaries according to the will or state law", priority:"high" });
  m2.push({ id:"close", task:"File final accounting with the court and close the estate formally", priority:"medium" });

  if (relationship === "spouse") {
    m2.push({ id:"ownwill", task:"Update your own will, beneficiary designations, and financial accounts", priority:"high",
      note:"After losing a spouse, it's critical to update your own estate plan. Financial advisors often recommend doing this within 6 months." });
    m2.push({ id:"fadvisor", task:"Consider meeting a financial advisor about your new financial situation", priority:"medium" });
  }

  return { w1, w2, m2 };
}

// ─── LETTERS ─────────────────────────────────────────────────────────────────
const LETTERS = [
  {
    id:"ssa", title:"Social Security Administration", icon:"🏛",
    tag:"Most urgent",
    body:(n,d,s,r) => `[Your Name]\n[Your Address]\n[City, State, ZIP]\n[Date]\n\nSocial Security Administration\nOffice of Earnings & International Operations\nP.O. Box 17769\nBaltimore, MD 21235-7769\n\nRE: Notification of Death — ${n||"[Full Name of Deceased]"}\n\nDear Sir or Madam,\n\nI am writing to formally notify the Social Security Administration of the passing of ${n||"[Full Name of Deceased]"}, who died on ${d||"[Date of Death]"} in [City], ${s||"[State]"}.\n\nI am the ${r||"[your relationship]"} of the deceased. Please update your records accordingly and discontinue any further Social Security payments. I understand that any payments deposited after the date of death must be returned promptly.\n\nEnclosed please find a certified copy of the death certificate for your records. If a survivor benefit application is appropriate, I am prepared to provide any additional documentation required.\n\nPlease contact me with any questions:\n\nPhone: [Your Phone Number]\nEmail: [Your Email Address]\n\nThank you for your time and assistance.\n\nSincerely,\n\n[Your Signature]\n[Your Printed Name]\n\nEnclosures: Certified Copy of Death Certificate`
  },
  {
    id:"bank", title:"Bank or Credit Union", icon:"🏦",
    tag:"High priority",
    body:(n,d,s,r) => `[Your Name]\n[Your Address]\n[City, State, ZIP]\n[Date]\n\n[Bank Name]\nEstate Services Department\n[Bank Address]\n\nRE: Notification of Death & Account Review — ${n||"[Full Name of Deceased]"}\nAccount Number(s): [Account Number(s)]\n\nDear Estate Services Team,\n\nI am writing to inform you of the passing of ${n||"[Full Name of Deceased]"}, who passed away on ${d||"[Date of Death]"}. I am the ${r||"[executor/spouse/next of kin]"} of the estate.\n\nI am requesting that you:\n1. Note the death in your records\n2. Freeze any solely-held accounts pending estate administration\n3. Provide information on the process for transferring or closing accounts\n4. Advise on any safe deposit box associated with the account\n\nEnclosed is a certified copy of the death certificate. I am also prepared to provide Letters Testamentary or other legal documentation as required.\n\nPlease contact me at [Your Phone Number] or [Your Email] to advise on next steps.\n\nSincerely,\n\n[Your Signature]\n[Your Printed Name — Relationship to Deceased]\n\nEnclosures: Certified Copy of Death Certificate, [Letters Testamentary if applicable]`
  },
  {
    id:"credit", title:"Credit Bureau Freeze Letter", icon:"🔒",
    tag:"Prevents identity theft",
    body:(n,d,s,r) => `[Your Name]\n[Your Address]\n[City, State, ZIP]\n[Date]\n\n[Send separately to each bureau:\nEquifax: P.O. Box 105139, Atlanta, GA 30348\nExperian: P.O. Box 9701, Allen, TX 75013\nTransUnion: P.O. Box 2000, Chester, PA 19016]\n\nRE: Deceased Alert & Credit Freeze — ${n||"[Full Name of Deceased]"}\nSSN: [Last 4 digits: XXX-XX-____]\n\nDear Credit Reporting Agency,\n\nI am writing to request that you place a deceased indicator on the credit file of ${n||"[Full Name of Deceased]"}, who passed away on ${d||"[Date of Death]"}.\n\nI am the ${r||"[relationship]"} and am acting on behalf of the estate. Please suppress all credit activity associated with this individual and flag any future credit inquiries as potentially fraudulent.\n\nEnclosed:\n— Certified copy of death certificate\n— Copy of my government-issued ID\n\nPlease confirm receipt of this request in writing.\n\nSincerely,\n\n[Your Signature]\n[Your Printed Name]\n[Your Phone Number]\n[Your Email Address]`
  },
  {
    id:"utility", title:"Utility Company", icon:"💡",
    tag:"Cancel or transfer",
    body:(n,d,s,r) => `[Your Name]\n[Your Address]\n[City, State, ZIP]\n[Date]\n\n[Utility Company Name]\nCustomer Service Department\n[Company Address]\n\nRE: Account Cancellation or Transfer — Account of ${n||"[Full Name of Deceased]"}\nAccount Number: [Account Number]\nService Address: [Service Address]\n\nDear Customer Service,\n\nI am writing to notify you that ${n||"[Full Name of Deceased]"}, the account holder, passed away on ${d||"[Date of Death]"}.\n\nI am the ${r||"[relationship]"} and am requesting that service be [cancelled as of [Date] / transferred into my name effective [Date]].\n\nIf transferring: Please provide any forms required to complete the account transfer. I am prepared to set up new billing arrangements.\n\nIf cancelling: Please issue a final bill to the estate at the address above and confirm the cancellation date in writing.\n\nEnclosed is a copy of the death certificate for your records.\n\nThank you for your assistance.\n\nSincerely,\n\n[Your Signature]\n[Your Printed Name]\n[Your Phone Number]`
  },
  {
    id:"insurance", title:"Life Insurance Claim", icon:"📋",
    tag:"Start immediately",
    body:(n,d,s,r) => `[Your Name]\n[Your Address]\n[City, State, ZIP]\n[Date]\n\n[Insurance Company Name]\nClaims Department\n[Company Address]\n\nRE: Life Insurance Death Claim\nPolicy Number: [Policy Number]\nInsured: ${n||"[Full Name of Deceased]"}\n\nDear Claims Department,\n\nI am writing to initiate a death benefit claim for the above-referenced policy. The insured, ${n||"[Full Name of Deceased]"}, passed away on ${d||"[Date of Death]"} in [City], ${s||"[State]"}.\n\nI am the named beneficiary / ${r||"[relationship]"} on this policy.\n\nEnclosed please find:\n— Certified copy of the death certificate\n— Completed claim form (if available)\n— Proof of my identity\n\nPlease advise on any additional documentation required to process this claim promptly. I understand that most claims are settled within 30–60 days of receiving complete documentation.\n\nYou may reach me at:\nPhone: [Your Phone Number]\nEmail: [Your Email Address]\n\nThank you for your prompt attention.\n\nSincerely,\n\n[Your Signature]\n[Your Printed Name]\n[Beneficiary Relationship to Insured]`
  },
  {
    id:"landlord", title:"Landlord / Lease Termination", icon:"🏠",
    tag:"If renting",
    body:(n,d,s,r) => `[Your Name]\n[Your Address]\n[City, State, ZIP]\n[Date]\n\n[Landlord's Name]\n[Landlord's Address]\n\nRE: Notice of Death & Lease Termination — Unit [Unit Number]\n[Property Address]\n\nDear [Landlord's Name],\n\nI am writing to formally notify you of the passing of ${n||"[Full Name of Deceased]"}, who was a tenant at the above property. ${n||"The deceased"} passed away on ${d||"[Date of Death]"}.\n\nI am the ${r||"[relationship]"} and am responsible for managing the estate. We are requesting termination of the lease effective [Requested End Date, typically 30 days from this letter].\n\nWe will ensure the unit is returned in good condition and will coordinate access for a final walk-through at your convenience. Please advise on the process for return of the security deposit.\n\nA certified copy of the death certificate is enclosed for your records.\n\nPlease contact me at [Your Phone Number] or [Your Email] to coordinate next steps.\n\nSincerely,\n\n[Your Signature]\n[Your Printed Name]\n[Your Phone Number]\n\nEnclosures: Certified Copy of Death Certificate`
  },
  {
    id:"dmv", title:"DMV — Cancel Driver's License", icon:"🚗",
    tag:"Prevent fraud",
    body:(n,d,s,r) => `[Your Name]\n[Your Address]\n[City, State, ZIP]\n[Date]\n\n${/* state */""} Department of Motor Vehicles\n[DMV Address — check your state's DMV website]\n\nRE: Cancellation of Driver's License — ${n||"[Full Name of Deceased]"}\nDriver's License Number: [License Number]\nDate of Birth: [DOB]\n\nDear DMV Records Department,\n\nI am writing to notify the Department of Motor Vehicles of the death of ${n||"[Full Name of Deceased]"}, who passed away on ${d||"[Date of Death]"}.\n\nI am the ${r||"[relationship]"} of the deceased. I am requesting that the driver's license be cancelled in your system to prevent fraudulent use.\n\nEnclosed:\n— Certified copy of the death certificate\n— Original driver's license (if available)\n\nPlease confirm the cancellation in writing.\n\nSincerely,\n\n[Your Signature]\n[Your Printed Name]\n[Your Phone Number]\n[Your Email]`
  },
  {
    id:"medicare", title:"Medicare / Medicaid Notification", icon:"🏥",
    tag:"If applicable",
    body:(n,d,s,r) => `[Your Name]\n[Your Address]\n[City, State, ZIP]\n[Date]\n\nCenters for Medicare & Medicaid Services\n[Your regional Medicare Administrative Contractor]\n\nRE: Notification of Death — ${n||"[Full Name of Deceased]"}\nMedicare ID / Beneficiary Number: [Medicare ID]\n\nDear Medicare Representative,\n\nI am writing to notify Medicare of the passing of ${n||"[Full Name of Deceased]"}, Medicare beneficiary, who passed away on ${d||"[Date of Death]"}.\n\nI am the ${r||"[relationship]"} of the deceased. Please update your records, cancel all active coverage, and flag the account to prevent fraudulent billing.\n\nIf any Medicare benefits are owed to the estate or if there are outstanding claims, please advise on the process for resolution.\n\nEnclosed is a certified copy of the death certificate.\n\nYou may reach me at [Your Phone Number] or [Your Email].\n\nThank you for your assistance.\n\nSincerely,\n\n[Your Signature]\n[Your Printed Name]`
  },
];

// ─── STRIPE LINK — Replace with your real Stripe payment link ────────────────
const STRIPE_LINK = "https://buy.stripe.com/your_link_here";

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function Leaf() {
  return (
    <svg width="28" height="28" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer leaf ring */}
      <path d="M30 6 C16 6 6 16 6 30 C6 40 12 48 21 52 L23 44 C16 41 12 36 12 30 C12 20 20 12 30 12 C40 12 48 20 48 30 C48 36 44 41 37 44 L39 52 C48 48 54 40 54 30 C54 16 44 6 30 6Z" fill="#4a8a6a"/>
      {/* Inner leaf */}
      <path d="M30 18 C24 18 18 24 18 30 C18 35 21 39 26 41 L28 35 C25 34 24 32 24 30 C24 27 27 24 30 24 C33 24 36 27 36 30 C36 32 35 34 32 35 L34 41 C39 39 42 35 42 30 C42 24 36 18 30 18Z" fill="#263f34"/>
      {/* Stem */}
      <line x1="30" y1="52" x2="30" y2="58" stroke="#4a8a6a" strokeWidth="3" strokeLinecap="round"/>
      {/* Side sprigs */}
      <path d="M30 56 Q22 51 18 49" stroke="#4a8a6a" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M30 54 Q38 49 42 47" stroke="#4a8a6a" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function ProgressBar({ value, max }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 999, height: 6, overflow: "hidden", marginBottom: 6 }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "#7dd3b0", borderRadius: 999, transition: "width 0.5s ease" }} />
    </div>
  );
}

function StepDots({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 5, borderRadius: 999,
          width: i === current - 1 ? 28 : 8,
          background: i < current - 1 ? T.sage : i === current - 1 ? T.sageLt : T.border,
          transition: "all 0.3s",
        }} />
      ))}
    </div>
  );
}

function Btn({ children, onClick, disabled, secondary, small, full }) {
  const [hover, setHover] = useState(false);
  const base = {
    fontFamily: "'Lato', sans-serif",
    fontWeight: 700,
    letterSpacing: 0.5,
    cursor: disabled ? "not-allowed" : "pointer",
    border: "none",
    borderRadius: 10,
    transition: "all 0.18s",
    width: full ? "100%" : undefined,
  };
  if (secondary) return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, background: "none", color: T.textMd, border: `1.5px solid ${T.border}`, padding: small ? "8px 16px" : "12px 22px", fontSize: 13 }}
    >{children}</button>
  );
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...base,
        background: disabled ? "#b0c4ba" : hover ? T.sageDk : T.sage,
        color: "white",
        padding: small ? "10px 20px" : "14px 30px",
        fontSize: small ? 13 : 15,
        boxShadow: !disabled && hover ? "0 4px 16px rgba(58,94,78,0.25)" : "none",
        transform: !disabled && hover ? "translateY(-1px)" : "none",
      }}
    >{children}</button>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: T.white,
      borderRadius: 20,
      boxShadow: "0 2px 32px rgba(58,94,78,0.09)",
      padding: "40px 36px",
      maxWidth: 580,
      width: "calc(100% - 32px)",
      margin: "36px auto 0",
      boxSizing: "border-box",
      ...style,
    }}>{children}</div>
  );
}

function PillBadge({ children, color }) {
  return (
    <div style={{
      display: "inline-block",
      background: color || T.sagePale,
      color: T.sage,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      padding: "4px 12px",
      borderRadius: 999,
      marginBottom: 18,
      fontFamily: "'Lato', sans-serif",
    }}>{children}</div>
  );
}

function RadioOpt({ label, selected, onClick, sublabel }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "14px 16px",
        borderRadius: 12,
        border: `1.5px solid ${selected ? T.sage : hover ? T.sand : T.border}`,
        background: selected ? T.sagePale : hover ? T.cream : T.white,
        cursor: "pointer",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 12,
        transition: "all 0.15s",
        fontFamily: "'Lato', sans-serif",
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: "50%",
        border: `2px solid ${selected ? T.sage : T.sand}`,
        background: selected ? T.sage : T.white,
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}>
        {selected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />}
      </div>
      <div>
        <div style={{ fontSize: 14, color: selected ? T.sageXdk : T.text, fontWeight: selected ? 700 : 400 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 12, color: T.textLt, marginTop: 2 }}>{sublabel}</div>}
      </div>
    </button>
  );
}

function AssetChip({ icon, label, selected, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "12px 14px",
        borderRadius: 12,
        border: `1.5px solid ${selected ? T.sage : hover ? T.sand : T.border}`,
        background: selected ? T.sagePale : hover ? T.cream : T.white,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "'Lato', sans-serif",
        fontSize: 13,
        color: selected ? T.sageXdk : T.textMd,
        fontWeight: selected ? 700 : 400,
        transition: "all 0.15s",
        textAlign: "left",
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span>{label}</span>
      {selected && <span style={{ marginLeft: "auto", color: T.sage, fontWeight: 900, fontSize: 16 }}>✓</span>}
    </button>
  );
}

// Priority config
const PRIO = {
  critical: { dot: T.warn,   bg: T.warnLt,  label: "Urgent",     border: "#e8b4b0" },
  high:     { dot: T.amber,  bg: T.amberLt, label: "Important",  border: "#e8d8a0" },
  medium:   { dot: T.sage,   bg: T.sagePale,label: "This month", border: "#b8d4c4" },
  low:      { dot: T.sand,   bg: T.cream2,  label: "When ready", border: T.border  },
};

function TaskRow({ item, done, onToggle }) {
  const p = PRIO[item.priority] || PRIO.low;
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      borderBottom: `1px solid ${T.cream2}`,
      padding: "14px 20px",
      background: done ? "#fbfbf9" : T.white,
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
      cursor: "pointer",
    }} onClick={() => onToggle()}>
      <div style={{
        width: 22, height: 22, borderRadius: 7,
        border: `2px solid ${done ? T.sage : T.border}`,
        background: done ? T.sage : T.white,
        flexShrink: 0, marginTop: 1,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}>
        {done && <span style={{ color: "white", fontSize: 13 }}>✓</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: p.dot, flexShrink: 0 }} />
          <span style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 14, lineHeight: 1.4,
            color: done ? T.textLt : T.text,
            textDecoration: done ? "line-through" : "none",
          }}>{item.task}</span>
        </div>
        {item.note && !done && (
          <div style={{
            marginTop: 6, marginLeft: 15,
            fontSize: 12, color: T.textMd,
            fontFamily: "'Lato', sans-serif",
            lineHeight: 1.55,
            background: p.bg,
            border: `1px solid ${p.border}`,
            borderRadius: 8,
            padding: "8px 12px",
          }}>
            {item.note}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]     = useState(0); // 0=landing, 1-5=wizard, 6=results
  const [answers, setAnswers] = useState({ state:"", assets:[], relationship:"", timing:"", hasWill:"" });
  const [checked, setChecked] = useState({});
  const [section, setSection] = useState("w1");
  const [unlocked, setUnlocked] = useState(false); // letters unlocked after payment
  const [openLetter, setOpenLetter] = useState(null);
  const [mounted, setMounted] = useState(false);
  const topRef = useRef();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ behavior: "smooth" }); }, [step]);

  const checklist = step === 6 ? buildChecklist(answers) : null;
  const allTasks  = checklist ? [...checklist.w1, ...checklist.w2, ...checklist.m2] : [];
  const totalTasks = allTasks.length;
  const doneTasks  = Object.values(checked).filter(Boolean).length;
  const toggle = (id) => setChecked(c => ({ ...c, [id]: !c[id] }));
  const canGo  = () => {
    if (step === 1) return !!answers.state;
    if (step === 2) return answers.assets.length > 0;
    if (step === 3) return !!answers.relationship;
    if (step === 4) return !!answers.timing;
    if (step === 5) return !!answers.hasWill;
    return true;
  };
  const urgentTiming = ["days","week"].includes(answers.timing);

  const sections = [
    { key:"w1", label:"Week 1",     sub:"First 7 days",        icon:"⚡", items: checklist?.w1 },
    { key:"w2", label:"Weeks 2–4",  sub:"First month",         icon:"📋", items: checklist?.w2 },
    { key:"m2", label:"Month 2–3",  sub:"Estate settlement",   icon:"🏛",  items: checklist?.m2 },
  ];

  const header = (
    <div ref={topRef} style={{
      width: "100%", background: T.sageXdk,
      padding: "14px 24px", display: "flex",
      alignItems: "center", gap: 10, boxSizing: "border-box",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <Leaf />
      <span style={{ fontFamily: "'Playfair Display', serif", color: T.cream, fontSize: 18, letterSpacing: 1 }}>
        Tend
      </span>
      <span style={{ fontFamily: "'Lato', sans-serif", color: "rgba(232,236,234,0.45)", fontSize: 12, marginLeft: 4 }}>
        — a guide for what comes next
      </span>
      {step === 6 && (
        <button
          onClick={() => { setStep(0); setAnswers({ state:"", assets:[], relationship:"", timing:"", hasWill:"" }); setChecked({}); setOpenLetter(null); }}
          style={{ marginLeft: "auto", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: "rgba(232,236,234,0.7)", fontSize: 12, padding: "6px 14px", cursor: "pointer", fontFamily: "'Lato', sans-serif" }}
        >
          Start over
        </button>
      )}
    </div>
  );

  // ── LANDING ────────────────────────────────────────────────────────────────
  if (step === 0) return (
    <div style={{ background: T.cream, minHeight: "100vh", opacity: mounted ? 1 : 0, transition: "opacity 0.5s" }}>
      {header}
      {/* Hero */}
      <div style={{ background: T.sageXdk, padding: "60px 24px 72px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ marginBottom: 24 }}><Leaf /></div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: T.cream, fontSize: "clamp(28px, 6vw, 44px)",
            fontWeight: 400, lineHeight: 1.25, margin: "0 0 20px",
          }}>
            When someone you love passes,<br />
            <em>we help you find what needs doing.</em>
          </h1>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "rgba(232,236,234,0.75)", fontSize: 16, lineHeight: 1.7, margin: "0 0 36px", fontWeight: 300 }}>
            Families face 50–200 administrative tasks in the weeks after a loss.
            Tend builds your personalized checklist in 2 minutes — and generates every letter you need to send.
          </p>
          <Btn onClick={() => setStep(1)} full>Create My Personal Checklist →</Btn>
          <div style={{ marginTop: 16, fontFamily: "'Lato', sans-serif", color: "rgba(232,236,234,0.4)", fontSize: 12 }}>
            Free to use &nbsp;·&nbsp; No account required &nbsp;·&nbsp; Built with care
          </div>
        </div>
      </div>

      {/* What you get */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: T.sageXdk, fontSize: 24, fontWeight: 400, textAlign: "center", marginBottom: 36 }}>
          What Tend gives you
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { icon:"✓", label:"Personalized 90-day checklist", sub:"Tailored to your state, your assets, and your situation. Nothing irrelevant. Nothing missing.", free: true },
            { icon:"✓", label:"Priority guidance",             sub:"Know which tasks are urgent (day 1) vs. which can wait until month 3.", free: true },
            { icon:"✓", label:"Helpful notes on every task",   sub:"Plain-language explanations of why each task matters and what to watch out for.", free: true },
            { icon:"✓", label:"20+ ready-to-send letters",    sub:"Social Security, banks, utilities, DMV, landlords, insurance — every letter pre-written for you.", free: false },
          ].map(f => (
            <div key={f.label} style={{
              background: T.white, borderRadius: 14, padding: "20px 20px",
              border: `1.5px solid ${f.free ? T.border : T.sagePale}`,
              boxShadow: "0 1px 12px rgba(58,94,78,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: f.free ? T.sagePale : T.sage, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: f.free ? T.sage : T.white, fontWeight: 900 }}>{f.icon}</span>
                </div>
                <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, fontWeight: 700, color: T.sageXdk }}>{f.label}</span>
                {!f.free && <span style={{ background: T.sage, color: "white", fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 999, letterSpacing: 1 }}>PAID</span>}
              </div>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: T.textMd, lineHeight: 1.55, margin: 0 }}>{f.sub}</p>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div style={{ background: T.sageXdk, borderRadius: 18, padding: "32px 28px", marginTop: 36, textAlign: "center" }}>
          <div style={{ fontFamily: "'Lato', sans-serif", color: "rgba(232,236,234,0.6)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Simple pricing</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 20, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", color: T.cream, fontSize: 32 }}>Free</div>
              <div style={{ fontFamily: "'Lato', sans-serif", color: "rgba(232,236,234,0.6)", fontSize: 13 }}>Full personalized checklist</div>
            </div>
            <div style={{ width: 1, background: "rgba(255,255,255,0.1)" }} />
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", color: "#7dd3b0", fontSize: 32 }}>$49</div>
              <div style={{ fontFamily: "'Lato', sans-serif", color: "rgba(232,236,234,0.6)", fontSize: 13 }}>+ All 20+ letters · one-time</div>
            </div>
          </div>
          <Btn onClick={() => setStep(1)} full>Begin — It's Free to Start →</Btn>
        </div>

        <p style={{ textAlign:"center", fontFamily:"'Lato',sans-serif", fontSize: 11, color: T.textLt, marginTop: 28, lineHeight: 1.6 }}>
          Tend provides general guidance and templates only.<br />
          It does not constitute legal, financial, or tax advice. Please consult a licensed estate attorney for complex situations.
        </p>
      </div>
    </div>
  );

  // ── WIZARD ─────────────────────────────────────────────────────────────────
  const wizardSteps = [
    {
      n:1, badge:"Step 1 of 5", title:"What state did they live in?",
      sub:"Probate laws, DMV procedures, and estate rules vary significantly by state.",
      content: (
        <>
          <label style={{ fontFamily:"'Lato',sans-serif", fontSize:13, fontWeight:700, color:T.sage, display:"block", marginBottom:8, letterSpacing:0.3 }}>
            State of residence
          </label>
          <select
            value={answers.state}
            onChange={e => setAnswers(a => ({ ...a, state: e.target.value }))}
            style={{ width:"100%", padding:"12px 16px", borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:15, fontFamily:"'Lato',sans-serif", background:T.white, color:T.text, outline:"none", boxSizing:"border-box", marginBottom:28, appearance:"none" }}
          >
            <option value="">Select a state…</option>
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
        </>
      ),
    },
    {
      n:2, badge:"Step 2 of 5", title:"What did they have?",
      sub:"Select everything that applies. We'll only show you relevant tasks — nothing extra.",
      content: (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
          {ASSETS.map(a => (
            <AssetChip key={a.id} icon={a.icon} label={a.label}
              selected={answers.assets.includes(a.id)}
              onClick={() => setAnswers(prev => ({
                ...prev,
                assets: prev.assets.includes(a.id)
                  ? prev.assets.filter(x => x !== a.id)
                  : [...prev.assets, a.id]
              }))}
            />
          ))}
        </div>
      ),
    },
    {
      n:3, badge:"Step 3 of 5", title:"What is your relationship to them?",
      sub:"This affects which benefits you may be entitled to and your legal authority over the estate.",
      content: (
        <div style={{ marginBottom:24 }}>
          {RELATIONSHIPS.map(r => (
            <RadioOpt key={r.id} label={r.label}
              selected={answers.relationship === r.id}
              onClick={() => setAnswers(a => ({ ...a, relationship: r.id }))}
            />
          ))}
        </div>
      ),
    },
    {
      n:4, badge:"Step 4 of 5", title:"When did they pass away?",
      sub:"Some tasks have legal deadlines. We'll flag anything time-sensitive for your situation.",
      content: (
        <div style={{ marginBottom:24 }}>
          {TIMINGS.map(t => (
            <RadioOpt key={t.id} label={t.label}
              sublabel={t.urgent ? "⚡ Time-sensitive tasks will be highlighted" : ""}
              selected={answers.timing === t.id}
              onClick={() => setAnswers(a => ({ ...a, timing: t.id }))}
            />
          ))}
        </div>
      ),
    },
    {
      n:5, badge:"Step 5 of 5", title:"Did they leave a will?",
      sub:"This determines how the estate is administered and whether probate court is involved.",
      content: (
        <div style={{ marginBottom:24 }}>
          {[
            { id:"yes",   label:"Yes — there is a will and/or named executor" },
            { id:"no",    label:"No — they passed without a will (intestate)",
              sublabel:"Your state's laws will determine how assets are distributed" },
            { id:"unsure",label:"I'm not sure yet" },
          ].map(opt => (
            <RadioOpt key={opt.id} label={opt.label} sublabel={opt.sublabel}
              selected={answers.hasWill === opt.id}
              onClick={() => setAnswers(a => ({ ...a, hasWill: opt.id }))}
            />
          ))}
        </div>
      ),
    },
  ];

  const wz = wizardSteps.find(w => w.n === step);
  if (wz) return (
    <div style={{ background: T.cream, minHeight: "100vh", opacity: mounted ? 1 : 0, transition: "opacity 0.4s" }}>
      {header}
      <Card>
        <StepDots current={step} total={5} />
        <PillBadge>{wz.badge}</PillBadge>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:400, color:T.sageXdk, margin:"0 0 10px", lineHeight:1.3 }}>
          {wz.title}
        </h1>
        <p style={{ fontFamily:"'Lato',sans-serif", fontSize:14, color:T.textMd, lineHeight:1.65, margin:"0 0 24px" }}>
          {wz.sub}
        </p>
        {wz.content}
        <div style={{ display:"flex", gap:10 }}>
          {step > 1 && <Btn secondary onClick={() => setStep(step - 1)}>← Back</Btn>}
          <div style={{ flex:1 }} />
          <Btn
            onClick={() => { if (canGo()) { if (step < 5) setStep(step+1); else { setStep(6); setSection("w1"); } } }}
            disabled={!canGo()}
          >
            {step < 5 ? "Continue →" : "Build My Checklist →"}
          </Btn>
        </div>
      </Card>
    </div>
  );

  // ── RESULTS ────────────────────────────────────────────────────────────────
  const activeItems = section === "w1" ? checklist.w1 : section === "w2" ? checklist.w2 : checklist.m2;
  const relLabel = RELATIONSHIPS.find(r => r.id === answers.relationship)?.label || "";

  return (
    <div style={{ background: T.cream, minHeight:"100vh", opacity: mounted ? 1 : 0, transition: "opacity 0.4s" }}>
      {header}

      <div style={{ maxWidth: 680, margin:"0 auto", padding:"28px 16px 60px", boxSizing:"border-box" }}>

        {/* Summary card */}
        <div style={{ background:T.sageXdk, borderRadius:20, padding:"26px 28px", marginBottom:18, color:"white" }}>
          <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, opacity:0.55, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>
            Your personalized guide
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:400, margin:"0 0 6px", color:T.cream }}>
            {answers.state} Estate Administration
          </h1>
          <p style={{ fontFamily:"'Lato',sans-serif", fontSize:13, opacity:0.7, margin:"0 0 18px", lineHeight:1.5 }}>
            {relLabel} &nbsp;·&nbsp; {answers.assets.length} asset type{answers.assets.length !== 1 ? "s" : ""} &nbsp;·&nbsp; {totalTasks} tasks total
          </p>
          <ProgressBar value={doneTasks} max={totalTasks} />
          <div style={{ fontFamily:"'Lato',sans-serif", fontSize:13, opacity:0.65 }}>
            {doneTasks} of {totalTasks} tasks completed
          </div>
        </div>

        {/* Alerts */}
        {urgentTiming && (
          <div style={{ background:T.warnLt, border:`1px solid #e8b4b0`, borderRadius:12, padding:"14px 18px", marginBottom:14, fontFamily:"'Lato',sans-serif", fontSize:13, color:"#7f1d1d", lineHeight:1.6 }}>
            <strong>🚨 Act today:</strong> Notify the Social Security Administration immediately — payments deposited after death must be returned. Order 10–15 death certificates now.
          </div>
        )}
        {answers.hasWill === "no" && (
          <div style={{ background:T.amberLt, border:`1px solid #e0c870`, borderRadius:12, padding:"14px 18px", marginBottom:14, fontFamily:"'Lato',sans-serif", fontSize:13, color:"#713f12", lineHeight:1.6 }}>
            <strong>⚠️ No will (intestate):</strong> {answers.state} will use its intestacy laws to determine asset distribution. You may need a court-appointed estate administrator. Consider consulting an estate attorney early in this process.
          </div>
        )}

        {/* Section tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          {sections.map(s => {
            const act = section === s.key;
            return (
              <button key={s.key} onClick={() => setSection(s.key)} style={{
                flex:1, padding:"12px 8px", borderRadius:12,
                border:`1.5px solid ${act ? T.sage : T.border}`,
                background: act ? T.sage : T.white,
                color: act ? "white" : T.textMd,
                cursor:"pointer", fontFamily:"'Lato',sans-serif",
                fontSize:12, fontWeight:700, transition:"all 0.15s",
              }}>
                <div style={{ fontSize:16, marginBottom:2 }}>{s.icon}</div>
                <div>{s.label}</div>
                <div style={{ opacity:0.65, fontWeight:400, marginTop:2 }}>{s.sub}</div>
                <div style={{ marginTop:4, fontSize:11, opacity: act ? 0.8 : 0.5 }}>{s.items?.length} tasks</div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:10, padding:"0 4px" }}>
          {Object.entries(PRIO).map(([k, v]) => (
            <div key={k} style={{ display:"flex", alignItems:"center", gap:5, fontFamily:"'Lato',sans-serif", fontSize:11, color:T.textLt }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:v.dot }} />
              {v.label}
            </div>
          ))}
        </div>

        {/* Task list */}
        <div style={{ background:T.white, borderRadius:16, overflow:"hidden", boxShadow:"0 2px 20px rgba(58,94,78,0.07)", marginBottom:20 }}>
          {activeItems.map((item, i) => (
            <TaskRow key={item.id}
              item={item}
              done={!!checked[item.id]}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>

        {/* Letters section */}
        <div style={{ background:T.white, borderRadius:16, overflow:"hidden", boxShadow:"0 2px 20px rgba(58,94,78,0.07)", marginBottom:20 }}>
          {/* Letters header */}
          <div style={{ background: unlocked ? T.sage : T.sageXdk, padding:"20px 24px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
              <div>
                <div style={{ fontFamily:"'Playfair Display',serif", color:T.cream, fontSize:18, fontWeight:400, marginBottom:4 }}>
                  {unlocked ? "📬 Your Letter Library" : "📬 Ready-to-Send Letters"}
                </div>
                <div style={{ fontFamily:"'Lato',sans-serif", color:"rgba(232,236,234,0.7)", fontSize:13 }}>
                  {unlocked
                    ? `${LETTERS.length} letters — click any to view and copy`
                    : "Pre-written for Social Security, banks, utilities, DMV, insurance, and more."}
                </div>
              </div>
              {!unlocked && (
                <div style={{ marginLeft:"auto" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", color:"#7dd3b0", fontSize:22, textAlign:"right" }}>$49</div>
                  <div style={{ fontFamily:"'Lato',sans-serif", color:"rgba(232,236,234,0.5)", fontSize:11, textAlign:"right" }}>one-time</div>
                </div>
              )}
            </div>
          </div>

          {/* Locked state */}
          {!unlocked && (
            <div style={{ padding:"24px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
                {LETTERS.map(l => (
                  <div key={l.id} style={{ padding:"12px 14px", borderRadius:10, border:`1px solid ${T.border}`, background:T.cream, display:"flex", alignItems:"center", gap:10, opacity:0.7 }}>
                    <span style={{ fontSize:18 }}>{l.icon}</span>
                    <div>
                      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:12, fontWeight:700, color:T.sageXdk }}>{l.title}</div>
                      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:T.textLt }}>{l.tag}</div>
                    </div>
                    <span style={{ marginLeft:"auto", fontSize:14, color:T.sand }}>🔒</span>
                  </div>
                ))}
              </div>
              <div style={{ background:T.cream2, borderRadius:14, padding:"22px 24px", textAlign:"center" }}>
                <p style={{ fontFamily:"'Lato',sans-serif", fontSize:14, color:T.textMd, lineHeight:1.6, margin:"0 0 20px" }}>
                  Unlock all {LETTERS.length} letters for a single one-time payment. Each letter is pre-filled with the right recipient, legal language, and enclosure notes. Just add your details and send.
                </p>
                <a href={STRIPE_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
                  <button style={{
                    background:T.sage, color:"white", border:"none", borderRadius:12,
                    padding:"14px 32px", fontFamily:"'Lato',sans-serif", fontWeight:700,
                    fontSize:15, cursor:"pointer", letterSpacing:0.4,
                    boxShadow:"0 4px 16px rgba(58,94,78,0.2)",
                  }}>
                    Unlock All Letters — $49 →
                  </button>
                </a>
                {/* Demo unlock for prototype */}
                <div style={{ marginTop:14 }}>
                  <button
                    onClick={() => setUnlocked(true)}
                    style={{ background:"none", border:"none", color:T.textLt, fontSize:12, cursor:"pointer", fontFamily:"'Lato',sans-serif", textDecoration:"underline" }}
                  >
                    Preview as demo (prototype only)
                  </button>
                </div>
                <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:T.textLt, marginTop:10 }}>
                  One-time purchase · No subscription · Instant access
                </div>
              </div>
            </div>
          )}

          {/* Unlocked — letter grid */}
          {unlocked && (
            <div style={{ padding:20 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom: openLetter ? 0 : 0 }}>
                {LETTERS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setOpenLetter(openLetter === l.id ? null : l.id)}
                    style={{
                      padding:"13px 14px", borderRadius:10, textAlign:"left",
                      border:`1.5px solid ${openLetter === l.id ? T.sage : T.border}`,
                      background: openLetter === l.id ? T.sagePale : T.white,
                      cursor:"pointer", display:"flex", alignItems:"center", gap:10,
                      transition:"all 0.15s",
                    }}
                  >
                    <span style={{ fontSize:18 }}>{l.icon}</span>
                    <div>
                      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:12, fontWeight:700, color:T.sageXdk }}>{l.title}</div>
                      <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:T.sageLt }}>{l.tag}</div>
                    </div>
                  </button>
                ))}
              </div>
              {openLetter && (() => {
                const l = LETTERS.find(x => x.id === openLetter);
                const rel = RELATIONSHIPS.find(r => r.id === answers.relationship)?.label || "[your relationship]";
                const text = l.body("[Name of Deceased]", "[Date of Death]", answers.state, rel);
                return (
                  <div style={{ marginTop:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                      <div style={{ fontFamily:"'Lato',sans-serif", fontWeight:700, fontSize:14, color:T.sageXdk }}>{l.icon} {l.title}</div>
                      <div style={{ display:"flex", gap:8 }}>
                        <button
                          onClick={() => { navigator.clipboard?.writeText(text); }}
                          style={{ background:T.sage, color:"white", border:"none", borderRadius:8, padding:"7px 16px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"'Lato',sans-serif" }}
                        >Copy</button>
                        <button
                          onClick={() => setOpenLetter(null)}
                          style={{ background:T.cream2, color:T.textMd, border:`1px solid ${T.border}`, borderRadius:8, padding:"7px 12px", fontSize:12, cursor:"pointer", fontFamily:"'Lato',sans-serif" }}
                        >✕</button>
                      </div>
                    </div>
                    <pre style={{
                      fontFamily:"'Courier New',monospace", fontSize:12,
                      background:T.cream, borderRadius:12, padding:"20px 22px",
                      whiteSpace:"pre-wrap", wordBreak:"break-word",
                      lineHeight:1.75, color:T.text, margin:0,
                      border:`1px solid ${T.border}`,
                    }}>{text}</pre>
                    <div style={{ marginTop:10, background:T.amberLt, borderRadius:10, padding:"10px 14px", fontFamily:"'Lato',sans-serif", fontSize:12, color:T.amber, lineHeight:1.5 }}>
                      Replace all bracketed fields [like this] with your actual details before sending. Enclose a certified death certificate with every letter.
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Bottom CTA if not unlocked */}
        {!unlocked && (
          <div style={{ background:"linear-gradient(135deg, #1a2e26, #2c4a3e)", borderRadius:18, padding:"32px 28px", textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", color:T.cream, fontSize:22, marginBottom:10 }}>
              Take the paperwork off your plate.
            </div>
            <p style={{ fontFamily:"'Lato',sans-serif", color:"rgba(232,236,234,0.7)", fontSize:14, lineHeight:1.65, margin:"0 0 24px" }}>
              Every letter is pre-written, legally minded, and ready to personalize. Social Security, banks, utilities, insurance, DMV, credit bureaus — all covered.
            </p>
            <a href={STRIPE_LINK} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none" }}>
              <button style={{
                background:"#7dd3b0", color:T.sageXdk, border:"none",
                borderRadius:12, padding:"15px 36px",
                fontFamily:"'Lato',sans-serif", fontWeight:700,
                fontSize:15, cursor:"pointer", letterSpacing:0.4,
              }}>
                Unlock All Letters — $49 →
              </button>
            </a>
            <div style={{ fontFamily:"'Lato',sans-serif", fontSize:11, color:"rgba(232,236,234,0.35)", marginTop:12 }}>
              One-time purchase · No subscription · Instant access
            </div>
          </div>
        )}

        <p style={{ textAlign:"center", fontFamily:"'Lato',sans-serif", fontSize:12, color:T.textMd, marginTop:28, lineHeight:1.9, borderTop:`1px solid ${T.border}`, paddingTop:20 }}>
          Tend provides general guidance and document templates only.<br />
          This is not legal, financial, or tax advice. Please consult a licensed estate attorney for complex situations.<br />
          <span style={{ color:T.text, fontWeight:700 }}>{'\u00A9'} 2026 Tend</span> &nbsp;·&nbsp; <a href="mailto:support@tendguide.com" style={{ color:T.sage, textDecoration:"none" }}>support@tendguide.com</a>
        </p>
      </div>
    </div>
  );
}