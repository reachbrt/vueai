import { PropType } from 'vue';
import { AIClient, AIProvider } from '../../../core/src';
import { Message } from '../composables/useChatEngine';
declare const _default: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    position: {
        type: PropType<"bottom" | "top">;
        default: string;
        validator: (value: string) => boolean;
    };
    defaultOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    title: {
        type: StringConstructor;
        default: string;
    };
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
    theme: {
        type: PropType<"light" | "dark">;
        default: string;
    };
    showAvatars: {
        type: BooleanConstructor;
        default: boolean;
    };
    persistenceKey: {
        type: StringConstructor;
        default: null;
    };
    demoMode: {
        type: BooleanConstructor;
        default: boolean;
    };
    demoResponses: {
        type: PropType<Record<string, string>>;
        default: () => {
            hello: string;
            help: string;
            features: string;
        };
    };
}>, {
    isOpen: import('vue').Ref<boolean, boolean>;
    toggleChat: () => void;
    useDefaultChat: import('vue').ComputedRef<boolean>;
    chatProps: import('vue').ComputedRef<Record<string, any>>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, ("message-sent" | "response-received" | "error" | "toggle")[], "message-sent" | "response-received" | "error" | "toggle", import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    position: {
        type: PropType<"bottom" | "top">;
        default: string;
        validator: (value: string) => boolean;
    };
    defaultOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    title: {
        type: StringConstructor;
        default: string;
    };
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
    theme: {
        type: PropType<"light" | "dark">;
        default: string;
    };
    showAvatars: {
        type: BooleanConstructor;
        default: boolean;
    };
    persistenceKey: {
        type: StringConstructor;
        default: null;
    };
    demoMode: {
        type: BooleanConstructor;
        default: boolean;
    };
    demoResponses: {
        type: PropType<Record<string, string>>;
        default: () => {
            hello: string;
            help: string;
            features: string;
        };
    };
}>> & Readonly<{
    onError?: ((...args: any[]) => any) | undefined;
    "onMessage-sent"?: ((...args: any[]) => any) | undefined;
    "onResponse-received"?: ((...args: any[]) => any) | undefined;
    onToggle?: ((...args: any[]) => any) | undefined;
}>, {
    initialMessages: Message[];
    systemPrompt: string;
    streaming: boolean;
    persistenceKey: string;
    demoMode: boolean;
    demoResponses: Record<string, string>;
    provider: AIProvider;
    apiKey: string;
    model: string;
    client: AIClient;
    title: string;
    placeholder: string;
    showAvatars: boolean;
    theme: "light" | "dark";
    position: "bottom" | "top";
    defaultOpen: boolean;
}, {}, {
    AiChatWindow: {
        new (...args: any[]): import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('vue').ExtractPropTypes<{
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
            demoMode: {
                type: BooleanConstructor;
                default: boolean;
            };
            demoResponses: {
                type: PropType<Record<string, string>>;
                default: () => {
                    hello: string;
                    help: string;
                    features: string;
                };
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
        }>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
            "message-sent": (...args: any[]) => void;
            "response-received": (...args: any[]) => void;
            error: (...args: any[]) => void;
        }, import('vue').PublicProps, {
            initialMessages: Message[];
            systemPrompt: string;
            streaming: boolean;
            persistenceKey: string;
            demoMode: boolean;
            demoResponses: Record<string, string>;
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
        }, true, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
            messagesContainer: HTMLDivElement;
            inputElement: HTMLTextAreaElement;
        }, HTMLDivElement, import('vue').ComponentProvideOptions, {
            P: {};
            B: {};
            D: {};
            C: {};
            M: {};
            Defaults: {};
        }, Readonly<import('vue').ExtractPropTypes<{
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
            demoMode: {
                type: BooleanConstructor;
                default: boolean;
            };
            demoResponses: {
                type: PropType<Record<string, string>>;
                default: () => {
                    hello: string;
                    help: string;
                    features: string;
                };
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
        }>, {}, {}, {}, {}, {
            initialMessages: Message[];
            systemPrompt: string;
            streaming: boolean;
            persistenceKey: string;
            demoMode: boolean;
            demoResponses: Record<string, string>;
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
        }>;
        __isFragment?: never;
        __isTeleport?: never;
        __isSuspense?: never;
    } & import('vue').ComponentOptionsBase<Readonly<import('vue').ExtractPropTypes<{
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
        demoMode: {
            type: BooleanConstructor;
            default: boolean;
        };
        demoResponses: {
            type: PropType<Record<string, string>>;
            default: () => {
                hello: string;
                help: string;
                features: string;
            };
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
    }>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        "message-sent": (...args: any[]) => void;
        "response-received": (...args: any[]) => void;
        error: (...args: any[]) => void;
    }, string, {
        initialMessages: Message[];
        systemPrompt: string;
        streaming: boolean;
        persistenceKey: string;
        demoMode: boolean;
        demoResponses: Record<string, string>;
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
    }, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps & (new () => {
        $slots: {
            header?(_: {}): any;
            'user-message'?(_: {
                message: Message;
                index: number;
            }): any;
            'assistant-message'?(_: {
                message: Message;
                index: number;
            }): any;
            message?(_: {
                message: Message;
                index: number;
            }): any;
            loading?(_: {}): any;
            error?(_: {
                error: Error;
            }): any;
            input?(_: {
                input: string;
                sendMessage: () => Promise<void>;
            }): any;
            footer?(_: {}): any;
        };
    });
}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default _default;
