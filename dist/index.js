// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var storage = {
  // User management
  async getUserByUsername(username) {
    console.log(`Looking up user: ${username}`);
    return null;
  },
  async insertUser(user) {
    console.log(`Creating user: ${user.username}`);
    return { id: 1, username: user.username, password: user.password };
  },
  // AI Providers
  async getProviders() {
    return [
      {
        id: "openai",
        name: "OpenAI",
        baseUrl: "https://api.openai.com/v1",
        models: ["gpt-4o", "gpt-3.5-turbo"],
        description: "OpenAI API provider for GPT models"
      },
      {
        id: "claude",
        name: "Anthropic Claude",
        baseUrl: "https://api.anthropic.com/v1",
        models: ["claude-3-7-sonnet-20250219", "claude-3-haiku"],
        description: "Anthropic API provider for Claude models"
      },
      {
        id: "gemini",
        name: "Google Gemini",
        baseUrl: "https://generativelanguage.googleapis.com/v1",
        models: ["gemini-1.5-pro", "gemini-1.5-flash"],
        description: "Google's Gemini models for multi-modal AI"
      },
      {
        id: "huggingface",
        name: "HuggingFace",
        baseUrl: "https://api-inference.huggingface.co/models",
        models: ["mistralai/Mistral-7B-Instruct-v0.2", "meta-llama/Llama-2-13b-chat-hf"],
        description: "Open source models from HuggingFace Hub"
      },
      {
        id: "ollama",
        name: "Ollama",
        baseUrl: "http://localhost:11434/api",
        models: ["llama3", "mistral", "vicuna"],
        description: "Run AI models locally with Ollama"
      },
      {
        id: "deepseek",
        name: "DeepSeek",
        baseUrl: "https://api.deepseek.com/v1",
        models: ["deepseek-chat", "deepseek-coder"],
        description: "Powerful models for technical and coding applications"
      }
    ];
  },
  // AI Chat
  async processChat(messages, provider = "openai", model) {
    console.log(`Processing chat with ${provider}${model ? `/${model}` : ""}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const lastMessage = messages.filter((m) => m.role === "user").pop();
    if (!lastMessage) {
      return {
        role: "assistant",
        content: "I don't see a message to respond to."
      };
    }
    const userMessage = lastMessage.content.toLowerCase();
    let response = "";
    if (userMessage.includes("chatbot")) {
      response = "The @vueai/chatbot package provides a Vue.js component for creating AI-powered chat interfaces. It supports multiple AI providers like OpenAI, Claude, Gemini, HuggingFace, Ollama, and DeepSeek. It manages conversation history and offers features like streaming responses and file attachment handling.";
    } else if (userMessage.includes("autosuggest")) {
      response = "The @vueai/autosuggest package offers semantic search capabilities with AI-powered suggestions. You can configure it to work with different AI providers, provide domain-specific context, and handle multi-source suggestions.";
    } else if (userMessage.includes("smartform")) {
      response = "The @vueai/smartform package provides AI-powered form validation, self-healing inputs, and dynamic field generation. It helps users submit cleaner data by suggesting corrections when errors are detected.";
    } else if (userMessage.includes("provider")) {
      response = "The VueAI components support a wide range of AI providers. For example:\n\n```javascript\nregisterProviders({\n  openai: {\n    apiKey: import.meta.env.VITE_OPENAI_API_KEY,\n    defaultModel: 'gpt-4o'\n  },\n  claude: {\n    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,\n    defaultModel: 'claude-3-7-sonnet-20250219'\n  },\n  gemini: {\n    apiKey: import.meta.env.VITE_GEMINI_API_KEY,\n    defaultModel: 'gemini-1.5-pro'\n  },\n  huggingface: {\n    apiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY,\n    defaultModel: 'mistralai/Mistral-7B-Instruct-v0.2'\n  },\n  ollama: {\n    baseUrl: 'http://localhost:11434/api',\n    defaultModel: 'llama3'\n  },\n  deepseek: {\n    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,\n    defaultModel: 'deepseek-chat'\n  }\n});\n```";
    } else if (userMessage.includes("gemini")) {
      response = "Google's Gemini models are now supported in all VueAI components. Gemini offers excellent multi-modal capabilities, understanding both text and images. Configure it with your Gemini API key and the model of your choice.";
    } else if (userMessage.includes("huggingface")) {
      response = "HuggingFace integration gives you access to thousands of open-source models through the VueAI components. This is great for specialized use cases or when you want more control over the models you're using.";
    } else if (userMessage.includes("ollama")) {
      response = "Ollama support allows you to run AI models locally and integrate them with VueAI components. This gives you complete privacy as all processing happens on your machine, with no data sent to external APIs.";
    } else if (userMessage.includes("deepseek")) {
      response = "DeepSeek models are optimized for technical and coding tasks. They work particularly well for code generation, technical documentation, and specialized technical domains.";
    } else {
      response = "I'm here to help with information about the VueAI component suite. You can ask me about @vueai/chatbot, @vueai/autosuggest, @vueai/smartform, or the different AI providers we support (OpenAI, Claude, Gemini, HuggingFace, Ollama, DeepSeek).";
    }
    return {
      role: "assistant",
      content: response
    };
  },
  // AI Suggestions
  async getSuggestions(query, context, provider = "openai", model, count = 5) {
    console.log(`Generating suggestions for "${query}" with ${provider}${model ? `/${model}` : ""}`);
    await new Promise((resolve) => setTimeout(resolve, 700));
    const suggestions = [];
    if (query.includes("vue")) {
      suggestions.push(
        { text: "vue ai component library", score: 92 },
        { text: "vue chatbot integration", score: 88 },
        { text: "vue.js with openai api", score: 85 },
        { text: "vue 3 composition api with ai", score: 82 },
        { text: "vue ai form validation", score: 78 }
      );
    } else if (query.includes("ai")) {
      suggestions.push(
        { text: "ai powered vue components", score: 95 },
        { text: "ai chatbot for vue", score: 90 },
        { text: "ai form validation vue", score: 87 },
        { text: "ai suggestion engine vue", score: 84 },
        { text: "ai api integration vue 3", score: 80 }
      );
    } else if (query.includes("chatbot")) {
      suggestions.push(
        { text: "chatbot component for vue", score: 94 },
        { text: "vue.js chatbot with openai", score: 91 },
        { text: "chatbot streaming responses vue", score: 87 },
        { text: "chatbot with file upload vue", score: 83 },
        { text: "building vue chatbot application", score: 79 }
      );
    } else {
      suggestions.push(
        { text: `${query} with vue.js`, score: 95 },
        { text: `${query} ai integration`, score: 88 },
        { text: `${query} component for vue`, score: 84 },
        { text: `${query} api usage vue`, score: 78 },
        { text: `${query} implementation examples`, score: 75 }
      );
    }
    if (context) {
      const contextLower = context.toLowerCase();
      return suggestions.filter((s) => s.text.toLowerCase().includes(contextLower)).slice(0, count);
    }
    return suggestions.slice(0, count);
  },
  // Form Validation
  async validateField(field, value, rules) {
    console.log(`Validating field "${field}" with value "${value}"`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (field === "email") {
      if (!value) {
        return {
          isValid: false,
          errorMessage: "Email is required"
        };
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return {
          isValid: false,
          errorMessage: "Please enter a valid email address",
          suggestion: value.includes("@") ? value.replace(/\s+/g, "").toLowerCase() : `${value.replace(/\s+/g, "")}@example.com`
        };
      }
    } else if (field === "name") {
      if (!value) {
        return {
          isValid: false,
          errorMessage: "Name is required"
        };
      }
      if (value.length < 2) {
        return {
          isValid: false,
          errorMessage: "Name must be at least 2 characters long"
        };
      }
    } else if (field === "bio") {
      if (value && value.length > 500) {
        return {
          isValid: false,
          errorMessage: "Bio must not exceed 500 characters",
          suggestion: value.substring(0, 500)
        };
      }
    }
    return { isValid: true };
  },
  // Packages info
  async getPackages() {
    return [
      {
        id: "chatbot",
        name: "@vueai/chatbot",
        version: "1.0.0-beta",
        description: "AI-powered chat components for Vue.js",
        stars: 286,
        status: "beta"
      },
      {
        id: "autosuggest",
        name: "@vueai/autosuggest",
        version: "1.0.0-beta",
        description: "AI-powered suggestion components for Vue.js",
        stars: 243,
        status: "beta"
      },
      {
        id: "smartform",
        name: "@vueai/smartform",
        version: "1.0.0-beta",
        description: "AI-powered form validation for Vue.js",
        stars: 215,
        status: "beta"
      },
      {
        id: "core",
        name: "@vueai/core",
        version: "1.0.0-beta",
        description: "Core AI functionality for Vue.js components",
        stars: 312,
        status: "beta"
      }
    ];
  }
};

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/providers", async (req, res) => {
    try {
      const providers = await storage.getProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  });
  app2.post("/api/chat", async (req, res) => {
    try {
      const { messages, provider, model } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ message: "Invalid messages format" });
      }
      const response = await storage.processChat(messages, provider, model);
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Chat processing failed", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/suggest", async (req, res) => {
    try {
      const { query, context, provider, model, count } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Query is required" });
      }
      const suggestions = await storage.getSuggestions(
        query,
        typeof context === "string" ? context : void 0,
        typeof provider === "string" ? provider : "openai",
        typeof model === "string" ? model : void 0,
        typeof count === "string" ? parseInt(count) : 5
      );
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate suggestions", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.post("/api/validate", async (req, res) => {
    try {
      const { field, value, rules } = req.body;
      if (!field || value === void 0 || !rules) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      const validationResult = await storage.validateField(field, value, rules);
      res.json(validationResult);
    } catch (error) {
      res.status(500).json({ message: "Validation failed", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@db": path.resolve(import.meta.dirname, "db"),
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  let port = parseInt(process.env.PORT || "5000", 10);
  const maxPortAttempts = 10;
  let attempts = 0;
  function startServer(currentPort) {
    server.listen({
      port: currentPort,
      host: "0.0.0.0",
      reusePort: true
    }, () => {
      log(`serving on port ${currentPort}`);
    }).on("error", (err) => {
      if (err.code === "EADDRINUSE" && attempts < maxPortAttempts) {
        attempts++;
        const newPort = port + attempts;
        log(`Port ${currentPort} is in use, trying ${newPort}...`);
        startServer(newPort);
      } else {
        log(`Failed to start server: ${err.message}`);
      }
    });
  }
  startServer(port);
})();
