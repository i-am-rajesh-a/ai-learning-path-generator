import { GoogleGenAI, Type } from "@google/genai";
import { 
    FullLearningPlan, 
    StructuredPlan, 
    VideoResource, 
    Article, 
    Certification,
    Project,
    DayPlan,
    SkillLevel,
    LearningIntensity,
    GenerationMode,
    GroundingChunk
} from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type ProgressCallback = (update: string) => void;

/**
 * A robust parser to extract and parse JSON from the model's text response.
 * It handles cases where the JSON is wrapped in markdown code fences or has trailing text.
 */
const parseJsonFromResponse = <T>(responseText: string | undefined): T => {
    if (!responseText) {
        throw new Error("The AI returned an empty response. This might be due to content safety filters or an internal error.");
    }
    let jsonString = responseText.trim();

    // First, try to extract from markdown code fences
    const fenceMatch = jsonString.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
    if (fenceMatch) {
        jsonString = fenceMatch[1];
    } else {
        // If no fences, find the first '{' or '[' and the last '}' or ']'
        // This handles cases where the model might add text after the JSON.
        const firstBracket = jsonString.indexOf('{');
        const firstSquare = jsonString.indexOf('[');
        
        let start = -1;
        // Find the earliest start of a JSON object or array
        if (firstBracket === -1) {
            start = firstSquare;
        } else if (firstSquare === -1) {
            start = firstBracket;
        } else {
            start = Math.min(firstBracket, firstSquare);
        }

        const lastBracket = jsonString.lastIndexOf('}');
        const lastSquare = jsonString.lastIndexOf(']');
        
        const end = Math.max(lastBracket, lastSquare);
        
        if (start !== -1 && end !== -1 && end > start) {
            jsonString = jsonString.substring(start, end + 1);
        }
    }

    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON string. Original response:", responseText);
        console.error("Attempted to parse:", jsonString);
        throw new Error("The AI returned a response in an invalid format.");
    }
};

const durationMap = {
    casual: '3 to 5 days',
    moderate: '7 to 8 days',
    intense: '10 to 12 days'
};

/**
 * Helper function to extract a user-friendly error message from API errors
 */
const getErrorMessage = (error: any): string => {
    if (error?.error) {
        const apiError = error.error;
        // Handle specific error codes
        if (apiError.code === 503 || apiError.status === 'UNAVAILABLE') {
            return 'The AI service is temporarily overloaded. Please wait a moment and try again.';
        }
        if (apiError.code === 429) {
            return 'Too many requests. Please wait a moment and try again.';
        }
        if (apiError.code === 401 || apiError.code === 403) {
            return 'API key is invalid or missing. Please check your configuration.';
        }
        if (apiError.message) {
            return apiError.message;
        }
    }
    if (error?.message) {
        return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
};

/**
 * Retry helper with exponential backoff for transient errors (503, 429, etc.)
 */
const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000,
    errorMessage?: string,
    progressCallback?: (message: string) => void
): Promise<T> => {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            const errorCode = error?.error?.code || error?.code;
            const status = error?.error?.status;
            
            // Only retry on transient errors (503, 429, or UNAVAILABLE status)
            const shouldRetry = (errorCode === 503 || errorCode === 429 || status === 'UNAVAILABLE') && attempt < maxRetries;
            
            if (shouldRetry) {
                // Exponential backoff: 1s, 2s, 4s
                const delay = initialDelay * Math.pow(2, attempt);
                if (progressCallback) {
                    progressCallback(`Service temporarily unavailable. Retrying in ${delay / 1000} seconds... (Attempt ${attempt + 1}/${maxRetries})`);
                }
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            
            // If we shouldn't retry or have exhausted retries, throw
            throw error;
        }
    }
    
    throw lastError;
};


export const generateFullPlan = async (
    goal: string,
    level: SkillLevel,
    intensity: LearningIntensity,
    generationMode: GenerationMode,
    progressCallback: ProgressCallback
): Promise<FullLearningPlan> => {
    const structureModel = generationMode === 'Fast' ? 'gemini-flash-lite-latest' : 'gemini-2.5-pro';
    const enrichmentModel = generationMode === 'Fast' ? 'gemini-flash-lite-latest' : 'gemini-2.5-flash';

    // Step 1: Plan the Learning Path Structure.
    progressCallback('Step 1: Planning the learning path structure...');
    const planPrompt = `Create a structured, day-wise learning path for a ${level} learner with the goal: "${goal}". The path should be between ${durationMap[intensity]}. For each day, provide a concise topic and a YouTube search query to find relevant videos. Also suggest 3 top YouTube channels for this topic.`;
    
    const planSchema = {
        type: Type.OBJECT,
        properties: {
            goal: { type: Type.STRING },
            learningDays: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: { type: Type.INTEGER },
                        topic: { type: Type.STRING },
                        youtubeSearchQuery: { type: Type.STRING },
                    },
                    required: ['day', 'topic', 'youtubeSearchQuery'],
                },
            },
            recommendedChannels: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['goal', 'learningDays', 'recommendedChannels'],
    };

    const planResponse = await retryWithBackoff(
        () => ai.models.generateContent({
            model: structureModel,
            contents: planPrompt,
            config: { responseMimeType: 'application/json', responseSchema: planSchema },
        }),
        3,
        1000,
        'Failed to generate learning path structure',
        progressCallback
    ).catch((error) => {
        throw new Error(getErrorMessage(error));
    });
    
    if (!planResponse.text) {
        throw new Error("The AI failed to generate the initial plan structure. Please try again with a different goal.");
    }
    const plan: StructuredPlan = JSON.parse(planResponse.text);

    // Step 2: Enrich each day with videos, articles and projects
    progressCallback('Step 2: Researching videos, articles, and projects...');
    const dailyPlanPromises = plan.learningDays.map(async (day): Promise<DayPlan> => {
        progressCallback(`- Researching resources for Day ${day.day}: ${day.topic}`);
        
        // FIX: Consolidated three API calls into a single call to avoid rate limiting.
        const enrichmentPrompt = `Using Google Search, find resources for a ${level} learner on the topic "${day.topic}". You must find: 1. The single best YouTube video. 2. 2-3 relevant, high-quality articles or tutorials. 3. One practical, ${level}-friendly project idea or tutorial. Respond ONLY with a single, valid JSON object that contains the keys "coreVideo" (object with "title", "url", "summary"), "articles" (array of objects with "title", "url"), and "project" (object with "title", "url", "description"). Do not add any markdown formatting or other text.`;
        
        const enrichmentResponse = await retryWithBackoff(
            () => ai.models.generateContent({
                model: enrichmentModel,
                contents: enrichmentPrompt,
                config: { 
                    tools: [{googleSearch: {}}],
                },
            }),
            3,
            1000,
            `Failed to enrich resources for Day ${day.day}`,
            progressCallback
        ).catch((error) => {
            throw new Error(getErrorMessage(error));
        });

        type DayEnrichment = {
            coreVideo: VideoResource;
            articles: Article[];
            project: Project;
        };

        const { coreVideo, articles, project }: DayEnrichment = parseJsonFromResponse(enrichmentResponse.text);
        
        const allSources = (enrichmentResponse.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [])
            .filter(s => s.web?.uri);

        const sources: GroundingChunk[] = Array.from(new Map(allSources.map(s => [s.web.uri, {
            web: {
                uri: s.web.uri,
                title: s.web.title || s.web.uri,
            }
        }])).values());


        return { day: day.day, topic: day.topic, coreVideo, articles, project, sources };
    });

    const dailyPlan = await Promise.all(dailyPlanPromises);

    // Step 3: Find relevant certifications
    progressCallback('Step 3: Finding relevant certifications...');
    const certPrompt = `Using Google Search, find 2-3 relevant professional certifications for a ${level} learner with the learning goal "${goal}". Respond ONLY with a single, valid JSON array of objects, where each object contains "name", "provider", "url" (the real URL), and "description". Do not add any markdown formatting or other text.`;
    const certResponse = await retryWithBackoff(
        () => ai.models.generateContent({
            model: enrichmentModel,
            contents: certPrompt,
            config: { 
                tools: [{googleSearch: {}}],
            },
        }),
        3,
        1000,
        'Failed to find certifications',
        progressCallback
    ).catch((error) => {
        throw new Error(getErrorMessage(error));
    });
    const suggestedCertifications: Certification[] = parseJsonFromResponse(certResponse.text);
    const certificationSources = (certResponse.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []).filter(s => s.web?.uri);
    const uniqueCertificationSources = Array.from(new Map(certificationSources.map(s => [s.web.uri, {
        web: {
            uri: s.web.uri,
            title: s.web.title || s.web.uri
        }
    }])).values());

    progressCallback('Plan generated successfully!');
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        goal: plan.goal,
        dailyPlan: dailyPlan.sort((a, b) => a.day - b.day),
        recommendedChannels: plan.recommendedChannels,
        suggestedCertifications,
        certificationSources: uniqueCertificationSources,
    };
};