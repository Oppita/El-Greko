

// ... existing imports ...
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine,
  LineChart, Line, Legend, AreaChart, Area, LabelList,
  RadialBarChart, RadialBar, PolarAngleAxis,
  ComposedChart, Scatter
} from 'recharts';
import { 
  AlertTriangle, CheckCircle, Clock, MapPin, 
  Building2, DollarSign, FileText,
  TrendingUp, ShieldAlert, ArrowUpRight,
  Zap,
  ListChecks, Bot,
  X,
  AlertCircle, ArrowRight, Map as MapIcon,
  Users, Briefcase, Camera, Image, ShieldCheck,
  BrainCircuit, PieChart as PieChartIcon,
  Edit3, Save, Plus, TrafficCone, Coins,
  LayoutDashboard as LayoutDashboardIcon,
  Info, Search, Lightbulb,
  PlayCircle, BookOpen, GraduationCap, Sigma,
  Sprout, Landmark, HardHat, FileSearch,
  UploadCloud, Pickaxe, Briefcase as BriefcaseIcon, Loader2, Flame,
  Hourglass, Sparkles, Heart, Gem, Medal, Sliders, Network, RefreshCw, Shuffle,
  CheckSquare, Stethoscope, Copy, Scale as ScaleIcon, ZoomIn, Wrench,
  Activity, BarChart3, Layers, Truck, Hammer, Ruler,
  Microscope,
  PackageCheck,
  Cpu as CpuIcon,
  FlaskConical,
  Siren,
  Gavel,
  FileBadge,
  FileClock,
  Banknote,
  MinusCircle,
  PlusCircle,
  FileWarning,
  Rocket,
  Calculator,
  Target,
  ArrowRightCircle,
  Globe,
  Newspaper,
  ExternalLink,
  GitMerge,
  History,
  TrendingDown,
  FileCheck,
  Filter,
  Umbrella,
  LandPlot,
  ArrowUp,
  ArrowDown,
  Maximize2,
  Minimize2,
  Diff,
  Percent,
  Sigma as SigmaIcon,
  MessageSquare,
  Settings,
  MoreHorizontal,
  Package,
  Circle,
  Radar,
  Crosshair,
  Printer,
  Megaphone,
  UserCheck,
  UserX,
  Users2
} from 'lucide-react';
import { ProjectData, ChatMessage, RiskItem, Bottleneck, ProjectMilestone, GrekoAction, PMBOKPrinciple, PMBOKDeepAnalysis, BottleneckDeepAnalysis, LegalDocument, ResourceAnalysis, FinancialProtectionDeepAnalysis, ResourceInventory, ContractorProfile, ProgressAudit, CorrectiveDeepAnalysis, ActivityDeepAnalysis, KnowledgeDeepAnalysis, ManagementDeepAnalysis, Personnel, Machinery, Equipment, GrekoCronosDeepAnalysis, FinancialDeepAnalysis, EvolutionLog, SPFDeepAnalysis, SocialEcosystem } from '../types';
import { askProjectQuestion, generateMitigationSuggestion, analyzePOTAlignment, analyzeGrekoCronos, analyzePMBOK7, analyzePMBOKPrincipleDeep, analyzeBottleneckDeep, generateAdministrativeDocument, analyzeResourceSufficiency, analyzeFinancialProtectionDeep, analyzeFinancialDeep, analyzeContractorRisk, analyzeCorrectiveDeep, analyzeCriticalPath, analyzeActivityDeep, analyzeKnowledgeDeep, analyzeManagementDeep, searchProjectInfo, updateProjectWithNewData, analyzeSPFDeep, generateDeepTechnicalReport, analyzeSocialEcosystem } from '../services/geminiService';

// ... existing code (Interfaces, Modal components, ExecutionCenter) ...
interface DashboardProps {
  data: ProjectData;
  onReset: () => void;
  onUpdate: (data: ProjectData) => void;
}

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#10b981', '#34d399', '#f59e0b', '#fbbf24', '#ef4444', '#f87171'];

// EDUCATIONAL CONTENT FOR METRICS (Keep existing, add SPF info if needed in separate object)
const METRIC_DEFINITIONS: Record<string, { title: string, definition: string, formula: string, impact: string, improvement: string, icon: React.ReactNode }> = {
    cpi: {
        title: "Índice de Desempeño de Costos (CPI)",
        definition: "Mide la eficiencia financiera del proyecto. Representa cuánto valor real (trabajo completado) obtenemos por cada peso gastado.",
        formula: "CPI = EV (Valor Ganado) / AC (Costo Actual)",
        impact: "CPI < 1.0: Sobrecostos (Ineficiente). CPI > 1.0: Ahorro (Eficiente). Un CPI de 0.8 significa que por cada $100 gastados, solo avanzamos $80 en obra.",
        improvement: "Controlar horas extras, renegociar precios de materiales o aumentar la productividad del personal.",
        icon: <Coins size={32}/>
    },
    spi: {
        title: "Índice de Desempeño del Cronograma (SPI)",
        definition: "Mide la eficiencia del tiempo. Indica si la obra avanza más rápido o más lento de lo planificado a la fecha de corte.",
        formula: "SPI = EV (Valor Ganado) / PV (Valor Planeado)",
        impact: "SPI < 1.0: Retraso. SPI > 1.0: Adelanto. Un SPI de 0.9 indica que la obra avanza al 90% de la velocidad esperada.",
        improvement: "Implementar 'Fast-Tracking' (tareas paralelas) o 'Crashing' (más recursos a tareas críticas) para recuperar tiempo.",
        icon: <Clock size={32}/>
    },
    bcRatio: {
        title: "Relación Beneficio-Costo (RBC)",
        definition: "Es un indicador financiero que compara directamente los beneficios brutos esperados de un proyecto con sus costos totales. Un valor superior a 1.0 indica que los beneficios superan los costos.",
        formula: "RBC = V.P. (Beneficios) / V.P. (Costos)",
        impact: "Determina la viabilidad social y económica. Si es < 1, el proyecto destruye valor y podría ser objeto de hallazgos fiscales por detrimento patrimonial.",
        improvement: "Optimización de diseños (Ingeniería de Valor) y compras estratégicas por volumen.",
        icon: <ScaleIcon size={32}/>
    },
    burnRate: {
        title: "Tasa de Quema (Burn Rate)",
        definition: "Mide la velocidad a la que el proyecto 'consume' su presupuesto disponible por unidad de tiempo (generalmente por día o mes).",
        formula: "Burn Rate = Presupuesto Ejecutado / Días Transcurridos",
        impact: "Una tasa muy baja indica retrasos en ejecución (sub-ejecución). Una tasa muy alta indica ineficiencia o sobrecostos inminentes.",
        improvement: "Alinear los flujos de caja con los hitos críticos. Si es baja, desbloquear frentes de obra. Si es alta, revisar rendimientos de recursos.",
        icon: <Flame size={32}/>
    },
    costVariance: {
        title: "Varianza de Costo (CV)",
        definition: "Es la diferencia financiera entre el valor del trabajo realmente realizado (Valor Ganado - EV) y lo que se ha gastado para lograrlo (Costo Actual - AC).",
        formula: "CV = EV (Earned Value) - AC (Actual Cost)",
        impact: "CV Positivo (+): El proyecto está por debajo del presupuesto (Ahorro). CV Negativo (-): El proyecto tiene sobrecostos. Un CV negativo constante requiere inyección de capital o reducción de alcance.",
        improvement: "Implementar controles de cambio estrictos, renegociar tarifas con proveedores o mejorar la productividad de la mano de obra.",
        icon: <MinusCircle size={32}/>
    },
    eac: {
        title: "Estimado a la Conclusión (EAC)",
        definition: "Proyección financiera que estima cuánto costará el proyecto al finalizar, basándose en el desempeño actual (CPI). Es vital para prever necesidades de adición presupuestal.",
        formula: "EAC = Presupuesto Total (BAC) / CPI Actual",
        impact: "Si EAC > Presupuesto, se requerirán recursos adicionales. Permite a la gerencia actuar meses antes de que se acabe el dinero.",
        improvement: "Mejorar el CPI en las fases restantes del proyecto para reducir el EAC proyectado.",
        icon: <TrendingUp size={32}/>
    },
    capex: {
        title: "Gastos de Capital (CAPEX)",
        definition: "Inversiones en bienes de capital (físicos) que crean beneficios a largo plazo. En obra pública: Maquinaria, Materiales, Terrenos y la Infraestructura misma.",
        formula: "Sumatoria (Materiales + Maquinaria + Equipos + Infraestructura)",
        impact: "Representa el 'Hard Cost' del proyecto. Un CAPEX alto vs OPEX bajo suele ser saludable en infraestructura.",
        improvement: "Optimización de diseños (Ingeniería de Valor) y compras estratégicas por volumen.",
        icon: <Hammer size={32}/>
    },
    opex: {
        title: "Gastos Operativos (OPEX)",
        definition: "Costos asociados al funcionamiento, administración y personal durante la ejecución del proyecto. Incluye nómina administrativa, alquileres, servicios y gastos generales.",
        formula: "Sumatoria (Personal + Administración + Servicios + Indirectos)",
        impact: "Un OPEX descontrolado (Overhead) drena el presupuesto de la obra física. Se busca minimizarlo sin afectar la calidad de supervisión.",
        improvement: "Reducir burocracia, optimizar tiempos de personal administrativo y logística.",
        icon: <BriefcaseIcon size={32}/>
    },
    healthScore: {
        title: "Índice de Salud Financiera",
        definition: "Score compuesto (0-100) calculado por la IA que integra CPI, SPI, Riesgos materializados y Flujo de Caja.",
        formula: "Algoritmo Ponderado (AI Weighted Score)",
        impact: "0-50: Crítico (Intervención Inmediata). 51-80: Alerta (Monitoreo). 81-100: Saludable.",
        improvement: "Gestión integral de riesgos y control de cambios riguroso.",
        icon: <Stethoscope size={32}/>
    }
};

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const BaseModal: React.FC<DetailModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-6xl' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} flex flex-col max-h-[90vh] relative animate-scale-up overflow-hidden`}>
        <div className="px-8 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-gray-200 flex justify-between items-center flex-none">
          <h3 className="text-xl font-black text-slate-800 leading-tight flex items-center gap-2">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
             <X size={20} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto bg-slate-50/50 custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

// Reusable Summary Card for Modals
const AnalysisSummaryCard: React.FC<{ title: string; content?: string; icon: React.ReactNode; colorClass: string }> = ({ title, content, icon, colorClass }) => {
  if (!content || content === 'Pendiente') return null;
  return (
    <div className={`p-5 rounded-xl border border-dashed mb-6 ${colorClass}`}>
      <h5 className="font-bold uppercase text-xs mb-2 flex items-center gap-2 opacity-80">{icon} {title}</h5>
      <p className="font-medium text-sm leading-relaxed">{content}</p>
    </div>
  );
};

// --- EXECUTION CENTER COMPONENT ---
interface ExecutionCenterProps {
  data: ProjectData;
  milestones: ProjectMilestone[];
  setMilestones: React.Dispatch<React.SetStateAction<ProjectMilestone[]>>;
  resourceInventory: ResourceInventory;
  setResourceInventory: React.Dispatch<React.SetStateAction<ResourceInventory>>;
  dynamicBottlenecks: Bottleneck[];
  handleBottleneckClick: (b: Bottleneck) => void;
  formatCurrency: (val: number) => string;
}

const ExecutionCenter: React.FC<ExecutionCenterProps> = ({ 
  data, milestones, setMilestones, resourceInventory, setResourceInventory, 
  dynamicBottlenecks, handleBottleneckClick, formatCurrency 
}) => {
  const [isCpmLoading, setIsCpmLoading] = useState(false);
  const [cpmSummary, setCpmSummary] = useState<string | null>(null);
  
  const [activeActivity, setActiveActivity] = useState<ProjectMilestone | null>(null);
  const [activityAnalysis, setActivityAnalysis] = useState<ActivityDeepAnalysis | null>(null);
  const [isActivityLoading, setIsActivityLoading] = useState(false);
  
  const [resourceAnalysisResult, setResourceAnalysisResult] = useState<ResourceAnalysis | null>(resourceInventory.deepAnalysis || null);
  const [isResourceAnalyzing, setIsResourceAnalyzing] = useState(false);

  useEffect(() => {
    setResourceAnalysisResult(resourceInventory.deepAnalysis || null);
  }, [resourceInventory.deepAnalysis]);

  const handleCpm = async () => {
      setIsCpmLoading(true);
      try {
          const res = await analyzeCriticalPath(milestones, { name: data.projectName, objective: data.generalObjective });
          setMilestones(res.updatedMilestones);
          setCpmSummary(res.analysisSummary);
      } catch(e) { console.error(e); } finally { setIsCpmLoading(false); }
  };

  const handleActivityClick = async (m: ProjectMilestone) => {
      setActiveActivity(m);
      if(m.deepAnalysis) { setActivityAnalysis(m.deepAnalysis); return; }
      
      setActivityAnalysis(null); setIsActivityLoading(true);
      try {
          const res = await analyzeActivityDeep(m, { 
              name: data.projectName, 
              location: `${data.location.municipality}, ${data.location.department}`,
              phase: data.projectPhase,
              type: data.projectType
          });
          setActivityAnalysis(res);
          setMilestones(prev => prev.map(p => p.code === m.code ? { ...p, deepAnalysis: res } : p));
      } catch(e) { console.error(e); } finally { setIsActivityLoading(false); }
  };

  const handleResourceAnalysis = async () => {
      setIsResourceAnalyzing(true);
      try {
          const res = await analyzeResourceSufficiency(data);
          setResourceAnalysisResult(res);
          setResourceInventory(prev => ({ ...prev, deepAnalysis: res }));
      } catch(e) { console.error(e); } finally { setIsResourceAnalyzing(false); }
  };

  return (
    <div className="space-y-8 animate-fade-in">
        {/* Activity Detail Modal */}
        <BaseModal isOpen={!!activeActivity} onClose={() => setActiveActivity(null)} title={`Ingeniería de Valor: ${activeActivity?.description}`}>
            {isActivityLoading ? <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-600"/></div> : activityAnalysis ? (
                <div className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                        <h5 className="font-bold text-green-800 text-sm mb-2">Estrategia de Optimización</h5>
                        <p className="text-sm text-green-900">{activityAnalysis.optimizationStrategy}</p>
                        <div className="mt-2 text-xs font-bold text-green-700 bg-white inline-block px-2 py-1 rounded border border-green-200">Ahorro Est.: {activityAnalysis.efficiencyGainEstimate}</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <h5 className="font-bold text-slate-800 text-sm mb-3">Tecnologías Sugeridas</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(activityAnalysis.suggestedTechnologies || []).map((t, i) => (
                                <div key={i} className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <div className="font-bold text-blue-900 text-xs">{t.name}</div>
                                    <div className="text-xs text-blue-700 mt-1">{t.benefit}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                         <h5 className="font-bold text-red-800 text-sm mb-2">Riesgos Específicos de Ejecución</h5>
                         <ul className="list-disc pl-4 text-xs text-red-900 space-y-1">{(activityAnalysis.specificExecutionRisks || []).map((r,i)=><li key={i}>{r}</li>)}</ul>
                    </div>
                </div>
            ) : <div className="text-center">Error al analizar.</div>}
        </BaseModal>

        {/* WBS SECTION */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2"><ListChecks size={20} className="text-blue-600"/> WBS 2.0 (Bill of Quantities)</h3>
                    <p className="text-sm text-slate-500">Desglose de actividades clasificadas por tipo de gasto (CAPEX/OPEX) y estrategia.</p>
                </div>
                <button onClick={handleCpm} disabled={isCpmLoading} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-slate-800 transition-all">
                    {isCpmLoading ? <Loader2 className="animate-spin" size={16}/> : <GitMerge size={16}/>}
                    {isCpmLoading ? 'Calculando...' : 'Calcular Ruta Crítica (CPM)'}
                </button>
            </div>

            {cpmSummary && (
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 mb-6 text-sm text-purple-900">
                    <strong className="block text-purple-700 mb-1 uppercase text-xs tracking-wider">Resumen de Ruta Crítica</strong>
                    {cpmSummary}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold text-left border-b border-gray-200">
                            <th className="p-3 pl-4 rounded-tl-lg">Actividad</th>
                            <th className="p-3">Clasificación</th>
                            <th className="p-3">Cantidades</th>
                            <th className="p-3 text-right">Costo Est.</th>
                            <th className="p-3 text-center">Progreso</th>
                            <th className="p-3 text-center rounded-tr-lg">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {milestones.map((m, i) => (
                            <tr key={i} className={`hover:bg-slate-50 transition-colors ${m.isCriticalPath ? 'bg-red-50/30' : ''}`}>
                                <td className="p-3 pl-4">
                                    <div className="font-bold text-slate-800 flex items-center gap-2">
                                        {m.isSPF && <Crosshair size={14} className="text-red-600 animate-pulse" title="Punto Único de Fallo (SPF)"/>}
                                        {m.isCriticalPath && <AlertCircle size={14} className="text-red-500" title="Ruta Crítica"/>}
                                        {m.description}
                                    </div>
                                    {m.code && <div className="text-xs text-slate-400 font-mono">{m.code}</div>}
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-1 flex-col">
                                        {m.financialType && (
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded w-fit ${m.financialType === 'CAPEX' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {m.financialType}
                                            </span>
                                        )}
                                        {m.strategicType && (
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded w-fit ${m.strategicType === 'Proactive' ? 'bg-teal-100 text-teal-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {m.strategicType === 'Proactive' ? 'Proactivo' : 'Reactivo'}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex flex-col text-xs text-slate-600">
                                       {m.unit && <span>{m.totalQuantity} {m.unit}</span>}
                                       {!m.unit && <span className="text-slate-400 italic">Global</span>}
                                    </div>
                                </td>
                                <td className="p-3 text-right font-mono text-slate-700">{formatCurrency(m.estimatedCost || 0)}</td>
                                <td className="p-3 text-center">
                                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${m.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${m.progress || 0}%`}}></div>
                                    </div>
                                    <div className="text-[10px] font-bold mt-1 text-slate-500">{m.progress || 0}%</div>
                                </td>
                                <td className="p-3 text-center">
                                    <button onClick={() => handleActivityClick(m)} className="p-1.5 hover:bg-blue-100 rounded text-blue-600 transition-colors" title="Ingeniería de Valor"><Sparkles size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* RESOURCES & BOTTLENECKS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* RESOURCES */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Hammer size={20} className="text-orange-600"/> Inventario de Recursos</h3>
                    <button onClick={handleResourceAnalysis} disabled={isResourceAnalyzing} className="text-xs bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg font-bold border border-orange-200 hover:bg-orange-100 transition">{isResourceAnalyzing ? '...' : 'Auditar Suficiencia'}</button>
                </div>

                {resourceAnalysisResult && (
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 mb-6 text-sm">
                        <div className="flex justify-between items-center mb-2">
                             <h5 className="font-bold text-orange-900">Dictamen de Suficiencia</h5>
                             <span className="bg-white px-2 py-0.5 rounded text-orange-800 text-xs font-bold border border-orange-100">Score: {resourceAnalysisResult.efficiencyScore}/100</span>
                        </div>
                        <p className="text-orange-800 mb-2 leading-relaxed">{resourceAnalysisResult.sufficiencyAssessment}</p>
                        <div className="space-y-1">
                             <div className="text-xs"><strong className="text-orange-900">Recomendaciones Personal:</strong> {resourceAnalysisResult.personnelRecommendations.join(', ')}</div>
                             <div className="text-xs"><strong className="text-orange-900">Recomendaciones Maquinaria:</strong> {resourceAnalysisResult.machineryRecommendations.join(', ')}</div>
                        </div>
                    </div>
                )}

                <div className="flex-1 space-y-6">
                    <div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Personal (Mano de Obra)</h5>
                        <div className="flex flex-wrap gap-2">
                            {(resourceInventory.personnel || []).length > 0 ? (resourceInventory.personnel || []).map((p, i) => (
                                <div key={i} className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex items-center gap-2">
                                    <Users size={14} className="text-slate-400"/>
                                    <div>
                                        <div className="text-xs font-bold text-slate-700">{p.role}</div>
                                        <div className="text-[10px] text-slate-500">Cant: {p.quantity}</div>
                                    </div>
                                </div>
                            )) : <div className="text-sm text-slate-400 italic">No reportado</div>}
                        </div>
                    </div>
                    <div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Maquinaria Amarilla</h5>
                        <div className="flex flex-wrap gap-2">
                            {(resourceInventory.machinery || []).length > 0 ? (resourceInventory.machinery || []).map((m, i) => (
                                <div key={i} className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex items-center gap-2">
                                    <Truck size={14} className="text-slate-400"/>
                                    <div>
                                        <div className="text-xs font-bold text-slate-700">{m.type}</div>
                                        <div className="text-[10px] text-slate-500">Cant: {m.quantity}</div>
                                    </div>
                                </div>
                            )) : <div className="text-sm text-slate-400 italic">No reportado</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTLENECKS */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-6"><TrafficCone size={20} className="text-red-600"/> Cuellos de Botella Activos</h3>
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar">
                    {dynamicBottlenecks.length > 0 ? dynamicBottlenecks.map((b, i) => (
                        <div key={i} onClick={() => handleBottleneckClick(b)} className={`p-4 rounded-xl border cursor-pointer transition-colors group ${b.isRelatedToSPF ? 'bg-red-100 border-red-300 ring-1 ring-red-400' : 'border-red-100 bg-red-50/50 hover:bg-red-50'}`}>
                            <div className="flex justify-between items-start mb-1">
                                <h5 className="font-bold text-red-900 text-sm group-hover:underline flex items-center gap-2">
                                    {b.isRelatedToSPF && <Crosshair size={14} className="text-red-700"/>}
                                    {b.processName}
                                </h5>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${b.impactLevel === 'Crítico' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>{b.impactLevel}</span>
                            </div>
                            <p className="text-xs text-red-800/70 mb-2 line-clamp-2">{b.description}</p>
                            <div className="flex justify-between items-center text-[10px] font-medium text-red-700">
                                <span>Resp: {b.responsibleEntity}</span>
                                <span className="flex items-center gap-1"><Clock size={10}/> {b.daysDelayed} días retraso</span>
                            </div>
                        </div>
                    )) : <div className="text-center py-10 text-slate-400 italic">No se detectaron bloqueos activos.</div>}
                </div>
            </div>
        </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'impact' | 'execution' | 'financial' | 'risks' | 'pmbok' | 'photos' | 'assistant'>('overview');
  
  const [milestones, setMilestones] = useState<ProjectMilestone[]>(data.milestones || []);
  
  // Bottlenecks Caching State
  const [activeBottleneck, setActiveBottleneck] = useState<Bottleneck | null>(null);
  const [bottleneckAnalysis, setBottleneckAnalysis] = useState<BottleneckDeepAnalysis | null>(null);
  const [bottleneckCache, setBottleneckCache] = useState<Record<string, BottleneckDeepAnalysis>>({});
  const [isAnalyzingBottleneck, setIsAnalyzingBottleneck] = useState(false);
  const [bottleneckTab, setBottleneckTab] = useState<'analysis' | 'legal'>('analysis');
  const [generatedDocument, setGeneratedDocument] = useState<LegalDocument | null>(null);
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);

  // SPF Deep Analysis State
  const [spfAnalysisResult, setSpfAnalysisResult] = useState<SPFDeepAnalysis | null>(null);
  const [isAnalyzingSPF, setIsAnalyzingSPF] = useState(false);
  const [activeSPFItem, setActiveSPFItem] = useState<string | null>(null);

  const [activeUngrdModal, setActiveUngrdModal] = useState<'knowledge' |'corrective' | 'prospective' | 'financial' | 'management' | null>(null);
  
  // Prospective State
  const [isAnalyzingPOT, setIsAnalyzingPOT] = useState(false);
  const [potAnalysisError, setPotAnalysisError] = useState<string | null>(null);
  const [potAnalysisResult, setPotAnalysisResult] = useState(data.ungrdAnalysis?.reduction?.prospective?.potAnalysis);
  
  const [isAnalyzingCorrective, setIsAnalyzingCorrective] = useState(false);
  const [correctiveDeepAnalysis, setCorrectiveDeepAnalysis] = useState<CorrectiveDeepAnalysis | null>(data.ungrdAnalysis?.reduction?.corrective?.deepForensicAnalysis || null);
  
  // Financial Protection State
  const [isAnalyzingFinancial, setIsAnalyzingFinancial] = useState(false);
  const [financialProtectionAnalysis, setFinancialProtectionAnalysis] = useState<FinancialProtectionDeepAnalysis | null>(data.ungrdAnalysis?.reduction?.financialProtection?.deepAnalysis || null);
  const [financialProtectionError, setFinancialProtectionError] = useState<string | null>(null);
  
  const [isAnalyzingKnowledge, setIsAnalyzingKnowledge] = useState(false);
  const [knowledgeDeepAnalysis, setKnowledgeDeepAnalysis] = useState<KnowledgeDeepAnalysis | null>(data.ungrdAnalysis?.knowledge?.deepAnalysis || null);
  
  // Management State
  const [isAnalyzingManagement, setIsAnalyzingManagement] = useState(false);
  const [managementDeepAnalysis, setManagementDeepAnalysis] = useState<ManagementDeepAnalysis | null>(data.ungrdAnalysis?.management?.deepAnalysis || null);
  
  const [knowledgeDashboardTab, setKnowledgeDashboardTab] = useState<'threat' | 'gaps' | 'modeling' | 'monitoring'>('threat');

  const [pmbokData, setPmbokData] = useState(data.pmbokAnalysis);
  const [isAnalyzingPMBOK, setIsAnalyzingPMBOK] = useState(false);
  const [activePMBOKPrinciple, setActivePMBOKPrinciple] = useState<PMBOKPrinciple | null>(null);
  const [pmbokDeepAnalysisResult, setPmbokDeepAnalysisResult] = useState<PMBOKDeepAnalysis | null>(null);
  const [isPMBOKDeepAnalyzing, setIsPMBOKDeepAnalyzing] = useState(false);
  const [pmbokAnalysisError, setPmbokAnalysisError] = useState<string | null>(null);

  const [activeRiskForMitigation, setActiveRiskForMitigation] = useState<RiskItem | null>(null);
  const [mitigationResult, setMitigationResult] = useState<string | null>(null);
  const [isMitigationLoading, setIsMitigationLoading] = useState(false);

  // Risk Matrix Filter State
  const [riskFilter, setRiskFilter] = useState<{prob: string, imp: string} | null>(null);

  const [resourceInventory, setResourceInventory] = useState<ResourceInventory>(data.resourceInventory || { personnel: [], machinery: [], equipment: [] });
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const [financialAnalysisResult, setFinancialAnalysisResult] = useState<FinancialDeepAnalysis | null>(null);
  const [isAnalyzingFinance, setIsAnalyzingFinance] = useState(false);
  const [financialAnalysisError, setFinancialAnalysisError] = useState<string | null>(null);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ summary: string; sources: { title: string; uri: string }[] } | null>(null);

  const [activeMetricModal, setActiveMetricModal] = useState<string | null>(null);
  
  const [isMontecarloOpen, setIsMontecarloOpen] = useState(false);
  const [montecarloData, setMontecarloData] = useState<any[]>([]);
  const [montecarloHistogram, setMontecarloHistogram] = useState<any[]>([]);
  const [montecarloStats, setMontecarloStats] = useState<{p10: number, p50: number, p90: number}>({p10: 0, p50: 0, p90: 0});
  
  const [mcInflation, setMcInflation] = useState(6.0);
  const [mcImportExposure, setMcImportExposure] = useState(20);
  const [mcTrmForward, setMcTrmForward] = useState(4150);
  const [mcImprevistos, setMcImprevistos] = useState(10);

  const [contractorProfile, setContractorProfile] = useState<ContractorProfile | null>(data.contractorProfile || null);
  const [isAnalyzingContractor, setIsAnalyzingContractor] = useState(false);

  // Social Ecosystem State (Loaded from initial now)
  const [socialEcosystem, setSocialEcosystem] = useState<SocialEcosystem | null>(data.socialEcosystem || null);
  const [isAnalyzingSocial, setIsAnalyzingSocial] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([{ id: '1', role: 'ai', text: 'Hola, soy El Greko AI. ¿En qué puedo ayudarte?', timestamp: new Date() }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionError, setEvolutionError] = useState<string | null>(null);
  const [evolutionTab, setEvolutionTab] = useState<'pdf' | 'text'>('pdf');
  const [evolutionTextInput, setEvolutionTextInput] = useState('');
  
  const [evolutionResult, setEvolutionResult] = useState<EvolutionLog | null>(null);
  const [expandedLogIndex, setExpandedLogIndex] = useState<number | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => { if(milestones.length === 0 && data.milestones) { setMilestones(data.milestones); } }, [data.milestones]);
  useEffect(() => { if(!resourceInventory.personnel?.length && !resourceInventory.machinery?.length && data.resourceInventory) { setResourceInventory(data.resourceInventory) } }, [data.resourceInventory]);
  useEffect(() => { scrollToBottom(); }, [chatHistory, activeTab]);
  const scrollToBottom = () => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

  const calculatedMetrics = useMemo(() => {
    let totalPlannedBudget = 0; let earnedValue = 0; let plannedValue = 0; const today = new Date();
    const safeMilestones = Array.isArray(milestones) ? milestones : [];
    
    let capex = 0;
    let opex = 0;
    let capexAI = 0;
    let opexAI = 0;
    let aiClassifiedCount = 0;

    safeMilestones.forEach(m => {
        const cost = m.estimatedCost || 0; const progress = (m.progress || 0) / 100;
        totalPlannedBudget += cost; earnedValue += cost * progress;
        if (m.startDate && m.endDate) {
            const start = new Date(m.startDate); const end = new Date(m.endDate);
            if (today >= end) { plannedValue += cost; } else if (today > start) {
                const totalDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) || 1;
                const daysPassed = (today.getTime() - start.getTime()) / (1000 * 3600 * 24);
                plannedValue += cost * Math.max(0, Math.min(1, daysPassed / totalDays));
            }
        }
        
        if (m.financialType) {
            if (m.financialType === 'CAPEX') capexAI += cost;
            if (m.financialType === 'OPEX') opexAI += cost;
            aiClassifiedCount++;
        }
    });

    const effectiveTotalBudget = totalPlannedBudget > 0 ? totalPlannedBudget : data.totalBudget;
    const actualCost = data.spentBudget > 0 ? data.spentBudget : earnedValue; 
    const cpi = actualCost > 0 ? earnedValue / actualCost : 1;
    const spi = plannedValue > 0 ? earnedValue / plannedValue : 1;
    
    if (aiClassifiedCount > 0) {
        const sumAI = capexAI + opexAI;
        const factor = sumAI > 0 ? effectiveTotalBudget / sumAI : 1;
        capex = capexAI * factor;
        opex = opexAI * factor;
    } else {
        if (resourceInventory) {
            if (resourceInventory.machinery) capex += resourceInventory.machinery.reduce((acc, m) => acc + (m.totalCost || 0), 0);
            if (resourceInventory.equipment) capex += resourceInventory.equipment.reduce((acc, e) => acc + (e.totalCost || 0), 0);
            if (resourceInventory.personnel) opex += resourceInventory.personnel.reduce((acc, p) => acc + (p.totalCost || 0), 0);
        }
        
        if (capex === 0 && opex === 0 && data.budgetBreakdown.length > 0) {
            data.budgetBreakdown.forEach(item => {
                const cat = item.category.toLowerCase();
                if (cat.includes('admin') || cat.includes('personal') || cat.includes('interventor') || cat.includes('diseño') || cat.includes('gestión')) {
                    opex += item.amount;
                } else {
                    capex += item.amount;
                }
            });
        }

        if (capex === 0 && opex === 0) {
            capex = effectiveTotalBudget * 0.8;
            opex = effectiveTotalBudget * 0.2;
        }
    }

    return { 
        totalPlannedBudget: effectiveTotalBudget, 
        earnedValue, 
        plannedValue, 
        actualCost, 
        cpi, 
        spi, 
        eac: cpi > 0 ? effectiveTotalBudget / cpi : effectiveTotalBudget, 
        financialProgress: (data.spentBudget / effectiveTotalBudget) * 100,
        capex,
        opex,
        burnRate: actualCost / (Math.max(1, (today.getTime() - new Date(data.startDate).getTime()) / (1000 * 3600 * 24 * 30)))
    };
  }, [milestones, data.totalBudget, data.spentBudget, resourceInventory, data.budgetBreakdown]);

  const identifiedSPFs = useMemo(() => {
      const explicit = milestones.filter(m => m.isSPF);
      const heuristic = milestones.filter(m => 
          !m.isSPF && 
          m.isCriticalPath && 
          ((m.delayDays || 0) > 30 || (m.endDate && new Date(m.endDate) < new Date() && (m.progress || 0) < 50))
      );
      return [...explicit, ...heuristic].map(m => ({
          name: m.description,
          source: 'Cronograma',
          reason: m.isSPF ? 'Identificado por IA como crítico sistémico.' : 'Retraso crítico > 30 días sin redundancia aparente.',
          originalItem: m
      }));
  }, [milestones]);

  const riskStats = useMemo(() => {
      const stats = { critical: 0, high: 0, medium: 0, low: 0, veryLow: 0 };
      const safeRisks = data.risks || [];
      safeRisks.forEach(r => {
          const impact = (r.impact || 'Low');
          const probability = (r.probability || 'Low');
          const row = impact === 'High' ? 0 : impact === 'Medium' ? 1 : 2;
          const col = probability === 'Low' ? 0 : probability === 'Medium' ? 1 : 2;
          
          if (row === 0 && col === 2) stats.critical++;
          else if ((row === 0 && col === 1) || (row === 1 && col === 2)) stats.high++;
          else if ((row === 0 && col === 0) || (row === 1 && col === 1) || (row === 2 && col === 2)) stats.medium++;
          else if ((row === 1 && col === 0) || (row === 2 && col === 1)) stats.low++;
          else stats.veryLow++;
      });
      return stats;
  }, [data.risks]);

  const runMontecarlo = () => {
      setIsMontecarloOpen(true);
      const SIMULATION_ITERATIONS = 10000;
      const monthsToProject = 12;
      const monthlyBurn = calculatedMetrics.actualCost / (Math.max(1, (new Date().getTime() - new Date(data.startDate).getTime()) / (1000 * 3600 * 24 * 30)));
      const baseMonthlyBurn = monthlyBurn > 0 ? monthlyBurn : data.totalBudget / 12;
      const baseRiskVolatility = (riskStats.critical * 0.08) + (riskStats.high * 0.04) + (riskStats.medium * 0.02) + 0.05; 
      const inflationMonthly = mcInflation / 100 / 12;
      const trmImpact = (Math.abs(mcTrmForward - 4000) / 4000) * (mcImportExposure / 100); 
      const imprevistosFactor = mcImprevistos / 100;
      const finalCosts: number[] = [];

      const randn_bm = () => {
          let u = 0, v = 0;
          while(u === 0) u = Math.random(); 
          while(v === 0) v = Math.random();
          return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      }

      for (let i = 0; i < SIMULATION_ITERATIONS; i++) {
          let currentTotalCost = calculatedMetrics.actualCost;
          for (let m = 1; m <= monthsToProject; m++) {
              const randomVol = randn_bm() * baseRiskVolatility; 
              let monthlyCost = baseMonthlyBurn;
              monthlyCost *= (1 + inflationMonthly * m);
              monthlyCost *= (1 + randomVol);
              monthlyCost *= (1 + trmImpact * (Math.random() > 0.8 ? 1 : 0));
              monthlyCost *= (1 + imprevistosFactor * (Math.random() > 0.9 ? 1 : 0));
              currentTotalCost += monthlyCost;
          }
          finalCosts.push(currentTotalCost);
      }

      finalCosts.sort((a, b) => a - b);
      const p10 = finalCosts[Math.floor(SIMULATION_ITERATIONS * 0.1)];
      const p50 = finalCosts[Math.floor(SIMULATION_ITERATIONS * 0.5)];
      const p90 = finalCosts[Math.floor(SIMULATION_ITERATIONS * 0.9)];
      setMontecarloStats({ p10, p50, p90 });

      const bins = 20;
      const min = finalCosts[0];
      const max = finalCosts[finalCosts.length - 1];
      const range = max - min;
      const binSize = range / bins;
      const histogramData = [];

      for (let b = 0; b < bins; b++) {
          const binStart = min + (b * binSize);
          const binEnd = binStart + binSize;
          const count = finalCosts.filter(c => c >= binStart && c < binEnd).length;
          histogramData.push({
              range: `${(binStart/1000000).toFixed(0)}M`,
              count: count,
              costValue: binStart 
          });
      }
      setMontecarloHistogram(histogramData);
  };

  useEffect(() => { if (isMontecarloOpen) { runMontecarlo(); } }, [mcInflation, mcImportExposure, mcTrmForward, mcImprevistos]);

  const getRisksByLevel = (prob: string, imp: string) => { return data.risks ? data.risks.filter(r => r.probability === prob && r.impact === imp) : []; };
  const filteredRisks = useMemo(() => { if (!riskFilter) return data.risks || []; return (data.risks || []).filter(r => r.probability === riskFilter.prob && r.impact === riskFilter.imp); }, [data.risks, riskFilter]);
  const getProbColor = (p: string) => p === 'High' ? 'bg-rose-100 text-rose-700 border-rose-200' : p === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
  const getImpColor = (i: string) => i === 'High' ? 'bg-rose-100 text-rose-700 border-rose-200' : i === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200';

  const sCurveData = useMemo(() => {
      const dates = new Set<string>();
      (milestones || []).forEach(m => { if (m.startDate) dates.add(m.startDate); if (m.endDate) dates.add(m.endDate); });
      if (dates.size === 0) return [];
      const sortedDates = Array.from(dates).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
      const todayPV = calculatedMetrics.plannedValue;
      return sortedDates.map(dateStr => {
          const currentDate = new Date(dateStr); let pv = 0; let ev = 0;
          (milestones || []).forEach(m => {
              const cost = m.estimatedCost || 0;
              if (m.startDate && m.endDate) {
                  const start = new Date(m.startDate); const end = new Date(m.endDate);
                  if (currentDate >= end) { pv += cost; } else if (currentDate > start) {
                      const totalDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24) || 1;
                      const daysPassed = (currentDate.getTime() - start.getTime()) / (1000 * 3600 * 24);
                      pv += cost * Math.min(1, daysPassed/totalDays);
                  }
              }
              ev += cost * ((m.progress || 0) / 100);
          });
          const ac = todayPV > 0 ? (pv / todayPV) * data.spentBudget : 0;
          return { date: dateStr, PV: pv, EV: ev, AC: ac };
      });
  }, [milestones, calculatedMetrics.plannedValue, data.spentBudget]);

  const dynamicBottlenecks = useMemo(() => {
    const base = data.bottlenecks || [];
    const generated: Bottleneck[] = [];
    (milestones || []).forEach(m => {
        const isOverdue = m.endDate ? new Date(m.endDate) < new Date() && (m.progress || 0) < 100 : false;
        if (m.status === 'delayed' || isOverdue) {
            const isCritical = m.isCriticalPath;
            const isSPF = identifiedSPFs.some(spf => spf.name === m.description);
            generated.push({
                processName: `${isCritical ? 'BLOQUEO CRÍTICO' : 'Retraso Operativo'}: ${m.description}`, responsibleEntity: data.contractor || "Ejecutor", status: 'Bloqueado',
                daysDelayed: m.endDate ? Math.max(0, Math.floor((new Date().getTime() - new Date(m.endDate).getTime()) / (1000 * 3600 * 24))) : 0,
                description: `Actividad ${isCritical ? 'de RUTA CRÍTICA ' : ''}con retraso operativo.`, impactLevel: isCritical ? 'Crítico' : 'Moderado', evidence: "Retraso cronograma.",
                isRelatedToSPF: isSPF
            });
        }
    });
    const all = [...base, ...generated];
    const unique = all.filter((v,i,a)=>a.findIndex(v2=>(v2.processName===v.processName))===i);
    return unique.sort((a, b) => (b.impactLevel === 'Crítico' ? 1 : -1) - (a.impactLevel === 'Crítico' ? -1 : 1));
  }, [data.bottlenecks, milestones, data.contractor, identifiedSPFs]);

  const handlePOTUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; setIsAnalyzingPOT(true); setPotAnalysisError(null); setPotAnalysisResult(undefined); const reader = new FileReader(); reader.onload = async (event) => { try { const base64 = (event.target?.result as string)?.split(',')[1]; if (base64) { const result = await analyzePOTAlignment(data, base64); setPotAnalysisResult(result); } } catch (error: any) { setPotAnalysisError(error.message || "Error desconocido al analizar POT."); } finally { setIsAnalyzingPOT(false); } }; reader.readAsDataURL(file); } };
  const handleKnowledgeAnalysis = async () => { setIsAnalyzingKnowledge(true); setKnowledgeDeepAnalysis(null); try { const result = await analyzeKnowledgeDeep(data); setKnowledgeDeepAnalysis(result); } catch (e) { console.error(e); } finally { setIsAnalyzingKnowledge(false); } };
  const handleCorrectiveAnalysis = async () => { setIsAnalyzingCorrective(true); setCorrectiveDeepAnalysis(null); try { const result = await analyzeCorrectiveDeep(data); setCorrectiveDeepAnalysis(result); } catch (e) { console.error(e); } finally { setIsAnalyzingCorrective(false); } };
  const handleManagementAnalysis = async () => { setIsAnalyzingManagement(true); setManagementDeepAnalysis(null); try { const result = await analyzeManagementDeep(data); setManagementDeepAnalysis(result); } catch (e) { console.error(e); } finally { setIsAnalyzingManagement(false); } };
  const handleRunPMBOKAnalysis = async () => { setIsAnalyzingPMBOK(true); try { const currentData = { ...data, milestones: milestones }; const analysis = await analyzePMBOK7(currentData); setPmbokData(analysis); } catch (err) { console.error(err); } finally { setIsAnalyzingPMBOK(false); } };
  const handleAnalyzeFinancialProtection = async () => { setIsAnalyzingFinancial(true); setFinancialProtectionAnalysis(null); setFinancialProtectionError(null); try { const result = await analyzeFinancialProtectionDeep(data); setFinancialProtectionAnalysis(result); } catch (e: any) { console.error(e); setFinancialProtectionError(e.message || "Error al generar la estrategia financiera."); } finally { setIsAnalyzingFinancial(false); } };
  const handlePMBOKClick = async (principle: PMBOKPrinciple) => { setActivePMBOKPrinciple(principle); setPmbokAnalysisError(null); if (principle.deepAnalysis) { setPmbokDeepAnalysisResult(principle.deepAnalysis); return; } setPmbokDeepAnalysisResult(null); setIsPMBOKDeepAnalyzing(true); try { const deepAnalysis = await analyzePMBOKPrincipleDeep(data, principle.name); setPmbokDeepAnalysisResult(deepAnalysis); setPmbokData(prev => { if (!prev) return prev; return { ...prev, principles: prev.principles.map(p => p.name === principle.name ? { ...p, deepAnalysis } : p) }; }); } catch (err) { setPmbokAnalysisError("El modelo AI no pudo generar el análisis."); } finally { setIsPMBOKDeepAnalyzing(false); } };
  const handleBottleneckClick = async (bottleneck: Bottleneck) => { setActiveBottleneck(bottleneck); setGeneratedDocument(null); setBottleneckTab('analysis'); if (bottleneck.deepAnalysis) { setBottleneckAnalysis(bottleneck.deepAnalysis); return; } const key = bottleneck.processName; if (bottleneckCache[key]) { setBottleneckAnalysis(bottleneckCache[key]); return; } setBottleneckAnalysis(null); setIsAnalyzingBottleneck(true); try { const deepAnalysis = await analyzeBottleneckDeep(bottleneck, data); setBottleneckAnalysis(deepAnalysis); setBottleneckCache(prev => ({...prev, [key]: deepAnalysis})); } catch (err) { console.error(err); } finally { setIsAnalyzingBottleneck(false); } };
  const handleSPFClick = async (itemDescription: string) => { setActiveSPFItem(itemDescription); setIsAnalyzingSPF(true); setSpfAnalysisResult(null); try { const milestone = milestones.find(m => m.description === itemDescription); if (milestone?.spfAnalysis) { setSpfAnalysisResult(milestone.spfAnalysis); } else { const result = await analyzeSPFDeep(itemDescription, data); setSpfAnalysisResult(result); setMilestones(prev => prev.map(m => m.description === itemDescription ? { ...m, spfAnalysis: result } : m)); } } catch(e) { console.error(e); } finally { setIsAnalyzingSPF(false); } };
  const handleGenerateDocument = async (type: 'petition' | 'memo' | 'meeting') => { if(!activeBottleneck) return; setIsGeneratingDoc(true); setGeneratedDocument(null); try { const doc = await generateAdministrativeDocument(activeBottleneck, type, data); setGeneratedDocument(doc); } catch(e) { console.error(e); } finally { setIsGeneratingDoc(false); } };
  const handleAnalyzeRiskMitigation = async (risk: RiskItem) => { setActiveRiskForMitigation(risk); setIsMitigationLoading(true); setMitigationResult(null); try { const suggestion = await generateMitigationSuggestion(risk, data); setMitigationResult(suggestion); } catch (err) { setMitigationResult("Error al generar mitigación."); } finally { setIsMitigationLoading(false); } };
  const handleAnalyzeContractor = async () => { setIsAnalyzingContractor(true); try { const result = await analyzeContractorRisk(data); setContractorProfile(prev => ({ ...prev, ...result, summary: prev?.summary || result.summary || prev?.summary })); } catch (e) { console.error(e); } finally { setIsAnalyzingContractor(false); } };
  const handleAnalyzeSocial = async () => { setIsAnalyzingSocial(true); try { const result = await analyzeSocialEcosystem(data); setSocialEcosystem(result); } catch (e) { console.error(e); } finally { setIsAnalyzingSocial(false); } };
  const handleSendMessage = async (e: React.FormEvent) => { e.preventDefault(); if (!chatInput.trim()) return; const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput, timestamp: new Date() }; setChatHistory(prev => [...prev, userMsg]); setChatInput(''); setIsChatLoading(true); try { const responseText = await askProjectQuestion(userMsg.text, data); setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: responseText, timestamp: new Date() }]); } catch (err) { console.error(err); } finally { setIsChatLoading(false); } };
  const getPMBOKIcon = (englishName: string) => { switch (englishName) { case 'Stewardship': return <Heart size={20}/>; case 'Team': return <Users size={20}/>; case 'Stakeholders': return <Briefcase size={20}/>; case 'Value': return <Gem size={20}/>; case 'Systems Thinking': return <BrainCircuit size={20}/>; case 'Leadership': return <Medal size={20}/>; case 'Tailoring': return <Sliders size={20}/>; case 'Quality': return <CheckCircle size={20}/>; case 'Complexity': return <Network size={20}/>; case 'Risk': return <ShieldAlert size={20}/>; case 'Adaptability': return <RefreshCw size={20}/>; case 'Change': return <Shuffle size={20}/>; default: return <BookOpen size={20}/>; } };
  const mapEmbed = useMemo(() => { const lat = data.location?.latitude || 0; const lng = data.location?.longitude || 0; const hasCoordinates = lat !== 0 && lng !== 0; const bbox = hasCoordinates ? `${lng - 0.005},${lat - 0.005},${lng + 0.005},${lat + 0.005}` : `-79.0,0.0,-67.0,12.0`; const marker = hasCoordinates ? `&marker=${lat},${lng}` : ''; return <iframe width="100%" height="100%" frameBorder="0" scrolling="no" src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${marker}`} style={{border: 0}}></iframe>; }, [data.location]);

  const navItems = [ { id: 'overview', label: 'Tablero Principal', icon: LayoutDashboardIcon }, { id: 'impact', label: 'Actores & Impacto', icon: Users }, { id: 'execution', label: 'Ejecución (WBS)', icon: Wrench }, { id: 'financial', label: 'Finanzas', icon: DollarSign }, { id: 'risks', label: 'Riesgos & SPF', icon: ShieldAlert }, { id: 'pmbok', label: 'PMBOK 7', icon: BookOpen }, { id: 'photos', label: 'Evidencia', icon: Camera }, { id: 'assistant', label: 'Greko IA', icon: Bot } ];

  const handleRunFinancialDeepAnalysis = async () => { setIsAnalyzingFinance(true); setFinancialAnalysisResult(null); setFinancialAnalysisError(null); setIsFinancialModalOpen(true); try { const result = await analyzeFinancialDeep(data); setFinancialAnalysisResult(result); } catch (err: any) { console.error(err); setFinancialAnalysisError(err.message || "Error desconocido en análisis financiero."); } finally { setIsAnalyzingFinance(false); } };
  const handleSearchContext = async () => { setIsSearchModalOpen(true); if (searchResult) return; setIsSearching(true); try { const result = await searchProjectInfo(data); setSearchResult(result); } catch (e) { console.error(e); } finally { setIsSearching(false); } };
  const processEvolution = async (input: { type: 'pdf' | 'text', content: string }) => { setIsEvolving(true); setEvolutionError(null); try { const updatedProject = await updateProjectWithNewData(data, input); onUpdate(updatedProject); const newLog = updatedProject.evolutionHistory?.[0]; if (newLog) { setEvolutionResult(newLog); } else { setIsEvolutionModalOpen(false); } setFinancialAnalysisResult(null); setMilestones(updatedProject.milestones); setResourceInventory(updatedProject.resourceInventory); if (updatedProject.contractorProfile) { setContractorProfile(prev => ({...prev, ...updatedProject.contractorProfile})); } } catch (error: any) { setEvolutionError(error.message || "Error al evolucionar el proyecto."); } finally { setIsEvolving(false); setEvolutionTextInput(''); } };
  const handleEvolutionPdf = async (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { const file = e.target.files[0]; const reader = new FileReader(); reader.onload = async (event) => { const base64 = (event.target?.result as string)?.split(',')[1]; if (base64) { await processEvolution({ type: 'pdf', content: base64 }); } }; reader.readAsDataURL(file); } };
  const handleEvolutionTextSubmit = async () => { if (!evolutionTextInput.trim()) return; await processEvolution({ type: 'text', content: evolutionTextInput }); };
  const closeEvolutionModal = () => { setIsEvolutionModalOpen(false); setEvolutionResult(null); setEvolutionTab('pdf'); };
  
  // UPDATED REPORT HANDLER
  const handleGenerateReport = async () => {
      setIsReportModalOpen(true);
      if (reportContent) return; // Cached
      setIsGeneratingReport(true);
      try {
          // Pass the comprehensive context
          const report = await generateDeepTechnicalReport(data, {
              metrics: calculatedMetrics,
              spfs: identifiedSPFs,
              riskStats: riskStats,
              bottlenecks: dynamicBottlenecks,
              pmbok: pmbokData
          });
          setReportContent(report);
      } catch (e) {
          console.error(e);
          setReportContent("<h2>Error generando reporte forense. Intente nuevamente.</h2>");
      } finally {
          setIsGeneratingReport(false);
      }
  };

  const FinancialSmartCard = ({ title, value, subtext, type, data, color, metricKey }: { title: string, value: string, subtext: string, type: 'radial' | 'gauge' | 'bar' | 'icon', data?: any, color: string, metricKey: string }) => { return ( <div onClick={() => setActiveMetricModal(metricKey)} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 group relative overflow-hidden cursor-pointer hover:scale-[1.02]" > <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"> {type === 'gauge' && <Activity size={64} color={color}/>} {type === 'radial' && <PieChartIcon size={64} color={color}/>} {type === 'bar' && <BarChart3 size={64} color={color}/>} {type === 'icon' && <SigmaIcon size={64} color={color}/>} </div> <div className="flex justify-between items-start mb-4 relative z-10"> <div> <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h5> <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div> <p className="text-xs font-medium text-slate-500 mt-1">{subtext}</p> </div> </div> <div className="h-16 w-full relative z-10"> <ResponsiveContainer width="100%" height="100%"> {type === 'radial' ? ( <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={10} data={[{ name: 'progress', value: data, fill: color }]}> <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} /> <RadialBar background clockWise dataKey="value" cornerRadius={10} /> </RadialBarChart> ) : type === 'gauge' ? ( <PieChart> <Pie data={[{ value: data }, { value: Math.max(0, 2 - data) }]} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={35} outerRadius={50} paddingAngle={0} dataKey="value"> <Cell fill={data >= 1 ? '#10b981' : '#ef4444'} /> <Cell fill="#f1f5f9" /> </Pie> </PieChart> ) : type === 'bar' ? ( <BarChart data={data}> <Bar dataKey="value" fill={color} radius={[2, 2, 2, 2]} /> <ReferenceLine y={0} stroke="#cbd5e1" /> </BarChart> ) : ( <div className="h-full flex items-end pb-2"> <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"> <div className="h-full rounded-full" style={{width: `${Math.min(100, data)}%`, backgroundColor: color}}></div> </div> </div> )} </ResponsiveContainer> </div> <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1"> Ver Detalle <ArrowRight size={10}/> </div> </div> ); };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      
      {/* HORIZONTAL NAVIGATION */}
      <div className="bg-white border-b border-gray-200 shadow-sm z-20 sticky top-0 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-1 overflow-x-auto custom-scrollbar no-scrollbar py-2">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                        activeTab === item.id 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105' 
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                    <item.icon size={16} className={activeTab === item.id ? 'text-blue-200' : 'text-slate-400'}/>
                    {item.label}
                </button>
            ))}
        </div>
        <button 
            onClick={handleGenerateReport} 
            className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition shadow-lg"
        >
            <FileText size={16}/> Generar Reporte Técnico
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
         <div className="container mx-auto max-w-[95%] space-y-8 pb-12">
            
            {/* REPORT MODAL - UPDATED STYLE */}
            <BaseModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} title="Informe Técnico Forense (Vista Previa)" maxWidth="max-w-4xl">
                 {isGeneratingReport ? (
                     <div className="text-center py-20 flex flex-col items-center">
                         <Loader2 size={48} className="text-blue-600 animate-spin mb-4"/>
                         <p className="text-slate-600 font-medium text-lg">El Greko AI está redactando el informe holístico...</p>
                         <div className="flex gap-4 mt-4 text-xs text-slate-400">
                             <span className="flex items-center gap-1"><CpuIcon size={12}/> Calculando KPI Econométricos</span>
                             <span className="flex items-center gap-1"><Crosshair size={12}/> Analizando SPF</span>
                             <span className="flex items-center gap-1"><BookOpen size={12}/> Revisando PMBOK</span>
                         </div>
                     </div>
                 ) : (
                     <div className="space-y-6">
                         <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-200 font-serif text-slate-900 leading-relaxed max-w-none report-content" dangerouslySetInnerHTML={{ __html: reportContent || "" }} />
                         <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl border border-slate-200">
                            <div className="text-xs text-slate-500 font-bold">Documento generado por IA Forense. Requiere revisión humana.</div>
                            <div className="flex gap-4">
                                <button onClick={() => window.print()} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow-lg">
                                    <Printer size={18}/> Imprimir Oficial
                                </button>
                            </div>
                         </div>
                     </div>
                 )}
            </BaseModal>

            {/* SPF DEEP DIVE MODAL */}
            <BaseModal isOpen={!!activeSPFItem} onClose={() => setActiveSPFItem(null)} title="NASA/JWST - Análisis de Punto Único de Fallo (SPF)">
                {isAnalyzingSPF ? (
                    <div className="text-center py-20 flex flex-col items-center">
                        <Loader2 size={48} className="text-red-600 animate-spin mb-4"/>
                        <p className="text-slate-600 font-medium">Ejecutando protocolo de análisis de fallo catastrófico...</p>
                    </div>
                ) : spfAnalysisResult ? (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-200 flex flex-col md:flex-row gap-6 items-center shadow-lg">
                            <div className="bg-white p-4 rounded-full border border-red-100 shadow-sm">
                                <Crosshair size={48} className="text-red-600"/>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xl font-black text-red-900 mb-2">{spfAnalysisResult.spfDiagnosis}</h4>
                                <p className="text-sm text-red-800 opacity-90">{spfAnalysisResult.failureMode}</p>
                            </div>
                            <div className="text-center bg-white/80 p-4 rounded-xl border border-red-100">
                                <div className="text-xs font-bold uppercase text-red-400">Prob. Catástrofe</div>
                                <div className="text-4xl font-black text-red-600">{spfAnalysisResult.catastropheProbability}%</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Copy size={16} className="text-blue-600"/> Redundancia</h5>
                                <p className="text-sm text-slate-600 leading-relaxed">{spfAnalysisResult.redundancyStrategy}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Microscope size={16} className="text-purple-600"/> Protocolo de Pruebas</h5>
                                <p className="text-sm text-slate-600 leading-relaxed">{spfAnalysisResult.testingProtocol}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><ShieldCheck size={16} className="text-green-600"/> Contingencia</h5>
                                <p className="text-sm text-slate-600 leading-relaxed">{spfAnalysisResult.contingencyPlan}</p>
                            </div>
                        </div>
                        
                        <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 flex justify-between items-center">
                            <div>
                                <h5 className="font-bold text-sm text-slate-300 uppercase mb-1">Impacto en Población</h5>
                                <p className="text-lg font-medium">{spfAnalysisResult.impactBeneficiaries}</p>
                            </div>
                            <Users size={32} className="text-slate-500"/>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-400">No se pudo cargar el análisis SPF.</div>
                )}
            </BaseModal>

            {/* Risk Mitigation Modal */}
            <BaseModal isOpen={!!activeRiskForMitigation} onClose={() => setActiveRiskForMitigation(null)} title={`Estrategia: ${activeRiskForMitigation?.risk}`}>
                {isMitigationLoading ? <div className="text-center py-20"><Loader2 size={48} className="mx-auto text-blue-600 animate-spin mb-4"/><p className="text-gray-500">Diseñando estrategia ISO 31000...</p></div> : <div className="space-y-4 whitespace-pre-wrap font-sans text-gray-800 leading-relaxed bg-white p-6 rounded-xl border border-gray-200 shadow-inner">{mitigationResult}</div>}
            </BaseModal>

            {/* ... (Keep existing Montecarlo, Evolution, Search Modals) ... */}
            <BaseModal isOpen={isMontecarloOpen} onClose={() => setIsMontecarloOpen(false)} title="Simulador Estocástico Montecarlo (10.000 Iteraciones)" maxWidth="max-w-[1400px]">
                 <div className="flex flex-col lg:flex-row gap-6 h-[80vh]">
                     {/* ... (Existing Montecarlo Content) ... */}
                     <div className="w-full lg:w-1/4 bg-slate-50 p-6 rounded-2xl border border-gray-200 overflow-y-auto flex flex-col gap-6 shadow-inner">
                         <div className="flex items-center gap-2 text-slate-800 border-b border-gray-200 pb-4">
                             <Settings className="text-blue-600"/>
                             <h3 className="font-bold text-lg">Variables Macro</h3>
                         </div>
                         {/* Inflation */}
                         <div>
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                                 <span>Inflación Proyectada (EA)</span>
                                 <span className="text-blue-600">{mcInflation}%</span>
                             </label>
                             <input type="range" min="0" max="20" step="0.5" value={mcInflation} onChange={(e) => setMcInflation(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                         </div>
                         {/* Exposure */}
                         <div>
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                                 <span>Exposición Cambiaria (USD)</span>
                                 <span className="text-blue-600">{mcImportExposure}%</span>
                             </label>
                             <input type="range" min="0" max="100" step="5" value={mcImportExposure} onChange={(e) => setMcImportExposure(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                         </div>
                         {/* TRM Forward */}
                         <div>
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                                 <span>TRM Forward (COP)</span>
                                 <span className="text-blue-600">${mcTrmForward}</span>
                             </label>
                             <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
                                 <span className="text-slate-400 font-bold">$</span>
                                 <input type="number" value={mcTrmForward} onChange={(e) => setMcTrmForward(parseFloat(e.target.value))} className="w-full outline-none text-sm font-bold text-slate-700"/>
                             </div>
                         </div>
                         {/* Imprevistos */}
                         <div>
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
                                 <span>Factor Imprevistos</span>
                                 <span className="text-blue-600">{mcImprevistos}%</span>
                             </label>
                             <input type="range" min="0" max="30" step="1" value={mcImprevistos} onChange={(e) => setMcImprevistos(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/>
                         </div>
                         <div className="mt-auto bg-blue-50 p-4 rounded-xl border border-blue-100">
                             <h5 className="font-bold text-blue-900 text-xs uppercase mb-2">Simulación Activa</h5>
                             <div className="flex justify-between items-center text-sm text-blue-800">
                                 <span>Iteraciones:</span>
                                 <span className="font-mono font-bold">10,000</span>
                             </div>
                         </div>
                     </div>
                     {/* Charts Panel */}
                     <div className="flex-1 overflow-y-auto space-y-6">
                         <div className="grid grid-cols-3 gap-4">
                             <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center">
                                 <div className="text-xs font-bold text-green-700 uppercase mb-1">P10 (Optimista)</div>
                                 <div className="text-xl font-black text-green-900">{formatCurrency(montecarloStats.p10)}</div>
                             </div>
                             <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center">
                                 <div className="text-xs font-bold text-blue-700 uppercase mb-1">P50 (Probable)</div>
                                 <div className="text-xl font-black text-blue-900">{formatCurrency(montecarloStats.p50)}</div>
                             </div>
                             <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-center">
                                 <div className="text-xs font-bold text-red-700 uppercase mb-1">P90 (Pesimista)</div>
                                 <div className="text-xl font-black text-red-900">{formatCurrency(montecarloStats.p90)}</div>
                             </div>
                         </div>
                         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-[320px]">
                             <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider"><BarChart3 size={18}/> Distribución de Probabilidad</h4>
                             <ResponsiveContainer width="100%" height="90%">
                                 <BarChart data={montecarloHistogram} barCategoryGap={0}>
                                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                     <XAxis dataKey="range" tick={{fontSize: 9}} interval={2}/>
                                     <Tooltip />
                                     <Bar dataKey="count" fill="#3b82f6" opacity={0.8} radius={[4, 4, 0, 0]}>
                                         {montecarloHistogram.map((entry, index) => (
                                             <Cell key={`cell-${index}`} fill={entry.costValue >= montecarloStats.p90 ? '#ef4444' : entry.costValue <= montecarloStats.p10 ? '#10b981' : '#3b82f6'} />
                                         ))}
                                     </Bar>
                                 </BarChart>
                             </ResponsiveContainer>
                         </div>
                     </div>
                 </div>
            </BaseModal>

            {/* EVOLUTION BRAIN MODAL */}
            <BaseModal isOpen={isEvolutionModalOpen} onClose={closeEvolutionModal} title={evolutionResult ? "Dictamen Forense de Evolución" : "Cerebro Omni-Corporal: Auditoría Forense"}>
                 {/* ... (Existing Evolution Modal Content) ... */}
                 {evolutionResult ? (
                    <div className="animate-fade-in space-y-6">
                        <div className={`p-8 rounded-2xl flex flex-col items-center text-center ${
                            evolutionResult.efficiencyVerdict === 'Critico' ? 'bg-red-50 border-2 border-red-100' :
                            evolutionResult.efficiencyVerdict === 'Optimo' ? 'bg-green-50 border-2 border-green-100' :
                            'bg-yellow-50 border-2 border-yellow-100'
                        }`}>
                            <div className={`p-4 rounded-full mb-4 ${
                                 evolutionResult.efficiencyVerdict === 'Critico' ? 'bg-red-100 text-red-600' :
                                 evolutionResult.efficiencyVerdict === 'Optimo' ? 'bg-green-100 text-green-600' :
                                 'bg-yellow-100 text-yellow-600'
                            }`}>
                                {evolutionResult.efficiencyVerdict === 'Critico' ? <ShieldAlert size={48} /> :
                                 evolutionResult.efficiencyVerdict === 'Optimo' ? <CheckCircle size={48} /> :
                                 <ScaleIcon size={48} />}
                            </div>
                            <h2 className={`text-3xl font-black uppercase tracking-tight mb-2 ${
                                evolutionResult.efficiencyVerdict === 'Critico' ? 'text-red-900' :
                                evolutionResult.efficiencyVerdict === 'Optimo' ? 'text-green-900' :
                                'text-yellow-900'
                            }`}>
                                Dictamen: {evolutionResult.efficiencyVerdict}
                            </h2>
                            <p className="text-lg font-medium max-w-2xl opacity-80">"{evolutionResult.efficiencyRationale}"</p>
                        </div>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h4 className="font-bold text-slate-700 flex items-center gap-2"><Diff size={18} className="text-blue-500"/> Delta Forense</h4>
                                <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded">{evolutionResult.changes.length} Cambios</span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {evolutionResult.changes.map((change, idx) => (
                                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="w-1/3">
                                            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Campo Modificado</div>
                                            <div className="font-mono text-sm font-bold text-slate-700 bg-slate-100 inline-block px-2 py-1 rounded">{change.field}</div>
                                        </div>
                                        <div className="flex-1 flex items-center gap-4">
                                            <div className="flex-1 text-right">
                                                <div className="text-xs text-slate-400 mb-1">Anterior</div>
                                                <div className="text-sm font-medium text-slate-500 line-through decoration-red-300">{change.oldValue || 'N/A'}</div>
                                            </div>
                                            <ArrowRight size={16} className="text-slate-300 shrink-0"/>
                                            <div className="flex-1 text-left">
                                                <div className="text-xs text-slate-400 mb-1">Actual</div>
                                                <div className="text-lg font-bold text-blue-600">{change.newValue}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={closeEvolutionModal} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">Entendido</button>
                    </div>
                 ) : (
                     <div className="text-center py-2 px-6">
                         {!isEvolving ? (
                             <>
                                <div className="bg-indigo-50 p-6 rounded-full inline-block mb-4 text-indigo-600"><GitMerge size={48}/></div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">Evolucionar Estado</h3>
                                <p className="text-slate-500 max-w-lg mx-auto mb-6">Sube nueva evidencia o texto para auditar el avance.</p>
                                <div className="flex justify-center mb-6 bg-slate-100 p-1 rounded-lg inline-flex mx-auto">
                                    <button onClick={() => setEvolutionTab('pdf')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${evolutionTab === 'pdf' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>PDF</button>
                                    <button onClick={() => setEvolutionTab('text')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${evolutionTab === 'text' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Texto</button>
                                </div>
                                {evolutionTab === 'pdf' ? (
                                    <label className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 shadow-xl cursor-pointer inline-flex items-center gap-3 transition-transform active:scale-95 w-full justify-center">
                                        <UploadCloud size={20}/> Seleccionar Documento (PDF)
                                        <input type="file" className="hidden" accept="application/pdf" onChange={handleEvolutionPdf} />
                                    </label>
                                ) : (
                                    <div className="w-full">
                                        <textarea value={evolutionTextInput} onChange={(e) => setEvolutionTextInput(e.target.value)} placeholder="Pega aquí el contenido..." className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 mb-4" />
                                        <button onClick={handleEvolutionTextSubmit} disabled={!evolutionTextInput.trim()} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-xl w-full">Analizar Texto</button>
                                    </div>
                                )}
                                {evolutionError && <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold">{evolutionError}</div>}
                             </>
                         ) : (
                             <div className="py-12 flex flex-col items-center">
                                 <Loader2 size={48} className="text-indigo-600 animate-spin mb-4"/>
                                 <h3 className="text-xl font-bold text-slate-900 animate-pulse">Auditando Delta...</h3>
                             </div>
                         )}
                     </div>
                 )}
            </BaseModal>
            
            {/* SEARCH MODAL (Keep Existing) */}
            <BaseModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} title="Radar de Noticias (Google Search)">
                 {isSearching ? (
                     <div className="text-center py-20 flex flex-col items-center">
                         <Loader2 size={48} className="text-blue-600 animate-spin mb-4"/>
                         <p className="text-slate-600 font-medium">Buscando controversias...</p>
                     </div>
                 ) : searchResult ? (
                     <div className="space-y-8 animate-fade-in">
                         <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg"><Newspaper className="text-blue-600"/> Resumen de Inteligencia</h4>
                             <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">{searchResult.summary}</p>
                         </div>
                         <div>
                             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Globe size={16}/> Fuentes</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {searchResult.sources.map((source, i) => (
                                     <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all group flex justify-between items-start">
                                         <div><h5 className="font-bold text-blue-900 text-sm mb-1 group-hover:underline line-clamp-2">{source.title}</h5><p className="text-xs text-slate-400 truncate max-w-[250px]">{source.uri}</p></div>
                                         <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-500"/>
                                     </a>
                                 ))}
                             </div>
                         </div>
                     </div>
                 ) : ( <div className="text-center py-10 text-slate-400">No hay resultados.</div> )}
            </BaseModal>

            {/* Financial Metric Educational Modal (Keep Existing) */}
            <BaseModal isOpen={!!activeMetricModal} onClose={() => setActiveMetricModal(null)} title={activeMetricModal && METRIC_DEFINITIONS[activeMetricModal] ? METRIC_DEFINITIONS[activeMetricModal].title : 'Detalle'} maxWidth="max-w-2xl">
                 {activeMetricModal && METRIC_DEFINITIONS[activeMetricModal] && (
                     <div className="space-y-6 animate-fade-in">
                         <div className="flex justify-center mb-4"><div className="p-4 bg-slate-50 rounded-full text-slate-700 shadow-inner">{METRIC_DEFINITIONS[activeMetricModal].icon}</div></div>
                         <div className="bg-blue-50 p-5 rounded-xl border border-blue-100"><h5 className="font-bold text-blue-800 text-xs uppercase mb-2">Definición</h5><p className="text-slate-700 text-sm leading-relaxed">{METRIC_DEFINITIONS[activeMetricModal].definition}</p></div>
                         <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-700 font-mono text-center shadow-lg"><div className="text-xs text-slate-400 uppercase mb-2">Fórmula</div><div className="text-lg font-bold">{METRIC_DEFINITIONS[activeMetricModal].formula}</div></div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"><h5 className="font-bold text-slate-800 text-xs uppercase mb-2 flex items-center gap-2"><Target size={14}/> Impacto</h5><p className="text-slate-600 text-xs leading-relaxed">{METRIC_DEFINITIONS[activeMetricModal].impact}</p></div>
                             <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm"><h5 className="font-bold text-green-800 text-xs uppercase mb-2 flex items-center gap-2"><TrendingUp size={14}/> Cómo Mejorarlo</h5><p className="text-green-700 text-xs leading-relaxed">{METRIC_DEFINITIONS[activeMetricModal].improvement}</p></div>
                         </div>
                     </div>
                 )}
            </BaseModal>

            {/* ... (Keep existing Bottleneck & UNGRD Modals) ... */}
            <BaseModal isOpen={!!activeBottleneck} onClose={() => setActiveBottleneck(null)} title={`Análisis de Bloqueo: ${activeBottleneck?.processName}`}>
                 {/* ... (Existing Content) ... */}
                 {isAnalyzingBottleneck ? (
                    <div className="text-center py-20 animate-fade-in"><Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={48}/><p className="text-gray-500 font-medium">Investigando...</p></div>
                 ) : bottleneckAnalysis ? (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><h5 className="font-bold text-gray-400 text-xs uppercase mb-2">Causa Raíz</h5><p className="font-semibold text-gray-800">{bottleneckAnalysis.rootCause}</p></div>
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><h5 className="font-bold text-gray-400 text-xs uppercase mb-2">Marco Legal</h5><p className="font-semibold text-gray-800 font-mono text-sm">{bottleneckAnalysis.legalFramework}</p></div>
                            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><h5 className="font-bold text-gray-400 text-xs uppercase mb-2">Impacto</h5><p className="font-semibold text-gray-800">{bottleneckAnalysis.financialImpactEstimate}</p></div>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-inner">
                            <h5 className="font-bold text-blue-900 text-lg mb-4 flex items-center gap-3"><Zap size={20}/> Plan de Acción</h5>
                            <div className="space-y-4">{(bottleneckAnalysis.strategicActions || []).map((action, i) => (<div key={i} className="flex gap-4 items-start p-3 bg-white/50 rounded-lg"><div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">{i+1}</div><p className="text-blue-800 font-medium text-sm pt-1.5">{action}</p></div>))}</div>
                        </div>
                    </div>
                 ) : ( <div className="text-center py-20 text-gray-400">Sin análisis.</div> )}
            </BaseModal>

            {/* UNGRD Modal Wrapper (Keep existing) */}
            <BaseModal isOpen={!!activeUngrdModal} onClose={() => setActiveUngrdModal(null)} title="Plataforma de Intervención Integral (Ley 1523)" maxWidth="max-w-7xl">
                {/* ... (Keep existing UNGRD modal content) ... */}
                {activeUngrdModal && data.ungrdAnalysis && (
                    <div className="space-y-6 animate-fade-in">
                         {/* 1. KNOWLEDGE */}
                         {activeUngrdModal === 'knowledge' && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-xl p-6 text-white shadow-lg flex items-start gap-6">
                                    <div className="p-4 bg-white/20 rounded-lg"><FlaskConical size={32}/></div>
                                    <div className="flex-1"><h3 className="text-xl font-bold">Conocimiento del Riesgo</h3><p className="text-teal-100">Análisis comparativo de alternativas para modelamiento.</p></div>
                                     {knowledgeDeepAnalysis && <div className="text-right"><div className="text-teal-200 text-xs font-bold uppercase tracking-wider">Score</div><div className="text-4xl font-black">{knowledgeDeepAnalysis.overallKnowledgeScore}</div></div>}
                                </div>
                                
                                <AnalysisSummaryCard title="Resumen" content={data.ungrdAnalysis.knowledge.observation} icon={<FileSearch size={16}/>} colorClass="bg-teal-50 border-teal-200 text-teal-800"/>

                                {!knowledgeDeepAnalysis ? (
                                    <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                                        <button onClick={handleKnowledgeAnalysis} disabled={isAnalyzingKnowledge} className="bg-teal-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-teal-700 transition flex items-center gap-2 mx-auto">{isAnalyzingKnowledge ? <Loader2 className="animate-spin"/> : <Search/>} Profundizar Análisis</button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col lg:flex-row gap-8">
                                        <div className="flex lg:flex-col gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200 self-start">
                                            {[{id:'threat', label:'Amenaza'}, {id:'gaps', label:'Vacíos'}, {id:'modeling', label:'Modelamiento'}, {id:'monitoring', label:'Monitoreo'}].map(tab => (
                                                <button key={tab.id} onClick={() => setKnowledgeDashboardTab(tab.id as any)} className={`px-4 py-2 text-sm font-bold rounded-lg text-left w-full ${knowledgeDashboardTab === tab.id ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}>{tab.label}</button>
                                            ))}
                                        </div>
                                        <div className="flex-1">
                                            {knowledgeDashboardTab === 'threat' && <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in"><h4 className="font-bold text-lg text-slate-800 mb-2">Caracterización</h4><p className="text-sm text-slate-600 leading-relaxed">{knowledgeDeepAnalysis.riskCharacterization}</p></div>}
                                            {knowledgeDashboardTab === 'gaps' && <div className="space-y-4 animate-fade-in">{(knowledgeDeepAnalysis.criticalDataGaps || []).map((gap, i) => (<div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-red-100"><span className={`inline-block px-2 py-0.5 text-xs font-bold rounded mb-2 ${gap.criticality === 'Alta' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{gap.criticality}</span><h5 className="font-bold text-slate-800">{gap.gap}</h5><p className="text-xs text-slate-500 mt-1 mb-3">{gap.impact}</p><div className="bg-slate-50 p-3 rounded-lg border border-slate-200"><h6 className="font-bold text-slate-400 text-[10px] uppercase mb-1">Plan de Acción</h6><p className="text-xs text-slate-600 font-medium">{gap.actionPlan}</p></div></div>))}</div>}
                                            {knowledgeDashboardTab === 'modeling' && <div className="space-y-4 animate-fade-in">{(knowledgeDeepAnalysis.modelingAlternatives || []).map((alt, i) => (<div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200"><h5 className="font-bold text-slate-800">{alt.name}</h5><div className="text-xs flex gap-2 my-2"><span className="bg-blue-100 text-blue-700 px-2 rounded font-medium">{alt.type}</span><span className="bg-green-100 text-green-700 px-2 rounded font-medium">{alt.estimatedCost}</span></div></div>))}</div>}
                                            {knowledgeDashboardTab === 'monitoring' && <div className="space-y-4 animate-fade-in">{(knowledgeDeepAnalysis.monitoringAlternatives || []).map((alt, i) => (<div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200"><h5 className="font-bold text-slate-800">{alt.name}</h5></div>))}</div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* 2. CORRECTIVE */}
                        {activeUngrdModal === 'corrective' && (
                            <div className="space-y-8">
                                <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white shadow-lg flex items-center gap-6">
                                    <div className="p-4 bg-white/20 rounded-lg"><Pickaxe size={32}/></div>
                                    <div><h3 className="text-xl font-bold">Intervención Correctiva</h3><p className="text-blue-100">Análisis técnico-financiero profundo.</p></div>
                                </div>
                                <AnalysisSummaryCard title="Resumen" content={data.ungrdAnalysis.reduction.corrective?.observation} icon={<FileSearch size={16}/>} colorClass="bg-blue-50 border-blue-200 text-blue-800"/>
                                {!correctiveDeepAnalysis ? (
                                    <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl"><button onClick={handleCorrectiveAnalysis} disabled={isAnalyzingCorrective} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto">{isAnalyzingCorrective ? <Loader2 className="animate-spin"/> : <Sparkles/>} Profundizar Análisis</button></div>
                                ) : (
                                    <div className="space-y-8 animate-fade-in">
                                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md">
                                            <h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">Auditoría</h4>
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm"><h6 className="font-bold text-slate-400 text-xs uppercase mb-2">Diagnóstico</h6><p className="text-sm font-medium text-slate-800">{correctiveDeepAnalysis.threatDiagnosis}</p></div>
                                                <div className="lg:col-span-2 bg-red-50 p-5 rounded-xl border border-red-100 shadow-sm relative"><h6 className="font-bold text-red-400 text-xs uppercase mb-2">Crítica Técnica</h6><p className="text-sm font-medium text-slate-800 leading-relaxed italic">"{correctiveDeepAnalysis.engineeringSolutionAudit}"</p></div>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md">
                                            <h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">Soluciones Alternativas</h4>
                                            {correctiveDeepAnalysis.alternativeSolutions && correctiveDeepAnalysis.alternativeSolutions.length > 0 ? (
                                                <div className="grid grid-cols-1 gap-6">
                                                    {correctiveDeepAnalysis.alternativeSolutions.map((sol, i) => (
                                                        <div key={i} className="bg-purple-50/50 border border-purple-100 rounded-xl p-6 relative hover:shadow-md transition-shadow">
                                                            <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rounded-bl-xl text-xs font-bold">Opción {i + 1}</div>
                                                            <h5 className="font-bold text-purple-900 text-lg mb-1">{sol.solutionName}</h5>
                                                            <p className="text-sm text-slate-600 mb-4">{sol.description}</p>
                                                            <div className="flex flex-wrap gap-2 mb-4"><span className={`text-xs font-bold px-3 py-1 rounded-full border ${sol.resilienceScore > 80 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>{sol.resilienceScore}/100 Resiliencia</span></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : <div className="text-slate-500 italic">No se generaron alternativas.</div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* 3. PROSPECTIVE */}
                        {activeUngrdModal === 'prospective' && (
                            <div className="space-y-8">
                                {/* ... (Keep existing prospective content) ... */}
                                <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-xl p-6 text-white shadow-lg flex items-center gap-6">
                                    <div className="p-4 bg-white/20 rounded-lg"><LandPlot size={32}/></div>
                                    <div><h3 className="text-xl font-bold">Intervención Prospectiva</h3><p className="text-emerald-100">Alineación con POT y cambio climático.</p></div>
                                </div>
                                <AnalysisSummaryCard title="Resumen POT" content={data.ungrdAnalysis.reduction.prospective?.observation} icon={<MapIcon size={16}/>} colorClass="bg-emerald-50 border-emerald-200 text-emerald-800"/>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><UploadCloud size={20} className="text-emerald-600"/> Análisis POT/EOT</h4>
                                        <label className="w-full block bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer transition-all">
                                            {isAnalyzingPOT ? <Loader2 className="animate-spin mx-auto text-emerald-600"/> : <FileText className="mx-auto text-slate-400 mb-2"/>}
                                            <span className="text-sm font-bold text-slate-600">{isAnalyzingPOT ? "Analizando zonificación..." : "Cargar POT (PDF)"}</span>
                                            <input type="file" className="hidden" accept="application/pdf" onChange={handlePOTUpload} disabled={isAnalyzingPOT}/>
                                        </label>
                                        {potAnalysisError && <div className="mt-4 text-xs text-red-600 bg-red-50 p-2 rounded">{potAnalysisError}</div>}
                                    </div>
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Sprout size={20} className="text-green-600"/> Adaptación Climática</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded"><span className="text-slate-600">Considera Cambio Climático</span><span className={`font-bold ${data.ungrdAnalysis.reduction.prospective?.hasClimateChangeAdaptation ? 'text-green-600' : 'text-red-600'}`}>{data.ungrdAnalysis.reduction.prospective?.hasClimateChangeAdaptation ? 'SÍ' : 'NO'}</span></div>
                                            <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded"><span className="text-slate-600">Sistema Alerta Temprana</span><span className={`font-bold ${data.ungrdAnalysis.reduction.prospective?.hasEarlyWarningSystem ? 'text-green-600' : 'text-red-600'}`}>{data.ungrdAnalysis.reduction.prospective?.hasEarlyWarningSystem ? 'SÍ' : 'NO'}</span></div>
                                        </div>
                                    </div>
                                </div>
                                {potAnalysisResult && (
                                    <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-md animate-fade-in">
                                        <div className="flex justify-between items-center mb-6"><h4 className="font-bold text-lg text-emerald-900">Resultado Auditoría POT</h4><div className="text-2xl font-black text-emerald-700">{potAnalysisResult.complianceScore}/100</div></div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div><h5 className="text-xs font-bold uppercase text-slate-400 mb-2">Restricciones de Uso</h5><ul className="space-y-2">{(potAnalysisResult.landUseRestrictions || []).map((res, i) => (<li key={i} className="text-sm bg-red-50 p-3 rounded-lg border border-red-100 text-red-800"><strong>{res.issue}</strong>: {res.mitigation}</li>))}</ul></div>
                                            <div><h5 className="text-xs font-bold uppercase text-slate-400 mb-2">Recomendaciones</h5><ul className="space-y-2 list-disc pl-4 text-sm text-slate-600">{(potAnalysisResult.recommendations || []).map((rec, i) => <li key={i}>{rec}</li>)}</ul></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* 4. FINANCIAL PROTECTION */}
                        {activeUngrdModal === 'financial' && (
                            <div className="space-y-8">
                                {/* ... (Keep existing financial protection content) ... */}
                                <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex items-center gap-6">
                                    <div className="p-4 bg-white/20 rounded-lg"><Umbrella size={32}/></div>
                                    <div>
                                        <h3 className="text-xl font-bold">Protección Financiera</h3>
                                        <p className="text-indigo-100">Guía de Aseguramiento de Bienes Públicos (5 Pasos).</p>
                                    </div>
                                </div>
                                <AnalysisSummaryCard title="Estado Actual" content={data.ungrdAnalysis.reduction.financialProtection?.observation} icon={<ShieldCheck size={16}/>} colorClass="bg-indigo-50 border-indigo-200 text-indigo-800"/>
                                
                                {financialProtectionError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in shadow-sm"><AlertCircle size={20} /><span className="font-bold text-sm">{financialProtectionError}</span><button onClick={() => setFinancialProtectionError(null)} className="ml-auto text-xs underline">Reintentar</button></div>}

                                {!financialProtectionAnalysis && !financialProtectionError ? (
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center py-12">
                                         <h4 className="text-lg font-bold text-slate-700 mb-2">Estructurador de Transferencia de Riesgo</h4>
                                         <p className="text-sm text-slate-500 max-w-lg mx-auto mb-6">Genera una estrategia completa siguiendo la metodología oficial: Inventario -> Riesgo -> Instrumento -> Estructuración -> Monitoreo.</p>
                                         <button onClick={handleAnalyzeFinancialProtection} disabled={isAnalyzingFinancial} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition flex items-center gap-2 mx-auto">
                                            {isAnalyzingFinancial ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>} Iniciar Asistente (5 Pasos)
                                        </button>
                                    </div>
                                ) : financialProtectionAnalysis ? (
                                    <div className="space-y-8 animate-fade-in">
                                        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                                            <div className="text-center md:text-left">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score de Estructuración</div>
                                                <div className="text-4xl font-black text-indigo-900">{financialProtectionAnalysis.efficiencyScore}/100</div>
                                            </div>
                                            <div className="flex-1 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                                <h5 className="font-bold text-indigo-900 text-sm mb-2">Estrategia Global</h5>
                                                <p className="text-sm text-indigo-800 leading-relaxed">{financialProtectionAnalysis.overallStrategy}</p>
                                            </div>
                                        </div>

                                        <div className="relative pl-8 border-l-2 border-indigo-100 space-y-8">
                                            {(financialProtectionAnalysis.steps || []).map((step, index) => {
                                                let StepIcon = Circle;
                                                if (step.stepNumber === 1) StepIcon = Package; // Inventory
                                                if (step.stepNumber === 2) StepIcon = Activity; // Risk
                                                if (step.stepNumber === 3) StepIcon = FileText; // Instrument
                                                if (step.stepNumber === 4) StepIcon = PlayCircle; // Implementation
                                                if (step.stepNumber === 5) StepIcon = RefreshCw; // Monitoring

                                                return (
                                                    <div key={index} className="relative group">
                                                        <div className={`absolute -left-[41px] top-0 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${
                                                            step.status === 'Optimo' ? 'bg-green-500 text-white' :
                                                            step.status === 'Crítico' ? 'bg-red-500 text-white' : 'bg-indigo-500 text-white'
                                                        }`}>
                                                            <span className="font-bold text-xs">{step.stepNumber}</span>
                                                        </div>
                                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                                                            <div className="bg-slate-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                                                <h4 className="font-bold text-slate-800 text-lg flex items-center gap-3">
                                                                    <StepIcon className="text-indigo-600" size={20}/> {step.title}
                                                                </h4>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                                    step.status === 'Optimo' ? 'bg-green-100 text-green-700' :
                                                                    step.status === 'Crítico' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                                }`}>{step.status}</span>
                                                            </div>
                                                            <div className="p-6">
                                                                <p className="text-slate-600 text-sm leading-relaxed mb-4 font-medium">{step.description}</p>
                                                                {step.kpi && (<div className="mb-4 inline-block bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-lg"><span className="text-[10px] font-bold text-indigo-400 uppercase block">Dato Clave</span><span className="text-lg font-bold text-indigo-900">{step.kpi}</span></div>)}
                                                                {step.actionItems && step.actionItems.length > 0 && (<div className="bg-slate-50 p-4 rounded-lg border border-slate-100"><h6 className="text-xs font-bold text-slate-400 uppercase mb-2">Acciones Requeridas</h6><ul className="space-y-2">{step.actionItems.map((item, i) => (<li key={i} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5"/>{item}</li>))}</ul></div>)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        )}
                        {/* 5. MANAGEMENT */}
                        {activeUngrdModal === 'management' && (
                            <div className="space-y-8">
                                {/* ... (Keep existing management content) ... */}
                                <div className="bg-gradient-to-r from-orange-700 to-orange-600 rounded-xl p-6 text-white shadow-lg flex items-center gap-6">
                                    <div className="p-4 bg-white/20 rounded-lg"><Siren size={32}/></div>
                                    <div><h3 className="text-xl font-bold">Manejo de Desastres</h3><p className="text-orange-100">Respuesta y recuperación.</p></div>
                                </div>
                                <AnalysisSummaryCard title="Estado Actual" content={data.ungrdAnalysis.management?.observation} icon={<ListChecks size={16}/>} colorClass="bg-orange-50 border-orange-200 text-orange-800"/>
                                {!managementDeepAnalysis ? (
                                    <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl"><button onClick={handleManagementAnalysis} disabled={isAnalyzingManagement} className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-orange-700 transition flex items-center gap-2 mx-auto">{isAnalyzingManagement ? <Loader2 className="animate-spin"/> : <Siren/>} Auditar Preparación</button></div>
                                ) : (
                                    <div className="space-y-6 animate-fade-in">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col justify-center items-center text-center"><div className="text-5xl font-black text-orange-500 mb-2">{managementDeepAnalysis.preparednessScore}</div><div className="text-sm font-bold uppercase tracking-wider opacity-80">Índice</div></div><div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><FileText size={16}/> Auditoría Plan</h5><p className="text-sm text-slate-600 leading-relaxed">{managementDeepAnalysis.contingencyPlanAudit}</p></div></div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </BaseModal>

            {/* TAB CONTENT - OVERVIEW (Keep existing) */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Header Card */}
                    <div className="lg:col-span-3 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{data.projectName}</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${data.projectPhase === 'Execution' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{data.projectPhase}</span>
                            </div>
                            <p className="text-slate-500 text-sm max-w-2xl">{data.generalObjective}</p>
                            <div className="flex items-center gap-4 mt-4 text-sm text-slate-500 font-medium">
                                <span className="flex items-center gap-1"><MapPin size={16}/> {data.location?.municipality || "Ubicación"}, {data.location?.department}</span>
                                <span className="flex items-center gap-1"><Building2 size={16}/> {data.contractor}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Presupuesto Total</div>
                            <div className="text-3xl font-black text-slate-900">{formatCurrency(data.totalBudget)}</div>
                            <div className="text-xs font-medium text-slate-500 mt-1">Ejecutado: {formatCurrency(data.spentBudget)} ({data.progressPercentage}%)</div>
                            <button onClick={handleSearchContext} disabled={isSearching} className="mt-4 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ml-auto border border-blue-200">
                                {isSearching ? <Loader2 className="animate-spin" size={14}/> : <Search size={14}/>} {isSearching ? 'Investigando...' : 'Radar de Noticias'}
                            </button>
                        </div>
                    </div>
                    {/* ... (Keep existing Overview content: KPI, S-Curve, Map, Evolution, UNGRD Grid) ... */}
                    {/* Left Column: KPI & Chart */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* KPI Cards Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <div onClick={() => setActiveMetricModal('cpi')} className={`p-6 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all hover:scale-105 hover:shadow-lg relative group bg-gradient-to-br ${calculatedMetrics.cpi < 0.9 ? 'from-red-50 to-white border-red-200' : 'from-green-50 to-white border-green-200'}`}>
                                 <div>
                                     <div className="flex justify-between items-start">
                                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">CPI</div>
                                         <Info size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors"/>
                                     </div>
                                     <div className={`text-4xl font-black ${calculatedMetrics.cpi < 0.9 ? 'text-red-600' : 'text-slate-900'}`}>{calculatedMetrics.cpi.toFixed(2)}</div>
                                 </div>
                             </div>
                             <div onClick={() => setActiveMetricModal('spi')} className={`p-6 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all hover:scale-105 hover:shadow-lg relative group bg-gradient-to-br ${calculatedMetrics.spi < 0.9 ? 'from-orange-50 to-white border-orange-200' : 'from-green-50 to-white border-green-200'}`}>
                                 <div>
                                     <div className="flex justify-between items-start">
                                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">SPI</div>
                                         <Info size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors"/>
                                     </div>
                                     <div className={`text-4xl font-black ${calculatedMetrics.spi < 0.9 ? 'text-orange-600' : 'text-slate-900'}`}>{calculatedMetrics.spi.toFixed(2)}</div>
                                 </div>
                             </div>
                             <div onClick={() => setActiveTab('risks')} className="p-6 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between cursor-pointer transition-all hover:scale-105 hover:shadow-lg hover:border-red-300 group relative">
                                 <div>
                                     <div className="flex justify-between items-start">
                                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Riesgos Críticos</div>
                                         <ArrowRight size={14} className="text-slate-300 group-hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1"/>
                                     </div>
                                     <div className="text-4xl font-black text-slate-900">{riskStats.critical}</div>
                                 </div>
                             </div>
                             <div onClick={() => setActiveTab('execution')} className="p-6 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between cursor-pointer transition-all hover:scale-105 hover:shadow-lg hover:border-orange-300 group relative">
                                 <div>
                                     <div className="flex justify-between items-start">
                                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cuellos de Botella</div>
                                         <ArrowRight size={14} className="text-slate-300 group-hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1"/>
                                     </div>
                                     <div className="text-4xl font-black text-slate-900">{dynamicBottlenecks.length}</div>
                                 </div>
                             </div>
                        </div>

                        {/* S-Curve Chart (Prominent) */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-[400px]">
                            <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-blue-600"/> Curva S: Valor Ganado (EVM)</h3>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart data={sCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorPV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/><stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/></linearGradient>
                                        <linearGradient id="colorEV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" tick={{fontSize: 10}} tickFormatter={(val) => new Date(val).toLocaleDateString()} />
                                    <YAxis tick={{fontSize: 10}} tickFormatter={(val) => `$${(val/1000000).toFixed(0)}M`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                                    <Legend />
                                    <Area type="monotone" dataKey="PV" name="Valor Planeado (PV)" stroke="#94a3b8" fillOpacity={1} fill="url(#colorPV)" strokeWidth={2} strokeDasharray="5 5" />
                                    <Area type="monotone" dataKey="EV" name="Valor Ganado (EV)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEV)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="AC" name="Costo Actual (AC)" stroke="#ef4444" fill="none" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right Column: Map & Evolution */}
                    <div className="space-y-8">
                         {/* MAP CARD (NEW) */}
                         <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm h-[320px] flex flex-col overflow-hidden">
                             <div className="flex justify-between items-center mb-4 px-2">
                                <h4 className="font-bold text-slate-700 flex items-center gap-2 text-sm"><MapIcon size={16} className="text-blue-500"/> Ubicación Geográfica</h4>
                                <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                    Lat: {data.location?.latitude ? data.location.latitude.toFixed(3) : 0}, Lon: {data.location?.longitude ? data.location.longitude.toFixed(3) : 0}
                                </div>
                             </div>
                             <div className="flex-1 rounded-xl overflow-hidden bg-slate-100 relative border border-gray-100">
                                 {mapEmbed}
                                 <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 text-[10px] rounded shadow-sm text-slate-500 font-bold backdrop-blur-sm">
                                     OpenStreetMap
                                 </div>
                             </div>
                         </div>

                        {/* Evolution Timeline (Moved here) */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-[400px] overflow-y-auto custom-scrollbar flex flex-col">
                            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
                                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                    <History size={20} className="text-blue-600"/> Evolución
                                </h3>
                                <button onClick={() => setIsEvolutionModalOpen(true)} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition border border-indigo-200 flex items-center gap-1">
                                    <GitMerge size={14}/> Evolucionar
                                </button>
                            </div>
                            
                            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                {(data.evolutionHistory || []).map((log, i) => (
                                    <div key={i} className="relative pl-10 group">
                                        {/* Line dot */}
                                        <div className={`absolute left-[11px] top-6 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${
                                            log.efficiencyVerdict === 'Critico' ? 'bg-red-500' : 
                                            log.efficiencyVerdict === 'Optimo' ? 'bg-green-500' : 'bg-slate-400'
                                        }`}></div>
                                        
                                        {/* Card */}
                                        <div 
                                            onClick={() => setExpandedLogIndex(expandedLogIndex === i ? null : i)}
                                            className={`rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                                                expandedLogIndex === i 
                                                ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100' 
                                                : 'bg-slate-50 border-slate-100 hover:border-blue-200'
                                            }`}
                                        >
                                            {/* Header Summary */}
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                                            {new Date(log.date).toLocaleDateString()}
                                                        </div>
                                                        <h5 className="font-bold text-slate-800 text-sm truncate pr-2">{log.sourceDocument}</h5>
                                                    </div>
                                                </div>
                                                
                                                <p className={`text-xs text-slate-600 italic ${expandedLogIndex === i ? '' : 'line-clamp-2'}`}>"{log.summary}"</p>
                                            </div>

                                            {/* Expanded Details */}
                                            {expandedLogIndex === i && (
                                                <div className="border-t border-gray-100 bg-slate-50/50 p-4 animate-fade-in">
                                                    {log.efficiencyRationale && (
                                                        <div className="mb-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                                            <strong className="block text-[10px] uppercase text-slate-400 mb-1">Racional del Veredicto</strong>
                                                            <p className="text-xs text-slate-700 leading-relaxed">{log.efficiencyRationale}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {(data.evolutionHistory || []).length === 0 && (
                                    <div className="pl-10 text-sm text-slate-400 italic">No hay historial de evolución.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 5 MODULE UNGRD GRID - COLORFUL & REDESIGNED */}
                    <div className="lg:col-span-3">
                        <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><ShieldCheck size={20} className="text-slate-700"/> Ciclo Integral de Gestión del Riesgo (UNGRD)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {/* ... (Keep existing 5 modules) ... */}
                            {/* 1. Knowledge (Teal) */}
                            <div onClick={() => setActiveUngrdModal('knowledge')} className="bg-gradient-to-br from-teal-50 to-white p-4 rounded-xl border border-teal-200 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between h-40">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><FlaskConical size={48} className="text-teal-600"/></div>
                                <div>
                                    <h4 className="font-black text-sm text-teal-900 mb-1 group-hover:text-teal-700 uppercase tracking-tight">1. Conocimiento</h4>
                                    <p className="text-[10px] text-teal-700/70 line-clamp-3 leading-tight font-medium">{data.ungrdAnalysis?.knowledge?.observation || "Sin análisis."}</p>
                                </div>
                                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider flex items-center gap-1 mt-2 bg-white/50 w-fit px-2 py-1 rounded">Ver Modelos <ArrowRight size={10}/></span>
                            </div>

                            {/* 2. Corrective (Blue) */}
                            <div onClick={() => setActiveUngrdModal('corrective')} className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-200 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between h-40">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Pickaxe size={48} className="text-blue-600"/></div>
                                <div>
                                    <h4 className="font-black text-sm text-blue-900 mb-1 group-hover:text-blue-700 uppercase tracking-tight">2. Correctiva</h4>
                                    <p className="text-[10px] text-blue-700/70 line-clamp-3 leading-tight font-medium">{data.ungrdAnalysis?.reduction?.corrective?.observation || "Sin análisis."}</p>
                                </div>
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1 mt-2 bg-white/50 w-fit px-2 py-1 rounded">Ingeniería <ArrowRight size={10}/></span>
                            </div>

                            {/* 3. Prospective (Green) */}
                            <div onClick={() => setActiveUngrdModal('prospective')} className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-200 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between h-40">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><LandPlot size={48} className="text-emerald-600"/></div>
                                <div>
                                    <h4 className="font-black text-sm text-emerald-900 mb-1 group-hover:text-emerald-700 uppercase tracking-tight">3. Prospectiva</h4>
                                    <p className="text-[10px] text-emerald-700/70 line-clamp-3 leading-tight font-medium">{data.ungrdAnalysis?.reduction?.prospective?.observation || "Sin análisis."}</p>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1 mt-2 bg-white/50 w-fit px-2 py-1 rounded">POT & Clima <ArrowRight size={10}/></span>
                            </div>

                            {/* 4. Financial (Indigo) */}
                            <div onClick={() => setActiveUngrdModal('financial')} className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-200 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between h-40">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Umbrella size={48} className="text-indigo-600"/></div>
                                <div>
                                    <h4 className="font-black text-sm text-indigo-900 mb-1 group-hover:text-indigo-700 uppercase tracking-tight">4. Protección Fin.</h4>
                                    <p className="text-[10px] text-indigo-700/70 line-clamp-3 leading-tight font-medium">{data.ungrdAnalysis?.reduction?.financialProtection?.observation || "Sin análisis."}</p>
                                </div>
                                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1 mt-2 bg-white/50 w-fit px-2 py-1 rounded">Aseguramiento <ArrowRight size={10}/></span>
                            </div>

                            {/* 5. Management (Orange) */}
                            <div onClick={() => setActiveUngrdModal('management')} className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-xl border border-orange-200 hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between h-40">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Siren size={48} className="text-orange-600"/></div>
                                <div>
                                    <h4 className="font-black text-sm text-orange-900 mb-1 group-hover:text-orange-700 uppercase tracking-tight">5. Manejo</h4>
                                    <p className="text-[10px] text-orange-700/70 line-clamp-3 leading-tight font-medium">{data.ungrdAnalysis?.management?.observation || "Sin análisis."}</p>
                                </div>
                                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1 mt-2 bg-white/50 w-fit px-2 py-1 rounded">Respuesta <ArrowRight size={10}/></span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* NEW IMPACT & ACTORS TAB (Replaced 'contractor') */}
            {activeTab === 'impact' && (
                <div className="space-y-8 animate-fade-in">
                    {/* Header */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2"><Network className="text-blue-600"/> Mapa de Actores</h3>
                            <p className="text-sm text-slate-500">Mapeo de interesados y estructura del ecosistema social.</p>
                        </div>
                        <button onClick={handleAnalyzeSocial} disabled={isAnalyzingSocial} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-slate-800 transition flex items-center gap-2">
                             {isAnalyzingSocial ? <Loader2 className="animate-spin"/> : <Sparkles/>} Recalcular Impacto
                        </button>
                    </div>

                    {!socialEcosystem ? (
                        <div className="text-center py-20 text-slate-400 italic bg-white rounded-2xl border border-dashed border-gray-200">
                             Datos no disponibles. Intente refrescar el análisis.
                        </div>
                    ) : (
                        <div className="space-y-8">
                             {/* Actors List - Refined Design */}
                             <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                        <Users2 className="text-blue-600"/> Actores Clave
                                    </h4>
                                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-wider">Ecosistema</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-gray-100">
                                        <div className="col-span-4">Actor</div>
                                        <div className="col-span-4">Rol / Función</div>
                                        <div className="col-span-2 text-center">Categoría</div>
                                        <div className="col-span-2 text-right">Impacto</div>
                                    </div>
                                    {(socialEcosystem.actors || []).map((actor, i) => (
                                        <div key={i} className="group relative bg-white hover:bg-slate-50 border border-transparent hover:border-gray-200 rounded-xl p-4 transition-all duration-300 grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-4 font-bold text-slate-900 text-sm">{actor.name}</div>
                                            <div className="col-span-4 text-xs text-slate-500 font-medium">{actor.role}</div>
                                            <div className="col-span-2 flex justify-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                    actor.category === 'Executor' ? 'bg-indigo-100 text-indigo-600' :
                                                    actor.category === 'Control' ? 'bg-amber-100 text-amber-600' :
                                                    actor.category === 'Beneficiario' ? 'bg-emerald-100 text-emerald-600' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                    {actor.category}
                                                </span>
                                            </div>
                                            <div className="col-span-2 flex justify-end">
                                                <div className="flex gap-1">
                                                    {[1,2,3].map(d => (
                                                        <div key={d} className={`w-2 h-2 rounded-full ${
                                                            (actor.impactLevel === 'Alto' && d <= 3) || 
                                                            (actor.impactLevel === 'Medio' && d <= 2) || 
                                                            (actor.impactLevel === 'Bajo' && d <= 1) 
                                                            ? 'bg-blue-600' : 'bg-gray-200'
                                                        }`}></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>

                             {/* Bottom Cards: Target Population & Social Return */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 {/* Population Card */}
                                 <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg relative overflow-hidden">
                                     <div className="relative z-10">
                                         <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-4"><Users size={18} className="text-emerald-500"/> Población Objetivo</h4>
                                         <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                             {socialEcosystem.targetPopulation?.description || socialEcosystem.beneficiaryDescription || "Descripción no disponible."}
                                         </p>
                                         <div className="flex flex-wrap gap-2">
                                             {(socialEcosystem.targetPopulation?.characteristics || []).map((char, i) => (
                                                 <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-100">
                                                     {char}
                                                 </span>
                                             ))}
                                             {(socialEcosystem.targetPopulation?.characteristics || []).length === 0 && <span className="text-slate-400 text-xs italic">Sin características detalladas.</span>}
                                         </div>
                                     </div>
                                     {/* Decoration */}
                                     <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                                         <Users size={150}/>
                                     </div>
                                 </div>

                                 {/* Social Return Card */}
                                 <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border border-blue-100 shadow-lg relative overflow-hidden flex flex-col justify-center">
                                     <h4 className="font-bold text-blue-900 text-xs uppercase tracking-widest mb-2">Retorno Social</h4>
                                     <div className="relative z-10">
                                         <p className="text-xl font-serif text-slate-800 italic leading-relaxed">
                                             "{socialEcosystem.socialReturnQuote || "El proyecto genera un impacto positivo estándar en la comunidad."}"
                                         </p>
                                     </div>
                                     <Sparkles className="absolute top-6 right-6 text-blue-200" size={48}/>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>
            )}

            {/* ... (Keep other tabs as is) ... */}
            {activeTab === 'execution' && (
                <ExecutionCenter 
                    data={data}
                    milestones={milestones}
                    setMilestones={setMilestones}
                    resourceInventory={resourceInventory}
                    setResourceInventory={setResourceInventory}
                    dynamicBottlenecks={dynamicBottlenecks}
                    handleBottleneckClick={handleBottleneckClick}
                    formatCurrency={formatCurrency}
                />
            )}

            {activeTab === 'financial' && (
                 <div className="space-y-8 animate-fade-in">
                     {/* Financial Smart Cards */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         <FinancialSmartCard 
                            title="Salud Financiera" 
                            value={financialAnalysisResult?.healthScore ? `${financialAnalysisResult.healthScore}/100` : `${calculatedMetrics.cpi.toFixed(2)} CPI`} 
                            subtext={financialAnalysisResult?.diagnosis || (calculatedMetrics.cpi < 1 ? "Ineficiente" : "Saludable")} 
                            type="gauge" 
                            data={financialAnalysisResult?.healthScore ? financialAnalysisResult.healthScore / 100 : calculatedMetrics.cpi} 
                            color={calculatedMetrics.cpi < 1 ? '#ef4444' : '#10b981'}
                            metricKey="healthScore"
                         />
                         <FinancialSmartCard 
                            title="Burn Rate (Mes)" 
                            value={formatCurrency(calculatedMetrics.burnRate ? calculatedMetrics.burnRate * 30 : 0)} 
                            subtext="Velocidad de Gasto" 
                            type="bar" 
                            data={[{ name: 'Burn', value: calculatedMetrics.burnRate * 30 }]} 
                            color="#f59e0b"
                            metricKey="burnRate"
                         />
                         <FinancialSmartCard 
                            title="Proyección Final (EAC)" 
                            value={formatCurrency(financialAnalysisResult?.forecast?.eac || calculatedMetrics.eac)} 
                            subtext={`Var: ${formatCurrency((financialAnalysisResult?.forecast?.eac || calculatedMetrics.eac) - data.totalBudget)}`} 
                            type="radial" 
                            data={Math.min(100, (data.spentBudget / (financialAnalysisResult?.forecast?.eac || calculatedMetrics.eac)) * 100)} 
                            color="#3b82f6"
                            metricKey="eac"
                         />
                         <FinancialSmartCard 
                            title="Varianza Costo (CV)" 
                            value={formatCurrency(calculatedMetrics.actualCost - calculatedMetrics.earnedValue)} 
                            subtext={calculatedMetrics.actualCost > calculatedMetrics.earnedValue ? "Sobrecosto" : "Ahorro"} 
                            type="icon" 
                            data={null} 
                            color={calculatedMetrics.actualCost > calculatedMetrics.earnedValue ? "#ef4444" : "#10b981"}
                            metricKey="costVariance"
                         />
                     </div>

                     {/* NEW: CAPEX/OPEX Distribution Charts */}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-[300px]">
                             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><DollarSign size={16}/> Distribución del Gasto (CAPEX vs OPEX)</h4>
                             <ResponsiveContainer width="100%" height="90%">
                                <PieChart>
                                    <Pie 
                                        data={[
                                            { name: 'CAPEX (Inversión)', value: calculatedMetrics.capex },
                                            { name: 'OPEX (Operativo)', value: calculatedMetrics.opex }
                                        ]} 
                                        cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                                    >
                                        <Cell fill="#3b82f6" /> {/* CAPEX */}
                                        <Cell fill="#f59e0b" /> {/* OPEX */}
                                    </Pie>
                                    <Tooltip formatter={(val: number) => formatCurrency(val)}/>
                                    <Legend />
                                </PieChart>
                             </ResponsiveContainer>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-[300px]">
                             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Target size={16}/> Enfoque Estratégico (Proactivo vs Reactivo)</h4>
                             {milestones.filter(m => m.strategicType).length > 0 ? (
                                 <ResponsiveContainer width="100%" height="90%">
                                    <BarChart data={[
                                        { name: 'Proactivo', value: milestones.filter(m => m.strategicType === 'Proactive').length },
                                        { name: 'Reactivo', value: milestones.filter(m => m.strategicType === 'Reactive').length }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                        <XAxis dataKey="name" tick={{fontSize: 12}}/>
                                        <YAxis allowDecimals={false}/>
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]}>
                                            <Cell fill="#10b981"/>
                                            <Cell fill="#f43f5e"/>
                                        </Bar>
                                    </BarChart>
                                 </ResponsiveContainer>
                             ) : (
                                 <div className="h-full flex items-center justify-center text-slate-400 italic">Datos insuficientes para clasificación estratégica.</div>
                             )}
                        </div>
                     </div>

                     <div className="flex justify-between items-center">
                         <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2"><Banknote size={20} className="text-green-600"/> Inteligencia Financiera</h3>
                         <div className="flex gap-2">
                             <button onClick={() => setIsMontecarloOpen(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition border border-gray-200">
                                 <SigmaIcon size={16}/> Simulador Montecarlo
                             </button>
                             <button onClick={handleRunFinancialDeepAnalysis} disabled={isAnalyzingFinance} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-slate-800 transition">
                                 {isAnalyzingFinance ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>} Auditoría Profunda
                             </button>
                         </div>
                     </div>
                     
                     {/* Financial Deep Analysis Result */}
                     <BaseModal isOpen={isFinancialModalOpen} onClose={() => setIsFinancialModalOpen(false)} title="Auditoría Financiera Predictiva">
                         {isAnalyzingFinance ? (
                             <div className="text-center py-20 flex flex-col items-center">
                                 <Loader2 size={48} className="text-blue-600 animate-spin mb-4"/>
                                 <p className="text-slate-600 font-medium">Conciliando Presupuesto vs Ejecución...</p>
                             </div>
                         ) : financialAnalysisResult ? (
                             <div className="space-y-8 animate-fade-in">
                                 {/* Summary Header */}
                                 <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center shadow-lg">
                                     <div>
                                         <h4 className="font-bold text-lg mb-1">Diagnóstico CFO</h4>
                                         <p className="text-slate-300 text-sm max-w-xl">"{financialAnalysisResult.diagnosis}"</p>
                                     </div>
                                     <div className="text-right">
                                         <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Estado Proyectado</div>
                                         <div className={`text-3xl font-black ${financialAnalysisResult.forecast.projectedStatus === 'Déficit' ? 'text-red-400' : 'text-green-400'}`}>{financialAnalysisResult.forecast.projectedStatus}</div>
                                     </div>
                                 </div>

                                 {/* BIG MAC INDEX SECTION (NEW) */}
                                 {financialAnalysisResult.bigMacIndex && (
                                     <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                                         <div className="flex flex-col md:flex-row gap-8 items-center">
                                             <div className="flex-1">
                                                 <div className="flex items-center gap-2 mb-4">
                                                     <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><Coins size={24}/></div>
                                                     <h3 className="text-xl font-bold text-slate-900">Índice Big Mac & PPP</h3>
                                                 </div>
                                                 <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                                     El Big Mac cuesta <span className="font-bold text-slate-900">{formatCurrency(financialAnalysisResult.bigMacIndex.localPrice)}</span> en Colombia y <span className="font-bold text-slate-900">US${financialAnalysisResult.bigMacIndex.dollarPrice}</span> en Estados Unidos. 
                                                     La tasa de cambio implícita es <span className="font-mono font-bold text-blue-600">{financialAnalysisResult.bigMacIndex.impliedExchangeRate.toFixed(0)}</span>.
                                                 </p>
                                                 <div className="mb-4">
                                                     <div className="flex justify-between text-xs font-bold uppercase text-slate-400 mb-1">
                                                         <span>Tasa Implícita</span>
                                                         <span>TRM Mercado ({financialAnalysisResult.bigMacIndex.actualExchangeRate})</span>
                                                     </div>
                                                     <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden relative">
                                                         {/* Market Marker */}
                                                         <div className="absolute top-0 bottom-0 w-1 bg-slate-400 z-10" style={{left: '70%'}} title="TRM Actual"></div>
                                                         {/* Implied Bar */}
                                                         <div 
                                                            className={`h-full rounded-full ${financialAnalysisResult.bigMacIndex.currencyValuationPercent < 0 ? 'bg-red-500' : 'bg-blue-500'}`} 
                                                            style={{width: `${Math.min(100, (financialAnalysisResult.bigMacIndex.impliedExchangeRate / (financialAnalysisResult.bigMacIndex.actualExchangeRate * 1.5)) * 100)}%`}}
                                                         ></div>
                                                     </div>
                                                 </div>
                                                 <p className={`text-lg font-black ${financialAnalysisResult.bigMacIndex.currencyValuationPercent < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                                                     {Math.abs(financialAnalysisResult.bigMacIndex.currencyValuationPercent).toFixed(1)}% {financialAnalysisResult.bigMacIndex.currencyValuationPercent < 0 ? 'Subvaluado' : 'Sobrevaluado'}
                                                 </p>
                                             </div>
                                             <div className="w-full md:w-1/3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                 <h5 className="text-xs font-bold uppercase text-slate-400 mb-2">Impacto en Proyecto</h5>
                                                 <p className="text-sm text-slate-700 italic">"{financialAnalysisResult.bigMacIndex.purchasingPowerParityAction}"</p>
                                             </div>
                                         </div>
                                     </div>
                                 )}

                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                     {/* Concatenation Analysis */}
                                     <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                         <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><GitMerge className="text-purple-600"/> Concatenación (Presupuesto vs Ejecución)</h5>
                                         <p className="text-sm text-slate-600 mb-4 italic">{financialAnalysisResult.concatenationAnalysis.budgetVsExecutionGap}</p>
                                         
                                         <div className="space-y-3">
                                             {(financialAnalysisResult.concatenationAnalysis.flaggedDiscrepancies || []).map((disc, i) => (
                                                 <div key={i} className="bg-red-50 p-3 rounded-lg border border-red-100 flex justify-between items-center text-sm">
                                                     <div className="font-bold text-red-900">{disc.activityName}</div>
                                                     <div className="text-red-700 font-mono">{disc.variance}</div>
                                                 </div>
                                             ))}
                                             {(financialAnalysisResult.concatenationAnalysis.flaggedDiscrepancies || []).length === 0 && <div className="text-center text-slate-400 text-sm py-4">Sin discrepancias críticas detectadas.</div>}
                                         </div>
                                     </div>

                                     {/* Optimization Strategies */}
                                     <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-inner">
                                         <h5 className="font-bold text-emerald-900 mb-4 flex items-center gap-2"><TrendingUp className="text-emerald-600"/> Estrategias de Optimización</h5>
                                         <div className="space-y-4">
                                             {(financialAnalysisResult.optimizationStrategies || []).map((strat, i) => (
                                                 <div key={i} className="bg-white/60 p-4 rounded-xl border border-emerald-100">
                                                     <div className="flex justify-between items-start mb-1">
                                                         <h6 className="font-bold text-emerald-800 text-sm">{strat.title}</h6>
                                                         <span className="bg-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{strat.impact}</span>
                                                     </div>
                                                     <p className="text-xs text-emerald-700 leading-relaxed">{strat.action}</p>
                                                 </div>
                                             ))}
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         ) : financialAnalysisError ? (
                             <div className="text-center py-20 text-red-500 font-bold">{financialAnalysisError}</div>
                         ) : null}
                     </BaseModal>
                 </div>
            )}

            {activeTab === 'risks' && (
                <div className="space-y-8 animate-fade-in">
                    {/* NEW: SPF Radar Section (NASA/JWST) */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
                        <div className="flex justify-between items-start z-10 relative">
                            <div>
                                <h3 className="text-xl font-black flex items-center gap-2 text-red-400"><Crosshair className="animate-pulse"/> SPF Radar (Single Points of Failure)</h3>
                                <p className="text-slate-400 text-sm max-w-xl mt-1">Metodología JWST para detección de puntos únicos de fallo catastrófico.</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-black text-red-500">{identifiedSPFs.length}</div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">SPFs Activos</div>
                            </div>
                        </div>

                        {identifiedSPFs.length > 0 ? (
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 z-10 relative">
                                {identifiedSPFs.map((spf, i) => (
                                    <div key={i} className="bg-white/10 p-4 rounded-xl border border-white/10 hover:bg-white/20 transition cursor-pointer group" onClick={() => handleSPFClick(spf.name)}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h5 className="font-bold text-red-200 text-sm group-hover:text-white transition-colors">{spf.name}</h5>
                                            <ArrowUpRight size={14} className="text-slate-500 group-hover:text-white"/>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-2">{spf.reason}</p>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] bg-red-900/50 text-red-300 px-2 py-0.5 rounded border border-red-900/50">Crítico</span>
                                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">Ruta Crítica</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 p-4 bg-green-900/20 border border-green-900/30 rounded-xl text-green-400 text-sm font-medium text-center z-10 relative">
                                Sistema estable. No se detectan puntos únicos de fallo inminentes bajo umbral crítico.
                            </div>
                        )}
                        
                        {/* Radar Decoration */}
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 border-[20px] border-red-500/5 rounded-full z-0 pointer-events-none"></div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 border-[20px] border-red-500/10 rounded-full z-0 pointer-events-none"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Matrix - Interactive */}
                        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4 text-center">Matriz de Calor</h3>
                            <div className="grid grid-cols-3 gap-1 aspect-square relative">
                                {/* Axis Labels */}
                                <div className="absolute -left-6 top-0 bottom-0 flex items-center justify-center -rotate-90 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impacto</div>
                                <div className="absolute left-0 right-0 -bottom-6 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Probabilidad</div>

                                {/* Cells */}
                                {['High', 'Medium', 'Low'].map((imp, rIdx) => 
                                    ['Low', 'Medium', 'High'].map((prob, cIdx) => {
                                        const count = getRisksByLevel(prob, imp).length;
                                        const isCritical = (rIdx === 0 && cIdx === 2);
                                        const isHigh = (rIdx === 0 && cIdx === 1) || (rIdx === 1 && cIdx === 2);
                                        const isMedium = (rIdx === 0 && cIdx === 0) || (rIdx === 1 && cIdx === 1) || (rIdx === 2 && cIdx === 2);
                                        
                                        let bg = 'bg-green-100 hover:bg-green-200';
                                        if (isCritical) bg = 'bg-red-500 text-white hover:bg-red-600 shadow-inner';
                                        else if (isHigh) bg = 'bg-orange-400 text-white hover:bg-orange-500';
                                        else if (isMedium) bg = 'bg-yellow-300 hover:bg-yellow-400';
                                        
                                        return (
                                            <div 
                                                key={`${imp}-${prob}`} 
                                                onClick={() => setRiskFilter(riskFilter?.prob === prob && riskFilter?.imp === imp ? null : {prob, imp})}
                                                className={`rounded-lg flex items-center justify-center text-xl font-bold cursor-pointer transition-all transform hover:scale-105 ${bg} ${riskFilter?.prob === prob && riskFilter?.imp === imp ? 'ring-4 ring-blue-400 z-10' : ''}`}
                                            >
                                                {count}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* List */}
                        <div className="lg:col-span-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2"><ShieldAlert className="text-red-600"/> Riesgos Detectados</h3>
                                {riskFilter && <button onClick={() => setRiskFilter(null)} className="text-xs text-blue-600 hover:underline font-bold">Ver Todos</button>}
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="divide-y divide-gray-100">
                                    {filteredRisks.map((risk, i) => (
                                        <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center">
                                            <div className="flex-1">
                                                <h5 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                                    {risk.risk}
                                                    {risk.isSPF && <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">SPF</span>}
                                                </h5>
                                                <div className="text-xs text-slate-500 mt-1 flex gap-2">
                                                    <span className={`px-2 py-0.5 rounded border ${getImpColor(risk.impact)}`}>Imp: {risk.impact}</span>
                                                    <span className={`px-2 py-0.5 rounded border ${getProbColor(risk.probability)}`}>Prob: {risk.probability}</span>
                                                </div>
                                            </div>
                                            <div className="md:w-1/3 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                                <strong>Mitigación:</strong> {risk.mitigation || "Pendiente"}
                                            </div>
                                            <button onClick={() => handleAnalyzeRiskMitigation(risk)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Generar Estrategia ISO 31000">
                                                <Sparkles size={18}/>
                                            </button>
                                        </div>
                                    ))}
                                    {filteredRisks.length === 0 && <div className="p-8 text-center text-slate-400 italic">No hay riesgos en esta categoría.</div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ... (Rest of activeTab conditions: pmbok, photos, assistant) ... */}
            {activeTab === 'pmbok' && (
                <div className="space-y-8 animate-fade-in">
                    {/* Header Action */}
                    <div className="bg-indigo-900 text-white p-8 rounded-2xl shadow-xl flex justify-between items-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-2 flex items-center gap-3"><BookOpen/> Estándar PMBOK 7 (PMI)</h3>
                            <p className="text-indigo-200 max-w-xl">Evaluación de los 12 principios de gestión de proyectos para asegurar la entrega de valor.</p>
                        </div>
                        <div className="relative z-10">
                            <button onClick={handleRunPMBOKAnalysis} disabled={isAnalyzingPMBOK} className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition flex items-center gap-2">
                                {isAnalyzingPMBOK ? <Loader2 className="animate-spin"/> : <Sparkles/>} Ejecutar Auditoría PMI
                            </button>
                        </div>
                        {/* Background Decoration */}
                        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-800 to-transparent skew-x-12 opacity-50"></div>
                    </div>

                    {!pmbokData ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <div className="text-slate-400 mb-4">El análisis PMBOK no se ha generado aún.</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {(pmbokData.principles || []).map((p, i) => (
                                <div key={i} onClick={() => handlePMBOKClick(p)} className={`p-6 rounded-2xl border transition-all cursor-pointer group hover:shadow-lg relative overflow-hidden ${p.score && p.score >= 8 ? 'bg-white border-green-200 hover:border-green-400' : p.score && p.score >= 5 ? 'bg-white border-yellow-200 hover:border-yellow-400' : 'bg-white border-red-200 hover:border-red-400'}`}>
                                    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform ${p.score && p.score >= 8 ? 'text-green-600' : p.score && p.score >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {getPMBOKIcon(p.englishName || "")}
                                    </div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className={`text-2xl font-black ${p.score && p.score >= 8 ? 'text-green-600' : p.score && p.score >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>{p.score}/10</div>
                                            <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${p.status === 'Optimized' ? 'bg-green-100 text-green-700' : p.status === 'Managed' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.status}</div>
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-2 truncate" title={p.name}>{p.name}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{p.reasoning}</p>
                                        
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-1 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Ver Deep Dive <ArrowRight size={12}/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {/* PMBOK DEEP DIVE MODAL */}
            <BaseModal isOpen={!!activePMBOKPrinciple} onClose={() => setActivePMBOKPrinciple(null)} title={`Deep Dive: ${activePMBOKPrinciple?.name}`}>
                {isPMBOKDeepAnalyzing ? (
                    <div className="text-center py-20 flex flex-col items-center">
                        <Loader2 size={48} className="text-indigo-600 animate-spin mb-4"/>
                        <p className="text-slate-600 font-medium">Consultando Estándar PMI...</p>
                    </div>
                ) : pmbokDeepAnalysisResult ? (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                             <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><Stethoscope size={18} className="text-blue-600"/> Diagnóstico</h4>
                             <p className="text-slate-700 leading-relaxed">{pmbokDeepAnalysisResult.diagnosis}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2"><CheckCircle size={18}/> Fortalezas</h4>
                                <ul className="space-y-2">
                                    {(pmbokDeepAnalysisResult.strengths || []).map((s, i) => <li key={i} className="text-sm text-green-700 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>{s}</li>)}
                                </ul>
                            </div>
                            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2"><AlertTriangle size={18}/> Debilidades</h4>
                                <ul className="space-y-2">
                                    {(pmbokDeepAnalysisResult.weaknesses || []).map((s, i) => <li key={i} className="text-sm text-red-700 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>{s}</li>)}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-inner">
                            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2"><Rocket size={18}/> Plan de Acción Inmediato</h4>
                            <div className="space-y-3">
                                {(pmbokDeepAnalysisResult.actionableSteps || []).map((step, i) => (
                                    <div key={i} className="bg-white p-3 rounded-lg border border-blue-100 text-sm text-blue-800 font-medium flex gap-3">
                                        <span className="font-black text-blue-300">{i+1}.</span> {step}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                 <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Impacto en KPIs</h5>
                                 <p className="text-sm font-bold text-slate-800">{pmbokDeepAnalysisResult.kpiImpact}</p>
                             </div>
                             <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                 <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Simulación de Consecuencia</h5>
                                 <p className="text-sm text-slate-600 italic">"{pmbokDeepAnalysisResult.consequenceSimulation}"</p>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 text-red-500">{pmbokAnalysisError || "No se pudo cargar el análisis."}</div>
                )}
            </BaseModal>

            {activeTab === 'assistant' && (
                <div className="flex flex-col h-[600px] bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                        {chatHistory.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-none' 
                                    : 'bg-white border border-gray-200 text-slate-700 rounded-tl-none'
                                }`}>
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                                    <div className={`text-[10px] mt-2 opacity-60 font-medium ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-3">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Pregunta sobre riesgos, presupuesto o cronograma..."
                            className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm font-medium placeholder-slate-400"
                            disabled={isChatLoading}
                        />
                        <button 
                            type="submit" 
                            disabled={!chatInput.trim() || isChatLoading}
                            className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
                        >
                            <ArrowUp size={20} />
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'photos' && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
                        <Camera size={32} className="text-slate-300"/>
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">Registro Fotográfico Forense</h3>
                    <p className="text-slate-400 text-sm">Módulo de evidencia visual en desarrollo.</p>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};
