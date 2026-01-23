# 🤖 AI Chatbot Guide - Natural Language Q&A for Tabular Data

## Overview

The Tabular Intelligence package includes a powerful **AI Chatbot** that allows users to ask questions about their data in plain English and get intelligent answers powered by OpenAI GPT or Anthropic Claude.

## Features

✅ **Natural Language Questions** - Ask questions in plain English  
✅ **Intelligent Answers** - AI analyzes your data and provides detailed responses  
✅ **Context-Aware** - Understands your data schema and statistics  
✅ **Multiple AI Providers** - Support for OpenAI and Anthropic  
✅ **Chat History** - Keeps track of all questions and answers  
✅ **Export Capability** - Export chat sessions for documentation  
✅ **Dynamic Sample Questions** - Suggests relevant questions based on your data  

---

## Quick Start

### 1. Configure AI Provider

```typescript
import { useTabularIntelligence } from '@aivue/tabular-intelligence';

const intelligence = useTabularIntelligence({
  provider: 'local',
  qaConfig: {
    provider: 'openai',  // or 'anthropic'
    apiKey: 'your-api-key',
    model: 'gpt-4-turbo-preview'  // optional
  }
});
```

### 2. Load Your Data

```typescript
// From Custom API
await fetchDataFromAPI();

// Or load sample data
intelligence.value.loadData(yourData);
```

### 3. Ask Questions

```typescript
// Ask a question
const answer = await intelligence.value.askQuestion('What is the average revenue?');

console.log(answer.text);
console.log(answer.confidence);
```

---

## Using with Custom API Data

### Step 1: Configure Custom TFM API

```typescript
const config = {
  provider: 'custom',
  baseUrl: 'https://api.example.com/data',
  apiKey: 'your-api-key'
};
```

### Step 2: Configure API Key Location

Choose how to send the API key:

**Option A: Query Parameter**
```typescript
apiKeyLocation: 'query',
apiKeyQueryParam: 'api_key'
// Result: https://api.example.com/data?api_key=your-key
```

**Option B: Header**
```typescript
apiKeyLocation: 'header',
apiKeyHeaderName: 'Authorization',
apiKeyHeaderFormat: 'bearer'
// Result: Headers: { "Authorization": "Bearer your-key" }
```

### Step 3: Fetch Data from API

```typescript
const response = await fetch(dataEndpoint);
const data = await response.json();
intelligence.value.loadData(data);
```

### Step 4: Enable Q&A

```typescript
const qaConfig = {
  provider: 'openai',
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: 'gpt-4-turbo-preview'
};
```

### Step 5: Ask Questions!

```typescript
// The chatbot will analyze your API data
await intelligence.value.askQuestion('What are the top 5 items by revenue?');
await intelligence.value.askQuestion('Show me any anomalies in the data');
await intelligence.value.askQuestion('What trends do you see?');
```

---

## Example Questions

### General Questions
- "What is the average value in this dataset?"
- "How many rows are in the data?"
- "What columns are available?"

### Statistical Questions
- "What is the median revenue?"
- "Show me the distribution of ages"
- "What is the standard deviation?"

### Analytical Questions
- "What are the top 5 highest values?"
- "Are there any outliers or anomalies?"
- "What trends can you identify?"
- "What is the correlation between X and Y?"

### Business Questions
- "What is the total revenue?"
- "Which product has the highest sales?"
- "What is the average customer age?"
- "Show me the top performing regions"

---

## AI Provider Configuration

### OpenAI (GPT)

```typescript
qaConfig: {
  provider: 'openai',
  apiKey: 'sk-...',
  model: 'gpt-4-turbo-preview',  // or 'gpt-4', 'gpt-3.5-turbo'
  maxTokens: 1000,
  temperature: 0.3
}
```

**Get API Key:** https://platform.openai.com/api-keys

### Anthropic (Claude)

```typescript
qaConfig: {
  provider: 'anthropic',
  apiKey: 'sk-ant-...',
  model: 'claude-3-5-sonnet-20241022',
  maxTokens: 1000,
  temperature: 0.3
}
```

**Get API Key:** https://console.anthropic.com/

---

## Chat History

### Access Question History

```typescript
const questions = intelligence.value.questionHistory.value;
const answers = intelligence.value.answerHistory.value;

console.log(`Asked ${questions.length} questions`);
```

### Clear History

```typescript
intelligence.value.clearHistory();
```

### Export Chat

```typescript
function exportChat() {
  const questions = intelligence.value.questionHistory.value;
  const answers = intelligence.value.answerHistory.value;

  let exportText = '# Q&A Session\n\n';
  for (let i = 0; i < questions.length; i++) {
    exportText += `**Q:** ${questions[i].text}\n`;
    exportText += `**A:** ${answers[i].text}\n\n`;
  }

  // Download as file
  const blob = new Blob([exportText], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'qa-session.md';
  a.click();
}
```

---

## Best Practices

1. **Load Data First** - Always load data before asking questions
2. **Be Specific** - More specific questions get better answers
3. **Check Confidence** - Review the confidence score in answers
4. **Use Context** - The AI understands your data schema and statistics
5. **Export Sessions** - Save important Q&A sessions for documentation

---

## Troubleshooting

### "No data available" Error
- Make sure data is loaded before asking questions
- Check that `tableData.length > 0`

### "Q&A is not enabled" Error
- Provide an API key in the Q&A configuration
- Ensure `qaEnabled.value === true`

### Low Confidence Answers
- Try rephrasing the question
- Make sure the question is answerable from the data
- Check if the data contains the information needed

---

## Complete Example

```vue
<script setup>
import { ref } from 'vue';
import { useTabularIntelligence } from '@aivue/tabular-intelligence';

const intelligence = useTabularIntelligence({
  provider: 'custom',
  baseUrl: 'https://api.example.com/data',
  qaConfig: {
    provider: 'openai',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY
  }
});

async function fetchAndAsk() {
  // 1. Fetch data from API
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  
  // 2. Load data
  intelligence.value.loadData(data);
  
  // 3. Ask questions
  const answer1 = await intelligence.value.askQuestion('What is the average revenue?');
  console.log(answer1.text);
  
  const answer2 = await intelligence.value.askQuestion('Show me the top 5 products');
  console.log(answer2.text);
}
</script>
```

---

## Next Steps

- Try the [Live Demo](http://localhost:8080/tabular-intelligence)
- Read the [API Documentation](./README.md)
- Check out [TFM Providers Guide](./TFM_PROVIDERS.md)

