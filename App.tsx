
import React, { Component, Suspense, ErrorInfo, ReactNode } from 'react';
import { GameProvider, useGameStore } from './store/GameContext';
import { BottomNav } from './components/Layout/BottomNav';
import { BurgerMenu } from './components/Layout/BurgerMenu';
import { ProductSheet } from './components/Modals/ProductSheet';
import { StoryViewer } from './components/Modals/StoryViewer';
import { CollectionSelector } from './components/Modals/CollectionSelector';

// Lazy Loading Screens
const TableScreen = React.lazy(() => import('./components/Screens/TableScreen').then(m => ({ default: m.TableScreen })));
const MenuScreen = React.lazy(() => import('./components/Screens/MenuScreen').then(m => ({ default: m.MenuScreen })));
const BillScreen = React.lazy(() => import('./components/Screens/BillScreen').then(m => ({ default: m.BillScreen })));
const GamesScreen = React.lazy(() => import('./components/Screens/GamesScreen').then(m => ({ default: m.GamesScreen })));
const ProfileScreen = React.lazy(() => import('./components/Screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const EventsScreen = React.lazy(() => import('./components/Screens/EventsScreen').then(m => ({ default: m.EventsScreen })));
const AdminScreen = React.lazy(() => import('./components/Screens/AdminScreen').then(m => ({ default: m.AdminScreen })));
const SettingsScreen = React.lazy(() => import('./components/Screens/SettingsScreen').then(m => ({ default: m.SettingsScreen })));
const AuthScreen = React.lazy(() => import('./components/Screens/AuthScreen').then(m => ({ default: m.AuthScreen })));
const DebugScreen = React.lazy(() => import('./components/Debug/DebugScreen').then(m => ({ default: m.DebugScreen })));

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary to catch crashes
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  // Explicitly declare props to satisfy strict TypeScript environments if implicit inheritance fails
  declare props: Readonly<ErrorBoundaryProps>;

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-red-900 p-6 text-center">
          <h1 className="text-xl font-bold mb-2">Что-то пошло не так</h1>
          <p className="text-sm mb-4">Приложение столкнулось с критической ошибкой.</p>
          <pre className="text-xs bg-red-100 p-2 rounded w-full overflow-auto text-left mb-4">
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded font-bold uppercase text-xs"
          >
            Перезагрузить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const LoadingScreen = () => (
  <div className="flex items-center justify-center h-full w-full bg-white text-black">
    <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold uppercase tracking-widest opacity-50">Загрузка...</span>
    </div>
  </div>
);

const ScreenRenderer: React.FC = () => {
  const { activeTab } = useGameStore();

  switch (activeTab) {
    case 'table': return <TableScreen />;
    case 'menu': return <MenuScreen />;
    case 'bill': return <BillScreen />;
    case 'games': return <GamesScreen />;
    case 'profile': return <ProfileScreen />;
    case 'events': return <EventsScreen />;
    case 'admin': return <AdminScreen />;
    case 'settings': return <SettingsScreen />;
    case 'auth': return <AuthScreen />;
    case 'debug': return <DebugScreen />;
    default: return <TableScreen />;
  }
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GameProvider>
        <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
          <Suspense fallback={<LoadingScreen />}>
            <ScreenRenderer />
          </Suspense>
          
          {/* Global UI Elements */}
          <BottomNav />
          <BurgerMenu />
          
          {/* Modals */}
          <ProductSheet />
          <StoryViewer />
          <CollectionSelector />
        </div>
      </GameProvider>
    </ErrorBoundary>
  );
};

export default App;
