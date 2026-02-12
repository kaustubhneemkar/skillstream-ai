
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, LearningAsset, LearningPathStep, UserPerformance } from '../types';
import { INITIAL_ASSETS, MOCK_USER } from '../constants';
import { generateAdaptivePath } from '../services/adaptiveEngine';

interface AppContextType {
  user: UserProfile;
  assets: LearningAsset[];
  learningPath: LearningPathStep[];
  updateUser: (updates: Partial<UserProfile>) => void;
  addPerformance: (performance: UserPerformance) => void;
  addAsset: (asset: LearningAsset) => void;
  updateAsset: (asset: LearningAsset) => void;
  deleteAsset: (id: string) => void;
  logout: () => void;
  login: (email: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [assets, setAssets] = useState<LearningAsset[]>(INITIAL_ASSETS);
  const [learningPath, setLearningPath] = useState<LearningPathStep[]>([]);

  useEffect(() => {
    // Regenerate path whenever user stats or assets change
    setLearningPath(generateAdaptivePath(user, assets));
  }, [user, assets]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const addPerformance = (perf: UserPerformance) => {
    setUser(prev => ({
      ...prev,
      performanceHistory: [...prev.performanceHistory, perf]
    }));
  };

  const addAsset = (asset: LearningAsset) => setAssets(prev => [...prev, asset]);
  const updateAsset = (asset: LearningAsset) => setAssets(prev => prev.map(a => a.id === asset.id ? asset : a));
  const deleteAsset = (id: string) => setAssets(prev => prev.filter(a => a.id !== id));

  const logout = () => {
    // In a real app, clear tokens. Here just reset or go to landing.
  };

  const login = (email: string) => {
    // Mock login logic
    if (email.includes('sarah')) {
      // Sarah is admin in our constants
      import('../constants').then(({ ADMIN_USER }) => setUser(ADMIN_USER));
    } else {
      setUser(MOCK_USER);
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      assets, 
      learningPath, 
      updateUser, 
      addPerformance,
      addAsset,
      updateAsset,
      deleteAsset,
      logout,
      login
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
