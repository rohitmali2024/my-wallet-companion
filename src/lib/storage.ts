import { User, Expense } from '@/types/expense';

// Local storage keys
const USERS_KEY = 'expense_tracker_users';
const EXPENSES_KEY = 'expense_tracker_expenses';
const AUTH_KEY = 'expense_tracker_auth';

// User storage
export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const createUser = (email: string, name: string, password: string): User => {
  const users = getUsers();
  
  // Store password hash (in real app, this would be bcrypt on backend)
  const userPasswords = JSON.parse(localStorage.getItem('expense_tracker_passwords') || '{}');
  
  const newUser: User = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    name,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  saveUsers(users);
  
  // Store password (simulated hash)
  userPasswords[newUser.id] = btoa(password);
  localStorage.setItem('expense_tracker_passwords', JSON.stringify(userPasswords));
  
  return newUser;
};

export const validatePassword = (userId: string, password: string): boolean => {
  const userPasswords = JSON.parse(localStorage.getItem('expense_tracker_passwords') || '{}');
  return userPasswords[userId] === btoa(password);
};

// Expense storage
export const getExpenses = (): Expense[] => {
  const data = localStorage.getItem(EXPENSES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveExpenses = (expenses: Expense[]): void => {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
};

export const getUserExpenses = (userId: string): Expense[] => {
  const expenses = getExpenses();
  return expenses
    .filter(e => e.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createExpense = (
  userId: string,
  category: string,
  amount: number,
  comments: string
): Expense => {
  const expenses = getExpenses();
  const now = new Date().toISOString();
  
  const newExpense: Expense = {
    id: crypto.randomUUID(),
    userId,
    category,
    amount,
    comments,
    createdAt: now,
    updatedAt: now,
  };
  
  expenses.push(newExpense);
  saveExpenses(expenses);
  
  return newExpense;
};

export const updateExpense = (
  expenseId: string,
  category: string,
  amount: number,
  comments: string
): Expense | null => {
  const expenses = getExpenses();
  const index = expenses.findIndex(e => e.id === expenseId);
  
  if (index === -1) return null;
  
  expenses[index] = {
    ...expenses[index],
    category,
    amount,
    comments,
    updatedAt: new Date().toISOString(),
  };
  
  saveExpenses(expenses);
  return expenses[index];
};

export const deleteExpense = (expenseId: string): boolean => {
  const expenses = getExpenses();
  const filtered = expenses.filter(e => e.id !== expenseId);
  
  if (filtered.length === expenses.length) return false;
  
  saveExpenses(filtered);
  return true;
};

// Auth storage
export const getStoredAuth = (): { userId: string; token: string } | null => {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveAuth = (userId: string, token: string): void => {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ userId, token }));
};

export const clearAuth = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const generateToken = (userId: string): string => {
  // Simulated JWT token
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  }));
  const signature = btoa(`${header}.${payload}.secret`);
  return `${header}.${payload}.${signature}`;
};
