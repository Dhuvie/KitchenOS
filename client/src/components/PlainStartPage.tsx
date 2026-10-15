import React, { useState, useRef } from 'react';
import { 
  ArrowUp, 
  Sparkles, 
  Plus, 
  X, 
  Shuffle, 
  SlidersHorizontal, 
  Beef, 
  Carrot, 
  Milk, 
  Wheat, 
  Leaf, 
  Clock, 
  Flame, 
  Utensils, 
  Cpu, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { CURATED_PRESETS } from '../lib/curatedRecipes';
import type { FullRecipe } from '../lib/recipeSchema';
import { playClickSound, playIngredientPop } from '../lib/soundEffects';

interface PlainStartPageProps {
  customPromptText: string;
  setCustomPromptText: (val: string) => void;
  selectedIngredients: string[];
  onToggleIngredient: (item: string) => void;
  onClearIngredients: () => void;
  dietaryFilter: string;
  setDietaryFilter: (val: string) => void;
  timeLimit: string;
  setTimeLimit: (val: string) => void;
  spiceLevel: string;
  setSpiceLevel: (val: string) => void;
  mealType: string;
  setMealType: (val: string) => void;
  onGenerate: () => void;
  onSelectPreset: (preset: FullRecipe) => void;
  onRandomizeAndGenerate: () => void;
  isLoading: boolean;
  pastRecipes?: FullRecipe[];
}

const PANTRY_QUICK_TRAY = [
  {
    category: 'Proteins',
    icon: Beef,
    items: ['Chilean Sea Bass', 'Ribeye Steak', 'Chicken Breast', 'Wild Salmon', 'Eggs', 'Jumbo Shrimp', 'Silken Tofu']
  },
  {
    category: 'Produce',
    icon: Carrot,
    items: ['Wild Mushrooms', 'Asparagus', 'Heirloom Tomatoes', 'Baby Spinach', 'Avocado', 'French Shallots', 'Garlic Cloves']
  },
  {
    category: 'Dairy',
    icon: Milk,
    items: ['Parmigiano-Reggiano', 'Burrata', 'European Butter', 'Heavy Cream', 'Pecorino Romano']
  },
  {
    category: 'Grains & Pasta',
    icon: Wheat,
    items: ['Arborio Rice', 'Pappardelle', 'Sourdough Bread', 'Quinoa', 'Fingerling Potatoes']
  },
  {
    category: 'Aromatics & Spices',
    icon: Leaf,
    items: ['Fresh Rosemary', 'Fresh Thyme', 'Genovese Basil', 'Saffron Threads', 'Dry White Wine', 'White Truffle Oil']
  }
];

const DIETARY_OPTIONS = ['Omnivore', 'Keto / Low-Carb', 'Plant-Based', 'Gluten-Free', 'Mediterranean'];
const TIME_OPTIONS = ['15m Express', '30m Bistro', '45m+ Haute'];
const SPICE_OPTIONS = ['Delicate', 'Balanced', 'Fiery Bold'];

export const PlainStartPage: React.FC<PlainStartPageProps> = ({
  customPromptText,
  setCustomPromptText,
  selectedIngredients,
  onToggleIngredient,
  onClearIngredients,
  dietaryFilter,
  setDietaryFilter,
  timeLimit,
  setTimeLimit,
  spiceLevel,
  setSpiceLevel,
  mealType,
  setMealType,
  onGenerate,
  onSelectPreset,
  onRandomizeAndGenerate,
  isLoading,
  pastRecipes
}) => {
  const [showPantryTray, setShowPantryTray] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (customPromptText.trim() || selectedIngredients.length > 0)) {
        playClickSound();
        onGenerate();
      }
    }
  };

  const cycleOption = (current: string, options: string[], setter: (val: string) => void) => {
    playClickSound();
    const idx = options.indexOf(current);
    const next = options[(idx + 1) % options.length];
    setter(next);
  };

  const hasInput = customPromptText.trim().length > 0 || selectedIngredients.length > 0;

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Brand Hero Greeting (Gemini / Claude / GPT Style) */}
      <div className="text-center space-y-3 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full skeuo-inset-sm">
          <span className="skeuo-led bg-emerald-500 shadow-emerald-500/50" />
          <span className="mono-lcd text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            KITCHEN.OS // PRECISION KITCHEN INTELLIGENCE
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-sans">
          What are we cooking today?
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Enter what you have in your fridge, name a dish you crave, or pick from benchmark culinary techniques below.
        </p>
      </div>

      {/* Signature Floating Prompt Box */}
      <div className="w-full skeuo-raised rounded-3xl p-3 sm:p-4 border border-border/80 shadow-md transition-all focus-within:ring-2 focus-within:ring-orange-500/30 space-y-3">
        
        {/* Active Tagged Ingredients Badges */}
        {selectedIngredients.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pb-1">
            <span className="mono-lcd text-[10px] font-bold text-muted-foreground uppercase mr-1">
              PROVISIONS ({selectedIngredients.length}):
            </span>
            {selectedIngredients.map((item) => (
              <span
                key={item}
                className="skeuo-btn text-xs font-semibold px-2.5 py-1 rounded-lg text-foreground flex items-center gap-1.5 group"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => {
                    playIngredientPop();
                    onToggleIngredient(item);
                  }}
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                  title={`Remove ${item}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onClearIngredients();
              }}
              className="text-[10px] mono-lcd text-muted-foreground hover:text-red-500 ml-1 transition-colors underline"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            rows={showPantryTray ? 2 : 3}
            value={customPromptText}
            onChange={(e) => setCustomPromptText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., I have chicken breasts, garlic, and wild mushrooms. Formulate a 25-minute crispy bistro dinner..."
            className="w-full bg-transparent resize-none text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none leading-relaxed p-1"
          />
        </div>

        {/* Collapsible Pantry Provisions Tray */}
        {showPantryTray && (
          <div className="skeuo-inset-sm p-3 rounded-2xl space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="mono-lcd text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                QUICK-TAG PANTRY PROVISIONS
              </span>
              <button
                type="button"
                onClick={() => setShowPantryTray(false)}
                className="text-xs text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {PANTRY_QUICK_TRAY.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground mono-lcd uppercase">
                      <CatIcon className="w-3 h-3 text-orange-500" />
                      <span>{cat.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((item) => {
                        const isSelected = selectedIngredients.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              playIngredientPop();
                              onToggleIngredient(item);
                            }}
                            className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-orange-500 text-white font-semibold shadow-sm'
                                : 'skeuo-btn text-foreground hover:text-orange-500'
                            }`}
                          >
                            {isSelected ? `✓ ${item}` : item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Collapsible Parameters Tuning Row */}
        {showFilters && (
          <div className="skeuo-inset-sm p-3 rounded-2xl flex flex-wrap items-center gap-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-1 text-[10px] mono-lcd text-muted-foreground uppercase mr-1">
              <SlidersHorizontal className="w-3 h-3 text-orange-500" />
              <span>Directives:</span>
            </div>

            {/* Dietary */}
            <button
              type="button"
              onClick={() => cycleOption(dietaryFilter, DIETARY_OPTIONS, setDietaryFilter)}
              className="skeuo-btn px-2.5 py-1 rounded-lg text-xs font-semibold text-foreground hover:text-orange-500 transition-colors"
              title="Click to cycle dietary profile"
            >
              🥗 {dietaryFilter}
            </button>

            {/* Time */}
            <button
              type="button"
              onClick={() => cycleOption(timeLimit, TIME_OPTIONS, setTimeLimit)}
              className="skeuo-btn px-2.5 py-1 rounded-lg text-xs font-semibold text-foreground hover:text-orange-500 transition-colors"
              title="Click to cycle preparation window"
            >
              ⏱️ {timeLimit}
            </button>

            {/* Spice */}
            <button
              type="button"
              onClick={() => cycleOption(spiceLevel, SPICE_OPTIONS, setSpiceLevel)}
              className="skeuo-btn px-2.5 py-1 rounded-lg text-xs font-semibold text-foreground hover:text-orange-500 transition-colors"
              title="Click to cycle spice profile"
            >
              🌶️ {spiceLevel}
            </button>
          </div>
        )}

        {/* Bottom Action Bar inside Prompt Box */}
        <div className="flex items-center justify-between pt-1 border-t border-border/40">
          
          {/* Quick Attachment Toggles */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Toggle Quick Pantry Tray */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setShowPantryTray(!showPantryTray);
              }}
              className={`skeuo-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                showPantryTray ? 'text-orange-500 font-bold border-orange-500/40' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Add pantry ingredients by tapping"
            >
              <Plus className="w-3.5 h-3.5 text-orange-500" />
              <span>Provisions</span>
              {showPantryTray ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Toggle Tuning Directives */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setShowFilters(!showFilters);
              }}
              className={`skeuo-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                showFilters ? 'text-orange-500 font-bold border-orange-500/40' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Diet, Time & Spice settings"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden sm:inline">Preferences</span>
              {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Chef Surprise Button */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onRandomizeAndGenerate();
              }}
              className="skeuo-btn px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-1"
              title="Random chef formulation"
            >
              <Shuffle className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden md:inline">Surprise Me</span>
            </button>

          </div>

          {/* Send Actuator Button */}
          <button
            type="button"
            disabled={isLoading || !hasInput}
            onClick={() => {
              playClickSound();
              onGenerate();
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all ${
              hasInput && !isLoading
                ? 'skeuo-btn text-orange-500 hover:scale-105 active:scale-95 shadow-sm font-bold'
                : 'opacity-40 cursor-not-allowed skeuo-inset-sm text-muted-foreground'
            }`}
            title="Formulate Recipe (Enter)"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            )}
          </button>

        </div>

      </div>

      {/* Recent Formulations History Log (When past recipes exist in storage) */}
      {pastRecipes && pastRecipes.length > 0 && (
        <div className="w-full space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="mono-lcd text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              // RECENT FORMULATIONS (YOUR HISTORY)
            </span>
            <span className="mono-lcd text-[10px] text-orange-500 font-bold">
              {pastRecipes.length} STORED IN MEMORY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {pastRecipes.slice(0, 2).map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => {
                  playClickSound();
                  onSelectPreset(recipe);
                }}
                className="skeuo-btn p-3.5 sm:p-4 rounded-2xl text-left hover:border-orange-500/40 active:scale-[0.98] transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1.5 w-full">
                  <span className="font-bold text-orange-500">{recipe.cuisine || 'Gourmet'}</span>
                  <span>⏱️ {recipe.totalTime}</span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-orange-500 transition-colors line-clamp-1 mb-1 font-sans">
                  {recipe.title}
                </h3>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {recipe.ingredients.slice(0, 4).map(i => i.name).join(', ')}...
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggestion Benchmark Cards (Claude / ChatGPT style 2x2 grid) */}
      <div className="w-full space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="mono-lcd text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            // INSPIRATIONS & BENCHMARK PRESETS
          </span>
          <span className="mono-lcd text-[10px] text-muted-foreground">
            SELECT TO FORMULATE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {CURATED_PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              onClick={() => {
                playClickSound();
                onSelectPreset(preset);
              }}
              className="skeuo-btn p-3.5 sm:p-4 rounded-2xl text-left hover:border-orange-500/40 active:scale-[0.98] transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground mb-1.5 w-full">
                <span className="font-bold text-orange-500">M-0{idx + 1} // {preset.cuisine}</span>
                <span>⏱️ {preset.totalTime}</span>
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-orange-500 transition-colors line-clamp-1 mb-1 font-sans">
                {preset.title}
              </h3>
              <p className="text-[11px] text-muted-foreground line-clamp-1">
                {preset.subtitle || preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Discrete Minimalist Footer */}
      <div className="text-center pt-2">
        <p className="mono-lcd text-[10px] text-muted-foreground/70">
          POWERED BY GEMINI 2.5 FLASH • SKEUOMORPHIC AUDIO SYNTHESIS • TACTILE HARDWARE FEEL
        </p>
      </div>

    </div>
  );
};
