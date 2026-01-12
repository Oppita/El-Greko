import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, FileText, UploadCloud, FileType, AlertCircle, ShieldCheck } from 'lucide-react';
import { AnalysisInput } from '../services/geminiService';

interface InputSectionProps {
  onAnalyze: (input: AnalysisInput) => void;
  isLoading: boolean;
}

const DEMO_TEXT = `CONTRATO DE OBRA No. 458-2024
CONTRATISTA: CONSTRUCTORA ANDINA S.A.S.
NIT: 800.123.456-9
OBJETO: Construcción y adecuación del Centro Comunitario "La Esperanza" en el municipio de Medellín, Antioquia.
VALOR TOTAL: $1,250,000,000 COP.
PLAZO: 8 meses.
FECHA DE INICIO: 2024-03-01
FECHA FINALIZACIÓN: 2024-11-01

REPORTE DE AVANCE NO. 3
A la fecha se ha ejecutado un presupuesto de $450,000,000 COP correspondiente a excavaciones y cimentación.
El avance físico es del 36%.
ALERTAS:
- Retraso en la entrega de acero por parte del proveedor (Riesgo medio).
- Lluvias fuertes afectaron el cronograma la semana pasada (2 días perdidos).
- Se requiere aprobación urgente de interventoría para cambio de especificación en pisos.

HITOS:
- 2024-03-15: Acta de inicio (Completado).
- 2024-05-30: Finalización de cimentación (Completado).
- 2024-08-15: Estructura gris (Pendiente).
- 2024-10-01: Acabados (Pendiente).
`;

const MAX_FILE_SIZE_MB = 30; 
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const [inputText, setInputText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const preventDefault = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    window.addEventListener('dragover', preventDefault);
    window.addEventListener('drop', preventDefault);
    return () => { window.removeEventListener('dragover', preventDefault); window.removeEventListener('drop', preventDefault); };
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") { setDragActive(true); } else if (e.type === "dragleave") { setDragActive(false); }
  }, []);

  const processFile = (file: File) => {
    setLocalError(null);
    if (file.size > MAX_FILE_SIZE_BYTES) { setLocalError(`El archivo es demasiado grande (${(file.size / 1024 / 1024).toFixed(1)}MB).`); return; }
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try { const result = e.target?.result as string; if (result && result.includes(',')) { const base64 = result.split(',')[1]; onAnalyze({ type: 'pdf', content: base64 }); } else { setLocalError("Error al leer PDF."); } } catch (err) { console.error("Error parsing file", err); setLocalError("Error al procesar archivo."); }
      };
      reader.onerror = () => { setLocalError("Error de lectura."); };
      reader.readAsDataURL(file);
    } else { setLocalError("Selecciona un PDF válido."); }
  };

  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files && e.dataTransfer.files[0]) { processFile(e.dataTransfer.files[0]); } }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { e.preventDefault(); if (e.target.files && e.target.files[0]) { processFile(e.target.files[0]); } if (fileInputRef.current) { fileInputRef.current.value = ''; } };
  const handleTextSubmit = (e: React.FormEvent) => { e.preventDefault(); if (inputText.trim()) { onAnalyze({ type: 'text', content: inputText }); } };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div className="max-w-5xl w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-gray-900 rounded-2xl mb-6 text-white shadow-xl shadow-gray-200">
              <ShieldCheck size={48} />
            </div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">
              Auditoría Forense de Infraestructura
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
              Sistema experto para análisis de contratos de obra pública, detección de sobrecostos y gestión de riesgos <span className="font-bold text-gray-900">Ley 1523</span>.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button type="button" onClick={() => setActiveTab('upload')} className={`flex-1 py-6 text-sm font-bold tracking-widest uppercase text-center transition-all ${activeTab === 'upload' ? 'bg-gray-50 text-blue-600 border-b-4 border-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}>Cargar Expediente (PDF)</button>
              <button type="button" onClick={() => setActiveTab('text')} className={`flex-1 py-6 text-sm font-bold tracking-widest uppercase text-center transition-all ${activeTab === 'text' ? 'bg-gray-50 text-blue-600 border-b-4 border-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}>Texto Plano / Cláusulas</button>
            </div>

            <div className="p-10 min-h-[450px] flex flex-col justify-center bg-gray-50/50 relative">
              {localError && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-xl flex items-center gap-3 text-sm font-bold shadow-sm">
                  <AlertCircle size={20} className="shrink-0" /> {localError}
                </div>
              )}

              {activeTab === 'upload' ? (
                <div 
                  className={`flex-1 flex flex-col items-center justify-center relative border-3 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${dragActive ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-gray-300 hover:border-blue-400 hover:bg-white'} ${isLoading ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}`}
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => !isLoading && fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" className="hidden" accept="application/pdf" onChange={handleChange} disabled={isLoading} />
                  <div className="flex flex-col items-center justify-center gap-6">
                    <div className={`p-8 rounded-full transition-transform duration-500 ${dragActive ? 'bg-blue-200 scale-110' : 'bg-gray-100'}`}>
                      <UploadCloud size={64} className={dragActive ? "text-blue-700" : "text-gray-400"} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900 mb-2">Arrastra el archivo aquí</p>
                      <p className="text-lg text-gray-500">Soporta contratos extensos y anexos técnicos.</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400 mt-4 bg-white px-4 py-2 rounded-full border border-gray-200 uppercase tracking-wider shadow-sm">
                      <FileType size={14} /> PDF hasta {MAX_FILE_SIZE_MB}MB
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleTextSubmit} className="h-full flex flex-col">
                  <div className="flex-1 mb-6 relative h-full">
                      <textarea rows={14} className="w-full h-full p-6 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none text-gray-700 font-mono text-sm leading-relaxed shadow-inner bg-white" placeholder="Pega aquí el contenido del contrato..." value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={isLoading} />
                      <div className="absolute top-4 right-4"><button type="button" onClick={() => setInputText(DEMO_TEXT)} className="px-3 py-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg flex items-center gap-1 transition-colors" title="Cargar ejemplo"><Sparkles size={12} /> Cargar Demo</button></div>
                  </div>
                  <div className="flex justify-end"><button type="submit" disabled={isLoading || !inputText.trim()} className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-xl transition-all disabled:opacity-50 font-bold shadow-xl flex items-center gap-3 transform active:scale-95 text-lg"><ShieldCheck size={20} /> Iniciar Auditoría</button></div>
                </form>
              )}

              {isLoading && (
                 <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-10 flex flex-col items-center justify-center animate-fade-in p-8 rounded-3xl">
                   <div className="w-full max-w-lg bg-gray-100 rounded-full h-2 mb-8 overflow-hidden relative"><div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 h-full rounded-full animate-progress-indeterminate absolute top-0 left-0 w-full"></div></div>
                   <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Procesando Expediente...</h3>
                   <p className="text-gray-500 text-center max-w-md text-lg">El Greko AI está analizando tablas financieras, cronogramas y cláusulas de riesgo.</p>
                 </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-center gap-12 text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">
             <span className="flex items-center gap-2"><ShieldCheck size={16}/> Encriptación Militar</span>
             <span className="flex items-center gap-2"><Sparkles size={16}/> Gemini 2.5 Pro</span>
          </div>
      </div>
      <style>{`@keyframes progress-indeterminate { 0% { transform: translateX(-100%); } 50% { transform: translateX(0%); } 100% { transform: translateX(100%); } } .animate-progress-indeterminate { animation: progress-indeterminate 2s infinite linear; width: 50%; }`}</style>
    </div>
  );
};