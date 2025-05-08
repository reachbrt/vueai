import { AIClient, Message as CoreMessage } from '../../../core/src';
export interface Message extends CoreMessage {
    id?: string;
    timestamp?: Date;
}
export interface ChatOptions {
    client: AIClient;
    initialMessages?: Message[];
    systemPrompt?: string;
    streaming?: boolean;
    persistenceKey?: string | null;
    maxMessages?: number;
    onError?: ((error: Error) => void) | null;
}
export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: Error | null;
}
/**
 * Composable for managing chat state and interactions with AI
 *
 * @param options - Configuration options
 * @returns Chat state and methods
 */
export declare function useChatEngine(options: ChatOptions): {
    sendMessage: (content: string) => Promise<void>;
    clearMessages: () => void;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    messages: import('vue').Ref<{
        id?: string | undefined;
        timestamp?: Date | undefined;
        role: "system" | "user" | "assistant";
        content: string;
    }[], {
        id?: string | undefined;
        timestamp?: Date | undefined;
        role: "system" | "user" | "assistant";
        content: string;
    }[]>;
    isLoading: import('vue').Ref<boolean, boolean>;
    error: import('vue').Ref<Error | null, Error | null>;
};
export default useChatEngine;
