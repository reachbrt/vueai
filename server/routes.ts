import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for getting AI providers information
  app.get("/api/providers", async (req, res) => {
    try {
      const providers = await storage.getProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  });

  // API endpoint for AI chat completion
  app.post("/api/chat", async (req, res) => {
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

  // API endpoint for AI suggestions
  app.get("/api/suggest", async (req, res) => {
    try {
      const { query, context, provider, model, count } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query is required" });
      }
      
      const suggestions = await storage.getSuggestions(
        query, 
        typeof context === 'string' ? context : undefined,
        typeof provider === 'string' ? provider : 'openai',
        typeof model === 'string' ? model : undefined,
        typeof count === 'string' ? parseInt(count) : 5
      );
      
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate suggestions", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // API endpoint for form field validation
  app.post("/api/validate", async (req, res) => {
    try {
      const { field, value, rules } = req.body;
      
      if (!field || value === undefined || !rules) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      const validationResult = await storage.validateField(field, value, rules);
      res.json(validationResult);
    } catch (error) {
      res.status(500).json({ message: "Validation failed", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Package information
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch packages" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
