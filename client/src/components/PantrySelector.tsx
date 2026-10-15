import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Clock, 
  Check, 
  Shuffle, 
  SlidersHorizontal,
  Beef,
  Carrot,
  Milk,
  Wheat,
  Leaf,
  Layers,
  Sparkles
} from 'lucide-react';
import { playClickSound, playIngredientPop } from '../lib/soundEffects';
import { CURATED_PRESETS } from '../lib/curatedRecipes';
import type { FullRecipe } from '../lib/recipeSchema';

interface PantrySelectorProps {
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  onClearIngredients: () => void;
  onSelectPreset: (preset: FullRecipe) => void;
  onGenerate: () => void;
  isLoading: boolean;
  dietaryFilter: string;
  setDietaryFilter: (val: string) => void;
  timeLimit: string;
  setTimeLimit: (val: string) => void;
  spiceLevel: string;
  setSpiceLevel: (val: string) => void;
  mealType: string;
  setMealType: (val: string) => void;
  customPromptText: string;
  setCustomPromptText: (val: string) => void;
  activeRecipeId?: string;
  onClose?: () => void;
}

const PANTRY_CATEGORIES = [
  {
    name: 'Proteins',
    icon: Beef,
    items: ['Chilean Sea Bass', 'Ribeye Steak', 'Chicken Breast', 'Wild Salmon', 'Jumbo Shrimp', 'Silken Tofu', 'Duck Breast', 'Eggs']
  },
  {
    name: 'Produce',
    icon: Carrot,
    items: ['Baby Spinach', 'Asparagus', 'Wild Mushrooms', 'Heirloom Tomatoes', 'Avocado', 'French Shallots', 'Garlic Cloves', 'Broccolini']
  },
  {
    name: 'Dairy',
    icon: Milk,
    items: ['Parmigiano-Reggiano', 'Burrata', 'European Butter', 'Heavy Cream', 'Pecorino Romano', 'Greek Yogurt', 'Truffle Butter']
  },
  {
    name: 'Grains',
    icon: Wheat,
    items: ['Arborio Rice', 'Pappardelle', 'Sourdough Bread', 'Quinoa', 'Jasmine Rice', 'Fingerling Potatoes']
  },
  {
    name: 'Aromatics',
    icon: Leaf,
    items: ['Fresh Rosemary', 'Fresh Thyme', 'Genovese Basil', 'Saffron Threads', 'Dry White Wine', 'White Truffle Oil', 'Maldon Sea Salt']
  }
];

const DIETARY_OPTIONS = ['Omnivore', 'Keto / Low-Carb', 'Plant-Based', 'Gluten-Free', 'Mediterranean'];
const TIME_OPTIONS = ['15m Express', '30m Bistro', '45m+ Haute'];
const SPICE_OPTIONS = ['Delicate', 'Balanced', 'Fiery Bold'];

export const PantrySelector: React.FC<PantrySelectorProps> = ({
  selectedIngredients,
  onToggleIngredient,
  onClearIngredients,
  onSelectPreset,
  onGenerate,
  isLoading,
  dietaryFilter,
  setDietaryFilter,
  timeLimit,
  setTimeLimit,
  spiceLevel,
  setSpiceLevel,
  customPromptText,
  setCustomPromptText,
  activeRecipeId,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [showParameters, setShowParameters] = useState(false);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!selectedIngredients.includes(trimmed)) {
      onToggleIngredient(trimmed);
      playIngredientPop(true);
    }
    setCustomInput('');
  };

  const handleRandomize = () => {
    playClickSound();
    onClearIngredients();
    const all = PANTRY_CATEGORIES.flatMap(c => c.items);
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 4);
    picked.forEach(item => onToggleIngredient(item));
  };

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-card/95 select-none">
      
      {/* Top Console Instrument Header */}
      <div className="p-3.5 sm:p-4 border-b border-border/80 flex items-center justify-between shrink-0 bg-card">
        <div className="flex items-center gap-2 min-w-0">
          <span className="skeuo-led bg-orange-500 shadow-orange-500/50 shrink-0" />
          <h2 className="mono-lcd text-xs font-bold uppercase tracking-wider text-foreground truncate">
            PANTRY CONSOLE
          </h2>
          <span className="mono-lcd text-[10px] font-bold px-1.5 py-0.2 rounded-md skeuo-inset-sm text-orange-500 shrink-0">
            {selectedIngredients.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleRandomize}
            className="skeuo-btn p-1.5 rounded-lg text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
            title="Chef Surprise: Randomize Provisions"
          >
            <Shuffle className="w-3.5 h-3.5 text-orange-500" />
          </button>

          {selectedIngredients.length > 0 && (
            <button
              onClick={() => {
                playClickSound();
                onClearIngredients();
              }}
              className="skeuo-btn px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-destructive hover:brightness-110 active:scale-95 transition-transform"
              title="Clear Provisions"
            >
              Reset
            </button>
          )}

          <button
            onClick={() => {
              playClickSound();
              setShowParameters(!showParameters);
            }}
            className={`skeuo-btn p-1.5 rounded-lg active:scale-95 transition-all ${
              showParameters ? 'skeuo-btn-active text-orange-500' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Toggle Parameters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {onClose && (
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="skeuo-btn p-1.5 rounded-lg text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
              title="Close Pantry Console"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Preset Memory Banks (Physical segmented buttons with proper min-w-0) */}
      <div className="p-3 border-b border-border/60 bg-muted/20 shrink-0">
        <span className="mono-lcd text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1.5">
          // MEMORY BANKS (PRESETS)
        </span>
        <div className="grid grid-cols-2 gap-2 min-w-0">
          {CURATED_PRESETS.map((preset, idx) => {
            const isActive = activeRecipeId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  playClickSound();
                  onSelectPreset(preset);
                }}
                className={`p-2 rounded-xl text-left transition-all min-w-0 flex flex-col justify-between ${
                  isActive
                    ? 'skeuo-inset-sm text-orange-500'
                    : 'skeuo-btn text-foreground hover:brightness-105 active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground mb-1 w-full">
                  <span className="font-bold text-orange-500">M-0{idx + 1}</span>
                  <span className="truncate ml-1">{preset.totalTime}</span>
                </div>
                <div className="text-[11px] font-semibold truncate w-full">
                  {preset.title.split(' with ')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Center: Provision Explorer & Active Well (with min-h-0 to eliminate overflow) */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 sm:p-4 space-y-4">
        
        {/* Active Provisions Well */}
        {selectedIngredients.length > 0 ? (
          <div className="space-y-1.5">
            <span className="mono-lcd text-[10px] uppercase font-bold text-muted-foreground block">
              Active Provisions In Skillet ({selectedIngredients.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedIngredients.map((ing) => (
                <span
                  key={ing}
                  className="skeuo-inset-sm inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg text-foreground animate-in fade-in"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span className="truncate max-w-[140px]">{ing}</span>
                  <button
                    type="button"
                    onClick={() => {
                      playIngredientPop(false);
                      onToggleIngredient(ing);
                    }}
                    className="hover:text-destructive text-muted-foreground transition-colors ml-0.5 shrink-0"
                    title={`Remove ${ing}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="skeuo-inset-sm p-3 rounded-xl text-center text-xs text-muted-foreground">
            Select mechanical provisions below to populate skillet.
          </div>
        )}

        {/* Collapsible Parameters (Skeuomorphic Segmented Controls) */}
        {showParameters && (
          <div className="skeuo-inset-sm p-3 rounded-xl space-y-2.5 animate-in fade-in slide-in-from-top-1">
            <div className="grid grid-cols-3 gap-2 text-xs">
              
              <div className="space-y-1 min-w-0">
                <label className="mono-lcd text-[9px] uppercase font-bold text-muted-foreground block truncate">Diet</label>
                <select
                  value={dietaryFilter}
                  onChange={(e) => {
                    playClickSound();
                    setDietaryFilter(e.target.value);
                  }}
                  className="skeuo-btn w-full text-xs p-1.5 rounded-lg border-0 bg-card text-foreground cursor-pointer focus:ring-1 focus:ring-orange-500"
                >
                  {DIETARY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-1 min-w-0">
                <label className="mono-lcd text-[9px] uppercase font-bold text-muted-foreground block truncate">Timing</label>
                <select
                  value={timeLimit}
                  onChange={(e) => {
                    playClickSound();
                    setTimeLimit(e.target.value);
                  }}
                  className="skeuo-btn w-full text-xs p-1.5 rounded-lg border-0 bg-card text-foreground cursor-pointer focus:ring-1 focus:ring-orange-500"
                >
                  {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1 min-w-0">
                <label className="mono-lcd text-[9px] uppercase font-bold text-muted-foreground block truncate">Heat</label>
                <select
                  value={spiceLevel}
                  onChange={(e) => {
                    playClickSound();
                    setSpiceLevel(e.target.value);
                  }}
                  className="skeuo-btn w-full text-xs p-1.5 rounded-lg border-0 bg-card text-foreground cursor-pointer focus:ring-1 focus:ring-orange-500"
                >
                  {SPICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

            </div>
          </div>
        )}

        {/* Category Selector Tabs */}
        <div className="space-y-2">
          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
            {PANTRY_CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === idx;
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    playClickSound();
                    setActiveCategory(idx);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'skeuo-btn-active text-orange-500 font-bold'
                      : 'skeuo-btn text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Provision Keys (Physical push buttons) */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {PANTRY_CATEGORIES[activeCategory].items.map((item) => {
              const isPicked = selectedIngredients.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => {
                    playIngredientPop(!isPicked);
                    onToggleIngredient(item);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                    isPicked
                      ? 'skeuo-btn-active text-orange-500 font-bold'
                      : 'skeuo-btn text-foreground hover:brightness-105'
                  }`}
                >
                  {isPicked ? <Check className="w-3 h-3 inline mr-1 stroke-[3]" /> : <Plus className="w-3 h-3 inline mr-1 opacity-60" />}
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input Well */}
        <form onSubmit={handleAddCustom} className="pt-2 flex gap-1.5">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Type custom provision (e.g. Scallops, Mirin)..."
            className="skeuo-inset-sm flex-1 px-3 py-1.5 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-foreground placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="skeuo-btn px-3 py-1.5 text-xs font-bold rounded-xl text-foreground disabled:opacity-40 active:scale-95 transition-transform"
          >
            Add
          </button>
        </form>

      </div>

      {/* Bottom Command Center (Always Fixed & Visible) */}
      <div className="p-3.5 sm:p-4 border-t border-border/80 bg-card space-y-2.5 shrink-0">
        
        {/* Custom Instruction Input */}
        <input
          type="text"
          value={customPromptText}
          onChange={(e) => setCustomPromptText(e.target.value)}
          placeholder="Chef directive (e.g. 'Extra crispy skin', 'Low sodium')..."
          className="skeuo-inset-sm w-full px-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-foreground placeholder:text-muted-foreground"
        />

        {/* Master Mechanical Execution Button */}
        <button
          onClick={() => {
            playClickSound();
            onGenerate();
          }}
          disabled={isLoading || (selectedIngredients.length === 0 && !customPromptText.trim())}
          className="skeuo-btn w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-foreground active:text-orange-500 active:scale-[0.99] disabled:opacity-40 transition-all shadow-md"
        >
          {isLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span className="mono-lcd">PROCESSING FORMULATION...</span>
            </>
          ) : (
            <>
              <span className="skeuo-led bg-orange-500 shadow-orange-500/50" />
              <span className="mono-lcd">EXECUTE RECIPE SYNTHESIS</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
};
