
import React, { useState } from 'react';
import { useGameStore } from '../../store/GameContext';
import { useAppHealthCheck, TestResult } from '../../utils/healthCheck';

export const DebugScreen: React.FC = () => {
  const { setActiveTab, userProfile, orderItems, menuItems, session } = useGameStore();
  const { runTests } = useAppHealthCheck();
  const [results, setResults] = useState<TestResult[]>([]);
  const [activeTab, setLocalTab] = useState<'tests' | 'state'>('tests');

  const handleRunTests = () => {
      const res = runTests();
      setResults(res);
  };

  return (
    <div className="flex flex-col h-full bg-black text-green-400 font-mono text-xs overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-green-800 bg-gray-900">
        <h1 className="font-bold text-lg">SYSTEM DIAGNOSTICS</h1>
        <button 
            onClick={() => setActiveTab('settings')}
            className="px-3 py-1 border border-green-600 rounded hover:bg-green-900 transition-colors"
        >
            CLOSE
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-green-800">
          <button 
            onClick={() => setLocalTab('tests')}
            className={`flex-1 py-3 text-center hover:bg-green-900/30 ${activeTab === 'tests' ? 'bg-green-900/50 font-bold' : ''}`}
          >
            HEALTH CHECK
          </button>
          <button 
            onClick={() => setLocalTab('state')}
            className={`flex-1 py-3 text-center hover:bg-green-900/30 ${activeTab === 'state' ? 'bg-green-900/50 font-bold' : ''}`}
          >
            STATE INSPECTOR
          </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
          
          {activeTab === 'tests' && (
              <div className="space-y-4">
                  <button 
                    onClick={handleRunTests}
                    className="w-full py-4 border border-green-500 text-green-500 font-bold text-sm tracking-widest hover:bg-green-500 hover:text-black transition-all mb-6 uppercase"
                  >
                      Run Full Diagnostics
                  </button>

                  <div className="space-y-2">
                      {results.map((res, idx) => (
                          <div key={idx} className={`p-3 border rounded flex justify-between items-start ${res.passed ? 'border-green-800 bg-green-900/10' : 'border-red-500 bg-red-900/20'}`}>
                              <div>
                                  <div className={`font-bold ${res.passed ? 'text-green-400' : 'text-red-400'}`}>
                                      [{res.passed ? 'PASS' : 'FAIL'}] {res.name}
                                  </div>
                                  <div className="text-gray-400 mt-1">{res.message}</div>
                              </div>
                          </div>
                      ))}
                      {results.length === 0 && (
                          <div className="text-center opacity-50 py-10">Waiting to run tests...</div>
                      )}
                  </div>
              </div>
          )}

          {activeTab === 'state' && (
              <div className="space-y-6">
                  <section>
                      <h3 className="text-white bg-gray-800 px-2 py-1 mb-2">SESSION</h3>
                      <pre className="text-[10px] whitespace-pre-wrap">{JSON.stringify(session, null, 2)}</pre>
                  </section>
                  
                  <section>
                      <h3 className="text-white bg-gray-800 px-2 py-1 mb-2">USER PROFILE</h3>
                      <pre className="text-[10px] whitespace-pre-wrap">{JSON.stringify(userProfile, null, 2)}</pre>
                  </section>

                  <section>
                      <h3 className="text-white bg-gray-800 px-2 py-1 mb-2">CART ({orderItems.length})</h3>
                      <pre className="text-[10px] whitespace-pre-wrap">{JSON.stringify(orderItems, null, 2)}</pre>
                  </section>
              </div>
          )}
      </div>

      <div className="p-2 text-center text-[9px] text-gray-600 border-t border-green-900">
          GASTRO-VIBE ENGINE v1.0.2
      </div>
    </div>
  );
};
