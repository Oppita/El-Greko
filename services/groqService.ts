/**
 * GROQ SERVICE - Fallback AI Provider
 * Usado cuando la cuota de Gemini se agota
 * Modelo: llama-3.3-70b-versatile (gratuito y muy capaz)
 */

const getGroqApiKey = (): string => {
    let key = '';
    try {
        // @ts-ignore
        key = import.meta.env.VITE_GROQ_API_KEY || '';
    } catch (e) {
        key = process?.env?.VITE_GROQ_API_KEY || '';
    }
    return key;
};

const GROQ_API_KEY = getGroqApiKey();
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Check if Groq is configured
export const isGroqConfigured = (): boolean => {
    return GROQ_API_KEY.length > 0;
};

export interface GroqMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface GroqResponse {
    text: () => string;
    _rawResponse?: any;
}

/**
 * Generate content using Groq's Llama model
 * Compatible with Gemini's response format for easy fallback
 */
export const generateWithGroq = async (
    systemInstruction: string,
    userPrompt: string,
    options: {
        temperature?: number;
        maxTokens?: number;
        jsonMode?: boolean;
    } = {}
): Promise<GroqResponse> => {
    if (!GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY no está configurada. Agrega VITE_GROQ_API_KEY a tu archivo .env');
    }

    const messages: GroqMessage[] = [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt }
    ];

    const requestBody: any = {
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: options.temperature ?? 0,
        max_tokens: options.maxTokens ?? 8000,
    };

    // Enable JSON mode if requested
    if (options.jsonMode) {
        requestBody.response_format = { type: 'json_object' };
    }

    try {
        console.log('[GROQ FALLBACK] Sending request to Groq API...');

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[GROQ FALLBACK] API Error:', errorData);
            throw new Error(`Groq API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        console.log('[GROQ FALLBACK] Response received successfully.');

        // Return in Gemini-compatible format
        return {
            text: () => content,
            _rawResponse: data
        };

    } catch (error: any) {
        console.error('[GROQ FALLBACK] Request failed:', error);
        throw error;
    }
};

/**
 * Helper to check if an error is a quota/rate limit error
 */
export const isQuotaError = (error: any): boolean => {
    const message = error?.message?.toLowerCase() || '';
    const status = error?.status || error?.code;

    return (
        status === 429 ||
        status === 'RESOURCE_EXHAUSTED' ||
        message.includes('quota') ||
        message.includes('rate limit') ||
        message.includes('exceeded') ||
        message.includes('resource_exhausted') ||
        message.includes('too many requests')
    );
};
