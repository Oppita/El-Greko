/**
 * OPENAI SERVICE - Premium AI Provider
 * Usado para auditorías de alta precisión con GPT-4o
 */

const getOpenAIApiKey = (): string => {
    let key = '';
    try {
        // @ts-ignore
        key = import.meta.env.VITE_OPENAI_API_KEY || '';
    } catch (e) {
        // Fallback for non-Vite environments
        key = process?.env?.VITE_OPENAI_API_KEY || '';
    }
    return key;
};

const OPENAI_API_KEY = getOpenAIApiKey();
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const isOpenAIConfigured = (): boolean => {
    return OPENAI_API_KEY.length > 0;
};

export const generateWithOpenAI = async (
    systemInstruction: string,
    userPrompt: string,
    options: {
        temperature?: number;
        maxTokens?: number;
        jsonMode?: boolean;
    } = {}
): Promise<any> => {
    if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY no está configurada.');
    }

    const messages = [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt }
    ];

    const requestBody: any = {
        model: 'gpt-4o',
        messages,
        temperature: options.temperature ?? 0,
        max_tokens: options.maxTokens ?? 4096,
    };

    if (options.jsonMode) {
        requestBody.response_format = { type: 'json_object' };
    }

    try {
        console.log('[OPENAI] Sending request...');
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`OpenAI Error: ${response.status} - ${errorData.error?.message || 'Unknown'}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        return {
            text: () => content
        };
    } catch (error) {
        console.error('[OPENAI] Failed:', error);
        throw error;
    }
};
