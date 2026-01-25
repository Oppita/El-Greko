
import { analyzeKnowledgeDeep } from '../services/geminiService';
import { ProjectData, INITIAL_PROJECT_DATA } from '../types';

// Mock console.error to avoid noise if needed, or keep it
// We need to ensure process.env.VITE_GEMINI_API_KEY is set before this script runs

async function run() {
    console.log("Starting verification of UNGRD Knowledge Analysis...");

    // Create a mock project data
    // We need to cast or ensure INITIAL_PROJECT_DATA is valid
    const mockProject: ProjectData = {
        ...INITIAL_PROJECT_DATA,
        projectName: "Test Project UNGRD - La Mojana",
        generalObjective: "Construcción de dique de contención para mitigación de inundaciones severas y protección de comunidades.",
        ungrdAnalysis: {
            ...INITIAL_PROJECT_DATA.ungrdAnalysis,
            knowledge: {
                ...INITIAL_PROJECT_DATA.ungrdAnalysis.knowledge,
                observation: "Se identifica falta de estudios de retorno de 100 años.",
                scenariosIdentified: ["Inundación por desbordamiento", "Falla geotécnica del dique"]
            }
        }
    };

    try {
        console.log("Invoking analyzeKnowledgeDeep...");
        const start = Date.now();
        const result = await analyzeKnowledgeDeep(mockProject);
        const duration = (Date.now() - start) / 1000;

        console.log(`Deep Analysis completed in ${duration}s`);
        console.log("------------------------------------------");
        console.log(JSON.stringify(result, null, 2));
        console.log("------------------------------------------");

        if (result.overallKnowledgeScore !== undefined && result.riskCharacterization) {
            console.log("VERIFICATION PASSED: Structure is valid.");
        } else {
            console.error("VERIFICATION FAILED: Missing required fields.");
            process.exit(1);
        }

    } catch (e) {
        console.error("VERIFICATION FAILED WITH EXCEPTION:", e);
        process.exit(1);
    }
}

run();
