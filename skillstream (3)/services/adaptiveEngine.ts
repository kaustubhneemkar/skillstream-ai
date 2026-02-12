
import { 
  UserProfile, 
  LearningAsset, 
  LearningPathStep, 
  Difficulty, 
  SkillCategory, 
  FormatType 
} from '../types';

/**
 * Calculates a fatigue score based on recent performance intensity.
 */
export const calculateFatigue = (user: UserProfile): number => {
  if (user.performanceHistory.length < 3) return 10;
  
  const recent = user.performanceHistory.slice(-3);
  const avgTime = recent.reduce((acc, curr) => acc + curr.timeSpent, 0) / 3;
  const avgRetries = recent.reduce((acc, curr) => acc + (curr.retries || 0), 0) / 3;
  
  // High time spent + high retries = high fatigue
  let score = (avgTime / 60) * 30 + (avgRetries * 20);
  return Math.min(Math.round(score), 100);
};

/**
 * Generates an adaptive learning path based on user profile and performance.
 */
export const generateAdaptivePath = (
  user: UserProfile, 
  allAssets: LearningAsset[]
): LearningPathStep[] => {
  const relevantAssets = allAssets.filter(asset => asset.category === user.targetCategory);

  const difficultyMap = {
    [Difficulty.BEGINNER]: 0,
    [Difficulty.INTERMEDIATE]: 1,
    [Difficulty.ADVANCED]: 2
  };

  const sortedAssets = [...relevantAssets].sort((a, b) => 
    difficultyMap[a.difficulty] - difficultyMap[b.difficulty]
  );

  let foundCurrent = false;
  const fatigue = calculateFatigue(user);

  return sortedAssets.map((asset, index) => {
    const performance = user.performanceHistory.find(p => p.assetId === asset.id);
    const prevPerformance = index > 0 
      ? user.performanceHistory.find(p => p.assetId === sortedAssets[index - 1].id)
      : null;

    let status: LearningPathStep['status'] = 'locked';
    let reason = '';

    if (performance) {
      status = 'completed';
      reason = `Mastered with ${performance.score}% accuracy.`;
    } else {
      if (index === 0 || (prevPerformance && prevPerformance.score >= 75)) {
        status = 'current';
        
        // Adaptive Reason Injection
        if (fatigue > 70 && asset.format !== FormatType.VIDEO) {
          reason = "High mental load detected. Recommending Video mode for easier retention.";
        } else if (user.experienceLevel === asset.difficulty) {
          reason = "Perfectly matched to your stated baseline.";
        } else {
          reason = "Optimal progression based on previous success.";
        }
      }

      if (user.experienceLevel === Difficulty.ADVANCED && asset.difficulty === Difficulty.BEGINNER) {
        status = 'skipped';
        reason = 'Skipped: Knowledge verified by professional role profile.';
      }

      if (status === 'current') {
        if (foundCurrent) status = 'locked';
        else foundCurrent = true;
      }
    }

    return { asset, status, recommendationReason: reason };
  });
};
