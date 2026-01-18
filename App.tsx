import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { InputSection } from './components/InputSection';
import { analyzeProject, AnalysisInput, getRecentProjects, saveProjectToSupabase, SavedProject } from './services/geminiService';
import { ProjectData } from './types';
import { LayoutDashboard, Clock, ChevronRight, Save, CheckCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentProjects, setRecentProjects] = useState<SavedProject[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadRecentProjects();
  }, []);

  const loadRecentProjects = async () => {
    const projects = await getRecentProjects(5);
    setRecentProjects(projects);
  };

  const handleAnalyze = async (input: AnalysisInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeProject(input);
      setProjectData(data);
    } catch (err: any) {
      console.error("Error during analysis:", err);
      if (err.message?.includes('429') || err.status === 429) {
        setError("Límite de cuota excedido (API Quota Exceeded). Por favor, intenta de nuevo en un minuto.");
      } else if (err.message?.includes('API_KEY_INVALID')) {
        setError("La clave de API de Gemini no es válida. Revisa el archivo .env.");
      } else {
        setError(`DEBUG ERROR: ${err.message} - ${err.toString()}`);
      }
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
    setSaveSuccess(false);
    loadRecentProjects();
  };

  const handleSaveProject = async () => {
    if (!projectData) return;
    setIsSaving(true);
    setSaveSuccess(false);
    const result = await saveProjectToSupabase(projectData);
    setIsSaving(false);
    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setError(result.error || 'Error al guardar el proyecto.');
    }
  };

  const handleLoadProject = (savedProject: SavedProject) => {
    setProjectData(savedProject.full_data);
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

          <div className="flex items-center gap-4">
            {projectData && (
              <button
                onClick={handleSaveProject}
                disabled={isSaving}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${saveSuccess
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : saveSuccess ? (
                  <CheckCircle size={16} />
                ) : (
                  <Save size={16} />
                )}
                {isSaving ? 'Guardando...' : saveSuccess ? 'Guardado!' : 'Guardar'}
              </button>
            )}
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

            {/* Recent Projects Section */}
            {recentProjects.length > 0 && (
              <div className="w-full max-w-2xl mt-8 px-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock size={14} /> Proyectos Recientes
                </h3>
                <div className="space-y-2">
                  {recentProjects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleLoadProject(p)}
                      className="w-full bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between group"
                    >
                      <div className="text-left">
                        <div className="font-bold text-slate-800">{p.project_name}</div>
                        <div className="text-xs text-slate-400">
                          {p.contract_id && <span>Contrato: {p.contract_id} • </span>}
                          {new Date(p.created_at).toLocaleDateString('es-CO')}
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
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

