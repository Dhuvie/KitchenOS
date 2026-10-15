import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Settings, 
  Sun, 
  Moon, 
  Utensils, 
  Cpu, 
  Plus, 
  RotateCcw,
  History 
} from 'lucide-react';
import { ThemeProvider, useTheme } from './components/theme-provider';
import { PantrySelector } from './components/PantrySelector';
import { RecipeView } from './components/RecipeView';
import { PlainStartPage } from './components/PlainStartPage';
import { CookModeModal } from './components/CookModeModal';
import { CookbookDrawer } from './components/CookbookDrawer';
import { SettingsModal } from './components/SettingsModal';
import type { FullRecipe } from './lib/recipeSchema';
import { CURATED_PRESETS, synthesizeArtisanalRecipe } from './lib/curatedRecipes';
import { streamRecipe, ApiError } from './api/recipeApi';
import { 
  playClickSound, 
  isAudioMuted, 
  toggleAudioMuted, 
  playCelebrationSound 
} from './lib/soundEffects';

function AppContent() {
  const { theme, setTheme } = useTheme();

  // Fresh user state: initialized to null so user lands on plain Gemini/GPT start page!
  const [currentRecipe, setCurrentRecipe] = useState<FullRecipe | null>(null);
  
  // App states
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customPromptText, setCustomPromptText] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('Omnivore');
  const [timeLimit, setTimeLimit] = useState('30m Bistro');
  const [spiceLevel, setSpiceLevel] = useState('Balanced');
  const [mealType, setMealType] = useState('Gourmet Dinner');

  // Console sidebar drawer toggle (for deep pantry tweaking)
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // Mobile navigation tabs: 'cockpit' or 'studio'
  const [mobileTab, setMobileTab] = useState<'cockpit' | 'studio'>('studio');

  // Generation status
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [history, setHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);

  // Modals & Drawers
  const [isCookModeOpen, setIsCookModeOpen] = useState(false);
  const [isCookbookOpen, setIsCookbookOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(isAudioMuted());

  // Saved recipes persistence (Bookmarks)
  const [savedRecipes, setSavedRecipes] = useState<FullRecipe[]>(() => {
    try {
      const stored = localStorage.getItem('gravitas_saved_recipes');
      return stored ? JSON.parse(stored) : CURATED_PRESETS.slice(0, 3);
    } catch {
      return CURATED_PRESETS.slice(0, 3);
    }
  });

  // Persistent Past Recipes History in localStorage
  const [pastRecipes, setPastRecipes] = useState<FullRecipe[]>(() => {
    try {
      const stored = localStorage.getItem('kitchen_past_recipes');
      return stored ? JSON.parse(stored) : CURATED_PRESETS.slice(0, 4);
    } catch {
      return CURATED_PRESETS.slice(0, 4);
    }
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const studioCanvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('gravitas_saved_recipes', JSON.stringify(savedRecipes));
    } catch {
      // storage error
    }
  }, [savedRecipes]);

  useEffect(() => {
    try {
      localStorage.setItem('kitchen_past_recipes', JSON.stringify(pastRecipes));
    } catch {
      // storage error
    }
  }, [pastRecipes]);

  const addRecipeToHistory = (recipe: FullRecipe) => {
    setPastRecipes(prev => {
      const filtered = prev.filter(r => r.id !== recipe.id && r.title.toLowerCase() !== recipe.title.toLowerCase());
      return [{ ...recipe, createdAt: Date.now() }, ...filtered].slice(0, 40);
    });
  };

  const handleDeletePastRecipe = (id: string) => {
    setPastRecipes(prev => prev.filter(r => r.id !== id));
  };

  const handleClearPastRecipes = () => {
    setPastRecipes([]);
  };

  const handleToggleIngredient = (item: string) => {
    if (selectedIngredients.includes(item)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== item));
    } else {
      setSelectedIngredients([...selectedIngredients, item]);
    }
  };

  const handleClearIngredients = () => {
    setSelectedIngredients([]);
  };

  const handleSelectPreset = (preset: FullRecipe) => {
    setCurrentRecipe(preset);
    addRecipeToHistory(preset);
    setSelectedIngredients(preset.ingredients.map(i => i.name));
    setErrorStatus(null);
    setMobileTab('studio');
    studioCanvasRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetToStandby = () => {
    playClickSound();
    setCurrentRecipe(null);
    setSelectedIngredients([]);
    setCustomPromptText('');
    setMobileTab('studio');
  };

  const handleToggleSound = () => {
    const newMuted = toggleAudioMuted();
    setSoundMuted(newMuted);
    if (!newMuted) playClickSound();
  };

  const handleSaveRecipe = (recipeToSave: FullRecipe) => {
    const exists = savedRecipes.some(r => r.id === recipeToSave.id);
    if (exists) {
      setSavedRecipes(savedRecipes.filter(r => r.id !== recipeToSave.id));
    } else {
      setSavedRecipes([recipeToSave, ...savedRecipes]);
      playCelebrationSound();
    }
  };

  const handleDeleteSaved = (id: string) => {
    setSavedRecipes(savedRecipes.filter(r => r.id !== id));
  };

  const handleRandomizeAndGenerate = () => {
    const all = [
      'Chilean Sea Bass', 'Ribeye Steak', 'Chicken Breast', 'Wild Salmon', 
      'Fresh Asparagus', 'Wild Mushrooms', 'Heirloom Tomatoes', 'Avocado', 
      'Arborio Rice', 'Pappardelle', 'Saffron Threads', 'European Butter'
    ];
    const picked = [...all].sort(() => 0.5 - Math.random()).slice(0, 4);
    setSelectedIngredients(picked);
    executeGeneration(undefined, picked);
  };

  // Recipe Generation Engine
  const executeGeneration = async (refinementPrompt?: string, overrideIngredients?: string[]) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setErrorStatus(null);
    setMobileTab('studio');

    const ingredientsToUse = overrideIngredients || selectedIngredients;

    const promptText = refinementPrompt || [
      `Create a precise ${dietaryFilter} recipe for ${mealType} within ${timeLimit} with ${spiceLevel} heat level.`,
      ingredientsToUse.length > 0 ? `Available provisions: ${ingredientsToUse.join(', ')}.` : '',
      customPromptText.trim() ? `Instructions: ${customPromptText.trim()}` : ''
    ].filter(Boolean).join(' ');

    let streamedCard: any = null;
    let streamedIngredients: any[] = [];
    let streamedSteps: any[] = [];
    let streamedChart: any = null;

    try {
      await streamRecipe(
        promptText,
        history,
        abortControllerRef.current.signal,
        (block) => {
          if (block.type === 'card') {
            streamedCard = block.content || block;
          } else if (block.type === 'ingredients') {
            streamedIngredients = Array.isArray(block.items) ? block.items : [];
          } else if (block.type === 'steps') {
            streamedSteps = Array.isArray(block.items) ? block.items : [];
          } else if (block.type === 'checklist') {
            if (streamedIngredients.length === 0) {
              streamedIngredients = (block.items || []).map((name: string) => ({
                name,
                amount: 1,
                unit: 'portion',
                swapSuggestion: null
              }));
            } else {
              streamedSteps = (block.items || []).map((instruction: string, idx: number) => ({
                stepNumber: idx + 1,
                instruction,
                technique: 'Technique',
                timerSeconds: 0
              }));
            }
          } else if (block.type === 'chart') {
            streamedChart = block;
          }

          if (streamedCard) {
            const assembled: FullRecipe = {
              id: 'recipe-' + Date.now(),
              title: streamedCard.title || 'Precision Recipe Output',
              subtitle: streamedCard.subtitle || 'Synthesized Method',
              description: streamedCard.description || 'Structured culinary composition.',
              cuisine: streamedCard.cuisine || 'Contemporary',
              difficulty: streamedCard.difficulty || 'Bistro',
              prepTime: streamedCard.prepTime || '15 mins',
              cookTime: streamedCard.cookTime || '20 mins',
              totalTime: streamedCard.totalTime || '35 mins',
              servings: streamedCard.servings || 2,
              calories: streamedCard.calories || 480,
              tags: [dietaryFilter, mealType],
              winePairing: streamedCard.winePairing || {
                alcoholic: 'Cellar Selection',
                nonAlcoholic: 'Sparkling Botanical',
                notes: 'Balanced acidity complements the dish.'
              },
              chefSecret: streamedCard.chefSecret || 'Control heat and let resting period complete before serving.',
              ingredients: streamedIngredients.length > 0 ? streamedIngredients : [
                { name: ingredientsToUse[0] || 'Main provision', amount: 2, unit: 'portions', category: 'protein' }
              ],
              steps: streamedSteps.length > 0 ? streamedSteps : [
                { stepNumber: 1, instruction: 'Organize provisions into mise-en-place.', technique: 'Mise-en-place' }
              ],
              macros: streamedChart?.data || [
                { name: 'Protein', value: 38, unit: 'g', color: '#10b981', dailyPct: 76 },
                { name: 'Net Carbs', value: 16, unit: 'g', color: '#f59e0b', dailyPct: 12 },
                { name: 'Healthy Fats', value: 24, unit: 'g', color: '#6366f1', dailyPct: 34 },
                { name: 'Dietary Fiber', value: 5, unit: 'g', color: '#ec4899', dailyPct: 20 }
              ],
              createdAt: Date.now()
            };
            setCurrentRecipe(assembled);
            addRecipeToHistory(assembled);
          }
        }
      );

      setHistory(prev => [
        ...prev,
        { role: 'user', text: promptText },
        { role: 'model', text: 'Recipe generated successfully.' }
      ]);

      studioCanvasRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err: any) {
      if (err.name === 'AbortError') return;

      console.warn('Streaming error, fallback synthesis:', err);
      const fallbackRecipe = synthesizeArtisanalRecipe(ingredientsToUse, {
        diet: dietaryFilter,
        timeLimit,
        spice: spiceLevel,
        mealType
      });
      setCurrentRecipe(fallbackRecipe);
      addRecipeToHistory(fallbackRecipe);
      setErrorStatus(err instanceof ApiError ? err.code : 'FALLBACK_MODE');

      studioCanvasRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefinePrompt = (refineText: string) => {
    executeGeneration(refineText);
  };

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col font-sans select-none antialiased">
      
      {/* Precision Instrument Top Bar */}
      <header className="h-14 shrink-0 border-b border-border/80 bg-card px-3 sm:px-6 flex items-center justify-between z-20 min-w-0">
        
        {/* Brand Terminal Label */}
        <div 
          onClick={handleResetToStandby}
          className="flex items-center gap-2 cursor-pointer shrink-0 min-w-0 group"
          title="Reset to Blank Standby Console"
        >
          <div className="skeuo-inset-sm w-7 h-7 rounded-lg flex items-center justify-center text-orange-500 shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="mono-lcd font-bold text-xs sm:text-sm tracking-wider text-foreground shrink-0 group-hover:text-orange-500 transition-colors">
              KITCHEN.OS
            </span>
            <span className="mono-lcd text-[9px] text-muted-foreground uppercase border-l border-border pl-2 hidden md:inline truncate">
              PRECISION CULINARY OPERATING SYSTEM
            </span>
          </div>
        </div>



        {/* Global Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* New / Reset Recipe Button (Takes user back to clean Plain Start Page) */}
          {currentRecipe && (
            <button
              onClick={handleResetToStandby}
              className="skeuo-btn px-3 py-1.5 rounded-xl text-xs font-bold text-foreground hover:text-orange-500 flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
              title="Start New Formulation (Return to Start Page)"
            >
              <Plus className="w-3.5 h-3.5 text-orange-500" />
              <span>New Recipe</span>
            </button>
          )}

          {/* Optional Pantry Console Drawer Toggle (When viewing an active recipe) */}
          {currentRecipe && (
            <button
              onClick={() => {
                playClickSound();
                setIsConsoleOpen(!isConsoleOpen);
              }}
              className={`skeuo-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all ${
                isConsoleOpen ? 'text-orange-500 font-bold border-orange-500/40' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Toggle Pantry Console Keyboard"
            >
              <Utensils className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden sm:inline">Pantry Console</span>
            </button>
          )}

          {/* Audio Feedback Button */}
          <button
            onClick={handleToggleSound}
            className="skeuo-btn p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:text-foreground active:scale-95 transition-all"
            title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-orange-500" />}
          </button>

          {/* Recipe Storage & History Drawer Button */}
          <button
            onClick={() => {
              playClickSound();
              setIsCookbookOpen(true);
            }}
            className="skeuo-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-foreground flex items-center gap-1.5 active:scale-95 transition-all"
            title="View Past Recipes & Stored Formulations"
          >
            <History className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden md:inline">Storage</span>
            <span className="mono-lcd text-[10px] font-bold px-1.5 py-0.2 rounded skeuo-inset-sm text-foreground">
              {pastRecipes.length}
            </span>
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={() => {
              playClickSound();
              setIsSettingsOpen(true);
            }}
            className="skeuo-btn p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:text-foreground active:scale-95 transition-all"
            title="API & Hardware Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => {
              playClickSound();
              setTheme(isDarkMode ? 'light' : 'dark');
            }}
            className="skeuo-btn p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:text-foreground active:scale-95 transition-all"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

        </div>

      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative min-h-0 min-w-0">
        
        {/* Left: Chef's Pantry Console (Shown when toggled in recipe view) */}
        {currentRecipe && isConsoleOpen && (
          <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 border-r border-border/80 flex flex-col h-full min-h-0 bg-card transition-all z-10 animate-in slide-in-from-left duration-200">
            <PantrySelector
              selectedIngredients={selectedIngredients}
              onToggleIngredient={handleToggleIngredient}
              onClearIngredients={handleClearIngredients}
              onSelectPreset={handleSelectPreset}
              onGenerate={() => executeGeneration()}
              isLoading={isLoading}
              dietaryFilter={dietaryFilter}
              setDietaryFilter={setDietaryFilter}
              timeLimit={timeLimit}
              setTimeLimit={setTimeLimit}
              spiceLevel={spiceLevel}
              setSpiceLevel={setSpiceLevel}
              mealType={mealType}
              setMealType={setMealType}
              customPromptText={customPromptText}
              setCustomPromptText={setCustomPromptText}
              activeRecipeId={currentRecipe?.id}
              onClose={() => setIsConsoleOpen(false)}
            />
          </div>
        )}

        {/* Central Viewport */}
        <div 
          ref={studioCanvasRef}
          className="flex-1 min-w-0 min-h-0 overflow-y-auto bg-background flex flex-col"
        >
          {/* If user hasn't formulated a recipe yet: Render Clean Plain Start Page (Gemini / Claude / GPT style) */}
          {!currentRecipe ? (
            <PlainStartPage
              customPromptText={customPromptText}
              setCustomPromptText={setCustomPromptText}
              selectedIngredients={selectedIngredients}
              onToggleIngredient={handleToggleIngredient}
              onClearIngredients={handleClearIngredients}
              dietaryFilter={dietaryFilter}
              setDietaryFilter={setDietaryFilter}
              timeLimit={timeLimit}
              setTimeLimit={setTimeLimit}
              spiceLevel={spiceLevel}
              setSpiceLevel={setSpiceLevel}
              mealType={mealType}
              setMealType={setMealType}
              onGenerate={() => executeGeneration()}
              onSelectPreset={handleSelectPreset}
              onRandomizeAndGenerate={handleRandomizeAndGenerate}
              isLoading={isLoading}
              pastRecipes={pastRecipes}
            />
          ) : (
            /* Active Recipe View (Full Page Width - No Empty Space on Left/Right) */
            <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-6 pb-24 min-w-0">
              
              {/* Computing Indicator */}
              {isLoading && (
                <div className="skeuo-inset p-4 sm:p-5 rounded-2xl text-center space-y-2">
                  <div className="mono-lcd text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
                    REFINING RECIPE & RE-SYNTHESIZING...
                  </div>
                </div>
              )}

              <RecipeView
                recipe={currentRecipe}
                onEnterCookMode={() => {
                  playClickSound();
                  setIsCookModeOpen(true);
                }}
                onSaveRecipe={handleSaveRecipe}
                isSaved={savedRecipes.some(r => r.id === currentRecipe.id)}
                onRefinePrompt={handleRefinePrompt}
                isLoading={isLoading}
              />

            </div>
          )}
        </div>

      </div>

      {/* Fullscreen Cook Mode Terminal */}
      {currentRecipe && (
        <CookModeModal
          recipe={currentRecipe}
          isOpen={isCookModeOpen}
          onClose={() => setIsCookModeOpen(false)}
        />
      )}

      {/* Slide-over Recipe Storage & Memory Drawer */}
      <CookbookDrawer
        isOpen={isCookbookOpen}
        onClose={() => setIsCookbookOpen(false)}
        savedRecipes={savedRecipes}
        pastRecipes={pastRecipes}
        onSelectRecipe={(recipe) => {
          setCurrentRecipe(recipe);
          addRecipeToHistory(recipe);
          setMobileTab('studio');
          studioCanvasRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDeleteSavedRecipe={handleDeleteSaved}
        onDeletePastRecipe={handleDeletePastRecipe}
        onClearPastRecipes={handleClearPastRecipes}
        onToggleSaveRecipe={handleSaveRecipe}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="gravitas_theme">
      <AppContent />
    </ThemeProvider>
  );
}
