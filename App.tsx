import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { InputSection } from './components/InputSection';
import { analyzeProject, AnalysisInput } from './services/geminiService';
import { ProjectData } from './types';
import { LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (input: AnalysisInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeProject(input);
      setProjectData(data);
    } catch (err) {
      setError("Ocurrió un error al procesar la información. Asegúrate de que el PDF sea válido y legible.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProject = (updatedData: ProjectData) => {
      setProjectData(updatedData);
  };

  const handleReset = () => {
    setProjectData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 overflow-x-hidden">
      {/* Navbar - Simplified for Dashboard View */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-[60] h-16 shadow-lg flex-none">
        <div className="w-full px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleReset}>
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-900/50">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter leading-none">EL GREKO <span className="text-blue-400">PC</span></h1>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase block">Auditoría UNGRD</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="h-6 w-px bg-slate-700"></div>
            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-white">Gabriel Mosquera</div>
                    <div className="text-[10px] text-slate-400">Auditor Senior</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-slate-600 shadow-sm flex items-center justify-center text-xs font-bold text-white">
                    GM
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width for PC */}
      <main className="flex-1 w-full flex flex-col overflow-hidden">
        {error && (
            <div className="w-full max-w-4xl mx-auto mt-6 px-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
            </div>
        )}

        {!projectData ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 bg-slate-50">
                <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>
        ) : (
            <div className="flex-1 w-full h-[calc(100vh-64px)] overflow-hidden">
              <Dashboard data={projectData} onReset={handleReset} onUpdate={handleUpdateProject} />
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
