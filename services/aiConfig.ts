/**
 * AI CONFIGURATION - Centralized Model Settings
 * Configure your preferred models for each AI provider here
 */

export type AIProvider = 'gemini' | 'groq' | 'openai' | 'xai';

export interface AIModelConfig {
    primary: string;
    fallback?: string;
    displayName: string;
    company: string;
    enabled: boolean;
}

export const AI_MODELS: Record<AIProvider, AIModelConfig> = {
    gemini: {
        primary: 'gemini-2.5-flash',           // ✅ Available in your API key
        fallback: 'gemini-2.5-pro',             // ✅ Premium fallback
        displayName: 'Gemini 2.5 Flash',
        company: 'Google',
        enabled: true
    },
    groq: {
        primary: 'llama-3.3-70b-versatile',    // Fast, open-source
        displayName: 'Llama 3.3 70B',
        company: 'Meta via Groq',
        enabled: true                           // API key available
    },
    openai: {
        primary: 'gpt-4o-mini',                 // Cost-effective, powerful
        fallback: 'gpt-3.5-turbo',              // Cheaper alternative
        displayName: 'ChatGPT 4o Mini',
        company: 'OpenAI',
        enabled: false                          // Set to true when API key is added
    },
    xai: {
        primary: 'grok-beta',
        displayName: 'Grok Beta',
        company: 'xAI',
        enabled: false                          // Set to true when API key is added
    }
};

/**
 * Check if a provider is properly configured and enabled
 */
export const isProviderEnabled = (provider: AIProvider): boolean => {
    return AI_MODELS[provider].enabled;
};

/**
 * Get the display name for a provider
 */
export const getProviderDisplayName = (provider: AIProvider): string => {
    const config = AI_MODELS[provider];
    return `${config.displayName} (${config.company})`;
};

/**
 * Get the primary model name for a provider
 */
export const getPrimaryModel = (provider: AIProvider): string => {
    return AI_MODELS[provider].primary;
};

/**
 * Get the fallback model name for a provider (if exists)
 */
export const getFallbackModel = (provider: AIProvider): string | undefined => {
    return AI_MODELS[provider].fallback;
};
