# Using AI Providers with AIVue Components

This guide explains how to use various AI providers with the AIVue components.

## Supported AI Providers

AIVue supports the following AI providers:

1. OpenAI (ChatGPT)
2. Anthropic (Claude)
3. Google AI (Gemini)
4. Azure OpenAI

## Quick Start with OpenAI

To use OpenAI with the AIVue components, simply update the AI client configuration in your application:

```javascript
import { AIClient } from '@aivue/core';

// Create an AI client with OpenAI
const aiClient = new AIClient({
  provider: 'openai',
  apiKey: 'your-openai-api-key', // Replace with your actual API key
  options: {
    model: 'gpt-4', // or 'gpt-3.5-turbo' for a more economical option
    temperature: 0.7,
    maxTokens: 1000
  }
});
```

## Using Anthropic (Claude)

```javascript
import { AIClient } from '@aivue/core';

// Create an AI client with Anthropic
const aiClient = new AIClient({
  provider: 'anthropic',
  apiKey: 'your-anthropic-api-key', // Replace with your actual API key
  options: {
    model: 'claude-3-opus-20240229', // or 'claude-3-sonnet-20240229' for a more economical option
    temperature: 0.7,
    maxTokens: 1000
  }
});
```

## Using Google AI (Gemini)

```javascript
import { AIClient } from '@aivue/core';

// Create an AI client with Google AI
const aiClient = new AIClient({
  provider: 'gemini', // or 'google'
  apiKey: 'your-google-ai-api-key', // Replace with your actual API key
  options: {
    model: 'gemini-pro', // or 'gemini-ultra' for more capabilities
    temperature: 0.7,
    maxTokens: 1000
  }
});
```

## Using Azure OpenAI

```javascript
import { AIClient } from '@aivue/core';

// Create an AI client with Azure OpenAI
const aiClient = new AIClient({
  provider: 'azure',
  apiKey: 'your-azure-api-key', // Replace with your actual API key
  options: {
    endpoint: 'https://your-resource-name.openai.azure.com', // Your Azure OpenAI endpoint
    deploymentName: 'your-deployment-name', // Your model deployment name
    apiVersion: '2023-05-15', // API version
    temperature: 0.7,
    maxTokens: 1000
  }
});
```

## Demo Integration

To update the demo to use an AI provider:

1. Open `demo/src/ai-client.ts`
2. Update the configuration to use your preferred provider
3. Add your API key

Example with OpenAI:

```javascript
import { AIClient } from '@aivue/core';

export const aiClient = new AIClient({
  provider: 'openai',
  apiKey: 'your-api-key', // Replace with your actual API key
  options: {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000
  }
});
```

## API Key Security

**Important:** Never hardcode your API key in client-side code in a production environment. Instead:

1. Use environment variables
2. Use a backend proxy to make API calls
3. Use a service like Auth0 or similar to manage API keys securely

For the demo, it's acceptable to use the API key directly, but for production applications, always use a secure method.

## Available Models

### OpenAI Models
- `gpt-4` - Most capable model, but more expensive
- `gpt-4-turbo` - Faster version of GPT-4
- `gpt-3.5-turbo` - Good balance of capability and cost

### Anthropic Models
- `claude-3-opus-20240229` - Most capable Claude model
- `claude-3-sonnet-20240229` - Good balance of capability and cost
- `claude-3-haiku-20240307` - Fastest and most economical Claude model

### Google AI (Gemini) Models
- `gemini-pro` - Standard model for most use cases
- `gemini-ultra` - Most capable Gemini model

### Azure OpenAI Models
- Depends on your Azure OpenAI deployments

## Configuration Options

The AI client supports the following common options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| model | string | Varies by provider | The AI model to use |
| temperature | number | 0.7 | Controls randomness (0-1) |
| maxTokens | number | 1000 | Maximum tokens in the response |

Provider-specific options:

### Azure OpenAI
- `endpoint` - Your Azure OpenAI endpoint URL
- `deploymentName` - Your model deployment name
- `apiVersion` - API version (default: '2023-05-15')

## Troubleshooting

If you encounter issues with the AI integration:

1. Check that your API key is valid and has sufficient credits
2. Verify that you're using a supported model
3. Check the browser console for error messages
4. Ensure your network allows connections to the AI provider's API

## Next Steps

After integrating an AI provider, you can:

1. Customize the system prompt for different use cases
2. Implement streaming responses for a better user experience
3. Add rate limiting to control API usage
4. Implement caching for common queries

For more information, see the documentation for your chosen AI provider:
- [OpenAI API documentation](https://platform.openai.com/docs/api-reference)
- [Anthropic API documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [Google AI (Gemini) API documentation](https://ai.google.dev/docs)
- [Azure OpenAI documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
