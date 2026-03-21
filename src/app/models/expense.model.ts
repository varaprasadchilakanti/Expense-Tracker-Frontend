export interface Expense {
  id: number;
  user: number;
  title: string;
  amount: string;
  category: string;
  date: string;
  created_at: string;
}

export interface CreateExpensePayload {
  title: string;
  amount: string;
  category: string;
  date: string;
}

export interface ExpenseSummary {
  month: number;
  year: number;
  total_expense: string;
  count: number;
}

export interface CategoryBreakdown {
  category: string;
  total: string;
}

export interface InsightResult {
  insights: string[];
  cached: boolean;
}
