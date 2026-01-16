
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine,
    LineChart, Line, Legend, AreaChart, Area, LabelList, Label,
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
    CalendarDays,
    MoreHorizontal
} from 'lucide-react';
import { ProjectData, ChatMessage, RiskItem, Bottleneck, ProjectMilestone, GrekoAction, PMBOKPrinciple, PMBOKDeepAnalysis, BottleneckDeepAnalysis, LegalDocument, ResourceAnalysis, FinancialProtectionDeepAnalysis, ResourceInventory, ContractorProfile, ProgressAudit, CorrectiveDeepAnalysis, ActivityDeepAnalysis, KnowledgeDeepAnalysis, ManagementDeepAnalysis, Personnel, Machinery, Equipment, GrekoCronosDeepAnalysis, FinancialDeepAnalysis, EvolutionLog, CapexOpexDeepAnalysis, ConvergenceMetrics, ValueEngineeringAction, MacroeconomicData, INITIAL_PROJECT_DATA } from '../types';
import { askProjectQuestion, generateMitigationSuggestion, analyzePOTAlignment, analyzeGrekoCronos, analyzePMBOK7, analyzePMBOKPrincipleDeep, analyzeBottleneckDeep, generateAdministrativeDocument, analyzeResourceSufficiency, analyzeFinancialProtectionDeep, analyzeFinancialDeep, analyzeContractorRisk, analyzeCorrectiveDeep, analyzeCriticalPath, analyzeActivityDeep, analyzeKnowledgeDeep, analyzeManagementDeep, searchProjectInfo, updateProjectWithNewData, analyzeCapexOpexDeep } from '../services/geminiService';

interface DashboardProps {
    data: ProjectData;
    onReset: () => void;
    onUpdate: (data: ProjectData) => void;
}

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#10b981', '#34d399', '#f59e0b', '#fbbf24', '#ef4444', '#f87171'];

// EDUCATIONAL CONTENT FOR METRICS
const METRIC_DEFINITIONS: Record<string, { title: string, definition: string, formula: string, impact: string, improvement: string, icon: React.ReactNode }> = {
    cpi: {
        title: "Índice de Desempeño de Costos (CPI)",
        definition: "Mide la eficiencia financiera del proyecto. Representa cuánto valor real (trabajo completado) obtenemos por cada peso gastado.",
        formula: "CPI = EV (Valor Ganado) / AC (Costo Actual)",
        impact: "CPI < 1.0: Sobrecostos (Ineficiente). CPI > 1.0: Ahorro (Eficiente). Un CPI de 0.8 significa que por cada $100 gastados, solo avanzamos $80 en obra.",
        improvement: "Controlar horas extras, renegociar precios de materiales o aumentar la productividad del personal.",
        icon: <Coins size={32} />
    },
    spi: {
        title: "Índice de Desempeño del Cronograma (SPI)",
        definition: "Mide la eficiencia del tiempo. Indica si la obra avanza más rápido o más lento de lo planificado a la fecha de corte.",
        formula: "SPI = EV (Valor Ganado) / PV (Valor Planeado)",
        impact: "SPI < 1.0: Retraso. SPI > 1.0: Adelanto. Un SPI de 0.9 indica que la obra avanza al 90% de la velocidad esperada.",
        improvement: "Implementar 'Fast-Tracking' (tareas paralelas) o 'Crashing' (más recursos a tareas críticas) para recuperar tiempo.",
        icon: <Clock size={32} />
    },
    bcRatio: {
        title: "Relación Beneficio-Costo (RBC)",
        definition: "Es un indicador financiero que compara directamente los beneficios brutos esperados de un proyecto con sus costos totales. Un valor superior a 1.0 indica que los beneficios superan los costos.",
        formula: "RBC = V.P. (Beneficios) / V.P. (Costos)",
        impact: "Determina la viabilidad social y económica. Si es < 1, el proyecto destruye valor y podría ser objeto de hallazgos fiscales por detrimento patrimonial.",
        improvement: "Optimizar el diseño para reducir costos operativos (OPEX) o ampliar el alcance de beneficiarios para aumentar el valor social cuantificable.",
        icon: <ScaleIcon size={32} />
    },
    burnRate: {
        title: "Tasa de Quema (Burn Rate)",
        definition: "Mide la velocidad a la que el proyecto 'consume' su presupuesto disponible por unidad de tiempo (diario).",
        formula: "Burn Rate = Presupuesto Ejecutado / Días Transcurridos",
        impact: "Una tasa muy baja indica sub-ejecución. Una tasa muy alta indica insolvencia inminente antes de terminar la obra.",
        improvement: "Alinear los flujos de caja con los hitos críticos. Si es baja, desbloquear frentes de obra. Si es alta, revisar rendimientos de recursos.",
        icon: <Flame size={32} />
    },
    costVariance: {
        title: "Varianza de Costo (CV)",
        definition: "Es la diferencia financiera entre el valor del trabajo realmente realizado (Valor Ganado - EV) y lo que se ha gastado para lograrlo (Costo Actual - AC).",
        formula: "CV = EV (Earned Value) - AC (Actual Cost)",
        impact: "CV Positivo (+): El proyecto está por debajo del presupuesto (Ahorro). CV Negativo (-): El proyecto tiene sobrecostos.",
        improvement: "Implementar controles de cambio estrictos, renegociar tarifas con proveedores o mejorar la productividad.",
        icon: <MinusCircle size={32} />
    },
    eac: {
        title: "Estimado a la Conclusión (EAC)",
        definition: "Proyección financiera que estima cuánto costará el proyecto al finalizar, basándose en el desempeño actual (CPI). Es vital para prever necesidades de adición presupuestal.",
        formula: "EAC = Presupuesto Total (BAC) / CPI Actual",
        impact: "Si EAC > Presupuesto, se requerirán recursos adicionales. Permite a la gerencia actuar meses antes de que se acabe el dinero.",
        improvement: "Mejorar el CPI en las fases restantes del proyecto para reducir el EAC proyectado.",
        icon: <TrendingUp size={32} />
    },
    healthScore: {
        title: "Índice de Salud Financiera",
        definition: "Score compuesto (0-100) calculado por la IA que integra CPI, SPI, Riesgos materializados y Flujo de Caja.",
        formula: "Algoritmo Ponderado (AI Weighted Score)",
        impact: "0-50: Crítico (Intervención Inmediata). 51-80: Alerta (Monitoreo). 81-100: Saludable.",
        improvement: "Gestión integral de riesgos y control de cambios riguroso.",
        icon: <Stethoscope size={32} />
    },
    runway: {
        title: "Runway Financiero (Vida Útil)",
        definition: "Tiempo estimado (en días/meses) que el proyecto puede seguir operando con el saldo actual antes de quedarse sin liquidez.",
        formula: "Runway = (Presupuesto - Ejecutado) / Burn Rate Mensual",
        impact: "Si el Runway es menor al tiempo faltante de contrato, el proyecto se detendrá por iliquidez.",
        improvement: "Solicitar adiciones presupuestales, inyecciones de capital o reducir el alcance de gastos no críticos.",
        icon: <Hourglass size={32} />
    },
    isi: {
        title: "Integrated Speed Index (ISI)",
        definition: "Métrica avanzada de mega-proyectos (Estándar Chino) que integra el avance físico, la movilización de recursos y la eficiencia de tiempo.",
        formula: "ISI = (Avance Físico % / Tiempo Transcurrido %) * (Mobilization Efficiency)",
        impact: "> 1.0: Convergencia Acelerada. < 1.0: Divergencia Crítica. Mide si el proyecto está ganando o perdiendo inercia.",
        improvement: "Optimizar la logística de materiales y la tasa de ocupación de maquinaria pesada.",
        icon: <Zap size={32} />
    }
};

// --- PREMIUM FINANCIAL COMPONENTS ---

const WaterfallBudgetChart: React.FC<{ planned: number; actual: number; eac: number; formatCurrency: (v: number) => string }> = ({ planned, actual, eac, formatCurrency }) => {
    const variance = eac - planned;
    const data = [
        { name: 'Prip. Original', value: planned, fill: '#64748b' },
        { name: 'Ejecutado', value: actual, fill: '#3b82f6' },
        { name: 'Proyección', value: eac, fill: variance > 0 ? '#ef4444' : '#10b981' },
    ];

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                    <ReferenceLine y={planned} stroke="#64748b" strokeDasharray="3 3" label={{ position: 'top', value: 'Base', fill: '#64748b', fontSize: 10 }} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const SensitivityDashboard: React.FC<{ factors: { scenario: string; impactOnEAC: number; impactOnTir: number; mitigationStrategy: string }[]; formatCurrency: (v: number) => string }> = ({ factors, formatCurrency }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {factors.map((f, i) => (
                <div key={i} className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl overflow-hidden relative group hover:border-blue-500/50 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={64} className="text-yellow-400" /></div>
                    <h5 className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-3 leading-none italic">Escenario: {f.scenario}</h5>
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Impacto Proyectado EAC</div>
                            <div className="text-xl font-black text-white">+{formatCurrency(f.impactOnEAC)}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Efecto en TIR</div>
                            <div className={`text-lg font-black ${f.impactOnTir < 0 ? 'text-red-400' : 'text-green-400'}`}>{f.impactOnTir}%</div>
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-2"><ShieldCheck size={12} className="text-green-500" /> Estrategia de Mitigación</div>
                        <p className="text-xs text-slate-300 italic">"{f.mitigationStrategy}"</p>
                    </div>
                </div>
            ))}
        </div>
    );
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

// --- NEW WIDGET: Execution Status Summary ---
const ExecutionStatusWidget: React.FC<{
    startDate: string;
    endDate: string;
    progress: number;
    financialProgress: number;
    totalBudget: number;
}> = ({ startDate, endDate, progress, financialProgress, totalBudget }) => {

    // Calculations
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    const totalDuration = Math.max(1, end.getTime() - start.getTime());
    const elapsed = Math.max(0, today.getTime() - start.getTime());

    // Percentages (0-100)
    const timeProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    const physicalProgress = Math.min(100, Math.max(0, progress));
    const moneyProgress = Math.min(100, Math.max(0, financialProgress));

    // Logic for Status
    const gap = physicalProgress - timeProgress;
    let status: 'A Tiempo' | 'Desviación' | 'Retraso Crítico' | 'Adelantado' = 'A Tiempo';
    let statusColor = 'text-green-600 bg-green-100 border-green-200';

    if (gap < -15) { status = 'Retraso Crítico'; statusColor = 'text-red-700 bg-red-100 border-red-200'; }
    else if (gap < -5) { status = 'Desviación'; statusColor = 'text-orange-700 bg-orange-100 border-orange-200'; }
    else if (gap > 5) { status = 'Adelantado'; statusColor = 'text-blue-700 bg-blue-100 border-blue-200'; }

    // Dynamic Narrative
    const narrative = useMemo(() => {
        const daysRemaining = Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 3600 * 24)));
        let text = `El proyecto ha consumido el ${timeProgress.toFixed(1)}% de su tiempo contractual. `;

        if (status === 'Retraso Crítico') {
            text += `Existe una brecha grave del ${Math.abs(gap).toFixed(1)}% entre el avance físico real (${physicalProgress}%) y el tiempo transcurrido. Se requiere un plan de choque inmediato para los ${daysRemaining} días restantes.`;
        } else if (status === 'Desviación') {
            text += `Se observa una desviación moderada. El avance físico (${physicalProgress}%) no compensa el tiempo transcurrido. Se sugiere aumentar frentes de trabajo.`;
        } else if (status === 'Adelantado') {
            text += `La ejecución física (${physicalProgress}%) supera la línea base de tiempo, indicando una alta eficiencia operativa.`;
        } else {
            text += `El avance físico (${physicalProgress}%) es coherente con el cronograma previsto. El proyecto marcha según lo planeado.`;
        }

        // Financial insight
        const finGap = moneyProgress - physicalProgress;
        if (finGap > 10) text += ` Atención: La ejecución financiera (${moneyProgress.toFixed(1)}%) es superior a la física, lo que sugiere anticipos no amortizados o pagos adelantados.`;

        return text;
    }, [timeProgress, physicalProgress, moneyProgress, status, gap]);

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8 animate-fade-in group hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                        <Activity size={20} className="text-blue-600" />
                        Estado de Ejecución (Corte: {today.toLocaleDateString()})
                    </h3>
                    <p className="text-sm text-slate-500">Comparativa visual de Tiempo vs. Avance Físico vs. Ejecución Financiera.</p>
                </div>
                <div className={`px-4 py-2 rounded-lg border font-bold text-sm uppercase tracking-wide flex items-center gap-2 ${statusColor}`}>
                    {status === 'Retraso Crítico' ? <AlertTriangle size={16} /> : status === 'Adelantado' ? <Rocket size={16} /> : <Clock size={16} />}
                    {status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Progress Bars Section */}
                <div className="lg:col-span-7 space-y-5">
                    {/* Time */}
                    <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                            <span>Tiempo Transcurrido</span>
                            <span>{timeProgress.toFixed(1)}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-400 rounded-full transition-all duration-1000" style={{ width: `${timeProgress}%` }}></div>
                        </div>
                    </div>

                    {/* Physical */}
                    <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                            <span>Avance Físico Real</span>
                            <span className="text-blue-600">{physicalProgress.toFixed(1)}%</span>
                        </div>
                        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                            {/* Marker for Time Baseline */}
                            <div className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10 opacity-30" style={{ left: `${timeProgress}%` }} title="Línea de Tiempo"></div>
                            <div className={`h-full rounded-full transition-all duration-1000 ${status === 'Retraso Crítico' ? 'bg-red-500' : status === 'Desviación' ? 'bg-orange-500' : 'bg-green-500'}`} style={{ width: `${physicalProgress}%` }}></div>
                        </div>
                    </div>

                    {/* Financial */}
                    <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">
                            <span>Ejecución Financiera</span>
                            <span className="text-emerald-600">{moneyProgress.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 opacity-70" style={{ width: `${moneyProgress}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Narrative Section */}
                <div className="lg:col-span-5">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 h-full flex flex-col justify-center">
                        <h5 className="font-bold text-slate-800 text-xs uppercase mb-3 flex items-center gap-2"><Bot size={14} className="text-blue-500" /> Diagnóstico IA</h5>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            "{narrative}"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const RealTimeHealthTicker: React.FC<{ metrics: { cpi: number, spi: number, healthScore: number } }> = ({ metrics }) => {
    return (
        <div className="bg-slate-900 text-white px-4 py-2 rounded-full flex items-center gap-6 shadow-xl border border-slate-700 animate-pulse-subtle mb-6 mx-auto w-max">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</span>
                <span className={`w-2 h-2 rounded-full ${metrics.healthScore > 80 ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_8px_rgba(34,197,94,0.6)]`}></span>
            </div>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">CPI</span>
                <span className={`text-sm font-black ${metrics.cpi < 1 ? 'text-red-400' : 'text-green-400'}`}>{metrics.cpi.toFixed(2)}</span>
            </div>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">SPI</span>
                <span className={`text-sm font-black ${metrics.spi < 1 ? 'text-orange-400' : 'text-blue-400'}`}>{metrics.spi.toFixed(2)}</span>
            </div>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Live Audit</span>
                <Activity size={12} className="text-blue-500 animate-spin-slow" />
            </div>
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
        } catch (e) { console.error(e); } finally { setIsCpmLoading(false); }
    };

    const handleActivityClick = async (m: ProjectMilestone) => {
        setActiveActivity(m);
        if (m.deepAnalysis) { setActivityAnalysis(m.deepAnalysis); return; }
        setActivityAnalysis(null); setIsActivityLoading(true);
        try {
            const res = await analyzeActivityDeep(m, { name: data.projectName, location: data.location.municipality });
            setActivityAnalysis(res);
            setMilestones(prev => prev.map(p => p.code === m.code ? { ...p, deepAnalysis: res } : p));
        } catch (e) { console.error(e); } finally { setIsActivityLoading(false); }
    };

    const handleResourceAnalysis = async () => {
        setIsResourceAnalyzing(true);
        try {
            const res = await analyzeResourceSufficiency(data);
            setResourceAnalysisResult(res);
            setResourceInventory(prev => ({ ...prev, deepAnalysis: res }));
        } catch (e) { console.error(e); } finally { setIsResourceAnalyzing(false); }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Activity Detail Modal (UPDATED WITH MITIGATION) */}
            <BaseModal isOpen={!!activeActivity} onClose={() => setActiveActivity(null)} title={`Ingeniería de Valor: ${activeActivity?.description}`}>
                {isActivityLoading ? <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-600" /></div> : activityAnalysis ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-green-50 p-5 rounded-2xl border border-green-200 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10"><TrendingUp size={48} className="text-green-600" /></div>
                                <h5 className="font-bold text-green-800 text-xs uppercase tracking-widest mb-2">Estrategia de Optimización</h5>
                                <p className="text-sm text-green-900 font-medium leading-relaxed mb-4">{activityAnalysis.optimizationStrategy}</p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[10px] text-green-700 font-bold uppercase mb-1">Costo Original</div>
                                        <div className="text-sm font-bold text-slate-500 line-through">{formatCurrency(activeActivity?.estimatedCost || 0)}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-green-700 font-bold uppercase mb-1">Ahorro Estimado</div>
                                        <div className="text-xl font-black text-green-600">{activityAnalysis.efficiencyGainEstimate}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-3">Tecnologías de Alto Impacto</h5>
                                <div className="space-y-3">
                                    {(activityAnalysis.suggestedTechnologies || []).map((t, i) => (
                                        <div key={i} className="flex gap-3 items-start p-2 bg-blue-50 rounded-xl border border-blue-100">
                                            <div className="p-1.5 bg-white rounded-lg text-blue-600 shadow-sm"><Zap size={14} /></div>
                                            <div>
                                                <div className="font-bold text-blue-900 text-[11px]">{t.name}</div>
                                                <div className="text-[10px] text-blue-700 leading-tight">{t.benefit}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RISKS WITH TECHNICAL MITIGATION */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                <ShieldAlert size={16} className="text-red-500" /> Riesgos de Ejecución & Mitigación Forense
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(activityAnalysis.specificExecutionRisks || []).map((item, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-colors">
                                        <div className="text-sm font-bold text-slate-800 mb-2">{item.risk}</div>
                                        <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-inner">
                                            <div className="text-[10px] font-black text-blue-600 uppercase mb-1 tracking-widest">Plan de Mitigación Técncia</div>
                                            <p className="text-xs text-slate-600 leading-relaxed font-medium italic">"{item.mitigation}"</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : <div className="text-center">Error al analizar.</div>}
            </BaseModal>

            {/* WBS SECTION */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-xl text-slate-900 flex items-center gap-2"><ListChecks size={20} className="text-blue-600" /> WBS & Cronograma</h3>
                        <p className="text-sm text-slate-500">Desglose de actividades y recursos inferidos.</p>
                    </div>
                    <button onClick={handleCpm} disabled={isCpmLoading} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 hover:bg-slate-800 transition-all">
                        {isCpmLoading ? <Loader2 className="animate-spin" size={16} /> : <GitMerge size={16} />}
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
                                <th className="p-3">Fechas</th>
                                <th className="p-3">Recursos (Inferidos)</th>
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
                                            {m.isCriticalPath && <AlertCircle size={14} className="text-red-500" title="Ruta Crítica" />}
                                            {m.description}
                                        </div>
                                        {m.code && <div className="text-xs text-slate-400 font-mono">{m.code}</div>}
                                    </td>
                                    <td className="p-3 text-xs text-slate-600">
                                        <div>In: {m.startDate || 'N/A'}</div>
                                        <div>Fi: {m.endDate || 'N/A'}</div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-wrap gap-1">
                                            {(m.inferredResources || []).slice(0, 2).map((r, j) => (
                                                <span key={j} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">{r.name} ({r.quantity})</span>
                                            ))}
                                            {(m.inferredResources || []).length > 2 && <span className="text-[10px] text-slate-400">+{m.inferredResources!.length - 2}</span>}
                                        </div>
                                    </td>
                                    <td className="p-3 text-right font-mono text-slate-700">{formatCurrency(m.estimatedCost || 0)}</td>
                                    <td className="p-3 text-center">
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${m.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${m.progress || 0}%` }}></div>
                                        </div>
                                        <div className="text-[10px] font-bold mt-1 text-slate-500">{m.progress || 0}%</div>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => handleActivityClick(m)} className="p-1.5 hover:bg-blue-100 rounded text-blue-600 transition-colors" title="Ingeniería de Valor"><Sparkles size={16} /></button>
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
                        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2"><Hammer size={20} className="text-orange-600" /> Inventario de Recursos</h3>
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
                                        <Users size={14} className="text-slate-400" />
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
                                        <Truck size={14} className="text-slate-400" />
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
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-6"><TrafficCone size={20} className="text-red-600" /> Cuellos de Botella Activos</h3>
                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] custom-scrollbar">
                        {dynamicBottlenecks.length > 0 ? dynamicBottlenecks.map((b, i) => (
                            <div key={i} onClick={() => handleBottleneckClick(b)} className="p-4 rounded-xl border border-red-100 bg-red-50/50 hover:bg-red-50 cursor-pointer transition-colors group">
                                <div className="flex justify-between items-start mb-1">
                                    <h5 className="font-bold text-red-900 text-sm group-hover:underline">{b.processName}</h5>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${b.impactLevel === 'Crítico' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>{b.impactLevel}</span>
                                </div>
                                <p className="text-xs text-red-800/70 mb-2 line-clamp-2">{b.description}</p>
                                <div className="flex justify-between items-center text-[10px] font-medium text-red-700">
                                    <span>Resp: {b.responsibleEntity}</span>
                                    <span className="flex items-center gap-1"><Clock size={10} /> {b.daysDelayed} días retraso</span>
                                </div>
                                {b.cascadingRiskScore && (
                                    <div className="mt-2 pt-2 border-t border-red-100/50 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-red-400 uppercase">Impacto Sistémico</span>
                                            <span className="text-[10px] font-black text-red-600">{b.cascadingRiskScore}%</span>
                                        </div>
                                        <div className="w-full bg-red-100 h-1 rounded-full overflow-hidden">
                                            <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${b.cascadingRiskScore}%` }}></div>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {(b.impactedResources || []).map((r, ri) => (
                                                <span key={ri} className="text-[8px] bg-white text-red-500 px-1 border border-red-100 rounded font-black uppercase">Ref: {r}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )) : <div className="text-center py-10 text-slate-400 italic">No se detectaron bloqueos activos.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ data, onReset, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'contractor' | 'execution' | 'financial' | 'risks' | 'pmbok'>('overview');

    const [milestones, setMilestones] = useState<ProjectMilestone[]>(data.milestones || []);

    // Bottlenecks Caching State
    const [activeBottleneck, setActiveBottleneck] = useState<Bottleneck | null>(null);
    const [bottleneckAnalysis, setBottleneckAnalysis] = useState<BottleneckDeepAnalysis | null>(null);
    const [bottleneckCache, setBottleneckCache] = useState<Record<string, BottleneckDeepAnalysis>>({});
    const [isAnalyzingBottleneck, setIsAnalyzingBottleneck] = useState(false);
    const [bottleneckTab, setBottleneckTab] = useState<'analysis' | 'legal'>('analysis');
    const [generatedDocument, setGeneratedDocument] = useState<LegalDocument | null>(null);
    const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);

    const [activeUngrdModal, setActiveUngrdModal] = useState<'knowledge' | 'corrective' | 'prospective' | 'financial' | 'management' | null>(null);

    // Prospective State
    const [isAnalyzingPOT, setIsAnalyzingPOT] = useState(false);
    const [potAnalysisError, setPotAnalysisError] = useState<string | null>(null);
    const [potAnalysisResult, setPotAnalysisResult] = useState(data.ungrdAnalysis?.reduction?.prospective?.potAnalysis);

    const [isAnalyzingCorrective, setIsAnalyzingCorrective] = useState(false);
    const [correctiveDeepAnalysis, setCorrectiveDeepAnalysis] = useState<CorrectiveDeepAnalysis | null>(data.ungrdAnalysis?.reduction?.corrective?.deepForensicAnalysis || null);

    // Financial Protection State
    const [isAnalyzingFinancial, setIsAnalyzingFinancial] = useState(false);
    const [financialProtectionAnalysis, setFinancialProtectionAnalysis] = useState<FinancialProtectionDeepAnalysis | null>(data.ungrdAnalysis?.reduction?.financialProtection?.deepAnalysis || null);

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
    const [riskFilter, setRiskFilter] = useState<{ prob: string, imp: string } | null>(null);

    const [resourceInventory, setResourceInventory] = useState<ResourceInventory>(data.resourceInventory || { personnel: [], machinery: [], equipment: [] });
    const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
    const [financialAnalysisResult, setFinancialAnalysisResult] = useState<FinancialDeepAnalysis | null>(null);
    const [isAnalyzingFinance, setIsAnalyzingFinance] = useState(false);
    const [financialAnalysisError, setFinancialAnalysisError] = useState<string | null>(null);

    // Search State
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<{ summary: string; sources: { title: string; uri: string }[] } | null>(null);

    // New state for Interactive Metrics
    const [activeMetricModal, setActiveMetricModal] = useState<string | null>(null);

    // NEW: CAPEX/OPEX Deep Analysis State
    const [isCapexOpexAnalyzing, setIsCapexOpexAnalyzing] = useState(false);
    const [capexOpexAnalysis, setCapexOpexAnalysis] = useState<CapexOpexDeepAnalysis | null>(null);

    // Montecarlo State
    const [isMontecarloOpen, setIsMontecarloOpen] = useState(false);
    const [montecarloData, setMontecarloData] = useState<any[]>([]);
    const [montecarloProbability, setMontecarloProbability] = useState<number>(0);
    const [montecarloStats, setMontecarloStats] = useState({ probSuccess: 0, probFailure: 0, volatility: 0, iterations: 1000 });
    const [montecarloResults, setMontecarloResults] = useState<{ distribution: any[], p10: number, p50: number, p90: number } | null>(null);

    const [contractorProfile, setContractorProfile] = useState<ContractorProfile | null>(data.contractorProfile || null);
    const [isAnalyzingContractor, setIsAnalyzingContractor] = useState(false);

    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([{ id: '1', role: 'ai', text: 'Hola, soy El Greko AI. ¿En qué puedo ayudarte?', timestamp: new Date() }]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // EVOLUTION BRAIN STATE
    const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false);
    const [isEvolving, setIsEvolving] = useState(false);
    const [evolutionError, setEvolutionError] = useState<string | null>(null);
    const [evolutionTab, setEvolutionTab] = useState<'pdf' | 'text' | 'image'>('pdf');
    const [evolutionTextInput, setEvolutionTextInput] = useState('');

    // NEW: Evolution Result & Timeline State
    const [evolutionResult, setEvolutionResult] = useState<EvolutionLog | null>(null);
    const [expandedLogIndex, setExpandedLogIndex] = useState<number | null>(null);

    // MACROECONOMIC STATE
    const [macroData, setMacroData] = useState<MacroeconomicData>({
        ...INITIAL_PROJECT_DATA.macroeconomicData,
        ...(data.macroeconomicData || {})
    });

    useEffect(() => { if (milestones.length === 0 && data.milestones) { setMilestones(data.milestones); } }, [data.milestones]);
    useEffect(() => { if (!resourceInventory.personnel?.length && !resourceInventory.machinery?.length && data.resourceInventory) { setResourceInventory(data.resourceInventory) } }, [data.resourceInventory]);
    useEffect(() => { scrollToBottom(); }, [chatHistory, activeTab]);
    const scrollToBottom = () => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
    const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);

    const calculatedMetrics = useMemo(() => {
        let totalPlannedBudget = 0; let earnedValue = 0; let plannedValue = 0; const today = new Date();
        const safeMilestones = Array.isArray(milestones) ? milestones : [];
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
        });
        const effectiveTotalBudget = totalPlannedBudget > 0 ? totalPlannedBudget : data.totalBudget;
        const actualCost = data.spentBudget > 0 ? data.spentBudget : earnedValue;
        const cpi = actualCost > 0 ? earnedValue / actualCost : 1;
        const spi = plannedValue > 0 ? earnedValue / plannedValue : 1;

        // CAPEX / OPEX ESTIMATION
        let capex = 0;
        let opex = 0;

        // Method 1: Resource Based
        if (resourceInventory) {
            if (resourceInventory.machinery) capex += resourceInventory.machinery.reduce((acc, m) => acc + (m.totalCost || 0), 0);
            if (resourceInventory.equipment) capex += resourceInventory.equipment.reduce((acc, e) => acc + (e.totalCost || 0), 0);
            if (resourceInventory.personnel) opex += resourceInventory.personnel.reduce((acc, p) => acc + (p.totalCost || 0), 0);
        }

        // Method 2: Budget Breakdown Fallback if Resources are low
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

        // Method 3: Absolute Fallback (80/20 Rule)
        if (capex === 0 && opex === 0) {
            capex = effectiveTotalBudget * 0.8;
            opex = effectiveTotalBudget * 0.2;
        }

        // BURN RATE CALCULATION (Forensic)
        // Formula: Spent Budget / Days passed since start
        let burnRate = 0;
        let daysPassed = 0;
        if (data.startDate) {
            const start = new Date(data.startDate);
            daysPassed = Math.max(1, Math.floor((today.getTime() - start.getTime()) / (1000 * 3600 * 24)));
            burnRate = actualCost / daysPassed;
        }

        // RUNWAY CALCULATION
        // Formula: Remaining Budget / Burn Rate
        const remainingBudget = effectiveTotalBudget - actualCost;
        const runwayDays = burnRate > 0 ? remainingBudget / burnRate : 0;

        // BC Ratio (Simulated based on SPI/CPI if not present)
        const bcRatio = data.kpis.bcRatio || (cpi * spi > 0 ? (cpi * spi * 1.2) : 1.05);

        // NEW: INTEGRATED SPEED INDEX (ISI) & MOBILIZATION
        const physicalProgress = (earnedValue / effectiveTotalBudget) * 100;
        const timeProgress = 0; // Calculated below if dates exist
        let isi = spi; // Fallback to SPI
        let mobilizationEfficiency = 0.85; // Baseline

        if (data.startDate && data.endDate) {
            const start = new Date(data.startDate); const end = new Date(data.endDate);
            const totalDur = end.getTime() - start.getTime();
            const elapsed = today.getTime() - start.getTime();
            const tProg = Math.max(0.01, (elapsed / totalDur) * 100);

            // Calculate Resource Mobilization Efficiency
            const totalResourcesTarget = (data.resourceInventory.personnel?.length || 0) + (data.resourceInventory.machinery?.length || 0);
            const actualResourcesActive = safeMilestones.reduce((acc, m) => acc + (m.inferredResources?.length || 0), 0);
            mobilizationEfficiency = totalResourcesTarget > 0 ? Math.min(1.2, actualResourcesActive / (totalResourcesTarget * 0.5)) : 0.9;

            isi = (physicalProgress / tProg) * mobilizationEfficiency;
        }

        const convergence: ConvergenceMetrics = {
            gapClosureRate: (spi - 0.8) * 0.5, // Dummy logic for demo if no history
            timeToStabilization: spi < 1 ? Math.round((1 - spi) * 100) : 0,
            mobilizationEfficiency,
            idleResourceCost: (1 - mobilizationEfficiency) * (actualCost * 0.05) // Estimate 5% overhead cost for idleness
        };

        return {
            totalPlannedBudget: effectiveTotalBudget,
            earnedValue,
            plannedValue,
            actualCost,
            cpi,
            spi,
            isi,
            convergence,
            eac: cpi > 0 ? effectiveTotalBudget / cpi : effectiveTotalBudget,
            financialProgress: (data.spentBudget / effectiveTotalBudget) * 100,
            capex,
            opex,
            burnRate,
            runwayDays,
            bcRatio
        };
    }, [milestones, data.totalBudget, data.spentBudget, resourceInventory, data.budgetBreakdown, data.startDate, data.endDate, data.kpis.bcRatio]);

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

    // STOCHASTIC MONTE CARLO SIMULATION
    // Generates 10,000 iterations to predict future costs based on risk volatility
    const runMontecarlo = () => {
        setIsMontecarloOpen(true);

        const iterations = 10000;
        const monthsToProject = 12;
        const currentCost = calculatedMetrics.actualCost;
        const totalBudget = data.totalBudget;

        // MACRO IMPACTS
        const annualInflation = macroData.inflationRate / 100;
        const monthlyInflation = Math.pow(1 + annualInflation, 1 / 12) - 1;
        const monthlyInvestmentReturn = Math.pow(1 + (macroData.investmentReturn / 100), 1 / 12) - 1;

        // TRM Impact (Assuming 20% exposure to currency fluctuation)
        // Base TRM is set to 3900 COP/USD as a reference
        const trmBase = 3900;
        const trmExposure = 0.20;
        const trmAdjustment = 1 + (trmExposure * (macroData.forwardRate / trmBase - 1));

        // Volatility Factor
        const baseVolatility = 0.05; // 5% base
        const riskFactor = (riskStats.critical * 0.05) + (riskStats.high * 0.02);
        const volatility = baseVolatility + riskFactor;

        // Calculate Base Monthly Burn
        const monthlyBurn = calculatedMetrics.burnRate > 0 ? calculatedMetrics.burnRate * 30 : (totalBudget / 12);

        const finalCosts: number[] = [];

        for (let i = 0; i < iterations; i++) {
            let accumulatedCost = currentCost;

            for (let m = 1; m <= monthsToProject; m++) {
                // Box-Muller transform for normal distribution
                const u1 = Math.random();
                const u2 = Math.random();
                const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

                const shock = monthlyBurn * volatility * z;
                // Monthly cost adjusted by inflation and TRM, then buffered by investment returns
                const inflationAdjustment = Math.pow(1 + monthlyInflation, m);
                const investmentBuffer = Math.pow(1 + monthlyInvestmentReturn, m);

                const monthlyStep = Math.max(0, (monthlyBurn + shock) * inflationAdjustment * trmAdjustment) / investmentBuffer;
                accumulatedCost += monthlyStep;
            }
            finalCosts.push(accumulatedCost);
        }

        // Sort
        finalCosts.sort((a, b) => a - b);

        // Calculate Stats
        const successCount = finalCosts.filter(c => c <= totalBudget).length;
        const probSuccess = (successCount / iterations) * 100;

        setMontecarloStats({
            probSuccess: Math.round(probSuccess),
            probFailure: 100 - Math.round(probSuccess),
            volatility: Math.round(volatility * 100),
            iterations
        });

        setMontecarloProbability(Math.round(probSuccess)); // Keep existing state for consistency if used elsewhere

        // Calculate Percentiles
        const p10 = finalCosts[Math.floor(iterations * 0.1)];
        const p50 = finalCosts[Math.floor(iterations * 0.5)];
        const p90 = finalCosts[Math.floor(iterations * 0.9)];

        // Calculate Bins for Charting
        const minCost = finalCosts[0];
        const maxCost = finalCosts[iterations - 1];
        const binCount = 30;
        const binSize = (maxCost - minCost) / binCount;

        const chartData = [];
        for (let i = 0; i < binCount; i++) {
            const binStart = minCost + (i * binSize);
            const binEnd = binStart + binSize;
            const binMid = (binStart + binEnd) / 2;

            const count = finalCosts.filter(c => c >= binStart && c < binEnd).length;

            if (count > 0 || (binMid > totalBudget * 0.8 && binMid < totalBudget * 1.2)) { // Include empty bins near budget for scale
                chartData.push({
                    cost: binMid,
                    range: `${(binStart / 1000000).toFixed(1)}M-${(binEnd / 1000000).toFixed(1)}M`,
                    rangeStart: binStart,
                    rangeEnd: binEnd,
                    count: count,
                    frequency: count, // backward compat
                    isOverBudget: binMid > totalBudget
                });
            }
        }
        setMontecarloData(chartData);
        setMontecarloResults({ distribution: chartData, p10, p50, p90 });
    };

    // Risk Matrix Helpers
    const getRisksByLevel = (prob: string, imp: string) => {
        return data.risks.filter(r => r.probability === prob && r.impact === imp);
    };

    const filteredRisks = useMemo(() => {
        if (!riskFilter) return data.risks;
        return data.risks.filter(r => r.probability === riskFilter.prob && r.impact === riskFilter.imp);
    }, [data.risks, riskFilter]);

    const getProbColor = (p: string) => p === 'High' ? 'bg-rose-100 text-rose-700 border-rose-200' : p === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
    const getImpColor = (i: string) => i === 'High' ? 'bg-rose-100 text-rose-700 border-rose-200' : i === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200';

    const sCurveData = useMemo(() => {
        const dates = new Set<string>();
        (milestones || []).forEach(m => { if (m.startDate) dates.add(m.startDate); if (m.endDate) dates.add(m.endDate); });
        if (dates.size === 0) return [];
        const sortedDates = Array.from(dates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
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
                        pv += cost * Math.min(1, daysPassed / totalDays);
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
                generated.push({
                    processName: `${isCritical ? 'BLOQUEO CRÍTICO' : 'Retraso Operativo'}: ${m.description}`, responsibleEntity: data.contractor || "Ejecutor", status: 'Bloqueado',
                    daysDelayed: m.endDate ? Math.max(0, Math.floor((new Date().getTime() - new Date(m.endDate).getTime()) / (1000 * 3600 * 24))) : 0,
                    description: `Actividad ${isCritical ? 'de RUTA CRÍTICA ' : ''}con retraso operativo.`, impactLevel: isCritical ? 'Crítico' : 'Moderado', evidence: "Retraso cronograma."
                });
            }
        });
        const all = [...base, ...generated];
        const unique = all.filter((v, i, a) => a.findIndex(v2 => (v2.processName === v.processName)) === i);
        return unique.sort((a, b) => (b.impactLevel === 'Crítico' ? 1 : -1) - (a.impactLevel === 'Crítico' ? -1 : 1));
    }, [data.bottlenecks, milestones, data.contractor]);

    // ... [Handlers remain the same] ...
    const handlePOTUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsAnalyzingPOT(true);
            setPotAnalysisError(null);
            setPotAnalysisResult(undefined); // Reset result to show loader
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const base64 = (event.target?.result as string)?.split(',')[1];
                    if (base64) {
                        const result = await analyzePOTAlignment(data, base64);
                        setPotAnalysisResult(result);
                    }
                } catch (error: any) {
                    setPotAnalysisError(error.message || "Error desconocido al analizar POT.");
                } finally {
                    setIsAnalyzingPOT(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const handleKnowledgeAnalysis = async () => { setIsAnalyzingKnowledge(true); setKnowledgeDeepAnalysis(null); try { const result = await analyzeKnowledgeDeep(data); setKnowledgeDeepAnalysis(result); } catch (e) { console.error(e); } finally { setIsAnalyzingKnowledge(false); } };
    const handleCorrectiveAnalysis = async () => { setIsAnalyzingCorrective(true); setCorrectiveDeepAnalysis(null); try { const result = await analyzeCorrectiveDeep(data); setCorrectiveDeepAnalysis(result); } catch (e) { console.error(e); } finally { setIsAnalyzingCorrective(false); } };
    const handleManagementAnalysis = async () => { setIsAnalyzingManagement(true); setManagementDeepAnalysis(null); try { const result = await analyzeManagementDeep(data); setManagementDeepAnalysis(result); } catch (e) { console.error(e); } finally { setIsAnalyzingManagement(false); } };
    const handleRunPMBOKAnalysis = async () => { setIsAnalyzingPMBOK(true); try { const currentData = { ...data, milestones: milestones }; const analysis = await analyzePMBOK7(currentData); setPmbokData(analysis); } catch (err) { console.error(err); } finally { setIsAnalyzingPMBOK(false); } };

    const handleAnalyzeFinancialProtection = async () => {
        setIsAnalyzingFinancial(true);
        setFinancialProtectionAnalysis(null);
        try {
            const result = await analyzeFinancialProtectionDeep(data);
            setFinancialProtectionAnalysis(result);
        } catch (e) { console.error(e); } finally { setIsAnalyzingFinancial(false); }
    };

    const handlePMBOKClick = async (principle: PMBOKPrinciple) => {
        setActivePMBOKPrinciple(principle);
        setPmbokAnalysisError(null);
        if (principle.deepAnalysis) { setPmbokDeepAnalysisResult(principle.deepAnalysis); return; }
        setPmbokDeepAnalysisResult(null); setIsPMBOKDeepAnalyzing(true);
        try { const deepAnalysis = await analyzePMBOKPrincipleDeep(data, principle.name); setPmbokDeepAnalysisResult(deepAnalysis); setPmbokData(prev => { if (!prev) return prev; return { ...prev, principles: prev.principles.map(p => p.name === principle.name ? { ...p, deepAnalysis } : p) }; }); } catch (err) { setPmbokAnalysisError("El modelo AI no pudo generar el análisis."); } finally { setIsPMBOKDeepAnalyzing(false); }
    };

    const handleBottleneckClick = async (bottleneck: Bottleneck) => {
        setActiveBottleneck(bottleneck); setGeneratedDocument(null); setBottleneckTab('analysis');
        if (bottleneck.deepAnalysis) { setBottleneckAnalysis(bottleneck.deepAnalysis); return; }
        const key = bottleneck.processName; if (bottleneckCache[key]) { setBottleneckAnalysis(bottleneckCache[key]); return; }
        setBottleneckAnalysis(null); setIsAnalyzingBottleneck(true);
        try { const deepAnalysis = await analyzeBottleneckDeep(bottleneck, data); setBottleneckAnalysis(deepAnalysis); setBottleneckCache(prev => ({ ...prev, [key]: deepAnalysis })); } catch (err) { console.error(err); } finally { setIsAnalyzingBottleneck(false); }
    };

    const handleGenerateDocument = async (type: 'petition' | 'memo' | 'meeting') => { if (!activeBottleneck) return; setIsGeneratingDoc(true); setGeneratedDocument(null); try { const doc = await generateAdministrativeDocument(activeBottleneck, type, data); setGeneratedDocument(doc); } catch (e) { console.error(e); } finally { setIsGeneratingDoc(false); } };
    const handleAnalyzeRiskMitigation = async (risk: RiskItem) => { setActiveRiskForMitigation(risk); setIsMitigationLoading(true); setMitigationResult(null); try { const suggestion = await generateMitigationSuggestion(risk, data); setMitigationResult(suggestion); } catch (err) { setMitigationResult("Error al generar mitigación."); } finally { setIsMitigationLoading(false); } };
    const handleAnalyzeContractor = async () => { setIsAnalyzingContractor(true); try { const result = await analyzeContractorRisk(data); setContractorProfile(prev => ({ ...prev, ...result, summary: prev?.summary || result.summary || prev?.summary })); } catch (e) { console.error(e); } finally { setIsAnalyzingContractor(false); } };
    const handleSendMessage = async (e: React.FormEvent) => { e.preventDefault(); if (!chatInput.trim()) return; const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput, timestamp: new Date() }; setChatHistory(prev => [...prev, userMsg]); setChatInput(''); setIsChatLoading(true); try { const responseText = await askProjectQuestion(userMsg.text, data); setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'ai', text: responseText, timestamp: new Date() }]); } catch (err) { console.error(err); } finally { setIsChatLoading(false); } };
    const getPMBOKIcon = (englishName: string) => { switch (englishName) { case 'Stewardship': return <Heart size={20} />; case 'Team': return <Users size={20} />; case 'Stakeholders': return <Briefcase size={20} />; case 'Value': return <Gem size={20} />; case 'Systems Thinking': return <BrainCircuit size={20} />; case 'Leadership': return <Medal size={20} />; case 'Tailoring': return <Sliders size={20} />; case 'Quality': return <CheckCircle size={20} />; case 'Complexity': return <Network size={20} />; case 'Risk': return <ShieldAlert size={20} />; case 'Adaptability': return <RefreshCw size={20} />; case 'Change': return <Shuffle size={20} />; default: return <BookOpen size={20} />; } };
    const mapEmbed = useMemo(() => { const lat = data.location?.latitude || 0; const lng = data.location?.longitude || 0; const hasCoordinates = lat !== 0 && lng !== 0; const bbox = hasCoordinates ? `${lng - 0.005},${lat - 0.005},${lng + 0.005},${lat + 0.005}` : `-79.0,0.0,-67.0,12.0`; const marker = hasCoordinates ? `&marker=${lat},${lng}` : ''; return <iframe width="100%" height="100%" frameBorder="0" scrolling="no" src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${marker}`} style={{ border: 0 }}></iframe>; }, [data.location]);

    // Horizontal Nav Items
    const navItems = [
        { id: 'overview', label: 'Tablero Principal', icon: LayoutDashboardIcon },
        { id: 'contractor', label: 'Contratista', icon: BriefcaseIcon },
        { id: 'execution', label: 'Ejecución (WBS)', icon: Wrench },
        { id: 'financial', label: 'Finanzas', icon: DollarSign },
        { id: 'risks', label: 'Matriz Riesgos', icon: ShieldAlert },
        { id: 'pmbok', label: 'PMBOK 7', icon: BookOpen }
    ];

    const handleRunFinancialDeepAnalysis = async () => {
        setIsAnalyzingFinance(true);
        setFinancialAnalysisResult(null);
        setFinancialAnalysisError(null);
        setIsFinancialModalOpen(true); // Open modal immediately
        try {
            const result = await analyzeFinancialDeep(data);
            setFinancialAnalysisResult(result);
        } catch (err: any) {
            console.error(err);
            setFinancialAnalysisError(err.message || "Error desconocido en análisis financiero.");
        } finally {
            setIsAnalyzingFinance(false);
        }
    };

    const handleSearchContext = async () => {
        setIsSearchModalOpen(true);
        if (searchResult) return; // Don't search again if already have it for this session
        setIsSearching(true);
        try {
            const result = await searchProjectInfo(data);
            setSearchResult(result);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    };

    const handleEvolution = async (file?: File) => {
        setIsEvolving(true);
        setEvolutionError(null);
        try {
            let input: { type: 'pdf' | 'text' | 'image', content: string } = { type: 'text', content: '' };

            if (evolutionTab === 'text') {
                if (!evolutionTextInput.trim()) throw new Error("Por favor ingresa un texto.");
                input = { type: 'text', content: evolutionTextInput };
            } else if (file) {
                const reader = new FileReader();
                const content = await new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                // Remove prefix (data:application/pdf;base64, etc)
                const base64Content = content.split(',')[1];
                input = {
                    type: evolutionTab === 'pdf' ? 'pdf' : 'image',
                    content: base64Content
                };
            } else {
                throw new Error("Por favor selecciona un archivo.");
            }

            const updatedData = await updateProjectWithNewData(data, input);
            onUpdate(updatedData);

            if (updatedData.evolutionHistory && updatedData.evolutionHistory.length > 0) {
                setEvolutionResult(updatedData.evolutionHistory[0]);
            }

            setIsEvolutionModalOpen(false);
        } catch (e: any) {
            setEvolutionError(e.message);
        } finally {
            setIsEvolving(false);
        }
    };

    const closeEvolutionModal = () => {
        setIsEvolutionModalOpen(false);
        setEvolutionResult(null);
        setEvolutionTab('pdf');
    };

    const handleCapexOpexClick = async () => {
        // Trigger deep analysis immediately if not present
        if (!capexOpexAnalysis && !isCapexOpexAnalyzing) {
            setIsCapexOpexAnalyzing(true);
            try {
                const result = await analyzeCapexOpexDeep(data);
                setCapexOpexAnalysis(result);
            } catch (e) {
                console.error(e);
            } finally {
                setIsCapexOpexAnalyzing(false);
            }
        }
        setActiveMetricModal('capex_opex_deep');
    };

    // Helper for "Smart Cards" in Financial Tab
    const FinancialSmartCard = ({ title, value, subtext, type, data, color, metricKey, onClick }: { title: string, value: string, subtext: string, type: 'radial' | 'gauge' | 'bar' | 'icon', data?: any, color: string, metricKey: string, onClick?: () => void }) => {
        return (
            <div
                onClick={onClick || (() => setActiveMetricModal(metricKey))}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 group relative overflow-hidden cursor-pointer hover:scale-[1.02]"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    {type === 'gauge' && <Activity size={64} color={color} />}
                    {type === 'radial' && <PieChartIcon size={64} color={color} />}
                    {type === 'bar' && <BarChart3 size={64} color={color} />}
                    {type === 'icon' && <SigmaIcon size={64} color={color} />}
                </div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h5>
                        <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
                        <p className="text-xs font-medium text-slate-500 mt-1">{subtext}</p>
                    </div>
                </div>

                <div className="h-16 w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        {type === 'radial' ? (
                            <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={10} data={[{ name: 'progress', value: data, fill: color }]}>
                                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                <RadialBar background clockWise dataKey="value" cornerRadius={10} />
                            </RadialBarChart>
                        ) : type === 'gauge' ? (
                            <PieChart>
                                <Pie data={[{ value: data }, { value: Math.max(0, 2 - data) }]} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={35} outerRadius={50} paddingAngle={0} dataKey="value">
                                    <Cell fill={data >= 1 ? '#10b981' : '#ef4444'} />
                                    <Cell fill="#f1f5f9" />
                                </Pie>
                            </PieChart>
                        ) : type === 'bar' ? (
                            <BarChart data={data}>
                                <Bar dataKey="value" fill={color} radius={[2, 2, 2, 2]} />
                                <ReferenceLine y={0} stroke="#cbd5e1" />
                            </BarChart>
                        ) : (
                            <div className="h-full flex items-end pb-2">
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, data)}%`, backgroundColor: color }}></div>
                                </div>
                            </div>
                        )}
                    </ResponsiveContainer>
                </div>

                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 text-[10px] font-bold uppercase flex items-center gap-1">
                    Ver Detalle <ArrowRight size={10} />
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden">

            {/* HORIZONTAL NAVIGATION */}
            <div className="bg-white border-b border-gray-200 shadow-sm z-20 sticky top-0 px-6">
                <div className="flex items-center space-x-1 overflow-x-auto custom-scrollbar no-scrollbar py-2">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
                                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <item.icon size={16} className={activeTab === item.id ? 'text-blue-200' : 'text-slate-400'} />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
                <div className="container mx-auto max-w-[95%] space-y-8 pb-12">

                    {/* Risk Mitigation Modal */}
                    <BaseModal isOpen={!!activeRiskForMitigation} onClose={() => setActiveRiskForMitigation(null)} title={`Estrategia: ${activeRiskForMitigation?.risk}`}>
                        {isMitigationLoading ? <div className="text-center py-20"><Loader2 size={48} className="mx-auto text-blue-600 animate-spin mb-4" /><p className="text-gray-500">Diseñando estrategia ISO 31000...</p></div> : <div className="space-y-4 whitespace-pre-wrap font-sans text-gray-800 leading-relaxed bg-white p-6 rounded-xl border border-gray-200 shadow-inner">{mitigationResult}</div>}
                    </BaseModal>

                    {/* MONTE CARLO SIMULATION MODAL */}
                    <BaseModal isOpen={isMontecarloOpen} onClose={() => setIsMontecarloOpen(false)} title="Simulación Estocástica de Costos (Monte Carlo)" maxWidth="max-w-7xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* CONFIGURATION COLUMN */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
                                    <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-xs uppercase tracking-widest">
                                        <Globe size={16} className="text-indigo-600" /> Configuración Macroeconómica
                                    </h4>

                                    <div className="space-y-8">
                                        {/* Inflation Rate */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Percent size={14} className="text-blue-500" /> Inflación Anual</label>
                                                <span className="text-xs font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-lg border border-blue-100">{macroData.inflationRate}%</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="25" step="0.1"
                                                value={macroData.inflationRate}
                                                onChange={(e) => setMacroData({ ...macroData, inflationRate: parseFloat(e.target.value) })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase"><span>0%</span><span>Meta 3%</span><span>25%</span></div>
                                        </div>

                                        {/* Forward TRM */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><TrendingUp size={14} className="text-green-500" /> TRM Forward (12m)</label>
                                                <span className="text-xs font-black bg-green-50 text-green-600 px-2 py-1 rounded-lg border border-green-100">${macroData.forwardRate.toLocaleString()}</span>
                                            </div>
                                            <input
                                                type="range" min="3000" max="6000" step="10"
                                                value={macroData.forwardRate}
                                                onChange={(e) => setMacroData({ ...macroData, forwardRate: parseFloat(e.target.value) })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                            />
                                            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase"><span>3.000</span><span>Base 3.900</span><span>6.000</span></div>
                                        </div>

                                        {/* Investment Return */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Landmark size={14} className="text-purple-500" /> Retorno Inversiones</label>
                                                <span className="text-xs font-black bg-purple-50 text-purple-600 px-2 py-1 rounded-lg border border-purple-100">{macroData.investmentReturn}%</span>
                                            </div>
                                            <input
                                                type="range" min="0" max="20" step="0.1"
                                                value={macroData.investmentReturn}
                                                onChange={(e) => setMacroData({ ...macroData, investmentReturn: parseFloat(e.target.value) })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                            />
                                            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase"><span>0%</span><span>CDT Avg</span><span>20%</span></div>
                                        </div>

                                        <button
                                            onClick={runMontecarlo}
                                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 mt-4 active:scale-95"
                                        >
                                            <RefreshCw size={18} /> Recalcular Simulación
                                        </button>

                                        <p className="text-[10px] text-slate-400 text-center font-medium leading-relaxed px-4">
                                            Al recalcular, la IA realiza 10.000 iteraciones estocásticas integrando el riesgo de volatilidad local y los ajustes macroeconómicos configurados.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                                    <h5 className="font-bold text-amber-800 text-xs uppercase mb-2 flex items-center gap-2">
                                        <Info size={14} /> ¿Qué estamos simulando?
                                    </h5>
                                    <p className="text-xs text-amber-900/70 leading-relaxed font-medium">
                                        Aplicamos el <strong>"Drift"</strong> inflacionario al CAPEX y el <strong>"Cushion"</strong> de retornos financieros al flujo de caja. La simulación utiliza el método de Monte Carlo para predecir la dispersión probabilística del costo final del proyecto.
                                    </p>
                                </div>
                            </div>

                            {/* RESULTS COLUMN */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* Probability Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
                                        <div className="text-[10px] font-bold text-green-800 uppercase tracking-widest mb-1">Confianza de Presupuesto</div>
                                        <div className="text-5xl font-black text-green-600">{montecarloStats.probSuccess}%</div>
                                        <p className="text-xs text-green-700 mt-2 font-medium">Probabilidad de terminación dentro del costo base</p>
                                    </div>
                                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                                        <div className="text-[10px] font-bold text-red-800 uppercase tracking-widest mb-1">Riesgo de Desviación</div>
                                        <div className="text-5xl font-black text-red-600">{montecarloStats.probFailure}%</div>
                                        <p className="text-xs text-red-700 mt-2 font-medium">Probabilidad de requerir adiciones presupuestales</p>
                                    </div>
                                </div>

                                {/* The Chart */}
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-bold text-slate-800">Distribución de Frecuencia Estocástica</h4>
                                        <div className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-tighter">Variación Histórica: {montecarloStats.volatility}%</div>
                                    </div>

                                    <div className="h-[350px] w-full">
                                        {montecarloResults ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={montecarloData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorMonte" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis
                                                        dataKey="cost"
                                                        tick={{ fontSize: 10, fill: '#64748b' }}
                                                        tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`}
                                                        label={{ value: 'Costo Final Proyectado (COP)', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }}
                                                    />
                                                    <YAxis hide />
                                                    <Tooltip
                                                        content={({ active, payload }) => {
                                                            if (active && payload && payload.length) {
                                                                const d = payload[0].payload;
                                                                return (
                                                                    <div className="bg-slate-900/95 backdrop-blur-sm text-white p-4 rounded-xl shadow-2xl border border-slate-700 min-w-[200px]">
                                                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Escenario de Costo</div>
                                                                        <div className="font-mono text-lg font-black mb-1">{formatCurrency(d.rangeStart)} - {formatCurrency(d.rangeEnd)}</div>
                                                                        <div className="h-0.5 w-full bg-slate-700 my-3"></div>
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-xs text-slate-400">Ocurrencias:</span>
                                                                            <span className="text-sm font-black text-indigo-400">{d.count} iteraciones</span>
                                                                        </div>
                                                                        {d.isOverBudget && <div className="mt-2 text-[10px] font-black text-red-400 uppercase bg-red-400/10 px-2 py-1 rounded border border-red-400/20 text-center">Sobre Presupuesto</div>}
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        }}
                                                    />
                                                    <Area type="monotone" dataKey="frequency" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMonte)" animationDuration={1500} />
                                                    <ReferenceLine x={data.totalBudget} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5">
                                                        <Label value="Presupuesto" position="top" fill="#ef4444" fontSize={10} fontWeight="bold" />
                                                    </ReferenceLine>
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                                <Loader2 className="animate-spin mb-2" />
                                                <p className="text-sm">Generando escenarios...</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Scenarios Summary */}
                                {montecarloResults && (
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Optimista (P10)</div>
                                            <div className="text-lg font-black text-green-600 font-mono">{formatCurrency(montecarloResults.p10)}</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center bg-blue-50/30 ring-2 ring-blue-100/50">
                                            <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Más Probable (P50)</div>
                                            <div className="text-lg font-black text-blue-600 font-mono">{formatCurrency(montecarloResults.p50)}</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pesimista (P90)</div>
                                            <div className="text-lg font-black text-red-600 font-mono">{formatCurrency(montecarloResults.p90)}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </BaseModal>

                    {/* CAPEX/OPEX DEEP DIVE MODAL */}
                    <BaseModal isOpen={activeMetricModal === 'capex_opex_deep'} onClose={() => setActiveMetricModal(null)} title="Auditoría Forense de Inversión y Gasto">
                        {isCapexOpexAnalyzing ? (
                            <div className="text-center py-20 flex flex-col items-center animate-fade-in">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                    <Loader2 size={64} className="text-blue-600 animate-spin relative z-10" />
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-slate-800">Clasificando Ítems Financieros...</h3>
                                <p className="text-slate-500 text-sm mt-2 max-w-md">La IA está auditando cada línea presupuestal para separar inversión real de gastos operativos.</p>
                            </div>
                        ) : capexOpexAnalysis ? (
                            <div className="space-y-8 animate-fade-in">
                                {/* Header Verdict */}
                                <div className={`p-6 rounded-xl border-l-4 shadow-sm flex items-start gap-4 ${capexOpexAnalysis.efficiencyVerdict === 'Alto OPEX (Alerta)' ? 'bg-orange-50 border-orange-500' :
                                    capexOpexAnalysis.efficiencyVerdict === 'Equilibrado' ? 'bg-green-50 border-green-500' :
                                        'bg-red-50 border-red-500'
                                    }`}>
                                    <div className={`p-3 rounded-full ${capexOpexAnalysis.efficiencyVerdict === 'Alto OPEX (Alerta)' ? 'bg-orange-100 text-orange-600' :
                                        capexOpexAnalysis.efficiencyVerdict === 'Equilibrado' ? 'bg-green-100 text-green-600' :
                                            'bg-red-100 text-red-600'
                                        }`}>
                                        <ScaleIcon size={24} />
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-black uppercase tracking-tight ${capexOpexAnalysis.efficiencyVerdict === 'Alto OPEX (Alerta)' ? 'text-orange-900' :
                                            capexOpexAnalysis.efficiencyVerdict === 'Equilibrado' ? 'text-green-900' :
                                                'text-red-900'
                                            }`}>Veredicto: {capexOpexAnalysis.efficiencyVerdict}</h4>
                                        <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                                            "{capexOpexAnalysis.efficiencyRationale}"
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* CAPEX COLUMN */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                            <div>
                                                <h5 className="font-black text-emerald-900 text-lg flex items-center gap-2"><Hammer size={20} /> CAPEX (Inversión)</h5>
                                                <p className="text-xs text-emerald-700 uppercase font-bold tracking-wider">Infraestructura & Bienes</p>
                                            </div>
                                            <div className="text-2xl font-black text-emerald-600">{formatCurrency(capexOpexAnalysis.capex.total)}</div>
                                        </div>

                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                            <h6 className="font-bold text-slate-400 text-xs uppercase mb-2">Análisis de Inversión</h6>
                                            <p className="text-sm text-slate-700 leading-relaxed">{capexOpexAnalysis.capex.analysis}</p>
                                        </div>

                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                            <div className="bg-emerald-50/50 px-4 py-2 border-b border-gray-100 text-xs font-bold text-emerald-800 uppercase">Desglose Detallado</div>
                                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar divide-y divide-gray-50">
                                                {capexOpexAnalysis.capex.breakdown.map((item, i) => (
                                                    <div key={i} className="p-3 hover:bg-slate-50">
                                                        <div className="flex justify-between font-bold text-sm text-slate-800">
                                                            <span>{item.item}</span>
                                                            <span>{formatCurrency(item.cost)}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-1 italic">{item.justification}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* OPEX COLUMN */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                            <div>
                                                <h5 className="font-black text-indigo-900 text-lg flex items-center gap-2"><BriefcaseIcon size={20} /> OPEX (Operativo)</h5>
                                                <p className="text-xs text-indigo-700 uppercase font-bold tracking-wider">Gastos Recurrentes</p>
                                            </div>
                                            <div className="text-2xl font-black text-indigo-600">{formatCurrency(capexOpexAnalysis.opex.total)}</div>
                                        </div>

                                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                            <h6 className="font-bold text-slate-400 text-xs uppercase mb-2">Análisis de Gastos</h6>
                                            <p className="text-sm text-slate-700 leading-relaxed">{capexOpexAnalysis.opex.analysis}</p>
                                        </div>

                                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                            <div className="bg-indigo-50/50 px-4 py-2 border-b border-gray-100 text-xs font-bold text-indigo-800 uppercase">Desglose Detallado</div>
                                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar divide-y divide-gray-50">
                                                {capexOpexAnalysis.opex.breakdown.map((item, i) => (
                                                    <div key={i} className="p-3 hover:bg-slate-50">
                                                        <div className="flex justify-between font-bold text-sm text-slate-800">
                                                            <span>{item.item}</span>
                                                            <span>{formatCurrency(item.cost)}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-1 italic">{item.justification}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-slate-400">Error al cargar datos.</div>
                        )}
                    </BaseModal>

                    {/* ... (Search Modal and Metric Modal remain the same) ... */}
                    <BaseModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} title="Radar de Noticias (Google Search)">
                        {isSearching ? (
                            <div className="text-center py-20 flex flex-col items-center">
                                <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
                                <p className="text-slate-600 font-medium">Buscando controversias y noticias recientes en la web...</p>
                                <div className="flex gap-2 mt-4 text-xs text-slate-400 font-bold uppercase"><Globe size={14} /> Google Grounding</div>
                            </div>
                        ) : searchResult ? (
                            <div className="space-y-8 animate-fade-in">
                                {/* AI Summary */}
                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg"><Newspaper className="text-blue-600" /> Resumen de Inteligencia</h4>
                                    <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">{searchResult.summary}</p>
                                </div>

                                {/* Sources Grid */}
                                <div>
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Globe size={16} /> Noticias y Fuentes Encontradas</h4>
                                    {searchResult.sources.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {searchResult.sources.map((source, i) => (
                                                <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all group flex justify-between items-start">
                                                    <div>
                                                        <h5 className="font-bold text-blue-900 text-sm mb-1 group-hover:underline line-clamp-2">{source.title}</h5>
                                                        <p className="text-xs text-slate-400 truncate max-w-[250px]">{source.uri}</p>
                                                    </div>
                                                    <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-500" />
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed text-slate-400 italic">No se encontraron enlaces externos directos en esta búsqueda.</div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-400">No hay resultados.</div>
                        )}
                    </BaseModal>

                    {/* ... (Metric Modal) ... */}
                    <BaseModal isOpen={!!activeMetricModal && activeMetricModal !== 'capex_opex_deep'} onClose={() => setActiveMetricModal(null)} title={activeMetricModal && METRIC_DEFINITIONS[activeMetricModal] ? METRIC_DEFINITIONS[activeMetricModal].title : 'Detalle'} maxWidth="max-w-2xl">
                        {activeMetricModal && METRIC_DEFINITIONS[activeMetricModal] && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="flex justify-center mb-4">
                                    <div className="p-4 bg-slate-50 rounded-full text-slate-700 shadow-inner">
                                        {METRIC_DEFINITIONS[activeMetricModal].icon}
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                                    <h5 className="font-bold text-blue-800 text-xs uppercase mb-2">Definición</h5>
                                    <p className="text-slate-700 text-sm leading-relaxed">{METRIC_DEFINITIONS[activeMetricModal].definition}</p>
                                </div>
                                <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-700 font-mono text-center shadow-lg">
                                    <div className="text-xs text-slate-400 uppercase mb-2">Fórmula de Cálculo</div>
                                    <div className="text-lg font-bold">{METRIC_DEFINITIONS[activeMetricModal].formula}</div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h5 className="font-bold text-slate-800 text-xs uppercase mb-2 flex items-center gap-2"><Target size={14} /> Impacto</h5>
                                        <p className="text-slate-600 text-xs leading-relaxed">{METRIC_DEFINITIONS[activeMetricModal].impact}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                                        <h5 className="font-bold text-green-800 text-xs uppercase mb-2 flex items-center gap-2"><TrendingUp size={14} /> Cómo Mejorarlo</h5>
                                        <p className="text-green-700 text-xs leading-relaxed">{METRIC_DEFINITIONS[activeMetricModal].improvement}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </BaseModal>

                    {/* Bottleneck Modal */}
                    <BaseModal isOpen={!!activeBottleneck} onClose={() => setActiveBottleneck(null)} title={`Análisis de Bloqueo: ${activeBottleneck?.processName}`}>
                        {isAnalyzingBottleneck ? (
                            <div className="text-center py-20 animate-fade-in"><Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={48} /><p className="text-gray-500 font-medium">Investigando marco legal y financiero...</p></div>
                        ) : bottleneckAnalysis ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><h5 className="font-bold text-gray-400 text-xs uppercase mb-2 flex items-center gap-2"><Microscope size={16} /> Causa Raíz</h5><p className="font-semibold text-gray-800">{bottleneckAnalysis.rootCause}</p></div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><h5 className="font-bold text-gray-400 text-xs uppercase mb-2 flex items-center gap-2"><ScaleIcon size={16} /> Marco Legal</h5><p className="font-semibold text-gray-800 font-mono text-sm">{bottleneckAnalysis.legalFramework}</p></div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"><h5 className="font-bold text-gray-400 text-xs uppercase mb-2 flex items-center gap-2"><Banknote size={16} /> Impacto Financiero</h5><p className="font-semibold text-gray-800">{bottleneckAnalysis.financialImpactEstimate}</p></div>
                                </div>
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-inner">
                                    <h5 className="font-bold text-blue-900 text-lg mb-4 flex items-center gap-3"><Zap size={20} /> Plan de Acción Estratégico</h5>
                                    <div className="space-y-4">
                                        {(bottleneckAnalysis.strategicActions || []).map((action, i) => (
                                            <div key={i} className="flex gap-4 items-start p-3 bg-white/50 hover:bg-white rounded-lg transition-all">
                                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-md shadow-blue-200">{i + 1}</div>
                                                <p className="text-blue-800 font-medium text-sm pt-1.5">{action}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-400">No se pudo generar el análisis para este cuello de botella.</div>
                        )}
                    </BaseModal>

                    {/* UNGRD Modal (Unified for all 5 types) */}
                    <BaseModal isOpen={!!activeUngrdModal} onClose={() => setActiveUngrdModal(null)} title="Plataforma de Intervención Integral (Ley 1523)" maxWidth="max-w-7xl">
                        {activeUngrdModal && data.ungrdAnalysis && (
                            <div className="space-y-6 animate-fade-in">
                                {/* 1. KNOWLEDGE */}
                                {activeUngrdModal === 'knowledge' && (
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-xl p-6 text-white shadow-lg flex items-start gap-6">
                                            <div className="p-4 bg-white/20 rounded-lg"><FlaskConical size={32} /></div>
                                            <div className="flex-1"><h3 className="text-xl font-bold">Conocimiento del Riesgo</h3><p className="text-teal-100">Análisis comparativo de alternativas para modelamiento, monitoreo y gestión de vacíos de información.</p></div>
                                            {knowledgeDeepAnalysis && <div className="text-right"><div className="text-teal-200 text-xs font-bold uppercase tracking-wider">Score Conocimiento</div><div className="text-4xl font-black">{knowledgeDeepAnalysis.overallKnowledgeScore}<span className="text-2xl opacity-50">/100</span></div></div>}
                                        </div>

                                        <AnalysisSummaryCard title="Resumen Técnico Preliminar (Extraído)" content={data.ungrdAnalysis.knowledge.observation} icon={<FileSearch size={16} />} colorClass="bg-teal-50 border-teal-200 text-teal-800" />

                                        {!knowledgeDeepAnalysis ? (
                                            <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                                                <p className="text-slate-500 mb-4 text-sm">¿Desea profundizar en modelos de amenaza y vacíos de información?</p>
                                                <button onClick={handleKnowledgeAnalysis} disabled={isAnalyzingKnowledge} className="bg-teal-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-teal-700 transition flex items-center gap-2 mx-auto">{isAnalyzingKnowledge ? <Loader2 className="animate-spin" /> : <Search />} Profundizar Análisis (Deep Dive)</button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col lg:flex-row gap-8">
                                                {/* TABS */}
                                                <div className="flex lg:flex-col gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200 self-start">
                                                    {[{ id: 'threat', label: 'Análisis Amenaza' }, { id: 'gaps', label: 'Vacíos Críticos' }, { id: 'modeling', label: 'Modelamiento' }, { id: 'monitoring', label: 'Monitoreo' }].map(tab => (
                                                        <button key={tab.id} onClick={() => setKnowledgeDashboardTab(tab.id as any)} className={`px-4 py-2 text-sm font-bold rounded-lg text-left w-full ${knowledgeDashboardTab === tab.id ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}>{tab.label}</button>
                                                    ))}
                                                </div>
                                                {/* CONTENT */}
                                                <div className="flex-1">
                                                    {knowledgeDashboardTab === 'threat' && <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-fade-in"><h4 className="font-bold text-lg text-slate-800 mb-2">Caracterización de la Amenaza</h4><p className="text-sm text-slate-600 leading-relaxed">{knowledgeDeepAnalysis.riskCharacterization}</p></div>}
                                                    {knowledgeDashboardTab === 'gaps' && <div className="space-y-4 animate-fade-in">{(knowledgeDeepAnalysis.criticalDataGaps || []).map((gap, i) => (<div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-red-100"><span className={`inline-block px-2 py-0.5 text-xs font-bold rounded mb-2 ${gap.criticality === 'Alta' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{gap.criticality}</span><h5 className="font-bold text-slate-800">{gap.gap}</h5><p className="text-xs text-slate-500 mt-1 mb-3">{gap.impact}</p><div className="bg-slate-50 p-3 rounded-lg border border-slate-200"><h6 className="font-bold text-slate-400 text-[10px] uppercase mb-1">Plan de Acción</h6><p className="text-xs text-slate-600 font-medium">{gap.actionPlan}</p></div></div>))}</div>}
                                                    {knowledgeDashboardTab === 'modeling' && <div className="space-y-4 animate-fade-in">{(knowledgeDeepAnalysis.modelingAlternatives || []).map((alt, i) => (<div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200"><h5 className="font-bold text-slate-800">{alt.name}</h5><div className="text-xs flex gap-2 my-2"><span className="bg-blue-100 text-blue-700 px-2 rounded font-medium">{alt.type}</span><span className="bg-gray-100 px-2 rounded font-medium">{alt.complexity}</span><span className="bg-green-100 text-green-700 px-2 rounded font-medium">{alt.estimatedCost}</span></div><div className="grid grid-cols-2 gap-3 text-xs mt-3"><div className="bg-green-50 p-2 rounded"><strong>PROS:</strong> {alt.pros.join(', ')}</div><div className="bg-red-50 p-2 rounded"><strong>CONTRAS:</strong> {alt.cons.join(', ')}</div></div></div>))}</div>}
                                                    {knowledgeDashboardTab === 'monitoring' && <div className="space-y-4 animate-fade-in">{(knowledgeDeepAnalysis.monitoringAlternatives || []).map((alt, i) => (<div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200"><h5 className="font-bold text-slate-800">{alt.name}</h5><div className="text-xs flex gap-2 my-2"><span className="bg-blue-100 text-blue-700 px-2 rounded font-medium">{alt.type}</span><span className="bg-gray-100 px-2 rounded font-medium">{alt.complexity}</span><span className="bg-green-100 text-green-700 px-2 rounded font-medium">{alt.estimatedCost}</span></div><div className="grid grid-cols-2 gap-3 text-xs mt-3"><div className="bg-green-50 p-2 rounded"><strong>PROS:</strong> {alt.pros.join(', ')}</div><div className="bg-red-50 p-2 rounded"><strong>CONTRAS:</strong> {alt.cons.join(', ')}</div></div></div>))}</div>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 2. CORRECTIVE */}
                                {activeUngrdModal === 'corrective' && (
                                    <div className="space-y-8">
                                        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl p-6 text-white shadow-lg flex items-center gap-6">
                                            <div className="p-4 bg-white/20 rounded-lg"><Pickaxe size={32} /></div>
                                            <div><h3 className="text-xl font-bold">Intervención Correctiva</h3><p className="text-blue-100">Análisis técnico-financiero profundo y propuesta de soluciones óptimas.</p></div>
                                        </div>

                                        <AnalysisSummaryCard title="Resumen Técnico Preliminar (Extraído)" content={data.ungrdAnalysis.reduction.corrective?.observation} icon={<FileSearch size={16} />} colorClass="bg-blue-50 border-blue-200 text-blue-800" />

                                        {!correctiveDeepAnalysis ? (
                                            <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                                                <p className="text-slate-500 mb-4 text-sm">¿Desea generar alternativas de ingeniería y auditar la solución propuesta?</p>
                                                <button onClick={handleCorrectiveAnalysis} disabled={isAnalyzingCorrective} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto">{isAnalyzingCorrective ? <Loader2 className="animate-spin" /> : <Sparkles />} Profundizar Análisis (Deep Dive)</button>
                                            </div>
                                        ) : (
                                            <div className="space-y-8 animate-fade-in">
                                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md">
                                                    <h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"><ZoomIn size={20} /> Auditoría de la Solución Propuesta</h4>
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm"><h6 className="font-bold text-slate-400 text-xs uppercase mb-2">Diagnóstico Amenaza</h6><p className="text-sm font-medium text-slate-800">{correctiveDeepAnalysis.threatDiagnosis}</p></div>
                                                        <div className="lg:col-span-2 bg-red-50 p-5 rounded-xl border border-red-100 shadow-sm relative">
                                                            <h6 className="font-bold text-red-400 text-xs uppercase mb-2">Crítica Técnica (Value Engineering)</h6>
                                                            <p className="text-sm font-medium text-slate-800 leading-relaxed italic">"{typeof correctiveDeepAnalysis.engineeringSolutionAudit === 'string' ? correctiveDeepAnalysis.engineeringSolutionAudit : JSON.stringify(correctiveDeepAnalysis.engineeringSolutionAudit || 'Análisis no disponible')}"</p>
                                                            <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded text-xs font-bold shadow-sm border border-red-100">AI Critique</div>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
                                                        <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Score de Rigor Técnico</div>
                                                        <div className="text-3xl font-black">{correctiveDeepAnalysis.technicalRigorScore || 0}<span className="text-lg text-gray-500">/100</span></div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md">
                                                        <h4 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2"><Sparkles size={20} className="text-purple-500" /> Soluciones Alternativas (Generadas por IA)</h4>
                                                        {correctiveDeepAnalysis.alternativeSolutions && correctiveDeepAnalysis.alternativeSolutions.length > 0 ? (
                                                            <div className="space-y-6">
                                                                {correctiveDeepAnalysis.alternativeSolutions.map((sol, i) => (
                                                                    <div key={i} className="bg-purple-50/50 border border-purple-100 rounded-xl p-6 relative hover:shadow-md transition-shadow">
                                                                        <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 rounded-bl-xl text-xs font-bold">Opción {i + 1}</div>
                                                                        <h5 className="font-bold text-purple-900 text-lg mb-1">{sol.solutionName}</h5>
                                                                        <p className="text-sm text-slate-600 mb-4">{sol.description}</p>
                                                                        <div className="flex flex-wrap gap-2 mb-4">
                                                                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${sol.resilienceScore > 80 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>{sol.resilienceScore}/100 Resiliencia</span>
                                                                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">Impacto: {sol.estimatedCostImpact}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-slate-500 italic">No se generaron alternativas.</div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-xl relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 p-4 opacity-10"><SigmaIcon size={64} /></div>
                                                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-indigo-300">Auditoría de Optimización de Recursos</h4>
                                                            <p className="text-sm leading-relaxed mb-6 font-medium italic">"{correctiveDeepAnalysis.resourceOptimizationAudit || 'Análisis de recursos no disponible.'}"</p>
                                                            <div className="border-t border-white/10 pt-4">
                                                                <h4 className="text-[10px] font-bold uppercase tracking-wider mb-2 text-indigo-400">Análisis Costo-Beneficio</h4>
                                                                <p className="text-xs text-indigo-100">{correctiveDeepAnalysis.costBenefitAnalysis || 'CBA no generado.'}</p>
                                                            </div>
                                                        </div>

                                                        {/* PROACTIVE VALUE ENGINEERING ACTIONS */}
                                                        {data.valueEngineering && data.valueEngineering.length > 0 && (
                                                            <div className="bg-white p-6 rounded-xl border-2 border-purple-100 shadow-sm">
                                                                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                    <Gem size={16} className="text-purple-600" /> Acciones de Ingeniería de Valor
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    {data.valueEngineering.map((ve, i) => (
                                                                        <div key={i} className="group p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-white transition-all">
                                                                            <div className="flex justify-between items-start mb-1">
                                                                                <div className="text-[11px] font-bold text-slate-800 truncate pr-2 group-hover:text-purple-700">{ve.description}</div>
                                                                                <div className="text-[11px] font-black text-purple-600 shrink-0">{formatCurrency(ve.savings)}</div>
                                                                            </div>
                                                                            <div className="text-[10px] text-slate-500 italic line-clamp-2 leading-tight">"{ve.technicalTradeoff}"</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 3. PROSPECTIVE */}
                                {activeUngrdModal === 'prospective' && (
                                    <div className="space-y-8">
                                        <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-xl p-6 text-white shadow-lg flex items-center gap-6">
                                            <div className="p-4 bg-white/20 rounded-lg"><LandPlot size={32} /></div>
                                            <div><h3 className="text-xl font-bold">Intervención Prospectiva</h3><p className="text-emerald-100">Alineación con POT, EOT y adaptación al cambio climático.</p></div>
                                        </div>

                                        <AnalysisSummaryCard title="Resumen POT (Extraído)" content={data.ungrdAnalysis.reduction.prospective?.observation || "Pendiente de análisis profundo."} icon={<MapIcon size={16} />} colorClass="bg-emerald-50 border-emerald-200 text-emerald-800" />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><UploadCloud size={20} className="text-emerald-600" /> Análisis POT/EOT</h4>
                                                <p className="text-sm text-slate-500 mb-4">Carga el PDF del Plan de Ordenamiento Territorial para cruzar coordenadas y verificar usos del suelo permitidos.</p>

                                                <label className="w-full block bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer transition-all">
                                                    {isAnalyzingPOT ? <Loader2 className="animate-spin mx-auto text-emerald-600" /> : <FileText className="mx-auto text-slate-400 mb-2" />}
                                                    <span className="text-sm font-bold text-slate-600">{isAnalyzingPOT ? "Analizando zonificación..." : "Cargar POT (PDF)"}</span>
                                                    <input type="file" className="hidden" accept="application/pdf" onChange={handlePOTUpload} disabled={isAnalyzingPOT} />
                                                </label>

                                                {potAnalysisError && <div className="mt-4 text-xs text-red-600 bg-red-50 p-2 rounded">{potAnalysisError}</div>}
                                            </div>

                                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Sprout size={20} className="text-green-600" /> Adaptación Climática</h4>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                                                        <span className="text-slate-600">Considera Cambio Climático</span>
                                                        <span className={`font-bold ${data.ungrdAnalysis.reduction.prospective?.hasClimateChangeAdaptation ? 'text-green-600' : 'text-red-600'}`}>
                                                            {data.ungrdAnalysis.reduction.prospective?.hasClimateChangeAdaptation ? 'SÍ' : 'NO'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded">
                                                        <span className="text-slate-600">Sistema Alerta Temprana</span>
                                                        <span className={`font-bold ${data.ungrdAnalysis.reduction.prospective?.hasEarlyWarningSystem ? 'text-green-600' : 'text-red-600'}`}>
                                                            {data.ungrdAnalysis.reduction.prospective?.hasEarlyWarningSystem ? 'SÍ' : 'NO'}
                                                        </span>
                                                    </div>
                                                    {data.ungrdAnalysis.reduction.prospective?.climateDetailed?.adaptationStrategies && data.ungrdAnalysis.reduction.prospective.climateDetailed.adaptationStrategies.length > 0 && (
                                                        <div className="mt-2">
                                                            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Estrategias Detectadas</div>
                                                            <ul className="list-disc pl-4 space-y-1">
                                                                {data.ungrdAnalysis.reduction.prospective.climateDetailed.adaptationStrategies.slice(0, 3).map((s, i) => (
                                                                    <li key={i} className="text-xs text-slate-600">{s}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* DEEP POT RESULT */}
                                        {potAnalysisResult && (
                                            <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-100 animate-fade-in">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-bold text-emerald-900 flex items-center gap-2"><CheckCircle size={20} /> Resultado Auditoría POT</h4>
                                                    <div className="bg-white px-3 py-1 rounded-full text-sm font-black text-emerald-700 shadow-sm border border-emerald-200">Score: {potAnalysisResult.complianceScore}/100</div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-white p-4 rounded-xl border border-emerald-100/50">
                                                        <h5 className="font-bold text-xs uppercase text-slate-400 mb-2">Restricciones de Uso del Suelo</h5>
                                                        {potAnalysisResult.landUseRestrictions.length > 0 ? (
                                                            <ul className="space-y-2">{potAnalysisResult.landUseRestrictions.map((r, i) => <li key={i} className="text-xs text-red-600 flex gap-2 items-start"><AlertCircle size={12} className="shrink-0 mt-0.5" /> <span><strong>{r.issue}:</strong> {r.mitigation}</span></li>)}</ul>
                                                        ) : <div className="text-xs text-green-600">No se detectaron restricciones mayores.</div>}
                                                    </div>
                                                    <div className="bg-white p-4 rounded-xl border border-emerald-100/50">
                                                        <h5 className="font-bold text-xs uppercase text-slate-400 mb-2">Recomendaciones Urbanísticas</h5>
                                                        <ul className="space-y-1 list-disc pl-4">{potAnalysisResult.recommendations.map((r, i) => <li key={i} className="text-xs text-slate-600">{r}</li>)}</ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 4. FINANCIAL PROTECTION */}
                                {activeUngrdModal === 'financial' && (
                                    <div className="space-y-8">
                                        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex items-center gap-6">
                                            <div className="p-4 bg-white/20 rounded-lg"><Umbrella size={32} /></div>
                                            <div><h3 className="text-xl font-bold">Protección Financiera</h3><p className="text-indigo-100">Estrategias de retención y transferencia del riesgo (Seguros y Bonos).</p></div>
                                        </div>
                                        <AnalysisSummaryCard title="Estado Actual (Extraído)" content={data.ungrdAnalysis.reduction.financialProtection?.observation || "No se detallan pólizas específicas."} icon={<ShieldCheck size={16} />} colorClass="bg-indigo-50 border-indigo-200 text-indigo-800" />

                                        {!financialProtectionAnalysis ? (
                                            <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                                                <p className="text-slate-500 mb-4 text-sm">¿Desea auditar brechas de cobertura e instrumentos financieros?</p>
                                                <button onClick={handleAnalyzeFinancialProtection} disabled={isAnalyzingFinancial} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition flex items-center gap-2 mx-auto">{isAnalyzingFinancial ? <Loader2 className="animate-spin" /> : <Search />} Auditar Cobertura (Deep Dive)</button>
                                            </div>
                                        ) : (
                                            <div className="space-y-6 animate-fade-in">
                                                <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                                    <div><h4 className="font-bold text-slate-800 text-lg">Índice de Eficiencia de Cobertura</h4><p className="text-xs text-slate-500">Evaluación de pólizas vs Riesgos del proyecto</p></div>
                                                    <div className="text-4xl font-black text-indigo-600">{financialProtectionAnalysis.efficiencyScore}<span className="text-2xl text-slate-300">/100</span></div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                                        <h5 className="font-bold text-red-800 mb-3 flex items-center gap-2"><AlertCircle size={18} /> Brechas de Cobertura</h5>
                                                        <ul className="space-y-2">{(financialProtectionAnalysis.coverageGaps || []).map((gap, i) => (<li key={i} className="text-sm text-red-700 flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>{gap}</li>))}</ul>
                                                    </div>
                                                    <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                                        <h5 className="font-bold text-green-800 mb-3 flex items-center gap-2"><CheckCircle size={18} /> Instrumentos Recomendados</h5>
                                                        <ul className="space-y-2">{(financialProtectionAnalysis.recommendedInstruments || []).map((inst, i) => (<li key={i} className="text-sm text-green-700 flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>{inst}</li>))}</ul>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                                    <h5 className="font-bold text-slate-700 uppercase text-xs tracking-wider mb-2">Evaluación Estratégica</h5>
                                                    <p className="text-sm text-slate-600 leading-relaxed italic">"{financialProtectionAnalysis.strategicAssessment}"</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* 5. MANAGEMENT */}
                                {activeUngrdModal === 'management' && (
                                    <div className="space-y-8">
                                        <div className="bg-gradient-to-r from-orange-700 to-orange-600 rounded-xl p-6 text-white shadow-lg flex items-center gap-6">
                                            <div className="p-4 bg-white/20 rounded-lg"><Siren size={32} /></div>
                                            <div><h3 className="text-xl font-bold">Manejo de Desastres</h3><p className="text-orange-100">Preparación para la respuesta, protocolos de evacuación y recuperación.</p></div>
                                        </div>
                                        <AnalysisSummaryCard title="Estado Actual (Extraído)" content={data.ungrdAnalysis.management?.observation || "Pendiente."} icon={<ListChecks size={16} />} colorClass="bg-orange-50 border-orange-200 text-orange-800" />

                                        {!managementDeepAnalysis ? (
                                            <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                                                <p className="text-slate-500 mb-4 text-sm">¿Desea auditar planes de contingencia y logística de respuesta?</p>
                                                <button onClick={handleManagementAnalysis} disabled={isAnalyzingManagement} className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-orange-700 transition flex items-center gap-2 mx-auto">{isAnalyzingManagement ? <Loader2 className="animate-spin" /> : <Search />} Auditar Preparación (Deep Dive)</button>
                                            </div>
                                        ) : (
                                            <div className="space-y-6 animate-fade-in">
                                                <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                                    <div><h4 className="font-bold text-slate-800 text-lg">Nivel de Preparación (Response Readiness)</h4><p className="text-xs text-slate-500">Capacidad instalada vs Escenarios de Riesgo</p></div>
                                                    <div className="text-4xl font-black text-orange-600">{managementDeepAnalysis.preparednessScore}<span className="text-2xl text-slate-300">/100</span></div>
                                                </div>

                                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                                    <h5 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><FileCheck size={18} className="text-blue-500" /> Auditoría Plan de Contingencia</h5>
                                                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{managementDeepAnalysis.contingencyPlanAudit}</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-slate-50 p-3 rounded-lg"><strong className="block text-xs uppercase text-slate-400 mb-1">Logística (Puntos Fuertes)</strong><ul className="list-disc pl-4 space-y-1">{managementDeepAnalysis.responseLogistics.strengths.map((s, i) => <li key={i} className="text-xs text-slate-600">{s}</li>)}</ul></div>
                                                        <div className="bg-slate-50 p-3 rounded-lg"><strong className="block text-xs uppercase text-slate-400 mb-1">Logística (Debilidades)</strong><ul className="list-disc pl-4 space-y-1">{managementDeepAnalysis.responseLogistics.weaknesses.map((w, i) => <li key={i} className="text-xs text-red-600">{w}</li>)}</ul></div>
                                                    </div>
                                                </div>

                                                <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                                                    <h5 className="font-bold text-yellow-800 mb-4 flex items-center gap-2"><Bot size={18} /> Recomendaciones de Acción Inmediata</h5>
                                                    <div className="space-y-3">
                                                        {(managementDeepAnalysis.actionableRecommendations || []).map((rec, i) => (
                                                            <div key={i} className="flex gap-3 bg-white/60 p-3 rounded-lg border border-yellow-200/50">
                                                                <div className="bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0">{i + 1}</div>
                                                                <p className="text-sm text-yellow-900 font-medium">{rec}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </BaseModal>

                    {/* TAB CONTENT */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-fade-in pb-10">
                            <RealTimeHealthTicker metrics={{
                                cpi: calculatedMetrics.cpi,
                                spi: calculatedMetrics.spi,
                                healthScore: data.kpis.financialHealth === 'Saludable' ? 90 : 45
                            }} />

                            <ExecutionStatusWidget
                                startDate={data.startDate}
                                endDate={data.endDate}
                                progress={data.progressPercentage}
                                financialProgress={calculatedMetrics.financialProgress}
                                totalBudget={data.totalBudget}
                            />
                        </div>
                    )}

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
                                        <span className="flex items-center gap-1"><MapPin size={16} /> {data.location.municipality}, {data.location.department}</span>
                                        <span className="flex items-center gap-1"><Building2 size={16} /> {data.contractor}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Presupuesto Total</div>
                                    <div className="text-3xl font-black text-slate-900">{formatCurrency(data.totalBudget)}</div>
                                    <div className="text-xs font-medium text-slate-500 mt-1">Ejecutado: {formatCurrency(data.spentBudget)} ({data.progressPercentage}%)</div>
                                    <button onClick={handleSearchContext} disabled={isSearching} className="mt-4 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ml-auto border border-blue-200">
                                        {isSearching ? <Loader2 className="animate-spin" size={14} /> : <Search size={14} />} {isSearching ? 'Investigando...' : 'Radar de Noticias'}
                                    </button>
                                </div>
                            </div>

                            {/* NEW: Execution Status Widget (Inserted Here) */}
                            <div className="lg:col-span-3">
                                <ExecutionStatusWidget
                                    startDate={data.startDate}
                                    endDate={data.endDate}
                                    progress={data.progressPercentage}
                                    financialProgress={calculatedMetrics.financialProgress}
                                    totalBudget={data.totalBudget}
                                />
                            </div>

                            {/* KPI Cards Row */}
                            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                                {/* ... KPI Cards (No changes) ... */}
                                <div onClick={() => setActiveMetricModal('cpi')} className={`p-6 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all hover:scale-105 hover:shadow-lg relative group ${calculatedMetrics.cpi < 0.9 ? 'bg-red-50 border-red-200 hover:bg-red-100' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Eficiencia de Costos (CPI)</div>
                                            <Info size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className={`text-4xl font-black ${calculatedMetrics.cpi < 0.9 ? 'text-red-600' : 'text-slate-900'}`}>{calculatedMetrics.cpi.toFixed(2)}</div>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                        {calculatedMetrics.cpi < 1 ? <TrendingDown size={14} className="text-red-500" /> : <TrendingUp size={14} className="text-green-500" />}
                                        {calculatedMetrics.cpi < 1 ? 'Sobrecostos detectados' : 'Bajo presupuesto'}
                                    </div>
                                </div>
                                <div onClick={() => setActiveMetricModal('spi')} className={`p-6 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all hover:scale-105 hover:shadow-lg relative group ${calculatedMetrics.spi < 0.9 ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Eficiencia Cronograma (SPI)</div>
                                            <Info size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <div className={`text-4xl font-black ${calculatedMetrics.spi < 0.9 ? 'text-orange-600' : 'text-slate-900'}`}>{calculatedMetrics.spi.toFixed(2)}</div>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                        {calculatedMetrics.spi < 1 ? <Clock size={14} className="text-orange-500" /> : <CheckCircle size={14} className="text-green-500" />}
                                        {calculatedMetrics.spi < 1 ? 'Proyecto retrasado' : 'A tiempo'}
                                    </div>
                                </div>
                                <div onClick={() => setActiveTab('risks')} className="p-6 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between cursor-pointer transition-all hover:scale-105 hover:shadow-lg hover:border-red-300 group relative">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Riesgos Críticos</div>
                                            <ArrowRight size={14} className="text-slate-300 group-hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1" />
                                        </div>
                                        <div className="text-4xl font-black text-slate-900">{riskStats.critical}</div>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-2 group-hover:text-red-600 transition-colors">De {data.risks.length} riesgos totales</div>
                                </div>
                                <div onClick={() => setActiveTab('execution')} className="p-6 rounded-2xl border border-gray-200 bg-white flex flex-col justify-between cursor-pointer transition-all hover:scale-105 hover:shadow-lg hover:border-orange-300 group relative">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cuellos de Botella</div>
                                            <ArrowRight size={14} className="text-slate-300 group-hover:text-orange-500 transition-colors opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1" />
                                        </div>
                                        <div className="text-4xl font-black text-slate-900">{dynamicBottlenecks.length}</div>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-2 group-hover:text-orange-600 transition-colors">Bloqueos activos</div>
                                </div>
                                <div onClick={() => setActiveMetricModal('isi')} className={`p-6 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all hover:scale-105 hover:shadow-lg relative group ${calculatedMetrics.isi < 0.9 ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                                    <div className="absolute top-0 right-0 p-2 opacity-10"><Zap size={48} className="text-indigo-600" /></div>
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Integrated Speed (ISI)</div>
                                            <Zap size={14} className="text-indigo-400 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                        <div className={`text-4xl font-black ${calculatedMetrics.isi < 0.9 ? 'text-indigo-700' : 'text-slate-900'}`}>{calculatedMetrics.isi.toFixed(2)}</div>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                        <Target size={14} className={calculatedMetrics.isi < 1 ? 'text-red-500' : 'text-green-500'} />
                                        {calculatedMetrics.isi < 1 ? 'Convergencia divergente' : 'Alta velocidad de cierre'}
                                    </div>
                                </div>
                            </div>

                            {/* 5 MODULE UNGRD GRID */}
                            <div className="lg:col-span-3">
                                {/* ... 5 Modules Grid (No changes) ... */}
                                <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2"><ShieldCheck size={20} className="text-slate-700" /> Ciclo Integral de Gestión del Riesgo (UNGRD)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {/* ... Cards ... */}
                                    <div onClick={() => setActiveUngrdModal('knowledge')} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between h-40">
                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><FlaskConical size={48} className="text-teal-600" /></div>
                                        <div><h4 className="font-bold text-sm text-slate-800 mb-1 group-hover:text-teal-700">1. Conocimiento</h4><p className="text-[10px] text-slate-500 line-clamp-3 leading-tight">{data.ungrdAnalysis?.knowledge?.observation || "Sin análisis."}</p></div>
                                        <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider flex items-center gap-1 mt-2">Ver Modelos <ArrowRight size={10} /></span>
                                    </div>
                                    <div onClick={() => setActiveUngrdModal('corrective')} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between h-40">
                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Pickaxe size={48} className="text-blue-600" /></div>
                                        <div><h4 className="font-bold text-sm text-slate-800 mb-1 group-hover:text-blue-700">2. Reducción (Obras)</h4><p className="text-[10px] text-slate-500 line-clamp-3 leading-tight">{data.ungrdAnalysis?.reduction?.corrective?.observation || "Sin análisis."}</p></div>
                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1 mt-2">Ver Ingeniería <ArrowRight size={10} /></span>
                                    </div>
                                    <div onClick={() => setActiveUngrdModal('prospective')} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between h-40">
                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><LandPlot size={48} className="text-emerald-600" /></div>
                                        <div><h4 className="font-bold text-sm text-slate-800 mb-1 group-hover:text-emerald-700">3. Prospectiva (POT)</h4><p className="text-[10px] text-slate-500 line-clamp-3 leading-tight">{data.ungrdAnalysis?.reduction?.prospective?.observation || "Sin análisis de POT."}</p></div>
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1 mt-2">Ver Planificación <ArrowRight size={10} /></span>
                                    </div>
                                    <div onClick={() => setActiveUngrdModal('financial')} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between h-40">
                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Umbrella size={48} className="text-indigo-600" /></div>
                                        <div><h4 className="font-bold text-sm text-slate-800 mb-1 group-hover:text-indigo-700">4. Prot. Financiera</h4><p className="text-[10px] text-slate-500 line-clamp-3 leading-tight">{data.ungrdAnalysis?.reduction?.financialProtection?.observation || "Sin análisis de seguros."}</p></div>
                                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1 mt-2">Ver Seguros <ArrowRight size={10} /></span>
                                    </div>
                                    <div onClick={() => setActiveUngrdModal('management')} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-orange-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between h-40">
                                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Siren size={48} className="text-orange-600" /></div>
                                        <div><h4 className="font-bold text-sm text-slate-800 mb-1 group-hover:text-orange-700">5. Manejo Desastres</h4><p className="text-[10px] text-slate-500 line-clamp-3 leading-tight">{data.ungrdAnalysis?.management?.observation || "Sin análisis."}</p></div>
                                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1 mt-2">Ver Respuesta <ArrowRight size={10} /></span>
                                    </div>
                                </div>
                            </div>

                            {/* S-Curve Chart */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-[400px]">
                                <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-blue-600" /> Curva S: Valor Ganado (EVM)</h3>
                                <ResponsiveContainer width="100%" height="85%">
                                    <AreaChart data={sCurveData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPV" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorEV" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(val) => new Date(val).toLocaleDateString()} />
                                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                        <Legend />
                                        <Area type="monotone" dataKey="PV" name="Valor Planeado (PV)" stroke="#94a3b8" fillOpacity={1} fill="url(#colorPV)" strokeWidth={2} strokeDasharray="5 5" />
                                        <Area type="monotone" dataKey="EV" name="Valor Ganado (EV)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEV)" strokeWidth={3} />
                                        <Area type="monotone" dataKey="AC" name="Costo Actual (AC)" stroke="#ef4444" fill="none" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Evolution Timeline */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-1 h-[400px] overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pb-2 border-b border-gray-100">
                                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                        <History size={20} className="text-blue-600" /> Evolución
                                    </h3>
                                    <button onClick={() => setIsEvolutionModalOpen(true)} className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition border border-indigo-200 flex items-center gap-1">
                                        <GitMerge size={14} /> Evolucionar
                                    </button>
                                </div>
                                {/* ... Timeline Content (No changes) ... */}
                                <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                    {(data.evolutionHistory || []).map((log, i) => (
                                        <div key={i} className="relative pl-10 group">
                                            <div className={`absolute left-[11px] top-6 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${log.efficiencyVerdict === 'Critico' ? 'bg-red-500' :
                                                log.efficiencyVerdict === 'Optimo' ? 'bg-green-500' : 'bg-slate-400'
                                                }`}></div>
                                            <div onClick={() => setExpandedLogIndex(expandedLogIndex === i ? null : i)} className={`rounded-xl border transition-all cursor-pointer relative overflow-hidden ${expandedLogIndex === i ? 'bg-white border-blue-200 shadow-md ring-1 ring-blue-100' : 'bg-slate-50 border-slate-100 hover:border-blue-200'}`}>
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">{new Date(log.date).toLocaleDateString()} {expandedLogIndex === i ? <Minimize2 size={10} /> : <Maximize2 size={10} />}</div><h5 className="font-bold text-slate-800 text-sm truncate pr-2">{log.sourceDocument}</h5></div>
                                                        {log.efficiencyVerdict && (<span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide border ${log.efficiencyVerdict === 'Critico' ? 'bg-red-100 text-red-700 border-red-200' : log.efficiencyVerdict === 'Optimo' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>{log.efficiencyVerdict}</span>)}
                                                    </div>
                                                    <p className={`text-xs text-slate-600 italic ${expandedLogIndex === i ? '' : 'line-clamp-2'}`}>"{log.summary}"</p>
                                                </div>
                                                {expandedLogIndex === i && (
                                                    <div className="border-t border-gray-100 bg-slate-50/50 p-4 animate-fade-in">
                                                        {log.efficiencyRationale && (<div className="mb-4 bg-white p-3 rounded-lg border border-slate-200 shadow-sm"><strong className="block text-[10px] uppercase text-slate-400 mb-1">Racional del Veredicto</strong><p className="text-xs text-slate-700 leading-relaxed">{log.efficiencyRationale}</p></div>)}
                                                        {log.changes.length > 0 && (<div className="space-y-2"><div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Cambios Registrados</div>{log.changes.map((change, j) => (<div key={j} className="bg-white p-2 rounded border border-gray-200 flex items-center justify-between gap-2"><div className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1 rounded">{change.field}</div><div className="flex items-center gap-1 text-[10px]"><span className="text-slate-400 line-through max-w-[60px] truncate">{change.oldValue}</span><ArrowRight size={10} className="text-slate-300" /><span className="font-bold text-blue-600 max-w-[80px] truncate">{change.newValue}</span></div></div>))}</div>)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {(data.evolutionHistory || []).length === 0 && (<div className="pl-10 text-sm text-slate-400 italic">No hay historial de evolución. Sube un nuevo reporte para comenzar.</div>)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ... Rest of the tabs (Contractor, Risks, etc.) remain the same ... */}
                    {activeTab === 'risks' && (
                        /* ... Risk Matrix (No changes) ... */
                        <div className="space-y-8 animate-fade-in">
                            {/* ... Risk Matrix Content ... */}
                            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3"><ShieldAlert size={32} className="text-red-600" /> Matriz de Riesgos ISO 31000</h3>
                                    <p className="text-slate-500 mt-1">Mapa de calor interactivo para la gestión de amenazas y vulnerabilidades.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-100 font-bold text-sm flex flex-col items-center"><span className="text-xs uppercase opacity-70">Críticos</span><span className="text-xl">{riskStats.critical}</span></div>
                                    <div className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg border border-orange-100 font-bold text-sm flex flex-col items-center"><span className="text-xs uppercase opacity-70">Altos</span><span className="text-xl">{riskStats.high}</span></div>
                                </div>
                            </div>
                            {/* ... Rest of Risk Matrix ... */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* ... Matrix Grid (Reuse existing code) ... */}
                                <div className="lg:col-span-5">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg relative">
                                        <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider"><Target size={18} /> Mapa de Calor</h4>
                                        <div className="flex">
                                            <div className="w-8 flex items-center justify-center"><span className="transform -rotate-90 text-xs font-black text-slate-400 tracking-[0.2em] whitespace-nowrap">PROBABILIDAD</span></div>
                                            <div className="flex-1">
                                                <div className="grid grid-cols-3 gap-3 aspect-square">
                                                    {['High', 'Medium', 'Low'].map((prob) => (
                                                        <React.Fragment key={prob}>
                                                            {['Low', 'Medium', 'High'].map((imp) => {
                                                                const cellRisks = getRisksByLevel(prob, imp);
                                                                const isSelected = riskFilter?.prob === prob && riskFilter?.imp === imp;
                                                                let colorClass = 'bg-gray-100 text-gray-400';
                                                                if (prob === 'High' && imp === 'High') colorClass = 'bg-red-500 text-white shadow-red-200';
                                                                else if ((prob === 'High' && imp === 'Medium') || (prob === 'Medium' && imp === 'High')) colorClass = 'bg-orange-500 text-white shadow-orange-200';
                                                                else if ((prob === 'Medium' && imp === 'Medium') || (prob === 'High' && imp === 'Low') || (prob === 'Low' && imp === 'High')) colorClass = 'bg-yellow-400 text-yellow-900 shadow-yellow-200';
                                                                else if ((prob === 'Low' && imp === 'Medium') || (prob === 'Medium' && imp === 'Low')) colorClass = 'bg-lime-300 text-lime-900 shadow-lime-200';
                                                                else colorClass = 'bg-green-400 text-green-900 shadow-green-200';
                                                                return (<div key={`${prob}-${imp}`} onClick={() => setRiskFilter(isSelected ? null : { prob, imp })} className={`rounded-xl relative cursor-pointer transition-all duration-300 flex flex-col items-center justify-center p-2 hover:scale-105 hover:z-10 shadow-lg ${colorClass} ${isSelected ? 'ring-4 ring-slate-800 scale-110 z-20' : 'opacity-90 hover:opacity-100'} ${riskFilter && !isSelected ? 'opacity-40 grayscale-[0.5]' : ''}`}><span className="text-3xl font-black">{cellRisks.length}</span>{cellRisks.length > 0 && <span className="text-[10px] uppercase font-bold opacity-80 mt-1">Ver</span>}</div>);
                                                            })}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                                <div className="mt-3 text-center"><span className="text-xs font-black text-slate-400 tracking-[0.2em] uppercase">Impacto</span><div className="flex justify-between px-4 mt-1 text-[10px] font-bold text-slate-400 uppercase"><span>Bajo</span><span>Medio</span><span>Alto</span></div></div>
                                            </div>
                                            <div className="w-4 ml-2 flex flex-col justify-between py-4 text-[10px] font-bold text-slate-400 uppercase h-[calc(100%-40px)]"><span>Alta</span><span>Media</span><span>Baja</span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-7 space-y-4">
                                    <div className="flex justify-between items-center mb-2"><h4 className="font-bold text-slate-800 flex items-center gap-2"><ListChecks size={20} /> {riskFilter ? 'Riesgos Filtrados' : 'Listado Completo'}</h4>{riskFilter && (<button onClick={() => setRiskFilter(null)} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"><RefreshCw size={12} /> Restablecer Filtro</button>)}</div>
                                    <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                                        {filteredRisks.length > 0 ? filteredRisks.map((risk, i) => (
                                            <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex gap-2 mb-2">
                                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${getProbColor(risk.probability)}`}>Prob: {risk.probability}</span>
                                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${getImpColor(risk.impact)}`}>Imp: {risk.impact}</span>
                                                    </div>
                                                    <button onClick={() => handleAnalyzeRiskMitigation(risk)} disabled={isMitigationLoading} className="opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 text-indigo-600 p-2 rounded-lg hover:bg-indigo-100" title="Generar Estrategia AI"><Sparkles size={16} /></button>
                                                </div>
                                                <h5 className="font-bold text-slate-800 text-sm mb-2">{risk.risk}</h5>
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Mitigación Preliminar</span>
                                                    <p className="text-xs text-slate-600 leading-tight">{risk.mitigation}</p>
                                                </div>
                                            </div>
                                        )) : (<div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300"><p className="text-slate-400 font-medium">No hay riesgos en este cuadrante.</p></div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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

                    {/* ... Other Tabs (Contractor, Photos, Financial, Assistant) - No changes needed, just ensure they are closed properly ... */}

                    {activeTab === 'contractor' && (
                        /* ... Contractor content ... */
                        <div className="space-y-8 animate-fade-in">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div><h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Briefcase size={24} className="text-blue-600" /> Perfil del Contratista</h3><p className="text-slate-500">{data.contractor} (NIT: {data.nit})</p></div>
                                    <button onClick={handleAnalyzeContractor} disabled={isAnalyzingContractor} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition">{isAnalyzingContractor ? <Loader2 className="animate-spin" size={16} /> : <FileSearch size={16} />}{isAnalyzingContractor ? 'Auditando...' : 'Auditoría Forense (K)'}</button>
                                </div>
                                {contractorProfile ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Índice de Idoneidad</div><div className="flex items-end gap-2"><div className={`text-4xl font-black ${contractorProfile.suitabilityScore > 70 ? 'text-green-600' : 'text-red-600'}`}>{contractorProfile.suitabilityScore}/100</div><div className="text-sm font-medium text-slate-500 mb-1">{contractorProfile.financialHealth}</div></div></div>
                                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100"><h5 className="font-bold text-blue-900 text-sm mb-2">Resumen Ejecutivo</h5><p className="text-sm text-blue-800 leading-relaxed">{contractorProfile.summary}</p></div>
                                        </div>
                                        <div><h5 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-orange-500" /> Red Flags Detectadas</h5><ul className="space-y-2">{(contractorProfile.redFlags || []).map((flag, i) => (<li key={i} className="text-xs text-red-700 bg-red-50 p-2 rounded border border-red-100 flex items-start gap-2"><span className="mt-0.5 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>{flag}</li>))}{(contractorProfile.redFlags || []).length === 0 && <li className="text-xs text-slate-400 italic">No se detectaron banderas rojas.</li>}</ul></div>
                                    </div>
                                ) : (<div className="text-center py-10 text-slate-400"><p>No se ha generado el perfil del contratista.</p></div>)}
                            </div>
                        </div>
                    )}


                    {activeTab === 'financial' && (
                        <div className="space-y-8 animate-fade-in pb-10">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                        <Coins size={24} className="text-blue-600" /> Terminal de Inteligencia Financiera
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium">Análisis forense de inversiones, proyecciones estocásticas y escenarios de sensibilidad.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={runMontecarlo} className="bg-purple-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm">
                                        <Shuffle size={16} /> Simulación Monte Carlo
                                    </button>
                                    <button onClick={handleRunFinancialDeepAnalysis} disabled={isAnalyzingFinance} className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm">
                                        {isAnalyzingFinance ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                                        Auditoría Forense CFO
                                    </button>
                                </div>
                            </div>

                            {/* FORENSIC KPI GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <FinancialSmartCard title="Salud Financiera" value={financialAnalysisResult ? `${financialAnalysisResult.healthScore}/100` : "Pendiente"} subtext="Algoritmo Ponderado AI" type="radial" data={financialAnalysisResult ? financialAnalysisResult.healthScore : 0} color="#3b82f6" metricKey="healthScore" />
                                <FinancialSmartCard title="Estimado al Cierre (EAC)" value={formatCurrency(calculatedMetrics.eac)} subtext={`Desviación: ${formatCurrency(calculatedMetrics.eac - data.totalBudget)}`} type="bar" data={[{ name: 'EAC', value: calculatedMetrics.eac }]} color="#f59e0b" metricKey="eac" />
                                <FinancialSmartCard title="Índice de Eficiencia (CPI)" value={calculatedMetrics.cpi.toFixed(2)} subtext={calculatedMetrics.cpi >= 1 ? "Eficiencia Óptima" : "Sobrecosto Detectado"} type="gauge" data={calculatedMetrics.cpi} color="#10b981" metricKey="cpi" />
                                <FinancialSmartCard title="Relación Beneficio-Costo" value={calculatedMetrics.bcRatio.toFixed(2)} subtext={calculatedMetrics.bcRatio > 1 ? "Socialmente Viable" : "Baja Viabilidad"} type="icon" data={100} color="#6366f1" metricKey="bcRatio" />
                            </div>

                            {/* WATERFALL & BREAKDOWN SECTION */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider"><Activity size={18} className="text-blue-500" /> Puente de Presupuesto vs Proyección (EAC)</h4>
                                    <WaterfallBudgetChart planned={data.totalBudget} actual={data.spentBudget} eac={calculatedMetrics.eac} formatCurrency={formatCurrency} />
                                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                                        <div className="text-xs text-slate-500 font-bold uppercase">Brecha de Financiamiento Proyectada</div>
                                        <div className={`text-lg font-black ${calculatedMetrics.eac > data.totalBudget ? 'text-red-600' : 'text-green-600'}`}>
                                            {formatCurrency(data.totalBudget - calculatedMetrics.eac)}
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Composición de la Inversión</h4>
                                        <div className="h-[250px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={[
                                                        { name: 'CAPEX (Inversión Corpórea)', value: calculatedMetrics.capex },
                                                        { name: 'OPEX (Carga Operativa)', value: calculatedMetrics.opex }
                                                    ]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                        <Cell fill="#3b82f6" />
                                                        <Cell fill="#94a3b8" />
                                                    </Pie>
                                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                                    <Legend verticalAlign="bottom" height={36} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div onClick={handleCapexOpexClick} className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-100 transition-all flex justify-between items-center group">
                                        <div>
                                            <div className="text-[10px] font-bold text-blue-800 uppercase mb-1 underline">Ver Justificación AI</div>
                                            <div className="text-xs text-blue-700">Análisis detallado de clasificación contable.</div>
                                        </div>
                                        <ArrowRight size={16} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            {/* SENSITIVITY ANALYSIS (PREMIUM) */}
                            {financialAnalysisResult && financialAnalysisResult.sensitivityAnalysis && (
                                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-slate-900 p-3 rounded-2xl text-white shadow-lg"><Sliders size={24} /></div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900">Cuadro de Mando de Sensibilidad</h4>
                                            <p className="text-sm text-slate-500">Simulación proactiva de riesgos de mercado y retrasos.</p>
                                        </div>
                                    </div>
                                    <SensitivityDashboard factors={financialAnalysisResult.sensitivityAnalysis} formatCurrency={formatCurrency} />
                                </div>
                            )}

                            {/* OPTIMIZATION STRATEGIES */}
                            {financialAnalysisResult && (
                                <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-10"><BrainCircuit size={120} /></div>
                                    <h4 className="font-black text-2xl mb-8 flex items-center gap-3"><Zap size={28} className="text-yellow-400" /> Estrategias de Optimización del CFO Virtual</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {financialAnalysisResult.optimizationStrategies.map((strat, i) => (
                                            <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
                                                <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-3">{strat.title}</div>
                                                <p className="text-sm text-gray-100 mb-4 font-medium leading-relaxed">{strat.action}</p>
                                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Impacto Est.</span>
                                                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-black border border-green-500/30">{strat.impact}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* BUDGET ITEMS TABLE (MODERN) */}
                            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                                <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-sm uppercase tracking-wider"><ListChecks size={18} /> Auditoría Detallada de Ítems Presupuestales</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-left text-xs font-bold text-slate-400 uppercase">
                                                <th className="pb-4">Descripción del Ítem</th>
                                                <th className="pb-4">Categoría</th>
                                                <th className="pb-4 text-center">Unidad</th>
                                                <th className="pb-4 text-right">Cantidad</th>
                                                <th className="pb-4 text-right">Vr. Unitario</th>
                                                <th className="pb-4 text-right pr-4">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {(data.financialLineItems || []).slice(0, 15).map((item, i) => (
                                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                    <td className="py-4 pr-4">
                                                        <div className="font-bold text-slate-700 truncate max-w-[250px]" title={item.description}>{item.description}</div>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className="text-[10px] bg-slate-100 px-2 py-1 rounded font-bold text-slate-500">{item.category || 'General'}</span>
                                                    </td>
                                                    <td className="py-4 text-center text-slate-500">{item.unit || 'und'}</td>
                                                    <td className="py-4 text-right font-medium text-slate-600">{item.quantity}</td>
                                                    <td className="py-4 text-right text-slate-500">{formatCurrency(item.unitPrice || 0)}</td>
                                                    <td className="py-4 text-right font-mono font-bold text-slate-900 pr-4">{formatCurrency(item.totalAmount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pmbok' && (
                        /* ... PMBOK Content ... */
                        <div className="space-y-8 animate-fade-in">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center"><div><h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><BookOpen size={24} className="text-purple-600" /> Estándar PMBOK 7</h3><p className="text-slate-500 text-sm">Auditoría de alineación con los 12 principios de gestión de proyectos.</p></div><button onClick={handleRunPMBOKAnalysis} disabled={isAnalyzingPMBOK} className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:bg-purple-700 transition flex items-center gap-2">{isAnalyzingPMBOK ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}{pmbokData ? 'Re-Evaluar' : 'Auditar Principios'}</button></div>
                            {pmbokData ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{pmbokData.principles.map((p, i) => (<div key={i} onClick={() => handlePMBOKClick(p)} className={`p-6 rounded-xl border cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden ${p.score && p.score >= 8 ? 'bg-green-50 border-green-200' : p.score && p.score >= 5 ? 'bg-white border-gray-200 hover:border-blue-300' : 'bg-red-50 border-red-200'}`}><div className="flex justify-between items-start mb-4"><div className={`p-3 rounded-lg ${p.score && p.score >= 8 ? 'bg-green-100 text-green-700' : p.score && p.score >= 5 ? 'bg-blue-50 text-blue-600' : 'bg-red-100 text-red-700'}`}>{getPMBOKIcon(p.englishName || p.name)}</div><div className={`text-2xl font-black ${p.score && p.score >= 8 ? 'text-green-700' : p.score && p.score >= 5 ? 'text-slate-700' : 'text-red-700'}`}>{p.score}<span className="text-sm opacity-50">/10</span></div></div><h4 className="font-bold text-slate-800 mb-2">{p.name}</h4><p className="text-xs text-slate-500 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">{p.reasoning}</p><div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 px-2 py-1 rounded shadow-sm">Deep Dive</span></div></div>))}</div>
                            ) : (<div className="text-center py-20 bg-slate-50 border border-dashed border-slate-300 rounded-2xl"><BookOpen size={48} className="mx-auto text-slate-300 mb-4" /><h3 className="text-lg font-bold text-slate-500">Auditoría Pendiente</h3><p className="text-sm text-slate-400">Ejecuta el análisis para evaluar los 12 principios.</p></div>)}
                        </div>
                    )}

                    {/* ... Other Modals (PMBOK Detail, etc.) ... */}
                    <BaseModal isOpen={!!activePMBOKPrinciple} onClose={() => setActivePMBOKPrinciple(null)} title={`Principio: ${activePMBOKPrinciple?.name}`}>
                        {isPMBOKDeepAnalyzing ? (
                            <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-purple-600 mb-4" size={48} /><p className="text-slate-500">Consultando al PMI Fellow AI...</p></div>
                        ) : pmbokDeepAnalysisResult ? (
                            <div className="space-y-6 animate-fade-in">
                                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200"><h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2"><Stethoscope size={18} /> Diagnóstico Profundo</h4><p className="text-sm text-purple-800 leading-relaxed">{pmbokDeepAnalysisResult.diagnosis}</p></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><h5 className="font-bold text-green-700 mb-4 flex items-center gap-2"><ArrowUp size={18} /> Fortalezas</h5><ul className="space-y-2">{(pmbokDeepAnalysisResult.strengths || []).map((s, i) => <li key={i} className="text-sm text-slate-600 flex gap-2"><CheckCircle size={14} className="text-green-500 shrink-0 mt-0.5" />{s}</li>)}</ul></div><div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><h5 className="font-bold text-red-700 mb-4 flex items-center gap-2"><ArrowDown size={18} /> Debilidades</h5><ul className="space-y-2">{(pmbokDeepAnalysisResult.weaknesses || []).map((w, i) => <li key={i} className="text-sm text-slate-600 flex gap-2"><AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />{w}</li>)}</ul></div></div>
                                <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg"><h5 className="font-bold text-lg mb-4 flex items-center gap-2"><Zap size={20} className="text-yellow-400" /> Pasos de Acción Inmediata</h5><div className="space-y-3">{(pmbokDeepAnalysisResult.actionableSteps || []).map((step, i) => (<div key={i} className="flex gap-4 items-center bg-white/10 p-3 rounded-lg border border-white/5"><div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div><p className="text-sm text-gray-200">{step}</p></div>))}</div></div>
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-4 items-start"><AlertTriangle size={24} className="text-orange-500 shrink-0" /><div><h6 className="font-bold text-orange-800 text-sm uppercase mb-1">Simulación de Consecuencia</h6><p className="text-xs text-orange-700 italic">"{pmbokDeepAnalysisResult.consequenceSimulation}"</p></div></div>
                            </div>
                        ) : (<div className="text-center py-20 text-slate-400">No se pudo generar el análisis detallado.</div>)}
                    </BaseModal>

                    {/* MODAL EVOLUCIONAR */}
                    <BaseModal isOpen={isEvolutionModalOpen} onClose={() => setIsEvolutionModalOpen(false)} title="Evolucionar Proyecto (Ingesta de Nueva Evidencia)" maxWidth="max-w-4xl">
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex items-start gap-4">
                                <div className="bg-blue-600 text-white p-3 rounded-full shrink-0"><GitMerge size={24} /></div>
                                <div>
                                    <h4 className="font-bold text-blue-900 text-lg">Actualización Forense Inteligente</h4>
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                        El sistema comparará la nueva evidencia contra la línea base del proyecto.
                                        Detectará automáticamente discrepancias en <strong>Presupuesto, Avance Físico y Riesgos</strong>.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
                                <button onClick={() => setEvolutionTab('pdf')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${evolutionTab === 'pdf' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}><FileText size={16} /> Reporte PDF</button>
                                <button onClick={() => setEvolutionTab('image')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${evolutionTab === 'image' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}><Image size={16} /> Evidencia Visual</button>
                                <button onClick={() => setEvolutionTab('text')} className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${evolutionTab === 'text' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200'}`}><MessageSquare size={16} /> Texto / Email</button>
                            </div>

                            <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 min-h-[200px] flex flex-col items-center justify-center p-8 transition-all hover:border-blue-400 hover:bg-blue-50/10 group">
                                {isEvolving ? (
                                    <div className="text-center">
                                        <Loader2 size={48} className="text-blue-600 animate-spin mb-4 mx-auto" />
                                        <h5 className="font-bold text-slate-700 animate-pulse">Analizando Evidencia...</h5>
                                        <p className="text-xs text-slate-500 mt-2">Auditando impacto en cronograma y presupuesto.</p>
                                    </div>
                                ) : (
                                    <>
                                        {evolutionTab === 'pdf' && (
                                            <label className="text-center cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                                <UploadCloud size={48} className="text-slate-300 mb-4 group-hover:text-blue-500 transition-colors" />
                                                <span className="font-bold text-slate-600 mb-1">Arrastra tu reporte PDF aquí</span>
                                                <span className="text-xs text-slate-400">o haz clic para explorar</span>
                                                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => {
                                                    if (e.target.files?.[0]) handleEvolution(e.target.files[0]);
                                                }} />
                                            </label>
                                        )}
                                        {evolutionTab === 'image' && (
                                            <label className="text-center cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                                <Camera size={48} className="text-slate-300 mb-4 group-hover:text-blue-500 transition-colors" />
                                                <span className="font-bold text-slate-600 mb-1">Sube fotos de obra o bitácoras</span>
                                                <span className="text-xs text-slate-400">Formatos: JPG, PNG</span>
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                                    if (e.target.files?.[0]) handleEvolution(e.target.files[0]);
                                                }} />
                                            </label>
                                        )}
                                        {evolutionTab === 'text' && (
                                            <div className="w-full">
                                                <textarea
                                                    value={evolutionTextInput}
                                                    onChange={(e) => setEvolutionTextInput(e.target.value)}
                                                    placeholder="Pega aquí el correo del interventor, reporte de WhatsApp o notas de campo..."
                                                    className="w-full h-40 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                                                ></textarea>
                                                <button
                                                    onClick={() => handleEvolution()}
                                                    disabled={!evolutionTextInput.trim()}
                                                    className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Sparkles size={16} /> Procesar Texto
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {evolutionError && (
                                <div className="bg-red-50 p-4 rounded-xl border border-red-200 flex items-center gap-3 text-red-700 text-sm font-bold">
                                    <AlertCircle size={20} /> {evolutionError}
                                </div>
                            )}
                        </div>
                    </BaseModal>

                </div>
            </div>
        </div>
    );
};
