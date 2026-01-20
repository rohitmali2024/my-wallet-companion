import { useState, useEffect, useCallback } from 'react';
import { Expense } from '@/types/expense';
import { 
  getUserExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense 
} from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useExpenses = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExpenses = useCallback(() => {
    if (!user) {
      setExpenses([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const userExpenses = getUserExpenses(user.id);
    setExpenses(userExpenses);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = useCallback(async (
    category: string,
    amount: number,
    comments: string
  ): Promise<boolean> => {
    if (!user) return false;
    
    try {
      createExpense(user.id, category, amount, comments);
      fetchExpenses();
      toast({
        title: 'Expense added',
        description: `$${amount.toFixed(2)} expense added successfully.`,
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add expense. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, [user, fetchExpenses, toast]);

  const editExpense = useCallback(async (
    expenseId: string,
    category: string,
    amount: number,
    comments: string
  ): Promise<boolean> => {
    try {
      const updated = updateExpense(expenseId, category, amount, comments);
      if (!updated) {
        toast({
          title: 'Error',
          description: 'Expense not found.',
          variant: 'destructive',
        });
        return false;
      }
      fetchExpenses();
      toast({
        title: 'Expense updated',
        description: 'Your expense has been updated successfully.',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update expense. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, [fetchExpenses, toast]);

  const removeExpense = useCallback(async (expenseId: string): Promise<boolean> => {
    try {
      const deleted = deleteExpense(expenseId);
      if (!deleted) {
        toast({
          title: 'Error',
          description: 'Expense not found.',
          variant: 'destructive',
        });
        return false;
      }
      fetchExpenses();
      toast({
        title: 'Expense deleted',
        description: 'Your expense has been deleted.',
      });
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete expense. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  }, [fetchExpenses, toast]);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return {
    expenses,
    isLoading,
    addExpense,
    editExpense,
    removeExpense,
    totalExpenses,
    expensesByCategory,
    refetch: fetchExpenses,
  };
};
