import React, { useState } from 'react';
import { 
  Play, 
  Bookmark, 
  BookmarkCheck, 
  Printer, 
  Copy, 
  Check, 
  Wine, 
  Clock, 
  Flame, 
  Send,
  Plus,
  Minus,
  ChefHat,
  Cpu,
  Layers
} from 'lucide-react';
import type { FullRecipe, IngredientItem } from '../lib/recipeSchema';
import { playClickSound, playIngredientPop } from '../lib/soundEffects';

interface RecipeViewProps {
  recipe: FullRecipe;
  onEnterCookMode: () => void;
  onSaveRecipe: (recipe: FullRecipe) => void;
  isSaved: boolean;
  onRefinePrompt: (refinePrompt: string) => void;
  isLoading: boolean;
}

export const RecipeView: React.FC<RecipeViewProps> = ({
  recipe,
  onEnterCookMode,
  onSaveRecipe,
  isSaved,
  onRefinePrompt,
  isLoading
}) => {
  const [servings, setServings] = useState(recipe.servings || 2);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [refineText, setRefineText] = useState('');

  const scaleFactor = servings / (recipe.servings || 2);

  const toggleIngredient = (name: string) => {
    playIngredientPop(!checkedIngredients.includes(name));
    if (checkedIngredients.includes(name)) {
      setCheckedIngredients(checkedIngredients.filter(i => i !== name));
    } else {
      setCheckedIngredients([...checkedIngredients, name]);
    }
  };

  const handleCopyMarkdown = () => {
    playClickSound();
    const markdown = `# ${recipe.title}
${recipe.subtitle || ''}

${recipe.description}

- Cuisine: ${recipe.cuisine} | Difficulty: ${recipe.difficulty}
- Timing: Prep ${recipe.prepTime} | Cook ${recipe.cookTime} | Total ${recipe.totalTime}
- Servings: ${servings} | Calories: ${Math.round(recipe.calories * scaleFactor)} kcal

## Ingredients
${recipe.ingredients.map(ing => `- ${Math.round(ing.amount * scaleFactor * 10) / 10} ${ing.unit} ${ing.name}${ing.swapSuggestion ? ` (Substitute: ${ing.swapSuggestion})` : ''}`).join('\n')}

## Method
${recipe.steps.map(step => `${step.stepNumber}. [${step.technique || 'Step'}]: ${step.instruction}${step.chefTip ? ` (Tip: ${step.chefTip})` : ''}`).join('\n')}

## Sommelier Pairing
- Wine: ${recipe.winePairing?.alcoholic || 'N/A'}
- Non-Alcoholic: ${recipe.winePairing?.nonAlcoholic || 'N/A'}
- Notes: ${recipe.winePairing?.notes || ''}

## Chef Technique Note
${recipe.chefSecret || ''}
`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  const handleRefineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineText.trim() || isLoading) return;
    playClickSound();
    onRefinePrompt(refineText.trim());
    setRefineText('');
  };

  const prepProgress = recipe.ingredients.length > 0 
    ? Math.round((checkedIngredients.length / recipe.ingredients.length) * 100) 
    : 0;

  return (
    <div className="w-full space-y-6 min-w-0">
      
      {/* Precision Recipe Header Instrument Card (Skeuomorphic Terminal) */}
      <div className="skeuo-raised rounded-2xl p-5 sm:p-7 space-y-5 transition-all min-w-0">
        
        {/* Status Line & Action Bar with Zero Overlap */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2 min-w-0 max-w-full">
            <span className="skeuo-led bg-emerald-500 shadow-emerald-500/50 shrink-0" />
            <span className="mono-lcd text-[11px] font-bold tracking-wider text-muted-foreground uppercase truncate">
              TERMINAL // {recipe.cuisine} • {recipe.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            
            {/* Tactile Cook Mode Push Button */}
            <button
              onClick={() => {
                playClickSound();
                onEnterCookMode();
              }}
              className="skeuo-btn px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-foreground active:text-orange-500 active:scale-95 transition-all shadow-sm"
              title="Enter Fullscreen Hands-Free Cook Mode"
            >
              <Play className="w-3.5 h-3.5 fill-current text-orange-500" />
              <span>Cook Mode</span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => {
                playClickSound();
                onSaveRecipe(recipe);
              }}
              className={`skeuo-btn p-1.5 rounded-xl text-xs active:scale-95 transition-all ${
                isSaved ? 'skeuo-btn-active text-orange-500' : 'text-muted-foreground hover:text-foreground'
              }`}
              title={isSaved ? 'Saved in Cookbook' : 'Save to Cookbook'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Copy */}
            <button
              onClick={handleCopyMarkdown}
              className="skeuo-btn p-1.5 rounded-xl text-xs text-muted-foreground hover:text-foreground active:scale-95 transition-all"
              title="Copy Recipe Markdown"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="skeuo-btn p-1.5 rounded-xl text-xs text-muted-foreground hover:text-foreground active:scale-95 transition-all"
              title="Print Recipe"
            >
              <Printer className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5 min-w-0">
          {recipe.subtitle && (
            <span className="mono-lcd text-xs font-semibold uppercase tracking-wider text-orange-500 block truncate">
              // {recipe.subtitle}
            </span>
          )}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground font-sans break-words">
            {recipe.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Technical Specification Bar (Extruded tiles with debossed counters) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          
          <div className="skeuo-inset-sm p-2.5 sm:p-3 rounded-xl space-y-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block flex items-center gap-1 truncate">
              <Clock className="w-3 h-3 text-orange-500 shrink-0" /> Prep Time
            </span>
            <div className="mono-lcd text-xs sm:text-sm font-bold text-foreground truncate">
              {recipe.prepTime}
            </div>
          </div>

          <div className="skeuo-inset-sm p-2.5 sm:p-3 rounded-xl space-y-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block flex items-center gap-1 truncate">
              <Flame className="w-3 h-3 text-orange-500 shrink-0" /> Cook Time
            </span>
            <div className="mono-lcd text-xs sm:text-sm font-bold text-foreground truncate">
              {recipe.cookTime}
            </div>
          </div>

          <div className="skeuo-inset-sm p-2.5 sm:p-3 rounded-xl space-y-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block flex items-center gap-1 truncate">
              <Layers className="w-3 h-3 text-orange-500 shrink-0" /> Window
            </span>
            <div className="mono-lcd text-xs sm:text-sm font-bold text-foreground truncate">
              {recipe.totalTime}
            </div>
          </div>

          <div className="skeuo-inset-sm p-2.5 sm:p-3 rounded-xl space-y-1 min-w-0">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block flex items-center gap-1 truncate">
              <Cpu className="w-3 h-3 text-orange-500 shrink-0" /> Energy
            </span>
            <div className="mono-lcd text-xs sm:text-sm font-bold text-foreground truncate">
              {Math.round(recipe.calories * scaleFactor)} kcal
            </div>
          </div>

        </div>

      </div>

      {/* Main Dual Columns: Mise-en-place & Method (Full-width responsive grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0 w-full">
        
        {/* Left Column: Mise-en-place & Portion Scaler (4 cols on xl, 5 cols on lg) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 min-w-0">
          
          <div className="skeuo-raised rounded-2xl p-4 sm:p-6 space-y-4 min-w-0">
            
            {/* Header with Physical Portion Dial */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/60">
              <div className="min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-foreground tracking-tight">
                  Mise-en-place
                </h3>
                <span className="text-[11px] text-muted-foreground block">
                  Provisions checklist
                </span>
              </div>

              {/* Skeuomorphic Portion Scaler Dial */}
              <div className="skeuo-inset-sm p-1 rounded-xl flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    playClickSound();
                    if (servings > 1) setServings(s => s - 1);
                  }}
                  disabled={servings <= 1}
                  className="skeuo-btn w-6 h-6 rounded-lg flex items-center justify-center text-foreground disabled:opacity-30 active:scale-95 transition-transform"
                  title="Decrease portion"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="mono-lcd text-xs font-bold px-1.5 min-w-[2.8rem] text-center text-foreground">
                  {servings}P
                </span>
                <button
                  onClick={() => {
                    playClickSound();
                    if (servings < 12) setServings(s => s + 1);
                  }}
                  disabled={servings >= 12}
                  className="skeuo-btn w-6 h-6 rounded-lg flex items-center justify-center text-foreground disabled:opacity-30 active:scale-95 transition-transform"
                  title="Increase portion"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Preparation Meter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                <span>Prepped provisions</span>
                <span className="mono-lcd text-orange-500 font-bold">{checkedIngredients.length}/{recipe.ingredients.length} ({prepProgress}%)</span>
              </div>
              <div className="skeuo-inset-sm h-2 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${prepProgress}%` }}
                />
              </div>
            </div>

            {/* Tactile Checklist Items with Zero Overlap */}
            <div className="space-y-2">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = checkedIngredients.includes(ing.name);
                const scaledAmount = Math.round(ing.amount * scaleFactor * 100) / 100;

                return (
                  <div
                    key={idx}
                    onClick={() => toggleIngredient(ing.name)}
                    className={`p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all flex items-start gap-3 select-none min-w-0 overflow-hidden ${
                      isChecked
                        ? 'skeuo-inset-sm opacity-60 line-through'
                        : 'skeuo-btn hover:brightness-105 active:scale-[0.99]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isChecked
                        ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
                        : 'border-border/80 bg-background/50 skeuo-inset-sm text-transparent'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>

                    <div className="flex-1 min-w-0 text-xs space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-2 gap-y-0.5 min-w-0">
                        <span className="font-semibold text-foreground text-xs sm:text-sm leading-snug break-words">
                          {ing.name}
                        </span>
                        <span className="mono-lcd font-bold text-orange-600 dark:text-orange-400 text-xs shrink-0 self-start sm:self-auto break-words max-w-full">
                          {scaledAmount > 0 ? scaledAmount : ''} {ing.unit}
                        </span>
                      </div>

                      {ing.swapSuggestion && (
                        <p className="text-[10px] text-muted-foreground not-italic line-through-none break-words">
                          <span className="text-orange-500 font-semibold">Sub:</span> {ing.swapSuggestion}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Sommelier & Beverage Pairing */}
          {recipe.winePairing && (
            <div className="skeuo-raised rounded-2xl p-4 sm:p-5 space-y-3 min-w-0">
              <div className="flex items-center gap-2">
                <Wine className="w-4 h-4 text-orange-500 shrink-0" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground truncate">
                  Beverage Pairing Matrix
                </h4>
              </div>

              <div className="space-y-2 text-xs min-w-0">
                <div className="skeuo-inset-sm p-2.5 rounded-xl min-w-0">
                  <span className="mono-lcd text-[9px] uppercase font-bold text-muted-foreground block truncate">
                    Cellar Vintage:
                  </span>
                  <span className="font-semibold text-foreground break-words block">
                    {recipe.winePairing.alcoholic}
                  </span>
                </div>

                <div className="skeuo-inset-sm p-2.5 rounded-xl min-w-0">
                  <span className="mono-lcd text-[9px] uppercase font-bold text-muted-foreground block truncate">
                    Zero-Proof Botanical:
                  </span>
                  <span className="font-semibold text-foreground break-words block">
                    {recipe.winePairing.nonAlcoholic}
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed pt-1 break-words">
                  {recipe.winePairing.notes}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Execution Steps & Nutritional Instrument Matrix (8 cols on xl, 7 cols on lg) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6 min-w-0">
          
          <div className="skeuo-raised rounded-2xl p-4 sm:p-6 lg:p-7 space-y-5 min-w-0">
            
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h3 className="font-bold text-sm sm:text-base text-foreground tracking-tight flex items-center gap-2 truncate">
                <span>Culinary Method</span>
              </h3>
              <span className="mono-lcd text-xs font-semibold px-2 py-0.5 rounded-full skeuo-inset-sm text-orange-500 shrink-0">
                {recipe.steps.length} Steps
              </span>
            </div>

            {/* Steps List */}
            <div className="space-y-3.5">
              {recipe.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="skeuo-inset-sm p-3.5 sm:p-4 rounded-xl space-y-2.5 min-w-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="mono-lcd text-xs font-bold px-2 py-0.5 rounded-md bg-card text-foreground skeuo-raised-sm shrink-0">
                        STEP {step.stepNumber.toString().padStart(2, '0')}
                      </span>
                      {step.technique && (
                        <span className="mono-lcd text-[10px] uppercase font-bold text-orange-500 tracking-wider truncate">
                          // {step.technique}
                        </span>
                      )}
                    </div>

                    {step.timerSeconds && step.timerSeconds > 0 ? (
                      <span className="mono-lcd text-[11px] font-bold px-2 py-0.5 rounded-md skeuo-raised-sm text-orange-500 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {Math.floor(step.timerSeconds / 60)}:{(step.timerSeconds % 60).toString().padStart(2, '0')}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs sm:text-sm text-foreground leading-relaxed break-words">
                    {step.instruction}
                  </p>

                  {step.chefTip && (
                    <div className="pt-2 text-[11px] text-muted-foreground flex items-start gap-1.5 border-t border-border/40 mt-1 break-words">
                      <span className="mono-lcd text-orange-500 font-bold uppercase text-[10px] shrink-0">TIP:</span>
                      <span>{step.chefTip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

          {/* Chef Technique Stamped Note */}
          {recipe.chefSecret && (
            <div className="skeuo-raised rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 min-w-0">
              <div className="w-8 h-8 rounded-xl skeuo-inset-sm text-orange-500 flex items-center justify-center shrink-0">
                <ChefHat className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <span className="mono-lcd text-[10px] uppercase font-bold tracking-wider text-orange-500 block truncate">
                  Technique Directive
                </span>
                <p className="text-xs text-foreground leading-relaxed break-words">
                  {recipe.chefSecret}
                </p>
              </div>
            </div>
          )}

          {/* Tactile Macronutrient Matrix */}
          <div className="skeuo-raised rounded-2xl p-4 sm:p-5 space-y-3 min-w-0">
            <span className="mono-lcd text-xs font-bold uppercase tracking-wider text-muted-foreground block truncate">
              Macronutrient Architecture (per portion)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {recipe.macros.map((m, idx) => (
                <div key={idx} className="skeuo-inset-sm p-2.5 sm:p-3 rounded-xl space-y-0.5 text-center min-w-0">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block truncate">
                    {m.name}
                  </span>
                  <div className="mono-lcd text-sm sm:text-base font-bold text-foreground truncate">
                    {m.value}{m.unit}
                  </div>
                  {m.dailyPct ? (
                    <span className="mono-lcd text-[9px] text-orange-500 font-semibold block truncate">
                      {m.dailyPct}% DV
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Conversational Refinement Bar */}
          <div className="skeuo-raised rounded-2xl p-3.5 sm:p-4 space-y-2 min-w-0">
            <span className="mono-lcd text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
              Refine Recipe Parameters
            </span>
            <form onSubmit={handleRefineSubmit} className="flex gap-2">
              <input
                type="text"
                value={refineText}
                onChange={(e) => setRefineText(e.target.value)}
                placeholder="Adjust directive (e.g. 'Make it dairy-free', 'More pepper')..."
                className="skeuo-inset-sm flex-1 min-w-0 px-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!refineText.trim() || isLoading}
                className="skeuo-btn px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-foreground active:text-orange-500 active:scale-95 disabled:opacity-40 shrink-0"
              >
                <span>Refine</span>
                <Send className="w-3 h-3 text-orange-500" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
