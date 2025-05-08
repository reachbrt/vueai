import { AIClient } from '../../core/src';
import { useChatEngine as useChatEngineComposable, Message, ChatOptions, ChatState } from './composables/useChatEngine';
import { formatMarkdown } from './utils/markdown';
export type { Message, ChatOptions, ChatState };
export declare const AiChatWindow: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    client: {
        type: import('vue').PropType<AIClient>;
        required: true;
    };
    title: {
        type: StringConstructor;
        default: string;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    initialMessages: {
        type: import('vue').PropType<Message[]>;
        default: () => never[];
    };
    systemPrompt: {
        type: StringConstructor;
        default: string;
    };
    streaming: {
        type: BooleanConstructor;
        default: boolean;
    };
    loadingText: {
        type: StringConstructor;
        default: string;
    };
    errorText: {
        type: StringConstructor;
        default: string;
    };
    showTimestamps: {
        type: BooleanConstructor;
        default: boolean;
    };
    showCopyButton: {
        type: BooleanConstructor;
        default: boolean;
    };
    showAvatars: {
        type: BooleanConstructor;
        default: boolean;
    };
    userAvatar: {
        type: StringConstructor;
        default: null;
    };
    assistantAvatar: {
        type: StringConstructor;
        default: null;
    };
    theme: {
        type: import('vue').PropType<"light" | "dark">;
        default: string;
        validator: (value: string) => boolean;
    };
    height: {
        type: StringConstructor;
        default: string;
    };
    width: {
        type: StringConstructor;
        default: string;
    };
    maxWidth: {
        type: StringConstructor;
        default: string;
    };
    persistenceKey: {
        type: StringConstructor;
        default: null;
    };
}>, {
    userInput: import('vue').Ref<string, string>;
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
    messagesContainer: import('vue').Ref<HTMLElement | null, HTMLElement | null>;
    inputElement: import('vue').Ref<HTMLTextAreaElement | null, HTMLTextAreaElement | null>;
    handleSendMessage: () => Promise<void>;
    handleKeyDown: (event: KeyboardEvent) => void;
    clearMessages: () => void;
    formatMessage: (content: string) => string;
    formatTimestamp: (timestamp?: Date) => string;
    copyToClipboard: (text: string) => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    client: {
        type: import('vue').PropType<AIClient>;
        required: true;
    };
    title: {
        type: StringConstructor;
        default: string;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    initialMessages: {
        type: import('vue').PropType<Message[]>;
        default: () => never[];
    };
    systemPrompt: {
        type: StringConstructor;
        default: string;
    };
    streaming: {
        type: BooleanConstructor;
        default: boolean;
    };
    loadingText: {
        type: StringConstructor;
        default: string;
    };
    errorText: {
        type: StringConstructor;
        default: string;
    };
    showTimestamps: {
        type: BooleanConstructor;
        default: boolean;
    };
    showCopyButton: {
        type: BooleanConstructor;
        default: boolean;
    };
    showAvatars: {
        type: BooleanConstructor;
        default: boolean;
    };
    userAvatar: {
        type: StringConstructor;
        default: null;
    };
    assistantAvatar: {
        type: StringConstructor;
        default: null;
    };
    theme: {
        type: import('vue').PropType<"light" | "dark">;
        default: string;
        validator: (value: string) => boolean;
    };
    height: {
        type: StringConstructor;
        default: string;
    };
    width: {
        type: StringConstructor;
        default: string;
    };
    maxWidth: {
        type: StringConstructor;
        default: string;
    };
    persistenceKey: {
        type: StringConstructor;
        default: null;
    };
}>> & Readonly<{}>, {
    initialMessages: Message[];
    systemPrompt: string;
    streaming: boolean;
    persistenceKey: string;
    title: string;
    placeholder: string;
    loadingText: string;
    errorText: string;
    showTimestamps: boolean;
    showCopyButton: boolean;
    showAvatars: boolean;
    userAvatar: string;
    assistantAvatar: string;
    theme: "light" | "dark";
    height: string;
    width: string;
    maxWidth: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export declare const useChatEngine: typeof useChatEngineComposable;
export declare const utils: {
    formatMarkdown: typeof formatMarkdown;
};
declare const _default: {
    AiChatWindow: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
        client: {
            type: import('vue').PropType<AIClient>;
            required: true;
        };
        title: {
            type: StringConstructor;
            default: string;
        };
        placeholder: {
            type: StringConstructor;
            default: string;
        };
        initialMessages: {
            type: import('vue').PropType<Message[]>;
            default: () => never[];
        };
        systemPrompt: {
            type: StringConstructor;
            default: string;
        };
        streaming: {
            type: BooleanConstructor;
            default: boolean;
        };
        loadingText: {
            type: StringConstructor;
            default: string;
        };
        errorText: {
            type: StringConstructor;
            default: string;
        };
        showTimestamps: {
            type: BooleanConstructor;
            default: boolean;
        };
        showCopyButton: {
            type: BooleanConstructor;
            default: boolean;
        };
        showAvatars: {
            type: BooleanConstructor;
            default: boolean;
        };
        userAvatar: {
            type: StringConstructor;
            default: null;
        };
        assistantAvatar: {
            type: StringConstructor;
            default: null;
        };
        theme: {
            type: import('vue').PropType<"light" | "dark">;
            default: string;
            validator: (value: string) => boolean;
        };
        height: {
            type: StringConstructor;
            default: string;
        };
        width: {
            type: StringConstructor;
            default: string;
        };
        maxWidth: {
            type: StringConstructor;
            default: string;
        };
        persistenceKey: {
            type: StringConstructor;
            default: null;
        };
    }>, {
        userInput: import('vue').Ref<string, string>;
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
        messagesContainer: import('vue').Ref<HTMLElement | null, HTMLElement | null>;
        inputElement: import('vue').Ref<HTMLTextAreaElement | null, HTMLTextAreaElement | null>;
        handleSendMessage: () => Promise<void>;
        handleKeyDown: (event: KeyboardEvent) => void;
        clearMessages: () => void;
        formatMessage: (content: string) => string;
        formatTimestamp: (timestamp?: Date) => string;
        copyToClipboard: (text: string) => void;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
        client: {
            type: import('vue').PropType<AIClient>;
            required: true;
        };
        title: {
            type: StringConstructor;
            default: string;
        };
        placeholder: {
            type: StringConstructor;
            default: string;
        };
        initialMessages: {
            type: import('vue').PropType<Message[]>;
            default: () => never[];
        };
        systemPrompt: {
            type: StringConstructor;
            default: string;
        };
        streaming: {
            type: BooleanConstructor;
            default: boolean;
        };
        loadingText: {
            type: StringConstructor;
            default: string;
        };
        errorText: {
            type: StringConstructor;
            default: string;
        };
        showTimestamps: {
            type: BooleanConstructor;
            default: boolean;
        };
        showCopyButton: {
            type: BooleanConstructor;
            default: boolean;
        };
        showAvatars: {
            type: BooleanConstructor;
            default: boolean;
        };
        userAvatar: {
            type: StringConstructor;
            default: null;
        };
        assistantAvatar: {
            type: StringConstructor;
            default: null;
        };
        theme: {
            type: import('vue').PropType<"light" | "dark">;
            default: string;
            validator: (value: string) => boolean;
        };
        height: {
            type: StringConstructor;
            default: string;
        };
        width: {
            type: StringConstructor;
            default: string;
        };
        maxWidth: {
            type: StringConstructor;
            default: string;
        };
        persistenceKey: {
            type: StringConstructor;
            default: null;
        };
    }>> & Readonly<{}>, {
        initialMessages: Message[];
        systemPrompt: string;
        streaming: boolean;
        persistenceKey: string;
        title: string;
        placeholder: string;
        loadingText: string;
        errorText: string;
        showTimestamps: boolean;
        showCopyButton: boolean;
        showAvatars: boolean;
        userAvatar: string;
        assistantAvatar: string;
        theme: "light" | "dark";
        height: string;
        width: string;
        maxWidth: string;
    }, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
    useChatEngine: typeof useChatEngineComposable;
    utils: {
        formatMarkdown: typeof formatMarkdown;
    };
};
export default _default;
