
import { Difficulty, FormatType, SkillCategory, LearningAsset, UserProfile } from './types';

export const INITIAL_ASSETS: LearningAsset[] = [
  {
    id: 'a1',
    title: 'Intro to AWS Cloud',
    description: 'Fundamentals of cloud computing and basic AWS services.',
    category: SkillCategory.CLOUD,
    difficulty: Difficulty.BEGINNER,
    format: FormatType.VIDEO,
    estimatedTime: 45,
    content: 'https://www.youtube.com/embed/SOTamWNgDKc'
  },
  {
    id: 'a2',
    title: 'Network Security Basics',
    description: 'Learn the core principles of securing enterprise networks.',
    category: SkillCategory.CYBERSECURITY,
    difficulty: Difficulty.BEGINNER,
    format: FormatType.TEXT,
    estimatedTime: 30,
    content: '# Network Security\n\nNetwork security consists of the policies, processes and practices adopted to prevent, detect and monitor unauthorized access, misuse, modification, or denial of a computer network and network-accessible resources.'
  },
  {
    id: 'a3',
    title: 'AI Ethics & Governance',
    description: 'Exploring the ethical implications of artificial intelligence in corporate environments.',
    category: SkillCategory.AI,
    difficulty: Difficulty.BEGINNER,
    format: FormatType.INTERACTIVE,
    estimatedTime: 60,
    content: 'interactive-governance-sim'
  },
  {
    id: 'a4',
    title: 'Dockerizing Microservices',
    description: 'Hands-on guide to containerizing Node.js applications.',
    category: SkillCategory.DEVOPS,
    difficulty: Difficulty.INTERMEDIATE,
    format: FormatType.INTERACTIVE,
    estimatedTime: 90,
    content: 'docker-sandbox'
  },
  {
    id: 'a5',
    title: 'Advanced Kubernetes Orchestration',
    description: 'Managing complex clusters and auto-scaling strategies.',
    category: SkillCategory.DEVOPS,
    difficulty: Difficulty.ADVANCED,
    format: FormatType.VIDEO,
    estimatedTime: 120,
    content: 'https://www.youtube.com/embed/X48VuDVv0do'
  },
  {
    id: 'a6',
    title: 'Large Language Model Fine-tuning',
    description: 'Technical deep-dive into training and tuning LLMs.',
    category: SkillCategory.AI,
    difficulty: Difficulty.ADVANCED,
    format: FormatType.INTERACTIVE,
    estimatedTime: 180,
    content: 'llm-tuning-sandbox'
  },
  {
    id: 'a7',
    title: 'Terraform Infrastructure as Code',
    description: 'Managing multi-cloud infrastructure using Terraform.',
    category: SkillCategory.CLOUD,
    difficulty: Difficulty.INTERMEDIATE,
    format: FormatType.TEXT,
    estimatedTime: 50,
    content: '# Infrastructure as Code\n\nTerraform allows you to define your cloud resources in simple, human-readable configuration files.'
  },
  {
    id: 'a8',
    title: 'Prompt Engineering Masterclass',
    description: 'Learn to talk to AI models effectively.',
    category: SkillCategory.AI,
    difficulty: Difficulty.INTERMEDIATE,
    format: FormatType.VIDEO,
    estimatedTime: 40,
    content: 'https://www.youtube.com/embed/jC4v5AS4RIM'
  },
  {
    id: 'a9',
    title: 'OWASP Top 10 Deep Dive',
    description: 'Identify and mitigate common web vulnerabilities.',
    category: SkillCategory.CYBERSECURITY,
    difficulty: Difficulty.INTERMEDIATE,
    format: FormatType.VIDEO,
    estimatedTime: 75,
    content: 'https://www.youtube.com/embed/2vI_97W6-K0'
  },
  {
    id: 'a10',
    title: 'DevOps Culture & CI/CD',
    description: 'The philosophy and pipelines behind high-performing teams.',
    category: SkillCategory.DEVOPS,
    difficulty: Difficulty.BEGINNER,
    format: FormatType.TEXT,
    estimatedTime: 40,
    content: '# CI/CD Overview\n\nContinuous Integration and Continuous Deployment is the backbone of modern software shipping.'
  },
];

export const MOCK_USER: UserProfile = {
  id: 'u1',
  name: 'Alex Rivera',
  role: 'Software Engineer',
  email: 'alex.rivera@skillstream.ai',
  avatar: 'https://picsum.photos/seed/alex/200',
  preferredFormat: FormatType.VIDEO,
  targetCategory: SkillCategory.AI,
  experienceLevel: Difficulty.BEGINNER,
  performanceHistory: [
    { assetId: 'a1', score: 92, timeSpent: 38, completedAt: '2024-03-01T10:00:00Z' },
    { assetId: 'a3', score: 85, timeSpent: 55, completedAt: '2024-03-05T14:30:00Z' },
    { assetId: 'a8', score: 78, timeSpent: 42, completedAt: '2024-03-10T11:20:00Z' }
  ],
  isAdmin: false,
  // Added missing fatigueScore
  fatigueScore: 10
};

export const ADMIN_USER: UserProfile = {
  id: 'u2',
  name: 'Sarah Chen',
  role: 'Learning & Development Manager',
  email: 'sarah.chen@skillstream.ai',
  avatar: 'https://picsum.photos/seed/sarah/200',
  preferredFormat: FormatType.TEXT,
  targetCategory: SkillCategory.DEVOPS,
  experienceLevel: Difficulty.ADVANCED,
  performanceHistory: [],
  isAdmin: true,
  // Added missing fatigueScore
  fatigueScore: 0
};
