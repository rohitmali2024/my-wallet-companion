import React from 'react';
import { Layout } from '@/components/Layout';
import { useExpenses } from '@/hooks/useExpenses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Loader2, TrendingUp, DollarSign } from 'lucide-react';

const COLORS = [
  'hsl(142, 76%, 36%)',  // primary green
  'hsl(199, 89%, 48%)',  // info blue
  'hsl(38, 92%, 50%)',   // warning yellow
  'hsl(280, 65%, 60%)',  // purple
  'hsl(0, 84%, 60%)',    // destructive red
  'hsl(173, 80%, 40%)',  // teal
  'hsl(220, 70%, 50%)',  // blue
  'hsl(340, 75%, 55%)',  // pink
  'hsl(45, 93%, 47%)',   // gold
];

const Analytics: React.FC = () => {
  const { expenses, isLoading, totalExpenses, expensesByCategory } = useExpenses();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
    percentage: totalExpenses > 0 ? ((value / totalExpenses) * 100).toFixed(1) : '0',
  }));

  const sortedCategories = [...pieData].sort((a, b) => b.value - a.value);
  const topCategory = sortedCategories[0];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Visualize your spending patterns
          </p>
        </div>

        {expenses.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-muted p-4 mb-4">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No expenses yet</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Start adding expenses to see your spending analytics and category distribution.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pie Chart */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Category Distribution
                </CardTitle>
                <CardDescription>
                  See how your expenses are distributed across categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            stroke="transparent"
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom"
                        formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Category Breakdown
                </CardTitle>
                <CardDescription>
                  Detailed spending by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedCategories.map((category, index) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium text-foreground">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-foreground">
                            ${category.value.toFixed(2)}
                          </span>
                          <span className="text-muted-foreground text-sm ml-2">
                            ({category.percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${category.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">Total Expenses</span>
                    <span className="text-2xl font-bold text-foreground">
                      ${totalExpenses.toFixed(2)}
                    </span>
                  </div>
                  {topCategory && (
                    <div className="p-4 bg-accent/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Top spending category</p>
                      <p className="font-semibold text-foreground mt-1">
                        {topCategory.name} — ${topCategory.value.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;
