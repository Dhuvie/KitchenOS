import React, { useState } from 'react';
import { X, Key, Check, Shield, ExternalLink } from 'lucide-react';
import { playClickSound } from '../lib/soundEffects';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gravitas_gemini_key') || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    if (apiKey.trim()) {
      localStorage.setItem('gravitas_gemini_key', apiKey.trim());
    } else {
      localStorage.removeItem('gravitas_gemini_key');
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    playClickSound();
    localStorage.removeItem('gravitas_gemini_key');
    setApiKey('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" 
      />

      <div className="relative w-full max-w-md skeuo-raised rounded-2xl p-6 space-y-5 z-10 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="skeuo-led bg-orange-500 shadow-orange-500/50" />
            <div>
              <h3 className="mono-lcd text-xs font-bold uppercase tracking-wider text-foreground">
                API HARDWARE CONFIGURATION
              </h3>
              <span className="mono-lcd text-[10px] text-muted-foreground">
                Gemini AI Endpoint Settings
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="skeuo-btn p-1.5 rounded-xl text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span className="mono-lcd text-[10px] uppercase text-muted-foreground">Gemini API Key:</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="mono-lcd text-orange-500 hover:underline inline-flex items-center gap-1 text-[10px]"
              >
                Get Key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="skeuo-inset-sm w-full px-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 text-foreground font-mono"
            />
            <p className="text-[10px] text-muted-foreground">
              Stored locally in browser storage. If empty, the app runs via backend <code>.env</code> or local precision synthesis.
            </p>
          </div>

          <div className="skeuo-inset-sm p-3 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <Shield className="w-3.5 h-3.5 text-orange-500" />
              <span className="mono-lcd text-[10px] uppercase">Channel Status</span>
            </div>
            <p className="mono-lcd text-muted-foreground text-[10px]">
              {apiKey ? (
                <span className="text-emerald-500 font-bold">✓ ACTIVE: Direct Client Key</span>
              ) : (
                <span>DEFAULT: Proxy / Local Precision Engine</span>
              )}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-destructive hover:underline font-semibold"
              >
                Clear Key
              </button>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="skeuo-btn px-4 py-2 rounded-xl text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="skeuo-btn px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-orange-500 flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Config</span>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
