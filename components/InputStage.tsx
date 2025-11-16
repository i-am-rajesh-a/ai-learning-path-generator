import React from 'react';
import type { SkillLevel, LearningIntensity, GenerationMode } from '../types';
import { BrainCircuitIcon, VideoIcon, BookOpenIcon, TargetIcon, CertificateIcon, PencilIcon, ClipboardCheckIcon, RocketIcon, BoltIcon } from './icons/Icons';
import './InputStage.css';

interface InputStageProps {
  goal: string;
  setGoal: (goal: string) => void;
  level: SkillLevel;
  setLevel: (level: SkillLevel) => void;
  intensity: LearningIntensity;
  setIntensity: (intensity: LearningIntensity) => void;
  generationMode: GenerationMode;
  setGenerationMode: (mode: GenerationMode) => void;
  onGenerate: () => void;
  onOpenChat?: () => void;
  onViewPlans?: () => void;
}

const SelectorButton: React.FC<{ label: string; isSelected: boolean; onClick: () => void; }> = ({ label, isSelected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 ${
        isSelected ? 'bg-sky-600 text-white shadow-lg' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {label}
    </button>
);

const InputStage: React.FC<InputStageProps> = ({ goal, setGoal, level, setLevel, intensity, setIntensity, generationMode, setGenerationMode, onGenerate, onOpenChat, onViewPlans }) => {
  return (
    <div className="w-full animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-16 sm:py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-700/[0.05] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,white)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 text-transparent bg-clip-text animate-fade-in">
            AI Learning Path Generator
          </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-300 animate-slide-in-up slide-delay-200">
                Your personal AI mentor. Turn any ambitious goal into a structured, daily learning plan and master new skills faster than ever before.
              </p>
              <div className="mt-10 flex gap-4 justify-center flex-wrap animate-slide-in-up slide-delay-400">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenChat) return onOpenChat();
                    const el = document.getElementById('generator');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 text-lg font-bold text-white rounded-lg transition-all duration-300 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
                  onMouseDown={(e) => e.currentTarget.blur()}
                >
                  Create Your Free Plan Now
                </button>
                {onViewPlans && (
                  <button
                    onClick={onViewPlans}
                    className="px-8 py-4 text-lg font-bold text-sky-400 rounded-lg transition-all duration-300 bg-slate-800 border-2 border-sky-500 hover:bg-slate-700 hover:text-sky-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
                    onMouseDown={(e) => e.currentTarget.blur()}
                  >
                    View My Plans
                  </button>
                )}
              </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Why Choose Our Path Generator?</h2>
            <p className="mt-3 max-w-2xl mx-auto text-slate-400">We leverage cutting-edge AI to provide a learning experience that's structured, practical, and tailored just for you.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<BrainCircuitIcon />} title="AI-Structured Path" description="Gemini Pro intelligently crafts a logical, step-by-step curriculum tailored to your goal and skill level." />
            <FeatureCard icon={<BoltIcon />} title="Fast AI Responses" description="Need a plan in a hurry? Use our Fast mode to get a complete learning path with ultra-low latency." />
            <FeatureCard icon={<VideoIcon />} title="Curated Video Content" description="Get a hand-picked YouTube video for each topic, giving you access to the best and latest content." />
            <FeatureCard icon={<BookOpenIcon />} title="Reliable Article Resources" description="Dive deeper with articles from trusted sources like official docs and top educational platforms." />
            <FeatureCard icon={<TargetIcon />} title="Practical Daily Projects" description="Apply what you've learned with a practical project suggestion for every topic, reinforcing your skills." />
            <FeatureCard icon={<CertificateIcon />} title="Professional Certifications" description="Discover relevant professional certifications to validate your new skills and boost your resume." />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-slate-800/50 rounded-lg">
         <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Your Learning Journey in 4 Simple Steps</h2>
        </div>
        <div className="relative">
             <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-700 -translate-y-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                <HowItWorksStep icon={<PencilIcon />} step={1} title="Define Your Goal" description="Tell us what you want to learn, your skill level, and how much time you can commit." />
                <HowItWorksStep icon={<BrainCircuitIcon />} step={2} title="AI Generates Plan" description="Our AI analyzes your input and builds a complete, day-by-day learning roadmap." />
                <HowItWorksStep icon={<ClipboardCheckIcon />} step={3} title="Review & Refine" description="Get your full plan, complete with videos, articles, projects, and certifications." />
                <HowItWorksStep icon={<RocketIcon />} step={4} title="Start Learning!" description="Finalize your plan and begin your journey to mastery with a clear path forward." />
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20">
        <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">What Our Learners Say</h2>
            <p className="mt-3 max-w-2xl mx-auto text-slate-400">Join thousands of successful self-starters who have achieved their goals with our AI mentor.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard quote="This tool is a game-changer. I wanted to learn React but was overwhelmed. The daily plan gave me the structure I needed to stay on track and build my first app in 30 days." name="Sarah J." skill="Learned React.js" />
            <TestimonialCard quote="As a project manager, I needed to understand the basics of cloud computing. This generator created a perfect 2-week plan that got me up to speed for my certification exam." name="Michael B." skill="Prepared for AWS Cloud Practitioner" />
            <TestimonialCard quote="I used the new 'Fast' mode to get a quick overview for learning Python. It was incredibly quick and gave me a solid starting point for the week." name="David L." skill="Learned Python Basics" />
        </div>
      </section>
      
      {/* Generator/CTA Section */}
      <section id="generator" className="py-16 sm:py-20 border-t border-slate-700">
         <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 text-transparent bg-clip-text">Ready to Master Your Next Skill?</h2>
            <p className="mt-3 text-slate-400">Fill out the form below. Your personalized, AI-crafted learning plan is just moments away.</p>
        </div>
        <div className="max-w-xl mx-auto bg-slate-800 p-8 rounded-lg border border-slate-700 shadow-2xl">
            <div className="space-y-6">
                <div className="space-y-3">
                    <label htmlFor="goal" className="block text-lg font-semibold text-slate-100">1. What do you want to learn?</label>
                    <textarea
                        id="goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g., Learn Python for data analysis"
                        className="w-full h-28 p-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                    />
                </div>
                <div className="space-y-3">
                    <label className="block text-lg font-semibold text-slate-100">2. What's your current skill level?</label>
                    <div className="flex space-x-3">
                        {(['Beginner', 'Intermediate', 'Advanced']).map(l => (
                            <SelectorButton key={l} label={l} isSelected={level === l.toLowerCase()} onClick={() => setLevel(l.toLowerCase() as SkillLevel)} />
                        ))}
                    </div>
                </div>
                 <div className="space-y-3">
                    <label className="block text-lg font-semibold text-slate-100">3. Choose your learning intensity.</label>
                    <div className="flex space-x-3">
                        {(['Casual', 'Moderate', 'Intense']).map(i => (
                            <SelectorButton key={i} label={i} isSelected={intensity === i.toLowerCase()} onClick={() => setIntensity(i.toLowerCase() as LearningIntensity)} />
                        ))}
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="block text-lg font-semibold text-slate-100">4. Choose your generation speed.</label>
                    <div className="flex space-x-3">
                        {(['HighQuality', 'Fast'] as GenerationMode[]).map(m => (
                            <SelectorButton key={m} label={m === 'HighQuality' ? 'High Quality' : 'Fast'} isSelected={generationMode === m} onClick={() => setGenerationMode(m)} />
                        ))}
                    </div>
                </div>
                <button
                    onClick={onGenerate}
                    disabled={!goal.trim()}
                    className="w-full py-3 text-lg font-bold text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:from-slate-600 disabled:to-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500"
                >
                    Generate & Review Plan
                </button>
            </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 backdrop-blur-sm transition-transform hover:-translate-y-1">
    <div className="flex items-center gap-4 mb-3">
      <div className="text-sky-400 bg-sky-900/50 p-2 rounded-md">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <p className="text-slate-400 text-sm">{description}</p>
  </div>
);

const HowItWorksStep: React.FC<{ icon: React.ReactNode; step: number; title: string; description: string }> = ({ icon, step, title, description }) => (
    <div className="text-center p-4">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 text-sky-400 text-2xl font-bold relative z-10">
            {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2"><span className="text-slate-500">Step {step}:</span> {title}</h3>
        <p className="text-slate-400 text-sm">{description}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; skill: string }> = ({ quote, name, skill }) => (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
        <p className="text-slate-300 mb-4 italic">"{quote}"</p>
        <div className="text-right">
            <p className="font-semibold text-white">{name}</p>
            <p className="text-sm text-sky-400">{skill}</p>
        </div>
    </div>
);

export default InputStage;