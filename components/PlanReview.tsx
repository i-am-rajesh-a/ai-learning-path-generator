import React, { useState } from 'react';
import { FullLearningPlan } from '../types';

interface PlanReviewProps {
  plan: FullLearningPlan;
  onConfirm: () => void;
  onStartOver: () => void;
}

const AccordionItem: React.FC<{ dayPlan: FullLearningPlan['dailyPlan'][0] }> = ({ dayPlan }) => {
    const [isOpen, setIsOpen] = useState(dayPlan.day === 1);

    return (
        <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left p-4 bg-gray-700/50 hover:bg-gray-700 transition-colors duration-300 flex justify-between items-center">
                <h3 className="text-lg font-bold text-indigo-300">{`Day ${dayPlan.day}: ${dayPlan.topic}`}</h3>
                <svg className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="p-4 bg-gray-800/50 animate-fade-in-down">
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-300 mb-1">Core Video:</h4>
                        <a href={dayPlan.coreVideo.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{dayPlan.coreVideo.title}</a>
                        <p className="text-sm text-gray-400 mt-1">{dayPlan.coreVideo.summary}</p>
                    </div>
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-300 mb-1">Recommended Reading:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {dayPlan.articles.map((article, i) => (
                                <li key={i}><a href={article.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{article.title}</a></li>
                            ))}
                        </ul>
                    </div>
                    {dayPlan.project && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-300 mb-1">Practical Project:</h4>
                            <a href={dayPlan.project.url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{dayPlan.project.title}</a>
                            <p className="text-sm text-gray-400 mt-1">{dayPlan.project.description}</p>
                        </div>
                    )}
                    {/* FIX: Display grounding sources */}
                    {dayPlan.sources && dayPlan.sources.length > 0 && (
                        <div className="pt-4 border-t border-gray-700">
                            <h4 className="font-semibold text-gray-300 mb-1">Research Sources:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                {dayPlan.sources.map((source, i) => (
                                    <li key={i}>
                                        <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline break-all">
                                            {source.web.title || source.web.uri}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


export const PlanReview: React.FC<PlanReviewProps> = ({ plan, onConfirm, onStartOver }) => {
  return (
    <div className="bg-gray-800 shadow-2xl rounded-xl p-4 sm:p-6 md:p-8 border border-gray-700 animate-fade-in">
        <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Review Your Custom Learning Plan</h2>
            <p className="mt-2 text-lg text-gray-400">Here's the detailed plan for: <span className="font-semibold text-indigo-400">"{plan.goal}"</span></p>
        </div>

        <div className="space-y-4 mb-8">
            {plan.dailyPlan.map(dayPlan => <AccordionItem key={dayPlan.day} dayPlan={dayPlan} />)}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-bold text-indigo-300 mb-2">Recommended Channels</h3>
                <ul className="list-disc list-inside text-gray-300">
                    {plan.recommendedChannels.map((channel, i) => <li key={i}>{channel}</li>)}
                </ul>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-bold text-indigo-300 mb-2">Suggested Certifications</h3>
                 <ul className="space-y-3 text-gray-300">
                    {plan.suggestedCertifications.map((cert, i) => (
                       <li key={i}>
                         <a href={cert.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-indigo-400 hover:underline">{cert.name}</a>
                         <span className="text-sm text-gray-400 block">by {cert.provider}</span>
                         <p className="text-sm text-gray-400 mt-1">{cert.description}</p>
                       </li>
                    ))}
                </ul>
                {/* FIX: Display certification sources */}
                {plan.certificationSources && plan.certificationSources.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-600">
                        <h4 className="font-semibold text-gray-300 mb-2">Research Sources:</h4>
                        <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                            {plan.certificationSources.map((source, i) => (
                                <li key={i}>
                                    <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline break-all">
                                        {source.web.title || source.web.uri}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartOver}
              className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out"
            >
              Start Over
            </button>
            <button
              onClick={onConfirm}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
            >
              Finish & Start Learning
            </button>
        </div>
    </div>
  );
};
