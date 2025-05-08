export { compatCreateElementBlock, compatCreateElementVNode, compatNormalizeClass, createCompatComponent, createCompatPlugin, createCompatRef, createNode, createReactiveState, installCompatPlugin, isOlderVue3, registerCompatComponent, vueVersion } from '@aivue/core';

interface SmartFormSchema {
    [field: string]: {
        type: string;
        aiValidation?: boolean;
        selfHeal?: boolean;
        required?: boolean;
        label?: string;
        placeholder?: string;
        options?: Array<{
            value: string;
            label: string;
        }>;
        min?: number;
        max?: number;
    };
}
interface SmartFormData {
    [field: string]: any;
}
interface SmartFormErrors {
    [field: string]: string;
}
interface UseSmartFormResult {
    formData: SmartFormData;
    errors: SmartFormErrors;
    handleChange: (field: string, value: any) => void;
    validate: (field?: string) => Promise<boolean>;
    fixWithAI: (field: string) => Promise<void>;
    reset: () => void;
    submitForm: () => Promise<boolean>;
}
declare function useSmartForm(schema: SmartFormSchema): UseSmartFormResult;
declare const SmartForm: any;
declare const SmartFormPlugin: any;

declare const _default: {
    useSmartForm: typeof useSmartForm;
    SmartForm: any;
    SmartFormPlugin: any;
};

export { SmartForm, type SmartFormData, type SmartFormErrors, SmartFormPlugin, type SmartFormSchema, type UseSmartFormResult, _default as default, useSmartForm };
