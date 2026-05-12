export type PricingPlan = "Starter" | "Pro" | "Premium";
export type PricingPeriod = "monthly" | "quarterly" | "yearly";

export const PLAN_PRICES = {
  Starter: {
    monthly: 490,
    quarterly: 1323, // 490 * 3 * 0.9 (10% de réduction)
    yearly: 4998, // 490 * 12 * 0.85 (15% de réduction)
  },
  Pro: {
    monthly: 890,
    quarterly: 2403, // 890 * 3 * 0.9
    yearly: 9078, // 890 * 12 * 0.85
  },
  Premium: {
    monthly: 1490,
    quarterly: 4023, // 1490 * 3 * 0.9
    yearly: 15198, // 1490 * 12 * 0.85
  },
}; 