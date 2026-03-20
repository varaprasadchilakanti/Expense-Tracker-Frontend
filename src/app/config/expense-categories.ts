export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Housing & Rent',
  'Utilities',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Education',
  'Travel',
  'Groceries',
  'Personal Care',
  'Insurance',
  'Investments & Savings',
  'Subscriptions',
  'Gifts & Donations',
  'Family',
  'Pets',
  'Repairs & Maintenance',
  'Taxes & Fees',
  'Other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
