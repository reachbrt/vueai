import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export type AIProvider = 
  | 'openai' 
  | 'claude' 
  | 'gemini' 
  | 'huggingface' 
  | 'ollama' 
  | 'deepseek';

interface ProviderOption {
  value: AIProvider;
  label: string;
  description: string;
}

const providerOptions: ProviderOption[] = [
  {
    value: 'openai',
    label: 'OpenAI',
    description: 'GPT-4o and other OpenAI models'
  },
  {
    value: 'claude',
    label: 'Claude',
    description: 'Anthropic\'s Claude models'
  },
  {
    value: 'gemini',
    label: 'Gemini',
    description: 'Google\'s Gemini models'
  },
  {
    value: 'huggingface',
    label: 'HuggingFace',
    description: 'Open source models from HuggingFace Hub'
  },
  {
    value: 'ollama',
    label: 'Ollama',
    description: 'Run models locally with Ollama'
  },
  {
    value: 'deepseek',
    label: 'DeepSeek',
    description: 'DeepSeek\'s powerful LLMs'
  }
];

interface ProviderSelectorProps {
  value: AIProvider;
  onChange: (provider: AIProvider) => void;
  label?: string;
  className?: string;
}

export default function ProviderSelector({ 
  value, 
  onChange, 
  label = 'AI Provider',
  className = ''
}: ProviderSelectorProps) {
  return (
    <div className={className}>
      {label && <Label className="mb-2 block">{label}</Label>}
      <Select
        value={value}
        onValueChange={(value) => onChange(value as AIProvider)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select AI provider" />
        </SelectTrigger>
        <SelectContent>
          {providerOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="flex flex-col items-start py-2"
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-muted-foreground">{option.description}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        {!value.includes('ollama') 
          ? 'API key required. Missing keys will use simulated responses.' 
          : 'Requires local Ollama installation. No API key needed.'}
      </p>
    </div>
  );
}