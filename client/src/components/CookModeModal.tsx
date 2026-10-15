import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Timer, 
  Plus, 
  ChefHat
} from 'lucide-react';
import type { FullRecipe } from '../lib/recipeSchema';
import { playClickSound, playTimerChime, playCelebrationSound } from '../lib/soundEffects';

interface CookModeModalProps {
  recipe: FullRecipe;
  isOpen: boolean;
  onClose: () => void;
}

export const CookModeModal: React.FC<CookModeModalProps> = ({
  recipe,
  isOpen,
  onClose
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Timer states
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef<any>(null);

  const steps = recipe.steps || [];
  const currentStep = steps[currentStepIndex];

  // Initialize step timer when changing step
  useEffect(() => {
    if (currentStep?.timerSeconds && currentStep.timerSeconds > 0) {
      setTimerSecondsLeft(currentStep.timerSeconds);
    } else {
      setTimerSecondsLeft(0);
    }
    setIsTimerRunning(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  }, [currentStepIndex, currentStep]);

  // Timer interval effect
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            playTimerChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ') {
        if (timerSecondsLeft > 0 || (currentStep?.timerSeconds && currentStep.timerSeconds > 0)) {
          e.preventDefault();
          toggleTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, isTimerRunning, timerSecondsLeft]);

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleClose = () => {
    stopSpeech();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    onClose();
  };

  const toggleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      stopSpeech();
    } else {
      stopSpeech();
      const textToRead = `Step ${currentStep.stepNumber}. ${currentStep.instruction}. ${currentStep.chefTip ? 'Tip: ' + currentStep.chefTip : ''}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const toggleTimer = () => {
    playClickSound();
    if (timerSecondsLeft === 0 && currentStep?.timerSeconds) {
      setTimerSecondsLeft(currentStep.timerSeconds);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    playClickSound();
    setIsTimerRunning(false);
    setTimerSecondsLeft(currentStep?.timerSeconds || 0);
  };

  const addOneMinute = () => {
    playClickSound();
    setTimerSecondsLeft((prev) => prev + 60);
  };

  const handleNext = () => {
    stopSpeech();
    playClickSound();
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      playCelebrationSound();
    }
  };

  const handlePrev = () => {
    stopSpeech();
    playClickSound();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const toggleStepCompleted = (idx: number) => {
    playClickSound();
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter((s) => s !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
      
      {/* Top Console Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-border/80">
        <div className="flex items-center gap-3">
          <span className="skeuo-led bg-orange-500 shadow-orange-500/50" />
          <div>
            <span className="mono-lcd text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
              COOK MODE // HARDWARE TERMINAL
            </span>
            <h2 className="font-bold text-sm sm:text-base text-foreground line-clamp-1">
              {recipe.title}
            </h2>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="skeuo-btn p-2 rounded-xl text-muted-foreground hover:text-foreground"
          title="Exit Cook Mode (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-center py-6 sm:py-8">
        
        {isFinished ? (
          /* Finished State */
          <div className="skeuo-raised rounded-2xl p-8 sm:p-12 text-center space-y-5 animate-in zoom-in-95">
            <span className="skeuo-led w-4 h-4 bg-emerald-500 shadow-emerald-500/50 mx-auto" />

            <div className="space-y-1">
              <span className="mono-lcd text-xs font-bold tracking-widest uppercase text-orange-500">
                // EXECUTION COMPLETE
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                Plate & Serve
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto pt-1">
                All method steps for {recipe.title} have been executed.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsFinished(false);
                  setCurrentStepIndex(0);
                }}
                className="skeuo-btn px-6 py-2.5 rounded-xl font-semibold text-xs text-foreground"
              >
                Review Steps
              </button>
              <button
                onClick={handleClose}
                className="skeuo-btn px-7 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-orange-500"
              >
                Return to Terminal
              </button>
            </div>
          </div>
        ) : (
          /* Active Step Instrument View */
          <div className="space-y-5">
            
            {/* Step Status & Quick Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="mono-lcd text-xs font-bold px-3 py-1 rounded-lg skeuo-inset-sm text-orange-500">
                  STEP {currentStepIndex + 1} / {steps.length}
                </span>
                {currentStep?.technique && (
                  <span className="mono-lcd text-xs font-semibold px-2.5 py-1 rounded-lg skeuo-raised-sm text-foreground">
                    {currentStep.technique}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleSpeak}
                  className={`skeuo-btn px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
                    isSpeaking ? 'skeuo-btn-active text-orange-500' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  title="Read aloud with speech synthesizer"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? 'Mute' : 'Voice'}</span>
                </button>

                <button
                  onClick={() => toggleStepCompleted(currentStepIndex)}
                  className={`skeuo-btn px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ${
                    completedSteps.includes(currentStepIndex) ? 'skeuo-btn-active text-emerald-500 font-bold' : 'text-muted-foreground'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{completedSteps.includes(currentStepIndex) ? 'Done' : 'Check'}</span>
                </button>
              </div>
            </div>

            {/* Step Instruction Box */}
            <div className="skeuo-raised rounded-2xl p-6 sm:p-8 space-y-4">
              <p className="text-xl sm:text-2xl font-semibold leading-relaxed text-foreground">
                {currentStep?.instruction}
              </p>

              {currentStep?.chefTip && (
                <div className="pt-3 border-t border-border/40 text-xs text-muted-foreground flex items-start gap-2">
                  <span className="mono-lcd text-orange-500 font-bold uppercase text-[10px]">DIRECTIVE:</span>
                  <span>{currentStep.chefTip}</span>
                </div>
              )}
            </div>

            {/* Integrated Mechanical Countdown Timer */}
            {(currentStep?.timerSeconds && currentStep.timerSeconds > 0) || timerSecondsLeft > 0 ? (
              <div className="skeuo-inset rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Timer className={`w-6 h-6 ${isTimerRunning ? 'text-orange-500 animate-pulse' : 'text-muted-foreground'}`} />
                  <div>
                    <span className="mono-lcd text-[10px] uppercase font-bold text-muted-foreground block">
                      PRECISION COUNTDOWN
                    </span>
                    <div className="mono-lcd text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                      {formatTime(timerSecondsLeft)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTimer}
                    className={`skeuo-btn px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 ${
                      isTimerRunning ? 'text-orange-500 skeuo-btn-active' : 'text-foreground'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current text-orange-500" />}
                    <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
                  </button>

                  <button
                    onClick={addOneMinute}
                    className="skeuo-btn px-3 py-2.5 rounded-xl text-xs font-mono font-bold text-foreground"
                    title="Add 1 minute"
                  >
                    +1M
                  </button>

                  <button
                    onClick={resetTimer}
                    className="skeuo-btn p-2.5 rounded-xl text-muted-foreground hover:text-foreground"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : null}

          </div>
        )}

      </div>

      {/* Bottom Bar: Progress & Step Controls */}
      <div className="max-w-4xl w-full mx-auto pt-4 border-t border-border/80 space-y-3">
        
        {/* Progress Track */}
        <div className="skeuo-inset-sm h-1.5 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-200"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0 || isFinished}
            className="skeuo-btn px-5 py-2 rounded-xl disabled:opacity-30 font-semibold text-xs flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="mono-lcd text-[11px] text-muted-foreground hidden sm:inline">
            <kbd className="skeuo-raised-sm px-1.5 py-0.5 rounded text-[10px]">←</kbd> / <kbd className="skeuo-raised-sm px-1.5 py-0.5 rounded text-[10px]">→</kbd> NAV
          </span>

          <button
            onClick={handleNext}
            className="skeuo-btn px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-orange-500 flex items-center gap-2"
          >
            <span>{currentStepIndex === steps.length - 1 ? 'Finish' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
