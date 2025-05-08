import { PropType } from 'vue';
import { AIClient, AIProvider } from '@aivue/core';
import { Message } from '../composables/useChatEngine';
declare var __VLS_1: {}, __VLS_3: {
    message: Message;
    index: number;
}, __VLS_5: {
    message: Message;
    index: number;
}, __VLS_7: {
    message: Message;
    index: number;
}, __VLS_9: {}, __VLS_11: {
    error: Error;
}, __VLS_13: {
    input: string;
    sendMessage: () => Promise<void>;
}, __VLS_15: {};
type __VLS_Slots = {} & {
    header?: (props: typeof __VLS_1) => any;
} & {
    'user-message'?: (props: typeof __VLS_3) => any;
} & {
    'assistant-message'?: (props: typeof __VLS_5) => any;
} & {
    message?: (props: typeof __VLS_7) => any;
} & {
    loading?: (props: typeof __VLS_9) => any;
} & {
    error?: (props: typeof __VLS_11) => any;
} & {
    input?: (props: typeof __VLS_13) => any;
} & {
    footer?: (props: typeof __VLS_15) => any;
};
declare const __VLS_component: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    client: {
        type: PropType<AIClient>;
        default: null;
    };
    provider: {
        type: PropType<AIProvider>;
        default: null;
    };
    apiKey: {
        type: StringConstructor;
        default: null;
    };
    model: {
        type: StringConstructor;
        default: null;
    };
    baseUrl: {
        type: StringConstructor;
        default: null;
    };
    organizationId: {
        type: StringConstructor;
        default: null;
    };
    useProxy: {
        type: BooleanConstructor;
        default: boolean;
    };
    proxyUrl: {
        type: StringConstructor;
        default: string;
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
        type: PropType<Message[]>;
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
        type: PropType<"light" | "dark">;
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
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "message-sent": (...args: any[]) => void;
    "response-received": (...args: any[]) => void;
    error: (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    client: {
        type: PropType<AIClient>;
        default: null;
    };
    provider: {
        type: PropType<AIProvider>;
        default: null;
    };
    apiKey: {
        type: StringConstructor;
        default: null;
    };
    model: {
        type: StringConstructor;
        default: null;
    };
    baseUrl: {
        type: StringConstructor;
        default: null;
    };
    organizationId: {
        type: StringConstructor;
        default: null;
    };
    useProxy: {
        type: BooleanConstructor;
        default: boolean;
    };
    proxyUrl: {
        type: StringConstructor;
        default: string;
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
        type: PropType<Message[]>;
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
        type: PropType<"light" | "dark">;
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
}>> & Readonly<{
    "onMessage-sent"?: ((...args: any[]) => any) | undefined;
    "onResponse-received"?: ((...args: any[]) => any) | undefined;
    onError?: ((...args: any[]) => any) | undefined;
}>, {
    initialMessages: Message[];
    systemPrompt: string;
    streaming: boolean;
    persistenceKey: string;
    useProxy: boolean;
    proxyUrl: string;
    provider: AIProvider;
    apiKey: string;
    model: string;
    client: AIClient;
    baseUrl: string;
    organizationId: string;
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
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
