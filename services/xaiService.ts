/**
 * XAI SERVICE (Grok) - High Intelligence Provider
 */

const getXaiApiKey = (): string => {
    let key = '';
    try {
        // @ts-ignore
        key = import.meta.env.VITE_XAI_API_KEY || '';
    } catch (e) {
        key = process?.env?.VITE_XAI_API_KEY || '';
    }
    return key;
};

const XAI_API_KEY = getXaiApiKey();
const XAI_API_URL = 'https://api.x.ai/v1/chat/completions';

export const isXaiConfigured = (): boolean => {
    return XAI_API_KEY.length > 0;
};

export const generateWithXai = async (
    systemInstruction: string,
    userPrompt: string,
    options: {
        temperature?: number;
        maxTokens?: number;
        jsonMode?: boolean;
    } = {}
): Promise<any> => {
    if (!XAI_API_KEY) {
        throw new Error('XAI_API_KEY no está configurada.');
    }

    const messages = [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt }
    ];

    const requestBody: any = {
        model: 'grok-beta',
        messages,
        temperature: options.temperature ?? 0,
        stream: false
    };

    try {
        console.log('[XAI] Sending request to Grok...');
        const response = await fetch(XAI_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${XAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`xAI Error: ${response.status} - ${errorData.error?.message || 'Unknown'}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        return {
            text: () => content
        };
    } catch (error) {
        console.error('[XAI] Failed:', error);
        throw error;
    }
};
