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
declare const SmartForm: {
    name: string;
};
declare const _default: {
    useSmartForm: typeof useSmartForm;
    SmartForm: {
        name: string;
    };
};

export { SmartForm, type SmartFormData, type SmartFormErrors, type SmartFormSchema, type UseSmartFormResult, _default as default, useSmartForm };
