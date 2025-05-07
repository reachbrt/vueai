interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
type AIProvider = 'openai' | 'claude' | 'gemini' | 'huggingface' | 'ollama' | 'deepseek' | 'fallback';
interface AIClientOptions {
    provider: AIProvider;
    apiKey?: string;
    model?: string;
    baseUrl?: string;
    organizationId?: string;
}
interface ChatOptions {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    stopSequences?: string[];
}
interface StreamCallbacks {
    onStart?: () => void;
    onToken?: (token: string) => void;
    onComplete?: (completeText: string) => void;
    onError?: (error: Error) => void;
}
declare class AIClient {
    private provider;
    private apiKey?;
    private model?;
    private baseUrl?;
    private organizationId?;
    constructor(options: AIClientOptions);
    chat(messages: Message[], options?: ChatOptions): Promise<string>;
    chatStream(messages: Message[], callbacks: StreamCallbacks, options?: ChatOptions): Promise<void>;
}
declare const providerRegistry: Map<string, any>;
type ProviderConfig = {
    [key: string]: {
        apiKey?: string;
        defaultModel?: string;
        baseUrl?: string;
        organizationId?: string;
    };
};
declare function registerProviders(providers: ProviderConfig): void;
declare const _default: {
    AIClient: typeof AIClient;
    registerProviders: typeof registerProviders;
};

export { AIClient, type AIClientOptions, type AIProvider, type ChatOptions, type Message, type ProviderConfig, type StreamCallbacks, _default as default, providerRegistry, registerProviders };
