import { Ref } from 'vue';
import { AIClient, Message as CoreMessage, AIProvider } from '@aivue/core';
export interface Message extends CoreMessage {
    id?: string;
    timestamp?: Date;
}
export interface ChatOptions {
    provider: AIProvider;
    apiKey?: string;
    model?: string;
    client?: AIClient;
    baseUrl?: string;
    organizationId?: string;
    initialMessages?: Message[];
    systemPrompt?: string;
    streaming?: boolean;
    persistenceKey?: string | null;
    maxMessages?: number;
    useProxy?: boolean;
    proxyUrl?: string;
    onError?: ((error: Error) => void) | null;
    onMessageSent?: ((message: Message) => void) | null;
    onResponseReceived?: ((message: Message) => void) | null;
}
export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: Error | null;
}
export interface ChatEngineReturn {
    messages: Ref<Message[]>;
    isLoading: Ref<boolean>;
    error: Ref<Error | null>;
    sendMessage: (content: string) => Promise<void>;
    clearMessages: () => void;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    resetError: () => void;
    updateConfig: (config: Partial<ChatOptions>) => void;
}
/**
 * Composable for managing chat state and interactions with AI
 *
 * @param options - Configuration options
 * @returns Chat state and methods
 */
export declare function useChatEngine(options: ChatOptions): ChatEngineReturn;
export default useChatEngine;
