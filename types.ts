
export interface ProjectAlert {
    type: 'critical' | 'warning' | 'info';
    message: string;
}

export interface RiskItem {
    risk: string;
    probability: 'Low' | 'Medium' | 'High';
    impact: 'Low' | 'Medium' | 'High';
    mitigation: string;
    aiAnalysis?: string; // New field for deep AI analysis
}

export interface ProjectPhoto {
    id: string;
    description: string;
    date?: string;
    location?: string;
    category?: string;
}

export interface InsurancePolicy {
    policyNumber: string; // Forensically extracted ID or Loan Number
    insurer: string;      // e.g., "Seguros del Estado", "Banco Mundial", "BID"
    policyName: string;   // e.g., "Cumplimiento", "Préstamo Contingente"
    type: 'Parametric' | 'Indemnity' | 'Surety' | 'Liability' | 'Cumplimiento' | 'Anticipo' | 'Estabilidad' | 'Salarios' | 'Multilateral Loan' | 'Bond' | 'Credit';
    coverageAmount: number;
    triggerCondition?: string;
    status: 'Active' | 'Expired' | 'Pending';
    startDate: string;
    expirationDate: string;
    approvalDate?: string;
}

// NEW: Per-activity resource inference
export interface ActivityResource {
    name: string; // e.g. "Oficial de Obra", "Retroexcavadora"
    quantity: number;
    unit: string;
    type: 'Personnel' | 'Machinery' | 'Material';
}

// NEW: Deep Activity Analysis Result (UPDATED WITH MITIGATION)
export interface ActivityDeepAnalysis {
    optimizationStrategy: string;
    suggestedTechnologies: { name: string; benefit: string }[];
    specificExecutionRisks: { risk: string; mitigation: string }[]; // Updated to object
    efficiencyGainEstimate: string; // e.g., "15% reduction in time"
}

export interface ProjectMilestone {
    code?: string; // Item ID (e.g., "1.01", "3.2")
    startDate?: string;
    endDate?: string;
    date?: string;
    description: string;
    status: 'completed' | 'in-progress' | 'pending' | 'delayed';
    progress?: number;
    isCriticalPath?: boolean;
    criticalPathReasoning?: string; // AI generated reason why this is critical
    dependencies?: string[];
    durationDays?: number;

    // New Quantitative Fields for Exact Tracking
    unit?: string;           // e.g., "m3", "und", "ml"
    totalQuantity?: number;  // e.g., 75
    executedQuantity?: number; // e.g., 52.5
    estimatedCost?: number; // Financial impact per activity

    // Tracking & Configurable fields (Time Transversal)
    lastUpdated?: string; // ISO Date of the last user update
    deviation?: number; // Calculated deviation %

    // User Inputs / Delays
    delayDays?: number; // User inputs how many days delayed
    delayReason?: string; // Why is it delayed? (Contractor decision, Rain, etc)
    delayCost?: number; // Calculated financial impact of this delay

    // NEW: Deep Dive Data
    inferredResources?: ActivityResource[];
    deepAnalysis?: ActivityDeepAnalysis;
}

export interface BudgetDistribution {
    category: string;
    amount: number;
}

export interface FinancialLineItem {
    description: string;
    unit?: string;
    quantity?: number;
    unitPrice?: number;
    totalAmount: number;
    category?: string; // e.g., "Preliminares", "Cimentación"
}

// NEW: Deep Forensic Analysis for CAPEX/OPEX
export interface CapexOpexBreakdownItem {
    item: string;
    cost: number;
    justification: string; // Why is it CAPEX or OPEX?
}

export interface CapexOpexDeepAnalysis {
    capex: {
        total: number;
        analysis: string; // Deep explanation of the investment
        breakdown: CapexOpexBreakdownItem[];
    };
    opex: {
        total: number;
        analysis: string; // Deep explanation of operational costs
        breakdown: CapexOpexBreakdownItem[];
    };
    efficiencyVerdict: 'Equilibrado' | 'Alto OPEX (Alerta)' | 'Bajo CAPEX (Riesgo Calidad)';
    efficiencyRationale: string;
}

// NEW: Deep Financial Analysis (Predictive & Concatenated)
export interface FinancialDeepAnalysis {
    healthScore: number; // 0-100
    diagnosis: string;
    forecast: {
        eac: number; // Estimate at Completion
        vac: number; // Variance at Completion (Budget - EAC)
        projectedStatus: 'Superávit' | 'Déficit' | 'Equilibrio';
    };
    concatenationAnalysis: {
        budgetVsExecutionGap: string; // Explanation of difference between FinancialLineItems sum and Milestones cost sum
        flaggedDiscrepancies: {
            activityName: string;
            budgetedAmount: number;
            executionCost: number;
            variance: string;
        }[];
    };
    optimizationStrategies: {
        title: string;
        impact: string; // e.g. "Saves $50M"
        action: string;
    }[];
    riskItems: {
        item: string;
        riskLevel: 'Alto' | 'Medio' | 'Bajo';
        reason: string;
    }[];
    sensitivityAnalysis?: {
        scenario: string;
        impactOnEAC: number;
        impactOnTir: number;
        mitigationStrategy: string;
    }[];
    capexOpexAnalysis?: CapexOpexDeepAnalysis; // Attached to financial analysis
}

export interface ComplianceItem {
    requirement: string;
    status: 'Compliant' | 'Non-Compliant' | 'Pending';
    observation: string;
}

// NEW INTERFACES FOR BOTTLENECK DEEP DIVE
export interface BottleneckDeepAnalysis {
    rootCause: string; // Detailed reason
    legalFramework: string; // e.g. "Ley 80 de 1993, Art. 4"
    financialImpactEstimate: string; // e.g. "$5.000.000 / día"
    strategicActions: string[]; // Steps to resolve
    probabilityOfResolution: number; // 0-100
}

export interface LegalDocument {
    title: string;
    content: string; // The generated text body
    recipient: string;
}

export interface Bottleneck {
    processName: string;
    responsibleEntity: string;
    status: 'Bloqueado' | 'En Trámite' | 'Resuelto';
    daysDelayed: number;
    description: string;
    impactLevel: 'Crítico' | 'Moderado' | 'Bajo';
    evidence?: string;
    // New optional field for holding analysis state
    deepAnalysis?: BottleneckDeepAnalysis;
    // INTEGRATED SYSTEMIC TRACKING (Chinese Mega-Project Standards)
    impactedResources?: string[]; // IDs or names of resources blocked
    dependentMilestones?: string[]; // Codes of milestones stalled by this bottleneck
    cascadingRiskScore?: number; // 0-100 impact of this bottleneck on the entire system
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
    address: string;
    municipality: string;
    department: string;
}

export interface LogicalFramework {
    goal: string;
    purpose: string;
    outputs: string[];
    activities: string[];
}

export interface Stakeholder {
    name: string;
    role: string;
    entityType: 'Profesional' | 'Entidad Pública' | 'Entidad Privada' | 'Comunidad' | 'Financiera' | 'Aseguradora';
    isCommunity: boolean;
    relevance: 'Alta' | 'Media' | 'Baja';
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    text: string;
    timestamp: Date;
}

export interface CashFlowEntry {
    period: string;
    investment: number;
    returns: number;
    net: number;
}

// GREKO CRONOS ANALYSIS (UPDATED)
export interface GrekoCronosDeepAnalysis {
    analysisDate: string;
    projectedCompletionDate: string;
    daysVariance: number; // Negative is early, positive is delay
    timelineDiagnosis: string; // "Retraso Crítico en Ruta Crítica..."
    rootCauses: string[];
    acceleratorStrategies: {
        strategyName: string; // "Fast-Tracking"
        description: string;
        impactDays: number; // "Reduces 15 days"
    }[];
    impactOnBudget: string; // "Possible cost overrun of X due to extended overhead"
}

export interface ExpertTechnicalAnalysis {
    viabilityScore: number; // 0 to 100
    judgment: 'Altamente Viable' | 'Viable con Riesgos' | 'Crítico/No Viable';
    strengths: string[];
    weaknesses: string[];
    technicalRecommendation: string; // The deep paragraph
}

export interface ClimateAdaptationAnalysis {
    returnPeriodConsidered: string; // e.g., "Tr = 100 años"
    natureBasedSolutions: boolean;
    materialResilience: string; // e.g., "Concreto reforzado para ambiente salino"
    carbonFootprint?: string;
    adaptationStrategies: string[];
}

export interface POTDetailedAnalysis {
    zoningCompliance: 'Cumple' | 'No Cumple' | 'Parcial';
    landUseType: string; // e.g., "Suelo Rural - Protección"
    environmentalRestrictions: string[];
    urbanNormCompliance: string;
    alignmentAnalysis: string;
}

export interface AlternativeSolution {
    solutionName: string; // e.g., "Muro de Contención Anclado"
    description: string;
    pros: string[];
    cons: string[];
    estimatedCostImpact: string; // e.g., "+15% vs. original", "-5% vs. original"
    resilienceScore: number; // 0-100
}

export interface CorrectiveDeepAnalysis {
    threatDiagnosis: string;
    engineeringSolutionAudit: string;
    transversalChecks: {
        budgetSufficiency: string;
        timelineFeasibility: string;
        regulatoryCompliance: string;
    };
    vulnerabilityAssessment: string;
    technicalRigorScore: number;
    riskOfFailure: 'Alto' | 'Medio' | 'Bajo';
    holisticRecommendations: string[];
    // NEW Value Engineering fields
    alternativeSolutions: AlternativeSolution[];
    resourceOptimizationAudit: string;
    costBenefitAnalysis: string;
}

// --- NEW: CHINESE VALUE ENGINEERING & CONVERGENCE ---
export interface ValueEngineeringAction {
    id: string;
    description: string;
    originalCost: number;
    optimizedCost: number;
    savings: number;
    technicalTradeoff: string;
    implementationComplexity: 'Low' | 'Medium' | 'High';
    status: 'Planned' | 'Implemented' | 'Rejected';
}

export interface ConvergenceMetrics {
    gapClosureRate: number; // How fast is the gap between plan and actual closing?
    timeToStabilization: number; // Projected days until SPI/CPI reach 1.0
    mobilizationEfficiency: number; // Actual vs Planned resource deployment speed
    idleResourceCost: number; // Financial cost of non-productive resources
}

// --- UNGRD KNOWLEDGE DEEP DIVE (EXPANDED) ---
export interface Alternative {
    name: string;
    type: string; // "Hidráulico", "Geotécnico", "Meteorológico"
    complexity: 'Alta' | 'Media' | 'Baja';
    estimatedCost: string; // e.g., "$50M - $80M COP"
    pros: string[];
    cons: string[];
    recommendationRationale: string;
}

export interface DataGap {
    gap: string; // "Falta estudio geotécnico detallado"
    criticality: 'Alta' | 'Media' | 'Baja';
    impact: string; // "Impide el diseño seguro de la cimentación..."
    actionPlan: string; // "Contratar firma especialista para sondeos SPT..."
}

export interface KnowledgeDeepAnalysis {
    overallKnowledgeScore: number; // 0-100
    riskCharacterization: string; // Detailed scientific/technical description
    modelingAlternatives: Alternative[]; // Comparative analysis of models
    monitoringAlternatives: Alternative[]; // Comparative analysis of monitoring systems
    criticalDataGaps: DataGap[]; // Actionable plan for missing data
}

// --- UNGRD MANAGEMENT DEEP DIVE (NEW) ---
export interface ManagementDeepAnalysis {
    preparednessScore: number; // 0-100
    integratedSpeedIndex: number; // Action 17: ISI Index
    contingencyPlanAudit: string; // Detailed analysis of the contingency plan
    evacuationProtocols: {
        strengths: string[];
        weaknesses: string[];
    };
    commandChain: {
        clarity: 'Clara' | 'Ambiguo' | 'Inexistente';
        recommendations: string[];
    };
    responseLogistics: {
        strengths: string[]; // PMU, albergues, etc.
        weaknesses: string[];
    };
    communicationSystemsAudit: string; // Analysis of emergency comms
    actionableRecommendations: string[]; // Top 3-5 immediate actions
}


// UNGRD Subdirección de Reducción Specific Analysis
export interface UNGRDReductionAnalysis {
    primaryProcess: 'Intervención Correctiva' | 'Intervención Prospectiva' | 'Protección Financiera';

    corrective?: {
        hasMitigationWorks: boolean; // Obras de mitigación física
        isBioengineering: boolean; // Obras de bioingeniería
        threatType: string; // e.g. "Inundación", "Movimiento en Masa"
        workType: string; // e.g. "Muro de Contención", "Dragado"
        beneficiaries: string; // e.g. "250 Familias Barrio X"
        observation: string; // Brief extracted notes
        // New Deep Analysis Fields
        technicalAnalysis?: ExpertTechnicalAnalysis;
        deepForensicAnalysis?: CorrectiveDeepAnalysis;
    };

    prospective?: {
        alignsWithPOT: boolean;
        hasClimateChangeAdaptation: boolean;
        hasEarlyWarningSystem: boolean;
        observation: string; // Brief extracted notes
        // New Deep Analysis Fields
        potDetailed?: POTDetailedAnalysis;
        climateDetailed?: ClimateAdaptationAnalysis;
        potAnalysis?: POTAnalysis; // Existing uploaded PDF analysis
    };

    financialProtection?: {
        hasPublicAssetInsurance: boolean;
        hasRetentionMechanism: boolean;
        observation: string;
        technicalAnalysis?: ExpertTechnicalAnalysis;
        deepAnalysis?: FinancialProtectionDeepAnalysis;
    };

    technicalConcept: 'Viable' | 'Viable con Observaciones' | 'No Viable';
}

export interface FinancialProtectionDeepAnalysis {
    efficiencyScore: number; // 1-100
    coverageGaps: string[]; // e.g., "No cubre lucro cesante"
    redundancies: string[];
    recommendedInstruments: string[]; // e.g., "Bono Catastrófico (CAT Bond)"
    strategicAssessment: string; // AI opinion
}

export interface POTMitigationItem {
    issue: string; // Name of the restriction or risk zone
    mitigation: string; // Technical/Legal mitigation strategy
}

export interface POTAnalysis {
    complianceScore: number; // 0 to 100
    landUseRestrictions: POTMitigationItem[]; // Now structured
    riskZonesIdentified: POTMitigationItem[]; // Now structured
    recommendations: string[];
}

export interface UNGRDAnalysis {
    knowledge: {
        hasRiskAnalysis: boolean;
        scenariosIdentified: string[];
        observation: string;
        deepAnalysis?: KnowledgeDeepAnalysis; // NEW
    };
    reduction: UNGRDReductionAnalysis;
    management: {
        hasContingencyPlan: boolean;
        protocols: string[];
        observation: string;
        deepAnalysis?: ManagementDeepAnalysis; // NEW
    };
}

// --- PMBOK 7 INTERFACES ---

export interface PMBOKDeepAnalysis {
    diagnosis: string;
    strengths: string[];
    weaknesses: string[];
    actionableSteps: string[]; // Programmable steps
    kpiImpact: string;
    // New simulation field
    consequenceSimulation?: string;
}

export interface PMBOKPrinciple {
    name: string; // e.g., "Stewardship"
    englishName?: string;
    score?: number;
    reasoning?: string;
    status?: 'Optimized' | 'Managed' | 'Attention Required';
    deepAnalysis?: PMBOKDeepAnalysis; // NEW: Cached result
}

// --- NEW TYPES TO FIX BUILD ERRORS ---

export interface Personnel {
    role: string;
    quantity: number;
    requiredExperience?: string;
    unitPrice?: number;
    totalCost?: number;
}

export interface Machinery {
    type: string;
    quantity: number;
    capacity?: string;
    unitPrice?: number;
    totalCost?: number;
}

export interface Equipment {
    type: string;
    quantity: number;
    unitPrice?: number;
    totalCost?: number;
}

export interface ResourceAnalysis {
    sufficiencyAssessment: string;
    personnelRecommendations: string[];
    machineryRecommendations: string[];
    technologySuggestions: {
        name: string;
        application: string;
        benefit: string;
    }[];
    efficiencyScore: number;
}

export interface ResourceInventory {
    personnel: Personnel[];
    machinery: Machinery[];
    equipment: Equipment[];
    deepAnalysis?: ResourceAnalysis;
}

export interface ContractorSanction {
    entity: string;
    type: string;
    date: string;
    description: string;
    status: string;
}

export interface ContractorProfile {
    name: string;
    nit: string;
    legalStructure?: string;
    foundationDate?: string;
    address?: string;
    email?: string;
    legalRep?: string;
    kCapacity?: string;
    specialty?: string;
    suitabilityScore: number;
    financialHealth?: string;
    experienceValidation?: string;
    redFlags: string[];
    sanctions?: ContractorSanction[];
    disbursementRisk: string;
    disbursementRationale: string;
    summary?: string; // NEW field for initial executive summary
}

export interface MarketPriceAnalysis {
    itemDescription: string;
    reportedUnitValue: number;
    estimatedMarketValue: number;
    variancePercent: number;
    flag: string;
}

export interface ResourceConsistency {
    resourceType: string;
    reportedQuantity: number;
    theoreticalRequired: number;
    consistency: string;
    observation: string;
}

export interface ProgressAudit {
    auditDate: string;
    periodAnalyzed: string;
    physicalProgressReported: number;
    financialProgressReported: number;
    marketPriceAnalysis: MarketPriceAnalysis[];
    resourceConsistency: ResourceConsistency[];
    detectedInconsistencies: string[];
    approvalVerdict: string;
    verdictReasoning: string;
}

export interface PMBOKAnalysis {
    principles: PMBOKPrinciple[];
    overallObservation: string;
    auditDate: string;
}

export interface GrekoAction {
    id: string;
    title: string;
    description: string;
}

export interface SearchResult {
    summary: string;
    sources: { title: string; uri: string }[];
}

export interface KPI {
    cpi: number;
    spi: number;
    estimatedDailyOverhead: number;
    projectedCompletion?: string;
    financialHealth?: string;
    van?: number;
    tir?: number;
    bcRatio?: number;
    paybackPeriod?: number;
    riskAdjustedVan?: number;
    riskAdjustedTir?: number;
    burnRate?: number;
    costVariance?: number;
    roi?: number;
    rationale?: string;
    // NEW: INTERNATIONAL & CHINESE STANDARDS
    isi: number; // Integrated Speed Index (Physical % / Time % * Resource Utilization)
    convergence?: ConvergenceMetrics;
}

export interface EvolutionLog {
    date: string;
    sourceDocument: string; // e.g., "Reporte Avance 4.pdf"
    summary: string;
    changes: {
        field: string;
        oldValue?: string | number;
        newValue?: string | number;
        comment: string;
    }[];
    // NEW: Forensic Fields
    efficiencyVerdict?: 'Optimo' | 'Regular' | 'Critico';
    efficiencyRationale?: string;
}

// --- MACROECONOMIC INTELLIGENCE ---
export interface MacroeconomicData {
    inflationRate: number; // e.g. 5.5 for 5.5%
    forwardRate: number;   // e.g. 3950 for TRM Forward
    investmentReturn: number; // e.g. 10.2 for 10.2% (Financial returns)
    isInflationConfigurable: boolean;
    isForwardConfigurable: boolean;
    isInvestmentConfigurable: boolean;
}

export interface ProjectData {
    projectName: string;
    contractId: string;
    projectPhase: "Formulation" | "Execution" | "Closed";
    projectType: "Mitigation" | "Emergency" | "Resettlement" | "Infrastructure";
    reportType?: "New Project" | "Progress Report";
    contractor: string;
    nit: string;
    generalObjective: string;
    specificObjectives: string[];
    location: GeoLocation;
    summary: string;
    totalBudget: number;
    spentBudget: number;
    progressPercentage: number;
    startDate: string;
    endDate: string;
    stakeholders: Stakeholder[];
    photos: ProjectPhoto[];
    insurancePolicies: InsurancePolicy[];
    bottlenecks: Bottleneck[];
    risks: RiskItem[];
    milestones: ProjectMilestone[];
    budgetBreakdown: BudgetDistribution[];
    financialLineItems: FinancialLineItem[];
    resourceInventory: ResourceInventory;
    ungrdAnalysis: UNGRDAnalysis;
    kpis: KPI;
    valueEngineering?: ValueEngineeringAction[]; // PROACTIVE OPTIMIZATION
    alerts?: ProjectAlert[];
    contractorProfile?: ContractorProfile;
    progressAudits?: ProgressAudit[];
    pmbokAnalysis?: PMBOKAnalysis;
    financialDeepAnalysis?: FinancialDeepAnalysis; // NEW: CFO Audit
    capexOpexDeepAnalysis?: CapexOpexDeepAnalysis; // NEW: Capex/Opex
    evolutionHistory?: EvolutionLog[]; // NEW: History of AI updates
    macroeconomicData: MacroeconomicData; // NEW: Macro Intelligence
}

export const INITIAL_PROJECT_DATA: ProjectData = {
    projectName: "",
    contractId: "",
    projectPhase: "Formulation",
    projectType: "Infrastructure",
    contractor: "",
    nit: "",
    generalObjective: "",
    specificObjectives: [],
    location: { latitude: 0, longitude: 0, address: "", municipality: "", department: "" },
    summary: "",
    totalBudget: 0,
    spentBudget: 0,
    progressPercentage: 0,
    startDate: "",
    endDate: "",
    stakeholders: [],
    photos: [],
    insurancePolicies: [],
    bottlenecks: [],
    risks: [],
    milestones: [],
    budgetBreakdown: [],
    financialLineItems: [],
    resourceInventory: { personnel: [], machinery: [], equipment: [] },
    ungrdAnalysis: {
        knowledge: { hasRiskAnalysis: false, scenariosIdentified: [], observation: "" },
        reduction: {
            primaryProcess: 'Intervención Correctiva',
            technicalConcept: 'No Viable',
            corrective: {},
            prospective: {},
            financialProtection: {}
        } as UNGRDReductionAnalysis,
        management: { hasContingencyPlan: false, protocols: [], observation: "" }
    },
    kpis: { cpi: 1, spi: 1, estimatedDailyOverhead: 0, isi: 1 },
    valueEngineering: [],
    alerts: [],
    evolutionHistory: [],
    macroeconomicData: {
        inflationRate: 5.5,
        forwardRate: 4000,
        investmentReturn: 10.0,
        isInflationConfigurable: true,
        isForwardConfigurable: true,
        isInvestmentConfigurable: true
    }
};
