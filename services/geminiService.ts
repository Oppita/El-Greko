
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { generateWithGroq, isQuotaError, isGroqConfigured } from "./groqService";
import { generateWithOpenAI, isOpenAIConfigured } from "./openaiService";
import { generateWithXai, isXaiConfigured } from "./xaiService";
import { AI_MODELS, getPrimaryModel, getFallbackModel, isProviderEnabled } from "./aiConfig";
import { ProjectData, INITIAL_PROJECT_DATA, RiskItem, InsurancePolicy, Stakeholder, Bottleneck, POTAnalysis, PMBOKAnalysis, PMBOKDeepAnalysis, FinancialProtectionDeepAnalysis, BottleneckDeepAnalysis, LegalDocument, ResourceAnalysis, ContractorProfile, ProgressAudit, CorrectiveDeepAnalysis, ProjectMilestone, ActivityDeepAnalysis, KnowledgeDeepAnalysis, ManagementDeepAnalysis, GrekoCronosDeepAnalysis, FinancialDeepAnalysis, SearchResult, EvolutionLog, CapexOpexDeepAnalysis, ValueEngineeringAction } from "../types";

const getApiKey = () => {
    let key = '';
    try {
        // @ts-ignore
        key = import.meta.env.VITE_GEMINI_API_KEY || '';
    } catch (e) {
        // Fallback for non-Vite environments
        key = process?.env?.VITE_GEMINI_API_KEY || '';
    }
    return key;
};

const API_KEY = getApiKey();

if (!API_KEY) {
    console.error('GEMINI API KEY IS MISSING. Check your .env file or GitHub Secrets configuration.');
}

// VERSION MARKER - TIMESTAMP: 2026-01-18 T 12:15:00
// This helps verify if the deployed code is actually fresh.
export const BUILD_TIMESTAMP = "Build: Jan 25 - 15:05 PM (Multi-AI Fixed)";

let genAI: GoogleGenerativeAI;
try {
    console.log("Initializing Gemini SDK V1 with Key length:", API_KEY ? API_KEY.length : 0);
    if (!API_KEY) console.error("CRITICAL: GEMINI API KEY IS EMPTY");
    genAI = new GoogleGenerativeAI(API_KEY);
    console.log("Gemini SDK Initialized Successfully.", genAI);
} catch (initError) {
    console.error("CRITICAL ERROR INITIALIZING GEMINI SDK:", initError);
}

const SYSTEM_INSTRUCTION = `
ROL: DIRECTOR FINANCIERO (CFO) Y AUDITOR FORENSE DE INFRAESTRUCTURA (Experto UNGRD).

OBJETIVO: Realizar una auditoría financiera PROFUNDA Y RIGUROSA. No te limites a extraer datos; cuestiona la lógica financiera, detecta ineficiencias y proyecta la viabilidad a largo plazo.

MÁXIMO RIGOR FINANCIERO REQUERIDO:

1.  **FASE 1: DESGLOSE FORENSE (CAPEX vs OPEX)**:
    *   Identifica cada ítem y clasifícalo estrictamente como CAPEX (Inversiones productivas, obra, activos) u OPEX (Mantenimiento, administración, gastos recurrentes).
    *   **JUSTIFICACIÓN TÉCNICA**: Para cada clasificación, provee un "porque" financiero basado en normas contables (NIC/NIIF aplicadas a proyectos).

2.  **FASE 2: CRONOGRAMA Y VALOR GANADO (EVM)**:
    *   Extrae el WBS detallado. Para cada actividad, deduce los recursos (Maquinaria/Personal) y el costo unitario de mercado.
    *   Calcula el Valor Ganado (EV) proyectado basado en el avance físico reportado.

3.  **FASE 3: INDICADORES DE VIABILIDAD AVANZADOS**:
    *   **VAN (NPV) y TIR (IRR)**: Estima el valor actual neto y la tasa interna de retorno del proyecto asumiendo una tasa de descuento social/financiera estándar del 12% (ajustable según riesgo).
    *   **SENSIBILIDAD**: Predice cómo un retraso del 20% en el tiempo impactaría el costo final (EAC).

4.  **FASE 4: INTEGRACIÓN ESTRATÉGICA UNGRD**:
    *   Asegura que los resúmenes de Conocimiento, Reducción y Manejo tengan un lenguaje técnico de alto nivel.
    *   **ALERTAS FINANCIERAS**: Detecta sobrecostos ocultos o subejecución sospechosa.

5.  **FASE 5: INGENIERÍA DE VALOR (VALUE ENGINEERING)**:
    *   Identifica proactivamente al menos 3 oportunidades de optimización técnica o financiera.
    *   Calcula el ahorro potencial (Savings = Original - Optimized).
    *   Define el "Technical Trade-off": El balance entre ahorro y riesgo técnico/resiliencia.

SALIDA: JSON estricto que cumpla con la siguiente estructura (TypeScript Interface):

interface Output {
  projectName: string;
  contractId: string;
  projectPhase: "Formulation" | "Execution" | "Closed";
  projectType: "Mitigation" | "Emergency" | "Resettlement" | "Infrastructure";
  reportType: "New Project" | "Progress Report";
  contractor: string;
  nit: string;
  contractorProfile: { name: string; nit: string; summary: string };
  generalObjective: string;
  specificObjectives: string[];
  location: { latitude: number; longitude: number; address: string; municipality: string; department: string };
  summary: string;
  totalBudget: number;
  spentBudget: number;
  progressPercentage: number;
  startDate: string;
  endDate: string;
  stakeholders: { name: string; role: string; entityType: string; isCommunity: boolean; relevance: string }[];
  photos: { id: string; description: string; date: string; location: string; category: string }[];
  insurancePolicies: { policyNumber: string; insurer: string; policyName: string; type: string; coverageAmount: number; status: string; startDate: string; expirationDate: string; approvalDate: string }[];
  bottlenecks: { processName: string; responsibleEntity: string; status: string; daysDelayed: number; description: string; impactLevel: string; evidence: string }[];
  risks: { risk: string; probability: string; impact: string; mitigation: string }[];
  milestones: { 
    code: string; startDate: string; endDate: string; date: string; description: string; status: string; progress: number; 
    isCriticalPath: boolean; criticalPathReasoning: string; durationDays: number; unit: string; totalQuantity: number; executedQuantity: number; estimatedCost: number;
    inferredResources: { name: string; quantity: number; unit: string; type: 'Personnel' | 'Machinery' | 'Material' }[];
  }[];
  budgetBreakdown: { category: string; amount: number }[]; // USAR CATEGORÍAS REALES (ej: Preliminares, Cimentación)
  financialLineItems: { description: string; unit: string; quantity: number; unitPrice: number; totalAmount: number; category: string }[];
  resourceInventory: {
    personnel: { role: string; quantity: number; requiredExperience: string; unitPrice: number }[];
    machinery: { type: string; quantity: number; capacity: string; unitPrice: number }[];
    equipment: { type: string; quantity: number; unitPrice: number }[];
  };
  ungrdAnalysis: {
    knowledge: { hasRiskAnalysis: boolean; scenariosIdentified: string[]; observation: string };
    reduction: {
        primaryProcess: string;
        technicalConcept: string;
        corrective: { hasMitigationWorks: boolean; isBioengineering: boolean; threatType: string; workType: string; beneficiaries: string; observation: string; technicalAnalysis: { viabilityScore: number; judgment: string; strengths: string[]; weaknesses: string[]; technicalRecommendation: string } };
        prospective: { alignsWithPOT: boolean; hasClimateChangeAdaptation: boolean; hasEarlyWarningSystem: boolean; observation: string; potDetailed: { zoningCompliance: string; landUseType: string; environmentalRestrictions: string[]; urbanNormCompliance: string; alignmentAnalysis: string }; climateDetailed: { returnPeriodConsidered: string; natureBasedSolutions: boolean; materialResilience: string; carbonFootprint: string; adaptationStrategies: string[] } };
        financialProtection: { hasPublicAssetInsurance: boolean; hasRetentionMechanism: boolean; observation: string };
    };
    management: { hasContingencyPlan: boolean; protocols: string[]; observation: string };
  };
  kpis: { cpi: number; spi: number; estimatedDailyOverhead: number; projectedCompletion: string; financialHealth: string; van: number; tir: number; bcRatio: number; paybackPeriod: number; riskAdjustedVan: number; riskAdjustedTir: number; burnRate: number; costVariance: number; roi: number; rationale: string };
  valueEngineering?: { id: string; description: string; originalCost: number; optimizedCost: number; savings: number; technicalTradeoff: string; implementationComplexity: 'Low' | 'Medium' | 'High'; status: 'Planned' | 'Implemented' | 'Rejected' }[];
}
`;

export type AnalysisProvider = 'gemini' | 'groq' | 'openai' | 'xai';

export interface AnalysisInput {
    type: 'text' | 'pdf' | 'image';
    content: string; // Base64 string for PDF/Image or raw text
    provider?: AnalysisProvider; // User selected provider
}

// --- UTILITIES ---

export const cleanJsonString = (str: string): string => {
    if (!str) return "{}";
    // Remove markdown code blocks (json or plain)
    let cleaned = str.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // Find the first '{' or '['
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');

    let start = -1;
    if (firstBrace !== -1 && firstBracket !== -1) {
        start = Math.min(firstBrace, firstBracket);
    } else if (firstBrace !== -1) {
        start = firstBrace;
    } else {
        start = firstBracket;
    }

    if (start === -1) return "{}"; // No JSON found

    // Find the last '}' or ']'
    const lastBrace = cleaned.lastIndexOf('}');
    const lastBracket = cleaned.lastIndexOf(']');

    let end = Math.max(lastBrace, lastBracket);

    if (end > start) {
        cleaned = cleaned.substring(start, end + 1);
    } else {
        return "{}"; // Malformed
    }

    return cleaned;
};

const safeJsonParse = <T>(jsonString: string, context: string): T => {
    try {
        const cleaned = cleanJsonString(jsonString);
        return JSON.parse(cleaned);
    } catch (e) {
        console.error(`FAILED TO PARSE JSON [${context}]:`, jsonString);
        console.error(e);
        // Return null or empty object? Or throw?
        // Throwing allows the UI to show an error message.
        throw new Error(`Error al procesar la respuesta de IA (${context}). La respuesta no fue un JSON válido.`);
    }
};

// Helper to clean numeric strings
const cleanNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    let cleanStr = value.toString().replace(/[^0-9.,-]/g, '');

    if (cleanStr.includes('.') && cleanStr.includes(',')) {
        const dotIndex = cleanStr.lastIndexOf('.');
        const commaIndex = cleanStr.lastIndexOf(',');
        if (dotIndex < commaIndex) {
            cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
        } else {
            cleanStr = cleanStr.replace(/\,/g, '');
        }
    } else if ((cleanStr.match(/\./g) || []).length > 1) {
        cleanStr = cleanStr.replace(/\./g, '');
    } else if (cleanStr.includes(',')) {
        cleanStr = cleanStr.replace(',', '.');
    }

    const parsed = parseFloat(cleanStr);
    return isNaN(parsed) ? 0 : parsed;
};

// Helper to sanitize dates
const cleanDate = (value: any): string => {
    if (!value) return "";
    const dateStr = value.toString().trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const spanishMonths: { [key: string]: string } = {
        'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04', 'mayo': '05', 'junio': '06',
        'julio': '07', 'agosto': '08', 'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
    };

    const parts = dateStr.toLowerCase().replace(/de/g, '').replace(/,/g, '').replace(/\./g, '').split(/\s+/).filter((p: string) => p);

    if (parts.length >= 3) {
        let day = parts[0].replace(/\D/g, '').padStart(2, '0');
        let monthKey = parts.find((p: string) => spanishMonths[p]);
        let year = parts.find((p: string) => p.length === 4 && !isNaN(Number(p)));

        if (day && monthKey && year) {
            return `${year}-${spanishMonths[monthKey]}-${day}`;
        }
    }

    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date.toISOString().split('T')[0];
    return dateStr;
};

// Robust Coordinate Parser
const cleanCoordinate = (val: any): number => {
    if (typeof val === 'number') return val;
    if (!val) return 0;

    const str = val.toString().trim();
    const dmsRegex = /(\d{1,3})[°º\s]+(\d{1,2})['’\s]+(\d{1,2}(?:[\.,]\d+)?)?["”\s]*([NSEW])?/i;
    const match = str.match(dmsRegex);

    if (match) {
        let degrees = parseFloat(match[1]);
        let minutes = parseFloat(match[2]);
        let seconds = match[3] ? parseFloat(match[3].replace(',', '.')) : 0;
        let direction = match[4] ? match[4].toUpperCase() : '';

        let decimal = degrees + (minutes / 60) + (seconds / 3600);

        if (direction === 'S' || direction === 'W') {
            decimal = decimal * -1;
        }
        if (!direction && degrees > 20 && degrees < 90) { /* Likely Lat */ }
        if (!direction && decimal > 90) { decimal = decimal * -1; } // Likely West Longitude in Colombia

        return decimal;
    }

    const decimalStr = str.replace(',', '.');
    const extracted = parseFloat(decimalStr);
    return isNaN(extracted) ? 0 : extracted;
}

export const sanitizeProjectData = (data: any): ProjectData => {
    let sanitizedBudget = cleanNumber(data.totalBudget);

    const sortedMilestones = Array.isArray(data.milestones) ? data.milestones.map((m: any) => ({
        ...m,
        code: m.code ? String(m.code) : undefined,
        startDate: cleanDate(m.startDate),
        endDate: cleanDate(m.endDate),
        date: cleanDate(m.date),
        progress: cleanNumber(m.progress),
        totalQuantity: cleanNumber(m.totalQuantity),
        executedQuantity: cleanNumber(m.executedQuantity),
        estimatedCost: cleanNumber(m.estimatedCost),
        // Ensure inferredResources exists and is clean
        inferredResources: Array.isArray(m.inferredResources) ? m.inferredResources.map((r: any) => ({
            name: r.name || "Recurso",
            quantity: cleanNumber(r.quantity),
            unit: r.unit || "und",
            type: ['Personnel', 'Machinery', 'Material'].includes(r.type) ? r.type : 'Material'
        })) : []
    })).sort((a: any, b: any) => {
        // Sort by Code if available, else date
        if (a.code && b.code) {
            return a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' });
        }
        const dateA = a.startDate || a.date || "9999-99-99";
        const dateB = b.startDate || b.date || "9999-99-99";
        return dateA.localeCompare(dateB);
    }) : [];

    const uniquePolicies: InsurancePolicy[] = [];

    if (Array.isArray(data.insurancePolicies)) {
        data.insurancePolicies.forEach((p: any) => {
            if (!p) return;
            const policyNumStr = p.policyNumber ? String(p.policyNumber) : "";
            // Forensic Split: If policy number contains "Y" or "," or "&"
            if (policyNumStr && (policyNumStr.includes(' Y ') || policyNumStr.includes(',') || policyNumStr.includes('&'))) {
                const numbers = policyNumStr.split(/ Y |,|&/i).map((s: string) => s.trim());
                numbers.forEach((num: string) => {
                    uniquePolicies.push({
                        ...p,
                        policyNumber: num,
                        startDate: cleanDate(p.startDate),
                        expirationDate: cleanDate(p.expirationDate),
                        approvalDate: cleanDate(p.approvalDate),
                        coverageAmount: cleanNumber(p.coverageAmount)
                    });
                });
            } else {
                uniquePolicies.push({
                    ...p,
                    policyNumber: policyNumStr,
                    startDate: cleanDate(p.startDate),
                    expirationDate: cleanDate(p.expirationDate),
                    approvalDate: cleanDate(p.approvalDate),
                    coverageAmount: cleanNumber(p.coverageAmount)
                });
            }
        });
    }

    const sanitizedBudgetBreakdown = Array.isArray(data.budgetBreakdown)
        ? data.budgetBreakdown.map((item: any) => ({
            category: (item.category && item.category !== 'Amount' && item.category !== 'Costo') ? item.category : "Costos Directos", // Fallback for bad AI naming
            amount: cleanNumber(item.amount)
        }))
            .filter((i: any) => i.amount > 0)
            .sort((a: any, b: any) => b.amount - a.amount)
        : [];

    // --- SANITIZE FINANCIAL LINE ITEMS ---
    const sanitizedLineItems = Array.isArray(data.financialLineItems)
        ? data.financialLineItems.map((item: any) => {
            const qty = cleanNumber(item.quantity);
            const unitPrice = cleanNumber(item.unitPrice);
            let total = cleanNumber(item.totalAmount);

            // Auto-calc total if missing but parts are there
            if ((total === 0) && qty > 0 && unitPrice > 0) {
                total = qty * unitPrice;
            }

            return {
                description: item.description || "Ítem sin descripción",
                unit: item.unit || "und",
                quantity: qty,
                unitPrice: unitPrice,
                totalAmount: total,
                category: item.category || "General"
            };
        })
        : [];


    // --- VALIDATION LAYER & TRIGGERS ---
    const breakdownSum = sanitizedBudgetBreakdown.reduce((sum: number, item: any) => sum + item.amount, 0);
    const milestonesSum = sortedMilestones.reduce((sum: number, m: any) => sum + (m.estimatedCost || 0), 0);

    // Auto-correct budget if 0 but breakdown exists
    if (sanitizedBudget === 0 && breakdownSum > 0) {
        sanitizedBudget = breakdownSum;
    }

    // Generate alerts for discrepancies and KPI triggers
    const alerts = Array.isArray(data.alerts) ? [...data.alerts] : [];

    if (sanitizedBudget > 0 && milestonesSum > 0) {
        const diff = Math.abs(sanitizedBudget - milestonesSum);
        const percentDiff = (diff / sanitizedBudget) * 100;

        if (percentDiff > 10) {
            alerts.push({
                type: 'warning',
                message: `Discrepancia Financiera: La suma de costos de actividades ($${milestonesSum.toLocaleString('es-CO')}) difiere un ${percentDiff.toFixed(1)}% del presupuesto total extraído ($${sanitizedBudget.toLocaleString('es-CO')}). Verifique ítems faltantes.`
            });
        }
    }

    // Date Validation
    if (data.startDate && data.endDate) {
        const start = new Date(cleanDate(data.startDate));
        const end = new Date(cleanDate(data.endDate));
        if (start > end) {
            alerts.push({
                type: 'warning',
                message: `Inconsistencia de Fechas: La fecha de inicio (${data.startDate}) es posterior a la finalización (${data.endDate}).`
            });
        }
    }

    // Milestone Validation
    sortedMilestones.forEach(m => {
        if (m.endDate && m.startDate) {
            if (new Date(m.startDate) > new Date(m.endDate)) {
                alerts.push({
                    type: 'warning',
                    message: `Cronograma: La actividad "${m.description}" tiene fechas incoherentes (Inicio posterior a Fin).`
                });
            }
        }
        if (m.totalQuantity > 0 && m.executedQuantity > m.totalQuantity) {
            alerts.push({
                type: 'info',
                message: `Ejecución: La actividad "${m.description}" reporta más cantidad ejecutada de la programada inicialmente.`
            });
        }
    });

    // --- DERIVED FINANCIAL CALCULATIONS (Math-Based) ---
    const spentBudget = cleanNumber(data.spentBudget);

    // Calculate EV (Earned Value) manually if not consistent
    let earnedValue = 0;
    sortedMilestones.forEach(m => {
        earnedValue += (cleanNumber(m.estimatedCost) * (cleanNumber(m.progress) / 100));
    });

    const cpi = spentBudget > 0 ? (earnedValue > 0 ? earnedValue / spentBudget : cleanNumber(data.kpis?.cpi)) : 1.0;
    const spi = cleanNumber(data.kpis?.spi) || 1.0;

    // Cost Variance (CV) = EV - AC
    const cv = earnedValue - spentBudget;

    // Burn Rate: Spent / Days Passed
    let burnRate = cleanNumber(data.kpis?.burnRate);
    if (!burnRate && data.startDate) {
        const start = new Date(cleanDate(data.startDate));
        const now = new Date();
        const daysPassed = Math.max(1, (now.getTime() - start.getTime()) / (1000 * 3600 * 24));
        burnRate = spentBudget / daysPassed;
    }

    // TCPI (To Complete Performance Index) = (Budget - EV) / (Budget - AC)
    // Required efficiency to complete on budget
    const budgetRemaining = sanitizedBudget - spentBudget;
    const workRemaining = sanitizedBudget - earnedValue;
    let tcpi = 1.0; // Default
    if (budgetRemaining > 0) {
        tcpi = workRemaining / budgetRemaining;
    }

    if (cpi > 0 && cpi < 0.8) {
        alerts.push({ type: 'critical', message: `CPI Crítico (${cpi.toFixed(2)}): Se detecta ineficiencia severa de costos en el documento analizado.` });
    }
    if (spi > 0 && spi < 0.7) {
        alerts.push({ type: 'critical', message: `SPI Crítico (${spi.toFixed(2)}): Retraso significativo cronograma reportado.` });
    }

    // Mapping Spanish risks to English keys if necessary
    const safeRisks = Array.isArray(data.risks) ? data.risks.map((r: any) => {
        let p = r.probability || 'Low';
        let i = r.impact || 'Low';

        const mapVal = (v: string) => {
            v = v.toLowerCase();
            if (v.includes('alta') || v.includes('high') || v.includes('crit')) return 'High';
            if (v.includes('media') || v.includes('medium') || v.includes('mod')) return 'Medium';
            return 'Low';
        }
        return { ...r, probability: mapVal(p), impact: mapVal(i) };
    }) : [];

    // Normalize Bottleneck Status
    const safeBottlenecks = Array.isArray(data.bottlenecks) ? data.bottlenecks.map((b: any) => ({
        ...b,
        status: ['Bloqueado', 'En Trámite', 'Resuelto'].includes(b.status) ? b.status : 'En Trámite'
    })) : [];

    const defaultUngrd = {
        knowledge: { hasRiskAnalysis: false, scenariosIdentified: [], observation: "Pendiente" },
        reduction: { primaryProcess: 'Intervención Correctiva', corrective: {}, prospective: {}, financialProtection: {}, technicalConcept: "No Viable" },
        management: { hasContingencyPlan: false, protocols: [], observation: "Pendiente" }
    };

    const rawUngrd = data.ungrdAnalysis || defaultUngrd;

    let extractedInventory = data.resourceInventory || { personnel: [], machinery: [], equipment: [] };
    const hasExtractedPersonnel = extractedInventory.personnel && extractedInventory.personnel.length > 0;
    const hasExtractedMachinery = extractedInventory.machinery && extractedInventory.machinery.length > 0;

    // --- NEW: RESOURCE AGGREGATION LOGIC ---
    if ((!hasExtractedPersonnel || !hasExtractedMachinery) && sortedMilestones.length > 0) {
        const personnelMap: { [key: string]: { role: string; quantity: number; unitPrice?: number } } = {};
        const machineryMap: { [key: string]: { type: string; quantity: number; capacity?: string; unitPrice?: number } } = {};

        for (const milestone of sortedMilestones) {
            if (milestone.inferredResources) {
                for (const resource of milestone.inferredResources) {
                    if (resource.type === 'Personnel') {
                        if (personnelMap[resource.name]) {
                            personnelMap[resource.name].quantity = Math.max(personnelMap[resource.name].quantity, resource.quantity);
                        } else {
                            personnelMap[resource.name] = { role: resource.name, quantity: resource.quantity };
                        }
                    } else if (resource.type === 'Machinery') {
                        if (machineryMap[resource.name]) {
                            machineryMap[resource.name].quantity = Math.max(machineryMap[resource.name].quantity, resource.quantity);
                        } else {
                            machineryMap[resource.name] = { type: resource.name, quantity: resource.quantity };
                        }
                    }
                }
            }
        }

        const aggregatedPersonnel = Object.values(personnelMap);
        const aggregatedMachinery = Object.values(machineryMap);

        if (!hasExtractedPersonnel && aggregatedPersonnel.length > 0) {
            extractedInventory.personnel = aggregatedPersonnel;
        }
        if (!hasExtractedMachinery && aggregatedMachinery.length > 0) {
            extractedInventory.machinery = aggregatedMachinery;
        }
    }

    const sanitizedInventory = extractedInventory;

    const processResource = (res: any) => ({
        ...res,
        quantity: cleanNumber(res.quantity) || 1,
        unitPrice: cleanNumber(res.unitPrice),
        totalCost: cleanNumber(res.totalCost) || (cleanNumber(res.quantity) * cleanNumber(res.unitPrice))
    });

    if (Array.isArray(sanitizedInventory.personnel)) {
        sanitizedInventory.personnel = sanitizedInventory.personnel.map(processResource);
    }
    if (Array.isArray(sanitizedInventory.machinery)) {
        sanitizedInventory.machinery = sanitizedInventory.machinery.map(processResource);
    }
    if (Array.isArray(sanitizedInventory.equipment)) {
        sanitizedInventory.equipment = sanitizedInventory.equipment.map(processResource);
    }

    // --- CONTRACTOR PROFILE EXTRACTION ---
    let initialContractorProfile: ContractorProfile | undefined = undefined;
    if (data.contractor || data.contractorProfile?.name) {
        initialContractorProfile = {
            name: data.contractorProfile?.name || data.contractor || "Contratista",
            nit: data.contractorProfile?.nit || data.nit || "",
            summary: data.contractorProfile?.summary || "Perfil preliminar no generado.",
            suitabilityScore: 0,
            redFlags: [],
            disbursementRisk: "Pendiente",
            disbursementRationale: "Requiere auditoría forense profunda."
        };
    }

    return {
        ...INITIAL_PROJECT_DATA,
        ...data,
        totalBudget: sanitizedBudget,
        spentBudget: spentBudget,
        progressPercentage: cleanNumber(data.progressPercentage),
        startDate: cleanDate(data.startDate),
        endDate: cleanDate(data.endDate),
        contractId: data.contractId || "",
        alerts: alerts,
        evolutionHistory: data.evolutionHistory || [],

        location: {
            ...INITIAL_PROJECT_DATA.location,
            ...(data.location || {}),
            latitude: cleanCoordinate(data.location?.latitude),
            longitude: cleanCoordinate(data.location?.longitude),
        },

        milestones: sortedMilestones,
        budgetBreakdown: sanitizedBudgetBreakdown,
        valueEngineering: Array.isArray(data.valueEngineering) ? data.valueEngineering.map((v: any) => ({
            ...v,
            originalCost: cleanNumber(v.originalCost),
            optimizedCost: cleanNumber(v.optimizedCost),
            savings: cleanNumber(v.savings) || (cleanNumber(v.originalCost) - cleanNumber(v.optimizedCost))
        })) : [],
        financialLineItems: sanitizedLineItems,
        stakeholders: (Array.isArray(data.stakeholders) ? data.stakeholders : []).filter((s: any) => s && s.name),
        photos: Array.isArray(data.photos) ? data.photos : [],
        insurancePolicies: uniquePolicies,
        risks: safeRisks,
        bottlenecks: safeBottlenecks,
        resourceInventory: sanitizedInventory,
        contractorProfile: initialContractorProfile, // Attach extracted profile
        ungrdAnalysis: {
            ...defaultUngrd,
            ...rawUngrd,
            reduction: {
                ...defaultUngrd.reduction,
                ...(rawUngrd.reduction || {}),
                corrective: {
                    hasMitigationWorks: false,
                    isBioengineering: false,
                    threatType: "No especificada",
                    workType: "No especificado",
                    beneficiaries: "No especificados",
                    observation: "",
                    technicalAnalysis: {
                        viabilityScore: 0,
                        judgment: 'Viable con Riesgos',
                        strengths: [],
                        weaknesses: [],
                        technicalRecommendation: "Pendiente de análisis detallado."
                    },
                    ...(rawUngrd.reduction?.corrective || {})
                },
                prospective: {
                    ...defaultUngrd.reduction.prospective,
                    potDetailed: {
                        zoningCompliance: 'Parcial',
                        landUseType: 'Sin clasificar',
                        environmentalRestrictions: [],
                        urbanNormCompliance: "Pendiente",
                        alignmentAnalysis: "Pendiente"
                    },
                    climateDetailed: {
                        returnPeriodConsidered: "No especificado",
                        natureBasedSolutions: false,
                        materialResilience: "Convencional",
                        adaptationStrategies: []
                    },
                    ...(rawUngrd.reduction?.prospective || {})
                }
            }
        },

        kpis: {
            ...INITIAL_PROJECT_DATA.kpis,
            ...(data.kpis || {}),
            cpi: cpi,
            spi: spi,
            bcRatio: cleanNumber(data.kpis?.bcRatio) || 1.1, // Default slightly positive if missing
            costVariance: cv,
            burnRate: burnRate,
            estimatedDailyOverhead: cleanNumber(data.kpis?.estimatedDailyOverhead) || (sanitizedBudget * 0.0005)
        }
    };
};

// --- ROBUST GENERATION HELPER ---
const normalizeContents = (contents: any): any[] => {
    // If it's already an array of Content objects, use it directly
    if (Array.isArray(contents)) {
        return contents;
    }
    // If it's a string (simple prompt), wrap it
    if (typeof contents === 'string') {
        return [{ role: 'user', parts: [{ text: contents }] }];
    }
    // If it's an object with 'parts' array (e.g., { parts: [...] })
    if (contents && typeof contents === 'object' && contents.parts) {
        return [{ role: 'user', parts: contents.parts }];
    }
    // Fallback: empty
    console.warn("normalizeContents: Could not interpret contents, returning empty.", contents);
    return [{ role: 'user', parts: [{ text: "No content provided." }] }];
};

// --- FALLBACK-AWARE GENERATION (Master Controller) ---
const generateWithFallback = async (requestParams: any, timeoutMs: number = 180000) => {
    const sysInstruction = requestParams.generationConfig?.systemInstruction || requestParams.config?.systemInstruction || SYSTEM_INSTRUCTION;
    const actualGenerationConfig = { ...(requestParams.generationConfig || requestParams.config || {}) };
    delete actualGenerationConfig.systemInstruction;

    const generateContentRequest = {
        contents: normalizeContents(requestParams.contents),
        generationConfig: actualGenerationConfig
    };

    const extractUserPrompt = (): string => {
        const contents = generateContentRequest.contents;
        let allText = "";
        if (Array.isArray(contents)) {
            for (const content of contents) {
                if (content.parts) {
                    for (const part of content.parts) {
                        if (part.text) allText += part.text + "\n";
                    }
                }
            }
        }
        return allText.trim() || "Analyze project data.";
    };

    const userPrompt = extractUserPrompt();

    // Strategy 1: Attempt Primary Gemini Model
    const primaryModel = getPrimaryModel('gemini');
    try {
        console.log(`--- ATTEMPT 1: GEMINI PRIMARY (${primaryModel}) ---`);
        const model = genAI.getGenerativeModel({ model: primaryModel, systemInstruction: sysInstruction });
        const result = await model.generateContent(generateContentRequest);
        return result.response;
    } catch (error: any) {
        console.warn(`Gemini primary model (${primaryModel}) failed. Trying fallback...`, error);

        // Strategy 2: Attempt Fallback Gemini Model
        const fallbackModel = getFallbackModel('gemini');
        if (fallbackModel) {
            try {
                console.log(`--- ATTEMPT 2: GEMINI FALLBACK (${fallbackModel}) ---`);
                const model = genAI.getGenerativeModel({ model: fallbackModel, systemInstruction: sysInstruction });
                const result = await model.generateContent(generateContentRequest);
                return result.response;
            } catch (fallbackError: any) {
                console.error(`Gemini fallback (${fallbackModel}) also failed.`, fallbackError);

                // Strategy 3: Attempt OpenAI Failover
                if (isOpenAIConfigured()) {
                    try {
                        console.log("--- ATTEMPT 3: OPENAI FAILOVER ---");
                        return await generateWithOpenAI(sysInstruction, userPrompt, { jsonMode: actualGenerationConfig.responseMimeType === "application/json" });
                    } catch (oe) { console.error("OpenAI Fallback failed.", oe); }
                }

                // Strategy 4: Attempt Groq Failover
                if (isGroqConfigured()) {
                    try {
                        console.log("--- ATTEMPT 4: GROQ FAILOVER ---");
                        return await generateWithGroq(sysInstruction, userPrompt, { jsonMode: actualGenerationConfig.responseMimeType === "application/json" });
                    } catch (ge) { console.error("Groq Fallback failed.", ge); }
                }

                throw error;
            }
        }

        throw error;
    }
};

// --- FAST GENERATION HELPER ---
const generateFast = async (configParams: any) => {
    return generateWithFallback(configParams); // Use master controller for robustness
};

export const analyzeProject = async (input: AnalysisInput): Promise<ProjectData> => {
    try {
        const parts = [];

        if (input.type === 'pdf') {
            parts.push({
                inlineData: {
                    mimeType: 'application/pdf',
                    data: input.content
                }
            });
            parts.push({
                text: `MODO AUDITORÍA FORENSE UNGRD: Extrae rigurosamente el Cronograma, Presupuesto Detallado, RECURSOS y RESÚMENES TÉCNICOS por área (Conocimiento, Reducción, Manejo, Financiero).`
            });
        } else {
            parts.push({ text: `Analiza el siguiente texto técnico bajo metodología UNGRD:\n\n${input.content}` });
        }

        // Use Helper with Fallback or specific provider
        let response;

        if (input.provider === 'groq' && isGroqConfigured()) {
            console.log("🚀 Forced provider: GROQ");
            const textPrompt = parts.map(p => p.text || '').join('\n');
            response = await generateWithGroq(SYSTEM_INSTRUCTION, textPrompt, { jsonMode: true });
        } else if (input.provider === 'openai' && isOpenAIConfigured()) {
            console.log("🚀 Forced provider: OPENAI");
            const textPrompt = parts.map(p => p.text || '').join('\n');
            response = await generateWithOpenAI(SYSTEM_INSTRUCTION, textPrompt, { jsonMode: true });
        } else if (input.provider === 'xai' && isXaiConfigured()) {
            console.log("🚀 Forced provider: XAI (Grok)");
            const textPrompt = parts.map(p => p.text || '').join('\n');
            response = await generateWithXai(SYSTEM_INSTRUCTION, textPrompt, { jsonMode: true });
        } else {
            console.log("✨ Using Default Orchestrator (Priority: Gemini)");
            response = await generateWithFallback({
                contents: { parts },
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                    temperature: 0,
                    responseMimeType: "application/json",
                    // responseSchema REMOVED to avoid 'Constraint is too tall' error.
                    // The structure is now enforced via the SYSTEM_INSTRUCTION.
                }
            });
        }

        if (response.text()) {
            try {
                const parsedData = safeJsonParse<any>(response.text(), "Project Analysis");
                return sanitizeProjectData(parsedData);
            } catch (e) {
                console.error("JSON Parse Error", e);
                throw new Error("El documento es demasiado extenso y la respuesta se cortó. Por favor intenta con un PDF de menos páginas o una sección específica.");
            }
        }
        throw new Error("El modelo no pudo generar un análisis estructurado.");

    } catch (error: any) {
        if (error.name === 'AbortError') {
            throw new Error("El análisis tardó demasiado (180s). El documento puede ser muy extenso.");
        }
        console.error("Error analyzing project:", error);
        throw error;
    }
};

export const updateProjectWithNewData = async (currentData: ProjectData, input: { type: 'pdf' | 'text' | 'image', content: string }): Promise<ProjectData> => {
    try {
        // Create context summary for the Forensic Auditor
        const context = JSON.stringify({
            currentBudget: currentData.totalBudget,
            previousSpent: currentData.spentBudget,
            previousProgress: currentData.progressPercentage,
            milestones: currentData.milestones.slice(0, 30).map(m => ({ desc: m.description, status: m.status, progress: m.progress })),
            risks: currentData.risks.map(r => r.risk)
        });

        const prompt = `
        ROL: AUDITOR FORENSE SENIOR (Contraloría General / UNGRD).
        
        SITUACIÓN ACTUAL (Línea Base):
        ${context}

        NUEVA EVIDENCIA:
        Se ha recibido nueva evidencia (PDF adjunto o TEXTO/EMAIL).

        MISIÓN:
        1.  **Detectar Delta**: Compara el estado anterior con la nueva evidencia. Extrae el NUEVO 'progressPercentage' físico real y el NUEVO 'spentBudget' (ejecución financiera acumulada).
        2.  **Análisis de Eficiencia (efficiencyVerdict)**: 
            - Calcula mentalmente la relación entre el dinero gastado en este periodo vs el avance físico logrado.
            - Si el gasto aumentó significativamente pero el avance es mínimo -> 'Critico'.
            - Si el avance es acorde al gasto -> 'Optimo'.
            - Si hay dudas o avance lento -> 'Regular'.
        3.  **Generar Racional (efficiencyRationale)**: Explica en una frase técnica por qué diste ese veredicto (ej: "Se ejecutó el 10% del presupuesto pero el avance físico solo subió 1%").
        4.  **Actualizar Riesgos**: Si el documento revela nuevos problemas, agrégalos.

       GENERA UN JSON QUE CUMPLA ESTRICTAMENTE CON ESTA ESTRUCTURA (NO AGREGUES TEXTO ADICIONAL):
        {
          "updatedFields": {
            "progressPercentage": number, // opcional
            "spentBudget": number, // opcional
            "milestones": [ { "description": string, "status": string, "progress": number } ], // opcional
            "risks": [ { "risk": string, "probability": "High"|"Medium"|"Low", "impact": "High"|"Medium"|"Low", "mitigation": string } ] // opcional
          },
          "evolutionLog": {
            "date": string,
            "summary": string,
            "efficiencyVerdict": "Optimo" | "Regular" | "Critico",
            "efficiencyRationale": string,
            "changes": [ { "field": string, "oldValue": string, "newValue": string, "comment": string } ]
          }
        }
        `;

        const parts = [];
        if (input.type === 'pdf') {
            parts.push({ inlineData: { mimeType: 'application/pdf', data: input.content } });
        } else if (input.type === 'image') {
            parts.push({ inlineData: { mimeType: 'image/jpeg', data: input.content } });
            parts.push({ text: "NUEVA EVIDENCIA VISUAL (FOTO DE OBRA/REPORTE): Analiza esta imagen en busca de progreso físico, maquinaria activa o problemas visibles." });
        } else {
            parts.push({ text: `NUEVA EVIDENCIA (TEXTO/CORREO/CHAT/TRANSCRIPCION): \n"${input.content}"\n\n(Trata este texto como una fuente de verdad directa desde el campo/obra).` });
        }
        parts.push({ text: prompt });

        // Use generateWithFallback (Pro -> Flash) for better reasoning on PDFs
        // Removed strict responseSchema to avoid "Constraint is too tall" on large updates
        const response = await generateWithFallback({
            contents: { parts },
            config: {
                temperature: 0.1,
                responseMimeType: "application/json"
            }
        });

        if (response.text()) {
            const result = safeJsonParse<any>(response.text(), "Update Project");

            // MERGE LOGIC WITH CALCULATED METRICS
            const newData = { ...currentData };
            const updates = result.updatedFields || {};

            // 1. Update Core Fields
            if (updates.progressPercentage !== undefined) newData.progressPercentage = updates.progressPercentage;
            if (updates.spentBudget !== undefined) newData.spentBudget = updates.spentBudget;

            // 2. MATHEMATICAL RECALCULATION OF KPIS based on new values
            // We do this here to ensure the dashboard reflects the new reality immediately
            const totalBudget = newData.totalBudget || 1;
            const ev = totalBudget * (newData.progressPercentage / 100);
            const ac = newData.spentBudget || 1;

            // Recalculate CPI
            const newCPI = ac > 0 ? ev / ac : 1;
            newData.kpis.cpi = parseFloat(newCPI.toFixed(2));

            // Recalculate Cost Variance
            newData.kpis.costVariance = ev - ac;

            // 3. Merge Milestones
            if (updates.milestones && Array.isArray(updates.milestones)) {
                newData.milestones = newData.milestones.map(m => {
                    const update = updates.milestones.find((u: any) => u.description === m.description || (m.code && u.description.includes(m.code)));
                    if (update) {
                        return { ...m, status: update.status, progress: update.progress };
                    }
                    return m;
                });
            }

            // 4. Merge Risks
            if (updates.risks && Array.isArray(updates.risks)) {
                const newRisks = updates.risks.map((r: any) => ({ ...r, probability: r.probability || 'Medium', impact: r.impact || 'Medium', mitigation: r.mitigation || 'Pendiente' }));
                newData.risks = [...newData.risks, ...newRisks];
            }

            // 5. Add Forensic Log to History
            const newLog: EvolutionLog = {
                ...result.evolutionLog,
                date: new Date().toISOString(),
                sourceDocument: input.type === 'pdf' ? "Nuevo Documento Adjunto (Auditado)" : "Texto/Chat Insertado",
                efficiencyVerdict: result.evolutionLog.efficiencyVerdict || 'Regular',
                efficiencyRationale: result.evolutionLog.efficiencyRationale || 'Análisis pendiente.'
            };

            newData.evolutionHistory = [newLog, ...(newData.evolutionHistory || [])];

            return sanitizeProjectData(newData); // Re-sanitize to update other triggers
        }

        throw new Error("No se pudo generar la evolución del proyecto.");

    } catch (error) {
        console.error("Update Project Error", error);
        throw error;
    }
};

export const analyzeCapexOpexDeep = async (projectData: ProjectData): Promise<CapexOpexDeepAnalysis> => {
    try {
        const prompt = `
        ROL: AUDITOR FINANCIERO FORENSE (CFO de Infraestructura).
        TAREA: Realizar una clasificación exhaustiva y análisis de inversión (CAPEX) vs. gastos operativos (OPEX).

        DATOS DISPONIBLES:
        - Items Financieros: ${JSON.stringify(projectData.financialLineItems.slice(0, 30))}
        - Recursos (Maquinaria/Personal): ${JSON.stringify(projectData.resourceInventory)}
        - Hitos Clave: ${JSON.stringify(projectData.milestones.slice(0, 15).map(m => m.description))}
        
        INSTRUCCIONES:
        1. Clasifica cada costo mayor en CAPEX (Inversión en activos, obra física, maquinaria) u OPEX (Personal administrativo, gastos generales, nómina recurrente).
        2. Proporciona una justificación ("Justification") técnica para cada ítem clave.
        3. Calcula los totales aproximados.
        4. Genera un análisis profundo ("Analysis") explicando CÓMO se está gastando el dinero y POR QUÉ esa proporción es saludable o riesgosa.
        5. Emite un veredicto de eficiencia ("EfficiencyVerdict").

        SALIDA (JSON Strict - CapexOpexDeepAnalysis Interface):
        `;

        const response = await generateFast({
            contents: prompt,
            config: {
                temperature: 0.2,
                responseMimeType: "application/json"
            }
        });

        if (response.text()) {
            return safeJsonParse(response.text(), "Capex/Opex Deep Analysis");
        }
        throw new Error("No se pudo generar análisis CAPEX/OPEX.");

    } catch (error) {
        console.error("CAPEX/OPEX Deep Analysis Error", error);
        throw error;
    }
};

export const searchProjectInfo = async (projectData: ProjectData): Promise<SearchResult> => {
    try {
        const query = `Busca información actual, noticias recientes, controversias y estado real del proyecto: ${projectData.projectName} en ${projectData.location.municipality}. Contratista: ${projectData.contractor}. Resumen ejecutivo.`;

        // Use Google Search Grounding with Flash 1.5
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: query }] }],
            tools: [{ googleSearchRetrieval: {} } as any],
        });

        const res = response.response;

        const sources: { title: string; uri: string }[] = [];

        // Extract grounding chunks
        const groundingMetadata = res.candidates?.[0]?.groundingMetadata;
        const chunks = (groundingMetadata as any)?.groundingChunks || [];
        chunks.forEach((chunk: any) => {
            if (chunk.web) {
                sources.push({ title: chunk.web.title, uri: chunk.web.uri });
            }
        });

        return {
            summary: res.text() || "No se encontró información relevante en la web.",
            sources: sources
        };
    } catch (error) {
        console.error("Search Error", error);
        throw new Error("Error al consultar Google Search.");
    }
};

export const analyzePOTAlignment = async (projectData: ProjectData, potPdfBase64: string): Promise<POTAnalysis> => {
    try {
        const prompt = `
        RESPONDER EXCLUSIVAMENTE EN ESPAÑOL.
        ROL: URBANISTA Y ABOGADO DE LA UNGRD.
        TAREA: Cruzar de manera TRANSVERSAL la información del proyecto con el POT/EOT (Plan de Ordenamiento Territorial) adjunto.

        CONTEXTO DEL PROYECTO:
        Nombre: ${projectData.projectName}
        Ubicación: ${projectData.location.address}, ${projectData.location.municipality}
        Coordenadas: ${projectData.location.latitude}, ${projectData.location.longitude}
        Tipo: ${projectData.projectType} (${projectData.projectPhase})
        Objetivo General: ${projectData.generalObjective}
        Objetivos Específicos: ${projectData.specificObjectives.join('; ')}
        Riesgos Identificados: ${projectData.risks.map(r => r.risk).join('; ')}

        INSTRUCCIONES DE ANÁLISIS CRUZADO:
        1. Geolocalización vs Uso del Suelo: ¿El predio del proyecto permite el uso del suelo propuesto según el POT?
        2. Amenaza vs Zonificación: ¿El proyecto se ubica en zonas de "Amenaza Alta No Mitigable" o "Reserva Ambiental" según los mapas del POT?
        3. Normativa vs Diseño: ¿El proyecto cumple con los retiros hídricos, densidades y normas urbanísticas del POT?
        4. **CRUCIAL - MITIGACIÓN**: Para CADA restricción o zona de riesgo identificada, PROPORCIONA UNA ESTRATEGIA DE MITIGACIÓN. No solo listes el problema, propón la solución técnica o jurídica (ej: "Estudios de detalle para demostrar mitigabilidad", "Compensación ambiental", "Cambio de trazado").

        SALIDA JSON: { complianceScore: number, landUseRestrictions: [{issue: string, mitigation: string}], riskZonesIdentified: [{issue: string, mitigation: string}], recommendations: string[] }
        `;

        const parts = [
            { inlineData: { mimeType: 'application/pdf', data: potPdfBase64 } },
            { text: prompt }
        ];

        const response = await generateFast({
            contents: { parts },
            config: {
                responseMimeType: "application/json"
            }
        });

        if (response.text()) {
            return safeJsonParse(response.text(), "POT Analysis");
        }
        throw new Error("No se pudo analizar el POT.");

    } catch (error: any) {
        console.error("Error analyzing POT:", error);
        if (error.name === 'AbortError') {
            throw new Error("El análisis del POT tardó demasiado. El archivo puede ser muy grande.");
        }
        throw error;
    }
};

// NEW: Analyze Activity Deep (Optimization & Tech)
export const analyzeActivityDeep = async (activity: ProjectMilestone, projectContext: { name: string, location: string }): Promise<ActivityDeepAnalysis> => {
    try {
        const prompt = `
        RESPONDER EXCLUSIVAMENTE EN ESPAÑOL.
        ROL: INGENIERO CIVIL SENIOR / AUDITOR TÉCNICO (EXPERTO EN OPTIMIZACIÓN DE PROCESOS - VALUE ENGINEERING).
        TAREA: Realizar un análisis de "Ingeniería de Valor" RIGUROSO para una actividad específica.

        ACTIVIDAD:
        Código: ${activity.code || 'N/A'}
        Descripción: ${activity.description}
        Costo Estimado: ${activity.estimatedCost || 'No definido'}
        Recursos Inferidos: ${JSON.stringify(activity.inferredResources || [])}

        CONTEXTO PROYECTO: ${projectContext.name} en ${projectContext.location}.

        INSTRUCCIONES DE RIGOR TÉCNICO:
        1.  **optimizationStrategy** (string): Propón una estrategia basada en rendimientos de maquinaria y materiales (ej. "Sustitución de concreto in-situ por prefabricados clase 4000psi para reducir fraguado en 5 días").
        2.  **suggestedTechnologies** (array de objetos {name, benefit}): Sugiere 2 tecnologías que IMPACTEN el costo directo (ej. Aditivos acelerantes de alto desempeño, Modelado 4D para detección de interferencias).
        3.  **specificExecutionRisks** (array de objetos {risk, mitigation}): Riesgos vinculados a la logística real (ej. "Demoras en suministro de mezcla por tráfico en vía única"). Mitigación debe ser técnica.
        4.  **efficiencyGainEstimate** (string): Estima el % de ahorro basado en el costo estimado.

        SALIDA JSON ESTRICTA (TODO EN ESPAÑOL):
        {
          "optimizationStrategy": "...",
          "suggestedTechnologies": [{"name": "...", "benefit": "..."}],
          "specificExecutionRisks": [{"risk": "...", "mitigation": "..."}],
          "efficiencyGainEstimate": "10-15%"
        }
        `;

        // Switch to Pro Generation (Chain-of-Thought)
        // Optimized for Value Engineering logic
        const response = await generateWithFallback({
            contents: prompt,
            config: {
                temperature: 0.1, // Lower temperature for technical precision
                responseMimeType: "application/json",
                // Removed strict schema to allow for richer, longer content in fields without hitting context limits
            }
        });

        if (response.text()) {
            return safeJsonParse(response.text(), "Activity Deep Analysis");
        }
        throw new Error("Fallo análisis de actividad");

    } catch (error) {
        console.error("Deep Activity Analysis Error", error);
        throw error;
    }
};

export const askProjectQuestion = async (question: string, projectData: ProjectData): Promise<string> => {
    const context = JSON.stringify({
        name: projectData.projectName,
        summary: projectData.summary,
        budget: projectData.totalBudget,
        spent: projectData.spentBudget,
        progress: projectData.progressPercentage,
        risks: projectData.risks.map(r => r.risk),
        bottlenecks: projectData.bottlenecks.map(b => b.processName)
    });

    const prompt = `
  CONTEXTO PROYECTO: ${context}
  
  PREGUNTA USUARIO: "${question}"
  
  RESPUESTA (Como Auditor Experto UNGRD, breve y directa):
  `;

    const response = await generateFast({ contents: prompt });
    return response.text() || "No pude generar una respuesta.";
};

export const generateMitigationSuggestion = async (risk: RiskItem, projectData: ProjectData): Promise<string> => {
    const prompt = `
  RESPONDER EXCLUSIVAMENTE EN ESPAÑOL.
  ROL: ESPECIALISTA EN GESTIÓN DE RIESGOS (ISO 31000).
  PROYECTO: ${projectData.projectName}
  RIESGO: "${risk.risk}" (Impacto: ${risk.impact}, Probabilidad: ${risk.probability})
  
  TAREA: Generar un plan de mitigación detallado, técnico y accionable EN ESPAÑOL.
  
  Estructura de respuesta:
  1. Descripción del Riesgo
  2. Estrategia de Mitigación
  3. Acciones Específicas (lista numerada)
  4. Indicadores de Seguimiento
  5. Responsable Sugerido
  `;
    const response = await generateFast({ contents: prompt });
    return response.text() || "No se pudo generar el plan de mitigación.";
};

export const analyzeGrekoCronos = async (milestones: ProjectMilestone[], projectData: ProjectData): Promise<GrekoCronosDeepAnalysis> => {
    // Placeholder logic for now, or simple AI generation
    // Since types.ts defines GrekoCronosDeepAnalysis, I should return that structure.
    const prompt = `
    Analiza el cronograma: ${JSON.stringify(milestones.map(m => ({ desc: m.description, date: m.endDate, status: m.status })))}
    Genera un análisis de tiempos forense para el proyecto ${projectData.projectName}.
    Output JSON compatible con interface GrekoCronosDeepAnalysis.
    `;

    const response = await generateFast({
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });

    if (response.text()) return JSON.parse(cleanJsonString(response.text()));
    throw new Error("Failed");
};

export const analyzePMBOK7 = async (projectData: ProjectData): Promise<PMBOKAnalysis> => {
    const prompt = `
    ROL: AUDITOR PMP CERTIFICADO.
    TAREA: Evaluar el proyecto "${projectData.projectName}" frente a los 12 principios del PMBOK 7.
    DATOS: ${JSON.stringify({ obj: projectData.generalObjective, progress: projectData.progressPercentage, risks: projectData.risks.length })}
    
    Lista de principios: Stewardship, Team, Stakeholders, Value, Systems Thinking, Leadership, Tailoring, Quality, Complexity, Risk, Adaptability, Change.
    Genera un JSON que cumpla estrictamente con la interfaz PMBOKAnalysis.
    `;

    const response = await generateFast({
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    if (response.text()) return safeJsonParse(response.text(), "PMBOK Analysis");
    throw new Error("Failed PMBOK Analysis");
};

export const analyzePMBOKPrincipleDeep = async (projectData: ProjectData, principleName: string): Promise<PMBOKDeepAnalysis> => {
    const prompt = `
    Realiza un análisis PROFUNDO del principio PMBOK: ${principleName}.
    Proyecto: ${projectData.projectName}.
    Objetivo: ${projectData.generalObjective}.
    
    Genera un JSON que cumpla estrictamente con la interfaz PMBOKDeepAnalysis.
    `;
    const response = await generateFast({
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });
    if (response.text()) return safeJsonParse(response.text(), "PMBOK Deep Dive");
    throw new Error("Failed Deep Dive");
};

export const analyzeKnowledgeDeep = async (projectData: ProjectData): Promise<KnowledgeDeepAnalysis> => {
    const prompt = `
    Eres un Experto en Gestión del Riesgo (Subdirección de Conocimiento, UNGRD).
    Analiza el Conocimiento del Riesgo para el proyecto: ${projectData.projectName}.
    Objetivo: ${projectData.generalObjective}.
    Hallazgos previos: ${projectData.ungrdAnalysis.knowledge.observation}.
    Escenarios: ${projectData.ungrdAnalysis.knowledge.scenariosIdentified.join(', ')}.

    TAREA:
    1. Caracteriza técnicamente el riesgo (amenaza, vulnerabilidad, exposición).
    2. Identifica VACÍOS CRÍTICOS de información (estudios faltantes).
    3. Propón alternativas de MODELAMIENTO (ej. HEC-RAS, simulaciones sísmicas).
    4. Propón alternativas de MONITOREO (ej. Sensores de nivel, estaciones meteorológicas).
    
    Genera un JSON que cumpla estrictamente con la interfaz KnowledgeDeepAnalysis.
    `;
    const response = await generateWithFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });
    if (response.text()) return safeJsonParse(response.text(), "Knowledge Analysis");
    throw new Error("Failed Knowledge Analysis");
};

export const analyzeCorrectiveDeep = async (projectData: ProjectData): Promise<CorrectiveDeepAnalysis> => {
    const prompt = `
    Eres un Experto en Reducción del Riesgo (Intervención Correctiva, UNGRD).
    Realiza una auditoría forense de la solución de ingeniería propuesta para: ${projectData.projectName}.
    Objetivo: ${projectData.generalObjective}.
    Presupuesto: ${projectData.totalBudget}.
    Datos técnicos: ${JSON.stringify(projectData.ungrdAnalysis.reduction.corrective)}.
    
    TAREA:
    1. Realiza un diagnóstico de la amenaza que se busca mitigar.
    2. Realiza una CRÍTICA TÉCNICA (Value Engineering) a la solución propuesta. ¿Es la más eficiente?
    3. Evalúa la suficiencia presupuestal y viabilidad del cronograma.
    4. Propón SOLUCIONES ALTERNATIVAS (ej. bioingeniería vs concreto).
    5. Realiza un análisis costo-beneficio cualitativo.
    
    Genera un JSON que cumpla estrictamente con la interfaz CorrectiveDeepAnalysis.
    `;
    const response = await generateWithFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });
    if (response.text()) return safeJsonParse(response.text(), "Corrective Analysis");
    throw new Error("Failed Corrective Analysis");
};

export const analyzeManagementDeep = async (projectData: ProjectData): Promise<ManagementDeepAnalysis> => {
    const prompt = `
    Eres un Experto en Manejo de Desastres (UNGRD).
    Analiza la capacidad de respuesta y preparación para: ${projectData.projectName}.
    Datos actuales: ${JSON.stringify(projectData.ungrdAnalysis.management)}.
    
    TAREA:
    1. Audita el plan de contingencia reportado.
    2. Calcula el Integrated Speed Index (ISI) de 0 a 100 (velocidad de respuesta y movilización de recursos).
    3. Evalúa protocolos de evacuación y cadena de mando.
    4. Identifica fortalezas y debilidades en la logística de respuesta (PMU, albergues).
    5. Propón RECOMENDACIONES DE ACCIÓN INMEDIATA.

    Genera un JSON que cumpla estrictamente con la interfaz ManagementDeepAnalysis e incluye el score integratedSpeedIndex.
    `;
    const response = await generateWithFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });
    if (response.text()) return safeJsonParse(response.text(), "Management Analysis");
    throw new Error("Failed Management Analysis");
};

export const analyzeBottleneckDeep = async (bottleneck: Bottleneck, projectData: ProjectData): Promise<BottleneckDeepAnalysis> => {
    const prompt = `
    RESPONDER EXCLUSIVAMENTE EN ESPAÑOL.
    ROL: AUDITOR FORENSE DE PROYECTOS DE INFRAESTRUCTURA (UNGRD).
    
    Analiza este cuello de botella legal/técnico:
    Bloqueo: ${bottleneck.processName}
    Descripción: ${bottleneck.description}
    Entidad Responsable: ${bottleneck.responsibleEntity}
    Días de Retraso: ${bottleneck.daysDelayed}
    Proyecto: ${projectData.projectName}
    
    TAREA: Generar un análisis forense profundo EN ESPAÑOL.
    
    SALIDA JSON ESTRICTA:
    {
      "rootCause": "Causa raíz del bloqueo",
      "legalFramework": "Marco legal aplicable (Leyes de Colombia)",
      "financialImpactEstimate": "Estimación del impacto financiero",
      "strategicActions": ["Acción 1", "Acción 2", "Acción 3"],
      "probabilityOfResolution": 75
    }
    `;
    const response = await generateWithFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.2
        }
    });
    if (response.text()) return safeJsonParse(response.text(), "Bottleneck Analysis");
    throw new Error("No se pudo generar el análisis del cuello de botella.");
};

export const generateAdministrativeDocument = async (bottleneck: Bottleneck, docType: string, projectData: ProjectData): Promise<LegalDocument> => {
    const prompt = `Redacta un documento tipo "${docType}" para resolver el bloqueo: "${bottleneck.processName}". Contexto: ${projectData.projectName}. Output JSON: {title, content, recipient}.`;
    const response = await generateFast({
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    if (response.text()) return safeJsonParse(response.text(), "Admin Document");
    throw new Error("Failed Document Generation");
};

export const analyzeResourceSufficiency = async (projectData: ProjectData): Promise<ResourceAnalysis> => {
    const prompt = `Analiza si los recursos (Personal, Maquinaria) son suficientes para el alcance: ${projectData.generalObjective}. Inventario actual: ${JSON.stringify(projectData.resourceInventory)}. Output JSON matching ResourceAnalysis interface.`;
    const response = await generateWithFallback({
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    if (response.text()) return safeJsonParse(response.text(), "Resource Analysis");
    throw new Error("Failed Resource Analysis");
};

export const analyzeFinancialProtectionDeep = async (projectData: ProjectData): Promise<FinancialProtectionDeepAnalysis> => {
    const prompt = `
    Eres un Experto en Riesgo Financiero y Seguros (UNGRD).
    Analiza la protección financiera del proyecto: ${projectData.projectName}.
    Pólizas actuales: ${JSON.stringify(projectData.insurancePolicies)}.
    Contexto: ${projectData.ungrdAnalysis.reduction.financialProtection?.observation}.

    TAREA:
    1. Audita la EFICIENCIA de la cobertura actual frente a los riesgos del proyecto.
    2. Identifica BRECHAS DE COBERTURA (Gaps).
    3. Identifica redundancias o seguros innecesarios.
    4. Recomienda INSTRUMENTOS FINANCIEROS (Pólizas de cumplimiento, Seguros Paramétricos, Bonos Catastróficos si aplica).
    5. Realiza una EVALUACIÓN ESTRATÉGICA.

    Genera un JSON que cumpla estrictamente con la interfaz FinancialProtectionDeepAnalysis.
    `;
    const response = await generateWithFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });
    if (response.text()) return safeJsonParse(response.text(), "Financial Protection Analysis");
    throw new Error("Failed Financial Protection Analysis");
};

export const analyzeFinancialDeep = async (projectData: ProjectData): Promise<FinancialDeepAnalysis> => {
    const prompt = `
    Realiza un análisis financiero profundo (CFO Virtual) para ${projectData.projectName}.
    Presupuesto: ${projectData.totalBudget}, Gastado: ${projectData.spentBudget}.
    Items Financieros: ${JSON.stringify(projectData.financialLineItems.slice(0, 30))}.
    Hitos (Costos): ${JSON.stringify(projectData.milestones.map(m => ({ desc: m.description, cost: m.estimatedCost })))}.
    
    TAREA:
    1. Evalúa la salud financiera (healthScore) de 0 a 100.
    2. Proyecta el EAC (Estimate at Completion) y la vac (Variance at Completion).
    3. Clasifica la EAC como Superávit, Déficit o Equilibrio.
    4. Realiza un ANÁLISIS DE SENSIBILIDAD: ¿Qué pasa si el cronograma se atrasa 3 meses? ¿Cómo afecta el TIR?
    5. Propón estrategias de optimización de costos.
    6. Identifica discrepancias entre el presupuesto por actividades y el total reportado.

    Genera un JSON que cumpla estrictamente con la interfaz FinancialDeepAnalysis. 
    Asegura incluir el análisis de sensibilidad TIR/VPN y el diagnóstico de rentabilidad social.
    `;
    const response = await generateWithFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    }, 60000);
    if (response.text()) return safeJsonParse(response.text(), "Financial Deep Analysis");
    throw new Error("Failed Financial Deep Analysis");
};

export const analyzeContractorRisk = async (projectData: ProjectData): Promise<ContractorProfile> => {
    // Build context from project data for forensic analysis
    const projectContext = {
        name: projectData.projectName,
        budget: projectData.totalBudget,
        spent: projectData.spentBudget,
        progress: projectData.progressPercentage,
        phase: projectData.projectPhase,
        contractor: projectData.contractor,
        nit: projectData.nit
    };

    const prompt = `
    RESPONDER EXCLUSIVAMENTE EN ESPAÑOL.
    ROL: AUDITOR FORENSE SENIOR (Contraloría General / UNGRD - Análisis de Contratistas).
    
    TAREA: Realizar una auditoría forense exhaustiva del contratista "${projectData.contractor}" (NIT: ${projectData.nit}) para evaluar su idoneidad, salud financiera y riesgos de desembolso.
    PROYECTO: ${projectData.projectName}
    PRESUPUESTO: ${projectData.totalBudget}
    
    Genera un JSON que cumpla estrictamente con la interfaz ContractorProfile.
    `;

    const response = await generateWithFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    if (response.text()) return safeJsonParse(response.text(), "Contractor Analysis");
    throw new Error("Failed Contractor Analysis");
};




export const analyzeCriticalPath = async (milestones: ProjectMilestone[], context: { name: string, objective: string }): Promise<{ updatedMilestones: ProjectMilestone[], analysisSummary: string }> => {
    const prompt = `
    RESPONDER EXCLUSIVAMENTE EN ESPAÑOL.
    ROL: ESPECIALISTA EN PROGRAMACIÓN DE OBRAS (CPM - Método de Ruta Crítica).
    
    Calcula la RUTA CRÍTICA para estas actividades: ${JSON.stringify(milestones.map(m => ({ code: m.code, desc: m.description, start: m.startDate, end: m.endDate })))}.
    Contexto del Proyecto: ${context.name}.
    
    TAREA: Identificar las actividades que conforman la ruta crítica y generar un resumen ejecutivo EN ESPAÑOL.
    
    SALIDA JSON ESTRICTA:
    {
      "updatedMilestones": [
        {"code": "ACT-1", "desc": "Descripción", "isCriticalPath": true, "criticalPathReasoning": "Razón en español"}
      ],
      "analysisSummary": "Resumen ejecutivo del estado del cronograma EN ESPAÑOL."
    }
    `;
    const response = await generateFast({
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    if (response.text()) {
        const res = safeJsonParse<any>(response.text(), "Critical Path");
        const merged = milestones.map(m => {
            const update = res.updatedMilestones?.find((u: any) => u.desc === m.description || u.code === m.code);
            return update ? { ...m, isCriticalPath: update.isCriticalPath, criticalPathReasoning: update.criticalPathReasoning } : m;
        });
        return { updatedMilestones: merged, analysisSummary: res.analysisSummary || "Análisis completado." };
    }
    throw new Error("No se pudo calcular la ruta crítica.");
};



export const analyzeValueEngineering = async (projectData: ProjectData): Promise<ValueEngineeringAction[]> => {
    const prompt = `
ROL: EXPERTO EN INGENIERÍA DE VALOR Y REDUCCIÓN DEL RIESGO(UNGRD).
    
    Analiza el proyecto: ${projectData.projectName}
Objetivo: ${projectData.generalObjective}
Presupuesto: ${projectData.totalBudget}
Actividades: ${JSON.stringify(projectData.milestones.map(m => ({ desc: m.description, cost: m.estimatedCost })))}

TAREA:
    Propón 5 acciones de Ingeniería de Valor para optimizar el proyecto bajo el marco de la Subdirección para la Reducción del Riesgo de la UNGRD.
    Céntrate en:
1. Intervención Correctiva: Mejora técnica de obras con menor costo y mayor resiliencia(bioingeniería, soluciones basadas en la naturaleza, optimización de materiales).
    2. Intervención Prospectiva: Prevención basada en datos, alertas tempranas y articulación con Ordenamiento Territorial(POT).
    3. Protección Financiera: Mecanismos de transferencia de riesgo(Seguros paramétricos, bonos de catástrofe) para optimizar el capital público.
    
    Output JSON compatible con interface ValueEngineeringAction[]:
[
    {
        "id": "VE-001",
        "description": "...",
        "originalCost": number,
        "optimizedCost": number,
        "savings": number,
        "technicalTradeoff": "Explicación del balance entre ahorro y desempeño técnico",
        "implementationComplexity": "Low" | "Medium" | "High",
        "status": "Planned"
    }
]
    `;
    const response = await generateWithFallback({
        contents: prompt,
        config: {
            temperature: 0.2,
            responseMimeType: "application/json",
            // Removed strict schema for creative engineering solutions
        }
    }, 120000); // 120s timeout for deep thinking
    if (response.text()) return safeJsonParse(response.text(), "Value Engineering");
    throw new Error("Failed Value Engineering Analysis");
};

// --- SUPABASE PERSISTENCE FUNCTIONS ---
import { supabase } from './supabaseClient';

export interface SavedProject {
    id: string;
    project_name: string;
    contract_id: string | null;
    full_data: ProjectData;
    created_at: string;
}

export const saveProjectToSupabase = async (data: ProjectData): Promise<{ success: boolean; id?: string; error?: string }> => {
    if (!supabase) {
        return { success: false, error: 'Supabase no está configurado localmente.' };
    }
    try {
        const { data: result, error } = await supabase
            .from('projects')
            .insert({
                project_name: data.projectName || 'Proyecto Sin Nombre',
                contract_id: data.contractId || null,
                full_data: data
            })
            .select('id')
            .single();

        if (error) {
            console.error('Supabase save error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, id: result?.id };
    } catch (err: any) {
        console.error('Error saving to Supabase:', err);
        return { success: false, error: err.message || 'Error desconocido' };
    }
};

export const getRecentProjects = async (limit: number = 10): Promise<SavedProject[]> => {
    if (!supabase) {
        return [];
    }
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('id, project_name, contract_id, full_data, created_at')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Supabase fetch error:', error);
            return [];
        }

        return (data || []) as SavedProject[];
    } catch (err) {
        console.error('Error fetching projects:', err);
        return [];
    }
};

export const analyzeClimateContext = async (location: { latitude: number, longitude: number, municipality: string }): Promise<{ riskLevel: string, summary: string, forecast: string }> => {
    // Simulated Real-Time Weather Data Injection or AI Inference based on location/season
    const prompt = `
    ACTÚA COMO: METEORÓLOGO DE INFRAESTRUCTURA Y GESTIÓN DE RIESGOS.
    UBICACIÓN: ${location.municipality} (Lat: ${location.latitude}, Long: ${location.longitude}).
    FECHA ACTUAL: ${new Date().toLocaleDateString()}.

    TAREA:
    1. Basado en la ubicación y la fecha, estima el clima probable actual (Estación lluviosa/seca).
    2. Identifica riesgos inmediatos para una obra civil (Deslizamientos, inundación, ola de calor).
    3. Genera un "Pronóstico Operativo" para los próximos 7 días.

    OUTPUT JSON: { riskLevel: "Alto"|"Medio"|"Bajo", summary: string, forecast: string }
    `;

    const response = await generateFast({
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });

    if (response.text()) return JSON.parse(cleanJsonString(response.text()));
    return { riskLevel: "Bajo", summary: "Clima favorable estimado.", forecast: "Sin lluvias previstas." };
};
