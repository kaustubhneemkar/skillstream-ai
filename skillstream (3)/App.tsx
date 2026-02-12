
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import ModuleViewer from './pages/ModuleViewer';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const AppContent: React.FC = () => {
  const { user } = useApp();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  const navigate = (page: string, params?: any) => {
    if (page === 'module' && params?.id) {
      setActiveModuleId(params.id);
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <Landing onStart={() => navigate('login')} />;
      case 'login': return <Login onLogin={() => navigate('dashboard')} />;
      case 'dashboard': return <Dashboard onNavigate={navigate} />;
      case 'catalog': return <Catalog onNavigate={navigate} />;
      case 'module': return <ModuleViewer id={activeModuleId!} onBack={() => navigate('dashboard')} />;
      case 'admin': return user.isAdmin ? <Admin /> : <Dashboard onNavigate={navigate} />;
      case 'profile': return <Profile />;
      default: return <Landing onStart={() => navigate('login')} />;
    }
  };

  const showNav = !['landing', 'login'].includes(currentPage);

  return (
    <div className="flex min-h-screen">
      {showNav && <Sidebar activePage={currentPage} onNavigate={navigate} />}
      <div className="flex-1 flex flex-col">
        {showNav && <Header onNavigate={navigate} />}
        <main className={`flex-1 ${showNav ? 'p-6 md:p-10' : ''}`}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
