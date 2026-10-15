import React, { useState } from 'react';
import { X, Search, Trash2, Bookmark, BookmarkCheck, History, Clock } from 'lucide-react';
import type { FullRecipe } from '../lib/recipeSchema';
import { playClickSound } from '../lib/soundEffects';

interface CookbookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedRecipes: FullRecipe[];
  pastRecipes: FullRecipe[];
  onSelectRecipe: (recipe: FullRecipe) => void;
  onDeleteSavedRecipe: (id: string) => void;
  onDeletePastRecipe: (id: string) => void;
  onClearPastRecipes: () => void;
  onToggleSaveRecipe: (recipe: FullRecipe) => void;
}

export const CookbookDrawer: React.FC<CookbookDrawerProps> = ({
  isOpen,
  onClose,
  savedRecipes,
  pastRecipes,
  onSelectRecipe,
  onDeleteSavedRecipe,
  onDeletePastRecipe,
  onClearPastRecipes,
  onToggleSaveRecipe
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const activeList = activeTab === 'history' ? pastRecipes : savedRecipes;

  const filtered = activeList.filter(r => {
    const q = searchQuery.toLowerCase();
    const titleMatch = r.title.toLowerCase().includes(q);
    const cuisineMatch = r.cuisine?.toLowerCase().includes(q);
    const ingredientMatch = r.ingredients?.some(i => i.name.toLowerCase().includes(q));
    return titleMatch || cuisineMatch || ingredientMatch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border/80 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="skeuo-led bg-orange-500 shadow-orange-500/50 shrink-0" />
              <div>
                <h3 className="mono-lcd text-xs font-bold uppercase tracking-wider text-foreground">
                  RECIPE STORAGE & MEMORY
                </h3>
                <span className="mono-lcd text-[10px] text-muted-foreground">
                  {pastRecipes.length} past formulations // {savedRecipes.length} bookmarked
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="skeuo-btn p-1.5 rounded-xl text-muted-foreground hover:text-foreground"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Segmented Mode Selector (Past Recipes vs Bookmarks) */}
          <div className="p-3 border-b border-border/60 bg-muted/20">
            <div className="skeuo-inset-sm p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab('history');
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'history'
                    ? 'skeuo-btn text-foreground font-extrabold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <History className="w-3.5 h-3.5 text-orange-500" />
                <span>Past Formulations ({pastRecipes.length})</span>
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab('saved');
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'saved'
                    ? 'skeuo-btn text-foreground font-extrabold shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-orange-500" />
                <span>Bookmarks ({savedRecipes.length})</span>
              </button>
            </div>
          </div>

          {/* Search Bar & Actions */}
          <div className="p-3 sm:p-4 border-b border-border/40 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab === 'history' ? 'past recipes' : 'bookmarks'}...`}
                className="skeuo-inset-sm w-full pl-9 pr-4 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-foreground"
              />
            </div>

            {activeTab === 'history' && pastRecipes.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear all past recipe history?')) {
                    playClickSound();
                    onClearPastRecipes();
                  }
                }}
                className="skeuo-btn px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-destructive active:scale-95 transition-all shrink-0"
                title="Clear Past Recipes History"
              >
                Clear Log
              </button>
            )}
          </div>

          {/* Recipe List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filtered.length === 0 ? (
              <div className="text-center py-12 space-y-2 text-xs text-muted-foreground">
                {activeTab === 'history' ? (
                  <>
                    <History className="w-8 h-8 mx-auto opacity-30 text-orange-500" />
                    <p className="font-semibold text-foreground">No past recipes recorded yet</p>
                    <p className="text-[11px]">Generate a formulation or pick a benchmark preset to begin your history.</p>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-8 h-8 mx-auto opacity-30 text-orange-500" />
                    <p className="font-semibold text-foreground">No bookmarks saved yet</p>
                    <p className="text-[11px]">Click the bookmark icon on any recipe to save it here for quick access.</p>
                  </>
                )}
              </div>
            ) : (
              filtered.map((recipe) => {
                const isBookmarked = savedRecipes.some(r => r.id === recipe.id);
                return (
                  <div
                    key={recipe.id}
                    className="skeuo-btn p-3.5 rounded-xl flex items-start justify-between gap-3 text-left hover:border-orange-500/30 transition-all group"
                  >
                    <div
                      onClick={() => {
                        playClickSound();
                        onSelectRecipe(recipe);
                        onClose();
                      }}
                      className="flex-1 cursor-pointer space-y-1 min-w-0"
                    >
                      <div className="mono-lcd flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase truncate">
                        <span>{recipe.cuisine || 'Gourmet'}</span>
                        <span>•</span>
                        <span>{recipe.totalTime}</span>
                      </div>
                      <h4 className="font-bold text-xs text-foreground group-hover:text-orange-500 transition-colors line-clamp-1">
                        {recipe.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {recipe.ingredients.slice(0, 3).map(i => i.name).join(', ')}...
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      {/* Bookmark toggle button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          onToggleSaveRecipe(recipe);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBookmarked 
                            ? 'text-orange-500 hover:text-orange-600' 
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title={isBookmarked ? 'Remove Bookmark' : 'Add to Bookmarks'}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 fill-current" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          if (activeTab === 'history') {
                            onDeletePastRecipe(recipe.id);
                          } else {
                            onDeleteSavedRecipe(recipe.id);
                          }
                        }}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg"
                        title={activeTab === 'history' ? 'Remove from History' : 'Remove from Bookmarks'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
