
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
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate plan: ${errorMessage}. Please try again.`);
      setStage('input');
      console.error(err);
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