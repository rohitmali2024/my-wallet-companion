import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Receipt, TrendingUp, Wallet } from 'lucide-react';

interface StatsCardsProps {
  totalExpenses: number;
  expenseCount: number;
  expensesByCategory: Record<string, number>;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ 
  totalExpenses, 
  expenseCount,
  expensesByCategory 
}) => {
  const categoryCount = Object.keys(expensesByCategory).length;
  const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

  const topCategory = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)[0];

  const stats = [
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toFixed(2)}`,
      description: `${expenseCount} transactions`,
      icon: DollarSign,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Transaction Count',
      value: expenseCount.toString(),
      description: `${categoryCount} categories`,
      icon: Receipt,
      iconBg: 'bg-info/10',
      iconColor: 'text-info',
    },
    {
      title: 'Average Expense',
      value: `$${averageExpense.toFixed(2)}`,
      description: 'Per transaction',
      icon: TrendingUp,
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
    },
    {
      title: 'Top Category',
      value: topCategory ? topCategory[0] : '—',
      description: topCategory ? `$${topCategory[1].toFixed(2)}` : 'No expenses',
      icon: Wallet,
      iconBg: 'bg-accent',
      iconColor: 'text-accent-foreground',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
