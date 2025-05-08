import { useChatEngine as useChatEngineComposable, Message, ChatOptions, ChatState } from './composables/useChatEngine';
import { formatMarkdown } from './utils/markdown';
export type { Message, ChatOptions, ChatState };
export declare const AiChatWindow: any;
export declare const AiChatToggle: any;
export declare const useChatEngine: typeof useChatEngineComposable;
export declare const utils: {
    formatMarkdown: typeof formatMarkdown;
};
export declare const AiChatPlugin: any;
export { vueVersion, isOlderVue3, createNode, compatCreateElementBlock, compatCreateElementVNode, compatNormalizeClass, createCompatComponent, registerCompatComponent, createCompatPlugin, installCompatPlugin, createReactiveState, createCompatRef } from '@aivue/core';
declare const _default: {
    AiChatWindow: any;
    AiChatToggle: any;
    useChatEngine: typeof useChatEngineComposable;
    utils: {
        formatMarkdown: typeof formatMarkdown;
    };
    AiChatPlugin: any;
};
export default _default;
