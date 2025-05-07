import { Message as Message$1 } from '@reachbrt/vueai-core';

interface Message extends Message$1 {
    id?: string;
    timestamp?: Date;
}
interface ChatOptions {
    provider: string;
    apiKey?: string;
    model?: string;
    systemPrompt?: string;
    streaming?: boolean;
    initialMessages?: Message[];
}
interface UseChatEngineResult {
    messages: Message[];
    isLoading: boolean;
    error: Error | null;
    sendMessage: (content: string) => Promise<void>;
    resetConversation: () => void;
}
declare function useChatEngine(options: ChatOptions): UseChatEngineResult;
declare const AiChatWindow: {
    name: string;
};
declare const _default: {
    useChatEngine: typeof useChatEngine;
    AiChatWindow: {
        name: string;
    };
};

export { AiChatWindow, type ChatOptions, type Message, type UseChatEngineResult, _default as default, useChatEngine };
