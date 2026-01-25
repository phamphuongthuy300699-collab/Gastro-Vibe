import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Simple Error Boundary to catch crashers
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6 text-center font-sans">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm">
            <span className="text-4xl mb-4 block">😵</span>
            <h1 className="text-xl font-bold text-red-600 mb-2">Что-то пошло не так</h1>
            <p className="text-sm text-gray-500 mb-4">Приложение столкнулось с критической ошибкой.</p>
            <div className="bg-gray-100 p-3 rounded text-left overflow-auto max-h-40 mb-4">
                <code className="text-[10px] text-red-500 font-mono block">
                    {this.state.error?.toString()}
                </code>
            </div>
            <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl uppercase tracking-wider text-xs"
            >
                Перезагрузить
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);