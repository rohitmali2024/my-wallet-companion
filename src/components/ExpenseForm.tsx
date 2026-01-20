import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EXPENSE_CATEGORIES, Expense } from '@/types/expense';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

const expenseSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  amount: z.number().positive('Amount must be greater than 0').max(1000000, 'Amount is too large'),
  comments: z.string().max(500, 'Comments must be less than 500 characters'),
});

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: (category: string, amount: number, comments: string) => Promise<void>;
  onCancel: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSubmit, onCancel }) => {
  const [category, setCategory] = useState(expense?.category || '');
  const [amount, setAmount] = useState(expense?.amount.toString() || '');
  const [comments, setComments] = useState(expense?.comments || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const amountNum = parseFloat(amount);
    const validation = expenseSchema.safeParse({
      category,
      amount: isNaN(amountNum) ? 0 : amountNum,
      comments: comments.trim(),
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    await onSubmit(category, amountNum, comments.trim());
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} disabled={isLoading}>
          <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {EXPENSE_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
          className={errors.amount ? 'border-destructive' : ''}
        />
        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comments (Optional)</Label>
        <Textarea
          id="comments"
          placeholder="Add any notes about this expense..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          disabled={isLoading}
          className={errors.comments ? 'border-destructive' : ''}
          rows={3}
        />
        {errors.comments && (
          <p className="text-sm text-destructive">{errors.comments}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {expense ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            expense ? 'Update Expense' : 'Add Expense'
          )}
        </Button>
      </div>
    </form>
  );
};
