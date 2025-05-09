// Core package implementation
export class AIClient {
  constructor(options) {
    this.options = options || {};
    this.provider = options.provider || 'fallback';
    this.apiKey = options.apiKey || '';
    this.modelOptions = options.options || {
      model: 'gpt-3.5-turbo',
      temperature: 0.7
    };

    console.log(`AI Client initialized with provider: ${this.provider}`);
  }

  async chat(messages) {
    try {
      // Use fallback if provider is set to fallback or no API key is provided
      if (this.provider === 'fallback' || !this.apiKey) {
        console.log('Using fallback response generator');
        return this._generateFallbackResponse(messages);
      }

      // Handle OpenAI provider
      if (this.provider === 'openai') {
        console.log(`Using OpenAI with model: ${this.modelOptions.model}`);
        return await this._callOpenAI(messages);
      }

      // Handle Anthropic provider
      if (this.provider === 'anthropic') {
        console.log(`Using Anthropic with model: ${this.modelOptions.model || 'claude-3-opus'}`);
        return await this._callAnthropic(messages);
      }

      // Handle Google AI (Gemini) provider
      if (this.provider === 'gemini' || this.provider === 'google') {
        console.log(`Using Google AI (Gemini) with model: ${this.modelOptions.model || 'gemini-pro'}`);
        return await this._callGemini(messages);
      }

      // Handle Azure OpenAI provider
      if (this.provider === 'azure') {
        console.log(`Using Azure OpenAI with model: ${this.modelOptions.model}`);
        return await this._callAzureOpenAI(messages);
      }

      // For other providers, use fallback for now
      console.log(`Provider ${this.provider} not implemented, using fallback`);
      return this._generateFallbackResponse(messages);
    } catch (error) {
      console.error('Error in AI chat:', error);
      return {
        role: 'assistant',
        content: `I'm sorry, I encountered an error processing your request: ${error.message || 'Unknown error'}. Please try again later.`
      };
    }
  }

  // Call OpenAI API
  async _callOpenAI(messages) {
    try {
      console.log('Calling OpenAI API with messages:', messages);

      // Format messages for OpenAI
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Check if the API key is a project key (starts with 'sk-proj-')
      const isProjectKey = this.apiKey.startsWith('sk-proj-');

      // Set the appropriate API endpoint and headers
      let apiEndpoint = 'https://api.openai.com/v1/chat/completions';
      let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      };

      // If using a project key, add the OpenAI-Beta header
      if (isProjectKey) {
        headers['OpenAI-Beta'] = 'project-api=v1';
      }

      console.log('Using API endpoint:', apiEndpoint);
      console.log('Using headers:', { ...headers, 'Authorization': 'Bearer sk-***' });

      // Make API request
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          model: this.modelOptions.model || 'gpt-3.5-turbo',
          messages: formattedMessages,
          temperature: this.modelOptions.temperature || 0.7,
          max_tokens: this.modelOptions.maxTokens || 1000
        })
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error response:', errorData);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      // Parse response
      const data = await response.json();
      console.log('OpenAI response:', data);

      // Return the assistant's message
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return {
          role: 'assistant',
          content: data.choices[0].message.content
        };
      } else {
        console.error('Invalid response format from OpenAI:', data);
        throw new Error('Invalid response format from OpenAI');
      }
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      // Return a fallback response instead of throwing
      return {
        role: 'assistant',
        content: `I encountered an error while processing your request: ${error.message}. Please try again or check your API configuration.`
      };
    }
  }

  // Call Anthropic API
  async _callAnthropic(messages) {
    try {
      console.log('Calling Anthropic API with messages:', messages);

      // Format messages for Anthropic
      // Anthropic uses a different format than OpenAI
      const systemMessage = messages.find(msg => msg.role === 'system');
      const userMessages = messages.filter(msg => msg.role !== 'system');

      // Create the messages array in Anthropic format
      const formattedMessages = userMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));

      // Make API request
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.modelOptions.model || 'claude-3-opus-20240229',
          messages: formattedMessages,
          system: systemMessage ? systemMessage.content : undefined,
          temperature: this.modelOptions.temperature || 0.7,
          max_tokens: this.modelOptions.maxTokens || 1000
        })
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Anthropic API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      // Parse response
      const data = await response.json();
      console.log('Anthropic response:', data);

      // Return the assistant's message
      if (data.content && data.content.length > 0) {
        return {
          role: 'assistant',
          content: data.content[0].text
        };
      } else {
        throw new Error('Invalid response format from Anthropic');
      }
    } catch (error) {
      console.error('Error calling Anthropic:', error);
      throw error;
    }
  }

  // Call Google AI (Gemini) API
  async _callGemini(messages) {
    try {
      console.log('Calling Google AI (Gemini) API with messages:', messages);

      // Format messages for Gemini
      const formattedMessages = messages.map(msg => ({
        role: msg.role === 'system' ? 'user' : msg.role, // Gemini doesn't have system role
        parts: [{ text: msg.content }]
      }));

      // Make API request
      const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelOptions.model || 'gemini-pro'}:generateContent`;
      const response = await fetch(`${apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: formattedMessages,
          generationConfig: {
            temperature: this.modelOptions.temperature || 0.7,
            maxOutputTokens: this.modelOptions.maxTokens || 1000
          }
        })
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Google AI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      // Parse response
      const data = await response.json();
      console.log('Google AI response:', data);

      // Return the assistant's message
      if (data.candidates && data.candidates.length > 0 &&
          data.candidates[0].content &&
          data.candidates[0].content.parts &&
          data.candidates[0].content.parts.length > 0) {
        return {
          role: 'assistant',
          content: data.candidates[0].content.parts[0].text
        };
      } else {
        throw new Error('Invalid response format from Google AI');
      }
    } catch (error) {
      console.error('Error calling Google AI:', error);
      throw error;
    }
  }

  // Call Azure OpenAI API
  async _callAzureOpenAI(messages) {
    try {
      console.log('Calling Azure OpenAI API with messages:', messages);

      // Format messages for Azure OpenAI
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Azure OpenAI requires additional configuration
      const endpoint = this.modelOptions.endpoint || '';
      const deploymentName = this.modelOptions.deploymentName || '';
      const apiVersion = this.modelOptions.apiVersion || '2023-05-15';

      if (!endpoint || !deploymentName) {
        throw new Error('Azure OpenAI requires endpoint and deploymentName in options');
      }

      // Make API request
      const response = await fetch(`${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify({
          messages: formattedMessages,
          temperature: this.modelOptions.temperature || 0.7,
          max_tokens: this.modelOptions.maxTokens || 1000
        })
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Azure OpenAI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      // Parse response
      const data = await response.json();
      console.log('Azure OpenAI response:', data);

      // Return the assistant's message
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return {
          role: 'assistant',
          content: data.choices[0].message.content
        };
      } else {
        throw new Error('Invalid response format from Azure OpenAI');
      }
    } catch (error) {
      console.error('Error calling Azure OpenAI:', error);
      throw error;
    }
  }

  // Generate a more intelligent fallback response based on the user's message
  _generateFallbackResponse(messages) {
    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();

    if (!lastUserMessage) {
      return {
        role: 'assistant',
        content: "Hello! How can I help you today?"
      };
    }

    const userMessage = lastUserMessage.content.toLowerCase();

    // Check for greetings
    if (userMessage.match(/^(hi|hello|hey|greetings).*/)) {
      return {
        role: 'assistant',
        content: "Hello there! How can I assist you today? I'm a simulated AI assistant for demonstration purposes."
      };
    }

    // Check for questions about the assistant
    if (userMessage.includes("who are you") || userMessage.includes("what are you")) {
      return {
        role: 'assistant',
        content: "I'm a simulated AI assistant created for the AIVue demo. In a real implementation, I would connect to an AI provider like OpenAI, Anthropic, or others."
      };
    }

    // Check for questions about capabilities
    if (userMessage.includes("what can you do") || userMessage.includes("help me")) {
      return {
        role: 'assistant',
        content: "I can simulate conversations for this demo. In a real implementation, I could help with answering questions, providing information, generating content, and more. This demo shows how the AIVue components work with AI providers."
      };
    }

    // Check for thank you messages
    if (userMessage.match(/.*(thanks|thank you).*/)) {
      return {
        role: 'assistant',
        content: "You're welcome! If you have any more questions about the AIVue components, feel free to ask."
      };
    }

    // Default response with some variety
    const defaultResponses = [
      `I understand you're asking about "${lastUserMessage.content}". This is a simulated response for demonstration purposes. In a real implementation, this would connect to an AI provider.`,
      `Thanks for your message about "${lastUserMessage.content}". I'm a simulated AI assistant for this demo. With a real API key, I would provide more helpful responses.`,
      `I see you're interested in "${lastUserMessage.content}". This demo shows how the AIVue components work. To get real AI responses, you would need to configure an AI provider with an API key.`,
      `Your question about "${lastUserMessage.content}" is interesting. In a production environment with a configured AI provider, you would receive a more helpful and accurate response.`
    ];

    const randomIndex = Math.floor(Math.random() * defaultResponses.length);
    return {
      role: 'assistant',
      content: defaultResponses[randomIndex]
    };
  }
}

export function initializeAI(options = {}) {
  console.log('AI initialized with options:', options);

  // Set global configuration if needed
  window.__AIVUE_CONFIG__ = {
    debug: options.debug || false,
    ...options
  };

  if (options.debug) {
    console.log('AIVue debug mode enabled');
  }
}
