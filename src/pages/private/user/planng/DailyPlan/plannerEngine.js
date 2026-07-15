import { INITIAL_DAILY_PLAN } from './plannerData';

export function clonePlans(plans) {
  return JSON.parse(JSON.stringify(plans));
}

export function generatePlan(plans, dateKey) {
  const next = clonePlans(plans);
  const generatedIds = new Set(INITIAL_DAILY_PLAN.map((item) => item.id));
  Object.keys(next).forEach((key) => {
    next[key] = (next[key] || []).filter((item) => !generatedIds.has(item.id));
  });
  next[dateKey] = INITIAL_DAILY_PLAN.map((item) => ({ ...item }));
  return next;
}
