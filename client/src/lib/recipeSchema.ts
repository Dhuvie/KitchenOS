import { z } from 'zod';

export const ingredientItemSchema = z.object({
  name: z.string(),
  amount: z.number().default(1),
  unit: z.string().default('portion'),
  swapSuggestion: z.string().optional().nullable(),
  category: z.string().optional()
});

export const stepItemSchema = z.object({
  stepNumber: z.number(),
  instruction: z.string(),
  technique: z.string().optional(),
  timerSeconds: z.number().optional().default(0),
  chefTip: z.string().optional()
});

export const macroItemSchema = z.object({
  name: z.string(),
  value: z.number(),
  unit: z.string().default('g'),
  dailyPct: z.number().optional(),
  color: z.string().optional()
});

export const winePairingSchema = z.object({
  alcoholic: z.string(),
  nonAlcoholic: z.string(),
  notes: z.string()
});

export const fullRecipeSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  cuisine: z.string().default('Contemporary Gastronomy'),
  difficulty: z.enum(['Amateur', 'Bistro', 'Michelin Star']).default('Bistro'),
  prepTime: z.string().default('15 mins'),
  cookTime: z.string().default('20 mins'),
  totalTime: z.string().default('35 mins'),
  servings: z.number().default(2),
  calories: z.number().default(450),
  ingredients: z.array(ingredientItemSchema),
  steps: z.array(stepItemSchema),
  macros: z.array(macroItemSchema),
  winePairing: winePairingSchema.optional(),
  chefSecret: z.string().optional(),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  createdAt: z.number().default(() => Date.now())
});

export interface IngredientItem {
  name: string;
  amount: number;
  unit: string;
  swapSuggestion?: string | null;
  category?: string;
}

export interface StepItem {
  stepNumber: number;
  instruction: string;
  technique?: string;
  timerSeconds?: number;
  chefTip?: string;
}

export interface MacroItem {
  name: string;
  value: number;
  unit: string;
  dailyPct?: number;
  color?: string;
}

export interface WinePairing {
  alcoholic: string;
  nonAlcoholic: string;
  notes: string;
}

export interface FullRecipe {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  cuisine: string;
  difficulty: 'Amateur' | 'Bistro' | 'Michelin Star';
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  calories: number;
  ingredients: IngredientItem[];
  steps: StepItem[];
  macros: MacroItem[];
  winePairing?: WinePairing;
  chefSecret?: string;
  tags: string[];
  image?: string;
  createdAt?: number;
}
