export type Question = {
  id: string;
  section: string;
  text: string;
  shortLabel: string;
  options: { label: string; score: number }[];
};

export const SECTIONS = [
  { id: "A", title: "SECTION A", subtitle: "Your Team & Stage" },
  { id: "B", title: "SECTION B", subtitle: "Plan Design & Clarity" },
  { id: "C", title: "SECTION C", subtitle: "Operations & Systems" },
  { id: "D", title: "SECTION D", subtitle: "Impact & Outcomes" },
];

export const QUESTIONS: Question[] = [
  {
    id: "q1", section: "A", shortLabel: "Team size",
    text: "How large is your quota-carrying sales team?",
    options: [
      { label: "1–5 reps", score: 2 },
      { label: "6–15 reps", score: 5 },
      { label: "16–40 reps", score: 5 },
      { label: "41–100 reps", score: 3 },
      { label: "100+ reps", score: 4 },
    ],
  },
  {
    id: "q2", section: "A", shortLabel: "Company stage",
    text: "What stage best describes your company right now?",
    options: [
      { label: "Pre-revenue / early stage", score: 1 },
      { label: "Seed or Series A (building the sales motion)", score: 5 },
      { label: "Series B or C (scaling aggressively)", score: 5 },
      { label: "Growth stage / post-Series C", score: 3 },
      { label: "Established / public or near-public", score: 2 },
    ],
  },
  {
    id: "q3", section: "A", shortLabel: "Plan tenure",
    text: "How long has your current comp plan been in place?",
    options: [
      { label: "We don't have a formal plan — it's ad hoc", score: 5 },
      { label: "Less than 6 months", score: 1 },
      { label: "6 months to 2 years", score: 2 },
      { label: "2–4 years", score: 3 },
      { label: "More than 4 years (largely unchanged)", score: 5 },
    ],
  },
  {
    id: "q4", section: "B", shortLabel: "Rep clarity",
    text: "Do your sales reps clearly understand how they're being paid — including how their quota was set?",
    options: [
      { label: "Yes — reps can explain their plan and quota methodology confidently", score: 1 },
      { label: "Mostly — they understand the basics but quota-setting isn't fully transparent", score: 2 },
      { label: "Partially — there's confusion but it hasn't become a major issue yet", score: 3 },
      { label: "No — reps frequently ask how their commission is calculated", score: 4 },
      { label: "No — and quota-setting feels arbitrary to the team", score: 5 },
    ],
  },
  {
    id: "q5", section: "B", shortLabel: "OTE structure",
    text: "How would you describe your current OTE (On-Target Earnings) structure?",
    options: [
      { label: "We have clearly defined OTE by role with documented base/variable splits", score: 1 },
      { label: "We have OTE targets but they vary informally across reps in the same role", score: 3 },
      { label: "We haven't benchmarked our OTE against market rates in over a year", score: 4 },
      { label: "We don't have a formal OTE framework — compensation is negotiated individually", score: 5 },
      { label: "I'm not sure", score: 4 },
    ],
  },
  {
    id: "q6", section: "B", shortLabel: "Accelerators",
    text: "Does your comp plan include performance accelerators — and do they actually motivate above-quota performance?",
    options: [
      { label: "Yes — we have accelerators and reps actively push for them", score: 1 },
      { label: "We have accelerators but reps rarely hit the thresholds to unlock them", score: 5 },
      { label: "We have accelerators but they're not well understood by the team", score: 4 },
      { label: "We don't have accelerators — it's a flat commission rate", score: 4 },
      { label: "I don't know if our plan has accelerators", score: 5 },
    ],
  },
  {
    id: "q7", section: "B", shortLabel: "GTM alignment",
    text: "When your company's GTM strategy shifted most recently — did your comp plan update to reflect it?",
    options: [
      { label: "Yes — we updated comp proactively before or during the GTM shift", score: 1 },
      { label: "We updated it eventually but there was a lag of several months", score: 5 },
      { label: "We partially updated it but some misalignments still exist", score: 4 },
      { label: "No — the GTM has changed but the plan hasn't kept up", score: 5 },
      { label: "We haven't had a formal GTM shift yet", score: 2 },
    ],
  },
  {
    id: "q8", section: "C", shortLabel: "Commission calculation",
    text: "How are commissions currently calculated and paid?",
    options: [
      { label: "We use a dedicated ICM platform (Xactly, CaptivateIQ, Spiff, etc.) with automated calculations", score: 1 },
      { label: "We use a mix of software and manual spreadsheet reconciliation", score: 3 },
      { label: "Primarily manual — spreadsheets built and managed internally", score: 4 },
      { label: "It varies — there's no consistent process", score: 5 },
      { label: "I'm not fully sure how the back-end works", score: 5 },
    ],
  },
  {
    id: "q9", section: "C", shortLabel: "Dispute frequency",
    text: "How often do reps dispute or question their commission payments?",
    options: [
      { label: "Rarely or never — disputes are almost nonexistent", score: 1 },
      { label: "Occasionally — a few per quarter that get resolved quickly", score: 2 },
      { label: "Regularly — we have ongoing open disputes that take weeks to resolve", score: 4 },
      { label: "Frequently — commission disputes are a consistent source of team friction", score: 5 },
      { label: "I don't track this formally", score: 4 },
    ],
  },
  {
    id: "q10", section: "C", shortLabel: "Documentation",
    text: "Do you have documented comp plan materials — plan documents, quota letters, change logs — that reps sign and reference?",
    options: [
      { label: "Yes — fully documented, reps sign annually, changes are logged", score: 1 },
      { label: "Partially — we have documents but they're not consistently updated or distributed", score: 3 },
      { label: "We have informal documentation but nothing formal reps have signed", score: 4 },
      { label: "No formal documentation exists", score: 5 },
      { label: "This is something we know we need to address", score: 4 },
    ],
  },
  {
    id: "q11", section: "D", shortLabel: "Attainment distribution",
    text: "What does your attainment distribution look like across the sales team?",
    options: [
      { label: "Healthy bell curve — roughly 60–70% of reps attaining quota", score: 1 },
      { label: "Top-heavy — a small number of reps are carrying the number", score: 4 },
      { label: "Low across the board — less than 40% of reps are hitting quota", score: 5 },
      { label: "We don't formally track attainment distribution", score: 4 },
      { label: "Our team is too new to have meaningful attainment data yet", score: 2 },
    ],
  },
  {
    id: "q12", section: "D", shortLabel: "Retention & comp",
    text: "In the last 12 months, have you lost a strong sales rep you wanted to keep — and do you believe compensation was a factor?",
    options: [
      { label: "No — our comp is competitive and retention has been strong", score: 1 },
      { label: "Possibly — we've had departures but compensation wasn't explicitly cited", score: 3 },
      { label: "Yes — at least one strong rep left and comp was mentioned as a factor", score: 4 },
      { label: "Yes — multiple strong reps have left and comp is a known issue", score: 5 },
      { label: "We're too early-stage to have experienced this yet", score: 2 },
    ],
  },
];

export const DIMENSIONS = [
  { label: "Alignment",   sub: "GTM & comp plan alignment",         ids: ["q4", "q7"] },
  { label: "Motivation",  sub: "OTE, accelerators & attainment",    ids: ["q5", "q6", "q11"] },
  { label: "Operational", sub: "Commission ops & documentation",     ids: ["q8", "q9", "q10"] },
  { label: "Economic",    sub: "Stage, plan health & retention",     ids: ["q1", "q2", "q3", "q12"] },
];

export const RECOMMENDATIONS = [
  { q: "q4",  area: "Compensation Clarity",   finding: "Reps cannot clearly explain how they are paid or how quotas are set.",             action: "Build a one-page comp summary per role and run a structured walkthrough each plan year. Unclear comp directly drives rep disengagement and silent attrition." },
  { q: "q5",  area: "OTE Framework",          finding: "OTE targets are inconsistent or have not been benchmarked against market rates.",   action: "Conduct a market benchmarking exercise and standardize OTE bands by role. Misaligned OTE is the leading driver of quiet quitting in sales." },
  { q: "q6",  area: "Accelerator Design",     finding: "Accelerators are not driving above-quota performance.",                            action: "Audit accelerator thresholds — they are likely set too high or the incremental payout is not compelling enough to change rep behavior." },
  { q: "q7",  area: "GTM Alignment",          finding: "Your comp plan has not kept pace with recent go-to-market strategy changes.",       action: "Schedule an immediate plan audit. Every month of misalignment means paying reps to execute the wrong priorities." },
  { q: "q8",  area: "Commission Operations",  finding: "Commission calculations are manual or inconsistently managed.",                    action: "Evaluate ICM platforms (CaptivateIQ, Spiff, Xactly). Manual calculation creates errors, disputes, and erodes rep trust over time." },
  { q: "q9",  area: "Dispute Resolution",     finding: "Commission disputes are frequent and slow to resolve.",                            action: "Establish a formal dispute window and resolution SLA. Recurring disputes signal deeper structural problems in the plan design." },
  { q: "q10", area: "Documentation",          finding: "Comp plan documentation is incomplete or reps have not signed off.",              action: "Issue signed comp plan letters annually. Documentation removes rep ambiguity and provides legal protection for the company." },
  { q: "q11", area: "Quota Calibration",      finding: "Attainment distribution indicates a quota design problem.",                       action: "Run a rep-level attainment analysis. Below 50% attainment almost always reflects a quota-setting failure, not a talent problem." },
  { q: "q12", area: "Retention Risk",         finding: "Compensation has been cited as a contributing factor in rep departures.",         action: "Benchmark OTE immediately against top-quartile competitors. Losing multiple strong reps to comp is a structural, not a personnel, problem." },
];
