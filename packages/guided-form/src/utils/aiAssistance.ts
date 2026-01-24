/**
 * @aivue/guided-form - AI Assistance Utilities
 * Provides AI-powered hints, rewrites, examples, and validation
 */

import type {
  AIConfig,
  AIAssistanceRequest,
  AIAssistanceResponse,
} from '../types';

export class AIAssistanceProvider {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  public async getAssistance(request: AIAssistanceRequest): Promise<AIAssistanceResponse> {
    if (!this.config.enabled) {
      return {
        success: false,
        hints: [],
        error: 'AI assistance is not enabled',
      };
    }

    try {
      switch (request.type) {
        case 'explain':
          return await this.explainQuestion(request);
        case 'rewrite':
          return await this.rewriteSimpler(request);
        case 'example':
          return await this.suggestExample(request);
        case 'validate':
          return await this.validateInput(request);
        default:
          return {
            success: false,
            hints: [],
            error: 'Unknown assistance type',
          };
      }
    } catch (error) {
      return {
        success: false,
        hints: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async explainQuestion(request: AIAssistanceRequest): Promise<AIAssistanceResponse> {
    const prompt = `Explain this form question in simple terms: "${request.question}"
    
Provide a brief, friendly explanation that helps the user understand what information is being asked for.`;

    const response = await this.callAI(prompt);

    return {
      success: true,
      hints: [
        {
          type: 'explanation',
          content: response,
          confidence: 0.9,
        },
      ],
    };
  }

  private async rewriteSimpler(request: AIAssistanceRequest): Promise<AIAssistanceResponse> {
    const prompt = `Rewrite this form question in simpler, more friendly language: "${request.question}"
    
Make it conversational and easy to understand while keeping the same meaning.`;

    const response = await this.callAI(prompt);

    return {
      success: true,
      hints: [
        {
          type: 'rewrite',
          content: response,
          confidence: 0.85,
        },
      ],
    };
  }

  private async suggestExample(request: AIAssistanceRequest): Promise<AIAssistanceResponse> {
    const prompt = `For this form question: "${request.question}"
    
Provide 2-3 example answers that would be appropriate. Format as a simple list.`;

    const response = await this.callAI(prompt);

    return {
      success: true,
      hints: [
        {
          type: 'example',
          content: response,
          confidence: 0.8,
        },
      ],
    };
  }

  private async validateInput(request: AIAssistanceRequest): Promise<AIAssistanceResponse> {
    if (!request.userInput) {
      return {
        success: false,
        hints: [],
        error: 'No user input provided',
      };
    }

    const prompt = `Question: "${request.question}"
User's answer: "${request.userInput}"

Is this answer appropriate and complete? If not, provide helpful feedback on how to improve it.`;

    const response = await this.callAI(prompt);

    return {
      success: true,
      hints: [
        {
          type: 'validation',
          content: response,
          confidence: 0.75,
        },
      ],
    };
  }

  private async callAI(prompt: string): Promise<string> {
    const provider = this.config.provider || 'openai';

    if (provider === 'openai') {
      return this.callOpenAI(prompt);
    } else if (provider === 'anthropic') {
      return this.callAnthropic(prompt);
    } else if (provider === 'custom' && this.config.customEndpoint) {
      return this.callCustom(prompt);
    }

    throw new Error('No valid AI provider configured');
  }

  private async callOpenAI(prompt: string): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not provided');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that helps users fill out forms. Provide clear, concise, and friendly responses.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated';
  }

  private async callAnthropic(prompt: string): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('Anthropic API key not provided');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-haiku-20240307',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0]?.text || 'No response generated';
  }

  private async callCustom(prompt: string): Promise<string> {
    if (!this.config.customEndpoint) {
      throw new Error('Custom endpoint not provided');
    }

    const response = await fetch(this.config.customEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {}),
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response || data.text || data.content || 'No response generated';
  }
}

// Helper function to create AI assistance provider
export function createAIAssistance(config: AIConfig): AIAssistanceProvider {
  return new AIAssistanceProvider(config);
}
