# Vue AI Components Demo

A demonstration of the @aivue packages for Vue.js, showcasing AI-powered components including:

- **AI Chatbot**: Conversational AI interface with multiple themes and customization options
- **AI Autosuggest**: Smart input suggestions powered by AI
- **AI Smart Form**: Form validation and enhancement with AI

## Live Demo

Check out the live demo at [https://aivue-demo.netlify.app/](https://aivue-demo.netlify.app/)

## Running the Demo

You can run the demo in several ways:

### From the root directory:

```bash
# Using npm script
npm run demo

# Or using the shell script directly
./run-demo.sh
```

### From the demo directory:

```bash
cd demo

# Using npm script
npm run dev

# Or using npm start
npm start

# Or using Vite directly
npx vite --host localhost --port 8080
```

The demo will be available at http://localhost:8080

## Environment Variables

This demo uses environment variables to securely store API keys. Create a `.env` file in the root directory with the following variables:

```
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

You can also enter your API key directly in the demo interface if you don't want to use environment variables.

## Features

- Multiple themes for the chatbot (Modern, Dark, Soft, Vibrant, Corporate)
- Fullscreen mode (press F key)
- Toggle functionality for the chatbot
- API key configuration for OpenAI
- Responsive design for all screen sizes

## Project Setup

```sh
# Install dependencies
npm install

# Create .env file with your API key
cp .env.example .env
# Edit .env with your OpenAI API key
```

## Packages Used

- @aivue/chatbot: ^1.4.5
- @aivue/core: ^1.2.7
- @aivue/autosuggest: ^1.2.8
- @aivue/smartform: ^1.2.8
- Vue.js: ^3.5.13

## CSS Integration

The @aivue/chatbot package now includes CSS automatically. You can import it in two ways:

### Method 1: Automatic CSS Inclusion (Recommended)

The CSS is automatically included when you import the components:

```js
import { AiChatWindow, AiChatToggle } from '@aivue/chatbot';
```

### Method 2: Explicit CSS Import

If you need to import the CSS separately:

```js
// In your main.js or main.ts file
import '@aivue/chatbot/style.css';
```

This is the recommended way to import the CSS, as it uses the exports field in the package.json to correctly resolve the CSS file path.

## Deployment

When deploying to Netlify or other platforms, make sure to set the environment variables in your deployment settings.
