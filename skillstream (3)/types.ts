
export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum FormatType {
  VIDEO = 'Video',
  TEXT = 'Documentation',
  INTERACTIVE = 'Interactive Sandbox'
}

export enum SkillCategory {
  CLOUD = 'Cloud Computing',
  CYBERSECURITY = 'Cybersecurity',
  AI = 'Artificial Intelligence',
  DEVOPS = 'DevOps',
  SOFTWARE_ENG = 'Software Engineering'
}

export interface LearningAsset {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  difficulty: Difficulty;
  format: FormatType;
  estimatedTime: number; // in minutes
  content: string; // Markdown or video URL
}

export interface UserPerformance {
  assetId: string;
  score: number; // 0-100
  timeSpent: number; // in minutes
  completedAt: string;
  retries?: number;
}

export interface Peer {
  id: string;
  name: string;
  avatar: string;
  expertise: SkillCategory;
  isOnline: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  preferredFormat: FormatType;
  targetCategory: SkillCategory;
  experienceLevel: Difficulty;
  performanceHistory: UserPerformance[];
  isAdmin: boolean;
  fatigueScore: number; // 0-100
}

export interface LearningPathStep {
  asset: LearningAsset;
  status: 'locked' | 'current' | 'completed' | 'skipped';
  recommendationReason?: string;
}
