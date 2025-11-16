
import React, { useState, useCallback } from 'react';
// FIX: InputStage is a default export, so it should be imported directly.
import InputStage from './components/InputStage';
import { LoadingDisplay } from './components/LoadingDisplay';
import { ResultDisplay } from './components/ResultDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { PlanReview } from './components/PlanReview';
import { generateFullPlan } from './services/geminiService';
import { FullLearningPlan, SkillLevel, LearningIntensity, GenerationMode } from './types';

type AppStage = 'input' | 'planning' | 'review' | 'done';

const App: React.FC = () => {
  const [goal, setGoal] = useState<string>('');
  const [level, setLevel] = useState<SkillLevel>('beginner');
  const [intensity, setIntensity] = useState<LearningIntensity>('moderate');
  const [generationMode, setGenerationMode] = useState<GenerationMode>('HighQuality');
  const [stage, setStage] = useState<AppStage>('input');
  const [progress, setProgress] = useState<string[]>([]);
  const [fullPlan, setFullPlan] = useState<FullLearningPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = useCallback(async () => {
    if (!goal.trim()) {
      setError('Please enter a learning goal.');
      return;
    }
    setStage('planning');
    setError(null);
    setFullPlan(null);
    setProgress(['Initializing...']);

    try {
      const plan = await generateFullPlan(goal, level, intensity, generationMode, (update) => {
        setProgress(prev => [...prev, update]);
      });
      setFullPlan(plan);
      setStage('review');
    } catch (err) {
      let errorMessage = 'An unknown error occurred.';
      
      if (err instanceof Error) {
        // Check if error message is a JSON string
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.error) {
            const apiError = parsed.error;
            if (apiError.code === 503 || apiError.status === 'UNAVAILABLE') {
              errorMessage = 'The AI service is temporarily overloaded. Please wait a moment and try again.';
            } else if (apiError.message) {
              errorMessage = apiError.message;
            }
          } else {
            errorMessage = err.message;
          }
        } catch {
          // Not JSON, use message as-is
          errorMessage = err.message;
        }
      } else if (typeof err === 'string') {
        // Try to parse if it's JSON string
        try {
          const parsed = JSON.parse(err);
          if (parsed?.error?.message) {
            errorMessage = parsed.error.message;
          } else {
            errorMessage = err;
          }
        } catch {
          errorMessage = err;
        }
      } else if (err && typeof err === 'object') {
        // Try to extract user-friendly error message
        const apiError = (err as any)?.error || err;
        if (apiError?.message) {
          errorMessage = apiError.message;
        } else if (apiError?.code === 503 || apiError?.status === 'UNAVAILABLE') {
          errorMessage = 'The AI service is temporarily overloaded. Please wait a moment and try again.';
        }
      }
      
      setError(errorMessage);
      setStage('input');
      console.error('Error generating plan:', err);
    } finally {
      setProgress([]);
    }
  }, [goal, level, intensity, generationMode]);

  const handleFinalize = useCallback(() => {
    if (!fullPlan) return;
    setStage('done');
  }, [fullPlan]);

  const handleStartOver = () => {
    setGoal('');
    setLevel('beginner');
    setIntensity('moderate');
    setGenerationMode('HighQuality');
    setStage('input');
    setFullPlan(null);
    setError(null);
    setProgress([]);
  };

  const isBusy = stage === 'planning';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <div className="w-full max-w-5xl mx-auto px-4">
        <main>
          {stage === 'input' && (
             <InputStage
                goal={goal}
                setGoal={setGoal}
                level={level}
                setLevel={setLevel}
                intensity={intensity}
                setIntensity={setIntensity}
                generationMode={generationMode}
                setGenerationMode={setGenerationMode}
                onGenerate={handleGeneratePlan}
            />
          )}

          {isBusy && (
            <div className="py-20">
              <LoadingDisplay 
                title="Generating Your Learning Plan..."
                progress={progress} 
              />
            </div>
          )}
          
          {error && <div className="py-20"><ErrorDisplay message={error} onRetry={handleGeneratePlan} /></div>}

          {stage === 'review' && fullPlan && !isBusy && (
            <PlanReview 
              plan={fullPlan}
              onConfirm={handleFinalize}
              onStartOver={handleStartOver}
            />
          )}

          {stage === 'done' && fullPlan && !isBusy && (
            <ResultDisplay 
              goal={fullPlan.goal} 
              onStartOver={handleStartOver} 
            />
          )}
        </main>
      </div>
       <footer className="text-center text-slate-500 py-6 sm:py-8 text-sm">
          <p>AI Learning Path Generator &copy; {new Date().getFullYear()}</p>
          <p>Powered by Rajesh A </p>
        </footer>
    </div>
  );
};

export default App;