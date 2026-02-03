
import { GoogleGenAI, Type, Schema } from "@google/genai";
import {
    ProjectData, INITIAL_PROJECT_DATA, RiskItem, InsurancePolicy, Stakeholder, Bottleneck,
    POTAnalysis, PMBOKAnalysis, PMBOKDeepAnalysis, FinancialProtectionDeepAnalysis,
    BottleneckDeepAnalysis, LegalDocument, ResourceAnalysis, ContractorProfile,
    CorrectiveDeepAnalysis, ActivityDeepAnalysis, KnowledgeDeepAnalysis,
    ManagementDeepAnalysis, GrekoCronosDeepAnalysis, FinancialDeepAnalysis, SearchResult,
    EvolutionLog, ProjectMilestone, SPFDeepAnalysis, SocialEcosystem
} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AnalysisInput {
    type: 'pdf' | 'text';
    content: string;
}

const SYSTEM_INSTRUCTION = "Eres 'El Greko', un auditor forense de infraestructura de élite, experto en econometría de proyectos, estándar PMI (PMBOK 7), gestión del riesgo (ISO 31000) y análisis de sistemas complejos (SPF - NASA). Tu objetivo es la protección del patrimonio público mediante un rigor técnico obsesivo.";

function cleanJsonString(text: string): string {
    if (!text) return "{}";

    // 1. Try strict parsing first (best case)
    try {
        JSON.parse(text);
        return text;
    } catch (e) {
        // Continue
    }

    // 2. Try extracting from markdown code blocks
    const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
        try {
            // Verify it parses
            JSON.parse(markdownMatch[1]);
            return markdownMatch[1];
        } catch (e) {
            // If markdown content is bad, fall through to brace matching
        }
    }

    // 3. Fallback: Find outermost braces
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const candidate = text.substring(firstBrace, lastBrace + 1);
        // Attempt to clean trailing commas or other common LLM json errors if needed in future
        return candidate;
    }

    return "{}";
}

async function generateWithFallback(params: { contents: any, config?: any, model?: string }) {
    const makeRequest = async (modelName: string) => {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout waiting for AI response")), 60000) // 60s timeout
        );

        const apiPromise = ai.models.generateContent({
            model: modelName,
            contents: params.contents,
            config: params.config
        });

        const response = await Promise.race([apiPromise, timeoutPromise]) as any;
        return response;
    };

    // Primary attempt
    try {
        return await makeRequest(params.model || 'gemini-1.5-flash');
    } catch (error: any) {
        console.warn(`Primary model ${params.model} failed, retrying with fallback...`, error);

        // Fallback attempt (switch to flash if pro failed, or retry same)
        try {
            const fallbackModel = 'gemini-1.5-flash';
            return await makeRequest(fallbackModel);
        } catch (retryError) {
            console.error("Gemini API Error (Retry failed):", retryError);
            throw new Error("Error connecting to AI service. Please try again with a smaller document.");
        }
    }
}

async function generateFast(prompt: string, schema?: Schema, systemInstruction?: string) {
    const response = await generateWithFallback({
        model: 'gemini-1.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
            systemInstruction: systemInstruction || SYSTEM_INSTRUCTION,
            temperature: 0.2,
        }
    });

    try {
        const cleaned = cleanJsonString(response.text || "{}");
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("JSON Parse Error in generateFast:", e);
        return {};
    }
}

export const analyzeProject = async (input: AnalysisInput): Promise<ProjectData> => {
    const parts = [];
    if (input.type === 'pdf') {
        parts.push({ inlineData: { mimeType: 'application/pdf', data: input.content } });
    } else {
        parts.push({ text: input.content });
    }

    parts.push({
        text: `
    ACTÚA COMO UN AUDITOR FORENSE INTEGRAL (TÉCNICO, FINANCIERO Y SOCIAL).
    
    TAREA: Extraer y analizar datos del proyecto.
    
    1. WBS / Bill of Quantities: Extrae ítems de presupuesto. Clasifica (CAPEX/OPEX).
    2. Ecosistema Social: Actores, Empleos estimados (calcúlalos si no están explícitos), Beneficiarios.
    3. Contrato: Fechas, Valores, Ubicación, Riesgos (marca SPFs).
    
    Devuelve un JSON válido. Si falta información, infiérela profesionalmente o déjala vacía.
    `});

    // Simplified Schema to prevent timeout on very deep nesting logic
    const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            projectName: { type: Type.STRING },
            contractId: { type: Type.STRING },
            projectPhase: { type: Type.STRING, enum: ["Formulation", "Execution", "Closed"] },
            contractor: { type: Type.STRING },
            nit: { type: Type.STRING },
            generalObjective: { type: Type.STRING },
            location: {
                type: Type.OBJECT,
                properties: {
                    latitude: { type: Type.NUMBER },
                    longitude: { type: Type.NUMBER },
                    address: { type: Type.STRING },
                    municipality: { type: Type.STRING },
                    department: { type: Type.STRING }
                }
            },
            totalBudget: { type: Type.NUMBER },
            spentBudget: { type: Type.NUMBER },
            progressPercentage: { type: Type.NUMBER },
            startDate: { type: Type.STRING },
            endDate: { type: Type.STRING },
            socialEcosystem: {
                type: Type.OBJECT,
                properties: {
                    directJobs: { type: Type.NUMBER },
                    indirectJobs: { type: Type.NUMBER },
                    beneficiaries: { type: Type.NUMBER },
                    beneficiaryDescription: { type: Type.STRING },
                    demographicHighlight: { type: Type.STRING },
                    socialReturnScore: { type: Type.NUMBER },
                    socialReturnQuote: { type: Type.STRING },
                    socialRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
                    // Flattened actors for speed
                    actors: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                role: { type: Type.STRING },
                                category: { type: Type.STRING, enum: ["Executor", "Control", "Beneficiario", "Afectado"] },
                                impactLevel: { type: Type.STRING, enum: ["Alto", "Medio", "Bajo"] },
                            }
                        }
                    }
                }
            },
            risks: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        risk: { type: Type.STRING },
                        probability: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                        impact: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                        mitigation: { type: Type.STRING },
                        isSPF: { type: Type.BOOLEAN }
                    }
                }
            },
            milestones: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING },
                        date: { type: Type.STRING },
                        status: { type: Type.STRING, enum: ["completed", "in-progress", "pending", "delayed"] },
                        progress: { type: Type.NUMBER },
                        estimatedCost: { type: Type.NUMBER },
                        startDate: { type: Type.STRING },
                        endDate: { type: Type.STRING },
                        financialType: { type: Type.STRING, enum: ["CAPEX", "OPEX"] },
                        strategicType: { type: Type.STRING, enum: ["Proactive", "Reactive"] },
                        isSPF: { type: Type.BOOLEAN }
                    }
                }
            }
        },
        required: ["projectName", "totalBudget", "milestones"]
    };

    try {
        // Use flash-preview for speed and reliability on large documents
        const response = await generateWithFallback({
            model: 'gemini-3-flash-preview',
            contents: parts,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema,
                systemInstruction: SYSTEM_INSTRUCTION,
            }
        });

        let rawData: any = {};
        try {
            rawData = JSON.parse(cleanJsonString(response.text || "{}"));
        } catch (e) {
            console.error("Unexpected JSON Parse Error (Main Analysis):", e);
            rawData = {};
        }

        return {
            ...INITIAL_PROJECT_DATA,
            ...rawData,
            location: { ...INITIAL_PROJECT_DATA.location, ...(rawData.location || {}) },
            risks: rawData.risks || [],
            milestones: rawData.milestones || [],
            budgetBreakdown: rawData.budgetBreakdown || [],
            socialEcosystem: rawData.socialEcosystem || INITIAL_PROJECT_DATA.socialEcosystem
        };
    } catch (error) {
        console.error("Error extracting project data:", error);
        throw error;
    }
};

export const searchProjectInfo = async (projectData: ProjectData): Promise<SearchResult> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Busca noticias recientes, controversias, hallazgos fiscales o denuncias sobre el proyecto: "${projectData.projectName}" contratista "${projectData.contractor}" en ${projectData.location.municipality}. Resumen ejecutivo.`,
            config: { tools: [{ googleSearch: {} }] }
        });
        const text = response.text || "No se encontró información relevante.";
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({ title: c.web?.title || "Fuente Web", uri: c.web?.uri || "" })).filter((s: any) => s.uri) || [];
        return { summary: text, sources };
    } catch (error) { console.error("Search error:", error); return { summary: "Error en la búsqueda.", sources: [] }; }
};

export const analyzeFinancialProtectionDeep = async (projectData: ProjectData): Promise<FinancialProtectionDeepAnalysis> => { try { const context = JSON.stringify({ projectName: projectData.projectName, budget: projectData.totalBudget, risks: (projectData.risks || []).slice(0, 10), location: projectData.location }); const prompt = `ROL: SUBDIRECTOR DE REDUCCIÓN DEL RIESGO (UNGRD) - EXPERTO EN ASEGURAMIENTO. TAREA: Estructurar la Transferencia del Riesgo siguiendo la "Guía de Aseguramiento de Bienes Inmuebles Públicos" (Metodología de 5 Pasos). CONTEXTO: ${context} Genera un análisis JSON estricto para los 5 pasos.`; const response = await generateWithFallback({ contents: prompt, config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { efficiencyScore: { type: Type.NUMBER }, overallStrategy: { type: Type.STRING }, steps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { stepNumber: { type: Type.NUMBER }, title: { type: Type.STRING }, status: { type: Type.STRING, enum: ['Optimo', 'Requiere Atención', 'Crítico'] }, description: { type: Type.STRING }, actionItems: { type: Type.ARRAY, items: { type: Type.STRING } }, kpi: { type: Type.STRING } } } } }, required: ["efficiencyScore", "overallStrategy", "steps"] } } }); return JSON.parse(cleanJsonString(response.text || "{}")); } catch (error) { console.error("Deep Financial Analysis Error", error); throw error; } };
export const analyzeBottleneckDeep = async (bottleneck: Bottleneck, projectData: ProjectData): Promise<BottleneckDeepAnalysis> => { const prompt = `Analiza este cuello de botella: "${bottleneck.processName}: ${bottleneck.description}". Contexto: ${projectData.projectName}. Identifica causa raíz, marco legal colombiano aplicable (Ley 80, Ley 1150, etc), impacto financiero y acciones estratégicas.`; return generateFast(prompt, { type: Type.OBJECT, properties: { rootCause: { type: Type.STRING }, legalFramework: { type: Type.STRING }, financialImpactEstimate: { type: Type.STRING }, strategicActions: { type: Type.ARRAY, items: { type: Type.STRING } }, probabilityOfResolution: { type: Type.NUMBER } } }); };
export const analyzeSPFDeep = async (itemDescription: string, projectData: ProjectData): Promise<SPFDeepAnalysis> => { const prompt = `METODOLOGÍA NASA/JWST (Single Point of Failure) - APLICADA A URIBIA/UNGRD. Analiza este punto crítico de fallo: "${itemDescription}". Proyecto: ${projectData.projectName}. Ubicación: ${projectData.location.municipality}. Identifica: Diagnóstico exacto del SPF, Modo de Fallo, Redundancia, Protocolo de Pruebas, Plan de Contingencia, Probabilidad de Catástrofe, Impacto en Beneficiarios.`; return generateFast(prompt, { type: Type.OBJECT, properties: { spfDiagnosis: { type: Type.STRING }, failureMode: { type: Type.STRING }, redundancyStrategy: { type: Type.STRING }, testingProtocol: { type: Type.STRING }, contingencyPlan: { type: Type.STRING }, catastropheProbability: { type: Type.NUMBER }, impactBeneficiaries: { type: Type.STRING } } }); };
export const generateAdministrativeDocument = async (bottleneck: Bottleneck, type: 'petition' | 'memo' | 'meeting', projectData: ProjectData): Promise<LegalDocument> => { const prompt = `Genera un documento legal tipo "${type}" para resolver el bloqueo: "${bottleneck.processName}". Proyecto: ${projectData.projectName}. Contratista: ${projectData.contractor}. El documento debe ser formal, jurídico y listo para firmar.`; return generateFast(prompt, { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, recipient: { type: Type.STRING } } }); };
export const analyzeResourceSufficiency = async (projectData: ProjectData): Promise<ResourceAnalysis> => { const prompt = `Audita la suficiencia de recursos para el proyecto "${projectData.projectName}" con presupuesto ${projectData.totalBudget}. Analiza si el personal y maquinaria son adecuados para el alcance descrito.`; return generateFast(prompt, { type: Type.OBJECT, properties: { sufficiencyAssessment: { type: Type.STRING }, personnelRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } }, machineryRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } }, technologySuggestions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, application: { type: Type.STRING }, benefit: { type: Type.STRING } } } }, efficiencyScore: { type: Type.NUMBER } } }); };

export const analyzeFinancialDeep = async (projectData: ProjectData): Promise<FinancialDeepAnalysis> => {
    const prompt = `Realiza una auditoría financiera forense predictiva del proyecto "${projectData.projectName}". Presupuesto: ${projectData.totalBudget}, Ejecutado: ${projectData.spentBudget}.
    
    Adicionalmente, calcula el ANÁLISIS DE PARIDAD DE PODER ADQUISITIVO (BIG MAC INDEX) para Colombia vs USA.
    - Precio Big Mac Colombia actual (aprox): 22900 COP
    - Precio Big Mac USA actual (aprox): 6.12 USD
    - Calcula la Tasa de Cambio Implícita (PPP).
    - Compara con la TRM actual (aprox 4150 o la real).
    - Determina si el Peso Colombiano está devaluado o sobrevaluado y cómo esto afecta la importación de materiales del proyecto.
    `;
    return generateFast(prompt, {
        type: Type.OBJECT,
        properties: {
            healthScore: { type: Type.NUMBER },
            diagnosis: { type: Type.STRING },
            forecast: {
                type: Type.OBJECT,
                properties: {
                    eac: { type: Type.NUMBER },
                    vac: { type: Type.NUMBER },
                    projectedStatus: { type: Type.STRING, enum: ['Superávit', 'Déficit', 'Equilibrio'] }
                }
            },
            concatenationAnalysis: {
                type: Type.OBJECT,
                properties: {
                    budgetVsExecutionGap: { type: Type.STRING },
                    flaggedDiscrepancies: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                activityName: { type: Type.STRING },
                                budgetedAmount: { type: Type.NUMBER },
                                executionCost: { type: Type.NUMBER },
                                variance: { type: Type.STRING }
                            }
                        }
                    }
                }
            },
            optimizationStrategies: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        impact: { type: Type.STRING },
                        action: { type: Type.STRING }
                    }
                }
            },
            riskItems: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        item: { type: Type.STRING },
                        riskLevel: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    }
                }
            },
            bigMacIndex: {
                type: Type.OBJECT,
                properties: {
                    localCurrencyCode: { type: Type.STRING },
                    localPrice: { type: Type.NUMBER },
                    dollarPrice: { type: Type.NUMBER },
                    impliedExchangeRate: { type: Type.NUMBER },
                    actualExchangeRate: { type: Type.NUMBER },
                    currencyValuationPercent: { type: Type.NUMBER },
                    description: { type: Type.STRING },
                    purchasingPowerParityAction: { type: Type.STRING }
                }
            }
        }
    });
};

export const analyzeContractorRisk = async (projectData: ProjectData): Promise<ContractorProfile> => { const prompt = `Realiza un perfil de riesgo forense del contratista "${projectData.contractor}" (NIT: ${projectData.nit}). Evalúa capacidad financiera, experiencia probable y riesgos de corrupción o incumplimiento.`; return generateFast(prompt, { type: Type.OBJECT, properties: { name: { type: Type.STRING }, nit: { type: Type.STRING }, suitabilityScore: { type: Type.NUMBER }, kCapacity: { type: Type.STRING }, financialHealth: { type: Type.STRING }, disbursementRisk: { type: Type.STRING }, disbursementRationale: { type: Type.STRING }, redFlags: { type: Type.ARRAY, items: { type: Type.STRING } }, summary: { type: Type.STRING } } }); };
export const analyzeCorrectiveDeep = async (projectData: ProjectData): Promise<CorrectiveDeepAnalysis> => { const prompt = `Evaluación técnica forense de intervención correctiva para "${projectData.projectName}". Analiza la idoneidad técnica, vulnerabilidad y alternativas de ingeniería.`; return generateFast(prompt, { type: Type.OBJECT, properties: { threatDiagnosis: { type: Type.STRING }, engineeringSolutionAudit: { type: Type.STRING }, transversalChecks: { type: Type.OBJECT, properties: { budgetSufficiency: { type: Type.STRING }, timelineFeasibility: { type: Type.STRING }, regulatoryCompliance: { type: Type.STRING } } }, vulnerabilityAssessment: { type: Type.STRING }, technicalRigorScore: { type: Type.NUMBER }, riskOfFailure: { type: Type.STRING }, holisticRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } }, alternativeSolutions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { solutionName: { type: Type.STRING }, description: { type: Type.STRING }, pros: { type: Type.ARRAY, items: { type: Type.STRING } }, cons: { type: Type.ARRAY, items: { type: Type.STRING } }, estimatedCostImpact: { type: Type.STRING }, resilienceScore: { type: Type.NUMBER } } } }, resourceOptimizationAudit: { type: Type.STRING }, costBenefitAnalysis: { type: Type.STRING } } }); };
export const analyzeCriticalPath = async (milestones: ProjectMilestone[], projectInfo: { name: string, objective: string }) => { const prompt = `Calcula la ruta crítica (CPM) para estas actividades del proyecto "${projectInfo.name}". Identifica actividades críticas, dependencias lógicas y fechas estimadas. Input: ${JSON.stringify(milestones.map(m => ({ code: m.code, desc: m.description, dates: [m.startDate, m.endDate] })))}`; const response = await generateFast(prompt, { type: Type.OBJECT, properties: { analysisSummary: { type: Type.STRING }, updatedMilestones: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { code: { type: Type.STRING }, isCriticalPath: { type: Type.BOOLEAN }, criticalPathReasoning: { type: Type.STRING }, inferredResources: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, quantity: { type: Type.NUMBER }, unit: { type: Type.STRING }, type: { type: Type.STRING } } } } } } } } }); const updated = milestones.map(m => { const update = response.updatedMilestones?.find((u: any) => u.code === m.code || m.description.includes(u.code)); return update ? { ...m, ...update } : m; }); return { analysisSummary: response.analysisSummary, updatedMilestones: updated }; };
export const analyzeActivityDeep = async (milestone: ProjectMilestone, context: { name: string, location: string, phase: string, type: string }): Promise<ActivityDeepAnalysis> => { const prompt = `INGENIERÍA DE VALOR ESPECÍFICA PARA LA ACTIVIDAD: "${milestone.description}". CONTEXTO: Proyecto: ${context.name}, Ubicación: ${context.location}. INSTRUCCIONES: Estrategia de optimización técnica, Tecnologías modernas, Riesgos de ejecución, Eficiencia cuantificable.`; return generateFast(prompt, { type: Type.OBJECT, properties: { optimizationStrategy: { type: Type.STRING }, suggestedTechnologies: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, benefit: { type: Type.STRING } } } }, specificExecutionRisks: { type: Type.ARRAY, items: { type: Type.STRING } }, efficiencyGainEstimate: { type: Type.STRING } } }); };
export const analyzeKnowledgeDeep = async (projectData: ProjectData): Promise<KnowledgeDeepAnalysis> => { const prompt = `Análisis de Conocimiento del Riesgo (Ley 1523) para "${projectData.projectName}". Evalúa estudios técnicos, vacíos de información y alternativas de modelamiento.`; return generateFast(prompt, { type: Type.OBJECT, properties: { overallKnowledgeScore: { type: Type.NUMBER }, riskCharacterization: { type: Type.STRING }, criticalDataGaps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { gap: { type: Type.STRING }, criticality: { type: Type.STRING }, impact: { type: Type.STRING }, actionPlan: { type: Type.STRING } } } }, modelingAlternatives: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.STRING }, estimatedCost: { type: Type.STRING } } } }, monitoringAlternatives: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING } } } } } }); };
export const analyzeManagementDeep = async (projectData: ProjectData): Promise<ManagementDeepAnalysis> => { const prompt = `Evaluación de Preparación para Respuesta a Desastres en el proyecto "${projectData.projectName}".`; return generateFast(prompt, { type: Type.OBJECT, properties: { preparednessScore: { type: Type.NUMBER }, contingencyPlanAudit: { type: Type.STRING }, evacuationProtocols: { type: Type.OBJECT, properties: { strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } } } }, commandChain: { type: Type.OBJECT, properties: { clarity: { type: Type.STRING }, recommendations: { type: Type.ARRAY, items: { type: Type.STRING } } } }, responseLogistics: { type: Type.OBJECT, properties: { strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } } } }, communicationSystemsAudit: { type: Type.STRING }, actionableRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } } } }); };
export const analyzePOTAlignment = async (projectData: ProjectData, pdfBase64: string): Promise<POTAnalysis> => { const prompt = `Analiza si el proyecto "${projectData.projectName}" cumple con el POT adjunto. Identifica restricciones de uso de suelo, zonas de riesgo y cumplimiento normativo.`; const response = await generateWithFallback({ contents: [{ inlineData: { mimeType: 'application/pdf', data: pdfBase64 } }, { text: prompt }], config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { complianceScore: { type: Type.NUMBER }, landUseRestrictions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { issue: { type: Type.STRING }, mitigation: { type: Type.STRING } } } }, recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }, riskZonesIdentified: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { issue: { type: Type.STRING }, mitigation: { type: Type.STRING } } } } } } } }); return JSON.parse(cleanJsonString(response.text || "{}")); };
export const updateProjectWithNewData = async (currentData: ProjectData, input: { type: 'pdf' | 'text', content: string }): Promise<ProjectData> => {
    const prompt = `ACTUALIZACIÓN DE PROYECTO (AUDITORÍA DE AVANCE). Proyecto Actual: ${JSON.stringify({ name: currentData.projectName, budget: currentData.totalBudget, progress: currentData.progressPercentage })}. Analiza la NUEVA información y determina: Nuevos avances, Cambios en fechas, Log de cambios forense (EvolutionLog). Devuelve los campos actualizados.`;
    const parts: any[] = [{ text: prompt }];
    if (input.type === 'pdf') {
        parts.push({ inlineData: { mimeType: 'application/pdf', data: input.content } });
    } else {
        parts.push({ text: input.content });
    }

    // Usando gemini-2.0-flash que es el modelo actual recomendado para el nuevo SDK
    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: parts,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    progressPercentage: { type: Type.NUMBER },
                    spentBudget: { type: Type.NUMBER },
                    milestoneUpdates: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                description: { type: Type.STRING },
                                progress: { type: Type.NUMBER },
                                status: { type: Type.STRING }
                            }
                        }
                    },
                    evolutionLog: {
                        type: Type.OBJECT,
                        properties: {
                            summary: { type: Type.STRING },
                            efficiencyVerdict: { type: Type.STRING, enum: ['Optimo', 'Regular', 'Critico'] },
                            efficiencyRationale: { type: Type.STRING },
                            changes: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        field: { type: Type.STRING },
                                        oldValue: { type: Type.STRING },
                                        newValue: { type: Type.STRING },
                                        comment: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const updateData = JSON.parse(cleanJsonString(response.text || "{}"));
    const newLog: EvolutionLog = {
        date: new Date().toISOString(),
        sourceDocument: input.type === 'pdf' ? "Documento PDF" : "Reporte de Texto",
        summary: updateData.evolutionLog?.summary || "Actualización manual",
        changes: updateData.evolutionLog?.changes || [],
        efficiencyVerdict: updateData.evolutionLog?.efficiencyVerdict,
        efficiencyRationale: updateData.evolutionLog?.efficiencyRationale
    };

    return {
        ...currentData,
        progressPercentage: updateData.progressPercentage || currentData.progressPercentage,
        spentBudget: updateData.spentBudget || currentData.spentBudget,
        evolutionHistory: [newLog, ...(currentData.evolutionHistory || [])]
    };
};
export const analyzePMBOK7 = async (data: ProjectData): Promise<PMBOKAnalysis> => { const prompt = `Auditoría bajo estándar PMI PMBOK 7. Evalúa los 12 principios para: "${data.projectName}".`; return generateFast(prompt, { type: Type.OBJECT, properties: { overallObservation: { type: Type.STRING }, auditDate: { type: Type.STRING }, principles: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, englishName: { type: Type.STRING }, score: { type: Type.NUMBER }, status: { type: Type.STRING }, reasoning: { type: Type.STRING } } } } } }); };
export const analyzePMBOKPrincipleDeep = async (data: ProjectData, principleName: string): Promise<PMBOKDeepAnalysis> => { const prompt = `Deep Dive PMBOK 7 Principio: "${principleName}". Proyecto: "${data.projectName}".`; return generateFast(prompt, { type: Type.OBJECT, properties: { diagnosis: { type: Type.STRING }, strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }, actionableSteps: { type: Type.ARRAY, items: { type: Type.STRING } }, kpiImpact: { type: Type.STRING }, consequenceSimulation: { type: Type.STRING } } }); };

export const analyzeSocialEcosystem = async (projectData: ProjectData): Promise<SocialEcosystem> => {
    const prompt = `ROL: ANALISTA SOCIOECONÓMICO. PROYECTO: "${projectData.projectName}". 
    TAREA: Generar un mapa de actores detallado y análisis de retorno social.
    OUTPUT JSON: { 
        "directJobs": number, "indirectJobs": number, "beneficiaries": number, "beneficiaryDescription": string, "demographicHighlight": string, "socialReturnScore": number, "socialReturnQuote": string, "socialRisks": string[], 
        "targetPopulation": { "description": string, "characteristics": string[] },
        "actors": [ { "name": string, "role": string, "category": "Executor"|"Control"|"Beneficiario"|"Afectado", "impactLevel": "Alto"|"Medio"|"Bajo", "interest": string } ] 
    }`;
    return generateFast(prompt, { type: Type.OBJECT, properties: { directJobs: { type: Type.NUMBER }, indirectJobs: { type: Type.NUMBER }, beneficiaries: { type: Type.NUMBER }, beneficiaryDescription: { type: Type.STRING }, demographicHighlight: { type: Type.STRING }, socialReturnScore: { type: Type.NUMBER }, socialReturnQuote: { type: Type.STRING }, socialRisks: { type: Type.ARRAY, items: { type: Type.STRING } }, targetPopulation: { type: Type.OBJECT, properties: { description: { type: Type.STRING }, characteristics: { type: Type.ARRAY, items: { type: Type.STRING } } } }, actors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, role: { type: Type.STRING }, category: { type: Type.STRING, enum: ["Executor", "Control", "Beneficiario", "Afectado"] }, impactLevel: { type: Type.STRING, enum: ["Alto", "Medio", "Bajo"] }, interest: { type: Type.STRING } } } } } });
};

export const askProjectQuestion = async (question: string, projectData: ProjectData): Promise<string> => { const context = JSON.stringify({ name: projectData.projectName, budget: projectData.totalBudget, risks: projectData.risks, status: projectData.progressPercentage }); const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Contexto Proyecto: ${context}. Pregunta Usuario: "${question}". Responde como un consultor experto, breve y directo.`, }); return response.text || "No pude generar una respuesta."; };
export const generateMitigationSuggestion = async (risk: RiskItem, projectData: ProjectData): Promise<string> => { const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: `Genera una estrategia de mitigación detallada (ISO 31000) para el riesgo: "${risk.risk}" (Impacto: ${risk.impact}). Proyecto: ${projectData.projectName}.`, }); return response.text || "Error generando mitigación."; };
export const analyzeGrekoCronos = async (data: ProjectData): Promise<GrekoCronosDeepAnalysis> => { const prompt = `Análisis de Cronograma Greko Cronos para "${data.projectName}". Detecta desviaciones y sugiere aceleración.`; return generateFast(prompt, { type: Type.OBJECT, properties: { analysisDate: { type: Type.STRING }, projectedCompletionDate: { type: Type.STRING }, daysVariance: { type: Type.NUMBER }, timelineDiagnosis: { type: Type.STRING }, rootCauses: { type: Type.ARRAY, items: { type: Type.STRING } }, acceleratorStrategies: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { strategyName: { type: Type.STRING }, description: { type: Type.STRING }, impactDays: { type: Type.NUMBER } } } }, impactOnBudget: { type: Type.STRING } } }); };

// NEW: HOLISTIC REPORT GENERATOR
export interface ReportContext {
    metrics: any; // CPI, SPI, etc
    spfs: any[];
    riskStats: any;
    bottlenecks: Bottleneck[];
    pmbok?: PMBOKAnalysis;
}

export const generateDeepTechnicalReport = async (projectData: ProjectData, context: ReportContext): Promise<string> => {
    const prompt = `
    ROL: AUDITOR GENERAL DE LA REPÚBLICA (EXPERTO EN INFRAESTRUCTURA).
    TAREA: Generar un INFORME TÉCNICO DE AUDITORÍA FORENSE HOLÍSTICA (Formato HTML Profesional).
    
    DATOS DEL PROYECTO:
    - Nombre: ${projectData.projectName}
    - Contratista: ${projectData.contractor}
    - Presupuesto: $${projectData.totalBudget}
    - Ubicación: ${projectData.location.municipality}
    
    MÉTRICAS ECONOMÉTRICAS (CALCULADAS):
    - CPI (Eficiencia Costo): ${context.metrics.cpi.toFixed(2)} ${context.metrics.cpi < 1 ? '(ALERTA: SOBRECOSTOS)' : '(Eficiente)'}
    - SPI (Eficiencia Tiempo): ${context.metrics.spi.toFixed(2)} ${context.metrics.spi < 1 ? '(ALERTA: RETRASO)' : '(A tiempo)'}
    - Ejecución Financiera: ${context.metrics.financialProgress.toFixed(1)}%
    
    RIESGOS SISTÉMICOS:
    - Puntos Únicos de Fallo (SPF): ${context.spfs.length} detectados.
    - Riesgos Críticos: ${context.riskStats.critical}
    - Cuellos de Botella Activos: ${context.bottlenecks.length}
    
    PMBOK 7 ALINEACIÓN:
    ${context.pmbok ? context.pmbok.overallObservation : "No auditado bajo PMBOK aún."}
    
    ESTRUCTURA OBLIGATORIA DEL INFORME (HTML):
    Usa estilos CSS inline para dar apariencia de documento oficial (font-family: serif, justified text).
    
    1. <h2 style="color:#1e3a8a; border-bottom: 2px solid #1e3a8a;">1. RESUMEN EJECUTIVO FORENSE</h2>
       - Dictamen claro sobre la viabilidad y estado de salud del proyecto.
       - Párrafo de alto nivel para el Contralor/Gerente.
       
    2. <h2 style="color:#1e3a8a; border-bottom: 2px solid #1e3a8a;">2. ANÁLISIS ECONOMÉTRICO Y FINANCIERO</h2>
       - Interpretación profunda del CPI y SPI. ¿El dinero está rindiendo? ¿El tiempo se está perdiendo?
       - Proyección al cierre (Estimate at Completion).
       
    3. <h2 style="color:#1e3a8a; border-bottom: 2px solid #1e3a8a;">3. MATRIZ DE RIESGOS SISTÉMICOS (SPF & NASA)</h2>
       - Detalle de los Puntos Únicos de Fallo identificados.
       - Probabilidad de colapso operativo si no se mitigan.
       
    4. <h2 style="color:#1e3a8a; border-bottom: 2px solid #1e3a8a;">4. HALLAZGOS OPERATIVOS Y CUELLOS DE BOTELLA</h2>
       - Lista técnica de los bloqueos.
       - Impacto en la ruta crítica.
       
    5. <h2 style="color:#1e3a8a; border-bottom: 2px solid #1e3a8a;">5. VEREDICTO Y HOJA DE RUTA</h2>
       - 3 a 5 Recomendaciones estratégicas obligatorias.
       - Decisión final: ¿Continuar, Intervenir o Liquidar?
       
    NOTA: Sé extremadamente técnico, crítico y profesional. Usa vocabulario de ingeniería forense.
    NO incluyas <html> o <body> tags, solo el contenido del informe div wrapper.
    `;

    const response = await generateWithFallback({
        model: 'gemini-3-pro-preview',
        contents: prompt
    });

    return response.text || "<h1>Error generando reporte holístico</h1>";
};
