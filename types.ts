export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type LearningIntensity = 'casual' | 'moderate' | 'intense';
export type GenerationMode = 'HighQuality' | 'Fast';

export interface Article {
  title: string;
  url: string;
}

export interface Certification {
  name: string;
  provider: string;
  url: string;
  description: string;
}

export interface Project {
    title: string;
    url: string;
    description: string;
}

export interface VideoResource {
    title: string;
    url: string;
    summary: string;
}

// FIX: Add GroundingChunk type for search sources.
export interface GroundingChunk {
    web: {
        uri: string;
        title: string;
    };
}

export interface DayPlan {
    day: number;
    topic: string;
    coreVideo: VideoResource;
    articles: Article[];
    project: Project;
    // FIX: Add sources to display grounding information.
    sources: GroundingChunk[];
}

export interface FullLearningPlan {
    goal: string;
    dailyPlan: DayPlan[];
    recommendedChannels: string[];
    suggestedCertifications: Certification[];
    // FIX: Add certificationSources to display grounding information.
    certificationSources: GroundingChunk[];
}

// Original types for the initial plan generation from Gemini
export interface LearningDay {
    day: number;
    topic: string;
    youtubeSearchQuery: string;
}

export interface StructuredPlan {
    goal: string;
    learningDays: LearningDay[];
    recommendedChannels: string[];
}