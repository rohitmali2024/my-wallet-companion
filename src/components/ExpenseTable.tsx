import React, { useState } from 'react';
import { Expense } from '@/types/expense';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Receipt } from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Food & Dining': 'bg-chart-3/20 text-chart-3 border-chart-3/30',
    'Transportation': 'bg-chart-2/20 text-chart-2 border-chart-2/30',
    'Shopping': 'bg-chart-4/20 text-chart-4 border-chart-4/30',
    'Entertainment': 'bg-chart-5/20 text-chart-5 border-chart-5/30',
    'Bills & Utilities': 'bg-chart-1/20 text-chart-1 border-chart-1/30',
    'Healthcare': 'bg-chart-6/20 text-chart-6 border-chart-6/30',
    'Travel': 'bg-info/20 text-info border-info/30',
    'Education': 'bg-primary/20 text-primary border-primary/30',
    'Other': 'bg-muted text-muted-foreground border-border',
  };
  return colors[category] || colors['Other'];
};

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, onEdit, onDelete }) => {
  const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null);

  const handleDelete = () => {
    if (deleteExpense) {
      onDelete(deleteExpense);
      setDeleteExpense(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No expenses yet</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Click the "Add Expense" button to start tracking your expenses.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Recent Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={`${getCategoryColor(expense.category)} font-medium`}
                      >
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(expense.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(expense.updatedAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {expense.comments || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onEdit(expense)}
                          className="hover:bg-accent"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDeleteExpense(expense)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteExpense} onOpenChange={(open) => !open && setDeleteExpense(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
              {deleteExpense && (
                <span className="block mt-2 font-medium text-foreground">
                  {deleteExpense.category} — ${deleteExpense.amount.toFixed(2)}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
