/**
 * GTM COMP PLATFORM - ICP SCORING ENGINE
 * 
 * Logic based on Kelly's specific target profile:
 * - Series A/B Funding
 * - 20-200 Employees
 * - 5-25 Sales Reps
 * - Absence of dedicated RevOps/Comp hires
 * - Recent Leadership Hires (CRO/VP Sales < 1 year)
 */

export interface LeadData {
  stage?: string;
  employeeCount?: number;
  salesRepCount?: number;
  missingRevOps?: boolean;
  leadershipHiredLastYear?: boolean;
}

export function calculateFitScore(lead: LeadData): number {
  let score = 0;

  // 1. Funding Stage (Series A or B are ideal)
  if (lead.stage?.includes("Series A") || lead.stage?.includes("Series B")) {
    score += 30;
  } else if (lead.stage?.includes("Seed")) {
    score += 15; // Growth potential
  }

  // 2. Employee Count (20-200 is the sweet spot)
  if (lead.employeeCount && lead.employeeCount >= 20 && lead.employeeCount <= 200) {
    score += 20;
  } else if (lead.employeeCount && lead.employeeCount < 500) {
    score += 10;
  }

  // 3. Sales Reps (5-25 is ideal for fractional support)
  if (lead.salesRepCount && lead.salesRepCount >= 5 && lead.salesRepCount <= 25) {
    score += 20;
  }

  // 4. Missing RevOps/Finance visibility
  if (lead.missingRevOps) {
    score += 15;
  }

  // 5. Recent Leadership Hire (<12 months)
  if (lead.leadershipHiredLastYear) {
    score += 15;
  }

  return Math.min(score, 100);
}

export function getFitReason(lead: LeadData): string[] {
  const reasons = [];
  if (lead.stage?.includes("Series A") || lead.stage?.includes("Series B")) reasons.push("Ideal Funding (Series A/B)");
  if (lead.employeeCount && lead.employeeCount <= 200) reasons.push("Tipping Point Size");
  if (lead.leadershipHiredLastYear) reasons.push("New Sales Leadership");
  if (lead.missingRevOps) reasons.push("Comp Gap (No RevOps)");
  return reasons;
}
